"use client";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

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
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden rounded-[2rem] group shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100 ${containerBg} ${aspectRatio} ${containerClassName}`}
      style={{ 
        maxHeight: maxHeight || "none", 
        minHeight: minHeight || "none" 
      }}
    >
      {/* Skeleton Loader */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 bg-stone-100 flex items-center justify-center"
          >
            <div className="w-10 h-10 border-2 border-stone-200 border-t-orange-500 rounded-full animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.05 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full transition-transform duration-1000 ease-out group-hover:scale-105 ${
          objectFit === "cover" ? "object-cover" : "object-contain"
        } ${className}`}
        referrerPolicy="no-referrer"
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
