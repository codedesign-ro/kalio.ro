import { useState } from "react";
import PocketBase from "pocketbase";
import Layout, { useInView } from "../components/Layout";
import { MapPin, Mail, Phone, Zap, MessageCircle, FileText } from "lucide-react";

export async function getServerSideProps() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://pb.kalio.ro');
  try {
    const items = await pb.collection('site_content').getFullList({ filter: 'page = "contact"' });
    const content = {};
    items.forEach(item => { content[item.key] = item.value; });
    return { props: { content }};
  } catch (e) {
    console.error('[contact] PocketBase fetch error:', e?.message || e);
    return { props: { content: {} }};
  }
}

export default function Contact({ content = {} }) {
  const get = (key, fallback) => (content[key] && content[key].trim() !== '') ? content[key] : fallback;

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [heroRef, heroInView] = useInView(0.1);
  const [formRef, formInView] = useInView(0.05);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  const heroTitle = get('heroTitle', "Hai să discutăm despre");
  const heroHighlight = get('heroHighlight', "proiectul tău.");
  const heroSubtitle = get('heroSubtitle', "Indiferent dacă ai nevoie de informații despre configurare, livrare sau materiale, echipa Kalio este pregătită să te ajute.");

  const address = get('address', "Str. Mărului 121, Baia Mare");
  const email = get('email', "contact@kalio.ro");
  const phone = get('phone', "+40 754 32 43 58");
  const hoursWeekday = get('hoursWeekday', "Luni – Vineri, 9:00 – 18:00");
  const mapsUrl = get('mapsUrl', "https://maps.google.com/?q=Str.+Marului+121+Baia+Mare");

  const CONTACT_INFO = [
    { icon: MapPin, label: "Adresă", value: address, sub: "România" },
    { icon: Mail, label: "Email", value: email, sub: "Răspundem în 24h" },
    { icon: Phone, label: "Telefon", value: phone, sub: hoursWeekday },
  ];

  return (
    <Layout title="Contact — Kalio Mobilier Modular">

      {/* HERO */}
      <section ref={heroRef} style={{ paddingTop: "64px", background: "var(--gray)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 40px 80px", textAlign: "center" }}>
          <div className={`fade-up ${heroInView ? "visible" : ""}`}>
            <span style={{ background: "#f0f9e0", color: "var(--green)", fontSize: "12px", fontWeight: 700, padding: "5px 14px", borderRadius: "20px", letterSpacing: "1px", textTransform: "uppercase" }}>Contact</span>
          </div>
          <h1 className={`fade-up d1 ${heroInView ? "visible" : ""}`} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 700, lineHeight: 1.15, margin: "16px 0 20px" }}>
            {heroTitle} <em style={{ color: "var(--green)", fontStyle: "italic" }}>{heroHighlight}</em>
          </h1>
          <p className={`fade-up d2 ${heroInView ? "visible" : ""}`} style={{ fontSize: "16px", lineHeight: 1.75, color: "var(--text-muted)", maxWidth: "540px", margin: "0 auto" }}>
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section style={{ padding: "60px 40px 0", background: "#fff" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }} className="contact-info-cards">
          {CONTACT_INFO.map((info, i) => (
            <div key={info.label} className={`contact-info-card fade-up d${i + 1} ${heroInView ? "visible" : ""}`}>
              <div style={{ width: "44px", height: "44px", background: "#f0f9e0", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <info.icon size={22} color="#8DC63F" />
              </div>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{info.label}</div>
                <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>{info.value}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{info.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FORM SECTION */}
      <section ref={formRef} style={{ padding: "60px 40px 100px", background: "#fff" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }} className="contact-grid">

          {/* LEFT */}
          <div>
            <div className={`fade-up ${formInView ? "visible" : ""}`}>
              <span style={{ background: "#f0f9e0", color: "var(--green)", fontSize: "12px", fontWeight: 700, padding: "5px 14px", borderRadius: "20px", letterSpacing: "1px", textTransform: "uppercase" }}>Scrie-ne</span>
            </div>
            <h2 className={`fade-up d1 ${formInView ? "visible" : ""}`} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 700, lineHeight: 1.2, margin: "16px 0 16px" }}>
              Completează formularul și <span style={{ color: "var(--green)" }}>revenim rapid.</span>
            </h2>
            <p className={`fade-up d2 ${formInView ? "visible" : ""}`} style={{ fontSize: "15px", lineHeight: 1.8, color: "#444", marginBottom: "36px" }}>
              Completează formularul de contact și revenim către tine în cel mai scurt timp posibil. Echipa noastră este disponibilă de luni până vineri, între 9:00 și 18:00.
            </p>
            <div className={`fade-up d3 ${formInView ? "visible" : ""}`} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[
                { icon: Zap, title: "Răspuns rapid", desc: "Răspundem în maxim 24 de ore lucrătoare." },
                { icon: MessageCircle, title: "Consultanță gratuită", desc: "Oferim consultanță gratuită pentru orice proiect." },
                { icon: FileText, title: "Ofertă personalizată", desc: "Fiecare ofertă este adaptată nevoilor tale specifice." },
              ].map(item => (
                <div key={item.title} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", background: "#f0f9e0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <item.icon size={20} color="#8DC63F" />
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "3px" }}>{item.title}</div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - Form */}
          <div className={`fade-up d2 ${formInView ? "visible" : ""}`}>
            {submitted ? (
              <div style={{ background: "#f0f9e0", border: "1.5px solid var(--green)", borderRadius: "16px", padding: "48px 32px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>Mesaj trimis!</h3>
                <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.7 }}>Mulțumim pentru mesaj! Te vom contacta în cel mai scurt timp posibil.</p>
                <button className="btn-primary" style={{ marginTop: "24px" }} onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}>
                  Trimite alt mesaj
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: "var(--gray)", borderRadius: "20px", padding: "36px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label className="form-label">Nume *</label>
                    <input className="form-input" type="text" name="name" placeholder="Numele tău" value={form.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" name="email" placeholder="email@example.com" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div>
                  <label className="form-label">Telefon</label>
                  <input className="form-input" type="tel" name="phone" placeholder="+40 7XX XXX XXX" value={form.phone} onChange={handleChange} />
                </div>
                <div>
                  <label className="form-label">Subiect *</label>
                  <select className="form-input" name="subject" value={form.subject} onChange={handleChange} required>
                    <option value="">Selectează subiectul</option>
                    <option value="configurare">Configurare mobilier</option>
                    <option value="oferta">Solicită o ofertă</option>
                    <option value="livrare">Informații livrare</option>
                    <option value="materiale">Informații materiale</option>
                    <option value="altele">Altele</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Mesaj *</label>
                  <textarea className="form-input" name="message" placeholder="Descrie proiectul tău..." value={form.message} onChange={handleChange} required rows={5} style={{ resize: "vertical", minHeight: "120px" }} />
                </div>
                <button type="submit" className="btn-primary" style={{ fontSize: "15px", padding: "14px", width: "100%" }}>
                  Trimite mesajul →
                </button>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
                  Prin trimiterea formularului ești de acord cu prelucrarea datelor tale personale.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* MAP */}
      <section style={{ background: "var(--gray)", padding: "0" }}>
        <div style={{ width: "100%", height: "320px", background: "#e8e8e4", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <div style={{ textAlign: "center", zIndex: 1, position: "relative" }}>
            <div style={{ width: "48px", height: "48px", background: "var(--green)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 2C7.686 2 5 4.686 5 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z" fill="#fff"/><circle cx="11" cy="8" r="2" fill="var(--green)"/></svg>
            </div>
            <div style={{ fontWeight: 700, fontSize: "15px", color: "#333" }}>{address}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>România</div>
            <a href={mapsUrl} target="_blank" rel="noreferrer"
              style={{ display: "inline-block", marginTop: "12px", background: "var(--green)", color: "#fff", padding: "8px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
              Deschide în Google Maps
            </a>
          </div>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.3 }} />
        </div>
      </section>

    </Layout>
  );
}
