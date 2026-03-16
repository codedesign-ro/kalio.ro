import { useState } from "react";
import Layout from "../components/Layout";

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
  { id: "ingropat", label: "Fara Maner" },
  { id: "clasic", label: "Maner Clasic" },
];

const DRAWERS = [
  { id: "standard", label: "Standard" },
  { id: "pan", label: "Tip Pan" },
  { id: "fara", label: "Fara Sertare" },
];

const HARDWARE = [
  { id: "blum", label: "Blum Premium" },
  { id: "standard", label: "Standard" },
];

const LAYOUTS = [
  { id: "straight", label: "Dreapta", icon: "---", desc: "Un singur perete", walls: ["main"] },
  { id: "lshape", label: "L-Shape", icon: "L", desc: "Doua pereti", walls: ["main", "right"] },
  { id: "ushape", label: "U-Shape", icon: "U", desc: "Trei pereti", walls: ["left", "main", "right"] },
];

const WALL_LABELS = {
  left: "Perete Stanga",
  main: "Perete Principal",
  right: "Perete Dreapta",
};

const MODULE_TYPES = [
  { id: "base", label: "Corp de Jos", emoji: "🗄️", defaultW: 60, defaultH: 85, defaultD: 60, pricePerUnit: 280 },
  { id: "wall", label: "Corp de Sus", emoji: "🔲", defaultW: 60, defaultH: 70, defaultD: 35, pricePerUnit: 220 },
  { id: "tall", label: "Corp Inalt", emoji: "🚪", defaultW: 60, defaultH: 210, defaultD: 60, pricePerUnit: 420 },
  { id: "island", label: "Insula", emoji: "🏝️", defaultW: 120, defaultH: 90, defaultD: 80, pricePerUnit: 650 },
];

const PRICE_MULTIPLIERS = {
  front: { mat: 1, lucios: 1.15, texturat: 1.1, lemn: 1.2 },
  handles: { bare: 1, rotunde: 1, ingropat: 0.95, clasic: 1.05 },
  hardware: { blum: 1.2, standard: 1 },
  drawers: { standard: 1, pan: 1.1, fara: 0.9 },
};

