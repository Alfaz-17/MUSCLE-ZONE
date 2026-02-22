"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowRight, Search as SearchIcon, X } from "lucide-react"
import { ProductCard } from "@/components/product-card"

interface ShopClientProps {
  initialProducts: any[]
  initialCategories: any[]
}

export function ShopClient({ initialProducts, initialCategories }: ShopClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const searchQueryParam = searchParams.get("search") || ""
  const categoryParam = searchParams.get("category") || "All"
  
  const [activeCategory, setActiveCategory] = useState(categoryParam)
  const [localSearch, setLocalSearch] = useState(searchQueryParam)

  // Sync active category with URL param
  useEffect(() => {
    setActiveCategory(categoryParam)
  }, [categoryParam])

  // Sync local search with URL param
  useEffect(() => {
    setLocalSearch(searchQueryParam)
  }, [searchQueryParam])

  // De-bounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQueryParam) {
        const params = new URLSearchParams(searchParams.toString())
        if (localSearch) {
          params.set("search", localSearch)
        } else {
          params.delete("search")
        }
        router.replace(`/shop?${params.toString()}`, { scroll: false })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [localSearch, router, searchQueryParam, searchParams])

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId === "All") {
      params.delete("category")
    } else {
      params.set("category", categoryId)
    }
    router.replace(`/shop?${params.toString()}`, { scroll: false })
    setActiveCategory(categoryId)
  }

  const filteredProducts = initialProducts.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.categoryId === activeCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQueryParam.toLowerCase()) || 
                          p.category?.name?.toLowerCase().includes(searchQueryParam.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const clearFilters = () => {
    router.push("/shop")
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[40dvh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/main3.webp"
            alt="Muscle Zone store"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>

        <motion.div
          className="relative z-10 text-center text-background px-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[10px] tracking-[0.4em] uppercase font-bold mb-4 block">Muscle Zone</span>
          <h1 className="font-serif text-5xl md:text-7xl mb-4">The Collection</h1>
          <div className="w-20 h-1 bg-primary mx-auto mb-6" />
        </motion.div>
      </section>

      {/* Search & Tabs Section */}
      <section className="sticky top-[64px] lg:top-[80px] z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Search Bar */}
            <div className="relative w-full md:w-80 group">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-muted/20 border border-border rounded-full py-2.5 pl-11 pr-10 text-xs outline-none focus:ring-1 focus:ring-primary focus:bg-background transition-all"
              />
              {localSearch && (
                <button 
                  onClick={() => setLocalSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Premium Tabs */}
            <div className="flex items-center p-1 bg-muted/30 rounded-full border border-border/50 overflow-x-auto no-scrollbar max-w-full">
              <button
                onClick={() => handleCategoryChange("All")}
                className={`relative px-6 py-2 text-[10px] tracking-widest uppercase font-bold transition-all duration-300 whitespace-nowrap ${
                  activeCategory === "All" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="relative z-10">All</span>
                {activeCategory === "All" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-foreground rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
              {initialCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`relative px-6 py-2 text-[10px] tracking-widest uppercase font-bold transition-all duration-300 whitespace-nowrap ${
                    activeCategory === category.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="relative z-10">{category.name}</span>
                  {activeCategory === category.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-foreground rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {filteredProducts.length === 0 ? (
              <motion.div 
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-32 bg-muted/5 border border-dashed border-border rounded-xl"
              >
                <SearchIcon className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-serif text-2xl mb-2">No results found</h3>
                <p className="text-muted-foreground text-sm mb-8">Try adjusting your search or category filters.</p>
                <button 
                  onClick={clearFilters}
                  className="px-8 py-3 bg-foreground text-background text-[10px] tracking-widest uppercase font-bold hover:bg-primary transition-colors"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory + searchQueryParam}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
              >
                {filteredProducts.map((product, index) => {
                  const firstVariant = product.variants?.[0] || product
                  return (
                    <ProductCard 
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={firstVariant.price}
                      mrp={firstVariant.mrp}
                      discount={firstVariant.discount}
                      image={product.imageUrls?.[0] || "/placeholder.svg"}
                      hoverImage={product.imageUrls?.[1] || product.imageUrls?.[0] || "/placeholder.svg"}
                      category={product.category?.name}
                      index={index}
                    />
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-muted py-16 md:py-24 bg-zinc-50/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-sans font-black text-3xl md:text-5xl mb-6 uppercase tracking-tighter">Why Muscle Zone?</h2>
          <p className="text-zinc-500 font-medium mb-8 max-w-xl mx-auto">
            Bhavnagar's premier destination for authentic supplements. We source only lab-tested products from certified brands. Quality and trust are our foundation.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase border-b-2 border-primary text-primary pb-1 hover:gap-4 transition-all duration-300"
          >
            Learn More About Us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
