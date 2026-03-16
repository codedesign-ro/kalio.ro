import { useState } from "react";
import Layout from "../components/Layout";

// ─── DATA ────────────────────────────────────────────────────────────────────

const COLORS = [
{ id: "alb", label: "Alb Mat", hex: "#F5F5F0" },
{ id: "gri", label: "Gri Antracit", hex: "#3D3D3D" },
{ id: "negru", label: "Negru Mat", hex: "#1A1A1A" },
{ id: "stejar", label: "Stejar Natural", hex: "#C19A6B" },
{ id: "nuc", label: "Nuc Inchis", hex: "#6B4C2A" },
{ id: "verde", label: "Verde Salvie", hex: "#7D9B76" },
{ id: "bej", label: "Bej Cald", hex: "#E8DCC8" },
{ id: "albastru", label: "Albastru Navy", hex: "#2C3E6B" },
];

const FRONTS = [
{ id: "mat", label: "Mat" },
{ id: "lucios", label: "Lucios" },
{ id: "texturat", label: "Texturat" },
{ id: "lemn", label: "Lemn" },
];

const HANDLES = [
{ id: "bare", label: "Bare Metalice" },
{ id: "rotunde", label: "Butoni Rotunzi" },
{ id: "ingropat", label: "Fără Mâner" },
{ id: "clasic", label: "Mâner Clasic" },
];

const DRAWERS = [
{ id: "standard", label: "Standard" },
{ id: "pan", label: "Tip Pan" },
{ id: "fara", label: "Fără Sertare" },
];

const HARDWARE = [
{ id: "blum", label: "Blum Premium" },
{ id: "standard", label: "Standard" },
];

const MODULE_TYPES = [
{ id: "base", label: "Corp de Jos", icon: "▭", defaultW: 60, defaultH: 85, defaultD: 60, pricePerUnit: 280 },
{ id: "wall", label: "Corp de Sus", icon: "▭", defaultW: 60, defaultH: 70, defaultD: 35, pricePerUnit: 220 },
{ id: "tall", label: "Corp Înalt", icon: "▯", defaultW: 60, defaultH: 210, defaultD: 60, pricePerUnit: 420 },
{ id: "island", label: "Insulă", icon: "⬜", defaultW: 120, defaultH: 90, defaultD: 80, pricePerUnit: 650 },
];

const PRICE_MULTIPLIERS = {
front: { mat: 1, lucios: 1.15, texturat: 1.1, lemn: 1.2 },
handles: { bare: 1, rotunde: 1, ingropat: 0.95, clasic: 1.05 },
hardware: { blum: 1.2, standard: 1 },
drawers: { standard: 1, pan: 1.1, fara: 0.9 },
};

function calcPrice(modules, options) {
if (modules.length === 0) return 0;
const base = modules.reduce((sum, m) => {
const type = MODULE_TYPES.find(t => t.id === m.type);
const sizeMultiplier = (m.width / type.defaultW) * (m.height / type.defaultH);
return sum + type.pricePerUnit * Math.max(0.8, sizeMultiplier);
}, 0);
const mult =
(PRICE_MULTIPLIERS.front[options.front] || 1) *
(PRICE_MULTIPLIERS.handles[options.handles] || 1) *
(PRICE_MULTIPLIERS.hardware[options.hardware] || 1) *
(PRICE_MULTIPLIERS.drawers[options.drawers] || 1);
return Math.round(base * mult);
}

// ─── 2D PREVIEW ──────────────────────────────────────────────────────────────

