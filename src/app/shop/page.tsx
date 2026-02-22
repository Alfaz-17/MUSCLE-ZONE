import { Suspense } from "react"
import { PremiumFooter } from "@/components/premium-footer"
import { prisma } from "@/lib/prisma"
import { ShopClient } from "./shop-client"

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        variants: {
          orderBy: {
            price: 'asc'
          }
        }
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ])

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <Suspense fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Initializing Terminal...</p>
          </div>
        </div>
      }>
        <ShopClient initialProducts={products} initialCategories={categories} />
      </Suspense>
      <PremiumFooter />
    </main>
  )
}
