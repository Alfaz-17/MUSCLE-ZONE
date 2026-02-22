"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { PremiumFooter } from "@/components/premium-footer"
import { ArrowRight, Shield, Truck, Award, MapPin } from "lucide-react"

const values = [
  {
    icon: Shield,
    title: "100% Authentic",
    description:
      "Every product is sourced directly from authorized distributors. No fakes, no compromises.",
  },
  {
    icon: Award,
    title: "Top Brands",
    description:
      "We stock only the best — MuscleBlaze, Optimum Nutrition, GNC, Labrada, Isopure, and more.",
  },
  {
    icon: Truck,
    title: "Local Delivery",
    description:
      "Same-day delivery across Bhavnagar. Order today, fuel your workout today.",
  },
  {
    icon: MapPin,
    title: "Visit Our Store",
    description:
      "Walk in, explore our range, and get personalized supplement advice from our team.",
  },
]

const storeImages = [
  { src: "/main5.webp", alt: "Mass gainers and whey protein shelves" },
  { src: "/main4.webp", alt: "Premium protein powders on display" },
  { src: "/main6.webp", alt: "Full supplement range from top brands" },
  { src: "/main2.webp", alt: "Pre-workout collection at Muscle Zone" },
]

export default function AboutPage() {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"])

  return (
    <main className="min-h-screen bg-background">

      {/* Hero Banner */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/main.webp"
            alt="Muscle Zone — The Authentic Store"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <motion.div
          className="relative z-10 text-center text-white px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-xs tracking-[0.4em] uppercase text-primary mb-4 block">
            About Us
          </span>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">
            Muscle Zone
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto">
            The Authentic Store — Bhavnagar&apos;s trusted destination for
            premium fitness supplements.
          </p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-20 lg:py-28 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <span className="text-xs tracking-[0.4em] uppercase text-primary mb-4 block">
              Our Story
            </span>
            <h2 className="font-serif text-3xl lg:text-5xl mb-8">
              Built for Fitness Enthusiasts
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Muscle Zone was founded with a simple mission: to bring
              authentic, high-quality supplements to Bhavnagar. Tired of
              seeing counterfeit products flood the market, we created a
              space where fitness enthusiasts can shop with confidence.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From whey protein to pre-workouts, creatine to mass gainers —
              every product on our shelves is sourced from authorized
              distributors and verified for authenticity. We don&apos;t just
              sell supplements — we help you choose the right ones for your
              goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Store Gallery Mosaic */}
      <section className="px-6 lg:px-8 pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {storeImages.map((img, index) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative aspect-[3/4] overflow-hidden group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values / Why Choose Us */}
      <section
        ref={parallaxRef}
        className="relative py-24 lg:py-32 overflow-hidden"
      >
        <motion.div style={{ y }} className="absolute inset-0 -top-20 -bottom-20">
          <Image
            src="/main1.webp"
            alt="Inside Muscle Zone store"
            fill
            sizes="100vw"
            className="object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/75" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[0.4em] uppercase text-primary mb-4 block">
              Why Us
            </span>
            <h2 className="font-serif text-3xl lg:text-5xl text-white mb-4">
              Why Muscle Zone?
            </h2>
            <p className="text-white/60 max-w-lg mx-auto">
              More than a store — we&apos;re your partner in achieving your
              fitness goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 border border-primary/30 mb-6">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 lg:py-28 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "100+", label: "Products" },
              { number: "500+", label: "Happy Customers" },
              { number: "20+", label: "Top Brands" },
              { number: "24hr", label: "Local Delivery" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <span className="font-serif text-4xl lg:text-5xl text-primary block mb-2">
                  {stat.number}
                </span>
                <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-card py-20 lg:py-28 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl lg:text-5xl mb-6">
              Ready to Fuel Your Gains?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Browse our full range of premium supplements or visit us in
              store for personalized guidance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/shop">
                  <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-4 text-sm tracking-[0.2em] uppercase group inline-flex items-center">
                    Shop Now
                    <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/contact">
                  <button className="border border-border hover:border-foreground px-10 py-4 text-sm tracking-[0.2em] uppercase transition-colors">
                    Contact Us
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <PremiumFooter />
    </main>
  )
}
