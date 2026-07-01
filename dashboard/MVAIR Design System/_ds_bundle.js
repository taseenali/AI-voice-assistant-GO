/* @ds-bundle: {"format":3,"namespace":"MVAIRDesignSystem_49370a","components":[{"name":"CTAButton","sourcePath":"components/brand/CTAButton.jsx"},{"name":"MvairMark","sourcePath":"components/brand/MvairMark.jsx"},{"name":"MvairLogo","sourcePath":"components/brand/MvairMark.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"StatusDot","sourcePath":"components/core/StatusDot.jsx"},{"name":"ChannelBadge","sourcePath":"components/data/ChannelBadge.jsx"},{"name":"KPICard","sourcePath":"components/data/KPICard.jsx"},{"name":"Table","sourcePath":"components/data/Table.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"}],"sourceHashes":{"assets/mvair-icons.js":"317b0cd616ae","components/brand/CTAButton.jsx":"e639bf935a82","components/brand/MvairMark.jsx":"3b9d33cc5494","components/core/Badge.jsx":"e834f5731bfc","components/core/Button.jsx":"396cf59fa7df","components/core/Card.jsx":"6b244b6bba10","components/core/StatusDot.jsx":"c20954044c3b","components/data/ChannelBadge.jsx":"89ec8a3deb0b","components/data/KPICard.jsx":"e1a97ae22f74","components/data/Table.jsx":"30979935ff70","components/feedback/EmptyState.jsx":"67f747cecbd7","components/feedback/Modal.jsx":"e0a197e8d66c","components/feedback/Toast.jsx":"55ccbc393b23","components/forms/Input.jsx":"64a3f848f52a","ui_kits/dashboard/app.jsx":"8c5163d8a97c","ui_kits/dashboard/charts.jsx":"748e39e05d69","ui_kits/dashboard/data.js":"badddca8eaf3","ui_kits/dashboard/screens1.jsx":"e908e5737609","ui_kits/dashboard/screens2.jsx":"e7dce35503f6","ui_kits/dashboard/screens3.jsx":"7602145f4456","ui_kits/dashboard/screens4.jsx":"d86a11becb92","ui_kits/dashboard/shell.jsx":"95a587a6bcb8","ui_kits/marketing/Landing.jsx":"58ea808893bf"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MVAIRDesignSystem_49370a = window.MVAIRDesignSystem_49370a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/mvair-icons.js
try { (() => {
/* MVAIR icon set — self-contained Lucide-style line icons as React components.
   Plain JS (no JSX); load with a normal <script src> AFTER React UMD.
   Exposes window.MvairIcons. Each icon: ({size=24,color='currentColor',strokeWidth=2}). */
(function () {
  var h = React.createElement;
  function make(children) {
    return function Icon(props) {
      props = props || {};
      var size = props.size || 24;
      var color = props.color || 'currentColor';
      var sw = props.strokeWidth || 2;
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: color,
        strokeWidth: sw,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        style: props.style,
        'aria-hidden': true
      }, children.map(function (c, i) {
        return h(c[0], Object.assign({
          key: i
        }, c[1]));
      }));
    };
  }
  var P = function (d) {
    return ['path', {
      d: d
    }];
  };
  var L = function (x1, y1, x2, y2) {
    return ['line', {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    }];
  };
  var C = function (cx, cy, r) {
    return ['circle', {
      cx: cx,
      cy: cy,
      r: r
    }];
  };
  var R = function (x, y, w, hh, rx) {
    return ['rect', {
      x: x,
      y: y,
      width: w,
      height: hh,
      rx: rx
    }];
  };
  var PL = function (pts) {
    return ['polyline', {
      points: pts
    }];
  };
  window.MvairIcons = {
    Phone: make([P('M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z')]),
    Globe: make([C(12, 12, 10), L(2, 12, 22, 12), P('M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z')]),
    ArrowRight: make([L(5, 12, 19, 12), PL('12 5 19 12 12 19')]),
    Check: make([PL('20 6 9 17 4 12')]),
    CheckCircle: make([P('M22 11.08V12a10 10 0 1 1-5.93-9.14'), PL('22 4 12 14.01 9 11.01')]),
    AlertCircle: make([C(12, 12, 10), L(12, 8, 12, 12), L(12, 16, 12.01, 16)]),
    AlertTriangle: make([P('m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z'), L(12, 9, 12, 13), L(12, 17, 12.01, 17)]),
    Info: make([C(12, 12, 10), L(12, 16, 12, 12), L(12, 8, 12.01, 8)]),
    X: make([L(18, 6, 6, 18), L(6, 6, 18, 18)]),
    Calendar: make([L(16, 2, 16, 6), L(8, 2, 8, 6), R(3, 4, 18, 18, 2), L(3, 10, 21, 10)]),
    CalendarDays: make([L(16, 2, 16, 6), L(8, 2, 8, 6), R(3, 4, 18, 18, 2), L(3, 10, 21, 10), L(8, 14, 8.01, 14), L(12, 14, 12.01, 14), L(16, 14, 16.01, 14)]),
    CalendarCheck: make([L(16, 2, 16, 6), L(8, 2, 8, 6), R(3, 4, 18, 18, 2), L(3, 10, 21, 10), P('m9 16 2 2 4-4')]),
    Clock: make([C(12, 12, 10), PL('12 6 12 12 16 14')]),
    Mic: make([P('M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z'), P('M19 10v2a7 7 0 0 1-14 0v-2'), L(12, 19, 12, 22)]),
    Users: make([P('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'), C(9, 7, 4), P('M22 21v-2a4 4 0 0 0-3-3.87'), P('M16 3.13a4 4 0 0 1 0 7.75')]),
    UserCheck: make([P('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'), C(9, 7, 4), PL('16 11 18 13 22 9')]),
    UserPlus: make([P('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'), C(9, 7, 4), L(19, 8, 19, 14), L(22, 11, 16, 11)]),
    MessageSquare: make([P('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z')]),
    LayoutDashboard: make([R(3, 3, 7, 9, 1), R(14, 3, 7, 5, 1), R(14, 12, 7, 9, 1), R(3, 16, 7, 5, 1)]),
    Activity: make([PL('22 12 18 12 15 21 9 3 6 12 2 12')]),
    Settings: make([C(12, 12, 3), P('M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z')]),
    Building2: make([P('M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z'), P('M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2'), P('M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2'), L(10, 6, 14, 6), L(10, 10, 14, 10), L(10, 14, 14, 14), L(10, 18, 14, 18)]),
    Radio: make([C(12, 12, 2), P('M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14')]),
    ExternalLink: make([P('M15 3h6v6'), P('M10 14 21 3'), P('M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6')]),
    LogOut: make([P('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'), PL('16 17 21 12 16 7'), L(21, 12, 9, 12)]),
    Eye: make([P('M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'), C(12, 12, 3)]),
    MonitorSmartphone: make([P('M18 8V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h8'), P('M10 19v-3'), P('M7 19h5'), R(14, 8, 6, 12, 1)]),
    // ---- extended set for the command-center dashboard ----
    Search: make([C(11, 11, 8), L(21, 21, 16.65, 16.65)]),
    Bell: make([P('M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9'), P('M10.3 21a1.94 1.94 0 0 0 3.4 0')]),
    ChevronDown: make([PL('6 9 12 15 18 9')]),
    ChevronRight: make([PL('9 18 15 12 9 6')]),
    ChevronLeft: make([PL('15 18 9 12 15 6')]),
    ChevronUp: make([PL('18 15 12 9 6 15')]),
    Command: make([P('M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3')]),
    Sun: make([C(12, 12, 4), L(12, 2, 12, 4), L(12, 20, 12, 22), L(2, 12, 4, 12), L(20, 12, 22, 12), L(4.9, 4.9, 6.3, 6.3), L(17.7, 17.7, 19.1, 19.1), L(4.9, 19.1, 6.3, 17.7), L(17.7, 6.3, 19.1, 4.9)]),
    Moon: make([P('M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z')]),
    Filter: make([P('M22 3H2l8 9.46V19l4 2v-8.54L22 3z')]),
    Download: make([P('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'), PL('7 10 12 15 17 10'), L(12, 15, 12, 3)]),
    Play: make([['polygon', {
      points: '5 3 19 12 5 21 5 3'
    }]]),
    Pause: make([R(6, 4, 4, 16, 1), R(14, 4, 4, 16, 1)]),
    Pin: make([L(12, 17, 12, 22), P('M5 17h14l-1.5-6 1.5-2-7-5-7 5 1.5 2L5 17Z')]),
    ShieldCheck: make([P('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z'), P('m9 12 2 2 4-4')]),
    ShieldAlert: make([P('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z'), L(12, 8, 12, 12), L(12, 16, 12.01, 16)]),
    Lock: make([R(3, 11, 18, 11, 2), P('M7 11V7a5 5 0 0 1 10 0v4')]),
    KeyRound: make([C(7.5, 15.5, 5.5), P('m21 2-9.6 9.6'), P('m15.5 7.5 3 3L22 7l-3-3')]),
    FileText: make([P('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'), PL('14 2 14 8 20 8'), L(8, 13, 16, 13), L(8, 17, 16, 17), L(8, 9, 10, 9)]),
    ScrollText: make([P('M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4'), P('M19 17V5a2 2 0 0 0-2-2H8'), L(9, 9, 15, 9), L(9, 13, 15, 13)]),
    Plug: make([P('M12 22v-5'), P('M9 8V2'), P('M15 8V2'), P('M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z')]),
    CreditCard: make([R(2, 5, 20, 14, 2), L(2, 10, 22, 10)]),
    TrendingUp: make([PL('22 7 13.5 15.5 8.5 10.5 2 17'), PL('16 7 22 7 22 13')]),
    TrendingDown: make([PL('22 17 13.5 8.5 8.5 13.5 2 7'), PL('16 17 22 17 22 11')]),
    PhoneIncoming: make([PL('16 2 16 8 22 8'), L(22, 2, 16, 8), P('M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z')]),
    PhoneMissed: make([L(22, 2, 16, 8), L(16, 2, 22, 8), P('M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z')]),
    Voicemail: make([C(6, 12, 4), C(18, 12, 4), L(6, 16, 18, 16)]),
    Zap: make([['polygon', {
      points: '13 2 3 14 12 14 11 22 21 10 12 10 13 2'
    }]]),
    Server: make([R(2, 2, 20, 8, 2), R(2, 14, 20, 8, 2), L(6, 6, 6.01, 6), L(6, 18, 6.01, 18)]),
    Database: make([['ellipse', {
      cx: 12,
      cy: 5,
      rx: 9,
      ry: 3
    }], P('M21 12c0 1.66-4 3-9 3s-9-1.34-9-3'), P('M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5')]),
    Webhook: make([P('M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17a4 4 0 0 1 7.52-1.9'), P('m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06'), P('m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 1 1-3.92 4.78')]),
    Stethoscope: make([P('M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3'), P('M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4'), C(20, 10, 2)]),
    Sparkles: make([P('M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z'), P('M19 3v4'), P('M21 5h-4')]),
    Gauge: make([P('m12 14 4-4'), P('M3.34 19a10 10 0 1 1 17.32 0')]),
    Wifi: make([P('M5 13a10 10 0 0 1 14 0'), P('M8.5 16.5a5 5 0 0 1 7 0'), L(12, 20, 12.01, 20), P('M2 8.82a15 15 0 0 1 20 0')]),
    RefreshCw: make([P('M3 12a9 9 0 0 1 15-6.7L21 8'), PL('21 3 21 8 16 8'), P('M21 12a9 9 0 0 1-15 6.7L3 16'), PL('3 21 3 16 8 16')]),
    Circle: make([C(12, 12, 10)]),
    Dot: make([C(12.1, 12.1, 1)]),
    User: make([P('M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'), C(12, 7, 4)]),
    Star: make([['polygon', {
      points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'
    }]]),
    Headset: make([P('M3 11a9 9 0 0 1 18 0'), P('M21 16v2a4 4 0 0 1-4 4h-5'), R(2, 11, 4, 7, 2), R(18, 11, 4, 7, 2)]),
    BarChart3: make([P('M3 3v18h18'), R(7, 12, 3, 6, 1), R(12, 8, 3, 10, 1), R(17, 5, 3, 13, 1)]),
    LineChartIcon: make([P('M3 3v18h18'), P('m19 9-5 5-4-4-3 3')]),
    PieChart: make([P('M21.21 15.89A10 10 0 1 1 8 2.83'), P('M22 12A10 10 0 0 0 12 2v10z')]),
    MapPin: make([P('M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'), C(12, 10, 3)]),
    ArrowUpRight: make([L(7, 17, 17, 7), PL('7 7 17 7 17 17')]),
    ArrowDownRight: make([L(7, 7, 17, 17), PL('17 7 17 17 7 17')]),
    MoreHorizontal: make([C(12, 12, 1), C(19, 12, 1), C(5, 12, 1)]),
    PanelLeft: make([R(3, 3, 18, 18, 2), L(9, 3, 9, 21)]),
    Volume2: make([['polygon', {
      points: '11 5 6 9 2 9 2 15 6 15 11 19 11 5'
    }]]),
    Mail: make([R(2, 4, 20, 16, 2), P('m22 7-10 5L2 7')]),
    Siren: make([P('M7 18v-6a5 5 0 1 1 10 0v6'), P('M5 21a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1Z'), P('M21 21a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1Z'), L(12, 2, 12, 4), L(4.6, 5.6, 6, 7), L(18, 7, 19.4, 5.6)]),
    ClipboardCheck: make([R(8, 2, 8, 4, 1), P('M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'), P('m9 14 2 2 4-4')]),
    ListChecks: make([P('m3 17 2 2 4-4'), P('m3 7 2 2 4-4'), L(13, 6, 21, 6), L(13, 12, 21, 12), L(13, 18, 21, 18)]),
    CalendarClock: make([P('M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5'), L(16, 2, 16, 6), L(8, 2, 8, 6), L(3, 10, 21, 10), C(18, 18, 4), P('M18 16.5V18l1 1')]),
    Headphones: make([P('M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a9 9 0 0 1 18 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3')]),
    Maximize: make([P('M8 3H5a2 2 0 0 0-2 2v3'), P('M21 8V5a2 2 0 0 0-2-2h-3'), P('M3 16v3a2 2 0 0 0 2 2h3'), P('M16 21h3a2 2 0 0 0 2-2v-3')]),
    Info2: make([C(12, 12, 10), L(12, 16, 12, 12), L(12, 8, 12.01, 8)])
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/mvair-icons.js", error: String((e && e.message) || e) }); }

// components/brand/CTAButton.jsx
try { (() => {
const variants = {
  petrol: {
    background: 'var(--mvair-primary)',
    color: '#fff',
    border: '1px solid transparent',
    hov: 'var(--mvair-primary-dark)'
  },
  aqua: {
    background: 'var(--mvair-accent)',
    color: 'var(--mvair-on-accent)',
    border: '1px solid transparent',
    hov: 'var(--mvair-accent-hover)'
  },
  ghost: {
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.24)',
    hov: 'transparent'
  }
};
const sizes = {
  sm: {
    fontSize: 15,
    padding: '11px 20px',
    borderRadius: 8
  },
  lg: {
    fontSize: 16,
    padding: '15px 26px',
    borderRadius: 9
  }
};

/**
 * Marketing CTA link (renders an <a>). Petrol / aqua / ghost, two sizes.
 * Ghost is for use over the dark hero; its hover brightens the border to aqua.
 */
function CTAButton({
  href = '#',
  children,
  variant = 'petrol',
  size = 'sm',
  className = '',
  style = {}
}) {
  const [hov, setHov] = React.useState(false);
  const v = variants[variant] || variants.petrol;
  const s = sizes[size] || sizes.sm;
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    className: className,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      display: 'inline-block',
      textDecoration: 'none',
      fontFamily: 'var(--mvair-font-sans)',
      fontWeight: 600,
      background: hov && variant !== 'ghost' ? v.hov : v.background,
      color: v.color,
      border: v.border,
      borderColor: hov && variant === 'ghost' ? 'var(--mvair-accent)' : v.border.includes('rgba') ? 'rgba(255,255,255,0.24)' : 'transparent',
      transition: 'background var(--mvair-duration-fast) ease, border-color var(--mvair-duration-fast) ease',
      ...s,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { CTAButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/CTAButton.jsx", error: String((e && e.message) || e) }); }

// components/brand/MvairMark.jsx
try { (() => {
/**
 * MVAIR waveform logo mark. Petrol on light surfaces, aqua on dark.
 * This is the real brand mark recreated from the product source.
 */
function MvairMark({
  tone = 'petrol',
  size = 30,
  className = '',
  style = {}
}) {
  const color = tone === 'aqua' ? 'var(--mvair-accent)' : 'var(--mvair-primary)';
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none",
    "aria-hidden": "true",
    className: className,
    style: style
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "13",
    width: "2.6",
    height: "6",
    rx: "1.3",
    fill: color
  }), /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "10",
    width: "2.6",
    height: "12",
    rx: "1.3",
    fill: color
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.4 16 L16 16 L18 9 L21 23 L23 16 L29 16",
    stroke: color,
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}

/**
 * Full lockup: waveform mark + "MVAIR" wordmark (Newsreader).
 */
function MvairLogo({
  tone = 'petrol',
  size = 30,
  className = '',
  style = {}
}) {
  const wordColor = tone === 'aqua' ? '#fff' : 'var(--mvair-text-primary)';
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 11,
      ...style
    }
  }, /*#__PURE__*/React.createElement(MvairMark, {
    tone: tone,
    size: size
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--mvair-font-display)',
      fontWeight: 600,
      fontSize: size * 0.76,
      letterSpacing: '-0.01em',
      color: wordColor
    }
  }, "MVAIR"));
}
Object.assign(__ds_scope, { MvairMark, MvairLogo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/MvairMark.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const variantColor = {
  default: 'var(--mvair-primary)',
  success: 'var(--mvair-success)',
  warning: 'var(--mvair-warning)',
  danger: 'var(--mvair-danger)',
  neutral: 'var(--mvair-text-secondary)'
};
const intentColor = {
  general: 'var(--mvair-intent-general)',
  dental: 'var(--mvair-intent-dental)',
  followup: 'var(--mvair-intent-followup)',
  urgent: 'var(--mvair-intent-urgent)',
  inquiry: 'var(--mvair-intent-inquiry)',
  unknown: 'var(--mvair-intent-unknown)'
};

/**
 * Soft-tint status/category badge: 15% color wash + full-strength text.
 * Pass `intent` for session-category colors, or `variant` for status.
 */
function Badge({
  label,
  children,
  variant = 'default',
  intent,
  icon: Icon,
  className = '',
  style = {}
}) {
  const color = intent ? intentColor[intent] || intentColor.unknown : variantColor[variant] || variantColor.default;
  const content = children ?? label;

  // neutral uses a flat border-tint rather than a color wash
  const bg = variant === 'neutral' && !intent ? 'var(--mvair-card-border)' : `color-mix(in srgb, ${color} 15%, transparent)`;
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 8px',
      borderRadius: 'var(--mvair-radius-badge)',
      fontSize: 'var(--mvair-badge)',
      fontWeight: 600,
      lineHeight: 1,
      fontFamily: 'var(--mvair-font-sans)',
      textTransform: 'capitalize',
      background: bg,
      color,
      ...style
    }
  }, Icon && /*#__PURE__*/React.createElement(Icon, {
    size: 12,
    strokeWidth: 2
  }), content);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const sizes = {
  sm: {
    fontSize: 14,
    padding: '8px 14px',
    borderRadius: 'var(--mvair-radius-button)'
  },
  md: {
    fontSize: 15,
    padding: '10px 18px',
    borderRadius: 'var(--mvair-radius-button)'
  },
  lg: {
    fontSize: 16,
    padding: '14px 26px',
    borderRadius: '9px'
  }
};
const palettes = {
  primary: {
    background: 'var(--mvair-primary)',
    color: '#fff',
    border: '1px solid transparent',
    '--hov-bg': 'var(--mvair-primary-dark)'
  },
  aqua: {
    background: 'var(--mvair-accent)',
    color: 'var(--mvair-on-accent)',
    border: '1px solid transparent',
    '--hov-bg': 'var(--mvair-accent-hover)'
  },
  secondary: {
    background: 'var(--mvair-white)',
    color: 'var(--mvair-text-secondary)',
    border: '1px solid var(--mvair-card-border)',
    '--hov-bg': 'var(--mvair-surface)'
  },
  outline: {
    background: 'transparent',
    color: 'var(--mvair-primary)',
    border: '1px solid rgb(var(--mvair-primary-rgb) / 0.30)',
    '--hov-bg': 'rgb(var(--mvair-primary-rgb) / 0.05)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--mvair-text-secondary)',
    border: '1px solid transparent',
    '--hov-bg': 'var(--mvair-surface)'
  }
};

/**
 * MVAIR primary action button. Petrol is the default; aqua is reserved for
 * marketing CTAs; outline/secondary/ghost for lower-emphasis actions.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  const pal = palettes[variant] || palettes.primary;
  const sz = sizes[size] || sizes.md;
  const composed = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'var(--mvair-font-sans)',
    fontWeight: 600,
    lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    width: fullWidth ? '100%' : undefined,
    transition: 'background var(--mvair-duration-fast) ease, border-color var(--mvair-duration-fast) ease',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    ...pal,
    ...sz,
    background: hover && !disabled ? pal['--hov-bg'] : pal.background,
    ...style
  };
  const iconEl = Icon ? /*#__PURE__*/React.createElement(Icon, {
    size: size === 'lg' ? 18 : 16,
    strokeWidth: 2
  }) : null;
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    className: className,
    style: composed
  }, !iconRight && iconEl, children, iconRight && iconEl);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
/**
 * MVAIR surface card. White, soft cool-tinted shadow, generous radius.
 * `padding` defaults to 24px; `hover` enables the marketing lift.
 */
