/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bridged to System A (tokens/brand.css). Alpha-using keys use the
        // rgb channel form so Tailwind opacity modifiers keep working.
        // Backgrounds
        page: 'var(--mvair-surface)',
        sidebar: 'var(--mvair-dark)',
        card: {
          bg: '#FFFFFF', // neutral surface, not a brand identity color
          border: 'var(--mvair-border)',
        },
        
        // Sidebar
        'sidebar-text': 'var(--mvair-on-dark)',
        'sidebar-active': 'rgb(var(--mvair-primary-rgb) / <alpha-value>)',
        'sidebar-active-text': '#FFFFFF', // neutral
        
        // Semantic
        primary: {
          DEFAULT: 'rgb(var(--mvair-primary-rgb) / <alpha-value>)',
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
        'card': '0 1px 3px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}