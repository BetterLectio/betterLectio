/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
  },
  daisyui: {
    themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter",
      {
        lectio: {
          "primary": "#1b5c9e",
          "secondary": "#1b5c9e",
          "accent": "#B20C00",
          "neutral": "#b8c3cc",
          "base-100": "#fff",
          "info": "#53C0F3",
          "success": "#339900",
          "warning": "#F3CC30",
          "error": "#B20C00",
        },
      },
    ],
  },
  plugins: [require("daisyui"), require("@tailwindcss/forms"), require('@tailwindcss/line-clamp')],
};
