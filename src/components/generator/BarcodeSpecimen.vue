<script setup lang="ts">
import { ref } from 'vue';
import type { BarcodeFormat, GeneratorOptions } from '@/types/barcode';
import CropMarks from '@/components/ui/CropMarks.vue';
import TechnicalLabel from '@/components/ui/TechnicalLabel.vue';
import IndustrialButton from '@/components/ui/IndustrialButton.vue';
import MeasurementRuler from '@/components/ui/MeasurementRuler.vue';
import { audioService } from '@/services/audio';

interface Props {
  format: BarcodeFormat;
  value: string;
  error?: string | null;
  dimensions: { width: number; height: number };
  colorScheme: GeneratorOptions['colorScheme'];
}

const props = defineProps<Props>();

const emit = defineEmits<{
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
  <div class="bg-scanr-panel border-2 border-scanr-border shadow-[6px_6px_0px_0px_rgba(43,47,61,0.7)] p-5 sm:p-6 space-y-6 font-mono relative">
    
    <CropMarks size="lg" color="border-scanr-white/30" />

    <!-- Specimen Sheet Header -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-scanr-border pb-4">
      <div class="space-y-0.5">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 bg-scanr-yellow inline-block"></span>
          <span class="font-bold text-xs uppercase tracking-widest text-scanr-white">
            GENERATED SPECIMEN SHEET
          </span>
        </div>
        <div class="text-[10px] text-scanr-muted">
          SYMBOLOGY: <span class="text-scanr-yellow font-bold">{{ format }}</span> // SPEC-{{ format }}-{{ dimensions.width }}PX
        </div>
      </div>

      <TechnicalLabel :code="format" label="VECTOR SPECIMEN" variant="accent" size="xs" />
    </div>

    <!-- Error State Overlay (if invalid value) -->
    <div
      v-if="error"
      class="p-6 bg-scanr-red/10 border-2 border-scanr-red text-center space-y-3 relative my-4"
    >
      <CropMarks size="sm" color="border-scanr-red" />
      <div class="w-10 h-10 mx-auto border-2 border-scanr-red flex items-center justify-center text-scanr-red font-bold">
        !
      </div>
      <div class="space-y-1">
        <h4 class="font-bold text-sm text-scanr-red uppercase tracking-wider">
          INVALID ENCODING SPECIFICATION
        </h4>
        <p class="text-xs text-scanr-white max-w-sm mx-auto font-sans">
          {{ error }}
        </p>
      </div>
      <div class="text-[10px] text-scanr-dim">
        CORRECT VALUE PARAMETERS ABOVE TO REGENERATE OPTICAL SPECIMEN
      </div>
    </div>

    <!-- Active Barcode Specimen Canvas Area -->
    <div
      v-show="!error"
      class="relative bg-scanr-black border border-scanr-border p-4 sm:p-8 flex flex-col items-center justify-center overflow-x-auto min-h-[220px]"
    >
      <!-- Subtle measurement grid behind barcode -->
      <div class="absolute inset-0 tech-grid-bg opacity-20 pointer-events-none"></div>

      <!-- Top Measurement Rulers -->
      <div class="w-full max-w-lg mb-3">
        <MeasurementRuler orientation="horizontal" :ticks="24" />
      </div>

      <!-- Canvas Element -->
      <div class="relative z-10 p-4 border border-scanr-border/60 bg-white/5 backdrop-blur-sm max-w-full">
        <canvas ref="canvasRef" class="max-w-full h-auto object-contain block mx-auto"></canvas>
      </div>

      <!-- Bottom Measurement Ticks -->
      <div class="w-full max-w-lg mt-3">
        <MeasurementRuler orientation="horizontal" :ticks="24" />
      </div>
    </div>

    <!-- Technical Specimen Metadata Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] bg-scanr-dark p-3 border border-scanr-border">
      <div class="space-y-0.5">
        <span class="text-scanr-dim uppercase">FORMAT:</span>
        <div class="text-scanr-white font-bold truncate">{{ format }}</div>
      </div>
      <div class="space-y-0.5">
        <span class="text-scanr-dim uppercase">PIXELS (WxH):</span>
        <div class="text-scanr-yellow font-bold">{{ dimensions.width }} x {{ dimensions.height }}</div>
      </div>
      <div class="space-y-0.5">
        <span class="text-scanr-dim uppercase">COLOR SCHEME:</span>
        <div class="text-scanr-cyan font-bold uppercase">{{ colorScheme }}</div>
      </div>
      <div class="space-y-0.5">
        <span class="text-scanr-dim uppercase">STATUS:</span>
        <div class="text-scanr-green font-bold uppercase">{{ error ? 'ERROR' : 'VALIDATED' }}</div>
      </div>
    </div>

    <!-- Export Action Buttons -->
    <div class="space-y-2.5 pt-2 border-t border-scanr-border">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <!-- SVG Download -->
        <IndustrialButton
          @click="$emit('downloadSvg')"
          variant="acid"
          size="md"
          :disabled="Boolean(error)"
          block
          title="Download vector SVG for precision printing"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>DOWNLOAD SVG</span>
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
            <path stroke-linecap="square" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>DOWNLOAD PNG</span>
        </IndustrialButton>

        <!-- PNG with Specimen Frame -->
        <IndustrialButton
          @click="$emit('downloadPng', true)"
          variant="secondary"
          size="md"
          :disabled="Boolean(error)"
          block
          title="Export with industrial specimen datasheet frame"
        >
          <svg class="w-4 h-4 text-scanr-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>SPECIMEN CARD</span>
        </IndustrialButton>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <IndustrialButton
          @click="copyValue"
          variant="secondary"
          size="sm"
          block
        >
          <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <svg v-else class="w-3.5 h-3.5 text-scanr-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ copied ? 'COPIED' : 'COPY VALUE' }}</span>
        </IndustrialButton>

        <IndustrialButton
          @click="$emit('reset')"
          variant="secondary"
          size="sm"
          block
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>RESET SPECIMEN</span>
        </IndustrialButton>
      </div>
    </div>

  </div>
</template>
