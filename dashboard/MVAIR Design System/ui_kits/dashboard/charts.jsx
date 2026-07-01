/* MedVoice Command Center — chart + control primitives (theme-aware via --app-* vars).
   Exposes window.MvairUI. Pure SVG/React, no deps. */
const { useState, useRef, useEffect, useId } = React;

const ACCENT = 'var(--app-accent)';
const PETROL = 'var(--mvair-primary)';
const AQUA = 'var(--mvair-accent)';
const OK = 'var(--mvair-success)';
const WARN = 'var(--mvair-warning)';
const DANGER = 'var(--mvair-danger)';

/* ---------------- Sparkline ---------------- */
function Sparkline({ data, width = 120, height = 32, color = ACCENT, fill = true, strokeWidth = 2 }) {
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - 4 - ((v - min) / span) * (height - 8)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const gid = useId().replace(/:/g, '');
  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      {fill && (
        <>
          <defs><linearGradient id={'sp' + gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient></defs>
          <path d={area} fill={`url(#sp${gid})`} />
        </>
      )}
      <path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.6" fill={color} />
    </svg>
  );
}

/* ---------------- Bullet graph (actual vs target vs bands) ---------------- */
function BulletGraph({ value, target, max, bands, color = ACCENT, height = 16, label, valueLabel }) {
  bands = bands || [max * 0.6, max * 0.85, max];
  const pct = (v) => Math.min(100, (v / max) * 100);
  const bandColors = ['var(--app-border)', 'var(--app-border-strong)', 'var(--app-hover)'];
  return (
    <div style={{ width: '100%' }}>
      {label && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
        <span style={{ color: 'var(--app-text2)' }}>{label}</span>
        <span style={{ color: 'var(--app-text)', fontWeight: 600 }}>{valueLabel ?? value}</span>
      </div>}
      <div style={{ position: 'relative', height, borderRadius: 4, overflow: 'hidden', background: bandColors[2] }}>
        <div style={{ position: 'absolute', inset: 0, width: pct(bands[1]) + '%', background: bandColors[1] }} />
        <div style={{ position: 'absolute', inset: 0, width: pct(bands[0]) + '%', background: bandColors[0] }} />
        <div style={{ position: 'absolute', top: '28%', height: '44%', left: 0, width: pct(value) + '%', background: color, borderRadius: 3 }} />
        {target != null && <div style={{ position: 'absolute', top: '-10%', height: '120%', left: `calc(${pct(target)}% - 1px)`, width: 2, background: 'var(--app-text)' }} />}
      </div>
    </div>
  );
}

/* ---------------- Line / area chart with axis ---------------- */
function LineChart({ series, labels, height = 200, colors = [PETROL, AQUA], area = true, yFmt = (v) => v }) {
  const ref = useRef(null);
  const [w, setW] = useState(640);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((e) => setW(e[0].contentRect.width));
    ro.observe(ref.current); return () => ro.disconnect();
  }, []);
  const padL = 38, padB = 22, padT = 10, padR = 8;
  const all = series.flatMap((s) => s.data);
  const min = Math.min(...all, 0), max = Math.max(...all) * 1.08 || 1;
  const iw = w - padL - padR, ih = height - padB - padT;
  const xs = (i, n) => padL + (i / (n - 1)) * iw;
  const ys = (v) => padT + ih - ((v - min) / (max - min || 1)) * ih;
  const gid = useId().replace(/:/g, '');
  const ticks = 4;
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width={w} height={height} style={{ display: 'block', overflow: 'visible' }}>
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const v = min + (i / ticks) * (max - min); const y = ys(v);
          return <g key={i}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--app-border)" strokeWidth="1" />
            <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="10" fill="var(--app-muted)">{yFmt(Math.round(v))}</text>
          </g>;
        })}
        {labels && labels.map((l, i) => (i % Math.ceil(labels.length / 7) === 0) && (
          <text key={i} x={xs(i, labels.length)} y={height - 6} textAnchor="middle" fontSize="10" fill="var(--app-muted)">{l}</text>
        ))}
        {series.map((s, si) => {
          const c = colors[si % colors.length];
          const pts = s.data.map((v, i) => [xs(i, s.data.length), ys(v)]);
          const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
          return <g key={si}>
            {area && <>
              <defs><linearGradient id={`lc${gid}${si}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} stopOpacity="0.18" /><stop offset="100%" stopColor={c} stopOpacity="0" />
              </linearGradient></defs>
              <path d={`${line} L${pts[pts.length - 1][0]} ${padT + ih} L${pts[0][0]} ${padT + ih} Z`} fill={`url(#lc${gid}${si})`} />
            </>}
            <path d={line} fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </g>;
        })}
      </svg>
    </div>
  );
}

