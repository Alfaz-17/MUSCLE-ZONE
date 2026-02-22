"use client"

import { useState, useEffect } from "react"
import { signIn, getSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Phone, Lock, ArrowRight, Loader2, ChevronLeft } from "lucide-react"
import Image from "next/image"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "login" | "register"
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode)
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Reset state when opening/closing or switching modes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
    }
  }, [isOpen, initialMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mode === "register") {
      if (!phone || !password || !confirmPassword) {
        toast.error("Please fill in all fields")
        return
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match")
        return
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return
      }
    } else {
      if (!phone || !password) {
        toast.error("Please fill in all fields")
        return
      }
    }

    setIsLoading(true)

    try {
      if (mode === "register") {
        // 1. Register
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password, name: "Member" }),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.message || "Registration failed")

        toast.success("Account established!")
        
        // 2. Auto Login
        const result = await signIn("credentials", {
          redirect: false,
          phone,
          password,
        })

        if (result?.error) {
          toast.error("Auto-login failed. Please sign in manually.")
          setMode("login")
        } else {
          toast.success("Welcome to Muscle Zone!")
          onClose()
          router.refresh()
        }
      } else {
        // Login logic
        const result = await signIn("credentials", {
          redirect: false,
          phone,
          password,
        })

        if (result?.error) {
          toast.error("Invalid credentials")
        } else {
          const session = await getSession()
          toast.success("Welcome back!")
          onClose()
          
          if (session?.user?.role === "ADMIN") {
            router.push("/admin/dashboard")
          } else {
            router.refresh()
          }
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[110] p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-2xl pointer-events-auto relative border border-zinc-100"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5 text-zinc-400 hover:text-zinc-900" />
              </button>

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-6">
                    <Image
                      src="/logo.png"
                      alt="Muscle Zone"
                      width={160}
                      height={54}
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                  <h2 className="font-sans font-black text-3xl text-zinc-900 uppercase tracking-tighter mb-2">
                    {mode === "login" ? "Member Access" : "Initialize Account"}
                  </h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                    {mode === "login" 
                      ? "Bhavnagar's Premier Supplement Terminal" 
                      : "Join Bhavnagar's Elite Supplement Terminal"}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    {/* Phone */}
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-zinc-50 rounded-lg border border-zinc-100 group-focus-within:border-primary group-focus-within:bg-primary/5 transition-all">
                        <Phone className="w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-all" />
                      </div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-14 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all font-medium placeholder:text-zinc-400"
                        required
                      />
                    </div>

                    {/* Password */}
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-zinc-50 rounded-lg border border-zinc-100 group-focus-within:border-primary group-focus-within:bg-primary/5 transition-all">
                        <Lock className="w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-all" />
                      </div>
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-14 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all font-medium placeholder:text-zinc-400"
                        required
                      />
                    </div>

                    {/* Confirm Password (Register Mode Only) */}
                    {mode === "register" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="relative group"
                      >
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-zinc-50 rounded-lg border border-zinc-100 group-focus-within:border-primary group-focus-within:bg-primary/5 transition-all">
                          <Lock className="w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-all" />
                        </div>
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-14 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all font-medium placeholder:text-zinc-400"
                          required
                        />
                      </motion.div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white rounded-2xl py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-zinc-900 hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {mode === "login" ? "Grant Access" : "Initialize Account"}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch Mode */}
                <div className="mt-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      {mode === "login" ? "New here?" : "Already a member?"}
                    </span>
                    <button
                      onClick={() => setMode(mode === "login" ? "register" : "login")}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-zinc-900 transition-colors border-b-2 border-primary/20 hover:border-zinc-900"
                    >
                      {mode === "login" ? "Establish Account" : "Member Login"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
