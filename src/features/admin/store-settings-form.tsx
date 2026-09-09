/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { storeSettingsFormSchema } from "@/lib/validations/admin";
import { saveStoreSettingsAction } from "@/server/actions/admin-settings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  SingleImageUploader,
  type ImageValue,
} from "@/features/admin/single-image-uploader";
import type { StoreSettings } from "@prisma/client";
import type { z } from "zod";

// Form Submit হওয়ার পর Output Type
export type StoreSettingsFormValues = z.infer<typeof storeSettingsFormSchema>;

export function StoreSettingsForm({ settings }: { settings: StoreSettings }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(storeSettingsFormSchema),
    defaultValues: {
      storeName: settings.storeName ?? "",
      storeEmail: settings.storeEmail ?? "",
      storePhone: settings.storePhone ?? "",
      storeAddress: settings.storeAddress ?? "",
      logoUrl: settings.logoUrl ?? "",
      logoCloudinaryPublicId: settings.logoCloudinaryPublicId ?? null,
      currencyCode: settings.currencyCode ?? "BDT",
      currencySymbol: settings.currencySymbol ?? "৳",
      instagramUrl: settings.instagramUrl ?? "",
      facebookUrl: settings.facebookUrl ?? "",
      whatsappUrl: settings.whatsappUrl ?? "",
      tiktokUrl: settings.tiktokUrl ?? "",
      deliveryChargeDhaka: Number(settings.deliveryChargeDhaka ?? 60),
      deliveryChargeOutsideDhaka: Number(
        settings.deliveryChargeOutsideDhaka ?? 120,
      ),
      deliveryChargeOther: Number(settings.deliveryChargeOther ?? 150),
      shippingFlatRate: Number(settings.shippingFlatRate ?? 0),
      freeShippingThreshold: settings.freeShippingThreshold
        ? Number(settings.freeShippingThreshold)
        : undefined,
      taxRatePercent: Number(settings.taxRatePercent ?? 0),
      gtmId: settings.gtmId ?? "",
      metaPixelId: settings.metaPixelId ?? "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await saveStoreSettingsAction(values);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Settings saved successfully");
      router.refresh();
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="container-boutique bg-white py-8 space-y-8">
        <section className="space-y-4">

          {/* Connected SingleImageUploader directly into react-hook-form */}
          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => {
              const currentPublicId = form.watch("logoCloudinaryPublicId");
              const imageValue: ImageValue | null = field.value
                ? { url: field.value, publicId: currentPublicId ?? null }
                : null;

              return (
                <FormItem>
                  <FormControl>
                    <SingleImageUploader
                      value={imageValue}
                      onChange={(img) => {
                        form.setValue("logoUrl", img?.url ?? "", {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        form.setValue(
                          "logoCloudinaryPublicId",
                          img?.publicId ?? null,
                          { shouldValidate: true, shouldDirty: true },
                        );
                      }}
                      folder="branding"
                      label="Store logo"
                      aspectClassName="aspect-square max-w-[160px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storeEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storePhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storeAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-lg font-semibold">Social links</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook page URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagramUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://instagram.com/…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsappUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://wa.me/8801XXXXXXXXX"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Used for the WhatsApp contact button where shown.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tiktokUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TikTok URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://tiktok.com/@…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-lg font-semibold">
            Delivery charges
          </h2>
          <p className="text-sm text-muted-foreground">
            These are the flat delivery charges shown at checkout for each zone.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="deliveryChargeDhaka"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dhaka City (৳)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      {...field}
                      value={field.value as string | number | undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryChargeOutsideDhaka"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outside Dhaka City (৳)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      {...field}
                      value={field.value as string | number | undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryChargeOther"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other areas (৳)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      {...field}
                      value={field.value as string | number | undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-lg font-semibold">
            Currency &amp; other charges
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="currencyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currencySymbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency symbol</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="freeShippingThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Free delivery threshold (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value as string | number | undefined}
                    />
                  </FormControl>
                  <FormDescription>
                    If the order subtotal reaches this amount, delivery is free.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxRatePercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value as string | number | undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-lg font-semibold">Analytics</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="gtmId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Analytics / Tag Manager ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="G-XXXXXXXXXX or GTM-XXXXXXX"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaPixelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Pixel ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </Form>
  );
}
