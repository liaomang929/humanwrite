/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        deep: {
          900: "#0a0a0f",
          800: "#111118",
          700: "#1a1a24",
          600: "#242430",
          500: "#2e2e3a",
        },
        accent: {
          DEFAULT: "#6c5ce7",
          light: "#a29bfe",
        },
        cyan: {
          DEFAULT: "#00cec9",
          dim: "#00b894",
        },
        text: {
          primary: "#e8e8ed",
          secondary: "#888899",
          muted: "#555566",
        },
        card: {
          border: "#2a2a38",
          glow: "rgba(108, 92, 231, 0.08)",
        },
      },
    },
  },
  plugins: [],
}
