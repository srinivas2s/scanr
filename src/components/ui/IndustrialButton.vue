<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'hazard' | 'acid' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  active?: boolean;
  type?: 'button' | 'submit' | 'reset';
  block?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  active: false,
  type: 'button',
  block: false,
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    @click="$emit('click', $event)"
    class="relative inline-flex items-center justify-center font-medium transition-all duration-150 select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer rounded-xl font-sans"
    :class="[
      block ? 'w-full' : '',
      
      // Sizes
      size === 'sm' ? 'text-xs px-3 py-1.5 gap-1.5 rounded-lg' :
      size === 'md' ? 'text-sm px-4 py-2.5 gap-2' :
      size === 'lg' ? 'text-base px-6 py-3.5 gap-2.5 font-semibold' :
      'text-lg px-8 py-4 gap-3 font-bold',

      // Variants
      variant === 'primary' ? [
        'bg-slate-900 text-white font-semibold shadow-sm',
        'hover:bg-slate-800 hover:shadow-md hover:shadow-slate-900/10',
        'active:scale-[0.98]'
      ] :
      variant === 'acid' ? [
        'bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-500/20',
        'hover:bg-amber-300 hover:shadow-md hover:shadow-amber-500/30',
        'active:scale-[0.98]'
      ] :
      variant === 'hazard' ? [
        'bg-red-600 text-white font-semibold shadow-sm shadow-red-500/20',
        'hover:bg-red-500 hover:shadow-md hover:shadow-red-500/30',
        'active:scale-[0.98]'
      ] :
      variant === 'secondary' ? [
        'bg-white text-slate-800 border border-slate-200 shadow-xs',
        'hover:bg-slate-50 hover:border-slate-300 hover:text-slate-950',
        'active:scale-[0.98]'
      ] : [
        'bg-transparent text-slate-600',
        'hover:text-slate-900 hover:bg-slate-100',
        'active:scale-[0.98]'
      ],

      // Active state
      active ? 'ring-2 ring-amber-400 bg-slate-100 text-slate-950 font-semibold' : ''
    ]"
  >
    <slot />
  </button>
</template>
