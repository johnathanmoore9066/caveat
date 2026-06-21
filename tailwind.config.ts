import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F6F3EC",
        ink: "#1C1B19",
        muted: "#6B675E",
        line: "#E2DCD0",
        flag: {
          DEFAULT: "#9E2B25",
          soft: "#F3E2DF",
        },
        good: {
          DEFAULT: "#2F5D50",
          soft: "#E1EAE4",
        },
        gold: "#B8842B",
      },
      fontFamily: {
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', "Georgia", '"Times New Roman"', "serif"],
        sans: ['ui-sans-serif', "system-ui", '"Segoe UI"', "Helvetica", "Arial", "sans-serif"],
      },
      maxWidth: {
        prose: "44rem",
      },
    },
  },
  plugins: [],
};

export default config;
