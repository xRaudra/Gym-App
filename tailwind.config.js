/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#67DE6D',
          dark: '#3EBF45',
          light: '#8FE993',
          muted: '#0A2A0B',
        },
        accent: {
          DEFAULT: '#FFB347',
          dark: '#F59E0B',
          light: '#FCD34D',
        },
        surface: {
          DEFAULT: '#111111',
          raised: '#1A1A1A',
          overlay: '#242424',
        },
        border: {
          DEFAULT: '#2A2A2A',
          light: '#363636',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}
