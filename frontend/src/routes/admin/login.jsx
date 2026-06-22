import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin
});

function AdminLogin() {
  const { login } = useAdmin();
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const ok = await login(password);
    setSubmitting(false);
    if (ok) {
      nav({ to: "/admin/" });
    } else {
      setError("Wrong password. Use: admin123");
    }
  };

  return (
    <div className="min-h-screen bg-ink text-ivory flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-10">
          <span className="relative w-10 h-10 grid place-items-center">
            <span className="absolute inset-0 border border-ivory/40 rotate-45" />
            <span className="absolute inset-1.5 border border-gold rotate-45" />
            <span className="relative text-display text-lg text-gold">V</span>
          </span>
          <div className="text-display text-2xl">MAISON<span className="text-gold">VERA</span></div>
        </div>

        <p className="text-eyebrow text-gold mb-2 flex items-center gap-2"><Sparkles size={11} /> Administration</p>
        <h1 className="text-display text-4xl mb-8">Atelier Panel</h1>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-eyebrow text-ivory/60 mb-2" style={{ fontFamily: "var(--font-sans)" }}>
              Admin Password
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/40" />
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => {setPassword(e.target.value);setError("");}}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full bg-ivory/5 border border-ivory/20 focus:border-gold text-ivory pl-10 pr-10 py-3.5 text-sm outline-none transition-colors placeholder:text-ivory/30"
                style={{ fontFamily: "var(--font-sans)" }} />
              
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory">
                
                {show ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {error &&
            <p className="text-red-400 text-xs mt-2" style={{ fontFamily: "var(--font-sans)" }}>{error}</p>
            }
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-luxe btn-luxe-hover justify-center disabled:opacity-60 !bg-gold !text-ink">
            
            {submitting ? "Entering…" : "Enter the Atelier"}
          </button>
        </form>

        <p className="text-ivory/30 text-xs mt-8 text-center" style={{ fontFamily: "var(--font-sans)" }}>
          Maison Vera Administration · Est. 1908
        </p>
      </div>
    </div>);

}