import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Crown, 
  Shield, 
  ShieldCheck, 
  AlertTriangle, 
  Skull, 
  Plus, 
  Minus, 
  Edit3, 
  Award, 
  Check, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { TEAMS } from '../data/initialData';
import { soundManager } from '../utils/audio';

export default function ContestantManagement({
  contestants,
  onOpenAddModal,
  onOpenEditModal,
  onOpenPointModal,
  onToggleImmunity,
  onToggleNomination,
  onAssignCaptain,
  onOpenEviction,
  onReviveContestant,
  onQuickPoints
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNominateClick = (c) => {
    if (c.status === 'Evicted') {
      showToast(`${c.name} is already evicted!`, true);
      soundManager.playDeduct();
      return;
    }
    if (c.isImmune) {
      showToast(`DENIED: ${c.name} has Immunity Shield and CANNOT be nominated!`, true);
      soundManager.playBuzzer();
      return;
    }
    if (c.isCaptain) {
      showToast(`DENIED: ${c.name} is the House Captain and is immune from nominations!`, true);
      soundManager.playBuzzer();
      return;
    }

    onToggleNomination(c.id);
    if (c.status !== 'Nominated') {
      showToast(`${c.name} is now nominated for the Danger Zone!`);
      soundManager.playBuzzer();
    } else {
      showToast(`${c.name} was removed from the Danger Zone.`);
    }
  };

  const handleImmunityClick = (c) => {
    if (c.status === 'Evicted') return;
    onToggleImmunity(c.id);
    if (!c.isImmune) {
      showToast(`Immunity Shield GRANTED to ${c.name}! Cannot be nominated.`);
      soundManager.playSuccess();
    } else {
      showToast(`Immunity Shield REVOKED for ${c.name}.`);
      soundManager.playDeduct();
    }
  };

  const filteredContestants = contestants.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = filterTeam === 'ALL' || c.team === filterTeam;
    const matchesStatus = filterStatus === 'ALL' || 
      (filterStatus === 'ACTIVE' && c.status !== 'Evicted') ||
      (filterStatus === 'NOMINATED' && c.status === 'Nominated') ||
      (filterStatus === 'IMMUNE' && c.isImmune) ||
      (filterStatus === 'CAPTAIN' && c.isCaptain) ||
      (filterStatus === 'EVICTED' && c.status === 'Evicted');

    return matchesSearch && matchesTeam && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl font-mono text-xs flex items-center space-x-3 border animate-bounce ${
          toastMessage.isError
            ? 'bg-red-950/90 border-red-500 text-red-200'
            : 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
        }`}>
          {toastMessage.isError ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <Sparkles className="w-4 h-4 text-emerald-400" />}
          <span className="font-semibold">{toastMessage.msg}</span>
        </div>
      )}

      {/* Control Header & Filters */}
      <div className="bg-[#0e1526] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold font-chakra text-white uppercase tracking-wider flex items-center space-x-2">
              <span>House Roster</span>
              <span className="text-xs bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded-full font-mono border border-cyan-500/30">
                {contestants.length} Enlisted
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Monitor active status, points, nominations, and captaincy rights
            </p>
          </div>

          <button
            onClick={onOpenAddModal}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-chakra font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-600/30 flex items-center justify-center space-x-2 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enlist New Contestant</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, role, team..."
              className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Team:</span>
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="flex-1 bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl px-2.5 py-2 text-xs text-white"
            >
              <option value="ALL">All Teams</option>
              {TEAMS.map((t) => (
                <option key={t.name} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl px-2.5 py-2 text-xs text-white"
            >
              <option value="ALL">All Statuses ({contestants.length})</option>
              <option value="ACTIVE">Active in House</option>
              <option value="NOMINATED">Danger Zone (Nominated)</option>
              <option value="IMMUNE">Immunity Shielded</option>
              <option value="CAPTAIN">House Captain</option>
              <option value="EVICTED">Evicted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contestant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredContestants.map((c) => {
          const isEvicted = c.status === 'Evicted';
          const isNominated = c.status === 'Nominated';
          const isCaptain = c.isCaptain;
          const isImmune = c.isImmune;

          return (
            <div
              key={c.id}
              className={`rounded-2xl border transition relative overflow-hidden flex flex-col justify-between shadow-xl ${
                isEvicted
                  ? 'bg-[#0a0709]/80 border-slate-800 opacity-75'
                  : isNominated
                  ? 'bg-gradient-to-b from-[#190910] to-[#0e1424] border-red-500/70 shadow-[0_0_20px_rgba(239,68,68,0.25)]'
                  : isCaptain
                  ? 'bg-gradient-to-b from-[#17130b] to-[#0e1424] border-amber-500/70 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                  : isImmune
                  ? 'bg-gradient-to-b from-[#071714] to-[#0e1424] border-emerald-500/70 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                  : 'bg-[#0e1526] border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Top Banner / Ribbon */}
              <div className="p-4 pb-2">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className={`w-14 h-14 rounded-xl object-cover border-2 ${
                          isEvicted
                            ? 'border-slate-700 grayscale'
                            : isCaptain
                            ? 'border-amber-400 shadow-md'
                            : isNominated
                            ? 'border-red-500'
                            : isImmune
                            ? 'border-emerald-400'
                            : 'border-slate-700'
                        }`}
                      />
                      {isCaptain && (
                        <div className="absolute -top-2 -right-2 bg-amber-500 text-black p-1 rounded-full shadow-lg">
                          <Crown className="w-3.5 h-3.5" />
                        </div>
                      )}
                      {isImmune && !isCaptain && (
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-black p-1 rounded-full shadow-lg">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      )}
                      {isNominated && (
                        <div className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full animate-pulse shadow-lg">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-chakra font-bold text-white text-base leading-tight truncate" title={c.name}>
                        {c.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{c.role}</p>
                      <div className="mt-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                          {c.team}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenEditModal(c)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Edit Contestant"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  {isEvicted ? (
                    <span className="px-2 py-0.5 rounded-md bg-red-950/80 border border-red-800 text-red-400 text-[10px] font-mono font-bold flex items-center space-x-1">
                      <Skull className="w-3 h-3" />
                      <span>EVICTED (Day {c.evictedDay || 'N/A'})</span>
                    </span>
                  ) : (
                    <>
                      {isCaptain && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[10px] font-mono font-bold flex items-center space-x-1">
                          <Crown className="w-3 h-3 text-amber-400" />
                          <span>CAPTAIN</span>
                        </span>
                      )}
                      {isImmune && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-bold flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>IMMUNE</span>
                        </span>
                      )}
                      {isNominated && (
                        <span className="px-2 py-0.5 rounded-md bg-red-600/30 border border-red-500 text-red-300 text-[10px] font-mono font-bold flex items-center space-x-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-red-400" />
                          <span>IN DANGER ZONE</span>
                        </span>
                      )}
                      {!isCaptain && !isImmune && !isNominated && (
                        <span className="px-2 py-0.5 rounded-md bg-cyan-950/50 border border-cyan-800 text-cyan-300 text-[10px] font-mono">
                          ACTIVE PLAYER
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Score & Tasks */}
                <div className="bg-[#080d1a] border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">POINTS BOUNTY</span>
                    <span className="font-mono font-black text-amber-400 text-base">{c.points} PTS</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono block">TASKS DONE</span>
                    <span className="font-mono font-bold text-slate-200 text-sm">{c.tasksCompleted || 0}</span>
                  </div>
                </div>

                {/* Bio or Nomination Reason */}
                {isNominated && c.nominationReason ? (
                  <div className="text-[11px] text-red-300/90 font-mono bg-red-950/40 p-2 rounded-lg border border-red-900/60 mb-3">
                    <strong>Nomination:</strong> {c.nominationReason}
                  </div>
                ) : isEvicted && c.evictionReason ? (
                  <div className="text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded-lg border border-slate-800 mb-3">
                    <strong>Eviction:</strong> {c.evictionReason}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 line-clamp-2 italic mb-3">
                    "{c.bio}"
                  </p>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-slate-900/80 border-t border-slate-800/80 space-y-2">
                {!isEvicted ? (
                  <>
                    {/* Points Controls: Quick + / - and Ledger */}
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onQuickPoints(c.id, 50, 'Quick merit bonus')}
                          className="px-2 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold rounded transition"
                          title="Quick +50 Points"
                        >
                          +50
                        </button>
                        <button
                          onClick={() => onQuickPoints(c.id, -25, 'Quick demerit penalty')}
                          className="px-2 py-1 bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 text-[10px] font-mono font-bold rounded transition"
                          title="Quick -25 Points"
                        >
                          -25
                        </button>
                      </div>

                      <button
                        onClick={() => onOpenPointModal(c.id)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-mono font-semibold rounded transition flex items-center space-x-1"
                      >
                        <Award className="w-3 h-3" />
                        <span>Ledger...</span>
                      </button>
                    </div>

                    {/* Operational Toggles: Captaincy, Immunity, Nomination, Evict */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      {/* Captaincy button */}
                      <button
                        onClick={() => onAssignCaptain(c.id)}
                        disabled={isCaptain}
                        className={`py-1 px-2 rounded text-[10px] font-mono font-bold flex items-center justify-center space-x-1 transition ${
                          isCaptain
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default'
                            : 'bg-slate-800 hover:bg-amber-950/60 hover:text-amber-300 text-slate-300 border border-slate-700'
                        }`}
                      >
                        <Crown className="w-3 h-3" />
                        <span>{isCaptain ? 'Is Captain' : 'Make Captain'}</span>
                      </button>

                      {/* Immunity toggle */}
                      <button
                        onClick={() => handleImmunityClick(c)}
                        disabled={isCaptain}
                        className={`py-1 px-2 rounded text-[10px] font-mono font-bold flex items-center justify-center space-x-1 transition ${
                          isImmune
                            ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                            : 'bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-300 border border-slate-700'
                        }`}
                        title={isCaptain ? 'Captain is permanently immune' : 'Toggle immunity shield'}
                      >
                        <Shield className="w-3 h-3" />
                        <span>{isImmune ? 'Immune ✓' : 'Grant Shield'}</span>
                      </button>

                      {/* Nomination toggle (Strict enforcement!) */}
                      <button
                        onClick={() => handleNominateClick(c)}
                        className={`py-1 px-2 rounded text-[10px] font-mono font-bold flex items-center justify-center space-x-1 transition ${
                          isNominated
                            ? 'bg-red-600 text-white shadow-md'
                            : isImmune || isCaptain
                            ? 'bg-slate-800/40 text-slate-500 border border-slate-800 cursor-not-allowed'
                            : 'bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-300 border border-slate-700'
                        }`}
                        title={isImmune || isCaptain ? 'Contestant is immune and cannot be nominated' : 'Toggle nomination'}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>{isNominated ? 'Remove Danger' : 'Nominate'}</span>
                      </button>

                      {/* Evict Trigger */}
                      <button
                        onClick={() => onOpenEviction(c)}
                        className="py-1 px-2 rounded text-[10px] font-mono font-bold bg-red-950/60 hover:bg-red-900 border border-red-500/40 hover:border-red-500 text-red-300 flex items-center justify-center space-x-1 transition"
                      >
                        <Skull className="w-3 h-3" />
                        <span>Evict...</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">Status: Evicted from House</span>
                    <button
                      onClick={() => onReviveContestant(c.id)}
                      className="px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold rounded flex items-center space-x-1 transition"
                      title="Recall as Wildcard Entry"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Wildcard Return</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
