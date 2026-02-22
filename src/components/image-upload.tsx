"use client"

import { useEffect, useState, useRef } from "react"
import { ImagePlus, Trash, UploadCloud, Loader2, Crop, Eraser, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toast } from "react-hot-toast"
import CropModal from "./crop-modal"
import { removeBackgroundClient } from "@/lib/utils/bg-remover"

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [cropImage, setCropImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      onChange(data.url)
      toast.success("Image uploaded")
    } catch (error) {
      toast.error("Upload failed")
      console.error(error)
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const onRemoveBg = async (url: string) => {
    try {
      setProcessing(url)
      toast.loading("Commencing Background Removal Protocol...", { id: "bg-removal" })

      // Convert URL to File/Blob
      const response = await fetch(url)
      const blob = await response.blob()
      
      const processedBlob = await removeBackgroundClient(blob)
      const processedFile = new File([processedBlob], "processed-bg.png", { type: "image/png" })

      // Upload processed image
      const formData = new FormData()
      formData.append("file", processedFile)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) throw new Error("Processing upload failed")

      const data = await uploadResponse.json()
      
      // Update the value array: replace old URL with new one
      onRemove(url)
      onChange(data.url)
      
      toast.success("Background Eliminated", { id: "bg-removal" })
    } catch (error: any) {
      const msg = error.message === "MOBILE_MEMORY_ERROR" 
        ? "Insufficient memory for AI processing. Try on Desktop." 
        : "Logistics Failure during processing."
      toast.error(msg, { id: "bg-removal" })
      console.error(error)
    } finally {
      setProcessing(null)
    }
  }

  const onHandleCrop = async (file: File) => {
    try {
      setLoading(true)
      const oldUrl = cropImage!
      setCropImage(null)
      toast.loading("Synchronizing Geometry...", { id: "crop" })

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Crop upload failed")

      const data = await response.json()
      
      onRemove(oldUrl)
      onChange(data.url)
      
      toast.success("Geometry Optimized", { id: "crop" })
    } catch (error) {
      toast.error("Normalization Error", { id: "crop" })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-wrap gap-6">
        {value.map((url) => (
          <div key={url} className="relative w-full sm:w-[280px] aspect-square sm:h-[280px] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-zinc-200 shadow-xl group bg-white">
            {processing === url && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-900/60 backdrop-blur-sm text-white">
                <Sparkles className="h-8 w-8 animate-pulse mb-3 text-primary" />
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] animate-pulse">Running AI Logistics...</p>
              </div>
            )}
            
            <div className="z-10 absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
              <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl shadow-2xl border-white/20">
                <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button 
                type="button" 
                onClick={() => setCropImage(url)} 
                variant="secondary" 
                size="icon" 
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white/90 backdrop-blur-md shadow-2xl text-zinc-900 hover:bg-white"
              >
                <Crop className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button 
                type="button" 
                onClick={() => onRemoveBg(url)} 
                disabled={!!processing}
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary text-white shadow-2xl shadow-primary/20 hover:scale-105 transition-transform font-bold"
              >
                <Eraser className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
            
            <Image
              fill
              className="object-contain p-4"
              alt="Product Asset"
              src={url}
            />
          </div>
        ))}
      </div>

      {cropImage && (
        <CropModal 
          image={cropImage}
          onCancel={() => setCropImage(null)}
          onCropComplete={onHandleCrop}
        />
      )}
      
      <input
        type="file"
        accept="image/*"
        onChange={onUpload}
        ref={fileInputRef}
        className="hidden"
        disabled={disabled || loading}
      />

      <div 
        onClick={() => !disabled && !loading && fileInputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center gap-2 
          p-6 sm:p-10 border-2 border-dashed rounded-[1.5rem] sm:rounded-[2rem] transition-all cursor-pointer
          ${loading ? 'opacity-50 cursor-not-allowed bg-zinc-50 border-zinc-200' : 'border-zinc-200 hover:border-primary/40 hover:bg-primary/5 group'}
        `}
      >
        {loading ? (
          <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary animate-spin" />
        ) : (
          <UploadCloud className="h-10 w-10 text-zinc-300 group-hover:text-primary transition-colors" />
        )}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-900">
            {loading ? "Decrypting Buffer..." : "Select Internal Asset"}
          </p>
          <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-tighter mt-1">
            PNG, JPG up to 10MB
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImageUpload
