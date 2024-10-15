/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: '#8B2635',
        'burgundy-dark': '#6B1D29', // Added darker shade of burgundy
        cream: '#F5EBE0',
        green: '#4A5D23',
        brown: '#8B4513',
        beige: '#D2B48C',
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
    },
  },
  plugins: [],
}
