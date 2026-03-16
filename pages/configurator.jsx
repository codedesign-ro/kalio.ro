import { useState, useRef, useCallback, useEffect } from "react";
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
  { id: "base", label: "Corp de Jos", emoji: "\u{1F5C4}\uFE0F", defaultW: 600, defaultH: 850, defaultD: 600, pricePerUnit: 280 },
  { id: "wall", label: "Corp de Sus", emoji: "\u{1F532}", defaultW: 600, defaultH: 700, defaultD: 350, pricePerUnit: 220 },
  { id: "tall", label: "Corp Inalt", emoji: "\u{1F6AA}", defaultW: 600, defaultH: 2100, defaultD: 600, pricePerUnit: 420 },
  { id: "island", label: "Insula", emoji: "\u{1F3DD}\uFE0F", defaultW: 1200, defaultH: 900, defaultD: 800, pricePerUnit: 650 },
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

/* ── Wall usage helpers ── */
function getWallUsed(modules) {
  return modules.reduce((sum, m) => sum + m.width, 0);
}

function autoFitModules(modules, wallWidthMm) {
  if (wallWidthMm <= 0 || modules.length === 0) return modules;
  const used = getWallUsed(modules);
  if (used <= wallWidthMm) return modules;
  const allButLast = modules.slice(0, -1);
  const usedBefore = getWallUsed(allButLast);
  const remaining = wallWidthMm - usedBefore;
  if (remaining <= 0) return allButLast;
  const last = { ...modules[modules.length - 1], width: remaining, isSpecial: true, label: "Corp Special" };
  return [...allButLast, last];
}

/* ── Progress Bar Component ── */
function WallProgressBar({ wallKey, modules, wallWidthMm }) {
  const used = getWallUsed(modules);
  const pct = wallWidthMm > 0 ? Math.min((used / wallWidthMm) * 100, 100) : 0;
  const over = used > wallWidthMm;
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 600, marginBottom: "4px" }}>
        <span style={{ color: "#555" }}>{WALL_LABELS[wallKey]}</span>
        <span style={{ color: over ? "#e74c3c" : "var(--green)" }}>{used} / {wallWidthMm} mm</span>
      </div>
      <div style={{ height: "8px", background: "#eee", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: "4px",
          background: over ? "#e74c3c" : pct > 90 ? "#f0ad4e" : "var(--green)",
          transition: "width 0.3s, background 0.3s",
        }} />
      </div>
    </div>
  );
}

