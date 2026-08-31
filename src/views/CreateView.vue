<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useBarcodeGenerator } from '@/composables/useBarcodeGenerator';
import type { BarcodeFormat } from '@/types/barcode';

import FormatSelector from '@/components/generator/FormatSelector.vue';
import GeneratorForm from '@/components/generator/GeneratorForm.vue';
import BarcodeSpecimen from '@/components/generator/BarcodeSpecimen.vue';
import TechnicalLabel from '@/components/ui/TechnicalLabel.vue';

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
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
    
    <!-- Page Header Specimen Strip -->
    <div class="border-b-2 border-scanr-white pb-6 space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-scanr-muted">
        <div class="flex items-center gap-2">
          <TechnicalLabel code="02" label="ENCODING SUBSYSTEM" variant="accent" />
          <span class="text-scanr-dim">///</span>
          <span class="text-scanr-white">VECTOR SPECIMEN GENERATOR</span>
        </div>
        <div class="text-[11px] text-scanr-dim">
          <span>LAT: CLIENT_VECTOR</span>
          <span class="mx-2">•</span>
          <span class="text-scanr-yellow">SVG + HIGH-RES PNG EXPORT</span>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 class="font-display font-black text-4xl sm:text-6xl text-scanr-white tracking-tight uppercase">
            MAKE A CODE.
          </h1>
          <p class="font-mono text-sm sm:text-base text-scanr-muted mt-1 max-w-2xl">
            Turn information into an optically certified, machine-readable scannable mark with live specimen rendering.
          </p>
        </div>
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
