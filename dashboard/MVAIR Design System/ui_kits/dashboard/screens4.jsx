/* MedVoice Command Center — screens 4: Trust & Compliance, Integrations, Config, Tenants, Billing. */
const { useState } = React;
const S4_I = window.MvairIcons;
const S4 = window.MvairUI;
const { MetricStat, StatusPill, RAGDot, SectionTitle, Switch, ProgressBar, Tabs } = S4;
const { Page, Card } = window.Screens1;

/* ============ TRUST & COMPLIANCE (Gate 1) ============ */
function Trust() {
  const c = window.MV.compliance;
  const signed = c.baaChain.filter((b) => b.status === 'signed').length;
  return (
    <Page>
      {/* hero trust banner */}
      <div className="mv-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid var(--mvair-success)' }}>
        <span style={{ width: 46, height: 46, borderRadius: 12, background: 'color-mix(in srgb, var(--mvair-success) 14%, transparent)', color: 'var(--mvair-success)', display: 'grid', placeItems: 'center', flex: 'none' }}><S4_I.ShieldCheck size={24} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--app-text)' }}>Certified &amp; reconciled · data as of {c.dataAsOf}</div>
          <div style={{ fontSize: 13, color: 'var(--app-text2)' }}>Every figure on this dashboard reconciles to the certified dataset. BAA executed with this clinic.</div>
        </div>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: 9, border: '1px solid var(--app-border)', background: 'var(--app-card)', color: 'var(--app-text)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}><S4_I.Download size={14} /> Compliance pack</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap)' }}>
        <MetricStat icon={S4_I.ShieldCheck} label="BAA chain signed" value={`${signed}/${c.baaChain.length}`} sub="flow-down" accent={signed === c.baaChain.length ? 'var(--mvair-success)' : 'var(--mvair-warning)'} />
        <MetricStat icon={S4_I.Lock} label="Encryption" value="AES-256" sub="+ TLS 1.3" accent="var(--mvair-success)" />
        <MetricStat icon={S4_I.ScrollText} label="Audit events (24h)" value="148" sub="all PHI access" />
        <MetricStat icon={S4_I.Clock} label="Data retention" value="90d" sub="auto-purge" accent="var(--mvair-accent)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
        {/* posture */}
        <Card pad={false}>
          <div style={{ padding: '16px var(--cardpad) 4px' }}><SectionTitle>Compliance posture</SectionTitle></div>
          {c.posture.map((p) => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px var(--cardpad)', borderTop: '1px solid var(--app-border)' }}>
              <RAGDot status={p.status === 'signed' || p.status === 'ok' ? 'ok' : p.status === 'in_progress' ? 'pending' : 'na'} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--app-text)' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--app-text2)' }}>{p.note}</div>
              </div>
              <StatusPill status={p.status} />
            </div>
          ))}
        </Card>

        {/* BAA flow-down chain */}
        <Card>
          <SectionTitle action={<span style={{ fontSize: 11.5, color: 'var(--app-muted)' }}>Gate 1</span>}>BAA flow-down chain</SectionTitle>
          <p style={{ margin: '0 0 14px', fontSize: 12.5, color: 'var(--app-text2)', lineHeight: 1.55 }}>A sale is legally possible only when every subprocessor that touches PHI has a signed BAA.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {c.baaChain.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < c.baaChain.length - 1 ? '1px dashed var(--app-border)' : 'none' }}>
                <span style={{ flex: 'none', width: 26, height: 26, borderRadius: 7, display: 'grid', placeItems: 'center', background: b.status === 'signed' ? 'color-mix(in srgb, var(--mvair-success) 14%, transparent)' : 'color-mix(in srgb, var(--mvair-warning) 14%, transparent)', color: b.status === 'signed' ? 'var(--mvair-success)' : 'var(--mvair-warning)' }}>{b.status === 'signed' ? <S4_I.Check size={14} /> : <S4_I.Clock size={13} />}</span>
                <div style={{ flex: 1, fontSize: 12.5, color: 'var(--app-text)' }}><b>{b.from}</b> <span style={{ color: 'var(--app-muted)' }}>→</span> {b.to}</div>
                <StatusPill status={b.status} dot={false} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: 11, borderRadius: 9, background: 'color-mix(in srgb, var(--mvair-warning) 10%, transparent)', fontSize: 12, color: 'var(--app-text2)', lineHeight: 1.5 }}>
            <b style={{ color: 'var(--mvair-warning)' }}>1 pending:</b> TTS subprocessor BAA blocks full Gate-1 certification for live patient traffic.
          </div>
        </Card>
      </div>

      {/* audit log */}
      <Card pad={false}>
        <div style={{ padding: '16px var(--cardpad) 4px' }}><SectionTitle action={<button style={{ background: 'none', border: 'none', color: 'var(--app-accent)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Full log</button>}>Audit trail</SectionTitle></div>
        {c.audit.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px var(--cardpad)', borderTop: '1px solid var(--app-border)' }}>
            <S4_I.ScrollText size={15} color="var(--app-muted)" style={{ flex: 'none' }} />
            <span style={{ fontSize: 12.5, fontFamily: 'var(--mvair-font-mono)', color: 'var(--app-text2)', flex: 'none', width: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.who}</span>
            <span style={{ flex: 1, fontSize: 13, color: 'var(--app-text)' }}>{a.action}</span>
            <span style={{ fontSize: 11.5, color: 'var(--app-muted)', fontFamily: 'var(--mvair-font-mono)' }}>{a.ip}</span>
            <span style={{ fontSize: 12, color: 'var(--app-muted)', flex: 'none', width: 80, textAlign: 'right' }}>{a.when}</span>
          </div>
        ))}
      </Card>
    </Page>
  );
}

