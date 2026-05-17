/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import GlobalImage from "@/components/common/GlobalImage";

interface AboutUsProps {
  data: any;
}

const AboutUsContent = ({ data }: AboutUsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-8 bg-white shadow-md rounded-lg"
    >
      {/* Heading */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Column */}
        <div className="md:w-1/2">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {data.description}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {data.additionalInfo}
          </p>
        </div>

        {/* Right Column */}
        <div className="md:w-1/2 flex items-center justify-center">
          <GlobalImage
            src={data.image}
            alt="Example Image"
            width={300}
            height={200}
            className="rounded-lg"
            priority
          />
        </div>
      </div>

      {/* Testimonial Slider */}
      <div className="mt-16 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Testimonials</h2>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={50}
          slidesPerView={1} // One slide at a time
          autoplay={{ delay: 3000 }} // Auto-play with a 3-second interval
          pagination={{ clickable: true }}
          className="my-swiper"
        >
          {data.testimonials.map((testimonial: any, index: number) => (
            <SwiperSlide key={index}>
              <div className="min-w-75 p-6 bg-gray-100 rounded-lg shadow-md">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {testimonial.review}
                </p>
                <h3 className="text-xl font-semibold text-gray-800">
                  {testimonial.author}
                </h3>
                <p className="text-sm text-gray-600">{testimonial.position}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.div>
  );
};

export default AboutUsContent;
