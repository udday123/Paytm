/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6a51a6",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#1f2937",
          foreground: "#ffffff",
        },
        background: "#0f172a", // slate-900
        surface: "#1e293b", // slate-800
      },
    },
  },
  plugins: [],
}