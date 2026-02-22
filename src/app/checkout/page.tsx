"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Lock, CreditCard, Truck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"

import { useSession } from "next-auth/react"

export default function CheckoutPage() {
  const cart = useCart()
  const router = useRouter()
  const { data: session } = useSession()
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  })

  // Prevent hydration errors and auto-fill session data
  useEffect(() => {
    setIsMounted(true)
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || "",
        phone: (session.user as any).phone || "",
      }))
    }
  }, [session])

  if (!isMounted) return null

  if (cart.items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif text-3xl mb-4">Your bag is empty</h1>
        <p className="text-muted-foreground mb-8 text-lg">Add some items to your bag before checking out.</p>
        <Link href="/shop">
          <Button className="tracking-widest uppercase">Go to shop</Button>
        </Link>
      </div>
    )
  }

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = subtotal > 5000 ? 0 : 150
  const total = subtotal + shipping

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in Name, Phone, and Address.")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          items: cart.items.map(item => ({
            productId: item.productId,
            variantId: item.id, // In use-cart, 'id' is variantId
            quantity: item.quantity,
          }))
        })
      })

      if (!response.ok) throw new Error("Failed to place order")

      setIsSuccess(true)
      cart.clearCart()
    } catch (error) {
      console.error(error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/shop"
              className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Back to Shop</span>
            </Link>
            <Link href="/" className="font-serif text-lg lg:text-2xl tracking-[0.3em] uppercase">
              Muscle Zone
            </Link>
            <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
              <Lock className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 lg:px-8 py-10 lg:py-16">
        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 max-w-md mx-auto"
          >
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="font-serif text-3xl md:text-5xl mb-4">Thank You!</h1>
            <p className="text-muted-foreground mb-10">Your order has been placed successfully. We will call you to confirm your delivery shortly.</p>
            <div className="space-y-4">
                {session ? (
                  <Link href="/orders" className="block">
                      <Button variant="outline" className="w-full tracking-widest uppercase py-6">View My Orders</Button>
                  </Link>
                ) : (
                  <Link href="/login" className="block text-sm text-primary hover:underline underline-offset-4 mb-4">
                    Create an account to track future orders
                  </Link>
                )}
                <Link href="/" className="block">
                    <Button className="w-full tracking-widest uppercase py-6">Return to Home</Button>
                </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Left - Simplified Form */}
            <div className="space-y-10">
              <div>
                <h2 className="font-serif text-2xl mb-8 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    Checkout Details
                </h2>
                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">Full Name</label>
                        <Input 
                          className="bg-transparent border-0 border-b rounded-none px-0 py-2 focus-visible:ring-0 focus:border-primary transition-colors text-lg" 
                          placeholder="Your Name" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">Phone Number</label>
                        <Input 
                          className="bg-transparent border-0 border-b rounded-none px-0 py-2 focus-visible:ring-0 focus:border-primary transition-colors text-lg" 
                          placeholder="Contact Number (for delivery confirmation)" 
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">Full Address</label>
                        <Input 
                          className="bg-transparent border-0 border-b rounded-none px-0 py-2 focus-visible:ring-0 focus:border-primary transition-colors text-lg" 
                          placeholder="House No, Area, Near Landmark" 
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                        <p className="text-[10px] text-muted-foreground pt-1 italic">We currently deliver only within Bhavnagar area.</p>
                    </div>
                </div>
              </div>

              <div className="space-y-6">
                <Button 
                  onClick={handlePlaceOrder} 
                  disabled={loading}
                  className="w-full py-8 text-sm tracking-[0.3em] uppercase"
                >
                  {loading ? "Processing..." : `Place Order — ₹${total}`}
                </Button>

                {!session && (
                  <div className="text-center">
                    <Link href="/login" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                      Login for faster checkout & order history (optional)
                    </Link>
                  </div>
                )}
              </div>

              <div className="p-4 bg-muted/50 border rounded-md">
                  <p className="text-[10px] text-muted-foreground leading-relaxed text-center">
                    All orders are Cash on Delivery (COD). 
                    <br />
                    By placing your order, you agree to Muscle Zone&apos;s terms of service.
                  </p>
              </div>
            </div>

            {/* Right - Summary */}
            <div>
              <div className="lg:sticky lg:top-32 bg-card p-6 lg:p-10 border rounded-sm">
                <h2 className="font-serif text-xl mb-8">Your Order</h2>
                
                <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-muted shrink-0 rounded-sm overflow-hidden border border-border">
                         {item.imageUrls?.[0] ? (
                           <img src={item.imageUrls[0]} alt={item.name} className="object-cover w-full h-full" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground uppercase tracking-widest">IMG</div>
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium line-clamp-1 mb-1">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-xs font-semibold mt-2">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-serif pt-4 border-t border-border">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {shipping > 0 && (
                     <p className="text-[10px] text-primary mt-4 font-medium tracking-wide text-center uppercase">
                         Add ₹{(5000 - subtotal).toLocaleString()} more for Free Delivery
                     </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
