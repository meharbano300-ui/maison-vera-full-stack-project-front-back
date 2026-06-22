import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Trash2, Eye, Sparkles, Filter, Phone } from "lucide-react";
import { useAdmin } from "@/lib/admin-store";
import { AdminSidebar } from "../index";
import { fetchContactMessages, markContactMessageRead, deleteContactMessage } from "@/lib/api/adminApi";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/messages/")({
  component: AdminMessages
});












export default function AdminMessages() {
  const { isAuth } = useAdmin();
  const nav = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!isAuth) nav({ to: "/admin/login" });
  }, [isAuth, nav]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchContactMessages(unreadOnly);
      setMessages(data);
    } catch {
      toast.error("Could not load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) load();
  }, [isAuth, unreadOnly]);

  const handleMarkRead = async (id) => {
    try {
      await markContactMessageRead(id);
      setMessages((prev) =>
      prev.map((m) => m._id === id ? { ...m, status: "read" } : m)
      );
    } catch {
      toast.error("Could not update message");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message permanently?")) return;
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      toast.success("Message deleted");
    } catch {
      toast.error("Could not delete message");
    }
  };

  const handleExpand = (id) => {
    if (expanded !== id) {
      setExpanded(id);
      const msg = messages.find((m) => m._id === id);
      if (msg && msg.status === "new") handleMarkRead(id);
    } else {
      setExpanded(null);
    }
  };

  if (!isAuth) return null;

  const unread = messages.filter((m) => m.status === "new").length;
  const f = "var(--font-sans)";

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.008_85)] flex">
      <AdminSidebar active="messages" />
      <main className="flex-1 p-8 lg:p-12 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-eyebrow text-gold mb-1 flex items-center gap-2">
              <Sparkles size={11} /> Contact
            </p>
            <h1 className="text-display text-4xl text-ink">Customer Messages</h1>
            {unread > 0 && !unreadOnly &&
            <p className="text-sm text-amber-600 mt-2" style={{ fontFamily: f }}>
                {unread} unread message{unread !== 1 ? "s" : ""}
              </p>
            }
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => setUnreadOnly(false)}
              className={`px-4 py-2 text-eyebrow text-xs transition-colors border ${
              !unreadOnly ? "bg-ink text-ivory border-ink" : "bg-white text-ink border-border hover:border-ink"}`
              }
              style={{ fontFamily: f }}>
              
              All Messages
            </button>
            <button
              onClick={() => setUnreadOnly(true)}
              className={`px-4 py-2 text-eyebrow text-xs transition-colors border flex items-center gap-2 ${
              unreadOnly ? "bg-ink text-ivory border-ink" : "bg-white text-ink border-border hover:border-ink"}`
              }
              style={{ fontFamily: f }}>
              
              <Filter size={11} /> Unread Only
            </button>
          </div>

          {loading ?
          <p className="text-muted-foreground text-sm" style={{ fontFamily: f }}>
              Loading messages…
            </p> :
          messages.length === 0 ?
          <div className="bg-white border border-border p-10 text-center">
              <Mail size={24} className="text-gold mx-auto mb-3" strokeWidth={1.2} />
              <p className="text-display text-xl text-ink">No messages found</p>
              <p className="text-muted-foreground text-sm mt-1" style={{ fontFamily: f }}>
                {unreadOnly ? "No unread messages." : "No contact messages yet."}
              </p>
            </div> :

          <div className="space-y-3">
              {messages.map((m) =>
            <div
              key={m._id}
              className={`bg-white border transition-colors ${
              m.status === "new" ? "border-amber-300" : "border-border"}`
              }>
              
                  {/* Header row */}
                  <div
                className="flex items-start justify-between gap-4 p-5 cursor-pointer hover:bg-ivory/40 transition-colors"
                onClick={() => handleExpand(m._id)}>
                
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    m.status === "new" ? "bg-amber-400" : "bg-border"}`
                    } />
                  
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <p className="text-display text-base text-ink">
                            {m.name || "Unknown"}
                          </p>
                          <span
                        className={`text-eyebrow text-[0.6rem] px-2 py-0.5 ${
                        m.status === "new" ?
                        "bg-amber-100 text-amber-700" :
                        "bg-border/30 text-muted-foreground"}`
                        }
                        style={{ fontFamily: f }}>
                        
                            {m.status === "new" ? "New" : m.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-ink truncate" style={{ fontFamily: f }}>
                          {m.subject || "No subject"}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-1 text-[0.65rem] text-muted-foreground" style={{ fontFamily: f }}>
                          {m.email &&
                      <span className="flex items-center gap-1">
                              <Mail size={9} /> {m.email}
                            </span>
                      }
                          {m.phone &&
                      <span className="flex items-center gap-1">
                              <Phone size={9} /> {m.phone}
                            </span>
                      }
                          <span>{new Date(m.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {m.status === "new" &&
                  <button
                    onClick={(e) => {e.stopPropagation();handleMarkRead(m._id);}}
                    title="Mark read"
                    className="w-7 h-7 flex items-center justify-center bg-gold/10 text-gold hover:bg-gold hover:text-ink transition-colors">
                    
                          <Eye size={13} />
                        </button>
                  }
                      <button
                    onClick={(e) => {e.stopPropagation();handleDelete(m._id);}}
                    title="Delete"
                    className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                    
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded message body */}
                  {expanded === m._id &&
              <div className="px-5 pb-5 border-t border-border pt-4">
                      <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap" style={{ fontFamily: f }}>
                        {m.message || <span className="text-muted-foreground italic">No message body</span>}
                      </p>
                    </div>
              }
                </div>
            )}
            </div>
          }
        </div>
      </main>
    </div>);

}