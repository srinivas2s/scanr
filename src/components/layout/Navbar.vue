<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isMobileMenuOpen = ref(false);

const navItems = [
  { path: '/scan', label: 'Scan', description: 'Camera & Image Scanner' },
  { path: '/create', label: 'Create', description: 'Barcode & QR Generator' },
  { path: '/about', label: 'About', description: 'Privacy & Specs' },
];

const navigateTo = (path: string) => {
  isMobileMenuOpen.value = false;
  router.push(path);
};
</script>

<template>
  <header class="sticky top-2.5 sm:top-4 z-50 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full font-sans select-none">
    
    <!-- Floating Liquid Morphism Navigation Capsule -->
    <div class="liquid-glass-bar rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-200">
      
      <!-- Brand Logo Drop -->
      <router-link
        to="/"
        class="flex items-center gap-3 group focus:outline-none"
      >
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl liquid-logo flex items-center justify-center text-slate-950 font-mono font-black text-lg sm:text-xl group-hover:scale-105 transition-transform">
          <span>S</span>
        </div>

        <div class="flex flex-col">
          <span class="font-display text-lg sm:text-xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
            SCANR
          </span>
          <span class="text-[10px] text-slate-500 -mt-1 tracking-wide font-semibold hidden sm:block">
            Universal Barcode Utility
          </span>
        </div>
      </router-link>

      <!-- Center Segmented Liquid Tabs -->
      <nav class="hidden md:flex items-center p-1 rounded-full liquid-track gap-1">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="px-5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 flex items-center gap-2"
          :class="[
            route.path === item.path
              ? 'liquid-tab-active font-bold text-slate-950 scale-[1.02]'
              : 'text-slate-600 hover:text-slate-950 hover:bg-white/40'
          ]"
        >
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Right Side Action -->
      <div class="hidden sm:flex items-center gap-3">
        <router-link
          v-if="route.path !== '/scan'"
          to="/scan"
          class="px-4 py-1.5 text-xs font-bold rounded-full liquid-btn-amber"
        >
          Open Scanner
        </router-link>
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="flex md:hidden items-center gap-2">
        <router-link
          to="/scan"
          class="px-3.5 py-1.5 text-xs font-bold rounded-full liquid-btn-amber"
        >
          Scan
        </router-link>
        
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          type="button"
          class="p-2 rounded-xl liquid-track text-slate-700 hover:text-slate-950 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

    </div>

    <!-- Mobile Liquid Glass Drawer -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden mt-2 p-3 rounded-2xl liquid-glass-bar space-y-1.5"
    >
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="navigateTo(item.path)"
        class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-all"
        :class="[
          route.path === item.path
            ? 'liquid-btn-amber font-bold text-slate-950'
            : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
        ]"
      >
        <span>{{ item.label }}</span>
        <span class="text-xs opacity-75 font-normal">{{ item.description }}</span>
      </button>

      <div class="pt-2.5 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-500 font-medium px-2">
        <span class="flex items-center gap-1.5 text-emerald-700 font-mono">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Zero-telemetry engine
        </span>
      </div>
    </div>

  </header>
</template>
