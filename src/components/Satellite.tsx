import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, FastForward } from 'lucide-react';
import { satelliteStore, SatelliteData, SatelliteStoreState } from '../lib/satelliteStore';

interface SatelliteProps {
  isHidden?: boolean;
}

const SatelliteInstance: React.FC<{ 
  sat: SatelliteData, 
  isHidden: boolean 
}> = ({ sat, isHidden }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracted, setIsInteracted] = useState(false);

  useEffect(() => {
    if (isInteracted) {
      const timer = setTimeout(() => setIsInteracted(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isInteracted]);

  const handleInteraction = () => {
    setIsInteracted(true);
  };

  const getSpeedLabel = () => {
    if (sat.speedMultiplier === 0.5) return '0.5x';
    if (sat.speedMultiplier === 2) return '2x';
    return '1x';
  };

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    let next;
    if (sat.speedMultiplier === 1) next = 2;
    else if (sat.speedMultiplier === 2) next = 0.5;
    else next = 1;
    satelliteStore.updateSatellite(sat.id, { speedMultiplier: next });
  };

  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    satelliteStore.updateSatellite(sat.id, { isPaused: !sat.isPaused });
  };

  const handleDragStart = () => {
    setIsInteracted(true);
    satelliteStore.updateSatellite(sat.id, { isDragging: true });
  };

  const handleDragEnd = (_: any, info: any) => {
    satelliteStore.updateSatellite(sat.id, { 
      isDragging: false, 
      baseX: sat.baseX + info.offset.x,
      baseY: sat.baseY + info.offset.y,
      x: sat.x + info.offset.x,
      y: sat.y + info.offset.y
    });
  };

  const handleDrag = (_: any, info: any) => {
    satelliteStore.updateSatellite(sat.id, {
      x: sat.x + info.delta.x,
      y: sat.y + info.delta.y,
      baseX: sat.baseX + info.delta.x,
      baseY: sat.baseY + info.delta.y
    });
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrag={handleDrag}
      onClick={handleInteraction}
      initial={false}
      animate={{
        opacity: isHidden ? 0 : (isHovered || isInteracted || sat.isDragging ? 1 : 0.5),
        scale: isInteracted || isHovered ? 1.05 : 1,
        filter: isHovered || isInteracted || sat.isDragging 
          ? 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.2))' 
          : 'drop-shadow(0 0 4px rgba(167, 139, 250, 0.05))'
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut"
      }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: sat.x,
        y: sat.y,
        zIndex: 9999,
        cursor: 'grab',
        pointerEvents: isHidden ? 'none' : 'auto',
        visibility: isHidden ? 'hidden' : 'visible',
      }}
      whileDrag={{ cursor: 'grabbing', scale: 1.1 }}
    >
      <div style={{ position: 'relative' }}>
        {/* Trails */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: sat.isPaused ? 0 : [0, 0.2, 0],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                width: '3px',
                height: '3px',
                background: 'rgba(167, 139, 250, 0.3)',
                borderRadius: '50%',
                left: `${-18 - (i * 10)}px`,
                top: '0px',
                filter: 'blur(2px)'
              }}
            />
          ))}
        </div>

        {/* Satellite Visual Group */}
        <motion.div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            y: [0, -2, 0],
            rotate: [0, 0.5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ position: 'relative' }}
        >
          {/* Main Satellite Visual */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '3px',
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.05))'
          }}>
            {/* Left Solar Panel */}
            <motion.div 
              animate={{ 
                opacity: [0.8, 1, 0.8],
                skewY: sat.isPaused ? 0 : [0, 2, 0, -2, 0] 
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{ 
                width: '10px', 
                height: '14px', 
                background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))', 
                borderRadius: '1.5px', 
                border: '0.5px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(2px)'
              }} 
            />

            {/* Central Body */}
            <div style={{ 
              width: '16px', 
              height: '16px', 
              background: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '5px', 
              border: '0.5px solid rgba(0, 0, 0, 0.05)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 -1px 2px rgba(0,0,0,0.05)'
            }}>
              {/* Single Refined Lens / Sensor */}
              <div style={{ 
                width: '4px', 
                height: '4px', 
                background: '#1f2937', 
                borderRadius: '50%',
                opacity: 0.8,
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '1px',
                  left: '1px',
                  width: '1px',
                  height: '1px',
                  background: 'white',
                  borderRadius: '50%',
                  opacity: 0.6
                }} />
              </div>

              {/* Status Indicator (Purely decorative/premium glow) */}
              <motion.div 
                animate={{ 
                  opacity: sat.isPaused ? 0.3 : [0.4, 0.8, 0.4],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ 
                  position: 'absolute', 
                  bottom: '2px', 
                  right: '2px', 
                  width: '2px', 
                  height: '2px', 
                  background: 'rgba(167, 139, 250, 0.8)', 
                  borderRadius: '50%',
                  boxShadow: '0 0 4px rgba(167, 139, 250, 0.6)'
                }} 
              />
              
              {/* Top Antenna */}
              <motion.div 
                animate={{ rotate: sat.isPaused ? 0 : [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{ 
                  position: 'absolute', 
                  top: '-6px', 
                  width: '0.5px', 
                  height: '8px', 
                  background: 'rgba(0,0,0,0.2)',
                  transformOrigin: 'bottom'
                }}
              />
            </div>

            {/* Right Solar Panel */}
            <motion.div 
              animate={{ 
                opacity: [0.8, 1, 0.8],
                skewY: sat.isPaused ? 0 : [0, -2, 0, 2, 0] 
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{ 
                width: '10px', 
                height: '14px', 
                background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9))', 
                borderRadius: '1.5px', 
                border: '0.5px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(2px)'
              }} 
            />
          </div>


          {/* Hover Controls & Label */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 5, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: 5, x: '-50%' }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  marginTop: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  pointerEvents: 'auto'
                }}
              >
                {/* Control Panel */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '4px',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: '0.5px solid rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(4px)'
                }}>
                  <button 
                    onClick={togglePause}
                    style={{ 
                      padding: '4px', 
                      borderRadius: '4px', 
                      display: 'flex', 
                      background: 'none', 
                      cursor: 'pointer',
                      border: 'none',
                      color: 'rgba(0,0,0,0.6)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    {sat.isPaused ? <Play size={10} fill="currentColor" /> : <Pause size={10} fill="currentColor" />}
                  </button>
                  <div style={{ width: '1px', height: '10px', background: 'rgba(0,0,0,0.1)' }} />
                  <button 
                    onClick={cycleSpeed}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '2px', 
                      padding: '2px 4px', 
                      borderRadius: '4px', 
                      fontSize: '8px', 
                      fontFamily: 'var(--font-mono)',
                      background: 'none',
                      cursor: 'pointer',
                      border: 'none',
                      color: 'rgba(0,0,0,0.6)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <FastForward size={8} />
                    {getSpeedLabel()}
                  </button>
                </div>
                
                {/* Identification Label */}
                <span style={{
                  fontSize: '7px',
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(0,0,0,0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  PAL-SAT-{sat.id.toUpperCase()}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Satellite: React.FC<SatelliteProps> = ({ isHidden = false }) => {
  const [storeState, setStoreState] = useState<SatelliteStoreState>(satelliteStore.get());

  useEffect(() => {
    return satelliteStore.subscribe((newState) => {
      setStoreState(newState);
    });
  }, []);

  return (
    <>
      {storeState.satellites.map(sat => (
        <SatelliteInstance key={sat.id} sat={sat} isHidden={isHidden} />
      ))}
    </>
  );
};

export default Satellite;
