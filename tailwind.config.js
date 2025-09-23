/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: "#ff9d00",
    },
    screens: {
      desktop: { min: "1100px" },
      mobile: { max: "800px" },
    },
  },
  plugins: [],
};
