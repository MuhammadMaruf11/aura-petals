/* eslint-disable react-hooks/incompatible-library */
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
import {
  Package,
  DollarSign,
  Layers,
  BarChart3,
  Globe,
  Sparkles,
  Video,
  Loader2,
} from "lucide-react";
import type { Product } from "@prisma/client";

const BADGES = [
  "NEW",
  "BEST_SELLER",
  "LIMITED_EDITION",
  "HANDMADE",
  "PERSONALIZED",
  "SALE",
] as const;

export function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: { id: string; name: string; depth: number }[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
      compareAtPrice: product?.compareAtPrice
        ? Number(product.compareAtPrice)
        : "",
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
      ? Math.round(
          ((watchedCompareAtPrice - watchedPrice) / watchedCompareAtPrice) *
            100,
        )
      : null;

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await saveProductAction(product?.id ?? null, values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("Product saved successfully!");
      if (!product && result.id) {
        router.push(`/admin/products/${result.id}`);
      } else {
        router.refresh();
      }
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8 pb-16  mx-auto">
        {/* Header Actions Bar */}
        <div className="flex items-center justify-between bg-white border border-border/60 p-4 sm:p-6 rounded-2xl shadow-xs sticky top-4 z-20 backdrop-blur-md bg-white/9onta">
          <div>
            <h1 className="text-xl font-heading font-semibold text-foreground">
              {product ? "Edit Product" : "Create New Product"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {product
                ? `Updating details for ${product.name}`
                : "Fill in the details to publish a new item to your store."}
            </p>
          </div>
          <Button
            type="submit"
            disabled={isPending}
            size="lg"
            className="rounded-full px-6 shadow-md font-medium"
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isPending
              ? "Saving..."
              : product
                ? "Save Changes"
                : "Publish Product"}
          </Button>
        </div>

        {/* SECTION 1: General Information */}
        <div className="bg-white border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Package className="size-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-medium text-foreground">
                General Information
              </h2>
              <p className="text-xs text-muted-foreground">
                Basic identity, titles, and descriptions for your product.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel className="font-medium text-foreground">
                    Product Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Handcrafted Ceramic Coffee Mug"
                      className="rounded-xl h-11"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!product) {
                          form.setValue(
                            "slug",
                            slugify(e.target.value, {
                              lower: true,
                              strict: true,
                            }),
                          );
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
                  <FormLabel className="font-medium text-foreground">
                    URL Slug
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="handcrafted-ceramic-coffee-mug"
                      className="rounded-xl h-11 bg-neutral-50/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-foreground">
                    SKU (Stock Keeping Unit)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MUG-CER-01"
                      className="rounded-xl h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel className="font-medium text-foreground">
                    Short Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="A brief catchphrase or summary shown on product cards."
                      className="rounded-xl h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel className="font-medium text-foreground">
                    Full Description
                  </FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Provide complete details about materials, care instructions, dimensions..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECTION 2: Organization & Classification */}
        <div className="bg-white border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
              <Layers className="size-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-medium text-foreground">
                Organization & Type
              </h2>
              <p className="text-xs text-muted-foreground">
                Categorize your product for easy navigation and filtering.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-foreground">
                    Category
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full rounded-xl h-11">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      {categories.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={c.id}
                          className="cursor-pointer"
                        >
                          {"—".repeat(c.depth)}
                          {c.depth > 0 ? " " : ""}
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-[11px]">
                    Choose the most specific category level.
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
                  <FormLabel className="font-medium text-foreground">
                    Brand / Maker
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Artisanal Studio"
                      className="rounded-xl h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-foreground">
                    Product Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full rounded-xl h-11">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="STANDARD">Standard</SelectItem>
                      <SelectItem value="VARIANT">
                        Variant (color/size)
                      </SelectItem>
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
                  <FormLabel className="font-medium text-foreground">
                    Publication Status
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full rounded-xl h-11">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ACTIVE">Active (Published)</SelectItem>
                      <SelectItem value="ARCHIVED">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECTION 3: Pricing */}
        <div className="bg-white border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
              <DollarSign className="size-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-medium text-foreground">
                Pricing & Margins
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage your selling prices, discounts, and cost metrics.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-foreground">
                    Selling Price ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      className="rounded-xl h-11"
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
              name="compareAtPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-foreground">
                    Compare-at Price ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      className="rounded-xl h-11"
                      {...field}
                      value={field.value as string | number | undefined}
                    />
                  </FormControl>
                  {discountPercent !== null && (
                    <FormDescription className="text-emerald-600 font-medium text-xs">
                      ✨ {discountPercent}% discount off original price
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
                  <FormLabel className="font-medium text-foreground">
                    Cost Price ($){" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      (Internal)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      className="rounded-xl h-11"
                      {...field}
                      value={field.value as string | number | undefined}
                    />
                  </FormControl>
                  <FormDescription className="text-[11px]">
                    Never shown to customers. Used for margin tracking.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECTION 4: Inventory & Fulfillment */}
        <div className="bg-white border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
              <BarChart3 className="size-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-medium text-foreground">
                Inventory & Fulfillment
              </h2>
              <p className="text-xs text-muted-foreground">
                Control stock levels, thresholds, and shipping weights.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-foreground">
                    Stock Quantity
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="rounded-xl h-11"
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
              name="lowStockThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-foreground">
                    Low Stock Threshold
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="rounded-xl h-11"
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
              name="weightGrams"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-foreground">
                    Weight (grams)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="rounded-xl h-11"
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
              name="videoUrl"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel className="font-medium text-foreground flex items-center gap-1.5">
                    <Video className="size-4 text-rose-500" /> Product Video URL
                    (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://youtube.com/watch?v=…"
                      className="rounded-xl h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Toggles Checklist */}
          <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t border-border/50">
            <div className="flex items-center space-x-3 p-4 rounded-2xl border border-border/60 bg-neutral-50/50 hover:bg-neutral-50 transition">
              <FormField
                control={form.control}
                name="trackInventory"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0 w-full cursor-pointer">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="size-5 rounded-md"
                      />
                    </FormControl>
                    <div className="space-y-0.5 leading-none">
                      <FormLabel className="font-medium cursor-pointer">
                        Track inventory
                      </FormLabel>
                      <p className="text-[11px] text-muted-foreground">
                        Automatically reduce stock on sale
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-2xl border border-border/60 bg-neutral-50/50 hover:bg-neutral-50 transition">
              <FormField
                control={form.control}
                name="allowBackorder"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0 w-full cursor-pointer">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="size-5 rounded-md"
                      />
                    </FormControl>
                    <div className="space-y-0.5 leading-none">
                      <FormLabel className="font-medium cursor-pointer">
                        Allow backorder
                      </FormLabel>
                      <p className="text-[11px] text-muted-foreground">
                        Allow purchases when out of stock
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-2xl border border-border/60 bg-neutral-50/50 hover:bg-neutral-50 transition">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-3 space-y-0 w-full cursor-pointer">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="size-5 rounded-md"
                      />
                    </FormControl>
                    <div className="space-y-0.5 leading-none">
                      <FormLabel className="font-medium cursor-pointer">
                        Featured item
                      </FormLabel>
                      <p className="text-[11px] text-muted-foreground">
                        Showcase prominently on homepage
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: Badges & Tags */}
        <div className="bg-white border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-medium text-foreground">
                Badges & Attributes
              </h2>
              <p className="text-xs text-muted-foreground">
                Highlight special traits like handmade, limited edition, or
                sales.
              </p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="badges"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {BADGES.map((badge) => {
                    const isSelected = field.value.includes(badge);
                    return (
                      <div
                        key={badge}
                        onClick={() => {
                          field.onChange(
                            isSelected
                              ? field.value.filter((b) => b !== badge)
                              : [...field.value, badge],
                          );
                        }}
                        className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary font-medium shadow-2xs"
                            : "border-border/60 bg-neutral-50/40 hover:bg-neutral-50 text-foreground"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => {}} // Handled by outer div click for better UX
                          className="rounded-md pointer-events-none"
                        />
                        <span className="text-xs uppercase tracking-wider">
                          {badge.replaceAll("_", " ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* SECTION 6: SEO Metadata */}
        <div className="bg-white border border-border/60 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600">
              <Globe className="size-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-medium text-foreground">
                Search Engine Optimization (SEO)
              </h2>
              <p className="text-xs text-muted-foreground">
                Optimize how this product appears on Google and search engines.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-foreground">
                    SEO Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Custom title for search engines"
                      className="rounded-xl h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-foreground">
                    SEO Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief meta summary for search results"
                      className="rounded-xl h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Bottom Sticky or Action Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-full px-6 h-12"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            size="lg"
            className="rounded-full px-8 h-12 shadow-lg font-medium"
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isPending
              ? "Saving..."
              : product
                ? "Save Changes"
                : "Publish Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
