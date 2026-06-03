/* global React, ReactDOM, supabase, html2canvas */
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
    venue: "ELCT UMOJA HOSTEL",
    narrative: {
      heading: "Mafunzo ya Hikvision.",
      body: "Jisajili kwa kituo chako.",
      size: "xl"
    },
    waLink: "https://chat.whatsapp.com/Kz67I3ZSaHbKxXM1PnO07m?s=cl&p=a&mlu=2" },
  { id: "arusha",  name: "Arusha",  region: "Arusha",          dateRange: "11 — 13 Juni", initials: "AR",
    venue: "ARUSHA MALL-MAKAO MAPYA",
    narrative: {
      heading: "Mikoa minne.\nWiki mbili.",
      body: "Kitotech Group — wakala mkuu wa Hikvision Tanzania — inakuletea mafunzo ya kitaalamu kwenye mikoa minne: Moshi, Arusha, Karatu na Singida.",
      size: "md"
    },
    waLink: "https://chat.whatsapp.com/DugTAm0ziGS7K79e9NSKKE?s=cl&p=a&mlu=2" },
  { id: "karatu",  name: "Karatu",  region: "Arusha", dateRange: "08 — 10 Juni", initials: "KA",
    venue: "PEACE STATIONARY & GENERAL SUPPLIES",
    narrative: {
      heading: "Jaza fomu hapa chini.",
      body: "Andika jina lako, simu, na chagua mkoa unaopendelea kuhudhuria.",
      size: "lg"
    },
    waLink: "https://chat.whatsapp.com/KjzlGYb7MDtI7kgj9fUKMA?s=cl&p=a&mlu=2" },
  { id: "singida", name: "Singida", region: "Singida",         dateRange: "17 — 19 Juni", initials: "SI",
    venue: "KBH BY ROYAL HOTEL",
    narrative: {
      heading: "Baada ya kujisajili.",
      body: "Utapata ratiba ya kituo chako na kiungo cha WhatsApp group.",
      size: "lg"
    },
    waLink: "https://chat.whatsapp.com/ISeS6J92CmLHHg5ndMjWPy?s=cl&p=a&mlu=2" },
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
// Constants
// ============================================================
const MAX_SLOTS = 50;
const CITY_MAX_SLOTS = { arusha: 100 }; // per-city override
const getCityMax = (cityId) => CITY_MAX_SLOTS[cityId] ?? MAX_SLOTS;

// ============================================================
// Slots Full Modal
// city = CITIES object  → specific city full (dismissable)
// city = null           → ALL cities full (non-dismissable)
// ============================================================
const WaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M20 11.5a8 8 0 0 1-12.4 6.7L4 20l1.9-3.5A8 8 0 1 1 20 11.5zm-8 6.4c3.5 0 6.4-2.9 6.4-6.4S15.5 5.1 12 5.1 5.6 8 5.6 11.5c0 1.3.4 2.5 1.1 3.5l-.7 2.2 2.3-.6c1 .8 2.3 1.3 3.7 1.3zm3.3-4.6c-.2-.1-1.1-.5-1.3-.6-.2-.1-.3-.1-.4.1-.1.2-.5.6-.6.7-.1.1-.2.1-.4 0-.2-.1-.8-.3-1.5-1-.6-.5-1-1.2-1.1-1.4-.1-.2 0-.3.1-.4l.3-.3c.1-.1.1-.2.2-.3 0-.1 0-.2 0-.3 0-.1-.4-.9-.5-1.2-.1-.3-.3-.3-.4-.3h-.4c-.1 0-.3 0-.5.2-.2.2-.7.7-.7 1.6 0 .9.7 1.9.8 2 .1.1 1.4 2.1 3.4 3 .5.2.8.3 1.1.4.5.1.9.1 1.2.1.4 0 1.1-.5 1.3-.9.2-.4.2-.8.1-.9 0-.1-.2-.1-.4-.2z"/>
  </svg>
);

