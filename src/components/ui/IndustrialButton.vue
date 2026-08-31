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
    class="relative inline-flex items-center justify-center font-mono uppercase tracking-wider font-bold transition-all duration-100 select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-scanr-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-scanr-black disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer"
    :class="[
      block ? 'w-full' : '',
      
      // Sizes
      size === 'sm' ? 'text-xs px-3 py-1.5 gap-1.5' :
      size === 'md' ? 'text-sm px-5 py-2.5 gap-2' :
      size === 'lg' ? 'text-base px-7 py-3.5 gap-3 tracking-widest' :
      'text-lg px-9 py-4 gap-3.5 tracking-widest font-black',

      // Variants
      variant === 'primary' ? [
        'bg-scanr-white text-scanr-black border border-scanr-white',
        'hover:bg-scanr-yellow hover:border-scanr-yellow hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.8)]',
        'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
      ] :
      variant === 'acid' ? [
        'bg-scanr-yellow text-scanr-black border-2 border-scanr-yellow shadow-[4px_4px_0px_0px_rgba(228,255,26,0.5)]',
        'hover:bg-scanr-white hover:border-scanr-white hover:text-scanr-black hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.9)]',
        'active:translate-x-[3px] active:translate-y-[3px] active:shadow-none'
      ] :
      variant === 'hazard' ? [
        'bg-scanr-red text-scanr-white border border-scanr-red shadow-[4px_4px_0px_0px_rgba(255,42,0,0.5)]',
        'hover:bg-[#ff4420] hover:shadow-[5px_5px_0px_0px_rgba(255,42,0,0.9)]',
        'active:translate-x-[3px] active:translate-y-[3px] active:shadow-none'
      ] :
      variant === 'secondary' ? [
        'bg-scanr-elevated text-scanr-white border border-scanr-border',
        'hover:border-scanr-white hover:bg-scanr-panel hover:text-scanr-yellow',
        'active:translate-x-[2px] active:translate-y-[2px]'
      ] : [
        'bg-transparent text-scanr-muted border border-transparent',
        'hover:text-scanr-white hover:bg-scanr-elevated/60 hover:border-scanr-border',
        'active:bg-scanr-elevated'
      ],

      // Active state
      active ? 'ring-2 ring-scanr-yellow ring-offset-2 ring-offset-scanr-black bg-scanr-elevated text-scanr-yellow' : ''
    ]"
  >
    <!-- Corner notches -->
    <span class="absolute top-0 right-0 w-1.5 h-1.5 bg-scanr-black border-l border-b border-scanr-border pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></span>
    
    <slot />
  </button>
</template>
