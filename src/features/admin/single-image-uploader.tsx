"use client";

import { useRef, useTransition } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { readFileAsDataUrl } from "@/lib/cloudinary/read-file";
import {
  uploadImageAction,
  deleteCloudinaryImageAction,
} from "@/server/actions/upload.actions";

export type ImageValue = { url: string; publicId: string | null };

export function SingleImageUploader({
  value,
  onChange,
  folder,
  label = "Image",
  aspectClassName = "aspect-video",
}: {
  value: ImageValue | null;
  onChange: (value: ImageValue | null) => void;
  folder: "products" | "banners" | "branding";
  label?: string;
  aspectClassName?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  function handlePick() {
    inputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    startTransition(async () => {
      const dataUrl = await readFileAsDataUrl(file);
      const result = await uploadImageAction(dataUrl, folder);
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      // Replacing an existing image: delete the old Cloudinary asset only
      // after the new one has uploaded successfully.
      const previous = value;
      onChange({ url: result.url, publicId: result.publicId });
      if (previous?.publicId) {
        await deleteCloudinaryImageAction(previous.publicId);
      }
      toast.success("Image uploaded");
    });
  }

  function handleRemove() {
    const previous = value;
    onChange(null);
    if (previous?.publicId) {
      startTransition(async () => {
        await deleteCloudinaryImageAction(previous.publicId!);
      });
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div
        className={`relative w-full max-w-sm overflow-hidden rounded-xl border border-dashed border-border bg-secondary ${aspectClassName}`}
      >
        {value ? (
          <>
            <Image src={value.url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              disabled={isPending}
              aria-label="Remove image"
              className="absolute right-2 top-2 rounded-full bg-card/90 p-1 shadow-sm"
            >
              <X className="size-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handlePick}
            disabled={isPending}
            className="flex size-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            {isPending ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
            {isPending ? "Uploading…" : "Click to upload"}
          </button>
        )}
      </div>
      {value && (
        <Button type="button" variant="outline" size="sm" onClick={handlePick} disabled={isPending}>
          {isPending ? "Uploading…" : "Replace image"}
        </Button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
