"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  heroBanners?: {
    id: string;
    imageUrl: string;
    link: string;
  }[] | null;
}

export function HeroSection({ heroBanners }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Use uploaded banners or a default one if none exist
  const effectiveSlides = (heroBanners && heroBanners.length > 0) ? heroBanners.map((b, i) => ({
    id: b.id,
    image: b.imageUrl,
    link: b.link,
    title: "", // Clean look, no text as requested
    subtitle: ""
  })) : [
    {
      id: "default",
      image: "/p1.jpeg",
      link: "/shop",
      title: "",
      subtitle: ""
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % effectiveSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + effectiveSlides.length) % effectiveSlides.length)

  useEffect(() => {
    if (effectiveSlides.length > 1) {
      const timer = setInterval(nextSlide, 8000)
      return () => clearInterval(timer)
    }
  }, [effectiveSlides.length])

  return (
    <section className="relative h-[60dvh] md:h-[75dvh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Link href={effectiveSlides[currentSlide].link} className="absolute inset-0 z-30">
            {/* Background Image */}
            <Image
              src={effectiveSlides[currentSlide].image}
              alt="Hero Banner"
              fill
              priority
              className="object-cover md:object-contain object-center"
            />
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {effectiveSlides.length > 1 && (
        <div className="absolute inset-0 z-40 flex items-center justify-between px-4 pointer-events-none">
          <button 
            onClick={prevSlide}
            className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all pointer-events-auto"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all pointer-events-auto"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Indicators */}
      {effectiveSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
          {effectiveSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                "w-12 h-1.5 rounded-full transition-all duration-500",
                currentSlide === i ? "bg-primary" : "bg-white/20"
              )}
            />
          ))}
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <Link 
        href="https://wa.me/919913101111" 
        target="_blank"
        className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center animate-bounce group"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 group-hover:ml-3 whitespace-nowrap text-xs font-black uppercase tracking-widest">Chat with us</span>
      </Link>
    </section>
  )
}
