import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  ShoppingBag, Search, ChevronDown, Clock, Truck, CheckCircle2,
  XCircle, Sparkles, Package, Filter } from
"lucide-react";
import { useAdmin } from "@/lib/admin-store";
import { useUsersRegistry } from "@/lib/users-registry";
import { AdminSidebar } from "../index";

export const Route = createFileRoute("/admin/orders/")({
  component: AdminOrders
});

const STATUS_CONFIG = {
  "Processing": { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  "In Transit": { icon: Truck, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  "Delivered": { icon: CheckCircle2, color: "text-emerald", bg: "bg-emerald/10 border-emerald/30" },
  "Cancelled": { icon: XCircle, color: "text-red-500", bg: "bg-red-50 border-red-200" }
};

const STATUSES = ["Processing", "In Transit", "Delivered", "Cancelled"];

function AdminOrders() {
  const { isAuth } = useAdmin();
  const nav = useNavigate();
  const { orders, updateOrderStatus } = useUsersRegistry();

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!isAuth) nav({ to: "/admin/login" });
  }, [isAuth, nav]);

  if (!isAuth) return null;

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchQ =
      !q ||
      o.id.toLowerCase().includes(q.toLowerCase()) ||
      o.userName.toLowerCase().includes(q.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(q.toLowerCase());
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [orders, q, statusFilter]);

  const revenue = orders.
  filter((o) => o.status !== "Cancelled").
  reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.008_85)] flex">
      <AdminSidebar active="orders" />
      <main className="flex-1 p-8 lg:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-eyebrow text-gold mb-1 flex items-center gap-2">
                <Sparkles size={11} /> Commerce
              </p>
              <h1 className="text-display text-4xl text-ink">Order Management</h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white border border-border px-3 py-2">
                <Search size={14} className="text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search order ID or customer…"
                  className="text-sm outline-none bg-transparent placeholder:text-muted-foreground/50 w-52"
                  style={{ fontFamily: "var(--font-sans)" }} />
                
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-border px-4 py-2 pr-8 text-sm outline-none focus:border-gold appearance-none cursor-pointer"
                  style={{ fontFamily: "var(--font-sans)" }}>
                  
                  <option value="all">All Status</option>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <OrderStat label="Total Orders" value={orders.length} icon={ShoppingBag} />
            <OrderStat label="Processing" value={orders.filter((o) => o.status === "Processing").length} icon={Clock} color="amber" />
            <OrderStat label="In Transit" value={orders.filter((o) => o.status === "In Transit").length} icon={Truck} color="blue" />
            <OrderStat label="Revenue" value={`€${revenue.toLocaleString()}`} icon={Package} color="gold" />
          </div>

          {/* Status pipeline */}
          <div className="grid grid-cols-4 gap-2 mb-8">
            {STATUSES.map((s) => {
              const { icon: Icon, color, bg } = STATUS_CONFIG[s];
              const count = orders.filter((o) => o.status === s).length;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
                  className={`border p-3 text-left transition-all ${statusFilter === s ? bg + " border-opacity-80" : "bg-white border-border hover:border-gold/40"}`}>
                  
                  <Icon size={15} className={`${color} mb-2`} strokeWidth={1.5} />
                  <p className="text-display text-xl text-ink">{count}</p>
                  <p className={`text-eyebrow text-[0.6rem] mt-0.5 ${color}`}>{s}</p>
                </button>);

            })}
          </div>

          {filtered.length === 0 ?
          <div className="bg-white border border-dashed border-border p-16 text-center">
              <ShoppingBag size={32} className="text-muted-foreground mx-auto mb-4" strokeWidth={1.2} />
              <p className="text-display text-2xl text-ink mb-2">No orders yet</p>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
                Orders will appear here once customers complete checkout on the storefront.
              </p>
            </div> :

          <div className="space-y-2">
              {filtered.map((o) =>
            <OrderRow
              key={o.id}
              order={o}
              expanded={expanded === o.id}
              onToggle={() => setExpanded(expanded === o.id ? null : o.id)}
              onUpdateStatus={(s) => updateOrderStatus(o.id, s)} />

            )}
            </div>
          }
        </div>
      </main>
    </div>);

}

