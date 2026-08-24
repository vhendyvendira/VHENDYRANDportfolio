import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Linkedin } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    text: "Vhendy understands the logic behind every component. His ability to bridge design and strategy is exceptional.",
    context: "Worked together on the MyEduSolve platform overhaul, focusing on educational product strategy.",
    name: "Andrew Arthur",
    role: "PM • MyEduSolve",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=64&h=64&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/"
  },
  {
    id: 2,
    text: "He delivers operational clarity that makes the building process faster and more robust.",
    context: "Collaborated on technical implementation for Tech Stack's core dashboard and design system.",
    name: "Alwan",
    role: "Eng Lead • Tech Stack",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=64&h=64&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/"
  },
  {
    id: 3,
    text: "A true builder who brings fresh perspectives to complex problems, always solving for real user needs.",
    context: "Developed first-principle design solutions for the Global Design Hub's user ecosystem.",
    name: "Nabila",
    role: "Design Lead • Hub",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=64&h=64&auto=format&fit=crop",
    linkedin: "https://www.linkedin.com/"
  }
];

interface TestimonialItemProps {
  key?: React.Key;
  testimonial: typeof TESTIMONIALS[0];
  variants: any;
}

function TestimonialItem({ testimonial, variants }: TestimonialItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      variants={variants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        display: "flex", 
        flexDirection: "row",
        gap: "1.25rem",
        alignItems: "flex-start",
        maxWidth: "560px",
        alignSelf: "flex-start",
        cursor: "default"
      }}
    >
      <div style={{ flexShrink: 0, paddingTop: "0.2rem" }}>
        <div style={{ 
          width: "32px", 
          height: "32px", 
          borderRadius: "50%", 
          overflow: "hidden",
          background: "#f0f0f0",
          opacity: 0.9
        }}>
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name} 
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%) brightness(1.1)" }}
          />
        </div>
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: "0.75rem" }}>
          <p style={{ 
            fontSize: "14px", 
            lineHeight: 1.55, 
            color: "rgba(0,0,0,0.65)", 
            fontWeight: 400,
            letterSpacing: "-0.01em",
            maxWidth: "480px"
          }}>
            {testimonial.text}
          </p>
          
          <AnimatePresence>
            {isHovered && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                style={{
                  fontSize: "10px",
                  lineHeight: 1.5,
                  color: "rgba(0,0,0,0.45)",
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  marginTop: "0.65rem",
                  maxWidth: "440px",
                  fontWeight: 400
                }}
              >
                {testimonial.context}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span style={{ 
              fontSize: "13px", 
              fontWeight: 600, 
              color: "rgba(0,0,0,0.5)"
            }}>
              {testimonial.name}
            </span>
            <motion.a
                href={testimonial.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0.25 }}
                whileHover={{ opacity: 0.8, scale: 1.1 }}
                style={{ display: "flex", color: "#0077b5" }}
              >
                <Linkedin size={11} strokeWidth={2.5} />
            </motion.a>
          </div>
          <span style={{ 
            fontSize: "10px", 
            fontFamily: "var(--font-mono)", 
            color: "rgba(0,0,0,0.25)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 500
          }}>
            {testimonial.role}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialSection({ visible, hasSeenIntro = false }: { visible: boolean; hasSeenIntro?: boolean }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: hasSeenIntro ? 0.2 : 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.div 
      initial={hasSeenIntro ? false : { opacity: 0 }}
      whileInView={visible ? { opacity: 1 } : (hasSeenIntro ? { opacity: 1 } : {})}
      viewport={{ once: true, margin: "-100px" }}
      style={{ 
        marginTop: "6rem",
        marginBottom: "8.75rem",
        position: "relative",
        padding: "4rem 0"
      }}
      id="testimonial-section"
    >
      {/* Minimalism Visual Grid Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px)
        `,
        backgroundSize: 'calc(100% / 3) 100%',
        pointerEvents: 'none',
        zIndex: 0,
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)',
        maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)',
      }} />

      <div style={{ marginBottom: "5rem", position: "relative", zIndex: 1 }}>
        <h3 style={{ 
          fontSize: "10px", 
          letterSpacing: "0.15em", 
          color: "rgba(0,0,0,0.35)", 
          fontFamily: "var(--font-mono)", 
          fontWeight: 600,
          textTransform: "uppercase",
          marginBottom: "1.25rem"
        }}>
          WORKING WITH ME
        </h3>
        <p style={{ 
          fontSize: "15px", 
          lineHeight: 1.65, 
          color: "rgba(0,0,0,0.5)",
          maxWidth: "480px",
          fontWeight: 400
        }}>
          Direct feedback from people who have experienced working with me.
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "6rem",
          maxWidth: "800px",
          position: "relative",
          zIndex: 1
        }}
      >
        {TESTIMONIALS.map((testimonial) => (
          <TestimonialItem 
            key={testimonial.id} 
            testimonial={testimonial} 
            variants={itemVariants} 
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
