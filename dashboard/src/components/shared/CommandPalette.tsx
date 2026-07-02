import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Radio, Phone, CalendarDays, Users, AlertTriangle,
  BarChart2, Activity, ShieldCheck, Link2, Settings, CreditCard,
  Building2, ClipboardList, UserCog, Search, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PageEntry {
  label: string;
  path: string;
  section: string;
  icon: React.ElementType;
  minRole?: 'staff' | 'admin' | 'super_admin';
}

const ALL_PAGES: PageEntry[] = [
  { label: 'Command Center',     path: '/app',                 section: 'Monitor',       icon: LayoutDashboard },
  { label: 'Live Monitor',       path: '/app/live',            section: 'Monitor',       icon: Radio },
  { label: 'Calls',             path: '/app/calls',           section: 'Monitor',       icon: Phone },
  { label: 'Appointments',      path: '/app/appointments',    section: 'Front Desk',    icon: CalendarDays },
  { label: 'Leads',             path: '/app/leads',           section: 'Front Desk',    icon: Users },
  { label: 'Emergencies',       path: '/app/emergency',       section: 'Front Desk',    icon: AlertTriangle },
  { label: 'Analytics',         path: '/app/analytics',       section: 'Analyze',       icon: BarChart2,     minRole: 'admin' },
  { label: 'System Health',     path: '/app/health',          section: 'Analyze',       icon: Activity,      minRole: 'admin' },
  { label: 'Trust & Compliance',path: '/app/trust',           section: 'Trust & Setup', icon: ShieldCheck,   minRole: 'admin' },
  { label: 'Integrations',      path: '/app/integrations',    section: 'Trust & Setup', icon: Link2,         minRole: 'admin' },
  { label: 'Aria Config',       path: '/app/config',          section: 'Trust & Setup', icon: Settings,      minRole: 'admin' },
  { label: 'Billing',           path: '/app/billing',         section: 'Trust & Setup', icon: CreditCard,    minRole: 'admin' },
  { label: 'Users',             path: '/app/admin/users',     section: 'My Team',       icon: UserCog,       minRole: 'admin' },
  { label: 'Clinics',           path: '/app/admin/tenants',   section: 'Admin',         icon: Building2,     minRole: 'super_admin' },
  { label: 'Audit Log',         path: '/app/admin/audit-log', section: 'Admin',         icon: ClipboardList, minRole: 'super_admin' },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { user, isSuperAdmin } = useAuth();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isStaff = user?.role === 'clinic_staff';

  const pages = ALL_PAGES.filter((p) => {
    if (p.minRole === 'super_admin') return isSuperAdmin;
    if (p.minRole === 'admin') return !isStaff;
    return true;
  });

  const results = query.trim()
    ? pages.filter((p) =>
        p.label.toLowerCase().includes(query.toLowerCase()) ||
        p.section.toLowerCase().includes(query.toLowerCase())
      )
    : pages;

  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => { setCursor(0); }, [query]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
      if (e.key === 'Enter' && results[cursor]) {
        navigate(results[cursor].path);
        onClose();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, cursor, results, navigate, onClose]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${cursor}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-[560px] mx-4 bg-card-bg border border-card-border rounded-xl overflow-hidden"
        style={{ boxShadow: 'var(--app-shadow-pop)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-card-border">
          <Search className="w-4 h-4 text-text-muted shrink-0" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-[14px] text-text-primary placeholder-text-muted outline-none"
            placeholder="Search pages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded border border-card-border bg-page font-mono text-text-muted">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[340px] overflow-y-auto py-1.5">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-sm text-text-muted text-center">No pages match "{query}"</p>
          ) : (
            results.map((page, i) => (
              <button
                key={page.path}
                data-idx={i}
                type="button"
                onClick={() => { navigate(page.path); onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === cursor ? 'bg-primary/10' : 'hover:bg-page'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${i === cursor ? 'bg-primary text-white' : 'bg-page text-text-secondary'}`}>
                  <page.icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-text-primary">{page.label}</div>
                  <div className="text-[11px] text-text-muted">{page.section}</div>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-opacity ${i === cursor ? 'text-primary opacity-100' : 'opacity-0'}`} />
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-card-border flex items-center gap-4 text-[11px] text-text-muted">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> open</span>
          <span><kbd className="font-mono">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
