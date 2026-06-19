/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // MVAIR brand — all bridged to CSS variables
        'dark':         'var(--mvair-dark)',
        'surface':      'var(--mvair-surface)',
        'primary':      'var(--mvair-primary)',
        'primary-dark': 'var(--mvair-primary-dark)',
        'accent':       'var(--mvair-accent)',
        'signal':       'var(--mvair-signal)',
        'danger':       'var(--mvair-danger)',
        'success':      'var(--mvair-success)',
        'warning':      'var(--mvair-warning)',
        'on-dark':      'var(--mvair-on-dark)',
        'on-dark-muted':'var(--mvair-on-dark-muted)',
        'text-primary': 'var(--mvair-text-primary)',
        'text-secondary':'var(--mvair-text-secondary)',
        'card-border':  'var(--mvair-card-border)',
        'border-color': 'var(--mvair-border)',
      },
      fontFamily: {
        sans:    ['Hanken Grotesk', 'system-ui', 'sans-serif'],
        display: ['Newsreader', 'Georgia', 'serif'],
      },
      keyframes: {
        mvairPulse: {
          '0%':   { transform: 'scale(1)', opacity: '1' },
          '70%':  { transform: 'scale(2.6)', opacity: '0' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      animation: {
        'live-pulse': 'mvairPulse 2.2s ease-out infinite',
        'slide-in':   'slideIn 0.2s ease-out forwards',
        'fade-in':    'fadeIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};
