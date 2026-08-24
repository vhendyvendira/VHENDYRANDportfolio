import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Social } from '../types';
import { soundService } from '../services/soundService';
import { getVisitorCount } from '../services/firebase';

const SOCIALS: Social[] = [
  {
    label: "GitHub",
    href: "https://github.com/vhendyvendira",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    )
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/vhendyvendira",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    )
  },
  {
    label: "Instagram",
    href: "https://instagram.com/vhendyvendira",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    )
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@vhendyvendira",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    )
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/user/vhendyvendira",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14.5c2.5-1 5.5-1 8 0" />
        <path d="M7 11.5c3.5-1.5 7-1.5 10.5 0" />
        <path d="M6 8.5c4-2 9-2 13 0" />
      </svg>
    )
  },
];

export default function SocialFooter({ visible, fullWidth, isMobile, footerYear }: { visible: boolean, fullWidth?: boolean, isMobile?: boolean, footerYear?: string }) {
  const [copied, setCopied] = useState(false);
  const [vcount, setVcount] = useState<number | null | undefined>(undefined);
  const email = "vhendypersonal@gmail.com";

  useEffect(() => {
    if (visible) {
      getVisitorCount().then(setVcount).catch(() => setVcount(null));
    }
  }, [visible]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      soundService.play('magic');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className={`social-footer ${visible ? 'visible' : ''} ${fullWidth ? 'full-width' : ''} ${isMobile ? 'is-mobile' : ''}`} aria-label="Footer contacts">
      <div className="footer-content">
        <div className="footer-left-group flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-3">
            {footerYear && (
              <div className="footer-year font-mono text-[10px] md:text-[11px] text-black/20 uppercase tracking-widest">
                {footerYear}
              </div>
            )}
            {vcount !== undefined && (
              <div className="visitor-count flex items-center gap-2 font-mono text-[9px] md:text-[10px] text-black/15 uppercase tracking-widest">
                <span className="opacity-40">/</span>
                <span>{vcount === null ? 'Stats Offline' : `${vcount.toLocaleString()} visitors so far`}</span>
              </div>
            )}
          </div>
          <div className="email-contact">
            <span className="email-label text-[10px] md:text-[12px] font-mono opacity-40">Get in touch —</span>
            <button
              onClick={handleCopy}
              onMouseEnter={() => soundService.play('hover')}
              className="email-button group relative ml-2 cursor-pointer font-mono text-[10px] md:text-[12px] text-black/40 transition-colors hover:text-black"
            >
              <span className="underline underline-offset-4 decoration-black/10 group-hover:decoration-black/20">{email}</span>
              <AnimatePresence>
                {copied && (
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: -20 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="absolute left-0 top-0 whitespace-nowrap font-medium text-[#4361ee]"
                  >
                    Copied to clipboard
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <div className="social-links-wrap flex items-center gap-3 md:gap-5">
          {SOCIALS.map((s, i) => (
            <a
              key={s.label}
              href={s.href}
              className="social-link"
              onMouseEnter={() => soundService.play('hover')}
              onClick={() => soundService.play('click')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              style={{
                opacity: 0,
                padding: isMobile ? '8px 0' : '0',
                animation: visible ? `popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05 + 0.2}s forwards` : 'none'
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