/* ============ INTEGRATIONS (Gate 2) ============ */
function Integrations() {
  const cats = [...new Set(window.MV.integrations.map((i) => i.cat))];
  return (
    <Page>
      <div className="mv-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, borderLeft: '4px solid var(--mvair-accent)' }}>
        <S4_I.Plug size={20} color="var(--mvair-accent)" style={{ flex: 'none' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--app-text)' }}>Write-back is the differentiator clinics check first</div>
          <div style={{ fontSize: 12.5, color: 'var(--app-text2)' }}>Booking into the system the clinic actually runs (PMS/EHR) — not a side calendar — is Gate 2. Calendar is live; deep PMS write-back takes ~6–12 weeks per system.</div>
        </div>
      </div>

      {cats.map((cat) => (
        <div key={cat}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--app-text2)', margin: '4px 0 10px' }}>{cat}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--gap)' }}>
            {window.MV.integrations.filter((i) => i.cat === cat).map((it) => {
              const Ic = S4_I[it.icon] || S4_I.Plug;
              const connected = it.status === 'connected';
              return (
                <Card key={it.name} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <span style={{ width: 40, height: 40, borderRadius: 10, display: 'grid', placeItems: 'center', background: connected ? 'color-mix(in srgb, var(--mvair-success) 13%, transparent)' : 'var(--app-hover)', color: connected ? 'var(--mvair-success)' : 'var(--app-text2)' }}><Ic size={20} /></span>
                    <StatusPill status={it.status} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--app-text)' }}>{it.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--app-text2)', marginTop: 3, lineHeight: 1.45 }}>{it.detail}</div>
                  </div>
                  <button style={{ marginTop: 'auto', padding: '8px', borderRadius: 8, border: '1px solid var(--app-border)', background: connected ? 'var(--app-card)' : 'var(--app-accent)', color: connected ? 'var(--app-text2)' : '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{connected ? 'Manage' : 'Connect'}</button>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </Page>
  );
}

/* ============ ARIA CONFIGURATION ============ */
function Config() {
  const cfg = window.MV.config;
  const [tools, setTools] = useState(cfg.tools.map((t) => t.on));
  return (
    <Page>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--gap)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
          <Card>
            <SectionTitle>Assistant</SectionTitle>
            <Field label="Name"><Input value={cfg.name} /></Field>
            <Field label="Greeting (first message)"><Textarea value={cfg.greeting} /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Voice"><Input value={cfg.voice} /></Field>
              <Field label="Phone line"><Input value={cfg.line} mono /></Field>
            </div>
            <Field label="Business hours"><Input value={cfg.hours} /></Field>
          </Card>
          <Card>
            <SectionTitle>Emergency escalation protocol</SectionTitle>
            <Textarea value={cfg.escalation} rows={3} />
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--app-muted)', display: 'flex', alignItems: 'center', gap: 6 }}><S4_I.Siren size={13} color="var(--mvair-danger)" /> Triggers <code style={{ fontFamily: 'var(--mvair-font-mono)' }}>log_emergency</code> + pages on-call.</div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
          {/* test the line — Gate 3 */}
          <Card style={{ background: 'linear-gradient(180deg, var(--app-accent-soft), transparent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><S4_I.PhoneIncoming size={16} color="var(--app-accent)" /><span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--app-accent)' }}>Gate 3 · prove it live</span></div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--app-text)', marginBottom: 6 }}>Test the line</div>
            <p style={{ margin: '0 0 14px', fontSize: 12.5, color: 'var(--app-text2)', lineHeight: 1.55 }}>Place a live call to {cfg.line} and run an adversarial test — book, reschedule, ask insurance, describe an emergency.</p>
            <button style={{ width: '100%', padding: '11px', borderRadius: 9, border: 'none', background: 'var(--app-accent)', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><S4_I.PhoneIncoming size={16} /> Call the line now</button>
          </Card>
          {/* tools */}
          <Card>
            <SectionTitle>Enabled tools</SectionTitle>
            {cfg.tools.map((t, i) => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < cfg.tools.length - 1 ? '1px solid var(--app-border)' : 'none' }}>
                <S4_I.Zap size={15} color="var(--mvair-success)" />
                <code style={{ flex: 1, fontFamily: 'var(--mvair-font-mono)', fontSize: 13, color: 'var(--app-text)' }}>{t.name}</code>
                <Switch checked={tools[i]} onChange={(v) => setTools(tools.map((x, j) => j === i ? v : x))} size={16} />
              </div>
            ))}
          </Card>
          {/* services */}
          <Card>
            <SectionTitle>Services offered</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {cfg.services.map((s) => <span key={s} style={{ padding: '6px 11px', borderRadius: 999, background: 'var(--app-hover)', border: '1px solid var(--app-border)', fontSize: 12.5, color: 'var(--app-text)' }}>{s}</span>)}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
function Field({ label, children }) {
  return <div style={{ marginBottom: 14 }}><label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--app-text2)', marginBottom: 6 }}>{label}</label>{children}</div>;
}
function Input({ value, mono }) {
  return <input defaultValue={value} style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--app-border)', borderRadius: 8, background: 'var(--app-card)', color: 'var(--app-text)', fontSize: 13.5, fontFamily: mono ? 'var(--mvair-font-mono)' : 'inherit', outline: 'none' }} onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px var(--app-ring)'} onBlur={(e) => e.target.style.boxShadow = 'none'} />;
}
function Textarea({ value, rows = 2 }) {
  return <textarea defaultValue={value} rows={rows} style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--app-border)', borderRadius: 8, background: 'var(--app-card)', color: 'var(--app-text)', fontSize: 13.5, fontFamily: 'inherit', outline: 'none', resize: 'vertical', lineHeight: 1.5 }} onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px var(--app-ring)'} onBlur={(e) => e.target.style.boxShadow = 'none'} />;
}

