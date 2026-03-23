import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout, { Toast } from "../../components/admin/AdminLayout";

export default function AdminHomepage() {
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("hero");

  const [hero, setHero] = useState({
    badge: "Design modular",
    title: "Mobilier modular,",
    titleHighlight: "reinventat.",
    subtitle: "Creaza-ti spatiul perfect cu Kalio - mobilier personalizabil, de calitate superioara, livrat rapid si usor de asamblat.",
    btnPrimary: "Creaza-ti mobila",
    btnSecondary: "Contact",
  });

  const [stats, setStats] = useState([
    { value: "500+", label: "Proiecte livrate" },
    { value: "8mm", label: "Spate solid" },
    { value: "100%", label: "Personalizabil" },
  ]);

  const [features, setFeatures] = useState([
    { title: "Personalizare totala", desc: "Personalizeaza mobilierul exact cum doresti. Alege culorile, fronturile, manerele si multe altele." },
    { title: "PAL Hidrofugat Premium", desc: "Construit din PAL hidrofugat premium, cu spate solid de 8 mm pentru durabilitate sporita." },
    { title: "Livrare rapida", desc: "Fara luni de asteptare. Mobilierul tau personalizat ajunge la tine rapid si eficient." },
    { title: "Asamblare usoara", desc: "Mobilierul Kalio este proiectat pentru asamblare facila, economisind timp si costuri de instalare." },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("kalio_admin_auth")) {
      router.push("/admin");
    }
  }, []);

  function saveHero(e) {
    e.preventDefault();
    setToast({ message: "Hero section salvata!", type: "success" });
  }

  function saveStats(e) {
    e.preventDefault();
    setToast({ message: "Statistici salvate!", type: "success" });
  }

  function saveFeatures(e) {
    e.preventDefault();
    setToast({ message: "Features salvate!", type: "success" });
  }

  const TABS = [
    { id: "hero", label: "Hero Section" },
    { id: "stats", label: "Statistici" },
    { id: "features", label: "Feature Cards" },
  ];

  return (
    <AdminLayout title="Homepage">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: "28px" }}>
        <h2 className="admin-section-title">Homepage</h2>
        <p className="admin-section-subtitle">Editeaza continutul paginii principale.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", background: "#f5f5f3", borderRadius: "10px", padding: "4px", marginBottom: "28px", width: "fit-content" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s", background: activeTab === t.id ? "#fff" : "transparent", color: activeTab === t.id ? "#1a1a1a" : "#888", boxShadow: activeTab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* HERO TAB */}
      {activeTab === "hero" && (
        <form onSubmit={saveHero}>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: "20px" }}>Hero Section</h3>
            <div className="field-group">
              <label className="admin-label">Badge text</label>
              <input className="admin-input" value={hero.badge} onChange={e => setHero(p => ({ ...p, badge: e.target.value }))} />
            </div>
            <div className="field-row">
              <div>
                <label className="admin-label">Titlu principal</label>
                <input className="admin-input" value={hero.title} onChange={e => setHero(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="admin-label">Titlu highlight (verde + italic)</label>
                <input className="admin-input" value={hero.titleHighlight} onChange={e => setHero(p => ({ ...p, titleHighlight: e.target.value }))} />
              </div>
            </div>
            <div className="field-group">
              <label className="admin-label">Subtitlu</label>
              <textarea className="admin-input" rows={3} value={hero.subtitle} onChange={e => setHero(p => ({ ...p, subtitle: e.target.value }))} style={{ resize: "vertical" }} />
            </div>
            <div className="field-row">
              <div>
                <label className="admin-label">Buton principal</label>
                <input className="admin-input" value={hero.btnPrimary} onChange={e => setHero(p => ({ ...p, btnPrimary: e.target.value }))} />
              </div>
              <div>
                <label className="admin-label">Buton secundar</label>
                <input className="admin-input" value={hero.btnSecondary} onChange={e => setHero(p => ({ ...p, btnSecondary: e.target.value }))} />
              </div>
            </div>

            {/* Preview */}
            <div style={{ background: "#f5f5f3", borderRadius: "10px", padding: "20px", marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Preview</div>
              <span style={{ background: "#f0f9e0", color: "#6fa82e", fontSize: "11px", fontWeight: 700, padding: "3px 12px", borderRadius: "20px" }}>{hero.badge}</span>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "24px", fontWeight: 700, marginTop: "8px", lineHeight: 1.2 }}>
                {hero.title} <em style={{ color: "#8DC63F" }}>{hero.titleHighlight}</em>
              </div>
              <p style={{ fontSize: "13px", color: "#666", marginTop: "8px", lineHeight: 1.6 }}>{hero.subtitle}</p>
              <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                <span style={{ background: "#8DC63F", color: "#fff", padding: "8px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: 600 }}>{hero.btnPrimary}</span>
                <span style={{ border: "1.5px solid #ddd", color: "#333", padding: "6px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: 600 }}>{hero.btnSecondary}</span>
              </div>
            </div>

            <button type="submit" className="admin-btn">Salveaza Hero Section</button>
          </div>
        </form>
      )}

      {/* STATS TAB */}
      {activeTab === "stats" && (
        <form onSubmit={saveStats}>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: "20px" }}>Statistici Hero</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>Cele 3 cifre afisate sub butoanele din hero section.</p>
            {stats.map((s, i) => (
              <div key={i} className="field-row" style={{ marginBottom: "16px" }}>
                <div>
                  <label className="admin-label">Valoare {i + 1}</label>
                  <input className="admin-input" value={s.value} onChange={e => setStats(prev => prev.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} placeholder="ex: 500+" />
                </div>
                <div>
                  <label className="admin-label">Label {i + 1}</label>
                  <input className="admin-input" value={s.label} onChange={e => setStats(prev => prev.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} placeholder="ex: Proiecte livrate" />
                </div>
              </div>
            ))}

            {/* Preview */}
            <div style={{ background: "#f5f5f3", borderRadius: "10px", padding: "16px", marginBottom: "20px", display: "flex", gap: "32px" }}>
              {stats.map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "#8DC63F" }}>{s.value}</div>
                  <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <button type="submit" className="admin-btn">Salveaza Statistici</button>
          </div>
        </form>
      )}

      {/* FEATURES TAB */}
      {activeTab === "features" && (
        <form onSubmit={saveFeatures}>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: "20px" }}>Feature Cards</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>Cele 4 carduri din sectiunea "De ce sa alegi Kalio?"</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
              {features.map((f, i) => (
                <div key={i} style={{ background: "#f5f5f3", borderRadius: "10px", padding: "18px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#8DC63F", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>Card {i + 1}</div>
                  <div className="field-group" style={{ marginBottom: "12px" }}>
                    <label className="admin-label">Titlu</label>
                    <input className="admin-input" value={f.title} onChange={e => setFeatures(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} />
                  </div>
                  <div className="field-group" style={{ marginBottom: "0" }}>
                    <label className="admin-label">Descriere</label>
                    <textarea className="admin-input" rows={2} value={f.desc} onChange={e => setFeatures(prev => prev.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} style={{ resize: "vertical" }} />
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" className="admin-btn">Salveaza Feature Cards</button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
