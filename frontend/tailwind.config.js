/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Palette from user image: #5C3F6F (Plum), #F9D13C (Gold), #FDF6EE (Accent White)
        plum: {
          50: '#F7F4F9',
          100: '#EFE9F3',
          200: '#DFD3E7',
          300: '#C7B4D5',
          400: '#9B79B0',
          500: '#75508D',
          600: '#5C3F6F', // Primary User Color: #5C3F6F
          700: '#4D345D',
          800: '#3D2A4A',
          900: '#2A1D33',
          950: '#1A1120',
          DEFAULT: '#5C3F6F',
        },
        gold: {
          50: '#FEFDF5',
          100: '#FDF9E7',
          200: '#FAF1C3',
          300: '#F8E692',
          400: '#F9D13C', // Secondary User Color: #F9D13C
          500: '#E2B814',
          600: '#B89209',
          700: '#8A6C07',
          800: '#614B06',
          900: '#3D2E04',
          DEFAULT: '#F9D13C',
        },
        // White Accent as requested: "untuk yang warna putih buat warna aksen" (#FDF6EE)
        accent: {
          50: '#FFFFFF',
          100: '#FDF6EE', // Core User Color: #FDF6EE
          200: '#FBF0E1',
          300: '#F6E3CC',
          400: '#EDD0B1',
          500: '#E0B891',
          DEFAULT: '#FDF6EE',
          dark: '#2A1F2D',
        },
        campus: {
          50: '#F7F4F9',
          100: '#EFE9F3',
          200: '#DFD3E7',
          500: '#75508D',
          600: '#5C3F6F',
          700: '#4D345D',
          900: '#1A1120',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(92, 63, 111, 0.08), 0 4px 6px -2px rgba(92, 63, 111, 0.04)',
        'soft-lg': '0 10px 25px -5px rgba(92, 63, 111, 0.12), 0 8px 10px -6px rgba(92, 63, 111, 0.05)',
        'plum-glow': '0 0 20px -3px rgba(92, 63, 111, 0.35)',
        'gold-glow': '0 0 20px -3px rgba(249, 209, 60, 0.40)',
      }
    },
  },
  plugins: [],
}
