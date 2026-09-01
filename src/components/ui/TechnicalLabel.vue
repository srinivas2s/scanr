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
  <span
    class="inline-flex items-center gap-1.5 font-mono select-none transition-transform font-semibold"
    :class="[
      size === 'xs' ? 'text-[11px] px-2.5 py-1' : size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2',
      variant === 'default'
        ? 'clay-pill text-slate-700'
        : variant === 'accent'
        ? 'clay-pill-amber'
        : variant === 'hazard'
        ? 'bg-red-50 text-red-700 border border-red-200 rounded-full shadow-xs'
        : variant === 'cyan'
        ? 'clay-pill-sky'
        : 'text-slate-600 bg-transparent'
    ]"
  >
    <span v-if="code" class="opacity-75 font-mono">{{ code }}</span>
    <span v-if="code && label" class="opacity-40">•</span>
    <span class="truncate">{{ label }}</span>
  </span>
</template>
