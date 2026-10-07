/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: {
          bg: '#090d16',
          panel: '#0e1526',
          card: '#141d33',
          border: '#1e2942',
          gold: '#f59e0b',
          crimson: '#ef4444',
          neonCyan: '#06b6d4',
          neonPurple: '#a855f7',
          neonEmerald: '#10b981',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'danger-flash': 'danger-flash 1.5s infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.6))' },
          '50%': { opacity: '0.6', filter: 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.2))' },
        },
        'danger-flash': {
          '0%, 100%': { borderColor: 'rgba(239, 68, 68, 0.8)', backgroundColor: 'rgba(239, 68, 68, 0.1)' },
          '50%': { borderColor: 'rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.02)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
