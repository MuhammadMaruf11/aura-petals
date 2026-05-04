"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const categories = [
    {
        id: 1,
        name: "Elite Collection",
        slug: "elite",
        image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=400&auto=format&fit=crop",
        count: "120+ Items",
    },
    {
        id: 2,
        name: "Natural Petals",
        slug: "petals",
        image: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?q=80&w=400&auto=format&fit=crop",
        count: "85+ Items",
    },
    {
        id: 3,
        name: "Custom Crafts",
        slug: "crafts",
        image: "https://plus.unsplash.com/premium_photo-1672676965089-d20aa2a9e1f4?q=80&w=1170&auto=format&fit=crop",
        count: "50+ Items",
    },
    {
        id: 4,
        name: "Budget Friendly",
        slug: "budget",
        image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?q=80&w=400&auto=format&fit=crop",
        count: "200+ Items",
    },
];

const CategorySection = () => {
    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col items-center mb-12 text-center">
                    <h2 className="font-heading text-3xl md:text-4xl text-primary">Browse by Category</h2>
                    <div className="w-20 h-1 bg-secondary mt-4 rounded-full" />
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={`/shop?category=${category.slug}`}
                                className="flex flex-col items-center group gap-4 text-center"
                            >
                                {/* Round Image Container */}
                                <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-transparent group-hover:border-secondary transition-all duration-500 p-1 bg-muted/50">
                                    <div className="relative w-full h-full rounded-full overflow-hidden">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-primary/80 px-3 py-1 rounded-full">
                                            View All
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div>
                                    <h3 className="font-bold text-sm md:text-base text-primary uppercase tracking-tight group-hover:text-secondary transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-[10px] md:text-xs text-muted-foreground font-medium">
                                        {category.count}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;