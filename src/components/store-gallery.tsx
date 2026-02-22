"use client"

import Image from "next/image"
import { motion } from "framer-motion"

const galleryImages = [
  {
    src: "/main.webp",
    alt: "Muscle Zone storefront at night with glowing blue neon signage",
    label: "Our Store",
    span: "col-span-2 row-span-2",
  },
  {
    src: "/main4.webp",
    alt: "Premium protein powders and supplement wall display",
    label: "Protein Range",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/main2.webp",
    alt: "Hyde Xtreme pre-workout collection display",
    label: "Pre-Workouts",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/main3.webp",
    alt: "Muscle Zone store exterior wide angle view",
    label: "Visit Us",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/main5.webp",
    alt: "Mass gainers and whey protein shelves with brand logos",
    label: "Mass Gainers",
    span: "col-span-1 row-span-1",
  },
  {
    src: "/main6.webp",
    alt: "Full supplement wall featuring Labrada, Isopure, GNC and more",
    label: "All Brands",
    span: "col-span-2 row-span-1",
  },
  {
    src: "/main1.webp",
    alt: "Store interior with protein, peanut butter, and healthy snacks",
    label: "Healthy Snacks",
    span: "col-span-2 row-span-1",
  },
]

export function StoreGallery() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="text-xs tracking-[0.4em] uppercase text-primary mb-4 block">
            Our Space
          </span>
          <h2 className="font-serif text-3xl lg:text-5xl mb-4">
            Inside Muscle Zone
          </h2>
          <p className="text-muted-foreground tracking-wide max-w-lg mx-auto">
            Step inside Bhavnagar&apos;s most trusted supplement store —
            stocked with 100+ authentic products from top global brands.
          </p>
        </motion.div>

        {/* Bento grid gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className={`${image.span} relative group overflow-hidden`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <span className="text-white text-sm tracking-[0.2em] uppercase font-medium">
                  {image.label}
                </span>
              </div>
              {/* Red accent line */}
              <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-primary transition-all duration-700 ease-out" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
