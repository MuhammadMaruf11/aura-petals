"use client";

import React from "react";
import { PackageSearch, ShoppingBag } from "lucide-react";
import { CustomButton } from "@/components/ui/custom-button";
import Link from "next/link";
import { motion } from "framer-motion";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    showButton?: boolean;
    buttonText?: string;
    buttonLink?: string;
}

export const EmptyState = ({
    title = "No Products Found",
    description = "We couldn't find any products in this category at the moment. Please check back later or explore other collections.",
    icon = <PackageSearch className="w-12 h-12 text-muted-foreground/50" />,
    showButton = true,
    buttonText = "Back to Shop",
    buttonLink = "/shop"
}: EmptyStateProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-muted rounded-xl bg-muted/5"
        >
            <div className="bg-background p-6 rounded-full shadow-sm mb-6 border border-muted">
                {icon}
            </div>

            <h3 className="text-2xl font-heading text-primary mb-2">
                {title}
            </h3>

            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                {description}
            </p>

            {showButton && (
                <Link href={buttonLink}>
                    <CustomButton variant="primary" className="flex gap-2 px-8">
                        <ShoppingBag size={18} />
                        {buttonText}
                    </CustomButton>
                </Link>
            )}
        </motion.div>
    );
};