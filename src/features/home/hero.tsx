/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import type { getActiveBanners } from "@/server/services/product.service";
import { Sparkles } from "lucide-react";

type Banner = Awaited<ReturnType<typeof getActiveBanners>>[number];

const DEFAULT_BANNER = {
  id: "default-1",
  title: "Gifts shaped by hand, given from the heart",
  subtitle:
    "Clay art, personalized keepsakes, and gift boxes crafted slowly — for birthdays, anniversaries, and quiet everyday moments.",
  imageUrl:
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1920&auto=format&fit=crop",
  ctaLabel: "Shop the collection",
  ctaHref: "/shop",
};

export function Hero({ banners }: { banners?: Banner[] }) {
  const slides = banners && banners.length > 0 ? banners : [DEFAULT_BANNER];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Auto-play feature (5 seconds)
  useEffect(() => {
    if (!emblaApi || slides.length <= 1) return;
    const intervalId = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [emblaApi, slides.length]);

  return (
    <section className="relative w-full overflow-hidden bg-white my-8">
      {/* Embla Viewport */}
      <div className="overflow-hidden container mx-auto" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((slide, index) => (
            <div
              key={slide.id || index}
              className="relative flex-[0_0_100%] min-w-0 h-130 sm:h-155 lg:h-175 select-none"
            >
              {/* Background Hero Image */}
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center transition-transform duration-1000 scale-105 group-hover:scale-100"
              />

              {/* Dark Overlay with Gradient */}
              <div className="absolute inset-0 bg-black/50 md:to-transparent" />

              {/* Content Card Overlay */}
              <div className="container-boutique relative z-10 flex h-full items-center">
                <div className="max-w-2xl space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-md">
                    <Sparkles className="size-3.5 text-amber-300" />
                    Handmade, with intention
                  </div>

                  <h1 className="font-heading text-3xl font-semibold leading-[1.15] text-white sm:text-5xl lg:text-6xl text-balance">
                    {slide.title}
                  </h1>

                  {slide.subtitle && (
                    <p className="max-w-lg text-balance text-sm text-neutral-300 sm:text-base md:text-lg leading-relaxed">
                      {slide.subtitle}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {slide.ctaHref && slide.ctaLabel && (
                      <Button
                        size="lg"
                        className="rounded-full bg-white px-8 text-black hover:bg-neutral-200 transition-all duration-300 shadow-xl font-medium"
                        asChild
                      >
                        <Link href={slide.ctaHref}>{slide.ctaLabel}</Link>
                      </Button>
                    )}
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full border-white/40 bg-black/30 text-white backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300 font-medium"
                      asChild
                    >
                      <Link href="/shop">Shop Collection</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Navigation & Controls */}
      {slides.length > 1 && (
        <>
          {/* Pagination Indicators (Dots) */}
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ${
                  index === selectedIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
