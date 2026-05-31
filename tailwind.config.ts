import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: "#FAF8F5", dark: "#F0EBE3" },
        charcoal: { DEFAULT: "#1A202C", light: "#2D3748" },
        heritage: {
          DEFAULT: "#0D7377",
          light: "#14A3A8",
          dark: "#095456",
        },
        gold: { DEFAULT: "#C69C55", light: "#E8C547" },
        sand: { DEFAULT: "#D6B98C", light: "#E8D4B0" },
        navy: { DEFAULT: "#0F172A", light: "#1E293B" },
        surface: "#FAF8F5",
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.08)",
        panel: "0 16px 48px rgba(0, 0, 0, 0.12)",
        luxury: "0 24px 64px rgba(0, 0, 0, 0.16)",
      },
      backgroundImage: {
        "mesh-gradient":
          "radial-gradient(at 40% 20%, rgba(13,115,119,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(198,156,85,0.12) 0px, transparent 50%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
