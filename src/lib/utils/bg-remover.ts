"use client"
import { pipeline, RawImage, env } from '@huggingface/transformers';

// Configure environment for browser-only execution
if (typeof window !== 'undefined') {
  env.allowLocalModels = false;
  env.allowRemoteModels = true;
  
  // Mobile optimization: Limit threads to avoid memory crashes
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    // @ts-ignore
    if (env.backends?.onnx?.wasm) env.backends.onnx.wasm.numThreads = 1;
  }
}

let segmenter: any = null;

/**
 * Removes background from image using client-side AI
 * @param imageFile - File or Blob to process
 * @returns Promise<Blob> - PNG with transparent background
 */
export async function removeBackgroundClient(imageFile: File | Blob): Promise<Blob> {
  try {
    console.log("[BG Client] Starting background removal...");
    
    // 1. Initialize model (lazy loading)
    if (!segmenter) {
      console.log("[BG Client] Loading RMBG-1.4 model...");
      segmenter = await pipeline('image-segmentation', 'briaai/RMBG-1.4', {
        device: 'webgpu', // Use WebGPU for acceleration if available
      });
    }

    // 2. Load and resize image
    const url = URL.createObjectURL(imageFile);
    let image = await RawImage.fromURL(url);
    URL.revokeObjectURL(url);

    // Resize if too large (prevents mobile crashes)
    const MAX_DIM = 1024;
    if (image.width > MAX_DIM || image.height > MAX_DIM) {
      console.log(`[BG Client] Resizing from ${image.width}x${image.height}...`);
      image = await image.resize(MAX_DIM, MAX_DIM);
    }

    // 3. Process image through model
    console.log("[BG Client] Processing...");
    const output = await segmenter(image);
    const mask = output[0].mask;
    
    // 4. Create output canvas
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error("Could not get canvas context");

    // Draw original image
    const blob = await image.toBlob();
    const bitmap = await createImageBitmap(blob);
    ctx.drawImage(bitmap, 0, 0);

    // Apply alpha mask
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const maskCanvas = await mask.toCanvas();
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) throw new Error("Could not get mask canvas context");
    const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Apply transparency
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i + 3] = maskData.data[i]; // Set alpha channel
    }
    
    ctx.putImageData(imageData, 0, 0);

    // 5. Return as PNG blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          console.log("[BG Client] ✓ Success");
          resolve(blob);
        } else {
          reject(new Error("Canvas toBlob failed"));
        }
      }, 'image/png');
    });
  } catch (error: any) {
    console.error("[BG Client] Error:", error);
    segmenter = null; // Reset on error
    
    // User-friendly error handling
    const isMemoryError = error.message?.toLowerCase().includes("memory") || 
                         error.message?.toLowerCase().includes("range");
    if (isMemoryError) {
      throw new Error("MOBILE_MEMORY_ERROR");
    }
    
    throw new Error("DEVICE_UNSUPPORTED");
  }
}
