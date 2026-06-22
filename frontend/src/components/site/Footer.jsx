import { Link } from "@tanstack/react-router";
import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Sparkles,
  Globe2,
  Home,
  BookOpen,
  LayoutGrid,
  Mail,
  ShoppingBag,
  Smartphone,
  Shirt,
  Sofa,
  Flower2,
  HeartPulse,
  Apple } from
"lucide-react";
import { categoryList } from "@/lib/products";

const categoryIcons = {
  electronics: Smartphone,
  fashion: Shirt,
  "home-living": Sofa,
  beauty: Flower2,
  health: HeartPulse,
  groceries: Apple
};

export default function Footer() {
  return (
    <footer className="relative bg-ink text-ivory overflow-hidden">
      <Globe2
        size={400}
        strokeWidth={0.35}
        className="absolute -right-24 -bottom-32 text-gold/10 animate-float-soft pointer-events-none" />
      
      <Globe2
        size={200}
        strokeWidth={0.4}
        className="absolute -left-16 top-8 text-gold/5 animate-float-soft pointer-events-none"
        style={{ animationDelay: "2s" }} />
      
      <div className="absolute -right-10 top-16 w-56 h-56 rounded-full bg-gradient-to-br from-gold/20 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-14 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-5">
          <div className="flex items-center gap-3">
            <span className="relative w-10 h-10 grid place-items-center">
              <span className="absolute inset-0 border border-ivory/40 rotate-45" />
              <span className="absolute inset-1.5 border border-gold rotate-45" />
              <span className="relative text-display text-lg text-gold" style={{ fontFamily: "var(--font-display)" }}>V</span>
            </span>
            <div className="text-display text-3xl" style={{ fontFamily: "var(--font-display)" }}>
              MAISON<span className="text-gold">VERA</span>
            </div>
          </div>
          <p className="text-sm text-ivory/75 leading-relaxed max-w-sm" style={{ fontFamily: "var(--font-sans)" }}>
            A house devoted to the slow art of luxury, from couture to electronics, home to gourmet.
            Composed across our European ateliers.
          </p>
          <div className="flex gap-3">
            {[Instagram, Twitter, Facebook, Youtube].map((Ic, i) =>
            <a key={i} href="#" aria-label="social" className="w-9 h-9 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-gold hover:text-ink hover:border-gold transition-all">
                <Ic size={15} />
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-eyebrow text-gold mb-5" style={{ fontFamily: "var(--font-sans)" }}>Maison</h4>
          <ul className="space-y-3 text-sm text-ivory/75" style={{ fontFamily: "var(--font-sans)" }}>
            <li><Link to="/" className="group inline-flex items-center gap-2.5 hover:text-gold transition-colors"><Home size={13} className="text-gold/70 group-hover:text-gold transition-colors" strokeWidth={1.5} />Home</Link></li>
            <li><Link to="/about" className="group inline-flex items-center gap-2.5 hover:text-gold transition-colors"><BookOpen size={13} className="text-gold/70 group-hover:text-gold transition-colors" strokeWidth={1.5} />About</Link></li>
            <li><Link to="/shop" className="group inline-flex items-center gap-2.5 hover:text-gold transition-colors"><ShoppingBag size={13} className="text-gold/70 group-hover:text-gold transition-colors" strokeWidth={1.5} />Shop</Link></li>
            <li><Link to="/categories" className="group inline-flex items-center gap-2.5 hover:text-gold transition-colors"><LayoutGrid size={13} className="text-gold/70 group-hover:text-gold transition-colors" strokeWidth={1.5} />Categories</Link></li>
            <li><Link to="/contact" className="group inline-flex items-center gap-2.5 hover:text-gold transition-colors"><Mail size={13} className="text-gold/70 group-hover:text-gold transition-colors" strokeWidth={1.5} />Contact</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="text-eyebrow text-gold mb-5" style={{ fontFamily: "var(--font-sans)" }}>Categories</h4>
          <ul className="space-y-3 text-sm text-ivory/75" style={{ fontFamily: "var(--font-sans)" }}>
            {categoryList.map((c) => {
              const Ic = categoryIcons[c.slug] ?? Sparkles;
              return (
                <li key={c.slug}>
                  <Link
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className="group inline-flex items-center gap-2.5 hover:text-gold transition-colors">
                    
                    <Ic size={13} className="text-gold/70 group-hover:text-gold transition-colors" strokeWidth={1.5} />
                    {c.name}
                  </Link>
                </li>);

            })}
          </ul>
        </div>



        <div className="lg:col-span-3">
          <h4 className="text-eyebrow text-gold mb-5" style={{ fontFamily: "var(--font-sans)" }}>Private Salon</h4>
          <p className="text-sm text-ivory/75 mb-5 leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
            Receive private previews, atelier letters and seasonal invitations.
          </p>
          <form className="flex border-b border-ivory/30 focus-within:border-gold transition-colors">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-transparent py-2.5 text-sm placeholder:text-ivory/40 focus:outline-none"
              style={{ fontFamily: "var(--font-sans)" }} />
            
            <button className="text-eyebrow text-gold flex items-center gap-1.5 hover:gap-3 transition-all" style={{ fontFamily: "var(--font-sans)" }}>
              <Sparkles size={11} /> Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="relative border-t border-ivory/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5 flex flex-col md:flex-row justify-between gap-3 text-xs text-ivory/50" style={{ fontFamily: "var(--font-sans)" }}>
          <p>Copyright {new Date().getFullYear()} Maison Vera. All rights reserved.</p>
          <p>Privacy &nbsp;·&nbsp; Terms &nbsp;·&nbsp; Cookies &nbsp;·&nbsp; Accessibility</p>
        </div>
      </div>
    </footer>);

}