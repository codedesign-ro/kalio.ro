import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --green: #8DC63F; --green-dark: #6fa82e; --dark: #1a1a1a; --gray: #f5f5f3; --text-muted: #666; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', 'Segoe UI', sans-serif; background: #fff; color: #1a1a1a; overflow-x: hidden; }

  /* NAV */
  .nav-link { color: #333; text-decoration: none; font-size: 14px; font-weight: 500; position: relative; transition: color 0.2s; }
  .nav-link::after { content: ''; position: absolute; bottom: -3px; left: 0; width: 0; height: 2px; background: var(--green); transition: width 0.25s; }
  .nav-link:hover { color: var(--green); }
  .nav-link:hover::after { width: 100%; }
  .nav-link.active { color: var(--green); }
  .nav-link.active::after { width: 100%; }

  /* BUTTONS */
  .btn-primary { background: var(--green); color: #fff; border: none; padding: 12px 26px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.15s, box-shadow 0.2s; font-family: inherit; letter-spacing: 0.3px; text-decoration: none; display: inline-block; }
  .btn-primary:hover { background: var(--green-dark); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(141,198,63,0.35); }
  .btn-outline { background: transparent; color: #333; border: 2px solid #ddd; padding: 10px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: border-color 0.2s, color 0.2s; font-family: inherit; }
  .btn-outline:hover { border-color: var(--green); color: var(--green); }

  /* ANIMATIONS */
  .fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }
  .fade-up.d1 { transition-delay: 0.1s; }
  .fade-up.d2 { transition-delay: 0.2s; }
  .fade-up.d3 { transition-delay: 0.3s; }
  .fade-up.d4 { transition-delay: 0.4s; }
  .fade-up.d5 { transition-delay: 0.5s; }
  .fade-up.d6 { transition-delay: 0.6s; }

  /* IMAGES */
  .img-hover { overflow: hidden; border-radius: 14px; }
  .img-hover img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; display: block; }
  .img-hover:hover img { transform: scale(1.04); }

  /* CARDS */
  .feature-card { background: #fff; border: 1px solid #eee; border-radius: 14px; padding: 28px 24px; transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s; }
  .feature-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.08); transform: translateY(-4px); border-color: var(--green); }

  /* PORTFOLIO */
  .portfolio-item { position: relative; overflow: hidden; border-radius: 16px; cursor: pointer; }
  .portfolio-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%); opacity: 0; transition: opacity 0.3s; display: flex; align-items: flex-end; padding: 24px; }
  .portfolio-item:hover .portfolio-overlay { opacity: 1; }
  .portfolio-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; display: block; }
  .portfolio-item:hover img { transform: scale(1.06); }

  /* FILTER BUTTONS */
  .filter-btn { background: transparent; border: 1.5px solid #ddd; color: #555; padding: 8px 20px; border-radius: 30px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
  .filter-btn:hover, .filter-btn.active { background: var(--green); border-color: var(--green); color: #fff; }

  /* FORM */
  .form-input { width: 100%; padding: 13px 16px; border: 1.5px solid #e0e0e0; border-radius: 8px; font-size: 14px; font-family: inherit; color: #1a1a1a; background: #fff; transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
  .form-input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(141,198,63,0.12); }
  .form-input::placeholder { color: #bbb; }
  .form-label { font-size: 13px; font-weight: 600; color: #333; margin-bottom: 7px; display: block; }

  /* CONTACT CARDS */
  .contact-info-card { background: #fff; border: 1px solid #eee; border-radius: 16px; padding: 24px; display: flex; align-items: flex-start; gap: 16px; transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s; }
  .contact-info-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.07); border-color: var(--green); transform: translateY(-2px); }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .nav-desktop { display: none !important; }
    .hero-grid { grid-template-columns: 1fr !important; }
    .hero-about { grid-template-columns: 1fr !important; }
    .mission-grid { grid-template-columns: 1fr !important; }
    .mission-images { display: none !important; }
    .features-grid { grid-template-columns: 1fr !important; }
    .features-grid .feature-card { flex-direction: row !important; align-items: flex-start !important; gap: 16px !important; }
    .features-grid .feature-card .feature-icon { margin-bottom: 0 !important; flex-shrink: 0; }
    .cta-grid { grid-template-columns: 1fr !important; }
    .checklist-grid { grid-template-columns: 1fr !important; }
    .values-grid { grid-template-columns: 1fr !important; }
    .values-grid .value-card { flex-direction: row !important; align-items: flex-start !important; gap: 16px !important; display: flex !important; }
    .values-grid .value-card .value-icon { font-size: 28px !important; margin-bottom: 0 !important; flex-shrink: 0; }
    .why-grid { grid-template-columns: 1fr !important; }
    .config-grid { grid-template-columns: 1fr 1fr !important; }
    .adv-outer { grid-template-columns: 1fr !important; gap: 40px !important; }
    .adv-outer .adv-image { order: -1; height: 260px !important; }
    .advantages-grid { grid-template-columns: 1fr 1fr !important; }
    .process-grid { grid-template-columns: 1fr 1fr !important; }
    .portfolio-grid { grid-template-columns: 1fr 1fr !important; grid-auto-rows: 200px !important; }
    .contact-grid { grid-template-columns: 1fr !important; }
    .contact-info-cards { grid-template-columns: 1fr !important; }
    .footer-grid { grid-template-columns: 1fr !important; gap: 16px !important; text-align: center !important; }
    .stats-grid { grid-template-columns: 1fr 1fr !important; }
  }
  @media (min-width: 769px) { .nav-mobile-btn { display: none !important; } }
`;

const NAV_LINKS = [
  { label: "Acasă", href: "/" },
  { label: "Despre Noi", href: "/despre-noi" },
  { label: "Servicii", href: "/servicii" },
  { label: "Portofoliu", href: "/portofoliu" },
  { label: "Contact", href: "/contact" },
];

export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: scrolled ? "1px solid #eee" : "1px solid transparent",
      transition: "all 0.3s",
      padding: "0 40px", height: "64px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <a href="/" style={{ textDecoration: "none" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: 700, color: "var(--green)", letterSpacing: "-0.5px" }}>Kalio</span>
      </a>

      <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        {NAV_LINKS.map(({ label, href }) => (
          <a key={href} href={href} className={`nav-link${router.pathname === href ? " active" : ""}`}>{label}</a>
        ))}
        <a href="/configurator" className="btn-primary" style={{ padding: "9px 20px", fontSize: "13px" }}>Creează-ți mobila</a>
      </div>

      <button className="nav-mobile-btn" onClick={() => setMenuOpen(!menuOpen)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d={menuOpen ? "M4 4l14 14M18 4L4 18" : "M3 6h16M3 11h16M3 16h16"} stroke="#333" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {menuOpen && (
        <div style={{
          position: "absolute", top: "64px", left: 0, right: 0,
          background: "#fff", borderBottom: "1px solid #eee",
          padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px"
        }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={href} href={href} className="nav-link" style={{ fontSize: "16px" }} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <a href="/configurator" className="btn-primary" style={{ width: "100%", textAlign: "center" }}>Creează-ți mobila</a>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer style={{ background: "#fff", borderTop: "1px solid #eee", padding: "60px 40px 32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px", marginBottom: "48px" }} className="footer-grid">
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Adresă</div>
            <div style={{ fontSize: "14px", color: "#333" }}>Str. Mărului 121, Baia Mare</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Email</div>
            <a href="mailto:contact@kalio.ro" style={{ fontSize: "14px", color: "#333", textDecoration: "none" }}>contact@kalio.ro</a>
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Telefon</div>
            <a href="tel:+40754324358" style={{ fontSize: "14px", color: "#333", textDecoration: "none" }}>+40 754 32 43 58</a>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #eee", paddingTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, color: "var(--green)" }}>Kalio</span>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
            © 2023 kalio.ro | Toate drepturile rezervate Kalio. | Powered and created by codedesign.ro
          </p>
        </div>
      </div>
    </footer>
  );
}

export function GreenCTABanner({ title, subtitle, btnText = "Creează-ți mobila →", btnHref = "/configurator" }) {
  const [ref, inView] = useInView(0.1);
  return (
    <section ref={ref} style={{ background: "var(--green)", padding: "80px 40px", textAlign: "center" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h2 className={`fade-up ${inView ? "visible" : ""}`} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>
          {title}
        </h2>
        <p className={`fade-up d1 ${inView ? "visible" : ""}`} style={{ color: "rgba(255,255,255,0.85)", fontSize: "16px", marginBottom: "32px" }}>
          {subtitle}
        </p>
        <a href={btnHref} className={`fade-up d2 ${inView ? "visible" : ""}`} style={{ background: "#fff", color: "var(--green)", border: "none", padding: "13px 32px", borderRadius: "6px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textDecoration: "none", display: "inline-block" }}>
          {btnText}
        </a>
      </div>
    </section>
  );
}

export default function Layout({ children, title = "Kalio -- Mobilier Modular" }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Kalio -- mobilier modular personalizabil, de calitate superioară, livrat rapid și ușor de asamblat." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <style>{GLOBAL_STYLES}</style>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}