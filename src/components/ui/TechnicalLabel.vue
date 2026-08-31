<script setup lang="ts">
interface Props {
  code?: string;
  label: string;
  variant?: 'default' | 'accent' | 'hazard' | 'cyan' | 'ghost';
  size?: 'xs' | 'sm' | 'md';
}

withDefaults(defineProps<Props>(), {
  code: '',
  variant: 'default',
  size: 'xs',
});
</script>

<template>
  <div
    class="inline-flex items-center gap-1.5 font-mono uppercase tracking-widest font-semibold select-none border transition-colors"
    :class="[
      size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1',
      variant === 'default'
        ? 'bg-scanr-dark border-scanr-border text-scanr-muted'
        : variant === 'accent'
        ? 'bg-scanr-yellow text-scanr-black border-scanr-yellow font-bold'
        : variant === 'hazard'
        ? 'bg-scanr-red text-scanr-white border-scanr-red font-bold'
        : variant === 'cyan'
        ? 'bg-scanr-cyan/10 text-scanr-cyan border-scanr-cyan/30'
        : 'border-transparent text-scanr-dim bg-transparent'
    ]"
  >
    <span v-if="code" class="opacity-70 font-normal">#{{ code }}</span>
    <span class="truncate">{{ label }}</span>
  </div>
</template>
