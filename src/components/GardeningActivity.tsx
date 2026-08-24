import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import HoverTooltip from './HoverTooltip';

export default function GardeningActivity() {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
      animate={{ 
        opacity: isHovered ? 0.95 : 0.4, 
        scale: isHovered ? 0.88 : 0.85, 
        rotate: isHovered ? 1 : -1 
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: isMobile ? '1.5rem' : 'clamp(1rem, 6vw, 4rem)',
        top: isMobile ? '75rem' : '105rem',
        zIndex: 5,
        pointerEvents: 'auto',
        transformOrigin: 'top left'
      }}
    >
      <HoverTooltip text="grounded" isMobile={isMobile}>
        <div style={{
          background: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.03)',
          borderRadius: '16px',
          padding: '12px',
          width: '150px',
          boxShadow: isHovered ? '0 15px 35px rgba(0, 0, 0, 0.05)' : '0 8px 20px rgba(0, 0, 0, 0.02)',
          position: 'relative',
          transition: 'all 0.6s ease'
        }}>
          {/* Pinned Tape Decoration */}
          <div style={{
            position: 'absolute',
            top: '-8px',
            left: '30px',
            width: '35px',
            height: '14px',
            background: 'rgba(34, 197, 94, 0.05)',
            border: '1px solid rgba(34, 197, 94, 0.05)',
            borderRadius: '2px',
            transform: 'rotate(-2deg)'
          }} />

          <div style={{ 
            fontSize: '9px', 
            color: 'rgba(0,0,0,0.3)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em',
            marginBottom: '10px'
          }}>Off-screen habit</div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '4px' }}>
            <div style={{ 
              fontSize: '18px',
              lineHeight: 1,
              marginTop: '2px'
            }}>🌱</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: 600, 
                color: '#1a1a1a',
                lineHeight: 1.3,
                marginBottom: '2px'
              }}>Tending a small garden</div>
              <div style={{ 
                fontSize: '9px', 
                color: 'rgba(0,0,0,0.4)',
                fontWeight: 500
              }}>Vegetables & chili</div>
            </div>
          </div>

          <div style={{ 
            marginTop: '12px',
            fontSize: '8px', 
            fontFamily: 'var(--font-mono)', 
            color: 'rgba(0,0,0,0.2)',
            textAlign: 'center',
            borderTop: '0.5px solid rgba(0,0,0,0.05)',
            paddingTop: '10px'
          }}>
            Patience & Growth
          </div>
        </div>
      </HoverTooltip>
    </motion.div>
  );
}
