import { prisma } from "@/lib/prisma"
import { AnnouncementClient } from "./client"

export default async function AnnouncementPage() {
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
