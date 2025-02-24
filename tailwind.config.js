// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-light': '0 4px 15px rgba(0, 0, 0, 0.1)',
        'custom-dark': '0 5px 15px rgba(0.1, 0.1, 0.1, 0.2)',
        'inner-custom': 'inset 0px 1px 2px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pingLoader: {
          "0%": { left: "0%" },
          "50%": { left: "70%" },
          "100%": { left: "0%" },
        },
        placeholder: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.5s ease-out forwards', // Adjust the timing as necessary
        placeholder: 'placeholder 5s ease-in-out infinite',
        pingLoader: "pingLoader 2s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
