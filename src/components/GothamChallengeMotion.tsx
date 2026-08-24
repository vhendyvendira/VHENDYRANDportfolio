import React from 'react';
import { motion } from 'motion/react';

export default function GothamChallengeMotion() {
  return (
    <div className="relative w-full h-[200px] bg-[#0C1117] overflow-hidden rounded-2xl flex items-center justify-center border border-white/5">
      {/* BACKGROUND SPECTRUM TRANSITION */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "linear-gradient(90deg, #000 50%, #fff 50%)", // 0s
            "linear-gradient(90deg, #000 50%, #fff 50%)", // 2s (Binary start)
            "linear-gradient(90deg, #000 0%, #333 50%, #000 100%)", // 5s (Ambiguity starts)
            "linear-gradient(90deg, #111 0%, #222 50%, #111 100%)", // 8s (Final Gray state)
            "linear-gradient(90deg, #111 0%, #222 50%, #111 100%)", // 10s (Hold)
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.2, 0.45, 0.7, 1]
        }}
      />

      {/* NOISE FOR TEXTURE */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* THE DIVIDING LINE */}
      <motion.div
        className="absolute w-[1px] h-[70%] bg-white/30 z-10"
        initial={{ opacity: 1, filter: "blur(0px)" }}
        animate={{
          opacity: [0, 1, 1, 0, 0],
          scaleY: [1, 1, 1.1, 0.8, 0.8],
          filter: ["blur(0px)", "blur(0px)", "blur(4px)", "blur(12px)", "blur(20px)"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          times: [0, 0.1, 0.4, 0.6, 1],
          ease: "easeInOut"
        }}
      />

      {/* LABELS CONTAINER */}
      <div className="relative z-20 flex w-full max-w-2xl justify-between px-16 md:px-32 items-center mix-blend-difference">
        {/* LEGAL LABEL */}
        <motion.div
          className="text-white font-mono text-[clamp(14px,2vw,18px)] tracking-[0.4em] font-medium"
          animate={{
            opacity: [0, 1, 1, 0, 0],
            x: [0, 0, 10, -20, -20],
            skewX: [0, 0, 15, -15, 0],
            scale: [1, 1, 1.1, 0.9, 0.9],
            filter: ["blur(0px)", "blur(0px)", "blur(1px)", "blur(8px)", "blur(12px)"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            times: [0, 0.1, 0.4, 0.6, 1],
            ease: "easeInOut"
          }}
        >
          LEGAL
        </motion.div>

        {/* ILLEGAL LABEL */}
        <motion.div
           className="text-white font-mono text-[clamp(14px,2vw,18px)] tracking-[0.4em] font-medium"
          animate={{
            opacity: [0, 1, 1, 0, 0],
            x: [0, 0, -10, 20, 20],
            skewX: [0, 0, -15, 15, 0],
            scale: [1, 1, 1.1, 0.9, 0.9],
            filter: ["blur(0px)", "blur(0px)", "blur(1px)", "blur(8px)", "blur(12px)"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            times: [0, 0.1, 0.4, 0.6, 1],
            ease: "easeInOut"
          }}
        >
          ILLEGAL
        </motion.div>
      </div>

      {/* FINAL STATE TEXT */}
      <motion.div
        className="absolute z-30"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0, 0, 1, 1, 0],
          y: [20, 20, 10, 0, 0, -10],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          times: [0, 0.5, 0.65, 0.75, 0.9, 1],
          ease: "easeOut"
        }}
      >
        <span className="text-white/40 font-sans text-xs md:text-sm tracking-[0.6em] uppercase font-light text-center block">
          Operating in the gray zone
        </span>
      </motion.div>

      {/* SUBTLE GLITCH OVERLAY (DYNAMIC) */}
      <motion.div
        className="absolute inset-0 border border-white/5 pointer-events-none"
        animate={{
          opacity: [0, 0, 0.4, 0, 0],
          scale: [1, 1, 1.02, 1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          times: [0, 0.4, 0.42, 0.45, 1],
        }}
        style={{
          background: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "100% 4px"
        }}
      />
    </div>
  );
}
