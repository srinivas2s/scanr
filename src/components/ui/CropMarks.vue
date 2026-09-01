<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showCenter?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'border-white/20',
  showCenter: false,
});
</script>

<template>
  <div class="pointer-events-none absolute inset-0 z-10">
    <!-- Top-Left Corner -->
    <div
      class="absolute top-2 left-2 border-t border-l rounded-tl-sm"
      :class="[
        color,
        size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3.5 h-3.5' : 'w-5 h-5'
      ]"
    ></div>

    <!-- Top-Right Corner -->
    <div
      class="absolute top-2 right-2 border-t border-r rounded-tr-sm"
      :class="[
        color,
        size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3.5 h-3.5' : 'w-5 h-5'
      ]"
    ></div>

    <!-- Bottom-Left Corner -->
    <div
      class="absolute bottom-2 left-2 border-b border-l rounded-bl-sm"
      :class="[
        color,
        size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3.5 h-3.5' : 'w-5 h-5'
      ]"
    ></div>

    <!-- Bottom-Right Corner -->
    <div
      class="absolute bottom-2 right-2 border-b border-r rounded-br-sm"
      :class="[
        color,
        size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3.5 h-3.5' : 'w-5 h-5'
      ]"
    ></div>

    <!-- Center Reticle Marker -->
    <div
      v-if="showCenter"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center opacity-30 pointer-events-none"
    >
      <div class="absolute w-full h-[1px] bg-scanr-yellow"></div>
      <div class="absolute h-full w-[1px] bg-scanr-yellow"></div>
      <div class="w-3 h-3 rounded-full border border-scanr-yellow"></div>
    </div>
  </div>
</template>
