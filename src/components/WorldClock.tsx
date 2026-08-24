import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import HoverTooltip from './HoverTooltip';

export default function WorldClock() {
  const [now, setNow] = useState(new Date());
  const [visitorCity, setVisitorCity] = useState('somewhere');
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    // Detect visitor context
    const detectContext = async () => {
      // Mapping function for Indonesian regions to islands
      const mapToIsland = (region: string, city: string, country: string): string => {
        if (country !== 'ID' && country !== 'Indonesia') return region || city;
        
        const target = (region || city || '').toLowerCase();
        
        if (/jakarta|banten|jawa barat|west java|jawa tengah|central java|jawa timur|east java|yogyakarta/.test(target)) return 'Java';
        if (/aceh|sumatera|sumatra|riau|jambi|bengkulu|lampung|bangka belitung/.test(target)) return 'Sumatra';
        if (/kalimantan|borneo/.test(target)) return 'Kalimantan';
        if (/sulawesi|gorontalo|makassar|manado|palu|kendari/.test(target)) return 'Sulawesi';
        if (/bali/.test(target)) return 'Bali';
        if (/nusa tenggara|lombok|flores|timor/.test(target)) return 'Nusa Tenggara';
        if (/maluku/.test(target)) return 'Maluku';
        if (/papua/.test(target)) return 'Papua';
        
        return region || city;
      };

      try {
        // Try IP-based detection first for better precision
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            const displayLocation = mapToIsland(data.region || '', data.city || '', data.country_code || data.country_name || '');
            if (displayLocation) {
              setVisitorCity(displayLocation);
              return;
            }
          }
        }
      } catch (e) {
        console.warn("IP-based geolocation failed, falling back to timezone", e);
      }

      // Fallback: Use timezone from browser
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz) {
          const parts = tz.split('/');
          const cityPart = parts[parts.length - 1];
          const formattedCity = cityPart.replace(/_/g, ' ');
          setVisitorCity(formattedCity);
        }
      } catch (e) {
        console.warn("Could not detect timezone", e);
        setVisitorCity('your location');
      }
    };

    detectContext();

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearInterval(timer);
    };
  }, []);

  const renderTime = (date: Date, offset?: number, isLight = false) => {
    let targetDate = date;
    if (offset !== undefined) {
      const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
      targetDate = new Date(utc + (3600000 * offset));
    }
    
    const timeStr = targetDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    const [time, ampm] = timeStr.split(' ');
    
    return (
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '3px' }}>
        <span>{time}</span>
        <span style={{ 
          fontSize: '0.7em', 
          opacity: isLight ? 0.4 : 0.5, 
          fontWeight: 500,
          letterSpacing: '0.02em'
        }}>
          {ampm}
        </span>
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
      animate={{ 
        opacity: isHovered ? 0.95 : 0.6, 
        scale: isHovered ? 0.9 : 0.85, 
        rotate: isHovered ? 0 : 2.5 
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: isMobile ? '1rem' : 'clamp(1rem, 5vw, 4rem)',
        top: isMobile ? '12rem' : '22rem',
        zIndex: 10,
        pointerEvents: 'auto',
        transformOrigin: 'top left'
      }}
    >
      <HoverTooltip text="my timezone" isMobile={isMobile}>
        <div style={{
          background: isHovered ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          borderRadius: '20px',
          padding: '20px',
          width: '240px',
          boxShadow: isHovered ? '0 20px 40px rgba(0, 0, 0, 0.08)' : '0 10px 25px rgba(0, 0, 0, 0.03)',
          position: 'relative',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Header Context */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ 
              fontSize: '11px', 
              color: 'rgba(0,0,0,0.45)', 
              lineHeight: 1.5,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              Thanks for visiting from <MapPin size={10} style={{ color: '#4361ee' }} /> <span style={{ color: '#4361ee', fontWeight: 600 }}>{visitorCity}</span> — {renderTime(now)}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ 
                fontSize: '10px', 
                fontFamily: 'var(--font-mono)', 
                color: 'rgba(0,0,0,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Jakarta (GMT+7)</div>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: 600, 
                color: '#1a1a1a',
                fontFamily: 'var(--font-mono)'
              }}>{renderTime(now, 7)}</div>
            </div>

            <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', width: '100%' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ 
                fontSize: '10px', 
                fontFamily: 'var(--font-mono)', 
                color: 'rgba(0,0,0,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Manado (GMT+8)</div>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: 500, 
                color: 'rgba(0,0,0,0.6)',
                fontFamily: 'var(--font-mono)'
              }}>{renderTime(now, 8, true)}</div>
            </div>
          </div>
        </div>
      </HoverTooltip>
    </motion.div>
  );
}
