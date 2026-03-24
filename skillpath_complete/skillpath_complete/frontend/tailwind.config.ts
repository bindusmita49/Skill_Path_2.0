import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        "bg-dark": "var(--color-bg-dark)",
        ink: "var(--color-ink)",
        "ink-muted": "var(--color-ink-muted)",
        accent: "var(--color-accent)",
        "accent-2": "var(--color-accent-2)",
        grid: "var(--color-grid)",
        ruler: "var(--color-ruler)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        sketch: ["var(--font-sketch)"],
      },
      animation: {
        "text-scramble": "text-scramble 1s steps(5) both",
      },
      keyframes: {
        "text-scramble": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
export default config;
