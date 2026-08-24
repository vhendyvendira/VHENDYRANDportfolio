import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CRITICAL_IMAGES, preloadAllAssets } from '../assets';

const LOG_LINES = [
  "Synchronizing data streams...",
  "Calibrating orbital parameters...",
  "Optimizing cognitive load...",
  "Powering core systems...",
  "All systems operational."
];

export default function LoadingScreen({ onFinished, isReload = false }: { onFinished: () => void, isReload?: boolean }) {
  const [uiProgress, setUiProgress] = useState(0);
  const [assetProgress, setAssetProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);
  const [isReadyToEnter, setIsReadyToEnter] = useState(false);
  const isFinishedCalled = useRef(false);

  // Sync assets
  useEffect(() => {
    preloadAllAssets(CRITICAL_IMAGES, (p) => {
      setAssetProgress(p);
    }).then(() => {
      setAssetsReady(true);
    });
  }, []);

  useEffect(() => {
    const speed = isReload ? 40 : 120;
    const timer = setInterval(() => {
      setUiProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        
        let step;
        if (isReload) {
          step = 12 + Math.random() * 15;
        } else {
          // Technical stuttering progress
          step = prev < 20 ? Math.random() * 5 : 
                 prev < 50 ? Math.random() * 3 : 
                 prev < 85 ? Math.random() * 8 : Math.random() * 12;
        }
        return prev + step;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isReload]);

  // Combined progress for display
  // We show at least the UI progress, but we don't let it finish until assets are ready
  const displayProgress = Math.min(uiProgress, 99); 
  const isComplete = assetsReady && uiProgress >= 100;
  const finalProgress = isComplete ? 100 : displayProgress;

  useEffect(() => {
    if (finalProgress === 100 && !isFinishedCalled.current) {
      if (isReload) {
        isFinishedCalled.current = true;
        setTimeout(onFinished, 100);
      } else {
        setIsReadyToEnter(true);
      }
    }
  }, [finalProgress, onFinished, isReload]);

  useEffect(() => {
    if (isReload) return;
    const lineTimer = setInterval(() => {
      if (finalProgress < 100) {
        setCurrentLine(prev => (prev < LOG_LINES.length - 1 ? prev + 1 : prev));
      } else {
        setCurrentLine(LOG_LINES.length - 1);
      }
    }, 1200);
    return () => clearInterval(lineTimer);
  }, [isReload, finalProgress]);

  const handleEnter = useCallback(() => {
    if (isFinishedCalled.current || !isReadyToEnter) return;
    isFinishedCalled.current = true;
    onFinished();
  }, [onFinished, isReadyToEnter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleEnter();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEnter]);

  if (isReload) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'rgba(26, 26, 26, 0.9)', 
          zIndex: 5000,
          pointerEvents: 'none'
        }}
      >
        <motion.div
          style={{
            height: '100%',
            background: '#ffffff',
            width: `${finalProgress}%`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
          }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#1a1a1a', 
        zIndex: 5000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        overflow: 'hidden',
        pointerEvents: 'auto',
        cursor: 'default'
      }}
    >
      <motion.div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.02), transparent)',
          pointerEvents: 'none',
          zIndex: 1
        }}
        animate={{
          top: ['-10%', '110%']
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div style={{ width: '100%', maxWidth: '340px', position: 'relative', zIndex: 2 }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.5rem'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <span style={{ 
              fontSize: '11px', 
              fontFamily: 'var(--font-mono)', 
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.2em',
              fontWeight: 500,
              textTransform: 'uppercase'
            }}>
              Setting the stage
            </span>
            <div style={{ height: '1px', width: '20px', background: 'rgba(255,255,255,0.1)', margin: '0 auto' }} />
          </motion.div>

          <div style={{ width: '100%' }}>
            <div style={{ 
              width: '100%', 
              height: '2px', 
              background: 'rgba(255,255,255,0.05)',
              position: 'relative',
              borderRadius: '0px',
              overflow: 'hidden'
            }}>
              <motion.div 
                style={{ 
                  position: 'absolute',
                  inset: 0,
                  background: '#ffffff', 
                  originX: 0
                }}
                animate={{ scaleX: finalProgress / 100 }}
                transition={{ type: 'spring', damping: 30, stiffness: 45 }}
              />
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginTop: '1.2rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.05em',
              color: 'rgba(255,255,255,0.4)'
            }}>
              <span>BRINGING DETAILS TOGETHER: {Math.floor(assetProgress * 100)}%</span>
              <span>{Math.floor(finalProgress).toString().padStart(3, '0')}%</span>
            </div>
          </div>

          <div style={{ height: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
            <AnimatePresence mode="wait">
              {!isReadyToEnter ? (
                <motion.div
                  key={currentLine}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ 
                    width: '4px', 
                    height: '4px', 
                    borderRadius: '1px', 
                    background: '#ffffff',
                    boxShadow: '0 0 8px rgba(255,255,255,0.5)' 
                  }} />
                  <p style={{
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    color: 'rgba(255,255,255,0.8)',
                    textAlign: 'center',
                    fontWeight: 500,
                    letterSpacing: '0.02em'
                  }}>
                    {LOG_LINES[currentLine]}
                  </p>
                </motion.div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <motion.button
                    key="enter-button"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEnter}
                    style={{
                      padding: '0.8rem 2rem',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: '#ffffff',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.3em',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      borderRadius: '0px',
                      outline: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 0 20px rgba(255,255,255,0.05)'
                    }}
                  >
                    <motion.div 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'white',
                        opacity: 0.1
                      }}
                      animate={{
                        opacity: [0.05, 0.15, 0.05]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                    ENTER ORBIT
                  </motion.button>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      color: 'rgba(255,255,255,0.35)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase'
                    }}
                  >
                    or press enter
                  </motion.p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 0.5px, transparent 0.5px)', 
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
        PRELOADER // V2.1.0
      </div>
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', fontSize: '10px', color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
        VHENDY.COM | EST. 2026
      </div>
    </motion.div>
  );
}
