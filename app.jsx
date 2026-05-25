/* global React, ReactDOM, supabase */
const { useState, useEffect, useMemo, useRef } = React;

const { createClient } = supabase;
const db = createClient(
  "https://iyiagkhfprhkahryobtw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5aWFna2hmcHJoa2FocnlvYnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MDczMDEsImV4cCI6MjA5NTI4MzMwMX0.dwT0Z4rqXpxt84tRy5gDzVI4zX45VQYGT4HdY0-YiSs"
);

// ============================================================
// Data
// ============================================================
const SCHEDULE = [
  { date: "2026-06-08", day: "Jumatatu",  activity: "Safari kuelekea Moshi",                 city: "Moshi",         type: "travel"   },
  { date: "2026-06-09", day: "Jumanne",   activity: "Mafunzo — Siku ya 1",                   city: "Moshi",         type: "training" },
  { date: "2026-06-10", day: "Jumatano",  activity: "Mafunzo — Siku ya 2 · Safari Arusha",   city: "Moshi",         type: "training" },
  { date: "2026-06-11", day: "Alhamisi",  activity: "Mafunzo — Siku ya 1",                   city: "Arusha",        type: "training" },
  { date: "2026-06-12", day: "Ijumaa",    activity: "Mafunzo — Siku ya 2",                   city: "Arusha",        type: "training" },
  { date: "2026-06-13", day: "Jumamosi",  activity: "Mafunzo — Siku ya 3",                   city: "Arusha",        type: "training" },
  { date: "2026-06-14", day: "Jumapili",  activity: "Safari kuelekea Karatu",                city: "Karatu",        type: "travel"   },
  { date: "2026-06-15", day: "Jumatatu",  activity: "Mafunzo — Siku ya 1",                   city: "Karatu",        type: "training" },
  { date: "2026-06-16", day: "Jumanne",   activity: "Mafunzo — Siku ya 2",                   city: "Karatu",        type: "training" },
  { date: "2026-06-17", day: "Jumatano",  activity: "Safari kuelekea Singida",               city: "Singida",       type: "travel"   },
  { date: "2026-06-18", day: "Alhamisi",  activity: "Mafunzo — Siku ya 1",                   city: "Singida",       type: "training" },
  { date: "2026-06-19", day: "Ijumaa",    activity: "Mafunzo — Siku ya 2",                   city: "Singida",       type: "training" },
  { date: "2026-06-20", day: "Jumamosi",  activity: "Kurudi Dar es Salaam",                  city: "Dar es Salaam", type: "travel"   },
];

const CITIES = [
  { id: "moshi",   name: "Moshi",   region: "Kilimanjaro",     dateRange: "08 — 10 Juni", initials: "MO",
    narrative: {
      heading: "Mafunzo ya Hikvision.",
      body: "Jisajili kwa kituo chako.",
      size: "xl"
    },
    waLink: "https://chat.whatsapp.com/KitotechHikvision-Moshi-2026" },
  { id: "arusha",  name: "Arusha",  region: "Arusha",          dateRange: "11 — 13 Juni", initials: "AR",
    narrative: {
      heading: "Mikoa minne.\nWiki mbili.",
      body: "Kitotech Group — wakala mkuu wa Hikvision Tanzania — inakuletea mafunzo ya kitaalamu kwenye mikoa minne: Moshi, Arusha, Karatu na Singida.",
      size: "md"
    },
    waLink: "https://chat.whatsapp.com/KitotechHikvision-Arusha-2026" },
  { id: "karatu",  name: "Karatu",  region: "Kilimanjaro", dateRange: "08 — 10 Juni", initials: "KA",
    narrative: {
      heading: "Jaza fomu hapa chini.",
      body: "Andika jina lako, simu, na chagua mkoa unaopendelea kuhudhuria.",
      size: "lg"
    },
    waLink: "https://chat.whatsapp.com/KitotechHikvision-Karatu-2026" },
  { id: "singida", name: "Singida", region: "Singida",         dateRange: "17 — 19 Juni", initials: "SI",
    narrative: {
      heading: "Baada ya kujisajili.",
      body: "Utapata ratiba ya kituo chako na kiungo cha WhatsApp group.",
      size: "lg"
    },
    waLink: "https://chat.whatsapp.com/KitotechHikvision-Singida-2026" },
];

const ROLES = []; // (haitumiki) — fields zimepunguzwa

// Slides: first is a video (user-provided), then the images in `image/`.
const SLIDES = [
  { type: 'video', src: 'video/hailuo-2_3_Create_a_hyper-realistic_cinematic_3D_animation_of_a_professional_Hikvision-styl-0.mp4' },
  { type: 'image', src: 'image/2.jpg' },
  { type: 'image', src: 'image/3.png' },
  { type: 'image', src: 'image/4.png' },
];

