/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", // your App Router files
    "./src/components/**/*.{js,ts,jsx,tsx}", // your components
  ],
  safelist: [
    "token", // Prism wrapper class
    "keyword", // our alias
    "token keyword", // when both apply
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