function Card({
  children,
  padding = 24,
  radius = 'var(--mvair-radius-card)',
  hover = false,
  className = '',
  style = {},
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => hover && setH(true),
    onMouseLeave: () => hover && setH(false),
    className: className,
    style: {
      background: 'var(--mvair-bg-card)',
      border: '1px solid var(--mvair-border-card)',
      borderRadius: radius,
      boxShadow: h ? 'var(--mvair-shadow-card-hover)' : 'var(--mvair-shadow-card)',
      padding,
      transform: h ? 'translateY(-4px)' : 'none',
      transition: 'transform var(--mvair-duration) ease, box-shadow var(--mvair-duration) ease',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusDot.jsx
try { (() => {
const dotColor = {
  online: 'var(--mvair-success)',
  offline: 'var(--mvair-danger)',
  warning: 'var(--mvair-warning)',
  live: 'var(--mvair-signal)'
};

/**
 * Status indicator dot, optionally pulsing, with an optional label.
 * `live` uses the chartreuse signal color (reserved for "always answering").
 */
function StatusDot({
  status = 'online',
  pulse,
  label,
  className = '',
  style = {}
}) {
  const shouldPulse = pulse ?? (status === 'online' || status === 'live');
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 9999,
      background: dotColor[status] || dotColor.online,
      animation: shouldPulse ? 'mvair-pulse 2s infinite' : 'none',
      flex: 'none'
    }
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--mvair-body-sm)',
      color: 'var(--mvair-text-secondary)',
      fontFamily: 'var(--mvair-font-sans)'
    }
  }, label));
}
Object.assign(__ds_scope, { StatusDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusDot.jsx", error: String((e && e.message) || e) }); }

// components/data/ChannelBadge.jsx
try { (() => {
const PhoneGlyph = /*#__PURE__*/React.createElement("path", {
  d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"
});
const GlobeGlyph = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("line", {
  x1: "2",
  y1: "12",
  x2: "22",
  y2: "12"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"
}));

/**
 * Channel badge — phone (emerald) vs web (slate), each with its glyph.
 * Distinct from Badge so the two session channels read instantly in a table.
 */
function ChannelBadge({
  channel,
  className = '',
  style = {}
}) {
  const isPhone = channel === 'phone';
  const color = isPhone ? 'var(--mvair-chip-teal-stroke)' : 'var(--mvair-text-secondary)';
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 8px',
      borderRadius: 'var(--mvair-radius-badge)',
      fontSize: 'var(--mvair-badge)',
      fontWeight: 600,
      lineHeight: 1,
      fontFamily: 'var(--mvair-font-sans)',
      background: isPhone ? 'var(--mvair-chip-teal-bg)' : '#EEF1F3',
      color,
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, isPhone ? PhoneGlyph : GlobeGlyph), isPhone ? 'Phone' : 'Web');
}
Object.assign(__ds_scope, { ChannelBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ChannelBadge.jsx", error: String((e && e.message) || e) }); }

// components/data/KPICard.jsx
try { (() => {
const variantColor = {
  default: 'var(--mvair-primary)',
  success: 'var(--mvair-success)',
  warning: 'var(--mvair-warning)',
  danger: 'var(--mvair-danger)'
};

/**
 * Dashboard KPI tile — uppercase label + accent icon, big bold metric,
 * optional subtitle. The icon color carries the variant.
 */
function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  className = '',
  style = {}
}) {
  const color = variantColor[variant] || variantColor.default;
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      background: 'var(--mvair-bg-card)',
      border: '1px solid var(--mvair-border-card)',
      borderRadius: 'var(--mvair-radius-card)',
      boxShadow: 'var(--mvair-shadow-card)',
      padding: 24,
      fontFamily: 'var(--mvair-font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--mvair-card-title)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--mvair-card-title-tracking)',
      fontWeight: 600,
      color: 'var(--mvair-text-secondary)'
    }
  }, title), Icon && /*#__PURE__*/React.createElement(Icon, {
    size: 20,
    strokeWidth: 2,
    color: color
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--mvair-kpi)',
      lineHeight: 'var(--mvair-kpi-lh)',
      fontWeight: 700,
      color: 'var(--mvair-text-primary)',
      marginBottom: 4
    }
  }, value), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--mvair-body-sm)',
      color: 'var(--mvair-text-muted)'
    }
  }, subtitle));
}
Object.assign(__ds_scope, { KPICard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/KPICard.jsx", error: String((e && e.message) || e) }); }

// components/data/Table.jsx
try { (() => {
/**
 * Data table inside a card. Columns: { key, header, render?, className?, align? }.
 * Rows are clickable when `onRowClick` is provided (hover highlight).
 */
function Table({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No data available',
  className = '',
  style = {}
}) {
  const [hoverKey, setHoverKey] = React.useState(null);
  const shell = {
    background: 'var(--mvair-bg-card)',
    border: '1px solid var(--mvair-border-card)',
    borderRadius: 'var(--mvair-radius-card)',
    boxShadow: 'var(--mvair-shadow-card)',
    overflow: 'hidden',
    fontFamily: 'var(--mvair-font-sans)',
    ...style
  };
  if (!data || data.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: className,
      style: {
        ...shell,
        padding: 32,
        textAlign: 'center',
        color: 'var(--mvair-text-muted)',
        fontSize: 'var(--mvair-body)'
      }
    }, emptyMessage);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: shell
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '1px solid var(--mvair-card-border)'
    }
  }, columns.map(col => /*#__PURE__*/React.createElement("th", {
    key: col.key,
    style: {
      textAlign: col.align || 'left',
      padding: '12px 24px',
      fontSize: 'var(--mvair-table-header)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 'var(--mvair-table-header-tracking)',
      color: 'var(--mvair-text-secondary)',
      whiteSpace: 'nowrap'
    }
  }, col.header)))), /*#__PURE__*/React.createElement("tbody", null, data.map(item => {
    const k = keyExtractor(item);
    return /*#__PURE__*/React.createElement("tr", {
      key: k,
      onClick: () => onRowClick && onRowClick(item),
      onMouseEnter: () => setHoverKey(k),
      onMouseLeave: () => setHoverKey(null),
      style: {
        borderBottom: '1px solid var(--mvair-card-border)',
        cursor: onRowClick ? 'pointer' : 'default',
        background: onRowClick && hoverKey === k ? 'var(--mvair-surface)' : 'transparent',
        transition: 'background var(--mvair-duration-fast) ease'
      }
    }, columns.map(col => /*#__PURE__*/React.createElement("td", {
      key: col.key,
      style: {
        textAlign: col.align || 'left',
        padding: '12px 24px',
        fontSize: 'var(--mvair-body)',
        color: 'var(--mvair-text-primary)'
      }
    }, col.render ? col.render(item) : String(item[col.key] ?? ''))));
  })))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Table.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
const variantColor = {
  info: 'var(--mvair-primary)',
  warning: 'var(--mvair-warning)',
  success: 'var(--mvair-success)'
};

/**
 * Centered empty/zero state — large icon, title, supporting copy, optional CTA.
 */
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'info',
  className = '',
  style = {}
}) {
  const [hov, setHov] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '64px 16px',
      fontFamily: 'var(--mvair-font-sans)',
      ...style
    }
  }, Icon && /*#__PURE__*/React.createElement(Icon, {
    size: 64,
    strokeWidth: 1.5,
    color: variantColor[variant] || variantColor.info,
    style: {
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px',
      fontSize: 18,
      fontWeight: 600,
      color: 'var(--mvair-text-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 420,
      fontSize: 'var(--mvair-body)',
      color: 'var(--mvair-text-secondary)'
    }
  }, description), action && /*#__PURE__*/React.createElement("button", {
    onClick: action.onClick,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => setHov(false),
    style: {
      marginTop: 16,
      padding: '8px 16px',
      background: hov ? 'var(--mvair-primary-dark)' : 'var(--mvair-primary)',
      color: '#fff',
      border: 'none',
      borderRadius: 'var(--mvair-radius-button)',
      fontFamily: 'var(--mvair-font-sans)',
      fontWeight: 600,
      fontSize: 'var(--mvair-body)',
      cursor: 'pointer',
      transition: 'background var(--mvair-duration-fast) ease'
    }
  }, action.label));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Modal.jsx
try { (() => {
const sizes = {
  sm: 448,
  md: 512,
  lg: 672
};
const CloseIcon = () => /*#__PURE__*/React.createElement("svg", {
  width: "20",
  height: "20",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
}), /*#__PURE__*/React.createElement("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
}));

/**
 * Centered modal dialog over a 50% scrim. Click the scrim or the ✕ to close.
 * `title` renders the header; `children` is the body.
 */
function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
  style = {}
}) {
  if (!isOpen) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(12,26,32,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: className,
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: sizes[size] || sizes.md,
      margin: '0 16px',
      padding: 24,
      background: 'var(--mvair-white)',
      borderRadius: 'var(--mvair-radius-card)',
      boxShadow: 'var(--mvair-shadow-modal)',
      fontFamily: 'var(--mvair-font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 18,
      fontWeight: 600,
      color: 'var(--mvair-text-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--mvair-text-muted)',
      display: 'flex',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(CloseIcon, null))), children));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Modal.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const Icon = ({
  d,
  color,
  size = 16,
  strokeWidth = 2,
  fill = 'none'
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: fill,
  stroke: color,
  strokeWidth: strokeWidth,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: {
    flex: 'none'
  }
}, d);
const glyphs = {
  success: {
    color: 'var(--mvair-success)',
    node: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("path", {
      d: "m9 12 2 2 4-4"
    }))
  },
  error: {
    color: 'var(--mvair-danger)',
    node: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "8",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "16",
      x2: "12.01",
      y2: "16"
    }))
  },
  warning: {
    color: 'var(--mvair-warning)',
    node: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "9",
      x2: "12",
      y2: "13"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "17",
      x2: "12.01",
      y2: "17"
    }))
  },
  info: {
    color: 'var(--mvair-primary)',
    node: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "16",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "8",
      x2: "12.01",
      y2: "8"
    }))
  }
};

/**
 * Toast notification — card with a left accent bar in the status color.
 * Slides in from the right; render inside a bottom-right fixed stack.
 */
function Toast({
  message,
  type = 'info',
  onClose,
  className = '',
  style = {}
}) {
  const g = glyphs[type] || glyphs.info;
  return /*#__PURE__*/React.createElement("div", {
    role: "alert",
    className: className,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      minWidth: 300,
      maxWidth: 420,
      padding: 16,
      background: 'var(--mvair-bg-card)',
      border: '1px solid var(--mvair-border-card)',
      borderLeft: `4px solid ${g.color}`,
      borderRadius: 'var(--mvair-radius-card)',
      boxShadow: 'var(--mvair-shadow-card-hover)',
      fontFamily: 'var(--mvair-font-sans)',
      animation: 'mvair-slide-in 0.25s ease-out',
      ...style
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    d: g.node,
    color: g.color,
    size: 20
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      flex: 1,
      margin: 0,
      fontSize: 'var(--mvair-body)',
      color: 'var(--mvair-text-primary)'
    }
  }, message), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--mvair-text-muted)',
      display: 'flex',
      padding: 0
    },
    "aria-label": "Dismiss"
  }, /*#__PURE__*/React.createElement(Icon, {
    d: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "18",
      y1: "6",
      x2: "6",
      y2: "18"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "6",
      y1: "6",
      x2: "18",
      y2: "18"
    })),
    color: "currentColor",
    size: 16
  })), /*#__PURE__*/React.createElement("style", null, `@keyframes mvair-slide-in { from { opacity: 0; transform: translateX(100%);} to { opacity: 1; transform: translateX(0);} }`));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Labeled text input with the MVAIR focus ring (petrol, 2px @ 30%).
 * Wraps the native input; pass any input props through `...rest`.
 */
function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  error,
  hint,
  disabled = false,
  fullWidth = true,
  className = '',
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: fullWidth ? '100%' : undefined,
      fontFamily: 'var(--mvair-font-sans)'
    },
    className: className
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: 'block',
      fontSize: 'var(--mvair-body)',
      fontWeight: 500,
      color: 'var(--mvair-text-secondary)',
      marginBottom: 4
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '8px 12px',
      fontSize: 'var(--mvair-body)',
      fontFamily: 'var(--mvair-font-sans)',
      color: 'var(--mvair-text-primary)',
      background: disabled ? 'var(--mvair-surface)' : 'var(--mvair-white)',
      border: `1px solid ${error ? 'var(--mvair-danger)' : 'var(--mvair-card-border)'}`,
      borderRadius: 'var(--mvair-radius-button)',
      outline: 'none',
      boxShadow: focus ? `0 0 0 3px ${error ? 'rgb(var(--mvair-danger-rgb) / 0.25)' : 'var(--mvair-focus-ring)'}` : 'none',
      transition: 'box-shadow var(--mvair-duration-fast) ease, border-color var(--mvair-duration-fast) ease',
      ...style
    }
  }, rest)), (error || hint) && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--mvair-body-sm)',
      marginTop: 4,
      color: error ? 'var(--mvair-danger)' : 'var(--mvair-text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/app.jsx
try { (() => {
/* MedVoice Command Center — app root: state, routing, keyboard, render. */
const {
  useState,
  useEffect
} = React;
const {
  Sidebar,
  TopBar,
  CommandPalette,
  NotificationsDrawer,
  ROLES,
  ALL_ROUTES
} = window.Shell;
const TITLES = {
  overview: 'Command Center',
  live: 'Live Monitor',
  calls: 'Calls',
  appointments: 'Appointments',
  leads: 'Leads',
  emergencies: 'Emergencies',
  analytics: 'Analytics',
  health: 'System Health',
  trust: 'Trust & Compliance',
  integrations: 'Integrations',
  config: 'Aria Configuration',
  tenants: 'Clinics',
  billing: 'Billing & Usage'
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
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
  }, [density]);
  useEffect(() => {
    const h = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette(p => !p);
      }
      if (e.key === 'Escape') {
        setPalette(false);
        setNotif(false);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  const onRole = r => {
    setRole(r);
    const home = (ROLES.find(x => x.value === r) || {}).home;
    if (home) setRoute(home);
  };
  const S1 = window.Screens1,
    S2 = window.Screens2,
    S3 = window.Screens3,
    S4 = window.Screens4;
  const go = setRoute;
  let screen;
  switch (route) {
    case 'overview':
      screen = /*#__PURE__*/React.createElement(S1.Overview, {
        go: go
      });
      break;
    case 'live':
      screen = /*#__PURE__*/React.createElement(S1.LiveMonitor, null);
      break;
    case 'calls':
      screen = /*#__PURE__*/React.createElement(S1.Calls, null);
      break;
    case 'appointments':
      screen = /*#__PURE__*/React.createElement(S2.Appointments, null);
      break;
    case 'leads':
      screen = /*#__PURE__*/React.createElement(S2.Leads, null);
      break;
    case 'emergencies':
      screen = /*#__PURE__*/React.createElement(S2.Emergencies, null);
      break;
    case 'analytics':
      screen = /*#__PURE__*/React.createElement(S3.Analytics, null);
      break;
    case 'health':
      screen = /*#__PURE__*/React.createElement(S3.Health, null);
      break;
    case 'trust':
      screen = /*#__PURE__*/React.createElement(S4.Trust, null);
      break;
    case 'integrations':
      screen = /*#__PURE__*/React.createElement(S4.Integrations, null);
      break;
    case 'config':
      screen = /*#__PURE__*/React.createElement(S4.Config, null);
      break;
    case 'tenants':
      screen = /*#__PURE__*/React.createElement(S4.Tenants, {
        onPick: setTenant
      });
      break;
    case 'billing':
      screen = /*#__PURE__*/React.createElement(S4.Billing, null);
      break;
    default:
      screen = /*#__PURE__*/React.createElement(S1.Overview, {
        go: go
      });
  }
  const unread = window.MV.notifications.filter(n => n.unread).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--app-bg)'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    route: route,
    onNav: setRoute,
    role: role,
    collapsed: collapsed,
    onToggle: () => setCollapsed(c => !c),
    tenant: tenant
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    title: TITLES[route],
    role: role,
    onRole: onRole,
    tenant: tenant,
    tenants: window.MV.tenants,
    onTenant: setTenant,
    theme: theme,
    onTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light'),
    density: density,
    onDensity: () => setDensity(d => d === 'comfortable' ? 'compact' : 'comfortable'),
    onOpenPalette: () => setPalette(true),
    onOpenNotif: () => setNotif(true),
    unread: unread,
    range: range,
    onRange: setRange
  }), /*#__PURE__*/React.createElement("main", {
    key: route,
    style: {
      flex: 1,
      minWidth: 0
    }
  }, screen)), /*#__PURE__*/React.createElement(CommandPalette, {
    open: palette,
    onClose: () => setPalette(false),
    onNav: setRoute,
    role: role
  }), /*#__PURE__*/React.createElement(NotificationsDrawer, {
    open: notif,
    onClose: () => setNotif(false)
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/charts.jsx
try { (() => {
/* MedVoice Command Center — chart + control primitives (theme-aware via --app-* vars).
   Exposes window.MvairUI. Pure SVG/React, no deps. */
const {
  useState,
  useRef,
  useEffect,
  useId
} = React;
const ACCENT = 'var(--app-accent)';
const PETROL = 'var(--mvair-primary)';
const AQUA = 'var(--mvair-accent)';
const OK = 'var(--mvair-success)';
const WARN = 'var(--mvair-warning)';
const DANGER = 'var(--mvair-danger)';

/* ---------------- Sparkline ---------------- */
function Sparkline({
  data,
  width = 120,
  height = 32,
  color = ACCENT,
  fill = true,
  strokeWidth = 2
}) {
  const min = Math.min(...data),
    max = Math.max(...data),
    span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - 4 - (v - min) / span * (height - 8)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const gid = useId().replace(/:/g, '');
  return /*#__PURE__*/React.createElement("svg", {
    width: width,
    height: height,
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, fill && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: 'sp' + gid,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: color,
    stopOpacity: "0.22"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: color,
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: `url(#sp${gid})`
  })), /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: pts[pts.length - 1][0],
    cy: pts[pts.length - 1][1],
    r: "2.6",
    fill: color
  }));
}

/* ---------------- Bullet graph (actual vs target vs bands) ---------------- */
function BulletGraph({
  value,
  target,
  max,
  bands,
  color = ACCENT,
  height = 16,
  label,
  valueLabel
}) {
  bands = bands || [max * 0.6, max * 0.85, max];
  const pct = v => Math.min(100, v / max * 100);
  const bandColors = ['var(--app-border)', 'var(--app-border-strong)', 'var(--app-hover)'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%'
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 5,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--app-text2)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--app-text)',
      fontWeight: 600
    }
  }, valueLabel ?? value)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height,
      borderRadius: 4,
      overflow: 'hidden',
      background: bandColors[2]
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      width: pct(bands[1]) + '%',
      background: bandColors[1]
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      width: pct(bands[0]) + '%',
      background: bandColors[0]
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '28%',
      height: '44%',
      left: 0,
      width: pct(value) + '%',
      background: color,
      borderRadius: 3
    }
  }), target != null && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '-10%',
      height: '120%',
      left: `calc(${pct(target)}% - 1px)`,
      width: 2,
      background: 'var(--app-text)'
    }
  })));
}

/* ---------------- Line / area chart with axis ---------------- */
function LineChart({
  series,
  labels,
  height = 200,
  colors = [PETROL, AQUA],
  area = true,
  yFmt = v => v
}) {
  const ref = useRef(null);
  const [w, setW] = useState(640);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(e => setW(e[0].contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const padL = 38,
    padB = 22,
    padT = 10,
    padR = 8;
  const all = series.flatMap(s => s.data);
  const min = Math.min(...all, 0),
    max = Math.max(...all) * 1.08 || 1;
  const iw = w - padL - padR,
    ih = height - padB - padT;
  const xs = (i, n) => padL + i / (n - 1) * iw;
  const ys = v => padT + ih - (v - min) / (max - min || 1) * ih;
  const gid = useId().replace(/:/g, '');
  const ticks = 4;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: height,
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, Array.from({
    length: ticks + 1
  }).map((_, i) => {
    const v = min + i / ticks * (max - min);
    const y = ys(v);
    return /*#__PURE__*/React.createElement("g", {
      key: i
    }, /*#__PURE__*/React.createElement("line", {
      x1: padL,
      y1: y,
      x2: w - padR,
      y2: y,
      stroke: "var(--app-border)",
      strokeWidth: "1"
    }), /*#__PURE__*/React.createElement("text", {
      x: padL - 8,
      y: y + 3,
      textAnchor: "end",
      fontSize: "10",
      fill: "var(--app-muted)"
    }, yFmt(Math.round(v))));
  }), labels && labels.map((l, i) => i % Math.ceil(labels.length / 7) === 0 && /*#__PURE__*/React.createElement("text", {
    key: i,
    x: xs(i, labels.length),
    y: height - 6,
    textAnchor: "middle",
    fontSize: "10",
    fill: "var(--app-muted)"
  }, l)), series.map((s, si) => {
    const c = colors[si % colors.length];
    const pts = s.data.map((v, i) => [xs(i, s.data.length), ys(v)]);
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    return /*#__PURE__*/React.createElement("g", {
      key: si
    }, area && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: `lc${gid}${si}`,
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0%",
      stopColor: c,
      stopOpacity: "0.18"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "100%",
      stopColor: c,
      stopOpacity: "0"
    }))), /*#__PURE__*/React.createElement("path", {
      d: `${line} L${pts[pts.length - 1][0]} ${padT + ih} L${pts[0][0]} ${padT + ih} Z`,
      fill: `url(#lc${gid}${si})`
    })), /*#__PURE__*/React.createElement("path", {
      d: line,
      fill: "none",
      stroke: c,
      strokeWidth: "2.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  })));
}

/* ---------------- Donut ---------------- */
function Donut({
  data,
  size = 140,
  thickness = 18,
  centerLabel,
  centerSub
}) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const R = (size - thickness) / 2,
    C = 2 * Math.PI * R;
  let offset = 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    style: {
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("g", {
    transform: `translate(${size / 2},${size / 2}) rotate(-90)`
  }, /*#__PURE__*/React.createElement("circle", {
    r: R,
    fill: "none",
    stroke: "var(--app-border)",
    strokeWidth: thickness
  }), data.map((d, i) => {
    const len = d.value / total * C;
    const el = /*#__PURE__*/React.createElement("circle", {
      key: i,
      r: R,
      fill: "none",
      stroke: d.color,
      strokeWidth: thickness,
      strokeDasharray: `${len} ${C - len}`,
      strokeDashoffset: -offset,
      strokeLinecap: "butt"
    });
    offset += len;
    return el;
  })), centerLabel != null && /*#__PURE__*/React.createElement("text", {
    x: "50%",
    y: "47%",
    textAnchor: "middle",
    fontSize: "22",
    fontWeight: "700",
    fill: "var(--app-text)"
  }, centerLabel), centerSub && /*#__PURE__*/React.createElement("text", {
    x: "50%",
    y: "62%",
    textAnchor: "middle",
    fontSize: "10",
    fill: "var(--app-muted)"
  }, centerSub)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7
    }
  }, data.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 3,
      background: d.color,
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--app-text2)',
      flex: 1
    }
  }, d.label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--app-text)',
      fontWeight: 600
    }
  }, d.value)))));
}

