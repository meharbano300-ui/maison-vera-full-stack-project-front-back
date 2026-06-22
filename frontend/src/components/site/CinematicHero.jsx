import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import bg1 from "@/assets/hero-1.jpg";
import bg2 from "@/assets/hero-2.jpg";
import bg3 from "@/assets/hero-3.jpg";
import bg4 from "@/assets/moment-1.jpg";
import bg5 from "@/assets/moment-2.jpg";











const scenes = [
{
  tag: "Couture Milan Atelier",
  line1: "The Émeraude",
  line2: "silk gown.",
  copy: "Hand draped Italian silk, finished by twelve atelier hands over ninety six hours.",
  cta: { to: "/shop", label: "Shop the Collection" },
  image: bg1,
  accent: "Milan Atelier"
},
{
  tag: "Maroquinerie Paris",
  line1: "Stiletto noir,",
  line2: "soled in gold.",
  copy: "Polished calfskin, hand lasted in Paris, lined with gilded leather and signed by a single artisan.",
  cta: { to: "/shop", label: "Shop the Heels" },
  image: bg2,
  accent: "Paris Workshop"
},
{
  tag: "Haute Horlogerie Genève",
  line1: "Time set in",
  line2: "emeralds and gold.",
  copy: "A self winding chronograph set with eight Colombian emeralds, signed by the Maître of Geneva.",
  cta: { to: "/shop", label: "Shop the Timepiece" },
  image: bg3,
  accent: "Geneva Atelier"
},
{
  tag: "Parfumerie Grasse",
  line1: "A scent named",
  line2: "after silk.",
  copy: "Bergamot, Mongolian cashmere accord and a single drop of Damask rose, composed by a fourth generation nose.",
  cta: { to: "/shop", label: "Shop the Fragrance" },
  image: bg4,
  accent: "Grasse Library"
},
{
  tag: "Maison Vera The Archive",
  line1: "Quiet luxury,",
  line2: "loudly made.",
  copy: "An archive of pieces composed slowly, worn forever, the rarest kind of modern heirloom.",
  cta: { to: "/categories", label: "Explore the House" },
  image: bg5,
  accent: "House Selection"
}];


const DURATION = 6500;

