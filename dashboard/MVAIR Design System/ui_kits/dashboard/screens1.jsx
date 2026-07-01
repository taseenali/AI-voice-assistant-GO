/* MedVoice Command Center — screens 1: Overview, Live Monitor, Calls + drill-down.
   Exposes window.Screens1. */
const { useState, useEffect, useRef } = React;
const S1_I = window.MvairIcons;
const S1 = window.MvairUI;
const { MetricStat, LineChart, Sparkline, BulletGraph, Donut, StatusPill, RAGDot, SectionTitle, Tabs, Segmented, Funnel } = S1;

function Page({ children }) {
  return <div className="mv-anim" style={{ padding: 'var(--pad)', display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>{children}</div>;
}
function Card({ children, style, pad = true }) {
  return <div className="mv-card" style={{ padding: pad ? 'var(--cardpad)' : 0, ...style }}>{children}</div>;
}
const money = window.MV.money;
const intentBadge = window.MV.intentToBadge;

/* ============ OVERVIEW / COMMAND CENTER ============ */
function Overview({ go }) {
  const k = window.MV.kpis, t = window.MV.trend;
  return (
    <Page>
      {/* Emergency banner — actionability surfaced top */}
      <div className="mv-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, borderLeft: '4px solid var(--mvair-danger)' }}>
        <span style={{ width: 34, height: 34, borderRadius: 9, background: 'color-mix(in srgb, var(--mvair-danger) 14%, transparent)', color: 'var(--mvair-danger)', display: 'grid', placeItems: 'center', flex: 'none' }}><S1_I.Siren size={18} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text)' }}>1 open emergency awaiting callback · E-202 high fever, infant</div>
          <div style={{ fontSize: 12.5, color: 'var(--app-text2)' }}>Flagged 02:14 by Aria · owner Dr. Chen · escalation protocol triggered</div>
        </div>
        <button onClick={() => go('emergencies')} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: 'var(--mvair-danger)', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Review</button>
      </div>

      {/* KPI row — the 5-second glance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap)' }}>
        <MetricStat icon={S1_I.PhoneIncoming} label="Calls answered today" value={k.callsToday} delta={k.callsTodayDelta} sub="100% answered" spark={t.calls} />
        <MetricStat icon={S1_I.CalendarCheck} label="Appointments booked" value={k.appointmentsBooked} delta={k.appointmentsDelta} sub={`${k.leadConvRate}% conv.`} spark={t.booked} accent="var(--mvair-success)" sparkColor="var(--mvair-success)" />
        <MetricStat icon={S1_I.ListChecks} label="Task completion" value={k.taskCompletion + '%'} delta={k.taskCompletionDelta} sub="hero outcome" spark={t.completion} accent="var(--mvair-accent)" sparkColor="var(--mvair-accent)" />
        <MetricStat icon={S1_I.TrendingUp} label="Revenue recovered" value={money(k.revenueRecovered)} sub={`${k.missedCallValue ? '$450/missed call' : ''}`} accent="var(--mvair-warning)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 'var(--gap)' }}>
        {/* Call volume + bookings */}
        <Card>
          <SectionTitle action={<Segmented size="sm" value="14d" onChange={() => {}} options={[{ value: '14d', label: '14d' }, { value: '30d', label: '30d' }]} />}>Call volume &amp; bookings</SectionTitle>
          <LineChart height={220} labels={['','','','','','','','','','','','','','Today']} series={[{ name: 'Calls', data: t.calls }, { name: 'Booked', data: t.booked }]} />
          <div style={{ display: 'flex', gap: 18, marginTop: 10, fontSize: 12.5 }}>
            <Legend color="var(--mvair-primary)" label="Calls answered" />
            <Legend color="var(--mvair-accent)" label="Appointments booked" />
          </div>
        </Card>

        {/* Progress vs targets — bullet graphs (strategic) */}
        <Card>
          <SectionTitle>This month vs. plan</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <BulletGraph label="Answer rate" value={100} target={98} max={100} valueLabel="100%" color="var(--mvair-success)" />
            <BulletGraph label="Task completion" value={92} target={90} max={100} valueLabel="92%" color="var(--mvair-accent)" />
            <BulletGraph label="Booking conversion" value={71} target={75} max={100} valueLabel="71%" color="var(--mvair-warning)" />
            <BulletGraph label="After-hours coverage" value={38} target={30} max={60} valueLabel="38%" color="var(--mvair-primary)" />
          </div>
          <div style={{ marginTop: 16, fontSize: 11.5, color: 'var(--app-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 2, height: 12, background: 'var(--app-text)' }} /> target marker
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--gap)' }}>
        {/* Outcomes donut */}
        <Card>
          <SectionTitle>Today's outcomes</SectionTitle>
          <Donut centerLabel="47" centerSub="calls" data={[
            { label: 'Booked', value: 21, color: 'var(--mvair-success)' },
            { label: 'Lead captured', value: 14, color: 'var(--mvair-primary)' },
            { label: 'Triaged', value: 5, color: 'var(--mvair-warning)' },
            { label: 'Info only', value: 7, color: 'var(--app-border-strong)' },
          ]} />
        </Card>
        {/* AI insight callout */}
        <Card style={{ background: 'linear-gradient(180deg, var(--app-accent-soft), transparent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <S1_I.Sparkles size={16} color="var(--app-accent)" />
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--app-accent)' }}>AI insight</span>
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--app-text)', marginBottom: 8, lineHeight: 1.4 }}>After-hours bookings up 22% this week</div>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--app-text2)', lineHeight: 1.6 }}>Most after-hours calls cluster 6–9 PM. Aria captured 18 visits that would have hit voicemail — an estimated {money(8100)} in recovered revenue.</p>
          <button onClick={() => go('analytics')} style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--app-border)', background: 'var(--app-card)', color: 'var(--app-text)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>See analysis <S1_I.ArrowUpRight size={14} /></button>
        </Card>
        {/* System + trust mini */}
        <Card>
          <SectionTitle action={<button onClick={() => go('health')} style={linkBtn}>Details</button>}>System &amp; trust</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {window.MV.health.services.slice(0, 4).map((s) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <RAGDot status={s.status} pulse={s.status === 'up'} />
                <span style={{ flex: 1, fontSize: 13, color: 'var(--app-text)' }}>{s.name}</span>
                <span style={{ fontSize: 12, color: 'var(--app-muted)' }}>{s.metric}</span>
              </div>
            ))}
            <div style={{ height: 1, background: 'var(--app-border)', margin: '4px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <S1_I.ShieldCheck size={15} color="var(--mvair-success)" />
              <span style={{ flex: 1, fontSize: 13, color: 'var(--app-text)' }}>HIPAA BAA · certified</span>
              <button onClick={() => go('trust')} style={linkBtn}>View</button>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent calls */}
      <Card pad={false}>
        <div style={{ padding: '16px var(--cardpad) 4px' }}><SectionTitle action={<button onClick={() => go('calls')} style={linkBtn}>View all calls</button>}>Recent calls</SectionTitle></div>
        <CallTable rows={window.MV.sessions.slice(0, 6)} onRow={() => go('calls')} compactCols />
      </Card>
    </Page>
  );
}
const linkBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--app-accent)', fontSize: 13, fontWeight: 600 };
function Legend({ color, label }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--app-text2)' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: color }} />{label}</span>;
}

