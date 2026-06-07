/* ============================================================
   Sweet & Salao — Owner Portal (admin)
   Finesse Media build. Brand-aligned, professional, friendly.
   ============================================================ */
:root {
  --pink: #ff2e88;
  --pink-deep: #d81b6a;
  --lime: #b6e021;
  --lime-deep: #7fa600;
  --turq: #16c2c2;
  --turq-deep: #0c8f8f;
  --sun: #ffc01e;
  --grape: #6b2d8f;
  --ink: #2a1430;
  --ink-soft: #6a5566;
  --cream: #fff6ec;
  --paper: #ffffff;
  --line: #ece0d4;
  --line-strong: #ddc9b8;
  --ok: #2a9d5c;
  --warn: #d8861b;
  --shadow-sm: 0 4px 14px rgba(122, 28, 92, 0.08);
  --shadow: 0 18px 44px rgba(122, 28, 92, 0.14);
  --radius: 18px;
  --radius-sm: 12px;
  --display: "Fraunces", Georgia, serif;
  --body: "Outfit", ui-sans-serif, system-ui, sans-serif;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0; font-family: var(--body); color: var(--ink);
  background: var(--cream);
  background-image:
    radial-gradient(circle at 8% 4%, rgba(255,46,136,.06), transparent 40%),
    radial-gradient(circle at 92% 2%, rgba(22,194,194,.07), transparent 38%);
  -webkit-font-smoothing: antialiased;
}
h1,h2,h3,h4 { font-family: var(--display); font-weight: 900; margin: 0; line-height: 1.05; }
p { margin: 0; }
img { display: block; max-width: 100%; }
button { font-family: var(--body); cursor: pointer; }
input, textarea, select { font-family: var(--body); }

