/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#2D4978',
        'primary-tint': '#d5e4fd',
        'secondary-blue': '#1b2c48',
        'cta-pink': '#C3095A',
        'charcoal': '#1F2426',
        'neutral-bg': '#F2F6FC',
        'white': '#FFFFFF'
      },
      fontFamily: {
        'gt-walsheim': ['GT Walsheim', 'Inter', 'sans-serif'],
        'gt-walsheim-bold': ['GT Walsheim Bold', 'Inter', 'sans-serif'],
        'sans': ['GT Walsheim', 'Inter', 'sans-serif']
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700'
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite'
      },
      keyframes: {
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
} 