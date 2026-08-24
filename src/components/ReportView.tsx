import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { CaseStudy } from '../types';

// Import specific report contents

interface ReportViewProps {
  cs: CaseStudy;
  navigate: (path: string) => void;
}

const REPORT_COMPONENTS: Record<string, React.ComponentType> = {};

export default function ReportView({ cs, navigate }: ReportViewProps) {
  const ContentComponent = REPORT_COMPONENTS[cs.slug];

  return (
    <motion.div
      className="report-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: '#f9f8f6',
        overflowY: 'auto',
        color: '#1a1a1a',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '160px 24px 100px' }}>
        <header style={{ marginBottom: '80px' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', 
            fontWeight: 600, 
            letterSpacing: '-0.05em', 
            lineHeight: 1.05, 
            marginBottom: '32px',
            color: '#000'
          }}>
            {cs.title}
          </h1>
          <div style={{ 
            fontSize: '32px', 
            color: '#1a1a1a', 
            lineHeight: 1.2, 
            maxWidth: '720px',
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            letterSpacing: '-0.01em',
            marginBottom: '40px',
            fontStyle: 'italic'
          }}>
            {cs.description || `A detailed performance analysis and strategic breakdown of the ${cs.event} initiative.`}
          </div>
        </header>

        <div className="report-content" style={{ minHeight: '60vh', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '48px' }}>
          {ContentComponent ? (
            <ContentComponent />
          ) : (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.3)', fontFamily: 'var(--font-mono)', marginBottom: '16px' }}>[ DATA PENDING ]</div>
              <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '14px' }}>Detailed metrics and qualitative findings currently being indexed.</p>
            </div>
          )}
        </div>

        <footer style={{ marginTop: '100px', paddingTop: '48px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '11px', color: 'rgba(0,0,0,0.3)', fontFamily: 'var(--font-mono)' }}>
            PUBLISHED 2026 // VHENDY VENDIRA
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ fontSize: '11px', color: 'rgba(0,0,0,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
          >
            SCROLL TO TOP
          </button>
        </footer>
      </div>
    </motion.div>
  );
}