/* ── Front View ── */
function FrontView({ modules, options, ceilingHeight }) {
  const color = COLORS.find(c => c.id === options.color) || COLORS[0];
  const isLight = ["alb", "bej"].includes(options.color);
  const ceilMm = ceilingHeight || 2500;

  const CANVAS_H = 320;
  const FLOOR_Y = CANVAS_H - 25;
  const WALL_TOP = 10;
  const drawableH = FLOOR_Y - WALL_TOP;
  const SCALE = drawableH / ceilMm;

  const BASE_H_MM = 850;
  const BACKSPLASH_MM = 560;
  const WALL_CAB_BOTTOM_MM = BASE_H_MM + BACKSPLASH_MM;

  const bases = modules.filter(m => m.type === "base");
  const wallCabs = modules.filter(m => m.type === "wall");
  const talls = modules.filter(m => m.type === "tall");

  const GAP = 4;
  let xCursor = 12;
  const placed = [];

  talls.forEach(m => {
    const h = m.height * SCALE;
    const w = m.width * SCALE;
    placed.push({ ...m, x: xCursor, y: FLOOR_Y - h, w, h, layer: "tall" });
    xCursor += w + GAP;
  });

  const baseStartX = xCursor;
  bases.forEach(m => {
    const h = m.height * SCALE;
    const w = m.width * SCALE;
    placed.push({ ...m, x: xCursor, y: FLOOR_Y - h, w, h, layer: "base" });
    xCursor += w + GAP;
  });

  let wxCursor = baseStartX;
  wallCabs.forEach(m => {
    const h = m.height * SCALE;
    const w = m.width * SCALE;
    const topOfCab = FLOOR_Y - (WALL_CAB_BOTTOM_MM + m.height) * SCALE;
    placed.push({ ...m, x: wxCursor, y: topOfCab, w, h, layer: "wall" });
    wxCursor += w + GAP;
  });

  const totalW = placed.reduce((max, m) => Math.max(max, m.x + m.w), 0) + 12;
  const svgW = Math.max(totalW, 320);
  const strokeColor = isLight ? "#ccc" : "rgba(255,255,255,0.12)";

  function getHandle(m) {
    if (options.handles === "ingropat") return null;
    const cx = m.x + m.w / 2;
    const cy = m.y + m.h * 0.6;
    if (options.handles === "bare") return <rect x={cx - m.w * 0.28} y={cy - 2} width={m.w * 0.56} height={4} rx={2} fill="#999" opacity={0.8} />;
    if (options.handles === "rotunde") return <circle cx={cx} cy={cy} r={3.5} fill="#999" opacity={0.8} />;
    return <rect x={cx - 2} y={m.y + m.h * 0.45} width={4} height={m.h * 0.28} rx={2} fill="#999" opacity={0.8} />;
  }

  function getDrawerLines(m) {
    if (options.drawers === "fara" || m.layer === "wall") return null;
    const count = options.drawers === "pan" ? 2 : 3;
    return Array.from({ length: count }).map((_, i) => (
      <line key={i} x1={m.x + 4} y1={m.y + (m.h / (count + 1)) * (i + 1)} x2={m.x + m.w - 4} y2={m.y + (m.h / (count + 1)) * (i + 1)} stroke={isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"} strokeWidth={1.2} />
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

  /* backsplash area between bases and wall cabs */
  const basePlaced = placed.filter(p => p.layer === "base");
  const backsplashY1 = basePlaced.length > 0 ? Math.min(...basePlaced.map(p => p.y)) : FLOOR_Y;
  const backsplashY0 = FLOOR_Y - WALL_CAB_BOTTOM_MM * SCALE;
  const bsMinX = basePlaced.length > 0 ? Math.min(...basePlaced.map(p => p.x)) : baseStartX;
  const bsMaxX = basePlaced.length > 0 ? Math.max(...basePlaced.map(p => p.x + p.w)) : baseStartX;

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
        <filter id="cab-shadow"><feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.08)" /></filter>
      </defs>

      {/* Wall background */}
      <rect x="0" y="0" width={svgW} height={FLOOR_Y} fill="#FAFAF8" />
      {/* Floor */}
      <rect x="0" y={FLOOR_Y} width={svgW} height={25} fill="#E8E3D8" />
      <line x1="0" y1={FLOOR_Y} x2={svgW} y2={FLOOR_Y} stroke="#D0CAB8" strokeWidth={2} />

      {/* Backsplash tile area */}
      {basePlaced.length > 0 && wallCabs.length > 0 && (
        <rect x={bsMinX - 2} y={backsplashY0} width={bsMaxX - bsMinX + 4} height={backsplashY1 - backsplashY0} fill="#EDEBE5" rx={2} />
      )}

      {/* Countertop */}
      {basePlaced.length > 0 && (() => {
        const minX = Math.min(...basePlaced.map(p => p.x));
        const maxX = Math.max(...basePlaced.map(p => p.x + p.w));
        const topY = Math.min(...basePlaced.map(p => p.y));
        return <rect x={minX - 2} y={topY - 4} width={maxX - minX + 4} height={6} rx={2} fill="#C8BBAA" />;
      })()}

      {placed.map(m => (
        <g key={m.id} filter="url(#cab-shadow)">
          <rect x={m.x} y={m.y} width={m.w} height={m.h} rx={3} fill={getFill()} stroke={m.isSpecial ? "#e74c3c" : strokeColor} strokeWidth={m.isSpecial ? 2 : 1.5} />
          <rect x={m.x} y={m.y} width={m.w} height={4} rx={2} fill={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.08)"} />
          {getDrawerLines(m)}
          {getHandle(m)}
          {m.isSpecial && (
            <text x={m.x + m.w / 2} y={m.y + m.h / 2 - 4} textAnchor="middle" fill="#e74c3c" fontSize={7} fontFamily="DM Sans, sans-serif" fontWeight="700">SPECIAL</text>
          )}
          <text x={m.x + m.w / 2} y={m.y + m.h / 2 + (m.isSpecial ? 6 : 3)} textAnchor="middle" fill={isLight ? "#888" : "#ccc"} fontSize={7} fontFamily="DM Sans, sans-serif">{m.width}mm</text>
        </g>
      ))}
    </svg>
  );
}

/* ── Top View with draggable island ── */
function TopView({ walls, island, layout, options, wallDimensions, islandPos, onIslandDrag }) {
  const svgRef = useRef(null);
  const dragRef = useRef({ active: false, offsetX: 0, offsetY: 0 });

  const color = COLORS.find(c => c.id === options.color) || COLORS[0];
  const isLight = ["alb", "bej"].includes(options.color);
  const cabColor = color.hex;
  const strokeColor = isLight ? "#ccc" : "rgba(255,255,255,0.15)";
  const activeLayout = LAYOUTS.find(l => l.id === layout);
  const hasLeft = activeLayout.walls.includes("left");
  const hasRight = activeLayout.walls.includes("right");

  /* Room dimensions from user input (mm) */
  const mainWallMm = wallDimensions.main || 3000;
  const leftWallMm = wallDimensions.left || 2500;
  const rightWallMm = wallDimensions.right || 2500;
  const roomWidthMm = mainWallMm;
  const roomDepthMm = hasLeft ? leftWallMm : hasRight ? rightWallMm : Math.round(mainWallMm * 0.7);
  const CAB_DEPTH_MM = 600;

  /* Scale to fit in SVG viewport */
  const SVG_W = 500;
  const SVG_H = 420;
  const PADDING = 50;
  const availW = SVG_W - PADDING * 2;
  const availH = SVG_H - PADDING * 2;
  const scaleX = availW / (roomWidthMm + (hasLeft ? CAB_DEPTH_MM + 80 : 0) + (hasRight ? CAB_DEPTH_MM + 80 : 0));
  const scaleY = availH / (roomDepthMm + CAB_DEPTH_MM + 80);
  const SCALE = Math.min(scaleX, scaleY);
  const DEPTH = CAB_DEPTH_MM * SCALE;

  const ROOM_X = PADDING + (hasLeft ? DEPTH + 6 : 0);
  const ROOM_Y = PADDING;
  const ROOM_W = roomWidthMm * SCALE;
  const ROOM_H = roomDepthMm * SCALE;

  const mainModules = walls.main || [];
  const leftModules = walls.left || [];
  const rightModules = walls.right || [];
  const islandModules = island || [];

  /* Pointer helpers for island drag */
  const getSvgPoint = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  }, []);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    const { x, y } = getSvgPoint(e.clientX, e.clientY);
    dragRef.current = { active: true, offsetX: x - islandPos.x, offsetY: y - islandPos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [islandPos, getSvgPoint]);

  const handlePointerMove = useCallback((e) => {
    if (!dragRef.current.active) return;
    const { x, y } = getSvgPoint(e.clientX, e.clientY);
    onIslandDrag({
      x: x - dragRef.current.offsetX,
      y: y - dragRef.current.offsetY,
    });
  }, [getSvgPoint, onIslandDrag]);

  const handlePointerUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  /* Default island position if not set */
  const defaultIx = ROOM_X + ROOM_W / 2;
  const defaultIy = ROOM_Y + ROOM_H / 2;

  return (
    <svg ref={svgRef} width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ display: "block", background: "#F9F8F6", borderRadius: "12px", touchAction: "none" }}>
      {/* Room outline */}
      <rect x={ROOM_X} y={ROOM_Y} width={ROOM_W} height={ROOM_H} fill="#F0EDE6" rx={2} stroke="#D0CAB8" strokeWidth={1} />

      {/* Dimension labels */}
      <text x={ROOM_X + ROOM_W / 2} y={ROOM_Y + ROOM_H + 18} textAnchor="middle" fill="#999" fontSize={9} fontFamily="DM Sans,sans-serif">{roomWidthMm} mm</text>
      <text x={ROOM_X - 14} y={ROOM_Y + ROOM_H / 2} textAnchor="middle" fill="#999" fontSize={9} fontFamily="DM Sans,sans-serif" transform={`rotate(-90, ${ROOM_X - 14}, ${ROOM_Y + ROOM_H / 2})`}>{roomDepthMm} mm</text>

      {/* Main wall cabinets (top) */}
      <rect x={ROOM_X} y={ROOM_Y} width={ROOM_W} height={DEPTH} fill="#E0DBD0" rx={1} />
      {(() => {
        let xCur = ROOM_X + 3;
        return mainModules.map((m) => {
          const w = m.width * SCALE;
          const x = xCur;
          xCur += w + 3;
          return (
            <g key={m.id}>
              <rect x={x} y={ROOM_Y + 2} width={w} height={DEPTH - 4} rx={2} fill={cabColor} stroke={m.isSpecial ? "#e74c3c" : strokeColor} strokeWidth={m.isSpecial ? 2 : 1.5} />
              <text x={x + w / 2} y={ROOM_Y + DEPTH / 2 + 3} textAnchor="middle" fill={isLight ? "#666" : "#ccc"} fontSize={Math.min(8, w * 0.3)} fontFamily="DM Sans,sans-serif">{m.width}</text>
            </g>
          );
        });
      })()}
      <text x={ROOM_X + ROOM_W / 2} y={ROOM_Y + DEPTH / 2 + 3} textAnchor="middle" fill="#888" fontSize={8} fontFamily="DM Sans,sans-serif" fontWeight="700" opacity={mainModules.length > 0 ? 0.3 : 0.8}>PERETE PRINCIPAL</text>

      {/* Left wall */}
      {hasLeft && (
        <>
          <rect x={ROOM_X - DEPTH - 6} y={ROOM_Y} width={DEPTH} height={ROOM_H} fill="#E0DBD0" rx={1} />
          {(() => {
            let yCur = ROOM_Y + 3;
            return leftModules.map((m) => {
              const h = m.width * SCALE;
              const y = yCur;
              yCur += h + 3;
              return (
                <g key={m.id}>
                  <rect x={ROOM_X - DEPTH - 6 + 2} y={y} width={DEPTH - 4} height={h} rx={2} fill={cabColor} stroke={m.isSpecial ? "#e74c3c" : strokeColor} strokeWidth={m.isSpecial ? 2 : 1.5} />
                  <text x={ROOM_X - DEPTH / 2 - 6} y={y + h / 2 + 3} textAnchor="middle" fill={isLight ? "#666" : "#ccc"} fontSize={Math.min(8, h * 0.3)} fontFamily="DM Sans,sans-serif">{m.width}</text>
                </g>
              );
            });
          })()}
          <text x={ROOM_X - DEPTH / 2 - 6} y={ROOM_Y + ROOM_H / 2} textAnchor="middle" fill="#888" fontSize={7} fontFamily="DM Sans,sans-serif" fontWeight="700" opacity={leftModules.length > 0 ? 0.3 : 0.8} transform={`rotate(-90, ${ROOM_X - DEPTH / 2 - 6}, ${ROOM_Y + ROOM_H / 2})`}>STANGA</text>
        </>
      )}

      {/* Right wall */}
      {hasRight && (
        <>
          <rect x={ROOM_X + ROOM_W + 6} y={ROOM_Y} width={DEPTH} height={ROOM_H} fill="#E0DBD0" rx={1} />
          {(() => {
            let yCur = ROOM_Y + 3;
            return rightModules.map((m) => {
              const h = m.width * SCALE;
              const y = yCur;
              yCur += h + 3;
              return (
                <g key={m.id}>
                  <rect x={ROOM_X + ROOM_W + 6 + 2} y={y} width={DEPTH - 4} height={h} rx={2} fill={cabColor} stroke={m.isSpecial ? "#e74c3c" : strokeColor} strokeWidth={m.isSpecial ? 2 : 1.5} />
                  <text x={ROOM_X + ROOM_W + DEPTH / 2 + 6} y={y + h / 2 + 3} textAnchor="middle" fill={isLight ? "#666" : "#ccc"} fontSize={Math.min(8, h * 0.3)} fontFamily="DM Sans,sans-serif">{m.width}</text>
                </g>
              );
            });
          })()}
          <text x={ROOM_X + ROOM_W + DEPTH / 2 + 6} y={ROOM_Y + ROOM_H / 2} textAnchor="middle" fill="#888" fontSize={7} fontFamily="DM Sans,sans-serif" fontWeight="700" opacity={rightModules.length > 0 ? 0.3 : 0.8} transform={`rotate(90, ${ROOM_X + ROOM_W + DEPTH / 2 + 6}, ${ROOM_Y + ROOM_H / 2})`}>DREAPTA</text>
        </>
      )}

      {/* Island (draggable) */}
      {islandModules.map((m, i) => {
        const iw = m.width * SCALE;
        const ih = m.depth * SCALE;
        const ix = (islandPos.x || defaultIx) - iw / 2 + i * 15;
        const iy = (islandPos.y || defaultIy) - ih / 2 + i * 15;
        return (
          <g key={m.id}
            style={{ cursor: "grab" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <rect x={ix - 3} y={iy - 3} width={iw + 6} height={ih + 6} rx={6} fill="transparent" stroke="#8DC63F" strokeWidth={1.5} strokeDasharray="4,3" />
            <rect x={ix} y={iy} width={iw} height={ih} rx={4} fill={cabColor} stroke="#8DC63F" strokeWidth={2} />
            <text x={ix + iw / 2} y={iy + ih / 2 - 4} textAnchor="middle" fill={isLight ? "#555" : "#eee"} fontSize={9} fontFamily="DM Sans,sans-serif" fontWeight="bold">Insula</text>
            <text x={ix + iw / 2} y={iy + ih / 2 + 8} textAnchor="middle" fill={isLight ? "#888" : "#bbb"} fontSize={7} fontFamily="DM Sans,sans-serif">{m.width}x{m.depth}mm</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Step Indicator ── */
function StepIndicator({ current, steps }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "32px", overflowX: "auto", paddingBottom: "4px" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", minWidth: "50px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 700, transition: "all 0.3s",
              background: i <= current ? "var(--green)" : "#eee",
              color: i <= current ? "#fff" : "#999",
              boxShadow: i === current ? "0 0 0 4px rgba(141,198,63,0.2)" : "none",
            }}>
              {i < current ? "\u2713" : i + 1}
            </div>
            <span style={{ fontSize: "10px", fontWeight: i === current ? 700 : 400, color: i === current ? "var(--green)" : "#999", whiteSpace: "nowrap" }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: "2px", background: i < current ? "var(--green)" : "#eee", margin: "0 6px", marginBottom: "20px", transition: "background 0.3s", minWidth: "20px" }} />
          )}
        </div>
      ))}
    </div>
  );
}

