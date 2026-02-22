
import { prisma } from "@/lib/prisma"
import { CategoryClient } from "./client"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: { products: true },
      },
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient initialCategories={categories} />
      </div>
    </div>
  )
}
