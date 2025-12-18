/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#ea2a33", // Màu đỏ
        "background-light": "#f8f6f6",
        "background-dark": "#121212",
        "surface-dark": "#1e1e1e",
      },
      fontFamily: {
        display: ["Spline Sans", "sans-serif"],
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
