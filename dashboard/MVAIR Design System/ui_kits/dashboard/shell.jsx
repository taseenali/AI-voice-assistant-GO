/* MedVoice Command Center — app shell: sidebar, top bar, command palette, notifications.
   Exposes window.Shell. Presentational; state lives in app.jsx. */
const { useState, useEffect, useRef } = React;
const I = window.MvairIcons;
const UI = window.MvairUI;

const NAV = [
  { section: 'Monitor', items: [
    { id: 'overview', label: 'Command Center', icon: I.LayoutDashboard },
    { id: 'live', label: 'Live Monitor', icon: I.Radio, live: true },
    { id: 'calls', label: 'Calls', icon: I.PhoneIncoming },
  ]},
  { section: 'Front desk', items: [
    { id: 'appointments', label: 'Appointments', icon: I.CalendarDays },
    { id: 'leads', label: 'Leads', icon: I.Users },
    { id: 'emergencies', label: 'Emergencies', icon: I.Siren, alert: true },
  ]},
  { section: 'Analyze', items: [
    { id: 'analytics', label: 'Analytics', icon: I.BarChart3 },
    { id: 'health', label: 'System Health', icon: I.Activity },
  ]},
  { section: 'Trust & setup', items: [
    { id: 'trust', label: 'Trust & Compliance', icon: I.ShieldCheck },
    { id: 'integrations', label: 'Integrations', icon: I.Plug },
    { id: 'config', label: 'Aria Configuration', icon: I.Settings },
  ]},
  { section: 'Admin', superAdmin: true, items: [
    { id: 'tenants', label: 'Clinics', icon: I.Building2 },
    { id: 'billing', label: 'Billing & Usage', icon: I.CreditCard },
  ]},
];

const ROLES = [
  { value: 'front_desk', label: 'Front desk', home: 'live' },
  { value: 'manager', label: 'Office manager', home: 'overview' },
  { value: 'exec', label: 'Clinic owner', home: 'overview' },
  { value: 'super_admin', label: 'MVAIR super-admin', home: 'tenants' },
];

const ALL_ROUTES = NAV.flatMap((s) => s.items.map((it) => ({ ...it, section: s.section })));

/* ---------------- Sidebar ---------------- */
function Sidebar({ route, onNav, role, collapsed, onToggle, tenant }) {
  const isSuper = role === 'super_admin';
  return (
    <aside style={{ width: collapsed ? 64 : 232, flex: 'none', background: 'var(--app-sidebar)', display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0, transition: 'width .2s', borderRight: '1px solid rgba(255,255,255,.06)' }}>
      <div style={{ padding: collapsed ? '20px 0' : '20px 18px', display: 'flex', alignItems: 'center', gap: 11, justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <span style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--mvair-primary)', display: 'grid', placeItems: 'center', color: '#fff', fontFamily: 'var(--mvair-font-display)', fontSize: 18, boxShadow: '0 0 0 1px rgba(45,212,191,.35)', flex: 'none' }}>M</span>
        {!collapsed && <div style={{ minWidth: 0 }}>
          <div style={{ color: '#fff', fontSize: 15, fontFamily: 'var(--mvair-font-display)', lineHeight: 1.1 }}>MedVoice</div>
          <div style={{ fontSize: 10.5, color: 'var(--mvair-on-dark-dim)', letterSpacing: '.04em' }}>Command Center</div>
        </div>}
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '6px 10px' }}>
        {NAV.filter((s) => !s.superAdmin || isSuper).map((s) => (
          <div key={s.section} style={{ marginBottom: 16 }}>
            {!collapsed && <div style={{ padding: '0 10px 6px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--mvair-on-dark-dim)' }}>{s.section}</div>}
            {s.items.map((it) => {
              const on = route === it.id;
              return (
                <button key={it.id} onClick={() => onNav(it.id)} title={collapsed ? it.label : undefined}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: collapsed ? '9px 0' : '9px 10px', justifyContent: collapsed ? 'center' : 'flex-start',
                    border: 'none', cursor: 'pointer', borderRadius: 9, marginBottom: 2, fontSize: 13.5, fontWeight: 500, position: 'relative',
                    background: on ? 'rgb(45 212 191 / .16)' : 'transparent', color: on ? '#fff' : 'var(--mvair-on-dark-muted)' }}
                  onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'rgba(255,255,255,.05)'; }}
                  onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
                  {on && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 3, background: 'var(--mvair-accent)' }} />}
                  <span style={{ position: 'relative', display: 'flex' }}>
                    <it.icon size={17} color={it.live ? 'var(--mvair-signal)' : it.alert && !on ? 'var(--mvair-warning)' : 'currentColor'} />
                    {it.live && <span style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, borderRadius: 999, background: 'var(--mvair-signal)', animation: 'mv-live 1.6s infinite' }} />}
                  </span>
                  {!collapsed && <span style={{ flex: 1, textAlign: 'left' }}>{it.label}</span>}
                  {!collapsed && it.id === 'emergencies' && <span style={{ minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: 'var(--mvair-danger)', color: '#fff', fontSize: 10.5, fontWeight: 700, display: 'grid', placeItems: 'center' }}>1</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,.08)' }}>
        {!collapsed && <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 9, padding: '9px 11px', marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tenant.name}</div>
          <div style={{ fontSize: 11, color: 'var(--mvair-on-dark-muted)', marginTop: 2 }}>{tenant.plan} · Tier {tenant.tier}</div>
        </div>}
        <button onClick={onToggle} title="Collapse" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px', border: 'none', background: 'transparent', color: 'var(--mvair-on-dark-muted)', cursor: 'pointer', borderRadius: 8, fontSize: 12.5 }}>
          {collapsed ? <I.ChevronRight size={16} /> : <><I.PanelLeft size={15} /> Collapse</>}
        </button>
      </div>
    </aside>
  );
}

