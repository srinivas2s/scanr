<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  isAnalyzing: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'fileSelected', file: File): void;
}>();

const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    handleFile(files[0]);
  }
};

const onFileInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    handleFile(target.files[0]);
  }
};

const handleFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    return;
  }
  previewUrl.value = URL.createObjectURL(file);
  emit('fileSelected', file);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

// Clipboard paste support
const handlePaste = (e: ClipboardEvent) => {
  const items = e.clipboardData?.items;
  if (!items) return;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.startsWith('image/')) {
      const file = items[i].getAsFile();
      if (file) {
        handleFile(file);
        break;
      }
    }
  }
};

onMounted(() => {
  window.addEventListener('paste', handlePaste);
});

onUnmounted(() => {
  window.removeEventListener('paste', handlePaste);
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<template>
  <div
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @click="triggerFileInput"
    class="relative w-full min-h-[280px] sm:min-h-[340px] clay-card border-2 border-dashed transition-all duration-200 cursor-pointer select-none flex flex-col items-center justify-center p-6 text-center group overflow-hidden"
    :class="[
      isDragging
        ? 'border-amber-500 bg-amber-50/60 scale-[1.01]'
        : 'border-slate-300 hover:border-amber-400 bg-white hover:bg-amber-50/20',
      isAnalyzing ? 'pointer-events-none' : ''
    ]"
  >
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileInputChange"
    />

    <!-- Background Tech Grid -->
    <div class="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none"></div>

    <!-- State 1: Analyzing Processing Animation -->
    <div v-if="isAnalyzing" class="relative z-10 flex flex-col items-center space-y-4 max-w-sm">
      <div class="w-16 h-16 rounded-2xl clay-pill-amber flex items-center justify-center text-amber-700">
        <svg class="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div class="space-y-1">
        <div class="text-sm font-bold text-amber-800 animate-pulse">
          Decoding Barcode Image...
        </div>
        <p class="text-xs text-slate-500 font-medium">
          Analyzing optical matrix in browser
        </p>
      </div>
    </div>

    <!-- State 2: Default Drag & Drop Prompt -->
    <div v-else class="relative z-10 flex flex-col items-center space-y-4 max-w-md font-sans">
      <div class="w-16 h-16 rounded-2xl clay-inset flex items-center justify-center text-slate-600 group-hover:text-amber-600 group-hover:scale-105 transition-all">
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <div class="space-y-1.5">
        <h3 class="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
          {{ isDragging ? 'Drop Image to Decode' : 'Upload or Drop Barcode Image' }}
        </h3>
        <p class="text-xs text-slate-600 max-w-xs leading-relaxed font-medium">
          Drag and drop an image, click to browse, or press <kbd class="px-2 py-1 rounded-md clay-pill font-mono text-[10px] text-slate-800 font-bold">Ctrl + V</kbd> to paste from clipboard.
        </p>
      </div>

      <div class="flex items-center gap-2.5 pt-2 text-xs font-mono">
        <span class="px-3 py-1 clay-pill text-slate-700 font-semibold">PNG • JPG • WEBP</span>
        <span class="px-3 py-1 clay-pill-emerald text-emerald-800 font-bold">Local Decode</span>
      </div>
    </div>
  </div>
</template>
