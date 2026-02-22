"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

interface MiniCartProps {
  isOpen: boolean
  onClose: () => void
}

export function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const cart = useCart()
  const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Cart panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="font-serif text-xl">Shopping Bag ({cart.items.length})</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 hover:text-primary transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-muted-foreground mb-4">Your bag is empty</p>
                  <button
                    onClick={onClose}
                    className="text-sm tracking-[0.2em] uppercase border-b border-primary text-primary pb-1 hover:border-transparent transition-colors duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-24 bg-muted relative rounded-sm overflow-hidden border border-border shrink-0">
                        {item.imageUrls?.[0] ? (
                          <img src={item.imageUrls[0]} alt={item.name} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground uppercase">IMG</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 h-10 overflow-hidden">
                          <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                          <button 
                            onClick={() => cart.removeItem(item.id)}
                            className="text-muted-foreground hover:text-destructive p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border border-border">
                            <button 
                               onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                               className="p-1 px-2 hover:bg-muted transition-colors border-r"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs w-8 text-center">{item.quantity}</span>
                            <button 
                               onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                               className="p-1 px-2 hover:bg-muted transition-colors border-l"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-sm font-semibold">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping calculated at checkout</p>
              <Link href="/checkout" onClick={onClose} className="block">
                <button 
                  disabled={cart.items.length === 0}
                  className="w-full py-4 bg-primary text-primary-foreground text-sm tracking-[0.2em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>
              </Link>
              <div className="text-center pt-2">
                <Link 
                  href="/orders" 
                  onClick={onClose}
                  className="text-[10px] tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors font-bold"
                >
                  View Order History
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
