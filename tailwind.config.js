module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          'spin-once': 'spin-once 0.5s ease-in-out 1',
        },
        keyframes: {
          'spin-once': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          }
        },
        colors: {
          brand: {
            primary: '#3b82f6',
            secondary: '#8b5cf6',
          }
        }
      }
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
    ]
  }