/* ============ TENANTS (super-admin) ============ */
function Tenants({ onPick }) {
  const t = window.MV.tenants;
  const live = t.filter((x) => x.status === 'live').length;
  const mrr = t.reduce((a, x) => a + x.mrr, 0);
  return (
    <Page>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap)' }}>
        <MetricStat icon={S4_I.Building2} label="Clinics" value={t.length} sub={`${live} live`} />
        <MetricStat icon={S4_I.TrendingUp} label="MRR" value={window.MV.money(mrr)} delta={9} accent="var(--mvair-success)" />
        <MetricStat icon={S4_I.PhoneIncoming} label="Calls (30d)" value={t.reduce((a, x) => a + x.calls30, 0).toLocaleString()} />
        <MetricStat icon={S4_I.ShieldCheck} label="BAAs signed" value={`${t.filter((x) => x.baa === 'signed').length}/${t.length}`} accent="var(--mvair-accent)" />
      </div>
      <Card pad={false}>
        <div style={{ padding: '16px var(--cardpad) 4px' }}><SectionTitle>All clinics</SectionTitle></div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Clinic', 'Niche', 'Plan', 'Status', 'BAA', 'PMS', 'Minutes used', 'MRR'].map((h) => <th key={h} style={{ textAlign: 'left', padding: '11px var(--cardpad)', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--app-text2)', whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>
              {t.map((x) => (
                <tr key={x.id} onClick={() => onPick && onPick(x)} style={{ cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--app-hover)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: 'var(--row) var(--cardpad)', borderTop: '1px solid var(--app-border)' }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--app-accent-soft)', color: 'var(--app-accent)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13, flex: 'none' }}>{x.name[0]}</span><div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--app-text)' }}>{x.name}</div><div style={{ fontSize: 11, color: 'var(--app-muted)' }}>{x.city}</div></div></div></td>
                  <td style={cellMuted}>{x.niche}</td>
                  <td style={cell}>{x.plan} · T{x.tier}</td>
                  <td style={cell}><StatusPill status={x.status} /></td>
                  <td style={cell}><StatusPill status={x.baa === 'signed' ? 'signed' : x.baa === 'pending' ? 'pending' : 'not_started'} dot={false} /></td>
                  <td style={cellMuted}>{x.pms}</td>
                  <td style={cell}><div style={{ width: 120 }}><div style={{ fontSize: 12, color: 'var(--app-text2)', marginBottom: 4 }}>{x.minutes.toLocaleString()} / {x.minutesCap.toLocaleString()}</div><ProgressBar value={x.minutes} max={x.minutesCap} height={5} color={x.minutes / x.minutesCap > 0.85 ? 'var(--mvair-warning)' : 'var(--app-accent)'} /></div></td>
                  <td style={{ ...cell, fontWeight: 600 }}>{x.mrr ? window.MV.money(x.mrr) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Page>
  );
}
const cell = { padding: 'var(--row) var(--cardpad)', fontSize: 13, color: 'var(--app-text)', borderTop: '1px solid var(--app-border)', whiteSpace: 'nowrap' };
const cellMuted = { ...cell, color: 'var(--app-text2)' };

