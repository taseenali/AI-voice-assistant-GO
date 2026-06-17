/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        page: '#F1F5F9',
        sidebar: '#0F172A',
        card: {
          bg: '#FFFFFF',
          border: '#E2E8F0',
        },
        
        // Sidebar
        'sidebar-text': '#94A3B8',
        'sidebar-active': '#2563EB',
        'sidebar-active-text': '#FFFFFF',
        
        // Semantic
        primary: {
          DEFAULT: '#2563EB',
          light: '#EFF6FF',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        neutral: '#64748B',
        
        // Text
        'text-primary': '#0F172A',
        'text-secondary': '#64748B',
        'text-muted': '#94A3B8',
        
        // Intent badges
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
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