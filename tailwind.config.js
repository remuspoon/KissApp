/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FF8FEE",
        secondary: "#FFEDFB",
        red: "#FF6C6E",
        grey: "#9D9D9D",
        accent: "#ED40C5",
        lightGrey: "#E9E9E9",
        darkGrey: "#6C7278"

    },
    fontFamily: {
      "f700": ["Fredoka-Bold"],
      "f300": ["Fredoka-Light"],
      "f500": ["Fredoka-Medium"],
      "f400": ["Fredoka-Regular"],
      "f600": ["Fredoka-SemiBold"],
    },
  },
  plugins: [],
}}