/* ---------------- Tenant switcher (super-admin) ---------------- */
function TenantSwitcher({ tenant, tenants, onPick }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 11px', borderRadius: 9, border: '1px solid var(--app-border)', background: 'var(--app-card)', cursor: 'pointer', color: 'var(--app-text)' }}>
        <I.Building2 size={15} color="var(--app-accent)" />
        <span style={{ fontSize: 13, fontWeight: 600, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tenant.name}</span>
        <I.ChevronDown size={14} color="var(--app-muted)" />
      </button>
      {open && (
        <div className="mv-anim" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, width: 300, background: 'var(--app-elevated)', border: '1px solid var(--app-border)', borderRadius: 12, boxShadow: 'var(--app-shadow-pop)', padding: 6, zIndex: 60 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--app-muted)', padding: '8px 10px 6px' }}>Switch clinic</div>
          {tenants.map((t) => (
            <button key={t.id} onClick={() => { onPick(t); setOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', border: 'none', background: t.id === tenant.id ? 'var(--app-hover)' : 'transparent', cursor: 'pointer', borderRadius: 8, textAlign: 'left' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--app-hover)'} onMouseLeave={(e) => e.currentTarget.style.background = t.id === tenant.id ? 'var(--app-hover)' : 'transparent'}>
              <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--app-accent-soft)', color: 'var(--app-accent)', display: 'grid', placeItems: 'center', flex: 'none', fontWeight: 700, fontSize: 13 }}>{t.name[0]}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--app-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--app-muted)' }}>{t.niche} · {t.city}</div>
              </span>
              <UI.StatusPill status={t.status} dot />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Top bar ---------------- */
function TopBar({ title, role, onRole, tenant, tenants, onTenant, theme, onTheme, density, onDensity, onOpenPalette, onOpenNotif, unread, range, onRange }) {
  const isSuper = role === 'super_admin';
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 40, display: 'flex', alignItems: 'center', gap: 12, padding: '11px var(--pad)', flexWrap: 'nowrap', overflow: 'hidden',
      background: 'color-mix(in srgb, var(--app-bg) 86%, transparent)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--app-border)' }}>
      <div style={{ flex: 'none' }}>
        <h1 style={{ margin: 0, fontSize: 19, fontWeight: 600, fontFamily: 'var(--mvair-font-display)', letterSpacing: '-.01em', color: 'var(--app-text)', whiteSpace: 'nowrap' }}>{title}</h1>
      </div>

      {isSuper && <div style={{ flexShrink: 0 }}><TenantSwitcher tenant={tenant} tenants={tenants} onPick={onTenant} /></div>}

      {/* freshness + certified */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
        <span title="Data freshness" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 999, background: 'color-mix(in srgb, var(--mvair-success) 12%, transparent)', color: 'var(--mvair-success)', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--mvair-success)', animation: 'mv-live 1.8s infinite', flex: 'none' }} /> Live · {window.MV.compliance.dataAsOf}
        </span>
        <span title="All numbers reconcile to a certified dataset" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 999, background: 'var(--app-accent-soft)', color: 'var(--app-accent)', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
          <I.ShieldCheck size={13} /> Certified
        </span>
      </div>

      <button onClick={onOpenPalette} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 9, border: '1px solid var(--app-border)', background: 'var(--app-card)', color: 'var(--app-muted)', cursor: 'pointer', fontSize: 13, flexShrink: 0, whiteSpace: 'nowrap' }}>
        <I.Search size={15} /> <span>Search…</span> <UI.Kbd>⌘K</UI.Kbd>
      </button>

      <UI.Select value={range} onChange={onRange} width={130} options={[
        { value: 'today', label: 'Today' }, { value: '7d', label: 'Last 7 days' }, { value: '30d', label: 'Last 30 days' }, { value: 'qtd', label: 'Quarter to date' },
      ]} />

      <UI.IconButton icon={I.Bell} title="Notifications" onClick={onOpenNotif} badge={unread || null} />
      <UI.IconButton icon={theme === 'dark' ? I.Sun : I.Moon} title="Toggle theme" onClick={onTheme} />
      <UI.IconButton icon={density === 'compact' ? I.Maximize : I.ListChecks} title="Toggle density" onClick={onDensity} />

      <UI.Select value={role} onChange={onRole} width={150} options={ROLES} />
    </header>
  );
}