function calcPrice(walls, island, options) {
  const allModules = [...Object.values(walls).flat(), ...island];
  if (allModules.length === 0) return 0;
  const base = allModules.reduce((sum, m) => {
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

function FrontView({ modules, options }) {
  const color = COLORS.find(c => c.id === options.color) || COLORS[0];
  const isLight = ["alb", "bej"].includes(options.color);
  const SCALE = 2.2;
  const CANVAS_H = 280;
  const FLOOR_Y = CANVAS_H - 30;
  const bases = modules.filter(m => m.type === "base");
  const wallCabs = modules.filter(m => m.type === "wall");
  const talls = modules.filter(m => m.type === "tall");
  let xCursor = 16;
  const placed = [];
  talls.forEach(m => {
    placed.push({ ...m, x: xCursor, y: FLOOR_Y - m.height * SCALE, w: m.width * SCALE, h: m.height * SCALE, layer: "tall" });
    xCursor += m.width * SCALE + 6;
  });
  const baseStartX = xCursor;
  bases.forEach(m => {
    placed.push({ ...m, x: xCursor, y: FLOOR_Y - m.height * SCALE, w: m.width * SCALE, h: m.height * SCALE, layer: "base" });
    xCursor += m.width * SCALE + 6;
  });
  let wxCursor = baseStartX;
  wallCabs.forEach(m => {
    placed.push({ ...m, x: wxCursor, y: FLOOR_Y - 85 * SCALE - m.height * SCALE - 16, w: m.width * SCALE, h: m.height * SCALE, layer: "wall" });
    wxCursor += m.width * SCALE + 6;
  });
  const totalW = placed.reduce((max, m) => Math.max(max, m.x + m.w), 0) + 16;
  const svgW = Math.max(totalW, 320);
  const strokeColor = isLight ? "#ccc" : "rgba(255,255,255,0.12)";

  function getHandle(m) {
    if (options.handles === "ingropat") return null;
    const cx = m.x + m.w / 2;
    const cy = m.y + m.h * 0.6;
    if (options.handles === "bare") return <rect x={cx - m.w * 0.28} y={cy - 2.5} width={m.w * 0.56} height={5} rx={2.5} fill="#999" opacity={0.8} />;
    if (options.handles === "rotunde") return <circle cx={cx} cy={cy} r={4} fill="#999" opacity={0.8} />;
    return <rect x={cx - 2.5} y={m.y + m.h * 0.45} width={5} height={m.h * 0.28} rx={2} fill="#999" opacity={0.8} />;
  }

  function getDrawerLines(m) {
    if (options.drawers === "fara" || m.layer === "wall") return null;
    const count = options.drawers === "pan" ? 2 : 3;
    return Array.from({ length: count }).map((_, i) => (
      <line key={i} x1={m.x + 5} y1={m.y + (m.h / (count + 1)) * (i + 1)} x2={m.x + m.w - 5} y2={m.y + (m.h / (count + 1)) * (i + 1)} stroke={isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"} strokeWidth={1.5} />
    ));
  }

  function getFill() {
    if (options.front === "lemn") return "url(#wood-fv)";
    if (options.front === "texturat") return "url(#tex-fv)";
    return color.hex;
  }

  if (modules.length === 0) {
    return (
      <div style={{ background: "#f8f8f6", borderRadius: "12px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #ddd" }}>
        <span style={{ fontSize: "12px", color: "#bbb" }}>Niciun modul adaugat</span>
      </div>
    );
  }

  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${CANVAS_H}`} style={{ display: "block", background: "#F9F8F6", borderRadius: "12px" }}>
      <defs>
        <pattern id="wood-fv" patternUnits="userSpaceOnUse" width="18" height="18">
          <rect width="18" height="18" fill={color.hex} />
          <line x1="0" y1="0" x2="18" y2="0" stroke="rgba(0,0,0,0.07)" strokeWidth="3" />
          <line x1="0" y1="7" x2="18" y2="7" stroke="rgba(0,0,0,0.04)" strokeWidth="2" />
        </pattern>
        <pattern id="tex-fv" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill={color.hex} />
          <rect width="4" height="4" fill="rgba(0,0,0,0.05)" />
          <rect x="4" y="4" width="4" height="4" fill="rgba(0,0,0,0.05)" />
        </pattern>
        <filter id="cab-shadow"><feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.1)" /></filter>
      </defs>
      <rect x="0" y="0" width={svgW} height={FLOOR_Y} fill="#FAFAF8" />
      <rect x="0" y={FLOOR_Y} width={svgW} height={30} fill="#E8E3D8" />
      <line x1="0" y1={FLOOR_Y} x2={svgW} y2={FLOOR_Y} stroke="#D0CAB8" strokeWidth={2} />
      {bases.length > 0 && (() => {
        const bs = placed.filter(p => p.layer === "base");
        if (!bs.length) return null;
        const minX = Math.min(...bs.map(p => p.x));
        const maxX = Math.max(...bs.map(p => p.x + p.w));
        return <rect x={minX - 2} y={FLOOR_Y - 85 * SCALE - 5} width={maxX - minX + 4} height={7} rx={2} fill="#C8BBAA" />;
      })()}
      {placed.map(m => (
        <g key={m.id} filter="url(#cab-shadow)">
          <rect x={m.x} y={m.y} width={m.w} height={m.h} rx={3} fill={getFill()} stroke={strokeColor} strokeWidth={1.5} />
          <rect x={m.x} y={m.y} width={m.w} height={5} rx={2} fill={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)"} />
          {getDrawerLines(m)}
          {getHandle(m)}
          <text x={m.x + m.w / 2} y={m.y + m.h + 12} textAnchor="middle" fill="#aaa" fontSize={8} fontFamily="DM Sans, sans-serif">{m.width}cm</text>
        </g>
      ))}
    </svg>
  );
}

function TopView({ walls, island, layout, options }) {
  const color = COLORS.find(c => c.id === options.color) || COLORS[0];
  const SCALE = 1.8;
  const W = 500;
  const H = 400;
  const DEPTH = 60 * SCALE;
  const isLight = ["alb", "bej"].includes(options.color);
  const cabColor = color.hex;
  const strokeColor = isLight ? "#ccc" : "rgba(255,255,255,0.15)";
  const activeLayout = LAYOUTS.find(l => l.id === layout);
  const hasLeft = activeLayout.walls.includes("left");
  const hasRight = activeLayout.walls.includes("right");
  const mainModules = walls.main || [];
  const leftModules = walls.left || [];
  const rightModules = walls.right || [];
  const islandModules = island || [];
  const MARGIN = 40;
  const ROOM_X = MARGIN + (hasLeft ? DEPTH + 8 : 0);
  const ROOM_Y = MARGIN;
  const ROOM_W = W - MARGIN * 2 - (hasLeft ? DEPTH + 8 : 0) - (hasRight ? DEPTH + 8 : 0);
  const ROOM_H = H - MARGIN * 2;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", background: "#F9F8F6", borderRadius: "12px" }}>
      <rect x={ROOM_X} y={ROOM_Y} width={ROOM_W} height={ROOM_H} fill="#F0EDE6" rx={2} />
      <rect x={ROOM_X} y={ROOM_Y} width={ROOM_W} height={DEPTH} fill="#E0DBD0" />
      {(() => {
        let xCur = ROOM_X + 4;
        return mainModules.map((m) => {
          const x = xCur;
          xCur += m.width * SCALE + 4;
          return (
            <g key={m.id}>
              <rect x={x} y={ROOM_Y + 2} width={m.width * SCALE} height={DEPTH - 4} rx={2} fill={cabColor} stroke={strokeColor} strokeWidth={1.5} />
              <text x={x + (m.width * SCALE) / 2} y={ROOM_Y + DEPTH / 2 + 4} textAnchor="middle" fill={isLight ? "#666" : "#ccc"} fontSize={8} fontFamily="DM Sans,sans-serif">{m.width}</text>
            </g>
          );
        });
      })()}
      {hasLeft && (
        <>
          <rect x={MARGIN} y={ROOM_Y} width={DEPTH} height={ROOM_H} fill="#E0DBD0" />
          {(() => {
            let yCur = ROOM_Y + 4;
            return leftModules.map((m) => {
              const y = yCur;
              yCur += m.width * SCALE + 4;
              return (
                <g key={m.id}>
                  <rect x={MARGIN + 2} y={y} width={DEPTH - 4} height={m.width * SCALE} rx={2} fill={cabColor} stroke={strokeColor} strokeWidth={1.5} />
                  <text x={MARGIN + DEPTH / 2} y={y + (m.width * SCALE) / 2 + 4} textAnchor="middle" fill={isLight ? "#666" : "#ccc"} fontSize={8} fontFamily="DM Sans,sans-serif">{m.width}</text>
                </g>
              );
            });
          })()}
        </>
      )}
      {hasRight && (
        <>
          <rect x={ROOM_X + ROOM_W} y={ROOM_Y} width={DEPTH} height={ROOM_H} fill="#E0DBD0" />
          {(() => {
            let yCur = ROOM_Y + 4;
            return rightModules.map((m) => {
              const y = yCur;
              yCur += m.width * SCALE + 4;
              return (
                <g key={m.id}>
                  <rect x={ROOM_X + ROOM_W + 2} y={y} width={DEPTH - 4} height={m.width * SCALE} rx={2} fill={cabColor} stroke={strokeColor} strokeWidth={1.5} />
                  <text x={ROOM_X + ROOM_W + DEPTH / 2} y={y + (m.width * SCALE) / 2 + 4} textAnchor="middle" fill={isLight ? "#666" : "#ccc"} fontSize={8} fontFamily="DM Sans,sans-serif">{m.width}</text>
                </g>
              );
            });
          })()}
        </>
      )}
      {islandModules.map((m, i) => {
        const ix = ROOM_X + ROOM_W / 2 - (m.width * SCALE) / 2 + i * 20;
        const iy = ROOM_Y + ROOM_H / 2 - (m.depth * SCALE) / 2 + i * 20;
        return (
          <g key={m.id}>
            <rect x={ix} y={iy} width={m.width * SCALE} height={m.depth * SCALE} rx={4} fill={cabColor} stroke="#8DC63F" strokeWidth={2} />
            <text x={ix + (m.width * SCALE) / 2} y={iy + (m.depth * SCALE) / 2 + 4} textAnchor="middle" fill={isLight ? "#555" : "#eee"} fontSize={9} fontFamily="DM Sans,sans-serif" fontWeight="bold">Insula</text>
          </g>
        );
      })}
      <text x={ROOM_X + ROOM_W / 2} y={ROOM_Y + DEPTH / 2 + 4} textAnchor="middle" fill="#888" fontSize={9} fontFamily="DM Sans,sans-serif" fontWeight="700">PERETE PRINCIPAL</text>
      {hasLeft && <text x={MARGIN + DEPTH / 2} y={ROOM_Y + ROOM_H / 2} textAnchor="middle" fill="#888" fontSize={8} fontFamily="DM Sans,sans-serif" fontWeight="700" transform={`rotate(-90, ${MARGIN + DEPTH / 2}, ${ROOM_Y + ROOM_H / 2})`}>STANGA</text>}
      {hasRight && <text x={ROOM_X + ROOM_W + DEPTH / 2} y={ROOM_Y + ROOM_H / 2} textAnchor="middle" fill="#888" fontSize={8} fontFamily="DM Sans,sans-serif" fontWeight="700" transform={`rotate(90, ${ROOM_X + ROOM_W + DEPTH / 2}, ${ROOM_Y + ROOM_H / 2})`}>DREAPTA</text>}
    </svg>
  );
}

function StepIndicator({ current, steps }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 700, transition: "all 0.3s",
              background: i <= current ? "var(--green)" : "#eee",
              color: i <= current ? "#fff" : "#999",
              boxShadow: i === current ? "0 0 0 4px rgba(141,198,63,0.2)" : "none",
            }}>
              {i < current ? "v" : i + 1}
            </div>
            <span style={{ fontSize: "11px", fontWeight: i === current ? 700 : 400, color: i === current ? "var(--green)" : "#999", whiteSpace: "nowrap" }}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: "2px", background: i < current ? "var(--green)" : "#eee", margin: "0 8px", marginBottom: "20px", transition: "background 0.3s" }} />
          )}
        </div>
      ))}
    </div>
  );
}

const STEPS = ["Layout", "Module", "Dimensiuni", "Personalizare", "Rezumat"];

export default function Configurator() {
  const [step, setStep] = useState(0);
  const [layout, setLayout] = useState("straight");
  const [activeWall, setActiveWall] = useState("main");
  const [walls, setWalls] = useState({ left: [], main: [], right: [] });
  const [island, setIsland] = useState([]);
  const [options, setOptions] = useState({ color: "alb", front: "mat", handles: "bare", drawers: "standard", hardware: "blum" });
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [previewMode, setPreviewMode] = useState("front");

  const activeLayout = LAYOUTS.find(l => l.id === layout);
  const allModules = [...Object.values(walls).flat(), ...island];
  const totalPrice = calcPrice(walls, island, options);

  function addModule(type, target) {
    const t = MODULE_TYPES.find(m => m.id === type);
    const mod = { id: Date.now(), type, width: t.defaultW, height: t.defaultH, depth: t.defaultD };
    if (target === "island") { setIsland(prev => [...prev, mod]); }
    else { setWalls(prev => ({ ...prev, [target]: [...prev[target], mod] })); }
  }

  function removeModule(id, target) {
    if (target === "island") { setIsland(prev => prev.filter(m => m.id !== id)); }
    else { setWalls(prev => ({ ...prev, [target]: prev[target].filter(m => m.id !== id) })); }
  }

  function updateModule(id, field, value, target) {
    if (target === "island") { setIsland(prev => prev.map(m => m.id === id ? { ...m, [field]: Number(value) } : m)); }
    else { setWalls(prev => ({ ...prev, [target]: prev[target].map(m => m.id === id ? { ...m, [field]: Number(value) } : m) })); }
  }

  function handleSubmit(e) { e.preventDefault(); setSubmitted(true); }

  const canNext = step === 1 ? allModules.length > 0 : true;
  const activeWalls = activeLayout.walls;

  return (
    <Layout title="Configurator Bucatarie - Kalio">
      <style>{`
        .cfg-tab { background: #f5f5f3; border: 1.5px solid transparent; border-radius: 10px; padding: 14px 16px; cursor: pointer; transition: all 0.2s; text-align: center; font-family: inherit; width: 100%; }
        .cfg-tab:hover { border-color: var(--green); background: #f0f9e0; }
        .cfg-tab.selected { border-color: var(--green); background: #f0f9e0; }
        .wall-tab { padding: 8px 16px; border-radius: 8px; border: 1.5px solid #eee; background: #fff; cursor: pointer; font-size: 13px; font-weight: 600; font-family: inherit; transition: all 0.2s; }
        .wall-tab:hover { border-color: var(--green); color: var(--green); }
        .wall-tab.active { background: var(--green); border-color: var(--green); color: #fff; }
        .option-pill { background: #f5f5f3; border: 1.5px solid #eee; border-radius: 8px; padding: 10px 16px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; font-family: inherit; white-space: nowrap; }
        .option-pill:hover { border-color: var(--green); color: var(--green); }
        .option-pill.selected { background: #f0f9e0; border-color: var(--green); color: var(--green); font-weight: 700; }
        .color-swatch { width: 34px; height: 34px; border-radius: 50%; cursor: pointer; border: 3px solid transparent; transition: all 0.2s; flex-shrink: 0; }
        .color-swatch:hover { transform: scale(1.1); }
        .color-swatch.selected { border-color: var(--green); box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--green); }
        .view-btn { padding: 6px 14px; border-radius: 6px; border: 1.5px solid #eee; background: #fff; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
        .view-btn.active { background: var(--green); border-color: var(--green); color: #fff; }
        .dim-input { width: 100%; padding: 8px 10px; border: 1.5px solid #e0e0e0; border-radius: 6px; font-size: 13px; font-family: inherit; text-align: center; outline: none; }
        .dim-input:focus { border-color: var(--green); }
        .form-input { width: 100%; padding: 12px 14px; border: 1.5px solid #e0e0e0; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s; }
        .form-input:focus { border-color: var(--green); }
        @media (max-width: 768px) { .cfg-layout { grid-template-columns: 1fr !important; } .preview-col { position: static !important; } }
      `}</style>

      <section style={{ background: "var(--gray)", padding: "100px 40px 60px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ background: "#f0f9e0", color: "var(--green)", fontSize: "12px", fontWeight: 700, padding: "5px 14px", borderRadius: "20px", letterSpacing: "1px", textTransform: "uppercase" }}>Configurator Bucatarie</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 50px)", fontWeight: 700, lineHeight: 1.15, margin: "16px 0 16px" }}>
            Creaza-ti bucataria <em style={{ color: "var(--green)", fontStyle: "italic" }}>perfecta.</em>
          </h1>
          <p style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto" }}>
            Alege layout-ul, adauga modulele, personalizeaza si primeste o oferta instant.
          </p>
        </div>
      </section>

      <section style={{ padding: "48px 40px 80px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <StepIndicator current={step} steps={STEPS} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "32px", alignItems: "start" }} className="cfg-layout">

            <div>
              {step === 0 && (
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Alege layout-ul bucatariei</h2>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "28px" }}>Cum sunt dispuse corpurile in spatiul tau?</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
                    {LAYOUTS.map(l => (
                      <button key={l.id} className={`cfg-tab${layout === l.id ? " selected" : ""}`} onClick={() => setLayout(l.id)}>
                        <div style={{ fontSize: "28px", fontWeight: 900, color: layout === l.id ? "var(--green)" : "#ccc", fontFamily: "monospace", marginBottom: "10px" }}>{l.icon}</div>
                        <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>{l.label}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{l.desc}</div>
                      </button>
                    ))}
                  </div>
                  <div style={{ background: "#f5f5f3", borderRadius: "14px", padding: "24px", textAlign: "center" }}>
                    <svg width="100%" viewBox="0 0 300 180" style={{ maxWidth: "260px" }}>
                      {layout === "straight" && <>
                        <rect x="40" y="30" width="220" height="35" rx="4" fill="#8DC63F" opacity="0.85" />
                        <text x="150" y="53" textAnchor="middle" fill="white" fontSize="11" fontFamily="DM Sans" fontWeight="700">Perete Principal</text>
                        <rect x="40" y="65" width="220" height="95" rx="4" fill="#f0f9e0" stroke="#8DC63F" strokeWidth="1.5" strokeDasharray="4,3" />
                        <text x="150" y="118" textAnchor="middle" fill="#8DC63F" fontSize="12" fontFamily="DM Sans">Spatiu liber</text>
                      </>}
                      {layout === "lshape" && <>
                        <rect x="40" y="30" width="220" height="35" rx="4" fill="#8DC63F" opacity="0.85" />
                        <text x="150" y="53" textAnchor="middle" fill="white" fontSize="10" fontFamily="DM Sans" fontWeight="700">Perete Principal</text>
                        <rect x="225" y="65" width="35" height="100" rx="4" fill="#8DC63F" opacity="0.6" />
                        <text x="242" y="120" textAnchor="middle" fill="white" fontSize="9" fontFamily="DM Sans" fontWeight="700" transform="rotate(90,242,120)">Dreapta</text>
                        <rect x="40" y="65" width="185" height="100" rx="4" fill="#f0f9e0" stroke="#8DC63F" strokeWidth="1.5" strokeDasharray="4,3" />
                      </>}
                      {layout === "ushape" && <>
                        <rect x="40" y="30" width="220" height="35" rx="4" fill="#8DC63F" opacity="0.85" />
                        <text x="150" y="53" textAnchor="middle" fill="white" fontSize="10" fontFamily="DM Sans" fontWeight="700">Perete Principal</text>
                        <rect x="40" y="65" width="35" height="100" rx="4" fill="#8DC63F" opacity="0.6" />
                        <text x="57" y="120" textAnchor="middle" fill="white" fontSize="9" fontFamily="DM Sans" fontWeight="700" transform="rotate(-90,57,120)">Stanga</text>
                        <rect x="225" y="65" width="35" height="100" rx="4" fill="#8DC63F" opacity="0.6" />
                        <text x="242" y="120" textAnchor="middle" fill="white" fontSize="9" fontFamily="DM Sans" fontWeight="700" transform="rotate(90,242,120)">Dreapta</text>
                        <rect x="75" y="65" width="150" height="100" rx="4" fill="#f0f9e0" stroke="#8DC63F" strokeWidth="1.5" strokeDasharray="4,3" />
                      </>}
                    </svg>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>
                      {layout === "straight" && "Un singur perete de corpuri"}
                      {layout === "lshape" && "Doua pereti - perete principal si dreapta"}
                      {layout === "ushape" && "Trei pereti - stanga, principal si dreapta"}
                    </p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Adauga module</h2>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>Selecteaza peretele si adauga corpurile dorite.</p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
                    {activeWalls.map(w => (
                      <button key={w} className={`wall-tab${activeWall === w ? " active" : ""}`} onClick={() => setActiveWall(w)}>
                        {WALL_LABELS[w]}
                        {walls[w].length > 0 && <span style={{ marginLeft: "6px", background: activeWall === w ? "rgba(255,255,255,0.3)" : "#f0f9e0", color: activeWall === w ? "#fff" : "var(--green)", borderRadius: "10px", padding: "1px 7px", fontSize: "11px", fontWeight: 700 }}>{walls[w].length}</span>}
                      </button>
                    ))}
                    <button className={`wall-tab${activeWall === "island" ? " active" : ""}`} onClick={() => setActiveWall("island")}>
                      Insula
                      {island.length > 0 && <span style={{ marginLeft: "6px", background: activeWall === "island" ? "rgba(255,255,255,0.3)" : "#f0f9e0", color: activeWall === "island" ? "#fff" : "var(--green)", borderRadius: "10px", padding: "1px 7px", fontSize: "11px", fontWeight: 700 }}>{island.length}</span>}
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                    {MODULE_TYPES.filter(t => activeWall === "island" ? t.id === "island" : t.id !== "island").map(t => (
                      <button key={t.id} onClick={() => addModule(t.id, activeWall)}
                        style={{ background: "#fff", border: "1.5px solid #eee", borderRadius: "12px", padding: "18px 16px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", fontFamily: "inherit" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--green)"; e.currentTarget.style.background = "#f0f9e0"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.background = "#fff"; }}>
                        <div style={{ fontSize: "24px", marginBottom: "8px" }}>{t.emoji}</div>
                        <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "3px" }}>{t.label}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>{t.defaultW}x{t.defaultH}x{t.defaultD} cm</div>
                        <div style={{ fontSize: "12px", color: "var(--green)", fontWeight: 600 }}>+ Adauga</div>
                      </button>
                    ))}
                  </div>
                  {(activeWall === "island" ? island : walls[activeWall]).length > 0 && (
                    <div>
                      <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {activeWall === "island" ? "Insula" : WALL_LABELS[activeWall]} -- module adaugate
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {(activeWall === "island" ? island : walls[activeWall]).map(m => {
                          const t = MODULE_TYPES.find(mt => mt.id === m.type);
                          return (
                            <div key={m.id} style={{ background: "#f5f5f3", borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                              <span style={{ fontSize: "20px" }}>{t.emoji}</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "13px", fontWeight: 700 }}>{t.label}</div>
                                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{m.width}x{m.height}x{m.depth} cm</div>
                              </div>
                              <button onClick={() => removeModule(m.id, activeWall)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: "20px", lineHeight: 1, padding: "4px" }}
                                onMouseEnter={e => e.currentTarget.style.color = "#e74c3c"}
                                onMouseLeave={e => e.currentTarget.style.color = "#ccc"}>x</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {allModules.length === 0 && (
                    <div style={{ background: "#fff8e6", border: "1.5px solid #ffe0a0", borderRadius: "10px", padding: "14px 16px", fontSize: "13px", color: "#996600", marginTop: "16px" }}>
                      Adauga cel putin un modul pentru a continua.
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Dimensiuni</h2>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>Ajusteaza dimensiunile fiecarui modul in centimetri.</p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                    {activeWalls.map(w => walls[w].length > 0 && (
                      <button key={w} className={`wall-tab${activeWall === w ? " active" : ""}`} onClick={() => setActiveWall(w)}>{WALL_LABELS[w]}</button>
                    ))}
                    {island.length > 0 && (
                      <button className={`wall-tab${activeWall === "island" ? " active" : ""}`} onClick={() => setActiveWall("island")}>Insula</button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {(activeWall === "island" ? island : walls[activeWall]).map(m => {
                      const t = MODULE_TYPES.find(mt => mt.id === m.type);
                      return (
                        <div key={m.id} style={{ background: "#f5f5f3", borderRadius: "12px", padding: "18px" }}>
                          <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>{t.emoji}</span>{t.label}
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                            {[["Latime (cm)", "width", 30, 300], ["Inaltime (cm)", "height", 30, 250], ["Adancime (cm)", "depth", 20, 100]].map(([label, field, min, max]) => (
                              <div key={field}>
                                <label style={{ fontSize: "11px", fontWeight: 600, color: "#666", display: "block", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
                                <input type="number" className="dim-input" value={m[field]} min={min} max={max} onChange={e => updateModule(m.id, field, e.target.value, activeWall)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {(activeWall === "island" ? island : walls[activeWall]).length === 0 && (
                      <p style={{ fontSize: "13px", color: "#bbb" }}>Niciun modul pe acest perete.</p>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Personalizare</h2>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "28px" }}>Alege finisajele pentru bucataria ta.</p>
                  <div style={{ marginBottom: "28px" }}>
                    <h3 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666", marginBottom: "12px" }}>Culoare</h3>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                      {COLORS.map(c => (
                        <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                          <div className={`color-swatch${options.color === c.id ? " selected" : ""}`} style={{ background: c.hex, border: c.hex === "#F5F5F0" ? "2px solid #ddd" : "2px solid transparent" }} onClick={() => setOptions(p => ({ ...p, color: c.id }))} />
                          <span style={{ fontSize: "9px", color: "#888", textAlign: "center", maxWidth: "44px", lineHeight: 1.3 }}>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {[
                    { label: "Tip Front", key: "front", items: FRONTS },
                    { label: "Manere", key: "handles", items: HANDLES },
                    { label: "Sertare", key: "drawers", items: DRAWERS },
                    { label: "Feronerie", key: "hardware", items: HARDWARE },
                  ].map(section => (
                    <div key={section.label} style={{ marginBottom: "24px" }}>
                      <h3 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666", marginBottom: "12px" }}>{section.label}</h3>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {section.items.map(item => (
                          <button key={item.id} className={`option-pill${options[section.key] === item.id ? " selected" : ""}`} onClick={() => setOptions(p => ({ ...p, [section.key]: item.id }))}>{item.label}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div>
                  {submitted ? (
                    <div style={{ background: "#f0f9e0", border: "1.5px solid var(--green)", borderRadius: "16px", padding: "48px 32px", textAlign: "center" }}>
                      <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 700, marginBottom: "12px" }}>Configuratie trimisa!</h3>
                      <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: "380px", margin: "0 auto 24px" }}>Echipa Kalio va analiza configuratia ta si te va contacta in maxim 24 de ore.</p>
                      <button className="btn-primary" onClick={() => { setSubmitted(false); setStep(0); setWalls({ left: [], main: [], right: [] }); setIsland([]); }}>Configuratie noua</button>
                    </div>
                  ) : (
                    <div>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Rezumat si Oferta</h2>
                      <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>Verifica configuratia si trimite-ne datele tale.</p>
                      <div style={{ background: "#f5f5f3", borderRadius: "14px", padding: "20px", marginBottom: "24px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Configuratia ta</div>
                        <div style={{ fontSize: "13px", marginBottom: "10px" }}><strong>Layout:</strong> {activeLayout.label}</div>
                        {activeWalls.map(w => walls[w].length > 0 && (
                          <div key={w} style={{ marginBottom: "10px" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#888", marginBottom: "4px" }}>{WALL_LABELS[w]}</div>
                            {walls[w].map(m => {
                              const t = MODULE_TYPES.find(mt => mt.id === m.type);
                              return (
                                <div key={m.id} style={{ fontSize: "13px", display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                                  <span>{t.emoji} {t.label} {m.width}x{m.height}x{m.depth}cm</span>
                                  <span style={{ color: "var(--green)", fontWeight: 600 }}>~{Math.round(t.pricePerUnit * Math.max(0.8, m.width / t.defaultW))} EUR</span>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                        {island.length > 0 && (
                          <div style={{ marginBottom: "10px" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#888", marginBottom: "4px" }}>Insula</div>
                            {island.map(m => {
                              const t = MODULE_TYPES.find(mt => mt.id === m.type);
                              return (
                                <div key={m.id} style={{ fontSize: "13px", display: "flex", justifyContent: "space-between" }}>
                                  <span>{t.emoji} {m.width}x{m.height}x{m.depth}cm</span>
                                  <span style={{ color: "var(--green)", fontWeight: 600 }}>~{Math.round(t.pricePerUnit)} EUR</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div style={{ fontSize: "12px", color: "#666", borderTop: "1px solid #ddd", paddingTop: "10px", marginTop: "8px" }}>
                          Culoare: {COLORS.find(c => c.id === options.color)?.label} | Front: {FRONTS.find(f => f.id === options.front)?.label} | Feronerie: {HARDWARE.find(h => h.id === options.hardware)?.label}
                        </div>
                        <div style={{ borderTop: "2px solid #ddd", marginTop: "12px", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 700 }}>Estimare total</span>
                          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 700, color: "var(--green)" }}>~{totalPrice} EUR</span>
                        </div>
                        <p style={{ fontSize: "11px", color: "#aaa", marginTop: "6px" }}>* Pret estimativ. Oferta finala confirmata de echipa Kalio.</p>
                      </div>
                      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <h3 style={{ fontSize: "15px", fontWeight: 700 }}>Datele tale de contact</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                          <div>
                            <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "5px" }}>Nume *</label>
                            <input className="form-input" type="text" placeholder="Numele tau" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                          </div>
                          <div>
                            <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "5px" }}>Email *</label>
                            <input className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "5px" }}>Telefon</label>
                          <input className="form-input" type="tel" placeholder="+40 7XX XXX XXX" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: 600, color: "#555", display: "block", marginBottom: "5px" }}>Mesaj (optional)</label>
                          <textarea className="form-input" placeholder="Detalii suplimentare..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={3} style={{ resize: "vertical" }} />
                        </div>
                        <button type="submit" className="btn-primary" style={{ fontSize: "15px", padding: "14px", width: "100%" }}>Trimite configuratia →</button>
                        <p style={{ fontSize: "11px", color: "#aaa", textAlign: "center" }}>Prin trimitere esti de acord cu prelucrarea datelor personale.</p>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {!submitted && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px" }}>
                  {step > 0 ? (
                    <button onClick={() => setStep(s => s - 1)} style={{ background: "none", border: "1.5px solid #ddd", borderRadius: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#333" }}>
                      Inapoi
                    </button>
                  ) : <div />}
                  {step < STEPS.length - 1 && (
                    <button onClick={() => canNext && setStep(s => s + 1)} className="btn-primary" style={{ opacity: canNext ? 1 : 0.4, cursor: canNext ? "pointer" : "not-allowed", padding: "12px 28px" }}>
                      Continua →
                    </button>
                  )}
                </div>
              )}
            </div>

            <div style={{ position: "sticky", top: "84px" }} className="preview-col">
              <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: "16px", padding: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h3 style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#666" }}>Previzualizare</h3>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button className={`view-btn${previewMode === "front" ? " active" : ""}`} onClick={() => setPreviewMode("front")}>Fata</button>
                    <button className={`view-btn${previewMode === "top" ? " active" : ""}`} onClick={() => setPreviewMode("top")}>Sus</button>
                  </div>
                </div>
                {previewMode === "front" && (
                  <div>
                    {step >= 1 && (
                      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
                        {activeWalls.map(w => (
                          <button key={w} className={`view-btn${activeWall === w ? " active" : ""}`} onClick={() => setActiveWall(w)} style={{ fontSize: "11px", padding: "4px 10px" }}>{WALL_LABELS[w]}</button>
                        ))}
                      </div>
                    )}
                    <FrontView modules={walls[activeWall] || []} options={options} />
                    {island.length > 0 && (
                      <div style={{ marginTop: "8px" }}>
                        <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px", fontWeight: 600 }}>INSULA</div>
                        <FrontView modules={island} options={options} />
                      </div>
                    )}
                  </div>
                )}
                {previewMode === "top" && <TopView walls={walls} island={island} layout={layout} options={options} />}
                {allModules.length > 0 && (
                  <div style={{ marginTop: "14px", padding: "14px 16px", background: "#f0f9e0", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "10px", color: "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Estimare pret</div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, color: "var(--green)" }}>~{totalPrice} EUR</div>
                    </div>
                    <div style={{ fontSize: "10px", color: "#888", maxWidth: "100px", textAlign: "right", lineHeight: 1.5 }}>Include toate optiunile selectate</div>
                  </div>
                )}
                {allModules.length > 0 && (
                  <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {MODULE_TYPES.map(t => {
                      const count = allModules.filter(m => m.type === t.id).length;
                      if (!count) return null;
                      return <span key={t.id} style={{ fontSize: "11px", color: "#666", background: "#f5f5f3", padding: "3px 8px", borderRadius: "6px" }}><span style={{ color: "var(--green)", fontWeight: 700 }}>{count}x</span> {t.label}</span>;
                    })}
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