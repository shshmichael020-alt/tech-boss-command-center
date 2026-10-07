import React, { useState } from 'react';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Award, 
  ArrowUp, 
  ArrowDown, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Minus,
  Download
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function Leaderboard({
  contestants,
  onOpenPointModal,
  onQuickPoints
}) {
  const [includeEvicted, setIncludeEvicted] = useState(false);

  // Filter contestants
  const displayedContestants = contestants.filter(c => includeEvicted || c.status !== 'Evicted');
  
  // Sort by points descending with deterministic tie-breaker
  const sorted = [...displayedContestants].sort((a, b) => 
    ((Number(b.points) || 0) - (Number(a.points) || 0)) || a.name.localeCompare(b.name)
  );
  
  const maxPoints = Math.max(1, Number(sorted[0]?.points) || 1000);
  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sorted, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Tech_House_Leaderboard_Day22.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Controls */}
      <div className="bg-[#0e1526] border border-amber-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-chakra text-white uppercase tracking-wider flex items-center space-x-2">
              <span>Official House Leaderboard</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono border border-amber-500/30">
                REAL-TIME RANKINGS
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Live standings computed dynamically by task performance and house bonuses
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={includeEvicted}
              onChange={(e) => setIncludeEvicted(e.target.checked)}
              className="w-3.5 h-3.5 text-amber-500 rounded bg-slate-800 border-slate-700 cursor-pointer"
            />
            <span>Include Evicted Players</span>
          </label>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-slate-200 rounded-xl flex items-center space-x-1.5 transition"
            title="Download Leaderboard JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Podium for Top Contenders */}
      {sorted.length >= 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          
          {/* 2nd Place */}
          {top2 && (
            <div className="order-2 md:order-1 bg-gradient-to-b from-[#141b2c] to-[#0a0f1d] border-2 border-slate-400/40 rounded-2xl p-5 text-center flex flex-col items-center justify-between shadow-lg relative transform md:translate-y-4">
              <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-900 font-chakra font-black text-sm flex items-center justify-center mb-2 shadow-md">
                2
              </div>
              <img
                src={top2.avatar}
                alt={top2.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-300 shadow-xl mb-3"
              />
              <div className="font-chakra font-bold text-lg text-white">{top2.name}</div>
              <div className="text-xs text-slate-400 font-mono">{top2.team}</div>
              <div className="mt-3 px-4 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 font-mono font-black text-slate-200 text-lg">
                {top2.points} <span className="text-xs text-slate-400 font-normal">PTS</span>
              </div>
              <div className="mt-3 flex items-center space-x-1">
                <button
                  onClick={() => onQuickPoints(top2.id, 50, 'Leaderboard quick award')}
                  className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold rounded"
                >
                  +50
                </button>
                <button
                  onClick={() => onQuickPoints(top2.id, -25, 'Leaderboard quick deduct')}
                  className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-mono font-bold rounded"
                >
                  -25
                </button>
              </div>
            </div>
          )}

          {/* 1st Place (Champion) */}
          {top1 && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-[#2a1e0b] to-[#0e1424] border-2 border-amber-400 rounded-2xl p-6 text-center flex flex-col items-center justify-between shadow-[0_0_40px_rgba(245,158,11,0.3)] relative transform md:-translate-y-2">
              <div className="absolute -top-3 px-3 py-0.5 bg-amber-500 text-black font-chakra font-black text-xs uppercase tracking-widest rounded-full shadow-lg flex items-center space-x-1">
                <Crown className="w-3.5 h-3.5" />
                <span>HOUSE LEADER</span>
              </div>

              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-900 font-chakra font-black text-lg flex items-center justify-center mb-2 shadow-lg mt-2">
                1
              </div>
              <img
                src={top1.avatar}
                alt={top1.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-amber-400 shadow-2xl mb-3"
              />
              <div className="font-chakra font-bold text-xl text-white flex items-center space-x-1.5">
                <span>{top1.name}</span>
                {top1.isCaptain && <Crown className="w-4 h-4 text-amber-400" />}
              </div>
              <div className="text-xs text-amber-300 font-mono">{top1.team}</div>
              <div className="mt-3 px-5 py-2 bg-amber-500/20 rounded-xl border border-amber-400/60 font-mono font-black text-amber-300 text-2xl shadow-inner">
                {top1.points} <span className="text-xs text-amber-400 font-normal">PTS</span>
              </div>
              <div className="mt-3 flex items-center space-x-1.5">
                <button
                  onClick={() => onQuickPoints(top1.id, 50, 'Leaderboard quick award')}
                  className="px-3 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold rounded"
                >
                  +50
                </button>
                <button
                  onClick={() => onQuickPoints(top1.id, -25, 'Leaderboard quick deduct')}
                  className="px-3 py-1 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-mono font-bold rounded"
                >
                  -25
                </button>
                <button
                  onClick={() => onOpenPointModal(top1.id)}
                  className="px-2.5 py-1 bg-amber-500/30 hover:bg-amber-500/40 border border-amber-500/60 text-amber-300 text-xs font-mono rounded"
                >
                  Ledger
                </button>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3 && (
            <div className="order-3 bg-gradient-to-b from-[#1b1411] to-[#0a0f1d] border-2 border-amber-700/50 rounded-2xl p-5 text-center flex flex-col items-center justify-between shadow-lg relative transform md:translate-y-6">
              <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-chakra font-black text-sm flex items-center justify-center mb-2 shadow-md">
                3
              </div>
              <img
                src={top3.avatar}
                alt={top3.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-700 shadow-xl mb-3"
              />
              <div className="font-chakra font-bold text-lg text-white">{top3.name}</div>
              <div className="text-xs text-slate-400 font-mono">{top3.team}</div>
              <div className="mt-3 px-4 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 font-mono font-black text-amber-500 text-lg">
                {top3.points} <span className="text-xs text-slate-400 font-normal">PTS</span>
              </div>
              <div className="mt-3 flex items-center space-x-1">
                <button
                  onClick={() => onQuickPoints(top3.id, 50, 'Leaderboard quick award')}
                  className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold rounded"
                >
                  +50
                </button>
                <button
                  onClick={() => onQuickPoints(top3.id, -25, 'Leaderboard quick deduct')}
                  className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-mono font-bold rounded"
                >
                  -25
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Complete Rankings Table */}
      <div className="bg-[#0e1526] border border-slate-800 rounded-2xl overflow-hidden shadow-xl mt-6">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-chakra font-bold text-white text-base uppercase tracking-wider">
            Complete Standings Roster
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {sorted.length} Housemates Ranked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Contestant</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">House Share</th>
                <th className="py-3 px-4 text-right">Points</th>
                <th className="py-3 px-4 text-center">Point Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {sorted.map((c, index) => {
                const percentage = Math.round((c.points / (maxPoints || 1)) * 100);
                const isEvicted = c.status === 'Evicted';

                return (
                  <tr
                    key={c.id}
                    className={`hover:bg-slate-800/40 transition ${
                      isEvicted ? 'opacity-50 bg-red-950/10' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-4">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-chakra font-bold text-xs ${
                        index === 0 ? 'bg-amber-400 text-slate-900' :
                        index === 1 ? 'bg-slate-300 text-slate-900' :
                        index === 2 ? 'bg-amber-700 text-white' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        #{index + 1}
                      </span>
                    </td>

                    {/* Contestant */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-chakra font-bold text-white text-sm flex items-center space-x-1.5">
                            <span>{c.name}</span>
                            {c.isCaptain && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <div className="text-[11px] text-slate-400">{c.role}</div>
                        </div>
                      </div>
                    </td>

                    {/* Team */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px]">
                        {c.team}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {isEvicted ? (
                        <span className="text-red-400 font-bold">EVICTED</span>
                      ) : c.isCaptain ? (
                        <span className="text-amber-400 font-bold flex items-center space-x-1">
                          <Crown className="w-3 h-3" />
                          <span>CAPTAIN</span>
                        </span>
                      ) : c.isImmune ? (
                        <span className="text-emerald-400 font-bold flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>IMMUNE</span>
                        </span>
                      ) : c.status === 'Nominated' ? (
                        <span className="text-red-400 font-bold flex items-center space-x-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          <span>DANGER</span>
                        </span>
                      ) : (
                        <span className="text-cyan-400">ACTIVE</span>
                      )}
                    </td>

                    {/* Progress Bar Share */}
                    <td className="py-3 px-4 w-48">
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            index === 0 ? 'bg-amber-400' :
                            index === 1 ? 'bg-slate-300' :
                            index === 2 ? 'bg-amber-600' : 'bg-cyan-500'
                          }`}
                          style={{ width: `${Math.max(5, percentage)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">{percentage}% of Leader</div>
                    </td>

                    {/* Points */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-chakra font-black text-amber-400 text-base">
                        {c.points} <span className="text-xs font-normal">PTS</span>
                      </div>
                    </td>

                    {/* Quick point adjustment buttons */}
                    <td className="py-3 px-4 text-center">
                      {!isEvicted ? (
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => onQuickPoints(c.id, 50, 'Quick add')}
                            className="p-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded transition"
                            title="+50 Points"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onQuickPoints(c.id, -25, 'Quick deduct')}
                            className="p-1 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 rounded transition"
                            title="-25 Points"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenPointModal(c.id)}
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-[10px] rounded transition"
                          >
                            Ledger
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-600">Locked</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
