import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const categorySchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional(),
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params
    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 })
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, imageUrl } = categorySchema.parse(body)

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 })
    }

    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        imageUrl,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data passed", { status: 422 })
    }
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 })
    }

    const category = await prisma.category.delete({
      where: {
        id: categoryId,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
