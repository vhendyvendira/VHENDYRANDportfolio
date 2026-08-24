import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ProgressiveImage from './ProgressiveImage';

interface PresenceViewProps {
  navigate: (path: string) => void;
}

interface ImageMoment {
  src: string;
  alt: string;
  backstory: string;
}

export default function PresenceView({ navigate }: PresenceViewProps) {
  const [selectedImage, setSelectedImage] = useState<ImageMoment | null>(null);

  // Animation Variants
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
      opacity: 0.6,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
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

  const styles = {
    lbl: { fontSize: "11px", fontWeight: 600, color: "#4361ee", fontFamily: "var(--font-mono)", textTransform: "uppercase" as const, letterSpacing: "0.1em" },
    rule: { height: "1px", background: "rgba(0,0,0,0.05)", border: "none" },
    cap: { fontSize: "11px", color: "rgba(0,0,0,0.4)", fontFamily: "var(--font-mono)" },
    pull: { fontSize: "18px", lineHeight: 1.6, color: "rgba(0,0,0,0.6)", fontWeight: 500 },
    entryT: { fontSize: "20px", fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.02em" },
    entryR: { fontSize: "11px", fontWeight: 600, color: "#4361ee", fontFamily: "var(--font-mono)", textTransform: "uppercase" as const },
    entryD: { fontSize: "15px", lineHeight: 1.7, color: "rgba(0,0,0,0.6)" },
    commT: { fontSize: "16px", fontWeight: 600, color: "#1a1a1a" },
    commD: { fontSize: "14px", lineHeight: 1.6, color: "rgba(0,0,0,0.6)" }
  };

  const REEL_IMAGES: ImageMoment[] = [
    { 
      src: "https://ik.imagekit.io/0ghhw9jvx/presence-page-images/vhendy-with-angga-iqbal-jogja.jpg", 
      alt: "Jogja Professional Meetup",
      backstory: "Community is the multiplier; sharing space with fellow creators in Jogja reminded me that innovation is a social act."
    },
    { 
      src: "https://ik.imagekit.io/0ghhw9jvx/presence-page-images/vhendy-hafidz.png", 
      alt: "Portrait moment",
      backstory: "Quiet moments of reflection are where system optimizations are often born, away from the screen."
    },
    { 
      src: "https://ik.imagekit.io/0ghhw9jvx/presence-page-images/vhendy-on-kanvas-confrence.png", 
      alt: "Guest Speaker at Kanvas Conference",
      backstory: "Speaking at Kanvas was about operational empathy—ensuring that design systems actually serve the people using them."
    },
    { 
      src: "https://ik.imagekit.io/0ghhw9jvx/presence-page-images/vhendy-femmy-nabila.jpeg", 
      alt: "Community with Femmy & Nabila",
      backstory: "Building in community means growing together; these shared moments define the mission behind the work."
    },
    { 
      src: "https://ik.imagekit.io/0ghhw9jvx/presence-page-images/vhendy-andrew-singapore.jpg", 
      alt: "Startup Summit Singapore",
      backstory: "Singapore's pace of innovation is a reminder that operational speed is a competitive advantage when paired with clarity."
    }
  ];

  return (
    <motion.div 
      className="about-full-container"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.01 }}
      variants={containerVariants}
    >
      {/* Decorative Accents */}
      <motion.div
        variants={decorativeVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '2%',
          width: '25vw',
          height: '25vw',
          background: 'radial-gradient(circle, rgba(67, 97, 238, 0.04) 0%, transparent 70%)',
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
          bottom: '10%',
          right: '5%',
          width: '20vw',
          height: '20vw',
          background: 'radial-gradient(circle, rgba(0, 0, 0, 0.02) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

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

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(255, 255, 255, 0.98)', 
              zIndex: 2000, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '2rem',
              cursor: 'zoom-out'
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{ maxWidth: '900px', width: '100%', position: 'relative' }}
            >
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt} 
                style={{ width: '100%', borderRadius: '4px', boxShadow: '0 30px 60px rgba(0,0,0,0.12)' }} 
              />
              <div style={{ marginTop: '2rem', maxWidth: '600px' }}>
                <div style={{ ...styles.lbl, marginBottom: '0.75rem' }}>The Backstory</div>
                <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#1a1a1a', fontWeight: 500 }}>
                  {selectedImage.backstory}
                </p>
                <div style={{ marginTop: '1rem', ...styles.cap }}>{selectedImage.alt}</div>
              </div>
            </motion.div>
            
            <button 
              onClick={() => setSelectedImage(null)}
              style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="about-content">
        <div className="about-page" style={{ paddingBottom: "8rem" }}>
          {/* Header */}
          <div style={{ marginBottom: "4rem" }}>
            <motion.div 
              variants={itemVariants} 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              style={{ ...styles.lbl, marginBottom: "1.5rem" }}
            >
              Public Presence
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.01 }}
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
              style={{ marginBottom: '1.5rem' }}
            >
              <h1 
                style={{ fontSize: "3rem", lineHeight: 1.1, fontWeight: 600, letterSpacing: "-0.04em", color: "#1a1a1a" }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '0.3em' }}>
                  {"Showing up and learning,".split(" ").map((word, i) => (
                    <motion.span key={i} variants={wordVariants} style={{ display: 'inline-block' }}>{word}</motion.span>
                  ))}
                </div>
                <div style={{ color: 'rgba(0,0,0,0.35)', display: 'flex', flexWrap: 'wrap', columnGap: '0.3em' }}>
                  {"sharing and building together.".split(" ").map((word, i) => (
                    <motion.span key={i} variants={wordVariants} style={{ display: 'inline-block' }}>{word}</motion.span>
                  ))}
                </div>
              </h1>
            </motion.div>
          </div>

          {/* Featured moment */}
          <div style={{ marginBottom: "6rem" }}>
            <motion.div 
              variants={itemVariants} 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              style={{ ...styles.lbl, marginBottom: "2rem" }}
            >
              Featured Moment
            </motion.div>
            <div style={{ marginBottom: "2.5rem" }}>
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                onClick={() => setSelectedImage({
                  src: "https://ik.imagekit.io/0ghhw9jvx/presence-page-images/iddr-apple-event-2025.png",
                  alt: "Apple Developer Academy Event 2025",
                  backstory: "Networking with the Apple ecosystem taught me that simplicity in developer tools requires the most complex engineering."
                })}
                style={{ width: "100%", borderRadius: "8px", background: "#f5f5f5", overflow: "hidden", aspectRatio: "16/9", position: 'relative', cursor: 'zoom-in' }}
              >
                <ProgressiveImage
                  src="https://ik.imagekit.io/0ghhw9jvx/presence-page-images/iddr-apple-event-2025.png"
                  alt="Apple Developer Academy Event 2025"
                  style={{ width: "100%", height: "100%" }}
                />
              </motion.div>
              <motion.div variants={itemVariants} style={{ marginTop: "1rem", ...styles.cap }}>
                Apple Developer Academy, Binus · Jakarta 2025
              </motion.div>
            </div>
            
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}
            >
              <span style={styles.entryT}>Indonesia Design Research & Apple Developer Academy, Binus - Event</span>
              <span style={styles.entryR}>Participant</span>
            </motion.div>
            <motion.p 
              variants={itemVariants} 
              initial="hidden"
              whileInView="visible" 
              viewport={{ once: true, margin: "-50px" }} 
              style={{ ...styles.entryD, marginBottom: "2rem" }}
            >
              Engaging with the regional design community at events like “Design That Sells: How UI/UX Drives Business Growth.” These sessions are critical for bridging the gap between product intuition and measurable business outcomes.
            </motion.p>
            <motion.p 
              variants={itemVariants} 
              initial="hidden"
              whileInView="visible" 
              viewport={{ once: true, margin: "-50px" }} 
              style={styles.pull}
            >
              "One-sided design fails. Great design is diplomacy."
            </motion.p>
          </div>

          <motion.hr 
            variants={itemVariants} 
            initial="hidden"
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }} 
            style={{ ...styles.rule, marginBottom: "6rem" }} 
          />

          {/* Speaking & Mentorship */}
          <div style={{ marginBottom: "6rem" }}>
            <motion.div 
              variants={itemVariants} 
              initial="hidden"
              whileInView="visible" 
              viewport={{ once: true, margin: "-50px" }} 
              style={{ ...styles.lbl, marginBottom: "3rem" }}
            >
              Speaking & Mentorship
            </motion.div>
            
            <div style={{ marginBottom: "4rem" }}>
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}
              >
                <span style={styles.entryT}>Kanvas Conference 2025, MyEduSolve</span>
                <span style={styles.entryR}>Guest Speaker</span>
              </motion.div>
              <motion.p 
                variants={itemVariants} 
                initial="hidden"
                whileInView="visible" 
                viewport={{ once: true, margin: "-50px" }} 
                style={styles.entryD}
              >
                Workshop lead on Inclusivity Design Mapping. Focused on teaching participants the mechanics of intent-based interface design and Wizard of Oz testing for AI systems.
              </motion.p>
            </div>

            <div style={{ marginBottom: "4rem" }}>
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}
              >
                <span style={styles.entryT}>MSIB Kampus Merdeka, Binar Academy</span>
                <span style={styles.entryR}>Design Mentor</span>
              </motion.div>
              <motion.p 
                variants={itemVariants} 
                initial="hidden"
                whileInView="visible" 
                viewport={{ once: true, margin: "-50px" }} 
                style={styles.entryD}
              >
                Mentoring cross-disciplinary students in UI/UX fundamentals. Supporting the transition from academic theory to industry-ready product execution through structured projects.
              </motion.p>
            </div>
            
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              style={{ padding: "2rem 0 0" }}
            >
              <div 
                onClick={() => setSelectedImage({
                  src: "https://ik.imagekit.io/0ghhw9jvx/presence-page-images/uix-mentor-binaracademy-2022.png",
                  alt: "Mentorship Session — Binar Academy, 2022",
                  backstory: "Guiding the next generation of designers reinforced that the best way to master a craft is to teach its first principles."
                })}
                style={{ width: "100%", aspectRatio: "2/1", borderRadius: "8px", overflow: "hidden", background: "#f5f5f5", position: 'relative', cursor: 'zoom-in' }}
              >
                <ProgressiveImage
                  src="https://ik.imagekit.io/0ghhw9jvx/presence-page-images/uix-mentor-binaracademy-2022.png"
                  alt="Mentorship Session — Binar Academy, 2022"
                  style={{ width: "100%", height: "100%" }}
                  imgStyle={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ marginTop: "1rem", ...styles.cap }}>
                Mentorship Session — Binar Academy, 2022
              </div>
            </motion.div>
          </div>

          {/* Community */}
          <div style={{ marginBottom: "6rem" }}>
            <motion.div 
              variants={itemVariants} 
              initial="hidden"
              whileInView="visible" 
              viewport={{ once: true, margin: "-50px" }} 
              style={{ ...styles.lbl, marginBottom: "2rem" }}
            >
              Community Involvement
            </motion.div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              <motion.div 
                variants={itemVariants} 
                initial="hidden"
                whileInView="visible" 
                viewport={{ once: true, margin: "-50px" }}
              >
                <p style={styles.commT}>Connect Group (CG) GMS</p>
                <p style={styles.commD}>Active in a local spiritual community (Church CG – GMS), with a belief that every blessing and ability comes from God—not solely from personal strength or logic.</p>
              </motion.div>
              <motion.div 
                variants={itemVariants} 
                initial="hidden"
                whileInView="visible" 
                viewport={{ once: true, margin: "-50px" }}
              >
                <p style={styles.commT}>Interaction Design Foundation (IxDF)</p>
                <p style={styles.commD}>Contributing to a global UX community by sharing insights on career growth and user-centered design, while engaging in meaningful discussions and learning from diverse perspectives across the field.</p>
              </motion.div>
              <motion.div 
                variants={itemVariants} 
                initial="hidden"
                whileInView="visible" 
                viewport={{ once: true, margin: "-50px" }}
              >
                <p style={styles.commT}>Indonesia Design Research (IDDR)</p>
                <p style={styles.commD}>Active member of the national research community, focused on creating a network effect for emerging designers in the region.</p>
              </motion.div>
            </div>
          </div>

          <motion.hr 
            variants={itemVariants} 
            initial="hidden"
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }} 
            style={{ ...styles.rule, marginBottom: "6rem" }} 
          />

          {/* Travel Reflections */}
          <div style={{ marginBottom: "6rem", position: 'relative' }}>
            <motion.div 
              variants={itemVariants} 
              initial="hidden"
              whileInView="visible" 
              viewport={{ once: true, margin: "-50px" }} 
              style={{ ...styles.lbl, marginBottom: "3rem" }}
            >
              Travel Reflections
            </motion.div>
            
            {/* The Path Line */}
            <motion.div 
              variants={decorativeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ 
                position: 'absolute', 
                left: '7px', 
                top: '100px', 
                bottom: '100px', 
                width: '1px', 
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(67, 97, 238, 0.4), rgba(0,0,0,0.1))',
                zIndex: 0
              }} 
            />

            {/* Singapore 2022 - Top Node */}
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              style={{ marginBottom: "5rem", position: 'relative', zIndex: 1, paddingLeft: '2.5rem' }}
            >
              <div style={{ 
                position: 'absolute', 
                left: '-2.25rem', 
                top: '0.5rem', 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                background: '#fff', 
                border: '2px solid rgba(0,0,0,0.2)',
                zIndex: 2
              }} />

              <div style={{ marginBottom: "1rem" }}>
                <div style={styles.entryT}>Clarke Quay, Singapore (2022)</div>
                <div style={styles.cap}>REF: STARTUP SUMMIT 01</div>
              </div>
              <p style={styles.entryD}>
                Engaging in cross-border startup pitching and regional summits. First international expansion of operational perspective, visiting regional offices and tech hubs.
              </p>
            </motion.div>

            {/* Bali 2025 - Bottom Node (Focus) */}
            <div style={{ position: 'relative', zIndex: 1, paddingLeft: '2.5rem' }}>
              <div style={{ 
                position: 'absolute', 
                left: '-2.25rem', 
                top: '0.5rem', 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                background: '#fff', 
                border: '2px solid #4361ee',
                boxShadow: '0 0 10px rgba(67, 97, 238, 0.3)',
                zIndex: 2
              }} />
              
              <div style={{ marginBottom: "1.5rem" }}>
                <motion.div 
                  variants={itemVariants} 
                  initial="hidden"
                  whileInView="visible" 
                  viewport={{ once: true, margin: "-50px" }} 
                  style={styles.entryT}
                >
                  Bali, Denpasar (2025)
                </motion.div>
                <motion.div 
                  variants={itemVariants} 
                  initial="hidden"
                  whileInView="visible" 
                  viewport={{ once: true, margin: "-50px" }} 
                  style={styles.cap}
                >
                  REF: REST & RECOVERY
                </motion.div>
              </div>
              <motion.p 
                variants={itemVariants} 
                initial="hidden"
                whileInView="visible" 
                viewport={{ once: true, margin: "-50px" }} 
                style={{ ...styles.entryD, marginBottom: "2rem" }}
              >
                Documenting the importance of recovery for long-term operational excellence. Stepping out of daily routines to gain objective perspective on complex systems.
              </motion.p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <motion.div 
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  onClick={() => setSelectedImage({
                    src: "https://ik.imagekit.io/0ghhw9jvx/presence-page-images/vhendy-bali-airport-2025.jpeg",
                    alt: "Bali Airport 2025",
                    backstory: "Recovery isn't downtime; it's the recalibration period necessary for high-performance leadership."
                  })}
                  style={{ flex: 1, aspectRatio: "4/3", borderRadius: "8px", overflow: "hidden", background: "#f5f5f5", position: 'relative', cursor: 'zoom-in' }}
                >
                  <ProgressiveImage 
                    src="https://ik.imagekit.io/0ghhw9jvx/presence-page-images/vhendy-bali-airport-2025.jpeg" 
                    alt="Bali Airport 2025" 
                    style={{ width: "100%", height: "100%" }} 
                    imgStyle={{ objectFit: "cover" }}
                  />
                </motion.div>
                <motion.div 
                   variants={itemVariants}
                   initial="hidden"
                   whileInView="visible"
                   viewport={{ once: true, margin: "-50px" }}
                  onClick={() => setSelectedImage({
                    src: "https://ik.imagekit.io/0ghhw9jvx/presence-page-images/pantai-melasti.jpeg",
                    alt: "Pantai Melasti",
                    backstory: "Finding perspective at the edge of the world helps in prioritizing what truly matters in product roadmaps."
                  })}
                  style={{ flex: 1, aspectRatio: "4/3", borderRadius: "8px", overflow: "hidden", background: "#f5f5f5", position: 'relative', cursor: 'zoom-in' }}
                >
                  <ProgressiveImage 
                    src="https://ik.imagekit.io/0ghhw9jvx/presence-page-images/pantai-melasti.jpeg" 
                    alt="Pantai Melasti" 
                    style={{ width: "100%", height: "100%" }} 
                    imgStyle={{ objectFit: "cover" }}
                  />
                </motion.div>
              </div>
            </div>
          </div>

          <motion.hr 
            variants={itemVariants} 
            initial="hidden"
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }} 
            style={{ ...styles.rule, marginBottom: "6rem" }} 
          />

          {/* Closing Narrative & Reel */}
          <div style={{ marginBottom: "4rem" }}>
            <motion.h2 variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} style={{ 
              fontSize: "2.5rem", 
              lineHeight: 1.2, 
              fontWeight: 600, 
              letterSpacing: "-0.04em", 
              color: "#1a1a1a",
              marginBottom: "3rem"
            }}>
              <div>It’s never just the work.</div>
              <div style={{ color: "rgba(0,0,0,0.35)" }}>It’s the rooms you choose to be in.</div>
            </motion.h2>
          </div>

          {/* Presence Reel - Visual Breakout with Safe Margins */}
          <div style={{ 
            width: "calc(100vw - 6rem)", 
            maxWidth: "none", 
            position: "relative", 
            left: "50%", 
            transform: "translateX(-50%)",
            marginBottom: "6rem"
          }}>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(5, 1fr)", 
              gap: "16px",
              width: "100%"
            }}>
              {REEL_IMAGES.map((img, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  onClick={() => setSelectedImage(img)}
                  style={{ 
                    aspectRatio: "1/1.25", 
                    background: "#f0f0f0", 
                    borderRadius: "12px", 
                    overflow: "hidden",
                    position: 'relative',
                    marginTop: i % 2 === 1 ? "2rem" : "0", 
                    transform: i === 2 ? "scale(1.05)" : "none", 
                    zIndex: i === 2 ? 2 : 1,
                    cursor: 'zoom-in'
                  }}
                >
                  <ProgressiveImage 
                    src={img.src}
                    alt={img.alt} 
                    className="presence-reel-img"
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                    }}
                    imgStyle={{ objectFit: "cover" }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.hr 
            variants={itemVariants} 
            initial="hidden"
            whileInView="visible" 
            viewport={{ once: true, margin: "-50px" }} 
            style={{ ...styles.rule, marginBottom: "4rem" }} 
          />

          <div style={{ textAlign: "center", padding: "0 2rem 8rem" }}>
            <motion.p variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} style={{ ...styles.pull, marginBottom: "1.5rem" }}>Live In the Future Then Build What's Missing - Y.C</motion.p>
            <motion.span variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} style={styles.cap}>V. VENDIRA // 2026</motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
