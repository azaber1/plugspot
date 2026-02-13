/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'electric-green': '#22c55e',
        'electric-green-hsl': 'hsl(142, 71%, 45%)',
      },
      fontFamily: {
        'heading': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.3)',
        'glow-green-sm': '0 0 10px rgba(34, 197, 94, 0.4)',
      },
      backdropBlur: {
        'glass': '10px',
      },
    },
  },
  plugins: [],
}
