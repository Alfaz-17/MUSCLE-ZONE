"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        ...formData,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Access Denied: Invalid Personnel Credentials")
      } else {
        toast.success("Command Terminal Initialized")
        router.push("/admin/dashboard")
      }
    } catch (error) {
      toast.error("System Error: Authorization Terminal Offline")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-zinc-900 overflow-hidden relative">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-200 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] border border-zinc-200 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          
          <div className="flex flex-col items-center mb-10">
            <div className="bg-zinc-50 p-5 rounded-2xl mb-6 border border-zinc-100 group-hover:border-primary/20 transition-colors duration-500">
              <Link href="/" className="group/logo block">
                <Image 
                  src="/logo.png" 
                  alt="Muscle Zone" 
                  width={160} 
                  height={54} 
                  className="h-12 w-auto object-contain grayscale group-hover/logo:grayscale-0 transition-all duration-500"
                />
              </Link>
            </div>
            <h1 className="text-2xl font-serif uppercase tracking-tight text-zinc-900">Personnel access</h1>
            <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold mt-3">Internal Operations Terminal</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="relative group/input">
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-400 ml-1 mb-2 block">Personnel Phone Number</label>
                <div className="relative">
                  <Input
                    type="tel"
                    placeholder="91XXXXXXXXXX"
                    disabled={isLoading}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-300 h-14 rounded-xl focus:ring-primary/50 transition-all pl-12"
                    required
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-hover/input:text-primary transition-colors">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="relative group/input">
                <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-400 ml-1 mb-2 block">Security Sequence</label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    disabled={isLoading}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-300 h-14 rounded-xl focus:ring-primary/50 transition-all pl-12"
                    required
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-hover/input:text-primary transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              disabled={isLoading} 
              className="w-full bg-zinc-900 hover:bg-primary text-white h-14 rounded-xl font-bold uppercase tracking-[0.25em] text-[11px] shadow-xl hover:shadow-primary/20 transition-all duration-500 group/btn" 
              type="submit"
            >
              <span className="group-hover:tracking-[0.4em] transition-all duration-500">
                {isLoading ? "Authenticating..." : "Initialize Command"}
              </span>
            </Button>
          </form>

          <div className="mt-10 space-y-4">
            <div className="h-[1px] bg-zinc-100 w-full" />
            <div className="flex flex-col items-center gap-4">
              <p className="text-center text-[10px] tracking-[0.2em] uppercase font-medium text-zinc-400 leading-relaxed">
                System monitoring active.<br />
                All login attempts are logged for security.
              </p>
              <Link href="/" className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary hover:underline transition-all">
                ← Back to Store
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
