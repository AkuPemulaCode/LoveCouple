/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'ps-black':   'var(--ps-bg)',
        'ps-dark':    'var(--ps-bg-track)',
        'ps-card':    'var(--ps-bg-card)',
        'ps-surface': 'var(--ps-bg-mid)',
        'ps-border':  'var(--ps-border)',
        'ps-primary': '#6c63ff',
        'ps-accent':  '#00d4ff',
        'ps-neon':    '#39ff14',
        'ps-pink':    '#ff2d78',
        'ps-text':    'var(--ps-fg)',
        'ps-muted':   'var(--ps-fg-mid)',
        'ps-dim':     'var(--ps-fg-dim)',
      },
      fontFamily: {
        pixel: ['Orbitron', 'monospace'],
        body:  ['Inter', 'sans-serif'],
      },
      keyframes: {
        'ps-pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px #6c63ff40' },
          '50%':       { boxShadow: '0 0 40px #6c63ff80, 0 0 60px #6c63ff40' },
        },
        'ps-slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        'ps-flicker': {
          '0%, 100%': { opacity: '1' },
          '92%':      { opacity: '1' },
          '93%':      { opacity: '0.8' },
          '94%':      { opacity: '1' },
          '96%':      { opacity: '0.9' },
          '97%':      { opacity: '1' },
        },
      },
      animation: {
        'ps-pulse-glow': 'ps-pulse-glow 3s ease-in-out infinite',
        'ps-slide-up':   'ps-slide-up 0.5s ease forwards',
        'ps-flicker':    'ps-flicker 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
