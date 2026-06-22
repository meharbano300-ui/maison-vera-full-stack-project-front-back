import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  Users, Search, ShieldOff, ShieldCheck, Trash2, Mail,
  Phone, Calendar, ShoppingBag, Heart, ChevronDown, Sparkles } from
"lucide-react";
import { useAdmin } from "@/lib/admin-store";
import { useUsersRegistry } from "@/lib/users-registry";
import { AdminSidebar } from "../index";

export const Route = createFileRoute("/admin/users/")({
  component: AdminUsers
});

const STATUS_COLORS = {
  active: "text-emerald bg-emerald/10",
  blocked: "text-red-500 bg-red-500/10"
};

function AdminUsers() {
  const { isAuth } = useAdmin();
  const nav = useNavigate();
  const { users, blockUser, unblockUser, deleteUser } = useUsersRegistry();

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!isAuth) nav({ to: "/admin/login" });
  }, [isAuth, nav]);

  if (!isAuth) return null;

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchQ =
      !q ||
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase());
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [users, q, statusFilter]);

  const handleDelete = (email) => {
    if (confirmDelete === email) {
      deleteUser(email);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(email);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.008_85)] flex">
      <AdminSidebar active="users" />
      <main className="flex-1 p-8 lg:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-eyebrow text-gold mb-1 flex items-center gap-2">
                <Sparkles size={11} /> Members
              </p>
              <h1 className="text-display text-4xl text-ink">User Management</h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white border border-border px-3 py-2">
                <Search size={14} className="text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name or email…"
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
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatBadge label="Total Members" value={users.length} icon={Users} />
            <StatBadge label="Active" value={users.filter((u) => u.status === "active").length} icon={ShieldCheck} color="emerald" />
            <StatBadge label="Blocked" value={users.filter((u) => u.status === "blocked").length} icon={ShieldOff} color="red" />
          </div>

          {filtered.length === 0 ?
          <div className="bg-white border border-dashed border-border p-16 text-center">
              <Users size={32} className="text-muted-foreground mx-auto mb-4" strokeWidth={1.2} />
              <p className="text-display text-2xl text-ink mb-2">No members yet</p>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
                Users will appear here once they sign up or sign in on the storefront.
              </p>
            </div> :

          <div className="space-y-2">
              {filtered.map((u) =>
            <UserRow
              key={u.email}
              user={u}
              expanded={expanded === u.email}
              confirmDelete={confirmDelete === u.email}
              onToggle={() => setExpanded(expanded === u.email ? null : u.email)}
              onBlock={() => blockUser(u.email)}
              onUnblock={() => unblockUser(u.email)}
              onDelete={() => handleDelete(u.email)} />

            )}
            </div>
          }
        </div>
      </main>
    </div>);

}

function UserRow({
  user,
  expanded,
  confirmDelete,
  onToggle,
  onBlock,
  onUnblock,
  onDelete








}) {
  return (
    <div className={`bg-white border transition-colors ${expanded ? "border-gold/60" : "border-border hover:border-gold/40"}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left">
        
        {/* Avatar */}
        <div className="w-10 h-10 bg-ink text-ivory flex items-center justify-center text-display text-lg shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-display text-lg text-ink truncate">{user.name}</p>
            <span className={`text-eyebrow text-[0.55rem] px-2 py-0.5 ${STATUS_COLORS[user.status]}`}>
              {user.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate" style={{ fontFamily: "var(--font-sans)" }}>
            {user.email}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-xs text-muted-foreground shrink-0" style={{ fontFamily: "var(--font-sans)" }}>
          <span className="flex items-center gap-1.5"><ShoppingBag size={12} /> {user.orderCount ?? 0} orders</span>
          <span className="flex items-center gap-1.5"><Heart size={12} /> {user.wishlist?.length ?? 0} saved</span>
          <span className="text-eyebrow text-[0.55rem]">Joined {user.joinedAt}</span>
        </div>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform ml-2 shrink-0 ${expanded ? "rotate-180" : ""}`} />
        
      </button>

      {expanded &&
      <div className="border-t border-border px-4 pb-4 pt-4 animate-fade-up">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Detail icon={Mail} label="Email" value={user.email} />
            <Detail icon={Phone} label="Phone" value={user.phone || "—"} />
            <Detail icon={Calendar} label="Joined" value={user.joinedAt} />
            <Detail icon={Calendar} label="Last seen" value={user.lastSeen} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Detail icon={ShoppingBag} label="Total orders" value={String(user.orderCount ?? 0)} />
            <Detail icon={Heart} label="Wishlist items" value={String(user.wishlist?.length ?? 0)} />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {user.status === "active" ?
          <button
            onClick={onBlock}
            className="flex items-center gap-2 px-4 py-2 text-xs border border-red-400 text-red-500 hover:bg-red-50 transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}>
            
                <ShieldOff size={13} /> Block User
              </button> :

          <button
            onClick={onUnblock}
            className="flex items-center gap-2 px-4 py-2 text-xs border border-emerald text-emerald hover:bg-emerald/5 transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}>
            
                <ShieldCheck size={13} /> Unblock User
              </button>
          }
            <button
            onClick={onDelete}
            className={`flex items-center gap-2 px-4 py-2 text-xs border transition-colors ${
            confirmDelete ?
            "border-red-500 bg-red-500 text-white" :
            "border-border text-muted-foreground hover:border-red-400 hover:text-red-500"}`
            }
            style={{ fontFamily: "var(--font-sans)" }}>
            
              <Trash2 size={13} />
              {confirmDelete ? "Click again to confirm" : "Delete from Registry"}
            </button>
          </div>
        </div>
      }
    </div>);

}

function Detail({ icon: Icon, label, value }) {
  return (
    <div>
      <p className="text-eyebrow text-muted-foreground text-[0.6rem] mb-1 flex items-center gap-1.5" style={{ fontFamily: "var(--font-sans)" }}>
        <Icon size={11} /> {label}
      </p>
      <p className="text-sm text-ink" style={{ fontFamily: "var(--font-sans)" }}>{value}</p>
    </div>);

}

function StatBadge({
  label, value, icon: Icon, color


}) {
  const c = color === "emerald" ? "text-emerald" : color === "red" ? "text-red-500" : "text-gold";
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