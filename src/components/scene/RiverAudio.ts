/**
 * Procedural Web Audio API sound generator for authentic handcrafted wooden rowboat:
 * - Natural calm river water flow & gentle wave swells
 * - Synchronized rowing sounds:
 *    * 'catch': Soft rounded water entry dip (not harsh splash)
 *    * 'drive': Warm wooden oarlock/thole-pin friction creak & deep water displacement whoosh
 *    * 'release': Delicate water droplet trickle from lifted oar blades
 * - Subtle hull water lapping
 * - Peaceful mountain morning ambience (distant breeze & occasional faint mountain bird)
 * - Temple arrival chime (528Hz Solfeggio frequency)
 * Zero external audio files required!
 */

export class RiverAudio {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private riverFilterNode: BiquadFilterNode | null = null;
  private riverGainNode: GainNode | null = null;
  private hullLapGainNode: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private lastBirdTime: number = 0;
  private lastOarEventTime: Record<string, number> = { catch: 0, drive: 0, release: 0 };

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
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // 1. Create continuous organic river water flow (brown-pink noise with natural swells)
    const sampleRate = this.ctx.sampleRate;
    const bufferDuration = 8.0; // 8-second seamless looping buffer
    const bufferSize = Math.floor(sampleRate * bufferDuration);
    const noiseBuffer = this.ctx.createBuffer(2, bufferSize, sampleRate);
    const leftChannel = noiseBuffer.getChannelData(0);
    const rightChannel = noiseBuffer.getChannelData(1);

    let lastLeft = 0.0;
    let lastRight = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;

      // Brown noise integration
      lastLeft = (lastLeft + 0.02 * whiteL) / 1.02;
      lastRight = (lastRight + 0.02 * whiteR) / 1.02;

      // Gentle organic river wave breathing swell (~0.12 Hz)
      const swell = 0.82 + 0.18 * Math.sin((i / bufferSize) * Math.PI * 2 * 3.0);
      leftChannel[i] = lastLeft * 2.8 * swell;
      rightChannel[i] = lastRight * 2.8 * swell;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    // Filter to simulate soft, deep river water (gentle lowpass at 320 Hz)
    this.riverFilterNode = this.ctx.createBiquadFilter();
    this.riverFilterNode.type = 'lowpass';
    this.riverFilterNode.frequency.setValueAtTime(320, this.ctx.currentTime);
    this.riverFilterNode.Q.setValueAtTime(0.7, this.ctx.currentTime);

    // River background gain
    this.riverGainNode = this.ctx.createGain();
    this.riverGainNode.gain.setValueAtTime(0.045, this.ctx.currentTime);

    // Hull water lap gain
    this.hullLapGainNode = this.ctx.createGain();
    this.hullLapGainNode.gain.setValueAtTime(0.015, this.ctx.currentTime);

    // Master gain for mute / volume
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

    // Audio Graph
    this.noiseNode.connect(this.riverFilterNode);
    this.riverFilterNode.connect(this.riverGainNode);
    this.riverGainNode.connect(this.masterGain);

    this.riverFilterNode.connect(this.hullLapGainNode);
    this.hullLapGainNode.connect(this.masterGain);

    this.masterGain.connect(this.ctx.destination);

