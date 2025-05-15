/** @type {import('tailwindcss').Config} */
import tailwindcss from '@tailwindcss/vite'

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindcss(),
  ],
}

