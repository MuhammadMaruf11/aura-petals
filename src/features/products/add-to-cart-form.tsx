/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Minus, Plus } from "lucide-react";
import type { ProductDetailData } from "@/server/services/product.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/form";
import { useAddToCart } from "@/features/cart/use-cart";
import { useCartUiStore } from "@/features/cart/cart-ui-store";
import { formatPrice } from "@/lib/utils";
import { isOutOfStock, maxOrderableQuantity } from "@/lib/stock";
import { trackAddToCart } from "@/lib/analytics/events";

type Props = { product: ProductDetailData };

function buildCustomizationSchema(product: ProductDetailData) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of product.customizationFields) {
    let schema: z.ZodTypeAny = z.string();
    if (field.maxLength) schema = (schema as z.ZodString).max(field.maxLength);
    if (field.isRequired) {
      schema = (schema as z.ZodString).min(1, `${field.label} is required`);
    } else {
      schema = schema.optional().or(z.literal(""));
    }
    shape[field.fieldKey] = schema;
  }
  return z.object(shape);
}

export function AddToCartForm({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const defaultVariant =
      product.variants.find((v) => v.isDefault) ?? product.variants[0];
    return (defaultVariant?.options as Record<string, string>) ?? {};
  });

  const addToCart = useAddToCart();
  const openCart = useCartUiStore((state) => state.open);

  const optionGroups = useMemo(() => {
    const groups = new Map<string, Set<string>>();
    for (const variant of product.variants) {
      const options = variant.options as Record<string, string>;
      for (const [key, value] of Object.entries(options)) {
        if (!groups.has(key)) groups.set(key, new Set());
        groups.get(key)!.add(value);
      }
    }
    return Array.from(groups.entries()).map(([key, values]) => ({
      key,
      values: Array.from(values),
    }));
  }, [product.variants]);

  const selectedVariant = useMemo(() => {
    if (product.type !== "VARIANT") return null;
    return (
      product.variants.find((variant) => {
        const options = variant.options as Record<string, string>;
        return Object.entries(selectedOptions).every(
          ([k, v]) => options[k] === v,
        );
      }) ?? null
    );
  }, [product.variants, selectedOptions, product.type]);

  const customizationSchema = useMemo(
    () => buildCustomizationSchema(product),
    [product],
  );
  const customizationForm = useForm<Record<string, unknown>>({
    resolver: product.customizationFields.length
      ? zodResolver(customizationSchema)
      : undefined,
    defaultValues: Object.fromEntries(
      product.customizationFields.map((f) => [f.fieldKey, ""]),
    ),
  });

  const price = selectedVariant
    ? Number(selectedVariant.price)
    : Number(product.price);
  const stock = selectedVariant ? selectedVariant.stock : product.stock;
  const allowBackorder =
    selectedVariant?.allowBackorder ?? product.allowBackorder;
  const outOfStock = isOutOfStock({
    stock,
    allowBackorder,
    trackInventory: product.trackInventory,
  });
  const maxQuantity = maxOrderableQuantity({
    stock,
    allowBackorder,
    trackInventory: product.trackInventory,
  });

  useEffect(() => {
    setQuantity((q) => Math.max(1, Math.min(q, maxQuantity)));
  }, [maxQuantity]);

  function handleAddToCart(customization?: Record<string, string>) {
    addToCart.mutate(
      {
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        quantity,
        customization: customization ?? null,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            openCart();
            trackAddToCart(
              {
                id: product.id,
                name: product.name,
                price,
                currency: product.currency,
              },
              quantity,
            );
          }
        },
      },
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-medium">{formatPrice(price)}</span>
        {product.compareAtPrice && Number(product.compareAtPrice) > price && (
          <span className="text-muted-foreground line-through">
            {formatPrice(Number(product.compareAtPrice))}
          </span>
        )}
      </div>

      {optionGroups.map((group) => (
        <div key={group.key} className="space-y-2">
          <p className="text-sm font-medium">{group.key}</p>
          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setSelectedOptions((prev) => ({
                    ...prev,
                    [group.key]: value,
                  }))
                }
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  selectedOptions[group.key] === value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}

      {product.customizationFields.length > 0 && (
        <Form {...customizationForm}>
          <div className="space-y-4 rounded-2xl border border-border/70 bg-sand/60 p-4">
            <p className="text-sm font-medium">Personalize this gift</p>
            {product.customizationFields.map((field) => (
              <FormField
                key={field.id}
                control={customizationForm.control}
                name={field.fieldKey}
                render={({ field: rhfField }) => (
                  <FormItem>
                    <FormLabel>
                      {field.label}
                      {!field.isRequired && (
                        <span className="text-muted-foreground">
                          {" "}
                          (optional)
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      {field.type === "TEXTAREA" ? (
                        <Textarea
                          maxLength={field.maxLength ?? undefined}
                          {...rhfField}
                          value={rhfField.value as string}
                        />
                      ) : field.type === "SELECT" || field.type === "COLOR" ? (
                        <Select
                          onValueChange={rhfField.onChange}
                          value={rhfField.value as string}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={`Choose ${field.label.toLowerCase()}`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((opt) => (
                              <SelectItem key={opt} value={opt}>
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={field.type === "DATE" ? "date" : "text"}
                          maxLength={field.maxLength ?? undefined}
                          {...rhfField}
                          value={rhfField.value as string}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </Form>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
          <button
            type="button"
            className="p-1.5 disabled:opacity-40"
            disabled={quantity <= 1 || outOfStock}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="size-4" />
          </button>
          <span className="min-w-6 text-center">{quantity}</span>
          <button
            type="button"
            className="p-1.5 disabled:opacity-40"
            disabled={quantity >= maxQuantity || outOfStock}
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
          >
            <Plus className="size-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          {outOfStock
            ? "Out of stock"
            : allowBackorder
              ? "In stock"
              : stock <= 5
                ? `Only ${stock} left`
                : "In stock"}
        </p>
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={outOfStock || addToCart.isPending}
        onClick={
          product.customizationFields.length > 0
            ? customizationForm.handleSubmit((values) =>
                handleAddToCart(values as Record<string, string>),
              )
            : () => handleAddToCart()
        }
      >
        {outOfStock
          ? "Out of stock"
          : addToCart.isPending
            ? "Adding…"
            : "Add to bag"}
      </Button>
    </div>
  );
}