/* ============ LIVE MONITOR ============ */
function LiveMonitor() {
  const [sel, setSel] = useState(window.MV.liveCalls[0].id);
  const [tick, setTick] = useState(0);
  useEffect(() => { const i = setInterval(() => setTick((t) => t + 1), 1000); return () => clearInterval(i); }, []);
  const call = window.MV.liveCalls.find((c) => c.id === sel) || window.MV.liveCalls[0];
  const fmt = (s) => `${Math.floor((s + tick) / 60)}:${String((s + tick) % 60).padStart(2, '0')}`;
  return (
    <Page>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap)' }}>
        <LiveStat icon={S1_I.Radio} label="Active calls" value={window.MV.liveCalls.length} live />
        <LiveStat icon={S1_I.Headset} label="In queue" value={0} />
        <LiveStat icon={S1_I.Gauge} label="Live latency" value="664ms" />
        <LiveStat icon={S1_I.Clock} label="Avg wait" value="0s" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 'var(--gap)' }}>
        <Card pad={false}>
          <div style={{ padding: '14px var(--cardpad)', borderBottom: '1px solid var(--app-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--mvair-signal)', animation: 'mv-live 1.4s infinite' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text)' }}>Active calls</span>
          </div>
          {window.MV.liveCalls.map((c) => (
            <button key={c.id} onClick={() => setSel(c.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px var(--cardpad)', border: 'none', borderBottom: '1px solid var(--app-border)', cursor: 'pointer', textAlign: 'left', background: c.id === sel ? 'var(--app-hover)' : 'transparent' }}>
              <span style={{ width: 34, height: 34, borderRadius: 8, flex: 'none', display: 'grid', placeItems: 'center', background: c.sentiment === 'urgent' ? 'color-mix(in srgb, var(--mvair-danger) 14%, transparent)' : 'var(--app-accent-soft)', color: c.sentiment === 'urgent' ? 'var(--mvair-danger)' : 'var(--app-accent)' }}>{c.channel === 'phone' ? <S1_I.PhoneIncoming size={16} /> : <S1_I.Globe size={16} />}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--app-text)' }}>{c.caller}</div>
                <div style={{ fontSize: 12, color: 'var(--app-text2)' }}>{c.state}</div>
              </div>
              {c.sentiment === 'urgent' && <StatusPill status="open" label="urgent" />}
              <span style={{ fontFamily: 'var(--mvair-font-mono)', fontSize: 13, color: 'var(--app-muted)' }}>{fmt(c.since)}</span>
            </button>
          ))}
        </Card>
        <Card pad={false}>
          <div style={{ padding: '14px var(--cardpad)', borderBottom: '1px solid var(--app-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text)' }}>{call.caller}</div><div style={{ fontSize: 12, color: 'var(--app-text2)' }}>Intent: {call.intent} · {call.state}</div></div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 8, background: 'var(--app-hover)', fontSize: 12.5, color: 'var(--app-text2)' }}><S1_I.Volume2 size={14} /> Listen</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 11px', borderRadius: 8, background: 'color-mix(in srgb, var(--mvair-danger) 12%, transparent)', color: 'var(--mvair-danger)', fontSize: 12.5, fontWeight: 600 }}><S1_I.PhoneIncoming size={14} /> Take over</span>
            </div>
          </div>
          <div style={{ padding: 'var(--cardpad)', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 360, overflowY: 'auto' }}>
            {window.MV.liveTranscript.map((m, i) => <Bubble key={i} role={m.role} text={m.t} />)}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--app-muted)', fontSize: 12.5 }}>
              <span style={{ display: 'flex', gap: 3 }}>{[0, 1, 2].map((d) => <span key={d} style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--app-accent)', animation: `mv-live 1s ${d * 0.2}s infinite` }} />)}</span> Aria is speaking…
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
}
function LiveStat({ icon, label, value, live }) {
  const Ic = icon;
  return <Card style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
    <span style={{ width: 40, height: 40, borderRadius: 10, display: 'grid', placeItems: 'center', background: 'var(--app-accent-soft)', color: 'var(--app-accent)', flex: 'none', position: 'relative' }}>
      <Ic size={19} />{live && <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 999, background: 'var(--mvair-signal)', animation: 'mv-live 1.4s infinite' }} />}
    </span>
    <div><div style={{ fontSize: 24, fontWeight: 700, color: 'var(--app-text)', lineHeight: 1 }}>{value}</div><div style={{ fontSize: 12, color: 'var(--app-text2)', marginTop: 3 }}>{label}</div></div>
  </Card>;
}
function Bubble({ role, text }) {
  const aria = role === 'aria';
  return <div style={{ display: 'flex', gap: 10, flexDirection: aria ? 'row' : 'row-reverse' }}>
    {aria && <span style={{ width: 26, height: 26, borderRadius: 999, flex: 'none', background: 'var(--mvair-primary)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>A</span>}
    <div style={{ maxWidth: '78%', padding: '9px 13px', borderRadius: 13, fontSize: 13.5, lineHeight: 1.5, background: aria ? 'var(--app-hover)' : 'var(--mvair-primary)', color: aria ? 'var(--app-text)' : '#fff', borderTopLeftRadius: aria ? 4 : 13, borderTopRightRadius: aria ? 13 : 4 }}>{text}</div>
  </div>;
}

/* ============ CALLS EXPLORER ============ */
function Calls() {
  const [channel, setChannel] = useState('all');
  const [intent, setIntent] = useState('all');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(null);
  let rows = window.MV.sessions;
  if (channel !== 'all') rows = rows.filter((r) => r.channel === channel);
  if (intent !== 'all') rows = rows.filter((r) => r.intent === intent);
  if (q) rows = rows.filter((r) => (r.caller + (r.name || '') + r.id).toLowerCase().includes(q.toLowerCase()));
  return (
    <Page>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap)' }}>
        <MetricStat icon={S1_I.PhoneIncoming} label="Total calls" value={window.MV.sessions.length} sub="last 7 days" />
        <MetricStat icon={S1_I.ListChecks} label="Completed" value={window.MV.sessions.filter((s) => s.completed).length} accent="var(--mvair-success)" />
        <MetricStat icon={S1_I.Voicemail} label="Missed / transferred" value={window.MV.sessions.filter((s) => !s.completed).length} accent="var(--mvair-warning)" />
        <MetricStat icon={S1_I.Clock} label="Avg handle time" value="3m 42s" />
      </div>
      <Card pad={false}>
        <div style={{ padding: '14px var(--cardpad)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', borderBottom: '1px solid var(--app-border)' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--app-muted)', display: 'flex' }}><S1_I.Search size={15} /></span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search caller, name, session id…" style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid var(--app-border)', borderRadius: 9, background: 'var(--app-card)', color: 'var(--app-text)', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
          </div>
          <Segmented size="sm" value={channel} onChange={setChannel} options={[{ value: 'all', label: 'All' }, { value: 'phone', label: 'Phone' }, { value: 'web', label: 'Web' }]} />
          <S1.Select value={intent} onChange={setIntent} width={150} options={[{ value: 'all', label: 'All intents' }, ...window.MV.intents.map((i) => ({ value: i, label: i }))]} />
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 9, border: '1px solid var(--app-border)', background: 'var(--app-card)', color: 'var(--app-text2)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}><S1_I.Download size={14} /> Export</button>
        </div>
        <div style={{ fontSize: 12, color: 'var(--app-muted)', padding: '8px var(--cardpad)' }}>{rows.length} calls</div>
        <CallTable rows={rows.slice(0, 30)} onRow={setSel} />
      </Card>
      {sel && <CallDrawer session={sel} onClose={() => setSel(null)} />}
    </Page>
  );
}

function CallTable({ rows, onRow, compactCols }) {
  const th = { textAlign: 'left', padding: '10px var(--cardpad)', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--app-text2)', whiteSpace: 'nowrap' };
  const td = { padding: 'var(--row) var(--cardpad)', fontSize: 13, color: 'var(--app-text)', borderTop: '1px solid var(--app-border)' };
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr>
          <th style={th}>Channel</th><th style={th}>Caller</th>{!compactCols && <th style={th}>Time</th>}<th style={th}>Intent</th><th style={th}>Outcome</th>{!compactCols && <th style={th}>Dur.</th>}<th style={th}>Latency</th><th style={th}></th>
        </tr></thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} onClick={() => onRow(s)} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--app-hover)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <td style={td}><ChannelTag channel={s.channel} /></td>
              <td style={td}><div style={{ fontWeight: 600 }}>{s.name || s.caller}</div>{s.name && <div style={{ fontSize: 11.5, color: 'var(--app-muted)' }}>{s.caller}</div>}</td>
              {!compactCols && <td style={{ ...td, color: 'var(--app-text2)', whiteSpace: 'nowrap' }}>{s.startTime}{s.afterHours && <span style={{ marginLeft: 6, fontSize: 10, color: 'var(--mvair-warning)' }}>● after hrs</span>}</td>}
              <td style={td}><IntentTag intent={s.intent} /></td>
              <td style={td}>{s.emergency ? <StatusPill status="open" label="emergency" /> : <StatusPill status={s.outcome} />}</td>
              {!compactCols && <td style={{ ...td, color: 'var(--app-text2)' }}>{window.MV.fmtDur(s.duration)}</td>}
              <td style={{ ...td, fontFamily: 'var(--mvair-font-mono)', fontSize: 12, color: s.latency > 900 ? 'var(--mvair-warning)' : 'var(--app-text2)' }}>{s.latency}ms</td>
              <td style={td}><S1_I.ChevronRight size={15} color="var(--app-muted)" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function ChannelTag({ channel }) {
  const phone = channel === 'phone';
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 6, fontSize: 12, fontWeight: 600, background: phone ? 'var(--mvair-chip-teal-bg)' : 'color-mix(in srgb, var(--app-muted) 14%, transparent)', color: phone ? 'var(--mvair-chip-teal-stroke)' : 'var(--app-text2)' }}>{phone ? <S1_I.PhoneIncoming size={12} /> : <S1_I.Globe size={12} />}{phone ? 'Phone' : 'Web'}</span>;
}
function IntentTag({ intent }) {
  const map = { booking: 'var(--mvair-intent-dental)', inquiry: 'var(--mvair-intent-inquiry)', followup: 'var(--mvair-intent-followup)', triage: 'var(--mvair-intent-urgent)', billing: 'var(--mvair-intent-general)', general: 'var(--mvair-intent-unknown)' };
  const c = map[intent] || 'var(--app-muted)';
  return <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 6, fontSize: 12, fontWeight: 600, textTransform: 'capitalize', background: `color-mix(in srgb, ${c} 14%, transparent)`, color: c }}>{intent}</span>;
}

