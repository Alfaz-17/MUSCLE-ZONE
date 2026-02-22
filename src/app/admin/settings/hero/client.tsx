"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ImageUpload from "@/components/image-upload"
import { Layout, Plus, Trash2, ArrowUp, ArrowDown, Save } from "lucide-react"

interface HeroClientProps {
  initialData: any[]
}

export const HeroClient: React.FC<HeroClientProps> = ({ initialData }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [banners, setBanners] = useState(initialData || [])

  const onAdd = () => {
    setBanners([
      ...banners,
      {
        id: `new-${Date.now()}`,
        imageUrl: "",
        link: "/shop",
        order: banners.length,
        isNew: true
      }
    ])
  }

  const onRemove = async (id: string, isNew?: boolean) => {
    if (isNew) {
      setBanners(banners.filter(b => b.id !== id))
      return
    }

    if (!confirm("Are you sure you want to delete this banner?")) return

    try {
      setLoading(true)
      const response = await fetch(`/api/settings/hero/${id}`, {
        method: "DELETE"
      })

      if (!response.ok) throw new Error("Delete failed")

      toast.success("Banner deleted")
      setBanners(banners.filter(b => b.id !== id))
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const onSave = async (id: string) => {
    const banner = banners.find(b => b.id === id)
    if (!banner?.imageUrl) {
      toast.error("Image is required")
      return
    }

    try {
      setLoading(true)
      const isNew = banner.isNew
      const url = isNew ? "/api/settings/hero" : `/api/settings/hero/${id}`
      const method = isNew ? "POST" : "PATCH"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: banner.imageUrl,
          link: banner.link,
          order: banner.order
        })
      })

      if (!response.ok) throw new Error("Save failed")

      const savedData = await response.json()
      
      // Update local state with real ID if it was new
      setBanners(banners.map(b => b.id === id ? { ...savedData, isNew: false } : b))

      toast.success(isNew ? "Banner created" : "Banner updated")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const updateBanner = (id: string, data: any) => {
    setBanners(banners.map(b => b.id === id ? { ...b, ...data } : b))
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Layout className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900">Hero Carousel ({banners.length})</h3>
        </div>
        <Button 
          onClick={onAdd}
          disabled={loading}
          className="bg-zinc-900 hover:bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest px-6 h-12"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Slide
        </Button>
      </div>

      <div className="space-y-6">
        {banners.map((banner, index) => (
          <div key={banner.id} className="bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-sm space-y-8 relative overflow-hidden">
            {banner.isNew && (
              <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                New Segment
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">Banner Image {index + 1}</label>
                <ImageUpload
                  value={banner.imageUrl ? [banner.imageUrl] : []}
                  disabled={loading}
                  onChange={(url) => updateBanner(banner.id, { imageUrl: url })}
                  onRemove={() => updateBanner(banner.id, { imageUrl: "" })}
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest pl-1">Target Link</label>
                  <Input
                    placeholder="/shop or custom URL"
                    value={banner.link}
                    onChange={(e) => updateBanner(banner.id, { link: e.target.value })}
                    disabled={loading}
                    className="h-14 bg-zinc-50 border-zinc-200 rounded-2xl focus:bg-white transition-all"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => onSave(banner.id)}
                    disabled={loading || !banner.imageUrl}
                    className="flex-1 h-14 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {banner.isNew ? "Publish Slide" : "Save Changes"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onRemove(banner.id, banner.isNew)}
                    disabled={loading}
                    className="h-14 w-14 rounded-2xl border-zinc-200"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="text-center py-20 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-200">
            <Layout className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No slides configured</p>
            <Button onClick={onAdd} variant="link" className="mt-2 text-primary uppercase text-[10px] font-black tracking-widest">
              Create your first slide →
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
