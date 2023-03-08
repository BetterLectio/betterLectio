/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      animation: {
        "fade-in-down": "fade-in-down 0.5s ease-out",
        "wiggle" : 'wiggle 1.5s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        }
      },
    },
  },
  plugins: [
    require("daisyui"),
    require('@tailwindcss/aspect-ratio')
  ],
}
