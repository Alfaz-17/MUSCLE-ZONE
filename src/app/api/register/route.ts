import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10), // Basic phone validation
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, phone, email, password } = registerSchema.parse(body)

    const existingUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { phone },
          ...(email ? [{ email }] : [])
        ]
      },
    })

    if (existingUser) {
      const isPhoneDuplicate = existingUser.phone === phone
      return NextResponse.json(
        { message: `User with this ${isPhoneDuplicate ? 'phone number' : 'email'} already exists` },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate a placeholder email if not provided to satisfy the unique constraint in Prisma schema if necessary
    // However, if the schema says email is unique, we must provide something or change the schema.
    // Let's check the schema again. Line 13: email String @unique
    // So email is REQUIRED and UNIQUE. I should probably use a dummy email based on phone if not provided.
    const userEmail = email || `${phone}@musclezone.com`

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email: userEmail,
        password: hashedPassword,
      },
    })

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { user: userWithoutPassword, message: "User created successfully" },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
