import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';
import HoverTooltip from './HoverTooltip';

export default function LanguageActivity() {
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
      initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
      animate={{ 
        opacity: isHovered ? 0.95 : 0.4, 
        scale: isHovered ? 0.88 : 0.85, 
        rotate: isHovered ? -1 : 1 
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        right: isMobile ? '1.5rem' : 'clamp(1rem, 6vw, 5.5rem)',
        top: isMobile ? '60rem' : '85rem',
        zIndex: 5,
        pointerEvents: 'auto',
        transformOrigin: 'top right'
      }}
    >
      <HoverTooltip text="learn a second language" isMobile={isMobile}>
        <div style={{
          background: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.03)',
          borderRadius: '16px',
          padding: '12px',
          width: '160px',
          boxShadow: isHovered ? '0 15px 35px rgba(0, 0, 0, 0.05)' : '0 8px 20px rgba(0, 0, 0, 0.02)',
          position: 'relative',
          transition: 'all 0.6s ease'
        }}>
          {/* Pinned Tape Decoration */}
          <div style={{
            position: 'absolute',
            top: '-6px',
            right: '30px',
            width: '35px',
            height: '14px',
            background: 'rgba(250, 186, 10, 0.05)',
            border: '1px solid rgba(250, 186, 10, 0.05)',
            borderRadius: '2px',
            transform: 'rotate(1deg)'
          }} />

          <div style={{ 
            fontSize: '9px', 
            color: 'rgba(0,0,0,0.3)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            Currently Learning
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ 
              fontSize: '24px',
              lineHeight: 1,
              flexShrink: 0
            }}>🇬🇧</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: 600, 
                color: '#1a1a1a',
                marginBottom: '1px'
              }}>English</div>
              <div style={{ 
                fontSize: '9px', 
                color: 'rgba(0,0,0,0.4)',
                fontWeight: 500
              }}>Beginner Level</div>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            marginBottom: '12px',
            background: 'rgba(250, 186, 10, 0.05)',
            padding: '8px',
            borderRadius: '8px'
          }}>
            <Flame size={14} color="#faba0a" fill="#faba0a" />
            <div style={{ 
              fontSize: '10px', 
              fontWeight: 600, 
              color: '#c49000',
              letterSpacing: '-0.01em'
            }}>7-day streak</div>
          </div>

          <div style={{ 
            fontSize: '9px', 
            color: 'rgba(0,0,0,0.3)', 
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            borderTop: '0.5px solid rgba(0,0,0,0.05)',
            paddingTop: '10px'
          }}>
            Practiced today
          </div>
        </div>
      </HoverTooltip>
    </motion.div>
  );
}
