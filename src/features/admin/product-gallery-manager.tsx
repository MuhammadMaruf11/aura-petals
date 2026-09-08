"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GalleryImageUploader, type GalleryImage } from "@/features/admin/gallery-image-uploader";
import {
  addProductImageAction,
  deleteProductImageAction,
  setMainProductImageAction,
  reorderProductImagesAction,
} from "@/server/actions/admin-product.actions";
import type { ProductImage } from "@prisma/client";

function toGalleryImage(image: ProductImage): GalleryImage {
  return { id: image.id, url: image.url, publicId: image.cloudinaryPublicId, isMain: image.isMain };
}

export function ProductGalleryManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localImages, setLocalImages] = useState<GalleryImage[]>(images.map(toGalleryImage));

  function handleUpload(uploaded: { url: string; publicId: string }) {
    startTransition(async () => {
      const isFirstImage = localImages.length === 0;
      const result = await addProductImageAction(productId, uploaded.url, isFirstImage, uploaded.publicId);
      if (!result.success || !result.imageId) {
        toast.error(!result.success ? result.message : "Could not save the uploaded image.");
        return;
      }
      setLocalImages((current) => [
        ...current,
        { id: result.imageId!, url: uploaded.url, publicId: uploaded.publicId, isMain: isFirstImage },
      ]);
      router.refresh();
    });
  }

  function handleRemove(id: string) {
    const wasMain = localImages.find((img) => img.id === id)?.isMain ?? false;
    setLocalImages((current) => {
      const remaining = current.filter((img) => img.id !== id);
      return wasMain && remaining.length > 0
        ? remaining.map((img, index) => ({ ...img, isMain: index === 0 }))
        : remaining;
    });
    startTransition(async () => {
      await deleteProductImageAction(id, productId);
      // If the removed image was main, promote the new first image server-side too.
      if (wasMain) {
        const newFirst = localImages.find((img) => img.id !== id);
        if (newFirst) await setMainProductImageAction(productId, newFirst.id);
      }
      router.refresh();
    });
  }

  function handleSetMain(id: string) {
    setLocalImages((current) => current.map((img) => ({ ...img, isMain: img.id === id })));
    startTransition(async () => {
      await setMainProductImageAction(productId, id);
      router.refresh();
    });
  }

  function handleReorder(orderedIds: string[]) {
    setLocalImages((current) =>
      orderedIds
        .map((id) => current.find((img) => img.id === id))
        .filter((img): img is GalleryImage => img !== undefined),
    );
    startTransition(async () => {
      await reorderProductImagesAction(productId, orderedIds);
    });
  }

  return (
    <div className="space-y-2">
      <GalleryImageUploader
        images={localImages}
        onUpload={handleUpload}
        onRemove={handleRemove}
        onSetMain={handleSetMain}
        onReorder={handleReorder}
      />
      {isPending && <p className="text-xs text-muted-foreground">Saving…</p>}
    </div>
  );
}
