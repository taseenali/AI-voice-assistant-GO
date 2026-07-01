import { NavLink } from 'react-router-dom';
import { LogOut, ExternalLink } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Phone,
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
  Link2,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TenantSwitcher } from '../admin/TenantSwitcher';

const NAV = [
  {
    section: 'COMMAND',
    items: [
      { path: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
      { path: '/app/live', label: 'Live Monitor', icon: Radio, live: true },
    ],
  },
  {
    section: 'PATIENTS',
    items: [
      { path: '/app/calls', label: 'Calls', icon: Phone },
      { path: '/app/appointments', label: 'Appointments', icon: CalendarDays },
      { path: '/app/leads', label: 'Leads', icon: Users },
      { path: '/app/emergency', label: 'Emergencies', icon: AlertTriangle, alert: true },
    ],
  },
  {
    section: 'INSIGHTS',
    items: [
      { path: '/app/analytics', label: 'Analytics', icon: BarChart2 },
      { path: '/app/health', label: 'System Health', icon: Activity },
      { path: '/app/trust', label: 'Trust & Compliance', icon: ShieldCheck },
    ],
  },
  {
    section: 'PLATFORM',
    items: [
      { path: '/app/integrations', label: 'Integrations', icon: Link2 },
      { path: '/app/config', label: 'Aria Config', icon: Settings },
      { path: '/app/billing', label: 'Billing', icon: CreditCard },
    ],
  },
];

const ADMIN_NAV = {
  section: 'ADMIN',
  items: [
    { path: '/app/admin/tenants', label: 'Clinics', icon: Building2 },
    { path: '/app/admin/audit-log', label: 'Audit Log', icon: ClipboardList },
    { path: '/app/admin/users', label: 'Users', icon: UserCog },
  ],
};

const LIVE_MONITOR_URL = 'http://localhost:3000';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
  live?: boolean;
  alert?: boolean;
}

function NavRow({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.path}
      end={item.end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-6 py-2 transition-colors border-l-[3px] ${
          isActive
            ? 'bg-white/10 text-white border-primary'
            : 'hover:bg-white/5 text-on-dark-muted hover:text-white border-transparent'
        }`
      }
    >
      <item.icon
        className={`w-4 h-4 shrink-0 ${item.live ? 'text-signal' : ''} ${item.alert ? 'text-danger' : ''}`}
      />
      <span className="flex-1 text-sm font-medium">{item.label}</span>
      {item.live && <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />}
    </NavLink>
  );
}

export function Sidebar() {
  const { user, tenantId, logout, isSuperAdmin } = useAuth();

  const sections = isSuperAdmin ? [...NAV, ADMIN_NAV] : NAV;

  return (
    <aside className="w-[220px] h-screen bg-sidebar text-sidebar-text flex flex-col fixed z-30">
      {/* Logo */}
      <div className="p-5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-display text-base ring-1 ring-accent/30 shrink-0">
            M
          </div>
          <div className="min-w-0">
            <div className="text-white text-[15px] font-display leading-tight truncate">MedVoice</div>
            <div className="text-[10px] text-on-dark-dim tracking-wide truncate">AI Receptionist</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        {isSuperAdmin && <TenantSwitcher />}

        {sections.map((section) => (
          <div key={section.section} className="mb-5">
            <div className="px-6 mb-1 text-[10px] font-semibold uppercase tracking-widest text-on-dark-dim">
              {section.section}
            </div>
            {section.items.map((item) => (
              <NavRow key={item.path} item={item as NavItem} />
            ))}
          </div>
        ))}

        {/* External live monitor link */}
        <div className="mb-5">
          <div className="px-6 mb-1 text-[10px] font-semibold uppercase tracking-widest text-on-dark-dim">
            EXTERNAL
          </div>
          <a
            href={LIVE_MONITOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-2 transition-colors border-l-[3px] border-transparent hover:bg-white/5 text-on-dark-muted hover:text-white group"
          >
            <Radio className="w-4 h-4 shrink-0 text-signal" />
            <span className="flex-1 text-sm font-medium">Live (port 3000)</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
          </a>
        </div>
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-2">
          <div className="text-[10px] text-on-dark-muted font-mono truncate">{tenantId}</div>
          <div className="text-[11px] text-on-dark truncate mt-0.5">{user?.email}</div>
          <div className="text-[10px] text-on-dark-dim uppercase tracking-wide mt-0.5">{user?.role}</div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-on-dark-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
