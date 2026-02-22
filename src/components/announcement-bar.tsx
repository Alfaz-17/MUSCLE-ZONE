"use client"

import { prisma } from "@/lib/prisma"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<{ text: string, isActive: boolean } | null>(null)

  useEffect(() => {
    fetch("/api/settings/announcement")
      .then(res => res.json())
      .then(data => setAnnouncement(data))
      .catch(() => setAnnouncement(null))
  }, [])

  if (!announcement || !announcement.isActive) {
    return null
  }

  return (
    <div className="bg-black text-white w-full h-9 md:h-11 overflow-hidden relative z-[70] flex items-center">
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{ 
          repeat: Infinity, 
          duration: 20, 
          ease: "linear" 
        }}
        className="whitespace-nowrap flex items-center gap-8 min-w-full"
      >
        <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em]">
          {announcement.text}
        </span>
        {/* Repeating for seamless loop if text is short */}
        <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em]" aria-hidden="true">
          {announcement.text}
        </span>
        <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.25em]" aria-hidden="true">
          {announcement.text}
        </span>
      </motion.div>
    </div>
  )
}
