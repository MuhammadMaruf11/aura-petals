"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import slugify from "slugify";
import { productFormSchema } from "@/lib/validations/admin";
import { saveProductAction } from "@/server/actions/admin-product.actions";
import { RichTextEditor } from "@/features/admin/rich-text-editor";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import type { Product } from "@prisma/client";

const BADGES = ["NEW", "BEST_SELLER", "LIMITED_EDITION", "HANDMADE", "PERSONALIZED", "SALE"] as const;

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: { id: string; name: string; depth: number }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // No explicit useForm<T> generic — inferred from the resolver itself,
  // since z.coerce fields have an `unknown` pre-coercion input type.
  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      sku: product?.sku ?? "",
      brand: product?.brand ?? "",
      type: product?.type ?? "STANDARD",
      status: product?.status ?? "DRAFT",
      badges: product?.badges ?? [],
      categoryId: product?.categoryId ?? "",
      price: product ? Number(product.price) : 0,
      compareAtPrice: product?.compareAtPrice ? Number(product.compareAtPrice) : "",
      costPrice: product?.costPrice ? Number(product.costPrice) : "",
      stock: product?.stock ?? 0,
      lowStockThreshold: product?.lowStockThreshold ?? 5,
      allowBackorder: product?.allowBackorder ?? false,
      trackInventory: product?.trackInventory ?? true,
      isFeatured: product?.isFeatured ?? false,
      videoUrl: product?.videoUrl ?? "",
      weightGrams: product?.weightGrams ?? "",
      metaTitle: product?.metaTitle ?? "",
      metaDescription: product?.metaDescription ?? "",
    },
  });

  const watchedPrice = Number(form.watch("price")) || 0;
  const watchedCompareAtPrice = Number(form.watch("compareAtPrice")) || 0;
  const discountPercent =
    watchedCompareAtPrice > watchedPrice && watchedPrice > 0
      ? Math.round(((watchedCompareAtPrice - watchedPrice) / watchedCompareAtPrice) * 100)
      : null;

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await saveProductAction(product?.id ?? null, values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("Product saved");
      if (!product && result.id) {
        router.push(`/admin/products/${result.id}`);
      } else {
        router.refresh();
      }
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (!product) {
                        form.setValue("slug", slugify(e.target.value, { lower: true, strict: true }));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Short description</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Full product description…" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select category" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {"—".repeat(c.depth)}{c.depth > 0 ? " " : ""}{c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the most specific level that applies — a top-level category, a
                  subcategory, or a child category.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="VARIANT">Variant (color/size)</SelectItem>
                    <SelectItem value="PERSONALIZED">Personalized</SelectItem>
                    <SelectItem value="BUNDLE">Bundle / gift box</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selling price</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} value={field.value as string | number | undefined} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="compareAtPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Compare-at / original price (optional)</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} value={field.value as string | number | undefined} /></FormControl>
                {discountPercent !== null && (
                  <FormDescription className="text-success">
                    {discountPercent}% off selling price
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="costPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase / cost price (optional)</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} value={field.value as string | number | undefined} /></FormControl>
                <FormDescription>Internal only — never shown to customers. Used for your own margin tracking.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock quantity</FormLabel>
                <FormControl><Input type="number" {...field} value={field.value as string | number | undefined} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lowStockThreshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Low stock threshold</FormLabel>
                <FormControl><Input type="number" {...field} value={field.value as string | number | undefined} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weightGrams"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (grams, optional)</FormLabel>
                <FormControl><Input type="number" {...field} value={field.value as string | number | undefined} /></FormControl>
                <FormDescription>Not used for shipping calculation yet — kept for future use.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Product video URL (optional)</FormLabel>
                <FormControl><Input placeholder="https://youtube.com/watch?v=…" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <FormField
            control={form.control}
            name="allowBackorder"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="font-normal">Allow backorder</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trackInventory"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="font-normal">Track inventory</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="font-normal">Featured on homepage</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="badges"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Badges</FormLabel>
              <div className="flex flex-wrap gap-3">
                {BADGES.map((badge) => (
                  <label key={badge} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={field.value.includes(badge)}
                      onCheckedChange={(checked) => {
                        field.onChange(
                          checked
                            ? [...field.value, badge]
                            : field.value.filter((b) => b !== badge),
                        );
                      }}
                    />
                    {badge.replaceAll("_", " ")}
                  </label>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO title (optional)</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO description (optional)</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : product ? "Save changes" : "Create product"}
        </Button>
      </form>
    </Form>
  );
}
