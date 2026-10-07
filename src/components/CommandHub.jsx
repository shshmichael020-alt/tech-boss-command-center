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
  Skull
} from 'lucide-react';
import EyeLogo from './EyeLogo';

export default function CommandHub({
  contestants,
  tasks,
  captain,
  announcements,
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

  return (
    <div className="space-y-6 animate-fade-in">
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
                className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg font-mono transition"
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
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase rounded-xl transition"
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
              className="text-amber-400 hover:text-amber-300 font-mono flex items-center space-x-1"
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
                className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center space-x-1"
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
                      className="w-full py-1.5 bg-red-600/80 hover:bg-red-600 text-white font-chakra font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center space-x-1 transition"
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

          {/* Quick Action Control Strip */}
          <div className="bg-[#0e1526] border border-slate-800 rounded-2xl p-4">
            <div className="text-xs font-mono uppercase text-slate-400 mb-3 tracking-wider">
              Big Boss Master Shortcuts
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => onOpenPointModal(null)}
                className="p-3 rounded-xl bg-slate-900 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/50 text-left transition group"
              >
                <div className="text-cyan-400 mb-1 group-hover:scale-110 transition origin-left">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="font-chakra font-bold text-white text-xs uppercase">Point Ledger</div>
                <div className="text-[10px] text-slate-400 font-mono">Add/Deduct Score</div>
              </button>

              <button
                onClick={onOpenTaskModal}
                className="p-3 rounded-xl bg-slate-900 hover:bg-purple-950/50 border border-slate-800 hover:border-purple-500/50 text-left transition group"
              >
                <div className="text-purple-400 mb-1 group-hover:scale-110 transition origin-left">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="font-chakra font-bold text-white text-xs uppercase">Dispatch Task</div>
                <div className="text-[10px] text-slate-400 font-mono">Assign new challenge</div>
              </button>

              <button
                onClick={() => onSelectTab('timer')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-amber-950/50 border border-slate-800 hover:border-amber-500/50 text-left transition group"
              >
                <div className="text-amber-400 mb-1 group-hover:scale-110 transition origin-left">
                  <Timer className="w-5 h-5" />
                </div>
                <div className="font-chakra font-bold text-white text-xs uppercase">Task Timer</div>
                <div className="text-[10px] text-slate-400 font-mono">Countdown clock</div>
              </button>

              <button
                onClick={onOpenContestantModal}
                className="p-3 rounded-xl bg-slate-900 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/50 text-left transition group"
              >
                <div className="text-emerald-400 mb-1 group-hover:scale-110 transition origin-left">
                  <Users className="w-5 h-5" />
                </div>
                <div className="font-chakra font-bold text-white text-xs uppercase">Enlist Player</div>
                <div className="text-[10px] text-slate-400 font-mono">Add new housemate</div>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Lower Row: Active Tasks HQ Preview + Leaderboard Snippet */}
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
              className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center space-x-1"
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
                  className="px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-mono font-bold rounded-lg shrink-0 transition flex items-center space-x-1 shadow-md"
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

        {/* Top 4 Leaderboard Snippet */}
        <div className="bg-[#0e1526] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h3 className="font-chakra font-bold text-white uppercase text-base">Top Contenders Live</h3>
            </div>
            <button
              onClick={() => onSelectTab('leaderboard')}
              className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center space-x-1"
            >
              <span>Full Standings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {[...activeContestants]
              .sort((a, b) => b.points - a.points)
              .slice(0, 4)
              .map((c, index) => (
                <div
                  key={c.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-chakra font-bold text-xs ${
                      index === 0 ? 'bg-amber-500 text-black' :
                      index === 1 ? 'bg-slate-300 text-black' :
                      index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{index + 1}
                    </span>
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="font-chakra font-bold text-sm text-white flex items-center space-x-1.5">
                        <span>{c.name}</span>
                        {c.isCaptain && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{c.team}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-amber-400 text-sm">{c.points} PTS</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.tasksCompleted} Tasks</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}
