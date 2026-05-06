"use client";

import { useMemo, useState } from "react";

import { Panel, SectionHeading } from "@/components/platform/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/platform";
import { createEmptyProductDraft, formatPrice } from "@/lib/platform";
import { usePlatformStore } from "@/store/usePlatformStore";
import type { Product, ProductDraft } from "@/types/platform";

const toDraft = (product: Product): ProductDraft => ({
  title: product.title,
  subtitle: product.subtitle,
  description: product.description,
  price: product.price,
  compareAtPrice: product.compareAtPrice ?? 0,
  images: product.images,
  videoUrl: product.videoUrl ?? "",
  tier: product.tier,
  category: product.category,
  featured: product.featured,
  stock: product.stock,
  status: product.status,
  tags: product.tags,
  specs: product.specs,
});

export default function AdminProductsPage() {
  const products = usePlatformStore((state) => state.products);
  const addProduct = usePlatformStore((state) => state.addProduct);
  const updateProduct = usePlatformStore((state) => state.updateProduct);
  const deleteProduct = usePlatformStore((state) => state.deleteProduct);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(createEmptyProductDraft());

  const summary = useMemo(
    () => ({
      active: products.filter((product) => product.status === "active").length,
      drafts: products.filter((product) => product.status === "draft").length,
      withVideo: products.filter((product) => product.videoUrl).length,
    }),
    [products]
  );

  const resetForm = () => {
    setEditingId(null);
    setDraft(createEmptyProductDraft());
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Product CRUD"
        title="Create, update, and remove products with multi-image and video fields."
        description="Admin product management includes storefront-ready details plus social-only short-form video URLs."
        action={
          <Button variant="secondary" className="rounded-full px-5" onClick={resetForm}>
            Create new draft
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel title={editingId ? "Edit product" : "New product"} subtitle="All edits feed the storefront catalog.">
          <div className="grid gap-4">
            <label className="space-y-2 text-sm font-medium">
              Title
              <Input
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                className="h-11 rounded-full"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Subtitle
              <Input
                value={draft.subtitle}
                onChange={(event) => setDraft((current) => ({ ...current, subtitle: event.target.value }))}
                className="h-11 rounded-full"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Description
              <textarea
                value={draft.description}
                onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                className="min-h-28 w-full rounded-[28px] border border-border bg-background px-4 py-3 text-sm outline-none"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium">
                Price
                <Input
                  type="number"
                  value={draft.price}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, price: Number(event.target.value) || 0 }))
                  }
                  className="h-11 rounded-full"
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Compare-at price
                <Input
                  type="number"
                  value={draft.compareAtPrice ?? 0}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      compareAtPrice: Number(event.target.value) || 0,
                    }))
                  }
                  className="h-11 rounded-full"
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Category
                <select
                  value={draft.category}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      category: event.target.value as ProductDraft["category"],
                    }))
                  }
                  className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none"
                >
                  {categories.map((item) => (
                    <option key={item.id} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium">
                Tier
                <select
                  value={draft.tier}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      tier: event.target.value as ProductDraft["tier"],
                    }))
                  }
                  className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none"
                >
                  <option value="average">Everyday</option>
                  <option value="elite">Elite</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium">
                Stock
                <Input
                  type="number"
                  value={draft.stock}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, stock: Number(event.target.value) || 0 }))
                  }
                  className="h-11 rounded-full"
                />
              </label>
              <label className="space-y-2 text-sm font-medium">
                Status
                <select
                  value={draft.status}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      status: event.target.value as ProductDraft["status"],
                    }))
                  }
                  className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Image URLs</p>
                <Button
                  variant="ghost"
                  className="rounded-full px-4"
                  onClick={() =>
                    setDraft((current) => ({ ...current, images: [...current.images, ""] }))
                  }
                >
                  Add image
                </Button>
              </div>
              {draft.images.map((image, index) => (
                <Input
                  key={`image-${index}`}
                  value={image}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      images: current.images.map((item, itemIndex) =>
                        itemIndex === index ? event.target.value : item
                      ),
                    }))
                  }
                  className="h-11 rounded-full"
                />
              ))}
            </div>

            <label className="space-y-2 text-sm font-medium">
              Video URL
              <Input
                value={draft.videoUrl ?? ""}
                onChange={(event) => setDraft((current) => ({ ...current, videoUrl: event.target.value }))}
                className="h-11 rounded-full"
                placeholder="Social-only short-form video URL"
              />
            </label>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Tags</p>
                <Button
                  variant="ghost"
                  className="rounded-full px-4"
                  onClick={() => setDraft((current) => ({ ...current, tags: [...current.tags, ""] }))}
                >
                  Add tag
                </Button>
              </div>
              {draft.tags.map((tag, index) => (
                <Input
                  key={`tag-${index}`}
                  value={tag}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      tags: current.tags.map((item, itemIndex) =>
                        itemIndex === index ? event.target.value : item
                      ),
                    }))
                  }
                  className="h-11 rounded-full"
                />
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Specifications</p>
                <Button
                  variant="ghost"
                  className="rounded-full px-4"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      specs: [...current.specs, { label: "", value: "" }],
                    }))
                  }
                >
                  Add spec
                </Button>
              </div>
              {draft.specs.map((spec, index) => (
                <div key={`spec-${index}`} className="grid gap-3 md:grid-cols-2">
                  <Input
                    value={spec.label}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        specs: current.specs.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, label: event.target.value } : item
                        ),
                      }))
                    }
                    className="h-11 rounded-full"
                    placeholder="Label"
                  />
                  <Input
                    value={spec.value}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        specs: current.specs.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, value: event.target.value } : item
                        ),
                      }))
                    }
                    className="h-11 rounded-full"
                    placeholder="Value"
                  />
                </div>
              ))}
            </div>

            <label className="flex items-center gap-3 rounded-full border border-border bg-muted/35 px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(event) => setDraft((current) => ({ ...current, featured: event.target.checked }))}
              />
              Featured on storefront
            </label>

            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-full px-5"
                onClick={() => {
                  if (editingId) {
                    updateProduct(editingId, draft);
                  } else {
                    addProduct(draft);
                  }
                  resetForm();
                }}
              >
                {editingId ? "Update product" : "Create product"}
              </Button>
              <Button variant="ghost" className="rounded-full px-5" onClick={resetForm}>
                Reset
              </Button>
            </div>
          </div>
        </Panel>

        <Panel title="Catalog inventory" subtitle="Manage active, draft, image, and video-ready products.">
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-muted/55 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Active</p>
              <p className="mt-2 font-heading text-3xl text-primary">{summary.active}</p>
            </div>
            <div className="rounded-3xl bg-muted/55 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Draft</p>
              <p className="mt-2 font-heading text-3xl text-primary">{summary.drafts}</p>
            </div>
            <div className="rounded-3xl bg-muted/55 p-4 text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Video</p>
              <p className="mt-2 font-heading text-3xl text-primary">{summary.withVideo}</p>
            </div>
          </div>

          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="rounded-[24px] border border-border/70 bg-muted/35 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">{product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.category} • {product.status} • {formatPrice(product.price)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.images.length} images{product.videoUrl ? " + 1 video URL" : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="secondary"
                      className="rounded-full px-4"
                      onClick={() => {
                        setEditingId(product.id);
                        setDraft(toDraft(product));
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      className="rounded-full px-4 text-red-700 hover:text-red-700"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
