import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const banners = await prisma.heroBanner.findMany({
      orderBy: { order: "asc" }
    })

    return NextResponse.json(banners)
  } catch (error) {
    console.error("[HERO_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { imageUrl, link, order } = body

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 })
    }

    const banner = await prisma.heroBanner.create({
      data: {
        imageUrl,
        link: link || "/shop",
        order: order || 0
      }
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error("[HERO_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { id, imageUrl, link, order } = body

    if (!id) {
      return new NextResponse("ID is required", { status: 400 })
    }

    const banner = await prisma.heroBanner.update({
      where: { id },
      data: {
        imageUrl,
        link,
        order
      }
    })

    return NextResponse.json(banner)
  } catch (error) {
    console.error("[HERO_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// We also need a DELETE function, but standard Next.js route handlers use query params often for individual IDs
// or we can use another route file. Let's add DELETE here and check id from body or params if it was [id]/route.ts
// But since this is a single route file, we'll use a query param for DELETE or just a POST with delete action.
// Actually, standard practice for individual items is [id]/route.ts.
// Let's create src/app/api/settings/hero/[id]/route.ts for DELETE.
// For now, I'll update the main route to support bulk or just basic GET/POST.