/* ---------------- Heatmap (days × hours) ---------------- */
function Heatmap({
  grid,
  rows,
  height = 150
}) {
  const max = Math.max(...grid.flat()) || 1;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `28px repeat(24, 1fr)`,
      gap: 2
    }
  }, grid.map((row, ri) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: ri
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: 'var(--app-muted)',
      display: 'flex',
      alignItems: 'center'
    }
  }, rows[ri]), row.map((v, ci) => {
    const a = v / max;
    return /*#__PURE__*/React.createElement("div", {
      key: ci,
      title: `${rows[ri]} ${ci}:00 — ${v} calls`,
      style: {
        aspectRatio: '1',
        borderRadius: 3,
        background: a === 0 ? 'var(--app-hover)' : `color-mix(in srgb, ${ACCENT} ${15 + a * 85}%, transparent)`
      }
    });
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 6,
      fontSize: 10,
      color: 'var(--app-muted)',
      paddingLeft: 30
    }
  }, /*#__PURE__*/React.createElement("span", null, "12a"), /*#__PURE__*/React.createElement("span", null, "6a"), /*#__PURE__*/React.createElement("span", null, "12p"), /*#__PURE__*/React.createElement("span", null, "6p"), /*#__PURE__*/React.createElement("span", null, "11p")));
}

/* ---------------- Funnel ---------------- */
function Funnel({
  stages
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, stages.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 5,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--app-text2)'
    }
  }, s.stage), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--app-text)',
      fontWeight: 600
    }
  }, s.value.toLocaleString(), " \xB7 ", s.pct, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 12,
      borderRadius: 4,
      background: 'var(--app-hover)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: s.pct + '%',
      borderRadius: 4,
      background: `color-mix(in srgb, ${ACCENT} ${55 + i * 12}%, ${AQUA})`
    }
  })))));
}

/* ---------------- Controls ---------------- */
function Tabs({
  tabs,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--app-border)'
    }
  }, tabs.map(t => {
    const on = (t.id ?? t) === value;
    const label = t.label ?? t;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id ?? t,
      onClick: () => onChange(t.id ?? t),
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 14px',
        fontSize: 14,
        fontWeight: 600,
        color: on ? 'var(--app-text)' : 'var(--app-text2)',
        borderBottom: `2px solid ${on ? ACCENT : 'transparent'}`,
        marginBottom: -1
      }
    }, label, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 6,
        fontSize: 11,
        color: 'var(--app-muted)'
      }
    }, t.count));
  }));
}
function Segmented({
  options,
  value,
  onChange,
  size = 'md'
}) {
  const pad = size === 'sm' ? '5px 10px' : '7px 14px';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      padding: 3,
      gap: 2,
      background: 'var(--app-hover)',
      borderRadius: 9,
      border: '1px solid var(--app-border)'
    }
  }, options.map(o => {
    const v = o.value ?? o,
      on = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      onClick: () => onChange(v),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: pad,
        border: 'none',
        cursor: 'pointer',
        borderRadius: 7,
        fontSize: 13,
        fontWeight: 600,
        background: on ? 'var(--app-card)' : 'transparent',
        color: on ? 'var(--app-text)' : 'var(--app-text2)',
        boxShadow: on ? 'var(--app-shadow)' : 'none'
      }
    }, o.icon ? React.createElement(o.icon, {
      size: 14
    }) : null, o.label ?? o);
  }));
}
function Switch({
  checked,
  onChange,
  size = 18
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(!checked),
    "aria-pressed": checked,
    style: {
      width: size * 1.9,
      height: size + 6,
      borderRadius: 999,
      border: 'none',
      cursor: 'pointer',
      padding: 3,
      background: checked ? ACCENT : 'var(--app-border-strong)',
      transition: 'background .18s',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: size,
      height: size,
      borderRadius: 999,
      background: '#fff',
      transform: checked ? `translateX(${size * 0.9}px)` : 'none',
      transition: 'transform .18s',
      boxShadow: '0 1px 3px rgba(0,0,0,.3)'
    }
  }));
}
function Select({
  value,
  options,
  onChange,
  width
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: e => onChange(e.target.value),
    style: {
      width: '100%',
      appearance: 'none',
      padding: '8px 30px 8px 12px',
      fontSize: 13,
      fontFamily: 'inherit',
      fontWeight: 500,
      color: 'var(--app-text)',
      background: 'var(--app-card)',
      border: '1px solid var(--app-border)',
      borderRadius: 8,
      cursor: 'pointer'
    }
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value ?? o,
    value: o.value ?? o
  }, o.label ?? o))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 9,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--app-muted)',
      display: 'flex'
    }
  }, React.createElement(window.MvairIcons.ChevronDown, {
    size: 14
  })));
}
function ProgressBar({
  value,
  max = 100,
  color = ACCENT,
  height = 8
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      borderRadius: 999,
      background: 'var(--app-hover)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: Math.min(100, value / max * 100) + '%',
      background: color,
      borderRadius: 999,
      transition: 'width .3s'
    }
  }));
}
const statusMap = {
  up: {
    c: OK,
    t: 'Operational'
  },
  ok: {
    c: OK,
    t: 'OK'
  },
  signed: {
    c: OK,
    t: 'Signed'
  },
  connected: {
    c: OK,
    t: 'Connected'
  },
  live: {
    c: OK,
    t: 'Live'
  },
  confirmed: {
    c: OK,
    t: 'Confirmed'
  },
  resolved: {
    c: OK,
    t: 'Resolved'
  },
  synced: {
    c: OK,
    t: 'Synced'
  },
  degraded: {
    c: WARN,
    t: 'Degraded'
  },
  pending: {
    c: WARN,
    t: 'Pending'
  },
  in_progress: {
    c: WARN,
    t: 'In progress'
  },
  onboarding: {
    c: WARN,
    t: 'Onboarding'
  },
  trial: {
    c: WARN,
    t: 'Trial'
  },
  open: {
    c: WARN,
    t: 'Open'
  },
  rescheduled: {
    c: WARN,
    t: 'Rescheduled'
  },
  down: {
    c: DANGER,
    t: 'Down'
  },
  gap: {
    c: DANGER,
    t: 'Gap'
  },
  not_started: {
    c: DANGER,
    t: 'Not started'
  },
  cancelled: {
    c: DANGER,
    t: 'Cancelled'
  },
  lost: {
    c: DANGER,
    t: 'Lost'
  },
  na: {
    c: 'var(--app-muted)',
    t: 'N/A'
  },
  available: {
    c: 'var(--app-muted)',
    t: 'Available'
  },
  new: {
    c: PETROL,
    t: 'New'
  },
  contacted: {
    c: PETROL,
    t: 'Contacted'
  },
  booked: {
    c: OK,
    t: 'Booked'
  },
  info_only: {
    c: 'var(--app-muted)',
    t: 'Info only'
  },
  transferred: {
    c: WARN,
    t: 'Transferred'
  },
  triaged: {
    c: WARN,
    t: 'Triaged'
  },
  lead_captured: {
    c: PETROL,
    t: 'Lead'
  },
  missed: {
    c: DANGER,
    t: 'Missed'
  }
};
function StatusPill({
  status,
  label,
  dot = true
}) {
  const m = statusMap[status] || {
    c: 'var(--app-muted)',
    t: label || status
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 9px',
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      background: `color-mix(in srgb, ${m.c} 13%, transparent)`,
      color: m.c,
      whiteSpace: 'nowrap'
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: m.c
    }
  }), label || m.t);
}
function RAGDot({
  status,
  pulse
}) {
  const c = status === 'up' || status === 'ok' ? OK : status === 'degraded' || status === 'pending' ? WARN : status === 'gap' || status === 'down' ? DANGER : 'var(--app-muted)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 999,
      background: c,
      display: 'inline-block',
      animation: pulse ? 'mv-live 1.8s infinite' : 'none',
      flex: 'none'
    }
  });
}

