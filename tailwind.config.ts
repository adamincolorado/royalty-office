import type { Config } from "tailwindcss";

/**
 * Royalty Office design tokens.
 *
 * The look is "bank-ledger Texan": warm paper grounds, deep pine-ink,
 * a restrained brass accent, and tabular figures everywhere money appears.
 * Single deliberate light theme — financial statements are paper.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F7F4EC",
          deep: "#F0EBDE",
          card: "#FCFAF5",
        },
        ink: {
          DEFAULT: "#17251F",
          2: "#41524A",
          3: "#71817A",
        },
        line: {
          DEFAULT: "#DCD5C2",
          soft: "#E8E2D2",
        },
        pine: {
          DEFAULT: "#14342B",
          lift: "#1D4A3C",
          soft: "#E3EAE4",
        },
        brass: {
          DEFAULT: "#A87B2F",
          deep: "#8A6323",
          soft: "#F0E6CE",
        },
        cash: "#157A4A",
        clay: "#A93F2B",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,37,31,.06), 0 10px 30px -18px rgba(23,37,31,.25)",
        seal: "inset 0 0 0 1px rgba(168,123,47,.45)",
      },
      maxWidth: {
        wrap: "76rem",
      },
    },
  },
  plugins: [],
};
export default config;
