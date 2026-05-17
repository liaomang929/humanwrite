/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: {
          900: "#080c16",
          800: "#0d1321",
          700: "#111827",
          600: "#1a2236",
          500: "#243047",
        },
        gold: {
          DEFAULT: "#c9a84c",
          light: "#e8d48b",
          dark: "#a8882e",
        },
        surface: {
          DEFAULT: "#111827",
          hover: "#1a2236",
          border: "rgba(255,255,255,0.06)",
          "border-hover": "rgba(255,255,255,0.12)",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          tertiary: "#64748b",
        },
        brand: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
          indigo: "#6366f1",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"Noto Sans SC"',
          '"PingFang SC"',
          "system-ui",
          "sans-serif",
        ],
        mono: ['"JetBrains Mono"', '"SF Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
