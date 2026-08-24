import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { CASE_STUDIES } from './constants';
import { soundService } from './services/soundService';
import { trackVisit } from './services/firebase';
import CaseStudyModal from './components/CaseStudyModal';
import Satellite from './components/Satellite';
import CaseStudyCard from './components/CaseStudyCard';
import AboutView from './components/AboutView';
import PresenceView from './components/PresenceView';
import OrbitalCanvas from './components/OrbitalCanvas';
import SocialFooter from './components/SocialFooter';
import LearningSection from './components/LearningSection';
// import TestimonialSection from './components/TestimonialSection';
import LoadingScreen from './components/LoadingScreen';
import ReportView from './components/ReportView';
import CustomCursor from './components/CustomCursor';
import Magnetic from './components/Magnetic';
import HoverTooltip from './components/HoverTooltip';

/* ================================================
   HOOKS
================================================ */
function parseHash() {
  const hash = window.location.hash.replace(/^#\/?/, "") || "";
  if (hash.startsWith("work/")) {
    return { page: "work" as const, slug: hash.replace("work/", "") };
  }
  if (hash.startsWith("report/")) {
    return { page: "report" as const, slug: hash.replace("report/", "") };
  }
  if (hash === "about") {
    return { page: "about" as const, slug: null };
  }
  if (hash === "presence") {
    return { page: "presence" as const, slug: null };
  }
  return { page: "home" as const, slug: null };
}

function useHashRouter() {
  const [route, setRoute] = useState(() => {
    const initialHash = window.location.hash.replace(/^#\/?/, "");
    // If we have a report link, we allow it to load directly
    if (initialHash.startsWith("report/")) {
      return { page: "report" as const, slug: initialHash.replace("report/", "") };
    }
    // Otherwise, for home/about/presence, we force home state for the entrance experience
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    return { page: "home" as const, slug: null };
  });

  useEffect(() => {
    const handler = () => setRoute(parseHash());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const navigate = useCallback((path: string) => {
    window.location.hash = path === "/" ? "" : path;
  }, []);
  return { route, navigate };
}

function useTypewriter(text: string, active = true, callbacks?: { 
  onStart?: () => void; 
  onChar?: (char: string, index: number) => void; 
  onComplete?: () => void; 
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  // We use refs for callbacks to avoid re-running the effect if callbacks change
  const callbacksRef = useRef(callbacks);
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    if (!active) return;
    
    let timeoutId: number;
    let i = 0;
    let started = false;
    
    setDisplayed("");
    setDone(false);
    setProgress(0);

    const type = () => {
      if (!started) {
        started = true;
        callbacksRef.current?.onStart?.();
      }

      if (i < text.length) {
        const char = text[i];
        callbacksRef.current?.onChar?.(char, i);
        
        // Consistent, premium speed
        let delay = char === " " ? 40 : 35; 
        
        // Slightly longer pause for punctuation to feel natural
        if ([",", "—", ".", "&"].includes(char)) {
          delay = 180;
        }

        i++;
        setDisplayed(text.slice(0, i));
        setProgress(i / text.length);
        
        timeoutId = window.setTimeout(type, delay);
      } else {
        setDone(true);
        setProgress(1);
        callbacksRef.current?.onComplete?.();
      }
    };

    // Initial wait before starting
    const startTimeout = window.setTimeout(type, 800);

    return () => {
      window.clearTimeout(startTimeout);
      window.clearTimeout(timeoutId);
    };
  }, [text, active]);

  return { displayed, done, progress };
}

/* ================================================
   COMPONENTS
================================================ */

export default function App() {
  const { route, navigate } = useHashRouter();

  useEffect(() => {
    trackVisit();
  }, []);

  const handleNavigate = useCallback((path: string) => {
    soundService.play('transition');
    navigate(path);
  }, [navigate]);

  const activeCS = route.page === "work" ? CASE_STUDIES.find(c => c.slug === route.slug) : null;

  const HEADLINE_DATA = { 
    headline: "Hi, I’m Vhendy —\nStartup & Business \n& Enthusiast", 
    subhead: "I don’t just think about products — I build and ship to understand them" 
  };

  const [hasSeenIntro, setHasSeenIntro] = useState(() => {
    return sessionStorage.getItem('hasSeenIntroAnimation') === 'true';
  });

  const [skipIntro, setSkipIntro] = useState(false);

  const [isLoading, setIsLoading] = useState(() => {
    // If we're hitting a direct report link, we might want to skip the main preloader
    // but the requirement says "Only transition to the main page after image loading is complete"
    const hash = window.location.hash.replace(/^#\/?/, "");
    if (hash.startsWith("report/")) return false;

    const hasSeenInSession = sessionStorage.getItem('hasSeenLoadingScreen');
    if (hasSeenInSession === 'true') return false;

    return true;
  });

  const rightPanelRef = useRef<HTMLDivElement>(null);
  const satelliteAnchorRef = useRef<HTMLSpanElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (rightPanelRef.current) {
        const top = rightPanelRef.current.scrollTop;
        setShowScrollTop(top > 300);
        // Persist scroll position for the list view
        if (route.page === 'home' || route.page === 'work') {
          sessionStorage.setItem('portfolioScrollTop', String(top));
        }
      }
    };
    const panel = rightPanelRef.current;
    if (panel) {
      panel.addEventListener('scroll', handleScroll);
      
      // Restore scroll position when returning to the list
      if (!isLoading && (route.page === 'home' || route.page === 'work')) {
        const saved = sessionStorage.getItem('portfolioScrollTop');
        if (saved) {
          panel.scrollTop = parseInt(saved, 10);
        }
      }
    }
    return () => {
      if (panel) panel.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, route.page]);

  const scrollToTop = () => {
    rightPanelRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [listVisible, setListVisible] = useState(false);
  const [subheadVisible, setSubheadVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (listVisible) {
      import('./lib/satelliteEngine').then(({ startSatelliteEngine }) => {
        startSatelliteEngine();
      });
    } else if (satelliteAnchorRef.current) {
      // Set initial "idle" position based on anchor, but don't start engine yet
      const rect = satelliteAnchorRef.current.getBoundingClientRect();
      const scrollY = window.scrollY; // Fixed is relative to viewport, so we use rect directly
      
      import('./lib/satelliteStore').then(({ satelliteStore }) => {
        const sat = satelliteStore.getSatellite('primary-sat');
        if (sat && !sat.isVisible) {
          satelliteStore.updateSatellite('primary-sat', {
            x: rect.left,
            y: rect.top,
            baseX: rect.left,
            baseY: rect.top,
            isVisible: true,
            vx: 0,
            vy: 0
          });
        }
      });
    }
  }, [listVisible]);

  useEffect(() => {
    if (route.page === 'about') sessionStorage.setItem('navSource', 'about');
    if (route.page === 'presence') sessionStorage.setItem('navSource', 'presence');
    if (route.page === 'report') sessionStorage.setItem('navSource', 'report');
    
    if (route.page === 'home') {
      sessionStorage.removeItem('navSource');
    }
  }, [route.page]);

  // 2. Audio Unlock handled by 'Enter Orbit' button in LoadingScreen
  useEffect(() => {
    // If user lands directly on a page without loading screen (reloads)
    // we still need a way to unlock audio on first interaction
    if (isLoading) return;
    
    const handleUnlock = () => {
      if (!hasInteracted) {
        soundService.unlock();
        setHasInteracted(true);
      }
    };

    window.addEventListener('mousedown', handleUnlock);
    window.addEventListener('keydown', handleUnlock);
    window.addEventListener('touchstart', handleUnlock);
    window.addEventListener('wheel', handleUnlock, { passive: true });

    return () => {
      window.removeEventListener('mousedown', handleUnlock);
      window.removeEventListener('keydown', handleUnlock);
      window.removeEventListener('touchstart', handleUnlock);
      window.removeEventListener('wheel', handleUnlock);
    };
  }, [isLoading, hasInteracted]);

  const typewriterCallbacks = useMemo(() => ({
    onChar: (_char: string, _index: number) => {
      // Play for EVERY character to ensure user can hear it during this fix attempt
      soundService.play('typing', { 
        volume: 0.5 + Math.random() * 0.2, 
        rate: 0.8 + Math.random() * 0.4 
      });
    },
    onComplete: () => {
      // Chime plays exactly when the headline is done
      soundService.play('chime', { volume: 0.28 });
    }
  }), []);

  // Logic: Typewriter only for first_visit IF intro not seen yet and not skipped
  // AND the user has interacted to insure audio context is unlocked
  const [canStartTypewriter, setCanStartTypewriter] = useState(false);

  useEffect(() => {
    if (hasInteracted && !isLoading) {
      // Small buffer to ensure the loading screen fade out transition is smooth
      // and audio context is fully ready
      const timer = setTimeout(() => setCanStartTypewriter(true), 300);
      return () => clearTimeout(timer);
    }
  }, [hasInteracted, isLoading]);

  const shouldType = !hasSeenIntro && !skipIntro && canStartTypewriter;

  const { displayed: typedTitle, done: titleDone, progress: titleProgress } = useTypewriter(
    HEADLINE_DATA.headline, 
    !isLoading && shouldType,
    typewriterCallbacks
  );

  // Interaction Skip: scroll, wheel, or key to instantly finish intro
  useEffect(() => {
    if (!shouldType) return;

    const handleInteraction = () => setSkipIntro(true);

    window.addEventListener('wheel', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('wheel', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [shouldType]);

  useEffect(() => {
    if (shouldType) {
      if (titleProgress >= 0.4 && !subheadVisible) setSubheadVisible(true);
      if (titleProgress >= 0.8 && !listVisible) setListVisible(true);
      if (titleDone) {
        sessionStorage.setItem('hasSeenIntroAnimation', 'true');
        setHasSeenIntro(true);
      }
    } else {
      // Instant/Fade-up state: show everything quickly
      setSubheadVisible(true);
      setListVisible(true);
      if (skipIntro) {
        sessionStorage.setItem('hasSeenIntroAnimation', 'true');
        setHasSeenIntro(true);
      }
    }
  }, [titleProgress, titleDone, shouldType, subheadVisible, listVisible, skipIntro]);

  useEffect(() => {
    // Reset visibility states when changing headlines unless it's the returning state
    if (!hasSeenIntro) {
      setListVisible(false);
      setSubheadVisible(false);
    }
  }, [hasSeenIntro]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 850);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* ── Footer ── */
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    let showTimeout: ReturnType<typeof setTimeout> | null = null;
    let rafId: number;

    const handleScrollUpdate = () => {
      // Find the active scroll container
      // On mobile home, the window itself is the scroll container because portfolio-root height is auto
      // But on About/Presence/Report, they have their own scroll containers even on mobile
      const isFixedPage = route.page === 'about' || route.page === 'presence' || route.page === 'report';
      
      const container = (isMobile && !isFixedPage) ? document.documentElement : (
        rightPanelRef.current || 
        document.querySelector('.page-scroll-container') || 
        document.querySelector('.report-view')
      );
      
      if (!container) return;

      let scrollTop, scrollHeight, clientHeight;
      if (isMobile && !isFixedPage) {
        scrollTop = window.scrollY || document.documentElement.scrollTop;
        scrollHeight = document.documentElement.scrollHeight;
        clientHeight = window.innerHeight;
      } else {
        ({ scrollTop, scrollHeight, clientHeight } = container as HTMLElement);
      }

      if (scrollHeight === 0) return;

      // Check if we are at the bottom (with buffer for accuracy) or if content is short
      const isShort = scrollHeight <= clientHeight + 50; // Increased buffer for mobile
      const distanceToBottom = scrollHeight - clientHeight - scrollTop;
      const isAtBottom = distanceToBottom <= 100 || isShort; // More generous buffer for mobile

      if (isAtBottom) {
        if (footerVisible) return;
        
        if (!showTimeout) {
          showTimeout = setTimeout(() => {
            setFooterVisible(true);
            showTimeout = null;
          }, isMobile ? 100 : 1000); // Faster appearance on mobile
        }
      } else {
        if (showTimeout) {
          clearTimeout(showTimeout);
          showTimeout = null;
        }
        if (footerVisible) {
          setFooterVisible(false);
        }
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScrollUpdate);
    };

    /**
     * REQUIREMENT: Consistency across ALL pages
     * Capture phase allows detecting scroll on internal containers.
     */
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);

    // Initial check after layout settles
    const initTimeout = setTimeout(handleScrollUpdate, 300);

    return () => {
      if (showTimeout) clearTimeout(showTimeout);
      clearTimeout(initTimeout);
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [footerVisible, route.page, activeCS, listVisible]);

  /* ── Keyboard Shortcuts ── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if a case study is open and we aren't in a report
      if (!activeCS || route.page !== "work") return;

      if (e.key === 'Escape') {
        navigate("/");
      } else if (e.key === 'ArrowRight') {
        const currentIndex = CASE_STUDIES.findIndex(cs => cs.id === activeCS.id);
        const nextIndex = (currentIndex + 1) % CASE_STUDIES.length;
        navigate(`work/${CASE_STUDIES[nextIndex].slug}`);
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = CASE_STUDIES.findIndex(cs => cs.id === activeCS.id);
        const prevIndex = (currentIndex - 1 + CASE_STUDIES.length) % CASE_STUDIES.length;
        navigate(`work/${CASE_STUDIES[prevIndex].slug}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCS, route.page, navigate]);

  /* ── Home Layout State ── */

  const [cycleIndex, setCycleIndex] = useState(0);

  useEffect(() => {
    // Cycle between 2 statuses every 20 seconds.
    const interval = setInterval(() => {
      setCycleIndex(prev => (prev + 1) % 2);
    }, 20000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-full">
      <CustomCursor />
      <Satellite isHidden={route.page !== 'home'} />

      {(route.page === "about" || route.page === "presence" || route.page === "report") && (
        <button 
          className="about-back-btn" 
          onClick={() => {
            soundService.play('click');
            handleNavigate("/");
          }}
          onMouseEnter={() => soundService.play('hover')}
          style={{ 
            opacity: 1, 
            transform: "none",
            /* Overriding any potential inherited animations if we were using framer motion previously */
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back</span>
        </button>
      )}

      <AnimatePresence>
        {isLoading && (
          <LoadingScreen 
            isReload={false} 
            onFinished={() => {
              sessionStorage.setItem('hasSeenLoadingScreen', 'true');
              soundService.unlock();
              setHasInteracted(true);
              setIsLoading(false);
            }} 
          />
        )}
      </AnimatePresence>

          {route.page === "about" ? (
        <motion.div
          key="about"
          className="page-scroll-container"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "fixed", inset: 0, zIndex: 50, overflowY: "auto" }}
        >
          <AboutView navigate={navigate} />
        </motion.div>
      ) : route.page === "presence" ? (
        <motion.div
          key="presence"
          className="page-scroll-container"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "fixed", inset: 0, zIndex: 50, overflowY: "auto" }}
        >
          <PresenceView navigate={navigate} />
        </motion.div>
      ) : route.page === "report" ? (
        <ReportView cs={CASE_STUDIES.find(c => c.slug === route.slug) || CASE_STUDIES[0]} navigate={navigate} />
      ) : (
        <div className="portfolio-root" style={!!activeCS ? { pointerEvents: "none", userSelect: "none" } : {}}>
          {/* LEFT */}
          <div className="left-panel">
            <div style={{ position: "absolute", inset: 0, opacity: 0.6, pointerEvents: "none" }}>
              <OrbitalCanvas />
            </div>
            <motion.div 
              className="intro-section" 
              style={{ position: "relative", zIndex: 2 }}
              initial={hasSeenIntro ? "visible" : "hidden"}
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.12,
                    delayChildren: 0.3
                  }
                }
              }}
            >
              <motion.div 
                className="status-indicator-wrap"
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  visible: { opacity: 1, x: 0 }
                }}
                initial={hasSeenIntro ? "visible" : "hidden"}
                animate="visible"
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="status-dot-container">
                  <motion.div 
                    className="status-dot-main" 
                    animate={{
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div 
                    className="status-dot-pulse" 
                    animate={{ 
                      scale: [1, 2.8],
                      opacity: [0.5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                </div>
                <div className="status-text-container">
                  <AnimatePresence mode="wait">
                    {cycleIndex === 0 ? (
                      <motion.span
                        key="name"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="status-text status-name"
                      >
                        VHENDY RAND
                      </motion.span>
                    ) : (
                      <motion.span
                        key="status"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="status-text status-available"
                      >
                        AVAILABLE FOR NEXT OPPORTUNITY.
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
              
              <h1 
                className="main-headline"
                onClick={() => { if (shouldType) setSkipIntro(true); }}
              >
                {(() => {
                  const text = HEADLINE_DATA.headline;
                  const vIndex = text.indexOf("Vhendy");
                  const vEnd = vIndex + 6; // length of "Vhendy"
                  
                  if (vIndex === -1) return typedTitle;

                  const before = text.slice(0, vIndex);
                  const vhendy = "Vhendy";
                  const after = text.slice(vEnd);

                  if (shouldType) {
                    return (
                      <div className="relative inline-block">
                        {typedTitle.length <= vIndex ? (
                          typedTitle
                        ) : (
                          <>
                            {before}
                            <motion.span
                              className="vhendy-span"
                              initial={{ opacity: 0.85, filter: "blur(2px)", y: 2 }}
                              animate={titleDone ? { 
                                opacity: 1, 
                                filter: "blur(0px)", 
                                y: 0 
                              } : { 
                                opacity: 0.85, 
                                filter: "blur(2px)", 
                                y: 2 
                              }}
                              transition={{
                                delay: 0.3,
                                duration: 0.5,
                                ease: [0.16, 1, 0.3, 1]
                              }}
                            >
                              {typedTitle.slice(vIndex, Math.min(typedTitle.length, vEnd))}
                            </motion.span>
                            {typedTitle.length > vEnd && typedTitle.slice(vEnd)}
                          </>
                        )}
                        <span className={`type-cursor ${titleDone ? 'done' : 'blinking'}`} />
                      </div>
                    );
                  }

                  // Non-typing state (instant display)
                  return (
                    <div className="relative inline-block">
                      {before}
                      <span className="vhendy-span">{vhendy}</span>
                      {after}
                    </div>
                  );
                })()}
              </h1>

              <AnimatePresence>
                {subheadVisible && (
                  <motion.p 
                    className="main-subheadline"
                    initial={hasSeenIntro ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {HEADLINE_DATA.subhead}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="navigation-section">
              <nav className="nav-container">
                {[
                  { label: "Selected Work", path: "home" },
                  { label: "About Story", path: "about" },
                  { label: "Public Presence", path: "presence" },
                  { label: "Labs", path: "lab", isComingSoon: true }
                ].map((item, i) => {
                  const isActive = !item.isComingSoon && (
                    (route.page === item.path) || 
                    (route.page === "work" && item.path === "home") || 
                    (route.page === "home" && item.path === "home")
                  );
                  
                  const buttonContent = (
                    <motion.button
                      className={`nav-item${isActive ? " active" : ""}`}
                      onClick={() => {
                        if (item.isComingSoon) return;
                        soundService.play('click');
                        handleNavigate(item.path === "home" ? "/" : `/${item.path}`);
                      }}
                      onMouseEnter={() => {
                        if (!item.isComingSoon) soundService.play('hover');
                      }}
                      disabled={item.isComingSoon}
                      initial={hasSeenIntro ? false : { opacity: 0, x: -8 }}
                      animate={subheadVisible ? { opacity: 1, x: 0 } : (hasSeenIntro ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 })}
                      transition={{ 
                        duration: 0.5, 
                        delay: (subheadVisible && !hasSeenIntro) ? 0.3 + (i * 0.1) : 0,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      style={{
                        opacity: item.isComingSoon ? 0.35 : 1,
                        cursor: item.isComingSoon ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem"
                      }}
                    >
                      <span>{item.label}</span>
                      {item.isComingSoon && (
                        <span style={{ 
                          fontSize: "8px", 
                          letterSpacing: "0.12em", 
                          color: "rgba(0,0,0,0.25)", 
                          fontWeight: 500,
                          textTransform: "uppercase"
                        }}>
                          COMING SOON
                        </span>
                      )}
                    </motion.button>
                  );

                  return (
                    <Magnetic key={item.label} strength={item.isComingSoon ? 0 : 0.1}>
                      {item.isComingSoon ? (
                        <HoverTooltip text="Currently in progress" isMobile={isMobile}>
                          {buttonContent}
                        </HoverTooltip>
                      ) : buttonContent}
                    </Magnetic>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-panel" ref={rightPanelRef}>
            <div style={{ width: "100%" }}>
              
              {/* Header Animates separately */}
              <motion.div 
                style={{ 
                  display: "flex",
                  justifyContent: "space-between", 
                  alignItems: "baseline", 
                  paddingBottom: "3rem", 
                  borderBottom: "1px solid rgba(0, 0, 0, 0.05)"
                }}
                initial={hasSeenIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                animate={listVisible ? { opacity: 1, y: 0 } : (hasSeenIntro ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 })}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span ref={satelliteAnchorRef} style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(0,0,0,0.4)", fontFamily: "var(--font-mono)", fontWeight: 500 }}>MISSION LAUNCHED </span>
                <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.3)", fontFamily: "var(--font-mono)" }}>0{CASE_STUDIES.length} // OPS</span>
              </motion.div>
              {CASE_STUDIES.map((cs, i) => (
                <CaseStudyCard key={cs.id} cs={cs} index={i} navigate={handleNavigate} visible={listVisible} hasSeenIntro={hasSeenIntro} />
              ))}

              <LearningSection visible={listVisible} hasSeenIntro={hasSeenIntro} />
              {/* <TestimonialSection visible={listVisible} hasSeenIntro={hasSeenIntro} /> */}
            </div>

            {/* Scroll to Top Button */}
            <button
              onClick={() => {
                soundService.play('click');
                scrollToTop();
              }}
              onMouseEnter={(e) => {
                soundService.play('hover');
                e.currentTarget.style.background = "#4361ee";
              }}
              onMouseLeave={(e) => e.currentTarget.style.background = "#1a1a1a"}
              style={{
                position: "fixed",
                bottom: "5.5rem", // Moved up to avoid overlap with social icons
                right: "2.1rem",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#1a1a1a",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "none",
                opacity: showScrollTop ? 1 : 0,
                transform: showScrollTop ? "translateY(0)" : "translateY(10px)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                pointerEvents: showScrollTop ? "auto" : "none",
                zIndex: 100,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
              }}
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {activeCS && route.page !== "about" && (
          <CaseStudyModal cs={activeCS} onClose={() => navigate("/")} navigate={navigate} />
        )}
      </AnimatePresence>

      {route.page === "work" && !activeCS && (
        <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", background: "rgba(245,244,242,0.95)", zIndex: 200 }}>
          <p style={{ fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "24px", color: "#1a1a1a" }}>Case study not found.</p>
          <button onClick={() => navigate("/")} style={{ fontSize: "13px", color: "rgba(0,0,0,0.45)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>← Back to home</button>
        </div>
      )}

      {!isMobile && route.page !== "about" && route.page !== "presence" && (
        <div className={`year-footer ${route.page !== '/' && route.page !== 'home' && route.page !== 'work' ? 'full-width' : ''} ${isMobile ? 'is-mobile' : ''}`}>© 2026</div>
      )}
      <SocialFooter 
        visible={footerVisible} 
        fullWidth={route.page !== '/' && route.page !== 'home' && route.page !== 'work'} 
        isMobile={isMobile}
        footerYear={(route.page === "about" || route.page === "presence" || isMobile) ? "© 2026" : undefined}
      />
    </div>
  );
}
