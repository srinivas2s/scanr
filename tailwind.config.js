/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'scanr-black': '#090a0c',
        'scanr-dark': '#101216',
        'scanr-panel': '#16181f',
        'scanr-elevated': '#1e212b',
        'scanr-border': '#2b2f3d',
        'scanr-line': '#3a3f52',
        'scanr-white': '#f5f4f0',
        'scanr-paper': '#e8e6df',
        'scanr-muted': '#7e8494',
        'scanr-dim': '#4b5162',
        'scanr-red': '#ff2a00',
        'scanr-yellow': '#e4ff1a',
        'scanr-cyan': '#00f0ff',
        'scanr-green': '#00ff66',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Archivo', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['"Inter Tight"', 'Geist', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'barcode-stripes': 'repeating-linear-gradient(90deg, #090a0c 0px, #090a0c 2px, transparent 2px, transparent 5px, #090a0c 5px, #090a0c 9px, transparent 9px, transparent 12px)',
        'barcode-stripes-light': 'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 2px, transparent 2px, transparent 5px, #ffffff 5px, #ffffff 9px, transparent 9px, transparent 12px)',
        'grid-pattern': 'linear-gradient(to right, #2b2f3d18 1px, transparent 1px), linear-gradient(to bottom, #2b2f3d18 1px, transparent 1px)',
        'dot-matrix': 'radial-gradient(#2b2f3d 1px, transparent 1px)',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(0%)', opacity: '0.8' },
          '50%': { transform: 'translateY(100%)', opacity: '1' },
          '100%': { transform: 'translateY(0%)', opacity: '0.8' },
        },
        laser: {
          '0%, 100%': { top: '0%', opacity: '0.9' },
          '50%': { top: '96%', opacity: '1' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        ticker: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        'scanline': 'scanline 2.2s ease-in-out infinite',
        'laser': 'laser 1.8s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ticker': 'ticker 24s linear infinite',
      }
    },
  },
  plugins: [],
}
