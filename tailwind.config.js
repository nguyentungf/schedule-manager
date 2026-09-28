/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hust: {
          red: {
            DEFAULT: '#dc2626',
            hover: '#b91c1c',
            light: '#fee2e2',
            glow: '#ef4444'
          },
          dark: {
            bg: '#090d16',
            surface: '#0f172a',
            card: '#131b2e',
            subcard: '#1e293b',
            border: '#334155',
            muted: '#64748b'
          },
          blue: {
            DEFAULT: '#2563eb',
            hover: '#1d4ed8',
            glow: '#3b82f6'
          },
          amber: {
            DEFAULT: '#f59e0b',
            glow: '#fbbf24'
          },
          emerald: {
            DEFAULT: '#10b981',
            glow: '#34d399'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      },
      animation: {
        'pulse-urgent': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-red': 'glowRed 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glowRed: {
          '0%': { boxShadow: '0 0 5px rgba(239, 68, 68, 0.4), inset 0 0 5px rgba(239, 68, 68, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(239, 68, 68, 0.8), inset 0 0 10px rgba(239, 68, 68, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
