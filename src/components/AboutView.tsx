import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import ProgressiveImage from './ProgressiveImage';
import MusicPlayer from './MusicPlayer';
import { soundService } from '../services/soundService';
import WorldClock from './WorldClock';
import RunningActivity from './RunningActivity';
import ReadingActivity from './ReadingActivity';
import LanguageActivity from './LanguageActivity';
import GardeningActivity from './GardeningActivity';

interface SemanticTermProps {
  term: string;
  info: string;
  imgSrc?: string;
}

function SemanticTerm({ term, info, imgSrc }: SemanticTermProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <span 
      className="semantic-term"
      onMouseEnter={() => {
        setIsHovered(true);
        soundService.play('hover');
      }}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ 
        color: '#1a1a1a', 
        fontWeight: 500, 
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        cursor: 'help',
        position: 'relative'
      }}
    >
      {term}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'fixed',
              left: mousePos.x + 20,
              top: mousePos.y - 40,
              zIndex: 1000,
              pointerEvents: 'none',
              width: imgSrc ? '200px' : '160px',
              backgroundColor: '#fff',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              fontSize: '11px',
              lineHeight: 1.4,
              color: 'rgba(0,0,0,0.6)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {imgSrc && (
              <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px', background: '#f5f5f5' }}>
                <img src={imgSrc} alt={term} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{term}</div>
            {info}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

interface AboutViewProps {
  navigate: (path: string) => void;
}

interface OperatingPrincipleProps {
  key?: React.Key;
  idx: number;
  h: string;
  p: string;
}

