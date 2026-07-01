import { NavLink } from 'react-router-dom';
import { LogOut, ExternalLink } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  CalendarDays,
  AlertTriangle,
  Activity,
  Settings,
  Building2,
  Radio,
  BarChart2,
  ShieldCheck,
  ClipboardList,
  UserCog,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TenantSwitcher } from '../admin/TenantSwitcher';

const navItems = [
  {
    section: 'ANALYTICS',
    items: [
      { path: '/app', icon: LayoutDashboard, label: 'Overview', badge: 0, alert: false },
      { path: '/app/analytics', icon: BarChart2, label: 'Analytics', badge: 0, alert: false },
      { path: '/app/leads', icon: Users, label: 'Leads', badge: 0, alert: false },
      { path: '/app/sessions', icon: MessageSquare, label: 'Sessions', badge: 0, alert: false },
      { path: '/app/appointments', icon: CalendarDays, label: 'Appointments', badge: 0, alert: false },
    ],
  },
  {
    section: 'SAFETY',
    items: [
      {
        path: '/app/emergency',
        icon: AlertTriangle,
        label: 'Emergency Log',
        badge: 0,
        alert: true,
      },
    ],
  },
  {
    section: 'SYSTEM',
    items: [
      { path: '/app/health', icon: Activity, label: 'System Health', badge: 0, alert: false },
      { path: '/app/config', icon: Settings, label: 'Configuration', badge: 0, alert: false },
    ],
  },
];

const LIVE_MONITOR_URL = 'http://localhost:3000';

export function Sidebar() {
  const { user, tenantId, logout, isSuperAdmin } = useAuth();

  const navSections = [
    ...navItems,
    ...(isSuperAdmin
      ? [
          {
            section: 'ADMIN',
            items: [
              {
                path: '/app/admin/tenants',
                icon: Building2,
                label: 'Tenants',
                badge: 0,
                alert: false,
              },
              {
                path: '/app/admin/compliance',
                icon: ShieldCheck,
                label: 'Compliance',
                badge: 0,
                alert: false,
              },
              {
                path: '/app/admin/audit-log',
                icon: ClipboardList,
                label: 'Audit Log',
                badge: 0,
                alert: false,
              },
              {
                path: '/app/admin/users',
                icon: UserCog,
                label: 'Users',
                badge: 0,
                alert: false,
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <aside className="w-[220px] h-screen bg-sidebar text-sidebar-text flex flex-col fixed">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-display text-lg ring-1 ring-accent/30">
            M
          </div>
          <div>
            <div className="text-white text-[16px] font-display leading-tight">MedVoice</div>
            <div className="text-[11px] text-on-dark-dim tracking-wide">Clinic Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <TenantSwitcher />
        {navSections.map((section) => (
          <div key={section.section} className="mb-6">
            <div className="px-6 mb-2 text-[11px] font-semibold uppercase tracking-wider text-on-dark-dim">
              {section.section}
            </div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-2 transition-colors ${
                    isActive
                      ? 'bg-sidebar-active/20 text-sidebar-active-text border-l-[3px] border-sidebar-active'
                      : 'hover:bg-white/5 text-on-dark-muted hover:text-white border-l-[3px] border-transparent'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}

        {/* Live Monitor — opens in new tab (separate Vite app on port 3000) */}
        <div className="mb-6">
          <div className="px-6 mb-2 text-[11px] font-semibold uppercase tracking-wider text-on-dark-dim">
            LIVE
          </div>
          <a
            href={LIVE_MONITOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-2 transition-colors hover:bg-white/5 text-on-dark-muted hover:text-white border-l-[3px] border-transparent group"
          >
            <Radio className="w-4 h-4 text-signal" />
            <span className="flex-1 text-sm font-medium">Live Monitor</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
          </a>
        </div>
      </nav>

      <div className="p-6 border-t border-white/10">
        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-3">
          <div className="text-[11px] text-on-dark-muted font-mono truncate">{tenantId}</div>
          <div className="text-[11px] text-on-dark truncate mt-1">{user?.email}</div>
          <div className="text-[10px] text-on-dark-dim uppercase tracking-wide mt-1">{user?.role}</div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-on-dark-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
