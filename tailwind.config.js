/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#22d3ee',
          dim: 'rgba(34, 211, 238, 0.2)',
          glow: 'rgba(34, 211, 238, 0.3)',
          bright: '#67e8f9',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(34, 211, 238, 0.25)',
        'glow-sm': '0 0 12px rgba(34, 211, 238, 0.2)',
        panel: '0 4px 24px -4px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(148, 163, 184, 0.06)',
        'panel-inner': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.03)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
