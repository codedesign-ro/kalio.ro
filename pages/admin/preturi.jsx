import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout, { Toast } from "../../components/admin/AdminLayout";

export default function AdminPreturi() {
  const router = useRouter();
  const [toast, setToast] = useState(null);

  const [modules, setModules] = useState([
    { id: "base", label: "Corp de Jos", emoji: "🗄️", price: 280, desc: "Pret de baza per corp standard 60x85x60cm" },
    { id: "wall", label: "Corp de Sus", emoji: "🔲", price: 220, desc: "Pret de baza per corp standard 60x70x35cm" },
    { id: "tall", label: "Corp Inalt", emoji: "🚪", price: 420, desc: "Pret de baza per corp standard 60x210x60cm" },
    { id: "island", label: "Insula", emoji: "🏝️", price: 650, desc: "Pret de baza per insula standard 120x90x80cm" },
  ]);

  const [multipliers, setMultipliers] = useState({
    front_mat: 1.0,
    front_lucios: 1.15,
    front_texturat: 1.10,
    front_lemn: 1.20,
    handles_bare: 1.0,
    handles_rotunde: 1.0,
    handles_ingropat: 0.95,
    handles_clasic: 1.05,
    hardware_blum: 1.20,
    hardware_standard: 1.0,
    drawers_standard: 1.0,
    drawers_pan: 1.10,
    drawers_fara: 0.90,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("kalio_admin_auth")) {
      router.push("/admin");
    }
  }, []);

  function saveModules(e) {
    e.preventDefault();
    setToast({ message: "Preturi module salvate!", type: "success" });
  }

  function saveMultipliers(e) {
    e.preventDefault();
    setToast({ message: "Multiplicatori salvati!", type: "success" });
  }

  const MULTIPLIER_GROUPS = [
    {
      label: "Tip Front",
      items: [
        { key: "front_mat", label: "Mat" },
        { key: "front_lucios", label: "Lucios" },
        { key: "front_texturat", label: "Texturat" },
        { key: "front_lemn", label: "Lemn" },
      ]
    },
    {
      label: "Manere",
      items: [
        { key: "handles_bare", label: "Bare Metalice" },
        { key: "handles_rotunde", label: "Butoni Rotunzi" },
        { key: "handles_ingropat", label: "Fara Maner" },
        { key: "handles_clasic", label: "Maner Clasic" },
      ]
    },
    {
      label: "Feronerie",
      items: [
        { key: "hardware_blum", label: "Blum Premium" },
        { key: "hardware_standard", label: "Standard" },
      ]
    },
    {
      label: "Sertare",
      items: [
        { key: "drawers_standard", label: "Standard" },
        { key: "drawers_pan", label: "Tip Pan" },
        { key: "drawers_fara", label: "Fara Sertare" },
      ]
    },
  ];

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
              {modules.map((m, i) => (
                <div key={m.id} style={{ background: "#f5f5f3", borderRadius: "12px", padding: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "24px" }}>{m.emoji}</span>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700 }}>{m.label}</div>
                      <div style={{ fontSize: "11px", color: "#888" }}>{m.desc}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label className="admin-label" style={{ margin: 0, whiteSpace: "nowrap" }}>Pret EUR</label>
                    <div style={{ position: "relative", flex: 1 }}>
                      <input className="admin-input" type="number" min="0" step="10" value={m.price}
                        onChange={e => setModules(prev => prev.map((x, j) => j === i ? { ...x, price: Number(e.target.value) } : x))}
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
                <div>1x Corp de Jos (60cm) = <strong style={{ color: "#8DC63F" }}>{modules[0].price} EUR</strong></div>
                <div>5x Corp de Jos (60cm) = <strong style={{ color: "#8DC63F" }}>{modules[0].price * 5} EUR</strong></div>
                <div>1x Corp Inalt + 3x Corp de Jos + 2x Corp de Sus = <strong style={{ color: "#8DC63F" }}>{modules[2].price + modules[0].price * 3 + modules[1].price * 2} EUR</strong></div>
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
                    {group.items.map(item => (
                      <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                        <label style={{ fontSize: "13px", color: "#333", fontWeight: 500 }}>{item.label}</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <input className="admin-input" type="number" min="0.5" max="3" step="0.05"
                            value={multipliers[item.key]}
                            onChange={e => setMultipliers(p => ({ ...p, [item.key]: Number(e.target.value) }))}
                            style={{ width: "80px", textAlign: "center" }} />
                          <span style={{ fontSize: "12px", color: multipliers[item.key] > 1 ? "#8DC63F" : multipliers[item.key] < 1 ? "#e74c3c" : "#888", fontWeight: 700, minWidth: "40px" }}>
                            {multipliers[item.key] > 1 ? `+${Math.round((multipliers[item.key] - 1) * 100)}%` : multipliers[item.key] < 1 ? `-${Math.round((1 - multipliers[item.key]) * 100)}%` : "="}
                          </span>
                        </div>
                      </div>
                    ))}
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
