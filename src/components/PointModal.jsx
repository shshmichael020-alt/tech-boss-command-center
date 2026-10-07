import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, Award, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

export default function PointModal({
  isOpen,
  onClose,
  contestants,
  selectedContestantId,
  onAdjustPoints
}) {
  const [contestantId, setContestantId] = useState('');
  const [pointsDelta, setPointsDelta] = useState(50);
  const [isDeduct, setIsDeduct] = useState(false);
  const [reason, setReason] = useState('Outstanding performance in House Coding Task');

  useEffect(() => {
    if (selectedContestantId) {
      setContestantId(selectedContestantId);
    } else if (contestants.length > 0 && !contestantId) {
      setContestantId(contestants[0].id);
    }
  }, [selectedContestantId, contestants]);

  if (!isOpen) return null;

  const currentContestant = contestants.find(c => c.id === contestantId);

  const presetReasons = [
    { label: "Task Winner Bonus", text: "Won the House Technical Sprint Challenge", type: "add" },
    { label: "Captaincy Star Duty", text: "Exemplary execution of Captain's orders", type: "add" },
    { label: "Secret Task Accomplished", text: "Successfully completed secret Big Boss directive", type: "add" },
    { label: "Rule Breach: Mic Protocol", text: "Talking without clip-on microphone", type: "deduct" },
    { label: "Disobeying House Captain", text: "Refusal to participate in allocated household duty", type: "deduct" },
    { label: "Code Sabotage / Slacking", text: "Negative score incurred during live server hackathon", type: "deduct" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contestantId) return;

    const amount = Number(pointsDelta);
    if (isNaN(amount) || amount === 0) return;

    const finalAmount = isDeduct ? -Math.abs(amount) : Math.abs(amount);

    if (finalAmount > 0) {
      soundManager.playSuccess();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (err) {
        console.warn(err);
      }
    } else {
      soundManager.playDeduct();
    }

    onAdjustPoints(contestantId, finalAmount, reason);
    onClose();
  };

  const handleSelectPresetReason = (p) => {
    setReason(p.text);
    if (p.type === 'deduct') {
      setIsDeduct(true);
    } else {
      setIsDeduct(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0e1424] border border-cyan-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider font-chakra">
                Big Boss Point Ledger
              </h3>
              <p className="text-xs text-slate-400">Award merits or enforce demerit penalties</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Contestant Selector */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Select Housemate:
            </label>
            <select
              value={contestantId}
              onChange={(e) => setContestantId(e.target.value)}
              className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white"
            >
              {contestants
                .filter(c => c.status !== 'Evicted')
                .map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.team}) — Current: {c.points} pts
                  </option>
                ))}
            </select>
          </div>

          {currentContestant && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Current Balance:</span>
              <span className="text-emerald-400 font-bold text-sm">{currentContestant.points} pts</span>
            </div>
          )}

          {/* Mode: Add or Deduct */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsDeduct(false)}
              className={`py-2.5 rounded-xl border flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider transition ${
                !isDeduct
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Award Points (+)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDeduct(true)}
              className={`py-2.5 rounded-xl border flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider transition ${
                isDeduct
                  ? 'bg-red-950/70 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <MinusCircle className="w-4 h-4 text-red-400" />
              <span>Deduct Points (-)</span>
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Point Presets:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 25, 50, 100].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPointsDelta(val)}
                  className={`py-2 rounded-lg border text-xs font-bold font-mono transition ${
                    pointsDelta === val
                      ? isDeduct
                        ? 'border-red-500 bg-red-900/50 text-red-200'
                        : 'border-emerald-500 bg-emerald-900/50 text-emerald-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {isDeduct ? `-${val}` : `+${val}`}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Points Input */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Custom Points Amount:
            </label>
            <input
              type="number"
              min="1"
              value={pointsDelta}
              onChange={(e) => setPointsDelta(Number(e.target.value))}
              className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white font-mono"
            />
          </div>

          {/* Preset Reasons */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Common Grounds / Incident Templates:
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-28 overflow-y-auto pr-1">
              {presetReasons.map((pr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPresetReason(pr)}
                  className="text-left text-xs p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 truncate"
                  title={pr.text}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Ledger Justification / Reason:
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Broken rule, won secret task..."
              className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono uppercase rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 font-bold text-xs uppercase font-mono tracking-wider rounded-xl shadow-lg transition flex items-center space-x-2 ${
                isDeduct
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isDeduct ? `Deduct ${pointsDelta} Points` : `Award +${pointsDelta} Points`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
