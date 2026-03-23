import { useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/AdminLayout";
import pb from "../../lib/pocketbase";

const STATS = [
  { label: "Proiecte Portofoliu", value: "12", change: "+2 luna aceasta", icon: "image", color: "#8DC63F" },
  { label: "Mesaje Contact", value: "8", change: "3 necitite", icon: "mail", color: "#3498db" },
  { label: "Configurari trimise", value: "24", change: "+5 saptamana aceasta", icon: "settings", color: "#9b59b6" },
  { label: "Vizitatori luna", value: "1.2k", change: "+12% vs luna trecuta", icon: "users", color: "#e67e22" },
];

const QUICK_LINKS = [
  { label: "Adauga proiect nou", href: "/admin/portofoliu", desc: "Adauga o lucrare noua in portofoliu", color: "#8DC63F" },
  { label: "Editeaza homepage", href: "/admin/homepage", desc: "Modifica textele de pe pagina principala", color: "#3498db" },
  { label: "Actualizeaza preturi", href: "/admin/preturi", desc: "Modifica preturile din configurator", color: "#9b59b6" },
  { label: "Date de contact", href: "/admin/contact", desc: "Actualizeaza adresa si datele de contact", color: "#e67e22" },
];

const ICON_SVG = {
  image: <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 12l4-4 3 3 3-3 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  mail: <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><rect x="1" y="3" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M1 5l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.05 3.05l1.41 1.41M13.54 13.54l1.41 1.41M3.05 14.95l1.41-1.41M13.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  users: <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M1 16c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M13 3a3 3 0 010 6M17 16c0-2.5-1.5-4.3-4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push("/admin");
    }
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div style={{ marginBottom: "8px" }}>
        <h2 className="admin-section-title">Buna ziua! 👋</h2>
        <p className="admin-section-subtitle">Iata o privire de ansamblu asupra site-ului Kalio.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {STATS.map(s => (
          <div key={s.label} className="admin-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>{s.label}</div>
                <div style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>{s.value}</div>
              </div>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                {ICON_SVG[s.icon]}
              </div>
            </div>
            <div style={{ fontSize: "12px", color: "#8DC63F", fontWeight: 500 }}>{s.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Quick actions */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: "16px" }}>Actiuni rapide</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {QUICK_LINKS.map(l => (
              <a key={l.label} href={l.href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "14px", padding: "12px 14px", background: "#f5f5f3", borderRadius: "10px", border: "1.5px solid transparent", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = l.color; e.currentTarget.style.background = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "#f5f5f3"; }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${l.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: l.color }} />
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a" }}>{l.label}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{l.desc}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: "auto", color: "#ccc" }}>
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Site info */}
        <div className="admin-card">
          <h3 className="admin-card-title" style={{ marginBottom: "16px" }}>Informatii site</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              ["URL site", "kalio.ro", "#8DC63F"],
              ["Status", "Live pe Vercel", "#8DC63F"],
              ["Ultima actualizare", "Astazi", "#888"],
              ["Framework", "Next.js 16", "#888"],
              ["Hosting", "Vercel", "#888"],
            ].map(([label, value, color]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "14px", borderBottom: "1px solid #f5f5f5" }}>
                <span style={{ fontSize: "13px", color: "#888" }}>{label}</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color }}>{value}</span>
              </div>
            ))}
            <a href="/" target="_blank" style={{ textDecoration: "none" }}>
              <button className="admin-btn secondary" style={{ width: "100%", justifyContent: "center", marginTop: "4px" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9M8 1h5v5M12 2L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Deschide site-ul
              </button>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
