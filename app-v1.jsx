/* global React, ReactDOM */
const { useState, useEffect, useMemo, useRef } = React;

// ============================================================
// Data — schedule + cities
// ============================================================
const SCHEDULE = [
  { date: "2026-06-08", day: "Jumatatu",   activity: "Safari kuelekea Moshi",                  city: "Moshi",         type: "travel"   },
  { date: "2026-06-09", day: "Jumanne",    activity: "Mafunzo — Siku ya 1",                    city: "Moshi",         type: "training" },
  { date: "2026-06-10", day: "Jumatano",   activity: "Mafunzo — Siku ya 2 · Safari Arusha",    city: "Moshi",         type: "training" },
  { date: "2026-06-11", day: "Alhamisi",   activity: "Mafunzo — Siku ya 1",                    city: "Arusha",        type: "training" },
  { date: "2026-06-12", day: "Ijumaa",     activity: "Mafunzo — Siku ya 2",                    city: "Arusha",        type: "training" },
  { date: "2026-06-13", day: "Jumamosi",   activity: "Mafunzo — Siku ya 3",                    city: "Arusha",        type: "training" },
  { date: "2026-06-14", day: "Jumapili",   activity: "Safari kuelekea Karatu",                 city: "Karatu",        type: "travel"   },
  { date: "2026-06-15", day: "Jumatatu",   activity: "Mafunzo — Siku ya 1",                    city: "Karatu",        type: "training" },
  { date: "2026-06-16", day: "Jumanne",    activity: "Mafunzo — Siku ya 2",                    city: "Karatu",        type: "training" },
  { date: "2026-06-17", day: "Jumatano",   activity: "Safari kuelekea Singida",                city: "Singida",       type: "travel"   },
  { date: "2026-06-18", day: "Alhamisi",   activity: "Mafunzo — Siku ya 1",                    city: "Singida",       type: "training" },
  { date: "2026-06-19", day: "Ijumaa",     activity: "Mafunzo — Siku ya 2",                    city: "Singida",       type: "training" },
  { date: "2026-06-20", day: "Jumamosi",   activity: "Kurudi Dar es Salaam",                   city: "Dar es Salaam", type: "travel"   },
];

const CITIES = [
  {
    id: "moshi",
    name: "Moshi",
    seq: "Kituo 01",
    dateRange: "08 — 10 Juni",
    days: [
      { d: "08", t: "Safari", red: false },
      { d: "09", t: "Mafunzo", red: true },
      { d: "10", t: "Mafunzo", red: true },
    ],
    region: "Kilimanjaro",
    waLink: "https://chat.whatsapp.com/KitotechHikvision-Moshi-2026"
  },
  {
    id: "arusha",
    name: "Arusha",
    seq: "Kituo 02",
    dateRange: "11 — 13 Juni",
    days: [
      { d: "11", t: "Mafunzo", red: true },
      { d: "12", t: "Mafunzo", red: true },
      { d: "13", t: "Mafunzo", red: true },
    ],
    region: "Arusha",
    waLink: "https://chat.whatsapp.com/KitotechHikvision-Arusha-2026"
  },
  {
    id: "karatu",
    name: "Karatu",
    seq: "Kituo 03",
    dateRange: "14 — 16 Juni",
    days: [
      { d: "14", t: "Safari", red: false },
      { d: "15", t: "Mafunzo", red: true },
      { d: "16", t: "Mafunzo", red: true },
    ],
    region: "Arusha · Karatu",
    waLink: "https://chat.whatsapp.com/KitotechHikvision-Karatu-2026"
  },
  {
    id: "singida",
    name: "Singida",
    seq: "Kituo 04",
    dateRange: "17 — 19 Juni",
    days: [
      { d: "17", t: "Safari", red: false },
      { d: "18", t: "Mafunzo", red: true },
      { d: "19", t: "Mafunzo", red: true },
    ],
    region: "Singida",
    waLink: "https://chat.whatsapp.com/KitotechHikvision-Singida-2026"
  }
];

const ROLES = [
  "Mtaalamu wa CCTV / Usalama",
  "Muuzaji / Mfanyabiashara",
  "Mtaalamu wa Mitandao (IT)",
  "Installer / Technician",
  "Mwanafunzi",
  "Nyingine"
];

