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
    class="relative inline-flex items-center justify-center font-semibold select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer font-sans"
    :class="[
      block ? 'w-full' : '',
      
      // Sizes
      size === 'sm' ? 'text-xs px-3.5 py-1.5 gap-1.5 rounded-xl' :
      size === 'md' ? 'text-sm px-5 py-2.5 gap-2 rounded-2xl' :
      size === 'lg' ? 'text-base px-7 py-3.5 gap-2.5 font-bold rounded-2xl' :
      'text-lg px-9 py-4 gap-3 font-extrabold rounded-3xl',

      // Clay Variants
      variant === 'acid' ? 'clay-btn-amber' :
      variant === 'primary' ? 'clay-btn-dark' :
      variant === 'hazard' ? 'clay-btn-red' :
      variant === 'secondary' ? 'clay-btn-white' :
      'bg-transparent text-slate-600 hover:text-slate-950 hover:bg-slate-200/60 rounded-xl transition-colors',

      // Active state
      active ? 'ring-2 ring-amber-500 font-bold' : ''
    ]"
  >
    <slot />
  </button>
</template>
