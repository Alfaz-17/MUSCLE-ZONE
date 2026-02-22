import { prisma } from "@/lib/prisma"
import { OrderClient } from "./client"

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true
        }
      }
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient initialOrders={orders} />
      </div>
    </div>
  )
}