function KitchenPreview({ modules, options }) {
const color = COLORS.find(c => c.id === options.color) || COLORS[0];
const SCALE = 2.8;
const CANVAS_H = 320;
const FLOOR_Y = CANVAS_H - 40;

const baseModules = modules.filter(m => m.type === "base" || m.type === "island");
const wallModules = modules.filter(m => m.type === "wall");
const tallModules = modules.filter(m => m.type === "tall");

// layout: tall units on left, then base units, island separate
let xCursor = 20;
const placed = [];

tallModules.forEach(m => {
placed.push({ ...m, x: xCursor, y: FLOOR_Y - m.height * SCALE, w: m.width * SCALE, h: m.height * SCALE });
xCursor += m.width * SCALE + 4;
});

baseModules.filter(m => m.type === "base").forEach(m => {
placed.push({ ...m, x: xCursor, y: FLOOR_Y - m.height * SCALE, w: m.width * SCALE, h: m.height * SCALE });
xCursor += m.width * SCALE + 4;
});

// Wall modules above base modules
let wxCursor = tallModules.reduce((s, m) => s + m.width * SCALE + 4, 20);
wallModules.forEach(m => {
placed.push({ ...m, x: wxCursor, y: FLOOR_Y - 85 * SCALE - m.height * SCALE - 20, w: m.width * SCALE, h: m.height * SCALE });
wxCursor += m.width * SCALE + 4;
});

// Island floats separately
const islands = modules.filter(m => m.type === "island");
islands.forEach((m, i) => {
placed.push({ ...m, x: xCursor + i * (m.width * SCALE + 20), y: FLOOR_Y - m.height * SCALE, w: m.width * SCALE, h: m.height * SCALE });
xCursor += m.width * SCALE + 24;
});

const totalWidth = placed.reduce((max, m) => Math.max(max, m.x + m.w), 0) + 20;
const svgWidth = Math.max(totalWidth, 500);

function getFrontPattern(moduleType) {
if (options.front === "lemn") return "url(#wood)";
if (options.front === "texturat") return "url(#texture)";
return color.hex;
}

function getHandleEl(m) {
if (options.handles === "ingropat") return null;
const cx = m.x + m.w / 2;
const cy = m.y + m.h * 0.65;
if (options.handles === "bare") {
return <rect key={`h-${m.id}`} x={cx - m.w * 0.3} y={cy - 3} width={m.w * 0.6} height={6} rx={3} fill="#aaa"/>;
}
if (options.handles === "rotunde") {
return <circle key={`h-${m.id}`} cx={cx} cy={cy} r={5} fill="#aaa"/>;
}
return <rect key={`h-${m.id}`} x={cx - 3} y={m.y + m.h * 0.5} width={6} height={m.h * 0.3} rx={2} fill="#aaa"/>;
}

function getDrawerLines(m) {
if (options.drawers === "fara" || m.type === "wall" || m.type === "tall") return null;
const lines = options.drawers === "pan" ? 2 : 3;
return Array.from({ length: lines }).map((_, i) => (
<line key={`d-${m.id}-${i}`}
x1={m.x + 4} y1={m.y + (m.h / (lines + 1)) * (i + 1)}
x2={m.x + m.w - 4} y2={m.y + (m.h / (lines + 1)) * (i + 1)}
stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" strokeDasharray={options.drawers === "pan" ? "none" : "4,2"}
/>
));
}

const isLight = ["alb", "bej"].includes(options.color);
const strokeColor = isLight ? "#ccc" : "rgba(255,255,255,0.15)";
const shadowColor = isLight ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.3)";

