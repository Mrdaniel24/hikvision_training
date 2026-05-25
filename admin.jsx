/* global React, ReactDOM, supabase */
const { useState, useEffect, useMemo } = React;

const { createClient } = supabase;
const db = createClient(
  "https://iyiagkhfprhkahryobtw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5aWFna2hmcHJoa2FocnlvYnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MDczMDEsImV4cCI6MjA5NTI4MzMwMX0.dwT0Z4rqXpxt84tRy5gDzVI4zX45VQYGT4HdY0-YiSs"
);

// ============================================================
// CITIES
// ============================================================
const CITIES = [
  { id: "moshi",   name: "Moshi",   region: "Kilimanjaro",     dateRange: "08 — 10 Juni" },
  { id: "arusha",  name: "Arusha",  region: "Arusha",          dateRange: "11 — 13 Juni" },
  { id: "karatu",  name: "Karatu",  region: "Arusha · Karatu", dateRange: "14 — 16 Juni" },
  { id: "singida", name: "Singida", region: "Singida",         dateRange: "17 — 19 Juni" },
];

// ============================================================
// Data layer — Supabase
// ============================================================
async function fetchRegistrations() {
  const { data, error } = await db
    .from("registrations")
    .select("id, full_name, phone, city, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map((r) => ({
    id:        r.id,
    fullName:  r.full_name,
    phone:     r.phone,
    city:      r.city,
    createdAt: r.created_at,
  }));
}

// ============================================================
// Helpers
// ============================================================
const cityById = (id) => CITIES.find((c) => c.id === id) || { name: id, region: "" };
const initials = (name) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
const formatDate = (iso) => {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} · ${p(d.getHours())}:${p(d.getMinutes())}`;
};

function toCSV(rows) {
  const head = ["#", "Jina Kamili", "Simu", "Mkoa", "Tarehe ya Usajili"];
  const body = rows.map((r, i) => [
    i + 1,
    `"${r.fullName.replace(/"/g, '""')}"`,
    r.phone,
    cityById(r.city).name,
    formatDate(r.createdAt),
  ]);
  return [head, ...body].map((r) => r.join(",")).join("\n");
}

function downloadCSV(rows, filename) {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================
// Topbar
// ============================================================
function TopBar() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n) => String(n).padStart(2, "0");
  const date = `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
  const time = `${p(now.getHours())}:${p(now.getMinutes())}`;
  return (
    <header className="topbar">
      <div className="brand-cluster">
        <img className="logo-kt" src="assets/kitotech-horizontal.png" alt="Kitotech Group Ltd" />
        <div className="x" />
        <img className="logo-hk" src="assets/hikvision-logo.jpg" alt="Hikvision" />
        <div className="meta">
          <div className="row1">Admin · Mafunzo 2026</div>
          <div className="row2">Wakala Mkuu wa Hikvision Tanzania</div>
        </div>
      </div>
      <div className="topbar-right">
        <span className="admin-chip">Admin</span>
        <div className="live-chip"><span className="dot" />Hai · {date} · {time}</div>
      </div>
    </header>
  );
}

// ============================================================
// Stat grid
// ============================================================
function StatGrid({ all, byCity }) {
  return (
    <div className="stat-grid">
      <div className="stat-cell total">
        <div className="label">Jumla ya Usajili</div>
        <div className="num">{all.length}</div>
        <div className="delta">Watumiaji wote</div>
      </div>
      {CITIES.map((c) => (
        <div key={c.id} className="stat-cell">
          <div className="label">{c.name}</div>
          <div className="num">{byCity[c.id]?.length || 0}</div>
          <div className="delta">{c.dateRange}</div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Toolbar
// ============================================================
function Toolbar({ tab, setTab, query, setQuery, counts }) {
  const tabs = [
    { id: "all", label: "Wote", count: counts.all },
    ...CITIES.map((c) => ({ id: c.id, label: c.name, count: counts[c.id] || 0 })),
  ];
  return (
    <div className="toolbar">
      <div className="tabs">
        {tabs.map((t) => (
          <button key={t.id} className={`tab ${t.id === tab ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label} <span className="count">{t.count}</span>
          </button>
        ))}
      </div>
      <div className="search">
        <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Tafuta kwa jina au simu..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
}

