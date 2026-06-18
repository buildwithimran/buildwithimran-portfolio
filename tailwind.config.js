/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts,scss}"],
  theme: {
    extend: {
      colors: {
        primary: "#d1fe17",
        "primary-deep": "#a8cc14",
        "background-dark": "#0d0e10",
        "surface-1": "#15171a",
        "surface-2": "#1c1f23",
        "card-dark": "#15171a",
        "border-dark": "#26292e",
        "border-muted": "#26292e",
        "border-bright": "#3a3e44",
        "accent-blue": "#4FC3F7",
        "accent-amber": "#FFB547",
        "accent-rose": "#FF6B6B",
        ink: "#e8eaed",
        "ink-muted": "#9ba1a8",
        "ink-faint": "#5e6469",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Noto Sans", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      borderRadius: {
        xs: "2px",
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
        xl: "8px",
        "2xl": "8px",
        "3xl": "12px",
      },
      boxShadow: {
        "glow-primary": "0 0 40px -6px rgba(209, 254, 23, 0.35)",
        "glow-soft": "0 0 30px -10px rgba(209, 254, 23, 0.18)",
        "depth-1": "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 30px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ticker": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.85)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        "ticker": "ticker 40s linear infinite",
        "pulse-dot": "pulse-dot 1.8s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
