<script setup lang="ts">
const supportedFormats = [
  'QR Code', 'EAN-13', 'Code 128', 'UPC-A', 'Data Matrix',
  'PDF417', 'Aztec', 'Code 39', 'ITF-14', 'EAN-8', 'UPC-E', 'Codabar'
];
</script>

<template>
  <footer class="mt-20 border-t border-slate-200 bg-white font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        
        <!-- Col 1: Identity & Privacy Manifesto -->
        <div class="md:col-span-5 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-mono font-black text-sm">
              S
            </div>
            <span class="font-display font-bold text-xl text-slate-900">SCANR</span>
          </div>
          <p class="text-sm text-slate-600 leading-relaxed max-w-sm">
            Fast browser-based barcode scanner and generator. Designed for instant optical decoding and crisp vector asset export with zero telemetry.
          </p>
          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div class="text-emerald-700 font-semibold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Local & Private By Default
            </div>
            <p class="text-slate-600 leading-relaxed">
              Camera frames and payload values stay strictly inside your browser. No cloud servers, no trackers, and no telemetry.
            </p>
          </div>
        </div>

        <!-- Col 2: Symbology Standards -->
        <div class="md:col-span-4 space-y-3">
          <div class="text-xs uppercase tracking-wider font-semibold text-slate-900">
            Supported Formats
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="format in supportedFormats"
              :key="format"
              class="px-2.5 py-1 text-xs rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-mono"
            >
              {{ format }}
            </span>
          </div>
        </div>

        <!-- Col 3: Navigation & Fast Access -->
        <div class="md:col-span-3 space-y-3">
          <div class="text-xs uppercase tracking-wider font-semibold text-slate-900">
            Navigation
          </div>
          <ul class="space-y-2 text-sm text-slate-600">
            <li>
              <router-link to="/scan" class="hover:text-amber-600 transition-colors flex items-center justify-between py-1">
                <span>Scanner (Camera & Image)</span>
                <span class="text-xs font-mono text-slate-400">→</span>
              </router-link>
            </li>
            <li>
              <router-link to="/create" class="hover:text-amber-600 transition-colors flex items-center justify-between py-1">
                <span>Barcode Generator (SVG & PNG)</span>
                <span class="text-xs font-mono text-slate-400">→</span>
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="hover:text-amber-600 transition-colors flex items-center justify-between py-1">
                <span>Specifications & Privacy</span>
                <span class="text-xs font-mono text-slate-400">→</span>
              </router-link>
            </li>
          </ul>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
