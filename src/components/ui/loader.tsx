"use client"

import { motion } from "framer-motion"
import { Dumbbell } from "lucide-react"

interface LoaderProps {
  size?: "sm" | "md" | "lg"
  theme?: "light" | "dark" | "premium"
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = "md", 
  theme = "premium" 
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20"
  }

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 40
  }

  const themeClasses = {
    light: "text-primary",
    dark: "text-white",
    premium: "text-primary shadow-[0_0_15px_rgba(255,255,255,0.2)]"
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Pulsing ring */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`${sizeClasses[size]} rounded-full border-2 border-primary/30 absolute inset-0`}
        />
        
        {/* Animated Dumbbell */}
        <motion.div
          animate={{
            rotate: [0, -15, 15, 0],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`relative z-10 flex items-center justify-center ${sizeClasses[size]} bg-background border border-primary/20 rounded-full ${themeClasses[theme]}`}
        >
          <Dumbbell size={iconSizes[size]} className="stroke-[2.5px]" />
        </motion.div>
      </div>
      
      {size !== "sm" && (
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-[10px] tracking-[0.2em] uppercase font-medium text-muted-foreground"
        >
          Fuelling Your Gains...
        </motion.p>
      )}
    </div>
  )
}