/* ============ BILLING & USAGE ============ */
function Billing() {
  const t = window.MV.tenants;
  const mrr = t.reduce((a, x) => a + x.mrr, 0);
  const minutes = t.reduce((a, x) => a + x.minutes, 0);
  const infraCost = Math.round(minutes * 0.13);
  const margin = Math.round(((mrr - infraCost) / (mrr || 1)) * 100);
  return (
    <Page>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap)' }}>
        <MetricStat icon={S4_I.TrendingUp} label="MRR" value={window.MV.money(mrr)} delta={9} accent="var(--mvair-success)" />
        <MetricStat icon={S4_I.Gauge} label="Minutes used (mo)" value={minutes.toLocaleString()} sub="across all clinics" />
        <MetricStat icon={S4_I.CreditCard} label="Infra cost (est.)" value={window.MV.money(infraCost)} sub="~$0.13/min blended" accent="var(--mvair-warning)" />
        <MetricStat icon={S4_I.Sparkles} label="Gross margin" value={margin + '%'} accent="var(--mvair-accent)" />
      </div>

      <Card pad={false}>
        <div style={{ padding: '16px var(--cardpad) 4px' }}><SectionTitle>Per-clinic usage &amp; margin</SectionTitle></div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Clinic', 'Plan', 'Subscription', 'Minutes', 'Infra cost', 'Margin'].map((h) => <th key={h} style={{ textAlign: 'left', padding: '11px var(--cardpad)', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--app-text2)', whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>
              {t.map((x) => {
                const cost = Math.round(x.minutes * 0.13);
                const m = x.mrr ? Math.round(((x.mrr - cost) / x.mrr) * 100) : 0;
                return <tr key={x.id} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--app-hover)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={cell}>{x.name}</td>
                  <td style={cellMuted}>{x.plan}</td>
                  <td style={{ ...cell, fontWeight: 600 }}>{x.mrr ? window.MV.money(x.mrr) + '/mo' : 'Trial'}</td>
                  <td style={cellMuted}>{x.minutes.toLocaleString()}</td>
                  <td style={cellMuted}>{window.MV.money(cost)}</td>
                  <td style={cell}><span style={{ fontWeight: 600, color: m > 50 ? 'var(--mvair-success)' : m > 0 ? 'var(--mvair-warning)' : 'var(--app-muted)' }}>{x.mrr ? m + '%' : '—'}</span></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <SectionTitle>Pricing note</SectionTitle>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--app-text2)', lineHeight: 1.6 }}>Flat-fee pricing is almost always cheaper for clinics taking 200+ calls/month — which is why specialists price flat and absorb the per-minute infra cost. Attractive unit economics require disciplined call length or higher price points justified by deeper PMS integration.</p>
      </Card>
    </Page>
  );
}

window.Screens4 = { Trust, Integrations, Config, Tenants, Billing };
