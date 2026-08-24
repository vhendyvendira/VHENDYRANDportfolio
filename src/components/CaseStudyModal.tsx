import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Activity, Award, ShoppingBag, RefreshCw, Zap, Users, Target, CheckCircle2, TrendingUp, Cpu, Layout, BarChart3, Coins, Store, Clapperboard, Megaphone } from 'lucide-react';
import { CaseStudy } from '../types';
import ProgressiveImage from './ProgressiveImage';
import GothamChallengeMotion from './GothamChallengeMotion';
import { soundService } from '../services/soundService';

interface CaseStudyModalProps {
  cs: CaseStudy;
  onClose: () => void;
  navigate: (path: string) => void;
}

export default function CaseStudyModal({ cs, onClose, navigate }: CaseStudyModalProps) {
  const [ctaHov, setCtaHov] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [activeLoopStep, setActiveLoopStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const outcomeRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Cinematic Hero transforms
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 0.8, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.2]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 40]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { 
      if (e.key === "Escape") {
        if (lightboxImg) {
          setLightboxImg(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    soundService.play('transition');
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose, lightboxImg]);

  // Calculate mask progress
  const maskString = (scrolledToBottom && ctaHov)
    ? "linear-gradient(to bottom, transparent, black 150px, black 100%)"
    : "linear-gradient(to bottom, transparent, black 150px, black calc(100% - 150px), transparent)";

  const renderText = (text: string) => {
    if (!text) return null;
    // Split by both **bold** and ==highlight==
    const parts = text.split(/(\*\*.*?\*\*|==.*?==)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const content = part.slice(2, -2);
        return (
          <span 
            key={i} 
            style={{ 
              fontWeight: 600,
              color: "#1a1a1a",
              display: "inline",
            }}
          >
            {content}
          </span>
        );
      }
      if (part.startsWith('==') && part.endsWith('==')) {
        const content = part.slice(2, -2);
        return (
          <span 
            key={i} 
            style={{ 
              background: "rgba(255, 235, 59, 0.25)", // Soft yellow
              padding: "0 2px",
              borderRadius: "2px",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
              color: "#1a1a1a",
              fontWeight: "inherit"
            }}
          >
            {content}
          </span>
        );
      }
      return part;
    });
  };

  const renderSection = (label: string, content: string | undefined) => {
    if (!content) return null;
    const isSpecial = label === "OPPORTUNITY" && cs.slug === "metago-coin";
    const isMetaGo = cs.slug === "metago-coin";
    
    return (
      <motion.div 
        className="modal-section"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div 
          className={`modal-section-label ${isSpecial ? 'is-special' : ''}`}
          style={{ 
            color: isMetaGo ? "#8b5cf6" : (isSpecial ? "#4361ee" : "rgba(0,0,0,0.4)"), 
            fontWeight: (isMetaGo || isSpecial) ? 700 : 600
          }}
        >
          {label}
        </div>
        <p className="modal-body-text">
          {renderText(content)}
        </p>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="modal-backdrop"
      role="dialog" aria-modal="true" aria-label={cs.title}
      onClick={e => { 
        if (e.target === e.currentTarget) {
          soundService.play('click');
          onClose(); 
        }
      }}
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ background: "rgba(0, 0, 0, 0.15)" }} // Slightly darker for smoother blend
    >
      <motion.div 
        ref={containerRef}
        className="modal-panel"
        onScroll={(e: React.UIEvent<HTMLDivElement>) => {
          const target = e.currentTarget;
          const isBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 20;
          setScrolledToBottom(isBottom);
        }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.5 }}
        style={{
          maskImage: maskString,
          WebkitMaskImage: maskString,
          transition: "mask-image 0.4s ease, -webkit-mask-image 0.4s ease"
        }}
      >
        {/* Progress Bar */}
        <motion.div
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "#4361ee",
            transformOrigin: "0%",
            zIndex: 100,
            scaleX
          }}
        />

        {/* Close Button UI fixed at top */}
        <button 
          className="modal-close-btn" 
          onClick={() => {
            soundService.play('click');
            onClose();
          }} 
          onMouseEnter={() => soundService.play('hover')}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Hero image or Video with inner zoom effect */}
        <div className="modal-hero-wrap">
          {cs.videoUrl ? (
            <iframe
              width="100%"
              height="100%"
              src={cs.videoUrl}
              title={`${cs.title} Video`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0 }}
            />
          ) : (
            <motion.div
              style={{ 
                width: "100%", 
                height: "100%", 
                opacity: heroOpacity, 
                scale: heroScale,
                y: heroY
              }}
            >
              <ProgressiveImage 
                src={cs.image} 
                alt={cs.title} 
              />
            </motion.div>
          )}
        </div>

        <div className="modal-body">
          <motion.div 
            className="modal-intro-meta"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span 
              className="modal-index"
              style={cs.slug === "metago-coin" ? { color: "#8b5cf6" } : {}}
            >
              {cs.index}
            </span>
            <div className="modal-meta-divider" />
            <span className="modal-year-small">{cs.year}</span>
          </motion.div>

          <motion.h2 
            className="modal-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {cs.title}
          </motion.h2>

          {/* Tags */}
          <motion.div 
            className="modal-tags"
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {cs.tags.map(t => (
              <span key={t} className="modal-tag">{t}</span>
            ))}
          </motion.div>

          {/* Meta Grid - Staggered items */}
          <div className="modal-meta-grid">
            {([
              ["YEAR", cs.year],
              ["ROLE", cs.role],
              ["DURATION", cs.duration],
              ["EVENT", cs.event],
              ["TEAM", cs.team],
              ["TOOLS", cs.tools.join(" · ")],
              ["PROJECT TYPE", cs.projectType]
            ] as [string, string][]).map(([k, v], idx) => (
              <motion.div 
                key={k}
                className="modal-meta-item"
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + (idx * 0.05), duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="modal-meta-label">{k}</div>
                <div className="modal-meta-value">{v}</div>
              </motion.div>
            ))}
          </div>

          {/* Body Text with Drawing Divider */}
          <div className="modal-content-wrap">
            <motion.div 
              className="modal-content-divider"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.45, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
            
            {/* Conditional Rendering for Sections based on slug and available keys */}
            <div className="modal-sections-container">
              {/* Context is always first */}
              <motion.div 
                className="modal-section"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div 
                  className="modal-section-label"
                  style={{ 
                    color: "rgba(0,0,0,0.4)", 
                    fontWeight: 600
                  }}
                >
                  {cs.slug === "metago-coin" ? "THE PROBLEM WE'RE SOLVING" : "CONTEXT"}
                </div>
                <p className="modal-body-text">
                  {renderText(cs.context)}
                </p>

                {/* Gotham Market Exposure Stats */}
                {cs.slug === "gotham-risk-intelligence" && (
                  <div 
                    className="modal-grid-3"
                    style={{ 
                      marginTop: "1.5rem",
                      padding: "clamp(1rem, 3vw, 1.5rem)",
                      background: "rgba(0,0,0,0.02)",
                      borderRadius: "12px",
                      border: "1px solid rgba(0,0,0,0.05)"
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div className="modal-stat-label">ANNUAL LOSS</div>
                      <div className="modal-stat-value" style={{ color: "#1a1a1a", fontFamily: "var(--font-mono)" }}>RP10–15T</div>
                    </div>
                    <div style={{ textAlign: "center", borderLeft: "1px solid rgba(0,0,0,0.1)", borderRight: "1px solid rgba(0,0,0,0.1)" }}>
                      <div className="modal-stat-label">NEW VICTIMS / YR</div>
                      <div className="modal-stat-value" style={{ color: "#1a1a1a", fontFamily: "var(--font-mono)" }}>0.8–1.2M</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div className="modal-stat-label">AVG. INFLOW / PAX</div>
                      <div className="modal-stat-value" style={{ color: "#1a1a1a", fontFamily: "var(--font-mono)" }}>RP10–25M</div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Order and Labels for specific projects */}
              {cs.slug === "k-shop" ? (
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "clamp(3rem, 8vw, 5rem)",
                  padding: "0 0 2rem"
                }}>
                  {/* The Problems */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="modal-section"
                  >
                    <h2 className="modal-section-title">The problems we wanted to solve</h2>
                    <div style={{ display: "grid", gap: "20px" }}>
                      {[
                        { title: "The lonely shopper", color: "#378ADD", desc: "E-commerce had stripped shopping of its social context. Discovery happened on Instagram, but transactions happened in isolated marketplace experiences." },
                        { title: "Conversion friction", color: "#1D9E75", desc: "The \"link in bio\" flow killed impulse purchases. Every click between inspiration and checkout meant losing 60%+ of potential buyers." },
                        { title: "Trust gap", color: "#D85A30", desc: "Anonymous marketplace reviews felt sketchy. Users trusted recommendations from friends and creators they followed—not 5-star ratings from strangers." }
                      ].map(p => (
                        <div key={p.title} style={{ 
                          background: "#ffffff", 
                          border: "1px solid rgba(0,0,0,0.04)", 
                          borderRadius: "16px", 
                          padding: "1.5rem", 
                          borderLeft: `3px solid ${p.color}`,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                        }}>
                          <div className="modal-h3" style={{ fontSize: "16px", marginBottom: "6px" }}>{p.title}</div>
                          <div className="modal-body-small" style={{ fontSize: "14px", color: "rgba(0,0,0,0.6)" }}>{p.desc}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* The Real Challenge */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="modal-section"
                  >
                    <h2 className="modal-section-title">The real challenge wasn't design</h2>
                    <p className="modal-body-text" style={{ color: "#1a1a1a", marginBottom: "1.5rem" }}>
                      It was defining the right boundaries between **ambition and execution capacity**.
                    </p>
                    <div style={{ 
                      background: "rgba(0,0,0,0.02)", 
                      borderRadius: "20px", 
                      padding: "2rem", 
                      border: "1px solid rgba(0,0,0,0.03)",
                      position: "relative"
                    }}>
                      <p style={{ 
                        fontSize: "16px", 
                        lineHeight: 1.8, 
                        color: "#1a1a1a", 
                        margin: 0, 
                        fontStyle: "italic"
                      }}>
                        "I led product definition with a big vision: social feeds, creator profile, community features, and full e-commerce—all at once. In reality, I had junior engineers, limited runway, and lack-of experience. The trade-off I kept facing: how big is enough to convince users, but small enough to actually ship?"
                      </p>
                    </div>
                    <p style={{ fontSize: "15px", fontWeight: 500, color: "rgba(0,0,0,0.4)", marginTop: "1.25rem", textAlign: "left" }}>
                      Honestly—I failed to answer that question well in the first iteration.
                    </p>
                  </motion.div>

                  {/* Three Pivots */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="modal-section"
                  >
                    <h2 className="modal-section-title">The journey through three pivots</h2>
                    <div className="modal-timeline-container" style={{ marginTop: "1rem" }}>
                      <div className="modal-timeline-line" style={{ left: "7px" }} />
                      {[
                        { 
                          title: "Iteration 1 — Too broad, too slow", 
                          color: "#ef4444", 
                          status: "FAILED: PERFORMANCE & SCOPE",
                          desc: "Built with WebView for cross-platform speed. Result: janky performance, slow scrolling, frustrated users. Classic mistake: designed a visually lovable product that wasn't technically viable." 
                        },
                        { 
                          title: "Iteration 2 — Niche focus, wrong tech", 
                          color: "#f59e0b", 
                          status: "FAILED: TECH LEARNING CURVE",
                          desc: "Pivoted to beauty & skincare (strong market fit). Chose Flutter for modern tech. Problem: team didn't know Flutter. Months wasted on learning curve. Mistake: chose tech stack based on aspiration, not team capability." 
                        },
                        { 
                          title: "Iteration 3 — Compress, ship, prove", 
                          color: "#10b981", 
                          status: "SHIPPED & COMPLETED",
                          desc: "Cut all social features, focused on pure e-commerce. Switched to React Native (team knew it). Shipped in 3 months. But the runway ended—stakeholders decided not to continue because there was no traction." 
                        }
                      ].map((p, i) => (
                        <div key={i} className="modal-timeline-item" style={{ marginBottom: i === 2 ? "0" : "3rem", paddingLeft: "1.5rem" }}>
                          <div className="modal-timeline-dot" style={{ left: "-27px", width: "14px", height: "14px", borderColor: p.color }} />
                          <div style={{ 
                            background: "#ffffff", 
                            border: "1px solid rgba(0,0,0,0.04)", 
                            borderRadius: "16px", 
                            padding: "1.5rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                          }}>
                            <div style={{ 
                              display: "inline-block", 
                              background: `${p.color}10`, 
                              color: p.color, 
                              padding: "4px 10px", 
                              borderRadius: "6px", 
                              fontSize: "10px",
                              fontWeight: 700,
                              letterSpacing: "0.05em",
                              marginBottom: "12px"
                            }}>
                              {p.status}
                            </div>
                            <div className="modal-h3" style={{ fontSize: "17px", marginBottom: "8px" }}>{p.title}</div>
                            <div className="modal-body-small" style={{ fontSize: "14px", lineHeight: 1.7 }}>{p.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Takeaways */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="modal-section"
                  >
                    <h2 className="modal-section-title">What I took away</h2>
                    <p className="modal-body-text" style={{ color: "rgba(0,0,0,0.6)", marginBottom: "2rem" }}>
                      K-Shop didn't fail because of the idea—it failed because of execution and priorities. Here's what I won't repeat:
                    </p>
                    <div style={{ display: "grid", gap: "20px" }}>
                      {[
                        { title: "MVP means proving viability, not showcasing vision", desc: "Every feature should answer: \"Is this needed to prove the product is worth building?\" Not: \"Will this make the product look impressive?\" I designed for ego, not validation." },
                        { title: "Choose tech based on team capacity, not industry trends", desc: "Pragmatic ≠ boring. It means being honest about what your team can deliver. 8 months wasted on Flutter taught me that aspiration without capability is just hubris." },
                        { title: "GTM is as important as product quality", desc: "Building a great product without a distribution strategy is an expensive hobby, not a business. I spent 100% on product, 0% on go-to-market. That was fatal." },
                        { title: "Research should drive ruthless prioritization", desc: "I created personas from research but didn't use them to make hard trade-offs. Personas are decision tools, not decoration. They should help you say \"no\" consistently." }
                      ].map(l => (
                        <div key={l.title} style={{ 
                          background: "#ffffff", 
                          border: "1px solid rgba(0,0,0,0.04)", 
                          borderRadius: "16px", 
                          padding: "1.5rem",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                        }}>
                          <div style={{ fontWeight: 600, fontSize: "16px", marginBottom: "10px", color: "#1a1a1a" }}>{l.title}</div>
                          <div style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(0,0,0,0.5)" }}>{l.desc}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <div style={{ 
                    background: "#ffffff", 
                    borderLeft: "4px solid #4361ee", 
                    padding: "2.5rem", 
                    borderRadius: "0 20px 20px 0",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                    marginTop: "1rem"
                  }}>
                    <p style={{ fontSize: "17px", lineHeight: 1.8, color: "#1a1a1a", margin: 0, fontStyle: "italic", fontWeight: 400 }}>
                      "At the time, I was a designer who fell too in love with solutions before fully understanding the problem. K-Shop taught me to ask more questions, validate faster, and cut more ruthlessly—even when what I'm cutting is the idea I liked most."
                    </p>
                  </div>
                </div>
              ) : cs.slug === "gotham-risk-intelligence" ? (
                <>
                  {renderSection("PROBLEM", cs.problem)}
                  <div className="modal-section" style={{ marginTop: "2rem", marginBottom: "4rem" }}>
                    <div className="modal-section-label" style={{ marginBottom: "1.5rem" }}>BINARY TO SPECTRUM</div>
                    <GothamChallengeMotion />
                  </div>
                  {renderSection("CHALLENGE", cs.challenge)}
                  {renderSection("APPROACH", cs.approach)}
                </>
              ) : cs.slug === "privy-acceleration" ? (
                <>
                  {/* PROBLEM */}
                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">PROBLEM</div>
                    <div className="modal-body-text" style={{ fontWeight: 500 }}>
                      The organization lacked a unified competency framework, resulting in:
                    </div>
                    <ul style={{ 
                      padding: 0, 
                      margin: 0, 
                      listStyle: "none", 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: "12px" 
                    }}>
                      {[
                        "Misaligned skill expectations across teams",
                        "Unclear career progression paths",
                        "Inconsistent evaluation and promotion decisions"
                      ].map((item, idx) => (
                        <li key={idx} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }} className="modal-body-small">
                          <span style={{ color: "#df0317", fontWeight: 700 }}>—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="modal-body-small" style={{ fontStyle: "italic" }}>
                      This created a gap between perceived capability and organizational assessment standards.
                    </p>
                  </motion.div>

                  {/* PROGRAM INTENT */}
                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">PROGRAM INTENT</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                      {[
                        { 
                          title: "Capability Development", 
                          desc: "Accelerate technical and functional growth through structured learning, mentorship, and execution." 
                        },
                        { 
                          title: "Organizational Calibration", 
                          desc: "Standardize competency signals and evaluate readiness for higher responsibility." 
                        }
                      ].map((intent, i) => (
                        <div key={intent.title} style={{ maxWidth: "500px" }}>
                          <div className="modal-section-label" style={{ color: "#df0317", marginBottom: "4px" }}>0{i+1}. {intent.title}</div>
                          <div className="modal-body-small">{intent.desc}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* PROGRAM JOURNEY */}
                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">PROGRAM JOURNEY</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      {[
                        { tag: "Entry", title: "Assessment", desc: "Baseline competency evaluation and cohort selection." },
                        { tag: "Learning", title: "5-Month Acceleration", desc: "Hands-on training supported by mentorship and structured skill development." },
                        { tag: "Execution", title: "Capstone Project", desc: "Real-world application through high-stakes collaborative projects." },
                        { tag: "Evaluation", title: "Post-Test", desc: "Standardized measurement of competency growth." },
                        { tag: "Validation", title: "Final Presentation", desc: "Outcome presentation to leadership to assess readiness." },
                        { tag: "Outcome", title: "Graduation", desc: "Certification into elevated organizational roles." }
                      ].map((phase, i) => (
                      <div 
                        key={phase.title} 
                        style={{ 
                          display: "grid", 
                          gridTemplateColumns: "clamp(80px, 15vw, 100px) 1fr", 
                          gap: "clamp(1rem, 3vw, 2rem)",
                          alignItems: "start" 
                        }}
                      >
                          <div style={{ 
                            fontSize: "10px", 
                            color: "rgba(0,0,0,0.3)", 
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            paddingTop: "4px"
                          }}>{phase.tag}</div>
                          <div>
                            <div className="modal-h3" style={{ marginBottom: "2px" }}>{phase.title}</div>
                            <div className="modal-body-small">{phase.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* SCALE */}
                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">SCALE</div>
                    <div style={{ display: "flex", gap: "clamp(1.5rem, 4vw, 3rem)", flexWrap: "wrap" }}>
                      <div>
                        <div className="modal-stat-label">Participants</div>
                        <div className="modal-stat-value" style={{ color: "#df0317" }}>250+</div>
                      </div>
                      <div>
                        <div className="modal-stat-label">Mentors</div>
                        <div className="modal-stat-value" style={{ color: "#df0317" }}>30+</div>
                      </div>
                      <div>
                        <div className="modal-stat-label">Locations</div>
                        <div className="modal-stat-value" style={{ color: "#df0317" }}>4 <span className="modal-body-small" style={{ fontWeight: 600, color: "rgba(0,0,0,0.3)" }}>in Jogjakarta</span></div>
                      </div>
                    </div>
                    <div className="modal-section-label" style={{ marginBottom: "1rem" }}>CLASS PER TRACK</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1.5rem" }}>
                      {cs.tracks?.map(track => (
                        <div key={track.name} style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                          <span className="modal-stat-label" style={{ color: "#4361ee" }}>{track.classes}</span>
                          <span className="modal-body-small" style={{ fontWeight: 500 }}>{track.name}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* CONTENT GALLERY */}
                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    {/* PROCESS ARCHIVE */}
                    <div style={{ marginBottom: "5rem" }}>
                      <div className="modal-section-label" style={{ marginBottom: "2rem", color: "#4361ee", letterSpacing: "0.15em" }}>PROCESS ARCHIVE</div>
                      <div style={{ 
                        columnCount: 2, 
                        columnGap: "40px",
                        width: "100%"
                      }}>
                        {[
                          { src: "https://ik.imagekit.io/0ghhw9jvx/privy-acceleration-images/paris-acc-class.jpg", alt: "Privy Acceleration - Paris Class" },
                          { src: "https://ik.imagekit.io/0ghhw9jvx/privy-acceleration-images/clus-acc-class-.jpg", alt: "Privy Acceleration - Clus Class" },
                          { src: "https://ik.imagekit.io/0ghhw9jvx/privy-acceleration-images/jakal-acc-class.jpg", alt: "Privy Acceleration - Jakal Class" },
                          { src: "https://ik.imagekit.io/0ghhw9jvx/privy-acceleration-images/kapten-haryadi-acc-class.jpg", alt: "Privy Acceleration - Kapten Haryadi Class" }
                        ].map((img, i) => (
                          <motion.div 
                            key={i}
                            className="modal-gallery-item"
                            whileHover={{ scale: 1.01 }}
                            onClick={() => setLightboxImg(img.src)}
                            style={{ 
                              borderRadius: "24px", 
                              boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                              breakInside: "avoid",
                              marginBottom: "40px",
                              background: "transparent"
                            }}
                          >
                             <img 
                               src={img.src} 
                               alt={img.alt} 
                               style={{ width: "100%", height: "auto", display: "block" }}
                             />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* TEAM BEHINDED */}
                    <div>
                      <div className="modal-section-label" style={{ marginBottom: "2rem", color: "#4361ee", letterSpacing: "0.15em" }}>TEAM BEHINDED</div>
                      <div className="modal-grid-2x2" style={{ gap: "40px", alignItems: "start" }}>
                        {[
                          { 
                            src: "https://ik.imagekit.io/0ghhw9jvx/privy-acceleration-images/acc-commitee-team.jpg", 
                            alt: "Acceleration Committee Team", 
                            label: "ACCELERATION COMMITTEE" 
                          },
                          { 
                            src: "https://ik.imagekit.io/0ghhw9jvx/privy-acceleration-images/hr-team-2023.jpeg", 
                            alt: "Core Program Team", 
                            label: "PRIVY HR TEAM" 
                          }
                        ].map((img, i) => (
                          <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                            <motion.div 
                              className="modal-gallery-item"
                              whileHover={{ scale: 1.01 }}
                              onClick={() => setLightboxImg(img.src)}
                              style={{ 
                                borderRadius: "24px", 
                                marginBottom: "2rem", 
                                boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                                background: "transparent"
                              }}
                            >
                               <img 
                                 src={img.src} 
                                 alt={img.alt} 
                                 style={{ width: "100%", height: "auto", display: "block" }}
                               />
                            </motion.div>
                            <div style={{ 
                              textAlign: "center", 
                              fontSize: "12px", 
                              fontFamily: "var(--font-mono)", 
                              color: "rgba(0,0,0,0.4)", 
                              fontWeight: 600,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase"
                            }}>
                              {img.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* KEY OWNERSHIP */}
                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">KEY OWNERSHIP</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      {[
                        { title: "Assessment Platform", desc: "Algobash for testing workflows and competency evaluation." },
                        { title: "Learning Operations", desc: "6-month hybrid delivery across multiple tracks and cohorts." },
                        { title: "Program Coordination", desc: "Syncing execution between mentors, HR, and divisional stakeholders." },
                        { title: "Feedback & Data Systems", desc: "Tracking engagement, post-test growth, and graduation outcomes." },
                        { title: "Design System", desc: "End-to-end branding, materials, and digital landing pages." }
                      ].map((item, i) => (
                        <div key={item.title}>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", marginBottom: "2px" }}>{item.title}</div>
                          <div style={{ fontSize: "13px", color: "rgba(0,0,0,0.5)", lineHeight: 1.5 }}>{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* OFFBOARDING & OPS */}
                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">OFFBOARDING & OPS</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      {[
                        { title: "HR Coordination", desc: "Managed sensitive participant exit and clearance processes." },
                        { title: "Automated Reporting", desc: "Report card distribution via mail merge for efficiency." },
                        { title: "Asset Management", desc: "Consolidation of final project submissions and code repositories." }
                      ].map((op, i) => (
                        <div key={op.title}>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "rgba(0,0,0,0.7)", marginBottom: "2px" }}>{op.title}</div>
                          <div style={{ fontSize: "13px", color: "rgba(0,0,0,0.5)", lineHeight: 1.5 }}>{op.desc}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">IMPACT</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      {[
                        "Unify competency expectations across roles",
                        "Improve consistency in career progression decisions",
                        "Create transparency in evaluation standards",
                        "Align development outcomes with organizational needs"
                      ].map((impact, i) => (
                        <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <div style={{ fontSize: "12px", color: "#df0317", fontWeight: 800 }}>✓</div>
                          <div className="modal-h3" style={{ margin: 0 }}>{impact}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              ) : cs.slug === "tv-ambient" ? (
                <>
                  {/* RESEARCH OBJECTIVE */}
                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">RESEARCH OBJECTIVE</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      {[
                        "Understand the habits, behaviors, and challenges in consuming media among audiences aged 18–35 as a foundation for product and UX development.",
                        "Identify the needs and expectations of users aged 18–35 regarding content and MVP features for TBS.",
                        "Map existing solutions currently offered in the market to understand the competitive landscape and user alternatives."
                      ].map((obj, i) => (
                        <div key={i} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                          <div style={{ 
                            fontSize: "10px", 
                            fontWeight: 700, 
                            color: "#4361ee", 
                            fontFamily: "var(--font-mono)",
                            width: "18px",
                            height: "18px",
                            borderRadius: "4px",
                            background: "rgba(67, 97, 238, 0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: "3px"
                          }}>
                            {i + 1}
                          </div>
                          <div style={{ fontSize: "14px", color: "rgba(0,0,0,0.65)", lineHeight: 1.6 }}>
                            {obj}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* WHO WE LEARNED FROM */}
                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">WHO WE LEARNED FROM</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "2rem", padding: "1.5rem", background: "#fdf8f0", borderRadius: "16px", border: "1px solid #f9ebda" }}>
                      <div style={{ fontSize: "32px" }}>👥</div>
                      <div>
                        <div style={{ fontSize: "18px", fontWeight: 600, color: "#1a1a1a", marginBottom: "4px" }}>3 Young Adults (18–35)</div>
                        <div style={{ fontSize: "14px", color: "rgba(0,0,0,0.6)", lineHeight: 1.5 }}>
                          Living independently with high exposure to both broadcast and digital media. Transitioning from residual TV habits to digital-primary consumption.
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* HOW WE LEARNED */}
                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">HOW WE LEARNED</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
                      {[
                        { title: "Diary Study", desc: "Capturing real-time, unfiltered media habits as they happen", icon: "📓" },
                        { title: "In-Depth Interviews", desc: "Uncovering the emotional and cognitive drivers behind those behaviors", icon: "🎙️" }
                      ].map((method) => (
                        <div key={method.title} style={{ padding: "1.5rem", background: "white", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "16px", display: "flex", gap: "16px" }}>
                          <div style={{ fontSize: "24px" }}>{method.icon}</div>
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", marginBottom: "4px" }}>{method.title}</div>
                            <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.6)", lineHeight: 1.5 }}>{method.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* WHAT WE FOUND */}
                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">WHAT WE FOUND</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                      {[
                        { title: "Human Backsound", desc: "TV is less about watching, more about presence — a rhythmic companion to everyday routines.", icon: "🔊" },
                        { title: "Live Anchors", desc: "Certain moments (sports, shows, events) still create urgency that on-demand platforms can’t replicate.", icon: "⚽" },
                        { title: "Daily Boundary", desc: "TV marks transitions — from waking up to starting the day, and from work to rest.", icon: "⏳" },
                        { title: "Shared Context", desc: "The value lies in shared space, not just shared content — TV creates a sense of togetherness.", icon: "🛋️" },
                        { title: "Effortless Value", desc: "In a world of infinite choice, TV wins by asking nothing — no scrolling, no deciding, just playing.", icon: "🕊️" }
                      ].map((item, i) => (
                        <div key={item.title} style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                          <motion.div 
                            whileHover={{ 
                              scale: 1.15,
                              backgroundColor: "rgba(67, 97, 238, 0.08)",
                              transition: { type: "spring", stiffness: 400, damping: 10 }
                            }}
                            style={{ 
                              width: "48px", 
                              height: "48px", 
                              borderRadius: "12px", 
                              background: "rgba(0,0,0,0.03)", 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center",
                              fontSize: "20px",
                              flexShrink: 0,
                              cursor: "default"
                            }}
                          >
                            <motion.span
                              initial={{ display: "inline-block" }}
                              whileHover={{ 
                                rotate: [0, -15, 15, -15, 0],
                                scale: 1.2
                              }}
                              transition={{ duration: 0.4 }}
                            >
                              {item.icon}
                            </motion.span>
                          </motion.div>
                          <div style={{ maxWidth: "540px" }}>
                            <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a1a", marginBottom: "4px" }}>{item.title}</div>
                            <div style={{ fontSize: "14px", color: "rgba(0,0,0,0.7)", lineHeight: 1.6 }}>{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* CORE INSIGHT - QUOTE */}
                  <motion.div 
                    className="modal-section"
                    style={{ textAlign: "center", padding: "clamp(2rem, 8vw, 4rem) clamp(1rem, 4vw, 2rem)", background: "linear-gradient(to bottom, #fff, #fdf8f0, #fff)", borderRadius: "24px 24px 0 0" }}
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <div className="modal-section-label is-special" style={{ marginBottom: "1.5rem" }}>CORE INSIGHT</div>
                    <div className="modal-quote">
                      “TV isn’t being replaced — it’s being <span style={{ color: "#4361ee" }}>reassigned.</span>”
                    </div>
                    <div className="modal-body-small" style={{ marginTop: "1.5rem", maxWidth: "440px", margin: "1.5rem auto 0" }}>
                      It no longer competes for attention, but thrives as a medium that fills gaps, anchors routines, and removes the burden of choice.
                    </div>
                  </motion.div>

                  {/* WHAT THIS MEANS */}
                  <motion.div 
                    className="modal-section"
                    style={{ padding: "clamp(1.5rem, 4vw, 2rem)", background: "#fdf8f0", borderRadius: "0 0 24px 24px", textAlign: "center" }}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">WHAT THIS MEANS</div>
                    <div className="modal-section-title" style={{ maxWidth: "500px", margin: "0 auto" }}>
                      The opportunity isn’t to outperform digital platforms — but to <span style={{ color: "#4361ee" }}>own what they can’t.</span>
                    </div>
                  </motion.div>

                  {/* STRATEGIC OPPORTUNITY - EDITORIAL ORDERED LIST */}
                  <motion.div 
                    className="modal-section"
                    style={{ padding: "2rem 0" }}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label is-special" style={{ marginBottom: "2rem" }}>STRATEGIC OPPORTUNITY</div>
                    
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
                      gap: "2.5rem" 
                    }}>
                      {[
                        { 
                          title: "Own the rituals", 
                          desc: "Win the morning rush and evening wind-down — moments where attention is low, but presence matters."
                        },
                        { 
                          title: "Reduce decision friction", 
                          desc: "Create zero-effort viewing experiences that eliminate the need to choose."
                        },
                        { 
                          title: "Reinforce shared spaces", 
                          desc: "Design for communal environments, not just individual screens."
                        },
                        { 
                          title: "Become the safe default", 
                          desc: "Position TV as the reliable fallback in moments of content fatigue."
                        }
                      ].map((opp, idx) => (
                        <div key={opp.title} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: "1rem" }}>
                          <div className="modal-section-label is-special" style={{ paddingTop: "2px" }}>
                            0{idx + 1}
                          </div>
                          <div>
                            <div className="modal-h3">
                              {opp.title}
                            </div>
                            <div className="modal-body-small">
                              {opp.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              ) : cs.slug === "metago-coin" ? (
                <>
                  {/* 2. WHAT WE BUILT */}
                  {renderSection("WHAT WE BUILT", cs.approach)}

                  {/* Cinema Operator Flow Visualization */}
                  <motion.div 
                    className="modal-section"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ marginTop: "-2rem" }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "rgba(0,0,0,0.4)", marginBottom: "1.5rem" }}>
                      Think of it like this:
                    </div>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                      gap: "1.25rem" 
                    }}>
                      {[
                        { 
                          icon: <Store size={20} />, 
                          label: "01. ACQUIRE", 
                          title: "Virtual Cinema", 
                          desc: "Secure a digital cinema asset that serves as your primary production hub." 
                        },
                        { 
                          icon: <Clapperboard size={20} />, 
                          label: "02. SELECT", 
                          title: "Film Marketplace", 
                          desc: "Choose from various production tiers, each with unique earning potentials." 
                        },
                        { 
                          icon: <Megaphone size={20} />, 
                          label: "03. OPERATE", 
                          title: "Marketing Push", 
                          desc: "Execute regular campaigns to maintain visibility and sustain rewards." 
                        },
                        { 
                          icon: <TrendingUp size={20} />, 
                          label: "04. SCALE", 
                          title: "MGO Rewards", 
                          desc: "Generate utility rewards and reinvest them to expand your cinema empire." 
                        }
                      ].map((step, idx) => (
                        <motion.div 
                          key={idx}
                          initial="initial"
                          whileHover="hover"
                          style={{ 
                            padding: "1.5rem", 
                            background: "#fff", 
                            border: "1px solid rgba(0,0,0,0.06)", 
                            borderRadius: "20px",
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "border-color 0.2s ease"
                          }}
                        >
                          <div style={{ 
                            width: "40px", 
                            height: "40px", 
                            borderRadius: "12px", 
                            background: "rgba(139, 92, 246, 0.05)", 
                            color: "#8b5cf6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "1.5rem"
                          }}>
                            {step.icon}
                          </div>
                          <div style={{ 
                            fontSize: "10px", 
                            fontWeight: 700, 
                            color: "#8b5cf6", 
                            marginBottom: "8px",
                            fontFamily: "var(--font-mono)",
                            letterSpacing: "0.05em"
                          }}>
                            {step.label}
                          </div>
                          <div style={{ 
                            fontSize: "15px", 
                            fontWeight: 600, 
                            color: "#1a1a1a", 
                            marginBottom: "4px"
                          }}>
                            {step.title}
                          </div>
                          <motion.div 
                            variants={{
                              initial: { opacity: 0, height: 0, marginTop: 0 },
                              hover: { opacity: 1, height: "auto", marginTop: 8 }
                            }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            style={{ 
                              fontSize: "13px", 
                              color: "rgba(0,0,0,0.5)",
                              lineHeight: 1.5,
                              overflow: "hidden"
                            }}
                          >
                            {step.desc}
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* 3. WHY THIS MATTERS */}
                  {renderSection("WHY THIS MATTERS", cs.strategy)}
                  
                  {/* 4. IMPACT LOOP */}
                  <div className="modal-section">
                    <motion.div 
                      className="modal-section-label"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      style={{ 
                        color: "#8b5cf6", 
                        fontWeight: 700
                      }}
                    >
                      IMPACT LOOP
                    </motion.div>
                    <motion.div 
                      style={{ 
                        padding: "2rem", 
                        background: "rgba(139, 92, 246, 0.02)", 
                        borderRadius: "24px", 
                        border: "1px solid rgba(139, 92, 246, 0.08)",
                        position: "relative",
                        overflow: "hidden"
                      }}
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <motion.div 
                        style={{ 
                          display: "grid", 
                          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", 
                          gap: "1.5rem",
                          position: "relative"
                        }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.1,
                              delayChildren: 0.2
                            }
                          }
                        }}
                      >
                        {[
                          { label: "HOLD", text: "HOLD MGO", detail: "Fuel the ecosystem" },
                          { label: "ENGAGE", text: "OPERATE + CAMPAIGN", detail: "Active participation" },
                          { label: "EARN", text: "REAL YIELD", detail: "Ticket & ads revenue" },
                          { label: "REINVEST", text: "SCALE EMPIRE", detail: "Compound growth" },
                          { label: "GROW", text: "UTILITY & DEMAND", detail: "Ecosystem maturity" }
                        ].map((step, idx) => (
                          <motion.div 
                            key={idx} 
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            style={{ 
                              position: "relative",
                              padding: "1.25rem",
                              background: "white",
                              borderRadius: "16px",
                              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.04)",
                              border: "1px solid rgba(139, 92, 246, 0.06)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px"
                            }}
                          >
                            <div style={{ 
                              fontSize: "10px", 
                              fontWeight: 700, 
                              color: "#8b5cf6", 
                              letterSpacing: "0.05em",
                              fontFamily: "var(--font-mono)",
                              opacity: 0.6
                            }}>
                              STEP 0{idx + 1}
                            </div>
                            <div style={{ 
                              fontSize: "12px", 
                              fontWeight: 700, 
                              color: "#1a1a1a",
                              lineHeight: 1.2
                            }}>
                              {step.text}
                            </div>
                            <div style={{ 
                              fontSize: "11px", 
                              color: "rgba(0,0,0,0.4)",
                              fontWeight: 500
                            }}>
                              {step.detail}
                            </div>
                            
                            {/* Connector Arrow for all but last */}
                            {idx < 4 && (
                              <div style={{ 
                                position: "absolute", 
                                right: "-1rem", 
                                top: "50%", 
                                transform: "translateY(-50%)",
                                color: "rgba(139, 92, 246, 0.2)",
                                fontSize: "14px",
                                zIndex: 1,
                                display: "none" // Hidden on small grid
                              }}>
                                →
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </motion.div>

                      {/* Loop back indicator */}
                      <div style={{ 
                        marginTop: "1.5rem", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        gap: "12px",
                        padding: "12px",
                        background: "rgba(139, 92, 246, 0.04)",
                        borderRadius: "12px",
                        border: "1px dashed rgba(139, 92, 246, 0.2)"
                      }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#8b5cf6" }}>CYCLICAL GROWTH LOOP</span>
                        <div style={{ 
                          height: "1px", 
                          flex: 1, 
                          background: "linear-gradient(to right, rgba(139, 92, 246, 0.2), transparent)" 
                        }} />
                        <span style={{ fontSize: "14px", color: "#8b5cf6", fontWeight: 700 }}>↺</span>
                      </div>
                    </motion.div>
                    <div style={{ 
                      fontSize: "10px", 
                      color: "rgba(0,0,0,0.4)", 
                      marginTop: "12px", 
                      textAlign: "left",
                      fontWeight: 500
                    }}>
                      More active users → higher MGO demand → stronger ecosystem.
                    </div>
                  </div>

                  {/* 5. THE OPPORTUNITY */}
                  <motion.div 
                    className="modal-section"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div 
                      className="modal-section-label"
                      style={{ 
                        color: "#8b5cf6", 
                        fontWeight: 700,
                        marginBottom: "1.5rem"
                      }}
                    >
                      THE OPPORTUNITY
                    </div>
                    <motion.p 
                      className="modal-body-text" 
                      style={{ marginBottom: "2rem" }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      We see high FOMO + holding incentives as momentum to convert speculators into active builders within the ecosystem. With the upcoming launch of the Film Tokenization Launchpad, this timing is crucial to:
                    </motion.p>
                    
                    <motion.div 
                      style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                        gap: "1rem" 
                      }}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.4
                          }
                        }
                      }}
                    >
                      {[
                        { 
                          icon: <Users size={18} />, 
                          title: "Build engaged user base", 
                          desc: "Convert passive holders into active ecosystem builders from Day 1." 
                        },
                        { 
                          icon: <Activity size={18} />, 
                          title: "Create organic demand", 
                          desc: "Drive token utility through real participation rather than just speculation." 
                        },
                        { 
                          icon: <Zap size={18} />, 
                          title: "Prove real Web3 utility", 
                          desc: "Demonstrate that entertainment and blockchain can create tangible value." 
                        }
                      ].map((card, idx) => (
                        <motion.div 
                          key={idx} 
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: { opacity: 1, x: 0 }
                          }}
                          transition={{ duration: 0.6 }}
                          style={{ 
                            padding: "1.25rem", 
                            background: "rgba(0,0,0,0.02)", 
                            borderRadius: "16px",
                            border: "1px solid rgba(0,0,0,0.04)",
                            display: "flex",
                            gap: "1rem",
                            alignItems: "flex-start"
                          }}
                        >
                          <div style={{ 
                            padding: "8px", 
                            background: "#fff", 
                            borderRadius: "8px", 
                            color: "#8b5cf6",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                          }}>
                            {card.icon}
                          </div>
                          <div>
                            <div style={{ 
                              fontSize: "14px", 
                              fontWeight: 700, 
                              color: "#1a1a1a", 
                              marginBottom: "4px" 
                            }}>
                              {card.title}
                            </div>
                            <div style={{ 
                              fontSize: "12px", 
                              color: "rgba(0,0,0,0.5)",
                              lineHeight: 1.5
                            }}>
                              {card.desc}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* 6. MY ROLE: MAKING COMPLEXITY SIMPLE */}
                  <motion.div 
                    className="modal-section"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div 
                      className="modal-section-label"
                      style={{ 
                        color: "#8b5cf6", 
                        fontWeight: 700,
                        marginBottom: "1.5rem"
                      }}
                    >
                      MY ROLE: MAKING COMPLEXITY SIMPLE
                    </div>
                    <p className="modal-body-text" style={{ marginBottom: "2.5rem" }}>
                      As a Product Marketing lead, my core challenge was translating complex Web3 concepts into language that is accessible to everyone—especially older, more traditional investors.
                    </p>

                    <div style={{ marginBottom: "3rem" }}>
                      <motion.div 
                        style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", marginBottom: "1.25rem", letterSpacing: "0.02em" }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        WHAT I DID
                      </motion.div>
                      <motion.div 
                        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.1
                            }
                          }
                        }}
                      >
                        <motion.div 
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 }
                          }}
                          style={{ padding: "1.5rem", background: "rgba(0,0,0,0.02)", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.04)" }}
                        >
                          <div style={{ color: "#8b5cf6", fontWeight: 700, fontSize: "12px", marginBottom: "0.75rem", fontFamily: "var(--font-mono)" }}>MESSAGING FRAMEWORK</div>
                          <p style={{ fontSize: "14px", color: "rgba(0,0,0,0.6)", lineHeight: 1.6 }}>
                            Developed the <strong>“virtual cinema franchise”</strong> analogy to bridge Web3 jargon with familiar, traditional business mental models.
                          </p>
                        </motion.div>
                        <motion.div 
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 }
                          }}
                          style={{ padding: "1.5rem", background: "rgba(0,0,0,0.02)", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.04)" }}
                        >
                          <div style={{ color: "#8b5cf6", fontWeight: 700, fontSize: "12px", marginBottom: "0.75rem", fontFamily: "var(--font-mono)" }}>VALUE PROPOSITION CLARITY</div>
                          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
                            {[
                              "Simplified “tokenized participation” into “your tokens work for you.”",
                              "Introduced an emotional hook: “from spectator to producer.”",
                              "Elevated the social layer—where anyone can build a cinema, turning it into a digital asset."
                            ].map((item, i) => (
                              <li key={i} style={{ display: "flex", gap: "8px", fontSize: "13px", color: "rgba(0,0,0,0.6)", lineHeight: 1.5, marginBottom: "8px" }}>
                                <span style={{ color: "#8b5cf6", fontWeight: 700 }}>•</span> {item}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      </motion.div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem", marginBottom: "3.5rem" }}>
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#8b5cf6", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>CORE PROMISE</div>
                        <p style={{ fontSize: "15px", fontWeight: 600, color: "#1a1a1a", lineHeight: 1.4 }}>
                          Earn more MGO Coin through shared profits from film screenings and seat ticket sales.
                        </p>
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#8b5cf6", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>SIMILAR CONCEPTS</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {["Farming", "Livestock / Breeding"].map(tag => (
                            <span key={tag} style={{ padding: "4px 10px", background: "rgba(139, 92, 246, 0.05)", color: "#8b5cf6", fontSize: "11px", fontWeight: 600, borderRadius: "6px" }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <motion.div 
                      style={{ padding: "2rem", background: "#1a1a1a", borderRadius: "24px", color: "#fff", marginBottom: "0.5rem" }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                    >
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem", letterSpacing: "0.05em" }}>RESULTS I’M DRIVING FOR</div>
                      <motion.div 
                        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.1,
                              delayChildren: 0.3
                            }
                          }
                        }}
                      >
                        {[
                          { title: "Engagement", text: "Users understand why to participate, not just why to buy." },
                          { title: "Sustainability", text: "Investors see a sustainable ecosystem, not just a speculative asset." },
                          { title: "Clarity", text: "Clear differentiation from other Web3 entertainment projects." }
                        ].map((res, i) => (
                          <motion.div 
                            key={i}
                            variants={{
                              hidden: { opacity: 0, y: 10 },
                              visible: { opacity: 1, y: 0 }
                            }}
                          >
                            <div style={{ color: "#8b5cf6", fontWeight: 700, fontSize: "10px", marginBottom: "4px", fontFamily: "var(--font-mono)" }}>{res.title.toUpperCase()}</div>
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{res.text}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </>
              ) : cs.slug === "glance-fit" ? (
                <>
                  {renderSection("CHALLENGE", cs.challenge)}
                  {renderSection("OPPORTUNITY", cs.opportunity)}
                  
                  {/* SYSTEMS DESIGN APPROACH */}
                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">SYSTEMS DESIGN APPROACH</div>
                    
                    <p style={{ fontSize: "16px", color: "rgba(0,0,0,0.7)", lineHeight: 1.6, marginBottom: "2rem", fontWeight: 400 }}>
                      My role extended beyond design management to designing the system end-to-end—from user experience flows to the underlying economic model.
                    </p>
                      <div style={{ fontSize: "10px", color: "#14b8a6", fontWeight: 700, marginBottom: "2rem", letterSpacing: "0.1em" }}>CORE BEHAVIORAL LOOP</div>
                      
                      <div className="modal-visualization-container">
                         {/* Wheel Visualization */}
                         <div style={{ 
                           position: "relative",
                           width: "280px",
                           height: "280px",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center"
                         }}>
                            <motion.div 
                              animate={{ rotate: activeLoopStep * 90 }}
                              transition={{ type: "spring", damping: 20, stiffness: 60 }}
                              style={{ 
                                position: "absolute",
                                inset: "0",
                                background: "conic-gradient(from 0deg, rgba(20, 184, 166, 0.1), transparent 90deg, transparent)",
                                borderRadius: "50%",
                                pointerEvents: "none"
                              }}
                            />
                            {[
                              { label: 'Track', icon: Activity, angle: 0 },
                              { label: 'Points', icon: Coins, angle: 90 },
                              { label: 'Reward', icon: Award, angle: 180 },
                              { label: 'Re-engage', icon: RefreshCw, angle: 270 }
                            ].map((step, i) => {
                              const isActive = activeLoopStep === i;
                              const x = Math.cos((step.angle - 90) * (Math.PI / 180)) * 105;
                              const y = Math.sin((step.angle - 90) * (Math.PI / 180)) * 105;
                              return (
                                <motion.div 
                                  key={step.label}
                                  onClick={() => setActiveLoopStep(i)}
                                  style={{ 
                                    position: "absolute",
                                    left: `calc(50% + ${x}px - 26px)`,
                                    top: `calc(50% + ${y}px - 26px)`,
                                    cursor: "pointer",
                                    zIndex: 20
                                  }}
                                >
                                  <motion.div
                                    animate={{ 
                                      backgroundColor: isActive ? "#14b8a6" : "white",
                                      color: isActive ? "white" : "rgba(0,0,0,0.3)",
                                      scale: isActive ? 1.15 : 1
                                    }}
                                    style={{
                                      width: "52px",
                                      height: "52px",
                                      borderRadius: "50%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                                      border: "1px solid rgba(0,0,0,0.05)"
                                    }}
                                  >
                                    <step.icon size={22} />
                                  </motion.div>
                                  <div style={{ 
                                    position: "absolute", top: "58px", width: "100px", left: "-24px", textAlign: "center",
                                    fontSize: "9px", fontWeight: 700, color: isActive ? "#14b8a6" : "rgba(0,0,0,0.4)",
                                    letterSpacing: "0.1em", textTransform: "uppercase"
                                  }}>
                                    {step.label}
                                  </div>
                                </motion.div>
                              );
                            })}
                            <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "white", boxShadow: "inset 0 0 10px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                               <Zap size={24} style={{ color: "#14b8a6", opacity: 0.2 }} />
                            </div>
                         </div>
                         {/* Description */}
                         <div style={{ textAlign: "center", maxWidth: "420px", minHeight: "80px" }}>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={activeLoopStep}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                style={{ fontSize: "16px", color: "#444", lineHeight: 1.6, fontWeight: 500 }}
                              >
                                {[
                                  "Users track daily activities and fitness metrics seamlessly via interconnected devices.",
                                  "Earn points as behavioral incentives for reaching health milestones and daily goals.",
                                  "Redeem your points for exclusive rewards, partner deals, and ecosystem perks.",
                                  "Stay motivated with personalized health insights and gamified growth programs."
                                ][activeLoopStep]}
                              </motion.div>
                            </AnimatePresence>
                         </div>
                      </div>

                      <div style={{ 
                        borderLeft: "2px solid #2196f3",
                        paddingLeft: "1.25rem",
                        marginTop: "2.5rem",
                        background: "rgba(33, 150, 243, 0.02)",
                        padding: "1.25rem 1.5rem",
                        borderRadius: "0 12px 12px 0"
                      }}>
                         <div style={{ fontSize: "10px", color: "#2196f3", fontWeight: 700, marginBottom: "0.5rem", letterSpacing: "0.1em" }}>PAYMENT LAYER</div>
                         <p style={{ fontSize: "14px", color: "rgba(0,0,0,0.6)", lineHeight: 1.7, margin: 0 }}>
                           To extend utility, I designed a crypto-based payment layer, enabling users to access premium features via a pay-with-crypto model. This positioned the token as both an incentive mechanism and a medium of exchange within the ecosystem.
                         </p>
                      </div>
                    </motion.div>

                  {/* GROWTH & INCENTIVE SYSTEM */}
                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">GROWTH & INCENTIVE SYSTEM</div>
                    <p style={{ fontSize: "16px", color: "rgba(0,0,0,0.7)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                      To support acquisition and retention, I designed a multi-layer incentive architecture that combines referral mechanics with behavioral gamification.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem" }}>
                      <div>
                        <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.3)", fontWeight: 700, marginBottom: "1rem", letterSpacing: "0.1em" }}>SYSTEM INCLUDES</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          {[
                            "**Affiliate marketing** (direct referral incentives)",
                            "**Fitness advocate leader** (team-based incentives)",
                            "**Business development** (group-based incentives)"
                          ].map((item, i) => {
                            const parts = item.split('**');
                            return (
                              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                 <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#14b8a6", marginTop: "7px", flexShrink: 0 }} />
                                 <div style={{ fontSize: "14px", color: "rgba(0,0,0,0.7)", lineHeight: 1.5 }}>
                                   <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{parts[1]}</span>
                                   {parts[2]}
                                 </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: "10px", color: "rgba(0,0,0,0.3)", fontWeight: 700, marginBottom: "1rem", letterSpacing: "0.1em" }}>REINFORCED THROUGH</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          {[
                            "**Recurring commissions** from subscriptions",
                            "**Package upgrade commission** from subscriptions",
                            "**AP Points** as a marketing gamification mechanism"
                          ].map((item, i) => {
                            const parts = item.split('**');
                            return (
                              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                 <CheckCircle2 size={14} style={{ color: "#14b8a6", marginTop: "2px", flexShrink: 0, opacity: 0.8 }} />
                                 <div style={{ fontSize: "14px", color: "rgba(0,0,0,0.7)", lineHeight: 1.5 }}>
                                   <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{parts[1]}</span>
                                   {parts[2]}
                                 </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* SYSTEM ARCHITECTURE */}
                  <motion.div 
                    className="modal-section"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="modal-section-label">SYSTEM ARCHITECTURE</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {[
                        { title: "Subscription Economy", desc: "recurring revenue model" },
                        { title: "Gamification Layer", desc: "points, achievements, and engagement loops" },
                        { title: "Token Utility Layer", desc: "payments, rewards, and incentives" },
                        { title: "Network Growth Layer", desc: "multi-level referral structure" }
                      ].map((sys, i) => (
                        <div key={sys.title} style={{ display: "flex", gap: "1.5rem", borderBottom: "1px solid rgba(0,0,0,0.03)", paddingBottom: "0.5rem" }}>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", minWidth: "160px" }}>{sys.title}</div>
                          <div style={{ fontSize: "14px", color: "rgba(0,0,0,0.5)" }}>{sys.desc}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              ) : (
                <>
                  {renderSection("PROBLEM", cs.problem)}
                  {renderSection("CHALLENGE", cs.challenge)}
                  {renderSection("APPROACH", cs.approach)}
                </>
              )}
            </div>



            <motion.div 
              ref={outcomeRef}
              className="modal-section"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="modal-section-label is-outcome">OUTCOME</div>
              <p className="modal-outcome-text">
                {cs.outcome}
              </p>
            </motion.div>

            {/* CTA inline with content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setCtaHov(true)}
              onMouseLeave={() => setCtaHov(false)}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "rgba(0,0,0,0.3)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "not-allowed",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    width: "fit-content",
                    textDecoration: "none",
                  }}
                >
                  See the full story (Coming Soon)
                  <span style={{ opacity: 0.5 }}>→</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Lightbox Overlay - Moved outside modal-panel for true top-level position */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-20 bg-black/95 cursor-zoom-out"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxImg(null);
            }}
          >
            {/* Close instruction label */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase pointer-events-none">
              Click anywhere to dismiss
            </div>

            <motion.div 
              className="relative max-w-full max-h-full flex items-center justify-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImg}
                alt="Enlarged view"
                style={{ 
                  maxWidth: "100%", 
                  maxHeight: "90vh", 
                  borderRadius: "12px",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
                  display: "block"
                }}
              />
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImg(null);
                }}
                className="absolute -top-4 -right-4 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-50 border border-black/5"
                aria-label="Close image preview"
              >
                <div style={{ transform: "scale(1.2)" }}>✕</div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
