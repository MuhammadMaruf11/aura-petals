/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProductActions } from "@/components/common/ProductActions";

interface ProductCardProps {
    product: {
        id: string;
        title: string;
        price: number;
        image_url: string;
        tier: "elite" | "average";
        category: string;
    };
    onQuickView: (product: any) => void;
    onWishlist: (product: any) => void;
    onAddToCart: (product: any) => void;
}

export const ProductCard = ({
    product,
    onQuickView,
    onWishlist,
    onAddToCart,
}: ProductCardProps) => {
    const isElite = product.tier === "elite";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <Card className="group relative overflow-hidden border-none bg-transparent shadow-none gap-0">
                <CardContent className="p-0 relative aspect-4/5 overflow-hidden border-none bg-muted">
                    <Badge
                        className={cn(
                            "absolute top-3 left-3 z-10 font-bold tracking-tighter uppercase text-[10px] px-3 py-1 rounded-full",
                            isElite ? "bg-secondary text-white" : "bg-primary text-white"
                        )}
                    >
                        {isElite ? "👑 Elite Collection" : "Classic Choice"}
                    </Badge>

                    <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={isElite}
                    />

                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                        <div>
                            <ProductActions
                                onQuickView={() => onQuickView(product)}
                                onWishlist={() => onWishlist(product)}
                                onAddToCart={() => onAddToCart(product)}
                            />
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col items-center pt-5 pb-2 text-center border-none">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-1">
                        {product.category}
                    </p>
                    <h3 className="font-heading text-xl text-primary font-semibold truncate w-full px-2">
                        {product.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">
                            ৳{product.price.toLocaleString()}
                        </span>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
};
