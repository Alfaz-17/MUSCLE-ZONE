import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.string().min(1),
  imageUrls: z.array(z.string()).default([]),
  isBestseller: z.boolean().default(false),
  status: z.string().default("ACTIVE"),
  productType: z.string().optional(),
  variants: z.array(z.object({
    quantityLabel: z.string().optional(),
    flavor: z.string().optional().nullable(),
    price: z.number().min(0),
    mrp: z.number().min(0).optional().nullable(),
    discount: z.number().min(0).optional().nullable(),
    tax: z.number().min(0).optional().nullable(),
    stock: z.number().min(0),
    sku: z.string().optional().nullable(),
  })).optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { variants, ...productData } = productSchema.parse(body)

    const product = await prisma.product.create({
      data: {
        ...productData,
        description: productData.description || "",
        variants: {
          create: variants && variants.length > 0 ? variants.map((v) => ({
            quantityLabel: v.quantityLabel,
            flavor: v.flavor,
            price: v.price,
            mrp: v.mrp,
            discount: v.discount,
            tax: v.tax,
            stock: v.stock,
            sku: v.sku
          })) : []
        }
      },
      include: {
        variants: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[PRODUCTS_POST_VALIDATION_ERROR]", error.errors)
      return new NextResponse("Invalid request data passed", { status: 422 })
    }
    console.error("[PRODUCTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId")
    const isBestseller = searchParams.get("isBestseller")

    const products = await prisma.product.findMany({
      where: {
        categoryId: categoryId || undefined,
        isBestseller: isBestseller === "true" ? true : undefined,
      },
      include: {
        category: true,
        variants: {
          orderBy: {
            price: 'asc'
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("[PRODUCTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
