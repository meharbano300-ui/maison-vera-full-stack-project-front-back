import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, ChevronRight, SlidersHorizontal, Grid3X3, LayoutList, Sparkles } from "lucide-react";
import ProductCard from "@/components/site/ProductCard";
import { categoryList, getCategory } from "@/lib/products";
import { useAdminProducts } from "@/lib/admin-store";
import PageHeroSlider from "@/components/site/PageHeroSlider";
import { useMemo, useState } from "react";
import heroElectronics from "@/assets/hero-product-electronics.png";
import heroFashion from "@/assets/hero-product-fashion.png";
import heroHome from "@/assets/hero-product-home.png";
import heroBeauty from "@/assets/hero-product-beauty.png";
import heroHealth from "@/assets/hero-product-health.png";
import heroGroceries from "@/assets/hero-product-groceries.png";

const heroProductBySlug = {
  electronics: heroElectronics,
  fashion: heroFashion,
  "home-living": heroHome,
  beauty: heroBeauty,
  health: heroHealth,
  groceries: heroGroceries
};

const ITEMS_PER_PAGE = 8;

export const Route = createFileRoute("/category/$slug")({

  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  notFoundComponent: () =>
  <div className="pt-32 text-center max-w-md mx-auto px-6">
      <p className="text-eyebrow text-gold mb-4">404</p>
      <h1 className="text-display text-5xl">This atelier does not exist.</h1>
      <Link to="/categories" className="btn-luxe btn-luxe-hover inline-flex mt-8">All categories</Link>
    </div>,

  errorComponent: ({ error, reset }) =>
  <div className="pt-32 text-center max-w-md mx-auto px-6">
      <h1 className="text-display text-4xl">A moment of pause</h1>
      <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
      <button onClick={reset} className="btn-luxe btn-luxe-hover mt-6">Try again</button>
    </div>,

  component: CategoryPage
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const products = useAdminProducts();
  const [page, setPage] = useState(1);
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("default");
  const [sub, setSub] = useState("All");

  const all = useMemo(() => products.filter((p) => p.category === cat.name), [products, cat]);

  const maxPriceCeil = useMemo(() => {
    if (all.length === 0) return 5000;
    return Math.ceil(Math.max(...all.map((p) => p.price)) / 1000) * 1000;
  }, [all]);

  const [priceMax, setPriceMax] = useState(() => maxPriceCeil);

  // Keep priceMax in sync when products change (e.g. admin adds expensive item)
  useMemo(() => {setPriceMax(maxPriceCeil);}, [maxPriceCeil]);

  const list = useMemo(() => {
    let l = all.filter((p) => (sub === "All" || p.subcategory === sub) && p.price <= priceMax);
    if (sort === "price-asc") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    return l;
  }, [all, sub, sort, priceMax]);

  // Pad so pagination always reaches up to 3 pages
  const needList = ITEMS_PER_PAGE * 3;
  const padded = useMemo(() => {
    if (list.length === 0) return list;
    const out = [...list];
    let i = 0;
    while (out.length < needList) {
      const p = list[i % list.length];
      out.push({ ...p, id: `${p.id}-c${Math.floor(i / list.length) + 1}-${i}` });
      i++;
    }
    return out.slice(0, needList);
  }, [list]);
  const totalPages = list.length === 0 ? 0 : Math.min(3, Math.max(1, Math.ceil(padded.length / ITEMS_PER_PAGE)));
  const paged = padded.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const others = categoryList.filter((c) => c.slug !== cat.slug);

  // Build slider content from this category's own pieces, so every category
  // gets its own images (no recycling) and copy that references its world.
  const heroSlides = useMemo(() => {
    // One representative product per sub-category, in order
    const reps = cat.subs.
    map((s) => all.find((p) => p.subcategory === s)).
    filter(Boolean);
    const pool = reps.length ? reps : all;
    const pick = (i) => pool[i % pool.length];

    const a = pick(0);
    const b = pick(1) ?? a;
    // The hero "hero image" stays the same transparent collage across all 3
    // slides — it represents the whole category and floats with no background.
    const heroImg = heroProductBySlug[cat.slug] ?? cat.image;

    return [
    {
      tag: `Atelier · ${cat.name}`,
      titleTop: "The",
      titleEm: cat.name,
      titleBot: "edit.",
      copy: cat.description,
      image: heroImg,
      cta: { to: "/shop", label: `Shop ${cat.name}` }
    },
    {
      tag: `Featured · ${a.subcategory}`,
      titleTop: a.name.split(" ").slice(0, -1).join(" ") || a.name,
      titleEm: a.name.split(" ").slice(-1).join(" "),
      copy: a.description,
      image: heroImg,
      cta: { to: "/shop", label: "Discover the piece" }
    },
    {
      tag: `Within · ${b.subcategory}`,
      titleTop: "Composed for",
      titleEm: b.subcategory + ".",
      copy: b.description,
      image: heroImg,
      cta: { to: "/shop", label: "View the edit" }
    }];

  }, [cat, all]);

  // Background images: only use pieces from this same category, no repeats
  const heroBgImages = useMemo(() => {
    const seen = new Set();
    const uniques = [];
    for (const p of all) {
      if (!seen.has(p.image)) {
        seen.add(p.image);
        uniques.push(p.image);
      }
    }
    // fall back to the category hero image when a category has few products
    if (uniques.length < 3) uniques.push(cat.image);
    return uniques.slice(0, 6);
  }, [all, cat]);

  return (
    <div>
      <PageHeroSlider
        variant="spotlight"
        slides={heroSlides}
        bgImages={heroBgImages} />
      


      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-10 pb-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-eyebrow text-muted-foreground mb-8" style={{ fontFamily: "var(--font-sans)" }}>
          <Link to="/categories" className="hover:text-gold transition-colors">Categories</Link>
          <ChevronRight size={12} />
          <span className="text-ink">{cat.name}</span>
        </div>

        {/* Sub-category filter chips, animated */}
        <div className="mb-8">
          <p className="text-eyebrow text-gold mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-sans)" }}>
            <Sparkles size={11} /> Refine by sub-category
          </p>
          <div className="flex flex-wrap gap-2">
            {["All", ...cat.subs].map((s, i) =>
            <button
              key={s}
              onClick={() => {setSub(s);setPage(1);}}
              className={`text-eyebrow px-4 py-2 border transition-all duration-500 animate-fade-up hover-scale ${
              sub === s ? "bg-ink text-ivory border-ink shadow-[var(--shadow-soft)]" : "border-border hover:border-gold hover:text-gold"}`
              }
              style={{ fontFamily: "var(--font-sans)", animationDelay: `${i * 60}ms` }}>
              
                {s}
              </button>
            )}
          </div>
        </div>

        {/* Header + controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8 pb-6 border-b border-border">
          <div>
            <p className="text-eyebrow text-gold mb-2" style={{ fontFamily: "var(--font-sans)" }}>{list.length} composed pieces</p>
            <h2 className="text-display text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              {sub === "All" ? `The ${cat.name} edit.` : sub}
            </h2>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {/* Price range */}
            <div className="flex items-center gap-2 text-eyebrow" style={{ fontFamily: "var(--font-sans)" }}>
              <span className="text-muted-foreground">Up to €{priceMax.toLocaleString()}</span>
              <input
                type="range"
                min={10}
                max={maxPriceCeil}
                step={Math.max(10, Math.round(maxPriceCeil / 200) * 10)}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="slider-gold w-32"
                style={{ ["--val"]: `${(priceMax - 10) / (maxPriceCeil - 10) * 100}%` }} />
              
            </div>
            {/* Sort */}
            <div className="flex items-center gap-2 text-eyebrow" style={{ fontFamily: "var(--font-sans)" }}>
              <SlidersHorizontal size={14} className="text-gold" />
              <select
                value={sort}
                onChange={(e) => {setSort(e.target.value);setPage(1);}}
                className="bg-transparent text-sm border border-border px-3 py-2 focus:outline-none focus:border-gold transition-colors cursor-pointer">
                
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
            {/* View toggle */}
            <div className="flex border border-border">
              <button onClick={() => setView("grid")} className={`p-2 transition-colors ${view === "grid" ? "bg-ink text-ivory" : "hover:bg-secondary"}`} aria-label="Grid view"><Grid3X3 size={14} /></button>
              <button onClick={() => setView("list")} className={`p-2 transition-colors ${view === "list" ? "bg-ink text-ivory" : "hover:bg-secondary"}`} aria-label="List view"><LayoutList size={14} /></button>
            </div>
          </div>
        </div>

        {list.length === 0 ?
        <div className="py-14 text-center text-muted-foreground">
            No pieces match this selection. <button onClick={() => {setSub("All");setPriceMax(maxPriceCeil);}} className="text-gold underline ml-2">Reset filters</button>
          </div> :
        view === "grid" ?
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {paged.map((p, i) =>
          <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <ProductCard product={p} index={i} />
              </div>
          )}
          </div> :

        <div className="flex flex-col gap-0 border-t border-border">
            {paged.map((p, i) =>
          <Link
            key={p.id}
            to="/product/$id"
            params={{ id: p.id }}
            className="group flex items-center gap-8 py-6 border-b border-border hover:bg-secondary/40 transition-colors px-4 -mx-4 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}>
            
                <div className="w-24 h-28 shrink-0 overflow-hidden bg-secondary">
                  <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-eyebrow text-gold text-[0.6rem] tracking-[0.2em] uppercase mb-1" style={{ fontFamily: "var(--font-sans)" }}>{p.subcategory}</p>
                  <h3 className="text-display text-2xl group-hover:text-gold transition-colors" style={{ fontFamily: "var(--font-display)" }}>{p.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1" style={{ fontFamily: "var(--font-sans)" }}>{p.tagline}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-display text-2xl" style={{ fontFamily: "var(--font-display)" }}>${p.price.toLocaleString()}</p>
                  {p.oldPrice && <p className="text-sm text-muted-foreground line-through" style={{ fontFamily: "var(--font-sans)" }}>${p.oldPrice.toLocaleString()}</p>}
                </div>
                <ArrowRight size={16} className="text-gold opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </Link>
          )}
          </div>
        }

        {/* Pagination */}
        {totalPages > 1 &&
        <div className="mt-16 flex items-center justify-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page" className="w-11 h-11 flex items-center justify-center border border-border hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"><ArrowLeft size={16} /></button>
            {Array.from({ length: totalPages }).map((_, i) =>
          <button key={i} onClick={() => setPage(i + 1)} className={`w-11 h-11 text-eyebrow text-sm transition-all border ${page === i + 1 ? "bg-ink text-ivory border-ink" : "border-border hover:border-gold hover:text-gold"}`} style={{ fontFamily: "var(--font-sans)" }}>{i + 1}</button>
          )}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page" className="w-11 h-11 flex items-center justify-center border border-border hover:border-gold hover:text-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed"><ArrowRight size={16} /></button>
          </div>
        }
      </section>

      {/* Sub-category gallery */}
      <section className="bg-secondary/40 py-14">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <p className="text-eyebrow text-gold mb-2" style={{ fontFamily: "var(--font-sans)" }}>Within this atelier</p>
          <h2 className="text-display text-4xl mb-10" style={{ fontFamily: "var(--font-display)" }}>Sub-categories of {cat.name}.</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {cat.subs.map((s, i) => {
              const subProducts = all.filter((p) => p.subcategory === s);
              const img = subProducts[0]?.image ?? cat.image;
              const count = subProducts.length;
              return (
                <button
                  key={s}
                  onClick={() => {setSub(s);setPage(1);window.scrollTo({ top: 0, behavior: "smooth" });}}
                  className="group block relative overflow-hidden text-left animate-fade-up"
                  style={{ animationDelay: `${i * 70}ms` }}>
                  
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={img} alt={s} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1200ms]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                    <span className="absolute top-0 right-0 w-8 h-px bg-gold" />
                    <span className="absolute top-0 right-0 w-px h-8 bg-gold" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-ivory">
                      <p className="text-eyebrow text-gold text-[0.6rem] tracking-[0.2em] mb-2" style={{ fontFamily: "var(--font-sans)" }}>{count} pieces</p>
                      <p className="text-display text-xl leading-tight" style={{ fontFamily: "var(--font-display)" }}>{s}</p>
                      <span className="mt-3 inline-flex items-center gap-2 text-eyebrow text-gold text-[0.65rem] tracking-[0.15em] opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500" style={{ fontFamily: "var(--font-sans)" }}>
                        Filter <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </button>);

            })}
          </div>
        </div>
      </section>

      {/* Other ateliers */}
      <section className="bg-ivory py-14">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <p className="text-eyebrow text-gold mb-2" style={{ fontFamily: "var(--font-sans)" }}>Continue your journey</p>
          <h2 className="text-display text-4xl mb-10" style={{ fontFamily: "var(--font-display)" }}>Other ateliers of the Maison.</h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
            {others.map((c, i) => {
              const count = products.filter((p) => p.category === c.name).length;
              return (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="group block relative overflow-hidden animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}>
                  
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1400ms]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                    <span className="absolute top-0 right-0 w-8 h-px bg-gold" />
                    <span className="absolute top-0 right-0 w-px h-8 bg-gold" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-ivory">
                      <p className="text-eyebrow text-gold text-[0.6rem] tracking-[0.2em] mb-2" style={{ fontFamily: "var(--font-sans)" }}>{count} pieces</p>
                      <p className="text-display text-xl leading-tight" style={{ fontFamily: "var(--font-display)" }}>{c.name}</p>
                      <span className="mt-3 inline-flex items-center gap-2 text-eyebrow text-gold text-[0.65rem] tracking-[0.15em] opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500" style={{ fontFamily: "var(--font-sans)" }}>
                        Enter atelier <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>);

            })}
          </div>
        </div>
      </section>
    </div>);

}