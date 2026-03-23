import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout, { Toast } from "../../components/admin/AdminLayout";

export default function AdminDespreNoi() {
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("hero");

  const [hero, setHero] = useState({
    title: "Mobilier modular creat pentru",
    titleHighlight: "libertate si flexibilitate.",
    subtitle: "La Kalio, construim mobilier care se adapteaza spatiului tau, nu invers. Combinam designul modern cu un sistem modular inteligent.",
  });

  const [mission, setMission] = useState({
    title: "Calitate in",
    titleHighlight: "fiecare detaliu",
    text1: "Fiecare corp de mobilier Kalio este realizat din PAL hidrofugat de inalta calitate, cu spate solid de 8 mm pentru rezistenta sporita.",
    text2: "Kalio ofera echilibrul perfect intre personalizare, eficienta si calitate. Alegi culori, fronturi, manere, sertare si feronerie.",
    stat1Value: "10+", stat1Label: "Ani experienta",
    stat2Value: "500+", stat2Label: "Proiecte livrate",
    stat3Value: "100%", stat3Label: "Personalizabil",
  });

  const [images, setImages] = useState([
    { id: 1, url: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&q=80", label: "Imagine 1 (stanga sus)" },
    { id: 2, url: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80", label: "Imagine 2 (dreapta sus)" },
    { id: 3, url: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80", label: "Imagine 3 (stanga jos)" },
    { id: 4, url: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80", label: "Imagine 4 (dreapta jos)" },
    { id: 5, url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80", label: "Imagine Hero (mare)" },
    { id: 6, url: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=900&q=80", label: "Imagine Sectiunea De ce Kalio?" },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("kalio_admin_auth")) {
      router.push("/admin");
    }
  }, []);

  function saveHero(e) { e.preventDefault(); setToast({ message: "Hero salvat!", type: "success" }); }
  function saveMission(e) { e.preventDefault(); setToast({ message: "Sectiunea misiune salvata!", type: "success" }); }
  function saveImages(e) { e.preventDefault(); setToast({ message: "Imagini actualizate!", type: "success" }); }

  const TABS = [
    { id: "hero", label: "Hero" },
    { id: "mission", label: "Misiune" },
    { id: "images", label: "Imagini" },
  ];

  return (
    <AdminLayout title="Despre Noi">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: "28px" }}>
        <h2 className="admin-section-title">Despre Noi</h2>
        <p className="admin-section-subtitle">Editeaza continutul si imaginile paginii Despre Noi.</p>
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
            <div className="field-row">
              <div>
                <label className="admin-label">Titlu</label>
                <input className="admin-input" value={hero.title} onChange={e => setHero(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="admin-label">Highlight (verde italic)</label>
                <input className="admin-input" value={hero.titleHighlight} onChange={e => setHero(p => ({ ...p, titleHighlight: e.target.value }))} />
              </div>
            </div>
            <div className="field-group">
              <label className="admin-label">Subtitlu</label>
              <textarea className="admin-input" rows={3} value={hero.subtitle} onChange={e => setHero(p => ({ ...p, subtitle: e.target.value }))} style={{ resize: "vertical" }} />
            </div>
            <div style={{ background: "#f5f5f3", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#888", textTransform: "uppercase", marginBottom: "8px" }}>Preview</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, lineHeight: 1.2 }}>
                {hero.title} <em style={{ color: "#8DC63F" }}>{hero.titleHighlight}</em>
              </div>
              <p style={{ fontSize: "13px", color: "#666", marginTop: "6px", lineHeight: 1.6 }}>{hero.subtitle}</p>
            </div>
            <button type="submit" className="admin-btn">Salveaza Hero</button>
          </div>
        </form>
      )}

      {/* MISSION TAB */}
      {activeTab === "mission" && (
        <form onSubmit={saveMission}>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: "20px" }}>Sectiunea Misiune</h3>
            <div className="field-row">
              <div>
                <label className="admin-label">Titlu</label>
                <input className="admin-input" value={mission.title} onChange={e => setMission(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="admin-label">Highlight (verde)</label>
                <input className="admin-input" value={mission.titleHighlight} onChange={e => setMission(p => ({ ...p, titleHighlight: e.target.value }))} />
              </div>
            </div>
            <div className="field-group">
              <label className="admin-label">Paragraf 1</label>
              <textarea className="admin-input" rows={3} value={mission.text1} onChange={e => setMission(p => ({ ...p, text1: e.target.value }))} style={{ resize: "vertical" }} />
            </div>
            <div className="field-group">
              <label className="admin-label">Paragraf 2</label>
              <textarea className="admin-input" rows={3} value={mission.text2} onChange={e => setMission(p => ({ ...p, text2: e.target.value }))} style={{ resize: "vertical" }} />
            </div>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#555", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Statistici</h4>
            {[
              ["stat1Value", "stat1Label", "Stat 1"],
              ["stat2Value", "stat2Label", "Stat 2"],
              ["stat3Value", "stat3Label", "Stat 3"],
            ].map(([vKey, lKey, label]) => (
              <div key={vKey} className="field-row" style={{ marginBottom: "12px" }}>
                <div>
                  <label className="admin-label">{label} - Valoare</label>
                  <input className="admin-input" value={mission[vKey]} onChange={e => setMission(p => ({ ...p, [vKey]: e.target.value }))} placeholder="ex: 10+" />
                </div>
                <div>
                  <label className="admin-label">{label} - Label</label>
                  <input className="admin-input" value={mission[lKey]} onChange={e => setMission(p => ({ ...p, [lKey]: e.target.value }))} placeholder="ex: Ani experienta" />
                </div>
              </div>
            ))}
            <button type="submit" className="admin-btn" style={{ marginTop: "8px" }}>Salveaza Misiune</button>
          </div>
        </form>
      )}

      {/* IMAGES TAB */}
      {activeTab === "images" && (
        <form onSubmit={saveImages}>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: "8px" }}>Imagini Pagina</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>Actualizeaza URL-urile imaginilor afisate pe pagina Despre Noi.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
              {images.map((img, i) => (
                <div key={img.id} style={{ background: "#f5f5f3", borderRadius: "12px", padding: "16px", display: "grid", gridTemplateColumns: "120px 1fr", gap: "16px", alignItems: "center" }}>
                  <div style={{ height: "80px", borderRadius: "8px", overflow: "hidden", background: "#eee" }}>
                    <img src={img.url} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <label className="admin-label" style={{ marginBottom: "8px" }}>{img.label}</label>
                    <input className="admin-input" value={img.url} onChange={e => setImages(prev => prev.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} placeholder="https://..." />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "#f0f9e0", border: "1.5px solid #c8e88a", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#5a8a1a", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#5a8a1a" strokeWidth="1.5"/><path d="M8 5v3M8 10v.5" stroke="#5a8a1a" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Poti folosi URL-uri de pe Unsplash, Google Drive sau orice alta sursa publica de imagini.
            </div>
            <button type="submit" className="admin-btn">Salveaza Imagini</button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
