import { useState } from "react";
import Layout, { useInView, GreenCTABanner } from "../components/Layout";

const PROJECTS = [
  { id: 1, category: "Bucătărie", title: "Bucătărie modernă - Baia Mare", desc: "Bucătărie modulară cu fronturi mate gri antracit și blat de quartz alb.", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", size: "tall" },
  { id: 2, category: "Dressing", title: "Dressing walk-in - Cluj", desc: "Dressing personalizat cu iluminare LED și fronturi albe lucioase.", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", size: "normal" },
  { id: 3, category: "Bucătărie", title: "Bucătărie insulă - Oradea", desc: "Bucătărie cu insulă centrală, finisaj lemn natur și negru mat.", img: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80", size: "normal" },
  { id: 4, category: "Living", title: "Mobilier living - Timișoara", desc: "Set complet living cu nișă TV, bibliotecă și comodă cu fronturi texturate.", img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80", size: "tall" },
  { id: 5, category: "Bucătărie", title: "Bucătărie loft - București", desc: "Stil industrial cu fronturi negre mat și feronerie aurie Blum premium.", img: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80", size: "normal" },
  { id: 6, category: "Dressing", title: "Dressing dormitor - Baia Mare", desc: "Dressing modular cu sertare silențioase Blum și sistem glisant.", img: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80", size: "normal" },
  { id: 7, category: "Living", title: "Living minimalist - Cluj", desc: "Mobilier living în tonuri calde de stejar cu accente negre mate.", img: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80", size: "normal" },
  { id: 8, category: "Bucătărie", title: "Bucătărie country - Satu Mare", desc: "Stil country modern cu fronturi albe și mânere clasice din alamă.", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80", size: "normal" },
  { id: 9, category: "Dressing", title: "Dressing open space - Bistrița", desc: "Sistem deschis cu rafturi și sertare tip panoramic pentru vizibilitate maximă.", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", size: "normal" },
];

const CATEGORIES = ["Toate", "Bucătărie", "Dressing", "Living"];

export default function Portofoliu() {
  const [activeFilter, setActiveFilter] = useState("Toate");
  const [heroRef, heroInView] = useInView(0.1);
  const [gridRef, gridInView] = useInView(0.05);

  const filtered = activeFilter === "Toate" ? PROJECTS : PROJECTS.filter(p => p.category === activeFilter);

  return (
    <Layout title="Portofoliu — Kalio Mobilier Modular">

      {/* HERO */}
      <section ref={heroRef} style={{ paddingTop: "64px", background: "var(--gray)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 40px 80px", textAlign: "center" }}>
          <div className={`fade-up ${heroInView ? "visible" : ""}`}>
            <span style={{ background: "#f0f9e0", color: "var(--green)", fontSize: "12px", fontWeight: 700, padding: "5px 14px", borderRadius: "20px", letterSpacing: "1px", textTransform: "uppercase" }}>Portofoliu</span>
          </div>
          <h1 className={`fade-up d1 ${heroInView ? "visible" : ""}`} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(34px, 5vw, 58px)", fontWeight: 700, lineHeight: 1.15, margin: "16px 0 20px" }}>
            Proiecte care <em style={{ color: "var(--green)", fontStyle: "italic" }}>vorbesc de la sine.</em>
          </h1>
          <p className={`fade-up d2 ${heroInView ? "visible" : ""}`} style={{ fontSize: "16px", lineHeight: 1.75, color: "var(--text-muted)", maxWidth: "560px", margin: "0 auto 40px" }}>
            Fiecare proiect Kalio este o poveste de personalizare și calitate. Descoperă cum am transformat spațiile clienților noștri în locuri cu adevărat speciale.
          </p>
          <div className={`fade-up d3 ${heroInView ? "visible" : ""}`} style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} className={`filter-btn${activeFilter === cat ? " active" : ""}`} onClick={() => setActiveFilter(cat)}>{cat}</button>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO GRID */}
      <section ref={gridRef} style={{ padding: "60px 40px 100px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", gridAutoRows: "280px" }} className="portfolio-grid">
            {filtered.map((project, i) => (
              <div key={project.id} className={`portfolio-item fade-up d${(i % 6) + 1} ${gridInView ? "visible" : ""}`}
                style={{ gridRow: project.size === "tall" ? "span 2" : "span 1" }}>
                <img src={project.img} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div className="portfolio-overlay">
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--green)", textTransform: "uppercase", letterSpacing: "1px", background: "rgba(141,198,63,0.15)", padding: "3px 10px", borderRadius: "20px", marginBottom: "8px", display: "inline-block" }}>
                      {project.category}
                    </span>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{project.title}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)" }}>{project.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <p>Niciun proiect găsit pentru această categorie.</p>
            </div>
          )}
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "var(--gray)", padding: "60px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px", textAlign: "center" }} className="stats-grid">
          {[["500+", "Proiecte finalizate"], ["100%", "Clienți mulțumiți"], ["10+", "Ani de experiență"], ["48h", "Timp mediu livrare"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "42px", fontWeight: 700, color: "var(--green)" }}>{n}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      <GreenCTABanner
        title="Proiectul tău ar putea fi următorul."
        subtitle="Hai să construim împreună ceva de care să fii mândru în fiecare zi."
      />

    </Layout>
  );
}
