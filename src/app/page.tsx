import { CategoryCarousel } from "@/components/category-carousel"
import { HeroSection } from "@/components/hero-section"
import { CollectionGrid } from "@/components/collection-grid"
import { StoreGallery } from "@/components/store-gallery"
import { HeritageSection } from "@/components/heritage-section"
import { PremiumFooter } from "@/components/premium-footer"
import { prisma } from "@/lib/prisma"

export default async function Home() {
  const [categories, bestSellers, heroBanner] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.product.findMany({
      where: {
        isBestseller: true
      },
      include: {
        category: true,
        variants: {
          orderBy: {
            price: 'asc'
          }
        },
      },
      take: 8,
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.heroBanner.findMany({
      orderBy: {
        order: 'asc'
      }
    })
  ])

  return (
    <main className="min-h-screen">
      <div className="lg:hidden">
        <CategoryCarousel categories={categories} />
      </div>
      <HeroSection heroBanners={heroBanner} />
      <CollectionGrid products={bestSellers} />
      <StoreGallery />
      <HeritageSection />
      <PremiumFooter />
    </main>
  )
}
