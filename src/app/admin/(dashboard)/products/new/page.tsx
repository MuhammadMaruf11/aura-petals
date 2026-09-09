import type { Metadata } from "next";
import { adminListCategoriesForSelect } from "@/server/services/admin-category.service";
import { ProductForm } from "@/features/admin/product-form";

export const metadata: Metadata = { title: "New Product · Admin" };

export default async function NewProductPage() {
  const categories = await adminListCategoriesForSelect();

  return (
    <div className="container-boutique space-y-6">
      <h1 className="font-heading text-2xl">New product</h1>
      <ProductForm categories={categories} />
      <p className="text-sm text-muted-foreground">
        Save the product first — images, variants, personalization fields, and bundle contents
        can be added once it exists.
      </p>
    </div>
  );
}
