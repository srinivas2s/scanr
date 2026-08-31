import { ref, onUnmounted } from 'vue';
import type { ScanResult, ScannerStats } from '@/types/barcode';
import { scannerService } from '@/services/scanner';
import { audioService } from '@/services/audio';

export function useScanner() {
  const isScanning = ref(false);
  const isAnalyzingImage = ref(false);
  const currentResult = ref<ScanResult | null>(null);
  const scanHistory = ref<ScanResult[]>([]);
  const lastScanTime = ref(0);
  const stats = ref<ScannerStats>({
    fps: 0,
    resolution: '0x0',
    activeCamera: 'AUTO',
    engine: scannerService.isNativeSupported() ? 'NATIVE_OPTICAL' : 'ZXING_FALLBACK',
    torchSupported: false,
    torchActive: false,
  });

  let animationFrameId: number | null = null;
  let frameCount = 0;
  let lastFpsUpdate = performance.now();
  let lastDetectionAttempt = 0;

  /**
   * Continuous optical inspection loop
   */
  const processFrame = async (video: HTMLVideoElement) => {
    if (!isScanning.value || currentResult.value) {
      return;
    }

    const now = performance.now();
    frameCount++;

    if (now - lastFpsUpdate >= 1000) {
      stats.value.fps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
      frameCount = 0;
      lastFpsUpdate = now;
      if (video.videoWidth) {
        stats.value.resolution = `${video.videoWidth}x${video.videoHeight}`;
      }
    }

    // Inspect frame every 80ms (approx 12-15 detections/sec) for optimal balance of responsiveness and battery efficiency
    if (now - lastDetectionAttempt > 80) {
      lastDetectionAttempt = now;
      try {
        const result = await scannerService.scanVideoFrame(video);
        if (result) {
          // Lock on and trigger audio feedback
          currentResult.value = result;
          audioService.playScanSuccess();
          scanHistory.value.unshift(result);
          if (scanHistory.value.length > 20) {
            scanHistory.value.pop();
          }
          isScanning.value = false;
          return;
        }
      } catch {
        // Continue scanning next frame
      }
    }

    if (isScanning.value && !currentResult.value) {
      animationFrameId = requestAnimationFrame(() => processFrame(video));
    }
  };

  /**
   * Start live video scanning
   */
  const startScanning = (video: HTMLVideoElement) => {
    if (isScanning.value) return;
    currentResult.value = null;
    isScanning.value = true;
    frameCount = 0;
    lastFpsUpdate = performance.now();
    animationFrameId = requestAnimationFrame(() => processFrame(video));
  };

  /**
   * Stop scanning
   */
  const stopScanning = () => {
    isScanning.value = false;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  };

  /**
   * Reset result to scan again
   */
  const scanAgain = (video?: HTMLVideoElement | null) => {
    currentResult.value = null;
    if (video) {
      startScanning(video);
    }
  };

  /**
   * Decode an uploaded or pasted image file
   */
  const scanImage = async (file: File | Blob): Promise<ScanResult> => {
    isAnalyzingImage.value = true;
    try {
      const result = await scannerService.scanImageFile(file);
      currentResult.value = result;
      audioService.playScanSuccess();
      scanHistory.value.unshift(result);
      if (scanHistory.value.length > 20) {
        scanHistory.value.pop();
      }
      return result;
    } catch (err: unknown) {
      audioService.playError();
      throw err;
    } finally {
      isAnalyzingImage.value = false;
    }
  };

  /**
   * Clear scan history
   */
  const clearHistory = () => {
    scanHistory.value = [];
  };

  onUnmounted(() => {
    stopScanning();
  });

  return {
    isScanning,
    isAnalyzingImage,
    currentResult,
    scanHistory,
    lastScanTime,
    stats,
    startScanning,
    stopScanning,
    scanAgain,
    scanImage,
    clearHistory,
  };
}
