/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        state: {
          pending: '#94a3b8',
          progress: '#f59e0b',
          done: '#22c55e',
          danger: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      minWidth: {
        touch: '56px',
      },
      minHeight: {
        touch: '56px',
      },
    },
  },
  plugins: [],
};
