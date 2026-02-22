"use client"

import { useState } from "react"
import { Star, Truck, RefreshCw } from "lucide-react"
import { ProductAddToCart } from "@/components/product-add-to-cart"

export function ProductInfo({ product }: { product: any }) {
  // Use first variant as default
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-primary">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400 underline underline-offset-4 decoration-zinc-200">
            48 Reviews
          </span>
          <span className="mx-2 w-1 h-1 bg-zinc-200 rounded-full" />
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
            {product.category?.name}
          </span>
        </div>
        
        <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-zinc-900 leading-[0.9] mb-4 uppercase tracking-tighter">
          {product.name}
        </h1>
        {product.brand && (
            <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Brand: {product.brand}</p>
        )}
        <p className="text-base text-zinc-500 font-medium leading-relaxed max-w-xl">
          {product.description}
        </p>
      </div>

      <div className="mb-10 space-y-6">
        <div className="flex items-end gap-4">
          <span className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tighter">
            ₹{selectedVariant.price.toLocaleString()}
          </span>
          {selectedVariant.mrp && selectedVariant.mrp > selectedVariant.price ? (
            <>
              <span className="text-lg text-zinc-400 line-through font-bold mb-1">
                 ₹{selectedVariant.mrp.toLocaleString()}
              </span>
              {selectedVariant.discount && (
                <div className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase mb-2">
                  Save {selectedVariant.discount}%
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Variant Selectors */}
        <div className="space-y-6">
          {/* Quantity Selector */}
          <div className="space-y-2">
             <div className="flex justify-between items-center">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Select Size:</span>
             </div>
             <div className="flex flex-wrap gap-2">
               {product.variants.map((variant: any) => (
                 <button 
                   key={variant.id}
                   onClick={() => setSelectedVariant(variant)}
                   className={`px-6 py-3 rounded-xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${
                     selectedVariant.id === variant.id 
                       ? "border-primary bg-primary/5 text-primary" 
                       : "border-zinc-200 text-zinc-400 hover:border-zinc-300"
                   }`}
                 >
                    {variant.quantityLabel || "Standard"}
                 </button>
               ))}
             </div>
          </div>

          {/* Note: In this data.txt, flavors are often part of the name or separate entries, 
              but if we had flavor variants, they'd show up here. 
              The current seeding handles flavors by taking the first one or null. 
              If the user wants flavor selection too, we'd need to group by (name + quantity) and show flavors.
          */}
        </div>
      </div>

      {/* Add to Cart Client Component */}
      <ProductAddToCart 
        product={{
          id: selectedVariant.id, // we pass the variant ID
          productId: product.id,
          name: `${product.name} (${selectedVariant.quantityLabel})`,
          price: selectedVariant.price,
          imageUrl: product.imageUrls[0] || "/placeholder.svg",
          quantityLabel: selectedVariant.quantityLabel,
          flavor: selectedVariant.flavor
        }} 
      />

      {/* Trust Features */}
      <div className="mt-12 grid grid-cols-2 gap-6 pt-10 border-t border-zinc-100">
        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-primary" />
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 mb-1">Fast Delivery</h4>
            <p className="text-[10px] text-zinc-500 font-medium">Bhavnagar: 24h. Others: 3-5 days.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RefreshCw className="w-5 h-5 text-primary" />
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 mb-1">Easy Returns</h4>
            <p className="text-[10px] text-zinc-500 font-medium">7-day hassle-free return policy.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
