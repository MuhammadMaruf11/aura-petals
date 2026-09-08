"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { bannerFormClientSchema } from "@/lib/validations/admin";
import { saveBannerAction } from "@/server/actions/admin-settings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Banner } from "@prisma/client";
import { Plus } from "lucide-react";
import { SingleImageUploader, type ImageValue } from "@/features/admin/single-image-uploader";

export function BannerFormDialog({ banner, trigger }: { banner?: Banner; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [image, setImage] = useState<ImageValue | null>(
    banner ? { url: banner.imageUrl, publicId: banner.cloudinaryPublicId } : null,
  );
  const router = useRouter();

  // No explicit useForm<T> generic — inferred from the resolver itself,
  // since z.coerce fields have an `unknown` pre-coercion input type.
  const form = useForm({
    resolver: zodResolver(bannerFormClientSchema),
    defaultValues: {
      title: banner?.title ?? "",
      subtitle: banner?.subtitle ?? "",
      ctaLabel: banner?.ctaLabel ?? "",
      ctaHref: banner?.ctaHref ?? "",
      placement: banner?.placement ?? "HERO",
      sortOrder: banner?.sortOrder ?? 0,
      isActive: banner?.isActive ?? true,
      startsAt: banner?.startsAt ? banner.startsAt.toISOString().slice(0, 10) : "",
      endsAt: banner?.endsAt ? banner.endsAt.toISOString().slice(0, 10) : "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    if (!image) {
      toast.error("Please upload a banner image.");
      return;
    }
    startTransition(async () => {
      const result = await saveBannerAction(banner?.id ?? null, {
        ...values,
        imageUrl: image.url,
        cloudinaryPublicId: image.publicId,
      });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(banner ? "Banner updated" : "Banner created");
      setOpen(false);
      router.refresh();
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button><Plus /> New banner</Button>}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{banner ? "Edit banner" : "New banner"}</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="subtitle" render={({ field }) => (
              <FormItem><FormLabel>Subtitle</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <SingleImageUploader
              value={image}
              onChange={setImage}
              folder="banners"
              label="Banner image"
              aspectClassName="aspect-[21/9]"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="ctaLabel" render={({ field }) => (
                <FormItem><FormLabel>Button label</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="ctaHref" render={({ field }) => (
                <FormItem><FormLabel>Button link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="placement" render={({ field }) => (
              <FormItem>
                <FormLabel>Placement</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="HERO">Hero</SelectItem>
                    <SelectItem value="PROMO_STRIP">Promo strip</SelectItem>
                    <SelectItem value="MID_PAGE">Mid page</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="startsAt" render={({ field }) => (
                <FormItem><FormLabel>Starts (optional)</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="endsAt" render={({ field }) => (
                <FormItem><FormLabel>Ends (optional)</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="font-normal">Active</FormLabel>
              </FormItem>
            )} />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Saving…" : "Save banner"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
