/**
 * Procedural Web Audio API sound generator for river water flow and oar splash.
 * Zero external audio files required!
 */

export class RiverAudio {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;
  private isMuted: boolean = false;
  private lastSplashTime: number = 0;

  constructor() {
    try {
      const storedMute = localStorage.getItem('river_audio_muted');
      this.isMuted = storedMute === 'true';
    } catch {
      this.isMuted = false;
    }
  }

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Create pink/brown noise buffer (5 seconds looped)
    const bufferSize = this.ctx.sampleRate * 5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    // Brown noise approximation
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain compensation
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    // Filter to simulate soft river water
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(450, this.ctx.currentTime);

    // Gain node for boat speed modulation
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.04, this.ctx.currentTime);

    // Master gain for mute
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);

    // Connect graph
    this.noiseNode.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.noiseNode.start(0);
    this.isRunning = true;
  }

  public start() {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Updates water sound frequency & gain based on boat velocity (0.0 to 1.0)
   */
  public updateSpeed(speed: number) {
    if (!this.ctx || !this.filterNode || !this.gainNode) return;
    const clamped = Math.min(Math.max(speed, 0), 1);

    // Idle cutoff 400Hz -> 1100Hz at max speed
    const targetFreq = 400 + clamped * 700;
    // Idle volume 0.03 -> 0.12 at full speed
    const targetGain = 0.03 + clamped * 0.09;

    const now = this.ctx.currentTime;
    this.filterNode.frequency.setTargetAtTime(targetFreq, now, 0.1);
    this.gainNode.gain.setTargetAtTime(targetGain, now, 0.1);

    // Trigger procedural oar splash when moving at moderate speed every 1.5s
    if (clamped > 0.15 && now - this.lastSplashTime > 1.8 - clamped * 0.6) {
      this.triggerOarSplash(clamped);
      this.lastSplashTime = now;
    }
  }

  private triggerOarSplash(intensity: number) {
    if (!this.ctx || this.isMuted || !this.masterGain) return;
    try {
      const splashBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.4, this.ctx.sampleRate);
      const data = splashBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
      }

      const splashSource = this.ctx.createBufferSource();
      splashSource.buffer = splashBuffer;

      const splashFilter = this.ctx.createBiquadFilter();
      splashFilter.type = 'bandpass';
      splashFilter.frequency.setValueAtTime(600 + Math.random() * 200, this.ctx.currentTime);
      splashFilter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      const splashGain = this.ctx.createGain();
      splashGain.gain.setValueAtTime(0.04 * intensity, this.ctx.currentTime);
      splashGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      splashSource.connect(splashFilter);
      splashFilter.connect(splashGain);
      splashGain.connect(this.masterGain);

      splashSource.start();
    } catch {
      // Ignore audio glitch
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime, 0.05);
    }
    try {
      localStorage.setItem('river_audio_muted', String(this.isMuted));
    } catch {
      // Ignore
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }
}

export const riverAudio = new RiverAudio();
