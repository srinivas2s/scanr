<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ScanResult } from '@/types/barcode';
import IndustrialButton from '@/components/ui/IndustrialButton.vue';
import { audioService } from '@/services/audio';

interface Props {
  result: ScanResult;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'scanAgain'): void;
}>();

const router = useRouter();
const copied = ref(false);

const copyValue = async () => {
  try {
    await navigator.clipboard.writeText(props.result.rawText);
    copied.value = true;
    audioService.playClick();
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    // Clipboard permission fallback
  }
};

const openExternalUrl = (url: string) => {
  audioService.playClick();
  window.open(url, '_blank', 'noopener,noreferrer');
};

const searchWeb = () => {
  audioService.playClick();
  const query = encodeURIComponent(props.result.rawText);
  if (props.result.detectedType === 'EAN_PRODUCT') {
    window.open(`https://www.google.com/search?q=${query}+barcode+upc`, '_blank', 'noopener,noreferrer');
  } else {
    window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener,noreferrer');
  }
};

const makeDerivativeCode = () => {
  audioService.playClick();
  router.push({
    path: '/create',
    query: {
      value: props.result.rawText,
      format: props.result.format.replace(/\s+/g, '').toUpperCase(),
    },
  });
};
</script>

<template>
  <div class="rounded-2xl bg-white border border-amber-300 shadow-xl shadow-amber-500/10 p-6 space-y-5 font-sans">
    
    <!-- Card Header -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
      <div class="flex items-center gap-2.5">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <h2 class="font-bold text-lg text-slate-900">
          Barcode Detected
        </h2>
      </div>

      <div class="flex items-center gap-2 text-xs font-mono">
        <span class="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
          {{ result.format }}
        </span>
        <span class="text-slate-500">
          {{ new Date(result.timestamp).toLocaleTimeString() }}
        </span>
      </div>
    </div>

    <!-- Decoded Value Display Box -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs text-slate-600">
        <span class="font-medium text-slate-800">Decoded Content:</span>
        <span class="font-mono text-[11px]">{{ result.rawText.length }} chars</span>
      </div>

      <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-base sm:text-lg break-all select-all leading-relaxed">
        {{ result.rawText }}
      </div>
    </div>

    <!-- Smart URL Action Banner (if URL) -->
    <div v-if="result.detectedType === 'URL'" class="p-3.5 rounded-xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2 text-sky-800 font-medium">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        <span>Link Detected</span>
      </div>
      <IndustrialButton
        @click="openExternalUrl(result.parsedData?.url || result.rawText)"
        variant="acid"
        size="sm"
      >
        <span>Open in New Tab</span>
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </IndustrialButton>
    </div>

    <!-- Action Toolbar Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100">
      <!-- 1. Copy Button -->
      <IndustrialButton
        @click="copyValue"
        :variant="copied ? 'acid' : 'secondary'"
        size="md"
        block
      >
        <svg v-if="!copied" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg v-else class="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ copied ? 'Copied!' : 'Copy Text' }}</span>
      </IndustrialButton>

      <!-- 2. Web Search Button -->
      <IndustrialButton
        @click="searchWeb"
        variant="secondary"
        size="md"
        block
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search Web</span>
      </IndustrialButton>

      <!-- 3. Make Derivative Barcode -->
      <IndustrialButton
        @click="makeDerivativeCode"
        variant="secondary"
        size="md"
        block
      >
        <svg class="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Make Barcode</span>
      </IndustrialButton>

      <!-- 4. Scan Next -->
      <IndustrialButton
        @click="$emit('scanAgain')"
        variant="acid"
        size="md"
        block
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Scan Next</span>
      </IndustrialButton>
    </div>

  </div>
</template>