/* MetricStat — KPI tile with delta + optional sparkline */
function MetricStat({
  icon,
  label,
  value,
  sub,
  delta,
  deltaGood = true,
  spark,
  sparkColor = ACCENT,
  accent
}) {
  const Ic = icon;
  const up = delta != null && delta >= 0;
  const good = deltaGood ? up : !up;
  const Arrow = up ? window.MvairIcons.ArrowUpRight : window.MvairIcons.ArrowDownRight;
  return /*#__PURE__*/React.createElement("div", {
    className: "mv-card mv-anim",
    style: {
      padding: 'var(--cardpad)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      fontWeight: 600,
      color: 'var(--app-text2)'
    }
  }, label), Ic && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      display: 'grid',
      placeItems: 'center',
      background: accent ? `color-mix(in srgb, ${accent} 14%, transparent)` : 'var(--app-accent-soft)',
      color: accent || 'var(--app-accent)'
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      fontWeight: 700,
      lineHeight: 1,
      color: 'var(--app-text)'
    }
  }, value), spark && /*#__PURE__*/React.createElement(Sparkline, {
    data: spark,
    color: sparkColor,
    width: 84,
    height: 30
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12
    }
  }, delta != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      fontWeight: 600,
      color: good ? OK : DANGER
    }
  }, /*#__PURE__*/React.createElement(Arrow, {
    size: 13
  }), Math.abs(delta), "%"), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--app-muted)'
    }
  }, sub)));
}
function IconButton({
  icon,
  onClick,
  title,
  badge,
  active
}) {
  const [h, setH] = useState(false);
  const Ic = icon;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    title: title,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      position: 'relative',
      width: 36,
      height: 36,
      borderRadius: 9,
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
      border: '1px solid ' + (active ? 'var(--app-accent)' : 'var(--app-border)'),
      background: h || active ? 'var(--app-hover)' : 'var(--app-card)',
      color: active ? 'var(--app-accent)' : 'var(--app-text2)'
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    size: 17
  }), badge ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -4,
      right: -4,
      minWidth: 16,
      height: 16,
      padding: '0 4px',
      borderRadius: 999,
      background: DANGER,
      color: '#fff',
      fontSize: 10,
      fontWeight: 700,
      display: 'grid',
      placeItems: 'center'
    }
  }, badge) : null);
}
function SectionTitle({
  children,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--app-text)'
    }
  }, children), action);
}
function Kbd({
  children
}) {
  return /*#__PURE__*/React.createElement("kbd", {
    style: {
      fontFamily: 'var(--mvair-font-mono)',
      fontSize: 11,
      padding: '2px 6px',
      borderRadius: 5,
      background: 'var(--app-hover)',
      border: '1px solid var(--app-border)',
      color: 'var(--app-text2)'
    }
  }, children);
}
window.MvairUI = {
  Sparkline,
  BulletGraph,
  LineChart,
  Donut,
  Heatmap,
  Funnel,
  Tabs,
  Segmented,
  Switch,
  Select,
  ProgressBar,
  StatusPill,
  RAGDot,
  MetricStat,
  IconButton,
  SectionTitle,
  Kbd,
  colors: {
    ACCENT,
    PETROL,
    AQUA,
    OK,
    WARN,
    DANGER
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/charts.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/data.js
try { (() => {
/* MedVoice Command Center — mock data layer. Plain JS, loaded before React app.
   Exposes window.MV. All figures illustrative; grounded in the MVAIR product
   (5 agent tools: check_availability, get_available_slots, book_appointment,
   capture_lead, log_emergency) and the research (missed-call economics,
   task-completion as hero outcome, BAA gates, Vapi 7.5s budget). */
(function () {
  const pad = n => String(n).padStart(2, '0');

  // ---- Tenants (multi-tenant SaaS; super-admin sees all) ----
  const tenants = [{
    id: 'northgate-family-health',
    name: 'Northgate Family Health',
    niche: 'Family medicine',
    plan: 'Growth',
    tier: 2,
    status: 'live',
    mrr: 499,
    minutes: 4120,
    minutesCap: 6000,
    calls30: 1284,
    baa: 'signed',
    pms: 'Open Dental',
    city: 'Portland, OR'
  }, {
    id: 'bayview-dental',
    name: 'Bayview Dental Group',
    niche: 'Dental',
    plan: 'Pro',
    tier: 3,
    status: 'live',
    mrr: 799,
    minutes: 7350,
    minutesCap: 9000,
    calls30: 2210,
    baa: 'signed',
    pms: 'Dentrix',
    city: 'San Diego, CA'
  }, {
    id: 'cedar-pediatrics',
    name: 'Cedar Pediatrics',
    niche: 'Pediatrics',
    plan: 'Growth',
    tier: 2,
    status: 'live',
    mrr: 499,
    minutes: 3010,
    minutesCap: 6000,
    calls30: 940,
    baa: 'signed',
    pms: 'athenahealth',
    city: 'Austin, TX'
  }, {
    id: 'summit-ortho',
    name: 'Summit Orthopedics',
    niche: 'Orthopedics',
    plan: 'Pro',
    tier: 3,
    status: 'onboarding',
    mrr: 0,
    minutes: 180,
    minutesCap: 9000,
    calls30: 64,
    baa: 'pending',
    pms: 'Epic',
    city: 'Denver, CO'
  }, {
    id: 'lakeside-wellness',
    name: 'Lakeside Wellness',
    niche: 'Primary care',
    plan: 'Starter',
    tier: 1,
    status: 'trial',
    mrr: 0,
    minutes: 420,
    minutesCap: 2000,
    calls30: 150,
    baa: 'not_started',
    pms: 'None',
    city: 'Madison, WI'
  }];

  // ---- KPI snapshot for the active tenant (Northgate) ----
  const kpis = {
    callsToday: 47,
    callsTodayDelta: 12,
    answeredRate: 100,
    missedBeforeMvair: 35,
    appointmentsBooked: 21,
    appointmentsDelta: 8,
    leadsCaptured: 14,
    leadConvRate: 30,
    emergencies: 2,
    taskCompletion: 92,
    taskCompletionDelta: 3,
    // hero outcome metric
    avgHandle: 222,
    // seconds
    avgLatency: 680,
    // ms (research median)
    afterHoursShare: 38,
    // % of calls after hours
    revenueRecovered: 9450,
    // $ — missed-call recovery
    missedCallValue: 450 // $ per missed call (research)
  };

  // ---- 14-day trend series ----
  const trend = {
    calls: [38, 41, 44, 39, 52, 61, 33, 47, 49, 58, 62, 55, 51, 47],
    booked: [14, 18, 17, 15, 22, 27, 12, 19, 21, 25, 28, 24, 22, 21],
    completion: [86, 88, 87, 85, 90, 91, 84, 89, 90, 93, 94, 91, 90, 92],
    latency: [690, 705, 680, 720, 675, 668, 712, 690, 684, 672, 665, 690, 700, 680]
  };

  // ---- Live (in-progress) calls ----
  const liveCalls = [{
    id: 'live-1',
    caller: '+1 (503) 555-0148',
    since: 72,
    intent: 'booking',
    state: 'collecting details',
    channel: 'phone',
    sentiment: 'calm'
  }, {
    id: 'live-2',
    caller: 'Web widget',
    since: 31,
    intent: 'inquiry',
    state: 'checking availability',
    channel: 'web',
    sentiment: 'calm'
  }, {
    id: 'live-3',
    caller: '+1 (971) 555-0102',
    since: 8,
    intent: 'triage',
    state: 'greeting',
    channel: 'phone',
    sentiment: 'urgent'
  }];
  const liveTranscript = [{
    role: 'aria',
    t: 'Northgate Family Health, this is Aria. How can I help you today?'
  }, {
    role: 'patient',
    t: "Hi, I need to get in to see someone about a recurring migraine."
  }, {
    role: 'aria',
    t: "I'm sorry to hear that. I can get you booked — may I have your name and a callback number?"
  }, {
    role: 'patient',
    t: 'Diane Okafor, 503-555-0148.'
  }, {
    role: 'aria',
    t: 'Thank you, Diane. Checking the next available visits with Dr. Reyes…'
  }];

  // ---- Sessions / calls ----
  const intents = ['booking', 'inquiry', 'followup', 'triage', 'billing', 'general'];
  const intentToBadge = {
    booking: 'dental',
    inquiry: 'inquiry',
    followup: 'followup',
    triage: 'urgent',
    billing: 'general',
    general: 'general'
  };
  const outcomes = ['booked', 'lead_captured', 'triaged', 'info_only', 'transferred', 'missed'];
  const firstNames = ['Diane', 'Marcus', 'Priya', 'Tom', 'Elena', 'Wei', 'Sofia', 'James', 'Aisha', 'Liam', 'Nora', 'Hassan', 'Grace', 'Ravi'];
  const lastNames = ['Okafor', 'Bell', 'Shah', 'Nguyen', 'Russo', 'Chen', 'Marquez', 'Doyle', 'Khan', 'Park', 'Olsen', 'Reyes', 'Adler', 'Iyer'];
  function rng(seed) {
    let s = seed;
    return () => (s = s * 1103515245 + 12345 & 0x7fffffff) / 0x7fffffff;
  }
  const r = rng(42);
  const sessions = [];
  for (let i = 0; i < 64; i++) {
    const channel = r() > 0.32 ? 'phone' : 'web';
    const intent = intents[Math.floor(r() * intents.length)];
    let outcome;
    if (intent === 'booking') outcome = r() > 0.18 ? 'booked' : 'lead_captured';else if (intent === 'triage') outcome = 'triaged';else if (intent === 'inquiry') outcome = r() > 0.5 ? 'lead_captured' : 'info_only';else outcome = outcomes[Math.floor(r() * outcomes.length)];
    const emergency = intent === 'triage' && r() > 0.4;
    const hour = Math.floor(r() * 24);
    const dur = 45 + Math.floor(r() * 320);
    const fn = firstNames[Math.floor(r() * firstNames.length)];
    const ln = lastNames[Math.floor(r() * lastNames.length)];
    sessions.push({
      id: 's-' + (1000 + i).toString(16).toUpperCase() + '-' + (4000 + i * 7).toString(16).toUpperCase(),
      caller: channel === 'phone' ? `+1 (503) 555-${pad(100 + i)}` : 'Web widget',
      name: r() > 0.25 ? `${fn} ${ln}` : null,
      channel,
      intent,
      outcome,
      emergency,
      startTime: `Jun ${pad(30 - i % 6)}, ${pad(hour)}:${pad(Math.floor(r() * 60))}`,
      hour,
      afterHours: hour < 8 || hour >= 18,
      duration: dur,
      turns: 4 + Math.floor(r() * 22),
      latency: 620 + Math.floor(r() * 180),
      completed: outcome !== 'missed' && outcome !== 'transferred',
      recording: r() > 0.1,
      day: i % 7
    });
  }

  // ---- A drilled-in session: transcript + tool-call trace ----
  const sampleTranscript = [{
    role: 'aria',
    state: 'greeting',
    t: 'Northgate Family Health, this is Aria. How can I help you today?'
  }, {
    role: 'patient',
    state: 'intent',
    t: "Hi, I'd like to book an appointment — I've had a sore throat for a few days."
  }, {
    role: 'aria',
    state: 'collect',
    t: "I can help with that. May I have your full name and a callback number?"
  }, {
    role: 'patient',
    state: 'collect',
    t: 'Marcus Bell, 503-555-0112.'
  }, {
    role: 'aria',
    state: 'availability',
    t: "Thanks, Marcus. Let me check the next open visits…"
  }, {
    role: 'tool',
    tool: 'check_availability',
    t: 'check_availability(provider="Dr. Reyes", window="3d") → 6 slots',
    ms: 410,
    ok: true
  }, {
    role: 'tool',
    tool: 'get_available_slots',
    t: 'get_available_slots(date="Jul 02") → ["9:30","11:00","14:15"]',
    ms: 280,
    ok: true
  }, {
    role: 'aria',
    state: 'offer',
    t: 'I have tomorrow at 9:30 AM or 11:00 AM with Dr. Reyes. Which works?'
  }, {
    role: 'patient',
    state: 'confirm',
    t: '9:30 is perfect.'
  }, {
    role: 'tool',
    tool: 'book_appointment',
    t: 'book_appointment(slot="Jul 02 09:30", patient="Marcus Bell") → confirmed #A-7741',
    ms: 520,
    ok: true
  }, {
    role: 'aria',
    state: 'confirm',
    t: "You're booked for tomorrow at 9:30 AM. You'll get a text confirmation. Anything else?"
  }, {
    role: 'patient',
    state: 'close',
    t: 'No, thank you!'
  }, {
    role: 'tool',
    tool: 'capture_lead',
    t: 'capture_lead(name="Marcus Bell", reason="sore throat") → saved',
    ms: 190,
    ok: true
  }];

  // ---- Appointments ----
  const apptStatus = ['confirmed', 'confirmed', 'pending', 'confirmed', 'rescheduled', 'confirmed', 'cancelled'];
  const providers = ['Dr. Reyes', 'Dr. Chen', 'Dr. Adeyemi', 'NP Whitfield'];
  const reasons = ['New patient visit', 'Follow-up', 'Sore throat eval', 'Annual physical', 'Migraine consult', 'Medication review', 'Lab review'];
  const appointments = [];
  for (let i = 0; i < 18; i++) {
    appointments.push({
      id: 'A-' + (7700 + i),
      patient: `${firstNames[i * 3 % firstNames.length]} ${lastNames[i * 5 % lastNames.length]}`,
      provider: providers[i % providers.length],
      reason: reasons[i % reasons.length],
      when: `Jul ${pad(1 + i % 5)} · ${pad(8 + i % 9)}:${i % 2 ? '30' : '00'} ${8 + i % 9 < 12 ? 'AM' : 'PM'}`,
      status: apptStatus[i % apptStatus.length],
      writeback: i % 7 === 3 ? 'pending' : 'synced',
      source: i % 4 === 0 ? 'web' : 'phone'
    });
  }

  // ---- Leads ----
  const leadStages = ['new', 'contacted', 'booked', 'lost'];
  const leads = [];
  for (let i = 0; i < 16; i++) {
    leads.push({
      id: 'L-' + (300 + i),
      name: `${firstNames[i * 7 % firstNames.length]} ${lastNames[i * 2 % lastNames.length]}`,
      phone: `+1 (503) 555-${pad(200 + i)}`,
      reason: reasons[(i + 2) % reasons.length],
      stage: leadStages[i % leadStages.length],
      captured: `Jun ${pad(28 - i % 5)}`,
      channel: i % 3 === 0 ? 'web' : 'phone',
      value: 180 + i % 6 * 60
    });
  }

  // ---- Emergencies / escalations ----
  const emergencies = [{
    id: 'E-204',
    caller: '+1 (971) 555-0102',
    when: 'Jun 30 · 02:14',
    flag: 'Chest pain mentioned',
    action: 'Advised 911 + escalated to on-call',
    owner: 'Dr. Reyes',
    status: 'resolved',
    sla: '1m 40s'
  }, {
    id: 'E-203',
    caller: '+1 (503) 555-0188',
    when: 'Jun 29 · 23:47',
    flag: 'Severe allergic reaction',
    action: 'Routed to nurse line',
    owner: 'NP Whitfield',
    status: 'resolved',
    sla: '2m 10s'
  }, {
    id: 'E-202',
    caller: '+1 (503) 555-0151',
    when: 'Jun 29 · 19:02',
    flag: 'High fever, infant',
    action: 'Escalated — awaiting callback',
    owner: 'Dr. Chen',
    status: 'open',
    sla: '—'
  }];

  // ---- System health (golden signals + habitat) ----
  const health = {
    overall: 'operational',
    services: [{
      name: 'Voice runtime (Vapi)',
      status: 'up',
      detail: 'us-west-2',
      metric: '680ms p50',
      sub: 'STT · LLM · TTS · telephony',
      kind: 'rented'
    }, {
      name: 'Webhook server',
      status: 'up',
      detail: 'assistant-request 1.2s avg',
      metric: '99.97%',
      sub: 'SPOF — tunnel to app server',
      kind: 'custom'
    }, {
      name: 'Google Calendar',
      status: 'up',
      detail: 'write-back live',
      metric: '320ms',
      sub: 'Gate 2 — book_appointment',
      kind: 'external'
    }, {
      name: 'PMS / EHR write-back',
      status: 'gap',
      detail: 'not connected',
      metric: '—',
      sub: 'Open Dental adapter pending',
      kind: 'gap'
    }, {
      name: 'LLM (model)',
      status: 'degraded',
      detail: 'elevated latency',
      metric: '1.1s p95',
      sub: 'failover armed',
      kind: 'rented'
    }, {
      name: 'Datastore',
      status: 'up',
      detail: 'nominal',
      metric: '12ms',
      sub: 'sessions · leads · appts',
      kind: 'custom'
    }],
    latency: {
      p50: 680,
      p95: 1080,
      p99: 1460,
      budget: 7500,
      assistantReq: 1200
    },
    signals: [{
      name: 'Latency',
      value: '680ms',
      status: 'up'
    }, {
      name: 'Traffic',
      value: '47 calls',
      status: 'up'
    }, {
      name: 'Errors',
      value: '0.4%',
      status: 'up'
    }, {
      name: 'Saturation',
      value: '38%',
      status: 'up'
    }],
    uptime: 99.97
  };

  // ---- Trust & compliance (Gate 1) ----
  const compliance = {
    certified: true,
    dataAsOf: '2 min ago',
    posture: [{
      name: 'HIPAA BAA — clinic',
      status: 'signed',
      note: 'Northgate ↔ MVAIR, executed Jun 2026'
    }, {
      name: 'SOC 2 Type II',
      status: 'in_progress',
      note: 'Observation window — report Q4 2026'
    }, {
      name: 'Encryption',
      status: 'ok',
      note: 'TLS 1.3 in transit · AES-256 at rest'
    }, {
      name: 'Audit logging',
      status: 'ok',
      note: 'All PHI access logged, tamper-evident'
    }, {
      name: 'Data retention',
      status: 'ok',
      note: 'Recordings + transcripts: 90 days, then purge'
    }, {
      name: 'AB-3030 disclosure',
      status: 'na',
      note: 'Scheduling/admin — excluded from clinical-disclosure rule'
    }],
    // The BAA flow-down chain — every subprocessor touching PHI
    baaChain: [{
      from: 'Clinic (covered entity)',
      to: 'MVAIR',
      status: 'signed'
    }, {
      from: 'MVAIR',
      to: 'Vapi (orchestration)',
      status: 'signed'
    }, {
      from: 'Vapi',
      to: 'STT provider',
      status: 'signed'
    }, {
      from: 'Vapi',
      to: 'LLM provider',
      status: 'signed'
    }, {
      from: 'Vapi',
      to: 'TTS provider',
      status: 'pending'
    }, {
      from: 'Vapi',
      to: 'Telephony',
      status: 'signed'
    }],
    audit: [{
      who: 'dr.reyes@northgate.com',
      action: 'Viewed session s-103E transcript',
      when: '14:22',
      ip: '73.12.x.x'
    }, {
      who: 'system',
      action: 'Recording s-1041 purged (90-day retention)',
      when: '03:00',
      ip: '—'
    }, {
      who: 'office@northgate.com',
      action: 'Exported leads CSV (14 rows)',
      when: 'Jun 29 17:40',
      ip: '73.12.x.x'
    }, {
      who: 'admin@medvoice.ai',
      action: 'Updated emergency escalation protocol',
      when: 'Jun 29 11:05',
      ip: '52.9.x.x'
    }]
  };

  // ---- Integrations (Gate 2) ----
  const integrations = [{
    name: 'Google Calendar',
    cat: 'Scheduling',
    status: 'connected',
    detail: 'Real-time write-back · primary calendar',
    icon: 'CalendarDays'
  }, {
    name: 'Open Dental',
    cat: 'PMS / EHR',
    status: 'available',
    detail: 'Deep write-back · ~6–12 wk setup',
    icon: 'Database'
  }, {
    name: 'Dentrix',
    cat: 'PMS / EHR',
    status: 'available',
    detail: 'Deep write-back · ~6–12 wk setup',
    icon: 'Database'
  }, {
    name: 'Epic',
    cat: 'PMS / EHR',
    status: 'available',
    detail: 'Enterprise · partner access required',
    icon: 'Database'
  }, {
    name: 'athenahealth',
    cat: 'PMS / EHR',
    status: 'available',
    detail: 'API write-back',
    icon: 'Database'
  }, {
    name: 'Twilio SMS',
    cat: 'Messaging',
    status: 'connected',
    detail: 'Appointment confirmations',
    icon: 'MessageSquare'
  }, {
    name: 'HubSpot CRM',
    cat: 'CRM',
    status: 'available',
    detail: 'Lead sync',
    icon: 'Users'
  }, {
    name: 'Eligibility (insurance)',
    cat: 'Verification',
    status: 'available',
    detail: 'Real-time benefits check',
    icon: 'ShieldCheck'
  }];

  // ---- Aria configuration ----
  const config = {
    name: 'Aria',
    greeting: 'Northgate Family Health, this is Aria. How can I help you today?',
    voice: 'Elliot (warm, neutral)',
    line: '+1 (856) 440-2211',
    hours: 'Mon–Fri 8:00 AM – 6:00 PM · 24/7 answering',
    services: ['New patient booking', 'Follow-up scheduling', 'Prescription refill intake', 'Lead capture', 'Emergency triage'],
    tools: [{
      name: 'check_availability',
      on: true
    }, {
      name: 'get_available_slots',
      on: true
    }, {
      name: 'book_appointment',
      on: true
    }, {
      name: 'capture_lead',
      on: true
    }, {
      name: 'log_emergency',
      on: true
    }],
    escalation: 'If caller mentions chest pain, difficulty breathing, severe bleeding, or suicidal ideation → advise 911 and page on-call provider.'
  };

  // ---- Notifications ----
  const notifications = [{
    id: 'n1',
    kind: 'emergency',
    title: 'Emergency flagged',
    body: 'E-202 high fever, infant — awaiting callback',
    when: '2m',
    unread: true
  }, {
    id: 'n2',
    kind: 'warning',
    title: 'LLM latency elevated',
    body: 'p95 at 1.1s — failover armed',
    when: '18m',
    unread: true
  }, {
    id: 'n3',
    kind: 'success',
    title: '21 appointments booked today',
    body: '+8 vs yesterday',
    when: '1h',
    unread: false
  }, {
    id: 'n4',
    kind: 'info',
    title: 'TTS subprocessor BAA pending',
    body: 'Blocking full Gate-1 certification',
    when: '3h',
    unread: false
  }];

  // ---- Peak-hours heatmap (7 days × 24h call counts) ----
  const heatmap = [];
  const rh = rng(7);
  for (let d = 0; d < 7; d++) {
    const row = [];
    for (let h = 0; h < 24; h++) {
      let base = h >= 8 && h <= 18 ? 6 + Math.floor(rh() * 9) : Math.floor(rh() * 4);
      if (d >= 5) base = Math.floor(base * 0.5);
      row.push(base);
    }
    heatmap.push(row);
  }

  // ---- Outcome funnel ----
  const funnel = [{
    stage: 'Calls answered',
    value: 1284,
    pct: 100
  }, {
    stage: 'Intent understood',
    value: 1241,
    pct: 97
  }, {
    stage: 'Action taken',
    value: 1118,
    pct: 87
  }, {
    stage: 'Booked / captured',
    value: 912,
    pct: 71
  }];
  const fmtDur = s => {
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return m ? `${m}m ${ss}s` : `${ss}s`;
  };
  const money = n => '$' + n.toLocaleString('en-US');
  window.MV = {
    tenants,
    kpis,
    trend,
    liveCalls,
    liveTranscript,
    sessions,
    sampleTranscript,
    appointments,
    leads,
    emergencies,
    health,
    compliance,
    integrations,
    config,
    notifications,
    heatmap,
    funnel,
    intents,
    intentToBadge,
    outcomes,
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    fmtDur,
    money
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/data.js", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/screens1.jsx
try { (() => {
/* MedVoice Command Center — screens 1: Overview, Live Monitor, Calls + drill-down.
   Exposes window.Screens1. */
const {
  useState,
  useEffect,
  useRef
} = React;
const S1_I = window.MvairIcons;
const S1 = window.MvairUI;
const {
  MetricStat,
  LineChart,
  Sparkline,
  BulletGraph,
  Donut,
  StatusPill,
  RAGDot,
  SectionTitle,
  Tabs,
  Segmented,
  Funnel
} = S1;
function Page({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mv-anim",
    style: {
      padding: 'var(--pad)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap)'
    }
  }, children);
}
function Card({
  children,
  style,
  pad = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mv-card",
    style: {
      padding: pad ? 'var(--cardpad)' : 0,
      ...style
    }
  }, children);
}
const money = window.MV.money;
const intentBadge = window.MV.intentToBadge;

/* ============ OVERVIEW / COMMAND CENTER ============ */
function Overview({
  go
}) {
  const k = window.MV.kpis,
    t = window.MV.trend;
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement("div", {
    className: "mv-card",
    style: {
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      borderLeft: '4px solid var(--mvair-danger)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 9,
      background: 'color-mix(in srgb, var(--mvair-danger) 14%, transparent)',
      color: 'var(--mvair-danger)',
      display: 'grid',
      placeItems: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(S1_I.Siren, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--app-text)'
    }
  }, "1 open emergency awaiting callback \xB7 E-202 high fever, infant"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--app-text2)'
    }
  }, "Flagged 02:14 by Aria \xB7 owner Dr. Chen \xB7 escalation protocol triggered")), /*#__PURE__*/React.createElement("button", {
    onClick: () => go('emergencies'),
    style: {
      padding: '8px 14px',
      borderRadius: 8,
      border: 'none',
      background: 'var(--mvair-danger)',
      color: '#fff',
      fontWeight: 600,
      fontSize: 13,
      cursor: 'pointer'
    }
  }, "Review")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(MetricStat, {
    icon: S1_I.PhoneIncoming,
    label: "Calls answered today",
    value: k.callsToday,
    delta: k.callsTodayDelta,
    sub: "100% answered",
    spark: t.calls
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S1_I.CalendarCheck,
    label: "Appointments booked",
    value: k.appointmentsBooked,
    delta: k.appointmentsDelta,
    sub: `${k.leadConvRate}% conv.`,
    spark: t.booked,
    accent: "var(--mvair-success)",
    sparkColor: "var(--mvair-success)"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S1_I.ListChecks,
    label: "Task completion",
    value: k.taskCompletion + '%',
    delta: k.taskCompletionDelta,
    sub: "hero outcome",
    spark: t.completion,
    accent: "var(--mvair-accent)",
    sparkColor: "var(--mvair-accent)"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S1_I.TrendingUp,
    label: "Revenue recovered",
    value: money(k.revenueRecovered),
    sub: `${k.missedCallValue ? '$450/missed call' : ''}`,
    accent: "var(--mvair-warning)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, {
    action: /*#__PURE__*/React.createElement(Segmented, {
      size: "sm",
      value: "14d",
      onChange: () => {},
      options: [{
        value: '14d',
        label: '14d'
      }, {
        value: '30d',
        label: '30d'
      }]
    })
  }, "Call volume & bookings"), /*#__PURE__*/React.createElement(LineChart, {
    height: 220,
    labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', 'Today'],
    series: [{
      name: 'Calls',
      data: t.calls
    }, {
      name: 'Booked',
      data: t.booked
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      marginTop: 10,
      fontSize: 12.5
    }
  }, /*#__PURE__*/React.createElement(Legend, {
    color: "var(--mvair-primary)",
    label: "Calls answered"
  }), /*#__PURE__*/React.createElement(Legend, {
    color: "var(--mvair-accent)",
    label: "Appointments booked"
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "This month vs. plan"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(BulletGraph, {
    label: "Answer rate",
    value: 100,
    target: 98,
    max: 100,
    valueLabel: "100%",
    color: "var(--mvair-success)"
  }), /*#__PURE__*/React.createElement(BulletGraph, {
    label: "Task completion",
    value: 92,
    target: 90,
    max: 100,
    valueLabel: "92%",
    color: "var(--mvair-accent)"
  }), /*#__PURE__*/React.createElement(BulletGraph, {
    label: "Booking conversion",
    value: 71,
    target: 75,
    max: 100,
    valueLabel: "71%",
    color: "var(--mvair-warning)"
  }), /*#__PURE__*/React.createElement(BulletGraph, {
    label: "After-hours coverage",
    value: 38,
    target: 30,
    max: 60,
    valueLabel: "38%",
    color: "var(--mvair-primary)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      fontSize: 11.5,
      color: 'var(--app-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 2,
      height: 12,
      background: 'var(--app-text)'
    }
  }), " target marker"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Today's outcomes"), /*#__PURE__*/React.createElement(Donut, {
    centerLabel: "47",
    centerSub: "calls",
    data: [{
      label: 'Booked',
      value: 21,
      color: 'var(--mvair-success)'
    }, {
      label: 'Lead captured',
      value: 14,
      color: 'var(--mvair-primary)'
    }, {
      label: 'Triaged',
      value: 5,
      color: 'var(--mvair-warning)'
    }, {
      label: 'Info only',
      value: 7,
      color: 'var(--app-border-strong)'
    }]
  })), /*#__PURE__*/React.createElement(Card, {
    style: {
      background: 'linear-gradient(180deg, var(--app-accent-soft), transparent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(S1_I.Sparkles, {
    size: 16,
    color: "var(--app-accent)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      color: 'var(--app-accent)'
    }
  }, "AI insight")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      fontWeight: 600,
      color: 'var(--app-text)',
      marginBottom: 8,
      lineHeight: 1.4
    }
  }, "After-hours bookings up 22% this week"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: 'var(--app-text2)',
      lineHeight: 1.6
    }
  }, "Most after-hours calls cluster 6\u20139 PM. Aria captured 18 visits that would have hit voicemail \u2014 an estimated ", money(8100), " in recovered revenue."), /*#__PURE__*/React.createElement("button", {
    onClick: () => go('analytics'),
    style: {
      marginTop: 14,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '7px 12px',
      borderRadius: 8,
      border: '1px solid var(--app-border)',
      background: 'var(--app-card)',
      color: 'var(--app-text)',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 600
    }
  }, "See analysis ", /*#__PURE__*/React.createElement(S1_I.ArrowUpRight, {
    size: 14
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, {
    action: /*#__PURE__*/React.createElement("button", {
      onClick: () => go('health'),
      style: linkBtn
    }, "Details")
  }, "System & trust"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 11
    }
  }, window.MV.health.services.slice(0, 4).map(s => /*#__PURE__*/React.createElement("div", {
    key: s.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(RAGDot, {
    status: s.status,
    pulse: s.status === 'up'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 13,
      color: 'var(--app-text)'
    }
  }, s.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--app-muted)'
    }
  }, s.metric))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--app-border)',
      margin: '4px 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(S1_I.ShieldCheck, {
    size: 15,
    color: "var(--mvair-success)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 13,
      color: 'var(--app-text)'
    }
  }, "HIPAA BAA \xB7 certified"), /*#__PURE__*/React.createElement("button", {
    onClick: () => go('trust'),
    style: linkBtn
  }, "View"))))), /*#__PURE__*/React.createElement(Card, {
    pad: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px var(--cardpad) 4px'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    action: /*#__PURE__*/React.createElement("button", {
      onClick: () => go('calls'),
      style: linkBtn
    }, "View all calls")
  }, "Recent calls")), /*#__PURE__*/React.createElement(CallTable, {
    rows: window.MV.sessions.slice(0, 6),
    onRow: () => go('calls'),
    compactCols: true
  })));
}
const linkBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--app-accent)',
  fontSize: 13,
  fontWeight: 600
};
function Legend({
  color,
  label
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      color: 'var(--app-text2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 3,
      background: color
    }
  }), label);
}

/* ============ LIVE MONITOR ============ */
function LiveMonitor() {
  const [sel, setSel] = useState(window.MV.liveCalls[0].id);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(i);
  }, []);
  const call = window.MV.liveCalls.find(c => c.id === sel) || window.MV.liveCalls[0];
  const fmt = s => `${Math.floor((s + tick) / 60)}:${String((s + tick) % 60).padStart(2, '0')}`;
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(LiveStat, {
    icon: S1_I.Radio,
    label: "Active calls",
    value: window.MV.liveCalls.length,
    live: true
  }), /*#__PURE__*/React.createElement(LiveStat, {
    icon: S1_I.Headset,
    label: "In queue",
    value: 0
  }), /*#__PURE__*/React.createElement(LiveStat, {
    icon: S1_I.Gauge,
    label: "Live latency",
    value: "664ms"
  }), /*#__PURE__*/React.createElement(LiveStat, {
    icon: S1_I.Clock,
    label: "Avg wait",
    value: "0s"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.4fr',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    pad: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px var(--cardpad)',
      borderBottom: '1px solid var(--app-border)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 999,
      background: 'var(--mvair-signal)',
      animation: 'mv-live 1.4s infinite'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--app-text)'
    }
  }, "Active calls")), window.MV.liveCalls.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    onClick: () => setSel(c.id),
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '13px var(--cardpad)',
      border: 'none',
      borderBottom: '1px solid var(--app-border)',
      cursor: 'pointer',
      textAlign: 'left',
      background: c.id === sel ? 'var(--app-hover)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 8,
      flex: 'none',
      display: 'grid',
      placeItems: 'center',
      background: c.sentiment === 'urgent' ? 'color-mix(in srgb, var(--mvair-danger) 14%, transparent)' : 'var(--app-accent-soft)',
      color: c.sentiment === 'urgent' ? 'var(--mvair-danger)' : 'var(--app-accent)'
    }
  }, c.channel === 'phone' ? /*#__PURE__*/React.createElement(S1_I.PhoneIncoming, {
    size: 16
  }) : /*#__PURE__*/React.createElement(S1_I.Globe, {
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--app-text)'
    }
  }, c.caller), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--app-text2)'
    }
  }, c.state)), c.sentiment === 'urgent' && /*#__PURE__*/React.createElement(StatusPill, {
    status: "open",
    label: "urgent"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--mvair-font-mono)',
      fontSize: 13,
      color: 'var(--app-muted)'
    }
  }, fmt(c.since))))), /*#__PURE__*/React.createElement(Card, {
    pad: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px var(--cardpad)',
      borderBottom: '1px solid var(--app-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--app-text)'
    }
  }, call.caller), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--app-text2)'
    }
  }, "Intent: ", call.intent, " \xB7 ", call.state)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 11px',
      borderRadius: 8,
      background: 'var(--app-hover)',
      fontSize: 12.5,
      color: 'var(--app-text2)'
    }
  }, /*#__PURE__*/React.createElement(S1_I.Volume2, {
    size: 14
  }), " Listen"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 11px',
      borderRadius: 8,
      background: 'color-mix(in srgb, var(--mvair-danger) 12%, transparent)',
      color: 'var(--mvair-danger)',
      fontSize: 12.5,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(S1_I.PhoneIncoming, {
    size: 14
  }), " Take over"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--cardpad)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      maxHeight: 360,
      overflowY: 'auto'
    }
  }, window.MV.liveTranscript.map((m, i) => /*#__PURE__*/React.createElement(Bubble, {
    key: i,
    role: m.role,
    text: m.t
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      color: 'var(--app-muted)',
      fontSize: 12.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 3
    }
  }, [0, 1, 2].map(d => /*#__PURE__*/React.createElement("span", {
    key: d,
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: 'var(--app-accent)',
      animation: `mv-live 1s ${d * 0.2}s infinite`
    }
  }))), " Aria is speaking\u2026")))));
}
function LiveStat({
  icon,
  label,
  value,
  live
}) {
  const Ic = icon;
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 10,
      display: 'grid',
      placeItems: 'center',
      background: 'var(--app-accent-soft)',
      color: 'var(--app-accent)',
      flex: 'none',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    size: 19
  }), live && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 7,
      height: 7,
      borderRadius: 999,
      background: 'var(--mvair-signal)',
      animation: 'mv-live 1.4s infinite'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 24,
      fontWeight: 700,
      color: 'var(--app-text)',
      lineHeight: 1
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--app-text2)',
      marginTop: 3
    }
  }, label)));
}
function Bubble({
  role,
  text
}) {
  const aria = role === 'aria';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexDirection: aria ? 'row' : 'row-reverse'
    }
  }, aria && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 999,
      flex: 'none',
      background: 'var(--mvair-primary)',
      color: '#fff',
      display: 'grid',
      placeItems: 'center',
      fontSize: 11,
      fontWeight: 700
    }
  }, "A"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '78%',
      padding: '9px 13px',
      borderRadius: 13,
      fontSize: 13.5,
      lineHeight: 1.5,
      background: aria ? 'var(--app-hover)' : 'var(--mvair-primary)',
      color: aria ? 'var(--app-text)' : '#fff',
      borderTopLeftRadius: aria ? 4 : 13,
      borderTopRightRadius: aria ? 13 : 4
    }
  }, text));
}