/* ---------------- Donut ---------------- */
function Donut({ data, size = 140, thickness = 18, centerLabel, centerSub }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const R = (size - thickness) / 2, C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      <svg width={size} height={size} style={{ flex: 'none' }}>
        <g transform={`translate(${size / 2},${size / 2}) rotate(-90)`}>
          <circle r={R} fill="none" stroke="var(--app-border)" strokeWidth={thickness} />
          {data.map((d, i) => {
            const len = (d.value / total) * C;
            const el = <circle key={i} r={R} fill="none" stroke={d.color} strokeWidth={thickness}
              strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} strokeLinecap="butt" />;
            offset += len; return el;
          })}
        </g>
        {centerLabel != null && <text x="50%" y="47%" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--app-text)">{centerLabel}</text>}
        {centerSub && <text x="50%" y="62%" textAnchor="middle" fontSize="10" fill="var(--app-muted)">{centerSub}</text>}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: d.color, flex: 'none' }} />
            <span style={{ color: 'var(--app-text2)', flex: 1 }}>{d.label}</span>
            <span style={{ color: 'var(--app-text)', fontWeight: 600 }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Heatmap (days × hours) ---------------- */
function Heatmap({ grid, rows, height = 150 }) {
  const max = Math.max(...grid.flat()) || 1;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `28px repeat(24, 1fr)`, gap: 2 }}>
        {grid.map((row, ri) => (
          <React.Fragment key={ri}>
            <div style={{ fontSize: 10, color: 'var(--app-muted)', display: 'flex', alignItems: 'center' }}>{rows[ri]}</div>
            {row.map((v, ci) => {
              const a = v / max;
              return <div key={ci} title={`${rows[ri]} ${ci}:00 — ${v} calls`}
                style={{ aspectRatio: '1', borderRadius: 3, background: a === 0 ? 'var(--app-hover)' : `color-mix(in srgb, ${ACCENT} ${15 + a * 85}%, transparent)` }} />;
            })}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--app-muted)', paddingLeft: 30 }}>
        <span>12a</span><span>6a</span><span>12p</span><span>6p</span><span>11p</span>
      </div>
    </div>
  );
}

