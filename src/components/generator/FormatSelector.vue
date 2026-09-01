<script setup lang="ts">
import { ref, computed } from 'vue';
import type { BarcodeFormat } from '@/types/barcode';
import { FORMAT_LIST } from '@/services/formats';

interface Props {
  selectedFormat: BarcodeFormat;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'selectFormat', format: BarcodeFormat): void;
}>();

const activeCategory = ref<'popular' | '2d' | '1d' | 'all'>('popular');

const popularFormatIds = ['QR', 'EAN13', 'CODE128', 'UPCA', 'DATAMATRIX', 'PDF417'];

const displayedFormats = computed(() => {
  if (activeCategory.value === 'popular') {
    return FORMAT_LIST.filter((f) => popularFormatIds.includes(f.id));
  }
  if (activeCategory.value === '2d') {
    return FORMAT_LIST.filter((f) => f.category === '2D');
  }
  if (activeCategory.value === '1d') {
    return FORMAT_LIST.filter((f) => f.category === '1D');
  }
  return FORMAT_LIST;
});
</script>

<template>
  <div class="space-y-4 select-none font-sans">
    
    <!-- Category Filter Tabs -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
      <div class="text-xs uppercase tracking-wider font-semibold text-slate-900">
        Select Format
      </div>

      <div class="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium">
        <button
          @click="activeCategory = 'popular'"
          type="button"
          class="px-3 py-1 rounded-lg transition-colors"
          :class="activeCategory === 'popular' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          Popular
        </button>
        <button
          @click="activeCategory = '2d'"
          type="button"
          class="px-3 py-1 rounded-lg transition-colors"
          :class="activeCategory === '2d' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          2D Matrix
        </button>
        <button
          @click="activeCategory = '1d'"
          type="button"
          class="px-3 py-1 rounded-lg transition-colors"
          :class="activeCategory === '1d' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          1D Linear
        </button>
        <button
          @click="activeCategory = 'all'"
          type="button"
          class="px-3 py-1 rounded-lg transition-colors"
          :class="activeCategory === 'all' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          All ({{ FORMAT_LIST.length }})
        </button>
      </div>
    </div>

    <!-- Format Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      <button
        v-for="fmt in displayedFormats"
        :key="fmt.id"
        type="button"
        @click="$emit('selectFormat', fmt.id)"
        class="p-3 rounded-xl text-left border transition-all duration-150 flex flex-col justify-between gap-2 shadow-xs"
        :class="[
          selectedFormat === fmt.id
            ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm font-bold scale-[1.02]'
            : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-slate-900 hover:bg-slate-50'
        ]"
      >
        <div class="flex items-center justify-between w-full">
          <span
            class="text-xs font-semibold truncate"
            :class="selectedFormat === fmt.id ? 'text-slate-950' : 'text-slate-900'"
          >
            {{ fmt.name }}
          </span>
          <span
            class="text-[10px] font-mono px-1.5 py-0.5 rounded"
            :class="selectedFormat === fmt.id ? 'bg-black/15 text-slate-950 font-bold' : 'bg-slate-100 text-slate-500'"
          >
            {{ fmt.category }}
          </span>
        </div>
        <p
          class="text-[10px] truncate"
          :class="selectedFormat === fmt.id ? 'text-slate-900/80 font-medium' : 'text-slate-500'"
        >
          {{ fmt.standard }}
        </p>
      </button>
    </div>

  </div>
</template>
