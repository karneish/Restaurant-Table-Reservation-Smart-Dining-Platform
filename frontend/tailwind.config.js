/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f1f8f4',
          100: '#ddefe4',
          200: '#bddfcc',
          300: '#90c7aa',
          400: '#5ea884',
          500: '#3d8b66',
          600: '#2c6f52',
          700: '#245a43',
          800: '#204936',
          900: '#1a3a2b',
          950: '#0d2219',
        },
        forest: {
          light: '#eaf4ee',
          DEFAULT: '#2c6f52',
          dark: '#1a3a2b',
          deeper: '#0d2219',
          50: '#f1f8f4',
          100: '#ddefe4',
          200: '#bddfcc',
          300: '#90c7aa',
          400: '#5ea884',
          500: '#3d8b66',
          600: '#2c6f52',
          700: '#245a43',
          800: '#204936',
          900: '#1a3a2b',
          950: '#0d2219',
        },
        gold: {
          50: '#fbf6e8',
          100: '#f6e9c4',
          200: '#ecd389',
          300: '#e0bb57',
          400: '#d4a437',
          500: '#c18a24',
          600: '#a46d1d',
          700: '#82531b',
          800: '#6b441b',
          900: '#5a3919',
        },
        cream: '#f6f7f3',
        ink: '#101d15',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(16, 29, 21, 0.06)',
        card: '0 2px 6px rgba(16,29,21,0.05), 0 18px 40px -12px rgba(16,29,21,0.14)',
        'card-lg': '0 4px 10px rgba(16,29,21,0.05), 0 30px 60px -15px rgba(16,29,21,0.22)',
        glow: '0 0 24px rgba(44, 111, 82, 0.35)',
        'glow-lg': '0 8px 40px rgba(44, 111, 82, 0.45)',
        gold: '0 8px 30px rgba(212, 164, 55, 0.35)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fadeIn 0.8s ease both',
        'zoom-in': 'zoomIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'floatY 6s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 3s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        'spin-slow': 'spin 16s linear infinite',
        'pulse-glow': 'pulseGlow 2.6s ease-in-out infinite',
        marquee: 'marquee 32s linear infinite',
        'grow-bar': 'growBar 1s cubic-bezier(0.22,1,0.36,1) both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(26px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        zoomIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 16px rgba(44,111,82,0.25)' },
          '50%': { boxShadow: '0 0 36px rgba(44,111,82,0.55)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        growBar: {
          '0%': { width: '0%' },
        },
      },
    },
  },
  plugins: [],
}
