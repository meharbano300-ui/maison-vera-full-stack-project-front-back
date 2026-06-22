import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Calendar, Eye, EyeOff, Lock, Mail, Phone, User, Sparkles } from "lucide-react";
import h1 from "@/assets/hero-1.jpg";
import { useUser } from "@/lib/user-store";
import { registerUser } from "@/lib/api/authApi";
import { setStoredUserEmail } from "@/lib/api/client";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  component: SignUp
});

function SignUp() {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const { reloadUser } = useUser();

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    try {
      await registerUser({
        name: String(fd.get("name") || "Maison Member"),
        email,
        phone: String(fd.get("phone") || ""),
        password: String(fd.get("password") || "") || undefined
      });
      setStoredUserEmail(email);
      // Load user data into store without going through loginUser
      await reloadUser();
      nav({ to: "/profile" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed. Please try again.");
    }
  };

  return (
    <div className="pt-20 min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block overflow-hidden bg-ink">
        <img src={h1} alt="" className="w-full h-full object-cover animate-slow-zoom" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
        <div className="absolute inset-0 p-16 flex flex-col justify-between text-ivory">
          <div className="text-display text-3xl">M<span className="text-gold">·</span>V</div>
          <div className="max-w-md">
            <p className="text-eyebrow text-gold mb-5 flex items-center gap-2"><Sparkles size={12} /> The Private Salon</p>
            <h2 className="text-display text-5xl xl:text-6xl leading-[1.05] mb-5">
              Become a member of <em className="text-gold not-italic">the House</em>.
            </h2>
            <p className="text-ivory/70 leading-relaxed">
              Private previews, atelier letters, invitations to viewings in Milan,
              Geneva and Paris, quietly, only for members.
            </p>
          </div>
          <div className="text-eyebrow text-ivory/40">Est. 1908 Milano</div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md animate-fade-up">
          <p className="text-eyebrow text-gold mb-3">Create Account</p>
          <h1 className="text-display text-5xl mb-3">Join the Maison.</h1>
          <p className="text-muted-foreground mb-10 text-sm">
            Already with us?{" "}
            <Link to="/login" className="text-ink underline underline-offset-4 hover:text-gold">Sign in</Link>
          </p>

          <form onSubmit={submit} className="space-y-6">
            <Field icon={User} name="name" label="Full Name" placeholder="Sofia Vera" required />
            <Field icon={Mail} type="email" name="email" label="Email" placeholder="sofia@maison.com" required />
            <Field icon={Phone} type="tel" name="phone" label="Phone" placeholder="+39 02 555 0108" required />
            <Field icon={Calendar} type="date" name="dob" label="Date of birth" required />
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
            
            <label className="flex items-start gap-3 text-xs text-muted-foreground">
              <input type="checkbox" required className="mt-1 accent-[var(--gold)]" />
              I agree to the <a className="underline">terms</a> and would like to receive private letters from the atelier.
            </label>

            <button type="submit" className="btn-luxe btn-luxe-hover w-full justify-center">
              Create Account <ArrowRight size={14} />
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