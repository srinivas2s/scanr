<script setup lang="ts">
import { computed } from 'vue';
import type { BarcodeFormat, FormatDefinition, GeneratorOptions } from '@/types/barcode';
import type { SpecimenPreset } from '@/composables/useBarcodeGenerator';

interface Props {
  selectedFormat: BarcodeFormat;
  barcodeValue: string;
  scale: number;
  height: number;
  includeText: boolean;
  colorScheme: GeneratorOptions['colorScheme'];
  currentDefinition: FormatDefinition;
  validationError?: string | null;
  presets: SpecimenPreset[];
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'update:barcodeValue', val: string): void;
  (e: 'update:scale', val: number): void;
  (e: 'update:height', val: number): void;
  (e: 'update:includeText', val: boolean): void;
  (e: 'update:colorScheme', val: GeneratorOptions['colorScheme']): void;
  (e: 'applyPreset', preset: SpecimenPreset): void;
  (e: 'autoCalculateChecksum'): void;
  (e: 'reset'): void;
}>();

const canAutoCalculate = computed(() => {
  if (props.selectedFormat === 'EAN13' && props.barcodeValue.length === 12 && /^\d+$/.test(props.barcodeValue)) {
    return true;
  }
  if (props.selectedFormat === 'UPCA' && props.barcodeValue.length === 11 && /^\d+$/.test(props.barcodeValue)) {
    return true;
  }
  return false;
});

const colorSchemes = [
  { id: 'bw', label: 'Classic B&W', bar: '#000000', bg: '#ffffff' },
  { id: 'invert', label: 'Dark Inverted', bar: '#ffffff', bg: '#0f172a' },
  { id: 'hazard', label: 'Safety Red', bar: '#dc2626', bg: '#ffffff' },
  { id: 'acid', label: 'Amber Clay', bar: '#451a03', bg: '#fbbf24' },
  { id: 'cyan', label: 'Cyan Blueprint', bar: '#0284c7', bg: '#f0f9ff' },
] as const;
</script>

