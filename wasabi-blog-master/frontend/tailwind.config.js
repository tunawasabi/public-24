/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--notosans)', 'sans-serif'],
        mono: ['var(--source-code-pro)', 'Consolas', 'var(--notosans)'],
        honbun: ['var(--mplus)', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
