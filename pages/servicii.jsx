import PocketBase from "pocketbase";
import Layout, { useInView, GreenCTABanner } from "../components/Layout";
import { Palette, Square, Settings, Layers, Ruler, Cog, Maximize, Home, Droplets, Shield, Grid3x3 as Grid, Wrench, Truck, Gem } from "lucide-react";

const DEFAULT_CONFIG_OPTIONS = [
  { icon: Palette, label: "Gamă variată de culori moderne" },
  { icon: Square, label: "Fronturi mate, lucioase sau texturate" },
  { icon: Settings, label: "Mânere și butoni în diferite stiluri" },
  { icon: Layers, label: "Sertare standard și sertare tip pan" },
  { icon: Ruler, label: "Plinte în mai multe variante" },
  { icon: Cog, label: "Feronerie Blum (premium) sau medie" },
  { icon: Maximize, label: "Carcase speciale pentru dimensiuni personalizate" },
  { icon: Home, label: "Adaptabil pentru bucătărie, dressing, living" },
];

const ADVANTAGES = [
  { title: "Materiale hidrofugate", desc: "PAL hidrofugat rezistent la umiditate pentru durabilitate maximă în orice condiții.", icon: Droplets },
  { title: "Spate solid 8mm", desc: "Spate solid de 8 mm pentru o structură rigidă și rezistentă în timp.", icon: Shield },
  { title: "Sistem modular", desc: "Sistem modular inteligent pentru configurații nelimitate adaptat oricărui spațiu.", icon: Grid },
  { title: "Montaj DIY simplu", desc: "Proiectat pentru asamblare facilă de către oricine, fără scule speciale.", icon: Wrench },
  { title: "Livrare rapidă", desc: "Timp de livrare redus față de mobilierul tradițional la comandă.", icon: Truck },
  { title: "Raport calitate-preț", desc: "Design modern și minimalist la un raport excelent calitate-preț.", icon: Gem },
];

const DEFAULT_PROCESS = [
  { step: "01", title: "Configurezi", desc: "Alegi dimensiunile, culorile, fronturile și toate detaliile dorite prin sistemul nostru de configurare." },
  { step: "02", title: "Confirmăm", desc: "Echipa Kalio verifică configurația și te contactăm pentru confirmare și plată." },
  { step: "03", title: "Producem", desc: "Mobilierul tău este produs cu grijă în atelierul nostru din PAL hidrofugat premium." },
  { step: "04", title: "Livrăm", desc: "Livrăm rapid la adresa ta, gata pentru asamblare DIY ușoară." },
];

export async function getStaticProps() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pb.kalio.ro');
  try {
    const items = await pb.collection('site_content').getFullList({ filter: 'page = "servicii"' });
    const content = {};
    items.forEach(item => { content[item.key] = item.value; });
    return { props: { content }, revalidate: 10 };
  } catch (e) {
    return { props: { content: {} }, revalidate: 10 };
  }
}

