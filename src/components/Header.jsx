import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Megaphone, Crown, ShieldAlert, Radio } from 'lucide-react';
import EyeLogo from './EyeLogo';
import { soundManager } from '../utils/audio';

export default function Header({
  captain,
  onOpenBroadcast,
  onOpenCaptaincy,
  dangerCount = 0,
  currentDay = 22,
  chaosIndex = 68
}) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [soundOn, setSoundOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.soundEnabled = next;
    if (next) soundManager.playSuccess();
  };

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    soundManager.voiceEnabled = next;
    if (next) soundManager.speak("Big Boss voice engine online.");
  };

  return (
    <header className="relative bg-[#090e1b] border-b border-red-500/30 px-4 sm:px-6 py-3.5 z-30 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Eye Surveillance */}
        <div className="flex items-center space-x-3.5">
          <EyeLogo isPulsing={dangerCount > 0} size="md" />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white font-chakra flex items-center">
                BIG BOSS <span className="text-red-500 ml-1.5 font-mono text-sm sm:text-base">[TECH HOUSE]</span>
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-950/80 text-red-400 border border-red-500/50 animate-pulse">
                SURVEILLANCE ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-tight flex items-center gap-2">
              <span>DAY {currentDay}</span>
              <span>•</span>
              <span className="text-cyan-400 font-semibold">{time}</span>
              <span>•</span>
              <span className="text-amber-400">COMMAND v2.6.4</span>
            </p>
          </div>
        </div>

        {/* Quick Surveillance Intel & Captain Pill */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* House Captain Badge */}
          {captain ? (
            <button
              onClick={onOpenCaptaincy}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/50 hover:border-amber-400 text-xs text-amber-300 font-mono transition shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              title="Click to view/change House Captain"
            >
              <Crown className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>CAPTAIN: <strong className="text-white">{captain.name.split(' ')[0]}</strong></span>
            </button>
          ) : (
            <button
              onClick={onOpenCaptaincy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 font-mono hover:border-amber-500 transition"
            >
              <Crown className="w-4 h-4 text-slate-400" />
              <span>Assign Captain</span>
            </button>
          )}

          {/* Danger Zone Counter Badge */}
          {dangerCount > 0 && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-500 text-xs text-red-300 font-mono font-bold shadow-[0_0_15px_rgba(239,68,68,0.35)] animate-pulse">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>DANGER ZONE: {dangerCount}</span>
            </div>
          )}

          {/* Chaos / Harmony Meter */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
            <span className="text-slate-400">Chaos:</span>
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-500"
                style={{ width: `${chaosIndex}%` }}
              />
            </div>
            <span className="text-amber-400 font-bold">{chaosIndex}%</span>
          </div>

          {/* Sound & Voice Toggles */}
          <div className="flex items-center space-x-1 bg-slate-900/80 border border-slate-800 rounded-xl p-1">
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-lg transition ${
                soundOn ? 'text-cyan-400 hover:bg-cyan-950/50' : 'text-slate-500 hover:text-slate-400'
              }`}
              title={soundOn ? 'SFX Enabled' : 'SFX Muted'}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleVoice}
              className={`p-1.5 rounded-lg transition ${
                voiceOn ? 'text-red-400 hover:bg-red-950/50' : 'text-slate-500 hover:text-slate-400'
              }`}
              title={voiceOn ? 'Big Boss Voice TTS Enabled' : 'Voice Muted'}
            >
              {voiceOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Broadcast Trigger Button */}
          <button
            onClick={onOpenBroadcast}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-chakra font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition transform active:scale-95"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Broadcast Decree</span>
          </button>
        </div>

      </div>
    </header>
  );
}
