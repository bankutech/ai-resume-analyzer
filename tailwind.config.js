/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          purple: '#667eea',
          pink: '#f093fb',
          blue: '#4facfe',
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(102, 126, 234, 0.4)',
        'glow-lg': '0 0 40px rgba(102, 126, 234, 0.6)',
        'creative': '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(102, 126, 234, 0.2)',
        'creative-lg': '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 30px rgba(102, 126, 234, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'slide-in': 'slideInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
      }
    },
  },
  plugins: [],
}
