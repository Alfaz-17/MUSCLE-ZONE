
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.announcementBar.upsert({
    where: { id: "announcement-main" },
    update: {},
    create: {
      id: "announcement-main",
      text: "Direct from authorized distributors. #1 Supplement Store in Bhavnagar.",
      isActive: true,
    },
  })
  console.log("Announcement bar record ensured.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
