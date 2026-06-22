import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, Award, Gem, Scissors, Sparkles, Star, Truck, Quote, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CinematicHero from "@/components/site/CinematicHero";
import ProductCard from "@/components/site/ProductCard";
import { categoryList } from "@/lib/products";
import { useAdminProducts } from "@/lib/admin-store";
import story from "@/assets/story.jpg";
import moment1 from "@/assets/moment-1.jpg";
import moment2 from "@/assets/moment-2.jpg";
import moment3 from "@/assets/moment-3.jpg";

export const Route = createFileRoute("/")({
  component: Home
});

const brands = [
{ name: "VOGUE", italic: false, sub: "Paris" },
{ name: "Harper's", italic: true, sub: "Bazaar" },
{ name: "ELLE", italic: false, sub: "Milano" },
{ name: "T", italic: true, sub: "Magazine" },
{ name: "Tatler", italic: true, sub: "London" },
{ name: "L'OFFICIEL", italic: false, sub: "Suisse" },
{ name: "GQ", italic: false, sub: "Italia" }];


const moments = [moment1, moment2, moment3];
const PRODUCTS_PER_PAGE = 8;

function useInView(opts) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {if (e.isIntersecting) {setSeen(true);io.disconnect();}},
      { threshold: 0.25, ...opts }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}

