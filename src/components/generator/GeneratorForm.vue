<script setup lang="ts">
import { computed } from 'vue';
import type { BarcodeFormat, FormatDefinition, GeneratorOptions } from '@/types/barcode';
import type { SpecimenPreset } from '@/composables/useBarcodeGenerator';
import TechnicalLabel from '@/components/ui/TechnicalLabel.vue';
import IndustrialButton from '@/components/ui/IndustrialButton.vue';

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

const emit = defineEmits<{
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
  { id: 'bw', label: 'STANDARD MONO', bar: '#000000', bg: '#ffffff' },
  { id: 'invert', label: 'DARK INVERT', bar: '#ffffff', bg: '#101216' },
  { id: 'hazard', label: 'SAFETY HAZARD', bar: '#ff2a00', bg: '#ffffff' },
  { id: 'acid', label: 'OPTIC ACID', bar: '#090a0c', bg: '#e4ff1a' },
  { id: 'cyan', label: 'CYAN BLUEPRINT', bar: '#00f0ff', bg: '#090a0c' },
] as const;
</script>

<template>
  <div class="space-y-6 font-mono">
    
    <!-- Input Section -->
    <div class="p-5 bg-scanr-panel border border-scanr-border space-y-4">
      <div class="flex items-center justify-between">
        <label for="barcode-input" class="text-xs uppercase font-bold text-scanr-white tracking-wider flex items-center gap-2">
          <span>VALUE PAYLOAD TO ENCODE</span>
          <TechnicalLabel :code="currentDefinition.id" :label="currentDefinition.name" variant="accent" size="xs" />
        </label>
        <span class="text-[10px] text-scanr-muted font-mono">
          {{ barcodeValue.length }} CHARS
        </span>
      </div>

      <div class="relative">
        <input
          id="barcode-input"
          type="text"
          :value="barcodeValue"
          @input="$emit('update:barcodeValue', ($event.target as HTMLInputElement).value)"
          :placeholder="currentDefinition.placeholder"
          class="w-full bg-scanr-black border-2 px-4 py-3 text-base sm:text-lg font-mono text-scanr-white placeholder:text-scanr-dim focus:outline-none transition-colors"
          :class="[
            validationError
              ? 'border-scanr-red focus:border-scanr-red'
              : 'border-scanr-border focus:border-scanr-yellow'
          ]"
        />

        <!-- Checksum Calculation Trigger Button (EAN-13 / UPC-A) -->
        <div v-if="canAutoCalculate" class="mt-2">
          <button
            @click="$emit('autoCalculateChecksum')"
            type="button"
            class="px-3 py-1.5 bg-scanr-yellow text-scanr-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-scanr-white transition-colors"
          >
            <span>+ COMPUTE CHECK DIGIT (MOD-10)</span>
          </button>
        </div>
      </div>

      <!-- Format Description & Requirements Help -->
      <div class="text-[11px] font-sans text-scanr-muted leading-relaxed flex items-start gap-2 bg-scanr-dark p-2.5 border border-scanr-border/60">
        <span class="text-scanr-yellow font-mono font-bold">INFO:</span>
        <span>{{ currentDefinition.description }}</span>
      </div>
    </div>

    <!-- Quick Specimen Presets -->
    <div class="p-4 bg-scanr-dark border border-scanr-border space-y-3">
      <div class="text-xs font-bold uppercase tracking-wider text-scanr-white flex items-center justify-between">
        <span>SPECIMEN PRESETS</span>
        <span class="text-[10px] text-scanr-muted">FAST FILL</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        <button
          v-for="preset in presets"
          :key="preset.id"
          type="button"
          @click="$emit('applyPreset', preset)"
          class="p-2 text-left bg-scanr-panel border border-scanr-border hover:border-scanr-yellow text-xs space-y-0.5 transition-colors group"
        >
          <div class="flex items-center justify-between text-[10px]">
            <span class="font-bold text-scanr-white group-hover:text-scanr-yellow">{{ preset.name }}</span>
            <span class="text-scanr-dim font-mono">#{{ preset.format }}</span>
          </div>
          <p class="text-[9px] font-mono text-scanr-muted truncate">{{ preset.value }}</p>
        </button>
      </div>
    </div>

    <!-- Visual Parameters Settings -->
    <div class="p-5 bg-scanr-panel border border-scanr-border space-y-5">
      <div class="text-xs font-bold uppercase tracking-wider text-scanr-white border-b border-scanr-border pb-2">
        OPTICAL PARAMETERS
      </div>

      <!-- Color Schemes -->
      <div class="space-y-2">
        <div class="text-[10px] uppercase tracking-wider text-scanr-muted font-bold">
          COLOR SPECIFICATION PALETTE
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            v-for="cs in colorSchemes"
            :key="cs.id"
            type="button"
            @click="$emit('update:colorScheme', cs.id)"
            class="p-2 text-center border text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1.5"
            :class="[
              colorScheme === cs.id
                ? 'border-scanr-yellow bg-scanr-dark shadow-[0_0_8px_rgba(228,255,26,0.3)]'
                : 'border-scanr-border bg-scanr-dark/60 text-scanr-muted hover:text-scanr-white hover:border-scanr-border'
            ]"
          >
            <!-- Palette Color Swatch Preview -->
            <div class="w-full h-4 border border-scanr-border flex items-center justify-center" :style="{ backgroundColor: cs.bg }">
              <span class="w-4 h-2" :style="{ backgroundColor: cs.bar }"></span>
            </div>
            <span class="truncate">{{ cs.label }}</span>
          </button>
        </div>
      </div>

      <!-- Sliders Grid (Scale & Height) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <!-- Scale Multiplier -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs text-scanr-muted">
            <span>SCALE MULTIPLIER:</span>
            <span class="text-scanr-yellow font-bold">{{ scale }}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            :value="scale"
            @input="$emit('update:scale', Number(($event.target as HTMLInputElement).value))"
            class="w-full accent-scanr-yellow bg-scanr-dark h-1.5 cursor-pointer"
          />
        </div>

        <!-- Height / Dimension (for 1D codes) -->
        <div v-if="currentDefinition.category === '1D'" class="space-y-1.5">
          <div class="flex items-center justify-between text-xs text-scanr-muted">
            <span>BAR HEIGHT:</span>
            <span class="text-scanr-yellow font-bold">{{ height }}mm</span>
          </div>
          <input
            type="range"
            min="15"
            max="50"
            step="5"
            :value="height"
            @input="$emit('update:height', Number(($event.target as HTMLInputElement).value))"
            class="w-full accent-scanr-yellow bg-scanr-dark h-1.5 cursor-pointer"
          />
        </div>

        <!-- Human Readable Text Toggle (1D) -->
        <div v-if="currentDefinition.category === '1D'" class="sm:col-span-2 flex items-center justify-between pt-2 border-t border-scanr-border/40">
          <span class="text-xs text-scanr-white font-bold uppercase">INCLUDE HUMAN-READABLE TEXT:</span>
          <button
            type="button"
            @click="$emit('update:includeText', !includeText)"
            class="px-3 py-1 text-xs font-bold uppercase border transition-colors"
            :class="[
              includeText
                ? 'bg-scanr-white text-scanr-black border-scanr-white'
                : 'bg-scanr-dark text-scanr-muted border-scanr-border'
            ]"
          >
            {{ includeText ? 'ENABLED' : 'DISABLED' }}
          </button>
        </div>
      </div>

    </div>

  </div>
</template>
