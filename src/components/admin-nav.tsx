"use client"

import { useSession } from "next-auth/react"
import { Search, Menu, Bell, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminNavProps {
  onMenuClick?: () => void
}

export function AdminNav({ onMenuClick }: AdminNavProps) {
  const { data: session } = useSession()

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-[280px] z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="mx-auto h-20 px-8 flex items-center justify-between">
        <div className="flex items-center gap-6 flex-1">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="hidden md:flex items-center gap-3 bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl w-full max-w-md group focus-within:bg-white focus-within:shadow-lg focus-within:border-primary/20 transition-all">
            <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search for orders, products, customers..." 
              className="bg-transparent border-none outline-none text-[11px] font-bold uppercase tracking-widest text-zinc-900 placeholder:text-zinc-300 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Main Server</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-zinc-100 hidden sm:block" />

          <div className="flex items-center gap-5">
            <button className="p-2 text-zinc-400 hover:text-primary transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-3 pl-2">
              <div className="flex flex-col items-end hidden lg:flex">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900 leading-none">
                  {session?.user?.name || "Administrator"}
                </p>
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">Admin Access</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center overflow-hidden shadow-sm">
                <ShieldCheck className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