/* ---------------- Funnel ---------------- */
function Funnel({ stages }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {stages.map((s, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
            <span style={{ color: 'var(--app-text2)' }}>{s.stage}</span>
            <span style={{ color: 'var(--app-text)', fontWeight: 600 }}>{s.value.toLocaleString()} · {s.pct}%</span>
          </div>
          <div style={{ height: 12, borderRadius: 4, background: 'var(--app-hover)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: s.pct + '%', borderRadius: 4, background: `color-mix(in srgb, ${ACCENT} ${55 + i * 12}%, ${AQUA})` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Controls ---------------- */
function Tabs({ tabs, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--app-border)' }}>
      {tabs.map((t) => {
        const on = (t.id ?? t) === value;
        const label = t.label ?? t;
        return <button key={t.id ?? t} onClick={() => onChange(t.id ?? t)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 14px', fontSize: 14, fontWeight: 600,
            color: on ? 'var(--app-text)' : 'var(--app-text2)', borderBottom: `2px solid ${on ? ACCENT : 'transparent'}`, marginBottom: -1 }}>
          {label}{t.count != null && <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--app-muted)' }}>{t.count}</span>}
        </button>;
      })}
    </div>
  );
}

function Segmented({ options, value, onChange, size = 'md' }) {
  const pad = size === 'sm' ? '5px 10px' : '7px 14px';
  return (
    <div style={{ display: 'inline-flex', padding: 3, gap: 2, background: 'var(--app-hover)', borderRadius: 9, border: '1px solid var(--app-border)' }}>
      {options.map((o) => {
        const v = o.value ?? o, on = v === value;
        return <button key={v} onClick={() => onChange(v)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: pad, border: 'none', cursor: 'pointer', borderRadius: 7, fontSize: 13, fontWeight: 600,
            background: on ? 'var(--app-card)' : 'transparent', color: on ? 'var(--app-text)' : 'var(--app-text2)', boxShadow: on ? 'var(--app-shadow)' : 'none' }}>
          {o.icon ? React.createElement(o.icon, { size: 14 }) : null}{o.label ?? o}
        </button>;
      })}
    </div>
  );
}

function Switch({ checked, onChange, size = 18 }) {
  return (
    <button onClick={() => onChange(!checked)} aria-pressed={checked}
      style={{ width: size * 1.9, height: size + 6, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 3,
        background: checked ? ACCENT : 'var(--app-border-strong)', transition: 'background .18s', position: 'relative' }}>
      <span style={{ display: 'block', width: size, height: size, borderRadius: 999, background: '#fff',
        transform: checked ? `translateX(${size * 0.9}px)` : 'none', transition: 'transform .18s', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
    </button>
  );
}

function Select({ value, options, onChange, width }) {
  return (
    <div style={{ position: 'relative', width }}>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', appearance: 'none', padding: '8px 30px 8px 12px', fontSize: 13, fontFamily: 'inherit', fontWeight: 500,
          color: 'var(--app-text)', background: 'var(--app-card)', border: '1px solid var(--app-border)', borderRadius: 8, cursor: 'pointer' }}>
        {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--app-muted)', display: 'flex' }}>
        {React.createElement(window.MvairIcons.ChevronDown, { size: 14 })}
      </span>
    </div>
  );
}

function ProgressBar({ value, max = 100, color = ACCENT, height = 8 }) {
  return (
    <div style={{ height, borderRadius: 999, background: 'var(--app-hover)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: Math.min(100, (value / max) * 100) + '%', background: color, borderRadius: 999, transition: 'width .3s' }} />
    </div>
  );
}

const statusMap = {
  up: { c: OK, t: 'Operational' }, ok: { c: OK, t: 'OK' }, signed: { c: OK, t: 'Signed' },
  connected: { c: OK, t: 'Connected' }, live: { c: OK, t: 'Live' }, confirmed: { c: OK, t: 'Confirmed' },
  resolved: { c: OK, t: 'Resolved' }, synced: { c: OK, t: 'Synced' },
  degraded: { c: WARN, t: 'Degraded' }, pending: { c: WARN, t: 'Pending' }, in_progress: { c: WARN, t: 'In progress' },
  onboarding: { c: WARN, t: 'Onboarding' }, trial: { c: WARN, t: 'Trial' }, open: { c: WARN, t: 'Open' }, rescheduled: { c: WARN, t: 'Rescheduled' },
  down: { c: DANGER, t: 'Down' }, gap: { c: DANGER, t: 'Gap' }, not_started: { c: DANGER, t: 'Not started' }, cancelled: { c: DANGER, t: 'Cancelled' }, lost: { c: DANGER, t: 'Lost' },
  na: { c: 'var(--app-muted)', t: 'N/A' }, available: { c: 'var(--app-muted)', t: 'Available' }, new: { c: PETROL, t: 'New' }, contacted: { c: PETROL, t: 'Contacted' }, booked: { c: OK, t: 'Booked' }, info_only: { c: 'var(--app-muted)', t: 'Info only' }, transferred: { c: WARN, t: 'Transferred' }, triaged: { c: WARN, t: 'Triaged' }, lead_captured: { c: PETROL, t: 'Lead' }, missed: { c: DANGER, t: 'Missed' },
};
function StatusPill({ status, label, dot = true }) {
  const m = statusMap[status] || { c: 'var(--app-muted)', t: label || status };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 999, fontSize: 12, fontWeight: 600,
      background: `color-mix(in srgb, ${m.c} 13%, transparent)`, color: m.c, whiteSpace: 'nowrap' }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: m.c }} />}
      {label || m.t}
    </span>
  );
}

