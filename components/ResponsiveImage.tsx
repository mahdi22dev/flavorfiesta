import { motion } from "motion/react";
import Image from "next/image";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
  maxHeight?: string;
  minHeight?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "scale-down";
  containerBg?: string;
}

export default function ResponsiveImage({
  src,
  alt,
  aspectRatio = "aspect-video",
  className = "",
  containerClassName = "",
  children,
  maxHeight,
  minHeight,
  objectFit = "cover",
  containerBg = "bg-stone-50",
}: ResponsiveImageProps) {
  return (
    <div 
      className={`relative overflow-hidden rounded-[2rem] group shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100 ${containerBg} ${aspectRatio} ${containerClassName}`}
      style={{ 
        maxHeight: maxHeight || "none", 
        minHeight: minHeight || "none" 
      }}
    >

      
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        loading="lazy"
        className={`transition-transform duration-1000 ease-out group-hover:scale-105 ${
          objectFit === "cover" ? "object-cover" : "object-contain"
        } ${className}`}
      />

      {/* Content Overlay - Ensures text is readable and doesn't "destroy" the image area */}
      {children && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative h-full w-full pointer-events-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