return (
<div style={{ background: "#f8f8f6", borderRadius: "16px", overflow: "hidden", border: "1px solid #eee" }}>
{/* Room background */}
<svg width="100%" viewBox={`0 0 ${svgWidth} ${CANVAS_H}`} style={{ display: "block" }}>
<defs>
<pattern id="wood" patternUnits="userSpaceOnUse" width="20" height="20">
<rect width="20" height="20" fill={color.hex}/>
<line x1="0" y1="0" x2="20" y2="0" stroke="rgba(0,0,0,0.06)" strokeWidth="3"/>
<line x1="0" y1="7" x2="20" y2="7" stroke="rgba(0,0,0,0.04)" strokeWidth="2"/>
<line x1="0" y1="14" x2="20" y2="14" stroke="rgba(0,0,0,0.04)" strokeWidth="2"/>
</pattern>
<pattern id="texture" patternUnits="userSpaceOnUse" width="8" height="8">
<rect width="8" height="8" fill={color.hex}/>
<rect width="4" height="4" fill="rgba(0,0,0,0.04)"/>
<rect x="4" y="4" width="4" height="4" fill="rgba(0,0,0,0.04)"/>
</pattern>
<filter id="shadow">
<feDropShadow dx="2" dy="2" stdDeviation="3" floodColor={shadowColor}/>
</filter>
</defs>


    {/* Wall */}
    <rect x="0" y="0" width={svgWidth} height={FLOOR_Y} fill="#FAFAF8"/>
    {/* Floor */}
    <rect x="0" y={FLOOR_Y} width={svgWidth} height={40} fill="#E8E4DC"/>
    {/* Floor line */}
    <line x1="0" y1={FLOOR_Y} x2={svgWidth} y2={FLOOR_Y} stroke="#D0CBC0" strokeWidth="2"/>
    {/* Wall tiles hint */}
    {Array.from({ length: Math.ceil(svgWidth / 60) }).map((_, i) => (
      <line key={i} x1={i * 60} y1={0} x2={i * 60} y2={FLOOR_Y} stroke="#F0EEE8" strokeWidth="1"/>
    ))}
    {Array.from({ length: Math.ceil(FLOOR_Y / 60) }).map((_, i) => (
      <line key={i} x1={0} y1={i * 60} x2={svgWidth} y2={i * 60} stroke="#F0EEE8" strokeWidth="1"/>
    ))}

    {placed.length === 0 && (
      <text x={svgWidth / 2} y={CANVAS_H / 2} textAnchor="middle" fill="#bbb" fontSize="14" fontFamily="DM Sans, sans-serif">
        Adaugă module pentru a vedea previzualizarea
      </text>
    )}

    {placed.map(m => (
      <g key={m.id} filter="url(#shadow)">
        {/* Cabinet body */}
        <rect x={m.x} y={m.y} width={m.w} height={m.h} rx={3}
          fill={getFrontPattern(m)} stroke={strokeColor} strokeWidth="1.5"/>
        {/* Top panel */}
        <rect x={m.x} y={m.y} width={m.w} height={6} rx={2}
          fill={isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.1)"}/>
        {/* Drawer lines */}
        {getDrawerLines(m)}
        {/* Handle */}
        {getHandleEl(m)}
        {/* Dimension label */}
        <text x={m.x + m.w / 2} y={m.y + m.h + 14} textAnchor="middle"
          fill="#999" fontSize="9" fontFamily="DM Sans, sans-serif">
          {m.width}cm
        </text>
      </g>
    ))}

    {/* Countertop over base modules */}
    {placed.filter(m => m.type === "base").length > 0 && (() => {
      const bases = placed.filter(m => m.type === "base");
      const minX = Math.min(...bases.map(m => m.x));
      const maxX = Math.max(...bases.map(m => m.x + m.w));
      return <rect x={minX - 2} y={FLOOR_Y - 85 * SCALE - 6} width={maxX - minX + 4} height={8} rx={2} fill="#D4C9B8"/>;
    })()}
  </svg>

  <div style={{ padding: "12px 16px", borderTop: "1px solid #eee", display: "flex", gap: "16px", flexWrap: "wrap" }}>
    {MODULE_TYPES.map(t => {
      const count = modules.filter(m => m.type === t.id).length;
      if (!count) return null;
      return (
        <span key={t.id} style={{ fontSize: "12px", color: "#666" }}>
          <span style={{ color: "var(--green)", fontWeight: 700 }}>{count}×</span> {t.label}
        </span>
      );
    })}
    {modules.length === 0 && <span style={{ fontSize: "12px", color: "#bbb" }}>Niciun modul adăugat</span>}
  </div>
</div>


);
}

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────

function StepIndicator({ current, steps }) {
return (
<div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "32px" }}>
{steps.map((step, i) => (
<div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
<div style={{
width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
fontSize: "13px", fontWeight: 700, transition: "all 0.3s",
background: i < current ? "var(-green)" : i === current ? "var(-green)" : "#eee",
color: i <= current ? "#fff" : "#999",
boxShadow: i === current ? "0 0 0 4px rgba(141,198,63,0.2)" : "none",
}}>
{i < current ? "✓" : i + 1}
</div>
<span style={{ fontSize: "11px", fontWeight: i === current ? 700 : 400, color: i === current ? "var(-green)" : "#999", whiteSpace: "nowrap" }}>
{step}
</span>
</div>
{i < steps.length - 1 && (
<div style={{ flex: 1, height: "2px", background: i < current ? "var(-green)" : "#eee", margin: "0 8px", marginBottom: "20px", transition: "background 0.3s" }}/>
)}
</div>
))}
</div>
);
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

const STEPS = ["Module", "Dimensiuni", "Personalizare", "Rezumat"];

