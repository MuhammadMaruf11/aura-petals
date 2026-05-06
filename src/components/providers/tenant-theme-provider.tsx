"use client";

import { useEffect } from "react";

import { usePlatformStore } from "@/store/usePlatformStore";

const TenantThemeProvider = () => {
  const colors = usePlatformStore((state) => state.branding.colors);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--brand-primary", colors.primary);
    root.style.setProperty("--brand-secondary", colors.secondary);
    root.style.setProperty("--brand-accent", colors.accent);
    root.style.setProperty("--surface-background", colors.background);
    root.style.setProperty("--surface-foreground", colors.foreground);
  }, [colors]);

  return null;
};

export default TenantThemeProvider;
