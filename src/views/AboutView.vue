<script setup lang="ts">
import TechnicalLabel from '@/components/ui/TechnicalLabel.vue';
import CropMarks from '@/components/ui/CropMarks.vue';

const symbologyCatalog = [
  { name: 'EAN-13', type: '1D Linear', standard: 'ISO/IEC 15420', usage: 'International retail merchandise & consumer goods', capacity: '13 numeric digits' },
  { name: 'CODE 128', type: '1D Linear', standard: 'ISO/IEC 15417', usage: 'Logistics, supply chain, packaging, asset tracking', capacity: 'Full ASCII (128 chars)' },
  { name: 'QR CODE', type: '2D Matrix', standard: 'ISO/IEC 18004', usage: 'URLs, mobile data, credentials, payments', capacity: 'Up to 7,089 numeric / 4,296 alpha' },
  { name: 'DATA MATRIX', type: '2D Matrix', standard: 'ISO/IEC 16022', usage: 'Semiconductors, aerospace parts, medical devices', capacity: 'Up to 3,116 numeric / 2,335 alpha' },
  { name: 'UPC-A', type: '1D Linear', standard: 'ANSI MH10.8M', usage: 'North American retail point-of-sale', capacity: '12 numeric digits' },
  { name: 'PDF417', type: 'Stacked 2D', standard: 'ISO/IEC 15438', usage: 'Boarding passes, transport manifests, state IDs', capacity: 'Up to 1.1 KB data' },
  { name: 'AZTEC CODE', type: '2D Matrix', standard: 'ISO/IEC 24778', usage: 'Airline ticketing, railway passes, transit systems', capacity: 'Up to 3,832 numeric / 3,067 alpha' },
  { name: 'CODE 39', type: '1D Linear', standard: 'ISO/IEC 16388', usage: 'Automotive manufacturing, US DoD inventory', capacity: 'Alphanumeric + 7 symbols' },
  { name: 'ITF-14', type: '1D Linear', standard: 'GS1 Standard', usage: 'Corrugated master shipping cartons', capacity: '14 numeric digits' },
];
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 font-mono">
    
    <!-- Header -->
    <div class="border-b-2 border-scanr-white pb-6 space-y-4">
      <div class="flex items-center gap-2 text-xs text-scanr-muted">
        <TechnicalLabel code="ABOUT" label="MANIFESTO & SPECIFICATIONS" variant="accent" />
        <span class="text-scanr-dim">///</span>
        <span class="text-scanr-yellow">SYSTEM ARCHITECTURE</span>
      </div>

      <div>
        <h1 class="font-display font-black text-4xl sm:text-6xl text-scanr-white tracking-tight uppercase">
          READ IT. MAKE IT.
        </h1>
        <p class="font-mono text-sm sm:text-base text-scanr-muted mt-1 max-w-2xl">
          SCANR is a browser-based utility for reading and creating machine-readable codes.
        </p>
      </div>
    </div>

    <!-- 3-Step Mechanical Flow -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="p-6 bg-scanr-panel border border-scanr-border space-y-3 relative">
        <CropMarks size="sm" color="border-scanr-yellow" />
        <div class="text-3xl font-black text-scanr-yellow">01</div>
        <h3 class="text-lg font-bold text-scanr-white uppercase">READ</h3>
        <p class="text-xs font-sans text-scanr-muted leading-relaxed">
          Point your device camera or upload a file. SCANR uses native browser hardware acceleration and ZXing decoders to extract optical payloads instantly.
        </p>
      </div>

      <div class="p-6 bg-scanr-panel border border-scanr-border space-y-3 relative">
        <CropMarks size="sm" color="border-scanr-white" />
        <div class="text-3xl font-black text-scanr-white">02</div>
        <h3 class="text-lg font-bold text-scanr-white uppercase">CREATE</h3>
        <p class="text-xs font-sans text-scanr-muted leading-relaxed">
          Type any string or number. The client-side encoding engine computes checksums in real-time and generates crisp vector SVGs and print-ready PNG files.
        </p>
      </div>

      <div class="p-6 bg-scanr-panel border border-scanr-border space-y-3 relative">
        <CropMarks size="sm" color="border-scanr-green" />
        <div class="text-3xl font-black text-scanr-green">03</div>
        <h3 class="text-lg font-bold text-scanr-white uppercase">DONE</h3>
        <p class="text-xs font-sans text-scanr-muted leading-relaxed">
          No sign-ups. No cloud processing delays. No tracking cookies. Copy payloads or download vector assets immediately.
        </p>
      </div>

    </div>

    <!-- Privacy Manifesto Block -->
    <div class="p-8 bg-scanr-dark border-2 border-scanr-yellow shadow-[6px_6px_0px_0px_rgba(228,255,26,0.8)] space-y-4 relative">
      <CropMarks size="md" color="border-scanr-yellow" />

      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-scanr-yellow inline-block"></span>
        <h2 class="font-display font-black text-2xl text-scanr-white uppercase">
          LOCAL BY DEFAULT.
        </h2>
      </div>

      <div class="space-y-3 text-sm text-scanr-paper font-sans leading-relaxed max-w-3xl">
        <p>
          Camera frames are processed entirely inside your browser via the HTML5 Canvas and WebRTC video subsystem.
          SCANR does not need an account, authentication, database, or cloud ingestion endpoint to scan or generate codes.
        </p>
        <p class="text-xs text-scanr-muted">
          All symbology generation algorithms are executed client-side via WebAssembly / JavaScript. Your data remains strictly on your local device.
        </p>
      </div>

      <div class="pt-2 flex flex-wrap gap-2 text-xs">
        <TechnicalLabel code="01" label="ZERO DATABASE" variant="default" />
        <TechnicalLabel code="02" label="ZERO USER ACCOUNTS" variant="default" />
        <TechnicalLabel code="03" label="100% IN-BROWSER" variant="accent" />
      </div>
    </div>

    <!-- Supported Symbologies Reference Matrix -->
    <div class="space-y-4">
      <div class="flex items-center justify-between border-b border-scanr-border pb-2">
        <h3 class="text-base font-bold uppercase text-scanr-white tracking-wider">
          TECHNICAL SYMBOLOGY CATALOG
        </h3>
        <span class="text-xs text-scanr-muted">{{ symbologyCatalog.length }} STANDARDS SPECIFIED</span>
      </div>

      <div class="overflow-x-auto border border-scanr-border bg-scanr-panel">
        <table class="w-full text-left text-xs">
          <thead class="bg-scanr-dark text-scanr-muted border-b border-scanr-border uppercase text-[10px]">
            <tr>
              <th class="p-3">SYMBOLOGY</th>
              <th class="p-3">CATEGORY</th>
              <th class="p-3">STANDARD / SPEC</th>
              <th class="p-3">PRIMARY APPLICATION</th>
              <th class="p-3">CAPACITY</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-scanr-border/60 font-mono">
            <tr v-for="item in symbologyCatalog" :key="item.name" class="hover:bg-scanr-dark/60 transition-colors">
              <td class="p-3 font-bold text-scanr-yellow">{{ item.name }}</td>
              <td class="p-3 text-scanr-white">{{ item.type }}</td>
              <td class="p-3 text-scanr-muted text-[11px]">{{ item.standard }}</td>
              <td class="p-3 font-sans text-scanr-paper text-[11px]">{{ item.usage }}</td>
              <td class="p-3 text-scanr-cyan text-[11px]">{{ item.capacity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
