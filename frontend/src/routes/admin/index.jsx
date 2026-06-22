import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import {
  Package, Tag, Star, TrendingUp, Plus, LayoutGrid, LogOut,
  Sparkles, Users, ShoppingBag, ShieldOff, Clock, MessageSquare } from
"lucide-react";
import { useAdmin } from "@/lib/admin-store";
import { useUsersRegistry } from "@/lib/users-registry";
import { categoryList } from "@/lib/products";
import { fetchContactMessages } from "@/lib/api/adminApi";

/** Polls the backend every 30s and returns count of unread messages */
function useNewMessageCount() {
  const { isAuth } = useAdmin();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!isAuth) return;
    try {
      const msgs = await fetchContactMessages(true); // unread only
      setCount(Array.isArray(msgs) ? msgs.length : 0);
    } catch {

      // silently ignore — don't break the sidebar
    }}, [isAuth]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  return count;
}

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard
});

function AdminDashboard() {
  const { isAuth, logout, products } = useAdmin();
  const { users, orders } = useUsersRegistry();
  const nav = useNavigate();

  useEffect(() => {
    if (!isAuth) nav({ to: "/admin/login" });
  }, [isAuth, nav]);

  if (!isAuth) return null;

  const totalProducts = products.length;
  const onSale = products.filter((p) => p.oldPrice !== undefined).length;
  const avgRating = totalProducts ?
  (products.reduce((s, p) => s + p.rating, 0) / totalProducts).toFixed(1) :
  "—";
  const added = products.filter((p) => p._added).length;

  const activeUsers = users.filter((u) => u.status === "active").length;
  const blockedUsers = users.filter((u) => u.status === "blocked").length;
  const pendingOrders = orders.filter((o) => o.status === "Processing").length;
  const totalRevenue = orders.
  filter((o) => o.status !== "Cancelled").
  reduce((s, o) => s + o.total, 0);

  const catCounts = categoryList.map((c) => ({
    name: c.name,
    slug: c.slug,
    count: products.filter((p) => p.category === c.name).length
  }));

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.008_85)] flex">
      <AdminSidebar active="dashboard" />
      <main className="flex-1 p-8 lg:p-12 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-eyebrow text-gold mb-1 flex items-center gap-2">
              <Sparkles size={11} /> Maison Vera
            </p>
            <h1 className="text-display text-4xl text-ink">Atelier Dashboard</h1>
          </div>

          {/* Product stats */}
          <p className="text-eyebrow text-muted-foreground mb-3" style={{ fontFamily: "var(--font-sans)" }}>
            Catalogue
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Package} label="Total Products" value={totalProducts} />
            <StatCard icon={Tag} label="On Sale" value={onSale} />
            <StatCard icon={Star} label="Avg. Rating" value={avgRating} />
            <StatCard icon={TrendingUp} label="Admin Added" value={added} />
          </div>

          {/* User + Order stats */}
          <p className="text-eyebrow text-muted-foreground mb-3" style={{ fontFamily: "var(--font-sans)" }}>
            Members & Commerce
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard icon={Users} label="Total Members" value={users.length} />
            <StatCard icon={ShieldOff} label="Blocked" value={blockedUsers} accent="red" />
            <StatCard icon={Clock} label="Pending Orders" value={pendingOrders} accent="amber" />
            <StatCard icon={ShoppingBag} label="Revenue" value={`€${totalRevenue.toLocaleString()}`} accent="gold" />
          </div>

          {/* Quick links */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Link
              to="/admin/users/"
              className="bg-ink text-ivory p-5 hover:bg-emerald transition-colors group border border-ink hover:border-emerald">
              
              <Users size={18} className="text-gold mb-3" strokeWidth={1.2} />
              <p className="text-display text-xl">Manage Members</p>
              <p className="text-eyebrow text-ivory/50 mt-1 text-[0.6rem]">
                {activeUsers} active · {blockedUsers} blocked
              </p>
            </Link>
            <Link
              to="/admin/orders/"
              className="bg-ink text-ivory p-5 hover:bg-emerald transition-colors group border border-ink hover:border-emerald">
              
              <ShoppingBag size={18} className="text-gold mb-3" strokeWidth={1.2} />
              <p className="text-display text-xl">Manage Orders</p>
              <p className="text-eyebrow text-ivory/50 mt-1 text-[0.6rem]">
                {pendingOrders} pending · {orders.length} total
              </p>
            </Link>
            <Link
              to="/admin/products/new"
              className="bg-gold text-ink p-5 hover:bg-ivory transition-colors border border-gold hover:border-ink">
              
              <Plus size={18} className="mb-3" strokeWidth={1.5} />
              <p className="text-display text-xl">Add Product</p>
              <p className="text-eyebrow text-ink/50 mt-1 text-[0.6rem]">New piece to the Maison</p>
            </Link>
          </div>

          {/* Reviews + Coupons + Messages */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <Link
              to="/admin/reviews/"
              className="bg-white border border-border p-5 hover:border-gold transition-colors group">
              
              <Star size={18} className="text-gold mb-3" strokeWidth={1.2} />
              <p className="text-display text-xl text-ink group-hover:text-gold transition-colors">Reviews</p>
              <p className="text-eyebrow text-muted-foreground mt-1 text-[0.6rem]">Approve & reply</p>
            </Link>
            <Link
              to="/admin/coupons/"
              className="bg-white border border-border p-5 hover:border-gold transition-colors group">
              
              <Tag size={18} className="text-gold mb-3" strokeWidth={1.2} />
              <p className="text-display text-xl text-ink group-hover:text-gold transition-colors">Coupons</p>
              <p className="text-eyebrow text-muted-foreground mt-1 text-[0.6rem]">Manage discount codes</p>
            </Link>
            <Link
              to="/admin/messages/"
              className="bg-white border border-border p-5 hover:border-gold transition-colors group">
              
              <MessageSquare size={18} className="text-gold mb-3" strokeWidth={1.2} />
              <p className="text-display text-xl text-ink group-hover:text-gold transition-colors">Messages</p>
              <p className="text-eyebrow text-muted-foreground mt-1 text-[0.6rem]">Contact submissions</p>
            </Link>
          </div>

          {/* Products by category */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-display text-2xl text-ink">Products by Category</h2>
            <Link
              to="/admin/products"
              className="btn-luxe btn-luxe-hover inline-flex items-center gap-2 text-xs">
              
              <LayoutGrid size={13} /> Manage All
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catCounts.map((c) =>
            <Link
              key={c.slug}
              to="/admin/products"
              search={{ category: c.name }}
              className="bg-white border border-border p-5 hover:border-gold transition-colors group">
              
                <div className="flex items-center justify-between mb-2">
                  <p className="text-display text-xl text-ink group-hover:text-gold transition-colors leading-tight">
                    {c.name}
                  </p>
                  <span className="text-eyebrow text-gold bg-gold/10 px-3 py-1">{c.count}</span>
                </div>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
                  {c.count} product{c.count !== 1 ? "s" : ""}
                </p>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>);

}

function StatCard({
  icon: Icon, label, value, accent


}) {
  const c = accent === "red" ? "text-red-500" : accent === "amber" ? "text-amber-600" : "text-gold";
  return (
    <div className="bg-white border border-border p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-gold/10 flex items-center justify-center">
          <Icon size={16} className={accent ? c : "text-gold"} />
        </div>
        <p className="text-eyebrow text-muted-foreground text-[0.6rem]" style={{ fontFamily: "var(--font-sans)" }}>
          {label}
        </p>
      </div>
      <p className={`text-display text-3xl ${accent ? c : "text-ink"}`}>{value}</p>
    </div>);

}



export function AdminSidebar({ active }) {
  const { logout } = useAdmin();
  const nav = useNavigate();
  const newMessageCount = useNewMessageCount();

  const handleLogout = () => {
    logout();
    nav({ to: "/" });
  };

  return (
    <aside className="hidden lg:flex w-60 bg-ink text-ivory flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
      <div className="p-6 border-b border-ivory/10">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="relative w-8 h-8 grid place-items-center">
            <span className="absolute inset-0 border border-ivory/40 rotate-45" />
            <span className="absolute inset-1.5 border border-gold rotate-45" />
            <span className="relative text-display text-sm text-gold">V</span>
          </span>
          <div className="text-display text-lg">MAISON<span className="text-gold">VERA</span></div>
        </Link>
        <p className="text-eyebrow text-ivory/30 text-[0.55rem] mt-2" style={{ fontFamily: "var(--font-sans)" }}>
          Administration Panel
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <p className="text-eyebrow text-ivory/30 text-[0.55rem] px-3 mb-3 mt-4" style={{ fontFamily: "var(--font-sans)" }}>
          Overview
        </p>
        <NavLink to="/admin/" icon={Sparkles} label="Dashboard" active={active === "dashboard"} />

        <p className="text-eyebrow text-ivory/30 text-[0.55rem] px-3 mb-3 mt-6" style={{ fontFamily: "var(--font-sans)" }}>
          Catalogue
        </p>
        <NavLink to="/admin/products" icon={Package} label="Products" active={active === "products"} />
        <NavLink to="/admin/products/new" icon={Plus} label="Add Product" active={false} />

        <p className="text-eyebrow text-ivory/30 text-[0.55rem] px-3 mb-3 mt-6" style={{ fontFamily: "var(--font-sans)" }}>
          Members & Commerce
        </p>
        <NavLink to="/admin/users/" icon={Users} label="Users" active={active === "users"} />
        <NavLink to="/admin/orders/" icon={ShoppingBag} label="Orders" active={active === "orders"} />
        <NavLink to="/admin/coupons/" icon={Tag} label="Coupons" active={active === "coupons"} />

        <p className="text-eyebrow text-ivory/30 text-[0.55rem] px-3 mb-3 mt-6" style={{ fontFamily: "var(--font-sans)" }}>
          Reviews & Messages
        </p>
        <NavLink to="/admin/reviews/" icon={Star} label="Reviews" active={active === "reviews"} />
        <NavLink to="/admin/messages/" icon={MessageSquare} label="Contact Messages" active={active === "messages"} badge={newMessageCount} />

        <p className="text-eyebrow text-ivory/30 text-[0.55rem] px-3 mb-3 mt-6" style={{ fontFamily: "var(--font-sans)" }}>
          Site
        </p>
        <NavLink to="/" icon={LayoutGrid} label="View Store" active={false} />
      </nav>

      <div className="p-4 border-t border-ivory/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-ivory/60 hover:text-ivory hover:bg-ivory/5 transition-colors text-eyebrow text-[0.65rem]"
          style={{ fontFamily: "var(--font-sans)" }}>
          
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>);

}

function NavLink({
  to, icon: Icon, label, active, badge


}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 text-eyebrow text-[0.65rem] transition-colors ${
      active ?
      "bg-gold/20 text-gold border-l-2 border-gold pl-[10px]" :
      "text-ivory/60 hover:text-ivory hover:bg-ivory/5"}`
      }
      style={{ fontFamily: "var(--font-sans)" }}>
      
      <Icon size={14} /> {label}
      {badge != null && badge > 0 &&
      <span
        style={{
          marginLeft: "auto",
          minWidth: "18px",
          height: "18px",
          fontSize: "0.6rem",
          lineHeight: "18px",
          textAlign: "center",
          borderRadius: "9999px",
          backgroundColor: "#ef4444",
          color: "#fff",
          padding: "0 5px",
          display: "inline-block",
          animation: "msg-bounce 0.7s infinite alternate cubic-bezier(0.36,0.07,0.19,0.97)"
        }}>
        
          {badge > 99 ? "99+" : badge}
        </span>
      }
    </Link>);

}