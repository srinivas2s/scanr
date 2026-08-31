<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StatusIndicator from '@/components/ui/StatusIndicator.vue';

const route = useRoute();
const router = useRouter();

const timeString = ref('');
let timer: number | undefined;

const updateTime = () => {
  const now = new Date();
  timeString.value = now.toTimeString().split(' ')[0] + ' UTC';
};

onMounted(() => {
  updateTime();
  timer = window.setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const isMobileMenuOpen = ref(false);

const navItems = [
  { path: '/scan', label: '01 / SCAN', shortLabel: 'SCAN', code: 'SCN' },
  { path: '/create', label: '02 / CREATE', shortLabel: 'CREATE', code: 'CRT' },
  { path: '/about', label: 'ABOUT', shortLabel: 'ABOUT', code: 'ABT' },
];

const navigateTo = (path: string) => {
  isMobileMenuOpen.value = false;
  router.push(path);
};
</script>

<template>
  <header class="sticky top-0 z-50 bg-scanr-black/95 backdrop-blur-md border-b border-scanr-border">
    <!-- Top System Line -->
    <div class="hidden sm:flex items-center justify-between px-4 py-1 bg-scanr-dark border-b border-scanr-border/60 text-[10px] font-mono text-scanr-muted select-none">
      <div class="flex items-center gap-4">
        <StatusIndicator status="online" label="SYSTEM ACTIVE" sublabel="CORE V1.0" />
        <span class="text-scanr-dim">|</span>
        <span class="text-scanr-white/80">READ IT. MAKE IT.</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-scanr-cyan tracking-wider">LAT: OPTICAL_VUE3</span>
        <span class="text-scanr-dim">|</span>
        <span class="text-scanr-yellow font-medium">{{ timeString }}</span>
      </div>
    </div>

    <!-- Main Navigation Bar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        
        <!-- Typographic Logo -->
        <router-link
          to="/"
          class="flex items-center gap-3 group select-none focus:outline-none"
        >
          <div class="relative flex items-center justify-center w-10 h-10 bg-scanr-white text-scanr-black font-mono font-black text-xl tracking-tighter group-hover:bg-scanr-yellow transition-colors border border-scanr-white">
            <span class="z-10 font-mono">S</span>
            <!-- Barcode mini graphic in logo -->
            <div class="absolute inset-0 opacity-15 flex items-center justify-around pointer-events-none px-0.5">
              <span class="w-[2px] h-full bg-scanr-black"></span>
              <span class="w-[1px] h-full bg-scanr-black"></span>
              <span class="w-[3px] h-full bg-scanr-black"></span>
              <span class="w-[1px] h-full bg-scanr-black"></span>
            </div>
          </div>

          <div class="flex flex-col">
            <span class="font-display text-2xl sm:text-3xl font-black tracking-tight text-scanr-white group-hover:text-scanr-yellow transition-colors">
              SCANR
            </span>
            <span class="font-mono text-[9px] uppercase tracking-widest text-scanr-muted -mt-1 hidden sm:block">
              UNIVERSAL BARCODE MACHINE
            </span>
          </div>
        </router-link>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center space-x-1 font-mono text-sm">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="relative px-4 py-2 uppercase tracking-wider font-semibold border transition-all duration-150"
            :class="[
              route.path === item.path
                ? 'bg-scanr-white text-scanr-black border-scanr-white font-bold shadow-[2px_2px_0px_0px_rgba(228,255,26,0.9)]'
                : 'text-scanr-white/80 border-transparent hover:border-scanr-border hover:bg-scanr-elevated hover:text-scanr-white'
            ]"
          >
            <span class="text-[10px] text-scanr-muted mr-1.5 opacity-60" :class="route.path === item.path ? 'text-scanr-black/70' : ''">#{{ item.code }}</span>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- Mobile Navigation Toggle -->
        <div class="flex md:hidden items-center gap-2">
          <router-link
            to="/scan"
            class="px-3 py-1.5 text-xs font-mono font-bold bg-scanr-red text-scanr-white border border-scanr-red active:translate-y-0.5"
          >
            SCAN
          </router-link>
          
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            type="button"
            class="p-2 border border-scanr-border bg-scanr-panel text-scanr-white hover:text-scanr-yellow focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMobileMenuOpen" stroke-linecap="square" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="square" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden border-t border-scanr-border bg-scanr-panel px-4 pt-3 pb-6 space-y-2 font-mono"
    >
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="navigateTo(item.path)"
        class="w-full text-left px-4 py-3 flex items-center justify-between uppercase font-bold border transition-colors"
        :class="[
          route.path === item.path
            ? 'bg-scanr-yellow text-scanr-black border-scanr-yellow'
            : 'text-scanr-white border-scanr-border bg-scanr-dark hover:border-scanr-white'
        ]"
      >
        <span>{{ item.label }}</span>
        <span class="text-xs opacity-60">#{{ item.code }}</span>
      </button>

      <div class="pt-3 border-t border-scanr-border/60 flex items-center justify-between text-[11px] text-scanr-muted">
        <StatusIndicator status="online" label="ENGINE READY" />
        <span class="text-scanr-yellow">{{ timeString }}</span>
      </div>
    </div>
  </header>
</template>
