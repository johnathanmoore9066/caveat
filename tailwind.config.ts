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
        paper: "#0A0913",
        raise: "#161327",
        ink: "#F4F2FF",
        muted: "#9B94BC",
        line: "#2A2545",
        flag: {
          DEFAULT: "#FF7A8A",
          soft: "#3B1622",
        },
        good: {
          DEFAULT: "#42E8B4",
          soft: "#0D2E25",
        },
        gold: {
          DEFAULT: "#FFC94D",
          soft: "#3A2E12",
        },
        violet: "#A78BFA",
        magenta: "#F472B6",
        cyan: "#67E8F9",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-body)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 50px -24px rgba(0,0,0,0.7)",
        raised:
          "inset 0 1px 0 rgba(255,255,255,0.07), 0 24px 60px -24px rgba(139,92,246,0.35)",
        btn: "0 10px 30px -10px rgba(219,39,119,0.55), 0 4px 14px -6px rgba(124,58,237,0.5)",
        glow: "0 0 24px rgba(167,139,250,0.25)",
        seal: "0 2px 10px -4px rgba(255,201,77,0.5)",
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
        shine: {
          "0%": { backgroundPosition: "0% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(3rem, -2rem, 0) scale(1.08)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(-3rem, 2.5rem, 0) scale(1.12)" },
        },
      },
      animation: {
        rise: "rise 0.7s cubic-bezier(0.2,0.7,0.2,1) both",
        fade: "fade 0.8s ease both",
        draw: "draw 0.9s cubic-bezier(0.2,0.7,0.2,1) both",
        shine: "shine 7s linear infinite",
        float: "float 19s ease-in-out infinite",
        drift: "drift 26s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