function SlotsFullModal({ city, onClose }) {
  const allFull = city === null;
  return (
    <div className="modal-overlay slots-full-overlay" onClick={allFull ? undefined : onClose}>
      <div className="modal-box slots-full-box" onClick={(e) => e.stopPropagation()}>
        <div className="slots-icon" aria-hidden="true">🔒</div>
        <h2 className="slots-title">
          {allFull ? "Nafasi Zimejaa!" : `${city.name} Imejaa!`}
        </h2>
        <div className="slots-badge">
          {city ? getCityMax(city.id) : MAX_SLOTS} / {city ? getCityMax(city.id) : MAX_SLOTS} Washiriki{city ? ` · ${city.name}` : ""}
        </div>
        <p className="slots-body">
          {allFull
            ? `Samahani, mafunzo yote ya Hikvision Tanzania 2026 yamejaa. Mikoa yote minne imeshafikia kikomo chake cha washiriki.`
            : `Samahani, mkoa wa ${city.name} umejaa. Washiriki wote ${getCityMax(city.id)} wameshaandikishwa kwa kituo hiki. Tafadhali chagua mkoa mwingine ulio wazi.`
          }
        </p>
        <div className="slots-divider" />
        {!allFull && (
          <button className="modal-btn slots-other-btn" onClick={onClose}>
            Chagua Mkoa Mwingine
          </button>
        )}
        <p className="slots-contact-label">Je, una swali? Wasiliana nasi:</p>
        <a className="slots-wa" href="https://wa.me/255750238187" target="_blank" rel="noopener noreferrer">
          <WaIcon />
          Piga Simu / WhatsApp: +255 750 238 187
        </a>
        <div className="slots-footer">© 2026 Kitotech Group Ltd · Hikvision Tanzania</div>
      </div>
    </div>
  );
}