<template>
  <div class="space-y-6 font-sans">
    
    <!-- Input Section -->
    <div class="p-6 sm:p-7 rounded-3xl clay-card space-y-4">
      <div class="flex items-center justify-between">
        <label for="barcode-input" class="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>Payload Value</span>
          <span class="px-3 py-1 clay-pill-amber text-xs font-mono font-bold">
            {{ currentDefinition.name }}
          </span>
        </label>
        <span class="text-xs text-slate-500 font-mono font-semibold">
          {{ barcodeValue.length }} chars
        </span>
      </div>

      <div class="space-y-2">
        <input
          id="barcode-input"
          type="text"
          :value="barcodeValue"
          @input="$emit('update:barcodeValue', ($event.target as HTMLInputElement).value)"
          :placeholder="currentDefinition.placeholder"
          class="w-full clay-inset px-4 py-3.5 text-base font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all font-semibold"
          :class="[
            validationError
              ? 'ring-2 ring-red-500 border-red-300'
              : ''
          ]"
        />

        <!-- Validation Error message -->
        <p v-if="validationError" class="text-xs text-red-600 font-bold">
          {{ validationError }}
        </p>

        <!-- Checksum Calculation Trigger Button (EAN-13 / UPC-A) -->
        <div v-if="canAutoCalculate" class="pt-1">
          <button
            @click="$emit('autoCalculateChecksum')"
            type="button"
            class="px-4 py-2 clay-btn-amber text-xs font-bold flex items-center gap-1.5"
          >
            <span>+ Auto-Compute Mod-10 Checksum Digit</span>
          </button>
        </div>
      </div>

      <!-- Format Description & Requirements Help -->
      <div class="text-xs text-slate-600 leading-relaxed clay-inset p-3.5 rounded-2xl font-medium">
        {{ currentDefinition.description }}
      </div>
    </div>

    <!-- Quick Specimen Presets -->
    <div class="p-6 rounded-3xl clay-card space-y-3">
      <div class="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center justify-between">
        <span>Quick Presets</span>
        <span class="text-[11px] text-slate-500 font-medium">Fast Fill</span>
      </div>

      <div class="flex flex-wrap gap-2.5">
        <button
          v-for="preset in presets"
          :key="preset.id"
          type="button"
          @click="$emit('applyPreset', preset)"
          class="px-3.5 py-2 clay-pill hover:clay-pill-amber text-xs text-slate-800 transition-all flex items-center gap-2 group cursor-pointer"
        >
          <span class="font-bold group-hover:text-amber-900">{{ preset.name }}</span>
          <span class="text-[10px] font-mono text-slate-400">#{{ preset.format }}</span>
        </button>
      </div>
    </div>

    <!-- Visual Parameters Settings -->
    <div class="p-6 sm:p-7 rounded-3xl clay-card space-y-5">
      <div class="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
        Appearance Options
      </div>

      <!-- Color Schemes -->
      <div class="space-y-2">
        <div class="text-xs font-bold text-slate-600">
          Color Scheme
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            v-for="cs in colorSchemes"
            :key="cs.id"
            type="button"
            @click="$emit('update:colorScheme', cs.id)"
            class="p-2.5 rounded-2xl border text-xs font-semibold transition-all flex flex-col items-center gap-2 cursor-pointer"
            :class="[
              colorScheme === cs.id
                ? 'clay-btn-white ring-2 ring-amber-500 text-slate-950 font-bold scale-[1.02]'
                : 'clay-inset text-slate-600 hover:text-slate-950 hover:scale-[1.01]'
            ]"
          >
            <!-- Palette Color Swatch Preview -->
            <div class="w-full h-4 rounded-lg border border-slate-300 shadow-inner flex items-center justify-center" :style="{ backgroundColor: cs.bg }">
              <span class="w-4 h-2 rounded-xs shadow-xs" :style="{ backgroundColor: cs.bar }"></span>
            </div>
            <span class="text-[11px] truncate">{{ cs.label }}</span>
          </button>
        </div>
      </div>

      <!-- Sliders Grid (Scale & Height) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <!-- Scale Multiplier -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs text-slate-600">
            <span class="font-semibold">Scale:</span>
            <span class="text-amber-800 font-mono font-bold">{{ scale }}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            :value="scale"
            @input="$emit('update:scale', Number(($event.target as HTMLInputElement).value))"
            class="w-full accent-amber-500 bg-slate-200 h-2 rounded-lg cursor-pointer"
          />
        </div>

        <!-- Height / Dimension (for 1D codes) -->
        <div v-if="currentDefinition.category === '1D'" class="space-y-1.5">
          <div class="flex items-center justify-between text-xs text-slate-600">
            <span class="font-semibold">Bar Height:</span>
            <span class="text-amber-800 font-mono font-bold">{{ height }}mm</span>
          </div>
          <input
            type="range"
            min="15"
            max="50"
            step="5"
            :value="height"
            @input="$emit('update:height', Number(($event.target as HTMLInputElement).value))"
            class="w-full accent-amber-500 bg-slate-200 h-2 rounded-lg cursor-pointer"
          />
        </div>

        <!-- Human Readable Text Toggle (1D) -->
        <div v-if="currentDefinition.category === '1D'" class="sm:col-span-2 flex items-center justify-between pt-2 border-t border-slate-100">
          <span class="text-xs text-slate-800 font-bold">Show Human-Readable Label:</span>
          <button
            type="button"
            @click="$emit('update:includeText', !includeText)"
            class="px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
            :class="[
              includeText
                ? 'clay-btn-amber text-slate-950 font-bold'
                : 'clay-btn-white text-slate-600'
            ]"
          >
            {{ includeText ? 'Enabled' : 'Disabled' }}
          </button>
        </div>
      </div>

    </div>

  </div>
</template>
