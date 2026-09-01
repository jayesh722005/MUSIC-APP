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
        background: {
          darkest: '#08090d',
          darker: '#0d0f18',
          card: '#131625',
          cardHover: '#1c2035',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          accent: '#8b5cf6',
          neon: '#a855f7',
          cyan: '#06b6d4',
          pink: '#ec4899',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'soundwave-1': 'soundwave 1.2s ease-in-out infinite alternate',
        'soundwave-2': 'soundwave 0.8s ease-in-out infinite alternate',
        'soundwave-3': 'soundwave 1.5s ease-in-out infinite alternate',
        'glow': 'glow 2.5s ease-in-out infinite alternate',
      },
      keyframes: {
        soundwave: {
          '0%': { height: '20%' },
          '100%': { height: '100%' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.7)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
