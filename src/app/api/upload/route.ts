import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (err) {
      // Ignore if directory already exists
    }

    const uniqueId = uuidv4()
    const filename = `${uniqueId}-${file.name.replace(/\s+/g, "-")}`
    const filePath = path.join(uploadsDir, filename)

    await writeFile(filePath, buffer)
    
    const publicUrl = `/uploads/${filename}`
    
    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("[UPLOAD_ERROR]", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