export default function Servicii({ content = {} }) {
  const get = (key, fallback) => (content[key] && content[key].trim() !== '') ? content[key] : fallback;

  const [heroRef, heroInView] = useInView(0.1);
  const [configRef, configInView] = useInView(0.1);
  const [advRef, advInView] = useInView(0.1);
  const [processRef, processInView] = useInView(0.1);

  const heroTitle = get('hero_title', "Soluții modulare pentru");
  const heroHighlight = get('hero_titleHighlight', "fiecare spațiu.");
  const heroSubtitle = get('hero_subtitle', "Mobilier personalizat, construit pe un sistem modular eficient și flexibil. Kalio îți oferă flexibilitatea mobilierului la comandă, cu eficiența unui sistem modular bine optimizat.");

  const CONFIG_OPTIONS = DEFAULT_CONFIG_OPTIONS.map((opt, i) => ({
    ...opt,
    label: get(`config_${i}`, opt.label),
  }));

  const PROCESS = DEFAULT_PROCESS.map((step, i) => ({
    ...step,
    title: get(`process_${i}_title`, step.title),
    desc: get(`process_${i}_desc`, step.desc),
  }));

  return (
    <Layout title="Servicii — Kalio Mobilier Modular">

      {/* HERO */}
      <section ref={heroRef} style={{ paddingTop: "64px", background: "var(--gray)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 40px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }} className="hero-grid">
          <div>
            <div className={`fade-up ${heroInView ? "visible" : ""}`}>
              <span style={{ background: "#f0f9e0", color: "var(--green)", fontSize: "12px", fontWeight: 700, padding: "5px 14px", borderRadius: "20px", letterSpacing: "1px", textTransform: "uppercase" }}>Servicii</span>
            </div>
            <h1 className={`fade-up d1 ${heroInView ? "visible" : ""}`} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(34px, 4.5vw, 52px)", fontWeight: 700, lineHeight: 1.15, margin: "14px 0 20px" }}>
              {heroTitle}{" "}
              <em style={{ color: "var(--green)", fontStyle: "italic" }}>{heroHighlight}</em>
            </h1>
            <p className={`fade-up d2 ${heroInView ? "visible" : ""}`} style={{ fontSize: "16px", lineHeight: 1.75, color: "var(--text-muted)", marginBottom: "36px", maxWidth: "460px" }}>
              {heroSubtitle}
            </p>
            <a href="/configurator" className={`btn-primary fade-up d3 ${heroInView ? "visible" : ""}`} style={{ fontSize: "15px", padding: "13px 28px" }}>Creează-ți mobila</a>
          </div>
          <div className={`fade-up d2 ${heroInView ? "visible" : ""}`}>
            <div className="img-hover" style={{ height: "460px" }}>
              <img src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=900&q=80" alt="Kalio services" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* CONFIGURARE */}
      <section ref={configRef} style={{ padding: "100px 40px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className={`fade-up ${configInView ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 700 }}>
              Configurare completă a <span style={{ color: "var(--green)" }}>mobilierului</span>
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: "12px", fontSize: "15px", maxWidth: "520px", margin: "12px auto 0" }}>
              La Kalio, ai control total asupra designului. Personalizează fiecare detaliu după preferințele tale.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }} className="config-grid">
            {CONFIG_OPTIONS.map((opt, i) => (
              <div key={i} className={`fade-up d${(i % 4) + 1} ${configInView ? "visible" : ""}`}
                style={{ background: "var(--gray)", borderRadius: "14px", padding: "24px 20px", border: "1px solid transparent", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--green)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(141,198,63,0.12)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ background: "#f0f9e0", borderRadius: "10px", padding: "10px", display: "inline-flex" }}>
                    <opt.icon size={28} color="#8DC63F" />
                  </div>
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, lineHeight: 1.5 }}>{opt.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section ref={advRef} style={{ padding: "100px 40px", background: "var(--gray)" }}>
        <div className="adv-outer" style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div>
            <div className={`fade-up ${advInView ? "visible" : ""}`}>
              <span style={{ background: "#f0f9e0", color: "var(--green)", fontSize: "12px", fontWeight: 700, padding: "5px 14px", borderRadius: "20px", letterSpacing: "1px", textTransform: "uppercase" }}>Avantaje</span>
            </div>
            <h2 className={`fade-up d1 ${advInView ? "visible" : ""}`} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3.2vw, 40px)", fontWeight: 700, lineHeight: 1.2, margin: "16px 0 20px" }}>
              Mobilier modular <em style={{ color: "var(--green)", fontStyle: "italic" }}>fără compromisuri.</em>
            </h2>
            <p className={`fade-up d2 ${advInView ? "visible" : ""}`} style={{ fontSize: "15px", lineHeight: 1.8, color: "#444", marginBottom: "32px" }}>
              Kalio îți oferă flexibilitatea mobilierului la comandă, dar cu eficiența și viteza unui sistem modular bine optimizat — calitate premium la fiecare etapă.
            </p>
            <div className={`advantages-grid fade-up d3 ${advInView ? "visible" : ""}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {ADVANTAGES.map((adv) => (
                <div key={adv.title} style={{ background: "#fff", borderRadius: "12px", padding: "20px 16px", border: "1px solid #eee" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <div style={{ background: "#f0f9e0", borderRadius: "10px", padding: "10px", display: "inline-flex" }}>
                      <adv.icon size={28} color="#8DC63F" />
                    </div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>{adv.title}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>{adv.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={`adv-image img-hover fade-up d2 ${advInView ? "visible" : ""}`} style={{ height: "560px" }}>
            <img src="https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=900&q=80" alt="Kalio quality" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section ref={processRef} style={{ padding: "100px 40px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className={`fade-up ${processInView ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 700 }}>
              Cum <span style={{ color: "var(--green)" }}>funcționează</span>
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: "12px", fontSize: "15px" }}>De la configurare la livrare — simplu, rapid și transparent.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", position: "relative" }} className="process-grid">
            {PROCESS.map((step, i) => (
              <div key={step.step} className={`fade-up d${i + 1} ${processInView ? "visible" : ""}`} style={{ position: "relative", textAlign: "center", padding: "32px 20px" }}>
                {i < PROCESS.length - 1 && (
                  <div style={{ position: "absolute", top: "40px", right: "-12px", width: "24px", height: "2px", background: "#eee", zIndex: 1 }} />
                )}
                <div style={{ width: "56px", height: "56px", background: "#f0f9e0", border: "2px solid var(--green)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "14px", fontWeight: 800, color: "var(--green)" }}>
                  {step.step}
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>{step.title}</h3>
                <p style={{ fontSize: "13px", lineHeight: 1.7, color: "var(--text-muted)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GreenCTABanner
        title="Gata să configurezi mobilierul tău?"
        subtitle="Fără compromisuri. Design modern, materiale premium, livrare rapidă."
      />

    </Layout>
  );
}
