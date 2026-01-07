/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00f5ff',
        'neon-purple': '#b347ff',
        'neon-pink': '#ff006e',
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 245, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(179, 71, 255, 0.3)',
      },
    },
  },
  plugins: [],
}

