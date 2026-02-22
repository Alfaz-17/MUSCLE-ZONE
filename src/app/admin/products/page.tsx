import { prisma } from "@/lib/prisma"
import { ProductClient } from "./client"

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
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
  })

  // Also fetch categories for the 'Add Product' form
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient initialProducts={products} categories={categories} />
      </div>
    </div>
  )
}
