import React, { useState } from 'react';
import { Skull, AlertOctagon, X, UserX, CheckCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function EvictionModal({
  isOpen,
  onClose,
  contestant,
  onConfirmEviction,
  currentDay = 22
}) {
  const [reason, setReason] = useState('Lowest audience votes in Week 4 Danger Zone');
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(null);

  if (!isOpen || !contestant) return null;

  const handleEvict = () => {
    setIsProcessing(true);
    soundManager.playBuzzer();
    setCountdown(3);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishEviction();
          return null;
        }
        soundManager.playTick();
        return prev - 1;
      });
    }, 900);
  };

  const finishEviction = () => {
    soundManager.playBuzzer();
    soundManager.speak(`${contestant.name}, aapka Tech House mein safar yahin samapt hota hai. You are officially evicted!`);
    onConfirmEviction(contestant.id, reason);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#12070c] border-2 border-red-600 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-[0_0_60px_rgba(239,68,68,0.5)] relative">
        <div className="flex items-center justify-between pb-4 border-b border-red-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-500 animate-pulse">
              <Skull className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider font-chakra">
                Execution of Eviction
              </h3>
              <p className="text-xs text-red-400 font-mono">Terminal Command: PERMANENT REMOVAL</p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {isProcessing ? (
          <div className="py-12 text-center space-y-4">
            <div className="text-7xl font-extrabold text-red-500 animate-ping font-chakra">
              {countdown}
            </div>
            <p className="text-sm font-mono text-red-300 tracking-wider uppercase animate-pulse">
              TERMINATING HOUSE PRIVILEGES FOR {contestant.name}...
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {/* Contestant Highlight */}
            <div className="bg-red-950/40 border border-red-600/40 rounded-xl p-4 flex items-center space-x-4">
              <img
                src={contestant.avatar}
                alt={contestant.name}
                className="w-14 h-14 rounded-xl object-cover border-2 border-red-500"
              />
              <div className="flex-1">
                <div className="font-bold text-base text-white">{contestant.name}</div>
                <div className="text-xs text-slate-300 font-mono">{contestant.team} • {contestant.points} pts</div>
                <div className="text-xs text-red-400 font-mono mt-1">Status: {contestant.status}</div>
              </div>
            </div>

            <div className="bg-amber-950/30 border border-amber-600/40 rounded-xl p-3 flex items-start space-x-2 text-xs text-amber-200">
              <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Warning:</strong> Evicting will immediately remove this contestant from active house dynamics, danger zone and the live leaderboard.
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Official Reason for Eviction:
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Eviction verdict reason..."
                className="w-full bg-[#080d1a] border border-slate-700 focus:border-red-500 rounded-xl p-2.5 text-sm text-white"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono uppercase rounded-xl transition"
              >
                Abort
              </button>
              <button
                type="button"
                onClick={handleEvict}
                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold text-xs uppercase font-mono tracking-wider rounded-xl shadow-lg shadow-red-600/40 flex items-center space-x-2 transition"
              >
                <UserX className="w-4 h-4" />
                <span>Confirm Eviction</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
