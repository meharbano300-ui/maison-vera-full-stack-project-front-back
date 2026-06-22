import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, Check, Trash2, MessageSquare, Sparkles, Filter } from "lucide-react";
import { useAdmin } from "@/lib/admin-store";
import { AdminSidebar } from "../index";
import {
  fetchReviews,
  approveReview,
  deleteReview,
  replyToReview } from
"@/lib/api/adminApi";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/reviews/")({
  component: AdminReviews
});















function StarRow({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) =>
      <Star
        key={s}
        size={11}
        className={s <= rating ? "text-gold fill-gold" : "text-border"} />

      )}
    </span>);

}

export default function AdminReviews() {
  const { isAuth } = useAdmin();
  const nav = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [replyDraft, setReplyDraft] = useState({});
  const [replyOpen, setReplyOpen] = useState(null);

  useEffect(() => {
    if (!isAuth) nav({ to: "/admin/login" });
  }, [isAuth, nav]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchReviews(pendingOnly);
      setReviews(data);
    } catch {
      toast.error("Could not load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) load();
  }, [isAuth, pendingOnly]);

  const handleApprove = async (id) => {
    try {
      await approveReview(id);
      toast.success("Review approved");
      setReviews((prev) =>
      prev.map((r) => r._id === id ? { ...r, isApproved: true } : r)
      );
    } catch {
      toast.error("Could not approve review");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review permanently?")) return;
    try {
      await deleteReview(id);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {
      toast.error("Could not delete review");
    }
  };

  const handleReply = async (id) => {
    const reply = replyDraft[id]?.trim();
    if (!reply) return;
    try {
      await replyToReview(id, reply);
      toast.success("Reply saved");
      setReviews((prev) =>
      prev.map((r) => r._id === id ? { ...r, adminReply: reply } : r)
      );
      setReplyOpen(null);
      setReplyDraft((d) => ({ ...d, [id]: "" }));
    } catch {
      toast.error("Could not save reply");
    }
  };

  if (!isAuth) return null;

  const pending = reviews.filter((r) => !r.isApproved).length;

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.008_85)] flex">
      <AdminSidebar active="reviews" />
      <main className="flex-1 p-8 lg:p-12 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-eyebrow text-gold mb-1 flex items-center gap-2">
              <Sparkles size={11} /> Reviews
            </p>
            <h1 className="text-display text-4xl text-ink">Customer Reviews</h1>
            {pending > 0 &&
            <p className="text-sm text-amber-600 mt-2" style={{ fontFamily: "var(--font-sans)" }}>
                {pending} review{pending !== 1 ? "s" : ""} awaiting approval
              </p>
            }
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setPendingOnly(false)}
              className={`px-4 py-2 text-eyebrow text-xs transition-colors border ${
              !pendingOnly ?
              "bg-ink text-ivory border-ink" :
              "bg-white text-ink border-border hover:border-ink"}`
              }
              style={{ fontFamily: "var(--font-sans)" }}>
              
              All Reviews
            </button>
            <button
              onClick={() => setPendingOnly(true)}
              className={`px-4 py-2 text-eyebrow text-xs transition-colors border flex items-center gap-2 ${
              pendingOnly ?
              "bg-ink text-ivory border-ink" :
              "bg-white text-ink border-border hover:border-ink"}`
              }
              style={{ fontFamily: "var(--font-sans)" }}>
              
              <Filter size={11} /> Pending Only
            </button>
          </div>

          {loading ?
          <p className="text-muted-foreground text-sm" style={{ fontFamily: "var(--font-sans)" }}>
              Loading reviews…
            </p> :
          reviews.length === 0 ?
          <div className="bg-white border border-border p-10 text-center">
              <Star size={24} className="text-gold mx-auto mb-3" strokeWidth={1.2} />
              <p className="text-display text-xl text-ink">No reviews found</p>
              <p className="text-muted-foreground text-sm mt-1" style={{ fontFamily: "var(--font-sans)" }}>
                {pendingOnly ? "No pending reviews to approve." : "No reviews yet."}
              </p>
            </div> :

          <div className="space-y-4">
              {reviews.map((r) =>
            <div
              key={r._id}
              className={`bg-white border p-6 transition-colors ${
              r.isApproved ? "border-border" : "border-amber-300"}`
              }>
              
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <StarRow rating={r.rating} />
                        <span
                      className={`text-eyebrow text-[0.6rem] px-2 py-0.5 ${
                      r.isApproved ?
                      "bg-emerald/10 text-emerald" :
                      "bg-amber-100 text-amber-700"}`
                      }
                      style={{ fontFamily: "var(--font-sans)" }}>
                      
                          {r.isApproved ? "Approved" : "Pending"}
                        </span>
                      </div>

                      {r.title &&
                  <p className="text-display text-lg text-ink mb-1">{r.title}</p>
                  }
                      {r.comment &&
                  <p
                    className="text-sm text-muted-foreground mb-3"
                    style={{ fontFamily: "var(--font-sans)" }}>
                    
                          {r.comment}
                        </p>
                  }

                      <div
                    className="flex flex-wrap gap-4 text-[0.65rem] text-muted-foreground"
                    style={{ fontFamily: "var(--font-sans)" }}>
                    
                        {r.userName && <span>By {r.userName}</span>}
                        {r.userEmail && <span>{r.userEmail}</span>}
                        <span>Product: {r.productId}</span>
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>

                      {r.adminReply &&
                  <div className="mt-3 bg-gold/5 border border-gold/20 p-3">
                          <p
                      className="text-eyebrow text-gold text-[0.6rem] mb-1"
                      style={{ fontFamily: "var(--font-sans)" }}>
                      
                            Admin Reply
                          </p>
                          <p
                      className="text-sm text-ink"
                      style={{ fontFamily: "var(--font-sans)" }}>
                      
                            {r.adminReply}
                          </p>
                        </div>
                  }

                      {replyOpen === r._id &&
                  <div className="mt-3">
                          <textarea
                      value={replyDraft[r._id] ?? r.adminReply ?? ""}
                      onChange={(e) =>
                      setReplyDraft((d) => ({ ...d, [r._id]: e.target.value }))
                      }
                      rows={3}
                      placeholder="Write a reply…"
                      className="w-full border border-border focus:border-gold px-3 py-2 text-sm outline-none resize-none"
                      style={{ fontFamily: "var(--font-sans)" }} />
                    
                          <div className="flex gap-2 mt-2">
                            <button
                        onClick={() => handleReply(r._id)}
                        className="btn-luxe btn-luxe-hover !py-2 !px-4 text-xs">
                        
                              Save Reply
                            </button>
                            <button
                        onClick={() => setReplyOpen(null)}
                        className="px-4 py-2 text-xs border border-border hover:border-ink transition-colors"
                        style={{ fontFamily: "var(--font-sans)" }}>
                        
                              Cancel
                            </button>
                          </div>
                        </div>
                  }
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!r.isApproved &&
                  <button
                    onClick={() => handleApprove(r._id)}
                    title="Approve"
                    className="w-8 h-8 flex items-center justify-center bg-emerald/10 text-emerald hover:bg-emerald hover:text-white transition-colors">
                    
                          <Check size={14} />
                        </button>
                  }
                      <button
                    onClick={() =>
                    setReplyOpen(replyOpen === r._id ? null : r._id)
                    }
                    title="Reply"
                    className="w-8 h-8 flex items-center justify-center bg-gold/10 text-gold hover:bg-gold hover:text-ink transition-colors">
                    
                        <MessageSquare size={14} />
                      </button>
                      <button
                    onClick={() => handleDelete(r._id)}
                    title="Delete"
                    className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                    
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
            )}
            </div>
          }
        </div>
      </main>
    </div>);

}