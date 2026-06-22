import { useState } from "react";
import { categoryList, colors } from "@/lib/products";
import { Upload, Image as ImageIcon, ChevronDown } from "lucide-react";

























const EMPTY = {
  name: "",
  tagline: "",
  category: categoryList[0].name,
  subcategory: categoryList[0].subs[0],
  color: "Black",
  price: "",
  oldPrice: "",
  rating: 4.5,
  reviews: 0,
  image: "",
  badge: "",
  description: "",
  details: "",
  sizes: ""
};

export default function ProductForm({ defaultValues = EMPTY, onSubmit, onCancel, isEdit = false }) {
  const [form, setForm] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [imgPreview, setImgPreview] = useState(defaultValues.image ?? "");

  const selectedCat = categoryList.find((c) => c.name === form.category);

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => {const n = { ...e };delete n[key];return n;});
  };

  const handleCategoryChange = (cat) => {
    const found = categoryList.find((c) => c.name === cat);
    setForm((prev) => ({
      ...prev,
      category: cat,
      subcategory: found?.subs[0] ?? ""
    }));
  };

  const handleImageUrl = (url) => {
    set("image", url);
    setImgPreview(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      set("image", result);
      setImgPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.tagline.trim()) errs.tagline = "Tagline is required";
    if (!form.price || Number(form.price) <= 0) errs.price = "Price must be positive";
    if (!form.image.trim()) errs.image = "Image is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.details.trim()) errs.details = "At least one detail is required";
    if (Number(form.rating) < 0 || Number(form.rating) > 5) errs.rating = "Rating must be 0–5";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Section title="Basic Information">
        <Field label="Product Name" error={errors.name} required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Émeraude Silk Gown"
            className={inputCls(!!errors.name)} />
          
        </Field>
        <Field label="Tagline" error={errors.tagline} required>
          <input
            type="text"
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            placeholder="e.g. Hand draped Italian silk"
            className={inputCls(!!errors.tagline)} />
          
        </Field>
        <Field label="Badge (optional)">
          <input
            type="text"
            value={form.badge ?? ""}
            onChange={(e) => set("badge", e.target.value)}
            placeholder="e.g. New, Bestseller, Sale"
            className={inputCls(false)} />
          
        </Field>
      </Section>

      {/* Category */}
      <Section title="Category & Classification">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category" required>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={selectCls(false)}>
                
                {categoryList.map((c) =>
                <option key={c.slug} value={c.name}>{c.name}</option>
                )}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </Field>
          <Field label="Subcategory" required>
            <div className="relative">
              <select
                value={form.subcategory}
                onChange={(e) => set("subcategory", e.target.value)}
                className={selectCls(false)}>
                
                {(selectedCat?.subs ?? []).map((s) =>
                <option key={s} value={s}>{s}</option>
                )}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </Field>
        </div>
        <Field label="Color">
          <div className="relative">
            <select
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              className={selectCls(false)}>
              
              {colors.map((c) =>
              <option key={c} value={c}>{c}</option>
              )}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </Field>
      </Section>

      {/* Pricing */}
      <Section title="Pricing">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (€)" error={errors.price} required>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="0.00"
              className={inputCls(!!errors.price)} />
            
          </Field>
          <Field label="Original Price / Sale Price (€, optional)">
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.oldPrice ?? ""}
              onChange={(e) => set("oldPrice", e.target.value)}
              placeholder="Leave blank if no sale"
              className={inputCls(false)} />
            
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Rating (0–5)" error={errors.rating} required>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.rating}
              onChange={(e) => set("rating", e.target.value)}
              className={inputCls(!!errors.rating)} />
            
          </Field>
          <Field label="Review Count">
            <input
              type="number"
              min="0"
              value={form.reviews}
              onChange={(e) => set("reviews", e.target.value)}
              className={inputCls(false)} />
            
          </Field>
        </div>
      </Section>

      {/* Image */}
      <Section title="Product Image">
        <Field label="Image URL or Upload" error={errors.image} required>
          <div className="space-y-3">
            <input
              type="url"
              value={typeof form.image === "string" && !form.image.startsWith("data:") ? form.image : ""}
              onChange={(e) => handleImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={inputCls(!!errors.image)} />
            
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>or</span>
              <label className="cursor-pointer flex items-center gap-2 text-xs text-gold border border-gold px-3 py-2 hover:bg-gold hover:text-ink transition-colors" style={{ fontFamily: "var(--font-sans)" }}>
                <Upload size={12} /> Upload Image
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            {imgPreview &&
            <div className="w-24 h-24 overflow-hidden bg-secondary border border-border">
                <img src={imgPreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            }
            {!imgPreview &&
            <div className="w-24 h-24 bg-secondary border border-dashed border-border flex items-center justify-center">
                <ImageIcon size={24} className="text-muted-foreground" />
              </div>
            }
          </div>
        </Field>
      </Section>

      {/* Description */}
      <Section title="Content">
        <Field label="Description" error={errors.description} required>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="A hand draped Italian silk gown, finished by twelve atelier hands…"
            className={inputCls(!!errors.description) + " resize-none"} />
          
        </Field>
        <Field label="Details (one per line)" error={errors.details} required>
          <textarea
            rows={4}
            value={form.details}
            onChange={(e) => set("details", e.target.value)}
            placeholder={"Italian silk\nHand finished hem\nAvailable in 4 sizes"}
            className={inputCls(!!errors.details) + " resize-none"} />
          
        </Field>
        <Field label="Sizes (comma separated, optional)">
          <input
            type="text"
            value={form.sizes ?? ""}
            onChange={(e) => set("sizes", e.target.value)}
            placeholder="XS, S, M, L, XL"
            className={inputCls(false)} />
          
        </Field>
      </Section>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <button type="submit" className="btn-luxe btn-luxe-hover">
          {isEdit ? "Save Changes" : "Add to Maison"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-ghost-luxe">
          
          Cancel
        </button>
      </div>
    </form>);

}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-border p-6 space-y-4">
      <h3 className="text-display text-xl text-ink border-b border-border pb-3">{title}</h3>
      {children}
    </div>);

}

function Field({
  label,
  children,
  error,
  required





}) {
  return (
    <div>
      <label className="block text-eyebrow text-muted-foreground mb-1.5" style={{ fontFamily: "var(--font-sans)" }}>
        {label} {required && <span className="text-gold">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "var(--font-sans)" }}>{error}</p>}
    </div>);

}

function inputCls(hasError) {
  return `w-full bg-[oklch(0.97_0.008_85)] border ${hasError ? "border-red-400" : "border-border"} px-4 py-2.5 text-sm text-ink outline-none focus:border-gold transition-colors`;
}

function selectCls(hasError) {
  return `w-full bg-[oklch(0.97_0.008_85)] border ${hasError ? "border-red-400" : "border-border"} px-4 py-2.5 pr-8 text-sm text-ink outline-none focus:border-gold appearance-none cursor-pointer transition-colors`;
}