function OperatingPrinciple({ idx, h, p }: OperatingPrincipleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onMouseEnter={() => soundService.play('hover')}
      transition={{ 
        duration: 0.8,
        delay: idx * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{ 
        padding: '2rem 1.5rem',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        borderRight: '1px solid rgba(0,0,0,0.05)',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <div style={{ 
        fontSize: '9px', 
        fontFamily: 'var(--font-mono)', 
        color: 'rgba(0,0,0,0.2)', 
        fontWeight: 700,
        letterSpacing: '0.1em'
      }}>
        PRINCIPLE_0{idx + 1}
      </div>

      <div>
        <h4 style={{ 
          fontSize: '15px', 
          fontWeight: 600, 
          marginBottom: '0.4rem', 
          color: '#1a1a1a',
          letterSpacing: '-0.01em'
        }}>
          {h}
        </h4>
        <p style={{ 
          fontSize: '14px', 
          lineHeight: 1.5, 
          color: 'rgba(0,0,0,0.5)',
          maxWidth: '280px'
        }}>
          {p}
        </p>
      </div>
    </motion.div>
  );
}

export default function AboutView({ navigate }: AboutViewProps) {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const storyContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: imageScrollProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: storyScrollProgress } = useScroll({
    target: storyContainerRef,
    offset: ["start 70%", "end 70%"]
  });

  const imageY = useTransform(imageScrollProgress, [0, 1], ["-15%", "15%"]);
  const threadScale = useTransform(storyScrollProgress, [0, 1], [0, 1]);
  const threadOpacity = useTransform(storyScrollProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  // Animation Variants
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      // Close expanded widget if resizing back to desktop
      if (!mobile) {
        setExpandedWidget(null);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);

  const MicroActivity = ({ id, icon, style }: { id: string, icon: string, style?: React.CSSProperties }) => (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 0.5, 
        scale: 1,
        y: [0, -4, 0],
      }}
      transition={{
        opacity: { duration: 1.5, delay: 0.5 },
        scale: { duration: 1.5, delay: 0.5 },
        y: { duration: 5, repeat: Infinity, ease: 'easeInOut' }
      }}
      whileHover={{ opacity: 1, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        e.stopPropagation();
        setExpandedWidget(id);
        soundService.play('click');
      }}
      style={{
        position: 'absolute',
        width: '18px',
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(67, 97, 238, 0.05)',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '9px',
        color: 'rgba(67, 97, 238, 0.6)',
        border: '1px solid rgba(67, 97, 238, 0.08)',
        zIndex: 5,
        ...style
      }}
    >
      {icon}
    </motion.button>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const decorativeVariants = {
    hidden: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const decorativeEntranceVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const STORY = [
    {
      label: 'Origin',
      body: (
        <div style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(0,0,0,0.7)' }}>
          I entered <SemanticTerm term="product development" info="From ideation to final rollout, focusing on bridging the gap between vision and execution." /> through a non-linear path. With a background in information systems and early experience in marketing communications, I learned that no knowledge is wasted—each piece shaping how I think about clarity: what a product solves, why it exists, and why it matters. 
        </div>
      ),
    },
    {
      label: 'Perspective',
      body: (
        <div style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(0,0,0,0.7)' }}>
          I tend to start with questions rather than answers, often thinking through a <SemanticTerm term="first-principles" info="Breaking problems down to their most basic components to build fresh, unbiased solutions." /> lens. Even in the AI era, taking the time to define the problem well still matters. To me, products are shaped by real needs—and clarified through the act of building, testing, and refining over time.
        </div>
      ),
    },
    {
      label: 'Direction',
      body: (
        <div style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(0,0,0,0.7)' }}>
          I’m currently focused on products that absorb complexity so users don’t have to—especially in Web3, financial, healthcare, and enterprise contexts where clarity is critical. With AI, I take a more hands-on approach to building, turning ideas into working products through <SemanticTerm term="rapid iteration" info="A cycle of shipping, learning, and refining that drastically reduces time-to-market." /> and continuous learning.
        </div>
      ),
    },
  ];

  const renderExpandedWidget = () => {
    if (!expandedWidget) return null;
    
    const widgets: Record<string, React.ReactNode> = {
      music: <MusicPlayer />,
      clock: <WorldClock />,
      run: <RunningActivity />,
      read: <ReadingActivity />,
      lang: <LanguageActivity />,
      garden: <GardeningActivity />
    };

    return (
      <motion.div
        key="widget-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setExpandedWidget(null)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(250, 249, 246, 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 15 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="mobile-widget-expanded"
          style={{
            boxShadow: '0 32px 64px rgba(0,0,0,0.08)',
            borderRadius: '16px',
            background: '#fff',
            padding: '1rem',
            maxWidth: '100%'
          }}
        >
          {widgets[expandedWidget]}
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setExpandedWidget(null)}
            style={{
              marginTop: '1.5rem',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: 'rgba(0,0,0,0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              width: '100%',
              textAlign: 'center'
            }}
          >
            [ close ]
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="about-full-container" 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.01 }}
      variants={containerVariants}
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Grid Background Layer with Center Mask */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
          maskImage: 'linear-gradient(to right, black 0%, black 10%, transparent 50%, black 90%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, black 10%, transparent 50%, black 90%, black 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      {/* Decorative Accents */}
      <motion.div
        variants={decorativeVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '20vw',
          height: '20vw',
          background: 'radial-gradient(circle, rgba(67, 97, 238, 0.03) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      <motion.div
        variants={decorativeVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: '15vw',
          height: '15vw',
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0.02) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      <div className="about-content" style={{ paddingBottom: '8rem' }}>
        <div className="about-page">
          {/* Header */}
          <motion.div variants={itemVariants} style={{ marginBottom: '2.5rem', position: 'relative' }}>
            <span className="about-label">Personal Narrative</span>
            {isMobile && <MicroActivity id="music" icon="♪" style={{ top: '-10px', right: '0' }} />}
          </motion.div>

          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
            style={{ marginBottom: '2rem', position: 'relative' }}
          >
            <h1 style={{ 
              fontSize: isMobile ? 'clamp(3rem, 11vw, 4rem)' : '3rem', 
              lineHeight: 1.1, 
              fontWeight: 600, 
              letterSpacing: '-0.04em', 
              color: '#1a1a1a' 
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '0.3em' }}>
                {"I make things legible —".split(" ").map((word, i) => (
                  <motion.span key={i} variants={wordVariants} style={{ display: 'inline-block' }}>{word}</motion.span>
                ))}
              </div>
              <div style={{ color: 'rgba(0,0,0,0.35)', display: 'flex', flexWrap: 'wrap', columnGap: '0.3em' }}>
                {"for people, for teams".split(" ").map((word, i) => (
                  <motion.span key={i} variants={wordVariants} style={{ display: 'inline-block' }}>{word}</motion.span>
                ))}
              </div>
              <div style={{ color: 'rgba(0,0,0,0.35)', display: 'flex', flexWrap: 'wrap', columnGap: '0.3em', position: 'relative' }}>
                {"for the future.".split(" ").map((word, i) => (
                  <motion.span key={i} variants={wordVariants} style={{ display: 'inline-block' }}>{word}</motion.span>
                ))}
                {isMobile && <MicroActivity id="clock" icon="🕒" style={{ top: '10px', right: '-10px' }} />}
              </div>
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} style={{ marginBottom: '4rem' }}>
            <p style={{ fontSize: '18px', lineHeight: 1.6, color: 'rgba(0,0,0,0.6)', maxWidth: '540px' }}>
              Building products and teams people choose, trust, and grow with.
            </p>
          </motion.div>

          {/* Simple Image with Parallax Window Effect */}
          <motion.div 
            variants={itemVariants} 
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{ marginBottom: '6rem' }}
          >
            <div 
              ref={imageContainerRef}
              style={{ 
                width: '100%', 
                aspectRatio: '16/10', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                background: '#f5f5f5', 
                position: 'relative' 
              }}
            >
              <motion.div 
                style={{ 
                  y: imageY,
                  width: '100%',
                  height: '130%', // Taller to allow for movement
                  position: 'absolute',
                  top: '-15%', // Center the extra height
                  left: 0
                }}
              >
                <ProgressiveImage 
                  src="https://ik.imagekit.io/0ghhw9jvx/about-page-images/google-singapore-2022.png" 
                  alt="Working environment at Google Singapore"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </motion.div>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(0,0,0,0.4)', marginTop: '1rem', fontFamily: 'var(--font-mono)' }}>IASTI, 2022</p>
          </motion.div>
          
          <div ref={storyContainerRef} style={{ position: 'relative' }}>
            {isMobile && <MicroActivity id="run" icon="🏃" style={{ top: '-40px', left: '40%' }} />}
            {/* The Narrative Thread */}
            <motion.div
              style={{
                position: 'absolute',
                left: '-2rem',
                top: '0',
                bottom: '0',
                width: '1px',
                background: 'linear-gradient(to bottom, #4361ee, rgba(67, 97, 238, 0.1))',
                scaleY: threadScale,
                opacity: threadOpacity,
                originY: 0,
                zIndex: 1
              }}
            />

            {/* Story Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', marginBottom: '6rem' }}>
            {STORY.map(({ label, body }) => (
              <motion.div 
                key={label} 
                variants={itemVariants}
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                   {/* Small Accent Dot */}
                   <motion.div 
                     variants={{
                       hidden: { opacity: 0, y: 10 },
                       visible: { opacity: 0.4, y: 0 }
                     }}
                     style={{ 
                       position: 'absolute', 
                       left: '-1rem', 
                       top: '50%', 
                       transform: 'translateY(-50%)',
                       width: '4px', 
                       height: '4px', 
                       borderRadius: '50%', 
                       background: '#4361ee',
                     }} 
                   />
                   <p style={{ fontSize: '11px', fontWeight: 600, color: '#4361ee', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{label}</p>
                </div>
                <div>
                  {body}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mentality / Operating Principles Section */}
          <div style={{ marginBottom: '8rem' }}>
            <motion.div 
              variants={itemVariants}
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              style={{ marginBottom: '3rem' }}
            >
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 600, marginTop: '0.5rem', letterSpacing: '-0.02em' }}>Operating Principles</h3>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '0',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                borderLeft: '1px solid rgba(0,0,0,0.05)'
              }}>
                {[
                  { 
                    h: 'Understand the Real Problem', 
                    p: 'Start by identifying the root cause and current state before deciding.' 
                  },
                  { 
                    h: 'Context-Driven Decisions', 
                    p: 'Knowing when to take initiative and when to align with direction.' 
                  },
                  { 
                    h: 'Think Beyond Constraints', 
                    p: 'When blocked, explore alternative paths instead of forcing solutions.' 
                  },
                  { 
                    h: 'Calm, Collaborative Thinking', 
                    p: 'Staying composed, understanding how others think, and aligning decisions.' 
                  },
                ].map((item, idx) => (
                  <OperatingPrinciple
                    key={idx}
                    idx={idx}
                    h={item.h}
                    p={item.p}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <motion.hr variants={itemVariants} className="about-rule" />

          {/* Beyond What I Know Section */}
          <motion.div 
            variants={itemVariants} 
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            style={{ marginTop: '6rem', marginBottom: '6rem', position: 'relative' }}
          >
            {isMobile && <MicroActivity id="read" icon="📚" style={{ top: '-20px', right: '5%' }} />}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 600, marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
                Beyond What I Know
              </h3>
            </div>
            <p style={{ fontSize: '18px', lineHeight: 1.6, color: 'rgba(0,0,0,0.7)', maxWidth: '600px', position: 'relative' }}>
              {isMobile && <MicroActivity id="lang" icon="🗣️" style={{ top: '50%', right: '-10px', transform: 'translateY(-50%)' }} />}
              I grew by taking on problems I wasn’t fully ready for —{' '}
              <motion.span
                initial={{ opacity: 0.2, filter: 'blur(4px)' }}
                whileHover={{ opacity: 1, filter: 'blur(0px)' }}
                whileTap={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                style={{ cursor: 'default', display: 'inline-block' }}
              >
                and learning through them.
              </motion.span>
              {isMobile && <MicroActivity id="garden" icon="🌱" style={{ bottom: '-20px', left: '10%' }} />}
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants} 
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ marginBottom: '4rem' }}
        >
            <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)', marginBottom: '2.5rem' }}>
              Curriculum vitae — available on request or below.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                <a 
                  href="https://drive.google.com/file/d/1dzD2RoKC7XdhaWGlXEnSwCzk1T35rYYY/view?usp=sharing" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-cta-link" 
                  style={{ fontSize: '16px', fontWeight: 600 }}
                >
                  View full CV
                  <span style={{ fontSize: '18px' }}>→</span>
                </a>
              </div>
              
              <div style={{ marginTop: '0.75rem', fontSize: '14px', color: 'rgba(0,0,0,0.4)', lineHeight: 1.6 }}>
                Built with Love · Jakarta, ID · Open to Collaboration
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Only Floating Widgets Layer */}
      {!isMobile && (
        <div className="about-widgets-section">
          <div className="about-widgets-grid">
            <motion.div variants={decorativeEntranceVariants}>
              <MusicPlayer />
            </motion.div>
            <motion.div variants={decorativeEntranceVariants}>
              <WorldClock />
            </motion.div>
            <motion.div variants={decorativeEntranceVariants}>
              <RunningActivity />
            </motion.div>
            <motion.div variants={decorativeEntranceVariants}>
              <ReadingActivity />
            </motion.div>
            <motion.div variants={decorativeEntranceVariants}>
              <LanguageActivity />
            </motion.div>
            <motion.div variants={decorativeEntranceVariants}>
              <GardeningActivity />
            </motion.div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isMobile && renderExpandedWidget()}
      </AnimatePresence>
    </motion.div>
  );
}