// ============================================================
// Topbar
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
        <img className="logo-kt" src="assets/kitotech-horizontal.png" alt="Kitotech Group Ltd" />
        <div className="x" />
        <img className="logo-hk" src="assets/hikvision-logo.jpg" alt="Hikvision" />
        <div className="meta">
          <div className="row1">Mafunzo Rasmi · Tanzania 2026</div>
          <div className="row2">Wakala Mkuu wa Hikvision Tanzania</div>
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
// Visual panel — image-slot per city (user drops their own photo)
// ============================================================
function VisualPanel({ city, setCity, index, total, autoPlay }) {
  const next = () => {
    const i = CITIES.findIndex((c) => c.id === city.id);
    setCity(CITIES[(i + 1) % CITIES.length].id);
  };
  const prev = () => {
    const i = CITIES.findIndex((c) => c.id === city.id);
    setCity(CITIES[(i - 1 + CITIES.length) % CITIES.length].id);
  };

  // Auto-advance every 4s so the narrative across slides moves automatically.
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => {
      const i = CITIES.findIndex((c) => c.id === city.id);
      setCity(CITIES[(i + 1) % CITIES.length].id);
    }, 4000);
    return () => clearInterval(id);
  }, [city.id, autoPlay, setCity]);

  // Use a custom React wrapper that creates the image-slot for each city,
  // keeping only the active one mounted (so its image shows + persistence works).
  return (
    <div className="shell-visual">
      {/* Slide media: video for first slide, images for others */}
      {(() => {
        const slide = SLIDES[index % SLIDES.length];
        if (slide.type === 'video') {
          return (
            <video
              className="bg-video"
              key={`video-${index}`}
              src={slide.src}
              autoPlay
              muted
              loop
              playsInline
            />
          );
        }
        return (
          <image-slot
            key={`slot-${city.id}`}
            id={`hero-${city.id}`}
            src={slide.src}
            placeholder={`Weka picha ya ${city.name} hapa  ·  Buruta picha`}
            shape="rect"
            fit="cover"
            position="50% 50%"
          ></image-slot>
        );
      })()}

      {index === 0 && (
        <div className="first-overlay" aria-hidden>
          <div className="box"><span style={{color:"var(--brand-red)"}}>HIK</span>VISION</div>
        </div>
      )}

      <div className="visual-shade" />

      <div className="visual-content">
        <div className="v-top">
          <div className="pills">
            <div className="pill active">Usajili</div>
            <div className="pill" title="Ratiba inaonyeshwa baada ya kujisajili">Ratiba</div>
          </div>
        </div>

        <div className="v-bot">
          <div className="city-chip">
            <div className="avatar">{city.initials}</div>
            <div className="text">
              <div className="t1">{city.name}</div>
              <div className="t2">{city.region} · {city.dateRange}</div>
            </div>
          </div>
          <div className="arrows">
            <button className="arrow-btn" onClick={prev} aria-label="Kituo cha awali">←</button>
            <button className="arrow-btn" onClick={next} aria-label="Kituo kinachofuata">→</button>
          </div>
        </div>
      </div>

      <div className="v-mid" key={`mid-${city.id}`}>
        <div className={`h size-${city.narrative.size}`}>
          {city.narrative.heading.split("\n").map((line, i) => (
            <span key={i}>{line}{i < city.narrative.heading.split("\n").length - 1 && <br />}</span>
          ))}
        </div>
        {city.narrative.body && <div className="s">{city.narrative.body}</div>}
      </div>

      <div className="v-dots">
        {CITIES.map((c) => (
          <div key={c.id}
               className={`d ${c.id === city.id ? "active" : ""}`}
               onClick={() => setCity(c.id)}
               title={c.name} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Form panel — single form
// ============================================================
function FormPanel({ form, setField, errors, onSubmit, submitting }) {
  return (
    <div className="shell-form">
      <div className="form-top">
        <div className="brand">
          <img className="hk-mini" src="assets/hikvision-logo.jpg" alt="" />
          <span className="dotsep" />
          <span className="kt-mini">KITOTECH</span>
        </div>
        <button className="lang" title="Lugha">🇹🇿 SW</button>
      </div>

      <h1 className="form-title">Karibu kwenye Usajili</h1>
      <p className="form-sub">
        <strong style={{ color: "var(--brand-red)" }}>Kitotech</strong> &times; <strong>Hikvision</strong> &middot; wanakuletea mafunzo ya kitaalamu.
      </p>

      <div className="field-stack">
        <div className="input">
          <input type="text" autoComplete="name"
            value={form.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            placeholder="Andika Jina Lako Kamili"
            className={errors.fullName ? "err" : ""} />
          {errors.fullName && <div className="err-msg">{errors.fullName}</div>}
        </div>

        <div className="input">
          <input type="tel" inputMode="tel" autoComplete="tel"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="Namba ya Simu  ·  +255 712 345 678"
            className={errors.phone ? "err" : ""} />
          {errors.phone && <div className="err-msg">{errors.phone}</div>}
        </div>

        <div className="input has-select">
          <select value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            className={errors.city ? "err" : ""}>
            <option value="">Chagua Mkoa</option>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name} · {c.dateRange}</option>
            ))}
          </select>
          {errors.city && <div className="err-msg">{errors.city}</div>}
        </div>
      </div>

      <button type="button" className="btn-primary" onClick={onSubmit} disabled={submitting}>
        {submitting ? "Inatuma..." : "ANGALIA RATIBA"}
      </button>

      <div className="form-foot-line">
        Umeshajisajili awali? <span className="link" onClick={() => alert("Ingia kwa simu yako utapata ratiba na link ya WhatsApp.")}>Ingia hapa</span>
      </div>

      <div className="social-row">
        <a href="#" aria-label="Facebook" title="Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.6c0-.9.3-1.5 1.6-1.5h1.7V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2v2.4H7.9v3h2.5V21h3.1z"/></svg>
        </a>
        <a href="#" aria-label="Twitter" title="Twitter / X">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.7 4h2.7l-5.9 6.7L21 20h-5.5l-4.3-5.6L6.3 20H3.6l6.3-7.2L3 4h5.6l3.9 5.1L17.7 4zm-.9 14.4h1.5L7.3 5.5H5.7l11.1 12.9z"/></svg>
        </a>
        <a href="#" aria-label="LinkedIn" title="LinkedIn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0zM7 8.25H3V20h4V8.25zM13.32 8.25H9.5V20h3.78v-6.2c0-3.5 4.55-3.79 4.55 0V20H21.6v-7.5c0-5.92-6.77-5.7-8.28-2.79V8.25z"/></svg>
        </a>
        <a href="#" aria-label="Instagram" title="Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor"/></svg>
        </a>
      </div>
    </div>
  );
}

// ============================================================
// Success panel
// ============================================================
function SuccessPanel({ form, city, onReset }) {
  const rows = SCHEDULE.filter((r) => r.city.toLowerCase() === city.name.toLowerCase());
  return (
    <div className="shell-form">
      <div className="form-top">
        <div className="brand">
          <img className="hk-mini" src="assets/hikvision-logo.jpg" alt="" />
          <span className="dotsep" />
          <span className="kt-mini">KITOTECH</span>
        </div>
        <span className="lang" style={{ cursor: "default" }}>🇹🇿 SW</span>
      </div>

      <div className="success-pane">
        <div className="success-badge"><span className="check">✓</span>Umejisajili Kikamilifu</div>
        <h2 className="success-title">Karibu {form.fullName.split(" ")[0]}, kituo cha <span style={{ color: "var(--brand-red)" }}>{city.name}</span>.</h2>
        <p className="success-sub">
          Usajili wako umepokelewa. Hapa chini ni <strong>ratiba kamili ya kituo cha {city.name}</strong>.
          Hatua inayofuata: jiunge kwenye kundi la WhatsApp ili kupokea taarifa za mwisho.
        </p>

        <div className="sched-card">
          <div className="sched-head">
            <div className="lt">Ratiba ya {city.name} · {city.region}</div>
            <div className="rt">{city.dateRange} · 2026</div>
          </div>
          {rows.map((r) => (
            <div key={r.date} className={`sched-row ${r.type === "travel" ? "travel" : ""}`}>
              <div>
                <div className="dt">{r.date.slice(5).replace("-", " · ")}</div>
                <div className="day">{r.day}</div>
              </div>
              <div className="act">{r.activity}</div>
              <div className={`pill ${r.type === "training" ? "training" : "travel-p"}`}>
                {r.type === "training" ? "Mafunzo" : "Safari"}
              </div>
            </div>
          ))}
        </div>

        <a className="wa-cta" href={city.waLink} target="_blank" rel="noopener noreferrer">
          <div className="ic">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 11.5a8 8 0 0 1-12.4 6.7L4 20l1.9-3.5A8 8 0 1 1 20 11.5zm-8 6.4c3.5 0 6.4-2.9 6.4-6.4S15.5 5.1 12 5.1 5.6 8 5.6 11.5c0 1.3.4 2.5 1.1 3.5l-.7 2.2 2.3-.6c1 .8 2.3 1.3 3.7 1.3zm3.3-4.6c-.2-.1-1.1-.5-1.3-.6-.2-.1-.3-.1-.4.1-.1.2-.5.6-.6.7-.1.1-.2.1-.4 0-.2-.1-.8-.3-1.5-1-.6-.5-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.2.2-.3 0-.1 0-.2 0-.3 0-.1-.4-.9-.5-1.2-.1-.3-.3-.3-.4-.3h-.4c-.1 0-.3 0-.5.2-.2.2-.7.7-.7 1.6 0 .9.7 1.9.8 2 .1.1 1.4 2.1 3.4 3 .5.2.8.3 1.1.4.5.1.9.1 1.2.1.4 0 1.1-.5 1.3-.9.2-.4.2-.8.1-.9 0-.1-.2-.1-.4-.2z"/>
            </svg>
          </div>
          <div className="text">
            <div className="t1">Jiunge na Kundi la WhatsApp · {city.name}</div>
            <div className="t2">Bofya kufungua WhatsApp. Tumia simu uliyojiandikisha nayo: {form.phone}</div>
          </div>
          <div className="arr">→</div>
        </a>

        <div className="summary-grid">
          <div className="cell"><div className="k">Jina Kamili</div><div className="v">{form.fullName}</div></div>
          <div className="cell"><div className="k">Simu</div><div className="v">{form.phone}</div></div>
        </div>

        <div className="success-next">
          <button className="btn-ghost" onClick={() => window.print()}>Chapisha</button>
          <button className="btn-ghost" onClick={onReset}>Sajili mtu mwingine</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// App
// ============================================================
function App() {
  const STORAGE_KEY = "kitotech-hikvision-reg-v4";
  const initial = {
    fullName: "", phone: "", city: ""
  };
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [visualCityId, setVisualCityId] = useState(CITIES[0].id);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.form) setForm({ ...initial, ...saved.form });
        if (saved.submitted) setSubmitted(true);
        if (saved.visualCityId) setVisualCityId(saved.visualCityId);
      }
    } catch (e) {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, submitted, visualCityId }));
    } catch (e) {}
  }, [form, submitted, visualCityId]);

  useEffect(() => {
    if (form.city && form.city !== visualCityId) setVisualCityId(form.city);
  }, [form.city]);

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.fullName.trim()) er.fullName = "Andika jina lako kamili";
    else if (form.fullName.trim().split(/\s+/).length < 2) er.fullName = "Andika jina kamili (jina la kwanza na la mwisho)";
    const ph = form.phone.replace(/[\s-]/g, "");
    if (!ph) er.phone = "Andika namba ya simu";
    else if (!/^\+?\d{9,15}$/.test(ph)) er.phone = "Namba si sahihi (mfano +255712345678)";
    if (!form.city) er.city = "Chagua mkoa";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const { error } = await db.from("registrations").insert({
      full_name: form.fullName,
      phone:     form.phone,
      city:      form.city,
    });
    setSubmitting(false);
    if (error) {
      alert("Hitilafu ya mtandao: " + error.message);
      return;
    }
    setSubmitted(true);
    setVisualCityId(form.city);
  };

  const reset = () => {
    setForm(initial);
    setErrors({});
    setSubmitted(false);
    setVisualCityId(CITIES[0].id);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  };

  const visualCity = CITIES.find((c) => c.id === visualCityId) || CITIES[0];
  const visualIndex = CITIES.findIndex((c) => c.id === visualCity.id);
  const submittedCity = CITIES.find((c) => c.id === form.city) || CITIES[0];

  const setVisualCity = (id) => {
    setVisualCityId(id);
    if (!form.city) setField("city", id);
  };

  return (
    <div className="stage" data-screen-label="Registration">
      <TopBar />
      <div className="main">
        <div className="shell-card">
          <VisualPanel
            city={visualCity}
            setCity={setVisualCity}
            index={visualIndex}
            total={CITIES.length}
            autoPlay={!form.city && !submitted}
          />
          {submitted
            ? <SuccessPanel form={form} city={submittedCity} onReset={reset} />
            : <FormPanel form={form} setField={setField} errors={errors} onSubmit={submit} submitting={submitting} />
          }
        </div>
      </div>
      <footer className="legal">
        <div>© 2026 Kitotech Group Ltd · Wakala Mkuu wa Hikvision Tanzania</div>
        <div className="right">
          <span>support@kitotech.co.tz</span>
          <span>+255 712 000 000</span>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
