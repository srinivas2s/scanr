<script setup lang="ts">
import { ref } from 'vue';
import CropMarks from '@/components/ui/CropMarks.vue';
import TechnicalLabel from '@/components/ui/TechnicalLabel.vue';
import type { ScannerStats } from '@/types/barcode';

interface Props {
  isStreaming: boolean;
  isScanning: boolean;
  stats: ScannerStats;
  torchSupported: boolean;
  torchActive: boolean;
  cameraCount: number;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'toggleTorch'): void;
  (e: 'switchCamera'): void;
}>();

const videoRef = ref<HTMLVideoElement | null>(null);

defineExpose({
  videoRef,
});
</script>

<template>
  <div class="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-scanr-black border-2 border-scanr-border overflow-hidden select-none flex items-center justify-center group shadow-[0_0_30px_rgba(0,0,0,0.8)]">
    
    <!-- Background Technical Grid & Coordinate Ticks -->
    <div class="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none"></div>

    <!-- Video Element -->
    <video
      ref="videoRef"
      autoplay
      playsinline
      muted
      class="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300"
      :class="isStreaming ? 'opacity-100' : 'opacity-0'"
    ></video>

    <!-- Standby / Idle State Display -->
    <div
      v-if="!isStreaming"
      class="relative z-10 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md"
    >
      <div class="w-16 h-16 border-2 border-dashed border-scanr-dim flex items-center justify-center text-scanr-muted relative">
        <CropMarks size="sm" color="border-scanr-yellow" />
        <svg class="w-8 h-8 text-scanr-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="square" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>

      <div class="space-y-1">
        <h3 class="font-mono text-sm font-bold uppercase tracking-widest text-scanr-white">
          OPTICAL SENSOR STANDBY
        </h3>
        <p class="font-sans text-xs text-scanr-muted max-w-xs">
          Click "START SCANNING" below to initialize your browser camera feed and begin optical frame analysis.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <TechnicalLabel code="ENG-01" label="READY" variant="default" />
        <TechnicalLabel code="LOCAL" label="ZERO-TELEMETRY" variant="accent" />
      </div>
    </div>

    <!-- Active Optical Viewfinder Elements -->
    <template v-if="isStreaming">
      
      <!-- High-Contrast Targeting Reticle -->
      <div class="absolute inset-8 sm:inset-14 md:inset-16 pointer-events-none z-10 flex items-center justify-center">
        <!-- Target Box -->
        <div class="relative w-full h-full max-w-md max-h-72 border border-scanr-white/20">
          <CropMarks size="lg" color="border-scanr-yellow" showCenter />

          <!-- High-Visibility Corner Accents -->
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-scanr-black/80 border border-scanr-border font-mono text-[9px] text-scanr-yellow tracking-widest uppercase">
            OPTICAL ALIGNMENT TARGET
          </div>

          <!-- Animated Scanning Laser Line -->
          <div
            v-if="isScanning"
            class="absolute left-0 right-0 h-1 laser-line animate-laser pointer-events-none"
          ></div>
        </div>
      </div>

      <!-- Top Viewport Telemetry Bar -->
      <div class="absolute top-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-none text-[10px] font-mono">
        <div class="flex items-center gap-1.5 bg-scanr-black/80 backdrop-blur-sm px-2.5 py-1 border border-scanr-border text-scanr-white">
          <span class="w-2 h-2 rounded-full bg-scanr-green animate-ping"></span>
          <span class="font-bold">STREAM ACTIVE</span>
          <span class="text-scanr-muted">// {{ stats.resolution }}</span>
        </div>

        <div class="flex items-center gap-1.5 bg-scanr-black/80 backdrop-blur-sm px-2.5 py-1 border border-scanr-border text-scanr-yellow font-bold">
          <span>FPS: {{ stats.fps || '30' }}</span>
          <span class="text-scanr-dim">|</span>
          <span class="text-scanr-cyan">{{ stats.engine }}</span>
        </div>
      </div>

      <!-- Viewport Floating Quick Action Controls (Torch & Switch) -->
      <div class="absolute bottom-3 right-3 z-20 flex items-center gap-2">
        <!-- Flashlight / Torch Toggle -->
        <button
          v-if="torchSupported"
          @click="$emit('toggleTorch')"
          type="button"
          class="p-2.5 font-mono text-xs font-bold border transition-all duration-150 backdrop-blur-sm shadow-md"
          :class="[
            torchActive
              ? 'bg-scanr-yellow text-scanr-black border-scanr-yellow shadow-[0_0_12px_rgba(228,255,26,0.8)]'
              : 'bg-scanr-black/80 text-scanr-white border-scanr-border hover:border-scanr-white'
          ]"
          title="Toggle Flashlight / Torch"
          aria-label="Toggle Flashlight"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>

        <!-- Camera Switcher -->
        <button
          v-if="cameraCount > 1"
          @click="$emit('switchCamera')"
          type="button"
          class="p-2.5 font-mono text-xs font-bold bg-scanr-black/80 text-scanr-white border border-scanr-border hover:border-scanr-white hover:text-scanr-yellow transition-all duration-150 backdrop-blur-sm shadow-md"
          title="Switch Optical Sensor"
          aria-label="Switch Camera"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

    </template>

    <!-- Outer Viewport Crop Marks -->
    <CropMarks size="lg" color="border-scanr-border" />
  </div>
</template>
