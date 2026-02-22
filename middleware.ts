import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname
    
    // Protect /admin routes
    if (pathname.startsWith("/admin")) {
      // Allow access to /admin/login without protection if not logged in
      if (pathname === "/admin/login") {
        return NextResponse.next()
      }
      
      // If not logged in, redirect to admin login
      if (!token) {
        const url = new URL("/admin/login", req.url)
        return NextResponse.redirect(url)
      }
      
      // If logged in but not an admin, redirect to home
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        // Always authorize the admin login page so it can be viewed
        if (pathname === "/admin/login") return true
        // For other protected routes, check if token exists
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/admin/:path*", "/orders/:path*"],
}
