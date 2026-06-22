import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Gift,
  Lock,
  MapPin,
  Package,
  Sparkles,
  Truck,
  User } from
"lucide-react";
import { toast } from "sonner";
import { useShop } from "@/lib/shop-store";
import { useUser } from "@/lib/user-store";
import { fetchShippingMethods } from "@/lib/api/shippingApi";
import { validateCoupon } from "@/lib/api/couponApi";
import { registerUser } from "@/lib/api/authApi";

export const Route = createFileRoute("/checkout")({
  component: Checkout
});




























const FALLBACK_DELIVERY = [
{ id: "standard", label: "Standard delivery", eta: "5 — 7 working days", price: 0, note: "Complimentary on all orders" },
{ id: "express", label: "Express delivery", eta: "2 — 3 working days", price: 35, note: "Insured, signature required" },
{ id: "concierge", label: "White glove concierge", eta: "Next working day", price: 95, note: "Hand delivered in Milan, Paris, Geneva, London, New York" }];


function Checkout() {
  const nav = useNavigate();
  const { cart, subtotal, clearCart } = useShop();
  const { profile, addresses, cards, placeOrder, addAddress, addCard } = useUser();

  const [deliveryOptions, setDeliveryOptions] = useState(FALLBACK_DELIVERY);

  const [step, setStep] = useState(1);
  const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
  const defaultCard = cards.find((c) => c.isDefault) ?? cards[0];

  const [shipping, setShipping] = useState({
    email: profile?.email ?? "",
    firstName: profile?.name.split(" ")[0] ?? "",
    lastName: profile?.name.split(" ").slice(1).join(" ") ?? "",
    phone: profile?.phone ?? "",
    address1: defaultAddr?.line1 ?? "",
    address2: "",
    city: defaultAddr?.city ?? "",
    state: "",
    zip: defaultAddr?.zip ?? "",
    country: defaultAddr?.country ?? "Italy",
    saveAddress: false
  });

  const [delivery, setDelivery] = useState("standard");

  useEffect(() => {
    fetchShippingMethods().then((methods) => {
      setDeliveryOptions(
        methods.map((m) => ({
          id: m.code,
          label: m.label,
          eta: m.eta,
          price: m.price,
          note: m.note || ""
        }))
      );
    });
  }, []);

  const [payment, setPayment] = useState({
    method: "card",
    cardName: profile?.name ?? "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    saveCard: false
  });

  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [agreeTos, setAgreeTos] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  const deliveryFee = deliveryOptions.find((d) => d.id === delivery)?.price ?? 0;
  const giftFee = giftWrap ? 25 : 0;
  const vat = Math.round(subtotal * 0.08);
  const discount = appliedPromo?.discountAmount ?? (appliedPromo ? Math.round(subtotal * appliedPromo.discount / 100) : 0);
  const total = Math.max(0, subtotal + deliveryFee + giftFee + vat - discount);

  // Empty cart guard, after order placement we keep page open
  useEffect(() => {
    if (cart.length === 0 && !placedOrderId) {
      const t = setTimeout(() => nav({ to: "/shop" }), 50);
      return () => clearTimeout(t);
    }
  }, [cart.length, placedOrderId, nav]);

  if (cart.length === 0 && !placedOrderId) return null;

  const applyPromo = async () => {
    const code = promo.trim().toUpperCase();
    if (!code) return;
    try {
      const result = await validateCoupon(code, subtotal + giftFee + vat);
      if (result.valid) {
        const pct = result.coupon?.type === "percent" ? result.coupon.value : 0;
        setAppliedPromo({ code, discount: pct, discountAmount: result.discount });
        toast.success(`${code} applied`);
      } else {
        toast.error(result.error || "Promotion code not recognised");
      }
    } catch {
      toast.error("Promotion code not recognised");
    }
  };

  const validateShipping = () => {
    const required = ["email", "firstName", "lastName", "phone", "address1", "city", "zip", "country"];
    for (const k of required) {
      if (!String(shipping[k] ?? "").trim()) {
        toast.error("Please complete the delivery details");
        return false;
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(shipping.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (payment.method !== "card") return true;
    const num = payment.cardNumber.replace(/\s+/g, "");
    if (!payment.cardName.trim() || num.length < 13 || num.length > 19) {
      toast.error("Please enter valid card details");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) {
      toast.error("Expiry must be MM/YY");
      return false;
    }
    if (!/^\d{3,4}$/.test(payment.cvc)) {
      toast.error("CVC must be 3 or 4 digits");
      return false;
    }
    return true;
  };

  const onNext = () => {
    if (step === 1 && !validateShipping()) return;
    if (step === 2) {/* delivery always valid */}
    if (step === 3 && !validatePayment()) return;
    setStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const onBack = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPlaceOrder = async () => {
    if (!agreeTos) {
      toast.error("Please accept the terms to continue");
      return;
    }
    if (!validatePayment()) return;
    setPlacing(true);
    try {
      if (!profile) {
        await registerUser({
          email: shipping.email,
          name: `${shipping.firstName} ${shipping.lastName}`.trim(),
          phone: shipping.phone
        });
      }

      if (shipping.saveAddress && profile) {
        await addAddress({
          label: "Shipping",
          name: `${shipping.firstName} ${shipping.lastName}`.trim(),
          line1: [shipping.address1, shipping.address2].filter(Boolean).join(", "),
          city: shipping.city,
          zip: shipping.zip,
          country: shipping.country,
          phone: shipping.phone,
          isDefault: addresses.length === 0
        });
      }
      if (payment.method === "card" && payment.saveCard && profile) {
        await addCard({
          brand: detectBrand(payment.cardNumber),
          number: payment.cardNumber,
          exp: payment.expiry,
          name: payment.cardName,
          isDefault: cards.length === 0
        });
      }

      const orderItems = cart.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        qty: i.qty,
        price: i.product.price,
        size: i.size,
        image: i.product.image
      }));

      const order = await placeOrder(orderItems, total, {
        subtotal: subtotal + giftFee + vat,
        shippingCost: deliveryFee,
        deliveryMethod: delivery,
        couponCode: appliedPromo?.code,
        paymentMethod: payment.method,
        shippingAddress: {
          email: shipping.email,
          name: `${shipping.firstName} ${shipping.lastName}`.trim(),
          line1: shipping.address1,
          line2: shipping.address2,
          city: shipping.city,
          state: shipping.state,
          zip: shipping.zip,
          country: shipping.country,
          phone: shipping.phone
        }
      });

      clearCart();
      setPlacedOrderId(order.id);
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Order failed");
    } finally {
      setPlacing(false);
    }
  };

  if (placedOrderId) {
    return <OrderConfirmed orderId={placedOrderId} total={total} email={shipping.email} delivery={delivery} deliveryOptions={deliveryOptions} />;
  }

  return (
    <div className="pt-24 bg-ivory min-h-screen pb-20">
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between gap-6 mb-8">
          <div>
            <p className="text-eyebrow text-gold flex items-center gap-3"><Sparkles size={11} /> Secure Checkout</p>
            <h1 className="text-display text-4xl md:text-5xl mt-2">Complete your order.</h1>
          </div>
          <Link to="/profile" className="text-eyebrow text-muted-foreground hover:text-ink flex items-center gap-2">
            <ArrowLeft size={12} /> Return to bag
          </Link>
        </div>

        <Stepper step={step} />

        <div className="mt-10 grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">
          <div className="space-y-6">
            {step === 1 &&
            <StepCard title="Delivery details" eyebrow="Step 01" Ic={MapPin}>
                {addresses.length > 0 &&
              <div className="mb-6 grid sm:grid-cols-2 gap-3">
                    {addresses.map((a) =>
                <button
                  key={a.id}
                  type="button"
                  onClick={() =>
                  setShipping((s) => ({
                    ...s,
                    firstName: a.name.split(" ")[0] ?? s.firstName,
                    lastName: a.name.split(" ").slice(1).join(" ") || s.lastName,
                    address1: a.line1,
                    city: a.city,
                    zip: a.zip,
                    country: a.country,
                    phone: a.phone
                  }))
                  }
                  className="border border-border p-4 text-left hover:border-gold transition-colors bg-card">
                  
                        <p className="text-eyebrow text-muted-foreground">{a.label}{a.isDefault ? " · Default" : ""}</p>
                        <p className="text-sm mt-1">{a.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.line1}, {a.city}, {a.zip}, {a.country}</p>
                      </button>
                )}
                  </div>
              }
                <Field label="Email">
                  <input
                  value={shipping.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  type="email"
                  placeholder="you@example.com"
                  className={inputCls} />
                
                </Field>
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="First name">
                    <input value={shipping.firstName} onChange={(e) => setShipping({ ...shipping, firstName: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Last name">
                    <input value={shipping.lastName} onChange={(e) => setShipping({ ...shipping, lastName: e.target.value })} className={inputCls} />
                  </Field>
                </div>
                <Field label="Phone">
                  <input value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} placeholder="+39 02 0000 000" className={inputCls} />
                </Field>
                <Field label="Address">
                  <input value={shipping.address1} onChange={(e) => setShipping({ ...shipping, address1: e.target.value })} placeholder="Street and number" className={inputCls} />
                </Field>
                <Field label="Apartment, suite, etc. (optional)">
                  <input value={shipping.address2} onChange={(e) => setShipping({ ...shipping, address2: e.target.value })} className={inputCls} />
                </Field>
                <div className="grid md:grid-cols-3 gap-5">
                  <Field label="City">
                    <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Province / State">
                    <input value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Postal code">
                    <input value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} className={inputCls} />
                  </Field>
                </div>
                <Field label="Country">
                  <select value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} className={inputCls}>
                    {["Italy", "France", "Switzerland", "United Kingdom", "Germany", "Spain", "Netherlands", "Belgium", "United States", "Canada", "United Arab Emirates", "Japan", "Singapore"].map((c) =>
                  <option key={c}>{c}</option>
                  )}
                  </select>
                </Field>
                <label className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                  <input type="checkbox" className="accent-[var(--gold,#c9a84c)]" checked={shipping.saveAddress} onChange={(e) => setShipping({ ...shipping, saveAddress: e.target.checked })} />
                  Save this address to my salon for future orders
                </label>
              </StepCard>
            }

            {step === 2 &&
            <StepCard title="Delivery method" eyebrow="Step 02" Ic={Truck}>
                <div className="space-y-3">
                  {deliveryOptions.map((d) => {
                  const active = delivery === d.id;
                  return (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => setDelivery(d.id)}
                      className={`w-full flex items-center justify-between gap-4 p-5 border text-left transition-colors ${
                      active ? "border-gold bg-gold/5" : "border-border hover:border-ink/40 bg-card"}`
                      }>
                      
                        <div className="flex items-center gap-4">
                          <span className={`w-5 h-5 rounded-full border-2 grid place-items-center ${active ? "border-gold" : "border-border"}`}>
                            {active && <span className="w-2.5 h-2.5 rounded-full bg-gold" />}
                          </span>
                          <div>
                            <p className="text-display text-lg">{d.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{d.eta} · {d.note}</p>
                          </div>
                        </div>
                        <p className="text-display text-lg">{d.price === 0 ? "Free" : `$${d.price}`}</p>
                      </button>);

                })}
                </div>
                <div className="mt-6 border border-border bg-card p-5">
                  <label className="flex items-start gap-3 text-sm">
                    <input type="checkbox" className="mt-1 accent-[var(--gold,#c9a84c)]" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} />
                    <span className="flex-1">
                      <span className="flex items-center gap-2 text-display text-base"><Gift size={14} className="text-gold" /> Maison gift wrap, $25</span>
                      <span className="block text-xs text-muted-foreground mt-1">Velvet pouch, hand pressed paper, gold ribbon, handwritten note</span>
                    </span>
                  </label>
                  {giftWrap &&
                <textarea
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Add a private note (optional)"
                  rows={3}
                  maxLength={240}
                  className={`${inputCls} mt-4 resize-none`} />

                }
                </div>
              </StepCard>
            }

            {step === 3 &&
            <StepCard title="Payment" eyebrow="Step 03" Ic={CreditCard}>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {["card", "paypal", "cod"].map((m) => {
                  const active = payment.method === m;
                  const label = m === "card" ? "Credit Card" : m === "paypal" ? "PayPal" : "Cash on Delivery";
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayment({ ...payment, method: m })}
                      className={`p-4 border text-center text-sm transition-colors ${active ? "border-gold bg-gold/5" : "border-border hover:border-ink/40 bg-card"}`}>
                      
                        {label}
                      </button>);

                })}
                </div>

                {payment.method === "card" &&
              <>
                    {cards.length > 0 &&
                <div className="mb-5 grid sm:grid-cols-2 gap-3">
                        {cards.map((c) =>
                  <div key={c.id} className="border border-border p-4 bg-card">
                            <p className="text-eyebrow text-muted-foreground">{c.brand} · ending {c.last4}</p>
                            <p className="text-sm mt-1">{c.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Expires {c.exp}</p>
                          </div>
                  )}
                      </div>
                }
                    <Field label="Name on card">
                      <input value={payment.cardName} onChange={(e) => setPayment({ ...payment, cardName: e.target.value })} className={inputCls} />
                    </Field>
                    <Field label="Card number">
                      <input
                    value={payment.cardNumber}
                    onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
                    placeholder="0000 0000 0000 0000"
                    inputMode="numeric"
                    maxLength={23}
                    className={inputCls} />
                  
                    </Field>
                    <div className="grid grid-cols-2 gap-5">
                      <Field label="Expiry (MM/YY)">
                        <input
                      value={payment.expiry}
                      onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength={5}
                      inputMode="numeric"
                      className={inputCls} />
                    
                      </Field>
                      <Field label="CVC">
                        <input
                      value={payment.cvc}
                      onChange={(e) => setPayment({ ...payment, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      placeholder="123"
                      inputMode="numeric"
                      className={inputCls} />
                    
                      </Field>
                    </div>
                    <label className="flex items-center gap-3 text-sm text-muted-foreground mt-3">
                      <input type="checkbox" className="accent-[var(--gold,#c9a84c)]" checked={payment.saveCard} onChange={(e) => setPayment({ ...payment, saveCard: e.target.checked })} />
                      Save this card to my wallet
                    </label>
                    <p className="text-xs text-muted-foreground mt-4 flex items-center gap-2">
                      <Lock size={11} className="text-gold" /> Your card details are encrypted. We never store the full number.
                    </p>
                  </>
              }

                {payment.method === "paypal" &&
              <div className="border border-dashed border-border p-6 text-sm text-muted-foreground bg-card">
                    You will be redirected to PayPal after you place the order to complete payment securely.
                  </div>
              }
                {payment.method === "cod" &&
              <div className="border border-dashed border-border p-6 text-sm text-muted-foreground bg-card">
                    Pay in cash when your order is hand delivered. A $15 service fee will be added at the door.
                  </div>
              }
              </StepCard>
            }

            {step === 4 &&
            <StepCard title="Review your order" eyebrow="Step 04" Ic={CheckCircle2}>
                <div className="space-y-6">
                  <ReviewBlock title="Delivering to" onEdit={() => setStep(1)}>
                    <p className="text-sm">{shipping.firstName} {shipping.lastName}</p>
                    <p className="text-sm text-muted-foreground">{shipping.address1}{shipping.address2 ? `, ${shipping.address2}` : ""}</p>
                    <p className="text-sm text-muted-foreground">{shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}</p>
                    <p className="text-sm text-muted-foreground mt-1">{shipping.email} · {shipping.phone}</p>
                  </ReviewBlock>
                  <ReviewBlock title="Delivery method" onEdit={() => setStep(2)}>
                    <p className="text-sm">{deliveryOptions.find((d) => d.id === delivery)?.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{deliveryOptions.find((d) => d.id === delivery)?.eta}</p>
                    {giftWrap && <p className="text-xs text-gold mt-2">Gift wrapped · {giftNote ? `“${giftNote}”` : "No note"}</p>}
                  </ReviewBlock>
                  <ReviewBlock title="Payment" onEdit={() => setStep(3)}>
                    {payment.method === "card" ?
                  <p className="text-sm">{detectBrand(payment.cardNumber)} ending {payment.cardNumber.replace(/\s+/g, "").slice(-4) || "0000"}</p> :
                  payment.method === "paypal" ?
                  <p className="text-sm">PayPal</p> :

                  <p className="text-sm">Cash on Delivery</p>
                  }
                  </ReviewBlock>

                  <label className="flex items-start gap-3 text-sm text-muted-foreground">
                    <input type="checkbox" className="mt-1 accent-[var(--gold,#c9a84c)]" checked={agreeTos} onChange={(e) => setAgreeTos(e.target.checked)} />
                    I agree to the Maison Vera Terms of Sale and Privacy Promise.
                  </label>
                </div>
              </StepCard>
            }

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onBack}
                disabled={step === 1}
                className="inline-flex items-center gap-2 px-5 py-3 border border-border text-eyebrow disabled:opacity-30 hover:border-ink transition-colors">
                
                <ArrowLeft size={12} /> Back
              </button>
              {step < 4 ?
              <button onClick={onNext} className="btn-luxe btn-luxe-hover">
                  Continue <ArrowRight size={12} />
                </button> :

              <button onClick={onPlaceOrder} disabled={placing || !agreeTos} className="btn-luxe btn-luxe-hover disabled:opacity-60">
                  {placing ? "Placing order…" : "Place order"} <Lock size={12} />
                </button>
              }
            </div>
          </div>

          {/* ===== Summary ===== */}
          <aside className="lg:sticky lg:top-28">
            <div className="border border-border bg-card">
              <div className="p-6 border-b border-border">
                <p className="text-eyebrow text-muted-foreground mb-3">Order summary · {cart.length} {cart.length === 1 ? "piece" : "pieces"}</p>
                <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                  {cart.map((i) =>
                  <div key={i.product.id + (i.size ?? "")} className="flex gap-3">
                      <div className="relative w-16 h-20 bg-secondary shrink-0">
                        <img src={i.product.image} alt={i.product.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 grid place-items-center rounded-full bg-ink text-ivory text-[10px]">{i.qty}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">{i.product.category}</p>
                        <p className="text-sm truncate">{i.product.name}</p>
                        {i.size && <p className="text-[10px] text-muted-foreground">Size {i.size}</p>}
                      </div>
                      <p className="text-sm whitespace-nowrap">${(i.product.price * i.qty).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-b border-border space-y-3 text-sm">
                <div className="flex gap-2">
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Promotion code"
                    className={`${inputCls} text-xs`} />
                  
                  <button onClick={applyPromo} className="px-4 py-2 border border-border text-eyebrow hover:border-gold hover:text-gold transition-colors">Apply</button>
                </div>
                {appliedPromo &&
                <p className="text-xs text-emerald flex items-center gap-2"><Check size={12} /> {appliedPromo.code} applied · {appliedPromo.discount}% off</p>
                }
                <p className="text-[11px] text-muted-foreground">Try VERA10 · MAISON15 · ATELIER20</p>
              </div>

              <div className="p-6 space-y-3 text-sm">
                <Row label="Subtotal" value={`$${subtotal.toLocaleString()}`} />
                <Row label={`Delivery, ${deliveryOptions.find((d) => d.id === delivery)?.label.toLowerCase()}`} value={deliveryFee === 0 ? "Complimentary" : `$${deliveryFee}`} />
                {giftWrap && <Row label="Gift wrap" value={`$${giftFee}`} />}
                <Row label="VAT (estimated)" value={`$${vat.toLocaleString()}`} />
                {discount > 0 && <Row label={`Discount (${appliedPromo.code})`} value={`- $${discount.toLocaleString()}`} accent />}
                <div className="border-t border-border pt-3 flex justify-between items-baseline">
                  <span className="text-display text-lg">Total</span>
                  <span className="text-display text-2xl">${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-secondary/50 text-xs text-muted-foreground space-y-2">
                <p className="flex items-center gap-2"><Lock size={11} className="text-gold" /> Encrypted checkout, never shared</p>
                <p className="flex items-center gap-2"><Package size={11} className="text-gold" /> Free returns within 30 days</p>
                <p className="flex items-center gap-2"><Sparkles size={11} className="text-gold" /> Lifetime restoration on every piece</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>);

}

const inputCls =
"w-full bg-background border border-border focus:border-gold px-4 py-3 outline-none transition-colors text-sm";

function Field({ label, children }) {
  return (
    <div>
      <label className="text-eyebrow text-muted-foreground mb-2 block">{label}</label>
      {children}
    </div>);

}

function StepCard({ title, eyebrow, Ic, children }) {
  return (
    <div className="border border-border bg-card p-6 lg:p-8 relative">
      <span aria-hidden className="absolute top-3 left-3 w-8 h-px bg-gold" />
      <span aria-hidden className="absolute top-3 left-3 w-px h-8 bg-gold" />
      <div className="flex items-center gap-3 mb-1">
        <Ic size={14} className="text-gold" />
        <p className="text-eyebrow text-muted-foreground">{eyebrow}</p>
      </div>
      <h2 className="text-display text-2xl md:text-3xl mb-6">{title}</h2>
      <div className="space-y-5">{children}</div>
    </div>);

}

function ReviewBlock({ title, onEdit, children }) {
  return (
    <div className="border border-border p-5 bg-background">
      <div className="flex items-center justify-between mb-2">
        <p className="text-eyebrow text-muted-foreground">{title}</p>
        <button onClick={onEdit} className="text-eyebrow text-gold hover:underline">Edit</button>
      </div>
      {children}
    </div>);

}

function Row({ label, value, accent = false }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "text-emerald" : ""}>{value}</span>
    </div>);

}

function Stepper({ step }) {
  const items = [
  { n: 1, l: "Delivery", Ic: MapPin },
  { n: 2, l: "Method", Ic: Truck },
  { n: 3, l: "Payment", Ic: CreditCard },
  { n: 4, l: "Review", Ic: CheckCircle2 }];

  return (
    <div className="border border-border bg-card p-4 lg:p-5">
      <div className="flex items-center justify-between gap-2">
        {items.map((it, i) => {
          const done = step > it.n;
          const active = step === it.n;
          return (
            <div key={it.n} className="flex-1 flex items-center gap-3 min-w-0">
              <div className={`shrink-0 w-9 h-9 grid place-items-center rounded-full border ${
              active ? "border-gold bg-gold text-ink" : done ? "border-gold text-gold" : "border-border text-muted-foreground"}`
              }>
                {done ? <Check size={14} /> : <it.Ic size={14} />}
              </div>
              <div className="hidden sm:block min-w-0">
                <p className="text-eyebrow text-muted-foreground">Step {String(it.n).padStart(2, "0")}</p>
                <p className={`text-sm truncate ${active ? "text-ink" : done ? "text-ink" : "text-muted-foreground"}`}>{it.l}</p>
              </div>
              {i < items.length - 1 && <span className={`flex-1 h-px ${done ? "bg-gold" : "bg-border"}`} />}
            </div>);

        })}
      </div>
    </div>);

}

function OrderConfirmed({ orderId, total, email, delivery, deliveryOptions }) {
  const opt = deliveryOptions.find((d) => d.id === delivery) ?? FALLBACK_DELIVERY[0];
  return (
    <div className="pt-32 pb-24 bg-ivory min-h-screen">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gold/15 grid place-items-center mx-auto mb-6">
          <Check size={36} className="text-gold" strokeWidth={1.4} />
        </div>
        <p className="text-eyebrow text-gold mb-3">Order confirmed</p>
        <h1 className="text-display text-5xl md:text-6xl leading-[1.05]">Thank you, the atelier <em className="text-gold not-italic italic">has your order.</em></h1>
        <p className="text-muted-foreground mt-6 leading-relaxed">
          A confirmation has been sent to <span className="text-ink">{email}</span>. Your concierge will write
          shortly with delivery details.
        </p>
        <div className="mt-10 border border-border bg-card p-6 text-left grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-eyebrow text-muted-foreground">Order number</p>
            <p className="text-display text-2xl mt-1">{orderId}</p>
          </div>
          <div>
            <p className="text-eyebrow text-muted-foreground">Total charged</p>
            <p className="text-display text-2xl mt-1">${total.toLocaleString()}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-eyebrow text-muted-foreground">Delivery</p>
            <p className="text-sm mt-1">{opt.label} · {opt.eta}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/profile" className="btn-luxe btn-luxe-hover">View my orders <ArrowRight size={12} /></Link>
          <Link to="/shop" className="btn-ghost-luxe">Continue shopping</Link>
        </div>
      </div>
    </div>);

}

function formatCardNumber(v) {
  const digits = v.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(v) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

function detectBrand(num) {
  const n = num.replace(/\s+/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "American Express";
  if (/^6/.test(n)) return "Discover";
  return "Card";
}