import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const banner = await prisma.heroBanner.delete({
      where: { id }
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error("[HERO_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { imageUrl, link, order } = body

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 })
    }

    const banner = await prisma.heroBanner.update({
      where: { id },
      data: {
        imageUrl,
        link: link || "/shop",
        order: order || 0
      }
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error("[HERO_PATCH_ID]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
