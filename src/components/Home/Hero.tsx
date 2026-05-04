"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { CustomButton } from "@/components/ui/custom-button";
import { ShoppingBag, ArrowRight } from "lucide-react";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const sliderData = [
    {
        id: 1,
        title: "Premium Petals",
        subtitle: "Organic & Freshly Picked",
        description: "Experience the essence of nature with our curated elite rose collection.",
        price: "1,200",
        image: "https://images.unsplash.com/photo-1562884578-1bfe6a7139fe?q=80&w=2094&auto=format&fit=crop",
        tier: "Natural Elite"
    },
    {
        id: 2,
        title: "Elite Gold Watches",
        subtitle: "Timeless Craftsmanship",
        description: "A statement of luxury and precision for those who value every second.",
        price: "15,500",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop",
        tier: "Elite Series"
    },
    {
        id: 3,
        title: "Customized Gift Boxes",
        subtitle: "Personalized For You",
        description: "Make your loved ones feel special with our handcrafted emotional boxes.",
        price: "3,500",
        image: "https://images.unsplash.com/photo-1647221598398-934ed5cb0e4f?q=80&w=1632&auto=format&fit=crop",
        tier: "Handcrafted"
    }
];

const Hero = () => {
    return (
        <section className="relative w-full h-[70vh] md:h-[85vh] bg-background group">
            <Swiper
                modules={[Autoplay, EffectFade, Navigation, Pagination]}
                effect="fade"
                speed={1000}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                pagination={{ clickable: true }}
                className="h-full w-full"
            >
                {sliderData.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">
                            {/* Background Image with Overlay */}
                            <div className="absolute inset-0">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="container mx-auto h-full px-4 relative z-10 flex items-center">
                                <div className="max-w-2xl text-white">
                                    <motion.div
                                        initial={{ opacity: 0, x: -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <span className="inline-block px-4 py-1 rounded-full bg-secondary text-black text-[10px] font-bold uppercase tracking-widest mb-4">
                                            {slide.tier}
                                        </span>
                                        <h2 className="text-sm md:text-xl font-light tracking-[0.2em] mb-2 uppercase italic text-gray-200">
                                            {slide.subtitle}
                                        </h2>
                                        <h1 className="font-heading text-5xl md:text-8xl mb-6 ">
                                            {slide.title.split(' ').map((word, i) => (
                                                <span key={i} className={i === 1 ? "text-secondary" : ""}>
                                                    {word}{" "}
                                                </span>
                                            ))}
                                        </h1>
                                        <p className="text-gray-300 text-sm md:text-lg mb-8 max-w-lg leading-relaxed font-light">
                                            {slide.description}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-5">
                                            <CustomButton
                                                variant="primary"
                                                className="h-14 px-8 text-sm bg-white text-primary hover:bg-secondary hover:text-white border-none group"
                                            >
                                                <ShoppingBag className="mr-2 w-4 h-4" /> Shop Now — ৳{slide.price}
                                            </CustomButton>
                                            <button className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest hover:text-secondary transition-colors group">
                                                Explore Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Hero;