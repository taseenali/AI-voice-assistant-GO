/* MedVoice Command Center — app root: state, routing, keyboard, render. */
const { useState, useEffect } = React;
const { Sidebar, TopBar, CommandPalette, NotificationsDrawer, ROLES, ALL_ROUTES } = window.Shell;

const TITLES = {
  overview: 'Command Center', live: 'Live Monitor', calls: 'Calls', appointments: 'Appointments',
  leads: 'Leads', emergencies: 'Emergencies', analytics: 'Analytics', health: 'System Health',
  trust: 'Trust & Compliance', integrations: 'Integrations', config: 'Aria Configuration',
  tenants: 'Clinics', billing: 'Billing & Usage',
};

function App() {
  const [route, setRoute] = useState('overview');
  const [role, setRole] = useState('manager');
  const [tenant, setTenant] = useState(window.MV.tenants[0]);
  const [theme, setTheme] = useState('light');
  const [density, setDensity] = useState('comfortable');
  const [collapsed, setCollapsed] = useState(false);
  const [palette, setPalette] = useState(false);
  const [notif, setNotif] = useState(false);
  const [range, setRange] = useState('today');

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => { document.documentElement.setAttribute('data-density', density); }, [density]);
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((p) => !p); }
      if (e.key === 'Escape') { setPalette(false); setNotif(false); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, []);

  const onRole = (r) => { setRole(r); const home = (ROLES.find((x) => x.value === r) || {}).home; if (home) setRoute(home); };

  const S1 = window.Screens1, S2 = window.Screens2, S3 = window.Screens3, S4 = window.Screens4;
  const go = setRoute;
  let screen;
  switch (route) {
    case 'overview': screen = <S1.Overview go={go} />; break;
    case 'live': screen = <S1.LiveMonitor />; break;
    case 'calls': screen = <S1.Calls />; break;
    case 'appointments': screen = <S2.Appointments />; break;
    case 'leads': screen = <S2.Leads />; break;
    case 'emergencies': screen = <S2.Emergencies />; break;
    case 'analytics': screen = <S3.Analytics />; break;
    case 'health': screen = <S3.Health />; break;
    case 'trust': screen = <S4.Trust />; break;
    case 'integrations': screen = <S4.Integrations />; break;
    case 'config': screen = <S4.Config />; break;
    case 'tenants': screen = <S4.Tenants onPick={setTenant} />; break;
    case 'billing': screen = <S4.Billing />; break;
    default: screen = <S1.Overview go={go} />;
  }

  const unread = window.MV.notifications.filter((n) => n.unread).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--app-bg)' }}>
      <Sidebar route={route} onNav={setRoute} role={role} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} tenant={tenant} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar
          title={TITLES[route]} role={role} onRole={onRole}
          tenant={tenant} tenants={window.MV.tenants} onTenant={setTenant}
          theme={theme} onTheme={() => setTheme((t) => t === 'light' ? 'dark' : 'light')}
          density={density} onDensity={() => setDensity((d) => d === 'comfortable' ? 'compact' : 'comfortable')}
          onOpenPalette={() => setPalette(true)} onOpenNotif={() => setNotif(true)} unread={unread}
          range={range} onRange={setRange}
        />
        <main key={route} style={{ flex: 1, minWidth: 0 }}>{screen}</main>
      </div>
      <CommandPalette open={palette} onClose={() => setPalette(false)} onNav={setRoute} role={role} />
      <NotificationsDrawer open={notif} onClose={() => setNotif(false)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