export default function CinematicHero() {
  const [idx, setIdx] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % scenes.length);
      setKey((k) => k + 1);
    }, DURATION);
    return () => clearInterval(t);
  }, []);

  const s = scenes[idx];

  return (
    <section className="relative w-full h-[100svh] min-h-[620px] overflow-hidden bg-ink text-ivory">
      {/* ===== Continuously moving "video" background, crossfading Ken-Burns layers ===== */}
      {scenes.map((scene, i) =>
      <div
        key={i}
        className="absolute inset-0 transition-opacity duration-[1800ms] ease-out"
        style={{ opacity: i === idx ? 1 : 0, zIndex: i === idx ? 1 : 0 }}>
        
          <img
          src={scene.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{
            animation:
            i === idx ?
            `${i % 2 === 0 ? "kenburns-a" : "kenburns-b"} 9s ease-out forwards` :
            "none"
          }} />
        
        </div>
      )}

      {/* cinematic color grade + vignette */}
      <div aria-hidden className="absolute inset-0 z-[2] bg-gradient-to-t from-ink via-ink/35 to-ink/55" />
      <div aria-hidden className="absolute inset-0 z-[2] bg-[radial-gradient(120%_100%_at_50%_0%,transparent_40%,oklch(0.12_0.02_170/0.7)_100%)]" />
      <div
        aria-hidden
        className="absolute inset-0 z-[2]"
        style={{ background: "linear-gradient(100deg, oklch(0.18 0.06 168 / 0.55) 0%, transparent 45%)" }} />
      

      {/* moving light sweep (gives the live, filmed feel) */}
      <div aria-hidden className="absolute inset-0 z-[3] overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 -left-1/3 h-full w-1/3 bg-gradient-to-r from-transparent via-gold/15 to-transparent"
          style={{ animation: "light-sweep 7s ease-in-out infinite" }} />
        
      </div>

      {/* floating gold orbs drifting in bg */}
      <div aria-hidden className="absolute -top-20 right-[12%] z-[3] w-72 h-72 rounded-full bg-gold/10 blur-[100px]" style={{ animation: "drift-orb 12s ease-in-out infinite" }} />
      <div aria-hidden className="absolute bottom-[-10%] left-[8%] z-[3] w-80 h-80 rounded-full bg-emerald/30 blur-[120px]" style={{ animation: "drift-orb 15s ease-in-out infinite reverse" }} />

      {/* animated film grain */}
      <div
        aria-hidden
        className="absolute inset-[-20%] z-[3] opacity-[0.06] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          animation: "grain-shift 1.6s steps(4) infinite"
        }} />
      

      {/* gold corner frame */}
      <span aria-hidden className="absolute top-28 left-6 lg:left-12 z-[5] w-14 h-px bg-gold/70" />
      <span aria-hidden className="absolute top-28 left-6 lg:left-12 z-[5] w-px h-14 bg-gold/70" />
      <span aria-hidden className="absolute bottom-10 right-6 lg:right-12 z-[5] w-14 h-px bg-gold/70" />
      <span aria-hidden className="absolute bottom-10 right-6 lg:right-12 z-[5] w-px h-14 bg-gold/70" />

      {/* Top-right accent badge, empty border with icon */}
      <div className="absolute top-28 right-6 lg:right-12 z-[6] hidden md:flex items-center gap-2 border border-gold/50 bg-transparent px-4 py-2 text-eyebrow text-ivory animate-[fade-in_1200ms_ease_both]" style={{ fontFamily: "var(--font-sans)" }}>
        <Sparkles size={11} className="text-gold" />
        {s.accent}
      </div>

      {/* ===== Foreground text, re-animates on every scene change ===== */}
      <div className="relative z-[6] h-full flex items-center">
        <div key={key} className="max-w-[1600px] w-full mx-auto px-6 lg:px-16">
          <div className="max-w-2xl">
            <p
              className="text-eyebrow text-gold mb-7 flex items-center gap-3 opacity-0"
              style={{ animation: "cine-rise 900ms cubic-bezier(0.2,0.7,0.2,1) 120ms forwards" }}>
              
              {s.tag}
              <Sparkles size={11} className="text-gold" />
            </p>

            <h1
              className="text-display leading-[1.08] tracking-tight text-4xl md:text-6xl xl:text-[4.75rem] pb-2"
              style={{ fontFamily: "var(--font-display)" }}>
              
              <span className="block pb-1">
                <span className="inline-block opacity-0" style={{ animation: "cine-word 950ms cubic-bezier(0.2,0.7,0.2,1) 320ms forwards" }}>
                  {s.line1}
                </span>
              </span>
              <span className="block pb-1">
                <span className="inline-block italic text-gold opacity-0" style={{ animation: "cine-word 950ms cubic-bezier(0.2,0.7,0.2,1) 520ms forwards" }}>
                  {s.line2}
                </span>
              </span>
            </h1>

            <p
              className="text-base md:text-lg text-ivory/80 max-w-lg leading-relaxed mt-7 opacity-0"
              style={{ fontFamily: "var(--font-sans)", animation: "cine-rise 1000ms cubic-bezier(0.2,0.7,0.2,1) 760ms forwards" }}>
              
              {s.copy}
            </p>

            <div
              className="flex flex-wrap items-center gap-4 mt-10 opacity-0"
              style={{ animation: "cine-rise 1000ms cubic-bezier(0.2,0.7,0.2,1) 980ms forwards" }}>
              
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
      </div>

      {/* progress timeline (auto-fills like a video scrubber) */}
      <div className="absolute bottom-10 left-6 lg:left-16 z-[6] flex items-center gap-3">
        {scenes.map((_, i) =>
        <button
          key={i}
          onClick={() => {
            setIdx(i);
            setKey((k) => k + 1);
          }}
          aria-label={`Scene ${i + 1}`}
          className="relative h-[3px] w-12 bg-ivory/25 overflow-hidden">
          
            {i === idx &&
          <span
            key={key}
            className="absolute inset-y-0 left-0 bg-gold"
            style={{ animation: `draw-line ${DURATION}ms linear forwards`, transformOrigin: "left" }} />

          }
            {i < idx && <span className="absolute inset-0 bg-gold/60" />}
          </button>
        )}
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-10 right-6 lg:right-16 z-[6] hidden md:flex flex-col items-center gap-2 text-eyebrow text-ivory/70">
        <span className="[writing-mode:vertical-rl] tracking-[0.3em] text-gold" style={{ fontFamily: "var(--font-display)" }}>Maison Vera</span>
        <span className="h-10 w-px bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>);

}