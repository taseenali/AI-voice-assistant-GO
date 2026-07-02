import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, AlignJustify, AlignLeft, Bell, Search, ShieldCheck, ChevronDown, LogOut, User, Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Toast } from '../shared/Toast.tsx';
import { CommandPalette } from '../shared/CommandPalette';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useEmergencyEvents } from '../../hooks/useEmergencyEvents';

/** Map from route pathname to the display title shown in the topbar. */
const ROUTE_TITLES: Record<string, string> = {
  '/app':              'Command Center',
  '/app/live':         'Live Monitor',
  '/app/calls':        'Calls',
  '/app/sessions':     'Calls',
  '/app/leads':        'Leads',
  '/app/appointments': 'Appointments',
  '/app/emergency':    'Emergencies',
  '/app/analytics':    'Analytics',
  '/app/health':       'System Health',
  '/app/trust':        'Trust & Compliance',
  '/app/integrations': 'Integrations',
  '/app/config':       'Aria Config',
  '/app/billing':      'Billing',
  '/app/admin/tenants':   'Clinics',
  '/app/admin/audit-log': 'Audit Log',
  '/app/admin/users':     'Users',
};

function roleLabel(role: string | undefined): string {
  if (role === 'super_admin') return 'Super admin';
  if (role === 'clinic_admin') return 'Office manager';
  return 'Staff';
}

export function MainLayout() {
  const { toasts, removeToast } = useToast();
  const { user, isSuperAdmin, logout } = useAuth();
  const { theme, density, toggleTheme, toggleDensity } = useTheme();
  const { events } = useEmergencyEvents(30000);
  const location = useLocation();
  const navigate = useNavigate();

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dateMenuRef = useRef<HTMLDivElement>(null);

  const openEmergencies = events.filter((e) => !e.resolved).length;
  const pageTitle = ROUTE_TITLES[location.pathname] ?? 'Dashboard';

  // Close mobile sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (dateMenuRef.current && !dateMenuRef.current.contains(e.target as Node)) setDateMenuOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-page overflow-x-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        openEmergencies={openEmergencies}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div className="md:ml-[220px] flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-[52px] border-b border-card-border bg-page flex items-center px-5 gap-3 shrink-0 sticky top-0 z-20">
          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-primary/8 transition-colors shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Left: page title + status pills */}
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-[15px] font-semibold text-text-primary whitespace-nowrap">{pageTitle}</h1>
            {/* Live status pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-card-border text-[11px] font-semibold text-success bg-success/[0.07] whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              Live
            </div>
            {/* HIPAA certified badge */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-card-border text-[11px] font-semibold text-primary bg-primary/[0.06] whitespace-nowrap">
              <ShieldCheck className="w-3 h-3" />
              Certified
            </div>
          </div>

          {/* Center: search / command palette trigger */}
          <div className="flex-1 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg border border-card-border bg-page text-[12px] text-text-muted cursor-pointer hover:border-primary/40 transition-colors"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="flex-1 text-left">Search…</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-card-border bg-page font-mono text-text-muted">⌘K</kbd>
            </button>
          </div>

          {/* Right: date filter, notifications, toggles, user */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Date filter dropdown */}
            <div className="relative" ref={dateMenuRef}>
              <button
                type="button"
                onClick={() => setDateMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-card-border text-[12px] text-text-secondary hover:bg-page hover:text-text-primary transition-colors"
              >
                Today
                <ChevronDown className="w-3 h-3" />
              </button>
              {dateMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-card-bg border border-card-border rounded-lg shadow-lg py-1 z-50">
                  {[
                    { label: 'Today',        path: '/app',          days: null },
                    { label: 'Last 7 days',  path: '/app/analytics', days: 7   },
                    { label: 'Last 30 days', path: '/app/analytics', days: 30  },
                    { label: 'Last 90 days', path: '/app/analytics', days: 90  },
                  ].map(({ label, path, days }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setDateMenuOpen(false);
                        navigate(path, days ? { state: { days } } : undefined);
                      }}
                      className="w-full text-left px-3 py-2 text-[12px] text-text-primary hover:bg-page transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification bell → emergency log */}
            <button
              type="button"
              onClick={() => navigate('/app/emergency')}
              className="relative w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-primary/8 transition-colors"
              title={openEmergencies > 0 ? `${openEmergencies} open emergency — click to review` : 'No open emergencies'}
            >
              <Bell className="w-4 h-4" />
              {openEmergencies > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center leading-none">
                  {openEmergencies}
                </span>
              )}
            </button>

            {/* Density toggle */}
            <button
              type="button"
              onClick={toggleDensity}
              title={density === 'comfortable' ? 'Switch to compact' : 'Switch to comfortable'}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-primary/8 transition-colors"
            >
              {density === 'comfortable' ? (
                <AlignJustify className="w-4 h-4" />
              ) : (
                <AlignLeft className="w-4 h-4" />
              )}
            </button>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-primary/8 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* User pill → dropdown with sign out */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-lg border border-card-border text-[12px] text-text-secondary hover:text-text-primary hover:bg-page transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {user?.email?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <span className="hidden sm:inline">{roleLabel(user?.role)}</span>
                <ChevronDown className="w-3 h-3 hidden sm:block" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-card-bg border border-card-border rounded-lg shadow-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-card-border">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        {user?.email?.[0]?.toUpperCase() ?? 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-text-primary truncate">{user?.email}</p>
                        <p className="text-[11px] text-text-muted">{roleLabel(user?.role)}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { navigate('/app/admin/users'); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-text-secondary hover:text-text-primary hover:bg-page transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    Manage users
                  </button>
                  <button
                    type="button"
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-danger hover:bg-danger/5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto" style={{ padding: 'var(--pad)' }}>
          <div className="max-w-[1400px] mx-auto">
            {isSuperAdmin && (
              <div className="mb-5 text-xs text-primary bg-primary/[0.07] border border-primary/20 rounded-lg px-3 py-2">
                Viewing as super-admin — changes affect all tenants
              </div>
            )}
            <Outlet />
          </div>
        </main>
      </div>

      {/* Command palette */}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
