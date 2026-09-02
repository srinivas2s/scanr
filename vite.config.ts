import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-zxing': ['@zxing/library', '@zxing/browser'],
          'vendor-bwip': ['bwip-js'],
          'vendor-vue': ['vue', 'vue-router'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
