import { prisma } from "@/lib/prisma"
import { HeroClient } from "./client"

export default async function HeroSettingsPage() {
  const banners = await prisma.heroBanner.findMany({
    orderBy: { order: "asc" }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Multi-Image Hero Banner</h2>
            <p className="text-sm text-muted-foreground">
              Add and manage multiple images for your storefront's hero section
            </p>
          </div>
        </div>
        <HeroClient initialData={banners} />
      </div>
    </div>
  )
}
