<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useCamera } from '@/composables/useCamera';
import { useScanner } from '@/composables/useScanner';
import { audioService } from '@/services/audio';

import ScannerViewport from '@/components/scanner/ScannerViewport.vue';
import ScannerControls from '@/components/scanner/ScannerControls.vue';
import ImageDropzone from '@/components/scanner/ImageDropzone.vue';
import ScanResultCard from '@/components/scanner/ScanResultCard.vue';
import ScanHistory from '@/components/scanner/ScanHistory.vue';
import IndustrialButton from '@/components/ui/IndustrialButton.vue';

const activeInputMode = ref<'camera' | 'image'>('camera');
const errorMessage = ref<string | null>(null);
const isMuted = ref(audioService.isSoundMuted());

const {
  videoElement,
  devices,
  selectedDeviceId,
  isStreaming,
  error: cameraError,
  permissionDenied,
  torchSupported,
  torchActive,
  startCamera,
  switchCamera,
  toggleTorch,
  stopCamera,
} = useCamera();

const {
  isScanning,
  isAnalyzingImage,
  currentResult,
  scanHistory,
  stats,
  startScanning,
  stopScanning,
  scanAgain,
  scanImage,
  clearHistory,
} = useScanner();

const viewportRef = ref<InstanceType<typeof ScannerViewport> | null>(null);

const handleToggleStream = async () => {
  if (isStreaming.value) {
    stopScanning();
    stopCamera();
  } else {
    errorMessage.value = null;
    await nextTick();
    if (viewportRef.value?.videoRef) {
      videoElement.value = viewportRef.value.videoRef;
    }
    const started = await startCamera(selectedDeviceId.value || undefined);
    if (started && videoElement.value) {
      startScanning(videoElement.value);
    }
  }
};

const handleSelectDevice = async (deviceId: string) => {
  selectedDeviceId.value = deviceId;
  stopScanning();
  if (viewportRef.value?.videoRef) {
    videoElement.value = viewportRef.value.videoRef;
  }
  const started = await startCamera(deviceId);
  if (started && videoElement.value) {
    startScanning(videoElement.value);
  }
};

const handleScanAgain = () => {
  errorMessage.value = null;
  if (activeInputMode.value === 'camera') {
    if (isStreaming.value && videoElement.value) {
      scanAgain(videoElement.value);
    } else {
      handleToggleStream();
    }
  } else {
    currentResult.value = null;
  }
};

const handleImageSelected = async (file: File) => {
  errorMessage.value = null;
  try {
    await scanImage(file);
  } catch (err: unknown) {
    const error = err as Error;
    if (error.message === 'NO_BARCODE_DETECTED') {
      errorMessage.value = 'No barcode detected in this image. Please ensure the code is well-lit and in focus.';
    } else {
      errorMessage.value = error.message || 'Image decoding failed';
    }
  }
};

const toggleMuteAudio = () => {
  const next = !isMuted.value;
  isMuted.value = next;
  audioService.setMuted(next);
};

const switchInputMode = (mode: 'camera' | 'image') => {
  activeInputMode.value = mode;
  errorMessage.value = null;
  if (mode === 'image' && isStreaming.value) {
    stopScanning();
    stopCamera();
  }
};

onMounted(async () => {
  await nextTick();
  if (viewportRef.value?.videoRef) {
    videoElement.value = viewportRef.value.videoRef;
  }
});

