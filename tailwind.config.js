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
        'ink-grid': 'rgba(247, 246, 243, 0.05)',
      },
      fontFamily: {
        nt: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['Roboto Mono', 'SF Mono', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.02em',
      },
      borderRadius: {
        pill: '40px',
        card: '2px',
        bubble: '16px',
      },
      // The ONE shadow in Ink on Paper: hover lift, paired with translateY(-3px).
      boxShadow: {
        lift: '0 10px 28px rgba(14,14,14,0.08)',
      },
      transitionTimingFunction: {
        nt: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        frame: '64rem',
        prose: '48rem',
        lead: '42rem',
        chat: '42rem',
      },
    },
  },
  plugins: [animate],
};
