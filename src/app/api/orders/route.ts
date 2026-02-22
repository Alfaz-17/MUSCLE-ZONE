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
    variantId: z.string().optional(), // Added variantId
    quantity: z.number().min(1),
    price: z.number().optional(), // Now ignored in favor of DB price
  })).min(1),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()
    const { name, phone, address, items, paymentMethod, shippingFee } = orderSchema.parse(body)

    // Verify items and calculate total from database prices to prevent price tampering
    // We fetch variants since that's where the actual prices and stock live
    const variantIds = items.map(item => item.variantId).filter(Boolean) as string[]
    
    const variants = await prisma.productVariant.findMany({
      where: {
        id: { in: variantIds }
      },
      include: {
        product: true
      }
    })

    const itemsTotal = items.reduce((total: number, item: any) => {
      const variant = variants.find((v: any) => v.id === item.variantId)
      if (!variant) throw new Error(`Variant not found: ${item.variantId}`)
      return total + (variant.price * item.quantity)
    }, 0)

    const totalAmount = itemsTotal + shippingFee

    const order = await prisma.order.create({
      data: {
        user: session?.user?.id ? { connect: { id: session.user.id } } : undefined,
        name,
        phone,
        address,
        totalAmount,
        shippingFee,
        paymentMethod,
        paymentStatus: "Pending",
        status: "Pending",
        orderItems: {
          create: items.map((item: any) => {
            const variant = variants.find((v: any) => v.id === item.variantId)
            return {
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: variant?.price || 0, // Enforce DB price
            }
          }),
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