export default function Configurator() {
const [step, setStep] = useState(0);
const [modules, setModules] = useState([]);
const [options, setOptions] = useState({
color: "alb", front: "mat", handles: "bare", drawers: "standard", hardware: "blum",
});
const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
const [submitted, setSubmitted] = useState(false);

const totalPrice = calcPrice(modules, options);

function addModule(type) {
const t = MODULE_TYPES.find(m => m.id === type);
setModules(prev => [...prev, {
id: Date.now(), type,
width: t.defaultW, height: t.defaultH, depth: t.defaultD,
}]);
}

function removeModule(id) { setModules(prev => prev.filter(m => m.id !== id)); }

function updateModule(id, field, value) {
setModules(prev => prev.map(m => m.id === id ? { ...m, [field]: Number(value) } : m));
}

function handleSubmit(e) {
e.preventDefault();
setSubmitted(true);
}

const canNext = step === 0 ? modules.length > 0 : true;

return (
<Layout title="Configurator Bucătărie -- Kalio">
<style>{`.config-tab { background: #f5f5f3; border: 1.5px solid transparent; border-radius: 10px; padding: 14px 16px; cursor: pointer; transition: all 0.2s; text-align: center; } .config-tab:hover { border-color: var(--green); background: #f0f9e0; } .config-tab.selected { border-color: var(--green); background: #f0f9e0; } .color-swatch { width: 36px; height: 36px; border-radius: 50%; cursor: pointer; border: 3px solid transparent; transition: all 0.2s; flex-shrink: 0; } .color-swatch:hover { transform: scale(1.1); } .color-swatch.selected { border-color: var(--green); box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--green); } .option-pill { background: #f5f5f3; border: 1.5px solid #eee; border-radius: 8px; padding: 10px 16px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; font-family: inherit; white-space: nowrap; } .option-pill:hover { border-color: var(--green); color: var(--green); } .option-pill.selected { background: #f0f9e0; border-color: var(--green); color: var(--green); font-weight: 700; } .module-item { background: #f5f5f3; border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; } .dim-input { width: 72px; padding: 6px 10px; border: 1.5px solid #e0e0e0; border-radius: 6px; font-size: 13px; font-family: inherit; text-align: center; outline: none; } .dim-input:focus { border-color: var(--green); } .summary-row { display: flex; justify-content: space-between; align-items: center; padding: "10px 0"; border-bottom: 1px solid #f0f0f0; } .form-input { width: 100%; padding: 12px 14px; border: 1.5px solid #e0e0e0; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s; } .form-input:focus { border-color: var(--green); } @media (max-width: 768px) { .config-layout { grid-template-columns: 1fr !important; } .preview-sticky { position: static !important; } }`}</style>


  {/* HERO */}
  <section style={{ paddingTop: "64px", background: "var(--gray)", padding: "100px 40px 60px" }}>
    <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <span style={{ background: "#f0f9e0", color: "var(--green)", fontSize: "12px", fontWeight: 700, padding: "5px 14px", borderRadius: "20px", letterSpacing: "1px", textTransform: "uppercase" }}>Configurator Bucătărie</span>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 50px)", fontWeight: 700, lineHeight: 1.15, margin: "16px 0 16px" }}>
        Creează-ți bucătăria{" "}
        <em style={{ color: "var(--green)", fontStyle: "italic" }}>perfectă.</em>
      </h1>
      <p style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto" }}>
        Configurează modulele, alege culorile și finisajele, și primește o ofertă personalizată instant.
      </p>
    </div>
  </section>

  {/* CONFIGURATOR */}
  <section style={{ padding: "48px 40px 80px", background: "#fff" }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

      <StepIndicator current={step} steps={STEPS} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "32px", alignItems: "start" }} className="config-layout">

        {/* LEFT PANEL */}
        <div>

          {/* STEP 0 -- MODULES */}
          {step === 0 && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Alege modulele</h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>Adaugă corpurile de care ai nevoie pentru bucătăria ta.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "32px" }}>
                {MODULE_TYPES.map(t => (
                  <button key={t.id} onClick={() => addModule(t.id)}
                    style={{ background: "#fff", border: "1.5px solid #eee", borderRadius: "12px", padding: "20px 16px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", fontFamily: "inherit" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--green)"; e.currentTarget.style.background = "#f0f9e0"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.background = "#fff"; }}>
                    <div style={{ fontSize: "28px", marginBottom: "10px" }}>
                      {t.id === "base" ? "🗄️" : t.id === "wall" ? "🔲" : t.id === "tall" ? "🚪" : "🏝️"}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>{t.label}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t.defaultW}×{t.defaultH}×{t.defaultD} cm</div>
                    <div style={{ fontSize: "12px", color: "var(--green)", marginTop: "6px", fontWeight: 600 }}>+ Adaugă</div>
                  </button>
                ))}
              </div>

              {modules.length > 0 && (
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px", color: "#333" }}>Module adăugate ({modules.length})</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {modules.map((m, i) => {
                      const t = MODULE_TYPES.find(mt => mt.id === m.type);
                      return (
                        <div key={m.id} className="module-item">
                          <div style={{ width: "32px", height: "32px", background: "#f0f9e0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                            {m.type === "base" ? "🗄️" : m.type === "wall" ? "🔲" : m.type === "tall" ? "🚪" : "🏝️"}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "13px", fontWeight: 700 }}>{t.label}</div>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{m.width}×{m.height}×{m.depth} cm</div>
                          </div>
                          <button onClick={() => removeModule(m.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: "18px", padding: "4px", lineHeight: 1 }}
                            onMouseEnter={e => e.currentTarget.style.color = "#e74c3c"}
                            onMouseLeave={e => e.currentTarget.style.color = "#ccc"}>×</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 1 -- DIMENSIONS */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Dimensiuni</h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>Ajustează dimensiunile fiecărui modul în centimetri.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {modules.map((m) => {
                  const t = MODULE_TYPES.find(mt => mt.id === m.type);
                  return (
                    <div key={m.id} style={{ background: "#f5f5f3", borderRadius: "12px", padding: "20px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>{m.type === "base" ? "🗄️" : m.type === "wall" ? "🔲" : m.type === "tall" ? "🚪" : "🏝️"}</span>
                        {t.label}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                        {[["Lățime (cm)", "width", 30, 300], ["Înălțime (cm)", "height", 30, 250], ["Adâncime (cm)", "depth", 20, 100]].map(([label, field, min, max]) => (
                          <div key={field}>
                            <label style={{ fontSize: "11px", fontWeight: 600, color: "#666", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
                            <input type="number" className="dim-input" value={m[field]} min={min} max={max}
                              onChange={e => updateModule(m.id, field, e.target.value)}
                              style={{ width: "100%" }}/>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2 -- CUSTOMIZATION */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Personalizare</h2>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "28px" }}>Alege finisajele și detaliile pentru bucătăria ta.</p>

              {/* COLOR */}
              <div style={{ marginBottom: "28px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666", marginBottom: "14px" }}>Culoare</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                  {COLORS.map(c => (
                    <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <div className={`color-swatch${options.color === c.id ? " selected" : ""}`}
                        style={{ background: c.hex, border: c.hex === "#F5F5F0" ? "2px solid #ddd" : "2px solid transparent" }}
                        onClick={() => setOptions(p => ({ ...p, color: c.id }))}/>
                      <span style={{ fontSize: "10px", color: "#888", textAlign: "center", maxWidth: "44px", lineHeight: 1.3 }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FRONTS */}
              <div style={{ marginBottom: "28px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666", marginBottom: "14px" }}>Tip Front</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {FRONTS.map(f => (
                    <button key={f.id} className={`option-pill${options.front === f.id ? " selected" : ""}`}
                      onClick={() => setOptions(p => ({ ...p, front: f.id }))}>{f.label}</button>
                  ))}
                </div>
              </div>

              {/* HANDLES */}
              <div style={{ marginBottom: "28px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666", marginBottom: "14px" }}>Mânere</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {HANDLES.map(h => (
                    <button key={h.id} className={`option-pill${options.handles === h.id ? " selected" : ""}`}
                      onClick={() => setOptions(p => ({ ...p, handles: h.id }))}>{h.label}</button>
                  ))}
                </div>
              </div>

              {/* DRAWERS */}
              <div style={{ marginBottom: "28px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666", marginBottom: "14px" }}>Sertare</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {DRAWERS.map(d => (
                    <button key={d.id} className={`option-pill${options.drawers === d.id ? " selected" : ""}`}
                      onClick={() => setOptions(p => ({ ...p, drawers: d.id }))}>{d.label}</button>
                  ))}
                </div>
              </div>

              {/* HARDWARE */}
              <div style={{ marginBottom: "28px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666", marginBottom: "14px" }}>Feronerie</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {HARDWARE.map(h => (
                    <button key={h.id} className={`option-pill${options.hardware === h.id ? " selected" : ""}`}
                      onClick={() => setOptions(p => ({ ...p, hardware: h.id }))}>{h.label}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 -- SUMMARY + FORM */}
          {step === 3 && (
            <div>
              {submitted ? (
                <div style={{ background: "#f0f9e0", border: "1.5px solid var(--green)", borderRadius: "16px", padding: "48px 32px", textAlign: "center" }}>
                  <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 700, marginBottom: "12px" }}>Configurație trimisă!</h3>
                  <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: "400px", margin: "0 auto 24px" }}>
                    Mulțumim! Echipa Kalio va analiza configurația ta și te va contacta în maxim 24 de ore cu o ofertă detaliată.
                  </p>
                  <button className="btn-primary" onClick={() => { setSubmitted(false); setStep(0); setModules([]); }}>
                    Configurație nouă
                  </button>
                </div>
              ) : (
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Rezumat & Ofertă</h2>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>Verifică configurația și trimite-ne datele tale pentru o ofertă personalizată.</p>

                  {/* Summary */}
                  <div style={{ background: "#f5f5f3", borderRadius: "14px", padding: "20px", marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666", marginBottom: "14px" }}>Configurația ta</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {modules.map(m => {
                        const t = MODULE_TYPES.find(mt => mt.id === m.type);
                        return (
                          <div key={m.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                            <span>{t.label} -- {m.width}×{m.height}×{m.depth} cm</span>
                            <span style={{ color: "var(--green)", fontWeight: 600 }}>~{Math.round(t.pricePerUnit * Math.max(0.8, (m.width / t.defaultW) * (m.height / t.defaultH)))} €</span>
                          </div>
                        );
                      })}
                      <div style={{ borderTop: "1px solid #ddd", paddingTop: "10px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span>Culoare: {COLORS.find(c => c.id === options.color)?.label}</span>
                        <span>Front: {FRONTS.find(f => f.id === options.front)?.label}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                        <span>Mânere: {HANDLES.find(h => h.id === options.handles)?.label}</span>
                        <span>Feronerie: {HARDWARE.find(h => h.id === options.hardware)?.label}</span>
                      </div>
                    </div>
                    <div style={{ borderTop: "2px solid #ddd", marginTop: "14px", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, fontSize: "15px" }}>Estimare preț total</span>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, color: "var(--green)" }}>~{totalPrice} €</span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#aaa", marginTop: "8px" }}>* Prețul este estimativ. Oferta finală va fi confirmată de echipa Kalio.</p>
                  </div>

                  {/* Contact Form */}
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>Datele tale de contact</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "6px" }}>Nume *</label>
                        <input className="form-input" type="text" placeholder="Numele tău" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                      </div>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "6px" }}>Email *</label>
                        <input className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "6px" }}>Telefon</label>
                      <input className="form-input" type="tel" placeholder="+40 7XX XXX XXX" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "6px" }}>Mesaj (opțional)</label>
                      <textarea className="form-input" placeholder="Detalii suplimentare despre proiectul tău..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={3} style={{ resize: "vertical" }}/>
                    </div>
                    <button type="submit" className="btn-primary" style={{ fontSize: "15px", padding: "14px", width: "100%" }}>
                      Trimite configurația →
                    </button>
                    <p style={{ fontSize: "11px", color: "#aaa", textAlign: "center" }}>Prin trimitere ești de acord cu prelucrarea datelor personale.</p>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          {!submitted && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)}
                  style={{ background: "none", border: "1.5px solid #ddd", borderRadius: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#333" }}>
                  ← Înapoi
                </button>
              ) : <div />}
              {step < STEPS.length - 1 && (
                <button onClick={() => canNext && setStep(s => s + 1)}
                  className="btn-primary"
                  style={{ opacity: canNext ? 1 : 0.4, cursor: canNext ? "pointer" : "not-allowed", padding: "12px 28px" }}>
                  Continuă →
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANEL -- PREVIEW */}
        <div style={{ position: "sticky", top: "84px" }} className="preview-sticky">
          <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666", marginBottom: "16px" }}>
              Previzualizare 2D
            </h3>
            <KitchenPreview modules={modules} options={options} />

            {modules.length > 0 && (
              <div style={{ marginTop: "16px", padding: "14px 16px", background: "#f0f9e0", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Estimare preț</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 700, color: "var(--green)" }}>~{totalPrice} €</div>
                </div>
                <div style={{ fontSize: "11px", color: "#888", maxWidth: "120px", textAlign: "right", lineHeight: 1.5 }}>
                  Preț estimativ, include toate opțiunile selectate
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  </section>
</Layout>


);
}
