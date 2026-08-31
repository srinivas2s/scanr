import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ScanView from '@/views/ScanView.vue';
import CreateView from '@/views/CreateView.vue';
import AboutView from '@/views/AboutView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'SCANR — Universal Barcode Scanner & Generator' },
    },
    {
      path: '/scan',
      name: 'scan',
      component: ScanView,
      meta: { title: '01 / SCAN — SCANR Optical Reader' },
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView,
      meta: { title: '02 / CREATE — SCANR Specimen Generator' },
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
      meta: { title: 'ABOUT — SCANR Architecture & Manifesto' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

router.beforeEach((to, _from, next) => {
  if (to.meta.title && typeof to.meta.title === 'string') {
    document.title = to.meta.title;
  }
  next();
});

export default router;
