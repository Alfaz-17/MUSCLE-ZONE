"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface CategoryCarouselProps {
  categories: {
    id: string;
    name: string;
    imageUrl?: string | null;
  }[]
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const searchParams = useSearchParams();
  const activeCategoryId = searchParams.get("category");

  return (
    <div className="bg-white pt-24 pb-4 border-b border-zinc-50 overflow-hidden">
      <div className="max-w-[1400px] mx-auto overflow-hidden">
        {/* Horizontal Strip Container */}
        <div className="flex items-start gap-1 overflow-x-auto no-scrollbar px-4 pb-2 snap-x swipe-handler">
          {categories.map((cat, index) => {
            const isActive = activeCategoryId === cat.id;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="flex-none snap-start"
              >
                <Link 
                  href={`/shop?category=${cat.id}`} 
                  className="flex flex-col items-center w-[80px] group transition-all"
                >
                  {/* Circular Icon Container */}
                  <div className={cn(
                    "relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300",
                    "border-2",
                    isActive 
                      ? "border-primary bg-primary/5 scale-110 shadow-md" 
                      : "border-zinc-100 bg-zinc-50 group-hover:border-zinc-300 group-hover:bg-white"
                  )}>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={cat.imageUrl || "/placeholder-category.png"}
                        alt={cat.name}
                        fill
                        className={cn(
                          "object-cover transition-transform duration-500",
                          isActive ? "scale-100" : "group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
                        )}
                      />
                    </div>
                  </div>

                  {/* Category Name */}
                  <span className={cn(
                    "mt-2 text-[9px] font-bold uppercase tracking-tight text-center leading-tight transition-colors line-clamp-2 px-1",
                    isActive ? "text-primary font-black" : "text-zinc-500 group-hover:text-zinc-900"
                  )}>
                    {cat.name}
                  </span>

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeCategory"
                      className="mt-1 h-0.5 w-6 bg-primary rounded-full"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
