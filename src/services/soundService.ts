import { Howl } from 'howler';

class SoundService {
  private sounds: Record<string, Howl> = {};
  private muted: boolean = false;

  constructor() {
    // Subtle mechanical UI sounds
    this.sounds = {
      hover: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'], // Light tick
        volume: 0.2,
      }),
      click: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'], // Soft click
        volume: 0.4,
      }),
      transition: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3'], // Subtle whoosh
        volume: 0.1,
      }),
      success: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'], // Use soft click for success too for now, or find another
        volume: 0.3,
      }),
      smooth: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'], // Light tick/smooth
        volume: 0.2,
      }),
      magic: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2631/2631-preview.mp3'], // Magic sparkle
        volume: 0.3,
      }),
      typing: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'], // Use the click sound (more audible)
        volume: 0.5, 
        pool: 10
      }),
      chime: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3'], // Soft notification chime
        volume: 0.6, 
        pool: 5
      }),
    };
  }

  unlock() {
    // Howler.js handles most of this but we can trigger a silent wash to be sure
    // and resume the context if it is suspended
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }
  }

  play(sound: 'hover' | 'click' | 'transition' | 'success' | 'smooth' | 'magic' | 'typing' | 'chime', options?: { volume?: number; rate?: number }) {
    if (this.muted) return;
    const s = this.sounds[sound];
    if (s) {
      const id = s.play();
      if (options?.volume !== undefined) s.volume(options.volume, id);
      if (options?.rate !== undefined) s.rate(options.rate, id);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }
}

export const soundService = new SoundService();
