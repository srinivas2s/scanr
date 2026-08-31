<script setup lang="ts">
interface Props {
  status?: 'online' | 'active' | 'warning' | 'error' | 'idle' | 'standby';
  label?: string;
  sublabel?: string;
  pulse?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  status: 'online',
  label: '',
  sublabel: '',
  pulse: true,
});

const getStatusColor = () => {
  switch (props.status) {
    case 'online':
    case 'active':
      return 'bg-scanr-green text-scanr-green shadow-[0_0_8px_rgba(0,255,102,0.8)]';
    case 'warning':
      return 'bg-scanr-yellow text-scanr-yellow shadow-[0_0_8px_rgba(228,255,26,0.8)]';
    case 'error':
      return 'bg-scanr-red text-scanr-red shadow-[0_0_8px_rgba(255,42,0,0.8)]';
    case 'standby':
      return 'bg-scanr-cyan text-scanr-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)]';
    case 'idle':
    default:
      return 'bg-scanr-dim text-scanr-muted';
  }
};
</script>

<template>
  <div class="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider select-none">
    <div class="relative flex items-center justify-center">
      <span
        v-if="pulse && (status === 'online' || status === 'active')"
        class="absolute w-2.5 h-2.5 rounded-full animate-ping opacity-75"
        :class="getStatusColor()"
      ></span>
      <span
        class="w-2 h-2 rounded-full inline-block"
        :class="getStatusColor()"
      ></span>
    </div>
    <div class="flex items-center gap-1.5">
      <span v-if="label" class="font-bold text-scanr-white">{{ label }}</span>
      <span v-if="sublabel" class="text-scanr-muted font-normal">[{{ sublabel }}]</span>
    </div>
  </div>
</template>
