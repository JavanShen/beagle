import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/(button|image|input|popover|slider|card|skeleton|toast|modal|dropdown).{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      flex: {
        5: "5 5 0%",
        9: "9 9 0%",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
