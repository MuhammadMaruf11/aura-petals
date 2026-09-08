"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/features/products/product-gallery";
import { AddToCartForm } from "@/features/products/add-to-cart-form";
import { getProductForQuickView } from "@/server/actions/product.actions";
import type { ProductDetailData } from "@/server/services/product.service";

export function QuickViewButton({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen && !product) {
      setIsLoading(true);
      const data = await getProductForQuickView(productId);
      setProduct(data);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="w-full gap-1.5 shadow-sm"
        onClick={(e) => {
          e.preventDefault();
          handleOpenChange(true);
        }}
      >
        <Eye className="size-3.5" />
        Quick View
      </Button>

      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        {isLoading || !product ? (
          <div className="flex h-80 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                {product.name}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-8 sm:grid-cols-2">
              <ProductGallery
                images={product.images.map((img) => ({
                  url: img.url,
                  altText: img.altText,
                }))}
                productName={product.name}
                videoUrl={product.videoUrl}
              />
              <div className="space-y-4">
                <AddToCartForm product={product} />
                <Link
                  href={`/products/${product.slug}`}
                  className="block text-center text-sm text-primary hover:underline"
                >
                  View full details
                </Link>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
