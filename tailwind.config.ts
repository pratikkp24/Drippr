import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#F5EFE6",
        surface: "#FAF7F1",
        primary: {
          DEFAULT: "#1F3D2B",
          hover: "#244733"
        },
        accent: "#CBBBA0",
        border: "#E6DDCF",
        text: {
          1: "#1F3D2B",
          2: "#6B7C72",
          3: "#A8B3AA"
        },
        success: "#2F6B4A",
        warning: "#B88A3B",
        error: "#A04A43",
        dark: {
          bg: "#1B2E22",
          surface: "#22392B",
          text: "#F5EFE6",
          accent: "#A8957A",
          border: "#385244"
        }
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"]
      },
      borderRadius: {
        sm: "10px",
        md: "14px",
        lg: "20px",
        xl: "24px",
        pill: "9999px"
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "40px",
        "3xl": "48px"
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)"
      },
      keyframes: {
        screenIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        screenIn: "screenIn 240ms ease-out",
        slideUp: "slideUp 280ms ease-out both"
      }
    }
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")]
};

export default config;
