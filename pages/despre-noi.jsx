import Layout, { useInView, GreenCTABanner } from "../components/Layout";
import { Sparkles, Shield, Star, Wrench, Truck, Ruler } from "lucide-react";

const VALUES = [
  { icon: Sparkles, title: "Design modern", desc: "Estetică contemporană adaptată tendințelor actuale în design interior." },
  { icon: Shield, title: "Structură durabilă", desc: "PAL hidrofugat de înaltă calitate cu spate solid de 8 mm pentru rezistență sporită." },
  { icon: Star, title: "Finisaje premium", desc: "Finisaje moderne mate, lucioase sau texturate pentru un aspect impecabil." },
  { icon: Wrench, title: "Montaj simplu", desc: "Sistem gândit pentru asamblare DIY rapidă, fără costuri suplimentare de instalare." },
  { icon: Truck, title: "Livrare rapidă", desc: "Timp de livrare redus față de mobilierul tradițional la comandă." },
  { icon: Ruler, title: "Dimensiuni adaptabile", desc: "Carcase speciale pentru spații atipice — fiecare centimetru contează." },
];

export default function DespreNoi() {
  const [heroRef, heroInView] = useInView(0.1);
  const [missionRef, missionInView] = useInView(0.1);
  const [valuesRef, valuesInView] = useInView(0.1);
  const [whyRef, whyInView] = useInView(0.1);

  return (
    <Layout title="Despre Noi — Kalio Mobilier Modular">

      {/* HERO */}
      <section ref={heroRef} style={{ paddingTop: "64px", background: "var(--gray)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 40px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }} className="hero-about">
          <div>
            <div className={`fade-up ${heroInView ? "visible" : ""}`} style={{ marginBottom: "12px" }}>
              <span style={{ background: "#f0f9e0", color: "var(--green)", fontSize: "12px", fontWeight: 700, padding: "5px 14px", borderRadius: "20px", letterSpacing: "1px", textTransform: "uppercase" }}>Despre noi</span>
            </div>
            <h1 className={`fade-up d1 ${heroInView ? "visible" : ""}`} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(34px, 4.5vw, 52px)", fontWeight: 700, lineHeight: 1.15, marginBottom: "20px" }}>
              Mobilier modular creat pentru{" "}
              <em style={{ color: "var(--green)", fontStyle: "italic" }}>libertate și flexibilitate.</em>
            </h1>
            <p className={`fade-up d2 ${heroInView ? "visible" : ""}`} style={{ fontSize: "16px", lineHeight: 1.75, color: "var(--text-muted)", marginBottom: "36px", maxWidth: "460px" }}>
              La Kalio, construim mobilier care se adaptează spațiului tău, nu invers. Combinăm designul modern cu un sistem modular inteligent, pentru a-ți oferi control total asupra fiecărui detaliu.
            </p>
            <div className={`fade-up d3 ${heroInView ? "visible" : ""}`} style={{ display: "flex", gap: "14px" }}>
              <a href="/configurator" className="btn-primary" style={{ fontSize: "15px", padding: "13px 28px" }}>Creează-ți mobila</a>
              <a href="/contact" className="btn-outline" style={{ fontSize: "15px", padding: "13px 28px" }}>Contact</a>
            </div>
          </div>
          <div className={`fade-up d2 ${heroInView ? "visible" : ""}`}>
            <div className="img-hover" style={{ height: "480px" }}>
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80" alt="Kalio atelier" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section ref={missionRef} style={{ padding: "100px 40px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }} className="why-grid">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&q=80",
              "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80",
              "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80",
              "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80",
            ].map((src, i) => (
              <div key={i} className={`img-hover fade-up d${i + 1} ${missionInView ? "visible" : ""}`} style={{ height: i % 2 === 0 ? "200px" : "170px", marginTop: i % 2 !== 0 ? "28px" : "0" }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
          <div>
            <div className={`fade-up ${missionInView ? "visible" : ""}`}>
              <span style={{ background: "#f0f9e0", color: "var(--green)", fontSize: "12px", fontWeight: 700, padding: "5px 14px", borderRadius: "20px", letterSpacing: "1px", textTransform: "uppercase" }}>Misiunea noastră</span>
            </div>
            <h2 className={`fade-up d1 ${missionInView ? "visible" : ""}`} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, lineHeight: 1.2, margin: "16px 0 20px" }}>
              Calitate în <span style={{ color: "var(--green)" }}>fiecare detaliu</span>
            </h2>
            <p className={`fade-up d2 ${missionInView ? "visible" : ""}`} style={{ fontSize: "15px", lineHeight: 1.8, color: "#444", marginBottom: "16px" }}>
              Fiecare corp de mobilier Kalio este realizat din PAL hidrofugat de înaltă calitate, cu spate solid de 8 mm pentru rezistență sporită. Punem accent pe structură durabilă, finisaje moderne și montaj simplu.
            </p>
            <p className={`fade-up d3 ${missionInView ? "visible" : ""}`} style={{ fontSize: "15px", lineHeight: 1.8, color: "#444", marginBottom: "32px" }}>
              Kalio oferă echilibrul perfect între personalizare, eficiență și calitate. Alegi culori, fronturi, mânere, sertare și feronerie. Dimensiuni adaptabile pentru spații atipice.
            </p>
            <div className={`fade-up d4 ${missionInView ? "visible" : ""}`} style={{ display: "flex", gap: "32px" }}>
              {[["10+", "Ani experiență"], ["500+", "Proiecte livrate"], ["100%", "Personalizabil"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--green)" }}>{n}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section ref={valuesRef} style={{ padding: "100px 40px", background: "var(--gray)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className={`fade-up ${valuesInView ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 700 }}>
              Valorile <span style={{ color: "var(--green)" }}>noastre</span>
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: "12px", fontSize: "15px", maxWidth: "500px", margin: "12px auto 0" }}>
              Fiecare decizie pe care o luăm este ghidată de aceste principii fundamentale.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }} className="values-grid">
            {VALUES.map((v, i) => (
              <div key={v.title} className={`value-card fade-up d${(i % 3) + 1} ${valuesInView ? "visible" : ""}`}
                style={{ background: "#fff", border: "1px solid #eee", borderRadius: "14px", padding: "30px 24px", transition: "box-shadow 0.25s, transform 0.25s, border-color 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "var(--green)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "#eee"; }}>
                <div className="value-icon" style={{ marginBottom: "14px" }}>
                  <div style={{ background: "#f0f9e0", borderRadius: "10px", padding: "10px", display: "inline-flex" }}>
                    <v.icon size={28} color="#8DC63F" />
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "10px" }}>{v.title}</h3>
                  <p style={{ fontSize: "13px", lineHeight: 1.7, color: "var(--text-muted)" }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY KALIO */}
      <section ref={whyRef} style={{ padding: "100px 40px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }} className="why-grid">
          <div>
            <div className={`fade-up ${whyInView ? "visible" : ""}`}>
              <span style={{ background: "#f0f9e0", color: "var(--green)", fontSize: "12px", fontWeight: 700, padding: "5px 14px", borderRadius: "20px", letterSpacing: "1px", textTransform: "uppercase" }}>De ce Kalio?</span>
            </div>
            <h2 className={`fade-up d1 ${whyInView ? "visible" : ""}`} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, lineHeight: 1.2, margin: "16px 0 20px" }}>
              Transformă-ți spațiul cu mobilier modular{" "}
              <em style={{ color: "var(--green)", fontStyle: "italic" }}>inteligent.</em>
            </h2>
            <p className={`fade-up d2 ${whyInView ? "visible" : ""}`} style={{ fontSize: "15px", lineHeight: 1.8, color: "#444", marginBottom: "28px" }}>
              Cu Kalio, obții un design modern, funcționalitate optimă și un sistem gândit pentru montaj ușor.
            </p>
            <div className={`fade-up d3 ${whyInView ? "visible" : ""}`} style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "36px" }}>
              {[
                ["Personalizare completă", "Alegi culori, fronturi, mânere, sertare și feronerie."],
                ["Dimensiuni adaptabile", "Carcase speciale pentru spații atipice."],
                ["Eficiență garantată", "Sistem modular rapid și ușor de asamblat."],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "22px", height: "22px", background: "#f0f9e0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#8DC63F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700 }}>{title}</div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href="/configurator" className={`btn-primary fade-up d4 ${whyInView ? "visible" : ""}`} style={{ fontSize: "15px", padding: "13px 28px" }}>Creează-ți mobila →</a>
          </div>
          <div className={`img-hover fade-up d2 ${whyInView ? "visible" : ""}`} style={{ height: "500px" }}>
            <img src="https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=900&q=80" alt="Kalio modern kitchen" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </section>

      <GreenCTABanner
        title="Gata să îți transformi spațiul?"
        subtitle="Contactează echipa Kalio și hai să construim împreună mobilierul perfect pentru tine."
      />

    </Layout>
  );
}
