/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        google: {
          blue: "#1A73E8",
          red: "#EA4335",
          yellow: "#FBBC04",
          green: "#34A853",
          gray: "#5F6368",
        },
        surface: {
          50: "#F8F9FA",
          100: "#F1F3F4",
          200: "#E8EAED",
          300: "#DADCE0",
          400: "#BDC1C6",
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
        'hover': '0 4px 6px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
      }
    },
  },
  plugins: [],
}