/* Call detail drawer — transcript + tool trace + outcome */
function CallDrawer({ session, onClose }) {
  const [tab, setTab] = useState('transcript');
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(8,15,18,.45)' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: 'min(560px, 96vw)', background: 'var(--app-elevated)', borderLeft: '1px solid var(--app-border)', boxShadow: 'var(--app-shadow-pop)', display: 'flex', flexDirection: 'column', animation: 'mv-pop .2s ease' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--app-border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ChannelTag channel={session.channel} />
              {session.emergency ? <StatusPill status="open" label="emergency" /> : <StatusPill status={session.outcome} />}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--app-text)', marginTop: 8 }}>{session.name || session.caller}</div>
            <div style={{ fontSize: 12.5, color: 'var(--app-muted)', fontFamily: 'var(--mvair-font-mono)', marginTop: 2 }}>{session.id} · {session.startTime}</div>
          </div>
          <S1.IconButton icon={S1_I.X} onClick={onClose} title="Close" />
        </div>
        {/* meta */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--app-border)', borderBottom: '1px solid var(--app-border)' }}>
          {[['Duration', window.MV.fmtDur(session.duration)], ['Turns', session.turns], ['Latency', session.latency + 'ms'], ['Intent', session.intent]].map(([l, v]) => (
            <div key={l} style={{ background: 'var(--app-elevated)', padding: '12px 14px' }}><div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--app-muted)' }}>{l}</div><div style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text)', marginTop: 3, textTransform: 'capitalize' }}>{v}</div></div>
          ))}
        </div>
        <div style={{ padding: '0 20px' }}><Tabs value={tab} onChange={setTab} tabs={[{ id: 'transcript', label: 'Transcript' }, { id: 'trace', label: 'Tool trace' }, { id: 'recording', label: 'Recording' }]} /></div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {tab === 'transcript' && <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {window.MV.sampleTranscript.filter((m) => m.role !== 'tool').map((m, i) => <Bubble key={i} role={m.role} text={m.t} />)}
          </div>}
          {tab === 'trace' && <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {window.MV.sampleTranscript.filter((m) => m.role === 'tool').map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 9, border: '1px solid var(--app-border)', background: 'var(--app-card)' }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, display: 'grid', placeItems: 'center', background: 'color-mix(in srgb, var(--mvair-success) 14%, transparent)', color: 'var(--mvair-success)', flex: 'none' }}><S1_I.Zap size={15} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontFamily: 'var(--mvair-font-mono)', color: 'var(--app-text)', fontWeight: 600 }}>{m.tool}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--app-muted)', fontFamily: 'var(--mvair-font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.t}</div>
                </div>
                <span style={{ fontSize: 11.5, fontFamily: 'var(--mvair-font-mono)', color: 'var(--app-text2)', flex: 'none' }}>{m.ms}ms</span>
                <S1_I.Check size={15} color="var(--mvair-success)" />
              </div>
            ))}
          </div>}
          {tab === 'recording' && <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 12, border: '1px solid var(--app-border)', background: 'var(--app-card)' }}>
              <button style={{ width: 44, height: 44, borderRadius: 999, border: 'none', background: 'var(--app-accent)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', flex: 'none' }}><S1_I.Play size={18} /></button>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 30 }}>{Array.from({ length: 48 }).map((_, i) => <span key={i} style={{ flex: 1, height: `${20 + Math.abs(Math.sin(i * 0.7)) * 70}%`, background: i < 18 ? 'var(--app-accent)' : 'var(--app-border-strong)', borderRadius: 2 }} />)}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--app-muted)', marginTop: 6 }}><span>1:24</span><span>{window.MV.fmtDur(session.duration)}</span></div>
              </div>
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: 'var(--app-muted)', display: 'flex', alignItems: 'center', gap: 6 }}><S1_I.Lock size={13} /> Recording encrypted at rest · auto-purged after 90 days (retention policy)</div>
          </div>}
        </div>
      </div>
    </div>
  );
}

window.Screens1 = { Overview, LiveMonitor, Calls, Page, Card, CallTable, ChannelTag, IntentTag, Bubble, linkBtn };