/* ============ CALLS EXPLORER ============ */
function Calls() {
  const [channel, setChannel] = useState('all');
  const [intent, setIntent] = useState('all');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(null);
  let rows = window.MV.sessions;
  if (channel !== 'all') rows = rows.filter(r => r.channel === channel);
  if (intent !== 'all') rows = rows.filter(r => r.intent === intent);
  if (q) rows = rows.filter(r => (r.caller + (r.name || '') + r.id).toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(MetricStat, {
    icon: S1_I.PhoneIncoming,
    label: "Total calls",
    value: window.MV.sessions.length,
    sub: "last 7 days"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S1_I.ListChecks,
    label: "Completed",
    value: window.MV.sessions.filter(s => s.completed).length,
    accent: "var(--mvair-success)"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S1_I.Voicemail,
    label: "Missed / transferred",
    value: window.MV.sessions.filter(s => !s.completed).length,
    accent: "var(--mvair-warning)"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S1_I.Clock,
    label: "Avg handle time",
    value: "3m 42s"
  })), /*#__PURE__*/React.createElement(Card, {
    pad: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px var(--cardpad)',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
      borderBottom: '1px solid var(--app-border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1,
      minWidth: 200
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 11,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--app-muted)',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(S1_I.Search, {
    size: 15
  })), /*#__PURE__*/React.createElement("input", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search caller, name, session id\u2026",
    style: {
      width: '100%',
      padding: '9px 12px 9px 34px',
      border: '1px solid var(--app-border)',
      borderRadius: 9,
      background: 'var(--app-card)',
      color: 'var(--app-text)',
      fontSize: 13,
      fontFamily: 'inherit',
      outline: 'none'
    }
  })), /*#__PURE__*/React.createElement(Segmented, {
    size: "sm",
    value: channel,
    onChange: setChannel,
    options: [{
      value: 'all',
      label: 'All'
    }, {
      value: 'phone',
      label: 'Phone'
    }, {
      value: 'web',
      label: 'Web'
    }]
  }), /*#__PURE__*/React.createElement(S1.Select, {
    value: intent,
    onChange: setIntent,
    width: 150,
    options: [{
      value: 'all',
      label: 'All intents'
    }, ...window.MV.intents.map(i => ({
      value: i,
      label: i
    }))]
  }), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 12px',
      borderRadius: 9,
      border: '1px solid var(--app-border)',
      background: 'var(--app-card)',
      color: 'var(--app-text2)',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(S1_I.Download, {
    size: 14
  }), " Export")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--app-muted)',
      padding: '8px var(--cardpad)'
    }
  }, rows.length, " calls"), /*#__PURE__*/React.createElement(CallTable, {
    rows: rows.slice(0, 30),
    onRow: setSel
  })), sel && /*#__PURE__*/React.createElement(CallDrawer, {
    session: sel,
    onClose: () => setSel(null)
  }));
}
function CallTable({
  rows,
  onRow,
  compactCols
}) {
  const th = {
    textAlign: 'left',
    padding: '10px var(--cardpad)',
    fontSize: 10.5,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '.06em',
    color: 'var(--app-text2)',
    whiteSpace: 'nowrap'
  };
  const td = {
    padding: 'var(--row) var(--cardpad)',
    fontSize: 13,
    color: 'var(--app-text)',
    borderTop: '1px solid var(--app-border)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Channel"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Caller"), !compactCols && /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Time"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Intent"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Outcome"), !compactCols && /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Dur."), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Latency"), /*#__PURE__*/React.createElement("th", {
    style: th
  }))), /*#__PURE__*/React.createElement("tbody", null, rows.map(s => /*#__PURE__*/React.createElement("tr", {
    key: s.id,
    onClick: () => onRow(s),
    style: {
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--app-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(ChannelTag, {
    channel: s.channel
  })), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, s.name || s.caller), s.name && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--app-muted)'
    }
  }, s.caller)), !compactCols && /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: 'var(--app-text2)',
      whiteSpace: 'nowrap'
    }
  }, s.startTime, s.afterHours && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 6,
      fontSize: 10,
      color: 'var(--mvair-warning)'
    }
  }, "\u25CF after hrs")), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(IntentTag, {
    intent: s.intent
  })), /*#__PURE__*/React.createElement("td", {
    style: td
  }, s.emergency ? /*#__PURE__*/React.createElement(StatusPill, {
    status: "open",
    label: "emergency"
  }) : /*#__PURE__*/React.createElement(StatusPill, {
    status: s.outcome
  })), !compactCols && /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      color: 'var(--app-text2)'
    }
  }, window.MV.fmtDur(s.duration)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      fontFamily: 'var(--mvair-font-mono)',
      fontSize: 12,
      color: s.latency > 900 ? 'var(--mvair-warning)' : 'var(--app-text2)'
    }
  }, s.latency, "ms"), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(S1_I.ChevronRight, {
    size: 15,
    color: "var(--app-muted)"
  })))))));
}
function ChannelTag({
  channel
}) {
  const phone = channel === 'phone';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 9px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 600,
      background: phone ? 'var(--mvair-chip-teal-bg)' : 'color-mix(in srgb, var(--app-muted) 14%, transparent)',
      color: phone ? 'var(--mvair-chip-teal-stroke)' : 'var(--app-text2)'
    }
  }, phone ? /*#__PURE__*/React.createElement(S1_I.PhoneIncoming, {
    size: 12
  }) : /*#__PURE__*/React.createElement(S1_I.Globe, {
    size: 12
  }), phone ? 'Phone' : 'Web');
}
function IntentTag({
  intent
}) {
  const map = {
    booking: 'var(--mvair-intent-dental)',
    inquiry: 'var(--mvair-intent-inquiry)',
    followup: 'var(--mvair-intent-followup)',
    triage: 'var(--mvair-intent-urgent)',
    billing: 'var(--mvair-intent-general)',
    general: 'var(--mvair-intent-unknown)'
  };
  const c = map[intent] || 'var(--app-muted)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      padding: '3px 9px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 600,
      textTransform: 'capitalize',
      background: `color-mix(in srgb, ${c} 14%, transparent)`,
      color: c
    }
  }, intent);
}

/* Call detail drawer — transcript + tool trace + outcome */
function CallDrawer({
  session,
  onClose
}) {
  const [tab, setTab] = useState('transcript');
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 80,
      background: 'rgba(8,15,18,.45)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      height: '100%',
      width: 'min(560px, 96vw)',
      background: 'var(--app-elevated)',
      borderLeft: '1px solid var(--app-border)',
      boxShadow: 'var(--app-shadow-pop)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'mv-pop .2s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      borderBottom: '1px solid var(--app-border)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(ChannelTag, {
    channel: session.channel
  }), session.emergency ? /*#__PURE__*/React.createElement(StatusPill, {
    status: "open",
    label: "emergency"
  }) : /*#__PURE__*/React.createElement(StatusPill, {
    status: session.outcome
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      color: 'var(--app-text)',
      marginTop: 8
    }
  }, session.name || session.caller), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--app-muted)',
      fontFamily: 'var(--mvair-font-mono)',
      marginTop: 2
    }
  }, session.id, " \xB7 ", session.startTime)), /*#__PURE__*/React.createElement(S1.IconButton, {
    icon: S1_I.X,
    onClick: onClose,
    title: "Close"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 1,
      background: 'var(--app-border)',
      borderBottom: '1px solid var(--app-border)'
    }
  }, [['Duration', window.MV.fmtDur(session.duration)], ['Turns', session.turns], ['Latency', session.latency + 'ms'], ['Intent', session.intent]].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      background: 'var(--app-elevated)',
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      textTransform: 'uppercase',
      letterSpacing: '.05em',
      color: 'var(--app-muted)'
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--app-text)',
      marginTop: 3,
      textTransform: 'capitalize'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      id: 'transcript',
      label: 'Transcript'
    }, {
      id: 'trace',
      label: 'Tool trace'
    }, {
      id: 'recording',
      label: 'Recording'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 20
    }
  }, tab === 'transcript' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, window.MV.sampleTranscript.filter(m => m.role !== 'tool').map((m, i) => /*#__PURE__*/React.createElement(Bubble, {
    key: i,
    role: m.role,
    text: m.t
  }))), tab === 'trace' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, window.MV.sampleTranscript.filter(m => m.role === 'tool').map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 12,
      borderRadius: 9,
      border: '1px solid var(--app-border)',
      background: 'var(--app-card)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      display: 'grid',
      placeItems: 'center',
      background: 'color-mix(in srgb, var(--mvair-success) 14%, transparent)',
      color: 'var(--mvair-success)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(S1_I.Zap, {
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontFamily: 'var(--mvair-font-mono)',
      color: 'var(--app-text)',
      fontWeight: 600
    }
  }, m.tool), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--app-muted)',
      fontFamily: 'var(--mvair-font-mono)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, m.t)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      fontFamily: 'var(--mvair-font-mono)',
      color: 'var(--app-text2)',
      flex: 'none'
    }
  }, m.ms, "ms"), /*#__PURE__*/React.createElement(S1_I.Check, {
    size: 15,
    color: "var(--mvair-success)"
  })))), tab === 'recording' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: 16,
      borderRadius: 12,
      border: '1px solid var(--app-border)',
      background: 'var(--app-card)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 999,
      border: 'none',
      background: 'var(--app-accent)',
      color: '#fff',
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(S1_I.Play, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      height: 30
    }
  }, Array.from({
    length: 48
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      height: `${20 + Math.abs(Math.sin(i * 0.7)) * 70}%`,
      background: i < 18 ? 'var(--app-accent)' : 'var(--app-border-strong)',
      borderRadius: 2
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11,
      color: 'var(--app-muted)',
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", null, "1:24"), /*#__PURE__*/React.createElement("span", null, window.MV.fmtDur(session.duration))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: 12,
      color: 'var(--app-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(S1_I.Lock, {
    size: 13
  }), " Recording encrypted at rest \xB7 auto-purged after 90 days (retention policy)")))));
}
window.Screens1 = {
  Overview,
  LiveMonitor,
  Calls,
  Page,
  Card,
  CallTable,
  ChannelTag,
  IntentTag,
  Bubble,
  linkBtn
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/screens1.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/screens2.jsx
try { (() => {
/* MedVoice Command Center — screens 2: Appointments, Leads, Emergencies. */
const {
  useState,
  useEffect
} = React;
const S2_I = window.MvairIcons;
const S2 = window.MvairUI;
const {
  MetricStat,
  StatusPill,
  SectionTitle,
  Tabs,
  Segmented,
  ProgressBar
} = S2;
const {
  Page,
  Card,
  ChannelTag
} = window.Screens1;
const th2 = {
  textAlign: 'left',
  padding: '11px var(--cardpad)',
  fontSize: 10.5,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.06em',
  color: 'var(--app-text2)',
  whiteSpace: 'nowrap'
};
const td2 = {
  padding: 'var(--row) var(--cardpad)',
  fontSize: 13,
  color: 'var(--app-text)',
  borderTop: '1px solid var(--app-border)'
};

/* ============ APPOINTMENTS ============ */
function Appointments() {
  const [view, setView] = useState('list');
  const a = window.MV.appointments;
  const synced = a.filter(x => x.writeback === 'synced').length;
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(MetricStat, {
    icon: S2_I.CalendarCheck,
    label: "Booked (7d)",
    value: a.length,
    delta: 8,
    accent: "var(--mvair-success)",
    sparkColor: "var(--mvair-success)"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S2_I.CalendarClock,
    label: "Upcoming today",
    value: 6,
    sub: "next at 9:30 AM"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S2_I.RefreshCw,
    label: "Calendar write-back",
    value: `${synced}/${a.length}`,
    sub: "synced to Google",
    accent: "var(--mvair-accent)"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S2_I.X,
    label: "Cancellations",
    value: a.filter(x => x.status === 'cancelled').length,
    accent: "var(--mvair-warning)"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mv-card",
    style: {
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      borderLeft: '4px solid var(--mvair-accent)'
    }
  }, /*#__PURE__*/React.createElement(S2_I.Plug, {
    size: 17,
    color: "var(--mvair-accent)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 13,
      color: 'var(--app-text)'
    }
  }, /*#__PURE__*/React.createElement("b", null, "Google Calendar"), " write-back is live. Connect your PMS (Open Dental) for direct chart write-back \u2014 the differentiator clinics check first."), /*#__PURE__*/React.createElement("button", {
    style: {
      padding: '7px 13px',
      borderRadius: 8,
      border: '1px solid var(--app-border)',
      background: 'var(--app-card)',
      color: 'var(--app-text)',
      fontWeight: 600,
      fontSize: 12.5,
      cursor: 'pointer'
    }
  }, "Connect PMS")), /*#__PURE__*/React.createElement(Card, {
    pad: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px var(--cardpad)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--app-border)'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Appointments"), /*#__PURE__*/React.createElement(Segmented, {
    size: "sm",
    value: view,
    onChange: setView,
    options: [{
      value: 'list',
      label: 'List',
      icon: S2_I.ListChecks
    }, {
      value: 'cal',
      label: 'Calendar',
      icon: S2_I.CalendarDays
    }]
  })), view === 'list' ? /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th2
  }, "Patient"), /*#__PURE__*/React.createElement("th", {
    style: th2
  }, "Provider"), /*#__PURE__*/React.createElement("th", {
    style: th2
  }, "Reason"), /*#__PURE__*/React.createElement("th", {
    style: th2
  }, "When"), /*#__PURE__*/React.createElement("th", {
    style: th2
  }, "Source"), /*#__PURE__*/React.createElement("th", {
    style: th2
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    style: th2
  }, "Write-back"))), /*#__PURE__*/React.createElement("tbody", null, a.map(x => /*#__PURE__*/React.createElement("tr", {
    key: x.id,
    onMouseEnter: e => e.currentTarget.style.background = 'var(--app-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("td", {
    style: td2
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, x.patient), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--app-muted)',
      fontFamily: 'var(--mvair-font-mono)'
    }
  }, x.id)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td2,
      color: 'var(--app-text2)'
    }
  }, x.provider), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td2,
      color: 'var(--app-text2)'
    }
  }, x.reason), /*#__PURE__*/React.createElement("td", {
    style: td2
  }, x.when), /*#__PURE__*/React.createElement("td", {
    style: td2
  }, /*#__PURE__*/React.createElement(ChannelTag, {
    channel: x.source
  })), /*#__PURE__*/React.createElement("td", {
    style: td2
  }, /*#__PURE__*/React.createElement(StatusPill, {
    status: x.status
  })), /*#__PURE__*/React.createElement("td", {
    style: td2
  }, x.writeback === 'synced' ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      color: 'var(--mvair-success)',
      fontSize: 12.5,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(S2_I.Check, {
    size: 14
  }), " Synced") : /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      color: 'var(--mvair-warning)',
      fontSize: 12.5,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(S2_I.RefreshCw, {
    size: 13
  }), " Pending"))))))) : /*#__PURE__*/React.createElement(CalendarView, {
    appts: a
  })));
}
function CalendarView({
  appts
}) {
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const days = ['Mon Jul 1', 'Tue Jul 2', 'Wed Jul 3', 'Thu Jul 4', 'Fri Jul 5'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--cardpad)',
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '56px repeat(5, 1fr)',
      gap: 6,
      minWidth: 620
    }
  }, /*#__PURE__*/React.createElement("div", null), days.map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--app-text)',
      textAlign: 'center',
      paddingBottom: 6
    }
  }, d)), hours.map(h => /*#__PURE__*/React.createElement(React.Fragment, {
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--app-muted)',
      textAlign: 'right',
      paddingRight: 8
    }
  }, h <= 12 ? h : h - 12, h < 12 ? 'a' : 'p'), [0, 1, 2, 3, 4].map(d => {
    const appt = appts.find((a, i) => i % 5 === d && 8 + i % 9 === h);
    return /*#__PURE__*/React.createElement("div", {
      key: d,
      style: {
        minHeight: 38,
        borderRadius: 7,
        border: '1px solid var(--app-border)',
        background: 'var(--app-card)',
        padding: appt ? 5 : 0
      }
    }, appt && /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--app-accent-soft)',
        borderLeft: '3px solid var(--app-accent)',
        borderRadius: 5,
        padding: '4px 7px',
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--app-text)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, appt.patient.split(' ')[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: 'var(--app-muted)'
      }
    }, appt.provider)));
  })))));
}

/* ============ LEADS ============ */
function Leads() {
  const [stage, setStage] = useState('all');
  let rows = window.MV.leads;
  if (stage !== 'all') rows = rows.filter(l => l.stage === stage);
  const byStage = s => window.MV.leads.filter(l => l.stage === s).length;
  const pipeValue = window.MV.leads.filter(l => l.stage !== 'lost').reduce((a, l) => a + l.value, 0);
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(MetricStat, {
    icon: S2_I.Users,
    label: "Leads captured (7d)",
    value: window.MV.leads.length,
    delta: 11
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S2_I.CalendarCheck,
    label: "Converted to booked",
    value: byStage('booked'),
    accent: "var(--mvair-success)"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S2_I.TrendingUp,
    label: "Open pipeline value",
    value: window.MV.money(pipeValue),
    accent: "var(--mvair-warning)"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S2_I.Voicemail,
    label: "Recovered from voicemail",
    value: window.MV.leads.length,
    sub: "would have been lost",
    accent: "var(--mvair-accent)"
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Pipeline"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 14
    }
  }, [['new', 'New', 'var(--mvair-primary)'], ['contacted', 'Contacted', 'var(--mvair-accent)'], ['booked', 'Booked', 'var(--mvair-success)'], ['lost', 'Lost', 'var(--app-muted)']].map(([s, label, c]) => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      padding: 14,
      borderRadius: 10,
      border: '1px solid var(--app-border)',
      background: 'var(--app-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 999,
      background: c
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: 'var(--app-text2)'
    }
  }, label)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 700,
      color: 'var(--app-text)'
    }
  }, byStage(s)), /*#__PURE__*/React.createElement(ProgressBar, {
    value: byStage(s),
    max: window.MV.leads.length,
    color: c,
    height: 5
  }))))), /*#__PURE__*/React.createElement(Card, {
    pad: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px var(--cardpad)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--app-border)'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Leads"), /*#__PURE__*/React.createElement(Segmented, {
    size: "sm",
    value: stage,
    onChange: setStage,
    options: [{
      value: 'all',
      label: 'All'
    }, {
      value: 'new',
      label: 'New'
    }, {
      value: 'contacted',
      label: 'Contacted'
    }, {
      value: 'booked',
      label: 'Booked'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th2
  }, "Lead"), /*#__PURE__*/React.createElement("th", {
    style: th2
  }, "Reason"), /*#__PURE__*/React.createElement("th", {
    style: th2
  }, "Channel"), /*#__PURE__*/React.createElement("th", {
    style: th2
  }, "Captured"), /*#__PURE__*/React.createElement("th", {
    style: th2
  }, "Est. value"), /*#__PURE__*/React.createElement("th", {
    style: th2
  }, "Stage"), /*#__PURE__*/React.createElement("th", {
    style: th2
  }))), /*#__PURE__*/React.createElement("tbody", null, rows.map(l => /*#__PURE__*/React.createElement("tr", {
    key: l.id,
    onMouseEnter: e => e.currentTarget.style.background = 'var(--app-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("td", {
    style: td2
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600
    }
  }, l.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--app-muted)'
    }
  }, l.phone)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td2,
      color: 'var(--app-text2)'
    }
  }, l.reason), /*#__PURE__*/React.createElement("td", {
    style: td2
  }, /*#__PURE__*/React.createElement(ChannelTag, {
    channel: l.channel
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td2,
      color: 'var(--app-text2)'
    }
  }, l.captured), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td2,
      fontWeight: 600
    }
  }, window.MV.money(l.value)), /*#__PURE__*/React.createElement("td", {
    style: td2
  }, /*#__PURE__*/React.createElement(StatusPill, {
    status: l.stage
  })), /*#__PURE__*/React.createElement("td", {
    style: td2
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      padding: '5px 11px',
      borderRadius: 7,
      border: '1px solid var(--app-border)',
      background: 'var(--app-card)',
      color: 'var(--app-text)',
      fontSize: 12,
      fontWeight: 600,
      cursor: 'pointer'
    }
  }, "Follow up")))))))));
}

