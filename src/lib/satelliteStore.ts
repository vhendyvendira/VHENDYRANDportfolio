export interface SatelliteData {
  id: string;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  isVisible: boolean;
  isPaused: boolean;
  isDragging: boolean;
  speedMultiplier: number;
  seed: number; // For unique drift patterns
}

export interface SatelliteStoreState {
  satellites: SatelliteData[];
}

let state: SatelliteStoreState = {
  satellites: [
    {
      id: 'sat-1',
      x: -1000,
      y: -1000,
      baseX: -1000,
      baseY: -1000,
      vx: 0,
      vy: 0,
      isVisible: false,
      isPaused: false,
      isDragging: false,
      speedMultiplier: 1,
      seed: Math.random() * 10000,
    }
  ],
};

const listeners = new Set<(state: SatelliteStoreState) => void>();

export const satelliteStore = {
  get: () => state,
  getSatellite: (id: string) => state.satellites.find(s => s.id === id),
  set: (nextState: Partial<SatelliteStoreState>) => {
    state = { ...state, ...nextState };
    listeners.forEach(l => l(state));
  },
  updateSatellite: (id: string, updates: Partial<SatelliteData>) => {
    state = {
      ...state,
      satellites: state.satellites.map(s => s.id === id ? { ...s, ...updates } : s)
    };
    listeners.forEach(l => l(state));
  },
  subscribe: (l: (state: SatelliteStoreState) => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  }
};
