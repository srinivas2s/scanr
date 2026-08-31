<script setup lang="ts">
import IndustrialButton from '@/components/ui/IndustrialButton.vue';
import type { CameraDeviceInfo } from '@/types/barcode';

interface Props {
  isStreaming: boolean;
  isScanning: boolean;
  devices: CameraDeviceInfo[];
  selectedDeviceId: string;
  torchSupported: boolean;
  torchActive: boolean;
  isMuted: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'toggleStream'): void;
  (e: 'selectDevice', deviceId: string): void;
  (e: 'toggleTorch'): void;
  (e: 'toggleMute'): void;
}>();
</script>

<template>
  <div class="p-4 sm:p-5 bg-scanr-panel border border-scanr-border space-y-4">
    
    <!-- Primary Big Action Button -->
    <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
      <div class="sm:col-span-8">
        <IndustrialButton
          v-if="!isStreaming"
          @click="$emit('toggleStream')"
          variant="hazard"
          size="lg"
          block
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="square" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>START SCANNING</span>
        </IndustrialButton>

        <IndustrialButton
          v-else
          @click="$emit('toggleStream')"
          variant="secondary"
          size="lg"
          block
        >
          <svg class="w-5 h-5 text-scanr-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path stroke-linecap="square" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
          <span>HALT OPTICAL STREAM</span>
        </IndustrialButton>
      </div>

      <!-- Secondary Utility Buttons (Audio & Torch) -->
      <div class="sm:col-span-4 flex items-center gap-2">
        <!-- Torch Button (if supported) -->
        <IndustrialButton
          v-if="torchSupported"
          @click="$emit('toggleTorch')"
          :variant="torchActive ? 'acid' : 'secondary'"
          size="lg"
          block
          :title="torchActive ? 'Turn Torch Off' : 'Turn Torch On'"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>{{ torchActive ? 'TORCH ON' : 'TORCH' }}</span>
        </IndustrialButton>

        <!-- Audio Mute/Unmute -->
        <IndustrialButton
          @click="$emit('toggleMute')"
          variant="secondary"
          size="lg"
          :block="!torchSupported"
          :title="isMuted ? 'Unmute Audio Feedback' : 'Mute Audio Feedback'"
        >
          <svg v-if="!isMuted" class="w-5 h-5 text-scanr-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          <svg v-else class="w-5 h-5 text-scanr-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="square" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
          <span class="hidden sm:inline">{{ isMuted ? 'MUTED' : 'AUDIO' }}</span>
        </IndustrialButton>
      </div>
    </div>

    <!-- Camera Device Selector Dropdown -->
    <div v-if="devices.length > 1" class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-scanr-border/60 text-xs font-mono">
      <label for="camera-select" class="text-scanr-muted uppercase font-bold tracking-wider">
        ACTIVE OPTICAL SENSOR:
      </label>
      <select
        id="camera-select"
        :value="selectedDeviceId"
        @change="$emit('selectDevice', ($event.target as HTMLSelectElement).value)"
        class="bg-scanr-dark border border-scanr-border text-scanr-white px-3 py-1.5 focus:outline-none focus:border-scanr-yellow uppercase font-mono text-xs cursor-pointer"
      >
        <option v-for="dev in devices" :key="dev.deviceId" :value="dev.deviceId">
          {{ dev.label }}
        </option>
      </select>
    </div>

  </div>
</template>
