// app/components/ImageUpload.tsx
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { useImageProcessor } from "../hooks/useImageProcessor";
import { toast } from "sonner";
import JSZip from "jszip";

// Removed file size limit as per user request

interface ImageInfo {
  original: {
    url: string;
    size: number;
    type: string;
  };
  converted: {
    url: string;
    size: number;
    data: Uint8Array;
  } | null;
}


export function ImageUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(80);
  const [imageInfo, setImageInfo] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const processor = useImageProcessor({ quality });

  // Create object URLs for preview when files change
  useEffect(() => {
    if (files.length === 0) {
      setImageInfo([]);
      return;
    }

    const newImageInfo: ImageInfo[] = files.map(file => ({
      original: {
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
      },
      converted: null,
    }));

    setImageInfo(newImageInfo);
    console.log("[ImageUpload] Files changed, newImageInfo:", newImageInfo);

    // Clean up object URLs
    return () => {
      newImageInfo.forEach(info => {
        URL.revokeObjectURL(info.original.url);
        if (info.converted?.url) {
          URL.revokeObjectURL(info.converted.url);
        }
      });
    };
  }, [files]);

  // Convert images when quality changes or files are uploaded
  useEffect(() => {
    if (files.length > 0) {
      convertImages();
    }
  }, [quality, files]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles(dropped);
    console.log("[ImageUpload] handleDrop, files:", dropped);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    console.log("[ImageUpload] handleFileChange, files:", selected);
  }

  async function convertImages() {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const result = files.length === 1
        ? [await processor.processSingle(files[0])]
        : await processor.processBatch(files);
      const convertedData = result.filter(Boolean) as Uint8Array[];
      console.log("[ImageUpload] convertImages result:", result);
      console.log("[ImageUpload] convertedData:", convertedData);

      setImageInfo(prevImageInfo => {
        const updatedImageInfo = [...prevImageInfo];
        convertedData.forEach((data, idx) => {
          if (updatedImageInfo[idx]) {
            if (updatedImageInfo[idx].converted?.url) {
              URL.revokeObjectURL(updatedImageInfo[idx].converted.url);
            }
            const blob = new Blob([new Uint8Array(data)], { type: "image/webp" });
            updatedImageInfo[idx].converted = {
              url: URL.createObjectURL(blob),
              size: data.length,
              data: data,
            };
          }
        });
        console.log("[ImageUpload] updatedImageInfo after conversion:", updatedImageInfo);
        return updatedImageInfo;
      });
      toast.success("Conversion successful!");
    } catch (error) {
      toast.error("Conversion failed.");
      console.error("[ImageUpload] Conversion error:", error);
    }
    setLoading(false);
  }

  function download(idx: number) {
    if (!imageInfo[idx]?.converted) return;
    const blob = new Blob([new Uint8Array(imageInfo[idx].converted.data)], { type: "image/webp" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted_${idx + 1}.webp`;
    a.click();
    URL.revokeObjectURL(url);
    console.log(`[ImageUpload] Downloaded image ${idx + 1}`);
  }

  async function downloadAll() {
    const zip = new JSZip();
    imageInfo.forEach((info, idx) => {
      if (info.converted) {
        zip.file(`converted_${idx + 1}.webp`, info.converted.data);
      }
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted_images.zip";
    a.click();
    URL.revokeObjectURL(url);
    console.log("[ImageUpload] Downloaded all images as ZIP");
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  }

  // Shadcn-inspired, Steve Jobs-worthy UI
  return (
    <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-background shadow-2xl flex flex-col gap-10 items-center border border-border">
      <div
        className="border-2 border-dashed border-muted rounded-3xl p-12 w-full text-center cursor-pointer transition-all duration-300 hover:border-primary hover:bg-accent/40"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" x2="12" y1="3" y2="15"/>
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold tracking-tight">Drop your images here</h3>
              <p className="text-muted-foreground text-base">or click to browse files</p>
              <p className="text-sm text-muted-foreground/70">Supports JPG, PNG, GIF</p>
            </div>
          </div>
        </label>
      </div>

      {imageInfo.length > 0 && (
        <div className="w-full flex flex-col gap-8">
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Converted Images</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {imageInfo.map((info, idx) => (
                <li key={idx} className="rounded-2xl border border-muted bg-card shadow-lg p-6 flex flex-col gap-4">
                  <div className="flex gap-4 items-center">
                    <img
                      src={info.original.url}
                      alt={`Original ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-xl border border-border shadow"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-lg text-foreground">Image {idx + 1}</span>
                      <span className="text-sm text-muted-foreground">{formatFileSize(info.original.size)} • {info.original.type.split("/")[1]?.toUpperCase() || "Unknown"}</span>
                    </div>
                  </div>
                  {info.converted ? (
                    <div className="flex gap-4 items-center">
                      <img
                        src={info.converted.url}
                        alt={`Converted ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border border-primary shadow"
                      />
                      <div className="flex flex-col gap-1">
                        <span className="text-primary font-semibold">WebP</span>
                        <span className="text-xs text-muted-foreground">{formatFileSize(info.converted.size)}</span>
                        <span className="text-xs text-success font-medium">{Math.round((1 - info.converted.size / info.original.size) * 100)}% smaller</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => download(idx)}
                        className="ml-auto px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary/10"
                      >
                        Download
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                        <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Converting...</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-lg font-semibold text-foreground">WebP Quality</label>
              <span className="text-lg font-bold text-primary">{quality}%</span>
            </div>
            <Slider
              min={1}
              max={100}
              value={[quality]}
              onValueChange={([v]) => setQuality(v)}
              className="w-full"
            />
          </div>

          <Button
            variant="secondary"
            onClick={downloadAll}
            disabled={loading || imageInfo.filter(info => info.converted).length === 0}
            className="py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.03] shadow-lg"
          >
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" x2="12" y1="15" y2="3"/>
                <path d="M5 12h14"/>
              </svg>
              Download All as ZIP
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}