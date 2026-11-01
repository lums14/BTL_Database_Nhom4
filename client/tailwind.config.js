/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0e1117',
          black: '#121212',
          rust: '#9b3722',
          'rust-light': '#fdf6f5',
          'rust-border': '#f2d5cf',
          muted: '#6b7280',
          border: '#e5e7eb',
          surface: '#f9fafb',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['Space Mono', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
