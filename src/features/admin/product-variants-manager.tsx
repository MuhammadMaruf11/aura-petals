"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { saveVariantAction, deleteVariantAction } from "@/server/actions/admin-product.actions";
import type { ProductVariant } from "@prisma/client";
import { formatPrice } from "@/lib/utils";

const emptyForm = {
  name: "",
  sku: "",
  price: "",
  optionsJson: '{"Color":""}',
  stock: "0",
  image: "",
  allowBackorder: false,
  isDefault: false,
};

export function ProductVariantsManager({
  productId,
  variants,
}: {
  productId: string;
  variants: ProductVariant[];
}) {
  const [form, setForm] = useState(emptyForm);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAdd() {
    startTransition(async () => {
      const result = await saveVariantAction(productId, null, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setForm(emptyForm);
      toast.success("Variant added");
      router.refresh();
    });
  }

  function handleDelete(variantId: string) {
    startTransition(async () => {
      await deleteVariantAction(variantId, productId);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {variants.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border/70">
          <table className="w-full text-sm">
            <thead className="border-b border-border/70 text-left text-muted-foreground">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">SKU</th>
                <th className="p-2">Price</th>
                <th className="p-2">Stock</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr key={variant.id} className="border-b border-border/50 last:border-0">
                  <td className="p-2">{variant.name} {variant.isDefault && "★"}</td>
                  <td className="p-2 text-muted-foreground">{variant.sku}</td>
                  <td className="p-2">{formatPrice(Number(variant.price))}</td>
                  <td className="p-2">{variant.stock}</td>
                  <td className="p-2">
                    <button onClick={() => handleDelete(variant.id)} aria-label="Delete variant">
                      <Trash2 className="size-4 text-destructive" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid gap-3 rounded-lg border border-dashed border-border p-4 sm:grid-cols-3">
        <Input placeholder="Name (e.g. Terracotta / M)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
        <Input placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <Input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <Input placeholder="Image URL (optional)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <Input
          placeholder='Options JSON, e.g. {"Color":"Terracotta"}'
          value={form.optionsJson}
          onChange={(e) => setForm({ ...form, optionsJson: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={form.allowBackorder} onCheckedChange={(c) => setForm({ ...form, allowBackorder: !!c })} />
          Allow backorder
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={form.isDefault} onCheckedChange={(c) => setForm({ ...form, isDefault: !!c })} />
          Default variant
        </label>
        <Button type="button" onClick={handleAdd} disabled={isPending}>Add variant</Button>
      </div>
    </div>
  );
}