// ============================================================
// Lookup / Verify Registration Modal
// ============================================================
function LookupModal({ onClose }) {
  const [step, setStep]               = useState("search");
  const [nameInput, setNameInput]     = useState("");
  const [phoneInput, setPhoneInput]   = useState("");
  const [cityInput, setCityInput]     = useState("");
  const [loading, setLoading]         = useState(false);
  const [record, setRecord]           = useState(null);
  const [nameErr, setNameErr]         = useState("");
  const [fallbackErr, setFallbackErr] = useState("");

  const searchByName = async () => {
    const name = nameInput.trim();
    if (!name) { setNameErr("Andika jina lako"); return; }
    setNameErr(""); setLoading(true);
    const { data } = await db
      .from("registrations")
      .select("*")
      .ilike("full_name", name)
      .limit(1);
    setLoading(false);
    if (data && data.length > 0) { setRecord(data[0]); setStep("found"); }
    else setStep("fallback");
  };

  const verifyByPhone = async () => {
    const digits = phoneInput.replace(/\D/g, "").slice(-9);
    if (digits.length < 9 || !cityInput) { setFallbackErr("Jaza namba ya simu na mkoa"); return; }
    setFallbackErr(""); setLoading(true);
    const { data } = await db
      .from("registrations")
      .select("*")
      .ilike("phone", `%${digits}`)
      .eq("city", cityInput)
      .limit(1);
    setLoading(false);
    if (data && data.length > 0) { setRecord(data[0]); setStep("verified"); }
    else setStep("notfound");
  };

  const openReceipt = () => {
    const city = CITIES.find((c) => c.id === record.city) || { name: record.city, dateRange: "", venue: "" };
    const regId = String(record.id || "").padStart(5, "0");
    const safeName = record.full_name.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-");

    const wrap = document.createElement("div");
    wrap.style.cssText = "position:fixed;left:-9999px;top:0;z-index:-1;width:560px;padding:30px;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;box-sizing:border-box;";
    wrap.innerHTML = `
      <div style="background:#fff;width:500px;border-radius:14px;overflow:hidden;box-shadow:0 6px 32px rgba(0,0,0,.14)">
        <div style="background:#cc0000;color:#fff;padding:22px 28px;display:flex;align-items:center;justify-content:space-between">
          <div>
            <div style="font-size:14px;font-weight:800;letter-spacing:2px">KITOTECH × HIKVISION</div>
            <div style="font-size:11px;opacity:.75;margin-top:3px;letter-spacing:.5px">Wakala Mkuu · Tanzania 2026</div>
          </div>
          <div style="font-size:30px;font-weight:900;letter-spacing:-2px;opacity:.9">HK</div>
        </div>
        <div style="padding:28px">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">
            <div style="width:48px;height:48px;background:#16a34a;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:700;flex-shrink:0">✓</div>
            <div>
              <div style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1.2px">Uthibitisho wa Usajili</div>
              <div style="font-size:17px;font-weight:700;color:#111;margin-top:3px">Umesajiliwa Kikamilifu</div>
            </div>
          </div>
          <div style="border-top:1px solid #eee;margin:16px 0"></div>
          <div style="margin-bottom:12px"><div style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:4px">Jina Kamili</div><div style="font-size:15px;font-weight:600;color:#111">${record.full_name}</div></div>
          <div style="margin-bottom:12px"><div style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:4px">Namba ya Simu</div><div style="font-size:15px;font-weight:600;color:#111">${record.phone}</div></div>
          <div style="margin-bottom:12px"><div style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:4px">Mkoa wa Mafunzo</div><div style="font-size:15px;font-weight:600;color:#111">${city.name}</div></div>
          <div style="margin-bottom:12px"><div style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:4px">Tarehe za Mafunzo</div><div style="font-size:15px;font-weight:600;color:#111">${city.dateRange} · 2026</div></div>
          <div style="margin-bottom:12px"><div style="font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:4px">Venue / Mahali</div><div style="font-size:15px;font-weight:600;color:#111">${city.venue}</div></div>
          <div style="border-top:1px solid #eee;margin:16px 0"></div>
          <div style="background:#fff8f8;border:1.5px solid #fca5a5;border-radius:10px;padding:18px;text-align:center">
            <div style="font-size:10px;color:#dc2626;text-transform:uppercase;letter-spacing:1.2px">Namba ya Usajili</div>
            <div style="font-size:34px;font-weight:800;color:#cc0000;letter-spacing:4px;margin-top:6px">#${regId}</div>
          </div>
        </div>
        <div style="background:#111;color:#666;text-align:center;padding:14px;font-size:11px">
          <span style="color:#aaa;font-weight:700">Kitotech Group Ltd</span> · Wakala Mkuu wa Hikvision Tanzania · © 2026
        </div>
      </div>`;
    document.body.appendChild(wrap);

    setTimeout(() => {
      html2canvas(wrap.firstElementChild, { scale: 2, useCORS: true, backgroundColor: "#f4f4f4" }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `Risiti-${safeName}-${regId}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        document.body.removeChild(wrap);
      });
    }, 120);
  };

  const RecordCard = () => {
    const city = CITIES.find((c) => c.id === record.city) || { name: record.city, dateRange: "" };
    const regId = String(record.id || "").padStart(5, "0");
    return (
      <div className="lkp-record">
        <div className="lkp-found-badge">
          <span className="lkp-chk">✓</span>
          <div>
            <div className="lkp-rec-label">Uthibitisho wa Usajili</div>
            <div className="lkp-rec-name">{record.full_name}</div>
          </div>
        </div>
        <div className="lkp-grid">
          <div className="lkp-cell"><div className="k">Mkoa</div><div className="v">{city.name}</div></div>
          <div className="lkp-cell"><div className="k">Tarehe</div><div className="v">{city.dateRange} · 2026</div></div>
          <div className="lkp-cell lkp-cell-full"><div className="k">Venue</div><div className="v">📍 {city.venue}</div></div>
          <div className="lkp-cell"><div className="k">Simu</div><div className="v">{record.phone}</div></div>
          <div className="lkp-cell"><div className="k">Namba ya Usajili</div><div className="v lkp-ref">#{regId}</div></div>
        </div>
        <button className="modal-btn" onClick={openReceipt}>
          ↓ &nbsp;Pakua Risiti (PNG)
        </button>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box lkp-box" onClick={(e) => e.stopPropagation()}>
        <button className="lkp-close-btn" onClick={onClose} aria-label="Funga">✕</button>

        {step === "search" && (<>
          <div className="modal-logo">
            <img src="assets/kitotech-horizontal.png" alt="Kitotech" style={{ height: 26 }} />
          </div>
          <h3 className="modal-title">Angalia Usajili Wako</h3>
          <p className="lkp-hint">Andika jina lako kama ulivyosajili</p>
          <div className="modal-fields">
            <input type="text" value={nameInput} autoFocus
              className={nameErr ? "err" : ""}
              placeholder="Jina Kamili  ·  mfano John Mwangi"
              onChange={(e) => { setNameInput(e.target.value); setNameErr(""); }}
              onKeyDown={(e) => e.key === "Enter" && searchByName()} />
            {nameErr && <div className="modal-err">{nameErr}</div>}
          </div>
          <button className="modal-btn" onClick={searchByName} disabled={loading}>
            {loading ? "Inatafuta..." : "Tafuta →"}
          </button>
        </>)}

        {(step === "found" || step === "verified") && record && (<>
          <div className="lkp-status-icon lkp-ok">✓</div>
          <h3 className="modal-title lkp-green">Imepatikana!</h3>
          <RecordCard />
        </>)}

        {step === "fallback" && (<>
          <div className="lkp-status-icon lkp-warn">?</div>
          <h3 className="modal-title">Jina Halikupatikana</h3>
          <p className="lkp-hint">Labda jina limekosewa kidogo. Thibitisha kwa namba ya simu na mkoa wako.</p>
          <div className="modal-fields">
            <input type="tel" value={phoneInput} autoFocus
              placeholder="Namba ya Simu  ·  +255 712 345 678"
              onChange={(e) => { setPhoneInput(e.target.value); setFallbackErr(""); }}
              onKeyDown={(e) => e.key === "Enter" && verifyByPhone()} />
            <select value={cityInput}
              onChange={(e) => { setCityInput(e.target.value); setFallbackErr(""); }}>
              <option value="">Chagua Mkoa</option>
              {CITIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name} · {c.dateRange}</option>
              ))}
            </select>
            {fallbackErr && <div className="modal-err">{fallbackErr}</div>}
          </div>
          <button className="modal-btn" onClick={verifyByPhone} disabled={loading}>
            {loading ? "Inathibitisha..." : "Thibitisha →"}
          </button>
          <button className="lkp-back-btn" onClick={() => setStep("search")}>← Rudi</button>
        </>)}

        {step === "notfound" && (<>
          <div className="lkp-status-icon lkp-bad">✗</div>
          <h3 className="modal-title">Hujasajiliwa</h3>
          <p className="lkp-hint">Hakuna rekodi inayolingana. Hakikisha uliingiza namba ya simu na mkoa sahihi.</p>
          <button className="modal-btn" onClick={() => setStep("fallback")}>← Jaribu Tena</button>
          <button className="lkp-back-btn" onClick={onClose}>Funga</button>
        </>)}
      </div>
    </div>
  );
}

// ============================================================
// Admin login modal
// ============================================================
function AdminModal({ onClose, onSuccess }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr]           = useState(null);
  const [busy, setBusy]         = useState(false);

  const login = async () => {
    setBusy(true); setErr(null);
    const { error } = await db.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { setErr("Barua pepe au nywila si sahihi."); return; }
    onSuccess();
  };

  const onKey = (e) => { if (e.key === "Enter") login(); };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-logo">
          <img src="assets/kitotech-horizontal.png" alt="Kitotech" style={{ height: 28 }} />
        </div>
        <h3 className="modal-title">Ingia kama Admin</h3>
        <div className="modal-fields">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onKey} placeholder="Barua pepe" autoFocus />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={onKey} placeholder="Nywila" />
        </div>
        {err && <div className="modal-err">{err}</div>}
        <button className="modal-btn" onClick={login} disabled={busy}>
          {busy ? "Inaingia..." : "Ingia"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Topbar
// ============================================================
function TopBar({ onDotsClick, adminReady }) {
  return (
    <header className="topbar">
      <div className="topbar-spacer" />
      <div className="brand-cluster">
        <img className="logo-kt" src="assets/kitotech-horizontal.png" alt="Kitotech Group Ltd" />
        <div className="x" />
        <img className="logo-hk" src="assets/hikvision-logo.jpg" alt="Hikvision" />
        <div className="meta">
          <div className="row1">Mafunzo Rasmi · Tanzania 2026</div>
          <div className="row2">Wakala Mkuu wa Hikvision Tanzania</div>
        </div>
      </div>
      <div className="topbar-end">
        <button className="dots-btn" onClick={onDotsClick} title="Admin">
          {adminReady ? <span className="admin-tag">Admin</span> : "···"}
        </button>
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

  // Auto-advance every 5s — only for image slides (not the video slide).
  useEffect(() => {
    if (!autoPlay || index === 0) return;
    const id = setInterval(() => {
      const i = CITIES.findIndex((c) => c.id === city.id);
      setCity(CITIES[(i + 1) % CITIES.length].id);
    }, 4000);
    return () => clearInterval(id);
  }, [city.id, autoPlay, index, setCity]);

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
              playsInline
              onEnded={next}
            />
          );
        }
        return (
          <img
            key={`img-${city.id}`}
            className="bg-image"
            src={slide.src}
            alt=""
          />
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
              <div className="t3">📍 {city.venue}</div>
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
function FormPanel({ form, setField, errors, onSubmit, submitting, fullCities, onLookupOpen }) {
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
            {CITIES.map((c) => {
              const full = fullCities && fullCities.has(c.id);
              return (
                <option key={c.id} value={c.id} disabled={full}>
                  {c.name} · {c.dateRange}{full ? " · Imejaa" : ""}
                </option>
              );
            })}
          </select>
          {errors.city && <div className="err-msg">{errors.city}</div>}
        </div>
      </div>

      <button type="button" className="btn-primary" onClick={onSubmit} disabled={submitting}>
        {submitting ? "Inatuma..." : "ANGALIA RATIBA"}
      </button>

      <div className="form-foot-line">
        Umeshajisajili awali? <span className="link" onClick={onLookupOpen}>Angalia usajili wako →</span>
      </div>

      <div className="social-row">
        <a href="https://www.instagram.com/kitotech_?igsh=MTFoc2hyYng5dDJ4Nw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor"/></svg>
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
          <div className="sched-venue">📍 {city.venue}</div>
          {rows.map((r) => (
            <div key={r.date} className={`sched-row ${r.type === "travel" ? "travel" : ""}`}>
              <div>
                <div className="dt">{(() => { const [,, d] = r.date.split("-"); return `Juni ${parseInt(d)}`; })()}</div>
                <div className="day">{r.day}</div>
              </div>
              <div className="act">{r.activity}</div>
              <div className={`pill ${r.type === "training" ? "training" : "travel-p"}`}>
                {r.type === "training" ? <><span>Mafunzo</span><span className="pill-time">09:00 — 17:00</span></> : "Safari"}
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
          <div className="cell full"><div className="k">Venue</div><div className="v">{city.venue}</div></div>
        </div>

        <div className="success-next">
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
  const initial = { fullName: "", phone: "", city: "" };
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [visualCityId, setVisualCityId] = useState(CITIES[0].id);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminReady, setAdminReady]         = useState(false);
  const [showLookup, setShowLookup]         = useState(false);
  // cityCounts: { moshi: 23, arusha: 50, ... }
  const [cityCounts, setCityCounts]         = useState({});
  // slotsModal: false=hidden | null=all cities full | CITIES object=specific city full
  const [slotsModal, setSlotsModal]         = useState(false);

  const fetchCityCounts = async () => {
    const counts = {};
    await Promise.all(CITIES.map(async (c) => {
      const { count } = await db
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("city", c.id);
      counts[c.id] = count ?? 0;
    }));
    setCityCounts(counts);
    return counts;
  };

  useEffect(() => {
    fetchCityCounts().then((counts) => {
      const allFull = CITIES.every((c) => (counts[c.id] ?? 0) >= getCityMax(c.id));
      if (allFull) setSlotsModal(null);
    });
  }, []);

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

    // Re-check the selected city's count right before inserting (race condition guard)
    const { count: cityCount } = await db
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("city", form.city);

    const updatedCounts = { ...cityCounts, [form.city]: cityCount ?? cityCounts[form.city] ?? 0 };
    setCityCounts(updatedCounts);

    if ((cityCount ?? 0) >= getCityMax(form.city)) {
      const fullCity = CITIES.find((c) => c.id === form.city) || null;
      const allFull = CITIES.every((c) => (updatedCounts[c.id] ?? 0) >= getCityMax(c.id));
      setSlotsModal(allFull ? null : fullCity);
      setSubmitting(false);
      return;
    }

    const { error } = await db.from("registrations").insert({
      full_name: form.fullName,
      phone:     form.phone,
      city:      form.city,
    });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") {
        setErrors({ phone: "Nambari hii ya simu imeshasajiliwa. Kama una tatizo wasiliana nasi." });
      } else {
        setErrors({ phone: "Hitilafu ya mtandao. Jaribu tena." });
      }
      return;
    }

    // Update local count for this city after successful insert
    setCityCounts((prev) => ({ ...prev, [form.city]: (prev[form.city] ?? 0) + 1 }));
    setSubmitted(true);
    setVisualCityId(form.city);
  };

  const reset = () => {
    setForm(initial);
    setErrors({});
    setSubmitted(false);
    setVisualCityId(CITIES[0].id);
  };

  const visualCity = CITIES.find((c) => c.id === visualCityId) || CITIES[0];
  const visualIndex = CITIES.findIndex((c) => c.id === visualCity.id);
  const submittedCity = CITIES.find((c) => c.id === form.city) || CITIES[0];

  const setVisualCity = (id) => {
    setVisualCityId(id);
    if (!form.city) setField("city", id);
  };

  const handleAdminSuccess = () => {
    setShowAdminModal(false);
    setAdminReady(true);
    setTimeout(() => { window.location.href = "Admin.html"; }, 600);
  };

  const fullCities = useMemo(
    () => new Set(CITIES.filter((c) => (cityCounts[c.id] ?? 0) >= getCityMax(c.id)).map((c) => c.id)),
    [cityCounts]
  );

  return (
    <div className="stage" data-screen-label="Registration">
      {slotsModal !== false && (
        <SlotsFullModal city={slotsModal} onClose={() => setSlotsModal(false)} />
      )}
      {showLookup && <LookupModal onClose={() => setShowLookup(false)} />}
      {showAdminModal && (
        <AdminModal onClose={() => setShowAdminModal(false)} onSuccess={handleAdminSuccess} />
      )}
      <TopBar onDotsClick={() => setShowAdminModal(true)} adminReady={adminReady} />
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
            : <FormPanel form={form} setField={setField} errors={errors} onSubmit={submit} submitting={submitting} fullCities={fullCities} onLookupOpen={() => setShowLookup(true)} />
          }
        </div>
      </div>
      <footer className="legal">
        <div>© 2026 Kitotech Group Ltd · Wakala Mkuu wa Hikvision Tanzania</div>
        <div className="right">
          <span>support@kitotech.co.tz</span>
          <span>+255 750 238 187</span>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
