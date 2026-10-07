import React, { useState } from 'react';
import { Crown, X, Shield, Sparkles, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

export default function CaptaincyModal({
  isOpen,
  onClose,
  contestants,
  currentCaptain,
  onAssignCaptain
}) {
  const [selectedId, setSelectedId] = useState(currentCaptain ? currentCaptain.id : '');

  if (!isOpen) return null;

  const eligibleContestants = contestants.filter(c => c.status !== 'Evicted');

  const handleConfirm = () => {
    if (!selectedId) return;
    const target = eligibleContestants.find(c => c.id === selectedId);
    if (!target) return;

    soundManager.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn(e);
    }

    onAssignCaptain(selectedId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0e1424] border border-amber-500/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider font-chakra">
                House Captaincy Chamber
              </h3>
              <p className="text-xs text-slate-400">Bestow the Golden Crown and Immunity Shield</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {currentCaptain && (
            <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={currentCaptain.avatar}
                  alt={currentCaptain.name}
                  className="w-10 h-10 rounded-full border border-amber-400 object-cover"
                />
                <div>
                  <div className="text-xs text-amber-300 font-mono">INCUMBENT HOUSE CAPTAIN</div>
                  <div className="font-bold text-white text-sm">{currentCaptain.name}</div>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold rounded-lg flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>IMMUNE</span>
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
              Select New House Captain:
            </label>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {eligibleContestants.map(c => {
                const isSelected = selectedId === c.id;
                const isCurrent = currentCaptain?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                      isSelected
                        ? 'border-amber-500 bg-amber-950/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-200 flex items-center space-x-2">
                          <span>{c.name}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-amber-900/70 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40 font-mono">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          {c.team} • {c.points} pts
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 leading-relaxed font-mono">
            💡 <strong className="text-amber-400">Captain's Prerogatives:</strong>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-300">
              <li>Automatic Immunity Shield (exempt from Danger Zone nominations)</li>
              <li>Sole authority to break ties during House Tasks</li>
              <li>Direct liaison with Big Boss Command</li>
            </ul>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono uppercase rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase font-mono tracking-wider rounded-xl shadow-lg shadow-amber-500/30 flex items-center space-x-2 transition"
            >
              <Crown className="w-4 h-4 text-black" />
              <span>Inaugurate Captain</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
