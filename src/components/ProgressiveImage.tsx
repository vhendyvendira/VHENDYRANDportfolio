import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  aspectRatio?: string;
}

export default function ProgressiveImage({ src, alt, className, style, imgStyle, aspectRatio }: ProgressiveImageProps) {
  const [highResLoaded, setHighResLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Derive thumbnail for Picsum images - tiny resolution for immediate loading
  const thumbSrc = src.includes("picsum.photos") 
    ? src.replace(/\/\d+\/\d+/, "/40/40") + "?blur=5"
    : src;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' } // Load even earlier for better perceived performance
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "#F9F8F6", // Consistent with YC portfolio background
    aspectRatio: aspectRatio,
    ...style
  };

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      <AnimatePresence initial={false}>
        {/* 1. Low-res Placeholder Layer */}
        {isInView && !highResLoaded && (
          <motion.img
            key="thumb"
            src={thumbSrc}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(40px)", // Heavier blur for the placeholder
              transform: "scale(1.1)", // Scale up to hide blurred edges
              ...imgStyle
            }}
          />
        )}

        {/* 2. High-res Image Layer */}
        {isInView && (
          <motion.img
            key="highRes"
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onLoad={() => setHighResLoaded(true)}
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ 
              opacity: highResLoaded ? 1 : 0,
              filter: highResLoaded ? "blur(0px)" : "blur(20px)"
            }}
            transition={{ 
              opacity: { duration: 0.8 },
              filter: { duration: 1.2, ease: "easeOut" }
            }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,
              ...imgStyle
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
