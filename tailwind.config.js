/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        darkgray: '#212121',
        'spotify-green': '#1DB954',
      }
    },
    fontFamily: {
      signature: ["Great Vibes"],
      sans: ['Roboto', 'sans-serif'],
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
