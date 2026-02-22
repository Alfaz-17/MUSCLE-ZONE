"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Package, Users, Truck } from "lucide-react"

export function HeritageSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0 -top-20 -bottom-20">
        <Image
          src="/main1.webp"
          alt="Inside Muscle Zone — premium supplement shelves"
          fill
          sizes="100vw"
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/70" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs tracking-[0.4em] uppercase text-primary mb-6 block">About Muscle Zone</span>
            <h2 className="font-serif text-4xl lg:text-6xl text-white mb-8 leading-[1.15] text-balance">
              Quality You Can
              <br />
              Trust
            </h2>
            <p className="text-white/70 text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
              Muscle Zone is Bhavnagar&apos;s trusted destination for premium fitness supplements. We source only the finest
              products from certified brands to help you achieve your fitness goals.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <Package className="w-8 h-8 text-primary/80 mb-4 stroke-[1.5]" />
                <span className="font-serif text-4xl lg:text-5xl text-primary block mb-2">100+</span>
                <span className="text-xs tracking-[0.2em] uppercase text-white/50">Products</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <Users className="w-8 h-8 text-primary/80 mb-4 stroke-[1.5]" />
                <span className="font-serif text-4xl lg:text-5xl text-primary block mb-2">500+</span>
                <span className="text-xs tracking-[0.2em] uppercase text-white/50">Happy Customers</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col items-center"
              >
                <Truck className="w-8 h-8 text-primary/80 mb-4 stroke-[1.5]" />
                <span className="font-serif text-4xl lg:text-5xl text-primary block mb-2">24hr</span>
                <span className="text-xs tracking-[0.2em] uppercase text-white/50">Local Delivery</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
