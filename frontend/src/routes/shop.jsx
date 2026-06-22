import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Filter, LayoutGrid, SlidersHorizontal, Sparkles, X, Scissors, Gem, Award, ArrowLeft, ArrowRight, Star, Tag } from "lucide-react";
import ProductCard from "@/components/site/ProductCard";
import { categoryList, colors } from "@/lib/products";
import { useAdminProducts } from "@/lib/admin-store";
import { z } from "zod";
import HeroSlider from "@/components/site/HeroSlider";
import bg1 from "@/assets/hero-1.jpg";
import bg2 from "@/assets/hero-2.jpg";
import bg3 from "@/assets/hero-3.jpg";
import lookGown from "@/assets/lux-gown.png";
import lookHeels from "@/assets/lux-heels.png";
import lookWatch from "@/assets/lux-watch.png";
import lookPerfume from "@/assets/lux-perfume.png";

const search = z.object({
  c: z.string().optional(),
  sub: z.string().optional(),
  color: z.string().optional(),
  sort: z.enum(["featured", "low", "high", "rating"]).optional(),
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
  rating: z.coerce.number().optional(),
  sale: z.coerce.boolean().optional()
});

export const Route = createFileRoute("/shop")({
  validateSearch: search,
  component: Shop
});

function Shop() {
  const products = useAdminProducts();
  const sp = Route.useSearch();
  const nav = useNavigate({ from: "/shop" });
  const [openFilters, setOpenFilters] = useState(true);
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const category = sp.c ?? "All";
  const sub = sp.sub ?? "All";
  const color = sp.color ?? "All";
  const sort = sp.sort ?? "featured";
  const minP = sp.min ?? 0;
  const maxP = sp.max ?? 999999;
  const minRating = sp.rating ?? 0;
  const onlySale = sp.sale ?? false;

  // Available subs depend on selected main category
  const availableSubs = useMemo(() => {
    if (category === "All") return [];
    const cat = categoryList.find((c) => c.name === category);
    return cat?.subs ?? [];
  }, [category]);

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
    (category === "All" || p.category === category) && (
    sub === "All" || p.subcategory === sub) && (
    color === "All" || p.color === color) &&
    p.price >= minP && p.price <= maxP &&
    p.rating >= minRating && (
    !onlySale || p.oldPrice !== undefined)
    );
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, sub, color, sort, minP, maxP, minRating, onlySale]);

  useEffect(() => {setPage(1);}, [category, sub, color, sort, minP, maxP, minRating, onlySale]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const update = (patch) => nav({ search: (s) => ({ ...s, ...patch }) });
  const clearAll = () => nav({ search: {} });

  const activeCount = [
  sp.c, sp.sub, sp.color, sp.min, sp.max, sp.rating, sp.sale].
  filter((v) => v !== undefined && v !== null && v !== "").length;

  return (
    <div>
      <HeroSlider
        compact
        slides={[
        { tag: `The Boutique · ${filtered.length} pieces`, titleTop: "The entire", titleEm: "house, selected.", copy: "Every piece is one of an edition, composed by hand in our European ateliers and signed by its master.", cta: { to: "/shop", label: "Browse Pieces" }, accent: "House Selection", image: bg1 },
        { tag: "Haute Horlogerie Genève", titleTop: "Time set in", titleEm: "gold.", copy: "Self winding chronographs, signed by the Maître of the Geneva atelier.", cta: { to: "/shop", label: "Shop Watches" }, accent: "Geneva Atelier", image: bg3 },
        { tag: "Maroquinerie Paris", titleTop: "Polished calfskin,", titleEm: "soled in gold.", copy: "Hand lasted in Paris. Lined with gilded leather, signed by a single artisan.", cta: { to: "/shop", label: "Shop Leather" }, accent: "Paris Workshop", image: bg2 }]
        } />
      

      {/* === Luxury Category Atelier === */}
      <section className="relative bg-gradient-to-b from-ivory via-secondary/30 to-ivory border-b border-border py-14 lg:py-16 overflow-hidden">
        <div aria-hidden className="absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full bg-gold/10 blur-[160px]" />
        <div aria-hidden className="absolute -bottom-32 -right-20 w-[420px] h-[420px] rounded-full bg-emerald/10 blur-[180px]" />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-eyebrow text-gold mb-3 flex items-center gap-3" style={{ fontFamily: "var(--font-sans)" }}>
                The Maisons
              </p>
              <h2 className="text-display text-3xl md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                Choose your <em className="italic text-gold">atelier.</em>
              </h2>
            </div>
            {category !== "All" &&
            <button
              onClick={() => update({ c: undefined, sub: undefined })}
              className="self-start md:self-end text-eyebrow text-gold border-b border-gold/40 hover:border-gold inline-flex items-center gap-2 pb-1"
              style={{ fontFamily: "var(--font-sans)" }}>
              
                <X size={11} /> Clear category
              </button>
            }
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
            {/* "All" tile */}
            <button
              onClick={() => update({ c: undefined, sub: undefined })}
              className={`group relative aspect-[3/4] md:aspect-[4/5] md:max-h-[180px] overflow-hidden border transition-all duration-500 ${
              category === "All" ?
              "border-gold shadow-[var(--shadow-soft)] ring-1 ring-gold" :
              "border-border/60 hover:border-gold"}`
              }>
              
              <div className="absolute inset-0 bg-gradient-to-br from-ink via-emerald to-ink" />
              <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.74_0.13_78_/_0.35),transparent_55%)]" />
              <span className="absolute top-3 left-3 w-6 h-px bg-gold transition-all duration-500 group-hover:w-10" />
              <span className="absolute top-3 left-3 w-px h-6 bg-gold transition-all duration-500 group-hover:h-10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-ivory text-center px-2">
                <Sparkles size={14} className="text-gold mb-1" strokeWidth={1.2} />
                <p className="text-display text-base md:text-lg leading-tight" style={{ fontFamily: "var(--font-display)" }}>The full <em className="italic text-gold">house</em></p>
                <p className="text-eyebrow text-[0.55rem] text-ivory/60 mt-1" style={{ fontFamily: "var(--font-sans)" }}>{products.length} pieces</p>
              </div>
            </button>

            {categoryList.map((c, i) => {
              const active = category === c.name;
              const count = products.filter((p) => p.category === c.name).length;
              return (
                <button
                  key={c.slug}
                  onClick={() => update({ c: active ? undefined : c.name, sub: undefined })}
                  className={`group relative aspect-[3/4] md:aspect-[4/5] md:max-h-[180px] overflow-hidden border transition-all duration-500 animate-fade-up ${
                  active ?
                  "border-gold shadow-[var(--shadow-soft)] ring-1 ring-gold scale-[1.02]" :
                  "border-border/60 hover:border-gold hover:-translate-y-1"}`
                  }
                  style={{ animationDelay: `${i * 60}ms` }}>
                  
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110" />
                  
                  <div className={`absolute inset-0 transition-opacity duration-500 ${active ? "bg-gradient-to-t from-ink/95 via-ink/60 to-ink/30" : "bg-gradient-to-t from-ink/90 via-ink/40 to-transparent group-hover:from-ink/95"}`} />
                  <span className="absolute top-3 right-3 w-6 h-px bg-gold transition-all duration-500 group-hover:w-10" />
                  <span className="absolute top-3 right-3 w-px h-6 bg-gold transition-all duration-500 group-hover:h-10" />
                  <span className="absolute top-3 left-3 text-eyebrow text-gold/80 text-[0.55rem]" style={{ fontFamily: "var(--font-sans)" }}>0{i + 1}</span>

                  <div className="absolute inset-x-0 bottom-0 p-2 md:p-2.5 text-ivory text-left">
                    <p className="text-eyebrow text-gold text-[0.5rem] mb-0.5" style={{ fontFamily: "var(--font-sans)" }}>{count} pieces</p>
                    <p className="text-display text-xs md:text-sm leading-tight line-clamp-2" style={{ fontFamily: "var(--font-display)" }}>{c.name}</p>
                  </div>

                  {active &&
                  <span className="absolute top-3 right-3 -translate-x-8 bg-gold text-ink text-eyebrow text-[0.55rem] px-2 py-0.5" style={{ fontFamily: "var(--font-sans)" }}>
                      Selected
                    </span>
                  }
                </button>);

            })}
          </div>

          {/* Sub-categories — only when a main category is picked */}
          {availableSubs.length > 0 &&
          <div className="mt-12 animate-fade-in">
              <div className="flex items-center gap-3 mb-5">
                <p className="text-eyebrow text-gold" style={{ fontFamily: "var(--font-sans)" }}>
                  {category} · refine the edit
                </p>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                <button
                onClick={() => update({ sub: undefined })}
                className={`group relative aspect-[4/3] overflow-hidden border transition-all duration-500 ${
                sub === "All" ? "border-gold ring-1 ring-gold" : "border-border/60 hover:border-gold"}`
                }>
                
                  <div className="absolute inset-0 bg-gradient-to-br from-ink to-emerald" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-ivory">
                    <LayoutGrid size={16} className="text-gold mb-1.5" strokeWidth={1.2} />
                    <p className="text-display text-lg" style={{ fontFamily: "var(--font-display)" }}>All</p>
                    <p className="text-eyebrow text-[0.55rem] text-ivory/60 mt-1" style={{ fontFamily: "var(--font-sans)" }}>the whole atelier</p>
                  </div>
                </button>

                {availableSubs.map((s, i) => {
                const active = sub === s;
                const repProduct = products.find((p) => p.subcategory === s);
                const count = products.filter((p) => p.subcategory === s).length;
                return (
                  <button
                    key={s}
                    onClick={() => update({ sub: active ? undefined : s })}
                    className={`group relative aspect-[4/3] overflow-hidden border transition-all duration-500 animate-fade-up ${
                    active ?
                    "border-gold ring-1 ring-gold shadow-[var(--shadow-soft)]" :
                    "border-border/60 hover:border-gold hover:-translate-y-0.5"}`
                    }
                    style={{ animationDelay: `${i * 50}ms` }}>
                    
                      {repProduct ?
                    <img
                      src={repProduct.image}
                      alt={s}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110" /> :


                    <div className="absolute inset-0 bg-secondary" />
                    }
                      <div className={`absolute inset-0 ${active ? "bg-gradient-to-t from-ink/95 via-ink/55 to-ink/20" : "bg-gradient-to-t from-ink/85 via-ink/35 to-transparent"}`} />
                      <span className="absolute top-2 right-2 w-5 h-px bg-gold" />
                      <span className="absolute top-2 right-2 w-px h-5 bg-gold" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-ivory text-left">
                        <p className="text-eyebrow text-gold text-[0.55rem] mb-0.5" style={{ fontFamily: "var(--font-sans)" }}>{count} {count === 1 ? "piece" : "pieces"}</p>
                        <p className="text-display text-sm lg:text-base leading-tight" style={{ fontFamily: "var(--font-display)" }}>{s}</p>
                      </div>
                      {active &&
                    <span className="absolute top-2 left-2 bg-gold text-ink text-eyebrow text-[0.55rem] px-1.5 py-0.5" style={{ fontFamily: "var(--font-sans)" }}>
                          ✓
                        </span>
                    }
                    </button>);

              })}
              </div>
            </div>
          }
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-10 pb-20 grid lg:grid-cols-[280px_1fr] gap-10">
        {/* === Stylish luxury filter sidebar === */}
        <aside className="lg:sticky lg:top-44 lg:self-start space-y-7">
          <div className="flex items-center justify-between border-b border-ink pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-gold" />
              <p className="text-eyebrow" style={{ fontFamily: "var(--font-sans)" }}>Atelier Filters</p>
            </div>
            <button
              onClick={() => setOpenFilters((v) => !v)}
              className="lg:hidden text-eyebrow text-gold">
              
              {openFilters ? "Hide" : "Show"}
            </button>
          </div>

          <div className={`${openFilters ? "block" : "hidden"} lg:block space-y-7`}>
            {activeCount > 0 &&
            <div className="flex items-center justify-between border border-gold/30 bg-gold/5 px-3 py-2 animate-fade-in">
                <span className="text-eyebrow text-gold" style={{ fontFamily: "var(--font-sans)" }}>{activeCount} active</span>
                <button onClick={clearAll} className="text-eyebrow text-ink hover:text-gold flex items-center gap-1.5">
                  <X size={11} /> Clear
                </button>
              </div>
            }

            {/* Price */}
            <div>
              <p className="text-eyebrow text-gold mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-sans)" }}>
                <Tag size={11} /> Price range
              </p>
              <div className="flex items-center gap-2 mb-3 text-sm" style={{ fontFamily: "var(--font-sans)" }}>
                <span className="border border-border px-2 py-1">${minP}</span>
                <span className="text-muted-foreground">—</span>
                <span className="border border-border px-2 py-1">${maxP}</span>
              </div>
              <input
                type="range"
                min={0}
                max={3000}
                step={10}
                value={maxP}
                onChange={(e) => update({ max: Number(e.target.value) })}
                className="slider-gold w-full"
                style={{ ["--val"]: `${maxP / 3000 * 100}%` }} />
              

              <div className="flex flex-wrap gap-1.5 mt-3">
                {[{ l: "< $100", min: 0, max: 100 }, { l: "$100 — $500", min: 100, max: 500 }, { l: "$500 — $1500", min: 500, max: 1500 }, { l: "$1500+", min: 1500, max: 3000 }].map((b) =>
                <button
                  key={b.l}
                  onClick={() => update({ min: b.min, max: b.max })}
                  className="text-eyebrow text-[0.6rem] border border-border px-2 py-1 hover:border-gold hover:text-gold transition-all"
                  style={{ fontFamily: "var(--font-sans)" }}>
                  
                    {b.l}
                  </button>
                )}
              </div>
            </div>

            {/* Color */}
            <div>
              <p className="text-eyebrow text-gold mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-sans)" }}>
                <Sparkles size={11} /> Color
              </p>
              <div className="flex flex-wrap gap-2">
                {["All", ...colors].map((c) =>
                <button
                  key={c}
                  onClick={() => update({ color: c === "All" ? undefined : c })}
                  className={`text-eyebrow text-[0.65rem] px-3 py-1.5 border transition-all ${
                  color === c ? "bg-ink text-ivory border-ink" : "border-border hover:border-gold hover:text-gold"}`
                  }
                  style={{ fontFamily: "var(--font-sans)" }}>
                  
                    {c}
                  </button>
                )}
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="text-eyebrow text-gold mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-sans)" }}>
                <Star size={11} /> Minimum rating
              </p>
              <div className="flex gap-1.5">
                {[0, 4, 4.5, 4.8].map((r) =>
                <button
                  key={r}
                  onClick={() => update({ rating: r === 0 ? undefined : r })}
                  className={`text-eyebrow text-[0.65rem] px-3 py-1.5 border transition-all flex items-center gap-1 ${
                  minRating === r ? "bg-ink text-ivory border-ink" : "border-border hover:border-gold hover:text-gold"}`
                  }
                  style={{ fontFamily: "var(--font-sans)" }}>
                  
                    {r === 0 ? "All" : `${r}+`} {r > 0 && <Star size={9} className="fill-current" />}
                  </button>
                )}
              </div>
            </div>

            {/* Sale */}
            <div>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-eyebrow text-gold flex items-center gap-2" style={{ fontFamily: "var(--font-sans)" }}>
                  <Tag size={11} /> On sale only
                </span>
                <button
                  type="button"
                  onClick={() => update({ sale: onlySale ? undefined : true })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${onlySale ? "bg-gold" : "bg-border"}`}>
                  
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-ivory shadow transition-transform ${onlySale ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </label>
            </div>
          </div>
        </aside>

        {/* === Results === */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
            <div>
              <p className="text-eyebrow text-gold mb-1" style={{ fontFamily: "var(--font-sans)" }}>{filtered.length} pieces composed</p>
              <h2 className="text-display text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                {category === "All" ? "The full collection" : sub === "All" ? category : `${category} · ${sub}`}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-eyebrow" style={{ fontFamily: "var(--font-sans)" }}>
              <span className="hidden md:inline text-muted-foreground">Sort</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => update({ sort: e.target.value === "featured" ? undefined : e.target.value })}
                  className="appearance-none border border-border bg-transparent pr-7 pl-3 py-2 text-eyebrow focus:outline-none focus:border-gold cursor-pointer transition-colors">
                  
                  <option value="featured">Featured</option>
                  <option value="low">Price ↑</option>
                  <option value="high">Price ↓</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <LayoutGrid size={14} className="ml-2 hidden md:block text-gold" />
            </div>
          </div>

          {filtered.length === 0 ?
          <div className="text-center py-32">
              <Filter size={32} className="mx-auto text-muted-foreground mb-4" strokeWidth={1} />
              <p className="text-display text-3xl">No pieces match your selection.</p>
              <button onClick={clearAll} className="mt-6 text-eyebrow text-gold border-b border-gold hover:gap-3 inline-flex items-center gap-2" style={{ fontFamily: "var(--font-sans)" }}>
                Reset filters
              </button>
            </div> :

          <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                {paged.map((p, i) =>
              <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <ProductCard product={p} index={i} />
                  </div>
              )}
              </div>

              {totalPages > 1 &&
            <div className="mt-16 flex items-center justify-center gap-2 flex-wrap">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page" className="w-11 h-11 flex items-center justify-center border border-border hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"><ArrowLeft size={16} /></button>
                  {Array.from({ length: totalPages }).map((_, i) =>
              <button key={i} onClick={() => setPage(i + 1)} className={`w-11 h-11 text-eyebrow text-sm transition-all border ${page === i + 1 ? "bg-ink text-ivory border-ink" : "border-border hover:border-gold hover:text-gold"}`}>{i + 1}</button>
              )}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page" className="w-11 h-11 flex items-center justify-center border border-border hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"><ArrowRight size={16} /></button>
                </div>
            }
            </>
          }
        </section>
      </div>

      {/* Luxury Styling, editorial */}
      <section className="bg-ink text-ivory py-12 lg:py-14 relative overflow-hidden">
        <div aria-hidden className="absolute -top-32 -left-24 w-[460px] h-[460px] rounded-full bg-gold/10 blur-[160px]" />
        <div aria-hidden className="absolute -bottom-40 -right-20 w-[420px] h-[420px] rounded-full bg-gold/10 blur-[180px]" />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-eyebrow text-gold mb-3 flex items-center gap-3" style={{ fontFamily: "var(--font-sans)" }}>
                <span className="h-px w-12 bg-gold" /> Luxury Styling
              </p>
              <h2 className="text-display text-4xl md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                Composed by the <em className="not-italic italic text-gold">house stylist.</em>
              </h2>
            </div>
            <p className="text-sm md:text-base text-ivory/70 max-w-md leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
              Curated edits drawn from across the ateliers, silhouettes, scents and signatures composed into a singular wardrobe.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
            { img: lookGown, label: "The Émeraude", sub: "Couture Look 01", Ic: Scissors },
            { img: lookHeels, label: "Noir & Or", sub: "Evening Look 02", Ic: Sparkles },
            { img: lookWatch, label: "Heritage", sub: "Daytime Look 03", Ic: Award },
            { img: lookPerfume, label: "Le Sillage", sub: "Signature Scent", Ic: Gem }].
            map((l, i) =>
            <Link key={i} to="/shop" className="group relative bg-ivory text-ink overflow-hidden border border-ivory/10 hover:border-gold transition-all duration-500 animate-fade-up" style={{ animationDelay: `${i * 90}ms` }}>
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                  <img src={l.img} alt={l.label} loading="lazy" className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-[1200ms]" />
                  <span className="absolute top-0 left-0 w-8 h-px bg-gold" />
                  <span className="absolute top-0 left-0 w-px h-8 bg-gold" />
                </div>
                <div className="p-5 border-t border-border">
                  <p className="text-eyebrow text-gold flex items-center gap-2 mb-1" style={{ fontFamily: "var(--font-sans)" }}>
                    <l.Ic size={11} /> {l.sub}
                  </p>
                  <p className="text-display text-xl" style={{ fontFamily: "var(--font-display)" }}>{l.label}</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>);

}