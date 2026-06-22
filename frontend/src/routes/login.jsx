import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import h2 from "@/assets/hero-2.jpg";
import { useUser } from "@/lib/user-store";

export const Route = createFileRoute("/login")({
  component: SignIn
});

function SignIn() {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const { signIn, profile } = useUser();

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    try {
      await signIn({
        name: profile?.name || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        password: password || undefined
      });
      nav({ to: "/profile" });
    } catch {

      // Error toast shown in signIn
    }};

  return (
    <div className="pt-20 min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 lg:p-16 order-2 lg:order-1">
        <div className="w-full max-w-md animate-fade-up">
          <p className="text-eyebrow text-gold mb-3">Sign In</p>
          <h1 className="text-display text-5xl mb-3">Welcome back.</h1>
          <p className="text-muted-foreground mb-10 text-sm">
            New to the Maison?{" "}
            <Link to="/signup" className="text-ink underline underline-offset-4 hover:text-gold">Create account</Link>
          </p>

          <form onSubmit={submit} className="space-y-6">
            <Field icon={Mail} type="email" name="email" label="Email" placeholder="you@maison.com" required />
            <Field
              icon={Lock}
              type={show ? "text" : "password"}
              name="password"
              label="Password"
              placeholder="••••••••"
              required
              suffix={
              <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground hover:text-ink">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              } />
            

            <div className="flex justify-between text-xs">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="accent-[var(--gold)]" /> Remember me
              </label>
              <a href="#" className="text-ink hover:text-gold">Forgot password?</a>
            </div>

            <button type="submit" className="btn-luxe btn-luxe-hover w-full justify-center">
              Sign In <ArrowRight size={14} />
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <span className="h-px flex-1 bg-border" />
            <span className="text-eyebrow text-muted-foreground">or continue with</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["Google", "Apple"].map((p) =>
            <button key={p} type="button" className="btn-ghost-luxe justify-center hover:bg-ink hover:text-ivory">
                {p}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block overflow-hidden bg-ink order-1 lg:order-2">
        <img src={h2} alt="" className="w-full h-full object-cover animate-slow-zoom" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
        <div className="absolute inset-0 p-16 flex flex-col justify-between text-ivory">
          <div className="text-display text-3xl">M<span className="text-gold">·</span>V</div>
          <div className="max-w-md">
            <p className="text-eyebrow text-gold mb-5 flex items-center gap-2"><Sparkles size={12} /> Welcome</p>
            <h2 className="text-display text-5xl xl:text-6xl leading-[1.05] mb-5">
              Your private <em className="text-gold not-italic">salon</em> awaits.
            </h2>
            <p className="text-ivory/70 leading-relaxed">
              Your saved pieces, your orders and your atelier letters, gathered in one quiet place.
            </p>
          </div>
          <div className="text-eyebrow text-ivory/40">Est. 1908 Milano</div>
        </div>
      </div>
    </div>);

}

function Field({ icon: Icon, label, suffix, ...rest }) {
  return (
    <div>
      <label className="text-eyebrow text-muted-foreground block mb-2">{label}</label>
      <div className="flex items-center border-b border-border focus-within:border-gold transition-colors">
        <Icon size={16} className="text-muted-foreground" />
        <input {...rest} className="flex-1 bg-transparent py-3 px-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none" />
        {suffix}
      </div>
    </div>);

}