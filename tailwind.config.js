import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: "#007BFF",
          secondary: "#F3A712",
          background: "#F8F9FA",
          text: "#212529"
        }
      },
      dark: {
        colors: {
          primary: "#4A90E2",
          secondary: "#F3A712",
          background: "#121212",
          text: "#EAEAEA"
        }
      },
    },
  })],


}

module.exports = config;