import { prisma } from "@/lib/prisma"
import { AnnouncementClient } from "./client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AnnouncementPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  const announcement = await prisma.announcementBar.findUnique({
    where: { id: "announcement-main" }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AnnouncementClient initialData={announcement} />
      </div>
    </div>
  )
}
