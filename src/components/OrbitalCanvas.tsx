import React, { useEffect, useRef } from 'react';

export default function OrbitalCanvas({ style = {} }: { style?: React.CSSProperties }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let raf: number;
    let cumAngle = 0;
    let lastTs: number | null = null;
    let startTs: number | null = null;
    
    const INIT = 5, FINAL = 1, DUR = 4000;
    const orbs = [
      { r: 80, speed: 0.00018, size: 3, opacity: 0.18, offset: 0 },
      { r: 130, speed: 0.00011, size: 2, opacity: 0.12, offset: Math.PI * 0.7 },
      { r: 190, speed: 0.00007, size: 1.5, opacity: 0.09, offset: Math.PI * 1.3 },
    ];

    function resize() {
      const b = canvas.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) return;
      canvas.width = b.width * window.devicePixelRatio;
      canvas.height = b.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    resize();
    window.addEventListener("resize", resize);

    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    const expoOut = (t: number) => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
    
    function getMult(ts: number) {
      if (!startTs) startTs = ts;
      const e = ts - startTs;
      return e >= DUR ? FINAL : INIT + (FINAL - INIT) * expoOut(e / DUR);
    }

    function draw(ts: number) {
      if (!lastTs) lastTs = ts;
      const dt = ts - lastTs; 
      lastTs = ts;
      cumAngle += dt * getMult(ts);
      
      const b = canvas.getBoundingClientRect();
      const w = b.width, h = b.height;
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(draw);
        return;
      }
      
      ctx.clearRect(0, 0, w, h);

      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      const cx = w * 0.5 - mouseX * 8;
      const cy = h * 0.52 - mouseY * 12;

      ctx.beginPath(); 
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(90,90,110,0.55)"; 
      ctx.fill();

      orbs.forEach(o => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, o.r, o.r * 0.38, -Math.PI * 0.12, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100,100,130,${o.opacity})`; 
        ctx.lineWidth = 0.6; 
        ctx.stroke();
        
        const a = cumAngle * o.speed + o.offset;
        ctx.beginPath(); 
        ctx.arc(cx + Math.cos(a) * o.r, cy + Math.sin(a) * o.r * 0.38, o.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80,80,120,${o.opacity * 2.8})`; 
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        width: "100%", 
        height: "100%", 
        opacity: 0, 
        animation: "fadeIn 2s ease 1.8s forwards", 
        pointerEvents: "none", 
        ...style 
      }} 
    />
  );
}
