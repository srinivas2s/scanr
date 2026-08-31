<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ScanResult } from '@/types/barcode';
import CropMarks from '@/components/ui/CropMarks.vue';
import TechnicalLabel from '@/components/ui/TechnicalLabel.vue';
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
  <div class="relative bg-scanr-panel border-2 border-scanr-yellow shadow-[6px_6px_0px_0px_rgba(228,255,26,0.9)] p-5 sm:p-6 space-y-6 font-mono overflow-hidden">
    
    <!-- Corner Crop Marks in Safety Yellow -->
    <CropMarks size="md" color="border-scanr-yellow" />

    <!-- Card Header Telemetry -->
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-scanr-border pb-4">
      <div class="flex items-center gap-2.5">
        <span class="w-3 h-3 bg-scanr-yellow inline-block animate-ping"></span>
        <h2 class="font-display font-black text-lg sm:text-xl text-scanr-white tracking-tight uppercase">
          SPECIMEN DETECTED & LOCKED
        </h2>
      </div>

      <div class="flex items-center gap-2 text-xs">
        <TechnicalLabel :code="result.id" label="DECODED" variant="accent" />
        <span class="text-scanr-dim hidden sm:inline">|</span>
        <span class="text-scanr-muted text-[11px]">
          {{ new Date(result.timestamp).toLocaleTimeString() }}
        </span>
      </div>
    </div>

    <!-- Symbology & Type Callout -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="p-3 bg-scanr-dark border border-scanr-border space-y-1">
        <div class="text-[10px] text-scanr-muted uppercase tracking-widest">
          SYMBOLOGY FORMAT
        </div>
        <div class="text-base sm:text-lg font-black text-scanr-yellow uppercase">
          {{ result.format }}
        </div>
      </div>

      <div class="p-3 bg-scanr-dark border border-scanr-border space-y-1">
        <div class="text-[10px] text-scanr-muted uppercase tracking-widest">
          PAYLOAD CLASSIFICATION
        </div>
        <div class="text-base sm:text-lg font-black text-scanr-cyan uppercase flex items-center gap-1.5">
          <span>●</span>
          <span>{{ result.detectedType }}</span>
        </div>
      </div>
    </div>

    <!-- Decoded Raw Value Display Box -->
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs text-scanr-muted">
        <span class="uppercase tracking-widest font-bold text-scanr-white">DECODED VALUE PAYLOAD:</span>
        <span class="text-[10px]">{{ result.rawText.length }} CHARACTERS</span>
      </div>

      <div class="p-4 bg-scanr-black border-2 border-scanr-border text-scanr-white font-mono text-sm sm:text-base break-all select-all leading-relaxed relative group">
        {{ result.rawText }}
      </div>
    </div>

    <!-- Context-Specific Smart Action Box -->
    <div v-if="result.detectedType === 'URL'" class="p-3 bg-scanr-cyan/10 border border-scanr-cyan/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2 text-scanr-cyan">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="square" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        <span class="font-bold">WEB RESOURCE DETECTED</span>
      </div>
      <IndustrialButton
        @click="openExternalUrl(result.parsedData?.url || result.rawText)"
        variant="acid"
        size="sm"
      >
        <span>OPEN LINK IN BROWSER</span>
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="square" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </IndustrialButton>
    </div>

    <!-- Action Toolbar Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-scanr-border">
      <!-- 1. Copy Button -->
      <IndustrialButton
        @click="copyValue"
        :variant="copied ? 'acid' : 'secondary'"
        size="md"
        block
      >
        <svg v-if="!copied" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="square" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg v-else class="w-4 h-4 text-scanr-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="square" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
        <span>{{ copied ? 'COPIED TO CLIPBOARD' : 'COPY VALUE' }}</span>
      </IndustrialButton>

      <!-- 2. Web Search Button -->
      <IndustrialButton
        @click="searchWeb"
        variant="secondary"
        size="md"
        block
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="square" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>SEARCH WEB</span>
      </IndustrialButton>

      <!-- 3. Make Derivative Barcode -->
      <IndustrialButton
        @click="makeDerivativeCode"
        variant="secondary"
        size="md"
        block
      >
        <svg class="w-4 h-4 text-scanr-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="square" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>MAKE DERIVATIVE</span>
      </IndustrialButton>

      <!-- 4. Scan Next Specimen -->
      <IndustrialButton
        @click="$emit('scanAgain')"
        variant="hazard"
        size="md"
        block
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="square" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>SCAN NEXT</span>
      </IndustrialButton>
    </div>

  </div>
</template>
