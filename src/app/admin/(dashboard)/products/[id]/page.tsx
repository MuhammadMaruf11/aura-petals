import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminGetProductById } from "@/server/services/admin-product.service";
import { adminListCategoriesForSelect } from "@/server/services/admin-category.service";
import { ProductForm } from "@/features/admin/product-form";
import { ProductGalleryManager } from "@/features/admin/product-gallery-manager";
import { ProductVariantsManager } from "@/features/admin/product-variants-manager";
import { ProductCustomizationManager } from "@/features/admin/product-customization-manager";
import { ProductBundleManager } from "@/features/admin/product-bundle-manager";
import { serializeDecimals } from "@/lib/serialize";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Edit Product · Admin" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [rawProduct, categories] = await Promise.all([
    adminGetProductById(id),
    adminListCategoriesForSelect(),
  ]);
  if (!rawProduct) notFound();
  // Serialized once here and reused for every client component below —
  // rawProduct.price/compareAtPrice/costPrice, variants[].price, and
  // bundleItems[].component.price/compareAtPrice are all Prisma Decimal
  // values that can't cross the Server -> Client boundary as-is.
  const product = serializeDecimals(rawProduct);


  return (
    <div className="max-w-4xl space-y-8">
      <h1 className="font-heading text-2xl">{product.name}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm product={product} categories={categories} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductGalleryManager
            productId={product.id}
            images={product.images}
          />
        </CardContent>
      </Card>

      {product.type === "VARIANT" && (
        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductVariantsManager
              productId={product.id}
              variants={product.variants}
            />
          </CardContent>
        </Card>
      )}

      {product.type === "PERSONALIZED" && (
        <Card>
          <CardHeader>
            <CardTitle>Personalization fields</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductCustomizationManager
              productId={product.id}
              fields={product.customizationFields}
            />
          </CardContent>
        </Card>
      )}

      {product.type === "BUNDLE" && (
        <Card>
          <CardHeader>
            <CardTitle>Bundle contents</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductBundleManager
              bundleId={product.id}
              items={product.bundleItems}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
