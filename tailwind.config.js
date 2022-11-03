/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBg: "#1C1C28",
        secondaryBg: "#282A3D",
        primaryColor: "#3E7BFA",
        brandPurple: "#ac5dd9",
        brandTurquoise: "#73e0e7",
        brandOrange: "#FF8700",
        brandYellow: "#FEDE48",
        brandGreen: "#39DA8A",
        brandRed: "#FF5C5D",
      },
    },
  },
  plugins: [require("daisyui")],
};
