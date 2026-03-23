import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout, { Toast } from "../../components/admin/AdminLayout";
import pb from "../../lib/pocketbase";

export default function AdminHomepage() {
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState({});

  const [hero, setHero] = useState({
    badge: "",
    title: "",
    titleHighlight: "",
    subtitle: "",
    btnPrimary: "",
    btnSecondary: "",
  });

  const [stats, setStats] = useState([
    { value: "", label: "" },
    { value: "", label: "" },
    { value: "", label: "" },
  ]);

  const [features, setFeatures] = useState([
    { title: "", desc: "" },
    { title: "", desc: "" },
    { title: "", desc: "" },
    { title: "", desc: "" },
  ]);

  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push("/admin");
      return;
    }
    fetchContent();
  }, []);

  async function fetchContent() {
    setLoading(true);
    try {
      const items = await pb.collection('site_content').getFullList({
        filter: 'page = "homepage"'
      });
      const map = {};
      for (const item of items) {
        map[item.key] = item;
      }
      setRecords(map);

      if (Object.keys(map).length > 0) {
        setHero({
          badge: map.hero_badge?.value || "",
          title: map.hero_title?.value || "",
          titleHighlight: map.hero_titleHighlight?.value || "",
          subtitle: map.hero_subtitle?.value || "",
          btnPrimary: map.hero_btnPrimary?.value || "",
          btnSecondary: map.hero_btnSecondary?.value || "",
        });
        setStats([
          { value: map.stat_0_value?.value || "", label: map.stat_0_label?.value || "" },
          { value: map.stat_1_value?.value || "", label: map.stat_1_label?.value || "" },
          { value: map.stat_2_value?.value || "", label: map.stat_2_label?.value || "" },
        ]);
        setFeatures([
          { title: map.feature_0_title?.value || "", desc: map.feature_0_desc?.value || "" },
          { title: map.feature_1_title?.value || "", desc: map.feature_1_desc?.value || "" },
          { title: map.feature_2_title?.value || "", desc: map.feature_2_desc?.value || "" },
          { title: map.feature_3_title?.value || "", desc: map.feature_3_desc?.value || "" },
        ]);
      }
    } catch (err) {
      console.error("Error fetching homepage content:", err);
    }
    setLoading(false);
  }

  async function saveField(key, value) {
    if (records[key]) {
      const updated = await pb.collection('site_content').update(records[key].id, { value });
      setRecords(prev => ({ ...prev, [key]: updated }));
    } else {
      const created = await pb.collection('site_content').create({ page: 'homepage', key, value });
      setRecords(prev => ({ ...prev, [key]: created }));
    }
  }

  async function saveHero(e) {
    e.preventDefault();
    try {
      await saveField('hero_badge', hero.badge);
      await saveField('hero_title', hero.title);
      await saveField('hero_titleHighlight', hero.titleHighlight);
      await saveField('hero_subtitle', hero.subtitle);
      await saveField('hero_btnPrimary', hero.btnPrimary);
      await saveField('hero_btnSecondary', hero.btnSecondary);
      setToast({ message: "Hero section salvata!", type: "success" });
    } catch (err) {
      console.error("Error saving hero:", err);
      setToast({ message: "Eroare la salvare.", type: "error" });
    }
  }

  async function saveStats(e) {
    e.preventDefault();
    try {
      for (let i = 0; i < stats.length; i++) {
        await saveField(`stat_${i}_value`, stats[i].value);
        await saveField(`stat_${i}_label`, stats[i].label);
      }
      setToast({ message: "Statistici salvate!", type: "success" });
    } catch (err) {
      console.error("Error saving stats:", err);
      setToast({ message: "Eroare la salvare.", type: "error" });
    }
  }

  async function saveFeatures(e) {
    e.preventDefault();
    try {
      for (let i = 0; i < features.length; i++) {
        await saveField(`feature_${i}_title`, features[i].title);
        await saveField(`feature_${i}_desc`, features[i].desc);
      }
      setToast({ message: "Features salvate!", type: "success" });
    } catch (err) {
      console.error("Error saving features:", err);
      setToast({ message: "Eroare la salvare.", type: "error" });
    }
  }

  const TABS = [
    { id: "hero", label: "Hero Section" },
    { id: "stats", label: "Statistici" },
    { id: "features", label: "Feature Cards" },
  ];

  if (loading) {
    return (
      <AdminLayout title="Homepage">
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
          <div style={{ fontSize: "16px", fontWeight: 600 }}>Se incarca...</div>
        </div>
      </AdminLayout>
    );
  }

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
