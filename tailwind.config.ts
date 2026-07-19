import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9f6",
          100: "#d9f0e7",
          200: "#b3e0cf",
          300: "#82caae",
          400: "#4fac89",
          500: "#2e8f6d",
          600: "#1f7358",
          700: "#1b5c48",
          800: "#18493a",
          900: "#153c31",
          950: "#08211b",
        },
        accent: {
          50: "#fff8ec",
          100: "#ffedc9",
          200: "#ffd88d",
          300: "#ffbd50",
          400: "#ffa322",
          500: "#f9840a",
          600: "#dd6205",
          700: "#b74508",
          800: "#94360d",
          900: "#7a2e0e",
        },
        ink: {
          50: "#f6f7f8",
          100: "#eceef0",
          200: "#d5d9de",
          300: "#b1b8c1",
          400: "#8691a0",
          500: "#677284",
          600: "#525b6c",
          700: "#434a58",
          800: "#3a3f4a",
          900: "#22252b",
          950: "#16181c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(20,25,32,0.04), 0 1px 6px -1px rgba(20,25,32,0.06)",
        "card-hover": "0 4px 16px -2px rgba(20,25,32,0.10), 0 2px 6px -1px rgba(20,25,32,0.06)",
        popover: "0 10px 40px -10px rgba(20,25,32,0.25)",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out both",
        slideUp: "slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both",
        slideDown: "slideDown 0.3s ease-out both",
        scaleIn: "scaleIn 0.2s ease-out both",
        shimmer: "shimmer 1.8s linear infinite",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      maxWidth: {
        "8xl": "1440px",
      },
    },
  },
  plugins: [],
};

export default config;
