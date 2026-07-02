/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./landing.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Switches on [data-theme="dark"] attribute on <html> — no prefers-color-scheme
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Bridged to System A (tokens/brand.css). Alpha-using keys use the
        // rgb channel form so Tailwind opacity modifiers keep working.
        // Backgrounds
        page: 'var(--app-surface)',
        sidebar: 'var(--mvair-dark)',
        card: {
          bg: 'var(--app-card)',   // switches light (#FFF) ↔ dark (#0F212A) via data-theme
          border: 'var(--mvair-card-border)',
        },
        skeleton: 'var(--mvair-skeleton-base)', // loading placeholder blocks
        
        // Sidebar / text on the dark band (role-named on-dark tokens)
        'sidebar-text': 'var(--mvair-on-dark)',
        'sidebar-active': 'rgb(var(--mvair-primary-rgb) / <alpha-value>)',
        'sidebar-active-text': '#FFFFFF', // neutral
        'on-dark': 'var(--mvair-on-dark)',
        'on-dark-muted': 'var(--mvair-on-dark-muted)',
        'on-dark-dim': 'var(--mvair-on-dark-dim)',
        'accent-hover': 'var(--mvair-accent-hover)',
        signal: 'var(--mvair-signal)', // live pulse dot ONLY — never decorative

        // Supporting role tokens (landing page + chips)
        'chip-teal-bg': 'var(--mvair-chip-teal-bg)',
        'chip-teal-stroke': 'var(--mvair-chip-teal-stroke)',
        'chip-danger-bg': 'var(--mvair-chip-danger-bg)',
        'timeline-dash': 'var(--mvair-timeline-dash)',
        'on-accent': 'var(--mvair-on-accent)',
        'dark-border': '#14282F', // dark-on-dark hairline for the featured tile
        hairline: 'var(--mvair-border)', // #E3E8EA default hairline (nav, dividers)
        
        // Semantic
        primary: {
          DEFAULT: 'rgb(var(--mvair-primary-rgb) / <alpha-value>)',
          dark: 'var(--mvair-primary-dark)',
          light: 'var(--mvair-primary-light)',
        },
        accent: 'rgb(var(--mvair-accent-rgb) / <alpha-value>)',
        success: 'rgb(var(--mvair-success-rgb) / <alpha-value>)',
        warning: 'rgb(var(--mvair-warning-rgb) / <alpha-value>)',
        danger: 'rgb(var(--mvair-danger-rgb) / <alpha-value>)',
        neutral: 'var(--mvair-text-secondary)',
        
        // Text
        'text-primary': 'var(--mvair-text-primary)',
        'text-secondary': 'var(--mvair-text-secondary)',
        'text-muted': '#94A3B8', // neutral muted grey (not part of the 10-token identity)
        
        // Theme-switching semantic tokens (light↔dark via [data-theme] attribute)
        app: {
          bg:      'var(--app-bg)',
          surface: 'var(--app-surface)',
          card:    'var(--app-card)',
          text:    'var(--app-text)',
          text2:   'var(--app-text2)',
          muted:   'var(--app-muted)',
          border:  'var(--app-border)',
          'border-strong': 'var(--app-border-strong)',
          hover:   'var(--app-hover)',
          active:  'var(--app-active)',
          sidebar: 'var(--app-sidebar)',
          accent:  'var(--app-accent)',
          'accent-soft': 'var(--app-accent-soft)',
        },

        // Intent badges — categorical palette (neutral/3rd-party utility hues)
        intent: {
          general: '#8B5CF6',
          dental: '#0EA5E9',
          followup: '#6366F1',
          urgent: '#EF4444',
          inquiry: '#6B7280',
          unknown: '#D1D5DB',
        },
      },
      
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        display: ['Newsreader', 'Georgia', 'serif'],
      },
      
      fontSize: {
        'kpi': '32px',
        'card-title': '11px',
        'page-title': '24px',
        'section-heading': '16px',
        'table-header': '11px',
        'badge': '11px',
        'timestamp': '12px',
      },
      
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      
      borderRadius: {
        'card': '8px',
        'badge': '4px',
        'button': '6px',
        'input': '6px',
      },
      
      boxShadow: {
        'card': 'var(--app-shadow)',
      },
    },
  },
  plugins: [],
}