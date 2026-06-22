import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock, Sparkles, Send, User, MessageSquare, FileText, ArrowRight, ArrowLeft, ArrowUpRight, Compass } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { submitContactMessage } from "@/lib/api/cmsApi";
import h1 from "@/assets/hero-1.jpg";
import h2 from "@/assets/hero-2.jpg";
import h3 from "@/assets/hero-3.jpg";
import m1 from "@/assets/moment-1.jpg";
import m2 from "@/assets/moment-2.jpg";
import m3 from "@/assets/moment-3.jpg";
import about from "@/assets/about-hero.jpg";
import story from "@/assets/story.jpg";
import { boutiques } from "./boutique.$slug";

export const Route = createFileRoute("/contact")({
  component: Contact
});

const extraMaison = [
{ img: m1, label: "Atelier Florence" },
{ img: m2, label: "Salon Vienna" },
{ img: m3, label: "Showroom Madrid" },
{ img: story, label: "Workshop Lyon" },
{ img: about, label: "Salon Munich" },
{ img: h1, label: "Boutique Seoul" },
{ img: h2, label: "Boutique Shanghai" },
{ img: h3, label: "Boutique Singapore" }];


function Contact() {
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const allBoutiques = boutiques;
  const totalPages = 3;
  const baseCombined = [
  ...allBoutiques.map((b) => ({ slug: b.slug, img: b.hero, label: b.city, address: b.address })),
  ...extraMaison.map((e) => ({ img: e.img, label: e.label }))];

  const combined = (() => {
    const need = perPage * totalPages;
    const out = [...baseCombined];
    let i = 0;
    while (out.length < need) {
      out.push({ ...baseCombined[i % baseCombined.length] });
      i++;
    }
    return out.slice(0, need);
  })();
  const pageItems = combined.slice((page - 1) * perPage, page * perPage);
  const topItems = pageItems.slice(0, 4);
  const bottomItems = pageItems.slice(4, 8);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    const form = e.target;
    const fd = new FormData(form);
    try {
      await submitContactMessage({
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        subject: String(fd.get("subject") || "General enquiry"),
        message: String(fd.get("message") || "")
      });
      toast.success("Your message has reached the atelier. We will write back shortly.");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <ConciergeDossier />


      {/* ============ FORM SECTION, equal heights, left form, right styled image ============ */}
      <section id="concierge-form" className="max-w-[1400px] mx-auto px-6 lg:px-12 py-14">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* LEFT, Form */}
          <div className="bg-ivory border border-border p-8 lg:p-12 flex flex-col h-full relative">
            <span aria-hidden className="absolute top-4 left-4 w-12 h-px bg-gold" />
            <span aria-hidden className="absolute top-4 left-4 w-px h-12 bg-gold" />
            <span aria-hidden className="absolute bottom-4 right-4 w-12 h-px bg-gold" />
            <span aria-hidden className="absolute bottom-4 right-4 w-px h-12 bg-gold" />

            <p className="text-eyebrow text-gold mb-4 flex items-center gap-3"><Sparkles size={12} /> Write to us</p>
            <h2 className="text-display text-4xl lg:text-5xl mb-3">A note to the atelier.</h2>
            <p className="text-muted-foreground mb-8">Our private concierge answers within one working day, in five languages.</p>

            <form onSubmit={onSubmit} className="flex-1 flex flex-col gap-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-eyebrow text-muted-foreground mb-2 flex items-center gap-2"><User size={11} /> Name</label>
                  <input name="name" required placeholder="Jane Doe" className="w-full bg-background border border-border focus:border-gold px-4 py-3 outline-none transition-colors text-sm" />
                </div>
                <div>
                  <label className="text-eyebrow text-muted-foreground mb-2 flex items-center gap-2"><Mail size={11} /> Email</label>
                  <input name="email" type="email" required placeholder="jane@example.com" className="w-full bg-background border border-border focus:border-gold px-4 py-3 outline-none transition-colors text-sm" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-eyebrow text-muted-foreground mb-2 flex items-center gap-2"><Phone size={11} /> Phone</label>
                  <input name="phone" type="tel" placeholder="+39 02 0000 000" className="w-full bg-background border border-border focus:border-gold px-4 py-3 outline-none transition-colors text-sm" />
                </div>
                <div>
                  <label className="text-eyebrow text-muted-foreground mb-2 flex items-center gap-2"><FileText size={11} /> Subject</label>
                  <select name="subject" className="w-full bg-background border border-border focus:border-gold px-4 py-3 outline-none transition-colors text-sm">
                    <option>Private appointment</option>
                    <option>Bespoke order</option>
                    <option>Concierge enquiry</option>
                    <option>Press</option>
                  </select>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-eyebrow text-muted-foreground mb-2 flex items-center gap-2"><MessageSquare size={11} /> Message</label>
                <textarea name="message" required rows={6} placeholder="Tell us how we may help…" className="w-full flex-1 bg-background border border-border focus:border-gold px-4 py-3 outline-none transition-colors resize-none text-sm min-h-[140px]" />
              </div>
              <div className="flex items-center justify-between gap-4 pt-2">
                <p className="text-[0.65rem] text-muted-foreground">By writing to us you accept our privacy promise.</p>
                <button disabled={sending} className="btn-luxe btn-luxe-hover">
                  <Send size={12} /> {sending ? "Sending" : "Send to the Maison"}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT, Image + info, equal height */}
          <div className="flex flex-col gap-6 h-full">
            {/* Styled image with frame + corners */}
            <div className="relative flex-1 min-h-[300px] border border-border overflow-hidden group">
              <img src={h1} alt="Maison Vera Boutique" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1600ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              {/* gold frame corners */}
              <span aria-hidden className="absolute top-4 right-4 w-12 h-px bg-gold" />
              <span aria-hidden className="absolute top-4 right-4 w-px h-12 bg-gold" />
              <span aria-hidden className="absolute bottom-4 left-4 w-12 h-px bg-gold" />
              <span aria-hidden className="absolute bottom-4 left-4 w-px h-12 bg-gold" />
              {/* floating tag */}
              <div className="absolute top-6 left-6 inline-flex items-center gap-2 bg-ivory/90 backdrop-blur text-ink text-eyebrow px-4 py-2">
                <Sparkles size={11} className="text-gold" /> Milan Atelier
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-eyebrow text-gold mb-2">Visit us</p>
                <p className="text-display text-3xl text-ivory">Via Monte Napoleone 12</p>
              </div>
            </div>
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
              { Ic: MapPin, t: "Atelier Milano", d: "Via Monte Napoleone 12, Milan" },
              { Ic: Phone, t: "Concierge", d: "+39 02 7600 1908" },
              { Ic: Mail, t: "Email", d: "concierge@maisonvera.com" },
              { Ic: Clock, t: "Hours", d: "Mon to Sat 10 to 19" }].
              map((i) =>
              <div key={i.t} className="border border-border bg-ivory p-5">
                  <i.Ic size={18} className="text-gold mb-3" strokeWidth={1.4} />
                  <p className="text-display text-lg">{i.t}</p>
                  <p className="text-xs text-muted-foreground mt-1">{i.d}</p>
                </div>
              )}
            </div>
            {/* Empty styled accent block */}
            <div className="border border-dashed border-gold/50 bg-gradient-to-br from-emerald/5 to-gold/5 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center">
                <Sparkles size={18} className="text-gold" />
              </div>
              <div>
                <p className="text-display text-xl">Bespoke Concierge</p>
                <p className="text-xs text-muted-foreground mt-1">Reach a master directly response under 1 working day.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ VISIT THE MAISON, 4 + 4 clickable, with pagination ============ */}
      <section className="bg-ink text-ivory py-14">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <p className="text-eyebrow text-gold mb-4 text-center">Our boutiques</p>
          <h2 className="text-display text-5xl md:text-6xl text-center mb-14">Visit the Maison.</h2>

          {/* Row 1, 4 images */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-6 lg:mb-8">
            {topItems.map((b, i) =>
            <BoutiqueCard key={`t-${page}-${i}`} item={b} index={i} />
            )}
          </div>
          {/* Row 2, 4 images */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {bottomItems.map((b, i) =>
            <BoutiqueCard key={`b-${page}-${i}`} item={b} index={i + 4} />
            )}
          </div>

          {/* Pagination, sits before footer */}
          {totalPages > 1 &&
          <div className="flex items-center justify-center gap-3 mt-14 pt-8 border-t border-ivory/15">
              <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 border border-ivory/30 flex items-center justify-center disabled:opacity-30 hover:border-gold hover:text-gold transition"
              aria-label="Previous">
              
                <ArrowLeft size={14} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) =>
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 text-eyebrow transition ${
              page === i + 1 ?
              "bg-gold text-ink border border-gold" :
              "border border-ivory/30 hover:border-gold hover:text-gold"}`
              }>
              
                  {String(i + 1).padStart(2, "0")}
                </button>
            )}
              <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 border border-ivory/30 flex items-center justify-center disabled:opacity-30 hover:border-gold hover:text-gold transition"
              aria-label="Next">
              
                <ArrowRight size={14} />
              </button>
            </div>
          }
        </div>
      </section>
    </div>);

}

function BoutiqueCard({
  item,
  index



}) {
  const inner =
  <figure className="group relative overflow-hidden bg-ivory/5 border border-ivory/10 hover:border-gold/60 transition-all duration-500">
      <div className="aspect-[4/5] overflow-hidden">
        <img src={item.img} alt={item.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1600ms]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-90 group-hover:opacity-100 transition" />
      <span className="absolute top-3 left-3 w-6 h-px bg-gold opacity-0 group-hover:opacity-100 transition" />
      <span className="absolute top-3 left-3 w-px h-6 bg-gold opacity-0 group-hover:opacity-100 transition" />
      <figcaption className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-eyebrow text-gold mb-1">{String(index + 1).padStart(2, "0")} Salon</p>
        <p className="text-display text-2xl text-ivory">{item.label}</p>
        {item.address && <p className="text-xs text-ivory/70 mt-1 line-clamp-1">{item.address}</p>}
        {item.slug &&
      <span className="mt-3 inline-flex items-center gap-2 text-eyebrow text-ivory translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            View detail <ArrowRight size={12} />
          </span>
      }
      </figcaption>
    </figure>;


  if (item.slug) {
    return (
      <Link to="/boutique/$slug" params={{ slug: item.slug }} className="block">
        {inner}
      </Link>);

  }
  return inner;
}

/* ============================================================
   CONCIERGE DOSSIER — bespoke editorial slider, contact page only
   Asymmetric typographic layout: oversized slide number, tall
   portrait card with parallax zoom, layered city compass, vertical
   progress rail, and a gold telegram ticker.
   ============================================================ */
















const dossier = [
{
  index: "01",
  city: "Milano",
  country: "Italia",
  tag: "Concierge No. 01 · Atelier Milano",
  titleTop: "A private",
  titleEm: "word.",
  titleBot: "Under the velvet door.",
  copy: "Write us a single line, in any of five languages. A concierge of the Milanese house replies by hand, within one working day, on Maison Vera headed paper.",
  signature: "Camille Léonard",
  hours: "Open · 10 — 19 CET",
  hero: h1,
  thumbs: [m1, h2, story]
},
{
  index: "02",
  city: "Genève",
  country: "Suisse",
  tag: "Concierge No. 02 · Salon Genève",
  titleTop: "Candlelit",
  titleEm: "viewing.",
  titleBot: "By appointment.",
  copy: "Reserve a quiet hour inside the Geneva watch salon. We dim the lights, pour the champagne, and present pieces never shown in the boutique.",
  signature: "Anatole Reverdin",
  hours: "By appointment only",
  hero: h3,
  thumbs: [m2, about, h1]
},
{
  index: "03",
  city: "Paris",
  country: "France",
  tag: "Concierge No. 03 · Maroquinerie Paris",
  titleTop: "Bespoke",
  titleEm: "commissions.",
  titleBot: "Begun with care.",
  copy: "From a single stitch to a complete trousseau. Send word, and a master artisan in the rue Cambon workshop will write back with sketches.",
  signature: "Hélène Marceau",
  hours: "Tue — Sat · 11 — 19 CET",
  hero: h2,
  thumbs: [m3, story, h3]
}];


function ConciergeDossier() {
  const [idx, setIdx] = useState(0);
  const [k, setK] = useState(0);
  const s = dossier[idx];
  const DURATION = 7200;

  const go = (n) => {
    setIdx((n % dossier.length + dossier.length) % dossier.length);
    setK((x) => x + 1);
  };

  useEffect(() => {
    const t = setInterval(() => go(idx + 1), DURATION);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  return (
    <section className="relative w-full bg-ink text-ivory overflow-hidden pt-14 lg:pt-18">
      {/* Ambient field, matched to footer */}
      <div aria-hidden className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-gold/10 blur-[160px] animate-float-soft" />
      <div aria-hidden className="absolute -bottom-44 -right-24 w-[480px] h-[480px] rounded-full bg-gold/10 blur-[180px] animate-float-soft" style={{ animationDelay: "2.5s" }} />
      
      <div aria-hidden className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
      style={{ backgroundImage: "repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 4px)" }} />


      {/* Top atelier ribbon removed per request */}

      <div className="relative max-w-[1500px] mx-auto px-6 lg:px-12 pt-6 pb-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT — Tall portrait card with parallax + city stamp + thumbs */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] overflow-hidden border border-gold/40 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85)]">
              {dossier.map((d, i) =>
              <img
                key={i}
                src={d.hero}
                alt={d.city}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1600ms]"
                style={{
                  opacity: i === idx ? 1 : 0,
                  animation: i === idx ? "slow-zoom 9s ease-out forwards" : "none"
                }} />

              )}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-ink/40" />

              {/* gold corner frame */}
              <span className="absolute top-4 left-4 w-14 h-px bg-gold" />
              <span className="absolute top-4 left-4 w-px h-14 bg-gold" />
              <span className="absolute bottom-4 right-4 w-14 h-px bg-gold" />
              <span className="absolute bottom-4 right-4 w-px h-14 bg-gold" />

              {/* vertical city stamp */}
              <div key={`v-${k}`} className="absolute top-6 right-6 flex flex-col items-center gap-3 opacity-0 animate-[fade-up_900ms_ease_forwards]">
                <span className="text-eyebrow text-gold">{s.country}</span>
                <span className="h-12 w-px bg-gold/60" />
                <span className="text-display text-xl text-ivory [writing-mode:vertical-rl] tracking-[0.4em]">{s.city}</span>
              </div>

              {/* bottom signature plate */}
              <div key={`p-${k}`} className="absolute bottom-6 left-6 right-20 opacity-0 animate-[fade-up_1100ms_ease_220ms_forwards]">
                <p className="text-eyebrow text-gold mb-2 flex items-center gap-2">
                  <span className="h-px w-8 bg-gold" /> Signed by hand
                </p>
                <p className="text-display text-2xl text-ivory italic">{s.signature}</p>
              </div>
            </div>

          </div>

          {/* RIGHT — Editorial copy stack */}
          <div className="lg:col-span-7 relative pl-0 lg:pl-6">

            <div key={`x-${k}`} className="relative">
              <h1 className="text-display text-3xl md:text-4xl lg:text-[3.5rem] xl:text-[4rem] leading-[1.02] opacity-0 animate-[fade-up_1100ms_ease_180ms_forwards]">
                {s.titleTop} <em className="not-italic italic text-gold">{s.titleEm}</em><br />{s.titleBot}
              </h1>

              <p className="text-base md:text-lg text-ivory/80 max-w-xl leading-relaxed mt-8 border-l-2 border-gold pl-6 opacity-0 animate-[fade-up_1100ms_ease_360ms_forwards]">
                {s.copy}
              </p>

              {/* mini city compass */}
              <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl opacity-0 animate-[fade-up_1100ms_ease_500ms_forwards]">
                {dossier.map((d, i) =>
                <button
                  key={d.index}
                  onClick={() => go(i)}
                  className={`group relative border ${i === idx ? "border-gold bg-gold/10" : "border-ivory/15 hover:border-gold/60"} px-4 py-4 text-left transition-all`}>
                  
                    <span className="text-eyebrow text-gold/80">{d.index}</span>
                    <p className="text-display text-lg text-ivory mt-1 flex items-center gap-2">
                      {d.city}
                      <Compass size={12} className={`${i === idx ? "text-gold" : "text-ivory/40 group-hover:text-gold"} transition`} />
                    </p>
                    <p className="text-[0.6rem] tracking-[0.25em] uppercase text-ivory/45 mt-1">{d.country}</p>
                  </button>
                )}
              </div>

              {/* actions */}
              <div className="mt-10 flex flex-wrap items-center gap-4 opacity-0 animate-[fade-up_1100ms_ease_640ms_forwards]">
                <a href="#concierge-form" className="group inline-flex items-center gap-3 px-7 py-4 bg-gold text-ink text-[0.72rem] font-medium tracking-[0.3em] uppercase hover:bg-ivory transition-all">
                  Write to the Maison <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  onClick={() => go(idx - 1)}
                  aria-label="Previous"
                  className="w-11 h-11 border border-ivory/30 hover:border-gold hover:text-gold flex items-center justify-center transition">
                  
                  <ArrowLeft size={14} />
                </button>
                <button
                  onClick={() => go(idx + 1)}
                  aria-label="Next"
                  className="w-11 h-11 border border-ivory/30 hover:border-gold hover:text-gold flex items-center justify-center transition">
                  
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>);

}