function RAGDot({ status, pulse }) {
  const c = status === 'up' || status === 'ok' ? OK : status === 'degraded' || status === 'pending' ? WARN : status === 'gap' || status === 'down' ? DANGER : 'var(--app-muted)';
  return <span style={{ width: 9, height: 9, borderRadius: 999, background: c, display: 'inline-block', animation: pulse ? 'mv-live 1.8s infinite' : 'none', flex: 'none' }} />;
}

/* MetricStat — KPI tile with delta + optional sparkline */
function MetricStat({ icon, label, value, sub, delta, deltaGood = true, spark, sparkColor = ACCENT, accent }) {
  const Ic = icon;
  const up = delta != null && delta >= 0;
  const good = deltaGood ? up : !up;
  const Arrow = up ? window.MvairIcons.ArrowUpRight : window.MvairIcons.ArrowDownRight;
  return (
    <div className="mv-card mv-anim" style={{ padding: 'var(--cardpad)', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600, color: 'var(--app-text2)' }}>{label}</span>
        {Ic && <span style={{ width: 30, height: 30, borderRadius: 8, display: 'grid', placeItems: 'center', background: accent ? `color-mix(in srgb, ${accent} 14%, transparent)` : 'var(--app-accent-soft)', color: accent || 'var(--app-accent)' }}><Ic size={16} /></span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1, color: 'var(--app-text)' }}>{value}</div>
        {spark && <Sparkline data={spark} color={sparkColor} width={84} height={30} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
        {delta != null && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontWeight: 600, color: good ? OK : DANGER }}><Arrow size={13} />{Math.abs(delta)}%</span>}
        {sub && <span style={{ color: 'var(--app-muted)' }}>{sub}</span>}
      </div>
    </div>
  );
}

function IconButton({ icon, onClick, title, badge, active }) {
  const [h, setH] = useState(false);
  const Ic = icon;
  return (
    <button onClick={onClick} title={title} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: 'relative', width: 36, height: 36, borderRadius: 9, display: 'grid', placeItems: 'center', cursor: 'pointer',
        border: '1px solid ' + (active ? 'var(--app-accent)' : 'var(--app-border)'), background: h || active ? 'var(--app-hover)' : 'var(--app-card)', color: active ? 'var(--app-accent)' : 'var(--app-text2)' }}>
      <Ic size={17} />
      {badge ? <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999, background: DANGER, color: '#fff', fontSize: 10, fontWeight: 700, display: 'grid', placeItems: 'center' }}>{badge}</span> : null}
    </button>
  );
}

function SectionTitle({ children, action }) {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--app-text)' }}>{children}</h3>
    {action}
  </div>;
}

function Kbd({ children }) {
  return <kbd style={{ fontFamily: 'var(--mvair-font-mono)', fontSize: 11, padding: '2px 6px', borderRadius: 5, background: 'var(--app-hover)', border: '1px solid var(--app-border)', color: 'var(--app-text2)' }}>{children}</kbd>;
}

window.MvairUI = {
  Sparkline, BulletGraph, LineChart, Donut, Heatmap, Funnel,
  Tabs, Segmented, Switch, Select, ProgressBar, StatusPill, RAGDot, MetricStat, IconButton, SectionTitle, Kbd,
  colors: { ACCENT, PETROL, AQUA, OK, WARN, DANGER },
};
