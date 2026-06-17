import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  CalendarDays,
  AlertTriangle,
  Activity,
  Settings,
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TenantSwitcher } from '../admin/TenantSwitcher';

const navItems = [
  {
    section: 'ANALYTICS',
    items: [
      { path: '/', icon: LayoutDashboard, label: 'Overview', badge: 0, alert: false },
      { path: '/leads', icon: Users, label: 'Leads', badge: 0, alert: false },
      { path: '/sessions', icon: MessageSquare, label: 'Sessions', badge: 0, alert: false },
      { path: '/appointments', icon: CalendarDays, label: 'Appointments', badge: 0, alert: false },
    ],
  },
  {
    section: 'SAFETY',
    items: [
      {
        path: '/emergency',
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
      { path: '/health', icon: Activity, label: 'System Health', badge: 0, alert: false },
      { path: '/config', icon: Settings, label: 'Configuration', badge: 0, alert: false },
    ],
  },
];

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
                path: '/admin/tenants',
                icon: Building2,
                label: 'Tenants',
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
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">
            M
          </div>
          <div>
            <div className="text-white text-[15px] font-bold">MedVoice</div>
            <div className="text-[11px] text-gray-500">Clinic Dashboard</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <TenantSwitcher />
        {navSections.map((section) => (
          <div key={section.section} className="mb-6">
            <div className="px-6 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
              {section.section}
            </div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-2 transition-colors ${
                    isActive
                      ? 'bg-sidebar-active/20 text-sidebar-active-text border-l-[3px] border-sidebar-active'
                      : 'hover:bg-white/5 text-sidebar-text'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-800">
        <div className="bg-gray-900 border border-gray-800 rounded px-3 py-2 mb-3">
          <div className="text-[11px] text-gray-500 font-mono truncate">{tenantId}</div>
          <div className="text-[11px] text-gray-400 truncate mt-1">{user?.email}</div>
          <div className="text-[10px] text-gray-600 uppercase mt-1">{user?.role}</div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
