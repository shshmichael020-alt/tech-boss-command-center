// Web Audio API Synthesizer & Speech Engine for Big Boss Command Center

class AudioManager {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.voiceEnabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Dramatic Big Boss Opening Gong / Horn
  playGong() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Low sub bass oscillator
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(110, now);
      osc1.frequency.exponentialRampToValueAtTime(45, now + 1.8);

      gain1.gain.setValueAtTime(0.5, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      // Metallic high harmonic
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(320, now);
      osc2.frequency.exponentialRampToValueAtTime(180, now + 1.2);

      gain2.gain.setValueAtTime(0.3, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(this.ctx.destination);
      gain2.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.0);
      osc2.stop(now + 1.5);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // Dramatic Buzzer / Eviction Alarm
  playBuzzer() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      for (let i = 0; i < 2; i++) {
        const offset = i * 0.25;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now + offset);
        gain.gain.setValueAtTime(0.4, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.22);
      }
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // High-tech Positive chime for points / captaincy
  playSuccess() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A major chord arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // Negative deduction tone
  playDeduct() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [380, 290, 210];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.25);
      });
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // Timer Tick
  playTick() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn(e);
    }
  }

  // Big Boss Text-to-Speech Voice
  speak(text) {
    if (!this.voiceEnabled) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel(); // Stop prior speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.8; // Authoritative deep tone
      utterance.rate = 0.95;  // Deliberate pacing
      
      const voices = window.speechSynthesis.getVoices();
      // Try to find a male authoritative voice or deep english/hindi voice
      const preferred = voices.find(v => 
        v.name.toLowerCase().includes('david') || 
        v.name.toLowerCase().includes('google uk english male') ||
        v.name.toLowerCase().includes('male') ||
        v.lang.includes('en-GB') ||
        v.lang.includes('en-IN')
      );
      if (preferred) {
        utterance.voice = preferred;
      }
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
    }
  }
}

export const soundManager = new AudioManager();
