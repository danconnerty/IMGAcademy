import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './index.tsx',
    './App.tsx',
    './components/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
    './utils/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- Ink on Paper (light brand — the default) ---
        paper: '#F7F6F3',
        ink: '#0E0E0E',
        body: '#42403B',
        chip: '#EDEBE5',
        placeholder: '#C9C5BC',
        gray: {
          brand: '#6F6C64',
          soft: '#9A968E',
        },
        line: {
          DEFAULT: '#E6E3DD',
          strong: '#D8D4CC',
        },
        // --- NControl (dark brand — brand blue scale, used for dark insets) ---
        brand: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        nc: {
          bg: '#000000',
          panel: '#0a0a0b',
          gold: '#EAB308',
        },
      },
      fontFamily: {
        nt: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['Roboto Mono', 'SF Mono', 'ui-monospace', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
      borderRadius: {
        pill: '40px',
        card: '2px',
        bubble: '16px',
      },
      boxShadow: {
        lift: '0 10px 28px rgba(14,14,14,0.08)',
        'glow-sm': '0 0 12px rgba(37,99,235,0.35)',
        'glow': '0 0 24px rgba(37,99,235,0.35)',
        'glow-lg': '0 0 48px rgba(37,99,235,0.35)',
      },
      transitionTimingFunction: {
        nt: 'cubic-bezier(0.22, 1, 0.36, 1)',
        nc: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      maxWidth: {
        frame: '64rem',
        prose: '48rem',
        chat: '42rem',
      },
    },
  },
  plugins: [animate],
};
