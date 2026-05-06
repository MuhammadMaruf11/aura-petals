"use client";

import { useQuery } from "@tanstack/react-query";
import { startTransition, useEffect } from "react";

import { getProducts } from "@/services/productService";
import { usePlatformStore } from "@/store/usePlatformStore";

const ProductsProvider = () => {
  const setProducts = usePlatformStore((state) => state.setProducts);
  const { data, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    startTransition(() => {
      setProducts(data);
    });
  }, [data, setProducts]);

  useEffect(() => {
    if (!error) {
      return;
    }

    console.error("Failed to load products from Supabase.", error);
  }, [error]);

  return null;
};

export default ProductsProvider;
