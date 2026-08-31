<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
</script>

<template>
  <div class="min-h-screen bg-scanr-black text-scanr-white flex flex-col selection:bg-scanr-yellow selection:text-scanr-black relative">
    
    <!-- Top Fixed Coordinate Ruler -->
    <div class="hidden xl:flex fixed top-0 left-0 right-0 h-1 bg-scanr-border/40 z-50 pointer-events-none"></div>

    <!-- Navigation Header -->
    <Navbar />

    <!-- Main Content Area with Routing -->
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition
          name="fade"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Global Footer -->
    <Footer />

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
