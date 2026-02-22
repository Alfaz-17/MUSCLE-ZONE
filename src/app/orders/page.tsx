import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PremiumFooter } from "@/components/premium-footer"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Clock, Package, Truck, CheckCircle2, XCircle } from "lucide-react"

const OrderStatusTimeline = ({ status }: { status: string }) => {
  const steps = [
    { label: "Pending", icon: Clock },
    { label: "Confirmed", icon: Package },
    { label: "Out for delivery", icon: Truck },
    { label: "Delivered", icon: CheckCircle2 },
  ]

  const currentStep = steps.findIndex((step) => step.label === status)
  const isCancelled = status === "Cancelled"

  return (
    <div className="w-full py-6">
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-1000" 
          style={{ width: isCancelled ? "0%" : `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index <= currentStep && !isCancelled
          return (
            <div key={step.label} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-background transition-colors duration-500 ${isActive ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] tracking-widest uppercase font-bold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
      {isCancelled && (
        <div className="mt-4 flex items-center justify-center gap-2 text-destructive">
          <XCircle className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Order Cancelled</span>
        </div>
      )}
    </div>
  )
}

export default async function UserOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
  })

  return (
    <main className="min-h-screen bg-background">
      <div className="pt-24 lg:pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-4">Your Orders</h1>
            <p className="text-muted-foreground tracking-wide max-w-xl">
              Track your supplement journey. View past orders, check status, and manage your deliveries.
            </p>
          </div>

          <div className="space-y-8">
            {orders.length === 0 ? (
              <div className="text-center py-24 bg-card border border-border">
                <p className="text-muted-foreground mb-6">You haven&apos;t placed any orders yet.</p>
                <Link href="/shop" className="inline-flex items-center text-sm tracking-[0.2em] uppercase border-b border-primary text-primary pb-1 hover:border-transparent transition-all duration-300">
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-card border border-border overflow-hidden transition-all duration-300 hover:shadow-md">
                  {/* Order header */}
                  <div className="bg-muted/10 p-6 border-b border-border flex flex-wrap items-center justify-between gap-6">
                    <div className="flex flex-wrap gap-x-12 gap-y-4">
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-bold mb-1">Order Placed</p>
                        <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-bold mb-1">Total Amount</p>
                        <p className="text-sm font-serif text-primary">₹{order.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-bold mb-1">Recipient</p>
                        <p className="text-sm font-medium">{order.name}</p>
                      </div>
                    </div>
                    <div>
                        <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest ${
                          order.status === "Delivered" ? "bg-green-500/10 text-green-600 border border-green-500/20" :
                          order.status === "Cancelled" ? "bg-red-500/10 text-red-600 border border-red-500/20" :
                          "bg-primary/10 text-primary border border-primary/20"
                        }`}>
                          {order.status}
                        </span>
                        <div className="mt-2 text-right">
                          <p className="text-[8px] uppercase tracking-tighter text-muted-foreground">
                            {order.paymentMethod} • {order.paymentStatus}
                          </p>
                          {order.trackingId && (
                             <p className="text-[8px] uppercase tracking-tighter text-primary font-bold mt-0.5">
                               Track: {order.trackingId}
                             </p>
                          )}
                        </div>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="p-6 divide-y divide-border">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex gap-6 py-4 first:pt-0 last:pb-0">
                        {/* ... item content ... */}
                        <div className="w-20 h-24 bg-muted overflow-hidden shrink-0 border border-border group relative">
                          {item.product.imageUrls?.[0] ? (
                            <img src={item.product.imageUrls[0]} alt={item.product.name} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-serif text-lg mb-1">{item.product.name}</h3>
                            <p className="text-xs text-muted-foreground tracking-wide">Quantity: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-primary">₹{item.price.toLocaleString()}</p>
                        </div>
                        <div className="hidden sm:flex items-center">
                          <Link 
                            href={`/product/${item.productId}`}
                            className="text-[10px] tracking-[0.2em] uppercase border border-border px-4 py-2 hover:bg-foreground hover:text-background transition-colors duration-300"
                          >
                            Buy Again
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Visual Timeline */}
                  <div className="px-6 pb-6 pt-2 border-t border-border bg-muted/5">
                    <OrderStatusTimeline status={order.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <PremiumFooter />
    </main>
  )
}
