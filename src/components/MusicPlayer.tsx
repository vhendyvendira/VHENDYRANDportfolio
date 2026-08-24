import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import HoverTooltip from './HoverTooltip';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [isMobile, setIsMobile] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Decorative progress simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => (p + 0.05) % 100);
    }, 150); // Slower progress
    return () => clearInterval(interval);
  }, [isPlaying]);

  const bars = Array.from({ length: 12 }, (_, i) => i);

  const TRACK_LINK = "https://youtu.be/RcQHfk85jag?si=uLNs_mu7UY4FD79s";

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
    window.open(TRACK_LINK, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
      animate={{ 
        opacity: isHovered ? 0.95 : 0.4, 
        scale: isHovered ? 0.88 : 0.85, 
        rotate: isHovered ? -1 : -2.5 
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.open(TRACK_LINK, '_blank')}
      style={{
        position: 'absolute',
        right: isMobile ? '2rem' : 'clamp(1rem, 5vw, 4rem)',
        top: isMobile ? '5rem' : '15rem',
        zIndex: 10,
        pointerEvents: 'auto',
        transformOrigin: 'top right',
        cursor: 'pointer'
      }}
    >
      <HoverTooltip text="listen on repeat" isMobile={isMobile}>
        <div style={{
          background: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.03)',
          borderRadius: '16px',
          padding: '12px',
          width: '190px',
          boxShadow: isHovered ? '0 15px 35px rgba(0, 0, 0, 0.06)' : '0 8px 20px rgba(0, 0, 0, 0.02)',
          position: 'relative',
          transition: 'all 0.6s ease'
        }}>
          {/* Subtle "Pin" Decoration */}
          <div style={{
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '20px',
            height: '12px',
            background: 'rgba(0,0,0,0.05)',
            borderRadius: '4px',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }} />

          {/* Top Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ 
              width: '38px', 
              height: '38px', 
              background: 'rgba(0,0,0,0.03)', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
                {[0, 1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: isPlaying ? [3, 12, 6, 14, 3] : 3 }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.6 + i * 0.15,
                      ease: "easeInOut"
                    }}
                    style={{ width: '2.5px', background: '#4361ee', borderRadius: '10px' }}
                  />
                ))}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: 600, 
                color: '#1a1a1a',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textDecoration: isHovered ? 'underline' : 'none'
              }}>One Piece Lofi Mix</div>
              <div style={{ 
                fontSize: '10px', 
                color: 'rgba(0,0,0,0.4)', 
                fontWeight: 500,
                fontFamily: 'var(--font-mono)' 
              }}>Barely Cloudy</div>
            </div>
          </div>

          {/* Visualizer Spectrum (Minimal) */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'space-between', 
            height: '16px', 
            gap: '2px',
            marginBottom: '14px'
          }}>
            {bars.map(i => (
              <motion.div
                key={i}
                animate={{ 
                  height: isPlaying ? (Math.random() * 60 + 40) + '%' : '20%',
                  opacity: isPlaying ? 0.6 : 0.2
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.4 + (i % 3) * 0.1,
                  ease: "linear"
                }}
                style={{ 
                  flex: 1, 
                  background: isPlaying ? '#4361ee' : 'rgba(0,0,0,0.05)', 
                  borderRadius: '1px' 
                }}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ 
              height: '3px', 
              background: 'rgba(0,0,0,0.04)', 
              borderRadius: '4px',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '6px'
            }}>
              <motion.div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  background: 'rgba(0,0,0,0.1)',
                  width: progress + '%'
                }}
              />
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              fontSize: '8px', 
              fontFamily: 'var(--font-mono)',
              color: 'rgba(0,0,0,0.3)',
              fontWeight: 500
            }}>
              <span>1:12</span>
              <span>3:24</span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px' }}>
            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(0,0,0,0.2)', padding: '2px' }}>
              <SkipBack size={14} fill="currentColor" stroke="none" />
            </button>
            <button 
              onClick={togglePlay}
              style={{ 
                background: '#fff', 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#1a1a1a',
                boxShadow: '0 3px 8px rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.04)',
                transition: 'transform 0.15s ease'
              }}
            >
              {isPlaying ? <Pause size={14} fill="currentColor" stroke="none" /> : <Play size={14} fill="currentColor" stroke="none" style={{ marginLeft: '1px' }} />}
            </button>
            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(0,0,0,0.2)', padding: '2px' }}>
              <SkipForward size={14} fill="currentColor" stroke="none" />
            </button>
          </div>
        </div>
      </HoverTooltip>

      {/* Floating Meta */}
      <div style={{ 
        marginTop: '8px', 
        textAlign: 'right', 
        fontSize: '8px', 
        fontFamily: 'var(--font-mono)', 
        color: 'rgba(0,0,0,0.25)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        pointerEvents: 'none'
      }}>
        Analog Soul
      </div>
    </motion.div>
  );
}
