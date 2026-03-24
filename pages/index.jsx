import PocketBase from "pocketbase";
import Layout, { useInView, GreenCTABanner } from "../components/Layout";
import { Sliders, Shield, Truck, Wrench } from "lucide-react";

const DEFAULT_FEATURES = [
  { icon: Sliders, title: "Personalizare totală", desc: "Personalizează mobilierul exact cum dorești. Alege culorile, fronturile, mânerele și multe altele." },
  { icon: Shield, title: "PAL Hidrofugat Premium", desc: "Construit din PAL hidrofugat premium, cu spate solid de 8 mm pentru durabilitate sporită." },
  { icon: Truck, title: "Livrare rapidă", desc: "Fără luni de așteptare. Mobilierul tău personalizat ajunge la tine rapid și eficient." },
  { icon: Wrench, title: "Asamblare ușoară", desc: "Mobilierul Kalio este proiectat pentru asamblare facilă, economisind timp și costuri de instalare." },
];

const CHECKLIST = [
"Gamă variată de culori",
"Diferite stiluri de fronturi",
"Opțiuni de feronerie",
"Diverse tipuri de sertare",
"Materiale durabile, hidrofugate",
"Dimensiuni atipice",
"Timp de livrare redus",
"Asamblare DIY ușoară",
];

export async function getServerSideProps() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pb.kalio.ro');
  try {
    const items = await pb.collection('site_content').getFullList({ filter: 'page = "homepage"' });
    console.log('[homepage] PocketBase returned', items.length, 'records');
    if (items.length > 0) console.log('[homepage] First record fields:', Object.keys(items[0]).join(', '));
    const content = {};
    items.forEach(item => { content[item.key] = item.value; });
    console.log('[homepage] Mapped content keys:', Object.keys(content).join(', '));
    return { props: { content }};
  } catch (e) {
    console.error('[homepage] PocketBase fetch error:', e?.message || e);
    return { props: { content: {} }};
  }
}

