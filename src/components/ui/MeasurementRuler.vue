<script setup lang="ts">
interface Props {
  orientation?: 'horizontal' | 'vertical';
  ticks?: number;
  label?: string;
}

withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  ticks: 20,
  label: '',
});
</script>

<template>
  <div
    class="flex font-mono text-[9px] text-scanr-dim select-none overflow-hidden"
    :class="[
      orientation === 'horizontal'
        ? 'w-full h-4 border-b border-scanr-border/60 items-end justify-between px-1 pb-0.5'
        : 'w-4 h-full border-r border-scanr-border/60 flex-col items-end justify-between py-1 pr-0.5'
    ]"
  >
    <template v-if="orientation === 'horizontal'">
      <div v-for="i in ticks" :key="i" class="flex flex-col items-center gap-0.5">
        <span v-if="i % 5 === 1" class="text-[8px] opacity-70">{{ (i - 1) * 10 }}</span>
        <div
          class="w-[1px] bg-scanr-border"
          :class="i % 5 === 1 ? 'h-2 bg-scanr-muted' : 'h-1'"
        ></div>
      </div>
    </template>

    <template v-else>
      <div v-for="i in ticks" :key="i" class="flex items-center gap-0.5">
        <span v-if="i % 5 === 1" class="text-[8px] opacity-70">{{ (i - 1) * 10 }}</span>
        <div
          class="h-[1px] bg-scanr-border"
          :class="i % 5 === 1 ? 'w-2 bg-scanr-muted' : 'w-1'"
        ></div>
      </div>
    </template>
  </div>
</template>
