<script setup lang="ts">
import { useRouter } from 'vue-router';
import TechnicalLabel from '@/components/ui/TechnicalLabel.vue';
import IndustrialButton from '@/components/ui/IndustrialButton.vue';
import CropMarks from '@/components/ui/CropMarks.vue';
import { audioService } from '@/services/audio';

const router = useRouter();

const navigateTo = (path: string) => {
  audioService.playClick();
  router.push(path);
};

const tickerItems = [
  'EAN-13 RETAIL STANDARD',
  'GS1 COMPLIANT',
  'CODE 128 LOGISTICS',
  'ISO/IEC 18004 QR CODE',
  'DATA MATRIX HIGH-DENSITY',
  'PDF417 MANIFEST',
  'LOCAL BROWSER PROCESSING',
  'ZERO CLOUD TELEMETRY',
  'READ IT. MAKE IT.',
];
</script>

<template>
  <div class="space-y-16 sm:space-y-24 py-6 sm:py-10">
    
    <!-- Top System Ticker Bar -->
    <div class="border-y border-scanr-border bg-scanr-dark overflow-hidden py-2 select-none">
      <div class="flex items-center gap-8 whitespace-nowrap animate-ticker font-mono text-xs text-scanr-muted">
        <div v-for="(item, index) in [...tickerItems, ...tickerItems]" :key="index" class="flex items-center gap-4">
          <span class="text-scanr-yellow font-bold">●</span>
          <span class="tracking-widest uppercase font-semibold">{{ item }}</span>
          <span class="text-scanr-dim">///</span>
        </div>
      </div>
    </div>

    <!-- Editorial Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative border-2 border-scanr-border bg-scanr-panel p-6 sm:p-10 lg:p-14 overflow-hidden">
        
        <!-- Outer Corner Crop Marks -->
        <CropMarks size="lg" color="border-scanr-yellow" />

        <!-- Background Architectural Grid & Barcode Striping -->
        <div class="absolute inset-0 tech-grid-bg opacity-30 pointer-events-none"></div>
        <div class="absolute top-0 right-0 w-1/3 h-full opacity-5 bg-barcode-stripes-light pointer-events-none hidden md:block"></div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          <!-- Left Column: Giant Typography & Manifesto -->
          <div class="lg:col-span-7 space-y-6">
            
            <div class="flex flex-wrap items-center gap-3">
              <TechnicalLabel code="SYS-01" label="OPTICAL APPARATUS" variant="hazard" />
              <span class="text-scanr-dim font-mono text-xs hidden sm:inline">|</span>
              <span class="font-mono text-xs text-scanr-yellow uppercase tracking-widest font-bold">
                UNIVERSAL ENCODED MACHINE
              </span>
            </div>

            <div class="space-y-2">
              <h1 class="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter text-scanr-white uppercase leading-[0.9]">
                READ IT.<br />
                <span class="text-scanr-yellow">MAKE IT.</span>
              </h1>
              <p class="font-mono text-base sm:text-xl text-scanr-paper font-bold tracking-tight uppercase pt-2">
                ONE TOOL FOR EVERYTHING ENCODED.
              </p>
            </div>

            <p class="font-sans text-sm sm:text-base text-scanr-muted max-w-xl leading-relaxed">
              Industrial-grade browser barcode utility. Point your camera to instantly decode optical symbologies, or encode payloads into crisp downloadable SVG and high-resolution PNG specimens.
            </p>

            <!-- Fast Dual Action Buttons -->
            <div class="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <IndustrialButton
                @click="navigateTo('/scan')"
                variant="hazard"
                size="lg"
              >
                <span class="text-xs font-mono opacity-80 mr-1">01</span>
                <span>LAUNCH SCANNER</span>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="square" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </IndustrialButton>

              <IndustrialButton
                @click="navigateTo('/create')"
                variant="acid"
                size="lg"
              >
                <span class="text-xs font-mono opacity-80 mr-1">02</span>
                <span>GENERATE CODE</span>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="square" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </IndustrialButton>
            </div>

          </div>

          <!-- Right Column: Interactive Industrial Specimen Card -->
          <div class="lg:col-span-5">
            <div class="bg-scanr-dark border-2 border-scanr-white shadow-[8px_8px_0px_0px_rgba(228,255,26,0.9)] p-6 space-y-5 font-mono relative">
              <CropMarks size="md" color="border-scanr-yellow" />

              <div class="flex items-center justify-between border-b border-scanr-border pb-3">
                <span class="text-xs font-bold uppercase text-scanr-white">OPTICAL MATRIX DEMO</span>
                <TechnicalLabel code="LIVE" label="DECODED" variant="accent" size="xs" />
              </div>

              <!-- Decorative Stylized Barcode Block -->
              <div class="p-6 bg-scanr-black border border-scanr-border/80 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                <div class="absolute inset-x-0 h-0.5 laser-line animate-laser"></div>
                
                <!-- Stylized Barcode SVG Visual -->
                <svg class="w-full h-24 text-scanr-white" viewBox="0 0 300 80" fill="currentColor">
                  <!-- Barcode Bars -->
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
                  <!-- Text below -->
                  <text x="150" y="75" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="11" fill="#e4ff1a" letter-spacing="4">
                    SCANR-2026-X01
                  </text>
                </svg>
              </div>

              <div class="space-y-2 text-xs">
                <div class="flex items-center justify-between py-1 border-b border-scanr-border/60">
                  <span class="text-scanr-dim">PAYLOAD:</span>
                  <span class="text-scanr-yellow font-bold">SCANR-2026-X01</span>
                </div>
                <div class="flex items-center justify-between py-1 border-b border-scanr-border/60">
                  <span class="text-scanr-dim">FORMAT:</span>
                  <span class="text-scanr-white">CODE 128 / AUTO</span>
                </div>
                <div class="flex items-center justify-between py-1 border-b border-scanr-border/60">
                  <span class="text-scanr-dim">PROCESSING:</span>
                  <span class="text-scanr-green">LOCAL IN-BROWSER</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom Measurement Coordinate Strip -->
        <div class="mt-10 pt-4 border-t border-scanr-border flex items-center justify-between text-[10px] font-mono text-scanr-dim">
          <span>COORDINATES: LAT-VUE-01 // LNG-TAILWIND-02</span>
          <span>OPTICAL_INSPECTION_CORE</span>
        </div>

      </div>
    </section>

    <!-- Two Core Experiences Feature Cards -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      <div class="flex items-center justify-between border-b-2 border-scanr-border pb-3 font-mono">
        <div class="flex items-center gap-2">
          <span class="text-scanr-yellow font-bold">●</span>
          <span class="text-sm font-bold uppercase tracking-widest text-scanr-white">
            THE DUAL ARCHITECTURE
          </span>
        </div>
        <span class="text-xs text-scanr-muted">01 // SCAN • 02 // CREATE</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Card 01: SCAN -->
        <div
          @click="navigateTo('/scan')"
          class="bg-scanr-panel border-2 border-scanr-border hover:border-scanr-yellow p-8 space-y-6 cursor-pointer transition-all duration-200 group relative shadow-[6px_6px_0px_0px_rgba(43,47,61,0.7)] hover:shadow-[6px_6px_0px_0px_rgba(228,255,26,0.8)]"
        >
          <CropMarks size="lg" color="border-scanr-border group-hover:border-scanr-yellow" />

          <div class="flex items-center justify-between font-mono">
            <span class="text-4xl sm:text-5xl font-black text-scanr-yellow">01</span>
            <TechnicalLabel code="SCN" label="OPTICAL INPUT" variant="hazard" />
          </div>

          <div class="space-y-2">
            <h2 class="font-display font-black text-3xl sm:text-4xl text-scanr-white uppercase group-hover:text-scanr-yellow transition-colors">
              SCAN A CODE
            </h2>
            <p class="font-sans text-sm text-scanr-muted leading-relaxed">
              Use your device camera or upload image files to decode 1D retail barcodes and 2D QR matrices with instant specimen lock-on.
            </p>
          </div>

          <div class="p-4 bg-scanr-dark border border-scanr-border/80 font-mono text-xs space-y-2 text-scanr-muted">
            <div class="flex items-center gap-2 text-scanr-white">
              <span class="text-scanr-green">✓</span> Real-Time Rear Camera Autofocus
            </div>
            <div class="flex items-center gap-2 text-scanr-white">
              <span class="text-scanr-green">✓</span> Drag & Drop / Clipboard Paste
            </div>
            <div class="flex items-center gap-2 text-scanr-white">
              <span class="text-scanr-green">✓</span> Smart URL, GTIN, & Wi-Fi Parsing
            </div>
          </div>

          <div class="pt-2">
            <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-scanr-yellow group-hover:translate-x-1 transition-transform">
              <span>ENTER SCANNER VIEW</span>
              <span>→</span>
            </div>
          </div>
        </div>

        <!-- Card 02: CREATE -->
        <div
          @click="navigateTo('/create')"
          class="bg-scanr-panel border-2 border-scanr-border hover:border-scanr-white p-8 space-y-6 cursor-pointer transition-all duration-200 group relative shadow-[6px_6px_0px_0px_rgba(43,47,61,0.7)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]"
        >
          <CropMarks size="lg" color="border-scanr-border group-hover:border-scanr-white" />

          <div class="flex items-center justify-between font-mono">
            <span class="text-4xl sm:text-5xl font-black text-scanr-white">02</span>
            <TechnicalLabel code="CRT" label="ENCODING OUTPUT" variant="accent" />
          </div>

          <div class="space-y-2">
            <h2 class="font-display font-black text-3xl sm:text-4xl text-scanr-white uppercase group-hover:text-scanr-yellow transition-colors">
              MAKE A CODE
            </h2>
            <p class="font-sans text-sm text-scanr-muted leading-relaxed">
              Enter text or numeric values to generate verified barcode specimens with live preview, vector SVG, and high-res PNG downloads.
            </p>
          </div>

          <div class="p-4 bg-scanr-dark border border-scanr-border/80 font-mono text-xs space-y-2 text-scanr-muted">
            <div class="flex items-center gap-2 text-scanr-white">
              <span class="text-scanr-green">✓</span> 12+ 1D & 2D Symbologies
            </div>
            <div class="flex items-center gap-2 text-scanr-white">
              <span class="text-scanr-green">✓</span> Instant Checksum Validation (Mod-10)
            </div>
            <div class="flex items-center gap-2 text-scanr-white">
              <span class="text-scanr-green">✓</span> Lossless SVG & High-DPI PNG Export
            </div>
          </div>

          <div class="pt-2">
            <div class="inline-flex items-center gap-2 font-mono text-xs font-bold text-scanr-white group-hover:text-scanr-yellow group-hover:translate-x-1 transition-all">
              <span>ENTER GENERATOR VIEW</span>
              <span>→</span>
            </div>
          </div>
        </div>

      </div>

    </section>

    <!-- Privacy & Architecture Manifesto Banner -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="border-2 border-scanr-border bg-scanr-dark p-6 sm:p-10 font-mono relative">
        <CropMarks size="md" color="border-scanr-white/30" />
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div class="md:col-span-8 space-y-2">
            <div class="flex items-center gap-2">
              <TechnicalLabel code="PRIVACY" label="ZERO TELEMETRY" variant="accent" />
              <span class="text-xs font-bold uppercase text-scanr-yellow">LOCAL BY DEFAULT.</span>
            </div>
            <h3 class="font-display font-black text-2xl text-scanr-white uppercase">
              YOUR CAMERA AND DATA STAY ON YOUR MACHINE.
            </h3>
            <p class="font-sans text-xs sm:text-sm text-scanr-muted leading-relaxed">
              Camera frames and payload values are processed 100% locally in your browser. SCANR does not need an account, database, or cloud server to decode or generate machine-readable marks.
            </p>
          </div>

          <div class="md:col-span-4 flex justify-start md:justify-end">
            <IndustrialButton
              @click="navigateTo('/about')"
              variant="secondary"
              size="md"
            >
              READ FULL MANIFESTO
            </IndustrialButton>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
