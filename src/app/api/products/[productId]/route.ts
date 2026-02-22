import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  mrp: z.number().min(0).optional().nullable(),
  discount: z.number().min(0).optional().nullable(),
  tax: z.number().min(0).optional().nullable(),
  stock: z.number().min(0).optional().nullable(),
  categoryId: z.string().min(1),
  imageUrls: z.array(z.string()).default([]),
  quantity: z.string().optional().nullable(),
  flavors: z.array(z.string()).default([]),
  isBestseller: z.boolean().default(false),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = productSchema.parse(body)

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 })
    }

    // Update the main product model
    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...validatedData,
        description: validatedData.description || "",
        // Explicitly handle nulls for Prisma optional fields
        price: validatedData.price ?? undefined,
        mrp: validatedData.mrp ?? undefined,
        discount: validatedData.discount ?? undefined,
        tax: validatedData.tax ?? undefined,
        stock: validatedData.stock ?? undefined,
      },
      include: {
        variants: true
      }
    })

    // Sync with the primary variant if it exists, or create one for single-variant products
    if (product.variants && product.variants.length > 0) {
      await prisma.productVariant.update({
        where: { id: product.variants[0].id },
        data: {
          price: validatedData.price || 0,
          mrp: validatedData.mrp ?? undefined,
          discount: validatedData.discount ?? undefined,
          tax: validatedData.tax ?? undefined,
          stock: validatedData.stock || 0,
          quantityLabel: validatedData.quantity ?? undefined,
          flavor: validatedData.flavors && validatedData.flavors.length > 0 ? validatedData.flavors[0] : null
        }
      })
    } else {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          price: validatedData.price || 0,
          mrp: validatedData.mrp ?? undefined,
          discount: validatedData.discount ?? undefined,
          tax: validatedData.tax ?? undefined,
          stock: validatedData.stock || 0,
          quantityLabel: validatedData.quantity ?? undefined,
          flavor: validatedData.flavors && validatedData.flavors.length > 0 ? validatedData.flavors[0] : null
        }
      })
    }

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[PRODUCT_PATCH_VALIDATION_ERROR]", error.issues)
      return new NextResponse("Invalid request data passed", { status: 422 })
    }
    console.error("[PRODUCT_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 })
    }

    const product = await prisma.product.delete({
      where: {
        id: productId,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
