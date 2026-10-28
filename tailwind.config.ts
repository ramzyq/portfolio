import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#242424",
        body: "#6e6e73",
        muted: "#6e6e73",
        soft: "#999999",
        line: "#ececec",
        surface: "#f7f7f8",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        card: "0 1px 0 rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
