"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, User, Menu, X, Search, ChevronRight, Facebook as FacebookIcon, Twitter as TwitterIcon, Instagram as InstagramIcon, Youtube as YoutubeIcon, LayoutDashboard, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { MiniCart } from "./mini-cart"
import { useCart } from "@/hooks/use-cart"
import { useSession, signOut } from "next-auth/react"

import { AuthModal } from "./auth-modal"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about", items: ["Our Story", "Certificates", "Store Locations"] },
  { name: "Products", href: "/shop", dropdown: true },
  { name: "Track Order", href: "/orders" },
  { name: "FAQs", href: "/faqs" },
  { name: "Contact", href: "/contact" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const cart = useCart()
  const { data: session } = useSession()
  const [hasAnnouncement, setHasAnnouncement] = useState(false)

  useEffect(() => {
    fetch("/api/settings/announcement")
      .then(res => res.json())
      .then(data => setHasAnnouncement(data.isActive))
      .catch(() => setHasAnnouncement(false))
  }, [])

  // Calculate subtotal from cart state if not directly available as a property
  const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err))
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 z-[60] transition-all duration-300",
          hasAnnouncement && !isScrolled ? "top-9 md:top-11" : "top-0",
          isScrolled 
            ? "bg-white border-b border-zinc-200 py-2 shadow-md" 
            : "bg-white py-3 shadow-sm"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14 md:h-20">
          {/* Column 1: Menu & Links */}
          <div className="flex-1 flex items-center gap-8">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 hover:text-primary transition-colors hover:bg-zinc-50 rounded-lg flex items-center gap-2"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-zinc-900" />
            </button>

            <nav className="hidden lg:flex items-center gap-8 h-full">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group h-full flex items-center">
                  <Link
                    href={link.href}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary h-full flex items-center",
                      pathname === (link.href === "/" ? "/" : link.href) || (link.href !== "/" && pathname.startsWith(link.href)) 
                        ? "text-primary border-b-2 border-primary" 
                        : "text-zinc-900"
                    )}
                  >
                    {link.name}
                    {link.dropdown && <ChevronRight className="w-3 h-3 ml-1 rotate-90" />}
                  </Link>

                  {(link.dropdown || link.items) && (
                    <div className="absolute top-[calc(100%-8px)] left-0 pt-4 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                      <div className="bg-white border border-zinc-100 shadow-2xl rounded-2xl overflow-hidden min-w-[240px] py-3">
                        <div className="px-4 py-2 border-b border-zinc-50 mb-2">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
                            {link.name === "Products" ? "Shop By Category" : "Discover"}
                          </p>
                        </div>
                        {(link.items || (link.dropdown ? categories : [])).map((item: any) => {
                          const isCategory = !!item.id;
                          const label = isCategory ? item.name : item;
                          const href = isCategory 
                            ? `/shop?category=${item.id}` 
                            : `#`; // Placeholder for sub-about links
                            
                          return (
                            <Link
                              key={isCategory ? item.id : item}
                              href={href}
                              className="flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-primary hover:bg-primary/5 transition-all group/item"
                            >
                              {label}
                              <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Column 2: Logo (Centered) */}
          <div className="flex-none flex items-center justify-center">
            <Link href="/" className="flex items-center group relative h-14 md:h-20">
              <Image 
                src="/logo.png" 
                alt="Muscle Zone" 
                width={180} 
                height={60} 
                className="h-50 md:h-50 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Column 3: Actions */}
          <div className="flex-1 flex items-center justify-end gap-1 md:gap-4">
            <button className="hidden sm:flex p-2 hover:bg-zinc-50 rounded-lg transition-colors group">
              <Search className="w-5 h-5 md:w-6 md:h-6 text-zinc-900 group-hover:text-primary transition-colors" />
            </button>
            
            {session ? (
              <div className="relative">
                <button 
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="p-2 hover:bg-zinc-50 rounded-lg transition-colors group flex items-center gap-2"
                >
                  <div className="w-10 h-10 md:w-6 md:h-6 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border border-zinc-200 group-hover:border-primary transition-colors">
                    <User className="w-5 h-5 md:w-4 md:h-4 text-zinc-900 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="hidden lg:inline text-[10px] font-black uppercase tracking-widest text-zinc-900">{session.user?.name?.split(' ')[0]}</span>
                </button>
                
                <AnimatePresence>
                  {isAccountMenuOpen && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="fixed inset-0 z-[70]"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-zinc-100 shadow-xl rounded-2xl overflow-hidden z-[80] py-2"
                      >
                        <div className="px-4 py-2 border-b border-zinc-50 mb-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Account</p>
                          <p className="text-[11px] font-bold text-zinc-900 truncate">{session.user?.name}</p>
                        </div>
                        <Link 
                          href="/orders"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-primary hover:bg-zinc-50 transition-all"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          My Orders
                        </Link>
                        {session.user?.role === 'ADMIN' && (
                          <Link 
                            href="/admin/dashboard"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-primary hover:bg-zinc-50 transition-all"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                        <button 
                          onClick={() => {
                            setIsAccountMenuOpen(false)
                            signOut()
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="p-2 hover:bg-zinc-50 rounded-lg transition-colors group"
              >
                <User className="w-5 h-5 md:w-6 md:h-6 text-zinc-900 group-hover:text-primary transition-colors" />
              </button>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-zinc-50 rounded-lg transition-all relative group"
            >
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-zinc-900 group-hover:text-primary transition-colors" />
              {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cart.items.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[65] bg-black/60 backdrop-blur-sm"
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[400px] z-[70] bg-[#1a1a1a] shadow-2xl flex flex-col overflow-y-auto"
            >
              {/* Header with Close */}
              <div className="p-6 flex justify-end">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="px-6 mb-8">
                <div className="flex h-12">
                  <input 
                    type="text"
                    placeholder="Search in..."
                    className="flex-1 bg-white/5 border border-white/10 px-4 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                  <button className="w-14 bg-primary flex items-center justify-center text-zinc-900">
                    <Search className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col">
                {[
                  { name: "HOME", href: "/" },
                  { name: "ABOUT US", items: ["Our Story", "Certificates", "Store Locations"] },
                  { name: "PRODUCTS", items: categories },
                  { name: "TRACK ORDER", href: "/orders" },
                  { name: "FAQS", href: "/faqs" },
                  { name: "CONTACT US", href: "/contact" },
                ].map((link) => (
                  <div key={link.name} className="border-b border-white/5">
                    {link.items ? (
                      <div>
                        <button
                          onClick={() => setActiveAccordion(activeAccordion === link.name ? null : link.name)}
                          className="w-full flex items-center justify-between px-8 py-5 group hover:bg-white/5 transition-colors"
                        >
                          <span className={cn(
                            "text-[13px] font-black uppercase tracking-[0.1em] transition-colors font-sans",
                            activeAccordion === link.name ? "text-primary" : "text-zinc-300"
                          )}>
                            {link.name}
                          </span>
                          <ChevronRight className={cn(
                            "w-4 h-4 text-zinc-600 transition-transform duration-300",
                            activeAccordion === link.name ? "rotate-90 text-primary" : ""
                          )} />
                        </button>
                        <AnimatePresence>
                          {activeAccordion === link.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden bg-black/20"
                            >
                                {link.items.map((subItem: any) => (
                                  <Link
                                    key={typeof subItem === 'string' ? subItem : subItem.id}
                                    href={`/shop?category=${typeof subItem === 'string' ? subItem : subItem.id}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-12 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-widest hover:text-primary transition-colors"
                                  >
                                    {typeof subItem === 'string' ? subItem : subItem.name}
                                  </Link>
                                ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href || "#"}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-8 py-5 group hover:bg-white/5 transition-colors"
                      >
                        <span className="text-[13px] font-black uppercase tracking-[0.1em] text-zinc-300 group-hover:text-primary transition-colors font-sans">
                          {link.name}
                        </span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Social Footer */}
              <div className="mt-auto py-12 px-8 flex justify-center gap-8">
                <Link href="#" className="p-3 bg-white/5 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                  <FacebookIcon className="w-5 h-5" />
                </Link>
                <Link href="#" className="p-3 bg-white/5 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                  <TwitterIcon className="w-5 h-5" />
                </Link>
                <Link href="#" className="p-3 bg-white/5 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                  <InstagramIcon className="w-5 h-5" />
                </Link>
                <Link href="#" className="p-3 bg-white/5 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                  <YoutubeIcon className="w-5 h-5" />
                </Link>
              </div>

              <div className="p-8 text-center border-t border-white/5">
                 <div className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-black">
                   Muscle Zone &copy; {new Date().getFullYear()}
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
