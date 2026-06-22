import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import bg1 from "@/assets/hero-1.jpg";
import bg2 from "@/assets/hero-2.jpg";
import bg3 from "@/assets/hero-3.jpg";
import bg4 from "@/assets/moment-1.jpg";
import bg5 from "@/assets/moment-2.jpg";
import bg6 from "@/assets/moment-3.jpg";












const defaultSlides = [
{
  tag: "Couture Autumn Winter",
  titleTop: "The Émeraude",
  titleEm: "silk gown.",
  copy: "Hand draped Italian silk, finished by twelve atelier hands over ninety six hours in our Milanese house.",
  cta: { to: "/shop", label: "Shop the Collection" },
  accent: "Milan Atelier",
  image: bg1
},
{
  tag: "Maroquinerie Paris",
  titleTop: "Stiletto noir,",
  titleEm: "soled in gold.",
  copy: "Polished calfskin, hand lasted in Paris, lined with gilded leather signed by a single artisan.",
  cta: { to: "/shop", label: "Shop the Heels" },
  accent: "Paris Workshop",
  image: bg2
},
{
  tag: "Haute Horlogerie Genève",
  titleTop: "Time set in",
  titleEm: "emeralds and gold.",
  copy: "A self winding chronograph set with eight Colombian emeralds, signed by the Maître of the Geneva atelier.",
  cta: { to: "/shop", label: "Shop the Timepiece" },
  accent: "Geneva Maison",
  image: bg3
},
{
  tag: "Parfumerie Grasse",
  titleTop: "A scent named",
  titleEm: "after silk.",
  copy: "Bergamot, Mongolian cashmere accord and a single drop of Damask rose, composed by a fourth generation nose.",
  cta: { to: "/shop", label: "Shop the Fragrance" },
  accent: "Grasse Library",
  image: bg4
},
{
  tag: "Maison Vera Archive",
  titleTop: "Quiet luxury,",
  titleEm: "loudly made.",
  copy: "An archive of pieces composed slowly, worn forever, the rarest kind of modern heirloom.",
  cta: { to: "/categories", label: "Explore the House" },
  accent: "The Archive",
  image: bg5
},
{
  tag: "Atelier Sur Mesure",
  titleTop: "Made for one,",
  titleEm: "and only one.",
  copy: "A private commission, measured to your hand and signed to your name, bespoke from the first sketch.",
  cta: { to: "/about", label: "Inside the Maison" },
  accent: "Bespoke",
  image: bg6
}];