export default function Home({ content = {} }) {
const get = (key, fallback) => (content[key] && content[key].trim() !== '') ? content[key] : fallback;

const [heroRef, heroInView] = useInView(0.1);
const [missionRef, missionInView] = useInView(0.1);
const [featuresRef, featuresInView] = useInView(0.1);
const [ctaRef, ctaInView] = useInView(0.1);

const badge = get('hero_badge', "Design modular");
const heroTitle = get('hero_title', "Mobilier modular,");
const heroHighlight = get('hero_titleHighlight', "reinventat.");
const heroSubtitle = get('hero_subtitle', "Creează-ți spațiul perfect cu Kalio —mobilier personalizabil, de calitate superioară, livrat rapid și ușor de asamblat.");
const btnPrimary = get('hero_btnPrimary', "Creează-ți mobila");
const btnSecondary = get('hero_btnSecondary', "Contact");

const stats = [
  [get('stat_0_value', "500+"), get('stat_0_label', "Proiecte livrate")],
  [get('stat_1_value', "8mm"), get('stat_1_label', "Spate solid")],
  [get('stat_2_value', "100%"), get('stat_2_label', "Personalizabil")],
];

const heroImage = get('hero_image', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80');
const missionImages = [
  get('mission_img1', 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=500&q=80'),
  get('mission_img2', 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&q=80'),
  get('mission_img3', 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=500&q=80'),
  get('mission_img4', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=80'),
];
const ctaImage = get('cta_image', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80');

const FEATURES = DEFAULT_FEATURES.map((f, i) => ({
  ...f,
  title: get(`feature_${i}_title`, f.title),
  desc: get(`feature_${i}_desc`, f.desc),
}));

return (
<Layout title="Kalio —Mobilier Modular, Reinventat">


  {/* HERO */}
  <section ref={heroRef} style={{ paddingTop: "64px", minHeight: "92vh", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", gap: "48px", maxWidth: "1200px", margin: "0 auto", padding: "120px 40px 80px" }} className="hero-grid">
    <div>
      <div className={`fade-up ${heroInView ? "visible" : ""}`} style={{ marginBottom: "8px" }}>
        <span style={{ background: "#f0f9e0", color: "var(--green)", fontSize: "12px", fontWeight: 700, padding: "5px 14px", borderRadius: "20px", letterSpacing: "1px", textTransform: "uppercase" }}>{badge}</span>
      </div>
      <h1 className={`fade-up d1 ${heroInView ? "visible" : ""}`} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px, 5vw, 58px)", fontWeight: 700, lineHeight: 1.15, marginTop: "16px", marginBottom: "20px" }}>
        {heroTitle}{" "}
        <em style={{ color: "var(--green)", fontStyle: "italic" }}>{heroHighlight}</em>
      </h1>
      <p className={`fade-up d2 ${heroInView ? "visible" : ""}`} style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--text-muted)", maxWidth: "420px", marginBottom: "36px" }}>
        {heroSubtitle}
      </p>
      <div className={`fade-up d3 ${heroInView ? "visible" : ""}`} style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        <a href="/configurator" className="btn-primary" style={{ fontSize: "15px", padding: "13px 28px" }}>{btnPrimary}</a>
        <a href="/contact" className="btn-outline" style={{ fontSize: "15px", padding: "13px 28px" }}>{btnSecondary}</a>
      </div>
      <div className={`fade-up d4 ${heroInView ? "visible" : ""}`} style={{ marginTop: "48px", display: "flex", gap: "36px" }}>
        {stats.map(([n, l]) => (
          <div key={l}>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--green)" }}>{n}</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>

    <div className={`fade-up d2 ${heroInView ? "visible" : ""}`} style={{ position: "relative" }}>
      <div className="img-hover" style={{ height: "500px", borderRadius: "20px" }}>
        <img src={heroImage} alt="Modern kitchen by Kalio" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", bottom: "24px", left: "-20px", background: "#fff", borderRadius: "14px", padding: "16px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: "12px", minWidth: "200px" }}>
        <div style={{ width: "40px", height: "40px", background: "#f0f9e0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2l2.4 4.9L18 7.6l-4 3.9.9 5.5L10 14.4 5.1 17l.9-5.5L2 7.6l5.6-.7L10 2z" fill="#8DC63F"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700 }}>Calitate premium</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>PAL hidrofugat certificat</div>
        </div>
      </div>
    </div>
  </section>

  {/* MISSION */}
  <section ref={missionRef} style={{ background: "var(--gray)", padding: "100px 40px" }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div className={`fade-up ${missionInView ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "60px" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, lineHeight: 1.2, maxWidth: "680px", margin: "0 auto" }}>
          La Kalio, credem că{" "}
          <span style={{ color: "var(--green)" }}>mobilierul trebuie</span>{" "}
          să se adapteze stilului tău de viață --{" "}
          <em style={{ fontStyle: "italic" }}>nu invers.</em>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }} className="mission-grid">
        <div>
          <p className={`fade-up d1 ${missionInView ? "visible" : ""}`} style={{ fontSize: "15px", lineHeight: 1.8, color: "#444", marginBottom: "20px" }}>
            <strong>Sistemul nostru modular îți oferă libertatea</strong> de a personaliza fiecare detaliu: culori, fronturi, mânere, sertare și multe altele. Fabricat din PAL hidrofugat premium, cu spate solid de 8 mm, fiecare element este construit pentru durabilitate, livrat rapid și ușor de montat chiar de tine.
          </p>
          <p className={`fade-up d2 ${missionInView ? "visible" : ""}`} style={{ fontSize: "15px", lineHeight: 1.8, color: "#444", marginBottom: "32px" }}>
            Sistemul nostru modular îți oferă libertatea de a personaliza fiecare detaliu: culori, fronturi, mânere, sertare și multe altele. Fabricat din PAL hidrofugat premium, cu spate solid de 8 mm, fiecare element este construit pentru durabilitate, livrat rapid și ușor de montat.
          </p>
          <a href="/configurator" className={`btn-primary fade-up d3 ${missionInView ? "visible" : ""}`} style={{ fontSize: "14px" }}>Creează-ți mobila →</a>
        </div>
        <div className="mission-images" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {missionImages.map((src, i) => (
            <div key={i} className={`img-hover fade-up d${i + 1} ${missionInView ? "visible" : ""}`} style={{ height: i % 2 === 0 ? "190px" : "160px", marginTop: i % 2 !== 0 ? "24px" : "0" }}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>

  {/* FEATURES */}
  <section ref={featuresRef} style={{ padding: "100px 40px", background: "#fff" }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div className={`fade-up ${featuresInView ? "visible" : ""}`} style={{ textAlign: "center", marginBottom: "56px" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 700 }}>
          De ce să alegi <span style={{ color: "var(--green)" }}>Kalio?</span>
        </h2>
        <p style={{ color: "var(--text-muted)", marginTop: "12px", fontSize: "15px" }}>Calitate, viteză și personalizare —totul într-un singur loc.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }} className="features-grid">
        {FEATURES.map((f, i) => (
          <div key={f.title} className={`feature-card fade-up d${i + 1} ${featuresInView ? "visible" : ""}`} style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <div className="feature-icon" style={{ width: "44px", height: "44px", background: "#f0f9e0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", flexShrink: 0 }}>
              <f.icon size={22} color="#8DC63F" />
            </div>
            <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "10px" }}>{f.title}</h3>
            <p style={{ fontSize: "13px", lineHeight: 1.7, color: "var(--text-muted)" }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* CTA SECTION */}
  <section ref={ctaRef} style={{ background: "var(--gray)", padding: "100px 40px" }}>
    <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }} className="cta-grid">
      <div className={`img-hover fade-up ${ctaInView ? "visible" : ""}`} style={{ height: "460px" }}>
        <img src={ctaImage} alt="Kalio modular kitchen" />
      </div>
      <div>
        <div className={`fade-up d1 ${ctaInView ? "visible" : ""}`}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, lineHeight: 1.2, marginBottom: "14px" }}>
            Creează mobilierul care se potrivește stilului tău{" "}
            <span style={{ color: "var(--green)", fontStyle: "italic" }}>de viață.</span>
          </h2>
        </div>
        <p className={`fade-up d2 ${ctaInView ? "visible" : ""}`} style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "28px" }}>
          Design modular. Calitate premium. Gândit pentru tine.
        </p>
        <div className={`fade-up d3 ${ctaInView ? "visible" : ""}`} style={{ display: "grid", gap: "8px 32px", gridTemplateColumns: "1fr 1fr", marginBottom: "36px" }} className="checklist-grid">
          {CHECKLIST.map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#333" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="#f0f9e0"/>
                <path d="M5 8l2 2 4-4" stroke="#8DC63F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {item}
            </div>
          ))}
        </div>
        <a href="/configurator" className={`btn-primary fade-up d4 ${ctaInView ? "visible" : ""}`} style={{ fontSize: "15px", padding: "13px 30px" }}>Creează-ți mobila →</a>
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
