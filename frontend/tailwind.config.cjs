/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        red: "#FE5A43",
        blue: "#03A5E6",
        black: "#121212",
      },
      fontFamily: {
        display: ["Bebas Neue", "cursive"],
        sans: ["B612", "sans-serif"],
      },
    },
  },
  plugins: [],
};
