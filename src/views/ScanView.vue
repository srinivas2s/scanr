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
import TechnicalLabel from '@/components/ui/TechnicalLabel.vue';
import IndustrialButton from '@/components/ui/IndustrialButton.vue';
import CropMarks from '@/components/ui/CropMarks.vue';

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
      errorMessage.value = 'NO BARCODE DETECTED: Unable to resolve recognizable barcode or QR matrix in this image specimen.';
    } else {
      errorMessage.value = error.message || 'IMAGE DECODING FAILED';
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
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
    
    <!-- Page Header Specimen Strip -->
    <div class="border-b-2 border-scanr-white pb-6 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-scanr-muted">
        <div class="flex items-center gap-2">
          <TechnicalLabel code="01" label="OPTICAL SUBSYSTEM" variant="hazard" />
          <span class="text-scanr-dim">///</span>
          <span class="text-scanr-yellow">DUAL-ENGINE HIGH-SPEED RECOGNITION</span>
        </div>
        <div class="text-[11px] text-scanr-dim">
          <span>LAT: BROWSER_CORE</span>
          <span class="mx-2">•</span>
          <span class="text-scanr-green">LOCAL DECODE ONLY</span>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 class="font-display font-black text-4xl sm:text-6xl text-scanr-white tracking-tight uppercase">
            OPTICAL SCANNER
          </h1>
          <p class="font-mono text-sm sm:text-base text-scanr-muted mt-1 max-w-2xl">
            Acquire 1D retail barcodes and 2D high-density data matrices via real-time camera stream or still specimen images.
          </p>
        </div>

        <!-- Mode Toggle Tabs -->
        <div class="flex items-center p-1 bg-scanr-dark border border-scanr-border font-mono text-xs font-bold">
          <button
            @click="switchInputMode('camera')"
            type="button"
            class="px-4 py-2 uppercase transition-all duration-150 flex items-center gap-2"
            :class="[
              activeInputMode === 'camera'
                ? 'bg-scanr-yellow text-scanr-black border border-scanr-yellow shadow-sm'
                : 'text-scanr-muted hover:text-scanr-white'
            ]"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="square" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>CAMERA STREAM</span>
          </button>

          <button
            @click="switchInputMode('image')"
            type="button"
            class="px-4 py-2 uppercase transition-all duration-150 flex items-center gap-2"
            :class="[
              activeInputMode === 'image'
                ? 'bg-scanr-yellow text-scanr-black border border-scanr-yellow shadow-sm'
                : 'text-scanr-muted hover:text-scanr-white'
            ]"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="square" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>IMAGE SPECIMEN</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Error Banner (if any) -->
    <div
      v-if="cameraError || errorMessage"
      class="p-4 bg-scanr-red/10 border-2 border-scanr-red text-scanr-white font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative"
    >
      <CropMarks size="sm" color="border-scanr-red" />
      <div class="flex items-center gap-3">
        <span class="w-3 h-3 bg-scanr-red inline-block"></span>
        <div class="space-y-0.5">
          <div class="font-bold uppercase tracking-wider text-scanr-red">
            {{ permissionDenied ? 'CAMERA ACCESS RESTRICTED' : 'OPTICAL ACQUISITION NOTICE' }}
          </div>
          <p class="text-scanr-white/90">
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
          USE IMAGE SPECIMEN
        </IndustrialButton>

        <IndustrialButton
          @click="handleToggleStream"
          variant="secondary"
          size="sm"
        >
          RETRY
        </IndustrialButton>
      </div>
    </div>

    <!-- Main Workspace Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left / Main Column: Scanner Frame & Controls -->
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

      <!-- Right Column: Optical Engine Specifications & Log Buffer -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- Specifications Box -->
        <div class="p-5 bg-scanr-panel border border-scanr-border space-y-4 font-mono text-xs relative">
          <CropMarks size="sm" color="border-scanr-border" />
          
          <div class="flex items-center justify-between border-b border-scanr-border pb-2">
            <span class="text-xs uppercase font-bold text-scanr-white tracking-widest">
              ENGINE SPECIFICATION
            </span>
            <TechnicalLabel code="V1.0" label="LOCAL" variant="accent" size="xs" />
          </div>

          <div class="space-y-2.5 text-scanr-muted text-[11px]">
            <div class="flex items-center justify-between py-1 border-b border-scanr-border/40">
              <span>NATIVE ACCELERATION</span>
              <span class="text-scanr-green font-bold">{{ stats.engine === 'NATIVE_OPTICAL' ? 'ACTIVE' : 'FALLBACK (ZXING)' }}</span>
            </div>
            <div class="flex items-center justify-between py-1 border-b border-scanr-border/40">
              <span>SAMPLING FREQUENCY</span>
              <span class="text-scanr-white">~15 OPS / SEC</span>
            </div>
            <div class="flex items-center justify-between py-1 border-b border-scanr-border/40">
              <span>HAPTIC / AUDIO PULSE</span>
              <span :class="isMuted ? 'text-scanr-dim' : 'text-scanr-yellow'">{{ isMuted ? 'MUTED' : 'SYNTHESIZED' }}</span>
            </div>
            <div class="flex items-center justify-between py-1 border-b border-scanr-border/40">
              <span>COLOR / RGB LUMA</span>
              <span class="text-scanr-cyan">HYBRID BINARIZER</span>
            </div>
          </div>

          <!-- Symbology matrix badges -->
          <div class="pt-2">
            <div class="text-[10px] uppercase tracking-wider text-scanr-dim mb-2 font-bold">
              OPTIMIZED SYMBOLOGY MATRIX:
            </div>
            <div class="flex flex-wrap gap-1 font-mono text-[9px]">
              <span class="px-1.5 py-0.5 bg-scanr-dark border border-scanr-border text-scanr-white">EAN-13</span>
              <span class="px-1.5 py-0.5 bg-scanr-dark border border-scanr-border text-scanr-white">UPC-A</span>
              <span class="px-1.5 py-0.5 bg-scanr-dark border border-scanr-border text-scanr-white">CODE 128</span>
              <span class="px-1.5 py-0.5 bg-scanr-dark border border-scanr-border text-scanr-white">QR CODE</span>
              <span class="px-1.5 py-0.5 bg-scanr-dark border border-scanr-border text-scanr-white">DATA MATRIX</span>
              <span class="px-1.5 py-0.5 bg-scanr-dark border border-scanr-border text-scanr-white">PDF417</span>
              <span class="px-1.5 py-0.5 bg-scanr-dark border border-scanr-border text-scanr-white">AZTEC</span>
            </div>
          </div>
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
