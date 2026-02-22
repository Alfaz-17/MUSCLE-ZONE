"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"

import { useCart } from "@/hooks/use-cart"
import { ShoppingBag, Eye, ShieldCheck } from "lucide-react"
import { toast } from "react-hot-toast"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  id: string
  name: string
  price: number
  mrp?: number
  discount?: number
  image: string
  hoverImage: string
  category: string
  index: number
}

export function ProductCard({ id, name, price, mrp, discount, image, hoverImage, category, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const cart = useCart()

  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // For simplicity, we add the "primary" or first variant if we have more context, 
    // but here we just have price. We might need the variant ID.
    // If id passed is product ID, we should ideally go to product page to choose variant.
    // But for the shop page, we'll assume the product has a default variant.
    
    // For now, let's keep it as is, but it might fail if 'id' is not a variant ID.
    // In our new seed, 'id' in ProductCard should be the Product ID.
    // So onAddToCart from card should probably just link to the page or add a default.
    
    toast.error("Please select a size on the product page", {
      style: { background: '#000', color: '#fff', fontSize: '12px' }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative bg-white border border-zinc-100 hover:border-primary/20 transition-all rounded-2xl md:rounded-[2rem] overflow-hidden"
    >
      <Link
        href={`/product/${id}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="block"
      >
        <div className="relative aspect-square overflow-hidden bg-zinc-50">
          {/* Authentic Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-zinc-100">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-900">Authentic</span>
          </div>

          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-4 right-4 z-10 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-lg">
              -{discount}%
            </div>
          )}

          {/* Primary image */}
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className={cn(
              "object-contain p-6 transition-all duration-700",
              isHovered ? "scale-110 opacity-0" : "scale-100 opacity-100"
            )}
          />
          {/* Secondary hover image */}
          <Image
            src={hoverImage || image || "/placeholder.svg"}
            alt={`${name} alternate`}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className={cn(
              "object-contain p-6 transition-all duration-700 absolute inset-0",
              isHovered ? "scale-100 opacity-100" : "scale-90 opacity-0"
            )}
          />

          {/* Quick Actions Overlay (Desktop) */}
          <div className="hidden md:flex absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-3">
             <button 
               onClick={onAddToCart}
               className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
             >
               <ShoppingBag className="w-6 h-6" />
             </button>
             <div className="w-12 h-12 bg-white text-zinc-900 rounded-full flex items-center justify-center shadow-2xl">
               <Eye className="w-6 h-6" />
             </div>
          </div>
        </div>

        <div className="p-5 sm:p-8 space-y-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">{category}</span>
            <h3 className="font-sans font-black text-base sm:text-lg text-zinc-900 leading-tight group-hover:text-primary transition-colors">{name}</h3>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <p className="text-xl sm:text-2xl font-black text-zinc-900 font-sans tracking-tighter">
                ₹{price.toLocaleString()}
              </p>
              {mrp && mrp > price && (
                <p className="text-[10px] text-zinc-400 line-through font-bold -mt-1">
                  ₹{mrp.toLocaleString()}
                </p>
              )}
            </div>
            {/* Mobile Add to Cart */}
            <button 
              onClick={onAddToCart}
              className="md:hidden w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
