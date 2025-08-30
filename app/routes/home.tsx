import type { Route } from "./+types/home";
import { ImageUpload } from "../components/ImageUpload";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "WebP Image Converter" },
    { name: "description", content: "Convert your images to WebP format with our fast WASM-powered converter" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold">WebP Image Converter</h1>
          <p className="text-muted-foreground mt-2">Convert your images to WebP format with ease</p>
        </header>
        <main>
          <ImageUpload />
        </main>
      </div>
    </div>
  );
}
