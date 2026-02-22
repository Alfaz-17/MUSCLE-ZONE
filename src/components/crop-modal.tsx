"use client"

import React, { useState, useCallback } from 'react'
import Cropper, { Point, Area } from 'react-easy-crop'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Crop, Maximize2, Minimize2 } from 'lucide-react'
import getCroppedImg from '@/lib/utils/cropImage'

interface CropModalProps {
  image: string
  onCropComplete: (croppedImage: File) => void
  onCancel: () => void
  aspect?: number
}

const ASPECT_RATIOS = [
  { label: 'Original', value: undefined },
  { label: '1:1', value: 1 / 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
]

const CropModal: React.FC<CropModalProps> = ({ 
  image, 
  onCropComplete, 
  onCancel,
  aspect: initialAspect = 1
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [aspect, setAspect] = useState<number | undefined>(initialAspect)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropChange = (crop: Point) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onCropCompleteInternal = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCrop = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels)
      if (croppedImage) {
        onCropComplete(croppedImage)
      }
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-2xl h-[90vh] sm:h-[85vh] flex flex-col relative overflow-hidden shadow-2xl rounded-[1.5rem] sm:rounded-[2.5rem] border border-zinc-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-8 border-b border-zinc-100 bg-zinc-50/50">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-primary p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-white shadow-lg shadow-primary/20">
                <Crop className="w-4 h-4 sm:w-5 sm:w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-serif uppercase tracking-tight text-zinc-900 leading-none">Modify Asset</h2>
                <p className="text-[8px] sm:text-[10px] uppercase font-bold text-zinc-400 tracking-widest mt-1 sm:mt-1.5 leading-none">Precision Geometry Alignment</p>
              </div>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-400">
              <X className="w-5 h-5 sm:w-6 sm:w-6" />
            </button>
          </div>

          {/* Ratio Selector */}
          <div className="flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-4 sm:py-5 border-b border-zinc-100 overflow-x-auto no-scrollbar">
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-zinc-400 mr-1 sm:mr-2 shrink-0">Ratio:</span>
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.label}
                onClick={() => setAspect(ratio.value)}
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-widest transition-all shrink-0 border ${
                  aspect === ratio.value 
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl' 
                  : 'bg-white border-zinc-200 text-zinc-500 hover:border-primary hover:text-primary shadow-sm'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>

          {/* Cropper area */}
          <div className="flex-grow relative bg-zinc-900">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={onCropChange}
              onCropComplete={onCropCompleteInternal}
              onZoomChange={onZoomChange}
              classes={{
                containerClassName: "rounded-none",
              }}
            />
          </div>

          {/* Footer */}
          <div className="p-5 sm:p-8 border-t border-zinc-100 bg-zinc-50/80 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400" />
                <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-900 min-w-8">Zoom</span>
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-grow h-1 bg-zinc-200 rounded-full appearance-none accent-primary cursor-pointer hover:bg-zinc-300 transition-colors"
              />
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400" />
            </div>
            
            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={onCancel}
                className="flex-1 py-3 sm:py-4 border border-zinc-200 bg-white rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-all shadow-sm"
              >
                Abort
              </button>
              <button
                onClick={handleCrop}
                className="flex-1 py-3 sm:py-4 bg-primary text-white rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-900 transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-xl shadow-primary/10"
              >
                <Check className="w-4 h-4 sm:w-5 sm:h-5" /> Commit
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CropModal
