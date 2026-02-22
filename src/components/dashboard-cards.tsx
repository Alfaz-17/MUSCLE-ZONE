"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import Link from 'next/link'

import { 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  ShoppingBag,
  LucideIcon
} from "lucide-react"

interface Stat {
  label: string
  value: string | number
  icon: string
  href: string
  trend?: {
    value: string
    positive: boolean
  }
}

const ICON_MAP: Record<string, LucideIcon> = {
  "dollar-sign": DollarSign,
  "package": Package,
  "users": Users,
  "trending-up": TrendingUp,
  "shopping-bag": ShoppingBag
}

export function DashboardCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = ICON_MAP[stat.icon] || Package

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-6 border border-zinc-200 hover:border-zinc-300 transition-all shadow-sm rounded-xl relative group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-zinc-50 rounded-lg text-zinc-600 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              {stat.trend && (
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                  stat.trend.positive 
                    ? "bg-green-50 text-green-600 border-green-100" 
                    : "bg-red-50 text-red-600 border-red-100"
                )}>
                  {stat.trend.positive ? "+" : ""}{stat.trend.value}
                </span>
              )}
            </div>
            
            <dt className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</dt>
            <dd className="text-2xl font-bold text-zinc-950">{stat.value}</dd>
            
            <Link href={stat.href} className="absolute inset-0 z-10" />
          </motion.div>
        )
      })}
    </div>
  )
}
