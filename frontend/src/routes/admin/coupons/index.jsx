import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Tag, Plus, Trash2, Pencil, Check, X, Sparkles, ToggleLeft, ToggleRight } from "lucide-react";
import { useAdmin } from "@/lib/admin-store";
import { AdminSidebar } from "../index";
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/lib/api/adminApi";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/coupons/")({
  component: AdminCoupons
});















const empty = {
  code: "",
  type: "percent",
  value: 10,
  minOrder: 0,
  maxUses: "",
  expiresAt: "",
  description: "",
  isActive: true
};

export default function AdminCoupons() {
  const { isAuth } = useAdmin();
  const nav = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCode, setEditCode] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuth) nav({ to: "/admin/login" });
  }, [isAuth, nav]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchCoupons();
      setCoupons(data);
    } catch {
      toast.error("Could not load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) load();
  }, [isAuth]);

  const handleSave = async () => {
    if (!form.code.trim()) return toast.error("Code is required");
    setSaving(true);
    try {
      const payload = {
        ...form,
        code: form.code.toUpperCase(),
        value: Number(form.value),
        minOrder: Number(form.minOrder),
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        expiresAt: form.expiresAt || undefined
      };
      if (editCode) {
        const updated = await updateCoupon(editCode, payload);
        setCoupons((prev) => prev.map((c) => c.code === editCode ? updated : c));
        toast.success("Coupon updated");
      } else {
        const created = await createCoupon(payload);
        setCoupons((prev) => [created, ...prev]);
        toast.success("Coupon created");
      }
      setShowForm(false);
      setEditCode(null);
      setForm(empty);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (c) => {
    setEditCode(c.code);
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      minOrder: c.minOrder,
      maxUses: c.maxUses ? String(c.maxUses) : "",
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "",
      description: c.description || "",
      isActive: c.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (code) => {
    if (!confirm(`Delete coupon ${code}?`)) return;
    try {
      await deleteCoupon(code);
      setCoupons((prev) => prev.filter((c) => c.code !== code));
      toast.success("Coupon deleted");
    } catch {
      toast.error("Could not delete coupon");
    }
  };

  const handleToggleActive = async (c) => {
    try {
      const updated = await updateCoupon(c.code, { isActive: !c.isActive });
      setCoupons((prev) => prev.map((x) => x.code === c.code ? updated : x));
      toast.success(updated.isActive ? "Coupon activated" : "Coupon deactivated");
    } catch {
      toast.error("Could not update coupon");
    }
  };

  if (!isAuth) return null;

  const field = "var(--font-sans)";

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.008_85)] flex">
      <AdminSidebar active="coupons" />
      <main className="flex-1 p-8 lg:p-12 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="text-eyebrow text-gold mb-1 flex items-center gap-2">
                <Sparkles size={11} /> Promotions
              </p>
              <h1 className="text-display text-4xl text-ink">Coupon Codes</h1>
            </div>
            <button
              onClick={() => {setShowForm(true);setEditCode(null);setForm(empty);}}
              className="btn-luxe btn-luxe-hover flex items-center gap-2">
              
              <Plus size={13} /> New Coupon
            </button>
          </div>

          {/* Create / Edit form */}
          {showForm &&
          <div className="bg-white border border-gold p-6 mb-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-display text-xl text-ink">
                  {editCode ? `Edit ${editCode}` : "New Coupon"}
                </h2>
                <button onClick={() => {setShowForm(false);setEditCode(null);}} className="text-muted-foreground hover:text-ink">
                  <X size={16} />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-eyebrow text-muted-foreground mb-1 text-[0.6rem]" style={{ fontFamily: field }}>Code *</label>
                  <input
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="SUMMER20"
                  className="w-full border border-border focus:border-gold px-3 py-2.5 text-sm outline-none"
                  style={{ fontFamily: field }}
                  disabled={!!editCode} />
                
                </div>
                <div>
                  <label className="block text-eyebrow text-muted-foreground mb-1 text-[0.6rem]" style={{ fontFamily: field }}>Type</label>
                  <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full border border-border focus:border-gold px-3 py-2.5 text-sm outline-none"
                  style={{ fontFamily: field }}>
                  
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-eyebrow text-muted-foreground mb-1 text-[0.6rem]" style={{ fontFamily: field }}>
                    Value ({form.type === "percent" ? "%" : "€"}) *
                  </label>
                  <input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
                  min={0}
                  className="w-full border border-border focus:border-gold px-3 py-2.5 text-sm outline-none"
                  style={{ fontFamily: field }} />
                
                </div>
                <div>
                  <label className="block text-eyebrow text-muted-foreground mb-1 text-[0.6rem]" style={{ fontFamily: field }}>Min Order (€)</label>
                  <input
                  type="number"
                  value={form.minOrder}
                  onChange={(e) => setForm((f) => ({ ...f, minOrder: Number(e.target.value) }))}
                  min={0}
                  className="w-full border border-border focus:border-gold px-3 py-2.5 text-sm outline-none"
                  style={{ fontFamily: field }} />
                
                </div>
                <div>
                  <label className="block text-eyebrow text-muted-foreground mb-1 text-[0.6rem]" style={{ fontFamily: field }}>Max Uses (leave blank = unlimited)</label>
                  <input
                  type="number"
                  value={form.maxUses}
                  onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))}
                  min={1}
                  placeholder="Unlimited"
                  className="w-full border border-border focus:border-gold px-3 py-2.5 text-sm outline-none"
                  style={{ fontFamily: field }} />
                
                </div>
                <div>
                  <label className="block text-eyebrow text-muted-foreground mb-1 text-[0.6rem]" style={{ fontFamily: field }}>Expires At</label>
                  <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                  className="w-full border border-border focus:border-gold px-3 py-2.5 text-sm outline-none"
                  style={{ fontFamily: field }} />
                
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-eyebrow text-muted-foreground mb-1 text-[0.6rem]" style={{ fontFamily: field }}>Description (optional)</label>
                  <input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Summer sale promotion"
                  className="w-full border border-border focus:border-gold px-3 py-2.5 text-sm outline-none"
                  style={{ fontFamily: field }} />
                
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-eyebrow text-muted-foreground text-[0.6rem]" style={{ fontFamily: field }}>Active</label>
                  <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                  className={`transition-colors ${form.isActive ? "text-gold" : "text-border"}`}>
                  
                    {form.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={handleSave} disabled={saving} className="btn-luxe btn-luxe-hover flex items-center gap-2 disabled:opacity-60">
                  <Check size={13} /> {saving ? "Saving…" : "Save Coupon"}
                </button>
                <button onClick={() => {setShowForm(false);setEditCode(null);}} className="px-5 py-2 border border-border hover:border-ink text-sm transition-colors" style={{ fontFamily: field }}>
                  Cancel
                </button>
              </div>
            </div>
          }

          {loading ?
          <p className="text-muted-foreground text-sm" style={{ fontFamily: field }}>Loading coupons…</p> :
          coupons.length === 0 ?
          <div className="bg-white border border-border p-10 text-center">
              <Tag size={24} className="text-gold mx-auto mb-3" strokeWidth={1.2} />
              <p className="text-display text-xl text-ink">No coupons yet</p>
              <p className="text-muted-foreground text-sm mt-1" style={{ fontFamily: field }}>Create your first coupon code above.</p>
            </div> :

          <div className="bg-white border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Code", "Type", "Value", "Min Order", "Uses", "Expires", "Status", ""].map((h) =>
                  <th key={h} className="text-left px-5 py-3 text-eyebrow text-[0.6rem] text-muted-foreground" style={{ fontFamily: field }}>
                        {h}
                      </th>
                  )}
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => {
                  const isExpired = c.expiresAt && new Date(c.expiresAt) < new Date();
                  const isExhausted = c.maxUses && c.usedCount >= c.maxUses;
                  return (
                    <tr key={c._id} className="border-b border-border last:border-0 hover:bg-ivory/50 transition-colors">
                        <td className="px-5 py-4">
                          <span className="text-display text-base text-ink">{c.code}</span>
                          {c.description &&
                        <p className="text-[0.6rem] text-muted-foreground mt-0.5" style={{ fontFamily: field }}>{c.description}</p>
                        }
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-eyebrow text-[0.6rem] bg-gold/10 text-gold px-2 py-0.5" style={{ fontFamily: field }}>
                            {c.type === "percent" ? "%" : "€"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-ink" style={{ fontFamily: field }}>
                          {c.type === "percent" ? `${c.value}%` : `€${c.value}`}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground" style={{ fontFamily: field }}>
                          {c.minOrder > 0 ? `€${c.minOrder}` : "—"}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground" style={{ fontFamily: field }}>
                          {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground" style={{ fontFamily: field }}>
                          {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span
                          className={`text-eyebrow text-[0.6rem] px-2 py-0.5 ${
                          !c.isActive || isExpired || isExhausted ?
                          "bg-red-50 text-red-500" :
                          "bg-emerald/10 text-emerald"}`
                          }
                          style={{ fontFamily: field }}>
                          
                            {!c.isActive ? "Inactive" : isExpired ? "Expired" : isExhausted ? "Exhausted" : "Active"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                            onClick={() => handleToggleActive(c)}
                            title={c.isActive ? "Deactivate" : "Activate"}
                            className={`w-7 h-7 flex items-center justify-center transition-colors ${
                            c.isActive ? "text-gold hover:bg-gold/10" : "text-muted-foreground hover:bg-gold/10 hover:text-gold"}`
                            }>
                            
                              {c.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                            </button>
                            <button
                            onClick={() => handleEdit(c)}
                            title="Edit"
                            className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-ink transition-colors">
                            
                              <Pencil size={13} />
                            </button>
                            <button
                            onClick={() => handleDelete(c.code)}
                            title="Delete"
                            className="w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors">
                            
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>);

                })}
                </tbody>
              </table>
            </div>
          }
        </div>
      </main>
    </div>);

}