/* ---------- Buttons ---------- */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-weight: 800; font-size: 14px; padding: 11px 18px; border-radius: 999px;
  border: 2px solid transparent; transition: transform .15s ease, box-shadow .15s ease, filter .15s ease, background .15s;
  white-space: nowrap;
}
.btn:hover { transform: translateY(-1px); }
.btn-primary { background: linear-gradient(135deg, var(--pink), var(--pink-deep)); color: #fff; box-shadow: 0 8px 20px rgba(255,46,136,.3); }
.btn-lime { background: linear-gradient(135deg, var(--lime), var(--lime-deep)); color: var(--ink); box-shadow: 0 8px 20px rgba(140,184,0,.28); }
.btn-ghost { background: var(--paper); color: var(--ink); border-color: var(--line-strong); }
.btn-ghost:hover { border-color: var(--pink); color: var(--pink-deep); }
.btn-danger { background: #fff; color: var(--pink-deep); border-color: #f3c6d8; }
.btn-danger:hover { background: var(--pink-deep); color: #fff; border-color: var(--pink-deep); }
.btn-sm { padding: 8px 13px; font-size: 13px; }
.btn-block { width: 100%; }

/* ---------- Login screen ---------- */
.login-wrap {
  min-height: 100vh; display: grid; place-items: center; padding: 24px;
  background:
    radial-gradient(circle at 12% 18%, rgba(255,46,136,.55), transparent 45%),
    radial-gradient(circle at 85% 12%, rgba(182,224,33,.45), transparent 42%),
    radial-gradient(circle at 78% 82%, rgba(22,194,194,.5), transparent 45%),
    radial-gradient(circle at 22% 85%, rgba(255,192,30,.4), transparent 45%),
    linear-gradient(135deg, #6b2d8f 0%, #1c2640 38%, #6b2d8f 64%, #d81b6a 100%);
  background-attachment: fixed;
}
.login-back {
  display: inline-block; margin-top: 16px; font-size: 13.5px; font-weight: 700;
  color: var(--ink-soft); text-decoration: none; transition: color .15s;
}
.login-back:hover { color: var(--pink-deep); }
.login-card {
  width: min(440px, 100%); background: var(--paper); border-radius: 26px;
  box-shadow: var(--shadow); padding: 40px 34px; text-align: center; border: 1px solid var(--line);
}
.login-logo { height: 120px; margin: 0 auto 18px; filter: drop-shadow(0 8px 18px rgba(122,28,92,.18)); }
.login-card .eyebrow { color: var(--pink); letter-spacing: .22em; text-transform: uppercase; font-size: 11.5px; font-weight: 800; }
.login-card h1 { font-size: 30px; margin: 6px 0 22px; }
.login-card input {
  width: 100%; padding: 14px 16px; border-radius: var(--radius-sm); border: 2px solid var(--line-strong);
  font-size: 15px; background: var(--cream); margin-bottom: 12px; transition: border-color .15s;
}
.login-card input:focus { outline: none; border-color: var(--turq); background: #fff; }
.login-hint { font-size: 12.5px; color: var(--ink-soft); margin-top: 14px; line-height: 1.5; }
.login-hint.err { color: var(--pink-deep); font-weight: 700; }

/* ---------- Top bar ---------- */
.topbar {
  position: sticky; top: 0; z-index: 30; display: flex; align-items: center; gap: 16px;
  background: rgba(255,246,236,.9); backdrop-filter: blur(12px) saturate(1.2);
  border-bottom: 1px solid var(--line); padding: 12px clamp(16px, 3vw, 32px);
}
.topbar-logo { height: 42px; }
.topbar-title { display: flex; flex-direction: column; line-height: 1.1; }
.topbar-title strong { font-family: var(--display); font-weight: 900; font-size: 18px; }
.topbar-title span { font-size: 11px; color: var(--ink-soft); letter-spacing: .14em; text-transform: uppercase; }
.topbar-spacer { flex: 1; }
.save-pill {
  font-size: 12.5px; font-weight: 800; padding: 7px 14px; border-radius: 999px;
  background: #eef7e1; color: var(--lime-deep); border: 1px solid #d6ecb0; white-space: nowrap;
}
.save-pill.unsaved { background: #fdf1dd; color: var(--warn); border-color: #f4dcae; }
.save-pill.saved { background: #e3f6ec; color: var(--ok); border-color: #b9e6cd; }
.save-pill.error { background: #fde3ec; color: var(--pink-deep); border-color: #f4c2d6; }

/* ---------- Language toggle ---------- */
.lang-toggle { display: inline-flex; background: var(--paper); border: 2px solid var(--line-strong); border-radius: 999px; overflow: hidden; }
.lang-toggle button { border: none; background: transparent; padding: 6px 14px; font-weight: 800; font-size: 13px; color: var(--ink-soft); transition: all .15s; }
.lang-toggle button.active { background: var(--ink); color: #fff; }

/* ---------- Layout ---------- */
.shell { display: grid; grid-template-columns: 230px 1fr; gap: 0; min-height: calc(100vh - 67px); }
.sidebar { padding: 22px 16px; border-right: 1px solid var(--line); position: sticky; top: 67px; align-self: start; height: calc(100vh - 67px); }
.sidebar nav { display: flex; flex-direction: column; gap: 4px; }
.sidebar nav a {
  display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 12px;
  text-decoration: none; color: var(--ink); font-weight: 700; font-size: 14.5px; transition: background .15s, color .15s;
}
.sidebar nav a:hover { background: #fff; }
.sidebar nav a.active { background: linear-gradient(135deg, var(--pink), var(--pink-deep)); color: #fff; box-shadow: 0 6px 16px rgba(255,46,136,.28); }
.sidebar nav a .ico { width: 20px; text-align: center; }
.sidebar-foot { margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 8px; }

.main { padding: clamp(20px, 3vw, 40px); max-width: 1080px; }
.page-head { margin-bottom: 24px; }
.page-head .eyebrow { color: var(--pink); letter-spacing: .2em; text-transform: uppercase; font-size: 11.5px; font-weight: 800; }
.page-head h2 { font-size: clamp(28px, 4vw, 40px); margin-top: 4px; }
.page-head p { color: var(--ink-soft); margin-top: 6px; font-size: 15px; }

/* ---------- Cards / panels ---------- */
.panel { background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow-sm); margin-bottom: 22px; scroll-margin-top: 80px; }
.panel-head { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
.panel-head h3 { font-size: 21px; }
.panel-head .ico { font-size: 20px; }
.panel-head .spacer { flex: 1; }

/* ---------- Form fields with labels + tooltips ---------- */
.field { margin-bottom: 16px; }
.field:last-child { margin-bottom: 0; }
.field-label { display: flex; align-items: center; gap: 7px; font-weight: 700; font-size: 13.5px; margin-bottom: 6px; color: var(--ink); }
.field input, .field textarea, .field select {
  width: 100%; padding: 12px 14px; border-radius: var(--radius-sm); border: 2px solid var(--line-strong);
  font-size: 14.5px; background: var(--cream); color: var(--ink); transition: border-color .15s, background .15s;
}
.field input:focus, .field textarea:focus, .field select:focus { outline: none; border-color: var(--turq); background: #fff; }
.field textarea { min-height: 80px; resize: vertical; line-height: 1.5; }
.field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

/* Tooltip (bilingual help) */
.tip { position: relative; display: inline-flex; }
.tip-dot {
  width: 16px; height: 16px; border-radius: 50%; background: var(--turq); color: #fff;
  font-size: 11px; font-weight: 800; display: grid; place-items: center; cursor: help; flex: none;
}
.tip-bubble {
  position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(4px);
  width: max-content; max-width: 260px; background: var(--ink); color: #fff; font-weight: 500;
  font-size: 12.5px; line-height: 1.45; padding: 9px 12px; border-radius: 10px; box-shadow: var(--shadow);
  opacity: 0; visibility: hidden; transition: opacity .16s, transform .16s; z-index: 40; text-align: left;
}
.tip-bubble::after { content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 6px solid transparent; border-top-color: var(--ink); }
.tip:hover .tip-bubble, .tip:focus-within .tip-bubble { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }

/* ---------- Menu item editor ---------- */
.items-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.items-search { flex: 1; min-width: 180px; padding: 10px 14px; border-radius: 999px; border: 2px solid var(--line-strong); background: var(--cream); font-size: 14px; }
.items-search:focus { outline: none; border-color: var(--turq); background: #fff; }
.item-card { border: 1px solid var(--line); border-radius: var(--radius-sm); padding: 14px; margin-bottom: 14px; background: #fffdfb; transition: box-shadow .15s; }
.item-card:hover { box-shadow: var(--shadow-sm); }
.item-card.unavailable { opacity: .62; }
.item-row { display: grid; grid-template-columns: 64px 1fr auto; gap: 14px; align-items: start; }
.item-thumb { width: 64px; height: 64px; border-radius: 12px; object-fit: cover; background: var(--cream); border: 1px solid var(--line); }
.item-thumb.empty { display: grid; place-items: center; font-size: 22px; color: var(--line-strong); }
.item-image-col { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 64px; }
.item-image-actions { display: flex; align-items: center; gap: 4px; }
.btn-img-upload {
  border: 1.5px solid var(--turq); background: #fff; color: var(--turq-deep); font-family: var(--body);
  font-weight: 800; font-size: 11px; padding: 4px 8px; border-radius: 8px; cursor: pointer; transition: all .15s;
}
.btn-img-upload:hover { background: var(--turq); color: #fff; }
.btn-img-trash {
  border: 1.5px solid #f3c6d8; background: #fff; color: var(--pink-deep); font-size: 12px;
  width: 26px; height: 26px; border-radius: 8px; cursor: pointer; display: grid; place-items: center; transition: all .15s;
}
.btn-img-trash:hover { background: var(--pink-deep); color: #fff; border-color: var(--pink-deep); }
.item-fields { display: flex; flex-direction: column; gap: 9px; }
.item-fields .triple { display: grid; grid-template-columns: 2fr 1.4fr .8fr; gap: 9px; }
.item-fields input, .item-fields textarea, .item-fields select {
  padding: 9px 11px; border-radius: 9px; border: 1.5px solid var(--line-strong); font-size: 13.5px; background: #fff; width: 100%;
}
.item-fields textarea { min-height: 44px; resize: vertical; }
.item-fields input:focus, .item-fields textarea:focus, .item-fields select:focus { outline: none; border-color: var(--turq); }
.item-flags { display: flex; gap: 14px; flex-wrap: wrap; font-size: 13px; font-weight: 600; color: var(--ink-soft); }
.item-flags label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
.item-actions { display: flex; flex-direction: column; gap: 7px; }

/* ---------- Gallery editor ---------- */
.gallery-row { display: flex; gap: 10px; margin-bottom: 10px; align-items: center; }
.gallery-row input { flex: 1; padding: 10px 12px; border-radius: 9px; border: 1.5px solid var(--line-strong); background: #fff; font-size: 13.5px; }
.gallery-thumb { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid var(--line); flex: none; }

/* ---------- Upload ---------- */
.upload-box { border: 2px dashed var(--line-strong); border-radius: var(--radius-sm); padding: 20px; text-align: center; background: var(--cream); }
.upload-box input[type=file] { font-size: 13px; }
.uploaded-url { width: 100%; margin-top: 12px; padding: 10px 12px; border-radius: 9px; border: 1.5px solid var(--line-strong); background: #fff; font-size: 13px; }

/* ---------- Publish bar ---------- */
.publish-bar {
  position: sticky; bottom: 0; z-index: 25; display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  background: rgba(255,255,255,.94); backdrop-filter: blur(10px); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 16px 20px; box-shadow: var(--shadow); margin-top: 8px;
}
.publish-bar p { font-size: 12.5px; color: var(--ink-soft); flex: 1; min-width: 180px; }

.hidden { display: none !important; }

/* Away / availability toggle */
.away-switch { display: flex; align-items: center; gap: 14px; cursor: pointer; user-select: none; }
.away-switch input { position: absolute; opacity: 0; width: 0; height: 0; }
.away-slider { position: relative; width: 56px; height: 30px; background: var(--line-strong); border-radius: 999px; transition: background .2s; flex: none; }
.away-slider::after { content: ""; position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; background: #fff; border-radius: 50%; transition: transform .2s; box-shadow: 0 2px 6px rgba(0,0,0,.2); }
.away-switch input:checked + .away-slider { background: var(--pink); }
.away-switch input:checked + .away-slider::after { transform: translateX(26px); }
.away-label { font-weight: 700; font-size: 15px; }
.away-fields { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--line); }
.away-warn { margin-top: 14px; font-size: 13px; font-weight: 600; color: var(--pink-deep); background: #fdf0f5; border: 1px solid #f4c8da; border-radius: 10px; padding: 11px 14px; line-height: 1.45; }

/* ---------- Responsive ---------- */
@media (max-width: 820px) {
  .shell { grid-template-columns: 1fr; }
  .sidebar { position: static; height: auto; border-right: none; border-bottom: 1px solid var(--line); }
  .sidebar nav { flex-direction: row; flex-wrap: wrap; }
  .sidebar nav a { padding: 9px 12px; font-size: 13px; }
  .sidebar-foot { flex-direction: row; }
  .field-grid, .field-grid-3 { grid-template-columns: 1fr; }
  .item-row { grid-template-columns: 1fr; }
  .item-fields .triple { grid-template-columns: 1fr; }
}