function Home() {
  const products = useAdminProducts();
  // Pad products so pagination always reaches 3 pages
  const featured = (() => {
    if (products.length === 0) return [];
    const need = PRODUCTS_PER_PAGE * 3;
    const out = [...products];
    let i = 0;
    while (out.length < need) {
      const p = products[i % products.length];
      out.push({ ...p, id: `${p.id}-x${Math.floor(i / products.length) + 1}` });
      i++;
    }
    return out.slice(0, need);
  })();
  const editorial = products.slice(0, 8);
  const [activeCat, setActiveCat] = useState(0);
  const cats = categoryList;
  const [productPage, setProductPage] = useState(1);
  const totalProductPages = 3;
  const pagedProducts = featured.slice((productPage - 1) * PRODUCTS_PER_PAGE, productPage * PRODUCTS_PER_PAGE);

  const [mIdx, setMIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setMIdx((i) => (i + 1) % moments.length), 4200);
    return () => clearInterval(t);
  }, []);

  const testimonials = [
  { t: "The most considered piece I own, every stitch is a small ceremony.", a: "Vogue Italia" },
  { t: "Maison Vera dresses you the way poetry undresses the soul.", a: "Harper's Bazaar" },
  { t: "An heirloom in the making, and a love letter to slow luxury.", a: "T Magazine" },
  { t: "A whispering kind of luxury, the rarest kind there is.", a: "Tatler" },
  { t: "Every gown arrives like a private letter from Milan.", a: "ELLE" },
  { t: "Nothing here is rushed, and that is the entire point.", a: "L'Officiel" }];

  const [tPage, setTPage] = useState(0);
  const pages = Math.ceil(testimonials.length / 3);
  useEffect(() => {
    const t = setInterval(() => setTPage((p) => (p + 1) % pages), 5000);
    return () => clearInterval(t);
  }, [pages]);

  const newNotable = useInView();

  return (
    <>
      <CinematicHero />

      {/* ===== Brand press marquee ===== */}
      <section className="relative bg-ivory border-y border-border py-10 overflow-hidden">
        <p className="text-eyebrow text-muted-foreground text-center mb-6 flex items-center justify-center gap-3" style={{ fontFamily: "var(--font-sans)" }}>
          Whispered about in <span className="h-px w-10 bg-gold" />
        </p>
        <div className="overflow-hidden marquee-mask">
          <div className="flex animate-marquee whitespace-nowrap">
            {Array.from({ length: 2 }).map((_, k) =>
            <div key={k} className="flex shrink-0 items-center gap-16 pr-16">
                {brands.map((b) =>
              <div key={b.name + k} className="group flex items-center gap-4 px-6 py-3 border border-transparent hover:border-gold/40 transition-all">
                    <span
                  className={`text-display text-3xl md:text-4xl text-ink/70 group-hover:text-gold transition-colors ${b.italic ? "italic" : ""}`}
                  style={{ letterSpacing: b.italic ? "0" : "0.04em", fontFamily: "var(--font-display)" }}>
                  
                      {b.name}
                    </span>
                    <span className="text-eyebrow text-muted-foreground border-l border-ink/20 pl-4" style={{ fontFamily: "var(--font-sans)" }}>
                      {b.sub}
                    </span>
                  </div>
              )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== Atelier moments ===== */}
      <section className="relative bg-[#f7f1e6] py-14 lg:py-12 overflow-hidden">
        <svg aria-hidden className="absolute -top-20 -left-20 w-[420px] h-[420px] text-gold/20" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.4" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.4" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.4" />
        </svg>
        <svg aria-hidden className="absolute -bottom-32 -right-20 w-[540px] h-[540px] text-gold/15" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </svg>

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-eyebrow text-gold mb-5 flex items-center gap-3" style={{ fontFamily: "var(--font-sans)" }}>
              A moment in the atelier
            </p>
            <h2 className="text-display text-5xl md:text-7xl leading-[0.95]" style={{ fontFamily: "var(--font-display)" }}>
              Where <em className="text-gold not-italic italic">time</em><br />
              is the rarest fabric.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mt-7 max-w-md" style={{ fontFamily: "var(--font-sans)" }}>
              Walk inside our Milanese house, where a single gown takes 96 hours to compose. Every
              stitch is signed by the hand that drew it, and every silk is dyed to a colour we
              named ourselves.
            </p>

            <div className="grid grid-cols-2 gap-8 mt-10 max-w-md">
              {[
              { n: "96", l: "Hours per gown" },
              { n: "12", l: "Atelier hands" },
              { n: "1", l: "Of one piece" },
              { n: "100%", l: "Hand finished" }].
              map((s) =>
              <div key={s.l} className="border-l border-gold/40 pl-4">
                  <p className="text-display text-4xl text-ink" style={{ fontFamily: "var(--font-display)" }}>{s.n}</p>
                  <p className="text-eyebrow text-muted-foreground mt-1" style={{ fontFamily: "var(--font-sans)" }}>{s.l}</p>
                </div>
              )}
            </div>

            <Link to="/about" className="inline-flex items-center gap-3 mt-10 text-eyebrow border-b border-ink pb-2 hover:border-gold hover:text-gold transition-colors" style={{ fontFamily: "var(--font-sans)" }}>
              Inside the maison <ArrowRight size={14} />
            </Link>
          </div>

          <div className="relative aspect-[4/5] max-w-[480px] mx-auto w-full">
            <span className="absolute -inset-6 border border-gold/40 -rotate-2" />
            <span className="absolute -inset-2 border border-ink/15 rotate-1" />
            <div className="absolute inset-0 overflow-hidden">
              {moments.map((src, i) =>
              <img
                key={i}
                src={src}
                alt=""
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1400ms] ease-out ${
                i === mIdx ? "opacity-100 scale-100" : "opacity-0 scale-105"}`
                } />

              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 w-7 h-px bg-gold" />
              <span className="absolute top-3 left-3 w-px h-7 bg-gold" />
              <span className="absolute bottom-3 right-3 w-7 h-px bg-gold" />
              <span className="absolute bottom-3 right-3 w-px h-7 bg-gold" />
              <div className="absolute bottom-5 left-5 text-ivory">
                <p className="text-eyebrow text-gold mb-1" style={{ fontFamily: "var(--font-sans)" }}>Frame {String(mIdx + 1).padStart(2, "0")} / 03</p>
                <p className="text-display text-2xl" style={{ fontFamily: "var(--font-display)" }}>Behind the silk</p>
              </div>
            </div>
            <div className="absolute -bottom-10 left-0 flex gap-2">
              {moments.map((_, i) =>
              <button
                key={i}
                onClick={() => setMIdx(i)}
                aria-label={`Moment ${i + 1}`}
                className={`h-px transition-all duration-500 ${i === mIdx ? "w-12 bg-gold" : "w-6 bg-ink/30"}`} />

              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== Categories ===== */}
      <section className="relative bg-ivory overflow-hidden">
        <div aria-hidden className="pointer-events-none select-none absolute -top-10 right-0 text-[28rem] leading-none font-light text-ink/[0.03] tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
          {String(activeCat + 1).padStart(2, "0")}
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-14 lg:pt-20 pb-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 text-eyebrow text-gold mb-5" style={{ fontFamily: "var(--font-sans)" }}>
                <span>Maisons within the House</span>
                <Sparkles size={12} className="text-gold" />
              </div>
              <h2 className="text-display text-5xl md:text-7xl leading-[0.95] flex flex-wrap items-baseline gap-x-4" style={{ fontFamily: "var(--font-display)" }}>
                <span>Eight</span>
                <em className="text-gold not-italic italic">worlds,</em>
                <span>one</span>
                <span className="shimmer-text">signature.</span>
              </h2>
              <p className="text-muted-foreground mt-6 max-w-md leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
                An index of our ateliers. Hover an entry to glimpse the world inside, then enter to compose your own.
              </p>
            </div>
            <Link to="/categories" className="group inline-flex items-center gap-3 text-eyebrow border-b border-ink pb-2 hover:border-gold hover:text-gold transition-colors" style={{ fontFamily: "var(--font-sans)" }}>
              The full index
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:grid max-w-[1400px] mx-auto px-6 lg:px-12 grid-cols-12 gap-10 pb-24 relative z-10 items-stretch">
          <ul className="col-span-7 border-t border-border flex flex-col" onMouseLeave={() => setActiveCat(0)}>
            {cats.map((c, i) => {
              const active = i === activeCat;
              return (
                <li key={c.slug} className="border-b border-border" onMouseEnter={() => setActiveCat(i)}>
                  <Link
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className="group grid grid-cols-12 items-center py-5 gap-6 relative">
                    
                    <span
                      aria-hidden
                      className={`absolute inset-y-0 left-0 bg-ink transition-all duration-700 ease-out ${active ? "w-full opacity-[0.04]" : "w-0 opacity-0"}`} />
                    
                    <span className={`col-span-1 text-eyebrow transition-colors duration-500 ${active ? "text-gold" : "text-muted-foreground"}`} style={{ fontFamily: "var(--font-sans)" }}>
                      0{i + 1}
                    </span>
                    <span
                      className="col-span-7 text-display text-3xl xl:text-[2.5rem] tracking-tight transition-all duration-500"
                      style={{
                        color: active ? "var(--ink)" : "color-mix(in oklab, var(--ink) 35%, transparent)",
                        transform: active ? "translateX(12px)" : "translateX(0)",
                        fontFamily: "var(--font-display)"
                      }}>
                      
                      <span className="inline-flex items-center gap-4">
                        {c.name}
                        <Sparkles
                          size={16}
                          className={`text-gold transition-all duration-500 ${active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"}`} />
                        
                      </span>
                    </span>
                    <span className={`col-span-3 text-sm italic transition-opacity duration-500 ${active ? "opacity-100 text-muted-foreground" : "opacity-0"}`} style={{ fontFamily: "var(--font-sans)" }}>
                      {c.tagline}
                    </span>
                    <span className={`col-span-1 flex justify-end transition-all duration-500 ${active ? "opacity-100 translate-x-0 text-gold" : "opacity-0 -translate-x-2"}`}>
                      <ArrowRight size={18} strokeWidth={1.2} />
                    </span>
                  </Link>
                </li>);

            })}
          </ul>

          <div className="col-span-5">
            <div className="flex flex-col h-full">
              <div className="relative flex-1 min-h-[560px] overflow-hidden bg-secondary group">
                {cats.map((c, i) =>
                <img
                  key={c.slug}
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-out ${
                  i === activeCat ? "opacity-100 scale-100" : "opacity-0 scale-105"}`
                  } />

                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute top-6 right-6 text-eyebrow text-ivory/80 [writing-mode:vertical-rl] rotate-180" style={{ fontFamily: "var(--font-sans)" }}>
                  Atelier {String(activeCat + 1).padStart(2, "0")} / 08
                </div>
                <span className="absolute top-3 left-3 w-6 h-px bg-gold" />
                <span className="absolute top-3 left-3 w-px h-6 bg-gold" />
                <span className="absolute bottom-3 right-3 w-6 h-px bg-gold" />
                <span className="absolute bottom-3 right-3 w-px h-6 bg-gold" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-ivory">
                  <p className="text-eyebrow text-gold mb-2" style={{ fontFamily: "var(--font-sans)" }}>Discover</p>
                  <h3 className="text-display text-3xl mb-2" style={{ fontFamily: "var(--font-display)" }}>{cats[activeCat].name}</h3>
                  <p className="text-sm text-ivory/80 max-w-xs leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>{cats[activeCat].description}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-eyebrow text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
                <span>{products.filter((p) => p.category === cats[activeCat].name).length} pieces</span>
                <Link
                  to="/category/$slug"
                  params={{ slug: cats[activeCat].slug }}
                  className="text-ink hover:text-gold inline-flex items-center gap-2 transition-colors">
                  
                  Enter the atelier <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden max-w-[1400px] mx-auto px-6 pb-24 relative z-10">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-none">
            {cats.map((c, i) =>
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group relative shrink-0 w-[78vw] max-w-[340px] aspect-[3/4] overflow-hidden bg-secondary snap-center animate-flip-in"
              style={{ animationDelay: `${i * 80}ms` }}>
              
                <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <span className="absolute top-4 left-4 text-eyebrow text-gold" style={{ fontFamily: "var(--font-sans)" }}>0{i + 1} / 08</span>
                <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
                  <h3 className="text-display text-4xl" style={{ fontFamily: "var(--font-display)" }}>{c.name}</h3>
                  <p className="text-xs text-ivory/70 mt-2" style={{ fontFamily: "var(--font-sans)" }}>{c.tagline}</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ===== New & Notable, with pagination ===== */}
      <section className="bg-secondary/40 py-14 lg:py-12 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 overflow-hidden" ref={newNotable.ref}>
            <p
              className={`text-eyebrow text-gold mb-4 transition-all duration-700 ${newNotable.seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ fontFamily: "var(--font-sans)" }}>
              
              The Atelier Selection
            </p>
            <h2
              className={`text-display text-5xl md:text-7xl transition-all duration-1000 delay-150 ${newNotable.seen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-24"}`}
              style={{ fontFamily: "var(--font-display)" }}>
              
              <span className="shimmer-text">New &amp; Notable</span>
            </h2>
            <div
              className={`gold-line h-px w-32 mx-auto mt-6 origin-left transition-transform duration-1000 delay-500 ${newNotable.seen ? "scale-x-100" : "scale-x-0"}`} />
            
            <p
              className={`text-muted-foreground mt-6 max-w-xl mx-auto transition-all duration-1000 delay-700 ${newNotable.seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ fontFamily: "var(--font-sans)" }}>
              
              Sixteen quiet objects, freshly composed in the ateliers of Milan, Geneva and Florence.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-8 lg:gap-y-16 px-2">
            {pagedProducts.map((p, i) =>
            <ProductCard key={p.id} product={p} index={i} />
            )}
          </div>

          {/* Pagination */}
          {totalProductPages > 1 &&
          <div className="mt-16 flex items-center justify-center gap-2">
              <button
              onClick={() => setProductPage((p) => Math.max(1, p - 1))}
              disabled={productPage === 1}
              aria-label="Previous page"
              className="w-11 h-11 flex items-center justify-center border border-border hover:border-gold hover:text-gold transition-all disabled:opacity-30">
              
                <ArrowLeft size={16} />
              </button>
              {Array.from({ length: totalProductPages }).map((_, i) =>
            <button
              key={i}
              onClick={() => setProductPage(i + 1)}
              className={`w-11 h-11 text-eyebrow text-sm transition-all border ${
              productPage === i + 1 ?
              "bg-ink text-ivory border-ink" :
              "border-border hover:border-gold hover:text-gold"}`
              }
              style={{ fontFamily: "var(--font-sans)" }}>
              
                  {i + 1}
                </button>
            )}
              <button
              onClick={() => setProductPage((p) => Math.min(totalProductPages, p + 1))}
              disabled={productPage === totalProductPages}
              aria-label="Next page"
              className="w-11 h-11 flex items-center justify-center border border-border hover:border-gold hover:text-gold transition-all disabled:opacity-30">
              
                <ArrowRight size={16} />
              </button>
            </div>
          }
        </div>
      </section>

      {/* ===== The Maison ===== */}
      <section className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-14 lg:py-12">
        <svg aria-hidden className="absolute top-10 right-10 w-40 h-40 text-gold/20" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </svg>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          <div className="relative">
            <span className="absolute -inset-4 border border-gold/40 -translate-x-4 -translate-y-4" />
            <img src={story} alt="The atelier" loading="lazy" className="relative w-full h-full min-h-[640px] object-cover" />
            <div className="absolute -bottom-8 -right-8 bg-ivory p-8 max-w-[280px] hidden md:block shadow-[var(--shadow-soft)] border-t-2 border-gold">
              <p className="text-display text-6xl text-gold leading-none" style={{ fontFamily: "var(--font-display)" }}>1908</p>
              <p className="text-eyebrow text-muted-foreground mt-2" style={{ fontFamily: "var(--font-sans)" }}>Founded in Milan</p>
              <div className="flex gap-1 mt-3">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={11} className="fill-gold text-gold" />)}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-eyebrow text-gold mb-5 flex items-center gap-3" style={{ fontFamily: "var(--font-sans)" }}>
              The Maison
            </p>
            <h2 className="text-display text-5xl md:text-6xl leading-[1.05] mb-8" style={{ fontFamily: "var(--font-display)" }}>
              A century of <em className="text-gold not-italic italic">slow</em><br />composition.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-5" style={{ fontFamily: "var(--font-sans)" }}>
              Maison Vera was born inside a single room in Milan, where Sofia Vera draped silk
              by candlelight. Five generations later, every gown, every jewel and every leather
              object is still measured by hand, slowly, intentionally, irreplaceably.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-10 italic" style={{ fontFamily: "var(--font-display)" }}>
              "We do not produce. We compose."
            </p>
            <div className="grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
              { n: "116", l: "Years" },
              { n: "42", l: "Ateliers" },
              { n: "1 of 1", l: "Pieces" }].
              map((s) =>
              <div key={s.l} className="border-l border-gold/40 pl-4">
                  <p className="text-display text-4xl text-ink" style={{ fontFamily: "var(--font-display)" }}>{s.n}</p>
                  <p className="text-eyebrow text-muted-foreground mt-1" style={{ fontFamily: "var(--font-sans)" }}>{s.l}</p>
                </div>
              )}
            </div>
            <Link to="/about" className="mt-10 inline-flex items-center gap-3 text-eyebrow border-b border-ink pb-2 hover:border-gold hover:text-gold transition-colors self-start" style={{ fontFamily: "var(--font-sans)" }}>
              Read our story <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Editor's Edit, 8 products ===== */}
      <section className="bg-ink text-ivory py-14 lg:py-12 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-eyebrow text-gold mb-4 flex items-center gap-3" style={{ fontFamily: "var(--font-sans)" }}>
                Editor's Edit
              </p>
              <h2 className="text-display text-5xl md:text-7xl" style={{ fontFamily: "var(--font-display)" }}>Objects of <em className="text-gold not-italic italic">desire</em>.</h2>
            </div>
            <Link to="/shop" className="text-eyebrow text-gold flex items-center gap-2 hover:gap-4 transition-all border-b border-gold/40 pb-2" style={{ fontFamily: "var(--font-sans)" }}>
              Shop the edit <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-8 px-2">
            {editorial.map((p, i) =>
            <article
              key={p.id}
              className="group animate-fade-up"
              style={{ animationDelay: `${i * 90}ms` }}>
              
                <Link to="/product/$id" params={{ id: p.id }} className="block relative overflow-hidden bg-ivory/5 aspect-[3/4]">
                  <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {p.badge &&
                <span className="absolute top-3 left-3 bg-gold text-ink text-eyebrow px-3 py-1" style={{ fontFamily: "var(--font-sans)" }}>{p.badge}</span>
                }
                  <span className="absolute top-3 right-3 w-6 h-px bg-gold/70" />
                  <span className="absolute top-3 right-3 w-px h-6 bg-gold/70" />
                  <span className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-ivory/15 backdrop-blur border border-ivory/30 text-ivory text-[0.6rem] tracking-[0.2em] uppercase px-4 py-2 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap" style={{ fontFamily: "var(--font-sans)" }}>
                    <Eye size={11} /> Quick View
                  </span>
                  <button className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-gold text-ink text-eyebrow py-3 flex items-center justify-center gap-2 hover:bg-ivory" style={{ fontFamily: "var(--font-sans)" }}>
                    Add to Cart <ArrowRight size={12} />
                  </button>
                </Link>
                <div className="mt-5 px-1 flex justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-eyebrow text-gold mb-1" style={{ fontFamily: "var(--font-sans)" }}>{p.category}</p>
                    <h3 className="text-display text-2xl group-hover:text-gold transition-colors truncate" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h3>
                    <p className="text-xs text-ivory/60 mt-1 truncate" style={{ fontFamily: "var(--font-sans)" }}>{p.tagline}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-display text-xl text-gold" style={{ fontFamily: "var(--font-display)" }}>${p.price.toLocaleString()}</p>
                    {p.oldPrice &&
                  <p className="text-xs text-ivory/40 line-through" style={{ fontFamily: "var(--font-sans)" }}>${p.oldPrice.toLocaleString()}</p>
                  }
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* ===== Pillars ===== */}
      <section className="bg-[#f7f1e6] py-14 lg:py-12 relative overflow-hidden">
        <svg aria-hidden className="absolute -top-10 -right-10 w-80 h-80 text-gold/20" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </svg>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
          <div className="text-center mb-16">
            <p className="text-eyebrow text-gold mb-4" style={{ fontFamily: "var(--font-sans)" }}>The House Promise</p>
            <h2 className="text-display text-5xl md:text-7xl" style={{ fontFamily: "var(--font-display)" }}>Composed, <em className="text-gold not-italic italic">never</em> produced.</h2>
            <div className="gold-line h-px w-24 mx-auto mt-6" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
            { Ic: Scissors, t: "Couture Hand Finish", d: "Hand stitched, hand set, hand pressed in our European ateliers.", n: "01" },
            { Ic: Gem, t: "Rare Materials", d: "Italian silk, Mongolian cashmere, Geneva set diamonds.", n: "02" },
            { Ic: Truck, t: "White Glove Delivery", d: "Worldwide concierge delivery, beautifully presented.", n: "03" },
            { Ic: Award, t: "Lifetime Craft", d: "Repaired, restored, re-loved, for generations.", n: "04" }].
            map((p) =>
            <div key={p.t} className="relative group bg-ivory p-10 border border-gold/30 hover:border-gold transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]">
                <span className="absolute top-4 right-5 text-display text-5xl text-gold/20 group-hover:text-gold/40 transition-colors" style={{ fontFamily: "var(--font-display)" }}>{p.n}</span>
                <span className="absolute top-0 left-0 w-10 h-px bg-gold" />
                <span className="absolute top-0 left-0 w-px h-10 bg-gold" />
                <p.Ic size={32} className="text-gold mb-6" strokeWidth={1.1} />
                <h3 className="text-display text-2xl mb-3" style={{ fontFamily: "var(--font-display)" }}>{p.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>{p.d}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="bg-secondary/40 py-14 lg:py-12 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-eyebrow text-gold mb-4" style={{ fontFamily: "var(--font-sans)" }}>Whispered Praise</p>
            <h2 className="text-display text-5xl md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>From those who <em className="text-gold not-italic italic">wear us</em>.</h2>
            <div className="gold-line h-px w-24 mx-auto mt-6" />
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-1000 ease-out"
                style={{ transform: `translateX(-${tPage * 100}%)` }}>
                
                {Array.from({ length: pages }).map((_, page) =>
                <div key={page} className="shrink-0 w-full grid md:grid-cols-3 gap-6">
                    {testimonials.slice(page * 3, page * 3 + 3).map((q, i) =>
                  <figure
                    key={q.a}
                    className="relative bg-ivory p-10 border border-border hover:border-gold/40 transition-colors animate-fade-up"
                    style={{ animationDelay: `${i * 120}ms` }}>
                    
                        <Quote size={26} className="text-gold/30 absolute top-5 right-5" />
                        <div className="flex gap-0.5 text-gold mb-5">
                          {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={14} className="fill-gold" />)}
                        </div>
                        <blockquote className="text-display text-2xl leading-snug italic text-ink" style={{ fontFamily: "var(--font-display)" }}>"{q.t}"</blockquote>
                        <figcaption className="text-eyebrow text-muted-foreground mt-6 flex items-center gap-3" style={{ fontFamily: "var(--font-sans)" }}>
                          <span className="h-px w-6 bg-gold" /> {q.a}
                        </figcaption>
                      </figure>
                  )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }).map((_, i) =>
              <button
                key={i}
                onClick={() => setTPage(i)}
                aria-label={`Page ${i + 1}`}
                className={`h-px transition-all duration-500 ${i === tPage ? "w-14 bg-gold" : "w-7 bg-ink/30"}`} />

              )}
            </div>
          </div>
        </div>
      </section>
    </>);

}