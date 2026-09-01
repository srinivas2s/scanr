<script setup lang="ts">
import { useRouter } from 'vue-router';
import IndustrialButton from '@/components/ui/IndustrialButton.vue';
import { audioService } from '@/services/audio';

const router = useRouter();

const navigateTo = (path: string) => {
  audioService.playClick();
  router.push(path);
};

const popularFormats = [
  'QR Code', 'EAN-13', 'Code 128', 'UPC-A', 'Data Matrix', 'PDF417', 'Aztec', 'Code 39'
];
</script>

<template>
  <div class="space-y-16 sm:space-y-24 py-8 sm:py-14 font-sans">
    
    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative rounded-3xl bg-gradient-to-br from-white via-amber-50/20 to-sky-50/30 border border-slate-200/80 p-6 sm:p-12 lg:p-16 overflow-hidden shadow-xl shadow-slate-200/50">
        
        <!-- Subtle Ambient Background Accents -->
        <div class="absolute inset-0 tech-grid-bg opacity-40 pointer-events-none"></div>
        <div class="absolute -top-32 -right-32 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <!-- Left Column: Title & Actions -->
          <div class="lg:col-span-7 space-y-6">
            
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>All-In-One Barcode & QR Utility</span>
            </div>

            <div class="space-y-3">
              <h1 class="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-slate-900 tracking-tight leading-[1.05]">
                Scan & Create <br />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600">
                  Barcodes Instantly.
                </span>
              </h1>
              <p class="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-sans">
                Point your camera to decode retail barcodes and QR codes in real-time, or generate crisp downloadable vector SVGs and high-resolution PNG specimens.
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <IndustrialButton
                @click="navigateTo('/scan')"
                variant="acid"
                size="lg"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Launch Scanner</span>
              </IndustrialButton>

              <IndustrialButton
                @click="navigateTo('/create')"
                variant="secondary"
                size="lg"
              >
                <svg class="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Generate Barcode</span>
              </IndustrialButton>
            </div>

            <!-- Key Feature Badges -->
            <div class="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600 font-mono">
              <div class="flex items-center gap-1.5">
                <span class="text-emerald-600 font-bold">✓</span> Real-Time Camera
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-emerald-600 font-bold">✓</span> Drag & Drop Images
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-emerald-600 font-bold">✓</span> SVG & PNG Downloads
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-emerald-600 font-bold">✓</span> Zero Telemetry
              </div>
            </div>

          </div>

          <!-- Right Column: Interactive Live Specimen Card -->
          <div class="lg:col-span-5">
            <div class="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-xl shadow-slate-200/60 relative">
              
              <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span class="text-xs font-semibold text-slate-900">Live Specimen Preview</span>
                </div>
                <span class="text-xs font-mono text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold">CODE 128</span>
              </div>

              <!-- Barcode Display Graphic -->
              <div class="p-6 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                <div class="absolute inset-x-0 h-0.5 laser-line animate-laser"></div>
                
                <svg class="w-full h-24 text-slate-900" viewBox="0 0 300 80" fill="currentColor">
                  <rect x="10" y="5" width="4" height="60"/>
                  <rect x="18" y="5" width="2" height="60"/>
                  <rect x="24" y="5" width="6" height="60"/>
                  <rect x="34" y="5" width="2" height="60"/>
                  <rect x="40" y="5" width="8" height="60"/>
                  <rect x="52" y="5" width="3" height="60"/>
                  <rect x="60" y="5" width="5" height="60"/>
                  <rect x="70" y="5" width="2" height="60"/>
                  <rect x="76" y="5" width="7" height="60"/>
                  <rect x="88" y="5" width="3" height="60"/>
                  <rect x="96" y="5" width="9" height="60"/>
                  <rect x="110" y="5" width="4" height="60"/>
                  <rect x="118" y="5" width="2" height="60"/>
                  <rect x="124" y="5" width="8" height="60"/>
                  <rect x="136" y="5" width="3" height="60"/>
                  <rect x="144" y="5" width="6" height="60"/>
                  <rect x="154" y="5" width="2" height="60"/>
                  <rect x="160" y="5" width="8" height="60"/>
                  <rect x="172" y="5" width="4" height="60"/>
                  <rect x="180" y="5" width="2" height="60"/>
                  <rect x="186" y="5" width="7" height="60"/>
                  <rect x="198" y="5" width="5" height="60"/>
                  <rect x="208" y="5" width="3" height="60"/>
                  <rect x="216" y="5" width="8" height="60"/>
                  <rect x="228" y="5" width="2" height="60"/>
                  <rect x="234" y="5" width="6" height="60"/>
                  <rect x="244" y="5" width="4" height="60"/>
                  <rect x="252" y="5" width="8" height="60"/>
                  <rect x="264" y="5" width="2" height="60"/>
                  <rect x="270" y="5" width="6" height="60"/>
                  <rect x="280" y="5" width="4" height="60"/>
                  <text x="150" y="75" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="11" fill="#b45309" font-weight="bold" letter-spacing="3">
                    SCANR-2026-X01
                  </text>
                </svg>
              </div>

              <!-- Metadata Chips -->
              <div class="grid grid-cols-2 gap-2 text-xs font-mono">
                <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div class="text-[10px] text-slate-500 uppercase">Payload</div>
                  <div class="text-slate-900 font-medium truncate">SCANR-2026-X01</div>
                </div>
                <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div class="text-[10px] text-slate-500 uppercase">Processing</div>
                  <div class="text-emerald-700 font-medium">Local Browser</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Two Core Workflows Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      <div class="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900">Choose a Mode</h2>
          <p class="text-sm text-slate-500">Scan an existing code or create a new one.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Card 1: SCAN -->
        <div
          @click="navigateTo('/scan')"
          class="rounded-2xl bg-white border border-slate-200 hover:border-amber-400 p-8 space-y-6 cursor-pointer transition-all duration-200 group hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-0.5 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-xs font-mono text-amber-800 font-semibold px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">01 / SCANNER</span>
          </div>

          <div class="space-y-2">
            <h3 class="font-display font-bold text-2xl text-slate-900 group-hover:text-amber-600 transition-colors">
              Scan a Code
            </h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Use your webcam, mobile camera, or upload image files to decode retail barcodes, QR codes, and 2D matrices instantly.
            </p>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
            <div class="flex items-center gap-2">
              <span class="text-emerald-600 font-bold">✓</span> Real-time camera autofocus & flash torch
            </div>
            <div class="flex items-center gap-2">
              <span class="text-emerald-600 font-bold">✓</span> Drag & drop or paste from clipboard (<kbd class="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px] text-slate-800 shadow-xs">Ctrl+V</kbd>)
            </div>
            <div class="flex items-center gap-2">
              <span class="text-emerald-600 font-bold">✓</span> Smart actions for URLs, GTINs, and text
            </div>
          </div>

          <div class="flex items-center gap-2 text-sm font-semibold text-amber-600 group-hover:translate-x-1 transition-transform">
            <span>Open Scanner</span>
            <span>→</span>
          </div>
        </div>

        <!-- Card 2: CREATE -->
        <div
          @click="navigateTo('/create')"
          class="rounded-2xl bg-white border border-slate-200 hover:border-sky-400 p-8 space-y-6 cursor-pointer transition-all duration-200 group hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-0.5 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <div class="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span class="text-xs font-mono text-sky-800 font-semibold px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200">02 / GENERATOR</span>
          </div>

          <div class="space-y-2">
            <h3 class="font-display font-bold text-2xl text-slate-900 group-hover:text-sky-600 transition-colors">
              Create a Barcode
            </h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Generate certified 1D and 2D barcodes with real-time checksum calculation and download vector SVGs or high-res PNGs.
            </p>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
            <div class="flex items-center gap-2">
              <span class="text-emerald-600 font-bold">✓</span> 12+ formats (QR, EAN-13, Code 128, UPC-A...)
            </div>
            <div class="flex items-center gap-2">
              <span class="text-emerald-600 font-bold">✓</span> Mod-10 checksum autofill & instant validation
            </div>
            <div class="flex items-center gap-2">
              <span class="text-emerald-600 font-bold">✓</span> Color themes, scale adjustments & SVG export
            </div>
          </div>

          <div class="flex items-center gap-2 text-sm font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
            <span>Open Generator</span>
            <span>→</span>
          </div>
        </div>

      </div>
    </section>

    <!-- Supported Symbologies Strip -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 class="text-sm font-semibold text-slate-900 uppercase tracking-wider">
            Supported Formats & Standards
          </h3>
          <span class="text-xs text-slate-500 font-mono">100% Client-Side Engine</span>
        </div>

        <div class="flex flex-wrap gap-2">
          <span
            v-for="fmt in popularFormats"
            :key="fmt"
            class="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800"
          >
            {{ fmt }}
          </span>
          <router-link
            to="/about"
            class="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-400 text-xs font-mono text-amber-700 hover:text-amber-800 transition-colors font-medium"
          >
            + View Full Specifications →
          </router-link>
        </div>
      </div>
    </section>

  </div>
</template>