onUnmounted(() => {
  stopScanning();
  stopCamera();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
    
    <!-- Page Header & Mode Switcher -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-200/80 pb-6">
      <div class="space-y-1">
        <h1 class="font-display font-black text-3xl sm:text-4xl text-slate-900">
          Barcode Scanner
        </h1>
        <p class="text-sm text-slate-600 max-w-xl font-sans font-medium">
          Scan QR codes, retail EAN/UPC, logistics Code 128, and 2D matrices locally in your browser.
        </p>
      </div>

      <!-- Mode Toggle Switcher with Clay Inset Well -->
      <div class="flex items-center p-1.5 rounded-2xl clay-inset self-start sm:self-auto">
        <button
          @click="switchInputMode('camera')"
          type="button"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-2"
          :class="[
            activeInputMode === 'camera'
              ? 'clay-btn-amber text-slate-950 font-bold'
              : 'text-slate-600 hover:text-slate-950'
          ]"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Camera Stream</span>
        </button>

        <button
          @click="switchInputMode('image')"
          type="button"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-2"
          :class="[
            activeInputMode === 'image'
              ? 'clay-btn-amber text-slate-950 font-bold'
              : 'text-slate-600 hover:text-slate-950'
          ]"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Upload Image</span>
        </button>
      </div>
    </div>

    <!-- Error / Notice Banner (if any) -->
    <div
      v-if="cameraError || errorMessage"
      class="p-5 rounded-2xl clay-card border-2 border-red-200 bg-red-50/70 text-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
    >
      <div class="flex items-center gap-3">
        <span class="w-3 h-3 rounded-full bg-red-600 flex-shrink-0 animate-pulse"></span>
        <div>
          <div class="font-bold text-red-800">
            {{ permissionDenied ? 'Camera Access Needed' : 'Notice' }}
          </div>
          <p class="text-slate-700 leading-relaxed font-medium">
            {{ cameraError || errorMessage }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-shrink-0">
        <IndustrialButton
          v-if="permissionDenied"
          @click="switchInputMode('image')"
          variant="acid"
          size="sm"
        >
          Use Image Upload
        </IndustrialButton>

        <IndustrialButton
          @click="handleToggleStream"
          variant="secondary"
          size="sm"
        >
          Retry
        </IndustrialButton>
      </div>
    </div>

    <!-- Main Workspace Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left / Main Column: Scanner Frame & Controls & Result -->
      <div class="lg:col-span-8 space-y-6">
        
        <!-- Mode 1: Live Camera Viewport -->
        <div v-show="activeInputMode === 'camera'" class="space-y-4">
          <ScannerViewport
            ref="viewportRef"
            :isStreaming="isStreaming"
            :isScanning="isScanning"
            :stats="stats"
            :torchSupported="torchSupported"
            :torchActive="torchActive"
            :cameraCount="devices.length"
            @toggleTorch="toggleTorch"
            @switchCamera="switchCamera"
          />

          <ScannerControls
            :isStreaming="isStreaming"
            :isScanning="isScanning"
            :devices="devices"
            :selectedDeviceId="selectedDeviceId"
            :torchSupported="torchSupported"
            :torchActive="torchActive"
            :isMuted="isMuted"
            @toggleStream="handleToggleStream"
            @selectDevice="handleSelectDevice"
            @toggleTorch="toggleTorch"
            @toggleMute="toggleMuteAudio"
          />
        </div>

        <!-- Mode 2: Static Image Specimen Dropzone -->
        <div v-show="activeInputMode === 'image'" class="space-y-4">
          <ImageDropzone
            :isAnalyzing="isAnalyzingImage"
            @fileSelected="handleImageSelected"
          />
        </div>

        <!-- Scan Result Card Display -->
        <div v-if="currentResult" class="pt-2">
          <ScanResultCard
            :result="currentResult"
            @scanAgain="handleScanAgain"
          />
        </div>

      </div>

      <!-- Right Column: Quick Tips & Scan History -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- Quick Tips Card -->
        <div class="p-6 rounded-3xl clay-card space-y-3 text-xs">
          <div class="font-bold text-slate-900 text-sm">
            Scanning Tips
          </div>
          <ul class="space-y-2.5 text-slate-600 leading-relaxed font-medium">
            <li class="flex items-start gap-2">
              <span class="text-amber-500 font-bold">•</span>
              <span>Position the barcode in the center of the camera frame.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-500 font-bold">•</span>
              <span>Ensure adequate lighting or toggle the flash torch in low light.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-amber-500 font-bold">•</span>
              <span>Paste screenshots directly with <kbd class="px-2 py-0.5 rounded-md clay-pill font-mono text-[10px] text-slate-800 font-bold">Ctrl+V</kbd>.</span>
            </li>
          </ul>
        </div>

        <!-- Scan History Log Buffer -->
        <ScanHistory
          :history="scanHistory"
          @selectResult="(res) => { currentResult = res; }"
          @clearHistory="clearHistory"
        />

      </div>

    </div>

  </div>
</template>
