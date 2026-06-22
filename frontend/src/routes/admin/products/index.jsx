import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, Pencil, Star, Tag, Package, Filter, X, ChevronDown } from "lucide-react";
import { useAdmin } from "@/lib/admin-store";
import { categoryList } from "@/lib/products";
import { AdminSidebar } from "../index";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional()
});

export const Route = createFileRoute("/admin/products/")({
  validateSearch: searchSchema,
  component: AdminProducts
});

function AdminProducts() {
  const { isAuth, products, deleteProduct } = useAdmin();
  const nav = useNavigate();
  const sp = Route.useSearch();

  useEffect(() => {
    if (!isAuth) nav({ to: "/admin/login" });
  }, [isAuth, nav]);

  const [query, setQuery] = useState(sp.q ?? "");
  const [category, setCategory] = useState(sp.category ?? "All");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.subcategory.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, query, category]);

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.008_85)] flex">
      <AdminSidebar active="products" />
      <main className="flex-1 p-8 lg:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div>
              <p className="text-eyebrow text-gold mb-1" style={{ fontFamily: "var(--font-sans)" }}>Catalogue</p>
              <h1 className="text-display text-4xl text-ink">Products</h1>
              <p className="text-sm text-muted-foreground mt-1" style={{ fontFamily: "var(--font-sans)" }}>
                {filtered.length} of {products.length} products
              </p>
            </div>
            <Link
              to="/admin/products/new"
              className="btn-luxe btn-luxe-hover inline-flex items-center gap-2 shrink-0">
              
              <Plus size={14} /> Add Product
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex-1 min-w-[200px] relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white border border-border pl-9 pr-4 py-2.5 text-sm outline-none focus:border-gold transition-colors"
                style={{ fontFamily: "var(--font-sans)" }} />
              
            </div>
            <div className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white border border-border pl-9 pr-8 py-2.5 text-sm outline-none focus:border-gold appearance-none cursor-pointer transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}>
                
                <option value="All">All Categories</option>
                {categoryList.map((c) =>
                <option key={c.slug} value={c.name}>{c.name}</option>
                )}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            {(query || category !== "All") &&
            <button
              onClick={() => {setQuery("");setCategory("All");}}
              className="flex items-center gap-1.5 px-3 py-2.5 border border-border bg-white text-sm text-muted-foreground hover:text-ink hover:border-gold transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}>
              
                <X size={12} /> Clear
              </button>
            }
          </div>

          {/* Products table */}
          <div className="bg-white border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-[oklch(0.97_0.008_85)]">
                <tr>
                  <th className="text-left px-4 py-3 text-eyebrow text-muted-foreground font-normal" style={{ fontFamily: "var(--font-sans)" }}>Product</th>
                  <th className="text-left px-4 py-3 text-eyebrow text-muted-foreground font-normal hidden md:table-cell" style={{ fontFamily: "var(--font-sans)" }}>Category</th>
                  <th className="text-left px-4 py-3 text-eyebrow text-muted-foreground font-normal" style={{ fontFamily: "var(--font-sans)" }}>Price</th>
                  <th className="text-left px-4 py-3 text-eyebrow text-muted-foreground font-normal hidden lg:table-cell" style={{ fontFamily: "var(--font-sans)" }}>Rating</th>
                  <th className="text-left px-4 py-3 text-eyebrow text-muted-foreground font-normal hidden lg:table-cell" style={{ fontFamily: "var(--font-sans)" }}>Status</th>
                  <th className="text-right px-4 py-3 text-eyebrow text-muted-foreground font-normal" style={{ fontFamily: "var(--font-sans)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ?
                <tr>
                    <td colSpan={6} className="text-center py-16 text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
                      <Package size={32} className="mx-auto mb-3 text-gold/40" />
                      <p>No products found</p>
                    </td>
                  </tr> :

                filtered.map((p) =>
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-[oklch(0.97_0.008_85)] transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 overflow-hidden bg-secondary shrink-0">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-ink truncate max-w-[180px]" style={{ fontFamily: "var(--font-sans)" }}>{p.name}</p>
                            <p className="text-muted-foreground text-xs truncate max-w-[180px]" style={{ fontFamily: "var(--font-sans)" }}>{p.tagline}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>{p.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div style={{ fontFamily: "var(--font-sans)" }}>
                          <span className="font-medium text-ink">€{p.price.toLocaleString()}</span>
                          {p.oldPrice &&
                      <span className="text-muted-foreground line-through text-xs ml-2">€{p.oldPrice.toLocaleString()}</span>
                      }
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-1" style={{ fontFamily: "var(--font-sans)" }}>
                          <Star size={12} className="text-gold fill-gold" />
                          <span className="text-sm text-ink">{p.rating}</span>
                          <span className="text-muted-foreground text-xs">({p.reviews})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex gap-1.5 flex-wrap">
                          {p.badge &&
                      <span className="text-[0.6rem] tracking-widest uppercase bg-gold/10 text-gold px-2 py-0.5" style={{ fontFamily: "var(--font-sans)" }}>{p.badge}</span>
                      }
                          {p.oldPrice &&
                      <span className="text-[0.6rem] tracking-widest uppercase bg-red-50 text-red-500 px-2 py-0.5" style={{ fontFamily: "var(--font-sans)" }}>Sale</span>
                      }
                          {p._added &&
                      <span className="text-[0.6rem] tracking-widest uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5" style={{ fontFamily: "var(--font-sans)" }}>Admin</span>
                      }
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                        to="/admin/products/$id/edit"
                        params={{ id: p.id }}
                        className="p-1.5 text-muted-foreground hover:text-gold hover:bg-gold/10 transition-colors"
                        title="Edit">
                        
                            <Pencil size={14} />
                          </Link>
                          {confirmDelete === p.id ?
                      <div className="flex items-center gap-1">
                              <button
                          onClick={() => {deleteProduct(p.id);setConfirmDelete(null);}}
                          className="text-[0.6rem] bg-red-500 text-white px-2 py-1 hover:bg-red-600 transition-colors"
                          style={{ fontFamily: "var(--font-sans)" }}>
                          
                                Confirm
                              </button>
                              <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-[0.6rem] border border-border px-2 py-1 hover:border-ink transition-colors"
                          style={{ fontFamily: "var(--font-sans)" }}>
                          
                                Cancel
                              </button>
                            </div> :

                      <button
                        onClick={() => setConfirmDelete(p.id)}
                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete">
                        
                              <Trash2 size={14} />
                            </button>
                      }
                        </div>
                      </td>
                    </tr>
                )
                }
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>);

}