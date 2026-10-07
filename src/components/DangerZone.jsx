import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Skull, 
  Flame, 
  Vote, 
  UserMinus, 
  ShieldCheck, 
  RefreshCw, 
  Radio, 
  Volume2,
  CheckCircle,
  XCircle,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function DangerZone({
  contestants,
  onOpenEviction,
  onToggleNomination,
  onUpdateNomineeVotes,
  onOpenPointModal
}) {
  const nominated = contestants.filter(c => c.status === 'Nominated');
  const eligibleToNominate = contestants.filter(c => c.status === 'Active' && !c.isImmune && !c.isCaptain);
  const immuneContestants = contestants.filter(c => c.isImmune || c.isCaptain);

  const [selectedToNominate, setSelectedToNominate] = useState('');
  const [nominationReason, setNominationReason] = useState('Consensus nomination for strategic conflict');
  const [feedback, setFeedback] = useState(null);

  const totalSimulatedVotes = nominated.reduce((acc, c) => acc + (c.dangerZoneVotes || 150), 0) || 1;

  const handleSimulateAudienceVotes = () => {
    soundManager.playGong();
    nominated.forEach(c => {
      const delta = Math.floor(Math.random() * 80) + 10;
      onUpdateNomineeVotes(c.id, delta);
    });
    setFeedback("Audience voting influx registered! Live vote shares updated.");
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleNominateSubmit = (e) => {
    e.preventDefault();
    if (!selectedToNominate) return;
    const target = contestants.find(c => c.id === selectedToNominate);
    if (!target) return;

    if (target.isImmune || target.isCaptain) {
      soundManager.playBuzzer();
      setFeedback(`ERROR: ${target.name} has Immunity Shield and CANNOT be nominated!`);
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    onToggleNomination(target.id, nominationReason);
    soundManager.playBuzzer();
    setFeedback(`${target.name} placed into Danger Zone!`);
    setSelectedToNominate('');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Danger Zone Alert Marquee Header */}
      <div className="bg-gradient-to-r from-red-950 via-[#18080f] to-red-950 border-2 border-red-600 rounded-2xl p-5 shadow-[0_0_35px_rgba(239,68,68,0.35)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Flame className="w-48 h-48 text-red-500" />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-red-600/30 border border-red-500 rounded-2xl text-red-500 animate-pulse shadow-lg">
              <Skull className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-black font-chakra text-white uppercase tracking-wider">
                  DANGER ZONE: EVICTION CHAMBER
                </h2>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
              </div>
              <p className="text-xs text-red-300 font-mono mt-0.5">
                Nominees in direct jeopardy. Big Boss audience voting and mandatory eviction tribunal active.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSimulateAudienceVotes}
              disabled={nominated.length === 0}
              className="px-4 py-2.5 bg-red-900/60 hover:bg-red-900 border border-red-500/80 disabled:opacity-40 text-red-200 font-chakra font-bold text-xs uppercase tracking-wider rounded-xl flex items-center space-x-1.5 transition shadow-lg"
            >
              <Vote className="w-4 h-4 text-red-400" />
              <span>Simulate Public Votes</span>
            </button>
            <button
              onClick={() => soundManager.playBuzzer()}
              className="p-2.5 bg-red-600/30 hover:bg-red-600/50 border border-red-500 rounded-xl text-red-300 transition"
              title="Test Danger Alarm"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="bg-red-900/80 border border-red-500 text-white px-4 py-2.5 rounded-xl font-mono text-xs flex items-center space-x-2 shadow-lg animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Nominated Contestants Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-chakra font-bold text-white uppercase text-base flex items-center space-x-2">
            <span>Nominated Housemates On The Chopping Block</span>
            <span className="text-xs bg-red-600 text-white px-2.5 py-0.5 rounded-full font-mono">
              {nominated.length} TARGETS
            </span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Lowest votes trigger elimination
          </span>
        </div>

        {nominated.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {nominated.map((c) => {
              const votes = c.dangerZoneVotes || 150;
              const votePercentage = Math.round((votes / totalSimulatedVotes) * 100);
              const isHighestRisk = votePercentage < 30;

              return (
                <div
                  key={c.id}
                  className="bg-gradient-to-b from-[#1c0a13] to-[#0d1222] border-2 border-red-500/80 rounded-2xl p-5 shadow-[0_0_25px_rgba(239,68,68,0.25)] flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 bg-red-950/80 border border-red-500 text-red-400 font-mono font-bold text-[10px] rounded-full animate-pulse">
                      NOMINEE
                    </span>
                  </div>

                  <div>
                    {/* Contestant Header */}
                    <div className="flex items-center space-x-3.5 mb-3">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-red-500 shadow-xl"
                      />
                      <div>
                        <h4 className="font-chakra font-bold text-white text-lg leading-tight">{c.name}</h4>
                        <p className="text-xs text-slate-400 font-mono">{c.role}</p>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 mt-1 inline-block">
                          {c.team}
                        </span>
                      </div>
                    </div>

                    {/* Grounds for nomination */}
                    <div className="bg-red-950/50 border border-red-900/80 rounded-xl p-3 mb-4 text-xs font-mono text-red-200">
                      <span className="text-red-400 font-bold block mb-0.5">NOMINATION GROUNDS:</span>
                      <p className="leading-relaxed">
                        {c.nominationReason || 'Nominated by house consensus for strategic conflict.'}
                      </p>
                    </div>

                    {/* Public Voting Progress */}
                    <div className="bg-black/50 border border-slate-800 rounded-xl p-3 mb-4">
                      <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                        <span className="text-slate-400 flex items-center space-x-1">
                          <Vote className="w-3.5 h-3.5 text-red-400" />
                          <span>Simulated Public Support:</span>
                        </span>
                        <strong className="text-red-300 font-bold">{votes} Votes ({votePercentage}%)</strong>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isHighestRisk ? 'bg-red-600 animate-pulse' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.max(10, votePercentage)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono mt-1 text-slate-500">
                        <span>Threat Level: {isHighestRisk ? 'CRITICAL EXTREME' : 'MODERATE RISK'}</span>
                        <span>Points: {c.points}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-red-950 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onToggleNomination(c.id)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl transition flex items-center space-x-1"
                      title="Withdraw from Danger Zone"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      <span>Pardon</span>
                    </button>

                    <button
                      onClick={() => onOpenEviction(c)}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-chakra font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/40 flex items-center space-x-1.5 transition"
                    >
                      <Skull className="w-4 h-4" />
                      <span>Execute Eviction</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#0e1526] border border-slate-800 rounded-2xl p-8 text-center text-slate-400 font-mono text-xs">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-chakra font-bold text-white mb-1">NO CONTESTANTS IN DANGER ZONE</p>
            <p className="text-slate-400 max-w-md mx-auto">
              All active housemates are safe from eviction. Use the form below to nominate eligible contestants.
            </p>
          </div>
        )}
      </div>

      {/* Nomination Form + Immunity Shield Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Quick Nominate Form */}
        <div className="bg-[#0e1526] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="font-chakra font-bold text-white uppercase text-base mb-1 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Nominate Housemate to Danger Zone</span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mb-4">
            Only non-immune contestants can be nominated under Big Boss Constitution
          </p>

          <form onSubmit={handleNominateSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Select Housemate:
              </label>
              <select
                value={selectedToNominate}
                onChange={(e) => setSelectedToNominate(e.target.value)}
                className="w-full bg-[#080d1a] border border-slate-700 focus:border-red-500 rounded-xl p-2.5 text-xs text-white"
              >
                <option value="">-- Choose eligible contestant ({eligibleToNominate.length} eligible) --</option>
                {eligibleToNominate.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.team}) — {c.points} pts
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Formal Justification / Charges:
              </label>
              <input
                type="text"
                value={nominationReason}
                onChange={(e) => setNominationReason(e.target.value)}
                placeholder="Reason for placing in Danger Zone..."
                className="w-full bg-[#080d1a] border border-slate-700 focus:border-red-500 rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedToNominate}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-chakra font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Submit Nomination Decree</span>
            </button>
          </form>
        </div>

        {/* Immunity Shield Protected Roster */}
        <div className="bg-[#0e1526] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="font-chakra font-bold text-white uppercase text-base mb-1 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Immunity Protection Shield Roster</span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mb-4">
            Protected from all Danger Zone nominations and instant evictions
          </p>

          <div className="space-y-2.5">
            {immuneContestants.map(c => (
              <div
                key={c.id}
                className="bg-emerald-950/20 border border-emerald-500/40 rounded-xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="w-9 h-9 rounded-full object-cover border border-emerald-400"
                  />
                  <div>
                    <div className="font-chakra font-bold text-white text-sm flex items-center space-x-1.5">
                      <span>{c.name}</span>
                      {c.isCaptain && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 rounded border border-amber-500/40">CAPTAIN</span>}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.team} • {c.points} pts</div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-emerald-400 font-mono text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>IMMUNE</span>
                </div>
              </div>
            ))}
            {immuneContestants.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400 font-mono">
                No contestants currently hold immunity shields.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
