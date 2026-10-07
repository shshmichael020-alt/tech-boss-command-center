import React from 'react';
import { 
  Crown, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Plus, 
  Megaphone, 
  Timer, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  Skull,
  RotateCcw,
  Activity,
  Radio
} from 'lucide-react';
import EyeLogo from './EyeLogo';

export const HOUSE_PHASES = [
  'HOUSE',
  'TASK',
  'RESULTS',
  'NOMINATION',
  'DANGER ZONE',
  'EVICTION',
  'FINAL'
];

export default function CommandHub({
  contestants,
  tasks,
  captain,
  announcements,
  housePhase = 'HOUSE',
  onPhaseChange,
  canUndo = false,
  onUndo,
  lastUndoAction = '',
  activityLogs = [],
  onOpenPointModal,
  onOpenTaskModal,
  onOpenContestantModal,
  onOpenCaptaincy,
  onOpenBroadcast,
  onOpenEviction,
  onSelectTab,
  onCompleteTask
}) {
  const activeContestants = contestants.filter(c => c.status !== 'Evicted');
  const nominatedContestants = contestants.filter(c => c.status === 'Nominated');
  const activeTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress');
  const topContestant = [...activeContestants].sort((a, b) => ((Number(b.points) || 0) - (Number(a.points) || 0)) || a.name.localeCompare(b.name))[0];
  const totalPoints = activeContestants.reduce((acc, c) => acc + (Number(c.points) || 0), 0);

  // Phase badge styles
  const phaseColors = {
    'HOUSE': 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    'TASK': 'bg-purple-950/80 border-purple-500/60 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]',
    'RESULTS': 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
    'NOMINATION': 'bg-amber-950/80 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
    'DANGER ZONE': 'bg-red-950/90 border-red-500 text-red-300 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]',
    'EVICTION': 'bg-rose-950/90 border-rose-500 text-rose-200 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)]',
    'FINAL': 'bg-yellow-950/90 border-yellow-400 text-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.4)]'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* FEATURE 1: CURRENT HOUSE PHASE CONTROL */}
      <div className="bg-[#0e1526] border border-cyan-500/40 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping inline-block" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-chakra font-black text-white text-base uppercase tracking-wider">
                  CURRENT HOUSE PHASE CONTROL
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 border border-cyan-500/40 text-cyan-300">
                  BIG BOSS COMMAND
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Dictate the active operational round across surveillance screens without altering house records
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Active Phase:</span>
            <span className={`px-3 py-1 rounded-xl text-xs font-chakra font-black tracking-widest uppercase border ${phaseColors[housePhase] || phaseColors['HOUSE']}`}>
              {housePhase}
            </span>
          </div>
        </div>

        {/* Phase Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
          {HOUSE_PHASES.map((p) => {
            const isActive = housePhase === p;
            return (
              <button
                key={p}
                onClick={() => onPhaseChange && onPhaseChange(p)}
                className={`py-2 px-2 rounded-xl text-xs font-chakra font-bold tracking-wider uppercase border transition text-center cursor-pointer ${
                  isActive
                    ? `${phaseColors[p] || phaseColors['HOUSE']} font-black ring-1 ring-white/20`
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0e1526] border border-cyan-500/30 rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="text-xs font-mono uppercase text-slate-400">Active Housemates</div>
          <div className="text-3xl font-extrabold text-white mt-1 font-chakra flex items-baseline justify-between">
            <span>{activeContestants.length}</span>
            <span className="text-xs text-cyan-400 font-mono">/ {contestants.length} Total</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>{contestants.filter(c => c.status === 'Evicted').length} Evicted</span>
          </div>
        </div>

        <div className="bg-[#0e1526] border border-amber-500/30 rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="text-xs font-mono uppercase text-slate-400">Total House Bounty</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1 font-chakra">
            {totalPoints.toLocaleString()} <span className="text-xs text-amber-500">PTS</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Leader: {topContestant ? topContestant.name.split(' ')[0] : 'None'}</span>
          </div>
        </div>

        <div className="bg-[#0e1526] border border-red-500/40 rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="text-xs font-mono uppercase text-red-400 flex items-center justify-between">
            <span>Danger Zone</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <div className="text-3xl font-extrabold text-red-400 mt-1 font-chakra">
            {nominatedContestants.length} <span className="text-xs text-red-500">NOMINEES</span>
          </div>
          <div className="text-[11px] text-red-300/80 mt-2 flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Eviction vote in progress</span>
          </div>
        </div>

        <div className="bg-[#0e1526] border border-purple-500/30 rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="text-xs font-mono uppercase text-slate-400">Live House Tasks</div>
          <div className="text-3xl font-extrabold text-purple-400 mt-1 font-chakra">
            {activeTasks.length} <span className="text-xs text-purple-500">PENDING</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            <span>{tasks.filter(t => t.status === 'Completed').length} Completed</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Captain's Suite + Danger Zone Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Captain's Command Suite */}
        <div className="bg-gradient-to-b from-[#17130b] to-[#0d1222] border-2 border-amber-500/50 rounded-2xl p-5 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Crown className="w-32 h-32 text-amber-500" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-chakra font-bold text-white uppercase text-base">House Captain Suite</h3>
                  <span className="text-[11px] font-mono text-amber-400/90">Supreme Authority & Immunity</span>
                </div>
              </div>
              <button
                onClick={onOpenCaptaincy}
                className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg font-mono transition cursor-pointer"
              >
                Change Captain
              </button>
            </div>

            {captain ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-black/40 p-3.5 rounded-xl border border-amber-500/30">
                  <img
                    src={captain.avatar}
                    alt={captain.name}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400 shadow-md"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-white font-chakra">{captain.name}</h4>
                    <p className="text-xs text-amber-300 font-mono">{captain.role}</p>
                    <div className="flex items-center space-x-2 mt-1.5">
                      <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-[10px] font-mono text-purple-300">
                        {captain.team}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold">
                        {captain.points} PTS
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-mono text-slate-300 bg-black/30 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>IMMUNITY PROTOCOL ACTIVE</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Captain cannot be nominated in Danger Zone. Captain votes carry 2x weight in tiebreakers.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400 mb-3">No House Captain appointed yet.</p>
                <button
                  onClick={onOpenCaptaincy}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase rounded-xl transition cursor-pointer"
                >
                  Appoint Captain
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">Tasks Lead: {captain ? captain.tasksCompleted : 0} Done</span>
            <button
              onClick={() => onOpenPointModal(captain ? captain.id : null)}
              className="text-amber-400 hover:text-amber-300 font-mono flex items-center space-x-1 cursor-pointer"
            >
              <span>Award Captain Bonus</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center & Right Col: Danger Zone Alert & Live Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Danger Zone High-Priority Module */}
          <div className="bg-[#140b12] border-2 border-red-500/60 rounded-2xl p-5 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-red-600/20 border border-red-500/50 text-red-500 animate-pulse">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-chakra font-bold text-white uppercase text-base flex items-center space-x-2">
                    <span>Active Danger Zone Nominees</span>
                    <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-mono">
                      {nominatedContestants.length} ON THE BLOCK
                    </span>
                  </h3>
                  <span className="text-[11px] font-mono text-red-400">One contestant faces mandatory eviction</span>
                </div>
              </div>
              <button
                onClick={() => onSelectTab('danger')}
                className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center space-x-1 cursor-pointer"
              >
                <span>Full Danger Control</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {nominatedContestants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {nominatedContestants.map((c) => (
                  <div
                    key={c.id}
                    className="bg-black/50 border border-red-500/40 hover:border-red-500 rounded-xl p-3 flex flex-col justify-between transition group"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-10 h-10 rounded-lg object-cover border border-red-500 group-hover:scale-105 transition"
                      />
                      <div className="truncate">
                        <div className="font-bold text-white text-sm truncate font-chakra">{c.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{c.team}</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-red-300/80 font-mono bg-red-950/40 p-1.5 rounded mb-2.5 truncate" title={c.nominationReason || 'Nominated by house consensus'}>
                      ⚠️ {c.nominationReason || 'Nominated by house consensus'}
                    </div>
                    <button
                      onClick={() => onOpenEviction(c)}
                      className="w-full py-1.5 bg-red-600/80 hover:bg-red-600 text-white font-chakra font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center space-x-1 transition cursor-pointer"
                    >
                      <Skull className="w-3.5 h-3.5" />
                      <span>Evict Contestant</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-black/30 rounded-xl border border-slate-800 text-slate-400 text-xs font-mono">
                No contestants currently in Danger Zone. All housemates are safe.
              </div>
            )}
          </div>

          {/* Quick Action Control Strip with UNDO button */}
          <div className="bg-[#0e1526] border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                Big Boss Master Shortcuts
              </div>
              
              {/* FEATURE 2: Undo action indicator */}
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold border transition ${
                  canUndo
                    ? 'bg-amber-950/60 hover:bg-amber-900 border-amber-500/70 text-amber-300 cursor-pointer shadow-md'
                    : 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
                }`}
                title={canUndo ? `Undo: ${lastUndoAction}` : 'History empty'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>UNDO ACTION</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              <button
                onClick={() => onOpenPointModal(null)}
                className="p-3 rounded-xl bg-slate-900 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/50 text-left transition group cursor-pointer"
              >
                <div className="text-cyan-400 mb-1 group-hover:scale-110 transition origin-left">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="font-chakra font-bold text-white text-xs uppercase">Point Ledger</div>
                <div className="text-[10px] text-slate-400 font-mono">Add/Deduct Score</div>
              </button>

              <button
                onClick={onOpenTaskModal}
                className="p-3 rounded-xl bg-slate-900 hover:bg-purple-950/50 border border-slate-800 hover:border-purple-500/50 text-left transition group cursor-pointer"
              >
                <div className="text-purple-400 mb-1 group-hover:scale-110 transition origin-left">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="font-chakra font-bold text-white text-xs uppercase">Dispatch Task</div>
                <div className="text-[10px] text-slate-400 font-mono">Assign new challenge</div>
              </button>

              <button
                onClick={() => onSelectTab('timer')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-amber-950/50 border border-slate-800 hover:border-amber-500/50 text-left transition group cursor-pointer"
              >
                <div className="text-amber-400 mb-1 group-hover:scale-110 transition origin-left">
                  <Timer className="w-5 h-5" />
                </div>
                <div className="font-chakra font-bold text-white text-xs uppercase">Task Timer</div>
                <div className="text-[10px] text-slate-400 font-mono">Countdown clock</div>
              </button>

              <button
                onClick={() => onOpenContestantModal()}
                className="p-3 rounded-xl bg-slate-900 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/50 text-left transition group cursor-pointer"
              >
                <div className="text-emerald-400 mb-1 group-hover:scale-110 transition origin-left">
                  <Users className="w-5 h-5" />
                </div>
                <div className="font-chakra font-bold text-white text-xs uppercase">Enlist Player</div>
                <div className="text-[10px] text-slate-400 font-mono">Add new housemate</div>
              </button>

              <button
                onClick={() => onSelectTab('analytics')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-500/50 text-left transition group cursor-pointer col-span-2 sm:col-span-1"
              >
                <div className="text-rose-400 mb-1 group-hover:scale-110 transition origin-left">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="font-chakra font-bold text-white text-xs uppercase">Analytics</div>
                <div className="text-[10px] text-slate-400 font-mono">Deep Telemetry</div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Lower Row: Active Tasks HQ Preview + Live Action Log Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Tasks Widget */}
        <div className="bg-[#0e1526] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-purple-400" />
              <h3 className="font-chakra font-bold text-white uppercase text-base">Active House Directives</h3>
            </div>
            <button
              onClick={() => onSelectTab('tasks')}
              className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center space-x-1 cursor-pointer"
            >
              <span>View All ({tasks.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 rounded-xl p-3.5 flex items-center justify-between gap-3 transition"
              >
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-2">
                    <span className="font-chakra font-bold text-sm text-white truncate">{task.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-500/30">
                      +{task.points} PTS
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    Assigned: <strong className="text-slate-200">{task.assignedTo}</strong> • {task.difficulty}
                  </div>
                </div>

                <button
                  onClick={() => onCompleteTask(task.id)}
                  className="px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-mono font-bold rounded-lg shrink-0 transition flex items-center space-x-1 shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Award & Complete</span>
                </button>
              </div>
            ))}
            {activeTasks.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400 font-mono">
                No tasks currently active. Use "Dispatch Task" to create one.
              </div>
            )}
          </div>
        </div>

        {/* Live Action Log Snippet */}
        <div className="bg-[#0e1526] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-amber-400" />
              <h3 className="font-chakra font-bold text-white uppercase text-base">Live Action Stream</h3>
            </div>
            <button
              onClick={() => onSelectTab('stats')}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
            >
              <span>Full Audit ({activityLogs.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {activityLogs.slice(0, 4).map((log, index) => (
              <div
                key={log.id || index}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-start justify-between gap-3"
              >
                <div className="flex items-start space-x-2.5">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold shrink-0 mt-0.5 ${
                    log.category === 'POINTS' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                    log.category === 'TASKS' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' :
                    log.category === 'CAPTAINCY' ? 'bg-yellow-950 text-yellow-300 border border-yellow-500/40' :
                    log.category === 'IMMUNITY' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                    log.category === 'NOMINATIONS' ? 'bg-red-950 text-red-300 border border-red-500/40' :
                    log.category === 'EVICTIONS' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                    'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {log.category || 'SYSTEM'}
                  </span>
                  <div>
                    <div className="font-mono text-xs text-white font-semibold">{log.action}</div>
                    {log.details && (
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{log.details}</div>
                    )}
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
