import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Bell,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Crown,
  Eye,
  Gift,
  Globe,
  HeartIcon,
  LogOut,
  Mail,
  MapPin,
  Minus,
  Package,
  Pencil,
  Phone,
  Plus,
  Save,
  Settings,
  Shield,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  UserCircle2,
  X } from
"lucide-react";
import { toast } from "sonner";
import { useShop } from "@/lib/shop-store";
import { useUser } from "@/lib/user-store";
import { useAdminProducts } from "@/lib/admin-store";
import ProductCard from "@/components/site/ProductCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle } from
"@/components/ui/dialog";

export const Route = createFileRoute("/profile")({
  component: Profile
});














function Profile() {
  const products = useAdminProducts();
  const nav = useNavigate();
  const {
    profile, addresses, cards, orders, appointments, notifications,
    isLoggedIn, signOut, deleteAccount, updateProfile,
    addAddress, updateAddress, removeAddress, setDefaultAddress,
    addCard, removeCard, setDefaultCard,
    placeOrder, cancelOrder,
    bookAppointment, cancelAppointment,
    setNotification
  } = useUser();
  const { cart, wishlist, removeFromCart, updateQty, toggleWishlist, subtotal, cartCount, clearCart, addToCart } = useShop();
  const [tab, setTab] = useState("overview");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  useEffect(() => {
    if (!profile) {
      const t = setTimeout(() => {
        if (!profile) nav({ to: "/login" });
      }, 100);
      return () => clearTimeout(t);
    }
  }, [profile, nav]);

  if (!profile) return null;

  const wishItems = products.filter((p) => wishlist.includes(p.id));
  const initials = profile.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  const totalSpend = orders.reduce((s, o) => s + (o.status === "Cancelled" ? 0 : o.total), 0);
  const points = Math.floor(totalSpend / 10);
  const profileCompletion = (() => {
    let c = 0;
    if (profile.name) c += 20;
    if (profile.email) c += 20;
    if (profile.phone) c += 20;
    if (profile.dob) c += 20;
    if (addresses.length) c += 10;
    if (cards.length) c += 10;
    return c;
  })();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    nav({ to: "/checkout" });
  };

  const handleReorder = (orderId) => {
    const o = orders.find((x) => x.id === orderId);
    if (!o) return;
    let added = 0;
    o.items.forEach((it) => {
      const p = products.find((pr) => pr.name === it.name);
      if (p) {
        for (let i = 0; i < it.qty; i++) addToCart(p);
        added += it.qty;
      }
    });
    if (added > 0) setTab("bag");else
    toast("Items no longer available");
  };

  const menu = [
  { k: "overview", Ic: UserCircle2, l: "Overview", section: "Account" },
  { k: "bag", Ic: ShoppingBag, l: "Atelier Bag", c: cartCount, section: "Account" },
  { k: "wishlist", Ic: HeartIcon, l: "Wishlist", c: wishlist.length, section: "Account" },
  { k: "orders", Ic: Package, l: "Orders", c: orders.length, section: "Account" },
  { k: "address", Ic: MapPin, l: "Addresses", section: "Account" },
  { k: "payment", Ic: CreditCard, l: "Payment Methods", section: "Account" },
  { k: "appointments", Ic: CalendarDays, l: "Appointments", c: appointments.length, section: "Preferences" },
  { k: "rewards", Ic: Gift, l: "Rewards", section: "Preferences" },
  { k: "notifications", Ic: Bell, l: "Notifications", section: "Preferences" },
  { k: "security", Ic: Shield, l: "Security", section: "Preferences" },
  { k: "settings", Ic: Settings, l: "Settings", section: "Preferences" }];

  const sections = Array.from(new Set(menu.map((m) => m.section)));

  return (
    <div className="pt-20 bg-ivory">
      {/* ============ Hero ============ */}
      <section className="bg-ink text-ivory py-12 relative overflow-hidden">
        <Crown size={400} className="absolute -right-20 -bottom-20 text-gold/5" strokeWidth={0.4} />
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-emerald/30" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="animate-fade-up flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full border-2 border-gold/60 grid place-items-center bg-emerald/40 backdrop-blur shrink-0">
              <span className="text-display text-3xl text-gold">{initials}</span>
              <span className="absolute -bottom-1 -right-1 bg-gold text-ink rounded-full w-7 h-7 grid place-items-center">
                <Crown size={13} />
              </span>
            </div>
            <div>
              <p className="text-eyebrow text-gold mb-3 flex items-center gap-2">
                <Sparkles size={12} /> Private Salon Member since {profile.memberSince}
              </p>
              <h1 className="text-display text-5xl md:text-6xl leading-[1]">
                Bonjour, <em className="text-gold not-italic">{profile.name.split(" ")[0]}</em>.
              </h1>
              <p className="text-ivory/60 mt-3 flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5"><Mail size={13} /> {profile.email}</span>
                {profile.phone && <span className="flex items-center gap-1.5"><Phone size={13} /> {profile.phone}</span>}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-px bg-ivory/10 border border-ivory/10">
            {[
            { Ic: Package, n: orders.length.toString(), l: "Orders" },
            { Ic: HeartIcon, n: wishlist.length.toString(), l: "Wishlist" },
            { Ic: Gift, n: points.toLocaleString(), l: "Points" },
            { Ic: Award, n: "Atelier", l: "Status" }].
            map((s) =>
            <div key={s.l} className="bg-ink p-5 text-center min-w-[100px]">
                <s.Ic size={16} className="mx-auto text-gold mb-2" strokeWidth={1.2} />
                <p className="text-display text-xl">{s.n}</p>
                <p className="text-eyebrow text-ivory/50 mt-1 text-[10px]">{s.l}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ Sidebar + Content ============ */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-14">
        <aside>
          <div className="lg:sticky lg:top-28 space-y-8">
            <div className="border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-eyebrow text-muted-foreground">Profile</p>
                <p className="text-display text-2xl text-gold">{profileCompletion}%</p>
              </div>
              <div className="h-1 w-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-gold to-emerald transition-all" style={{ width: `${profileCompletion}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {profileCompletion < 100 ? "Complete your profile to unlock all salon benefits." : "Your salon profile is complete."}
              </p>
            </div>

            {sections.map((sec) =>
            <div key={sec}>
                <p className="text-eyebrow text-muted-foreground mb-2 px-5">{sec}</p>
                <nav className="space-y-0.5">
                  {menu.filter((m) => m.section === sec).map((m) =>
                <button
                  key={m.k}
                  onClick={() => setTab(m.k)}
                  className={`w-full flex items-center justify-between px-5 py-3 text-eyebrow border-l-2 transition-all ${
                  tab === m.k ?
                  "bg-secondary border-gold text-ink" :
                  "border-transparent hover:border-border text-muted-foreground hover:text-ink hover:bg-secondary/50"}`
                  }>
                  
                      <span className="flex items-center gap-3">
                        <m.Ic size={14} /> {m.l}
                      </span>
                      {m.c !== undefined && m.c > 0 &&
                  <span className="text-[10px] bg-gold text-ink rounded-full w-5 h-5 flex items-center justify-center">{m.c}</span>
                  }
                    </button>
                )}
                </nav>
              </div>
            )}

            <button
              onClick={() => {signOut();nav({ to: "/login" });}}
              className="w-full flex items-center gap-3 px-5 py-3 text-eyebrow border-l-2 border-transparent text-destructive hover:bg-destructive/5">
              
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </aside>

        <div className="min-h-[600px]">
          {tab === "overview" &&
          <Overview
            setTab={setTab}
            orders={orders}
            points={points}
            onBook={() => setBookOpen(true)} />

          }

          {tab === "bag" &&
          <Pane title="Atelier Bag" eyebrow="Your Bag" right={<p className="text-display text-3xl">${subtotal.toLocaleString()}</p>}>
              {cart.length === 0 ?
            <Empty icon={ShoppingBag} title="Your bag awaits" cta={<Link to="/shop" className="btn-luxe btn-luxe-hover">Discover the Boutique</Link>} /> :

            <div className="space-y-4">
                  {cart.map((i) =>
              <div key={i.product.id + (i.size ?? "")} className="flex gap-5 border border-border p-4 hover:border-ink transition-colors bg-card">
                      <Link to="/product/$id" params={{ id: i.product.id }} className="shrink-0">
                        <img src={i.product.image} alt={i.product.name} className="w-24 h-32 object-cover" />
                      </Link>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-eyebrow text-muted-foreground">{i.product.category}</p>
                          <Link to="/product/$id" params={{ id: i.product.id }} className="text-display text-xl hover:text-gold">{i.product.name}</Link>
                          {i.size && <p className="text-xs text-muted-foreground mt-1">Size {i.size}</p>}
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="flex items-center border border-border">
                            <button onClick={() => updateQty(i.product.id, i.size, i.qty - 1)} className="w-8 h-8 grid place-items-center hover:bg-secondary"><Minus size={12} /></button>
                            <span className="w-8 text-center text-sm">{i.qty}</span>
                            <button onClick={() => updateQty(i.product.id, i.size, i.qty + 1)} className="w-8 h-8 grid place-items-center hover:bg-secondary"><Plus size={12} /></button>
                          </div>
                          <p className="text-display text-xl">${(i.product.price * i.qty).toLocaleString()}</p>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(i.product.id)} className="text-muted-foreground hover:text-destructive self-start"><Trash2 size={16} /></button>
                    </div>
              )}
                  <div className="border border-border p-6 bg-card mt-6 space-y-3">
                    <Row label="Subtotal" value={`$${subtotal.toLocaleString()}`} />
                    <Row label="Concierge Delivery" value="Complimentary" />
                    <Row label="VAT (estimated)" value={`$${Math.round(subtotal * 0.08).toLocaleString()}`} />
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="text-display text-xl">Total</span>
                      <span className="text-display text-2xl">${Math.round(subtotal * 1.08).toLocaleString()}</span>
                    </div>
                    <button onClick={handleCheckout} className="btn-luxe btn-luxe-hover w-full justify-center mt-3">Proceed to Checkout</button>
                  </div>
                </div>
            }
            </Pane>
          }

          {tab === "wishlist" &&
          <Pane title="Wishlist" eyebrow="Saved Pieces">
              {wishItems.length === 0 ?
            <Empty icon={HeartIcon} title="No saved pieces yet" cta={<Link to="/shop" className="btn-ghost-luxe">Explore Boutique</Link>} /> :

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishItems.map((p) =>
              <div key={p.id} className="group relative">
                      <Link to="/product/$id" params={{ id: p.id }} className="block overflow-hidden bg-secondary aspect-[4/5]">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </Link>
                      <button onClick={() => toggleWishlist(p)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-ivory/90 backdrop-blur flex items-center justify-center text-destructive">
                        <HeartIcon size={14} fill="currentColor" />
                      </button>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <p className="text-eyebrow text-muted-foreground">{p.category}</p>
                          <h3 className="text-display text-lg">{p.name}</h3>
                        </div>
                        <p className="text-display text-lg">${p.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => addToCart(p)} className="mt-3 w-full btn-ghost-luxe justify-center text-xs">Move to Bag</button>
                    </div>
              )}
                </div>
            }
            </Pane>
          }

          {tab === "orders" &&
          <Pane title="Order History" eyebrow="Past Orders">
              {orders.length === 0 ?
            <Empty icon={Package} title="No orders yet" cta={<Link to="/shop" className="btn-luxe btn-luxe-hover">Begin Shopping</Link>} /> :

            <div className="space-y-3">
                  {orders.map((o) =>
              <div key={o.id} className="border border-border p-6 hover:border-gold transition-colors bg-card">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-secondary grid place-items-center shrink-0">
                            <Package size={20} className="text-gold" strokeWidth={1.2} />
                          </div>
                          <div>
                            <p className="text-eyebrow text-muted-foreground">{o.id}</p>
                            <p className="text-display text-xl">{o.items[0]?.name}{o.items.length > 1 ? ` +${o.items.length - 1} more` : ""}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                              <Calendar size={11} /> {o.date} {o.items.reduce((s, i) => s + i.qty, 0)} pieces
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className={`text-eyebrow px-3 py-1.5 ${
                    o.status === "Delivered" ? "text-emerald bg-emerald/10" :
                    o.status === "In Transit" ? "text-gold bg-gold/10" :
                    o.status === "Cancelled" ? "text-destructive bg-destructive/10" :
                    "text-muted-foreground bg-secondary"}`
                    }>
                            {o.status === "In Transit" && <Truck size={11} className="inline mr-1.5" />}
                            {o.status === "Delivered" && <CheckCircle2 size={11} className="inline mr-1.5" />}
                            {o.status}
                          </span>
                          <p className="text-display text-2xl">${o.total.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="border-t border-border mt-4 pt-3 flex justify-end gap-4 text-eyebrow">
                        <button onClick={() => toast(`Order ${o.id}`, { description: o.items.map((i) => `${i.qty}× ${i.name}`).join(", ") })} className="hover:text-gold flex items-center gap-1.5"><Eye size={12} /> View</button>
                        <button onClick={() => toast("Tracking", { description: `${o.id} ${o.status}` })} className="hover:text-gold flex items-center gap-1.5"><Truck size={12} /> Track</button>
                        <button onClick={() => handleReorder(o.id)} className="hover:text-gold flex items-center gap-1.5">Reorder</button>
                        {o.status === "Processing" &&
                  <button onClick={() => cancelOrder(o.id)} className="hover:text-destructive flex items-center gap-1.5">Cancel</button>
                  }
                      </div>
                    </div>
              )}
                </div>
            }
            </Pane>
          }

          {tab === "address" &&
          <Pane title="Addresses" eyebrow="Concierge Delivery" right={
          <button onClick={() => {setEditAddress(null);setAddressOpen(true);}} className="btn-ghost-luxe inline-flex items-center gap-2"><Plus size={14} /> Add Address</button>
          }>
              {addresses.length === 0 ?
            <Empty icon={MapPin} title="No addresses yet" cta={<button onClick={() => setAddressOpen(true)} className="btn-luxe btn-luxe-hover">Add Your First Address</button>} /> :

            <div className="grid md:grid-cols-2 gap-4">
                  {addresses.map((a) =>
              <div key={a.id} className="border border-border p-6 hover:border-gold transition-colors bg-card relative">
                      {a.isDefault &&
                <span className="absolute top-3 right-3 text-[10px] bg-gold text-ink px-2 py-0.5">DEFAULT</span>
                }
                      <p className="text-eyebrow text-gold mb-3 flex items-center gap-2"><MapPin size={12} /> {a.label}</p>
                      <p className="text-display text-xl">{a.name}</p>
                      <p className="text-sm mt-1">{a.line1}</p>
                      <p className="text-muted-foreground text-sm">{a.city}, {a.zip}, {a.country}</p>
                      <p className="text-muted-foreground text-sm mt-2 flex items-center gap-1.5"><Phone size={11} /> {a.phone}</p>
                      <div className="mt-4 flex gap-4 text-eyebrow flex-wrap">
                        {!a.isDefault && <button onClick={() => setDefaultAddress(a.id)} className="hover:text-gold">Set Default</button>}
                        <button onClick={() => {setEditAddress(a);setAddressOpen(true);}} className="hover:text-gold flex items-center gap-1"><Pencil size={11} /> Edit</button>
                        <button onClick={() => removeAddress(a.id)} className="hover:text-destructive flex items-center gap-1"><Trash2 size={11} /> Remove</button>
                      </div>
                    </div>
              )}
                </div>
            }
            </Pane>
          }

          {tab === "payment" &&
          <Pane title="Payment Methods" eyebrow="Wallet" right={
          <button onClick={() => setCardOpen(true)} className="btn-ghost-luxe inline-flex items-center gap-2"><Plus size={14} /> Add Card</button>
          }>
              {cards.length === 0 ?
            <Empty icon={CreditCard} title="No cards saved" cta={<button onClick={() => setCardOpen(true)} className="btn-luxe btn-luxe-hover">Add Your First Card</button>} /> :

            <div className="space-y-4">
                  {cards.map((p) =>
              <div key={p.id} className="border border-border p-6 bg-card flex items-center justify-between hover:border-gold transition-colors">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-10 bg-gradient-to-br from-ink to-emerald grid place-items-center text-ivory text-eyebrow">
                          {p.brand}
                        </div>
                        <div>
                          <p className="text-display text-xl">•••• {p.last4}</p>
                          <p className="text-xs text-muted-foreground">Expires {p.exp} {p.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {p.isDefault ?
                  <span className="text-[10px] bg-gold text-ink px-2 py-0.5">DEFAULT</span> :

                  <button onClick={() => setDefaultCard(p.id)} className="text-eyebrow hover:text-gold">Set Default</button>
                  }
                        <button onClick={() => removeCard(p.id)} className="text-eyebrow hover:text-destructive"><Trash2 size={12} /></button>
                      </div>
                    </div>
              )}
                </div>
            }
            </Pane>
          }

          {tab === "appointments" &&
          <Pane title="Appointments" eyebrow="Private Concierge" right={
          <button onClick={() => setBookOpen(true)} className="btn-ghost-luxe inline-flex items-center gap-2"><Plus size={14} /> Book Now</button>
          }>
              {appointments.length === 0 ?
            <Empty icon={CalendarDays} title="No appointments yet" cta={<button onClick={() => setBookOpen(true)} className="btn-luxe btn-luxe-hover">Book a Session</button>} /> :

            <div className="space-y-3">
                  {appointments.map((a) =>
              <div key={a.id} className="border border-border p-6 bg-card flex items-center justify-between hover:border-gold transition-colors">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-secondary grid place-items-center"><CalendarDays size={20} className="text-gold" strokeWidth={1.2} /></div>
                        <div>
                          <p className="text-display text-xl">{a.location}</p>
                          <p className="text-sm text-muted-foreground">{a.date} at {a.time}</p>
                          {a.note && <p className="text-xs text-muted-foreground mt-1">{a.note}</p>}
                        </div>
                      </div>
                      <button onClick={() => cancelAppointment(a.id)} className="text-eyebrow text-destructive hover:underline">Cancel</button>
                    </div>
              )}
                </div>
            }
            </Pane>
          }

          {tab === "rewards" &&
          <Pane title="Rewards & Membership" eyebrow="Atelier Programme">
              <div className="grid md:grid-cols-3 gap-px bg-border border border-border mb-8">
                <Stat Ic={Gift} n={points.toLocaleString()} l="Points Available" />
                <Stat Ic={Crown} n="Atelier" l="Current Tier" />
                <Stat Ic={Sparkles} n={Math.max(0, 3000 - points).toLocaleString()} l="Points to Maison" />
              </div>
              <div className="border border-gold/40 bg-gradient-to-br from-ink to-emerald text-ivory p-8">
                <p className="text-eyebrow text-gold">Next Reward</p>
                <p className="text-display text-3xl mt-2">Private Atelier Visit</p>
                <p className="text-ivory/70 mt-2 max-w-md text-sm">Earn {Math.max(0, 3000 - points).toLocaleString()} more points to unlock a private appointment at our Milan or Paris atelier.</p>
                <div className="h-1 w-full bg-ivory/10 mt-5 overflow-hidden">
                  <div className="h-full bg-gold transition-all" style={{ width: `${Math.min(100, points / 3000 * 100)}%` }} />
                </div>
              </div>
              <div className="mt-10">
                <p className="text-eyebrow text-muted-foreground mb-4">Recent Activity</p>
                <div className="space-y-2">
                  {orders.slice(0, 5).map((o) =>
                <div key={o.id} className="flex justify-between border-b border-border py-3 text-sm">
                      <span>Earned {o.items[0]?.name} purchase</span>
                      <span className="text-emerald">+{Math.floor(o.total / 10).toLocaleString()} pts</span>
                    </div>
                )}
                  {orders.length === 0 && <p className="text-sm text-muted-foreground">Place your first order to begin earning.</p>}
                </div>
              </div>
            </Pane>
          }

          {tab === "notifications" &&
          <Pane title="Notifications" eyebrow="Stay Informed">
              <div className="space-y-3">
                {[
              { k: "orders", l: "Order updates & shipping", d: "Tracking, delivery and signature confirmations." },
              { k: "arrivals", l: "New arrivals & collections", d: "Be the first to know when new pieces enter the maison." },
              { k: "events", l: "Private events & previews", d: "Invitations to runway previews and atelier soirées." },
              { k: "promos", l: "Promotional offers", d: "Members only pricing and seasonal offers." },
              { k: "styling", l: "Personal styling notes", d: "Curated by our maison stylists for you." }].
              map((n) =>
              <ToggleRow key={n.k} l={n.l} d={n.d} on={notifications[n.k] ?? false} onChange={(v) => setNotification(n.k, v)} />
              )}
              </div>
            </Pane>
          }

          {tab === "security" &&
          <Pane title="Security" eyebrow="Your Account">
              <div className="space-y-6">
                <Setting icon={Shield} label="Password" value="Last changed recently" action="Change" onClick={() => toast("A reset link has been sent to your email")} />
                <ToggleRow
                l="Two factor authentication"
                d={profile.twoFactor ? `Enabled SMS to ${profile.phone || "your phone"}` : "Add an extra layer of security to your account."}
                on={profile.twoFactor}
                onChange={(v) => {updateProfile({ twoFactor: v });toast.success(v ? "Two factor authentication enabled" : "Two factor authentication disabled");}} />
              
                <Setting icon={Mail} label="Recovery email" value={profile.email} action="Edit" onClick={() => setEditProfileOpen(true)} />
                <Setting icon={UserCircle2} label="Login activity" value={`Last seen ${new Date().toLocaleString()}`} />
              </div>
              <div className="border border-destructive/30 bg-destructive/5 p-6 mt-10">
                <p className="text-eyebrow text-destructive mb-2">Danger Zone</p>
                <p className="text-display text-xl">Delete account</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Once deleted your salon profile and order history cannot be recovered.</p>
                <button onClick={() => setConfirmDelete(true)} className="text-eyebrow text-destructive border border-destructive/40 px-4 py-2 hover:bg-destructive hover:text-ivory transition-colors">Delete Account</button>
              </div>
            </Pane>
          }

          {tab === "settings" &&
          <Pane title="Settings" eyebrow="Account" right={<button onClick={() => setEditProfileOpen(true)} className="btn-ghost-luxe inline-flex items-center gap-2"><Pencil size={14} /> Edit Profile</button>}>
              <div className="space-y-6 max-w-xl">
                <Setting icon={UserCircle2} label="Name" value={profile.name} action="Edit" onClick={() => setEditProfileOpen(true)} />
                <Setting icon={Mail} label="Email" value={profile.email} action="Edit" onClick={() => setEditProfileOpen(true)} />
                <Setting icon={Phone} label="Phone" value={profile.phone || "Not set"} action="Edit" onClick={() => setEditProfileOpen(true)} />
                <Setting icon={Calendar} label="Date of birth" value={profile.dob || "Not set"} action="Edit" onClick={() => setEditProfileOpen(true)} />
                <Setting icon={Crown} label="Membership" value="Atelier Lifetime" />
                <Setting icon={Globe} label="Preferred language" value={profile.language} action="Change" onClick={() => {
                const next = profile.language === "English (UK)" ? "Italiano" : profile.language === "Italiano" ? "Fran\u00e7ais" : "English (UK)";
                updateProfile({ language: next });
                toast.success(`Language set to ${next}`);
              }} />
                <Setting icon={Save} label="Currency" value={profile.currency} action="Change" onClick={() => {
                const next = profile.currency.startsWith("EUR") ? "USD $" : profile.currency.startsWith("USD") ? "GBP £" : "EUR €";
                updateProfile({ currency: next });
                toast.success(`Currency set to ${next}`);
              }} />
              </div>
            </Pane>
          }
        </div>
      </section>

      <SimilarProducts />

      {/* ============ Dialogs ============ */}
      <EditProfileDialog open={editProfileOpen} onOpenChange={setEditProfileOpen} />
      <AddressDialog
        open={addressOpen}
        onOpenChange={(o) => {setAddressOpen(o);if (!o) setEditAddress(null);}}
        initial={editAddress}
        onSubmit={(a) => {
          if (editAddress) updateAddress(editAddress.id, a);else
          addAddress(a);
          setAddressOpen(false);
          setEditAddress(null);
        }} />
      
      <CardDialog
        open={cardOpen}
        onOpenChange={setCardOpen}
        onSubmit={(c) => {addCard(c);setCardOpen(false);}} />
      
      <BookDialog
        open={bookOpen}
        onOpenChange={setBookOpen}
        onSubmit={(a) => {bookAppointment(a);setBookOpen(false);setTab("appointments");}} />
      
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-display text-2xl">Delete your account?</DialogTitle>
            <DialogDescription>
              This permanently removes your salon profile, addresses, payment methods and order history. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button onClick={() => setConfirmDelete(false)} className="btn-ghost-luxe">Cancel</button>
            <button
              onClick={() => {deleteAccount();setConfirmDelete(false);nav({ to: "/signup" });}}
              className="text-eyebrow text-ivory bg-destructive px-5 py-2.5 hover:opacity-90">
              
              Yes, Delete Account
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

}

/* ====================== Subcomponents ====================== */

function Overview({ setTab, orders, points, onBook }) {
  const products = useAdminProducts();
  const quick = [
  { k: "orders", Ic: Package, l: orders.length ? "Track Orders" : "No Orders", d: orders[0]?.id ?? "Browse the boutique" },
  { k: "wishlist", Ic: HeartIcon, l: "Wishlist", d: "Saved pieces" },
  { k: "rewards", Ic: Gift, l: `${points.toLocaleString()} Points`, d: "Atelier programme" },
  { k: "address", Ic: MapPin, l: "Addresses", d: "Manage delivery" }];

  return (
    <div className="animate-fade-up">
      <p className="text-eyebrow text-gold mb-2">Welcome back</p>
      <h2 className="text-display text-4xl mb-8">Overview</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        {quick.map((q) =>
        <button key={q.l} onClick={() => setTab(q.k)} className="bg-card p-6 text-left hover:bg-secondary transition-colors group">
            <q.Ic size={18} className="text-gold mb-3" strokeWidth={1.2} />
            <p className="text-display text-xl">{q.l}</p>
            <p className="text-xs text-muted-foreground mt-1">{q.d}</p>
            <p className="text-eyebrow text-gold mt-3 opacity-0 group-hover:opacity-100 transition-opacity">View →</p>
          </button>
        )}
      </div>

      <div className="mt-12 grid lg:grid-cols-2 gap-8">
        <div>
          <p className="text-eyebrow text-muted-foreground mb-4">Recent Orders</p>
          <div className="space-y-3">
            {orders.length === 0 ?
            <div className="border border-dashed border-border p-6 text-sm text-muted-foreground">No orders yet, your story begins with the first piece.</div> :
            orders.slice(0, 2).map((o) =>
            <div key={o.id} className="border border-border p-5 bg-card flex justify-between items-center">
                <div>
                  <p className="text-eyebrow text-muted-foreground">{o.id}</p>
                  <p className="text-display text-lg">{o.items[0]?.name}</p>
                  <p className="text-xs text-muted-foreground">{o.date}</p>
                </div>
                <span className="text-eyebrow text-emerald bg-emerald/10 px-3 py-1.5">{o.status}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="text-eyebrow text-muted-foreground mb-4">Recently Viewed</p>
          <div className="grid grid-cols-3 gap-3">
            {products.slice(0, 3).map((p) =>
            <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-secondary">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <p className="text-xs mt-2 truncate">{p.name}</p>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 border border-gold/30 bg-gradient-to-br from-ink to-emerald text-ivory p-8 flex items-center justify-between gap-6 flex-wrap">
        <div>
          <p className="text-eyebrow text-gold">Private Concierge</p>
          <p className="text-display text-3xl mt-2">Book a styling session</p>
          <p className="text-ivory/70 mt-2 text-sm max-w-md">A maison stylist will curate pieces in your size and silhouette for a private appointment.</p>
        </div>
        <button onClick={onBook} className="btn-luxe btn-luxe-hover bg-gold text-ink">Book Now</button>
      </div>
    </div>);

}

function SimilarProducts() {
  const products = useAdminProducts();
  const perPage = 8;
  const [page, setPage] = useState(0);
  const pages = Math.ceil(products.length / perPage);
  const slice = useMemo(() => products.slice(page * perPage, page * perPage + perPage), [products, page]);

  return (
    <section className="bg-secondary/60 border-t border-border py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-eyebrow text-gold mb-2">Curated for you</p>
            <h2 className="text-display text-4xl md:text-5xl">You may also love</h2>
          </div>
          <Link to="/shop" className="btn-ghost-luxe">Browse All</Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {slice.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>

        {pages > 1 &&
        <div className="flex items-center justify-center gap-2 mt-12">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="w-10 h-10 border border-border grid place-items-center hover:border-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronLeft size={16} /></button>
            {Array.from({ length: pages }).map((_, i) =>
          <button key={i} onClick={() => setPage(i)} className={`w-10 h-10 text-eyebrow border transition-all ${page === i ? "bg-ink text-ivory border-ink" : "border-border hover:border-ink"}`}>{i + 1}</button>
          )}
            <button onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={page === pages - 1} className="w-10 h-10 border border-border grid place-items-center hover:border-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"><ChevronRight size={16} /></button>
          </div>
        }
      </div>
    </section>);

}

function Pane({ title, eyebrow, right, children }) {
  return (
    <div className="animate-fade-up">
      <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
        <div>
          <p className="text-eyebrow text-gold mb-2">{eyebrow}</p>
          <h2 className="text-display text-4xl">{title}</h2>
        </div>
        {right}
      </div>
      {children}
    </div>);

}

function Empty({ icon: Ic, title, cta }) {
  return (
    <div className="border border-dashed border-border py-14 flex flex-col items-center text-center">
      <Ic size={32} className="text-muted-foreground mb-4" strokeWidth={1} />
      <p className="text-display text-3xl mb-6">{title}</p>
      {cta}
    </div>);

}

function Setting({ icon: Ic, label, value, action, onClick }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-4">
      <div className="flex items-center gap-4">
        <Ic size={16} className="text-gold" />
        <div>
          <p className="text-eyebrow text-muted-foreground">{label}</p>
          <p className="text-display text-xl mt-0.5">{value}</p>
        </div>
      </div>
      {action && <button onClick={onClick} className="text-eyebrow hover:text-gold">{action}</button>}
    </div>);

}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>);

}

function Stat({ Ic, n, l }) {
  return (
    <div className="bg-card p-6 text-center">
      <Ic size={18} className="mx-auto text-gold mb-2" strokeWidth={1.2} />
      <p className="text-display text-2xl">{n}</p>
      <p className="text-eyebrow text-muted-foreground mt-1">{l}</p>
    </div>);

}

function ToggleRow({ l, d, on, onChange }) {
  return (
    <div className="flex items-start justify-between gap-6 border border-border bg-card p-5">
      <div>
        <p className="text-display text-lg">{l}</p>
        <p className="text-xs text-muted-foreground mt-1">{d}</p>
      </div>
      <button
        onClick={() => onChange(!on)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${on ? "bg-gold" : "bg-border"}`}
        aria-label={l}>
        
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-ivory rounded-full transition-transform ${on ? "translate-x-5" : ""}`} />
      </button>
    </div>);

}

/* ============ Dialogs ============ */

function FormInput({ label, ...rest }) {
  return (
    <label className="block">
      <span className="text-eyebrow text-muted-foreground block mb-1.5">{label}</span>
      <input
        {...rest}
        className="w-full bg-transparent border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors" />
      
    </label>);

}

function EditProfileDialog({ open, onOpenChange }) {
  const { profile, updateProfile } = useUser();
  if (!profile) return null;
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    updateProfile({
      name: String(fd.get("name") || profile.name),
      email: String(fd.get("email") || profile.email),
      phone: String(fd.get("phone") || ""),
      dob: String(fd.get("dob") || "")
    });
    toast.success("Profile updated");
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-display text-2xl">Edit profile</DialogTitle>
          <DialogDescription>Keep your details current for a seamless concierge experience.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <FormInput name="name" label="Full Name" defaultValue={profile.name} required />
          <FormInput name="email" type="email" label="Email" defaultValue={profile.email} required />
          <FormInput name="phone" type="tel" label="Phone" defaultValue={profile.phone} />
          <FormInput name="dob" type="date" label="Date of birth" defaultValue={profile.dob} />
          <DialogFooter>
            <button type="button" onClick={() => onOpenChange(false)} className="btn-ghost-luxe">Cancel</button>
            <button type="submit" className="btn-luxe btn-luxe-hover">Save Changes</button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}

function AddressDialog({ open, onOpenChange, initial, onSubmit }) {
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      label: String(fd.get("label") || "Home"),
      name: String(fd.get("name") || ""),
      line1: String(fd.get("line1") || ""),
      city: String(fd.get("city") || ""),
      zip: String(fd.get("zip") || ""),
      country: String(fd.get("country") || ""),
      phone: String(fd.get("phone") || ""),
      isDefault: fd.get("isDefault") === "on"
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-display text-2xl">{initial ? "Edit address" : "Add address"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormInput name="label" label="Label" defaultValue={initial?.label || "Home"} placeholder="Home / Studio" required />
            <FormInput name="name" label="Full Name" defaultValue={initial?.name || ""} required />
          </div>
          <FormInput name="line1" label="Street Address" defaultValue={initial?.line1 || ""} required />
          <div className="grid grid-cols-3 gap-3">
            <FormInput name="city" label="City" defaultValue={initial?.city || ""} required />
            <FormInput name="zip" label="ZIP" defaultValue={initial?.zip || ""} required />
            <FormInput name="country" label="Country" defaultValue={initial?.country || ""} required />
          </div>
          <FormInput name="phone" type="tel" label="Phone" defaultValue={initial?.phone || ""} required />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isDefault" defaultChecked={initial?.isDefault} className="accent-[var(--gold)]" />
            Set as default delivery address
          </label>
          <DialogFooter>
            <button type="button" onClick={() => onOpenChange(false)} className="btn-ghost-luxe">Cancel</button>
            <button type="submit" className="btn-luxe btn-luxe-hover">{initial ? "Save" : "Add Address"}</button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}

function CardDialog({ open, onOpenChange, onSubmit }) {
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const number = String(fd.get("number") || "");
    const clean = number.replace(/\s+/g, "");
    if (clean.length < 12) {toast.error("Enter a valid card number");return;}
    const brand = clean.startsWith("4") ? "VISA" : clean.startsWith("5") ? "MC" : clean.startsWith("3") ? "AMEX" : "CARD";
    onSubmit({
      brand,
      number: clean,
      exp: String(fd.get("exp") || ""),
      name: String(fd.get("name") || ""),
      isDefault: fd.get("isDefault") === "on"
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-display text-2xl">Add payment method</DialogTitle>
          <DialogDescription>Your card details are stored securely in your wallet.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <FormInput name="name" label="Name on Card" placeholder="Sofia Vera" required />
          <FormInput name="number" label="Card Number" placeholder="4242 4242 4242 4242" maxLength={19} required />
          <div className="grid grid-cols-2 gap-3">
            <FormInput name="exp" label="Expiry" placeholder="MM/YY" required />
            <FormInput name="cvc" label="CVC" placeholder="123" maxLength={4} required />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isDefault" className="accent-[var(--gold)]" />
            Set as default payment method
          </label>
          <DialogFooter>
            <button type="button" onClick={() => onOpenChange(false)} className="btn-ghost-luxe">Cancel</button>
            <button type="submit" className="btn-luxe btn-luxe-hover">Add Card</button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}

function BookDialog({ open, onOpenChange, onSubmit }) {
  const submit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSubmit({
      date: String(fd.get("date") || ""),
      time: String(fd.get("time") || ""),
      location: String(fd.get("location") || "Milano Atelier"),
      note: String(fd.get("note") || "")
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-display text-2xl">Book a styling session</DialogTitle>
          <DialogDescription>Reserve a private appointment with a maison stylist.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-eyebrow text-muted-foreground block mb-1.5">Atelier</span>
            <select name="location" defaultValue="Milano Atelier" className="w-full bg-transparent border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-gold">
              <option>Milano Atelier</option>
              <option>Paris Atelier</option>
              <option>Geneva Atelier</option>
              <option>Virtual Concierge</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <FormInput name="date" type="date" label="Date" required />
            <FormInput name="time" type="time" label="Time" required />
          </div>
          <label className="block">
            <span className="text-eyebrow text-muted-foreground block mb-1.5">Notes</span>
            <textarea name="note" rows={3} placeholder="Pieces you would like to view, sizes, occasion…" className="w-full bg-transparent border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-gold" />
          </label>
          <DialogFooter>
            <button type="button" onClick={() => onOpenChange(false)} className="btn-ghost-luxe">Cancel</button>
            <button type="submit" className="btn-luxe btn-luxe-hover">Confirm Booking</button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}