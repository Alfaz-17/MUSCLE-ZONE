"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DM_Sans } from "next/font/google"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ListTree,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  User,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Monitor,
  Home,
  Layout,
  Megaphone
} from "lucide-react"
import { AdminNav } from "@/components/admin-nav"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700", "800"],
})

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: ListTree
  },
  {
    title: "Hero Banner",
    href: "/admin/settings/hero",
    icon: Layout
  },
  {
    title: "Announcement",
    href: "/admin/settings/announcement",
    icon: Megaphone
  },
]

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: any
  }[]
  onItemClick?: () => void
}

function SidebarNav({ className, items, onItemClick, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex flex-col space-y-2",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onItemClick}
          className={cn(
            "flex items-center gap-4 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border-l-4",
            pathname === item.href
              ? "bg-primary/5 text-primary border-primary shadow-sm"
              : "text-zinc-500 border-transparent hover:bg-zinc-50 hover:text-zinc-950"
          )}
        >
          <item.icon className={cn(
            "h-5 w-5 transition-transform duration-300",
            pathname === item.href ? "text-primary" : "text-zinc-400 group-hover:text-zinc-600"
          )} />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session } = useSession()

  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className={cn(
      "min-h-screen bg-[#f9f9f9] flex text-zinc-950 selection:bg-primary selection:text-white antialiased",
      dmSans.variable,
      "font-[family-name:var(--font-dm-sans)]"
    )}>
      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-500",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Persistent Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 w-[280px] bg-white border-r border-zinc-200 z-[70] transition-transform duration-500 ease-[0.16,1,0.3,1] lg:translate-x-0 lg:flex lg:flex-col",
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <div className="h-24 flex items-center justify-between px-8 border-b border-zinc-100">
          <Link href="/admin/dashboard" className="font-serif text-2xl tracking-tighter text-zinc-950 uppercase group">
            Muscle<span className="text-primary italic transition-all group-hover:pl-1">Zone</span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 hover:bg-zinc-50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-zinc-400" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-10">
          <div className="mb-6 px-8 text-[9px] uppercase tracking-[0.3em] font-bold text-zinc-400">
            Operations Control
          </div>
          <SidebarNav 
            items={sidebarNavItems} 
            onItemClick={() => setIsMobileMenuOpen(false)}
          />
        </div>

        {/* Sidebar Footer: User Info & Logout */}
        <div className="p-6 border-t border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-4 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary/20">
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-950 truncate">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-0.5">Fleet Commander</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600 bg-white border border-zinc-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 rounded-none group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-[280px] relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        
        <AdminNav onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 pt-24 pb-20 px-8 lg:px-12">
          <div className="max-w-[1500px] mx-auto">
            {/* Professional Breadcrumbs & Header */}
            <div className="mb-8">
              <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
                <Link href="/admin/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
                  <Home className="w-3 h-3" /> Dashboard
                </Link>
                {pathname !== "/admin/dashboard" && (
                  <>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-zinc-950">{sidebarNavItems.find(item => item.href === pathname)?.title || "Overview"}</span>
                  </>
                )}
              </nav>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-100 pb-8">
                <div>
                  <h1 className="text-3xl font-bold text-zinc-950 tracking-tight">
                    {sidebarNavItems.find(item => item.href === pathname)?.title || "Overview"}
                  </h1>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-[9px] tracking-widest uppercase font-black text-zinc-500 bg-white border border-zinc-200 px-4 py-2 rounded-lg shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    System Live
                  </div>
                  <Link 
                    href="/"
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-primary transition-colors"
                  >
                    View Site <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Content Container */}
            <div className="min-h-[600px]">
              {children}
            </div>
          </div>
        </main>

        <footer className="py-12 px-12 border-t border-zinc-200 bg-zinc-50 mt-auto">
          <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-zinc-400">
                &copy; {new Date().getFullYear()} MuscleZone HQ Logistics
              </p>
              <p className="text-[9px] tracking-widest uppercase font-bold text-zinc-300">Classified Internal Environment</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
