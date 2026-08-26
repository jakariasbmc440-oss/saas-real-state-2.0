/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./frontend/index.html",
    "./frontend/src/**/*.{js,jsx}",
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#2563eb',
          700: '#1d4ed8',
        },
        sidebar: {
          800: '#1e293b',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}
