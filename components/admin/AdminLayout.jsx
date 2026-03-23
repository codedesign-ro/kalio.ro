import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/admin/homepage", label: "Homepage", icon: "home" },
  { href: "/admin/despre-noi", label: "Despre Noi", icon: "users" },
  { href: "/admin/servicii", label: "Servicii", icon: "settings" },
  { href: "/admin/portofoliu", label: "Portofoliu", icon: "image" },
  { href: "/admin/contact", label: "Contact", icon: "phone" },
  { href: "/admin/preturi", label: "Preturi Configurator", icon: "tag" },
];

const ICONS = {
  grid: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>),
  home: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 7.5L9 2l7 5.5V16a1 1 0 01-1 1H3a1 1 0 01-1-1V7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M6 17V10h6v7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>),
  users: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M1 16c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M13 3a3 3 0 010 6M17 16c0-2.5-1.5-4.3-4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  settings: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.05 3.05l1.41 1.41M13.54 13.54l1.41 1.41M3.05 14.95l1.41-1.41M13.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  image: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 12l4-4 3 3 3-3 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  phone: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.5 1h3l1.5 4-2 1.5a10 10 0 005.5 5.5L13 10l4 1.5v3A1.5 1.5 0 0115.5 16C7.5 16 2 10.5 2 2.5A1.5 1.5 0 013.5 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>),
  tag: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9.5 1H16v6.5l-8 8a1.5 1.5 0 01-2.12 0L2 11.6a1.5 1.5 0 010-2.12l8-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="13" cy="5" r="1" fill="currentColor"/></svg>),
  logout: (<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 2H3a1 1 0 00-1 1v12a1 1 0 001 1h4M12 13l4-4-4-4M16 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
};

export const ADMIN_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { --green: #8DC63F; --green-dark: #6fa82e; --green-light: #f0f9e0; --sidebar-w: 240px; }
  body { font-family: 'DM Sans', sans-serif; background: #f5f5f3; color: #1a1a1a; }

  .admin-btn { background: var(--green); color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s, transform 0.15s; display: inline-flex; align-items: center; gap: 8px; }
  .admin-btn:hover { background: var(--green-dark); transform: translateY(-1px); }
  .admin-btn.secondary { background: #fff; color: #333; border: 1.5px solid #eee; }
  .admin-btn.secondary:hover { border-color: var(--green); color: var(--green); background: #fff; transform: none; }
  .admin-btn.danger { background: #fff; color: #e74c3c; border: 1.5px solid #fdd; }
  .admin-btn.danger:hover { background: #fff5f5; border-color: #e74c3c; transform: none; }

  .admin-input { width: 100%; padding: 10px 14px; border: 1.5px solid #e0e0e0; border-radius: 8px; font-size: 14px; font-family: inherit; color: #1a1a1a; outline: none; transition: border-color 0.2s, box-shadow 0.2s; background: #fff; }
  .admin-input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(141,198,63,0.12); }
  .admin-input::placeholder { color: #bbb; }
  .admin-label { font-size: 12px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px; }

  .admin-card { background: #fff; border-radius: 14px; border: 1px solid #eee; padding: 24px; }
  .admin-card-title { font-size: 15px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
  .admin-card-subtitle { font-size: 13px; color: #888; }

  .admin-table { width: 100%; border-collapse: collapse; }
  .admin-table th { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #888; padding: 10px 16px; text-align: left; border-bottom: 1px solid #eee; }
  .admin-table td { padding: 14px 16px; border-bottom: 1px solid #f5f5f5; font-size: 14px; color: #333; vertical-align: middle; }
  .admin-table tr:hover td { background: #fafafa; }
  .admin-table tr:last-child td { border-bottom: none; }

  .admin-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .admin-badge.green { background: var(--green-light); color: var(--green-dark); }
  .admin-badge.gray { background: #f0f0f0; color: #666; }

  .admin-section-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
  .admin-section-subtitle { font-size: 14px; color: #888; margin-bottom: 28px; }

  .field-group { margin-bottom: 20px; }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }

  .sidebar-link { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; color: #555; transition: all 0.15s; margin-bottom: 2px; }
  .sidebar-link:hover { background: var(--green-light); color: var(--green-dark); }
  .sidebar-link.active { background: var(--green-light); color: var(--green-dark); font-weight: 700; }

  .toast { position: fixed; bottom: 24px; right: 24px; background: #1a1a1a; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); z-index: 999; animation: slideIn 0.3s ease; }
  .toast.success { background: var(--green); }
  @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  @media (max-width: 768px) {
    .admin-sidebar { transform: translateX(-100%); }
    .admin-sidebar.open { transform: translateX(0); }
    .admin-main { margin-left: 0 !important; }
  }
`;

export function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`toast ${type}`}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill="rgba(255,255,255,0.3)"/>
        <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {message}
    </div>
  );
}

export default function AdminLayout({ children, title = "Admin" }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("kalio_admin_auth");
      router.push("/admin");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f3" }}>
      <style>{ADMIN_STYLES}</style>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar${sidebarOpen ? " open" : ""}`} style={{
        position: "fixed", top: 0, left: 0, bottom: 0,
        width: "var(--sidebar-w)", background: "#fff",
        borderRight: "1px solid #eee", zIndex: 50,
        display: "flex", flexDirection: "column",
        transition: "transform 0.3s",
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #eee" }}>
          <a href="/admin/dashboard" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, color: "var(--green)" }}>Kalio</span>
            <span style={{ fontSize: "11px", color: "#aaa", display: "block", marginTop: "2px", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>Admin Panel</span>
          </a>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          {NAV_ITEMS.map(item => (
            <a key={item.href} href={item.href}
              className={`sidebar-link${router.pathname === item.href ? " active" : ""}`}>
              <span style={{ color: router.pathname === item.href ? "var(--green)" : "#aaa" }}>
                {ICONS[item.icon]}
              </span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid #eee" }}>
          <a href="/" target="_blank" style={{ textDecoration: "none" }}>
            <div className="sidebar-link" style={{ marginBottom: "4px" }}>
              <span style={{ color: "#aaa" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 2H3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-4M10 2h6v6M16 2l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              Vezi site-ul
            </div>
          </a>
          <button onClick={handleLogout} className="sidebar-link" style={{ width: "100%", border: "none", background: "none", cursor: "pointer", color: "#e74c3c", fontFamily: "inherit", textAlign: "left" }}>
            <span style={{ color: "#e74c3c" }}>{ICONS.logout}</span>
            Deconectare
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="admin-main" style={{ marginLeft: "var(--sidebar-w)", minHeight: "100vh" }}>
        {/* Top bar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "0 32px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "none", padding: "4px" }}
              className="mobile-menu-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6h14M3 10h14M3 14h14" stroke="#333" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
            <h1 style={{ fontSize: "16px", fontWeight: 700, color: "#1a1a1a" }}>{title}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", background: "var(--green-light)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--green-dark)" }}>K</span>
            </div>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#333" }}>Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: "32px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
