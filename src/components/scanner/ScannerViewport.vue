<script setup lang="ts">
import { ref } from 'vue';
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

defineEmits<{
  (e: 'toggleTorch'): void;
  (e: 'switchCamera'): void;
}>();

const videoRef = ref<HTMLVideoElement | null>(null);

defineExpose({
  videoRef,
});
</script>

<template>
  <div class="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950 rounded-2xl border border-slate-200 overflow-hidden select-none flex items-center justify-center shadow-lg">
    
    <!-- Background Grid -->
    <div class="absolute inset-0 tech-grid-bg opacity-10 pointer-events-none"></div>

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
      class="relative z-10 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-sm"
    >
      <div class="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300">
        <svg class="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>

      <div class="space-y-1">
        <h3 class="font-semibold text-base text-white">
          Camera Inactive
        </h3>
        <p class="text-xs text-slate-400 leading-relaxed">
          Click "Start Camera" below to grant camera permission and begin scanning barcodes.
        </p>
      </div>
    </div>

    <!-- Active Optical Viewfinder Elements -->
    <template v-if="isStreaming">
      
      <!-- Targeting Reticle -->
      <div class="absolute inset-8 sm:inset-14 md:inset-16 pointer-events-none z-10 flex items-center justify-center">
        <div class="relative w-full h-full max-w-md max-h-72 border border-white/30 rounded-xl overflow-hidden backdrop-brightness-105">
          
          <!-- Reticle corner guides -->
          <div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-400 rounded-tl"></div>
          <div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-400 rounded-tr"></div>
          <div class="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-400 rounded-bl"></div>
          <div class="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-400 rounded-br"></div>

          <!-- Animated Scanning Laser Line -->
          <div
            v-if="isScanning"
            class="absolute left-0 right-0 h-0.5 laser-line animate-laser pointer-events-none"
          ></div>
        </div>
      </div>

      <!-- Top Viewport Telemetry Bar -->
      <div class="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none text-xs font-mono">
        <div class="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-slate-800 shadow-sm font-sans font-medium">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs">Live Camera</span>
        </div>

        <div v-if="stats.resolution" class="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-slate-600 text-xs shadow-sm font-mono">
          <span>{{ stats.resolution }}</span>
        </div>
      </div>

      <!-- Viewport Floating Quick Action Controls (Torch & Switch) -->
      <div class="absolute bottom-3 right-3 z-20 flex items-center gap-2">
        <!-- Flashlight / Torch Toggle -->
        <button
          v-if="torchSupported"
          @click="$emit('toggleTorch')"
          type="button"
          class="p-2.5 rounded-xl text-xs font-bold border transition-all duration-150 backdrop-blur-md shadow-md"
          :class="[
            torchActive
              ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-amber-500/30'
              : 'bg-white/90 text-slate-800 border-slate-200 hover:bg-white'
          ]"
          title="Toggle Flashlight / Torch"
          aria-label="Toggle Flashlight"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>

        <!-- Camera Switcher -->
        <button
          v-if="cameraCount > 1"
          @click="$emit('switchCamera')"
          type="button"
          class="p-2.5 rounded-xl text-xs font-bold bg-white/90 text-slate-800 border border-slate-200 hover:bg-white hover:text-amber-600 transition-all duration-150 backdrop-blur-md shadow-md"
          title="Switch Camera"
          aria-label="Switch Camera"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

    </template>
  </div>
</template>
