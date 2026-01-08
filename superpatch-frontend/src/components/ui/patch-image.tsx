"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface PatchImageProps {
  productId: string;
  productName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "size-6",
  sm: "size-8",
  md: "size-12",
  lg: "size-16",
  xl: "size-24",
};

const sizePx = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

export function PatchImage({
  productId,
  productName,
  size = "md",
  className,
}: PatchImageProps) {
  const imagePath = `/patches/${productId}.png`;

  return (
    <div
      className={cn(
        "relative flex-shrink-0 rounded-full overflow-hidden bg-muted",
        sizeClasses[size],
        className
      )}
    >
      <Image
        src={imagePath}
        alt={productName ? `${productName} patch` : `${productId} patch`}
        width={sizePx[size]}
        height={sizePx[size]}
        className="object-cover"
        priority={size === "lg" || size === "xl"}
      />
    </div>
  );
}

// Inline version for use in text/lists
export function PatchImageInline({
  productId,
  productName,
  className,
}: Omit<PatchImageProps, "size">) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={`/patches/${productId}.png`}
        alt={productName ? `${productName} patch` : `${productId} patch`}
        width={20}
        height={20}
        className="rounded-full object-cover"
      />
    </span>
  );
}





