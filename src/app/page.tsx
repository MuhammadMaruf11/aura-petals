import Hero from "@/components/Home/Hero";
import CategorySection from "@/components/Home/CategorySection";
import ProductGrid from "@/components/Home/ProductGrid";

const DUMMY_PRODUCTS = [
  {
    id: 1,
    title: "Rose Gold Necklace",
    price: 2500,
    image_url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80",
    category: "elite",
    tier: "elite",
  },
  {
    id: 2,
    title: "Silk Petal Bouquet",
    price: 1200,
    image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80",
    category: "petals",
    tier: "average",
  },
  {
    id: 3,
    title: "Custom Craft Box",
    price: 1800,
    image_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80",
    category: "crafts",
    tier: "average",
  },
  {
    id: 4,
    title: "Everyday Earrings",
    price: 450,
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
    category: "budget",
    tier: "average",
  },
  {
    id: 5,
    title: "Diamond Studs",
    price: 8500,
    image_url: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400&q=80",
    category: "elite",
    tier: "elite",
  },
  {
    id: 6,
    title: "Rose Gold Necklace",
    price: 2500,
    image_url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80",
    category: "elite",
    tier: "elite",
  },
  {
    id: 7,
    title: "Silk Petal Bouquet",
    price: 1200,
    image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80",
    category: "petals",
    tier: "average",
  },
  {
    id: 8,
    title: "Custom Craft Box",
    price: 1800,
    image_url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80",
    category: "crafts",
    tier: "average",
  },
  {
    id: 9,
    title: "Everyday Earrings",
    price: 450,
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
    category: "budget",
    tier: "average",
  },
  {
    id: 10,
    title: "Diamond Studs",
    price: 8500,
    image_url: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400&q=80",
    category: "elite",
    tier: "elite",
  },
  {
    id: 11,
    title: "Rose Gold Necklace",
    price: 2500,
    image_url: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80",
    category: "elite",
    tier: "elite",
  },
];

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <ProductGrid products={DUMMY_PRODUCTS} />
    </>
  );
}
