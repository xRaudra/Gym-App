/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E8FF57',
          dark: '#C8E030',
          light: '#F2FF8A',
          muted: '#6A7818',
        },
        accent: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
          light: '#FB923C',
        },
        surface: {
          DEFAULT: '#2C2C2C',
          raised: '#363636',
          overlay: '#404040',
        },
        border: {
          DEFAULT: '#3C3C3C',
          light: '#4A4A4A',
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