/* ============ EMERGENCIES ============ */
function Emergencies() {
  const e = window.MV.emergencies;
  const open = e.filter(x => x.status === 'open');
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(MetricStat, {
    icon: S2_I.Siren,
    label: "Open escalations",
    value: open.length,
    accent: "var(--mvair-danger)",
    sparkColor: "var(--mvair-danger)"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S2_I.ClipboardCheck,
    label: "Resolved (7d)",
    value: e.filter(x => x.status === 'resolved').length,
    accent: "var(--mvair-success)"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S2_I.Clock,
    label: "Avg time to escalate",
    value: "1m 55s",
    sub: "detection \u2192 owner"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S2_I.ShieldCheck,
    label: "Protocol coverage",
    value: "100%",
    sub: "all flags routed",
    accent: "var(--mvair-accent)"
  })), /*#__PURE__*/React.createElement(Card, {
    style: {
      borderLeft: '4px solid var(--mvair-danger)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(S2_I.ShieldAlert, {
    size: 18,
    color: "var(--mvair-danger)",
    style: {
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--app-text)',
      marginBottom: 4
    }
  }, "Active escalation protocol"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: 'var(--app-text2)',
      lineHeight: 1.6
    }
  }, window.MV.config.escalation)))), /*#__PURE__*/React.createElement(Card, {
    pad: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px var(--cardpad) 4px'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Escalation log")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, e.map(x => /*#__PURE__*/React.createElement("div", {
    key: x.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '14px var(--cardpad)',
      borderTop: '1px solid var(--app-border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 9,
      flex: 'none',
      display: 'grid',
      placeItems: 'center',
      background: x.status === 'open' ? 'color-mix(in srgb, var(--mvair-danger) 14%, transparent)' : 'color-mix(in srgb, var(--mvair-success) 12%, transparent)',
      color: x.status === 'open' ? 'var(--mvair-danger)' : 'var(--mvair-success)'
    }
  }, x.status === 'open' ? /*#__PURE__*/React.createElement(S2_I.Siren, {
    size: 18
  }) : /*#__PURE__*/React.createElement(S2_I.ClipboardCheck, {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--app-text)'
    }
  }, x.flag), /*#__PURE__*/React.createElement(StatusPill, {
    status: x.status
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--app-text2)',
      marginTop: 3
    }
  }, x.action, " \xB7 owner ", /*#__PURE__*/React.createElement("b", null, x.owner))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--app-text2)',
      fontFamily: 'var(--mvair-font-mono)'
    }
  }, x.caller), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--app-muted)',
      marginTop: 2
    }
  }, x.when, " \xB7 SLA ", x.sla)), x.status === 'open' && /*#__PURE__*/React.createElement("button", {
    style: {
      padding: '8px 14px',
      borderRadius: 8,
      border: 'none',
      background: 'var(--mvair-danger)',
      color: '#fff',
      fontWeight: 600,
      fontSize: 13,
      cursor: 'pointer',
      flex: 'none'
    }
  }, "Resolve"))))));
}
window.Screens2 = {
  Appointments,
  Leads,
  Emergencies
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/screens2.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/screens3.jsx
try { (() => {
/* MedVoice Command Center — screens 3: Analytics & Insights, System Health. */
const {
  useState,
  useEffect
} = React;
const S3_I = window.MvairIcons;
const S3 = window.MvairUI;
const {
  MetricStat,
  LineChart,
  Donut,
  Heatmap,
  Funnel,
  StatusPill,
  RAGDot,
  SectionTitle,
  Segmented,
  BulletGraph,
  ProgressBar
} = S3;
const {
  Page,
  Card
} = window.Screens1;

/* ============ ANALYTICS & INSIGHTS ============ */
function Analytics() {
  const [metric, setMetric] = useState('calls');
  const t = window.MV.trend;
  const series = {
    calls: t.calls,
    booked: t.booked,
    completion: t.completion
  }[metric];
  const intentCounts = window.MV.intents.map(i => ({
    label: i,
    value: window.MV.sessions.filter(s => s.intent === i).length
  }));
  const intentColors = ['var(--mvair-intent-dental)', 'var(--mvair-intent-inquiry)', 'var(--mvair-intent-followup)', 'var(--mvair-intent-urgent)', 'var(--mvair-intent-general)', 'var(--mvair-intent-unknown)'];
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(Insight, {
    icon: S3_I.TrendingUp,
    tone: "success",
    title: "After-hours bookings +22%",
    body: "6\u20139 PM is now your highest-converting window."
  }), /*#__PURE__*/React.createElement(Insight, {
    icon: S3_I.AlertTriangle,
    tone: "warning",
    title: "Billing-intent calls rising",
    body: "+14% w/w \u2014 consider an FAQ flow to deflect."
  }), /*#__PURE__*/React.createElement(Insight, {
    icon: S3_I.Sparkles,
    tone: "accent",
    title: "Task completion at 92%",
    body: "Above your 90% target for 9 straight days."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, {
    action: /*#__PURE__*/React.createElement(Segmented, {
      size: "sm",
      value: metric,
      onChange: setMetric,
      options: [{
        value: 'calls',
        label: 'Calls'
      }, {
        value: 'booked',
        label: 'Booked'
      }, {
        value: 'completion',
        label: 'Completion'
      }]
    })
  }, "Trend"), /*#__PURE__*/React.createElement(LineChart, {
    height: 240,
    labels: Array.from({
      length: 14
    }, (_, i) => i === 13 ? 'Today' : ''),
    series: [{
      name: metric,
      data: series
    }],
    colors: ['var(--mvair-primary)'],
    yFmt: v => metric === 'completion' ? v + '%' : v
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Outcome funnel"), /*#__PURE__*/React.createElement(Funnel, {
    stages: window.MV.funnel
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: 12,
      borderRadius: 9,
      background: 'var(--app-accent-soft)',
      fontSize: 12.5,
      color: 'var(--app-text2)',
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--app-text)'
    }
  }, "71%"), " of answered calls end in a booking or captured lead \u2014 the business-outcome metric that matters most."))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Peak call hours"), /*#__PURE__*/React.createElement(Heatmap, {
    grid: window.MV.heatmap,
    rows: window.MV.days
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Calls by intent"), /*#__PURE__*/React.createElement(Donut, {
    centerLabel: window.MV.sessions.length,
    centerSub: "calls",
    data: intentCounts.map((c, i) => ({
      ...c,
      color: intentColors[i]
    }))
  })), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Channel & coverage"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(BulletGraph, {
    label: "Phone vs web split",
    value: 68,
    target: null,
    max: 100,
    valueLabel: "68% phone",
    color: "var(--mvair-primary)"
  }), /*#__PURE__*/React.createElement(BulletGraph, {
    label: "After-hours coverage",
    value: 38,
    target: 30,
    max: 60,
    valueLabel: "38%",
    color: "var(--mvair-accent)"
  }), /*#__PURE__*/React.createElement(BulletGraph, {
    label: "First-call resolution",
    value: 87,
    target: 85,
    max: 100,
    valueLabel: "87%",
    color: "var(--mvair-success)"
  }), /*#__PURE__*/React.createElement(BulletGraph, {
    label: "Avg turns to book",
    value: 9,
    target: 8,
    max: 20,
    valueLabel: "9 turns",
    color: "var(--mvair-warning)"
  })))));
}
function Insight({
  icon,
  tone,
  title,
  body
}) {
  const c = {
    success: 'var(--mvair-success)',
    warning: 'var(--mvair-warning)',
    accent: 'var(--app-accent)'
  }[tone];
  const Ic = icon;
  return /*#__PURE__*/React.createElement(Card, {
    style: {
      borderTop: `3px solid ${c}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    size: 16,
    color: c
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--app-text)'
    }
  }, title)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12.5,
      color: 'var(--app-text2)',
      lineHeight: 1.55
    }
  }, body));
}

/* ============ SYSTEM HEALTH ============ */
function Health() {
  const h = window.MV.health;
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement("div", {
    className: "mv-card",
    style: {
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 11,
      background: 'color-mix(in srgb, var(--mvair-success) 14%, transparent)',
      color: 'var(--mvair-success)',
      display: 'grid',
      placeItems: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(S3_I.Activity, {
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: 'var(--app-text)'
    }
  }, "All systems operational"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--app-text2)'
    }
  }, h.uptime, "% uptime (30d) \xB7 one component running degraded \xB7 one gap")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12.5,
      color: 'var(--app-muted)'
    }
  }, /*#__PURE__*/React.createElement(S3_I.RefreshCw, {
    size: 13
  }), " auto-refreshes every 30s")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      color: 'var(--app-text2)',
      marginBottom: 10
    }
  }, "Four golden signals"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--gap)'
    }
  }, h.signals.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(RAGDot, {
    status: s.status,
    pulse: true
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      textTransform: 'uppercase',
      letterSpacing: '.05em',
      color: 'var(--app-muted)'
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--app-text)'
    }
  }, s.value)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    pad: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px var(--cardpad) 4px'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Components")), h.services.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '13px var(--cardpad)',
      borderTop: '1px solid var(--app-border)'
    }
  }, /*#__PURE__*/React.createElement(RAGDot, {
    status: s.status,
    pulse: s.status === 'up'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--app-text)'
    }
  }, s.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.04em',
      padding: '2px 6px',
      borderRadius: 5,
      background: 'var(--app-hover)',
      color: 'var(--app-muted)'
    }
  }, s.kind)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--app-text2)',
      marginTop: 2
    }
  }, s.sub)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'var(--mvair-font-mono)',
      color: 'var(--app-text)'
    }
  }, s.metric), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--app-muted)'
    }
  }, s.detail))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Latency vs. budget"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Lat, {
    label: "p50",
    value: h.latency.p50,
    good: true
  }), /*#__PURE__*/React.createElement(Lat, {
    label: "p95",
    value: h.latency.p95
  }), /*#__PURE__*/React.createElement(Lat, {
    label: "p99",
    value: h.latency.p99,
    warn: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      paddingTop: 14,
      borderTop: '1px solid var(--app-border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12.5,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--app-text2)'
    }
  }, "assistant-request"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--app-text)'
    }
  }, h.latency.assistantReq, "ms / ", h.latency.budget, "ms")), /*#__PURE__*/React.createElement(ProgressBar, {
    value: h.latency.assistantReq,
    max: h.latency.budget,
    color: "var(--mvair-success)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--app-muted)',
      marginTop: 6
    }
  }, "Vapi enforces a 7.5s build budget per call. Healthy headroom."))), /*#__PURE__*/React.createElement(Card, {
    style: {
      borderLeft: '4px solid var(--mvair-warning)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 11
    }
  }, /*#__PURE__*/React.createElement(S3_I.Webhook, {
    size: 18,
    color: "var(--mvair-warning)",
    style: {
      flex: 'none',
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--app-text)'
    }
  }, "Webhook tunnel is a single point of failure"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 12.5,
      color: 'var(--app-text2)',
      lineHeight: 1.55
    }
  }, "If the app server is unreachable, ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--mvair-font-mono)'
    }
  }, "assistant-request"), " fails inside the 7.5s window and calls fall back. Move off the dev tunnel before production.")))))));
}
function Lat({
  label,
  value,
  good,
  warn
}) {
  const c = good ? 'var(--mvair-success)' : warn ? 'var(--mvair-warning)' : 'var(--mvair-primary)';
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12.5,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--app-text2)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--app-text)',
      fontFamily: 'var(--mvair-font-mono)'
    }
  }, value, "ms")), /*#__PURE__*/React.createElement(ProgressBar, {
    value: value,
    max: 1600,
    color: c,
    height: 6
  }));
}
window.Screens3 = {
  Analytics,
  Health
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/screens3.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/screens4.jsx
try { (() => {
/* MedVoice Command Center — screens 4: Trust & Compliance, Integrations, Config, Tenants, Billing. */
const {
  useState
} = React;
const S4_I = window.MvairIcons;
const S4 = window.MvairUI;
const {
  MetricStat,
  StatusPill,
  RAGDot,
  SectionTitle,
  Switch,
  ProgressBar,
  Tabs
} = S4;
const {
  Page,
  Card
} = window.Screens1;

/* ============ TRUST & COMPLIANCE (Gate 1) ============ */
function Trust() {
  const c = window.MV.compliance;
  const signed = c.baaChain.filter(b => b.status === 'signed').length;
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement("div", {
    className: "mv-card",
    style: {
      padding: '18px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      borderLeft: '4px solid var(--mvair-success)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 46,
      height: 46,
      borderRadius: 12,
      background: 'color-mix(in srgb, var(--mvair-success) 14%, transparent)',
      color: 'var(--mvair-success)',
      display: 'grid',
      placeItems: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(S4_I.ShieldCheck, {
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: 'var(--app-text)'
    }
  }, "Certified & reconciled \xB7 data as of ", c.dataAsOf), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--app-text2)'
    }
  }, "Every figure on this dashboard reconciles to the certified dataset. BAA executed with this clinic.")), /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '9px 14px',
      borderRadius: 9,
      border: '1px solid var(--app-border)',
      background: 'var(--app-card)',
      color: 'var(--app-text)',
      fontWeight: 600,
      fontSize: 13,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(S4_I.Download, {
    size: 14
  }), " Compliance pack")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(MetricStat, {
    icon: S4_I.ShieldCheck,
    label: "BAA chain signed",
    value: `${signed}/${c.baaChain.length}`,
    sub: "flow-down",
    accent: signed === c.baaChain.length ? 'var(--mvair-success)' : 'var(--mvair-warning)'
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S4_I.Lock,
    label: "Encryption",
    value: "AES-256",
    sub: "+ TLS 1.3",
    accent: "var(--mvair-success)"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S4_I.ScrollText,
    label: "Audit events (24h)",
    value: "148",
    sub: "all PHI access"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S4_I.Clock,
    label: "Data retention",
    value: "90d",
    sub: "auto-purge",
    accent: "var(--mvair-accent)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    pad: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px var(--cardpad) 4px'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Compliance posture")), c.posture.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px var(--cardpad)',
      borderTop: '1px solid var(--app-border)'
    }
  }, /*#__PURE__*/React.createElement(RAGDot, {
    status: p.status === 'signed' || p.status === 'ok' ? 'ok' : p.status === 'in_progress' ? 'pending' : 'na'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--app-text)'
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--app-text2)'
    }
  }, p.note)), /*#__PURE__*/React.createElement(StatusPill, {
    status: p.status
  })))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, {
    action: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: 'var(--app-muted)'
      }
    }, "Gate 1")
  }, "BAA flow-down chain"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 14px',
      fontSize: 12.5,
      color: 'var(--app-text2)',
      lineHeight: 1.55
    }
  }, "A sale is legally possible only when every subprocessor that touches PHI has a signed BAA."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }
  }, c.baaChain.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '9px 0',
      borderBottom: i < c.baaChain.length - 1 ? '1px dashed var(--app-border)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      width: 26,
      height: 26,
      borderRadius: 7,
      display: 'grid',
      placeItems: 'center',
      background: b.status === 'signed' ? 'color-mix(in srgb, var(--mvair-success) 14%, transparent)' : 'color-mix(in srgb, var(--mvair-warning) 14%, transparent)',
      color: b.status === 'signed' ? 'var(--mvair-success)' : 'var(--mvair-warning)'
    }
  }, b.status === 'signed' ? /*#__PURE__*/React.createElement(S4_I.Check, {
    size: 14
  }) : /*#__PURE__*/React.createElement(S4_I.Clock, {
    size: 13
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 12.5,
      color: 'var(--app-text)'
    }
  }, /*#__PURE__*/React.createElement("b", null, b.from), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--app-muted)'
    }
  }, "\u2192"), " ", b.to), /*#__PURE__*/React.createElement(StatusPill, {
    status: b.status,
    dot: false
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: 11,
      borderRadius: 9,
      background: 'color-mix(in srgb, var(--mvair-warning) 10%, transparent)',
      fontSize: 12,
      color: 'var(--app-text2)',
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--mvair-warning)'
    }
  }, "1 pending:"), " TTS subprocessor BAA blocks full Gate-1 certification for live patient traffic."))), /*#__PURE__*/React.createElement(Card, {
    pad: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px var(--cardpad) 4px'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, {
    action: /*#__PURE__*/React.createElement("button", {
      style: {
        background: 'none',
        border: 'none',
        color: 'var(--app-accent)',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, "Full log")
  }, "Audit trail")), c.audit.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '11px var(--cardpad)',
      borderTop: '1px solid var(--app-border)'
    }
  }, /*#__PURE__*/React.createElement(S4_I.ScrollText, {
    size: 15,
    color: "var(--app-muted)",
    style: {
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontFamily: 'var(--mvair-font-mono)',
      color: 'var(--app-text2)',
      flex: 'none',
      width: 200,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, a.who), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 13,
      color: 'var(--app-text)'
    }
  }, a.action), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: 'var(--app-muted)',
      fontFamily: 'var(--mvair-font-mono)'
    }
  }, a.ip), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--app-muted)',
      flex: 'none',
      width: 80,
      textAlign: 'right'
    }
  }, a.when)))));
}

/* ============ INTEGRATIONS (Gate 2) ============ */
function Integrations() {
  const cats = [...new Set(window.MV.integrations.map(i => i.cat))];
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement("div", {
    className: "mv-card",
    style: {
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      borderLeft: '4px solid var(--mvair-accent)'
    }
  }, /*#__PURE__*/React.createElement(S4_I.Plug, {
    size: 20,
    color: "var(--mvair-accent)",
    style: {
      flex: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: 'var(--app-text)'
    }
  }, "Write-back is the differentiator clinics check first"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--app-text2)'
    }
  }, "Booking into the system the clinic actually runs (PMS/EHR) \u2014 not a side calendar \u2014 is Gate 2. Calendar is live; deep PMS write-back takes ~6\u201312 weeks per system."))), cats.map(cat => /*#__PURE__*/React.createElement("div", {
    key: cat
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      color: 'var(--app-text2)',
      margin: '4px 0 10px'
    }
  }, cat), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: 'var(--gap)'
    }
  }, window.MV.integrations.filter(i => i.cat === cat).map(it => {
    const Ic = S4_I[it.icon] || S4_I.Plug;
    const connected = it.status === 'connected';
    return /*#__PURE__*/React.createElement(Card, {
      key: it.name,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: 10,
        display: 'grid',
        placeItems: 'center',
        background: connected ? 'color-mix(in srgb, var(--mvair-success) 13%, transparent)' : 'var(--app-hover)',
        color: connected ? 'var(--mvair-success)' : 'var(--app-text2)'
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      size: 20
    })), /*#__PURE__*/React.createElement(StatusPill, {
      status: it.status
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14.5,
        fontWeight: 600,
        color: 'var(--app-text)'
      }
    }, it.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: 'var(--app-text2)',
        marginTop: 3,
        lineHeight: 1.45
      }
    }, it.detail)), /*#__PURE__*/React.createElement("button", {
      style: {
        marginTop: 'auto',
        padding: '8px',
        borderRadius: 8,
        border: '1px solid var(--app-border)',
        background: connected ? 'var(--app-card)' : 'var(--app-accent)',
        color: connected ? 'var(--app-text2)' : '#fff',
        fontWeight: 600,
        fontSize: 13,
        cursor: 'pointer'
      }
    }, connected ? 'Manage' : 'Connect'));
  })))));
}

/* ============ ARIA CONFIGURATION ============ */
function Config() {
  const cfg = window.MV.config;
  const [tools, setTools] = useState(cfg.tools.map(t => t.on));
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Assistant"), /*#__PURE__*/React.createElement(Field, {
    label: "Name"
  }, /*#__PURE__*/React.createElement(Input, {
    value: cfg.name
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Greeting (first message)"
  }, /*#__PURE__*/React.createElement(Textarea, {
    value: cfg.greeting
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Voice"
  }, /*#__PURE__*/React.createElement(Input, {
    value: cfg.voice
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Phone line"
  }, /*#__PURE__*/React.createElement(Input, {
    value: cfg.line,
    mono: true
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Business hours"
  }, /*#__PURE__*/React.createElement(Input, {
    value: cfg.hours
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Emergency escalation protocol"), /*#__PURE__*/React.createElement(Textarea, {
    value: cfg.escalation,
    rows: 3
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 12,
      color: 'var(--app-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(S4_I.Siren, {
    size: 13,
    color: "var(--mvair-danger)"
  }), " Triggers ", /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--mvair-font-mono)'
    }
  }, "log_emergency"), " + pages on-call."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      background: 'linear-gradient(180deg, var(--app-accent-soft), transparent)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(S4_I.PhoneIncoming, {
    size: 16,
    color: "var(--app-accent)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      color: 'var(--app-accent)'
    }
  }, "Gate 3 \xB7 prove it live")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--app-text)',
      marginBottom: 6
    }
  }, "Test the line"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 14px',
      fontSize: 12.5,
      color: 'var(--app-text2)',
      lineHeight: 1.55
    }
  }, "Place a live call to ", cfg.line, " and run an adversarial test \u2014 book, reschedule, ask insurance, describe an emergency."), /*#__PURE__*/React.createElement("button", {
    style: {
      width: '100%',
      padding: '11px',
      borderRadius: 9,
      border: 'none',
      background: 'var(--app-accent)',
      color: '#fff',
      fontWeight: 600,
      fontSize: 14,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(S4_I.PhoneIncoming, {
    size: 16
  }), " Call the line now")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Enabled tools"), cfg.tools.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: t.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '9px 0',
      borderBottom: i < cfg.tools.length - 1 ? '1px solid var(--app-border)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(S4_I.Zap, {
    size: 15,
    color: "var(--mvair-success)"
  }), /*#__PURE__*/React.createElement("code", {
    style: {
      flex: 1,
      fontFamily: 'var(--mvair-font-mono)',
      fontSize: 13,
      color: 'var(--app-text)'
    }
  }, t.name), /*#__PURE__*/React.createElement(Switch, {
    checked: tools[i],
    onChange: v => setTools(tools.map((x, j) => j === i ? v : x)),
    size: 16
  })))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Services offered"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, cfg.services.map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      padding: '6px 11px',
      borderRadius: 999,
      background: 'var(--app-hover)',
      border: '1px solid var(--app-border)',
      fontSize: 12.5,
      color: 'var(--app-text)'
    }
  }, s)))))));
}
function Field({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 12.5,
      fontWeight: 600,
      color: 'var(--app-text2)',
      marginBottom: 6
    }
  }, label), children);
}
function Input({
  value,
  mono
}) {
  return /*#__PURE__*/React.createElement("input", {
    defaultValue: value,
    style: {
      width: '100%',
      padding: '9px 12px',
      border: '1px solid var(--app-border)',
      borderRadius: 8,
      background: 'var(--app-card)',
      color: 'var(--app-text)',
      fontSize: 13.5,
      fontFamily: mono ? 'var(--mvair-font-mono)' : 'inherit',
      outline: 'none'
    },
    onFocus: e => e.target.style.boxShadow = '0 0 0 3px var(--app-ring)',
    onBlur: e => e.target.style.boxShadow = 'none'
  });
}
function Textarea({
  value,
  rows = 2
}) {
  return /*#__PURE__*/React.createElement("textarea", {
    defaultValue: value,
    rows: rows,
    style: {
      width: '100%',
      padding: '9px 12px',
      border: '1px solid var(--app-border)',
      borderRadius: 8,
      background: 'var(--app-card)',
      color: 'var(--app-text)',
      fontSize: 13.5,
      fontFamily: 'inherit',
      outline: 'none',
      resize: 'vertical',
      lineHeight: 1.5
    },
    onFocus: e => e.target.style.boxShadow = '0 0 0 3px var(--app-ring)',
    onBlur: e => e.target.style.boxShadow = 'none'
  });
}

/* ============ TENANTS (super-admin) ============ */
function Tenants({
  onPick
}) {
  const t = window.MV.tenants;
  const live = t.filter(x => x.status === 'live').length;
  const mrr = t.reduce((a, x) => a + x.mrr, 0);
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(MetricStat, {
    icon: S4_I.Building2,
    label: "Clinics",
    value: t.length,
    sub: `${live} live`
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S4_I.TrendingUp,
    label: "MRR",
    value: window.MV.money(mrr),
    delta: 9,
    accent: "var(--mvair-success)"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S4_I.PhoneIncoming,
    label: "Calls (30d)",
    value: t.reduce((a, x) => a + x.calls30, 0).toLocaleString()
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S4_I.ShieldCheck,
    label: "BAAs signed",
    value: `${t.filter(x => x.baa === 'signed').length}/${t.length}`,
    accent: "var(--mvair-accent)"
  })), /*#__PURE__*/React.createElement(Card, {
    pad: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px var(--cardpad) 4px'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "All clinics")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Clinic', 'Niche', 'Plan', 'Status', 'BAA', 'PMS', 'Minutes used', 'MRR'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: 'left',
      padding: '11px var(--cardpad)',
      fontSize: 10.5,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      color: 'var(--app-text2)',
      whiteSpace: 'nowrap'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, t.map(x => /*#__PURE__*/React.createElement("tr", {
    key: x.id,
    onClick: () => onPick && onPick(x),
    style: {
      cursor: 'pointer'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--app-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: 'var(--row) var(--cardpad)',
      borderTop: '1px solid var(--app-border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: 'var(--app-accent-soft)',
      color: 'var(--app-accent)',
      display: 'grid',
      placeItems: 'center',
      fontWeight: 700,
      fontSize: 13,
      flex: 'none'
    }
  }, x.name[0]), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--app-text)'
    }
  }, x.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--app-muted)'
    }
  }, x.city)))), /*#__PURE__*/React.createElement("td", {
    style: cellMuted
  }, x.niche), /*#__PURE__*/React.createElement("td", {
    style: cell
  }, x.plan, " \xB7 T", x.tier), /*#__PURE__*/React.createElement("td", {
    style: cell
  }, /*#__PURE__*/React.createElement(StatusPill, {
    status: x.status
  })), /*#__PURE__*/React.createElement("td", {
    style: cell
  }, /*#__PURE__*/React.createElement(StatusPill, {
    status: x.baa === 'signed' ? 'signed' : x.baa === 'pending' ? 'pending' : 'not_started',
    dot: false
  })), /*#__PURE__*/React.createElement("td", {
    style: cellMuted
  }, x.pms), /*#__PURE__*/React.createElement("td", {
    style: cell
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 120
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--app-text2)',
      marginBottom: 4
    }
  }, x.minutes.toLocaleString(), " / ", x.minutesCap.toLocaleString()), /*#__PURE__*/React.createElement(ProgressBar, {
    value: x.minutes,
    max: x.minutesCap,
    height: 5,
    color: x.minutes / x.minutesCap > 0.85 ? 'var(--mvair-warning)' : 'var(--app-accent)'
  }))), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cell,
      fontWeight: 600
    }
  }, x.mrr ? window.MV.money(x.mrr) : '—'))))))));
}
const cell = {
  padding: 'var(--row) var(--cardpad)',
  fontSize: 13,
  color: 'var(--app-text)',
  borderTop: '1px solid var(--app-border)',
  whiteSpace: 'nowrap'
};
const cellMuted = {
  ...cell,
  color: 'var(--app-text2)'
};

/* ============ BILLING & USAGE ============ */
function Billing() {
  const t = window.MV.tenants;
  const mrr = t.reduce((a, x) => a + x.mrr, 0);
  const minutes = t.reduce((a, x) => a + x.minutes, 0);
  const infraCost = Math.round(minutes * 0.13);
  const margin = Math.round((mrr - infraCost) / (mrr || 1) * 100);
  return /*#__PURE__*/React.createElement(Page, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--gap)'
    }
  }, /*#__PURE__*/React.createElement(MetricStat, {
    icon: S4_I.TrendingUp,
    label: "MRR",
    value: window.MV.money(mrr),
    delta: 9,
    accent: "var(--mvair-success)"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S4_I.Gauge,
    label: "Minutes used (mo)",
    value: minutes.toLocaleString(),
    sub: "across all clinics"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S4_I.CreditCard,
    label: "Infra cost (est.)",
    value: window.MV.money(infraCost),
    sub: "~$0.13/min blended",
    accent: "var(--mvair-warning)"
  }), /*#__PURE__*/React.createElement(MetricStat, {
    icon: S4_I.Sparkles,
    label: "Gross margin",
    value: margin + '%',
    accent: "var(--mvair-accent)"
  })), /*#__PURE__*/React.createElement(Card, {
    pad: false
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px var(--cardpad) 4px'
    }
  }, /*#__PURE__*/React.createElement(SectionTitle, null, "Per-clinic usage & margin")), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ['Clinic', 'Plan', 'Subscription', 'Minutes', 'Infra cost', 'Margin'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: 'left',
      padding: '11px var(--cardpad)',
      fontSize: 10.5,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      color: 'var(--app-text2)',
      whiteSpace: 'nowrap'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, t.map(x => {
    const cost = Math.round(x.minutes * 0.13);
    const m = x.mrr ? Math.round((x.mrr - cost) / x.mrr * 100) : 0;
    return /*#__PURE__*/React.createElement("tr", {
      key: x.id,
      onMouseEnter: e => e.currentTarget.style.background = 'var(--app-hover)',
      onMouseLeave: e => e.currentTarget.style.background = 'transparent'
    }, /*#__PURE__*/React.createElement("td", {
      style: cell
    }, x.name), /*#__PURE__*/React.createElement("td", {
      style: cellMuted
    }, x.plan), /*#__PURE__*/React.createElement("td", {
      style: {
        ...cell,
        fontWeight: 600
      }
    }, x.mrr ? window.MV.money(x.mrr) + '/mo' : 'Trial'), /*#__PURE__*/React.createElement("td", {
      style: cellMuted
    }, x.minutes.toLocaleString()), /*#__PURE__*/React.createElement("td", {
      style: cellMuted
    }, window.MV.money(cost)), /*#__PURE__*/React.createElement("td", {
      style: cell
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        color: m > 50 ? 'var(--mvair-success)' : m > 0 ? 'var(--mvair-warning)' : 'var(--app-muted)'
      }
    }, x.mrr ? m + '%' : '—')));
  }))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(SectionTitle, null, "Pricing note"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: 'var(--app-text2)',
      lineHeight: 1.6
    }
  }, "Flat-fee pricing is almost always cheaper for clinics taking 200+ calls/month \u2014 which is why specialists price flat and absorb the per-minute infra cost. Attractive unit economics require disciplined call length or higher price points justified by deeper PMS integration.")));
}
window.Screens4 = {
  Trust,
  Integrations,
  Config,
  Tenants,
  Billing
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/screens4.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/shell.jsx
try { (() => {
/* MedVoice Command Center — app shell: sidebar, top bar, command palette, notifications.
   Exposes window.Shell. Presentational; state lives in app.jsx. */
const {
  useState,
  useEffect,
  useRef
} = React;
const I = window.MvairIcons;
const UI = window.MvairUI;
const NAV = [{
  section: 'Monitor',
  items: [{
    id: 'overview',
    label: 'Command Center',
    icon: I.LayoutDashboard
  }, {
    id: 'live',
    label: 'Live Monitor',
    icon: I.Radio,
    live: true
  }, {
    id: 'calls',
    label: 'Calls',
    icon: I.PhoneIncoming
  }]
}, {
  section: 'Front desk',
  items: [{
    id: 'appointments',
    label: 'Appointments',
    icon: I.CalendarDays
  }, {
    id: 'leads',
    label: 'Leads',
    icon: I.Users
  }, {
    id: 'emergencies',
    label: 'Emergencies',
    icon: I.Siren,
    alert: true
  }]
}, {
  section: 'Analyze',
  items: [{
    id: 'analytics',
    label: 'Analytics',
    icon: I.BarChart3
  }, {
    id: 'health',
    label: 'System Health',
    icon: I.Activity
  }]
}, {
  section: 'Trust & setup',
  items: [{
    id: 'trust',
    label: 'Trust & Compliance',
    icon: I.ShieldCheck
  }, {
    id: 'integrations',
    label: 'Integrations',
    icon: I.Plug
  }, {
    id: 'config',
    label: 'Aria Configuration',
    icon: I.Settings
  }]
}, {
  section: 'Admin',
  superAdmin: true,
  items: [{
    id: 'tenants',
    label: 'Clinics',
    icon: I.Building2
  }, {
    id: 'billing',
    label: 'Billing & Usage',
    icon: I.CreditCard
  }]
}];
const ROLES = [{
  value: 'front_desk',
  label: 'Front desk',
  home: 'live'
}, {
  value: 'manager',
  label: 'Office manager',
  home: 'overview'
}, {
  value: 'exec',
  label: 'Clinic owner',
  home: 'overview'
}, {
  value: 'super_admin',
  label: 'MVAIR super-admin',
  home: 'tenants'
}];
const ALL_ROUTES = NAV.flatMap(s => s.items.map(it => ({
  ...it,
  section: s.section
})));

/* ---------------- Sidebar ---------------- */
function Sidebar({
  route,
  onNav,
  role,
  collapsed,
  onToggle,
  tenant
}) {
  const isSuper = role === 'super_admin';
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: collapsed ? 64 : 232,
      flex: 'none',
      background: 'var(--app-sidebar)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      transition: 'width .2s',
      borderRight: '1px solid rgba(255,255,255,.06)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: collapsed ? '20px 0' : '20px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      justifyContent: collapsed ? 'center' : 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 9,
      background: 'var(--mvair-primary)',
      display: 'grid',
      placeItems: 'center',
      color: '#fff',
      fontFamily: 'var(--mvair-font-display)',
      fontSize: 18,
      boxShadow: '0 0 0 1px rgba(45,212,191,.35)',
      flex: 'none'
    }
  }, "M"), !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#fff',
      fontSize: 15,
      fontFamily: 'var(--mvair-font-display)',
      lineHeight: 1.1
    }
  }, "MedVoice"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      color: 'var(--mvair-on-dark-dim)',
      letterSpacing: '.04em'
    }
  }, "Command Center"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '6px 10px'
    }
  }, NAV.filter(s => !s.superAdmin || isSuper).map(s => /*#__PURE__*/React.createElement("div", {
    key: s.section,
    style: {
      marginBottom: 16
    }
  }, !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 10px 6px',
      fontSize: 10.5,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      color: 'var(--mvair-on-dark-dim)'
    }
  }, s.section), s.items.map(it => {
    const on = route === it.id;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => onNav(it.id),
      title: collapsed ? it.label : undefined,
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: collapsed ? '9px 0' : '9px 10px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        border: 'none',
        cursor: 'pointer',
        borderRadius: 9,
        marginBottom: 2,
        fontSize: 13.5,
        fontWeight: 500,
        position: 'relative',
        background: on ? 'rgb(45 212 191 / .16)' : 'transparent',
        color: on ? '#fff' : 'var(--mvair-on-dark-muted)'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = 'rgba(255,255,255,.05)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        top: 8,
        bottom: 8,
        width: 3,
        borderRadius: 3,
        background: 'var(--mvair-accent)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'flex'
      }
    }, /*#__PURE__*/React.createElement(it.icon, {
      size: 17,
      color: it.live ? 'var(--mvair-signal)' : it.alert && !on ? 'var(--mvair-warning)' : 'currentColor'
    }), it.live && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 6,
        height: 6,
        borderRadius: 999,
        background: 'var(--mvair-signal)',
        animation: 'mv-live 1.6s infinite'
      }
    })), !collapsed && /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        textAlign: 'left'
      }
    }, it.label), !collapsed && it.id === 'emergencies' && /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 18,
        height: 18,
        padding: '0 5px',
        borderRadius: 999,
        background: 'var(--mvair-danger)',
        color: '#fff',
        fontSize: 10.5,
        fontWeight: 700,
        display: 'grid',
        placeItems: 'center'
      }
    }, "1"));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      borderTop: '1px solid rgba(255,255,255,.08)'
    }
  }, !collapsed && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,.04)',
      border: '1px solid rgba(255,255,255,.08)',
      borderRadius: 9,
      padding: '9px 11px',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#fff',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, tenant.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--mvair-on-dark-muted)',
      marginTop: 2
    }
  }, tenant.plan, " \xB7 Tier ", tenant.tier)), /*#__PURE__*/React.createElement("button", {
    onClick: onToggle,
    title: "Collapse",
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '8px',
      border: 'none',
      background: 'transparent',
      color: 'var(--mvair-on-dark-muted)',
      cursor: 'pointer',
      borderRadius: 8,
      fontSize: 12.5
    }
  }, collapsed ? /*#__PURE__*/React.createElement(I.ChevronRight, {
    size: 16
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(I.PanelLeft, {
    size: 15
  }), " Collapse"))));
}

/* ---------------- Tenant switcher (super-admin) ---------------- */
function TenantSwitcher({
  tenant,
  tenants,
  onPick
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '7px 11px',
      borderRadius: 9,
      border: '1px solid var(--app-border)',
      background: 'var(--app-card)',
      cursor: 'pointer',
      color: 'var(--app-text)'
    }
  }, /*#__PURE__*/React.createElement(I.Building2, {
    size: 15,
    color: "var(--app-accent)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      maxWidth: 180,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, tenant.name), /*#__PURE__*/React.createElement(I.ChevronDown, {
    size: 14,
    color: "var(--app-muted)"
  })), open && /*#__PURE__*/React.createElement("div", {
    className: "mv-anim",
    style: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      left: 0,
      width: 300,
      background: 'var(--app-elevated)',
      border: '1px solid var(--app-border)',
      borderRadius: 12,
      boxShadow: 'var(--app-shadow-pop)',
      padding: 6,
      zIndex: 60
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '.06em',
      color: 'var(--app-muted)',
      padding: '8px 10px 6px'
    }
  }, "Switch clinic"), tenants.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => {
      onPick(t);
      setOpen(false);
    },
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '9px 10px',
      border: 'none',
      background: t.id === tenant.id ? 'var(--app-hover)' : 'transparent',
      cursor: 'pointer',
      borderRadius: 8,
      textAlign: 'left'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--app-hover)',
    onMouseLeave: e => e.currentTarget.style.background = t.id === tenant.id ? 'var(--app-hover)' : 'transparent'
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      background: 'var(--app-accent-soft)',
      color: 'var(--app-accent)',
      display: 'grid',
      placeItems: 'center',
      flex: 'none',
      fontWeight: 700,
      fontSize: 13
    }
  }, t.name[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--app-text)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: 'var(--app-muted)'
    }
  }, t.niche, " \xB7 ", t.city)), /*#__PURE__*/React.createElement(UI.StatusPill, {
    status: t.status,
    dot: true
  })))));
}

/* ---------------- Top bar ---------------- */
function TopBar({
  title,
  role,
  onRole,
  tenant,
  tenants,
  onTenant,
  theme,
  onTheme,
  density,
  onDensity,
  onOpenPalette,
  onOpenNotif,
  unread,
  range,
  onRange
}) {
  const isSuper = role === 'super_admin';
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '11px var(--pad)',
      flexWrap: 'nowrap',
      overflow: 'hidden',
      background: 'color-mix(in srgb, var(--app-bg) 86%, transparent)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--app-border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 19,
      fontWeight: 600,
      fontFamily: 'var(--mvair-font-display)',
      letterSpacing: '-.01em',
      color: 'var(--app-text)',
      whiteSpace: 'nowrap'
    }
  }, title)), isSuper && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(TenantSwitcher, {
    tenant: tenant,
    tenants: tenants,
    onPick: onTenant
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginLeft: 'auto',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    title: "Data freshness",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 10px',
      borderRadius: 999,
      background: 'color-mix(in srgb, var(--mvair-success) 12%, transparent)',
      color: 'var(--mvair-success)',
      fontSize: 12,
      fontWeight: 600,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: 'var(--mvair-success)',
      animation: 'mv-live 1.8s infinite',
      flex: 'none'
    }
  }), " Live \xB7 ", window.MV.compliance.dataAsOf), /*#__PURE__*/React.createElement("span", {
    title: "All numbers reconcile to a certified dataset",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 10px',
      borderRadius: 999,
      background: 'var(--app-accent-soft)',
      color: 'var(--app-accent)',
      fontSize: 12,
      fontWeight: 600,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(I.ShieldCheck, {
    size: 13
  }), " Certified")), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenPalette,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      borderRadius: 9,
      border: '1px solid var(--app-border)',
      background: 'var(--app-card)',
      color: 'var(--app-muted)',
      cursor: 'pointer',
      fontSize: 13,
      flexShrink: 0,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement(I.Search, {
    size: 15
  }), " ", /*#__PURE__*/React.createElement("span", null, "Search\u2026"), " ", /*#__PURE__*/React.createElement(UI.Kbd, null, "\u2318K")), /*#__PURE__*/React.createElement(UI.Select, {
    value: range,
    onChange: onRange,
    width: 130,
    options: [{
      value: 'today',
      label: 'Today'
    }, {
      value: '7d',
      label: 'Last 7 days'
    }, {
      value: '30d',
      label: 'Last 30 days'
    }, {
      value: 'qtd',
      label: 'Quarter to date'
    }]
  }), /*#__PURE__*/React.createElement(UI.IconButton, {
    icon: I.Bell,
    title: "Notifications",
    onClick: onOpenNotif,
    badge: unread || null
  }), /*#__PURE__*/React.createElement(UI.IconButton, {
    icon: theme === 'dark' ? I.Sun : I.Moon,
    title: "Toggle theme",
    onClick: onTheme
  }), /*#__PURE__*/React.createElement(UI.IconButton, {
    icon: density === 'compact' ? I.Maximize : I.ListChecks,
    title: "Toggle density",
    onClick: onDensity
  }), /*#__PURE__*/React.createElement(UI.Select, {
    value: role,
    onChange: onRole,
    width: 150,
    options: ROLES
  }));
}

/* ---------------- Command palette ---------------- */
function CommandPalette({
  open,
  onClose,
  onNav,
  role
}) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  useEffect(() => {
    if (open) {
      setQ('');
      setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
    }
  }, [open]);
  if (!open) return null;
  const isSuper = role === 'super_admin';
  const routes = ALL_ROUTES.filter(r => isSuper || !NAV.find(s => s.superAdmin && s.items.includes(r)));
  const actions = [{
    id: 'test_line',
    label: 'Test the line — place a live call',
    icon: I.PhoneIncoming,
    kind: 'action'
  }, {
    id: 'export',
    label: 'Export current view (CSV)',
    icon: I.Download,
    kind: 'action'
  }, {
    id: 'config',
    label: 'Edit Aria greeting',
    icon: I.Settings,
    kind: 'nav'
  }];
  const all = [...routes.map(r => ({
    id: r.id,
    label: r.label,
    icon: r.icon,
    kind: 'nav',
    section: r.section
  })), ...actions];
  const filtered = all.filter(a => a.label.toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(8,15,18,.5)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '12vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "mv-anim",
    style: {
      width: 'min(620px, 92vw)',
      background: 'var(--app-elevated)',
      border: '1px solid var(--app-border)',
      borderRadius: 14,
      boxShadow: 'var(--app-shadow-pop)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px 16px',
      borderBottom: '1px solid var(--app-border)'
    }
  }, /*#__PURE__*/React.createElement(I.Search, {
    size: 18,
    color: "var(--app-muted)"
  }), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Search screens and actions\u2026",
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontSize: 15,
      color: 'var(--app-text)',
      fontFamily: 'inherit'
    }
  }), /*#__PURE__*/React.createElement(UI.Kbd, null, "esc")), /*#__PURE__*/React.createElement("div", {
    style: {
      maxHeight: 360,
      overflowY: 'auto',
      padding: 8
    }
  }, filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      textAlign: 'center',
      color: 'var(--app-muted)',
      fontSize: 13
    }
  }, "No matches"), filtered.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.id + a.kind,
    onClick: () => {
      if (a.kind === 'nav') onNav(a.id);
      onClose();
    },
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 12px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      borderRadius: 9,
      textAlign: 'left'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--app-hover)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 8,
      display: 'grid',
      placeItems: 'center',
      background: 'var(--app-accent-soft)',
      color: 'var(--app-accent)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(a.icon, {
    size: 15
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 14,
      color: 'var(--app-text)'
    }
  }, a.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--app-muted)'
    }
  }, a.kind === 'action' ? 'Action' : a.section))))));
}

/* ---------------- Notifications drawer ---------------- */
const notifIcon = {
  emergency: I.Siren,
  warning: I.AlertTriangle,
  success: I.CheckCircle,
  info: I.Info2
};
const notifColor = {
  emergency: 'var(--mvair-danger)',
  warning: 'var(--mvair-warning)',
  success: 'var(--mvair-success)',
  info: 'var(--mvair-primary)'
};
function NotificationsDrawer({
  open,
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 90,
      background: 'rgba(8,15,18,.4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      height: '100%',
      width: 'min(400px, 92vw)',
      background: 'var(--app-elevated)',
      borderLeft: '1px solid var(--app-border)',
      boxShadow: 'var(--app-shadow-pop)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'mv-pop .2s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 18px',
      borderBottom: '1px solid var(--app-border)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--app-text)'
    }
  }, "Notifications"), /*#__PURE__*/React.createElement(UI.IconButton, {
    icon: I.X,
    onClick: onClose,
    title: "Close"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 12
    }
  }, window.MV.notifications.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    style: {
      display: 'flex',
      gap: 12,
      padding: 12,
      borderRadius: 10,
      marginBottom: 6,
      background: n.unread ? 'var(--app-hover)' : 'transparent',
      border: '1px solid var(--app-border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      flex: 'none',
      display: 'grid',
      placeItems: 'center',
      background: `color-mix(in srgb, ${notifColor[n.kind]} 14%, transparent)`,
      color: notifColor[n.kind]
    }
  }, React.createElement(notifIcon[n.kind], {
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      color: 'var(--app-text)'
    }
  }, n.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--app-muted)',
      flex: 'none'
    }
  }, n.when)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'var(--app-text2)',
      marginTop: 2
    }
  }, n.body)))))));
}
window.Shell = {
  NAV,
  ROLES,
  ALL_ROUTES,
  Sidebar,
  TopBar,
  CommandPalette,
  NotificationsDrawer
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Landing.jsx
try { (() => {
/* MVAIR marketing landing — faithful recreation of src/marketing.
   Uses DS components (MvairLogo, MvairMark, CTAButton) from the bundle. */
const {
  MvairMark,
  MvairLogo,
  CTAButton
} = window.MVAIRDesignSystem_49370a;
const {
  Phone,
  UserPlus,
  CalendarCheck,
  AlertTriangle,
  MonitorSmartphone,
  Check
} = window.MvairIcons;
const T = {
  primary: 'var(--mvair-primary)',
  accent: 'var(--mvair-accent)',
  dark: 'var(--mvair-dark)',
  text: 'var(--mvair-text-primary)',
  text2: 'var(--mvair-text-secondary)',
  onDark: 'var(--mvair-on-dark)',
  page: 'var(--mvair-surface)',
  cardBorder: 'var(--mvair-card-border)',
  serif: 'var(--mvair-font-display)',
  sans: 'var(--mvair-font-sans)'
};
function Eyebrow({
  children,
  tone = 'primary'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      textTransform: 'uppercase',
      letterSpacing: '.16em',
      fontSize: 13,
      fontWeight: 600,
      color: tone === 'accent' ? T.accent : T.primary,
      marginBottom: 18
    }
  }, children);
}

/* ---------- Nav ---------- */
function Nav() {
  const links = [['#product', 'Product'], ['#how', 'How it works'], ['#listen', 'Hear it'], ['#security', 'Security']];
  return /*#__PURE__*/React.createElement("nav", {
    className: "m-nav",
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      borderBottom: '1px solid var(--mvair-hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      height: 74,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(MvairLogo, {
    tone: "petrol",
    size: 30
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 38
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 30
    }
  }, links.map(([h, l]) => /*#__PURE__*/React.createElement("a", {
    key: h,
    href: h,
    style: {
      fontSize: 15,
      fontWeight: 500,
      color: T.text2
    }
  }, l))), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: T.text2
    }
  }, "Sign in"), /*#__PURE__*/React.createElement(CTAButton, {
    href: "#demo",
    variant: "petrol",
    size: "sm"
  }, "Book a demo"))));
}

/* ---------- Hero ---------- */
const BARS = [18, 30, 44, 26, 58, 74, 40, 90, 54, 98, 62, 38, 76, 46, 28, 20, 34, 22];
function HeroVisual() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      height: 132,
      flex: 1,
      minWidth: 0
    }
  }, BARS.map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "m-wave-bar",
    style: {
      width: 5,
      borderRadius: 3,
      background: T.accent,
      height: h,
      animationDelay: `${i * 0.08}s`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 1,
      background: 'rgba(255,255,255,.18)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "m-flow-dot",
    style: {
      width: 9,
      height: 9,
      borderRadius: 999,
      background: 'var(--mvair-signal)',
      boxShadow: '0 0 12px rgba(198,242,78,.6)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 1,
      background: 'rgba(255,255,255,.18)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      width: 268,
      background: 'rgba(255,255,255,.045)',
      border: '1px solid rgba(255,255,255,.12)',
      borderRadius: 16,
      padding: '22px 22px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: T.accent
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textTransform: 'uppercase',
      letterSpacing: '.15em',
      fontSize: 11,
      fontWeight: 600,
      color: T.accent
    }
  }, "Appointment booked")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: T.serif,
      fontWeight: 500,
      fontSize: 30,
      color: '#fff',
      letterSpacing: '-.02em',
      lineHeight: 1.1
    }
  }, "Tue \xB7 9:30 am"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: T.onDark,
      marginTop: 6
    }
  }, "New patient visit \xB7 Dr. Reyes"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'rgba(255,255,255,.1)',
      margin: '18px 0 14px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 999,
      background: T.accent,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Check, {
    size: 11,
    color: "var(--mvair-on-accent)",
    strokeWidth: 2.6
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: T.onDark
    }
  }, "Confirmed and added to the calendar"))));
}
function Hero() {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      background: T.dark,
      color: '#fff',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap hero-grid",
    style: {
      paddingTop: 104,
      paddingBottom: 96,
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: 64,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "accent"
  }, "AI voice receptionist for medical practices"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: T.serif,
      fontWeight: 600,
      fontSize: 62,
      lineHeight: 1.04,
      letterSpacing: '-.025em',
      margin: '0 0 24px',
      color: '#fff'
    }
  }, "24/7 booking and triage that sounds ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      fontWeight: 500,
      color: T.accent
    }
  }, "human"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 19,
      lineHeight: 1.6,
      color: T.onDark,
      margin: '0 0 36px',
      maxWidth: 480
    }
  }, "MVAIR answers every call, books the appointment, and flags urgent cases \u2014 day or night, without a human at the desk."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement(CTAButton, {
    href: "#demo",
    variant: "aqua",
    size: "lg"
  }, "Book a demo"), /*#__PURE__*/React.createElement(CTAButton, {
    href: "#listen",
    variant: "ghost",
    size: "lg"
  }, "See it in action")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 9,
      height: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-pulse-ring",
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 999,
      background: 'var(--mvair-signal)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 999,
      background: 'var(--mvair-signal)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--mvair-on-dark-muted)',
      letterSpacing: '.02em'
    }
  }, "Live \xB7 always answering"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,.02)',
      border: '1px solid rgba(255,255,255,.08)',
      borderRadius: 22,
      padding: '38px 34px'
    }
  }, /*#__PURE__*/React.createElement(HeroVisual, null))));
}

/* ---------- How it works ---------- */
function HowItWorks() {
  const steps = [['01', Phone, 'Answers the call', 'Picks up on the first ring, around the clock, in a calm and natural voice.'], ['02', UserPlus, 'Understands the need', "Confirms the caller's name, the reason for their visit, and how urgent it is — then routes accordingly."], ['03', CalendarCheck, 'Books or triages', 'Schedules the visit, or escalates the urgent ones to the right person.']];
  return /*#__PURE__*/React.createElement("section", {
    id: "how",
    style: {
      padding: '118px 0 110px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 620,
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "How it works"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: T.serif,
      fontWeight: 600,
      fontSize: 42,
      lineHeight: 1.1,
      letterSpacing: '-.02em',
      margin: 0,
      color: T.text
    }
  }, "Every call handled, start to finish.")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-connector connector",
    style: {
      position: 'absolute',
      top: 27,
      left: '16.66%',
      right: '16.66%',
      height: 2,
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "steps-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 30,
      position: 'relative',
      zIndex: 1
    }
  }, steps.map(([n, Icon, title, body]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-step-badge",
    style: {
      width: 54,
      height: 54,
      borderRadius: 999,
      background: T.primary,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: T.serif,
      fontSize: 21,
      fontWeight: 600,
      border: '4px solid var(--mvair-surface)'
    }
  }, n)), /*#__PURE__*/React.createElement("div", {
    className: "m-card",
    style: {
      width: '100%',
      background: '#fff',
      border: `1px solid ${T.cardBorder}`,
      borderRadius: 18,
      padding: '30px 28px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 42,
      height: 42,
      borderRadius: 12,
      background: 'var(--mvair-chip-teal-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    size: 22,
    color: "var(--mvair-chip-teal-stroke)",
    strokeWidth: 1.8
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: T.serif,
      fontWeight: 600,
      fontSize: 23,
      letterSpacing: '-.01em',
      margin: '0 0 9px',
      color: T.text
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.6,
      color: T.text2,
      margin: 0
    }
  }, body))))))));
}

/* ---------- Listen (transcript) ---------- */
const TRANSCRIPT = [['aria', "Valley Medical, this is Aria. How can I help you today?"], ['patient', "Hi, I'd like to book an appointment. I've been having persistent headaches."], ['aria', "I'm sorry to hear that — let's get you seen. Can I get your name and a callback number?"], ['patient', "Emma Thompson. 604-555-0505."], ['aria', "Thanks Emma. I'm checking Tuesday at 9:30 AM with Dr. Chen…"], ['aria', "That slot is open. Shall I book it for you?"], ['patient', "Yes please, Tuesday morning works."], ['aria', "Done — you're booked Tuesday the 24th at 9:30 AM. You'll get a confirmation. Anything else?"], ['patient', "No, that's great. Thank you!"]];
function Bubble({
  role,
  text
}) {
  const isAria = role === 'aria';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexDirection: isAria ? 'row' : 'row-reverse'
    }
  }, isAria && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      width: 28,
      height: 28,
      borderRadius: 999,
      background: T.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 10,
      fontWeight: 700,
      color: '#fff',
      marginTop: 2
    }
  }, "A"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: '78%',
      padding: '10px 16px',
      borderRadius: 16,
      fontSize: 15,
      lineHeight: 1.55,
      background: isAria ? '#fff' : T.primary,
      color: isAria ? T.text : '#fff',
      border: isAria ? `1px solid ${T.cardBorder}` : 'none',
      borderTopLeftRadius: isAria ? 4 : 16,
      borderTopRightRadius: isAria ? 16 : 4
    }
  }, text));
}
function Listen() {
  return /*#__PURE__*/React.createElement("section", {
    id: "listen",
    style: {
      padding: '110px 0 118px',
      background: T.page
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap two-col",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Hear it in action"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: T.serif,
      fontWeight: 600,
      fontSize: 42,
      lineHeight: 1.1,
      letterSpacing: '-.02em',
      margin: '0 0 20px',
      color: T.text
    }
  }, "A real booking in under 90 seconds."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.65,
      color: T.text2,
      marginBottom: 32,
      maxWidth: 440
    }
  }, "This is an actual call flow \u2014 not a script, not pre-recorded. Aria listens, checks availability on the clinic's calendar, and writes the appointment in real time."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      borderRadius: 16,
      background: 'rgba(12,26,32,.05)',
      border: `1px solid ${T.cardBorder}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      width: 36,
      height: 36,
      borderRadius: 12,
      background: 'rgb(var(--mvair-primary-rgb)/.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(CalendarCheck, {
    size: 16,
    color: T.primary,
    strokeWidth: 2
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      fontWeight: 600,
      color: T.text
    }
  }, "Hear it on a live call"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: T.text2
    }
  }, "Book a 20-minute demo and we'll run the call together.")), /*#__PURE__*/React.createElement("a", {
    href: "#demo",
    style: {
      marginLeft: 'auto',
      flex: 'none',
      padding: '6px 14px',
      borderRadius: 8,
      background: T.primary,
      color: '#fff',
      fontSize: 13,
      fontWeight: 600
    }
  }, "Book demo"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: `1px solid ${T.cardBorder}`,
      borderRadius: 24,
      boxShadow: '0 1px 2px rgba(14,27,35,.04)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px',
      borderBottom: `1px solid ${T.cardBorder}`,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 999,
      background: '#FF5F57'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 999,
      background: '#FEBC2E'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 12,
      height: 12,
      borderRadius: 999,
      background: '#28C840'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontSize: 12,
      color: 'var(--mvair-text-muted)',
      fontWeight: 500
    }
  }, "Inbound call \xB7 +1 (856) 440-2211")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      maxHeight: 380,
      overflowY: 'auto'
    }
  }, TRANSCRIPT.map((t, i) => /*#__PURE__*/React.createElement(Bubble, {
    key: i,
    role: t[0],
    text: t[1]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 8,
      padding: '10px 16px',
      background: '#F0FDF4',
      border: '1px solid #BBF7D0',
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement(Check, {
    size: 16,
    color: "#16A34A",
    strokeWidth: 2.5
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: '#15803D'
    }
  }, "Appointment booked \xB7 Google Calendar updated"))))));
}

