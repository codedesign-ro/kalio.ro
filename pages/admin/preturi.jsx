import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout, { Toast } from "../../components/admin/AdminLayout";
import pb from "../../lib/pocketbase";

const DEFAULT_MODULES = [
  { module_id: "base", label: "Corp de Jos", base_price: 280 },
  { module_id: "wall", label: "Corp de Sus", base_price: 220 },
  { module_id: "tall", label: "Corp Inalt", base_price: 420 },
  { module_id: "island", label: "Insula", base_price: 650 },
];

const DEFAULT_MULTIPLIERS = [
  { module_id: "front_mat", label: "Mat", base_price: 1.0 },
  { module_id: "front_lucios", label: "Lucios", base_price: 1.15 },
  { module_id: "front_texturat", label: "Texturat", base_price: 1.10 },
  { module_id: "front_lemn", label: "Lemn", base_price: 1.20 },
  { module_id: "handles_bare", label: "Bare Metalice", base_price: 1.0 },
  { module_id: "handles_rotunde", label: "Butoni Rotunzi", base_price: 1.0 },
  { module_id: "handles_ingropat", label: "Fara Maner", base_price: 0.95 },
  { module_id: "handles_clasic", label: "Maner Clasic", base_price: 1.05 },
  { module_id: "hardware_blum", label: "Blum Premium", base_price: 1.20 },
  { module_id: "hardware_standard", label: "Standard", base_price: 1.0 },
  { module_id: "drawers_standard", label: "Standard", base_price: 1.0 },
  { module_id: "drawers_pan", label: "Tip Pan", base_price: 1.10 },
  { module_id: "drawers_fara", label: "Fara Sertare", base_price: 0.90 },
];

const MODULE_EMOJIS = { base: "🗄️", wall: "🔲", tall: "🚪", island: "🏝️" };
const MODULE_DESCS = {
  base: "Pret de baza per corp standard 60x85x60cm",
  wall: "Pret de baza per corp standard 60x70x35cm",
  tall: "Pret de baza per corp standard 60x210x60cm",
  island: "Pret de baza per insula standard 120x90x80cm",
};

const MULTIPLIER_GROUPS = [
  { label: "Tip Front", prefix: "front_", items: ["front_mat", "front_lucios", "front_texturat", "front_lemn"] },
  { label: "Manere", prefix: "handles_", items: ["handles_bare", "handles_rotunde", "handles_ingropat", "handles_clasic"] },
  { label: "Feronerie", prefix: "hardware_", items: ["hardware_blum", "hardware_standard"] },
  { label: "Sertare", prefix: "drawers_", items: ["drawers_standard", "drawers_pan", "drawers_fara"] },
];