// ============================================================
// Table
// ============================================================
function Table({ rows }) {
  if (rows.length === 0) {
    return (
      <div className="table-wrap">
        <div className="empty">
          <div className="big">Hakuna usajili</div>
          <div>Hakuna mtu aliyejisajili kwenye kategoria hii bado.</div>
        </div>
      </div>
    );
  }
  return (
    <div className="table-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th>
            <th>Jina Kamili</th>
            <th>Simu</th>
            <th>Mkoa</th>
            <th>Tarehe ya Usajili</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const city = cityById(r.city);
            return (
              <tr key={r.id}>
                <td className="row-num">{String(i + 1).padStart(2, "0")}</td>
                <td>
                  <div className="cell-name">
                    <div className="ava">{initials(r.fullName)}</div>
                    <div className="nm">
                      {r.fullName}
                      <div className="sm">ID · {r.id}</div>
                    </div>
                  </div>
                </td>
                <td className="cell-mono">{r.phone}</td>
                <td><span className="city-pill" data-c={r.city}>{city.name}</span></td>
                <td className="cell-mono dim">{formatDate(r.createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// All names panel
// ============================================================
function AllNames({ rows }) {
  const names = rows.map((r) => r.fullName).join("\n");
  const copy = () => {
    navigator.clipboard?.writeText(names).then(
      () => alert(`Majina ${rows.length} yamenakiliwa.`),
      () => alert("Kopi haikufanikiwa.")
    );
  };
  const printList = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>Majina ya Wasajiliwa</title>
      <style>
        body { font-family: 'Helvetica', sans-serif; padding: 32px; }
        h1 { font-size: 18px; margin: 0 0 16px; }
        ol { font-size: 14px; line-height: 1.7; padding-left: 24px; }
      </style></head><body>
      <h1>Majina ya Wasajiliwa — Kitotech × Hikvision Mafunzo 2026 (${rows.length})</h1>
      <ol>${rows.map((r) => `<li>${r.fullName} — ${cityById(r.city).name}</li>`).join("")}</ol>
      </body></html>
    `);
    w.document.close();
    w.print();
  };
  return (
    <div className="all-names">
      <div className="head">
        <h3>Majina yote ya Wasajiliwa</h3>
        <div className="sub">{rows.length} watu · jina moja kwa kila mstari</div>
      </div>
      <textarea readOnly value={names} spellCheck={false} />
      <div className="actions">
        <button className="btn-dark primary" onClick={copy}>Kopi Majina Yote</button>
        <button className="btn-dark" onClick={printList}>Chapisha Orodha</button>
        <button className="btn-dark" onClick={() => downloadCSV(rows, "wasajiliwa-wote.csv")}>Pakua CSV</button>
      </div>
    </div>
  );
}

// ============================================================
// App
// ============================================================
function App() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [tab, setTab]                     = useState("all");
  const [query, setQuery]                 = useState("");

  const load = () => {
    setLoading(true);
    setError(null);
    fetchRegistrations()
      .then((rows) => { setRegistrations(rows); setLoading(false); })
      .catch((e)   => { setError(e.message);    setLoading(false); });
  };

  useEffect(() => {
    load();
    const ch = db
      .channel("public:registrations")
      .on("postgres_changes", { event: "*", schema: "public", table: "registrations" }, load)
      .subscribe();
    return () => db.removeChannel(ch);
  }, []);

  const byCity = useMemo(() => {
    const out = {};
    CITIES.forEach((c) => { out[c.id] = []; });
    registrations.forEach((r) => {
      if (!out[r.city]) out[r.city] = [];
      out[r.city].push(r);
    });
    return out;
  }, [registrations]);

  const counts = useMemo(() => {
    const o = { all: registrations.length };
    CITIES.forEach((c) => { o[c.id] = byCity[c.id]?.length || 0; });
    return o;
  }, [registrations, byCity]);

  const filteredRows = useMemo(() => {
    const base = tab === "all" ? registrations : (byCity[tab] || []);
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    return base.filter((r) =>
      r.fullName.toLowerCase().includes(q) || r.phone.toLowerCase().includes(q)
    );
  }, [tab, registrations, byCity, query]);

  const exportCurrent = () => {
    const label = tab === "all" ? "wote" : cityById(tab).name.toLowerCase();
    downloadCSV(filteredRows, `wasajiliwa-${label}.csv`);
  };

  return (
    <div className="stage" data-screen-label="Admin">
      <TopBar />
      <div className="wrap">
        <div className="page-head">
          <div className="lt">
            <div className="eyebrow">Admin · Mafunzo ya Hikvision Tanzania 2026</div>
            <h1>Wasajiliwa wa Mafunzo</h1>
          </div>
          <div className="rt">
            <button className="btn" onClick={load}>↻ Refresh</button>
            <button className="btn primary" onClick={exportCurrent}>↓ Pakua CSV</button>
          </div>
        </div>

        {loading && <div className="empty" style={{ padding: "48px 0" }}>Inapakia data...</div>}
        {error   && <div className="empty" style={{ padding: "48px 0", color: "var(--brand-red)" }}>Hitilafu: {error}</div>}

        {!loading && !error && (
          <>
            <StatGrid all={registrations} byCity={byCity} />
            <Toolbar tab={tab} setTab={setTab} query={query} setQuery={setQuery} counts={counts} />
            <Table rows={filteredRows} />
            <AllNames rows={filteredRows} />
          </>
        )}
      </div>
      <footer className="legal">
        <div>© 2026 Kitotech Group Ltd · Wakala Mkuu wa Hikvision Tanzania</div>
        <div>v1.0 · Admin</div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