// ============================================================
// CCTV background
// ============================================================
function CCTVBackground() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const ts = useMemo(() => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }, [now]);
  const tiles = [
    { id: "CAM-01",  loc: "MOSHI · MJINI",       silh: "cam-1", scan: "7s",  delay: "0s",   gx: "32%", gy: "44%" },
    { id: "CAM-02",  loc: "ARUSHA · NGAA",       silh: "cam-2", scan: "9s",  delay: "1.4s", gx: "62%", gy: "30%" },
    { id: "CAM-03",  loc: "KARATU · BARABARA",   silh: "cam-3", scan: "8s",  delay: "0.6s", gx: "20%", gy: "60%" },
    { id: "CAM-04",  loc: "SINGIDA · KAUSI",     silh: "cam-4", scan: "10s", delay: "2.1s", gx: "70%", gy: "55%" },
  ];
  return (
    <div className="bg-layer" aria-hidden="true">
      <div className="cctv-grid">
        {tiles.map((t, i) => (
          <div
            key={t.id}
            className="cctv-tile"
            style={{ "--scan-dur": t.scan, "--scan-delay": t.delay, "--gx": t.gx, "--gy": t.gy }}
          >
            <div className={`cctv-silh ${t.silh}`}>
              {t.silh === "cam-2" && <div className="person" />}
              {t.silh === "cam-3" && (
                <>
                  <div className="light-dot" style={{ left: "12%", top: "30%" }} />
                  <div className="light-dot" style={{ left: "44%", top: "20%", animationDelay: "0.6s" }} />
                  <div className="light-dot" style={{ left: "72%", top: "26%", animationDelay: "1.1s" }} />
                </>
              )}
            </div>
            <div className="cctv-scanlines" />
            <div className="cctv-noise" />
            <div className="cctv-hud">
              <div className="top">
                <div className="id"><span className="live-dot" />{t.id} · {t.loc}</div>
                <div className="ts">{ts}</div>
              </div>
              <div className="bot">
                <span>REC</span>
                <span>4K · H.265+</span>
              </div>
              <div className="corner tl" />
              <div className="corner tr" />
              <div className="corner bl" />
              <div className="corner br" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-wedge" />
      <div className="bg-wedge-2" />
      <div className="bg-sweep" />
      <div className="bg-vignette" />
    </div>
  );
}

// ============================================================
// Topbar (co-branded)
// ============================================================
function TopBar() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  return (
    <header className="topbar">
      <div className="brand-cluster">
        <img className="logo-kt" src="assets/kitotech-horizontal-light.png" alt="Kitotech Group Ltd" />
        <div className="x" />
        <img className="logo-hk" src="assets/hikvision-logo.jpg" alt="Hikvision" />
      </div>
      <div className="brand-cluster" style={{ marginLeft: 16 }}>
        <div className="meta">
          <div className="row1">Mafunzo Rasmi · Tanzania 2026</div>
          <div className="row2">Kitotech — Wakala Mkuu wa Hikvision Tanzania</div>
        </div>
      </div>
      <div className="topbar-right">
        <div className="live-chip"><span className="dot" />Usajili Wazi</div>
        <div className="ts-chip">{date} · {time}</div>
      </div>
    </header>
  );
}

// ============================================================
// Schedule (left rail)
// ============================================================
function ScheduleTable({ selectedCity }) {
  return (
    <div className="schedule">
      <div className="sch-head">
        <div className="title">Ratiba Kamili · Juni 2026</div>
        <div className="meta">13 Siku · 4 Mikoa</div>
      </div>
      {SCHEDULE.map((r) => {
        const isSel = selectedCity && r.city.toLowerCase() === selectedCity;
        return (
          <div key={r.date} className={`row ${r.type === "travel" ? "travel" : ""} ${isSel ? "selected" : ""}`}>
            <div>
              <div className="date">{r.date.slice(5).replace("-", " · ")}</div>
              <div className="day">{r.day}</div>
            </div>
            <div className="activity">{r.activity}</div>
            <div className="city">{r.city}</div>
            <div>
              <div className={`pill-day ${r.type === "training" ? "training" : "travel-p"}`}>
                {r.type === "training" ? "Mafunzo" : "Safari"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Step 1 — Personal details
// ============================================================
function StepPersonal({ form, setField, errors }) {
  return (
    <div className="step-pane" key="s1">
      <div className="field-grid three">
        <div className="field">
          <label>Jina la Kwanza<span className="req">*</span></label>
          <input
            type="text" autoComplete="given-name"
            value={form.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            placeholder="Asha"
            className={errors.firstName ? "err" : ""}
          />
          {errors.firstName && <div className="err-msg">{errors.firstName}</div>}
        </div>
        <div className="field">
          <label>Jina la Kati<span className="req">*</span></label>
          <input
            type="text" autoComplete="additional-name"
            value={form.middleName}
            onChange={(e) => setField("middleName", e.target.value)}
            placeholder="Hamis"
            className={errors.middleName ? "err" : ""}
          />
          {errors.middleName && <div className="err-msg">{errors.middleName}</div>}
        </div>
        <div className="field">
          <label>Jina la Mwisho<span className="req">*</span></label>
          <input
            type="text" autoComplete="family-name"
            value={form.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            placeholder="Mwalimu"
            className={errors.lastName ? "err" : ""}
          />
          {errors.lastName && <div className="err-msg">{errors.lastName}</div>}
        </div>
      </div>

      <div className="field-grid two">
        <div className="field">
          <label>Namba ya Simu<span className="req">*</span></label>
          <input
            type="tel" inputMode="tel" autoComplete="tel"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="+255 712 345 678"
            className={errors.phone ? "err" : ""}
          />
          <div className="hint">Tutatumia hii kukutuma kiungo cha WhatsApp</div>
          {errors.phone && <div className="err-msg">{errors.phone}</div>}
        </div>
        <div className="field">
          <label>Barua Pepe</label>
          <input
            type="email" autoComplete="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="asha@kampuni.co.tz"
          />
          <div className="hint">Hiari · Tutatuma cheti hapa baada ya mafunzo</div>
        </div>
      </div>

      <div className="field">
        <label>Kampuni / Shirika</label>
        <input
          type="text" autoComplete="organization"
          value={form.company}
          onChange={(e) => setField("company", e.target.value)}
          placeholder="Mfano: Securecom Tanzania Ltd · au acha wazi"
        />
        <div className="hint">Hiari</div>
      </div>
    </div>
  );
}

// ============================================================
// Step 2 — City pick
// ============================================================
function StepCity({ form, setField, errors }) {
  return (
    <div className="step-pane" key="s2">
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 4 }}>
        <div className="eyebrow-line" style={{ fontSize: 11 }}>Chagua eneo · Kituo kimoja tu</div>
        <div style={{ font: "400 13px/1.6 var(--font-body)", color: "var(--fg-on-dark-2)" }}>
          Mafunzo yatafanyika kwa mikoa minne. Chagua kituo unachotaka kuhudhuria.
        </div>
      </div>
      <div className="city-grid">
        {CITIES.map((c) => {
          const isSel = form.city === c.id;
          return (
            <div
              key={c.id}
              className={`city-card ${isSel ? "selected" : ""}`}
              onClick={() => setField("city", c.id)}
              role="radio" aria-checked={isSel} tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setField("city", c.id); }}}
            >
              <div className="radio" />
              <div className="top">
                <div>
                  <div className="seq">{c.seq} · {c.region}</div>
                  <div className="name">{c.name}</div>
                </div>
              </div>
              <div className="dates">JUNI · <span className="red">{c.dateRange}</span></div>
              <div className="days">
                {c.days.map((d) => (
                  <div key={d.d} className={`day-dot ${d.red ? "t" : "tr"}`}>
                    {d.d} {d.t}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {errors.city && <div className="err-msg" style={{ marginTop: 4 }}>{errors.city}</div>}
    </div>
  );
}

// ============================================================
// Step 3 — Eneo + role
// ============================================================
function StepEneo({ form, setField, errors }) {
  const selected = CITIES.find((c) => c.id === form.city);
  return (
    <div className="step-pane" key="s3">
      <div className="mini-summary">
        <div>
          <div className="k">Mhusika</div>
          <div className="v">{form.firstName} {form.middleName} {form.lastName}</div>
        </div>
        <div>
          <div className="k">Kituo</div>
          <div className="v">{selected ? `${selected.name} · ${selected.dateRange}` : "—"}</div>
        </div>
      </div>

      <div className="field">
        <label>Eneo Maalum la Mafunzo<span className="req">*</span></label>
        <input
          type="text"
          value={form.venue}
          onChange={(e) => setField("venue", e.target.value)}
          placeholder={selected ? `Mfano: Hotel ${selected.name}, ukumbi mkuu` : "Mfano: ukumbi wa Hotel..."}
          className={errors.venue ? "err" : ""}
        />
        <div className="hint">Hoteli au eneo unalopendelea ndani ya {selected ? selected.name : "mji"}</div>
        {errors.venue && <div className="err-msg">{errors.venue}</div>}
      </div>

      <div className="field">
        <label>Hadhi yako ya kazi<span className="req">*</span></label>
        <div className="radio-group">
          {ROLES.map((r) => (
            <div
              key={r}
              className={`radio-pill ${form.role === r ? "selected" : ""}`}
              onClick={() => setField("role", r)}
              role="radio" aria-checked={form.role === r} tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setField("role", r); }}}
            >
              <span className="dot" />
              <span>{r}</span>
            </div>
          ))}
        </div>
        {errors.role && <div className="err-msg" style={{ marginTop: 4 }}>{errors.role}</div>}
      </div>

      <div className="field">
        <label>Ujumbe wa Ziada</label>
        <textarea
          rows={3}
          value={form.note}
          onChange={(e) => setField("note", e.target.value)}
          placeholder="Mahitaji maalum, mada unayotaka kupata mafunzo zaidi, n.k. · Hiari"
        />
      </div>
    </div>
  );
}

// ============================================================
// Step 4 — Success
// ============================================================
function CitySchedule({ city }) {
  if (!city) return null;
  // Find all schedule rows for this city
  const rows = SCHEDULE.filter((r) => r.city.toLowerCase() === city.name.toLowerCase());
  return (
    <div className="city-sched">
      <div className="head">
        <div className="left">
          <div className="eyebrow">Ratiba ya Kituo Chako</div>
          <div className="title">{city.name} · {city.region}</div>
        </div>
        <div className="range">{city.dateRange} · 2026</div>
      </div>
      {rows.map((r) => (
        <div key={r.date} className={`day-row ${r.type === "travel" ? "travel" : ""}`}>
          <div>
            <div className="d-date">{r.date.slice(5).replace("-", " · ")}</div>
            <div className="d-day">{r.day}</div>
          </div>
          <div className="d-act">{r.activity}</div>
          <div className={`pill-day ${r.type === "training" ? "training" : "travel-p"}`}>
            {r.type === "training" ? "Mafunzo" : "Safari"}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepSuccess({ form, onReset }) {
  const selected = CITIES.find((c) => c.id === form.city);
  return (
    <div className="success">
      <div className="badge"><span className="check">✓</span>Umejisajili Kikamilifu</div>
      <h2>Karibu kwenye mafunzo ya Hikvision · {selected?.name}.</h2>
      <p className="lede">
        Asante, <strong style={{ color: "var(--fg-on-dark-1)" }}>{form.firstName} {form.lastName}</strong>.
        Usajili wako umepokelewa. Hapa chini ni <strong style={{ color: "var(--fg-on-dark-1)" }}>ratiba kamili ya kituo cha {selected?.name}</strong>.
        Hatua inayofuata: jiunge kwenye kundi la WhatsApp ili kupokea taarifa za mwisho.
      </p>

      <CitySchedule city={selected} />

      <a className="wa-cta" href={selected?.waLink} target="_blank" rel="noopener noreferrer">
        <div className="ic">W</div>
        <div className="text">
          <div className="t1">Jiunge na Kundi la WhatsApp · {selected?.name}</div>
          <div className="t2">Bofya hapa kufungua WhatsApp na kujiunga moja kwa moja. Tumia simu uliyojiandikisha nayo ({form.phone}).</div>
        </div>
        <div className="arr">→</div>
      </a>

      <div className="summary">
        <div className="cell"><div className="k">Jina Kamili</div><div className="v">{form.firstName} {form.middleName} {form.lastName}</div></div>
        <div className="cell"><div className="k">Simu</div><div className="v">{form.phone}</div></div>
        <div className="cell"><div className="k">Eneo Maalum</div><div className="v">{form.venue || "—"}</div></div>
        <div className="cell"><div className="k">Hadhi</div><div className="v">{form.role}</div></div>
      </div>

      <div className="next">
        <button className="btn ghost" onClick={() => window.print()}>Chapisha Uthibitisho</button>
        <button className="btn ghost" onClick={onReset}>Sajili mtu mwingine</button>
      </div>
    </div>
  );
}

// ============================================================
// Main App
// ============================================================
function App() {
  const STORAGE_KEY = "kitotech-hikvision-reg-v1";
  const initial = {
    firstName: "", middleName: "", lastName: "",
    phone: "", email: "", company: "",
    city: "", venue: "", role: "", note: ""
  };
  const [step, setStep] = useState(0); // 0..3
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  // Persist progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.form) setForm({ ...initial, ...saved.form });
        if (typeof saved.step === "number" && saved.step >= 0 && saved.step <= 3) setStep(saved.step);
      }
    } catch (e) { /* noop */ }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, step }));
    } catch (e) { /* noop */ }
  }, [form, step]);

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = (st) => {
    const er = {};
    if (st === 0) {
      if (!form.firstName.trim()) er.firstName = "Andika jina la kwanza";
      if (!form.middleName.trim()) er.middleName = "Andika jina la kati";
      if (!form.lastName.trim()) er.lastName = "Andika jina la mwisho";
      const ph = form.phone.replace(/[\s-]/g, "");
      if (!ph) er.phone = "Andika namba ya simu";
      else if (!/^\+?\d{9,15}$/.test(ph)) er.phone = "Namba si sahihi (mfano +255712345678)";
    }
    if (st === 1) {
      if (!form.city) er.city = "Chagua mji mmoja";
    }
    if (st === 2) {
      if (!form.venue.trim()) er.venue = "Andika eneo unalopendelea";
      if (!form.role) er.role = "Chagua hadhi yako";
    }
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    setStep((s) => Math.min(3, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => {
    setForm(initial);
    setStep(0);
    setErrors({});
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  };

  const stepData = [
    { num: "01", lbl: "Taarifa Binafsi" },
    { num: "02", lbl: "Chagua Kituo" },
    { num: "03", lbl: "Eneo & Hadhi" },
    { num: "04", lbl: "Thibitisha" }
  ];
  const progress = ((step) / 3) * 100;
  const selectedCity = form.city;

  return (
    <div className="stage" data-screen-label="Registration">
      <CCTVBackground />
      <div className="fg">
        <TopBar />

        <div className="main">
          {/* Hero block */}
          <section className="hero-block">
            <div className="eyebrow-line">Mafunzo Rasmi · Tanzania · Juni 2026</div>
            <h1 className="hero-title">
              Mafunzo ya <span className="red">Hikvision</span>.<br />
              <span className="it">Jisajili kwa kituo chako.</span>
            </h1>
            <p className="hero-lede">
              Kitotech Group — wakala mkuu wa Hikvision Tanzania — inakuletea mafunzo ya kitaalamu
              kwenye <strong>mikoa minne</strong>: Moshi, Arusha, Karatu na Singida. Jaza fomu hapa chini.
              Baada ya kujisajili utapata ratiba ya kituo chako na kiungo cha WhatsApp group.
            </p>
          </section>

          {/* Form card */}
          <div className="form-card">
            <div className="form-head">
              <div className="title">{step === 3 ? "Karibu kwenye mafunzo." : "Usajili wa Mafunzo"}</div>
              <div className="sub">
                {step === 3
                  ? "Hatua ya mwisho · Jiunge WhatsApp"
                  : `Hatua ${step + 1} ya 4 · ${stepData[step].lbl}`}
              </div>
            </div>

            {step < 3 && (
              <div className="stepper">
                {stepData.map((s, i) => (
                  <React.Fragment key={s.num}>
                    <div className={`step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
                      <div className="num">{i < step ? "✓" : s.num}</div>
                      <div className="lbl">{s.lbl}</div>
                    </div>
                    {i < stepData.length - 1 && <div className="bar" />}
                  </React.Fragment>
                ))}
              </div>
            )}

            <div className="form-body" style={step === 3 ? { padding: 0, minHeight: 0 } : {}}>
              {step === 0 && <StepPersonal form={form} setField={setField} errors={errors} />}
              {step === 1 && <StepCity     form={form} setField={setField} errors={errors} />}
              {step === 2 && <StepEneo     form={form} setField={setField} errors={errors} />}
              {step === 3 && <StepSuccess  form={form} onReset={reset} />}
            </div>

            {step < 3 && (
              <div className="form-foot">
                {step > 0 ? (
                  <button className="btn ghost" onClick={back}>← Rudi Nyuma</button>
                ) : (
                  <div style={{ font: "var(--mono-sm)", color: "var(--fg-on-dark-3)", textTransform: "uppercase", letterSpacing: "0.16em" }}>
                    Bila malipo
                  </div>
                )}
                <div className="progress"><div className="bar" style={{ width: `${progress}%` }} /></div>
                <button className="btn primary" onClick={next}>
                  {step === 2 ? "Thibitisha Usajili" : "Endelea"} →
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="diagonal-rule" />
        <footer className="legal">
          <div>© 2026 Kitotech Group Ltd · Wakala Mkuu wa Hikvision Tanzania</div>
          <div className="right">
            <span>support@kitotech.co.tz</span>
            <span>+255 712 000 000</span>
            <span>training.kitotech.co.tz</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