/* ---------------- Command palette ---------------- */
function CommandPalette({ open, onClose, onNav, role }) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { if (open) { setQ(''); setTimeout(() => inputRef.current && inputRef.current.focus(), 30); } }, [open]);
  if (!open) return null;
  const isSuper = role === 'super_admin';
  const routes = ALL_ROUTES.filter((r) => isSuper || !NAV.find((s) => s.superAdmin && s.items.includes(r)));
  const actions = [
    { id: 'test_line', label: 'Test the line — place a live call', icon: I.PhoneIncoming, kind: 'action' },
    { id: 'export', label: 'Export current view (CSV)', icon: I.Download, kind: 'action' },
    { id: 'config', label: 'Edit Aria greeting', icon: I.Settings, kind: 'nav' },
  ];
  const all = [...routes.map((r) => ({ id: r.id, label: r.label, icon: r.icon, kind: 'nav', section: r.section })), ...actions];
  const filtered = all.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(8,15,18,.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh' }}>
      <div onClick={(e) => e.stopPropagation()} className="mv-anim" style={{ width: 'min(620px, 92vw)', background: 'var(--app-elevated)', border: '1px solid var(--app-border)', borderRadius: 14, boxShadow: 'var(--app-shadow-pop)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--app-border)' }}>
          <I.Search size={18} color="var(--app-muted)" />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search screens and actions…"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, color: 'var(--app-text)', fontFamily: 'inherit' }} />
          <UI.Kbd>esc</UI.Kbd>
        </div>
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: 8 }}>
          {filtered.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--app-muted)', fontSize: 13 }}>No matches</div>}
          {filtered.map((a) => (
            <button key={a.id + a.kind} onClick={() => { if (a.kind === 'nav') onNav(a.id); onClose(); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 9, textAlign: 'left' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--app-hover)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <span style={{ width: 30, height: 30, borderRadius: 8, display: 'grid', placeItems: 'center', background: 'var(--app-accent-soft)', color: 'var(--app-accent)', flex: 'none' }}><a.icon size={15} /></span>
              <span style={{ flex: 1, fontSize: 14, color: 'var(--app-text)' }}>{a.label}</span>
              <span style={{ fontSize: 11, color: 'var(--app-muted)' }}>{a.kind === 'action' ? 'Action' : a.section}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Notifications drawer ---------------- */
const notifIcon = { emergency: I.Siren, warning: I.AlertTriangle, success: I.CheckCircle, info: I.Info2 };
const notifColor = { emergency: 'var(--mvair-danger)', warning: 'var(--mvair-warning)', success: 'var(--mvair-success)', info: 'var(--mvair-primary)' };
function NotificationsDrawer({ open, onClose }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(8,15,18,.4)' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: 'min(400px, 92vw)', background: 'var(--app-elevated)', borderLeft: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow-pop)', display: 'flex', flexDirection: 'column', animation: 'mv-pop .2s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid var(--app-border)' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--app-text)' }}>Notifications</h3>
          <UI.IconButton icon={I.X} onClick={onClose} title="Close" />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {window.MV.notifications.map((n) => (
            <div key={n.id} style={{ display: 'flex', gap: 12, padding: 12, borderRadius: 10, marginBottom: 6, background: n.unread ? 'var(--app-hover)' : 'transparent', border: '1px solid var(--app-border)' }}>
              <span style={{ width: 32, height: 32, borderRadius: 8, flex: 'none', display: 'grid', placeItems: 'center', background: `color-mix(in srgb, ${notifColor[n.kind]} 14%, transparent)`, color: notifColor[n.kind] }}>{React.createElement(notifIcon[n.kind], { size: 16 })}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--app-text)' }}>{n.title}</span>
                  <span style={{ fontSize: 11, color: 'var(--app-muted)', flex: 'none' }}>{n.when}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--app-text2)', marginTop: 2 }}>{n.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.Shell = { NAV, ROLES, ALL_ROUTES, Sidebar, TopBar, CommandPalette, NotificationsDrawer };
