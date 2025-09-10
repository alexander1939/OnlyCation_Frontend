/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // OnlyCation color palette
        'sky-blue': '#68B2C9',
        'mint-green': '#8ED4BE', 
        'pastel-yellow': '#FFDE97',
        'soft-white': '#FAF9F5',
        'coral-orange': '#FF9978',
        'petroleum-blue': '#294954',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
