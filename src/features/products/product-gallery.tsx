"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { getYouTubeGalleryEmbedUrl } from "@/utils/GetYoutubeUrl";

export function ProductGallery({
  images,
  productName,
  videoUrl,
}: {
  images: { url: string; altText: string | null }[];
  productName: string;
  videoUrl?: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(false);

  const activeImage = images[activeIndex];
  const embedVideoUrl = getYouTubeGalleryEmbedUrl(videoUrl);

  const handleImageClick = (index: number) => {
    setActiveIndex(index);
    setIsVideoActive(false);
  };

  const handleVideoClick = () => {
    setIsVideoActive(true);
  };

  return (
    <div className="space-y-3">
      {/* Main View Area (Image or Video) */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
        {isVideoActive && embedVideoUrl ? (
          <iframe
            src={embedVideoUrl}
            title={`${productName} Video`}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          activeImage && (
            <Image
              src={activeImage.url}
              alt={activeImage.altText ?? productName}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          )
        )}
      </div>

      {/* Thumbnails List (Images + Video Button) */}
      {(images.length > 1 || embedVideoUrl) && (
        <div className="flex flex-wrap gap-2">
          {/* Image Thumbnails */}
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => handleImageClick(index)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                !isVideoActive && index === activeIndex
                  ? "border-primary ring-1 ring-primary"
                  : "border-transparent opacity-80 hover:opacity-100",
              )}
            >
              <Image src={image.url} alt="" fill className="object-cover" />
            </button>
          ))}

          {/* Video Thumbnail Button */}
          {embedVideoUrl && (
            <button
              type="button"
              onClick={handleVideoClick}
              className={cn(
                "relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-black/80 text-white transition-all",
                isVideoActive
                  ? "border-primary ring-1 ring-primary"
                  : "border-transparent opacity-80 hover:opacity-100",
              )}
              aria-label="Play Product Video"
            >
              {/* Background preview from first image */}
              {images[0] && (
                <Image
                  src={images[0].url}
                  alt=""
                  fill
                  className="object-cover opacity-40"
                />
              )}
              <div className="relative z-10 flex size-8 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-md">
                <Play className="size-4 fill-current ml-0.5" />
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
