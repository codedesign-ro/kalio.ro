import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Upload } from "lucide-react";
import AdminLayout, { Toast } from "../../components/admin/AdminLayout";
import pb from "../../lib/pocketbase";

export default function AdminDespreNoi() {
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState({});

  const [hero, setHero] = useState({ title: "", titleHighlight: "", subtitle: "" });

  const [mission, setMission] = useState({
    title: "", titleHighlight: "", text1: "", text2: "",
    stat1Value: "", stat1Label: "",
    stat2Value: "", stat2Label: "",
    stat3Value: "", stat3Label: "",
  });

  const [uploadingIdx, setUploadingIdx] = useState(null);
  const fileInputRefs = useRef([]);

  const [images, setImages] = useState([
    { id: 1, url: "", label: "Imagine 1 (stanga sus)" },
    { id: 2, url: "", label: "Imagine 2 (dreapta sus)" },
    { id: 3, url: "", label: "Imagine 3 (stanga jos)" },
    { id: 4, url: "", label: "Imagine 4 (dreapta jos)" },
    { id: 5, url: "", label: "Imagine Hero (mare)" },
    { id: 6, url: "", label: "Imagine Sectiunea De ce Kalio?" },
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
        filter: 'page = "despre-noi"'
      });
      const map = {};
      for (const item of items) {
        map[item.key] = item;
      }
      setRecords(map);

      if (Object.keys(map).length > 0) {
        setHero({
          title: map.hero_title?.value || "",
          titleHighlight: map.hero_titleHighlight?.value || "",
          subtitle: map.hero_subtitle?.value || "",
        });
        setMission({
          title: map.mission_title?.value || "",
          titleHighlight: map.mission_titleHighlight?.value || "",
          text1: map.mission_text1?.value || "",
          text2: map.mission_text2?.value || "",
          stat1Value: map.mission_stat1Value?.value || "",
          stat1Label: map.mission_stat1Label?.value || "",
          stat2Value: map.mission_stat2Value?.value || "",
          stat2Label: map.mission_stat2Label?.value || "",
          stat3Value: map.mission_stat3Value?.value || "",
          stat3Label: map.mission_stat3Label?.value || "",
        });
        setImages(prev => prev.map((img, i) => ({
          ...img,
          url: map[`image_${i}`]?.value || "",
        })));
      }
    } catch (err) {
      console.error("Error fetching despre-noi content:", err);
    }
    setLoading(false);
  }

  async function saveField(key, value) {
    if (records[key]) {
      const updated = await pb.collection('site_content').update(records[key].id, { value });
      setRecords(prev => ({ ...prev, [key]: updated }));
    } else {
      const created = await pb.collection('site_content').create({ page: 'despre-noi', key, value });
      setRecords(prev => ({ ...prev, [key]: created }));
    }
  }

  async function saveHero(e) {
    e.preventDefault();
    try {
      await saveField('hero_title', hero.title);
      await saveField('hero_titleHighlight', hero.titleHighlight);
      await saveField('hero_subtitle', hero.subtitle);
      setToast({ message: "Hero salvat!", type: "success" });
    } catch (err) {
      setToast({ message: "Eroare la salvare.", type: "error" });
    }
  }

  async function saveMission(e) {
    e.preventDefault();
    try {
      await saveField('mission_title', mission.title);
      await saveField('mission_titleHighlight', mission.titleHighlight);
      await saveField('mission_text1', mission.text1);
      await saveField('mission_text2', mission.text2);
      await saveField('mission_stat1Value', mission.stat1Value);
      await saveField('mission_stat1Label', mission.stat1Label);
      await saveField('mission_stat2Value', mission.stat2Value);
      await saveField('mission_stat2Label', mission.stat2Label);
      await saveField('mission_stat3Value', mission.stat3Value);
      await saveField('mission_stat3Label', mission.stat3Label);
      setToast({ message: "Sectiunea misiune salvata!", type: "success" });
    } catch (err) {
      setToast({ message: "Eroare la salvare.", type: "error" });
    }
  }

  async function handleImageUpload(idx, e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIdx(idx);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const record = await pb.collection('media').create(formData);
      const fileUrl = pb.files.getUrl(record, record.file);
      setImages(prev => prev.map((img, i) => i === idx ? { ...img, url: fileUrl } : img));
      setToast({ message: "Imagine urcata cu succes!", type: "success" });
    } catch (err) {
      console.error("Error uploading image:", err);
      setToast({ message: "Eroare la urcarea imaginii.", type: "error" });
    }
    setUploadingIdx(null);
    if (fileInputRefs.current[idx]) fileInputRefs.current[idx].value = "";
  }

  async function saveImages(e) {
    e.preventDefault();
    try {
      for (let i = 0; i < images.length; i++) {
        await saveField(`image_${i}`, images[i].url);
      }
      setToast({ message: "Imagini actualizate!", type: "success" });
    } catch (err) {
      setToast({ message: "Eroare la salvare.", type: "error" });
    }
  }

  const TABS = [
    { id: "hero", label: "Hero" },
    { id: "mission", label: "Misiune" },
    { id: "images", label: "Imagini" },
  ];

  if (loading) {
    return (
      <AdminLayout title="Despre Noi">
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
          <div style={{ fontSize: "16px", fontWeight: 600 }}>Se incarca...</div>
        </div>
      </AdminLayout>
    );
  }

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
                    {img.url && <img src={img.url} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <div>
                    <label className="admin-label" style={{ marginBottom: "8px" }}>{img.label}</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input className="admin-input" value={img.url} onChange={e => setImages(prev => prev.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} placeholder="https://..." style={{ flex: 1 }} />
                      <input type="file" accept="image/*" ref={el => fileInputRefs.current[i] = el} onChange={e => handleImageUpload(i, e)} style={{ display: "none" }} />
                      <button type="button" disabled={uploadingIdx === i} onClick={() => fileInputRefs.current[i]?.click()}
                        style={{ background: uploadingIdx === i ? "#eee" : "#f0f9e0", border: "1.5px solid #8DC63F", color: "#6fa82e", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", fontWeight: 600, cursor: uploadingIdx === i ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                        <Upload size={14} />
                        {uploadingIdx === i ? "Se urca..." : "Upload"}
                      </button>
                    </div>
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
