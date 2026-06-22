import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search,
  HeartIcon,
  ShoppingCart,
  UserCircle2,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Home,
  LayoutGrid,
  Store,
  BookOpen,
  Phone,
  LogIn } from
"lucide-react";
import { useShop } from "@/lib/shop-store";
import { useUser } from "@/lib/user-store";
import { categoryList } from "@/lib/products";

const mainNav = [
{ to: "/", label: "Home", Icon: Home },
{ to: "/categories", label: "Categories", hasDropdown: true, Icon: LayoutGrid },
{ to: "/shop", label: "Shop", Icon: Store },
{ to: "/about", label: "About", Icon: BookOpen },
{ to: "/contact", label: "Contact", Icon: Phone }];


export default function Navbar() {
  const { cartCount, wishlistCount } = useShop();
  const { isLoggedIn, profile } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 text-ivory bg-ink ${
      scrolled ?
      "border-b border-ivory/10 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.4)]" :
      "border-b border-ivory/5"}`
      }>
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-6 text-ivory">
        <button
          aria-label="Menu"
          className="lg:hidden text-ivory"
          onClick={() => setOpen((v) => !v)}>
          
          {open ? <X /> : <Menu />}
        </button>

        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <span className="relative w-11 h-11 grid place-items-center">
            <span className="absolute inset-0 border border-ivory/50 rotate-45" />
            <span className="absolute inset-1.5 border border-gold rotate-45" />
            <span className="relative text-display text-lg leading-none text-gold">V</span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-display text-2xl tracking-tight text-ivory">
              MAISON<span className="text-gold">VERA</span>
            </span>
            <span className="text-[9px] tracking-[0.4em] text-ivory/50 uppercase mt-1" style={{ fontFamily: "var(--font-sans)" }}>
              Atelier de Couture 1908
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0">
          {mainNav.map((m) => {
            const Ic = m.Icon;
            if (m.hasDropdown) {
              return (
                <div
                  key={m.label}
                  className="relative"
                  onMouseEnter={() => setCatOpen(true)}
                  onMouseLeave={() => setCatOpen(false)}>
                  
                  <Link
                    to={m.to}
                    className="group relative px-2.5 py-2 text-eyebrow text-ivory/75 hover:text-ivory transition-colors flex items-center gap-1.5"
                    activeProps={{ className: "text-ivory" }}
                    style={{ fontFamily: "var(--font-sans)" }}>
                    
                    <Ic size={13} className="text-gold" />
                    {m.label}
                    <ChevronDown size={11} />
                    <span className="absolute left-1/2 -bottom-0.5 h-px w-0 bg-gold transition-all duration-500 group-hover:w-[70%] group-hover:-translate-x-1/2" />
                  </Link>

                  {catOpen &&
                  <div className="absolute left-0 top-full pt-3 w-[820px]">
                      <div className="bg-ivory border border-border shadow-[var(--shadow-soft)] p-6 grid grid-cols-2 gap-3 animate-fade-in max-h-[80vh] overflow-y-auto">
                        {categoryList.map((c) =>
                      <div key={c.slug} className="group">
                            <Link
                          to="/category/$slug"
                          params={{ slug: c.slug }}
                          className="flex items-center gap-3 p-2.5 hover:bg-secondary transition-colors">
                          
                              <div className="w-12 h-12 overflow-hidden bg-secondary shrink-0">
                                <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-display text-lg text-ink group-hover:text-gold transition-colors leading-tight truncate">{c.name}</p>
                                <p className="text-eyebrow text-muted-foreground text-[0.6rem] truncate" style={{ fontFamily: "var(--font-sans)" }}>{c.tagline}</p>
                              </div>
                            </Link>
                            <ul className="pl-[3.75rem] pr-2 pb-2 space-y-0.5">
                              {c.subs.slice(0, 4).map((s) =>
                          <li key={s}>
                                  <Link
                              to="/category/$slug"
                              params={{ slug: c.slug }}
                              className="text-[0.7rem] text-muted-foreground hover:text-gold transition-colors flex items-center gap-1.5"
                              style={{ fontFamily: "var(--font-sans)" }}>
                              
                                    <span className="w-1 h-px bg-gold/60" />
                                    {s}
                                  </Link>
                                </li>
                          )}
                            </ul>
                          </div>
                      )}
                        <Link
                        to="/shop"
                        className="group flex items-center gap-4 p-3 hover:bg-secondary transition-colors col-span-2 border-t border-border mt-1 pt-4">
                        
                          <div className="w-12 h-12 bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                            <Sparkles size={20} className="text-gold" />
                          </div>
                          <div>
                            <p className="text-display text-lg text-ink group-hover:text-gold transition-colors">View the entire boutique</p>
                            <p className="text-eyebrow text-muted-foreground text-[0.6rem]" style={{ fontFamily: "var(--font-sans)" }}>All ateliers, every piece</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  }
                </div>);

            }
            return (
              <Link
                key={m.label}
                to={m.to}
                className="group relative px-2.5 py-2 text-eyebrow text-ivory/75 hover:text-ivory transition-colors flex items-center gap-1.5"
                activeProps={{ className: "text-ivory" }}
                activeOptions={{ exact: m.to === "/" }}
                style={{ fontFamily: "var(--font-sans)" }}>
                
                <Ic size={13} className="text-gold" />
                <span>{m.label}</span>
                <span className="absolute left-1/2 -bottom-0.5 h-px w-0 bg-gold transition-all duration-500 group-hover:w-[70%] group-hover:-translate-x-1/2" />
              </Link>);

          })}
        </nav>

        <div className="flex items-center gap-1 lg:gap-2">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="p-2 hover:text-gold transition-colors">
            
            <Search size={19} strokeWidth={1.6} />
          </button>

          <Link to="/profile" aria-label="Wishlist" className="relative p-2 hover:text-gold transition-colors">
            <HeartIcon size={19} strokeWidth={1.6} />
            {wishlistCount > 0 &&
            <span className="absolute -top-0.5 -right-0.5 bg-gold text-ink text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistCount}
              </span>
            }
          </Link>

          <Link to="/profile" aria-label="Cart" className="relative p-2 hover:text-gold transition-colors">
            <ShoppingCart size={22} strokeWidth={2.4} className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]" />
            {cartCount > 0 &&
            <span
              className="absolute -top-1 -right-1 bg-[#e11d2a] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border-2 border-ink shadow-[0_2px_4px_rgba(0,0,0,0.4)] animate-fade-in"
              style={{ fontFamily: "var(--font-sans)" }}>
              
                {cartCount}
              </span>
            }
          </Link>

          {isLoggedIn ?
          <Link
            to="/profile"
            aria-label="Account"
            className="flex items-center gap-2 px-3 py-2 hover:text-gold transition-colors">
            
              <UserCircle2 size={20} strokeWidth={1.6} />
              <span className="hidden md:inline text-eyebrow" style={{ fontFamily: "var(--font-sans)" }}>
                {profile?.name?.split(" ")[0] || "Account"}
              </span>
            </Link> :

          <Link
            to="/login"
            className="flex items-center gap-2 px-3 py-2 border border-ivory/20 hover:bg-gold hover:text-ink hover:border-gold transition-all"
            style={{ fontFamily: "var(--font-sans)" }}>
            
              <LogIn size={16} strokeWidth={1.7} />
              <span className="text-eyebrow">Sign In</span>
            </Link>
          }
        </div>
      </div>

      {searchOpen &&
      <div className="border-t border-ivory/10 bg-ink/95 backdrop-blur-xl animate-fade-in">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5">
            <div className="flex items-center gap-4 border-b border-ivory/20 focus-within:border-gold transition-colors pb-3">
              <Search size={16} className="text-gold shrink-0" />
              <input
              autoFocus
              type="search"
              placeholder="Search the maison, gowns, jewels, fragrances…"
              className="flex-1 bg-transparent text-ivory text-sm py-1 focus:outline-none placeholder:text-ivory/40"
              style={{ fontFamily: "var(--font-sans)" }} />
            
              <button onClick={() => setSearchOpen(false)} className="text-ivory/50 hover:text-ivory transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="flex gap-6 mt-4 text-eyebrow text-ivory/50" style={{ fontFamily: "var(--font-sans)" }}>
              <span className="text-gold">Quick links:</span>
              {["Electronics", "Fashion", "Home", "Beauty", "Wellness", "Gourmet"].map((q) =>
            <Link key={q} to="/shop" onClick={() => setSearchOpen(false)} className="hover:text-gold transition-colors">{q}</Link>
            )}
            </div>
          </div>
        </div>
      }

      {open &&
      <div className="lg:hidden bg-ivory border-t border-border animate-fade-in max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col p-6 gap-1">
            {mainNav.map((m) => {
            const Ic = m.Icon;
            return (
              <Link
                key={m.label}
                to={m.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-3 border-b border-border text-eyebrow"
                style={{ fontFamily: "var(--font-sans)" }}>
                
                  <Ic size={14} className="text-gold" />
                  {m.label}
                </Link>);

          })}
            <p className="text-eyebrow text-muted-foreground mt-6 mb-2" style={{ fontFamily: "var(--font-sans)" }}>Shop by Category</p>
            {categoryList.map((c) =>
          <Link
            key={c.slug}
            to="/category/$slug"
            params={{ slug: c.slug }}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 py-2 text-sm text-ink/80"
            style={{ fontFamily: "var(--font-sans)" }}>
            
                <span className="w-1 h-1 bg-gold rounded-full" />
                {c.name}
              </Link>
          )}
            {!isLoggedIn &&
          <Link to="/login" onClick={() => setOpen(false)} className="mt-6 btn-luxe justify-center inline-flex items-center gap-2">
                <LogIn size={14} /> Sign In
              </Link>
          }
          </nav>
        </div>
      }
    </header>);

}