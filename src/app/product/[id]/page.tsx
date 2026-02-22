import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { PremiumFooter } from "@/components/premium-footer"
import { ProductGallery } from "@/components/product-gallery"
import { ProductInfo } from "./product-info"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      variants: {
        orderBy: {
          price: 'asc'
        }
      },
    },
  })

  if (!product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/shop" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors flex items-center gap-2">
            <ArrowLeft className="w-3 h-3" />
            Back to Shop
          </Link>
          <span className="text-zinc-300 text-xs">/</span>
          <span className="text-xs font-black uppercase tracking-widest text-zinc-900">
            {product.category?.name || "Product"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <ProductGallery 
            images={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : ["/placeholder.svg"]} 
            productName={product.name} 
          />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>
      </div>

      <PremiumFooter />
    </main>
  )
}
