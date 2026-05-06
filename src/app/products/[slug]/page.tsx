import ProductDetailPageClient from "@/components/pages/product-detail-page";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ProductDetailPageClient slug={slug} />;
}
