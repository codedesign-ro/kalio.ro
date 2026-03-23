import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import pb from "../../lib/pocketbase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await pb.admins.authWithPassword(email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Email sau parola incorecta.");
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login — Kalio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f5f5f3; }
        .login-input { width: 100%; padding: 12px 14px; border: 1.5px solid #e0e0e0; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s, box-shadow 0.2s; background: #fff; }
        .login-input:focus { border-color: #8DC63F; box-shadow: 0 0 0 3px rgba(141,198,63,0.12); }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>

        {/* Background decoration */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "500px", height: "500px", background: "rgba(141,198,63,0.06)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: "600px", height: "600px", background: "rgba(141,198,63,0.04)", borderRadius: "50%" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "420px" }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: 700, color: "#8DC63F" }}>Kalio</span>
            <p style={{ fontSize: "14px", color: "#888", marginTop: "6px" }}>Panou de administrare</p>
          </div>

          {/* Card */}
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #eee", padding: "36px", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}>
            <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "6px" }}>Bine ai venit!</h1>
            <p style={{ fontSize: "14px", color: "#888", marginBottom: "28px" }}>Autentifica-te pentru a continua.</p>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>Email</label>
                <input className="login-input" type="email" placeholder="admin@kalio.ro" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>Parola</label>
                <div style={{ position: "relative" }}>
                  <input className="login-input" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" style={{ paddingRight: "44px" }} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: "4px" }}>
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ background: "#fff5f5", border: "1px solid #fdd", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#e74c3c", display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#e74c3c" strokeWidth="1.5"/><path d="M7 4v3M7 10v.5" stroke="#e74c3c" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{ background: loading ? "#aaa" : "#8DC63F", color: "#fff", border: "none", padding: "13px", borderRadius: "8px", fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background 0.2s", marginTop: "4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                      <path d="M8 2a6 6 0 016 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Se incarca...
                  </>
                ) : "Autentificare"}
              </button>
            </form>
          </div>

          <p style={{ textAlign: "center", fontSize: "12px", color: "#aaa", marginTop: "20px" }}>
            Kalio Admin Panel v1.0
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
