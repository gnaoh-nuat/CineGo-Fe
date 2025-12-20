/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#ea2a33", // Đỏ thương hiệu
        "background-light": "#f8f6f6",
        "background-dark": "#121212", // Đen nền chính
        "surface-dark": "#1e1e1e", // Đen xám (cho card/dropdown)

        success: "#22c55e", // green-500
        info: "#3b82f6",    // blue-500
        warning: "#f97316", // orange-500
        danger: "#ef4444", // red-500
        purple: "#a855f7", // purple-500
      },
      fontFamily: {
        display: ["Spline Sans", "sans-serif"],
        sans: ["Manrope", "ui-sans-serif", "system-ui"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
