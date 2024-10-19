/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        georama: ['Poppins', 'sans-serif'], // Add Georama font
      },
    },
  },
  plugins: [],
}

