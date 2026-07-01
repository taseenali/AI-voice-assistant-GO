/* MedVoice Command Center — screens 2: Appointments, Leads, Emergencies. */
const { useState, useEffect } = React;
const S2_I = window.MvairIcons;
const S2 = window.MvairUI;
const { MetricStat, StatusPill, SectionTitle, Tabs, Segmented, ProgressBar } = S2;
const { Page, Card, ChannelTag } = window.Screens1;

const th2 = { textAlign: 'left', padding: '11px var(--cardpad)', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--app-text2)', whiteSpace: 'nowrap' };
const td2 = { padding: 'var(--row) var(--cardpad)', fontSize: 13, color: 'var(--app-text)', borderTop: '1px solid var(--app-border)' };

/* ============ APPOINTMENTS ============ */
function Appointments() {
  const [view, setView] = useState('list');
  const a = window.MV.appointments;
  const synced = a.filter((x) => x.writeback === 'synced').length;
  return (
    <Page>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap)' }}>
        <MetricStat icon={S2_I.CalendarCheck} label="Booked (7d)" value={a.length} delta={8} accent="var(--mvair-success)" sparkColor="var(--mvair-success)" />
        <MetricStat icon={S2_I.CalendarClock} label="Upcoming today" value={6} sub="next at 9:30 AM" />
        <MetricStat icon={S2_I.RefreshCw} label="Calendar write-back" value={`${synced}/${a.length}`} sub="synced to Google" accent="var(--mvair-accent)" />
        <MetricStat icon={S2_I.X} label="Cancellations" value={a.filter((x) => x.status === 'cancelled').length} accent="var(--mvair-warning)" />
      </div>

      {/* write-back banner — Gate 2 visibility */}
      <div className="mv-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderLeft: '4px solid var(--mvair-accent)' }}>
        <S2_I.Plug size={17} color="var(--mvair-accent)" />
        <span style={{ flex: 1, fontSize: 13, color: 'var(--app-text)' }}><b>Google Calendar</b> write-back is live. Connect your PMS (Open Dental) for direct chart write-back — the differentiator clinics check first.</span>
        <button style={{ padding: '7px 13px', borderRadius: 8, border: '1px solid var(--app-border)', background: 'var(--app-card)', color: 'var(--app-text)', fontWeight: 600, fontSize: 12.5, cursor: 'pointer' }}>Connect PMS</button>
      </div>

      <Card pad={false}>
        <div style={{ padding: '14px var(--cardpad)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--app-border)' }}>
          <SectionTitle>Appointments</SectionTitle>
          <Segmented size="sm" value={view} onChange={setView} options={[{ value: 'list', label: 'List', icon: S2_I.ListChecks }, { value: 'cal', label: 'Calendar', icon: S2_I.CalendarDays }]} />
        </div>
        {view === 'list' ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={th2}>Patient</th><th style={th2}>Provider</th><th style={th2}>Reason</th><th style={th2}>When</th><th style={th2}>Source</th><th style={th2}>Status</th><th style={th2}>Write-back</th></tr></thead>
              <tbody>
                {a.map((x) => (
                  <tr key={x.id} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--app-hover)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={td2}><div style={{ fontWeight: 600 }}>{x.patient}</div><div style={{ fontSize: 11.5, color: 'var(--app-muted)', fontFamily: 'var(--mvair-font-mono)' }}>{x.id}</div></td>
                    <td style={{ ...td2, color: 'var(--app-text2)' }}>{x.provider}</td>
                    <td style={{ ...td2, color: 'var(--app-text2)' }}>{x.reason}</td>
                    <td style={td2}>{x.when}</td>
                    <td style={td2}><ChannelTag channel={x.source} /></td>
                    <td style={td2}><StatusPill status={x.status} /></td>
                    <td style={td2}>{x.writeback === 'synced' ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--mvair-success)', fontSize: 12.5, fontWeight: 600 }}><S2_I.Check size={14} /> Synced</span> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--mvair-warning)', fontSize: 12.5, fontWeight: 600 }}><S2_I.RefreshCw size={13} /> Pending</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <CalendarView appts={a} />}
      </Card>
    </Page>
  );
}
function CalendarView({ appts }) {
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const days = ['Mon Jul 1', 'Tue Jul 2', 'Wed Jul 3', 'Thu Jul 4', 'Fri Jul 5'];
  return (
    <div style={{ padding: 'var(--cardpad)', overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '56px repeat(5, 1fr)', gap: 6, minWidth: 620 }}>
        <div></div>
        {days.map((d) => <div key={d} style={{ fontSize: 12, fontWeight: 600, color: 'var(--app-text)', textAlign: 'center', paddingBottom: 6 }}>{d}</div>)}
        {hours.map((h) => (
          <React.Fragment key={h}>
            <div style={{ fontSize: 11, color: 'var(--app-muted)', textAlign: 'right', paddingRight: 8 }}>{h <= 12 ? h : h - 12}{h < 12 ? 'a' : 'p'}</div>
            {[0, 1, 2, 3, 4].map((d) => {
              const appt = appts.find((a, i) => (i % 5) === d && (8 + (i % 9)) === h);
              return <div key={d} style={{ minHeight: 38, borderRadius: 7, border: '1px solid var(--app-border)', background: 'var(--app-card)', padding: appt ? 5 : 0 }}>
                {appt && <div style={{ background: 'var(--app-accent-soft)', borderLeft: '3px solid var(--app-accent)', borderRadius: 5, padding: '4px 7px', height: '100%' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--app-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{appt.patient.split(' ')[0]}</div>
                  <div style={{ fontSize: 10, color: 'var(--app-muted)' }}>{appt.provider}</div>
                </div>}
              </div>;
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ============ LEADS ============ */
function Leads() {
  const [stage, setStage] = useState('all');
  let rows = window.MV.leads;
  if (stage !== 'all') rows = rows.filter((l) => l.stage === stage);
  const byStage = (s) => window.MV.leads.filter((l) => l.stage === s).length;
  const pipeValue = window.MV.leads.filter((l) => l.stage !== 'lost').reduce((a, l) => a + l.value, 0);
  return (
    <Page>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap)' }}>
        <MetricStat icon={S2_I.Users} label="Leads captured (7d)" value={window.MV.leads.length} delta={11} />
        <MetricStat icon={S2_I.CalendarCheck} label="Converted to booked" value={byStage('booked')} accent="var(--mvair-success)" />
        <MetricStat icon={S2_I.TrendingUp} label="Open pipeline value" value={window.MV.money(pipeValue)} accent="var(--mvair-warning)" />
        <MetricStat icon={S2_I.Voicemail} label="Recovered from voicemail" value={window.MV.leads.length} sub="would have been lost" accent="var(--mvair-accent)" />
      </div>

      {/* pipeline */}
      <Card>
        <SectionTitle>Pipeline</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {[['new', 'New', 'var(--mvair-primary)'], ['contacted', 'Contacted', 'var(--mvair-accent)'], ['booked', 'Booked', 'var(--mvair-success)'], ['lost', 'Lost', 'var(--app-muted)']].map(([s, label, c]) => (
            <div key={s} style={{ padding: 14, borderRadius: 10, border: '1px solid var(--app-border)', background: 'var(--app-card)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: c }} /><span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--app-text2)' }}>{label}</span></div>
              <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--app-text)' }}>{byStage(s)}</div>
              <ProgressBar value={byStage(s)} max={window.MV.leads.length} color={c} height={5} />
            </div>
          ))}
        </div>
      </Card>

      <Card pad={false}>
        <div style={{ padding: '14px var(--cardpad)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--app-border)' }}>
          <SectionTitle>Leads</SectionTitle>
          <Segmented size="sm" value={stage} onChange={setStage} options={[{ value: 'all', label: 'All' }, { value: 'new', label: 'New' }, { value: 'contacted', label: 'Contacted' }, { value: 'booked', label: 'Booked' }]} />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={th2}>Lead</th><th style={th2}>Reason</th><th style={th2}>Channel</th><th style={th2}>Captured</th><th style={th2}>Est. value</th><th style={th2}>Stage</th><th style={th2}></th></tr></thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--app-hover)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={td2}><div style={{ fontWeight: 600 }}>{l.name}</div><div style={{ fontSize: 11.5, color: 'var(--app-muted)' }}>{l.phone}</div></td>
                  <td style={{ ...td2, color: 'var(--app-text2)' }}>{l.reason}</td>
                  <td style={td2}><ChannelTag channel={l.channel} /></td>
                  <td style={{ ...td2, color: 'var(--app-text2)' }}>{l.captured}</td>
                  <td style={{ ...td2, fontWeight: 600 }}>{window.MV.money(l.value)}</td>
                  <td style={td2}><StatusPill status={l.stage} /></td>
                  <td style={td2}><button style={{ padding: '5px 11px', borderRadius: 7, border: '1px solid var(--app-border)', background: 'var(--app-card)', color: 'var(--app-text)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Follow up</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Page>
  );
}

/* ============ EMERGENCIES ============ */
function Emergencies() {
  const e = window.MV.emergencies;
  const open = e.filter((x) => x.status === 'open');
  return (
    <Page>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap)' }}>
        <MetricStat icon={S2_I.Siren} label="Open escalations" value={open.length} accent="var(--mvair-danger)" sparkColor="var(--mvair-danger)" />
        <MetricStat icon={S2_I.ClipboardCheck} label="Resolved (7d)" value={e.filter((x) => x.status === 'resolved').length} accent="var(--mvair-success)" />
        <MetricStat icon={S2_I.Clock} label="Avg time to escalate" value="1m 55s" sub="detection → owner" />
        <MetricStat icon={S2_I.ShieldCheck} label="Protocol coverage" value="100%" sub="all flags routed" accent="var(--mvair-accent)" />
      </div>

      {/* escalation protocol */}
      <Card style={{ borderLeft: '4px solid var(--mvair-danger)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <S2_I.ShieldAlert size={18} color="var(--mvair-danger)" style={{ marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text)', marginBottom: 4 }}>Active escalation protocol</div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--app-text2)', lineHeight: 1.6 }}>{window.MV.config.escalation}</p>
          </div>
        </div>
      </Card>

      <Card pad={false}>
        <div style={{ padding: '16px var(--cardpad) 4px' }}><SectionTitle>Escalation log</SectionTitle></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {e.map((x) => (
            <div key={x.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px var(--cardpad)', borderTop: '1px solid var(--app-border)' }}>
              <span style={{ width: 38, height: 38, borderRadius: 9, flex: 'none', display: 'grid', placeItems: 'center', background: x.status === 'open' ? 'color-mix(in srgb, var(--mvair-danger) 14%, transparent)' : 'color-mix(in srgb, var(--mvair-success) 12%, transparent)', color: x.status === 'open' ? 'var(--mvair-danger)' : 'var(--mvair-success)' }}>{x.status === 'open' ? <S2_I.Siren size={18} /> : <S2_I.ClipboardCheck size={18} />}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text)' }}>{x.flag}</span>
                  <StatusPill status={x.status} />
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--app-text2)', marginTop: 3 }}>{x.action} · owner <b>{x.owner}</b></div>
              </div>
              <div style={{ textAlign: 'right', flex: 'none' }}>
                <div style={{ fontSize: 12.5, color: 'var(--app-text2)', fontFamily: 'var(--mvair-font-mono)' }}>{x.caller}</div>
                <div style={{ fontSize: 11.5, color: 'var(--app-muted)', marginTop: 2 }}>{x.when} · SLA {x.sla}</div>
              </div>
              {x.status === 'open' && <button style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: 'var(--mvair-danger)', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer', flex: 'none' }}>Resolve</button>}
            </div>
          ))}
        </div>
      </Card>
    </Page>
  );
}

window.Screens2 = { Appointments, Leads, Emergencies };
