/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export const MobileMenu = ({ isOpen, onClose, navLinks }: any) => {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-background flex flex-col p-0 gap-0">
                <SheetHeader className="p-6 border-b text-left">
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <Image src='/images/logo/main-logo.png' alt="Logo" width={200} height={40} />
                </SheetHeader>

                <div className="grow overflow-y-auto">
                    <nav className="flex flex-col">
                        {navLinks.map((link: any, index: number) => (
                            <motion.div
                                key={link.name}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={onClose}
                                    className="flex items-center justify-between px-6 py-4 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-primary transition-all border-b border-muted/50"
                                >
                                    {link.name}
                                    <ChevronRight size={14} className="opacity-50" />
                                </Link>
                            </motion.div>
                        ))}
                    </nav>
                </div>

            </SheetContent>
        </Sheet>
    );
};