import { heroui } from "@heroui/theme"

module.exports = {
  darkMode: "class", // Make sure this is set to 'class'
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
          text: "#212529",
          border: "#D1D5DB"
        }
      },
      dark: {
        colors: {
          primary: "#4A90E2",
          secondary: "#F3A712",
          background: "#121212",
          text: "#EAEAEA",
          border: "#2D2D2D"
        }
      },
    },
  })],
};