    this.noiseNode.start(0);
    this.isRunning = true;
    this.lastBirdTime = this.ctx.currentTime;
  }

  public start() {
    if (!this.ctx) {
      this.init();
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Updates river flow & hull water sound modulation based on boat velocity (0.0 to 1.0)
   */
  public updateSpeed(speed: number) {
    if (!this.ctx || !this.riverFilterNode || !this.riverGainNode || !this.hullLapGainNode) return;
    const clamped = Math.min(Math.max(speed, 0), 1);
    const now = this.ctx.currentTime;

    // Soft river flow: idle 300Hz -> 520Hz at cruising speed (calm and natural, never harsh hiss)
    const targetFreq = 300 + clamped * 220;
    const targetRiverGain = 0.035 + clamped * 0.045;
    const targetHullGain = 0.012 + clamped * 0.038;

    this.riverFilterNode.frequency.setTargetAtTime(targetFreq, now, 0.25);
    this.riverGainNode.gain.setTargetAtTime(targetRiverGain, now, 0.25);
    this.hullLapGainNode.gain.setTargetAtTime(targetHullGain, now, 0.25);

    // Occasional subtle morning mountain warbler bird chirp in the distant peaceful air
    if (now - this.lastBirdTime > 24.0 + Math.random() * 12.0) {
      this.triggerDistantBird();
      this.lastBirdTime = now;
    }
  }

  /**
   * Trigger synchronized rowing stroke sound events:
   * - 'catch': Oar blade smoothly enters water (organic low dip / plop)
   * - 'drive': Wooden oarlock friction creak + low water displacement pull
   * - 'release': Oar blade exits water with delicate water droplets
   */
  public triggerOarEvent(eventType: 'catch' | 'drive' | 'release', intensity: number = 1.0) {
    if (!this.ctx || this.isMuted || !this.masterGain) return;
    const now = this.ctx.currentTime;
    if (now - (this.lastOarEventTime[eventType] || 0) < 0.6) return; // Debounce per event type
    this.lastOarEventTime[eventType] = now;

    try {
      if (eventType === 'catch') {
        this.playCatchDip(intensity);
      } else if (eventType === 'drive') {
        this.playDriveCreakAndPull(intensity);
      } else if (eventType === 'release') {
        this.playReleaseTrickle(intensity);
      }
    } catch {
      // Ignore audio glitch safely
    }
  }

  /**
   * Catch Phase: Soft, rounded liquid water dip as wooden blade enters water
   */
  private playCatchDip(intensity: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const clampedInt = Math.max(0.3, Math.min(intensity, 1.0));

    // 1. Resonant low-mid water bubble/plop oscillator (sweeping 290Hz -> 180Hz)
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(290, now);
    osc.frequency.exponentialRampToValueAtTime(175, now + 0.16);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.038 * clampedInt, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.20);

    // 2. Soft, low-passed filtered water displacement envelope
    const bufferLen = Math.floor(this.ctx.sampleRate * 0.22);
    const noiseBuf = this.ctx.createBuffer(1, bufferLen, this.ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufferLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.06));
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuf;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.Q.setValueAtTime(1.8, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.028 * clampedInt, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noiseSource.start(now);
  }

  /**
   * Drive Phase: Subtle wooden oarlock / thole-pin creak + gentle water displacement whoosh
   */
  private playDriveCreakAndPull(intensity: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const clampedInt = Math.max(0.3, Math.min(intensity, 1.0));

    // 1. Warm handcrafted wooden thole-pin / oarlock friction creak
    const creakOsc = this.ctx.createOscillator();
    creakOsc.type = 'triangle';
    creakOsc.frequency.setValueAtTime(460, now);
    // Slight authentic wood creak pitch sweep
    creakOsc.frequency.linearRampToValueAtTime(520, now + 0.14);
    creakOsc.frequency.linearRampToValueAtTime(440, now + 0.32);

    const creakFilter = this.ctx.createBiquadFilter();
    creakFilter.type = 'bandpass';
    creakFilter.frequency.setValueAtTime(480, now);
    creakFilter.Q.setValueAtTime(3.8, now);

    const creakGain = this.ctx.createGain();
    creakGain.gain.setValueAtTime(0.001, now);
    creakGain.gain.linearRampToValueAtTime(0.022 * clampedInt, now + 0.08);
    creakGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

    creakOsc.connect(creakFilter);
    creakFilter.connect(creakGain);
    creakGain.connect(this.masterGain);

    creakOsc.start(now);
    creakOsc.stop(now + 0.36);

    // 2. Deep, smooth water displacement whoosh (lowpass 160-240 Hz)
    const whooshLen = Math.floor(this.ctx.sampleRate * 0.42);
    const whooshBuf = this.ctx.createBuffer(1, whooshLen, this.ctx.sampleRate);
    const data = whooshBuf.getChannelData(0);
    for (let i = 0; i < whooshLen; i++) {
      const env = Math.sin((i / whooshLen) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const whooshSource = this.ctx.createBufferSource();
    whooshSource.buffer = whooshBuf;

    const whooshFilter = this.ctx.createBiquadFilter();
    whooshFilter.type = 'lowpass';
    whooshFilter.frequency.setValueAtTime(210, now);

    const whooshGain = this.ctx.createGain();
    whooshGain.gain.setValueAtTime(0.024 * clampedInt, now);
    whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

    whooshSource.connect(whooshFilter);
    whooshFilter.connect(whooshGain);
    whooshGain.connect(this.masterGain);

    whooshSource.start(now);
  }

  /**
   * Release Phase: Gentle water trickle & droplets falling from the oar blade
   */
  private playReleaseTrickle(intensity: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const clampedInt = Math.max(0.3, Math.min(intensity, 1.0));

    // 3 delicate water droplets falling back into the river
    const dropletFreqs = [1850, 1620, 2180];
    dropletFreqs.forEach((freq, idx) => {
      const dropTime = now + 0.04 + idx * 0.07;
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, dropTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.72, dropTime + 0.05);

      const gain = this.ctx!.createGain();
      gain.gain.setValueAtTime(0.016 * clampedInt, dropTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, dropTime + 0.06);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(dropTime);
      osc.stop(dropTime + 0.07);
    });
  }

  /**
   * Tranquil, distant mountain warbler bird chirp (adds deep peaceful presence)
   */
  private triggerDistantBird() {
    if (!this.ctx || this.isMuted || !this.masterGain) return;
    const now = this.ctx.currentTime;
    try {
      const tones = [2640, 2980, 2640];
      tones.forEach((tone, idx) => {
        const toneTime = now + idx * 0.14;
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(tone, toneTime);

        const gain = this.ctx!.createGain();
        gain.gain.setValueAtTime(0.0001, toneTime);
        gain.gain.linearRampToValueAtTime(0.012, toneTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, toneTime + 0.12);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(toneTime);
        osc.stop(toneTime + 0.14);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Backward-compatible alias for triggerOarEvent
   */
  public triggerOarSplash(intensity: number) {
    this.triggerOarEvent('catch', intensity);
  }

  /**
   * Resonant crystalline temple chime when arriving at a Chapter landmark (528Hz Solfeggio)
   */
  public triggerChime() {
    if (!this.ctx || this.isMuted || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const fundamental = 528;

      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(fundamental, now);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(fundamental * 2.02, now);

      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0.055, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc1.connect(chimeGain);
      osc2.connect(chimeGain);
      chimeGain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 3.4);
      osc2.stop(now + 3.4);
    } catch {
      // Ignore
    }
  }

  /**
   * Modulates procedural environmental ambiance based on river progression:
   * - u in [0.16, 0.28] (Bamboo Forest): subtle hollow wind resonance
   * - u in [0.38, 0.48] (Misty Gorge Waterfall): deeper rumbling current & echoing gorge
   * - u in [0.78, 1.00] (Tranquil Reflection): peaceful calm evening harmonics
   */
  public updateAtmosphere(currentU: number) {
    if (!this.ctx || !this.riverFilterNode || !this.riverGainNode) return;
    const now = this.ctx.currentTime;

    // In the narrow rocky gorge near the waterfall, water acoustics resonate deeper
    if (currentU >= 0.38 && currentU <= 0.48) {
      const gorgeProximity = 1.0 - Math.abs(currentU - 0.44) / 0.06;
      this.riverFilterNode.frequency.setTargetAtTime(380 + gorgeProximity * 140, now, 0.4);
      this.riverGainNode.gain.setTargetAtTime(0.045 + gorgeProximity * 0.025, now, 0.4);
    }
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(volume, 1));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
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
