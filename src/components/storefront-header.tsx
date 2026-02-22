"use client"

import { usePathname } from "next/navigation"
import React from "react"

interface StorefrontHeaderProps {
  children: React.ReactNode
}

export function StorefrontHeader({ children }: StorefrontHeaderProps) {
  const pathname = usePathname()
  
  // Check if the current route is an admin route
  const isAdminRoute = pathname?.startsWith("/admin")

  if (isAdminRoute) {
    return null
  }

  return <>{children}</>
}
