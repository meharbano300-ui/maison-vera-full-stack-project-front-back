import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { categoryList } from "@/lib/products";
import { useAdminProducts } from "@/lib/admin-store";
import PageHeroSlider from "@/components/site/PageHeroSlider";
import bg1 from "@/assets/hero-1.jpg";
import bg2 from "@/assets/hero-2.jpg";
import bg3 from "@/assets/hero-3.jpg";
import bg4 from "@/assets/moment-1.jpg";
import bg5 from "@/assets/moment-2.jpg";
import bg6 from "@/assets/moment-3.jpg";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage
});

function CategoriesPage() {
  const products = useAdminProducts();
  return (
    <div>
      <PageHeroSlider
        variant="typographic"
        bgImages={[bg1, bg2, bg3, bg4, bg5, bg6]}
        slides={[
        { tag: "Maisons within the House", titleTop: "Eight worlds,", titleEm: "one signature.", copy: "Couture, joaillerie, leather, watches, fragrance, shoes, outerwear. Each its own atelier, each its own master." },
        { tag: "Haute Joaillerie Genève", titleTop: "Set under", titleEm: "candlelight.", copy: "River set diamonds and emeralds. One of one, by the Maître of the Geneva workshop." },
        { tag: "Maroquinerie Paris", titleTop: "Quiet leather,", titleEm: "loud silence.", copy: "Hand stitched in the Paris workshop. Restored, never replaced." },
        { tag: "Parfumerie Grasse", titleTop: "A scent named", titleEm: "after silk.", copy: "Composed by a fourth generation nose in the hills above Grasse." }]
        } />
      

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 pb-24">
        <div className="mb-10">
          <p className="text-eyebrow text-gold mb-2" style={{ fontFamily: "var(--font-sans)" }}>{categoryList.length} ateliers</p>
          <h2 className="text-display text-4xl" style={{ fontFamily: "var(--font-display)" }}>All Maisons of the House</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {categoryList.map((c, i) => {
            const count = products.filter((p) => p.category === c.name).length;
            return (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group relative block overflow-hidden bg-secondary animate-flip-in"
                style={{ animationDelay: `${i * 70}ms` }}>
                
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-110" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />

                  {/* Corner accent */}
                  <span className="absolute top-0 right-0 w-8 h-px bg-gold transition-all duration-500 group-hover:w-14" />
                  <span className="absolute top-0 right-0 w-px h-8 bg-gold transition-all duration-500 group-hover:h-14" />

                  {/* Index number */}
                  <span
                    className="absolute top-4 left-4 text-eyebrow text-gold/70 text-[0.6rem] tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-sans)" }}>
                    
                    0{i + 1}
                  </span>

                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-ivory">
                    <p className="text-eyebrow text-gold text-[0.6rem] tracking-[0.2em] mb-2" style={{ fontFamily: "var(--font-sans)" }}>{count} pieces</p>
                    <h2 className="text-display text-3xl lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>{c.name}</h2>
                    <p className="text-xs text-ivory/65 mt-2 max-w-xs" style={{ fontFamily: "var(--font-sans)" }}>{c.tagline}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-eyebrow text-gold text-[0.65rem] tracking-[0.15em] translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500" style={{ fontFamily: "var(--font-sans)" }}>
                      Enter the atelier <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </Link>);

          })}
        </div>
      </section>
    </div>);

}