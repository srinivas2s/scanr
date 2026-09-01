<script setup lang="ts">
const symbologyCatalog = [
  { name: 'QR Code', type: '2D Matrix', standard: 'ISO/IEC 18004', usage: 'URLs, mobile data, payments, credentials', capacity: 'Up to 7,089 numeric / 4,296 alpha' },
  { name: 'EAN-13', type: '1D Linear', standard: 'ISO/IEC 15420', usage: 'International retail merchandise & consumer goods', capacity: '13 numeric digits' },
  { name: 'Code 128', type: '1D Linear', standard: 'ISO/IEC 15417', usage: 'Logistics, supply chain, packaging, asset tracking', capacity: 'Full ASCII (128 chars)' },
  { name: 'UPC-A', type: '1D Linear', standard: 'ANSI MH10.8M', usage: 'North American retail point-of-sale', capacity: '12 numeric digits' },
  { name: 'Data Matrix', type: '2D Matrix', standard: 'ISO/IEC 16022', usage: 'Semiconductors, aerospace parts, healthcare devices', capacity: 'Up to 3,116 numeric / 2,335 alpha' },
  { name: 'PDF417', type: 'Stacked 2D', standard: 'ISO/IEC 15438', usage: 'Boarding passes, transport manifests, state IDs', capacity: 'Up to 1.1 KB data' },
  { name: 'Aztec Code', type: '2D Matrix', standard: 'ISO/IEC 24778', usage: 'Airline ticketing, railway passes, transit systems', capacity: 'Up to 3,832 numeric / 3,067 alpha' },
  { name: 'Code 39', type: '1D Linear', standard: 'ISO/IEC 16388', usage: 'Automotive manufacturing, industrial inventory', capacity: 'Alphanumeric + 7 symbols' },
  { name: 'ITF-14', type: '1D Linear', standard: 'GS1 Standard', usage: 'Corrugated master shipping cartons', capacity: '14 numeric digits' },
  { name: 'EAN-8', type: '1D Linear', standard: 'GS1 Standard', usage: 'Compact retail packaging & small products', capacity: '8 numeric digits' },
  { name: 'UPC-E', type: '1D Linear', standard: 'GS1 Zero-Suppressed', usage: 'Small retail items in North America', capacity: '8 numeric digits' },
  { name: 'Codabar', type: '1D Linear', standard: 'AIM USS-Codabar', usage: 'Blood banks, libraries, shipping airbills', capacity: 'Numeric + 6 special chars' },
];
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 font-sans">
    
    <!-- Header -->
    <div class="border-b border-slate-200 pb-6 space-y-2">
      <div class="flex items-center gap-2 text-xs font-mono text-emerald-700 font-medium">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>Local & Private Browser Engine</span>
      </div>

      <h1 class="font-display font-bold text-3xl sm:text-5xl text-slate-900">
        About SCANR
      </h1>
      <p class="text-sm sm:text-base text-slate-600 max-w-2xl font-sans leading-relaxed">
        A fast, browser-native optical utility for reading and generating machine-readable barcodes without server telemetry or third-party tracking.
      </p>
    </div>

    <!-- 3-Step Flow Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-mono font-bold text-amber-700 text-base">
          01
        </div>
        <h3 class="text-lg font-bold text-slate-900">Scan Instantly</h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          Point your webcam or mobile camera, or paste an image from your clipboard. SCANR uses native hardware acceleration and ZXing algorithms to decode barcodes in milliseconds.
        </p>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div class="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center font-mono font-bold text-sky-700 text-base">
          02
        </div>
        <h3 class="text-lg font-bold text-slate-900">Generate Clean Assets</h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          Encode URLs, GTINs, or arbitrary text into crisp vector SVGs or high-resolution PNGs. Checksums (like Mod-10 for EAN/UPC) are computed automatically on the fly.
        </p>
      </div>

      <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-mono font-bold text-emerald-700 text-base">
          03
        </div>
        <h3 class="text-lg font-bold text-slate-900">100% Client-Side</h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          No sign-ups, no cookies, and no cloud processing delays. All image analysis and barcode calculations happen right in your browser.
        </p>
      </div>

    </div>

    <!-- Privacy & Security Guarantee -->
    <div class="p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 border border-slate-200 space-y-4 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 class="font-display font-bold text-2xl text-slate-900">
          Zero Telemetry Privacy Model
        </h2>
      </div>

      <div class="space-y-3 text-sm text-slate-700 leading-relaxed max-w-3xl">
        <p>
          Camera video feeds are analyzed frame-by-frame via the browser's HTML5 Canvas and WebRTC video APIs.
          No video frames or images are ever transmitted over the network or saved on remote servers.
        </p>
        <p class="text-xs text-slate-500">
          All encoding and decoding algorithms are bundled client-side. The app works completely offline once loaded into the browser cache.
        </p>
      </div>
    </div>

    <!-- Supported Symbologies Reference Matrix -->
    <div class="space-y-4">
      <div class="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 class="text-base font-bold text-slate-900">
          Supported Symbologies & Standards
        </h3>
        <span class="text-xs text-slate-500 font-mono">{{ symbologyCatalog.length }} formats supported</span>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th class="p-3.5">Symbology</th>
              <th class="p-3.5">Type</th>
              <th class="p-3.5">Standard Spec</th>
              <th class="p-3.5">Common Applications</th>
              <th class="p-3.5">Data Capacity</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-sans">
            <tr v-for="item in symbologyCatalog" :key="item.name" class="hover:bg-slate-50 transition-colors">
              <td class="p-3.5 font-bold font-mono text-amber-700">{{ item.name }}</td>
              <td class="p-3.5 text-slate-800 font-mono text-[11px]">{{ item.type }}</td>
              <td class="p-3.5 text-slate-500 font-mono text-[11px]">{{ item.standard }}</td>
              <td class="p-3.5 text-slate-700 text-xs">{{ item.usage }}</td>
              <td class="p-3.5 text-sky-700 font-mono text-[11px] font-semibold">{{ item.capacity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>
