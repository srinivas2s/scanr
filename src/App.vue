<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
</script>

<template>
  <div class="min-h-screen text-slate-900 flex flex-col selection:bg-amber-300 selection:text-slate-950 font-sans bg-transparent">
    
    <!-- Navigation Header -->
    <Navbar />

    <!-- Main Content Area with Smooth Page Routing Transitions -->
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
