"use client"

import { useState } from "react"
import { Check } from "lucide-react"

interface Color {
  name: string
  hex: string
  available: boolean
}

interface ColorSelectorProps {
  colors: Color[]
  onSelect?: (color: string) => void
}

export function ColorSelector({ colors, onSelect }: ColorSelectorProps) {
  const [selected, setSelected] = useState<string | null>(colors.find((c) => c.available)?.name || null)

  const handleSelect = (name: string, available: boolean) => {
    if (!available) return
    setSelected(name)
    onSelect?.(name)
  }

  const isDarkColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return (r * 299 + g * 587 + b * 114) / 1000 < 128
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm tracking-widest uppercase">Flavor</span>
        {selected && <span className="text-sm text-muted-foreground">— {selected}</span>}
      </div>
      <div className="flex flex-wrap gap-3">
        {colors.map(({ name, hex, available }) => (
          <button
            key={name}
            onClick={() => handleSelect(name, available)}
            disabled={!available}
            className={`relative w-8 h-8 rounded-full transition-all duration-300 ${
              !available ? "opacity-30 cursor-not-allowed" : "hover:scale-110"
            } ${selected === name ? "ring-2 ring-offset-2 ring-foreground" : ""}`}
            style={{ backgroundColor: hex }}
            title={name}
          >
            {selected === name && (
              <Check
                className={`absolute inset-0 m-auto w-4 h-4 ${
                  isDarkColor(hex) ? "text-white" : "text-foreground"
                }`}
              />
            )}
            {!available && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-full h-[1px] bg-foreground rotate-45 absolute" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
