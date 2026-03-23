// ─── CONTACT PAGE ────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout, { Toast } from "../../components/admin/AdminLayout";
import pb from "../../lib/pocketbase";

export function AdminContact() {
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState({});
  const [contact, setContact] = useState({
    address: "Str. Marului 121, Baia Mare",
    city: "Baia Mare, Romania",
    email: "contact@kalio.ro",
    phone: "+40 754 32 43 58",
    hoursWeekday: "Luni - Vineri: 9:00 - 18:00",
    hoursSaturday: "Sambata: 9:00 - 14:00",
    hoursSunday: "Duminica: Inchis",
    mapsUrl: "https://maps.google.com/?q=Str.+Marului+121+Baia+Mare",
    heroTitle: "Hai sa discutam despre",
    heroHighlight: "proiectul tau.",
    heroSubtitle: "Indiferent daca ai nevoie de informatii despre configurare, livrare sau materiale, echipa Kalio este pregatita sa te ajute.",
  });

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
        filter: 'page = "contact"'
      });
      const map = {};
      const data = { ...contact };
      for (const item of items) {
        map[item.key] = item;
        if (item.key in data) {
          data[item.key] = item.value;
        }
      }
      setRecords(map);
      setContact(data);
    } catch (err) {
      console.error("Error fetching contact content:", err);
    }
    setLoading(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      for (const [key, value] of Object.entries(contact)) {
        if (records[key]) {
          await pb.collection('site_content').update(records[key].id, { value });
        } else {
          const created = await pb.collection('site_content').create({ page: 'contact', key, value });
          setRecords(prev => ({ ...prev, [key]: created }));
        }
      }
      setToast({ message: "Date de contact salvate!", type: "success" });
    } catch (err) {
      console.error("Error saving contact:", err);
      setToast({ message: "Eroare la salvare.", type: "error" });
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Contact">
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
          <div style={{ fontSize: "16px", fontWeight: 600 }}>Se incarca...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Contact">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div style={{ marginBottom: "28px" }}>
        <h2 className="admin-section-title">Contact</h2>
        <p className="admin-section-subtitle">Actualizeaza datele de contact si textele de pe pagina Contact.</p>
      </div>
      <form onSubmit={handleSave} style={{ display: "grid", gap: "24px" }}>
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: "20px" }}>Date de contact</h3>
          <div className="field-group">
            <label className="admin-label">Adresa</label>
            <input className="admin-input" value={contact.address} onChange={e => setContact(p => ({ ...p, address: e.target.value }))} placeholder="Str. Marului 121, Baia Mare" />
          </div>
          <div className="field-row">
            <div>
              <label className="admin-label">Email</label>
              <input className="admin-input" type="email" value={contact.email} onChange={e => setContact(p => ({ ...p, email: e.target.value }))} placeholder="contact@kalio.ro" />
            </div>
            <div>
              <label className="admin-label">Telefon</label>
              <input className="admin-input" value={contact.phone} onChange={e => setContact(p => ({ ...p, phone: e.target.value }))} placeholder="+40 754 32 43 58" />
            </div>
          </div>
          <div className="field-group">
            <label className="admin-label">Link Google Maps</label>
            <input className="admin-input" value={contact.mapsUrl} onChange={e => setContact(p => ({ ...p, mapsUrl: e.target.value }))} placeholder="https://maps.google.com/..." />
          </div>
        </div>

        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: "20px" }}>Program</h3>
          <div className="field-group">
            <label className="admin-label">Luni - Vineri</label>
            <input className="admin-input" value={contact.hoursWeekday} onChange={e => setContact(p => ({ ...p, hoursWeekday: e.target.value }))} placeholder="Luni - Vineri: 9:00 - 18:00" />
          </div>
          <div className="field-row">
            <div>
              <label className="admin-label">Sambata</label>
              <input className="admin-input" value={contact.hoursSaturday} onChange={e => setContact(p => ({ ...p, hoursSaturday: e.target.value }))} placeholder="Sambata: 9:00 - 14:00" />
            </div>
            <div>
              <label className="admin-label">Duminica</label>
              <input className="admin-input" value={contact.hoursSunday} onChange={e => setContact(p => ({ ...p, hoursSunday: e.target.value }))} placeholder="Duminica: Inchis" />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: "20px" }}>Text Hero Section</h3>
          <div className="field-row">
            <div>
              <label className="admin-label">Titlu</label>
              <input className="admin-input" value={contact.heroTitle} onChange={e => setContact(p => ({ ...p, heroTitle: e.target.value }))} />
            </div>
            <div>
              <label className="admin-label">Highlight (verde italic)</label>
              <input className="admin-input" value={contact.heroHighlight} onChange={e => setContact(p => ({ ...p, heroHighlight: e.target.value }))} />
            </div>
          </div>
          <div className="field-group">
            <label className="admin-label">Subtitlu</label>
            <textarea className="admin-input" rows={3} value={contact.heroSubtitle} onChange={e => setContact(p => ({ ...p, heroSubtitle: e.target.value }))} style={{ resize: "vertical" }} />
          </div>
        </div>

        <button type="submit" className="admin-btn" style={{ width: "fit-content" }}>Salveaza toate datele</button>
      </form>
    </AdminLayout>
  );
}

export default AdminContact;
