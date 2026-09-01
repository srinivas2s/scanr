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
    class="inline-flex items-center gap-1.5 font-mono select-none rounded-md transition-colors font-medium"
    :class="[
      size === 'xs' ? 'text-[11px] px-2 py-0.5' : size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5',
      variant === 'default'
        ? 'bg-slate-100 border border-slate-200 text-slate-700'
        : variant === 'accent'
        ? 'bg-amber-50 border border-amber-200 text-amber-800 font-semibold'
        : variant === 'hazard'
        ? 'bg-red-50 border border-red-200 text-red-700 font-semibold'
        : variant === 'cyan'
        ? 'bg-sky-50 border border-sky-200 text-sky-700 font-semibold'
        : 'text-slate-600 bg-transparent'
    ]"
  >
    <span v-if="code" class="opacity-75 font-mono">{{ code }}</span>
    <span v-if="code && label" class="opacity-40">•</span>
    <span class="truncate">{{ label }}</span>
  </span>
</template>