/* ---------- Features ---------- */
const FBARS = [40, 72, 100, 58, 84, 34, 50];
function FeatureCard({
  Icon,
  chip,
  title,
  body
}) {
  const chipBg = chip === 'danger' ? 'var(--mvair-chip-danger-bg)' : 'var(--mvair-chip-teal-bg)';
  const chipStroke = chip === 'danger' ? 'var(--mvair-danger)' : 'var(--mvair-chip-teal-stroke)';
  return /*#__PURE__*/React.createElement("div", {
    className: "m-card",
    style: {
      background: '#fff',
      border: `1px solid ${T.cardBorder}`,
      borderRadius: 20,
      padding: '36px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      borderRadius: 13,
      background: chipBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    size: 23,
    color: chipStroke,
    strokeWidth: 1.8
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: T.serif,
      fontWeight: 600,
      fontSize: 23,
      letterSpacing: '-.01em',
      margin: '0 0 11px',
      color: T.text
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15.5,
      lineHeight: 1.62,
      color: T.text2,
      margin: 0
    }
  }, body));
}
function Features() {
  return /*#__PURE__*/React.createElement("section", {
    id: "product",
    style: {
      paddingBottom: 118
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 620,
      marginBottom: 60
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "What it does"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: T.serif,
      fontWeight: 600,
      fontSize: 42,
      lineHeight: 1.1,
      letterSpacing: '-.02em',
      margin: 0,
      color: T.text
    }
  }, "Built for the realities of a front desk.")), /*#__PURE__*/React.createElement("div", {
    className: "features-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridAutoRows: '1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-dark-tile span2",
    style: {
      gridColumn: 'span 2',
      position: 'relative',
      overflow: 'hidden',
      background: T.dark,
      border: '1px solid var(--mvair-dark-border)',
      borderRadius: 20,
      padding: '42px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-glow",
    style: {
      position: 'absolute',
      right: -40,
      top: -30,
      width: 240,
      height: 240,
      borderRadius: 999,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 4,
      height: 48,
      marginBottom: 24
    }
  }, FBARS.map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 5,
      borderRadius: 3,
      background: i === 4 ? 'var(--mvair-accent-hover)' : T.accent,
      height: `${h}%`
    }
  }))), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: T.serif,
      fontWeight: 600,
      fontSize: 30,
      letterSpacing: '-.015em',
      margin: '0 0 12px',
      color: '#fff',
      maxWidth: 460
    }
  }, "A voice that sounds ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: T.accent
    }
  }, "human")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16.5,
      lineHeight: 1.65,
      color: T.onDark,
      margin: 0,
      maxWidth: 440
    }
  }, "Natural pacing, real listening, and no robotic menus. Patients talk the way they would to your front desk \u2014 and never feel handed off to a machine."))), /*#__PURE__*/React.createElement(FeatureCard, {
    Icon: CalendarCheck,
    chip: "teal",
    title: "Appointment booking",
    body: "Finds the right slot, confirms the details, and writes it back to your schedule \u2014 no callback required."
  }), /*#__PURE__*/React.createElement(FeatureCard, {
    Icon: AlertTriangle,
    chip: "danger",
    title: "Emergency detection",
    body: "Recognizes urgent language and escalates the call to your team's protocol \u2014 quickly and correctly."
  }), /*#__PURE__*/React.createElement("div", {
    className: "m-card span2",
    style: {
      gridColumn: 'span 2',
      background: '#fff',
      border: `1px solid ${T.cardBorder}`,
      borderRadius: 20,
      padding: 36,
      display: 'flex',
      alignItems: 'center',
      gap: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 'none',
      width: 46,
      height: 46,
      borderRadius: 13,
      background: 'var(--mvair-chip-teal-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(MonitorSmartphone, {
    size: 23,
    color: "var(--mvair-chip-teal-stroke)",
    strokeWidth: 1.8
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: T.serif,
      fontWeight: 600,
      fontSize: 23,
      letterSpacing: '-.01em',
      margin: '0 0 9px',
      color: T.text
    }
  }, "Every call, documented"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15.5,
      lineHeight: 1.62,
      color: T.text2,
      margin: 0,
      maxWidth: 520
    }
  }, "Session transcript, patient details, and booking status logged automatically \u2014 no manual entry, no gaps, no calls lost to voicemail."))))));
}

