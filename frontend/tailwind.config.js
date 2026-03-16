/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent1: '#ff9933',
        accent2: '#33cccc',
        accentGreen: '#99cc66',
        accentRed: '#cc3366',
        dark: '#0a0a0a',
        darkGray: '#141414',
        mediumGray: '#1a1a1a',
        lightGray: '#2a2a2a',
        light: '#f5f5f5',
        lightGrayBg: '#e8e8e8',
        lightCard: '#ffffff',
        lightCardAlt: '#f9f9f9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        'marquee-reverse': 'marquee-reverse 20s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}

