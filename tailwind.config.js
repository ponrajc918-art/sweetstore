/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDF8F0',
          100: '#FAF3E0',
          200: '#F5E6C5',
        },
        gold: {
          200: '#F5E099',
          300: '#EED068',
          400: '#E8B840',
          500: '#C9952A',
          600: '#A37820',
          700: '#7A5718',
          800: '#52390F',
        },
        charcoal: {
          600: '#4A4A4A',
          700: '#3D3D3D',
          800: '#2C2C2C',
          900: '#1A1A1A',
          950: '#0F0F0F',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold': '0 4px 24px rgba(201, 149, 42, 0.25)',
        'gold-lg': '0 8px 40px rgba(201, 149, 42, 0.35)',
        'card': '0 2px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.14)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #E8B840 0%, #C9952A 50%, #A37820 100%)',
        'gold-shine': 'linear-gradient(105deg, #E8B840, #F5E099, #C9952A)',
      },
      animation: {
        'scroll-left': 'scrollLeft 35s linear infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
      },
      keyframes: {
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
