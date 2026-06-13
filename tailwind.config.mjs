/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1a2540',
        'navy-light': '#2a3a5c',
        'navy-dark': '#0f1729',
        slate: '#475569',
        stone: '#78716c',
        cream: '#faf7f3',
        'cream-dark': '#f0e8dd',
        charcoal: '#1c1917',
        'warm-gray': '#8a7f7a',
        accent: '#b8865c',
        'accent-light': '#d4a574',
        'accent-dark': '#8b6f47',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
