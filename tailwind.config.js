/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'scanr-bg': '#f8fafc',
        'scanr-black': '#ffffff',
        'scanr-dark': '#f1f5f9',
        'scanr-panel': '#ffffff',
        'scanr-elevated': '#f8fafc',
        'scanr-border': '#e2e8f0',
        'scanr-line': '#cbd5e1',
        'scanr-white': '#0f172a',
        'scanr-paper': '#1e293b',
        'scanr-muted': '#64748b',
        'scanr-dim': '#94a3b8',
        'scanr-red': '#ef4444',
        'scanr-yellow': '#f59e0b',
        'scanr-cyan': '#0284c7',
        'scanr-green': '#16a34a',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['"Inter Tight"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      keyframes: {
        laser: {
          '0%, 100%': { top: '5%', opacity: '0.9' },
          '50%': { top: '92%', opacity: '1' },
        },
      },
      animation: {
        'laser': 'laser 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
