// tailwind.config.ts
import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html','./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F6F6F4',
          100: '#ECEBE7',
          200: '#D9D7CE',
          300: '#C2BFAF',
          400: '#A99F87',
          500: '#8F846A',   // メイン
          600: '#776C56',
          700: '#5F5645',
          800: '#4B4437',
          900: '#333027',
        },
        accent: '#CBA35C', // 金色っぽいアクセント
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
