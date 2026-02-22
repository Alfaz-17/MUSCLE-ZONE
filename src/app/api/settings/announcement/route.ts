import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const announcement = await prisma.announcementBar.findUnique({
      where: { id: "announcement-main" }
    })

    if (!announcement) {
      return NextResponse.json({
        text: "Direct from authorized distributors. #1 Supplement Store.",
        isActive: false
      })
    }

    return NextResponse.json(announcement)
  } catch (error) {
    console.error("[ANNOUNCEMENT_GET]", error)
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
    const { text, isActive } = body

    if (text === undefined || isActive === undefined) {
      return new NextResponse("Text and isActive status are required", { status: 400 })
    }

    const announcement = await prisma.announcementBar.upsert({
      where: { id: "announcement-main" },
      update: {
        text,
        isActive
      },
      create: {
        id: "announcement-main",
        text,
        isActive
      }
    })

    return NextResponse.json(announcement)
  } catch (error) {
    console.error("[ANNOUNCEMENT_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
