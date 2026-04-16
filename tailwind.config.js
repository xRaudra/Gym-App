/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#67DE6D',
          dark:    '#3EBF45',
          light:   '#A3F0A7',
          muted:   '#0D2A0E',
        },
        // fitness = yellow for workout / fitness sections
        fitness: {
          DEFAULT: '#ffec64',
          dark:    '#e6d200',
          muted:   '#2a2808',
        },
        // accent = warm green-lime for notifications / secondary highlights
        accent: {
          DEFAULT: '#B8F084',
          dark:    '#8BC34A',
          light:   '#D4F7A8',
        },
        surface: {
          DEFAULT: '#111111',
          raised:  '#1A1A1A',
          overlay: '#242424',
        },
        border: {
          DEFAULT: '#2A2A2A',
          light:   '#363636',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' },                              '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' },'100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
