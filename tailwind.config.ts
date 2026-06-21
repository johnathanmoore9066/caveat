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
        paper: "#F7F4EC",
        raise: "#FCFAF4",
        ink: "#1B1A16",
        muted: "#6E695E",
        line: "#E4DDCD",
        flag: {
          DEFAULT: "#9D2B25",
          soft: "#F1DEDA",
        },
        good: {
          DEFAULT: "#2E5A4C",
          soft: "#E1EAE3",
        },
        gold: "#A67C2E",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-serif)", "Georgia", '"Times New Roman"', "serif"],
        sans: ["ui-sans-serif", "system-ui", '"Segoe UI"', "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(45,34,20,0.05), 0 14px 34px -22px rgba(45,34,20,0.40)",
        raised:
          "0 2px 4px rgba(45,34,20,0.06), 0 24px 48px -28px rgba(45,34,20,0.46)",
        btn: "inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 18px -10px rgba(0,0,0,0.55)",
        seal: "0 2px 10px -4px rgba(166,124,46,0.5)",
      },
      maxWidth: {
        prose: "44rem",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        draw: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        rise: "rise 0.7s cubic-bezier(0.2,0.7,0.2,1) both",
        fade: "fade 0.8s ease both",
        draw: "draw 0.9s cubic-bezier(0.2,0.7,0.2,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
