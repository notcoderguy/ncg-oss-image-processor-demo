// app/hooks/useImageProcessor.ts
import { useRef, useEffect } from "react";
import init, { ImageProcessor } from "../../pkg/image-processor.js";

type UseImageProcessorOptions = {
  quality?: number;
};

export function useImageProcessor({ quality = 80 }: UseImageProcessorOptions = {}) {
  const processorRef = useRef<ImageProcessor | null>(null);

  async function initWasm() {
    if (!processorRef.current) {
      await init();
      processorRef.current = new ImageProcessor();
    }
    // Always set the quality
    processorRef.current.quality = quality;
 }

  // Reinitialize when quality changes
  useEffect(() => {
    if (processorRef.current) {
      processorRef.current.quality = quality;
    }
  }, [quality]);

  async function processSingle(file: File): Promise<Uint8Array | null> {
    await initWasm();
    const arrayBuffer = await file.arrayBuffer();
    try {
      return processorRef.current!.process_image(new Uint8Array(arrayBuffer));
    } catch {
      return null;
    }
  }

  async function processBatch(files: File[]): Promise<Uint8Array[]> {
    await initWasm();
    const buffers = await Promise.all(files.map(f => f.arrayBuffer()));
    try {
      return processorRef.current!.process_batch(buffers.map(b => new Uint8Array(b)));
    } catch {
      return [];
    }
  }

  return { processSingle, processBatch };
}