function OrderRow({
  order, expanded, onToggle, onUpdateStatus





}) {
  const { icon: Icon, color, bg } = STATUS_CONFIG[order.status];

  return (
    <div className={`bg-white border transition-colors ${expanded ? "border-gold/60" : "border-border hover:border-gold/40"}`}>
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-4 text-left">
        <div className={`px-3 py-1 border text-eyebrow text-[0.6rem] flex items-center gap-1.5 shrink-0 ${bg} ${color}`}>
          <Icon size={11} /> {order.status}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-display text-lg text-ink">{order.id}</p>
          <p className="text-xs text-muted-foreground truncate" style={{ fontFamily: "var(--font-sans)" }}>
            {order.userName} · {order.userEmail}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-xs text-muted-foreground shrink-0" style={{ fontFamily: "var(--font-sans)" }}>
          <span>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
          <span className="text-display text-base text-ink">€{order.total.toLocaleString()}</span>
          <span className="text-eyebrow text-[0.55rem]">{order.date}</span>
        </div>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform ml-2 shrink-0 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded &&
      <div className="border-t border-border px-4 pb-4 pt-4 animate-fade-up">
          {/* Items */}
          <p className="text-eyebrow text-muted-foreground mb-3" style={{ fontFamily: "var(--font-sans)" }}>Order items</p>
          <div className="space-y-2 mb-6">
            {order.items.map((item, i) =>
          <div key={i} className="flex items-center gap-3 bg-[oklch(0.97_0.008_85)] px-3 py-2">
                {item.image &&
            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover bg-secondary shrink-0" />
            }
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink truncate" style={{ fontFamily: "var(--font-sans)" }}>{item.name}</p>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>Qty: {item.qty}</p>
                </div>
                <p className="text-display text-base text-ink shrink-0">€{(item.price * item.qty).toLocaleString()}</p>
              </div>
          )}
            <div className="flex justify-end pr-2">
              <p className="text-display text-xl text-ink">Total: €{order.total.toLocaleString()}</p>
            </div>
          </div>

          {/* Update status */}
          <div>
            <p className="text-eyebrow text-muted-foreground mb-3" style={{ fontFamily: "var(--font-sans)" }}>Update order status</p>
            <div className="flex gap-2 flex-wrap">
              {STATUSES.map((s) => {
              const { icon: SIcon, color: sc } = STATUS_CONFIG[s];
              const isActive = order.status === s;
              return (
                <button
                  key={s}
                  onClick={() => !isActive && onUpdateStatus(s)}
                  disabled={isActive}
                  className={`flex items-center gap-1.5 px-3 py-2 text-eyebrow text-[0.6rem] border transition-colors ${
                  isActive ?
                  "bg-ink text-ivory border-ink cursor-default" :
                  `border-border hover:border-gold hover:${sc} text-muted-foreground`}`
                  }
                  style={{ fontFamily: "var(--font-sans)" }}>
                  
                    <SIcon size={11} /> {s}
                  </button>);

            })}
            </div>
          </div>
        </div>
      }
    </div>);

}

function OrderStat({
  label, value, icon: Icon, color





}) {
  const c = color === "amber" ? "text-amber-600" : color === "blue" ? "text-blue-600" : color === "gold" ? "text-gold" : "text-gold";
  return (
    <div className="bg-white border border-border p-5 flex items-center gap-4">
      <div className={`w-9 h-9 flex items-center justify-center bg-ink/5 ${c}`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-eyebrow text-muted-foreground text-[0.6rem]" style={{ fontFamily: "var(--font-sans)" }}>{label}</p>
        <p className={`text-display text-2xl ${c}`}>{value}</p>
      </div>
    </div>);

}