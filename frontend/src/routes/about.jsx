import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Gem, Globe2, Scissors, Sparkles } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import story from "@/assets/story.jpg";
import h1 from "@/assets/hero-1.jpg";
import h2 from "@/assets/hero-2.jpg";
import h3 from "@/assets/hero-3.jpg";
import m1 from "@/assets/moment-1.jpg";
import m2 from "@/assets/moment-2.jpg";
import m3 from "@/assets/moment-3.jpg";
import PageHeroSlider from "@/components/site/PageHeroSlider";
import ProductCard from "@/components/site/ProductCard";
import { useAdminProducts } from "@/lib/admin-store";

export const Route = createFileRoute("/about")({
  component: About
});

function About() {
  const products = useAdminProducts();
  const highlights = products.slice(0, 4);

  return (
    <div>
      <PageHeroSlider
        variant="cinematic"
        bgImages={[h1, h2, h3, aboutHero, story]}
        slides={[
        { tag: "The Maison Since 1908", titleTop: "A century of", titleEm: "slow", titleBot: "composition.", copy: "Five generations of atelier hands in Milan, Geneva and Paris. Every stitch is signed by the master who drew it.", cta: { to: "/shop", label: "Discover the House" } },
        { tag: "Haute Joaillerie Genève", titleTop: "Set under", titleEm: "candlelight.", copy: "Geneva masters river set every diamond by hand. One of one pieces, restored for generations." },
        { tag: "Maroquinerie Paris", titleTop: "Quiet leather,", titleEm: "loud silence.", copy: "A single Parisian artisan signs every bag. Lifetime restored, never replaced." }]
        } />
      

      {/* === STORY with image === */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-14 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 relative">
          <div className="relative overflow-hidden border border-border aspect-[4/5]">
            <img src={story} alt="Our story" className="w-full h-full object-cover" />
          </div>
          <span className="absolute -top-3 -left-3 w-16 h-px bg-gold" />
          <span className="absolute -top-3 -left-3 w-px h-16 bg-gold" />
          <span className="absolute -bottom-3 -right-3 w-16 h-px bg-gold" />
          <span className="absolute -bottom-3 -right-3 w-px h-16 bg-gold" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-gold/40 bg-ivory/95 backdrop-blur p-5 flex flex-col items-center justify-center text-center shadow-xl">
            <p className="text-display text-4xl text-gold">117</p>
            <p className="text-[0.6rem] tracking-[0.25em] uppercase text-muted-foreground mt-1">Years of craft</p>
          </div>
        </div>
        <div className="lg:col-span-7 space-y-6">
          <p className="text-eyebrow text-gold">Founded 1908</p>
          <h2 className="text-display text-5xl lg:text-6xl leading-tight">In Milan, by candlelight.</h2>
          <p className="text-muted-foreground leading-relaxed">Maison Vera was born inside a single room in Milan, where Sofia Vera draped Italian silk by candlelight. Her first client was an opera singer who wanted a gown that could be heard, not only seen. The result hung in folds so quiet it changed the way she walked on stage.</p>
          <p className="text-muted-foreground leading-relaxed">Five generations later, that intention has not changed. Every gown, every jewel and every leather object is still measured by hand. Slowly, intentionally, irreplaceably.</p>
          <p className="text-display text-2xl italic text-gold">We do not produce. We compose.</p>
          <div className="pt-4 flex gap-3">
            <Link to="/shop" className="btn-luxe btn-luxe-hover">Visit the Boutique <ArrowRight size={12} /></Link>
            <Link to="/categories" className="btn-ghost-luxe">Categories</Link>
          </div>
        </div>
      </section>

      {/* === Pillars === */}
      <section className="bg-ink text-ivory py-14">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <p className="text-eyebrow text-gold mb-4 text-center">Our promise</p>
          <h2 className="text-display text-5xl md:text-6xl text-center mb-14">Three pillars, one signature.</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {[
            { Ic: Scissors, t: "Couture hand finish", d: "Hand stitched, hand set, hand pressed in our European ateliers, every seam signed by the master who drew it.", img: m1 },
            { Ic: Gem, t: "Rare materials", d: "Italian silk, Mongolian cashmere, Geneva set diamonds. We refuse anything that is not the rarest of its kind.", img: m2 },
            { Ic: Award, t: "Lifetime craftsmanship", d: "Repaired, restored, reloved for generations. Every Maison Vera piece carries a lifetime promise.", img: m3 }].
            map((p) =>
            <div key={p.t} className="border border-ivory/15 bg-ink/40 overflow-hidden group hover:border-gold/60 transition-all duration-500">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.img} alt={p.t} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1400ms]" />
                </div>
                <div className="p-8">
                  <p.Ic size={26} className="text-gold mb-5" strokeWidth={1.2} />
                  <h3 className="text-display text-3xl mb-3">{p.t}</h3>
                  <p className="text-sm text-ivory/70 leading-relaxed">{p.d}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* === Ateliers === */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-14">
        <p className="text-eyebrow text-gold mb-4">Our ateliers</p>
        <h2 className="text-display text-5xl md:text-6xl mb-12 max-w-2xl">Three cities, one signature.</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
          { c: "Milan", role: "Couture and silk", img: h1, since: "Since 1908" },
          { c: "Geneva", role: "High jewelry and horology", img: h2, since: "Since 1932" },
          { c: "Florence", role: "Maroquinerie and cashmere", img: h3, since: "Since 1958" }].
          map((a) =>
          <figure key={a.c} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary border border-border">
                <img src={a.img} alt={a.c} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1400ms]" />
                <div className="absolute top-3 left-3 bg-ivory/95 backdrop-blur text-ink text-eyebrow px-3 py-1.5">{a.since}</div>
              </div>
              <figcaption className="mt-5">
                <p className="text-display text-3xl">{a.c}</p>
                <p className="text-eyebrow text-muted-foreground mt-1">{a.role}</p>
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      {/* === Similar / signature products === */}
      <section className="bg-secondary/40 py-14">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-eyebrow text-gold mb-3 flex items-center gap-2"><Sparkles size={12} /> Signatures of the house</p>
              <h2 className="text-display text-5xl md:text-6xl">Pieces that built the Maison.</h2>
            </div>
            <Link to="/shop" className="text-eyebrow hover:text-gold flex items-center gap-2">View All <ArrowRight size={12} /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {highlights.map((p, i) =>
            <ProductCard key={p.id} product={p} index={i} />
            )}
          </div>
        </div>
      </section>

      {/* === Call to action — light, framed, distinct from footer === */}
      <section className="bg-ivory py-16">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
          <div className="relative bg-white border border-border px-8 md:px-16 py-14 md:py-16 text-center shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]">
            {/* gold corner accents */}
            <span className="absolute top-0 left-0 w-12 h-px bg-gold" />
            <span className="absolute top-0 left-0 w-px h-12 bg-gold" />
            <span className="absolute top-0 right-0 w-12 h-px bg-gold" />
            <span className="absolute top-0 right-0 w-px h-12 bg-gold" />
            <span className="absolute bottom-0 left-0 w-12 h-px bg-gold" />
            <span className="absolute bottom-0 left-0 w-px h-12 bg-gold" />
            <span className="absolute bottom-0 right-0 w-12 h-px bg-gold" />
            <span className="absolute bottom-0 right-0 w-px h-12 bg-gold" />

            <p className="text-eyebrow text-gold mb-5 inline-flex items-center gap-3">
              Maison Vera <span className="h-px w-10 bg-gold" />
            </p>
            <Globe2 size={40} className="text-gold mx-auto mb-6" strokeWidth={1} />
            <h2 className="text-display text-5xl md:text-6xl mb-6 text-ink">A house, not a brand.</h2>
            <div className="w-16 h-px bg-gold mx-auto mb-6" />
            <p className="text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              We do not chase seasons. We restore them. Every Maison Vera piece carries a signed certificate, a lifetime atelier promise and a quiet invitation to slow down.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10 text-left">
              {[
              { Ic: Award, t: "Signed certificate" },
              { Ic: Scissors, t: "Lifetime atelier care" },
              { Ic: Sparkles, t: "One of one composition" }].
              map((f) =>
              <div key={f.t} className="flex items-center gap-3 border border-border/70 px-4 py-3 bg-ivory">
                  <f.Ic size={16} className="text-gold shrink-0" strokeWidth={1.4} />
                  <p className="text-eyebrow text-ink text-[0.65rem]">{f.t}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/categories" className="inline-flex items-center gap-3 px-7 py-4 bg-ink text-ivory text-[0.72rem] font-medium tracking-[0.3em] uppercase hover:bg-gold hover:text-ink transition-all">
                Discover Categories <ArrowRight size={14} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-3 px-7 py-4 border border-ink/40 text-ink text-[0.72rem] font-medium tracking-[0.3em] uppercase hover:border-gold hover:text-gold transition-all">
                Contact Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>);

}