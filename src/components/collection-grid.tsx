"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ProductCard } from "./product-card"

interface CollectionGridProps {
  products: any[]
}

export function CollectionGrid({ products }: CollectionGridProps) {
  return (
    <section className="py-20 lg:py-32 px-6 lg:px-8 bg-zinc-50/50">
      <div className="max-w-[1400px] mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <h2 className="font-sans font-black text-4xl lg:text-6xl mb-4 uppercase tracking-tighter">Best Sellers</h2>
            <p className="text-zinc-500 font-medium tracking-wide">
              Bhavnagar's most trusted fitness fuel. 
              Top-selling performance supplements picked for you.
            </p>
          </motion.div>

          <Link
            href="/shop"
            className="group flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-primary hover:text-zinc-900 transition-colors shrink-0"
          >
            Explore Full Terminal
            <div className="h-0.5 w-8 bg-primary group-hover:bg-zinc-900 group-hover:w-12 transition-all" />
          </Link>
        </div>

        {/* Symmetrical grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              name={product.name}
              price={product.price}
              mrp={product.mrp}
              discount={product.discount}
              image={product.imageUrls?.[0] || "/placeholder.svg"}
              hoverImage={product.imageUrls?.[1] || product.imageUrls?.[0] || "/placeholder.svg"}
              category={product.category?.name}
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
