/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./src/**/*.tsx", "./src/**/*.ts"],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['NotoSansJP', 'noto-sans'],
      },
    },
  },
}