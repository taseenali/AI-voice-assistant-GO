import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
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
import { useTenants } from '../../hooks/useTenants';
import { TenantSwitcher } from '../admin/TenantSwitcher';

const NAV_ALL = [
  {
    section: 'MONITOR',
    minRole: 'staff' as const,
    items: [
      { path: '/app', label: 'Command Center', icon: LayoutDashboard, end: true },
      { path: '/app/live', label: 'Live Monitor', icon: Radio, live: true },
      { path: '/app/calls', label: 'Calls', icon: Phone },
    ],
  },
  {
    section: 'FRONT DESK',
    minRole: 'staff' as const,
    items: [
      { path: '/app/appointments', label: 'Appointments', icon: CalendarDays },
      { path: '/app/leads', label: 'Leads', icon: Users },
      { path: '/app/emergency', label: 'Emergencies', icon: AlertTriangle, alert: true },
    ],
  },
  {
    section: 'ANALYZE',
    minRole: 'admin' as const,
    items: [
      { path: '/app/analytics', label: 'Analytics', icon: BarChart2 },
      { path: '/app/health', label: 'System Health', icon: Activity },
    ],
  },
  {
    section: 'TRUST & SETUP',
    minRole: 'admin' as const,
    items: [
      { path: '/app/trust', label: 'Trust & Compliance', icon: ShieldCheck },
      { path: '/app/integrations', label: 'Integrations', icon: Link2 },
      { path: '/app/config', label: 'Aria Config', icon: Settings },
      { path: '/app/billing', label: 'Billing', icon: CreditCard },
    ],
  },
  {
    section: 'MY TEAM',
    minRole: 'admin' as const,
    items: [
      { path: '/app/admin/users', label: 'Users', icon: UserCog },
    ],
  },
  {
    section: 'ADMIN',
    minRole: 'super_admin' as const,
    items: [
      { path: '/app/admin/tenants', label: 'Clinics', icon: Building2 },
      { path: '/app/admin/audit-log', label: 'Audit Log', icon: ClipboardList },
    ],
  },
];

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
  live?: boolean;
  alert?: boolean;
  badge?: number;
}

function NavRow({ item }: { item: NavItem }) {
  return (
    <NavLink
      to={item.path}
      end={item.end}
      className={({ isActive }) =>
        `flex items-center gap-2.5 mx-2 px-3 py-[7px] rounded-lg transition-colors ${
          isActive
            ? 'bg-white/[0.12] text-white'
            : 'hover:bg-white/[0.06] text-[#A9BAC0] hover:text-white'
        }`
      }
    >
      <item.icon
        className={`w-4 h-4 shrink-0 ${item.live ? 'text-signal' : ''} ${item.alert ? 'text-danger' : ''}`}
      />
      <span className="flex-1 text-[13px] font-medium">{item.label}</span>
      {item.live && <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />}
      {item.badge != null && item.badge > 0 && (
        <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center">
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}

interface SidebarProps {
  openEmergencies?: number;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ openEmergencies = 0, mobileOpen = false, onMobileClose }: SidebarProps) {
  const { user, tenantId, logout, isSuperAdmin, viewingTenantId } = useAuth();
  const { tenants } = useTenants();
  const navigate = useNavigate();

  const isStaff = user?.role === 'clinic_staff';

  const sections = NAV_ALL.filter((sec) => {
    if (sec.minRole === 'super_admin') return isSuperAdmin;
    if (sec.minRole === 'admin') return !isStaff;
    return true;
  });

  // Inject badge onto Emergencies nav item
  const sectionsWithBadge = sections.map((sec) => ({
    ...sec,
    items: sec.items.map((item: NavItem) => ({
      ...item,
      badge: item.alert ? openEmergencies : undefined,
    })),
  }));

  const viewingTenant = tenants.find((t) => t.tenant_id === viewingTenantId);
  const companyName = viewingTenant?.company_name ?? tenantId;
  const planTier = viewingTenant?.plan_tier;

  return (
    <aside className={`w-[220px] h-screen bg-sidebar text-sidebar-text flex flex-col fixed z-30 transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      {/* Logo */}
      <div className="px-4 py-4 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white font-display text-sm ring-1 ring-accent/30 shrink-0">
            M
          </div>
          <div className="min-w-0">
            <div className="text-white text-[14px] font-display leading-tight truncate">MedVoice</div>
            <div className="text-[10px] text-[#6E838A] tracking-wide truncate">AI Receptionist</div>
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          type="button"
          onClick={onMobileClose}
          className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg text-[#6E838A] hover:text-white hover:bg-white/[0.08] transition-colors shrink-0"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {isSuperAdmin && <TenantSwitcher />}

        {sectionsWithBadge.map((section) => (
          <div key={section.section} className="mb-4">
            <div className="px-5 mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#4A6068]">
              {section.section}
            </div>
            {section.items.map((item) => (
              <NavRow key={item.path} item={item as NavItem} />
            ))}
          </div>
        ))}
      </nav>

      {/* Tenant footer */}
      <div className="px-3 pb-3 pt-2 border-t border-white/[0.08] shrink-0">
        <button
          type="button"
          onClick={() => navigate('/app')}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-colors mb-1"
        >
          <div className="text-[13px] font-semibold text-white truncate">{companyName}</div>
          <div className="text-[11px] text-[#6E838A] flex items-center gap-1 mt-0.5">
            {planTier && <span className="capitalize">{planTier}</span>}
            {planTier && <span>·</span>}
            <span className="truncate">
              {user?.role === 'super_admin' ? 'Super admin' : user?.role === 'clinic_staff' ? 'Staff' : 'Clinic admin'}
            </span>
          </div>
        </button>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] text-[#6E838A] hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
