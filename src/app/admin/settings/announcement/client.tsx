"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Megaphone, Save } from "lucide-react"

interface AnnouncementClientProps {
  initialData: any
}

export const AnnouncementClient: React.FC<AnnouncementClientProps> = ({ initialData }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    text: initialData?.text || "Use Coupon Code \"DISC5\" to get 5% off on all orders",
    isActive: initialData?.isActive ?? false
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const response = await fetch("/api/settings/announcement", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error("Update failed")

      toast.success("Announcement updated")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm max-w-2xl mx-auto">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-3">
              <Megaphone className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Announcement Bar</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</span>
              <Switch 
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">Announcement Text</label>
            <Input 
              placeholder="e.g. Free delivery on orders over ₹999!"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              disabled={loading}
              className="h-14 bg-zinc-50 border-zinc-200 rounded-2xl focus:bg-white transition-all text-sm"
            />
            <p className="text-[10px] text-zinc-400 italic pl-1">This text will be displayed at the very top of the storefront when active.</p>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-14 bg-zinc-900 hover:bg-primary text-white rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl transition-all"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "SAVING..." : "UPDATE ANNOUNCEMENT"}
        </Button>
      </form>
    </div>
  )
}
