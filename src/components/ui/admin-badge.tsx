import { cn } from "@/lib/utils"

interface AdminBadgeProps {
  children: React.ReactNode
  variant?: "success" | "warning" | "error" | "info" | "neutral"
  className?: string
}

export function AdminBadge({ children, variant = "neutral", className }: AdminBadgeProps) {
  const variants = {
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    error: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    neutral: "bg-zinc-100 text-zinc-700 border-zinc-200",
  }

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
