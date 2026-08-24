import React, { useState, useEffect, useCallback } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'motion/react';

type CursorState = 'default' | 'hover';

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Remove useSpring to achieve 1:1 native responsiveness
  const cursorX = mouseX;
  const cursorY = mouseY;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for standard interactive elements (including case cards which should just use standard hover now)
      const isInteractive = 
        target.closest('button') || 
        target.closest('a') || 
        target.closest('.nav-item') || 
        target.closest('.case-study-card') ||
        target.closest('[data-cursor="hover"]');

      if (isInteractive) {
        setCursorState('hover');
        return;
      }

      setCursorState('default');
    };

    const handleMouseOut = () => {
      // Small timeout to prevent flickering during fast transitions
      setTimeout(() => {
        setCursorState('default');
      }, 10);
    };

    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkMobile();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('resize', checkMobile);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isMobile || !isVisible) return null;

  const getCursorStyles = () => {
    switch (cursorState) {
      case 'hover':
        return {
          width: 32,
          height: 32,
          backgroundColor: 'rgba(67, 97, 238, 0.15)', // Light System Blue
          border: '1px solid #4361ee',
        };
      default:
        return {
          width: 5,
          height: 5,
          backgroundColor: '#1a1a1a',
          border: 'none',
        };
    }
  };

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          x: cursorX,
          y: cursorY,
          pointerEvents: 'none',
          zIndex: 9999,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          translateX: '-50%',
          translateY: '-50%',
          mixBlendMode: cursorState === 'default' ? 'normal' : 'normal',
        }}
        animate={getCursorStyles()}
        transition={{ 
          type: 'spring', 
          damping: 20, 
          stiffness: 150, 
          mass: 0.8 
        }}
      />

      <style>{`
        @media (min-width: 1025px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
