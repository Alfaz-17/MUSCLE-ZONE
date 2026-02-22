git remote add origin https://github.com/Alfaz-17/MUSCLE-ZONE.gitimport { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      phone?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
    phone?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    phone?: string | null
  }
}
