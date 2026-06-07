const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./shared/**/*.{js,jsx,ts,tsx}",
    "./widgets/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // 웹 globals.css @theme 디자인 토큰 이식
      colors: {
        background: "#f5fbf9",
        "on-background": "#171d1c",

        surface: "#f5fbf9",
        "surface-dim": "#d5dbd9",
        "surface-bright": "#f5fbf9",
        "surface-variant": "#dee4e2",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff5f3",
        "surface-container": "#e9efed",
        "surface-container-high": "#e4e9e7",
        "surface-container-highest": "#dee4e2",
        "surface-tint": "#016a61",

        "on-surface": "#171d1c",
        "on-surface-variant": "#3e4947",
        "inverse-surface": "#2c3231",
        "inverse-on-surface": "#ecf2f0",

        outline: "#6e7977",
        "outline-variant": "#bec9c6",

        primary: "#005049",
        "on-primary": "#ffffff",
        "primary-container": "#006a61",
        "on-primary-container": "#95e7db",
        "inverse-primary": "#84d5ca",
        "primary-fixed": "#a0f1e6",
        "primary-fixed-dim": "#84d5ca",
        "on-primary-fixed": "#00201d",
        "on-primary-fixed-variant": "#005049",

        secondary: "#1c6960",
        "on-secondary": "#ffffff",
        "secondary-container": "#a5ede1",
        "on-secondary-container": "#226e65",
        "secondary-fixed": "#a8f0e4",
        "secondary-fixed-dim": "#8cd4c8",
        "on-secondary-fixed": "#00201c",
        "on-secondary-fixed-variant": "#005048",

        tertiary: "#404848",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#57605f",
        "on-tertiary-container": "#d1dad9",
        "tertiary-fixed": "#dbe4e3",
        "tertiary-fixed-dim": "#bfc8c7",
        "on-tertiary-fixed": "#151d1d",
        "on-tertiary-fixed-variant": "#404848",

        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
      },
    },
  },
  plugins: [
    // 웹 globals.css의 typo-* @utility 이식 (px 단위)
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".typo-headline-lg": {
          fontSize: "48px",
          lineHeight: "56px",
          fontWeight: "700",
          letterSpacing: "-0.96px",
        },
        ".typo-headline-lg-mobile": {
          fontSize: "32px",
          lineHeight: "40px",
          fontWeight: "700",
          letterSpacing: "-0.32px",
        },
        ".typo-headline-md": {
          fontSize: "19px",
          lineHeight: "26px",
          fontWeight: "600",
        },
        ".typo-body-lg": {
          fontSize: "18px",
          lineHeight: "28px",
          fontWeight: "400",
        },
        ".typo-body-md": {
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "400",
        },
        ".typo-label-md": {
          fontSize: "14px",
          lineHeight: "20px",
          fontWeight: "600",
          letterSpacing: "0.14px",
        },
        ".typo-label-sm": {
          fontSize: "12px",
          lineHeight: "16px",
          fontWeight: "500",
        },
      });
    }),
  ],
};
