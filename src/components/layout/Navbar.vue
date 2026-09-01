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
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-18">
        
        <!-- Brand Logo -->
        <router-link
          to="/"
          class="flex items-center gap-3 group select-none focus:outline-none"
        >
          <div class="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-mono font-black text-xl shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <span>S</span>
          </div>

          <div class="flex flex-col">
            <span class="font-display text-xl font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
              SCANR
            </span>
            <span class="text-[10px] text-slate-500 -mt-0.5 tracking-wide hidden sm:block">
              Universal Barcode Utility
            </span>
          </div>
        </router-link>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200/80">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-2"
            :class="[
              route.path === item.path
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            ]"
          >
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- Right Side Badge & CTA -->
        <div class="hidden sm:flex items-center gap-3">
          <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>100% In-Browser</span>
          </div>

          <router-link
            v-if="route.path !== '/scan'"
            to="/scan"
            class="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-xs"
          >
            Open Scanner
          </router-link>
        </div>

        <!-- Mobile Menu Toggle -->
        <div class="flex md:hidden items-center gap-2">
          <router-link
            to="/scan"
            class="px-3 py-1 text-xs font-bold rounded-lg bg-amber-400 text-slate-950"
          >
            Scan
          </router-link>
          
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            type="button"
            class="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-5 space-y-1.5 shadow-lg"
    >
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="navigateTo(item.path)"
        class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-colors"
        :class="[
          route.path === item.path
            ? 'bg-amber-400 text-slate-950 font-bold'
            : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
        ]"
      >
        <span>{{ item.label }}</span>
        <span class="text-xs opacity-70">{{ item.description }}</span>
      </button>

      <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span class="flex items-center gap-1.5 text-emerald-700 font-mono">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Zero-telemetry local engine
        </span>
      </div>
    </div>
  </header>
</template>
