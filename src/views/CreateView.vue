<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useBarcodeGenerator } from '@/composables/useBarcodeGenerator';
import type { BarcodeFormat } from '@/types/barcode';

import FormatSelector from '@/components/generator/FormatSelector.vue';
import GeneratorForm from '@/components/generator/GeneratorForm.vue';
import BarcodeSpecimen from '@/components/generator/BarcodeSpecimen.vue';

const route = useRoute();

const {
  selectedFormat,
  barcodeValue,
  scale,
  height,
  includeText,
  colorScheme,
  canvasRef,
  error,
  dimensions,
  currentDefinition,
  validationResult,
  presets,
  setFormat,
  applyPreset,
  autoCalculateChecksum,
  renderBarcode,
  downloadSvgFile,
  downloadPngFile,
  resetGenerator,
} = useBarcodeGenerator();

const specimenComponentRef = ref<InstanceType<typeof BarcodeSpecimen> | null>(null);

onMounted(async () => {
  // Check for pre-filled query parameters from scanner
  if (route.query.value && typeof route.query.value === 'string') {
    barcodeValue.value = route.query.value;
  }
  if (route.query.format && typeof route.query.format === 'string') {
    const fmt = route.query.format.toUpperCase() as BarcodeFormat;
    if (fmt && ['CODE128', 'CODE39', 'EAN13', 'EAN8', 'UPCA', 'UPCE', 'QR', 'DATAMATRIX', 'AZTEC', 'PDF417', 'ITF', 'CODABAR'].includes(fmt)) {
      selectedFormat.value = fmt;
    }
  }

  await nextTick();
  if (specimenComponentRef.value?.canvasRef) {
    canvasRef.value = specimenComponentRef.value.canvasRef;
  }
  renderBarcode();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
      <div class="space-y-1">
        <h1 class="font-display font-bold text-3xl sm:text-4xl text-slate-900">
          Barcode Generator
        </h1>
        <p class="text-sm text-slate-600 max-w-xl font-sans">
          Encode URLs, serial numbers, GTINs, and text into vector SVGs and high-resolution PNGs.
        </p>
      </div>

      <div class="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto font-medium">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>Vector SVG & PNG Export</span>
      </div>
    </div>

    <!-- Format Selector Component -->
    <FormatSelector
      :selectedFormat="selectedFormat"
      @selectFormat="setFormat"
    />

    <!-- Main Generator Split Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left Column: Input Form & Settings -->
      <div class="lg:col-span-6 space-y-6">
        <GeneratorForm
          :selectedFormat="selectedFormat"
          :barcodeValue="barcodeValue"
          :scale="scale"
          :height="height"
          :includeText="includeText"
          :colorScheme="colorScheme"
          :currentDefinition="currentDefinition"
          :validationError="error || (!validationResult.isValid ? validationResult.error : null)"
          :presets="presets"
          @update:barcodeValue="(val) => { barcodeValue = val; }"
          @update:scale="(val) => { scale = val; }"
          @update:height="(val) => { height = val; }"
          @update:includeText="(val) => { includeText = val; }"
          @update:colorScheme="(val) => { colorScheme = val; }"
          @applyPreset="applyPreset"
          @autoCalculateChecksum="autoCalculateChecksum"
          @reset="resetGenerator"
        />
      </div>

      <!-- Right Column: Live Technical Specimen Sheet & Export -->
      <div class="lg:col-span-6 space-y-6">
        <BarcodeSpecimen
          ref="specimenComponentRef"
          :format="selectedFormat"
          :value="barcodeValue"
          :error="error || (!validationResult.isValid ? validationResult.error : null)"
          :dimensions="dimensions"
          :colorScheme="colorScheme"
          @downloadSvg="downloadSvgFile"
          @downloadPng="downloadPngFile"
          @reset="resetGenerator"
        />
      </div>

    </div>

  </div>
</template>
