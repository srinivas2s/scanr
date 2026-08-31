import { ref, onUnmounted } from 'vue';
import type { CameraDeviceInfo } from '@/types/barcode';

export function useCamera() {
  const videoElement = ref<HTMLVideoElement | null>(null);
  const mediaStream = ref<MediaStream | null>(null);
  const devices = ref<CameraDeviceInfo[]>([]);
  const selectedDeviceId = ref<string>('');
  const isStreaming = ref(false);
  const error = ref<string | null>(null);
  const permissionDenied = ref(false);
  const torchSupported = ref(false);
  const torchActive = ref(false);

  /**
   * Enumerate available video input devices
   */
  const updateDeviceList = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');

      devices.value = videoInputs.map((d, index) => ({
        deviceId: d.deviceId,
        label: d.label || `OPTICAL SENSOR ${index + 1}`,
      }));
    } catch {
      // Ignore enumeration errors
    }
  };

  /**
   * Start camera stream with rear camera preferred
   */
  const startCamera = async (preferredDeviceId?: string) => {
    stopCamera();
    error.value = null;
    permissionDenied.value = false;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      error.value = 'Camera API is not supported in this browser environment';
      return false;
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: preferredDeviceId
          ? { deviceId: { exact: preferredDeviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
          : {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStream.value = stream;

      if (videoElement.value) {
        videoElement.value.srcObject = stream;
        await videoElement.value.play();
      }

      isStreaming.value = true;

      // Check active track & torch capability
      const track = stream.getVideoTracks()[0];
      if (track) {
        const settings = track.getSettings();
        if (settings.deviceId) {
          selectedDeviceId.value = settings.deviceId;
        }

        // Check torch capabilities
        const capabilities = track.getCapabilities ? (track.getCapabilities() as { torch?: boolean }) : {};
        torchSupported.value = Boolean(capabilities && capabilities.torch);
      }

      await updateDeviceList();
      return true;
    } catch (err: unknown) {
      const e = err as { name?: string; message?: string };
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        permissionDenied.value = true;
        error.value = 'CAMERA ACCESS REQUIRED: Permission was denied by user or browser.';
      } else if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
        error.value = 'NO CAMERA DETECTED: No compatible video input hardware found.';
      } else {
        error.value = `Camera error: ${e.message || 'Unable to access video feed'}`;
      }
      isStreaming.value = false;
      return false;
    }
  };

  /**
   * Switch to next available camera
   */
  const switchCamera = async () => {
    if (devices.value.length < 2) return;
    const currentIndex = devices.value.findIndex((d) => d.deviceId === selectedDeviceId.value);
    const nextIndex = (currentIndex + 1) % devices.value.length;
    const nextDevice = devices.value[nextIndex];
    if (nextDevice) {
      selectedDeviceId.value = nextDevice.deviceId;
      await startCamera(nextDevice.deviceId);
    }
  };

  /**
   * Toggle Torch / Flashlight if supported
   */
  const toggleTorch = async () => {
    if (!mediaStream.value || !torchSupported.value) return;
    const track = mediaStream.value.getVideoTracks()[0];
    if (track) {
      try {
        const nextState = !torchActive.value;
        // @ts-expect-error - advanced constraint torch
        await track.applyConstraints({ advanced: [{ torch: nextState }] });
        torchActive.value = nextState;
      } catch {
        torchSupported.value = false;
      }
    }
  };

  /**
   * Stop all camera tracks and release hardware
   */
  const stopCamera = () => {
    if (mediaStream.value) {
      mediaStream.value.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Ignore
        }
      });
      mediaStream.value = null;
    }
    if (videoElement.value) {
      videoElement.value.srcObject = null;
    }
    isStreaming.value = false;
    torchActive.value = false;
  };

  onUnmounted(() => {
    stopCamera();
  });

  return {
    videoElement,
    mediaStream,
    devices,
    selectedDeviceId,
    isStreaming,
    error,
    permissionDenied,
    torchSupported,
    torchActive,
    startCamera,
    switchCamera,
    toggleTorch,
    stopCamera,
  };
}
