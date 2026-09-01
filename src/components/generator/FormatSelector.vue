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
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
      <div class="text-xs uppercase tracking-wider font-extrabold text-slate-900">
        Select Format
      </div>

      <div class="flex items-center p-1.5 rounded-2xl clay-inset text-xs font-semibold">
        <button
          @click="activeCategory = 'popular'"
          type="button"
          class="px-3.5 py-1.5 rounded-xl transition-all"
          :class="activeCategory === 'popular' ? 'clay-btn-white text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-950'"
        >
          Popular
        </button>
        <button
          @click="activeCategory = '2d'"
          type="button"
          class="px-3.5 py-1.5 rounded-xl transition-all"
          :class="activeCategory === '2d' ? 'clay-btn-white text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-950'"
        >
          2D Matrix
        </button>
        <button
          @click="activeCategory = '1d'"
          type="button"
          class="px-3.5 py-1.5 rounded-xl transition-all"
          :class="activeCategory === '1d' ? 'clay-btn-white text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-950'"
        >
          1D Linear
        </button>
        <button
          @click="activeCategory = 'all'"
          type="button"
          class="px-3.5 py-1.5 rounded-xl transition-all"
          :class="activeCategory === 'all' ? 'clay-btn-white text-slate-950 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-950'"
        >
          All ({{ FORMAT_LIST.length }})
        </button>
      </div>
    </div>

    <!-- Format Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <button
        v-for="fmt in displayedFormats"
        :key="fmt.id"
        type="button"
        @click="$emit('selectFormat', fmt.id)"
        class="p-3.5 rounded-2xl text-left transition-all duration-150 flex flex-col justify-between gap-2.5"
        :class="[
          selectedFormat === fmt.id
            ? 'clay-btn-amber font-bold text-slate-950 scale-[1.03]'
            : 'clay-card text-slate-700 hover:text-slate-950 hover:scale-[1.01]'
        ]"
      >
        <div class="flex items-center justify-between w-full">
          <span
            class="text-xs font-bold truncate"
            :class="selectedFormat === fmt.id ? 'text-slate-950' : 'text-slate-900'"
          >
            {{ fmt.name }}
          </span>
          <span
            class="text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold"
            :class="selectedFormat === fmt.id ? 'bg-black/15 text-slate-950' : 'clay-pill text-slate-600'"
          >
            {{ fmt.category }}
          </span>
        </div>
        <p
          class="text-[10px] truncate font-medium"
          :class="selectedFormat === fmt.id ? 'text-slate-950/80 font-semibold' : 'text-slate-500'"
        >
          {{ fmt.standard }}
        </p>
      </button>
    </div>

  </div>
</template>
