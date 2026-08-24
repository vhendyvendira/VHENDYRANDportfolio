import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';
import HoverTooltip from './HoverTooltip';

export default function RunningActivity() {
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
      initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
      animate={{ 
        opacity: isHovered ? 0.95 : 0.4, 
        scale: isHovered ? 0.88 : 0.85, 
        rotate: isHovered ? 2 : 1 
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        right: isMobile ? '1.5rem' : 'clamp(1rem, 6vw, 5rem)',
        top: isMobile ? '28rem' : '48rem',
        zIndex: 5,
        pointerEvents: 'auto',
        transformOrigin: 'top right'
      }}
    >
      <HoverTooltip text="clearing my head" isMobile={isMobile}>
        <div style={{
          background: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.03)',
          borderRadius: '16px',
          padding: '12px',
          width: '170px',
          boxShadow: isHovered ? '0 15px 35px rgba(0, 0, 0, 0.05)' : '0 8px 20px rgba(0, 0, 0, 0.02)',
          position: 'relative',
          transition: 'all 0.6s ease'
        }}>
          {/* Pinned Tape Decoration */}
          <div style={{
            position: 'absolute',
            top: '-6px',
            right: '20px',
            width: '40px',
            height: '14px',
            background: 'rgba(252, 76, 2, 0.05)',
            border: '1px solid rgba(252, 76, 2, 0.05)',
            borderRadius: '2px',
            transform: 'rotate(2deg)'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              background: 'rgba(252, 76, 2, 0.1)', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fc4c02'
            }}>
              <Activity size={14} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#1a1a1a' }}>Evening Run</div>
              <div style={{ fontSize: '9px', color: 'rgba(0,0,0,0.3)', fontFamily: 'var(--font-mono)' }}>Yesterday</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '8px', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Distance</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', fontFamily: 'var(--font-mono)' }}>5.24 <span style={{ fontSize: '9px', fontWeight: 400 }}>km</span></div>
            </div>
            <div>
              <div style={{ fontSize: '8px', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pace</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a', fontFamily: 'var(--font-mono)' }}>5'42"</div>
            </div>
          </div>

          <div style={{ height: '30px', position: 'relative', marginBottom: '12px', opacity: 0.4 }}>
             <svg width="100%" height="100%" viewBox="0 0 100 30" fill="none" preserveAspectRatio="none">
               <motion.path
                 d="M0 25 L15 18 L25 22 L40 10 L55 20 L70 5 L85 15 L100 12"
                 stroke="#fc4c02"
                 strokeWidth="2"
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 2, delay: 1.5 }}
               />
             </svg>
          </div>

          <div style={{ 
            fontSize: '9px', 
            color: 'rgba(0,0,0,0.4)', 
            display: 'flex', 
            justifyContent: 'space-between',
            borderTop: '0.5px solid rgba(0,0,0,0.05)',
            paddingTop: '10px'
          }}>
            <span>3 runs this week</span>
            <span style={{ fontWeight: 600, color: '#fc4c02' }}>+12%</span>
          </div>
        </div>
      </HoverTooltip>
    </motion.div>
  );
}
