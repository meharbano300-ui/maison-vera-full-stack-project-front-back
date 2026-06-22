import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { useShop } from "@/lib/shop-store";


export default function ProductCard({ product, index = 0 }) {
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const wished = inWishlist(product.id);

  return (
    <article
      className="group animate-fade-up"
      style={{ animationDelay: `${index % 6 * 70}ms` }}>
      
      {/* Image container */}
      <div className="relative overflow-hidden bg-secondary aspect-[4/5]">
        <Link to="/product/$id" params={{ id: product.id }} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-all duration-[1600ms] ease-out group-hover:scale-[1.08]" />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>

        {/* Badge */}
        {product.badge &&
        <span
          className="absolute top-3 left-3 bg-gold text-ink text-[0.6rem] font-semibold tracking-[0.2em] uppercase px-3 py-1.5"
          style={{ fontFamily: "var(--font-sans)" }}>
          
            {product.badge}
          </span>
        }

        {/* Gold corner accent */}
        <span className="absolute top-0 right-0 w-8 h-px bg-gold/70" />
        <span className="absolute top-0 right-0 w-px h-8 bg-gold/70" />

        {/* Wishlist */}
        <button
          aria-label="Wishlist"
          onClick={(e) => {e.preventDefault();toggleWishlist(product);}}
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center border transition-all duration-300 ${
          wished ?
          "bg-gold border-gold text-ink" :
          "bg-ivory/10 backdrop-blur border-ivory/30 text-ivory hover:bg-gold hover:border-gold hover:text-ink"}`
          }>
          
          <Heart size={14} fill={wished ? "currentColor" : "none"} />
        </button>

        {/* Quick view */}
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-ivory/15 backdrop-blur border border-ivory/30 text-ivory text-[0.65rem] tracking-[0.2em] uppercase px-5 py-2.5 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap hover:bg-ivory hover:text-ink"
          style={{ fontFamily: "var(--font-sans)" }}>
          
          <Eye size={12} /> Quick View
        </Link>

        {/* Add to bag */}
        <button
          onClick={(e) => {e.preventDefault();addToCart(product);}}
          className="absolute bottom-3 inset-x-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-gold text-ink text-[0.65rem] font-semibold tracking-[0.2em] uppercase py-3 flex items-center justify-center gap-2 hover:bg-ivory transition-colors"
          style={{ fontFamily: "var(--font-sans)" }}>
          
          <ShoppingBag size={12} /> Add to Bag
        </button>
      </div>

      {/* Details */}
      <div className="pt-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p
              className="text-[0.62rem] tracking-[0.22em] uppercase text-gold mb-1.5"
              style={{ fontFamily: "var(--font-sans)" }}>
              
              {product.category}
            </p>
            <Link to="/product/$id" params={{ id: product.id }}>
              <h3
                className="text-display text-xl leading-tight hover:text-gold transition-colors line-clamp-1"
                style={{ fontFamily: "var(--font-display)" }}>
                
                {product.name}
              </h3>
            </Link>
            <p
              className="text-[0.7rem] text-muted-foreground mt-1 line-clamp-1"
              style={{ fontFamily: "var(--font-sans)" }}>
              
              {product.tagline}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-display text-lg" style={{ fontFamily: "var(--font-display)" }}>
              ${product.price.toLocaleString()}
            </p>
            {product.oldPrice &&
            <p className="text-[0.65rem] text-muted-foreground line-through" style={{ fontFamily: "var(--font-sans)" }}>
                ${product.oldPrice.toLocaleString()}
              </p>
            }
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) =>
            <Star
              key={i}
              size={10}
              className={i < Math.round(product.rating) ? "fill-gold text-gold" : "fill-muted text-muted"} />

            )}
          </div>
          <span className="text-[0.65rem] font-medium" style={{ fontFamily: "var(--font-sans)" }}>
            {product.rating}
          </span>
          <span className="text-[0.65rem] text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
            ({product.reviews})
          </span>
        </div>
      </div>
    </article>);

}