const STEPS = ["Layout", "Dimensiuni Camera", "Module", "Personalizare", "Rezumat"];

export default function Configurator() {
  const [step, setStep] = useState(0);
  const [layout, setLayout] = useState("straight");
  const [wallDimensions, setWallDimensions] = useState({ main: 3000, left: 2500, right: 2500, ceiling: 2500 });
  const [activeWall, setActiveWall] = useState("main");
  const [walls, setWalls] = useState({ left: [], main: [], right: [] });
  const [island, setIsland] = useState([]);
  const [options, setOptions] = useState({ color: "alb", front: "mat", handles: "bare", drawers: "standard", hardware: "blum" });
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [previewMode, setPreviewMode] = useState("front");
  const [islandPos, setIslandPos] = useState({ x: 0, y: 0 });

  const activeLayout = LAYOUTS.find(l => l.id === layout);
  const activeWalls = activeLayout.walls;

  /* Auto-fit walls (apply Corp Special logic) */
  const fittedWalls = {};
  for (const w of activeWalls) {
    fittedWalls[w] = autoFitModules(walls[w] || [], wallDimensions[w] || 3000);
  }
  /* Keep non-active walls as-is */
  for (const w of ["left", "main", "right"]) {
    if (!fittedWalls[w]) fittedWalls[w] = walls[w] || [];
  }

  const allModules = [...Object.values(fittedWalls).flat(), ...island];
  const totalPrice = calcPrice(fittedWalls, island, options);

  function addModule(type, target) {
    const t = MODULE_TYPES.find(m => m.id === type);
    const mod = { id: Date.now() + Math.random(), type, width: t.defaultW, height: t.defaultH, depth: t.defaultD };
    if (target === "island") { setIsland(prev => [...prev, mod]); }
    else { setWalls(prev => ({ ...prev, [target]: [...prev[target], mod] })); }
  }

  function removeModule(id, target) {
    if (target === "island") { setIsland(prev => prev.filter(m => m.id !== id)); }
    else { setWalls(prev => ({ ...prev, [target]: prev[target].filter(m => m.id !== id) })); }
  }

  function updateModule(id, field, value, target) {
    const v = Number(value);
    if (isNaN(v) || v < 0) return;
    if (target === "island") { setIsland(prev => prev.map(m => m.id === id ? { ...m, [field]: v } : m)); }
    else { setWalls(prev => ({ ...prev, [target]: prev[target].map(m => m.id === id ? { ...m, [field]: v } : m) })); }
  }

  function handleSubmit(e) { e.preventDefault(); setSubmitted(true); }

  const canNext = step === 2 ? allModules.length > 0 : true;

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
        .mm-field { display: flex; flex-direction: column; gap: 5px; }
        .mm-field label { font-size: 11px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .mm-field .unit { display: flex; align-items: center; gap: 6px; }
        .mm-field .unit span { font-size: 12px; color: #999; font-weight: 600; }
        @media (max-width: 768px) { .cfg-layout { grid-template-columns: 1fr !important; } .preview-col { position: static !important; } }
      `}</style>

      <section style={{ background: "var(--gray)", padding: "100px 40px 60px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <span style={{ background: "#f0f9e0", color: "var(--green)", fontSize: "12px", fontWeight: 700, padding: "5px 14px", borderRadius: "20px", letterSpacing: "1px", textTransform: "uppercase" }}>Configurator Bucatarie</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 50px)", fontWeight: 700, lineHeight: 1.15, margin: "16px 0 16px" }}>
            Creaza-ti bucataria <em style={{ color: "var(--green)", fontStyle: "italic" }}>perfecta.</em>
          </h1>
          <p style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto" }}>
            Alege layout-ul, configureaza dimensiunile, adauga modulele si primeste o oferta instant.
          </p>
        </div>
      </section>

      <section style={{ padding: "48px 40px 80px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <StepIndicator current={step} steps={STEPS} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "32px", alignItems: "start" }} className="cfg-layout">

            <div>
              {/* ─── Step 0: Layout ─── */}
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

              {/* ─── Step 1: Wall Dimensions ─── */}
              {step === 1 && (
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Dimensiunile camerei</h2>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "28px" }}>Introdu latimea fiecarui perete si inaltimea tavanului in milimetri.</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {activeWalls.map(w => (
                      <div key={w} style={{ background: "#f5f5f3", borderRadius: "12px", padding: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--green)" }} />
                          <span style={{ fontSize: "14px", fontWeight: 700 }}>{WALL_LABELS[w]}</span>
                        </div>
                        <div className="mm-field">
                          <label>Latime perete</label>
                          <div className="unit">
                            <input
                              type="number"
                              className="dim-input"
                              value={wallDimensions[w]}
                              min={500}
                              max={10000}
                              step={10}
                              onChange={e => setWallDimensions(prev => ({ ...prev, [w]: Number(e.target.value) }))}
                            />
                            <span>mm</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div style={{ background: "#f5f5f3", borderRadius: "12px", padding: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#666" }} />
                        <span style={{ fontSize: "14px", fontWeight: 700 }}>Inaltime Tavan</span>
                      </div>
                      <div className="mm-field">
                        <label>Inaltime</label>
                        <div className="unit">
                          <input
                            type="number"
                            className="dim-input"
                            value={wallDimensions.ceiling}
                            min={2000}
                            max={4000}
                            step={10}
                            onChange={e => setWallDimensions(prev => ({ ...prev, ceiling: Number(e.target.value) }))}
                          />
                          <span>mm</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "#f0f9e0", borderRadius: "10px", padding: "14px 16px", marginTop: "20px", fontSize: "13px", color: "#4a7a1a", display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ fontSize: "18px" }}>{"\u{1F4CF}"}</span>
                    <span>Masoara cu precizie de la perete la perete. Dimensiunile influenteaza previzualizarea si corpurile speciale.</span>
                  </div>
                </div>
              )}

              {/* ─── Step 2: Modules ─── */}
              {step === 2 && (
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>Adauga module</h2>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>Selecteaza peretele si adauga corpurile dorite.</p>

                  {/* Wall progress bars */}
                  <div style={{ marginBottom: "20px" }}>
                    {activeWalls.map(w => (
                      <WallProgressBar key={w} wallKey={w} modules={fittedWalls[w]} wallWidthMm={wallDimensions[w] || 3000} />
                    ))}
                  </div>

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
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>{t.defaultW}x{t.defaultH}x{t.defaultD} mm</div>
                        <div style={{ fontSize: "12px", color: "var(--green)", fontWeight: 600 }}>+ Adauga</div>
                      </button>
                    ))}
                  </div>

                  {/* Module list with inline dimension editing */}
                  {(activeWall === "island" ? island : fittedWalls[activeWall]).length > 0 && (
                    <div>
                      <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#555", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {activeWall === "island" ? "Insula" : WALL_LABELS[activeWall]} -- module adaugate
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {(activeWall === "island" ? island : fittedWalls[activeWall]).map(m => {
                          const t = MODULE_TYPES.find(mt => mt.id === m.type);
                          return (
                            <div key={m.id} style={{ background: m.isSpecial ? "#fff5f5" : "#f5f5f3", borderRadius: "10px", padding: "14px 16px", border: m.isSpecial ? "1.5px solid #f5c6c6" : "1.5px solid transparent" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                                <span style={{ fontSize: "20px" }}>{t.emoji}</span>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: "13px", fontWeight: 700 }}>
                                    {m.isSpecial ? "Corp Special" : t.label}
                                    {m.isSpecial && <span style={{ fontSize: "11px", color: "#e74c3c", fontWeight: 600, marginLeft: "8px" }}>(auto-ajustat)</span>}
                                  </div>
                                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{m.width}x{m.height}x{m.depth} mm</div>
                                </div>
                                <button onClick={() => removeModule(m.id, activeWall)}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: "20px", lineHeight: 1, padding: "4px" }}
                                  onMouseEnter={e => e.currentTarget.style.color = "#e74c3c"}
                                  onMouseLeave={e => e.currentTarget.style.color = "#ccc"}>x</button>
                              </div>
                              {!m.isSpecial && (
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                                  {[["L (mm)", "width", 100, 2000], ["H (mm)", "height", 100, 2500], ["D (mm)", "depth", 100, 1000]].map(([label, field, min, max]) => (
                                    <div key={field}>
                                      <label style={{ fontSize: "10px", fontWeight: 600, color: "#888", display: "block", marginBottom: "3px" }}>{label}</label>
                                      <input type="number" className="dim-input" value={m[field]} min={min} max={max} step={10}
                                        onChange={e => updateModule(m.id, field, e.target.value, activeWall)}
                                        style={{ fontSize: "12px", padding: "6px 8px" }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
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

              {/* ─── Step 3: Personalizare ─── */}
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

              {/* ─── Step 4: Rezumat ─── */}
              {step === 4 && (
                <div>
                  {submitted ? (
                    <div style={{ background: "#f0f9e0", border: "1.5px solid var(--green)", borderRadius: "16px", padding: "48px 32px", textAlign: "center" }}>
                      <div style={{ fontSize: "56px", marginBottom: "16px" }}>{"\u{1F389}"}</div>
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
                        <div style={{ fontSize: "13px", marginBottom: "10px" }}>
                          <strong>Dimensiuni camera:</strong>{" "}
                          {activeWalls.map(w => `${WALL_LABELS[w]}: ${wallDimensions[w]}mm`).join(" | ")}
                          {" | Tavan: "}{wallDimensions.ceiling}mm
                        </div>
                        {activeWalls.map(w => fittedWalls[w].length > 0 && (
                          <div key={w} style={{ marginBottom: "10px" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#888", marginBottom: "4px" }}>{WALL_LABELS[w]} ({getWallUsed(fittedWalls[w])}/{wallDimensions[w]} mm)</div>
                            {fittedWalls[w].map(m => {
                              const t = MODULE_TYPES.find(mt => mt.id === m.type);
                              return (
                                <div key={m.id} style={{ fontSize: "13px", display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                                  <span>{t.emoji} {m.isSpecial ? "Corp Special" : t.label} {m.width}x{m.height}x{m.depth}mm</span>
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
                                  <span>{t.emoji} {m.width}x{m.height}x{m.depth}mm</span>
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

              {/* Navigation buttons */}
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

            {/* ─── Preview Column ─── */}
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
                    {step >= 2 && (
                      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
                        {activeWalls.map(w => (
                          <button key={w} className={`view-btn${activeWall === w ? " active" : ""}`} onClick={() => setActiveWall(w)} style={{ fontSize: "11px", padding: "4px 10px" }}>{WALL_LABELS[w]}</button>
                        ))}
                      </div>
                    )}
                    <FrontView modules={activeWall === "island" ? [] : (fittedWalls[activeWall] || [])} options={options} ceilingHeight={wallDimensions.ceiling} />
                    {island.length > 0 && (
                      <div style={{ marginTop: "8px" }}>
                        <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px", fontWeight: 600 }}>INSULA</div>
                        <FrontView modules={island} options={options} ceilingHeight={wallDimensions.ceiling} />
                      </div>
                    )}
                  </div>
                )}
                {previewMode === "top" && <TopView walls={fittedWalls} island={island} layout={layout} options={options} wallDimensions={wallDimensions} islandPos={islandPos} onIslandDrag={setIslandPos} />}
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