export default function AdminPreturi() {
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [multipliers, setMultipliers] = useState([]);

  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push("/admin");
      return;
    }
    fetchPricing();
  }, []);

  async function fetchPricing() {
    setLoading(true);
    try {
      let records = await pb.collection('pricing').getFullList();

      if (records.length === 0) {
        const allDefaults = [...DEFAULT_MODULES, ...DEFAULT_MULTIPLIERS];
        for (const item of allDefaults) {
          await pb.collection('pricing').create(item);
        }
        records = await pb.collection('pricing').getFullList();
      }

      const moduleIds = ["base", "wall", "tall", "island"];
      setModules(records.filter(r => moduleIds.includes(r.module_id)));
      setMultipliers(records.filter(r => !moduleIds.includes(r.module_id)));
    } catch (err) {
      console.error("Error fetching pricing:", err);
    }
    setLoading(false);
  }

  async function saveModules(e) {
    e.preventDefault();
    try {
      for (const m of modules) {
        await pb.collection('pricing').update(m.id, { base_price: m.base_price });
      }
      setToast({ message: "Preturi module salvate!", type: "success" });
    } catch (err) {
      console.error("Error saving modules:", err);
      setToast({ message: "Eroare la salvare.", type: "error" });
    }
  }

  async function saveMultipliers(e) {
    e.preventDefault();
    try {
      for (const m of multipliers) {
        await pb.collection('pricing').update(m.id, { base_price: m.base_price });
      }
      setToast({ message: "Multiplicatori salvati!", type: "success" });
    } catch (err) {
      console.error("Error saving multipliers:", err);
      setToast({ message: "Eroare la salvare.", type: "error" });
    }
  }

  function getModulePrice(moduleId) {
    const m = modules.find(x => x.module_id === moduleId);
    return m ? m.base_price : 0;
  }

  function getMultiplierValue(moduleId) {
    const m = multipliers.find(x => x.module_id === moduleId);
    return m ? m.base_price : 1;
  }

  function updateModulePrice(moduleId, price) {
    setModules(prev => prev.map(m => m.module_id === moduleId ? { ...m, base_price: Number(price) } : m));
  }

  function updateMultiplierValue(moduleId, value) {
    setMultipliers(prev => prev.map(m => m.module_id === moduleId ? { ...m, base_price: Number(value) } : m));
  }

  function getMultiplierLabel(moduleId) {
    const m = multipliers.find(x => x.module_id === moduleId);
    return m ? m.label : moduleId;
  }

  if (loading) {
    return (
      <AdminLayout title="Preturi Configurator">
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
          <div style={{ fontSize: "16px", fontWeight: 600 }}>Se incarca preturile...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Preturi Configurator">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: "28px" }}>
        <h2 className="admin-section-title">Preturi Configurator</h2>
        <p className="admin-section-subtitle">Modifica preturile de baza si multiplicatorii pentru configuratorul de bucatarie.</p>
      </div>

      <div style={{ display: "grid", gap: "24px" }}>

        {/* Base prices */}
        <form onSubmit={saveModules}>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: "6px" }}>Preturi de baza module (EUR)</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>Pretul pentru un modul la dimensiunile standard. Pretul final se calculeaza proportional cu dimensiunile alese de client.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "24px" }}>
              {modules.map(m => (
                <div key={m.id} style={{ background: "#f5f5f3", borderRadius: "12px", padding: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "24px" }}>{MODULE_EMOJIS[m.module_id] || "📦"}</span>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700 }}>{m.label}</div>
                      <div style={{ fontSize: "11px", color: "#888" }}>{MODULE_DESCS[m.module_id] || ""}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label className="admin-label" style={{ margin: 0, whiteSpace: "nowrap" }}>Pret EUR</label>
                    <div style={{ position: "relative", flex: 1 }}>
                      <input className="admin-input" type="number" min="0" step="10" value={m.base_price}
                        onChange={e => updateModulePrice(m.module_id, e.target.value)}
                        style={{ paddingRight: "40px" }} />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "#888", fontWeight: 600 }}>€</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price preview */}
            <div style={{ background: "#f0f9e0", border: "1.5px solid #c8e88a", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#5a8a1a", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Exemplu calcul pret</div>
              <div style={{ fontSize: "13px", color: "#444", lineHeight: 1.8 }}>
                <div>1x Corp de Jos (60cm) = <strong style={{ color: "#8DC63F" }}>{getModulePrice("base")} EUR</strong></div>
                <div>5x Corp de Jos (60cm) = <strong style={{ color: "#8DC63F" }}>{getModulePrice("base") * 5} EUR</strong></div>
                <div>1x Corp Inalt + 3x Corp de Jos + 2x Corp de Sus = <strong style={{ color: "#8DC63F" }}>{getModulePrice("tall") + getModulePrice("base") * 3 + getModulePrice("wall") * 2} EUR</strong></div>
              </div>
            </div>

            <button type="submit" className="admin-btn">Salveaza Preturi Module</button>
          </div>
        </form>

        {/* Multipliers */}
        <form onSubmit={saveMultipliers}>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: "6px" }}>Multiplicatori optiuni</h3>
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>
              Valoare 1.0 = fara modificare. 1.15 = +15% la pret. 0.95 = -5% la pret.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              {MULTIPLIER_GROUPS.map(group => (
                <div key={group.label} style={{ background: "#f5f5f3", borderRadius: "12px", padding: "18px" }}>
                  <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#555", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{group.label}</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {group.items.map(itemKey => {
                      const val = getMultiplierValue(itemKey);
                      return (
                        <div key={itemKey} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                          <label style={{ fontSize: "13px", color: "#333", fontWeight: 500 }}>{getMultiplierLabel(itemKey)}</label>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <input className="admin-input" type="number" min="0.5" max="3" step="0.05"
                              value={val}
                              onChange={e => updateMultiplierValue(itemKey, e.target.value)}
                              style={{ width: "80px", textAlign: "center" }} />
                            <span style={{ fontSize: "12px", color: val > 1 ? "#8DC63F" : val < 1 ? "#e74c3c" : "#888", fontWeight: 700, minWidth: "40px" }}>
                              {val > 1 ? `+${Math.round((val - 1) * 100)}%` : val < 1 ? `-${Math.round((1 - val) * 100)}%` : "="}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" className="admin-btn">Salveaza Multiplicatori</button>
          </div>
        </form>

      </div>
    </AdminLayout>
  );
}
