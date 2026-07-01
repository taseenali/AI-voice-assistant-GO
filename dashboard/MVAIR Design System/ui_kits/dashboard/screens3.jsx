/* MedVoice Command Center — screens 3: Analytics & Insights, System Health. */
const { useState, useEffect } = React;
const S3_I = window.MvairIcons;
const S3 = window.MvairUI;
const { MetricStat, LineChart, Donut, Heatmap, Funnel, StatusPill, RAGDot, SectionTitle, Segmented, BulletGraph, ProgressBar } = S3;
const { Page, Card } = window.Screens1;

/* ============ ANALYTICS & INSIGHTS ============ */
function Analytics() {
  const [metric, setMetric] = useState('calls');
  const t = window.MV.trend;
  const series = { calls: t.calls, booked: t.booked, completion: t.completion }[metric];
  const intentCounts = window.MV.intents.map((i) => ({ label: i, value: window.MV.sessions.filter((s) => s.intent === i).length }));
  const intentColors = ['var(--mvair-intent-dental)', 'var(--mvair-intent-inquiry)', 'var(--mvair-intent-followup)', 'var(--mvair-intent-urgent)', 'var(--mvair-intent-general)', 'var(--mvair-intent-unknown)'];
  return (
    <Page>
      {/* AI anomaly callouts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--gap)' }}>
        <Insight icon={S3_I.TrendingUp} tone="success" title="After-hours bookings +22%" body="6–9 PM is now your highest-converting window." />
        <Insight icon={S3_I.AlertTriangle} tone="warning" title="Billing-intent calls rising" body="+14% w/w — consider an FAQ flow to deflect." />
        <Insight icon={S3_I.Sparkles} tone="accent" title="Task completion at 92%" body="Above your 90% target for 9 straight days." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--gap)' }}>
        <Card>
          <SectionTitle action={<Segmented size="sm" value={metric} onChange={setMetric} options={[{ value: 'calls', label: 'Calls' }, { value: 'booked', label: 'Booked' }, { value: 'completion', label: 'Completion' }]} />}>Trend</SectionTitle>
          <LineChart height={240} labels={Array.from({ length: 14 }, (_, i) => i === 13 ? 'Today' : '')} series={[{ name: metric, data: series }]} colors={['var(--mvair-primary)']} yFmt={(v) => metric === 'completion' ? v + '%' : v} />
        </Card>
        <Card>
          <SectionTitle>Outcome funnel</SectionTitle>
          <Funnel stages={window.MV.funnel} />
          <div style={{ marginTop: 14, padding: 12, borderRadius: 9, background: 'var(--app-accent-soft)', fontSize: 12.5, color: 'var(--app-text2)', lineHeight: 1.5 }}>
            <b style={{ color: 'var(--app-text)' }}>71%</b> of answered calls end in a booking or captured lead — the business-outcome metric that matters most.
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle>Peak call hours</SectionTitle>
        <Heatmap grid={window.MV.heatmap} rows={window.MV.days} />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
        <Card>
          <SectionTitle>Calls by intent</SectionTitle>
          <Donut centerLabel={window.MV.sessions.length} centerSub="calls" data={intentCounts.map((c, i) => ({ ...c, color: intentColors[i] }))} />
        </Card>
        <Card>
          <SectionTitle>Channel &amp; coverage</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 4 }}>
            <BulletGraph label="Phone vs web split" value={68} target={null} max={100} valueLabel="68% phone" color="var(--mvair-primary)" />
            <BulletGraph label="After-hours coverage" value={38} target={30} max={60} valueLabel="38%" color="var(--mvair-accent)" />
            <BulletGraph label="First-call resolution" value={87} target={85} max={100} valueLabel="87%" color="var(--mvair-success)" />
            <BulletGraph label="Avg turns to book" value={9} target={8} max={20} valueLabel="9 turns" color="var(--mvair-warning)" />
          </div>
        </Card>
      </div>
    </Page>
  );
}
function Insight({ icon, tone, title, body }) {
  const c = { success: 'var(--mvair-success)', warning: 'var(--mvair-warning)', accent: 'var(--app-accent)' }[tone];
  const Ic = icon;
  return <Card style={{ borderTop: `3px solid ${c}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Ic size={16} color={c} /><span style={{ fontSize: 14, fontWeight: 600, color: 'var(--app-text)' }}>{title}</span></div>
    <p style={{ margin: 0, fontSize: 12.5, color: 'var(--app-text2)', lineHeight: 1.55 }}>{body}</p>
  </Card>;
}

/* ============ SYSTEM HEALTH ============ */
function Health() {
  const h = window.MV.health;
  return (
    <Page>
      {/* overall banner */}
      <div className="mv-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 44, height: 44, borderRadius: 11, background: 'color-mix(in srgb, var(--mvair-success) 14%, transparent)', color: 'var(--mvair-success)', display: 'grid', placeItems: 'center', flex: 'none' }}><S3_I.Activity size={22} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--app-text)' }}>All systems operational</div>
          <div style={{ fontSize: 12.5, color: 'var(--app-text2)' }}>{h.uptime}% uptime (30d) · one component running degraded · one gap</div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--app-muted)' }}><S3_I.RefreshCw size={13} /> auto-refreshes every 30s</span>
      </div>

      {/* Golden signals (SRE) */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--app-text2)', marginBottom: 10 }}>Four golden signals</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--gap)' }}>
          {h.signals.map((s) => (
            <Card key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <RAGDot status={s.status} pulse />
              <div><div style={{ fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--app-muted)' }}>{s.name}</div><div style={{ fontSize: 20, fontWeight: 700, color: 'var(--app-text)' }}>{s.value}</div></div>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--gap)' }}>
        {/* services */}
        <Card pad={false}>
          <div style={{ padding: '16px var(--cardpad) 4px' }}><SectionTitle>Components</SectionTitle></div>
          {h.services.map((s) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px var(--cardpad)', borderTop: '1px solid var(--app-border)' }}>
              <RAGDot status={s.status} pulse={s.status === 'up'} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--app-text)' }}>{s.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', padding: '2px 6px', borderRadius: 5, background: 'var(--app-hover)', color: 'var(--app-muted)' }}>{s.kind}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--app-text2)', marginTop: 2 }}>{s.sub}</div>
              </div>
              <div style={{ textAlign: 'right', flex: 'none' }}>
                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--mvair-font-mono)', color: 'var(--app-text)' }}>{s.metric}</div>
                <div style={{ fontSize: 11.5, color: 'var(--app-muted)' }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
          {/* Latency vs 7.5s budget */}
          <Card>
            <SectionTitle>Latency vs. budget</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Lat label="p50" value={h.latency.p50} good />
              <Lat label="p95" value={h.latency.p95} />
              <Lat label="p99" value={h.latency.p99} warn />
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--app-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}><span style={{ color: 'var(--app-text2)' }}>assistant-request</span><span style={{ fontWeight: 600, color: 'var(--app-text)' }}>{h.latency.assistantReq}ms / {h.latency.budget}ms</span></div>
              <ProgressBar value={h.latency.assistantReq} max={h.latency.budget} color="var(--mvair-success)" />
              <div style={{ fontSize: 11.5, color: 'var(--app-muted)', marginTop: 6 }}>Vapi enforces a 7.5s build budget per call. Healthy headroom.</div>
            </div>
          </Card>
          {/* SPOF warning */}
          <Card style={{ borderLeft: '4px solid var(--mvair-warning)' }}>
            <div style={{ display: 'flex', gap: 11 }}>
              <S3_I.Webhook size={18} color="var(--mvair-warning)" style={{ flex: 'none', marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--app-text)' }}>Webhook tunnel is a single point of failure</div>
                <p style={{ margin: '4px 0 0', fontSize: 12.5, color: 'var(--app-text2)', lineHeight: 1.55 }}>If the app server is unreachable, <code style={{ fontFamily: 'var(--mvair-font-mono)' }}>assistant-request</code> fails inside the 7.5s window and calls fall back. Move off the dev tunnel before production.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
function Lat({ label, value, good, warn }) {
  const c = good ? 'var(--mvair-success)' : warn ? 'var(--mvair-warning)' : 'var(--mvair-primary)';
  return <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 5 }}><span style={{ color: 'var(--app-text2)' }}>{label}</span><span style={{ fontWeight: 600, color: 'var(--app-text)', fontFamily: 'var(--mvair-font-mono)' }}>{value}ms</span></div>
    <ProgressBar value={value} max={1600} color={c} height={6} />
  </div>;
}

window.Screens3 = { Analytics, Health };