export default function HeroSlider({ slides = defaultSlides, compact = false }) {
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const go = useCallback(
    (n) => {
      setIdx((n % slides.length + slides.length) % slides.length);
      setAnimKey((k) => k + 1);
    },
    [slides.length]
  );

  // Auto-rotating cinematic slider, runs on its own
  useEffect(() => {
    const t = setInterval(() => go(idx + 1), 6000);
    return () => clearInterval(t);
  }, [idx, go]);

  const s = slides[idx];

  return (
    <section className="relative w-full overflow-hidden text-ivory pt-20 pb-0 bg-ink">
      <div className={`relative max-w-[1600px] mx-auto grid lg:grid-cols-2 ${compact ? "min-h-[460px] lg:min-h-[520px]" : "min-h-[520px] lg:min-h-[600px]"}`}>


        {/* ============ LEFT, emerald panel with sequential left→right text ============ */}
        <div
          className="relative flex flex-col justify-center px-6 lg:px-16 py-16 lg:py-12 z-10 overflow-hidden bg-ink">
          
          {/* subtle gold glow, footer-matched */}
          <div aria-hidden className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-gold/10 blur-[120px]" />
          <div aria-hidden className="absolute -bottom-32 -right-24 w-[380px] h-[380px] rounded-full bg-gold/10 blur-[140px]" />
          
          {/* gold corner frame */}
          <span aria-hidden className="absolute top-6 left-6 w-10 h-px bg-gold/70" />
          <span aria-hidden className="absolute top-6 left-6 w-px h-10 bg-gold/70" />
          <span aria-hidden className="absolute bottom-6 left-6 w-10 h-px bg-gold/70" />
          <span aria-hidden className="absolute bottom-6 left-6 w-px h-10 bg-gold/70" />

          <div key={`t-${animKey}`} className="relative max-w-xl">
            <p
              className="text-eyebrow text-gold mb-7 flex items-center gap-4 opacity-0 animate-[enter-left_900ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]"
              style={{ animationDelay: "80ms" }}>
              
              {s.tag}
              <Sparkles size={11} className="text-gold" />
            </p>

            {/* 1) heading first */}
            <h1
              className="text-display text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem] leading-[0.98] tracking-tight opacity-0 animate-[enter-left_1000ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]"
              style={{ animationDelay: "320ms", fontFamily: "var(--font-display)" }}>
              
              {s.titleTop}<br />
              <span className="italic text-gold">{s.titleEm}</span>
              {s.titleBot ? <><br />{s.titleBot}</> : null}
            </h1>

            {/* 2) text second */}
            <p
              className="text-base md:text-lg text-ivory/80 max-w-lg leading-relaxed mt-7 opacity-0 animate-[enter-left_1000ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]"
              style={{ animationDelay: "640ms", fontFamily: "var(--font-sans)" }}>
              
              {s.copy}
            </p>

            {/* 3) button last */}
            <div
              className="flex flex-wrap items-center gap-4 mt-10 opacity-0 animate-[enter-left_1000ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]"
              style={{ animationDelay: "940ms" }}>
              
              <Link
                to={s.cta.to}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-ink text-[0.72rem] font-medium tracking-[0.3em] uppercase hover:bg-ivory transition-all duration-500 shadow-[0_20px_60px_-20px_rgba(201,168,76,0.55)]"
                style={{ fontFamily: "var(--font-sans)" }}>
                
                {s.cta.label}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ============ RIGHT, cinematic auto-changing image slider ============ */}
        <div className="relative min-h-[340px] lg:min-h-full overflow-hidden">
          {slides.map((slide, i) =>
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1600ms] ease-out"
            style={{ opacity: i === idx ? 1 : 0 }}>
            
              <img
              src={slide.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ animation: i === idx ? "slow-zoom 6.5s ease-out forwards" : "none" }} />
            
            </div>
          )}

          {/* feather edge into left panel */}
          <div aria-hidden className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-ink to-transparent pointer-events-none lg:block hidden" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent pointer-events-none" />

          {/* gold corner frame on right side */}
          <span aria-hidden className="absolute top-6 right-6 w-12 h-px bg-gold/80 z-10" />
          <span aria-hidden className="absolute top-6 right-6 w-px h-12 bg-gold/80 z-10" />
          <span aria-hidden className="absolute bottom-6 right-6 w-12 h-px bg-gold/80 z-10" />
          <span aria-hidden className="absolute bottom-6 right-6 w-px h-12 bg-gold/80 z-10" />

          {/* floating decorative rings, animate above the image */}
          <svg aria-hidden className="absolute top-12 left-12 w-28 h-28 text-gold/30 animate-float-soft z-10" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>

          {/* floating accent badge */}
          <div className="absolute top-10 right-10 hidden md:flex items-center gap-2 bg-ink/40 backdrop-blur-md border border-gold/30 px-4 py-2 text-eyebrow text-ivory z-10 animate-[fade-in_1200ms_ease_both]">
            <Sparkles size={11} className="text-gold" />
            {s.accent ?? "Maison Vera"}
          </div>

          {/* minimal slide progress (no gray bar) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {slides.map((_, i) =>
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
              i === idx ? "w-8 bg-gold" : "w-1.5 bg-ivory/50 hover:bg-ivory"}`
              } />

            )}
          </div>
        </div>
      </div>
    </section>);

}