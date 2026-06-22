import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Heart,
  Minus,
  Plus,
  RefreshCcw,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  Zap } from
"lucide-react";
import { getAdminProducts, useAdminProducts } from "@/lib/admin-store";
import { fetchProduct } from "@/lib/api/productApi";
import { useShop } from "@/lib/shop-store";
import ProductCard from "@/components/site/ProductCard";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    try {
      const product = await fetchProduct(params.id);
      if (!product) throw notFound();
      return { product };
    } catch {
      const all = await getAdminProducts();
      const product = all.find((p) => p.id === params.id);
      if (!product) throw notFound();
      return { product };
    }
  },
  notFoundComponent: () =>
  <div className="pt-40 text-center pb-40">
      <p className="text-eyebrow text-gold mb-4">Not Found</p>
      <h1 className="text-display text-5xl">This piece has been retired.</h1>
      <Link to="/shop" className="mt-6 inline-flex btn-ghost-luxe">Return to Boutique</Link>
    </div>,

  component: ProductDetail
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const nav = useNavigate();
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const allProducts = useAdminProducts();
  const [size, setSize] = useState(product.sizes?.[1]);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [page, setPage] = useState(1);

  // Build a 5-thumb gallery so it matches main image height
  const others = allProducts.filter((p) => p.id !== product.id);
  const gallery = useMemo(
    () => [product.image, others[0]?.image, others[1]?.image, others[2]?.image, others[3]?.image].filter(Boolean),
    [product.image, others]
  );
  const wished = inWishlist(product.id);

  // 8 related per page across 3 pages
  const perPage = 8;
  const totalPages = 3;
  const pool = (() => {
    if (others.length === 0) return [];
    const need = perPage * totalPages;
    const out = [...others];
    let i = 0;
    while (out.length < need) {
      const p = others[i % others.length];
      out.push({ ...p, id: `${p.id}-r${Math.floor(i / others.length) + 1}` });
      i++;
    }
    return out.slice(0, need);
  })();
  const pageItems = pool.slice((page - 1) * perPage, page * perPage);

  const buyNow = () => {
    for (let i = 0; i < qty; i++) addToCart(product, size);
    toast.success("Added, taking you to checkout.");
    nav({ to: "/profile" });
  };

  return (
    <div className="pt-28">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6">
        <Link to="/shop" className="text-eyebrow text-muted-foreground hover:text-ink flex items-center gap-2 w-fit">
          <ArrowLeft size={12} /> Back to Boutique
        </Link>
      </div>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-8 lg:gap-12 pb-12 items-start">
        {/* GALLERY (left) */}
        <div className="lg:col-span-7 flex gap-3 lg:gap-4">
          {/* Thumb column locked to main image height */}
          <div className="w-[72px] lg:w-[78px] flex flex-col gap-2 shrink-0">
            {gallery.slice(0, 5).map((g, i) =>
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`relative overflow-hidden flex-1 min-h-0 border-2 transition-all ${
              activeImg === i ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"}`
              }>
              
                <img src={g} alt="" className="absolute inset-0 w-full h-full object-cover" />
                {activeImg === i &&
              <>
                    <span className="absolute top-1 left-1 w-3 h-px bg-gold" />
                    <span className="absolute top-1 left-1 w-px h-3 bg-gold" />
                  </>
              }
              </button>
            )}
          </div>
          {/* Main image */}
          <div className="relative overflow-hidden bg-secondary aspect-square border border-border flex-1">
            <img
              key={activeImg}
              src={gallery[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover animate-fade-in" />
            
            {product.badge &&
            <span className="absolute top-6 left-6 bg-ivory/90 backdrop-blur text-ink text-eyebrow px-4 py-2">
                {product.badge}
              </span>
            }
            <span className="absolute top-3 right-3 w-10 h-px bg-gold" />
            <span className="absolute top-3 right-3 w-px h-10 bg-gold" />
            <span className="absolute bottom-3 left-3 w-10 h-px bg-gold" />
            <span className="absolute bottom-3 left-3 w-px h-10 bg-gold" />
          </div>
        </div>

        {/* INFO (right) — compact, matches gallery height */}
        <div className="lg:col-span-5 flex flex-col">
          <p className="text-eyebrow text-gold mb-2">{product.category}</p>
          <h1 className="text-display text-4xl lg:text-5xl leading-[1.05] mb-2">{product.name}</h1>
          <p className="text-muted-foreground italic mb-3 text-sm">{product.tagline}</p>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) =>
              <Star key={i} size={13} className={i < Math.round(product.rating) ? "fill-gold text-gold" : "text-border"} />
              )}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">{product.reviews} private reviews</span>
          </div>

          <div className="flex items-baseline gap-3 pb-4 mb-4 border-b border-border">
            <p className="text-display text-4xl">${product.price.toLocaleString()}</p>
            {product.oldPrice &&
            <p className="text-muted-foreground line-through text-sm">${product.oldPrice.toLocaleString()}</p>
            }
            {product.oldPrice &&
            <span className="ml-auto text-eyebrow bg-destructive/15 text-destructive px-3 py-1.5">
                Save ${(product.oldPrice - product.price).toLocaleString()}
              </span>
            }
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-4">
            {product.description}
          </p>

          {product.sizes &&
          <div className="mb-4">
              <div className="flex justify-between mb-2">
                <p className="text-eyebrow">Size</p>
                <button className="text-eyebrow text-gold">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) =>
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`min-w-12 h-12 px-4 border text-sm transition-all ${
                size === s ? "bg-ink text-ivory border-ink" : "border-border hover:border-ink"}`
                }>
                
                    {s}
                  </button>
              )}
              </div>
            </div>
          }

          {/* Qty + Add to Bag */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center border border-border h-14">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-full hover:bg-secondary"><Minus size={14} className="mx-auto" /></button>
              <span className="w-10 text-center tabular-nums">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-12 h-full hover:bg-secondary"><Plus size={14} className="mx-auto" /></button>
            </div>
            <button
              onClick={() => {for (let i = 0; i < qty; i++) addToCart(product, size);toast.success("Added to bag");}}
              className="flex-1 btn-luxe btn-luxe-hover justify-center h-14">
              
              <ShoppingBag size={14} /> Add to Bag
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              aria-label="Wishlist"
              className={`w-14 h-14 border flex items-center justify-center transition-all ${
              wished ? "bg-destructive text-ivory border-destructive" : "border-border hover:border-ink"}`
              }>
              
              <Heart size={16} fill={wished ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Buy Now, full width, distinct gold */}
          <button
            onClick={buyNow}
            className="w-full h-14 bg-gold text-ink text-[0.72rem] font-semibold tracking-[0.3em] uppercase hover:bg-ink hover:text-ivory transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_20px_50px_-20px_rgba(201,168,76,0.5)]"
            style={{ fontFamily: "var(--font-sans)" }}>
            
            <Zap size={14} /> Buy Now
          </button>

          <div className="grid grid-cols-3 gap-px bg-border mt-5 border border-border">
            {[
            { Ic: Truck, t: "Complimentary delivery" },
            { Ic: RefreshCcw, t: "30-day returns" },
            { Ic: Award, t: "Lifetime warranty" }].
            map((p) =>
            <div key={p.t} className="bg-ivory p-4 text-center">
                <p.Ic size={16} className="mx-auto text-gold mb-1.5" strokeWidth={1.2} />
                <p className="text-[10px] uppercase tracking-widest">{p.t}</p>
              </div>
            )}
          </div>

          <div className="mt-5">
            <p className="text-eyebrow text-gold mb-2 flex items-center gap-2"><Sparkles size={12} /> Atelier Details</p>
            <ul className="space-y-1">
              {product.details.slice(0, 4).map((d) =>
              <li key={d} className="text-sm flex gap-3 text-muted-foreground">
                  <span className="text-gold">·</span>{d}
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* ====== Related ====== */}
      <section className="bg-secondary/40 py-14">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-eyebrow text-gold mb-3">More from the Maison</p>
              <h2 className="text-display text-4xl md:text-5xl">You may also covet.</h2>
            </div>
            <Link to="/shop" className="text-eyebrow hover:text-gold flex items-center gap-2">View All <ArrowRight size={12} /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {pageItems.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
          {totalPages > 1 &&
          <div className="flex items-center justify-center gap-3 mt-14 pt-8 border-t border-border">
              <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 border border-border flex items-center justify-center disabled:opacity-30 hover:border-gold hover:text-gold transition"
              aria-label="Previous">
              
                <ArrowLeft size={14} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) =>
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 text-eyebrow transition ${
              page === i + 1 ?
              "bg-ink text-ivory border border-ink" :
              "border border-border hover:border-gold hover:text-gold"}`
              }>
              
                  {String(i + 1).padStart(2, "0")}
                </button>
            )}
              <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 border border-border flex items-center justify-center disabled:opacity-30 hover:border-gold hover:text-gold transition"
              aria-label="Next">
              
                <ArrowRight size={14} />
              </button>
            </div>
          }
        </div>
      </section>
    </div>);

}