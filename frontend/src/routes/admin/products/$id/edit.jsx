import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdmin } from "@/lib/admin-store";
import { AdminSidebar } from "../../index";
import ProductForm from "@/components/admin/ProductForm";


export const Route = createFileRoute("/admin/products/$id/edit")({
  component: AdminProductEdit
});

function AdminProductEdit() {
  const { isAuth, products, updateProduct } = useAdmin();
  const nav = useNavigate();
  const { id } = Route.useParams();

  useEffect(() => {
    if (!isAuth) nav({ to: "/admin/login" });
  }, [isAuth, nav]);

  if (!isAuth) return null;

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[oklch(0.97_0.008_85)] flex">
        <AdminSidebar active="products" />
        <main className="flex-1 p-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-display text-3xl text-ink mb-4">Product not found</p>
            <button
              onClick={() => nav({ to: "/admin/products" })}
              className="btn-luxe btn-luxe-hover">
              
              Back to Products
            </button>
          </div>
        </main>
      </div>);

  }

  const handleSubmit = async (data) => {
    await updateProduct(id, {
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

  const defaultValues = {
    name: product.name,
    tagline: product.tagline,
    category: product.category,
    subcategory: product.subcategory,
    color: product.color,
    price: product.price,
    oldPrice: product.oldPrice,
    rating: product.rating,
    reviews: product.reviews,
    image: product.image,
    badge: product.badge ?? "",
    description: product.description,
    details: product.details.join("\n"),
    sizes: product.sizes?.join(", ") ?? ""
  };

  return (
    <div className="min-h-screen bg-[oklch(0.97_0.008_85)] flex">
      <AdminSidebar active="products" />
      <main className="flex-1 p-8 lg:p-10 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-eyebrow text-gold mb-1" style={{ fontFamily: "var(--font-sans)" }}>Edit Product</p>
            <h1 className="text-display text-4xl text-ink truncate">{product.name}</h1>
          </div>
          <ProductForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={() => nav({ to: "/admin/products" })}
            isEdit />
          
        </div>
      </main>
    </div>);

}