import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";





















export default function PageHeroSlider({
  slides,
  variant = "split-grid",
  bgImages,
  interval = 6500
}) {
  const [idx, setIdx] = useState(0);
  const [k, setK] = useState(0);

  const go = useCallback((n) => {
    setIdx((n % slides.length + slides.length) % slides.length);
    setK((x) => x + 1);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => go(idx + 1), interval);
    return () => clearInterval(t);
  }, [idx, go, interval, slides.length]);

  const s = slides[idx];

  // tall shell with cinematic ken-burns bg
  const Shell = ({ children, tall = false, xTall = false }) =>
  <section
    className={`relative w-full overflow-hidden text-ivory bg-ink ${
    xTall ? "pt-24 lg:pt-28 pb-14 min-h-[62vh]" : tall ? "pt-24 lg:pt-28 pb-12 min-h-[58vh]" : "pt-24 lg:pt-28 pb-10"}`
    }>
    
      {bgImages &&
    <div aria-hidden className="absolute inset-0 -z-10">
          {bgImages.map((b, i) =>
      <img
        key={i}
        src={b}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1800ms]"
        style={{
          opacity: i === idx % bgImages.length ? 1 : 0,
          animation: i === idx % bgImages.length ? "slow-zoom 9s ease-out forwards" : "none"
        }} />

      )}
        </div>
    }
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,oklch(0.18_0.05_168/0.95)_0%,oklch(0.20_0.07_165/0.85)_50%,oklch(0.14_0.05_170/0.95)_100%)]" />
      <div aria-hidden className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full bg-emerald/30 blur-[140px] animate-float-soft -z-10" />
      <div aria-hidden className="absolute -bottom-40 -right-20 w-[460px] h-[460px] rounded-full bg-gold/15 blur-[160px] animate-float-soft -z-10" style={{ animationDelay: "2s" }} />
      <div aria-hidden className="absolute inset-0 opacity-[0.05] mix-blend-overlay -z-10"
    style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 4px)" }} />
      {children}
    </section>;


  /* ============ SPLIT GRID (legacy) ============ */
  if (variant === "split-grid") {
    return (
      <Shell tall>
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div key={`t-${k}`} className="lg:col-span-7">
              <p className="text-eyebrow text-gold mb-6 flex items-center gap-3 opacity-0 animate-[fade-up_900ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]" style={{ animationDelay: "60ms" }}>
                {s.tag}
              </p>
              <h1 className="text-display text-4xl md:text-5xl lg:text-[4.75rem] leading-[0.95] opacity-0 animate-[fade-up_1100ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]" style={{ animationDelay: "180ms" }}>
                {s.titleTop} <em className="not-italic italic text-gold">{s.titleEm}</em>
                {s.titleBot ? <> {s.titleBot}</> : null}
              </h1>
              {s.copy && <p className="text-base text-ivory/75 max-w-lg leading-relaxed mt-6 opacity-0 animate-[fade-up_1100ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]" style={{ animationDelay: "360ms" }}>{s.copy}</p>}
              {s.cta &&
              <div className="mt-8 opacity-0 animate-[fade-up_1100ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]" style={{ animationDelay: "560ms" }}>
                  <Link to={s.cta.to} className="group inline-flex items-center gap-3 px-7 py-4 bg-gold text-ink text-[0.72rem] font-medium tracking-[0.3em] uppercase hover:bg-ivory transition-all">
                    {s.cta.label}<ArrowRight size={14} />
                  </Link>
                </div>
              }
            </div>
          </div>
          {slides.length > 1 && <Dots count={slides.length} idx={idx} go={go} className="mt-10" />}
        </div>
      </Shell>);

  }

  /* ============ CINEMATIC (About), TALLER, layered diagonals ============ */
  if (variant === "cinematic") {
    return (
      <Shell xTall>
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 h-full">
          <div className="grid lg:grid-cols-12 gap-10 items-center min-h-[72vh]">
            {/* LEFT, diagonal image stack */}
            {bgImages &&
            <div className="lg:col-span-5 relative h-[400px] hidden lg:block">
                <div className="absolute top-0 left-0 w-[48%] h-[62%] overflow-hidden border border-gold/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] animate-float-soft">
                  <img src={bgImages[0]} alt="" className="w-full h-full object-cover" style={{ objectPosition: "center 35%" }} />
                  <div className="absolute inset-0 bg-ink/20" />
                </div>
                <div className="absolute bottom-0 right-0 w-[52%] h-[55%] overflow-hidden border border-gold/40 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] animate-float-soft" style={{ animationDelay: "1.5s" }}>
                  <img src={bgImages[1] ?? bgImages[0]} alt="" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} />
                  <div className="absolute inset-0 bg-ink/20" />
                </div>
                {bgImages[2] &&
              <div className="absolute top-[34%] right-[6%] w-20 h-24 overflow-hidden border border-gold/60 shadow-2xl animate-float-soft" style={{ animationDelay: "2.8s" }}>
                    <img src={bgImages[2]} alt="" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} />
                  </div>
              }
                {/* gold accent corners */}
                <span className="absolute top-0 left-0 w-12 h-px bg-gold" />
                <span className="absolute top-0 left-0 w-px h-12 bg-gold" />
                <span className="absolute bottom-0 right-0 w-12 h-px bg-gold" />
                <span className="absolute bottom-0 right-0 w-px h-12 bg-gold" />
              </div>
            }

            <div key={`c-${k}`} className="lg:col-span-7">
              <p className="text-eyebrow text-gold mb-6 inline-flex items-center gap-3 opacity-0 animate-[fade-up_900ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]" style={{ animationDelay: "60ms" }}>
                {s.tag}
              </p>
              <h1 className="text-display text-4xl md:text-6xl lg:text-[5rem] leading-[0.95] opacity-0 animate-[fade-up_1100ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]" style={{ animationDelay: "180ms" }}>
                {s.titleTop} <em className="not-italic italic text-gold">{s.titleEm}</em>
                {s.titleBot ? <><br />{s.titleBot}</> : null}
              </h1>
              {s.copy && <p className="text-base md:text-lg text-ivory/80 max-w-xl leading-relaxed mt-7 opacity-0 animate-[fade-up_1100ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]" style={{ animationDelay: "360ms" }}>{s.copy}</p>}
              {s.cta &&
              <div className="mt-9 opacity-0 animate-[fade-up_1100ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]" style={{ animationDelay: "540ms" }}>
                  <Link to={s.cta.to} className="group inline-flex items-center gap-3 px-7 py-4 bg-gold text-ink text-[0.72rem] font-medium tracking-[0.3em] uppercase hover:bg-ivory transition-all">
                    {s.cta.label}<ArrowRight size={14} />
                  </Link>
                </div>
              }
              {slides.length > 1 && <Dots count={slides.length} idx={idx} go={go} className="mt-12" />}
            </div>
          </div>
        </div>
      </Shell>);

  }

  /* ============ MINIMAL (Contact), TALLER, full-width with marquee strip ============ */
  if (variant === "minimal") {
    return (
      <Shell xTall>
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-10 items-start pt-8 pb-10">
            <div key={`m-${k}`} className="lg:col-span-7">
              <p className="text-eyebrow text-gold mb-6 flex items-center gap-3 opacity-0 animate-[fade-up_900ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]" style={{ animationDelay: "60ms" }}>
                {s.tag}
              </p>
              <h1 className="text-display text-4xl md:text-6xl lg:text-[5.25rem] leading-[0.95] opacity-0 animate-[fade-up_1100ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]" style={{ animationDelay: "180ms" }}>
                {s.titleTop} <em className="not-italic italic text-gold">{s.titleEm}</em>
                {s.titleBot ? <><br />{s.titleBot}</> : null}
              </h1>
            </div>
            <div key={`mc-${k}`} className="lg:col-span-5 space-y-6 lg:pt-10">
              {s.copy &&
              <p className="text-base md:text-lg text-ivory/80 leading-relaxed border-l-2 border-gold pl-6 opacity-0 animate-[fade-up_1100ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]" style={{ animationDelay: "300ms" }}>
                  {s.copy}
                </p>
              }
              <div className="grid grid-cols-3 gap-4 opacity-0 animate-[fade-up_1100ms_cubic-bezier(0.2,0.7,0.2,1)_forwards]" style={{ animationDelay: "500ms" }}>
                {["Milan", "Geneva", "Paris"].map((c) =>
                <div key={c} className="border border-ivory/15 px-4 py-5 text-center">
                    <Sparkles size={14} className="text-gold mx-auto mb-2" />
                    <p className="text-eyebrow text-ivory">{c}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* horizontal animated thumbnail strip across full width */}
          {bgImages &&
          <div className="mt-10 overflow-hidden marquee-mask">
              <div className="flex gap-4 animate-marquee whitespace-nowrap">
                {[...bgImages, ...bgImages, ...bgImages].map((b, i) =>
              <div key={i} className="relative w-56 h-36 shrink-0 overflow-hidden border border-gold/30">
                    <img src={b} alt="" className="w-full h-full object-cover opacity-95" />
                    <div className="absolute inset-0 bg-ink/30" />
                    <span className="absolute top-2 left-2 w-3 h-px bg-gold" />
                    <span className="absolute top-2 left-2 w-px h-3 bg-gold" />
                  </div>
              )}
              </div>
            </div>
          }

          {slides.length > 1 && <Dots count={slides.length} idx={idx} go={go} className="mt-8" />}
        </div>
      </Shell>);

  }

  /* ============ SPOTLIGHT (Category) ============ */
  if (variant === "spotlight") {
    return (
      <Shell>
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div key={`s-${k}`} className="lg:col-span-7 order-2 lg:order-1">
              <p className="text-eyebrow text-gold mb-5 flex items-center gap-3">{s.tag}</p>
              <h1 className="text-display text-4xl md:text-5xl lg:text-[3.75rem] leading-[0.95]">
                {s.titleTop} <em className="not-italic italic text-gold">{s.titleEm}</em>
                {s.titleBot ? <> {s.titleBot}</> : null}
              </h1>
              {s.copy && <p className="text-base text-ivory/75 max-w-lg leading-relaxed mt-5">{s.copy}</p>}
              <div className="mt-7">
                <Link to={s.cta?.to ?? "/shop"} className="group inline-flex items-center gap-3 px-7 py-4 bg-gold text-ink text-[0.72rem] font-medium tracking-[0.3em] uppercase hover:bg-ivory transition-all">
                  {s.cta?.label ?? "Discover the Atelier"}<ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 relative order-1 lg:order-2 flex items-center justify-center min-h-[300px] lg:min-h-[380px]">
              <span className="absolute top-4 right-4 w-16 h-px bg-gold/70" />
              <span className="absolute top-4 right-4 w-px h-16 bg-gold/70" />
              {/* Decorative gold sparkles */}
              <Sparkles size={14} className="absolute top-10 right-10 text-gold/70 animate-pulse" />
              <Sparkles size={10} className="absolute bottom-12 left-1/3 text-gold/60 animate-pulse" style={{ animationDelay: "1.2s" }} />

              {s.image &&
              <div key={`si-${k}`} className="relative w-full h-full flex items-center justify-center">
                  <span className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-10 bg-gold/30 blur-2xl rounded-full" />
                  <img src={s.image} alt="" className="relative z-10 max-h-[360px] w-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)] animate-float-soft" />
                </div>
              }
            </div>
          </div>
          {slides.length > 1 && <Dots count={slides.length} idx={idx} go={go} className="mt-8" />}
        </div>
      </Shell>);

  }

  /* ============ TYPOGRAPHIC (Categories) ============ */
  return (
    <Shell tall>
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between text-eyebrow text-ivory/60 mb-10">
          <span className="flex items-center gap-3">
            <span className="text-gold">{s.tag}</span>
          </span>
        </div>
        <div key={`y-${k}`} className="text-center">
          <h1 className="text-display text-4xl md:text-6xl lg:text-[6rem] leading-[0.9] tracking-tight">
            {s.titleTop} <em className="not-italic italic text-gold">{s.titleEm}</em>
            {s.titleBot ? <><br />{s.titleBot}</> : null}
          </h1>
          {s.copy && <p className="text-base md:text-lg text-ivory/75 max-w-2xl mx-auto leading-relaxed mt-7">{s.copy}</p>}
        </div>
        {bgImages &&
        <div className="mt-12 overflow-hidden marquee-mask">
            <div className="flex gap-4 animate-marquee whitespace-nowrap">
              {[...bgImages, ...bgImages, ...bgImages].map((b, i) =>
            <div key={i} className="relative w-44 h-28 shrink-0 overflow-hidden border border-gold/20">
                  <img src={b} alt="" className="w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-ink/30" />
                </div>
            )}
            </div>
          </div>
        }
        {slides.length > 1 && <Dots count={slides.length} idx={idx} go={go} className="mt-10" />}
      </div>
    </Shell>);

}

function Dots({ count, idx, go, className = "" }) {
  return (
    <div className={`flex items-center gap-3 pt-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) =>
      <button
        key={i}
        onClick={() => go(i)}
        aria-label={`Slide ${i + 1}`}
        className={`h-px transition-all duration-700 ${i === idx ? "w-16 bg-gold" : "w-8 bg-ivory/25 hover:bg-ivory/50"}`} />

      )}
    </div>);

}