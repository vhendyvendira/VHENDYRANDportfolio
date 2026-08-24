import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import HoverTooltip from './HoverTooltip';

export default function ReadingActivity() {
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
        rotate: isHovered ? -2 : -4 
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: isMobile ? '1.5rem' : 'clamp(1rem, 6vw, 4.5rem)',
        top: isMobile ? '45rem' : '65rem',
        zIndex: 5,
        pointerEvents: 'auto',
        transformOrigin: 'top left'
      }}
    >
      <HoverTooltip text="still reading" isMobile={isMobile}>
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
            left: '20px',
            width: '35px',
            height: '14px',
            background: 'rgba(0, 0, 0, 0.03)',
            border: '1px solid rgba(0, 0, 0, 0.02)',
            borderRadius: '2px',
            transform: 'rotate(-2deg)'
          }} />

          <div style={{ 
            fontSize: '9px', 
            color: 'rgba(0,0,0,0.3)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em',
            marginBottom: '10px'
          }}>Currently Reading</div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
            <div style={{ 
              width: '40px', 
              height: '56px', 
              background: '#f5f5f5', 
              borderRadius: '4px',
              boxShadow: '2px 4px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <img 
                src="https://ik.imagekit.io/0ghhw9jvx/about-page-images/emotional-agility-book.jpg" 
                alt="Emotional Agility Book Cover" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: 600, 
                color: '#1a1a1a',
                lineHeight: 1.3,
                marginBottom: '2px'
              }}>Emotional Agility</div>
              <div style={{ 
                fontSize: '9px', 
                color: 'rgba(0,0,0,0.4)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>Susan David</div>
            </div>
          </div>

          <div style={{ marginBottom: '4px' }}>
            <div style={{ 
              height: '3px', 
              background: 'rgba(0,0,0,0.04)', 
              borderRadius: '4px',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '6px'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                background: '#1a1a1a',
                opacity: 0.6,
                width: '38%'
              }} />
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '8px', 
              fontFamily: 'var(--font-mono)',
              color: 'rgba(0,0,0,0.3)',
              fontWeight: 500
            }}>
              <span>38% completed</span>
            </div>
          </div>
        </div>
      </HoverTooltip>
    </motion.div>
  );
}
