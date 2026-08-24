import React from 'react';
import { motion } from 'motion/react';

const COMPANIES = [
  { name: "Google", info: "Project Management", logo: "https://ik.imagekit.io/0ghhw9jvx/image-company-logo/google-logo.png", scale: 1.0 },
  { name: "IBM", info: "Enterprise Design Thinking", logo: "https://ik.imagekit.io/0ghhw9jvx/image-company-logo/ibm-logo.png", scale: 0.85 },
  { name: "McKinsey", info: "Core Skills Level", logo: "https://ik.imagekit.io/0ghhw9jvx/image-company-logo/mckinsey-&-company.png", scale: 1.1 },
  { name: "Anthropic", info: "AI & Claude Skills", logo: "https://ik.imagekit.io/0ghhw9jvx/image-company-logo/anthropic-logo.png", scale: 0.75 },
  { name: "RWS Group", info: "Linguistic Prompt Design", logo: "https://ik.imagekit.io/0ghhw9jvx/image-company-logo/rws-group.png", scale: 0.9 }
];

export default function LearningSection({ visible, hasSeenIntro = false }: { visible: boolean; hasSeenIntro?: boolean }) {
  return (
    <motion.div 
      initial={hasSeenIntro ? false : { opacity: 0, y: 30 }}
      whileInView={visible ? { opacity: 1, y: 0 } : (hasSeenIntro ? { opacity: 1, y: 0 } : {})}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ 
        marginTop: "6rem",
        paddingBottom: "2.5rem",
        borderBottom: "1px solid rgba(0, 0, 0, 0.05)"
      }}
    >
      <div style={{ marginBottom: "4rem" }}>
        <h3 style={{ 
          fontSize: "10px", 
          letterSpacing: "0.15em", 
          color: "rgba(0,0,0,0.35)", 
          fontFamily: "var(--font-mono)", 
          fontWeight: 600,
          textTransform: "uppercase",
          marginBottom: "1.25rem"
        }}>
          Learning from World-Class Companies
        </h3>
        <p style={{ 
          fontSize: "15px", 
          lineHeight: 1.65, 
          color: "rgba(0,0,0,0.5)",
          maxWidth: "480px",
          fontWeight: 400
        }}>
          Continuously learning from industry leaders—staying current through evolving skills and insights.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-black/[0.04] mt-16">
        {COMPANIES.map((company, i) => (
          <motion.div 
            key={company.name}
            initial={hasSeenIntro ? false : { opacity: 0, y: 20 }}
            whileInView={visible ? { opacity: 1, y: 0 } : (hasSeenIntro ? { opacity: 1, y: 0 } : {})}
            viewport={{ once: true }}
            transition={{ 
              duration: 1, 
              delay: hasSeenIntro ? 0 : i * 0.12,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="border-r border-b border-black/[0.04] p-8 flex flex-col items-start justify-between min-h-[160px] group transition-colors cursor-default hover:bg-black/[0.01]"
          >
            <motion.div 
              className="h-10 flex items-center justify-start mb-10 w-full"
              animate={{ 
                y: [0, -2, 0],
              }}
              transition={{ 
                duration: 4 + (i * 0.5), 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.2
              }}
            >
              <div 
                style={{ 
                  height: "28px", 
                  width: "100%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "flex-start" 
                }}
              >
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`} 
                  style={{ 
                    height: company.scale ? `calc(100% * ${company.scale})` : "100%", 
                    width: "auto",
                    maxWidth: "140px",
                    objectFit: "contain",
                    display: "block",
                  }} 
                  className="opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.logo-fallback')) {
                      const span = document.createElement('span');
                      span.className = 'logo-fallback font-bold opacity-30 text-xs tracking-tighter';
                      span.innerText = company.name.toUpperCase();
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
            </motion.div>
            <div>
              <div className="text-[13px] font-semibold text-black/50 mb-1 group-hover:text-black/80 transition-colors">
                {company.name}
              </div>
              <div className="text-[10px] font-mono text-black/25 uppercase tracking-widest font-medium group-hover:text-black/40 transition-colors">
                {company.info}
              </div>
            </div>
          </motion.div>
        ))}
        {/* Empty cells to complete the grid look if needed (only for 5 items in 3 cols) */}
        {COMPANIES.length % 3 !== 0 && (
          Array.from({ length: 3 - (COMPANIES.length % 3) }).map((_, idx) => (
            <div key={`empty-${idx}`} className="hidden lg:block border-r border-b border-black/[0.04]" />
          ))
        )}
        {COMPANIES.length % 2 !== 0 && (
          Array.from({ length: 2 - (COMPANIES.length % 2) }).map((_, idx) => (
            <div key={`empty-sm-${idx}`} className="hidden sm:block lg:hidden border-r border-b border-black/[0.04]" />
          ))
        )}
      </div>
    </motion.div>
  );
}
