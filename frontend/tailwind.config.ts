import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a8b8',
          400: '#ec7692',
          500: '#df4a6e',
          600: '#cb2d58',
          700: '#a52048',
          800: '#8b1d40',
          900: '#6b1a36',
          950: '#3d0a1b',
        },
        ivory: {
          50: '#fefdfb',
          100: '#fdf9f0',
          200: '#faf3e0',
          300: '#f5e8c8',
          400: '#edd8a6',
          500: '#e3c47f',
          600: '#d4a84f',
          700: '#b88a3a',
          800: '#966e31',
          900: '#7a5a2b',
          950: '#422f14',
        },
        leather: {
          50: '#faf6f2',
          100: '#f3ebe0',
          200: '#e6d5bf',
          300: '#d6b896',
          400: '#c6986e',
          500: '#ba8054',
          600: '#ac6b48',
          700: '#8f543d',
          800: '#744537',
          900: '#5f3a2f',
          950: '#331d18',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '3px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
