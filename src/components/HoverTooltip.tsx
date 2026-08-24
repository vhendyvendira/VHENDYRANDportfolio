import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';

interface HoverTooltipProps {
  text: string;
  children: React.ReactNode;
  isMobile: boolean;
}

export default function HoverTooltip({ text, children, isMobile }: HoverTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative', width: 'fit-content' }}
    >
      <AnimatePresence>
        {isHovered && !isMobile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'absolute',
              left: smoothX,
              top: smoothY,
              x: 15,
              y: -35,
              pointerEvents: 'none',
              zIndex: 100,
              whiteSpace: 'nowrap',
              background: 'rgba(26, 26, 26, 0.9)',
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '8px',
              fontSize: '10px',
              fontWeight: 500,
              backdropFilter: 'blur(4px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              letterSpacing: '0.01em'
            }}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}
