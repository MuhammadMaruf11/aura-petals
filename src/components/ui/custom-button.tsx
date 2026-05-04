"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    isLoading?: boolean;
}

export const CustomButton = ({
    className,
    variant = "primary",
    isLoading,
    children,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-secondary text-black hover:bg-secondary/90",
        outline: "border-2 border-primary text-primary hover:bg-primary/5",
    };

    return (
        <button
            disabled={isLoading || props.disabled}
            className={cn(
                "h-11 px-6 cursor-pointer rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
                variants[variant],
                className
            )}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
};