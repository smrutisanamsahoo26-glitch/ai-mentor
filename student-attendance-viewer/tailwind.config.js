/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "accent-green": "#10b981",
        "accent-red": "#ef4444",
        "accent-blue": "#3b82f6",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.06)",
        medium: "0 4px 12px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "slide-in": "slideIn 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
