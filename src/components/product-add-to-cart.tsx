"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ShoppingBag, Plus, Minus } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { toast } from "react-hot-toast"

interface ProductAddToCartProps {
  product: {
    id: string // Variant ID
    productId: string
    name: string
    price: number
    imageUrl: string | null
    quantityLabel?: string
    flavor?: string | null
  }
}

export function ProductAddToCart({ product }: ProductAddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const cart = useCart()

  const increment = () => setQuantity((prev) => prev + 1)
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const onAddToCart = () => {
    cart.addItem({
      id: product.id,
      productId: product.productId,
      name: product.name,
      price: product.price,
      imageUrls: product.imageUrl ? [product.imageUrl] : [],
      quantity: quantity,
      quantityLabel: product.quantityLabel,
      flavor: product.flavor ?? undefined
    })
    
    toast.success(`${quantity} x ${product.name} added to bag`, {
      style: {
        background: '#000',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center bg-zinc-100 rounded-xl p-1 h-16 w-full sm:w-40 border border-zinc-200">
        <button 
          onClick={decrement}
          className="flex-1 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-12 text-center text-sm font-black text-zinc-900">
          {quantity}
        </span>
        <button 
          onClick={increment}
          className="flex-1 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add To Cart Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddToCart}
        className="flex-1 h-16 bg-primary text-white rounded-xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 hover:bg-zinc-900 transition-all"
      >
        <ShoppingBag className="w-5 h-5" />
        Add to Bag
      </motion.button>
    </div>
  )
}
