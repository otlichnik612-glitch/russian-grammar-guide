import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f6f1e8",
        "paper-2": "#ffffff",
        "paper-3": "#e5e0d6",
        ink: "#1c2430",
        "ink-soft": "#5c6570",
        muted: "#6b7280",
        line: "#e4ddd2",
        primary: {
          DEFAULT: "#1a6f68",
          fg: "#f6f1e8",
        },
        mark: {
          DEFAULT: "#cfe8df",
          ink: "#1c2430",
        },
        mint: "#d5efe8",
        sage: "#d8ecc4",
        sky: "#d3e4f5",
        rose: "#f4d6d0",
        sand: "#f3e6c8",
      },
      fontFamily: {
        sans: ['"Atkinson Hyperlegible"', "Segoe UI", "Helvetica Neue", "sans-serif"],
        display: ["Fraunces", "Palatino Linotype", "Book Antiqua", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
