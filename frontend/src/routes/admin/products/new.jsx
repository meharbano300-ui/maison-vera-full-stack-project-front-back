import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdmin } from "@/lib/admin-store";
import { categoryList } from "@/lib/products";
import { AdminSidebar } from "../index";
import ProductForm from "@/components/admin/ProductForm";


export const Route = createFileRoute("/admin/products/new")({
  component: AdminProductNew
});

function AdminProductNew() {
  const { isAuth, addProduct } = useAdmin();
  const nav = useNavigate();

  useEffect(() => {
    if (!isAuth) nav({ to: "/admin/login" });
  }, [isAuth, nav]);

  if (!isAuth) return null;

  const handleSubmit = async (data) => {
    await addProduct({
      ...data,
      price: Number(data.price),
      oldPrice: data.oldPrice ? Number(data.oldPrice) : undefined,
      rating: Number(data.rating),
      reviews: Number(data.reviews),
      details: data.details.split("\n").map((d) => d.trim()).filter(Boolean),
      sizes: data.sizes ? data.sizes.split(",").map((s) => s.trim()).filter(Boolean) : undefined
    });
    nav({ to: "/admin/products" });
  };

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.008_85)] flex">
      <AdminSidebar active="products" />
      <main className="flex-1 p-8 lg:p-10 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-eyebrow text-gold mb-1" style={{ fontFamily: "var(--font-sans)" }}>New Product</p>
            <h1 className="text-display text-4xl text-ink">Add to the Maison</h1>
          </div>
          <ProductForm onSubmit={handleSubmit} onCancel={() => nav({ to: "/admin/products" })} />
        </div>
      </main>
    </div>);

}