<script setup lang="ts">
import { ref } from 'vue';
import type { ScanResult } from '@/types/barcode';
import TechnicalLabel from '@/components/ui/TechnicalLabel.vue';
import { audioService } from '@/services/audio';

interface Props {
  history: ScanResult[];
}

defineProps<Props>();

const emit = defineEmits<{
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
  <div v-if="history.length > 0" class="p-4 sm:p-5 bg-scanr-dark border border-scanr-border space-y-4 font-mono">
    
    <div class="flex items-center justify-between border-b border-scanr-border pb-2">
      <div class="flex items-center gap-2">
        <span class="text-xs uppercase font-bold text-scanr-white tracking-widest">
          OPTICAL BUFFER LOG
        </span>
        <TechnicalLabel :label="`${history.length} SPECIMENS`" variant="default" size="xs" />
      </div>

      <button
        @click="$emit('clearHistory')"
        type="button"
        class="text-[10px] uppercase text-scanr-dim hover:text-scanr-red font-semibold transition-colors focus:outline-none"
      >
        [ CLEAR BUFFER ]
      </button>
    </div>

    <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
      <div
        v-for="item in history"
        :key="item.id"
        @click="$emit('selectResult', item)"
        class="p-3 bg-scanr-panel border border-scanr-border hover:border-scanr-yellow flex items-center justify-between gap-3 cursor-pointer group transition-all duration-150"
      >
        <div class="space-y-1 min-w-0 flex-1">
          <div class="flex items-center gap-2 text-[10px]">
            <span class="font-bold text-scanr-yellow uppercase">{{ item.format }}</span>
            <span class="text-scanr-dim">•</span>
            <span class="text-scanr-muted">{{ new Date(item.timestamp).toLocaleTimeString() }}</span>
            <span class="text-scanr-cyan text-[9px]">#{{ item.id }}</span>
          </div>
          <div class="text-xs text-scanr-white font-mono truncate group-hover:text-scanr-yellow transition-colors">
            {{ item.rawText }}
          </div>
        </div>

        <button
          @click="copyText(item, $event)"
          type="button"
          class="p-1.5 bg-scanr-dark border border-scanr-border text-scanr-muted hover:text-scanr-white hover:border-scanr-white transition-colors"
          :title="copiedId === item.id ? 'Copied' : 'Copy payload'"
        >
          <svg v-if="copiedId !== item.id" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <svg v-else class="w-3.5 h-3.5 text-scanr-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>

  </div>
</template>
