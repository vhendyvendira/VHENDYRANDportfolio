import { satelliteStore } from './satelliteStore';

const BUFFER = 800; 
const MIN_SPEED = 24; // Slower base
const MAX_SPEED = 28; // Slower variance
const DRIFT_AMP = 3; // Even more subtle
const DRIFT_FREQ = 0.0001; // Slower drift frequency

let lastTime = performance.now();
let isRunning = false;
let rafId: number;

function triggerNextPass(id: string) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  const side = Math.floor(Math.random() * 4);
  
  let startX, startY, endX, endY;
  
  // Natural traversal area
  const travelRange = 1000; 

  if (side === 0) { // Start from Left
    startX = -BUFFER;
    startY = Math.random() * height;
    endX = width + travelRange;
    endY = startY + (Math.random() - 0.5) * 400;
  } else if (side === 1) { // Start from Right
    startX = width + BUFFER;
    startY = Math.random() * height;
    endX = -travelRange;
    endY = startY + (Math.random() - 0.5) * 400;
  } else if (side === 2) { // Start from Top
    startX = Math.random() * width;
    startY = -BUFFER;
    endX = startX + (Math.random() - 0.5) * 400;
    endY = height + travelRange;
  } else { // Start from Bottom
    startX = Math.random() * width;
    startY = height + BUFFER;
    endX = startX + (Math.random() - 0.5) * 400;
    endY = -travelRange;
  }

  const dx = endX - startX;
  const dy = endY - startY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  const sat = satelliteStore.getSatellite(id);
  const speed = (MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)) * (sat?.speedMultiplier || 1);
  
  const vx = (dx / dist) * speed;
  const vy = (dy / dist) * speed;

  satelliteStore.updateSatellite(id, {
    x: startX,
    y: startY,
    baseX: startX,
    baseY: startY,
    vx,
    vy,
    isVisible: true,
    isPaused: false
  });
}

function update(now: number) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  const state = satelliteStore.get();
  
  state.satellites.forEach(sat => {
    if (sat.isPaused || !sat.isVisible || sat.isDragging) return;

    // Movement calculation
    // Stable organic curvature: we fluctuate velocity direction but maintain speed
    const currentSpeed = Math.sqrt(sat.vx * sat.vx + sat.vy * sat.vy);
    const noiseAngle = Math.sin(now * 0.0001) * 0.0002;
    
    // Rotate velocity vector slightly
    const cosA = Math.cos(noiseAngle);
    const sinA = Math.sin(noiseAngle);
    const newVx = sat.vx * cosA - sat.vy * sinA;
    const newVy = sat.vx * sinA + sat.vy * cosA;

    // Apply damping/normalization to ensure speed doesn't drift
    const nextVx = (newVx / Math.sqrt(newVx * newVx + newVy * newVy)) * currentSpeed;
    const nextVy = (newVy / Math.sqrt(newVx * newVx + newVy * newVy)) * currentSpeed;

    const newBaseX = sat.baseX + nextVx * dt;
    const newBaseY = sat.baseY + nextVy * dt;

    // Cinematic drift
    const time = now + sat.seed;
    const driftX = Math.sin(time * DRIFT_FREQ) * DRIFT_AMP;
    const driftY = Math.cos(time * DRIFT_FREQ * 0.7) * DRIFT_AMP;

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Controlled off-screen range
    const threshold = 1200;
    const isWayOutside = 
      newBaseX < -threshold || 
      newBaseX > width + threshold || 
      newBaseY < -threshold || 
      newBaseY > height + threshold;

    if (isWayOutside) {
       triggerNextPass(sat.id);
    } else {
      satelliteStore.updateSatellite(sat.id, { 
        vx: nextVx, 
        vy: nextVy,
        baseX: newBaseX, 
        baseY: newBaseY,
        x: newBaseX + driftX,
        y: newBaseY + driftY 
      });
    }
  });

  if (isRunning) rafId = requestAnimationFrame(update);
}

export const startSatelliteEngine = () => {
  const state = satelliteStore.get();
  
  state.satellites.forEach(sat => {
    // If not moving or reset, give it a path
    if (sat.vx === 0 && sat.vy === 0) {
      triggerNextPass(sat.id);
    }
  });

  if (isRunning) return;
  isRunning = true;
  lastTime = performance.now();
  requestAnimationFrame(update);
};

export const stopSatelliteEngine = () => {
  isRunning = false;
  if (rafId) cancelAnimationFrame(rafId);
};
