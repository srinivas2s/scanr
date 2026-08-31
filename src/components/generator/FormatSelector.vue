<script setup lang="ts">
import { computed } from 'vue';
import type { BarcodeFormat } from '@/types/barcode';
import { FORMAT_LIST } from '@/services/formats';
import TechnicalLabel from '@/components/ui/TechnicalLabel.vue';

interface Props {
  selectedFormat: BarcodeFormat;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'selectFormat', format: BarcodeFormat): void;
}>();

const oneDFormats = computed(() => FORMAT_LIST.filter((f) => f.category === '1D'));
const twoDFormats = computed(() => FORMAT_LIST.filter((f) => f.category === '2D'));
</script>

<template>
  <div class="space-y-4 font-mono select-none">
    
    <!-- 1D Linear Symbologies Section -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs text-scanr-muted">
        <span class="font-bold uppercase tracking-wider text-scanr-white">01 // 1D LINEAR SYMBOLOGIES</span>
        <TechnicalLabel code="1D" label="OPTICAL STRIPES" variant="default" size="xs" />
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <button
          v-for="fmt in oneDFormats"
          :key="fmt.id"
          type="button"
          @click="$emit('selectFormat', fmt.id)"
          class="p-2.5 sm:p-3 text-left border transition-all duration-150 relative group"
          :class="[
            selectedFormat === fmt.id
              ? 'bg-scanr-white text-scanr-black border-scanr-white shadow-[3px_3px_0px_0px_rgba(228,255,26,0.9)]'
              : 'bg-scanr-panel text-scanr-muted border-scanr-border hover:border-scanr-white hover:text-scanr-white'
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs sm:text-sm tracking-tight truncate uppercase" :class="selectedFormat === fmt.id ? 'text-scanr-black' : 'text-scanr-white'">
              {{ fmt.name }}
            </span>
            <span class="text-[9px] opacity-70">
              #{{ fmt.id }}
            </span>
          </div>
          <p class="text-[10px] font-sans truncate mt-1 opacity-80" :class="selectedFormat === fmt.id ? 'text-scanr-black/80' : 'text-scanr-muted'">
            {{ fmt.standard }}
          </p>
        </button>
      </div>
    </div>

    <!-- 2D Matrix Symbologies Section -->
    <div class="space-y-2 pt-2">
      <div class="flex items-center justify-between text-xs text-scanr-muted">
        <span class="font-bold uppercase tracking-wider text-scanr-white">02 // 2D MATRIX SYMBOLOGIES</span>
        <TechnicalLabel code="2D" label="HIGH-DENSITY" variant="accent" size="xs" />
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          v-for="fmt in twoDFormats"
          :key="fmt.id"
          type="button"
          @click="$emit('selectFormat', fmt.id)"
          class="p-2.5 sm:p-3 text-left border transition-all duration-150 relative group"
          :class="[
            selectedFormat === fmt.id
              ? 'bg-scanr-yellow text-scanr-black border-scanr-yellow shadow-[3px_3px_0px_0px_rgba(255,255,255,0.9)] font-bold'
              : 'bg-scanr-panel text-scanr-muted border-scanr-border hover:border-scanr-yellow hover:text-scanr-white'
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs sm:text-sm tracking-tight truncate uppercase" :class="selectedFormat === fmt.id ? 'text-scanr-black' : 'text-scanr-white'">
              {{ fmt.name }}
            </span>
            <span class="text-[9px] opacity-70">
              #2D
            </span>
          </div>
          <p class="text-[10px] font-sans truncate mt-1 opacity-80" :class="selectedFormat === fmt.id ? 'text-scanr-black/80' : 'text-scanr-muted'">
            {{ fmt.standard }}
          </p>
        </button>
      </div>
    </div>

  </div>
</template>
