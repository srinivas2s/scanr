<script setup lang="ts">
import { ref } from 'vue';
import type { BarcodeFormat, GeneratorOptions } from '@/types/barcode';
import IndustrialButton from '@/components/ui/IndustrialButton.vue';
import { audioService } from '@/services/audio';

interface Props {
  format: BarcodeFormat;
  value: string;
  error?: string | null;
  dimensions: { width: number; height: number };
  colorScheme: GeneratorOptions['colorScheme'];
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'downloadSvg'): void;
  (e: 'downloadPng', withFrame: boolean): void;
  (e: 'reset'): void;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const copied = ref(false);

const copyValue = async () => {
  try {
    await navigator.clipboard.writeText(props.value);
    copied.value = true;
    audioService.playClick();
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    // Ignore clipboard error
  }
};

defineExpose({
  canvasRef,
});
</script>

<template>
  <div class="rounded-3xl clay-card p-6 sm:p-7 space-y-6 font-sans">
    
    <!-- Specimen Sheet Header -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
      <div class="space-y-0.5">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <h2 class="font-bold text-base text-slate-900">
            Live Preview
          </h2>
        </div>
        <div class="text-xs text-slate-500 font-mono font-medium">
          {{ format }} • {{ dimensions.width }} × {{ dimensions.height }}px
        </div>
      </div>

      <span class="px-3 py-1 clay-pill text-xs font-mono text-slate-700 font-bold">
        Vector Ready
      </span>
    </div>

    <!-- Error State Overlay (if invalid value) -->
    <div
      v-if="error"
      class="p-6 rounded-2xl clay-card border-2 border-red-200 bg-red-50/80 text-center space-y-2 my-4"
    >
      <div class="w-10 h-10 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
        !
      </div>
      <h4 class="font-bold text-sm text-red-700">
        Cannot Render Barcode
      </h4>
      <p class="text-xs text-slate-700 max-w-sm mx-auto font-medium">
        {{ error }}
      </p>
    </div>

    <!-- Active Barcode Canvas Area with Clay Inset Well -->
    <div
      v-show="!error"
      class="relative clay-inset rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center min-h-[220px]"
    >
      <!-- Subtle Grid -->
      <div class="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none"></div>

      <!-- Canvas Container -->
      <div class="relative z-10 p-4 rounded-2xl clay-card max-w-full overflow-x-auto shadow-md">
        <canvas ref="canvasRef" class="max-w-full h-auto object-contain block mx-auto"></canvas>
      </div>
    </div>

    <!-- Specimen Metadata Grid with Clay Inset -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
      <div class="p-3.5 rounded-2xl clay-inset space-y-0.5">
        <span class="text-slate-400 text-[10px] uppercase font-bold">Format</span>
        <div class="text-slate-900 font-bold truncate">{{ format }}</div>
      </div>
      <div class="p-3.5 rounded-2xl clay-inset space-y-0.5">
        <span class="text-slate-400 text-[10px] uppercase font-bold">Size (WxH)</span>
        <div class="text-amber-800 font-bold">{{ dimensions.width }} × {{ dimensions.height }}px</div>
      </div>
      <div class="p-3.5 rounded-2xl clay-inset space-y-0.5">
        <span class="text-slate-400 text-[10px] uppercase font-bold">Color</span>
        <div class="text-sky-800 font-bold uppercase">{{ colorScheme }}</div>
      </div>
      <div class="p-3.5 rounded-2xl clay-inset space-y-0.5">
        <span class="text-slate-400 text-[10px] uppercase font-bold">Status</span>
        <div class="text-emerald-700 font-bold uppercase">{{ error ? 'Error' : 'Valid' }}</div>
      </div>
    </div>

    <!-- Export Action Buttons -->
    <div class="space-y-3.5 pt-2 border-t border-slate-100">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <!-- SVG Download -->
        <IndustrialButton
          @click="$emit('downloadSvg')"
          variant="acid"
          size="md"
          :disabled="Boolean(error)"
          block
          title="Download vector SVG for crisp infinite scaling"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Download SVG</span>
        </IndustrialButton>

        <!-- PNG Download (Raw) -->
        <IndustrialButton
          @click="$emit('downloadPng', false)"
          variant="primary"
          size="md"
          :disabled="Boolean(error)"
          block
          title="Download high-resolution PNG image"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Download PNG</span>
        </IndustrialButton>

        <!-- PNG with Specimen Frame -->
        <IndustrialButton
          @click="$emit('downloadPng', true)"
          variant="secondary"
          size="md"
          :disabled="Boolean(error)"
          block
          title="Export formatted specimen datasheet card"
        >
          <svg class="w-4 h-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Specimen Card</span>
        </IndustrialButton>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <IndustrialButton
          @click="copyValue"
          variant="secondary"
          size="sm"
          block
        >
          <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <svg v-else class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ copied ? 'Copied' : 'Copy Value' }}</span>
        </IndustrialButton>

        <IndustrialButton
          @click="$emit('reset')"
          variant="secondary"
          size="sm"
          block
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reset</span>
        </IndustrialButton>
      </div>
    </div>

  </div>
</template>
