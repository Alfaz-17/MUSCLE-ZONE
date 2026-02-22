import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const orderSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10),
  address: z.string().min(1),
  paymentMethod: z.string().default("COD"),
  shippingFee: z.number().default(0),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })).min(1),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()
    const { name, phone, address, items, paymentMethod, shippingFee } = orderSchema.parse(body)

    const itemsTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
    const totalAmount = itemsTotal + shippingFee

    const order = await prisma.order.create({
      data: {
        user: session?.user?.id ? { connect: { id: session.user.id } } : undefined, // Optional link to user
        name,
        phone,
        address,
        totalAmount,
        shippingFee,
        paymentMethod,
        paymentStatus: "Pending",
        status: "Pending",
        orderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed", { status: 422 })
    }
    console.error("[ORDERS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Admins see all orders, users see only their own
    const orders = await prisma.order.findMany({
      where: session.user.role === "ADMIN" ? {} : { userId: session.user.id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("[ORDERS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
