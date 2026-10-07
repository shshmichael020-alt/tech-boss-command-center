import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer as TimerIcon, 
  Bell, 
  Volume2, 
  Plus, 
  Minus,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function TaskTimer({ onAnnounceTimerDone }) {
  const [totalSeconds, setTotalSeconds] = useState(300); // 5 minutes default
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [taskName, setTaskName] = useState('Critical Hackathon Challenge Sprint');

  // Handle countdown
  useEffect(() => {
    let interval = null;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          if (prev <= 6) {
            soundManager.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else if (remainingSeconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  const handleTimerComplete = () => {
    soundManager.playBuzzer();
    soundManager.speak("Housemates, samay samapt! Time is up for the task!");
    if (onAnnounceTimerDone) {
      onAnnounceTimerDone(`Task Timer Expired for: ${taskName}`);
    }
  };

  const handleStart = () => {
    if (remainingSeconds === 0) {
      setRemainingSeconds(totalSeconds);
    }
    soundManager.init();
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  const handleSetPreset = (secs, name) => {
    setIsRunning(false);
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    if (name) setTaskName(name);
  };

  const handleAddMinutes = (mins) => {
    const additional = mins * 60;
    const nextTotal = Math.max(10, remainingSeconds + additional);
    setRemainingSeconds(nextTotal);
    setTotalSeconds(Math.max(totalSeconds, nextTotal));
  };

  // Format mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
  const isDanger = remainingSeconds <= 30 && remainingSeconds > 0;
  const isFinished = remainingSeconds === 0;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Timer Console Card */}
      <div className={`bg-gradient-to-b from-[#0e162b] to-[#070b16] border-2 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center transition-all duration-500 ${
        isFinished
          ? 'border-red-600 shadow-[0_0_50px_rgba(239,68,68,0.5)]'
          : isDanger
          ? 'border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.4)] animate-pulse'
          : isRunning
          ? 'border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.3)]'
          : 'border-slate-800'
      }`}>
        
        {/* Header Task Label */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-400 mb-3">
            <TimerIcon className="w-3.5 h-3.5" />
            <span>BIG BOSS PRECISION TASK CLOCK</span>
          </div>
          
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Name of active House Task..."
            className="w-full max-w-lg mx-auto text-center bg-transparent border-b border-slate-800 focus:border-cyan-500 text-lg sm:text-xl font-chakra font-bold text-white focus:outline-none py-1"
          />
        </div>

        {/* Big Giant Digital Display */}
        <div className="py-6 sm:py-8 my-2">
          <div className={`font-chakra font-black tracking-widest transition-all select-none text-7xl sm:text-9xl ${
            isFinished
              ? 'text-red-500 animate-bounce'
              : isDanger
              ? 'text-red-400'
              : isRunning
              ? 'text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]'
              : 'text-slate-200'
          }`}>
            {formatTime(remainingSeconds)}
          </div>
          
          <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mt-2">
            {isFinished ? 'STATUS: TIME EXPIRED • BUZZER TRIGGERED' : isRunning ? 'STATUS: TASK COUNTDOWN IN PROGRESS' : 'STATUS: TIMER PAUSED'}
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFinished
                  ? 'bg-red-600'
                  : isDanger
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span>Elapsed: {Math.round(progress)}%</span>
            <span>Target: {formatTime(totalSeconds)}</span>
          </div>
        </div>

        {/* Primary Controls: Start / Pause / Reset */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-chakra font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center space-x-2 transition transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{remainingSeconds < totalSeconds && remainingSeconds > 0 ? 'Resume Timer' : 'Start Countdown'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-chakra font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/30 flex items-center space-x-2 transition transform hover:scale-105 active:scale-95"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause Timer</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-chakra font-bold text-sm uppercase tracking-wider rounded-2xl border border-slate-700 flex items-center space-x-2 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => handleAddMinutes(1)}
            className="px-4 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-300 font-mono text-xs rounded-2xl transition flex items-center space-x-1"
            title="Add +1 Minute"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>1 Min</span>
          </button>

          <button
            onClick={() => soundManager.playBuzzer()}
            className="p-3.5 bg-red-950/60 hover:bg-red-900 border border-red-500/50 text-red-300 rounded-2xl transition"
            title="Manual Buzzer Test"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets Section */}
        <div className="pt-6 border-t border-slate-800/80">
          <div className="text-xs font-mono uppercase text-slate-400 mb-3 tracking-wider">
            Quick Preset Challenge Timers:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: '1 Min Blitz', secs: 60, name: '1-Minute Rapid Fire Hack' },
              { label: '3 Mins Sprint', secs: 180, name: '3-Minute Live Code Relay' },
              { label: '5 Mins Standard', secs: 300, name: '5-Minute Vulnerability Patch' },
              { label: '10 Mins Debate', secs: 600, name: '10-Minute Nominations Debate' },
              { label: '15 Mins Hack', secs: 900, name: '15-Minute Architecture Defense' },
              { label: '30 Mins Epic', secs: 1800, name: '30-Minute Captaincy Showdown' },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSetPreset(p.secs, p.name)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition ${
                  totalSeconds === p.secs
                    ? 'border-cyan-500 bg-cyan-950/60 text-cyan-200 font-bold'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
