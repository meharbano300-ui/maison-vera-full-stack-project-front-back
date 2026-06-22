import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Phone, Clock, Sparkles } from "lucide-react";
import h1 from "@/assets/hero-1.jpg";
import h2 from "@/assets/hero-2.jpg";
import h3 from "@/assets/hero-3.jpg";
import m1 from "@/assets/moment-1.jpg";
import m2 from "@/assets/moment-2.jpg";
import m3 from "@/assets/moment-3.jpg";
import story from "@/assets/story.jpg";
import about from "@/assets/about-hero.jpg";












const boutiques = [
{
  slug: "milan",
  city: "Milan",
  address: "Via Monte Napoleone 12, 20121 Milan",
  phone: "+39 02 7600 1908",
  hours: "Monday to Saturday, 10 to 19",
  description: "Our founding house, opened in 1908 by Sofia Vera. Four candlelit salons of couture silk and high jewelry, finished by master tailors who still work by hand.",
  hero: h1,
  gallery: [h1, h2, m1, m2]
},
{
  slug: "geneva",
  city: "Geneva",
  address: "Rue du Rhône 64, 1204 Geneva",
  phone: "+41 22 318 0064",
  hours: "Monday to Saturday, 10 to 18",
  description: "Two floors of Haute Joaillerie and Horlogerie overlooking Lake Geneva. Every diamond is set by hand, every tourbillon regulated by a master.",
  hero: h2,
  gallery: [h2, h3, m2, m3]
},
{
  slug: "paris",
  city: "Paris",
  address: "Avenue Montaigne 28, 75008 Paris",
  phone: "+33 1 47 23 1908",
  hours: "Monday to Saturday, 10 to 19",
  description: "Maroquinerie and ready-to-wear in a hôtel particulier on Avenue Montaigne. Private fittings on the first floor, leather atelier on the second.",
  hero: h3,
  gallery: [h3, m1, m3, h1]
},
{
  slug: "florence",
  city: "Florence",
  address: "Via de' Tornabuoni 5, 50123 Florence",
  phone: "+39 055 215 1908",
  hours: "Monday to Saturday, 10 to 19",
  description: "Our cashmere and leather atelier, sat above the Arno. Hand stitched coats and bags are finished here before they reach the boutiques.",
  hero: m1,
  gallery: [m1, story, h1, m2]
},
{
  slug: "london",
  city: "London",
  address: "12 New Bond Street, London W1S",
  phone: "+44 20 7493 1908",
  hours: "Monday to Saturday, 10 to 19",
  description: "Two Georgian rooms on New Bond Street, panelled in oak and lit by candle chandeliers. Couture and jewelry by private appointment.",
  hero: m2,
  gallery: [m2, h2, story, h3]
},
{
  slug: "new-york",
  city: "New York",
  address: "697 Madison Avenue, New York NY",
  phone: "+1 212 318 1908",
  hours: "Monday to Saturday, 10 to 19",
  description: "Our first American salon, on Madison Avenue. Three floors of women's couture, leather and high jewelry, opened in 1968.",
  hero: m3,
  gallery: [m3, about, h2, m1]
},
{
  slug: "tokyo",
  city: "Tokyo",
  address: "Ginza Six, 6-10-1 Ginza, Chuo-ku, Tokyo",
  phone: "+81 3 6263 1908",
  hours: "Daily, 10:30 to 20:30",
  description: "A glass and oak boutique inside Ginza Six. Couture silk, leather and a private tea salon for fittings.",
  hero: about,
  gallery: [about, h1, m3, h3]
},
{
  slug: "dubai",
  city: "Dubai",
  address: "The Dubai Mall, Fashion Avenue, Dubai",
  phone: "+971 4 339 1908",
  hours: "Daily, 10 to 23",
  description: "Fashion Avenue salon of high jewelry and bespoke couture, with private appointments served in our atelier suite.",
  hero: story,
  gallery: [story, h2, m1, about]
}];


export const Route = createFileRoute("/boutique/$slug")({
  loader: ({ params }) => {
    const b = boutiques.find((x) => x.slug === params.slug);
    if (!b) throw notFound();
    return { boutique: b };
  },
  notFoundComponent: () =>
  <div className="pt-40 text-center pb-40">
      <h1 className="text-display text-5xl">Boutique not found.</h1>
      <Link to="/contact" className="mt-6 inline-flex btn-ghost-luxe">Back to Contact</Link>
    </div>,

  component: BoutiquePage
});

function BoutiquePage() {
  const { boutique: b } = Route.useLoaderData();

  return (
    <div className="pt-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6">
        <Link to="/contact" className="text-eyebrow text-muted-foreground hover:text-ink flex items-center gap-2 w-fit">
          <ArrowLeft size={12} /> Back to Boutiques
        </Link>
      </div>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-10 pb-16">
        <div className="lg:col-span-7 relative overflow-hidden border border-border min-h-[520px]">
          <img src={b.hero} alt={b.city} className="absolute inset-0 w-full h-full object-cover" />
          <span className="absolute top-4 left-4 w-12 h-px bg-gold" />
          <span className="absolute top-4 left-4 w-px h-12 bg-gold" />
        </div>
        <div className="lg:col-span-5 flex flex-col">
          <p className="text-eyebrow text-gold mb-3 flex items-center gap-3"><Sparkles size={12} /> Maison Vera</p>
          <h1 className="text-display text-6xl lg:text-7xl leading-[0.95] mb-6">{b.city}</h1>
          <p className="text-muted-foreground leading-relaxed mb-8">{b.description}</p>
          <div className="space-y-5 border-t border-border pt-6">
            <div className="flex gap-4"><MapPin size={18} className="text-gold mt-0.5" /><div><p className="text-eyebrow">Address</p><p className="text-sm text-muted-foreground mt-1">{b.address}</p></div></div>
            <div className="flex gap-4"><Phone size={18} className="text-gold mt-0.5" /><div><p className="text-eyebrow">Concierge</p><p className="text-sm text-muted-foreground mt-1">{b.phone}</p></div></div>
            <div className="flex gap-4"><Clock size={18} className="text-gold mt-0.5" /><div><p className="text-eyebrow">Hours</p><p className="text-sm text-muted-foreground mt-1">{b.hours}</p></div></div>
          </div>
          <div className="mt-auto pt-10 flex gap-3">
            <Link to="/contact" className="btn-luxe btn-luxe-hover">Book Appointment</Link>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-24">
        <p className="text-eyebrow text-gold mb-4">Inside the salon</p>
        <h2 className="text-display text-4xl mb-8">The {b.city} boutique.</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {b.gallery.map((g, i) =>
          <div key={i} className="relative overflow-hidden aspect-[4/5] border border-border group">
              <img src={g} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1400ms]" />
            </div>
          )}
        </div>
      </section>
    </div>);

}

export { boutiques };