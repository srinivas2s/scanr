<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showCenter?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'border-scanr-white/40',
  showCenter: false,
});
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-10">
    <!-- Top-Left Corner -->
    <div
      class="absolute top-0 left-0 border-t-2 border-l-2"
      :class="[
        color,
        size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'
      ]"
    ></div>

    <!-- Top-Right Corner -->
    <div
      class="absolute top-0 right-0 border-t-2 border-r-2"
      :class="[
        color,
        size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'
      ]"
    ></div>

    <!-- Bottom-Left Corner -->
    <div
      class="absolute bottom-0 left-0 border-b-2 border-l-2"
      :class="[
        color,
        size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'
      ]"
    ></div>

    <!-- Bottom-Right Corner -->
    <div
      class="absolute bottom-0 right-0 border-b-2 border-r-2"
      :class="[
        color,
        size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'
      ]"
    ></div>

    <!-- Center Crosshair Marker -->
    <div
      v-if="showCenter"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-40 pointer-events-none"
    >
      <div class="absolute w-full h-[1px] bg-scanr-white"></div>
      <div class="absolute h-full w-[1px] bg-scanr-white"></div>
      <div class="w-2.5 h-2.5 rounded-full border border-scanr-white"></div>
    </div>
  </div>
</template>
