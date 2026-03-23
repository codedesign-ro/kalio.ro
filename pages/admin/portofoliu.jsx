import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout, { Toast } from "../../components/admin/AdminLayout";

const INITIAL_PROJECTS = [
  { id: 1, title: "Bucatarie moderna - Baia Mare", category: "Bucatarie", desc: "Bucatarie modulara cu fronturi mate gri antracit si blat de quartz alb.", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", featured: true },
  { id: 2, title: "Dressing walk-in - Cluj", category: "Dressing", desc: "Dressing personalizat cu iluminare LED si fronturi albe lucioase.", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", featured: false },
  { id: 3, title: "Bucatarie insula - Oradea", category: "Bucatarie", desc: "Bucatarie cu insula centrala, finisaj lemn natur si negru mat.", img: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=400&q=80", featured: true },
  { id: 4, title: "Mobilier living - Timisoara", category: "Living", desc: "Set complet living cu nisa TV, biblioteca si comoda cu fronturi texturate.", img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400&q=80", featured: false },
];

const CATEGORIES = ["Bucatarie", "Dressing", "Living", "Baie"];

export default function AdminPortofoliu() {
  const router = useRouter();
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ title: "", category: "Bucatarie", desc: "", img: "", featured: false });

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("kalio_admin_auth")) {
      router.push("/admin");
    }
  }, []);

  function openAdd() {
    setEditing(null);
    setForm({ title: "", category: "Bucatarie", desc: "", img: "", featured: false });
    setShowModal(true);
  }

  function openEdit(project) {
    setEditing(project.id);
    setForm({ title: project.title, category: project.category, desc: project.desc, img: project.img, featured: project.featured });
    setShowModal(true);
  }

  function handleSave(e) {
    e.preventDefault();
    if (editing) {
      setProjects(prev => prev.map(p => p.id === editing ? { ...p, ...form } : p));
      setToast({ message: "Proiect actualizat cu succes!", type: "success" });
    } else {
      setProjects(prev => [...prev, { id: Date.now(), ...form }]);
      setToast({ message: "Proiect adaugat cu succes!", type: "success" });
    }
    setShowModal(false);
  }

  function handleDelete(id) {
    setProjects(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
    setToast({ message: "Proiect sters.", type: "success" });
  }

  function toggleFeatured(id) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  }

  return (
    <AdminLayout title="Portofoliu">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h2 className="admin-section-title">Portofoliu</h2>
          <p className="admin-section-subtitle">Gestioneaza proiectele afisate pe site. {projects.length} proiecte total.</p>
        </div>
        <button className="admin-btn" onClick={openAdd}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Proiect nou
        </button>
      </div>

      {/* Projects grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {projects.map(p => (
          <div key={p.id} className="admin-card" style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
              <img src={p.img || "https://via.placeholder.com/400x180"} alt={p.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "6px" }}>
                <button onClick={() => toggleFeatured(p.id)}
                  style={{ background: p.featured ? "#8DC63F" : "rgba(255,255,255,0.9)", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: p.featured ? "#fff" : "#555" }}>
                  {p.featured ? "Featured" : "Normal"}
                </button>
              </div>
              <div style={{ position: "absolute", top: "10px", left: "10px" }}>
                <span className="admin-badge green">{p.category}</span>
              </div>
            </div>
            <div style={{ padding: "16px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "6px", color: "#1a1a1a" }}>{p.title}</h3>
              <p style={{ fontSize: "12px", color: "#888", lineHeight: 1.6, marginBottom: "14px" }}>{p.desc}</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="admin-btn secondary" style={{ flex: 1, justifyContent: "center", padding: "8px 12px", fontSize: "13px" }} onClick={() => openEdit(p)}>
                  Editeaza
                </button>
                <button className="admin-btn danger" style={{ padding: "8px 12px", fontSize: "13px" }} onClick={() => setDeleteConfirm(p.id)}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2h4v2M5.5 6v5M8.5 6v5M3 4l.7 8h6.6L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add new card */}
        <button onClick={openAdd} style={{ border: "2px dashed #ddd", borderRadius: "14px", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", padding: "40px", transition: "all 0.2s", minHeight: "280px" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#8DC63F"; e.currentTarget.style.background = "#f0f9e0"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.background = "none"; }}>
          <div style={{ width: "48px", height: "48px", background: "#f0f9e0", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="#8DC63F" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#888" }}>Adauga proiect</span>
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700 }}>{editing ? "Editeaza proiect" : "Proiect nou"}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "22px", lineHeight: 1 }}>x</button>
            </div>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label className="admin-label">Titlu proiect *</label>
                <input className="admin-input" placeholder="ex: Bucatarie moderna - Baia Mare" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
              </div>
              <div>
                <label className="admin-label">Categorie *</label>
                <select className="admin-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Descriere *</label>
                <textarea className="admin-input" placeholder="Descriere scurta a proiectului..." value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} rows={3} style={{ resize: "vertical" }} required />
              </div>
              <div>
                <label className="admin-label">URL Imagine *</label>
                <input className="admin-input" placeholder="https://..." value={form.img} onChange={e => setForm(p => ({ ...p, img: e.target.value }))} required />
                {form.img && (
                  <img src={form.img} alt="preview" style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px", marginTop: "8px" }} />
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} style={{ width: "16px", height: "16px", accentColor: "#8DC63F" }} />
                <label htmlFor="featured" style={{ fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>Proiect featured (afisat prominent)</label>
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button type="button" className="admin-btn secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowModal(false)}>Anuleaza</button>
                <button type="submit" className="admin-btn" style={{ flex: 1, justifyContent: "center" }}>{editing ? "Salveaza" : "Adauga proiect"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "400px", textAlign: "center" }}>
            <div style={{ width: "56px", height: "56px", background: "#fff5f5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>Stergi proiectul?</h3>
            <p style={{ fontSize: "14px", color: "#888", marginBottom: "24px" }}>Aceasta actiune nu poate fi anulata.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="admin-btn secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setDeleteConfirm(null)}>Anuleaza</button>
              <button style={{ flex: 1, background: "#e74c3c", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }} onClick={() => handleDelete(deleteConfirm)}>Sterge</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
