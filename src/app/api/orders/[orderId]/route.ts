import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const orderUpdateSchema = z.object({
  status: z.enum(["Pending", "Confirmed", "Out for delivery", "Delivered", "Cancelled"]).optional(),
  paymentStatus: z.enum(["Pending", "Paid", "Refunded"]).optional(),
  trackingId: z.string().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { status, paymentStatus, trackingId } = orderUpdateSchema.parse(body)

    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 })
    }

    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
        paymentStatus,
        trackingId,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed", { status: 422 })
    }
    console.error("[ORDER_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 })
    }

    const order = await prisma.order.delete({
      where: {
        id: orderId,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("[ORDER_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
