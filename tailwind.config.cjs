/** @type {import('tailwindcss').Config} */
module.exports = {
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
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(179, 71, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(179, 71, 255, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}

