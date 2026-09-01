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
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        
        <!-- Brand Logo -->
        <router-link
          to="/"
          class="flex items-center gap-3.5 group select-none focus:outline-none"
        >
          <div class="w-10 h-10 rounded-2xl clay-btn-amber flex items-center justify-center text-slate-950 font-mono font-black text-xl group-hover:scale-105 transition-transform">
            <span>S</span>
          </div>

          <div class="flex flex-col">
            <span class="font-display text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
              SCANR
            </span>
            <span class="text-[10px] text-slate-500 -mt-1 tracking-wide font-medium hidden sm:block">
              Universal Barcode Utility
            </span>
          </div>
        </router-link>

        <!-- Desktop Navigation Links with Clay Inset Well -->
        <nav class="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl clay-inset">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="px-4 py-1.5 text-sm font-medium rounded-xl transition-all duration-150 flex items-center gap-2"
            :class="[
              route.path === item.path
                ? 'clay-btn-white text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-white/50'
            ]"
          >
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- Right Side Badge & CTA -->
        <div class="hidden sm:flex items-center gap-3">
          <div class="flex items-center gap-2 px-3.5 py-1.5 clay-pill-emerald text-xs font-mono font-semibold">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>100% In-Browser</span>
          </div>

          <router-link
            v-if="route.path !== '/scan'"
            to="/scan"
            class="px-4 py-2 text-xs font-bold clay-btn-amber"
          >
            Open Scanner
          </router-link>
        </div>

        <!-- Mobile Menu Toggle -->
        <div class="flex md:hidden items-center gap-2">
          <router-link
            to="/scan"
            class="px-3.5 py-1.5 text-xs font-bold clay-btn-amber"
          >
            Scan
          </router-link>
          
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            type="button"
            class="p-2.5 rounded-xl clay-btn-white text-slate-700 hover:text-slate-950 focus:outline-none"
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
      class="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-xl"
    >
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="navigateTo(item.path)"
        class="w-full text-left px-4 py-3 rounded-2xl text-sm font-medium flex items-center justify-between transition-all"
        :class="[
          route.path === item.path
            ? 'clay-btn-amber font-bold text-slate-950'
            : 'clay-btn-white text-slate-700 hover:text-slate-950'
        ]"
      >
        <span>{{ item.label }}</span>
        <span class="text-xs opacity-75 font-normal">{{ item.description }}</span>
      </button>

      <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span class="flex items-center gap-1.5 text-emerald-700 font-mono font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Zero-telemetry local engine
        </span>
      </div>
    </div>
  </header>
</template>
