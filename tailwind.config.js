/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        deep: {
          900: "#f8f9fa",
          800: "#ffffff",
          700: "#f1f3f5",
          600: "#e5e7eb",
          500: "#d1d5db",
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
          primary: "#1f2937",
          secondary: "#4b5563",
          muted: "#9ca3af",
        },
        card: {
          border: "#e5e7eb",
          glow: "rgba(108, 92, 231, 0.06)",
        },
      },
    },
  },
  plugins: [],
}
