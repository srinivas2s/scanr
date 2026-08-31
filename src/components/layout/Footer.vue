<script setup lang="ts">
import TechnicalLabel from '@/components/ui/TechnicalLabel.vue';
import MeasurementRuler from '@/components/ui/MeasurementRuler.vue';

const supportedFormats = [
  'EAN-13', 'EAN-8', 'UPC-A', 'UPC-E', 'CODE 128', 'CODE 39',
  'ITF-14', 'CODABAR', 'QR CODE', 'DATA MATRIX', 'PDF417', 'AZTEC'
];
</script>

<template>
  <footer class="mt-20 border-t border-scanr-border bg-scanr-dark/90 relative overflow-hidden font-mono">
    <!-- Top Measurement Tick Line -->
    <MeasurementRuler orientation="horizontal" :ticks="36" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        
        <!-- Col 1: Identity & Brand Manifesto -->
        <div class="md:col-span-5 space-y-4">
          <div class="flex items-center gap-3">
            <span class="font-display font-black text-2xl tracking-tighter text-scanr-white">SCANR</span>
            <TechnicalLabel code="SPEC-01" label="INDUSTRIAL ENGINE" variant="accent" />
          </div>
          <p class="text-sm font-sans text-scanr-muted leading-relaxed max-w-sm">
            Universal browser-based optical barcode reader and technical specimen generator. Engineered for optical fidelity and zero-telemetry local processing.
          </p>
          <div class="p-3 bg-scanr-panel border border-scanr-border text-xs space-y-1">
            <div class="text-scanr-yellow font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>●</span> LOCAL BY DEFAULT
            </div>
            <p class="text-scanr-muted text-[11px] font-sans">
              Camera frames and encoded values are computed 100% in your browser. No images or barcode payloads are sent to any external server.
            </p>
          </div>
        </div>

        <!-- Col 2: Symbology Standards -->
        <div class="md:col-span-4 space-y-3">
          <div class="text-xs uppercase tracking-widest font-bold text-scanr-white border-b border-scanr-border pb-1">
            SUPPORTED SYMBOLOGIES
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="format in supportedFormats"
              :key="format"
              class="px-2 py-1 text-[10px] bg-scanr-panel border border-scanr-border text-scanr-paper font-semibold tracking-wider"
            >
              {{ format }}
            </span>
          </div>
        </div>

        <!-- Col 3: Navigation & Fast Access -->
        <div class="md:col-span-3 space-y-3">
          <div class="text-xs uppercase tracking-widest font-bold text-scanr-white border-b border-scanr-border pb-1">
            SYSTEM ROUTING
          </div>
          <ul class="space-y-1.5 text-xs text-scanr-muted">
            <li>
              <router-link to="/scan" class="hover:text-scanr-yellow flex items-center justify-between py-1 border-b border-scanr-border/40">
                <span>01 // OPTICAL SCANNER</span>
                <span class="text-[10px] text-scanr-dim">[/scan]</span>
              </router-link>
            </li>
            <li>
              <router-link to="/create" class="hover:text-scanr-yellow flex items-center justify-between py-1 border-b border-scanr-border/40">
                <span>02 // SPECIMEN CREATOR</span>
                <span class="text-[10px] text-scanr-dim">[/create]</span>
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="hover:text-scanr-yellow flex items-center justify-between py-1 border-b border-scanr-border/40">
                <span>03 // MANIFESTO & PRIVACY</span>
                <span class="text-[10px] text-scanr-dim">[/about]</span>
              </router-link>
            </li>
          </ul>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="mt-10 pt-6 border-t border-scanr-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-scanr-dim">
        <div class="flex items-center gap-3">
          <span>SCANR / SYSTEM-01</span>
          <span>•</span>
          <span>BUILD: 2026.1-STABLE</span>
          <span>•</span>
          <span>VUE 3 + TYPESCRIPT + FLASK</span>
        </div>
        <div class="text-right">
          <span>READ IT. MAKE IT. — ONE TOOL FOR EVERYTHING ENCODED.</span>
        </div>
      </div>
    </div>
  </footer>
</template>
