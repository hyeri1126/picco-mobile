/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // 웹 globals.css 디자인 토큰 이식 (핵심 색상)
      colors: {
        background: "#f5fbf9",
        primary: "#005049",
        "primary-container": "#006a61",
        "on-primary": "#ffffff",
        secondary: "#1c6960",
        "on-surface": "#171d1c",
        "on-surface-variant": "#3e4947",
        outline: "#6e7977",
        "outline-variant": "#bec9c6",
        "surface-container": "#e9efed",
        "surface-container-low": "#eff5f3",
        "surface-container-lowest": "#ffffff",
        error: "#ba1a1a",
      },
    },
  },
  plugins: [],
};
