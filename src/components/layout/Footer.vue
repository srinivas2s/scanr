<script setup lang="ts">
const supportedFormats = [
  'QR Code', 'EAN-13', 'Code 128', 'UPC-A', 'Data Matrix',
  'PDF417', 'Aztec', 'Code 39', 'ITF-14', 'EAN-8', 'UPC-E', 'Codabar'
];
</script>

<template>
  <footer class="mt-20 border-t border-slate-200/80 bg-white/70 backdrop-blur-md font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        
        <!-- Col 1: Identity & Privacy Manifesto -->
        <div class="md:col-span-5 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl clay-btn-amber flex items-center justify-center text-slate-950 font-mono font-black text-sm">
              S
            </div>
            <span class="font-display font-black text-2xl text-slate-900">SCANR</span>
          </div>
          <p class="text-sm text-slate-600 leading-relaxed max-w-sm">
            Fast browser-based barcode scanner and generator. Designed for instant optical decoding and crisp vector asset export with zero telemetry.
          </p>
          <div class="p-4 rounded-2xl clay-card text-xs space-y-1">
            <div class="text-emerald-700 font-bold flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              Local & Private By Default
            </div>
            <p class="text-slate-600 leading-relaxed">
              Camera frames and payload values stay strictly inside your browser. No cloud servers, no trackers, and no telemetry.
            </p>
          </div>
        </div>

        <!-- Col 2: Symbology Standards -->
        <div class="md:col-span-4 space-y-3">
          <div class="text-xs uppercase tracking-wider font-bold text-slate-900">
            Supported Formats
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="format in supportedFormats"
              :key="format"
              class="px-3 py-1 text-xs clay-pill text-slate-800 font-mono font-medium"
            >
              {{ format }}
            </span>
          </div>
        </div>

        <!-- Col 3: Navigation & Fast Access -->
        <div class="md:col-span-3 space-y-3">
          <div class="text-xs uppercase tracking-wider font-bold text-slate-900">
            Navigation
          </div>
          <ul class="space-y-2 text-sm text-slate-600">
            <li>
              <router-link to="/scan" class="hover:text-amber-600 transition-colors flex items-center justify-between py-1 font-medium">
                <span>Scanner (Camera & Image)</span>
                <span class="text-xs font-mono text-slate-400">→</span>
              </router-link>
            </li>
            <li>
              <router-link to="/create" class="hover:text-amber-600 transition-colors flex items-center justify-between py-1 font-medium">
                <span>Barcode Generator (SVG & PNG)</span>
                <span class="text-xs font-mono text-slate-400">→</span>
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="hover:text-amber-600 transition-colors flex items-center justify-between py-1 font-medium">
                <span>Specifications & Privacy</span>
                <span class="text-xs font-mono text-slate-400">→</span>
              </router-link>
            </li>
          </ul>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
        <div>
          <span>SCANR — Universal Barcode Machine</span>
        </div>
        <div class="text-slate-500">
          <span>Local Browser Engine • Client-Side Processing</span>
        </div>
      </div>
    </div>
  </footer>
</template>