/* ---------- Reassurance ---------- */
function Reassurance() {
  const items = [['Always on', 'Answers nights, weekends, and overflow — so no call ever goes to voicemail.'], ['HIPAA pathway', 'A signed Business Associate Agreement is required before any live patient traffic. We are transparent about that gate and prepared to move through it with you.'], ['Your protocols', 'Follows the booking rules, emergency escalation paths, and business hours your practice already uses.']];
  return /*#__PURE__*/React.createElement("section", {
    id: "security",
    style: {
      paddingBottom: 120
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-panel",
    style: {
      background: '#fff',
      border: `1px solid ${T.cardBorder}`,
      borderRadius: 24,
      padding: '72px 64px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 680,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Reliability & privacy"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: T.serif,
      fontWeight: 600,
      fontSize: 38,
      lineHeight: 1.14,
      letterSpacing: '-.02em',
      margin: '0 0 18px',
      color: T.text
    }
  }, "Designed for clinical workflows, with patient privacy in mind."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: 1.65,
      color: T.text2,
      margin: 0
    }
  }, "MVAIR is built to be dependable when your practice is closed and busy when it's open \u2014 with careful handling of the conversations it has on your behalf.")), /*#__PURE__*/React.createElement("div", {
    className: "three-col",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 40,
      marginTop: 56,
      paddingTop: 48,
      borderTop: '1px solid var(--mvair-hairline)'
    }
  }, items.map(([title, body]) => /*#__PURE__*/React.createElement("div", {
    key: title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      width: 24,
      height: 24,
      borderRadius: 999,
      background: 'var(--mvair-chip-teal-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Check, {
    size: 13,
    color: "var(--mvair-chip-teal-stroke)",
    strokeWidth: 2.6
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: T.serif,
      fontWeight: 600,
      fontSize: 19,
      margin: 0,
      color: T.text
    }
  }, title)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      lineHeight: 1.6,
      color: T.text2,
      margin: 0
    }
  }, body)))))));
}

/* ---------- Closing CTA + Footer ---------- */
function ClosingCTA() {
  return /*#__PURE__*/React.createElement("section", {
    id: "demo",
    style: {
      background: T.dark,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 104,
      paddingBottom: 100,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: T.serif,
      fontWeight: 600,
      fontSize: 50,
      lineHeight: 1.06,
      letterSpacing: '-.025em',
      margin: '0 auto 20px',
      color: '#fff',
      maxWidth: 620
    }
  }, "Bring MVAIR to your front desk."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 19,
      lineHeight: 1.6,
      color: T.onDark,
      margin: '0 auto 36px',
      maxWidth: 480
    }
  }, "Book a 20-minute demo. We'll run a live call together \u2014 you'll see it answer, book, and document in real time."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      gap: 14,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement(CTAButton, {
    href: "#book",
    variant: "aqua",
    size: "lg"
  }, "Book a demo"), /*#__PURE__*/React.createElement(CTAButton, {
    href: "#",
    variant: "ghost",
    size: "lg"
  }, "Send us a message")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--mvair-on-dark-dim)'
    }
  }, "No commitment. 20 minutes. We'll call the line live with you.")));
}
function Footer() {
  const cols = [['Product', [['#product', 'What it does'], ['#how', 'How it works'], ['#listen', 'See it in action']]], ['Company', [['#security', 'Privacy & reliability'], ['#demo', 'Book a demo'], ['#', 'Contact']]]];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: T.dark,
      color: '#fff',
      borderTop: '1px solid rgba(255,255,255,.08)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap footer-grid",
    style: {
      paddingTop: 64,
      paddingBottom: 56,
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(MvairLogo, {
    tone: "aqua",
    size: 28
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textTransform: 'uppercase',
      letterSpacing: '.18em',
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--mvair-on-dark-dim)',
      marginTop: 16
    }
  }, "Medical voice AI receptionist")), cols.map(([title, links]) => /*#__PURE__*/React.createElement("div", {
    key: title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--mvair-on-dark-muted)',
      marginBottom: 16
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 11
    }
  }, links.map(([h, l]) => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: h,
    style: {
      fontSize: 15,
      color: '#C9D6DA'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--mvair-on-dark-muted)',
      marginBottom: 16
    }
  }, "Get started"), /*#__PURE__*/React.createElement(CTAButton, {
    href: "#book",
    variant: "aqua",
    size: "sm"
  }, "Book a demo"))), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      paddingBottom: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,.08)',
      paddingTop: 24,
      display: 'flex',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--mvair-on-dark-dim)',
      maxWidth: 560,
      lineHeight: 1.6
    }
  }, "MVAIR is built with patient privacy in mind and is not a substitute for emergency care. If this is a medical emergency, call your local emergency number."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--mvair-on-dark-dim)'
    }
  }, "\xA9 2026 MVAIR"))));
}
window.MvairLanding = function MvairLanding() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: T.sans,
      color: T.text,
      background: T.page
    }
  }, /*#__PURE__*/React.createElement(Nav, null), /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(HowItWorks, null), /*#__PURE__*/React.createElement(Listen, null), /*#__PURE__*/React.createElement(Features, null), /*#__PURE__*/React.createElement(Reassurance, null), /*#__PURE__*/React.createElement(ClosingCTA, null), /*#__PURE__*/React.createElement(Footer, null));
};
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(window.MvairLanding, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Landing.jsx", error: String((e && e.message) || e) }); }

__ds_ns.CTAButton = __ds_scope.CTAButton;

__ds_ns.MvairMark = __ds_scope.MvairMark;

__ds_ns.MvairLogo = __ds_scope.MvairLogo;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatusDot = __ds_scope.StatusDot;

__ds_ns.ChannelBadge = __ds_scope.ChannelBadge;

__ds_ns.KPICard = __ds_scope.KPICard;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Input = __ds_scope.Input;

})();
