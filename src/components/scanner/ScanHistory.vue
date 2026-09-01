<script setup lang="ts">
import { ref } from 'vue';
import type { ScanResult } from '@/types/barcode';
import { audioService } from '@/services/audio';

interface Props {
  history: ScanResult[];
}

defineProps<Props>();

defineEmits<{
  (e: 'selectResult', result: ScanResult): void;
  (e: 'clearHistory'): void;
}>();

const copiedId = ref<string | null>(null);

const copyText = async (res: ScanResult, event: MouseEvent) => {
  event.stopPropagation();
  try {
    await navigator.clipboard.writeText(res.rawText);
    copiedId.value = res.id;
    audioService.playClick();
    setTimeout(() => {
      copiedId.value = null;
    }, 1500);
  } catch {
    // Ignore clipboard error
  }
};
</script>

<template>
  <div v-if="history.length > 0" class="p-6 rounded-3xl clay-card space-y-4 font-sans">
    
    <div class="flex items-center justify-between border-b border-slate-100 pb-3">
      <div class="flex items-center gap-2">
        <span class="text-sm font-bold text-slate-900">
          Recent Scans
        </span>
        <span class="px-2.5 py-0.5 clay-pill text-slate-700 text-xs font-mono font-bold">
          {{ history.length }}
        </span>
      </div>

      <button
        @click="$emit('clearHistory')"
        type="button"
        class="text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors focus:outline-none"
      >
        Clear All
      </button>
    </div>

    <div class="space-y-2.5 max-h-64 overflow-y-auto pr-1">
      <div
        v-for="item in history"
        :key="item.id"
        @click="$emit('selectResult', item)"
        class="p-3.5 rounded-2xl clay-inset hover:bg-amber-50/50 flex items-center justify-between gap-3 cursor-pointer group transition-all duration-150"
      >
        <div class="space-y-1 min-w-0 flex-1">
          <div class="flex items-center gap-2 text-xs font-mono">
            <span class="font-bold text-amber-700">{{ item.format }}</span>
            <span class="text-slate-300">•</span>
            <span class="text-slate-500 text-[11px] font-medium">{{ new Date(item.timestamp).toLocaleTimeString() }}</span>
          </div>
          <div class="text-xs text-slate-800 font-mono truncate font-semibold group-hover:text-slate-950 transition-colors">
            {{ item.rawText }}
          </div>
        </div>

        <button
          @click="copyText(item, $event)"
          type="button"
          class="p-2 rounded-xl clay-btn-white text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
          :title="copiedId === item.id ? 'Copied' : 'Copy'"
        >
          <svg v-if="copiedId !== item.id" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <svg v-else class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>

  </div>
</template>
