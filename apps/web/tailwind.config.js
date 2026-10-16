/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/shared/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bespoke Archival Light Studio Palette (Paper & Stone)
        carbon: {
          950: '#FAF9F5', // Canvas body background (warm paper cream)
          900: '#FFFFFF', // Card surfaces, sheets, modals
          850: '#F6F5EE', // Secondary panes, table rows, headers
          800: '#ECEAE2', // Pill badges, inputs, hover states
          750: '#E2E0D5', // Inner borders, dividers
          700: '#D6D4C7', // Hairline borders, structural frames
          600: '#BEBBB0', // Subtle borders
          500: '#8C897B', // Labels, technical captions
        },
        ink: {
          950: '#0B0C0E',
          900: '#111215', // Primary headers / deep ink
          800: '#1E2025', // Main body text
          700: '#2E313A',
          600: '#4B4E5A', // Secondary copy
          500: '#6B6F7D', // Muted metadata
          400: '#8E92A0',
        },
        slate: {
          50: '#0B0C0E',
          100: '#111215', // Primary headers / deep ink
          200: '#1E2025', // Main body text
          300: '#33363F', // Secondary copy
          400: '#5F636E', // Muted metadata
          500: '#7A7E8C', // Captions
          600: '#9CA0AC',
          700: '#D5D4CB',
          800: '#E8E7DF',
          850: '#F0EFE8',
          900: '#F6F5EE',
          950: '#111215',
        },
        royal: {
          50: '#F0F5FC',
          100: '#E2EDFA',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#3B82F6',
          500: '#0C49A2', // Primary deep royal cobalt
          600: '#093A82',
          700: '#062C63',
        },
        archival: {
          50: '#FAF9F5',
          100: '#F5F4EE',
          200: '#ECEAE2',
          300: '#E2E0D5',
          400: '#D6D4C7',
          500: '#BEBBB0',
          600: '#8C897B',
        },
        forest: {
          50: '#F0F9F5',
          100: '#DCFCE7',
          200: '#BBF7D0',
          500: '#0E6245', // ATS emerald
          600: '#0B4E37',
          700: '#064E3B',
        },
        ochre: {
          50: '#FEF8EE',
          100: '#FEF3C7',
          200: '#FDE68A',
          400: '#F59E0B',
          500: '#B45309', // Checkpoint amber
          600: '#92400E',
          700: '#78350F',
        },
        paper: {
          50: '#FAF9F5',
          100: '#F5F4EE',
          200: '#ECEAE2',
          300: '#E2E0D5',
          800: '#2E3036',
          900: '#111215',
        },
        forge: {
          amber: '#B45309',
          emerald: '#0E6245',
          cyan: '#0284C7',
          rose: '#BE123C',
          indigo: '#0C49A2',
        },
      },
      fontFamily: {
        display: ['Cabinet Grotesk', 'Syne', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Source Serif Pro', 'Merriweather', 'serif'],
      },
      boxShadow: {
        'paper-xs': '0 1px 2px 0 rgba(18, 19, 22, 0.04)',
        'paper-sm': '0 1px 3px 0 rgba(18, 19, 22, 0.05), 0 1px 2px -1px rgba(18, 19, 22, 0.05)',
        'paper-md': '0 4px 6px -1px rgba(18, 19, 22, 0.07), 0 2px 4px -2px rgba(18, 19, 22, 0.05)',
        'paper-lg': '0 10px 25px -5px rgba(18, 19, 22, 0.09), 0 8px 10px -6px rgba(18, 19, 22, 0.07)',
        'paper-elevated': '0 20px 45px -10px rgba(18, 19, 22, 0.08), 0 0 0 1px rgba(18, 19, 22, 0.05)',
        'tactile': '0 1px 3px 0 rgba(18, 19, 22, 0.04), 0 0 0 1px rgba(18, 19, 22, 0.06)',
      },
    },
  },
  plugins: [],
}
