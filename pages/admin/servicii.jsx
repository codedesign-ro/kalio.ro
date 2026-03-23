import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout, { Toast } from "../../components/admin/AdminLayout";

export default function AdminServicii() {
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("hero");

  const [hero, setHero] = useState({
    title: "Solutii modulare pentru",
    titleHighlight: "fiecare spatiu.",
    subtitle: "Mobilier personalizat, construit pe un sistem modular eficient si flexibil.",
  });

  const [configOptions, setConfigOptions] = useState([
    { id: 1, label: "Gama variata de culori moderne" },
    { id: 2, label: "Fronturi mate, lucioase sau texturate" },
    { id: 3, label: "Manere si butoni in diferite stiluri" },
    { id: 4, label: "Sertare standard si sertare tip pan" },
    { id: 5, label: "Plinte in mai multe variante" },
    { id: 6, label: "Feronerie Blum (premium) sau medie" },
    { id: 7, label: "Carcase speciale pentru dimensiuni personalizate" },
    { id: 8, label: "Adaptabil pentru bucatarie, dressing, living" },
  ]);

  const [process, setProcess] = useState([
    { step: "01", title: "Configurezi", desc: "Alegi dimensiunile, culorile, fronturile si toate detaliile dorite." },
    { step: "02", title: "Confirmam", desc: "Echipa Kalio verifica configuratia si te contactam pentru confirmare." },
    { step: "03", title: "Producem", desc: "Mobilierul tau este produs cu grija in atelierul nostru." },
    { step: "04", title: "Livram", desc: "Livram rapid la adresa ta, gata pentru asamblare DIY usoara." },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("kalio_admin_auth")) {
      router.push("/admin");
    }
  }, []);

  function saveHero(e) { e.preventDefault(); setToast({ message: "Hero salvat!", type: "success" }); }
  function saveConfig(e) { e.preventDefault(); setToast({ message: "Optiuni configurare salvate!", type: "success" }); }
  function saveProcess(e) { e.preventDefault(); setToast({ message: "Pasi proces salvati!", type: "success" }); }

  const TABS = [
    { id: "hero", label: "Hero" },
    { id: "config", label: "Optiuni Configurare" },
    { id: "process", label: "Cum Functioneaza" },
  ];

  return (
    <AdminLayout title="Servicii">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div style={{ marginBottom: "28px" }}>
        <h2 className="admin-section-title">Servicii</h2>
        <p className="admin-section-subtitle">Editeaza continutul paginii Servicii.</p>
      </div>

      <div style={{ display: "flex", gap: "4px", background: "#f5f5f3", borderRadius: "10px", padding: "4px", marginBottom: "28px", width: "fit-content" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s", background: activeTab === t.id ? "#fff" : "transparent", color: activeTab === t.id ? "#1a1a1a" : "#888", boxShadow: activeTab === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
            {t.label}
          </button>
        ))}
      </div>

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
            <button type="submit" className="admin-btn">Salveaza Hero</button>
          </div>
        </form>
      )}

      {activeTab === "config" && (
        <form onSubmit={saveConfig}>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: "6px" }}>Optiuni Configurare Mobilier</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>Cele 8 optiuni afisate in grila de configurare.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {configOptions.map((opt, i) => (
                <div key={opt.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#aaa", width: "20px", textAlign: "center" }}>{i + 1}</span>
                  <input className="admin-input" value={opt.label} onChange={e => setConfigOptions(prev => prev.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
                </div>
              ))}
            </div>
            <button type="submit" className="admin-btn">Salveaza Optiuni</button>
          </div>
        </form>
      )}

      {activeTab === "process" && (
        <form onSubmit={saveProcess}>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: "6px" }}>Cum Functioneaza (4 pasi)</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>Cei 4 pasi afisati in sectiunea "Cum functioneaza".</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              {process.map((step, i) => (
                <div key={step.step} style={{ background: "#f5f5f3", borderRadius: "12px", padding: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <div style={{ width: "32px", height: "32px", background: "#f0f9e0", border: "2px solid #8DC63F", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, color: "#8DC63F", flexShrink: 0 }}>{step.step}</div>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#555" }}>Pasul {i + 1}</span>
                  </div>
                  <div className="field-row" style={{ marginBottom: "0" }}>
                    <div>
                      <label className="admin-label">Titlu pas</label>
                      <input className="admin-input" value={step.title} onChange={e => setProcess(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} />
                    </div>
                    <div>
                      <label className="admin-label">Descriere</label>
                      <input className="admin-input" value={step.desc} onChange={e => setProcess(prev => prev.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" className="admin-btn">Salveaza Pasi</button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
