import React from 'react';
import { 
  BarChart3, 
  Crown, 
  Trophy, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  Flame, 
  Activity, 
  RotateCcw,
  ShieldCheck,
  TrendingDown,
  Layers
} from 'lucide-react';
import { TEAMS } from '../data/initialData';

export default function HouseStats({
  contestants,
  tasks,
  captain,
  activityLogs = [],
  onResetData
}) {
  const activeContestants = contestants.filter(c => c.status !== 'Evicted');
  const evictedContestants = contestants.filter(c => c.status === 'Evicted');
  const nominees = contestants.filter(c => c.status === 'Nominated');
  const immune = contestants.filter(c => c.isImmune);

  // Highest & Lowest
  const sortedActive = [...activeContestants].sort((a, b) => b.points - a.points);
  const highestScorer = sortedActive[0];
  const lowestScorer = sortedActive[sortedActive.length - 1];

  // Tasks metrics
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Team Aggregates
  const teamStats = TEAMS.map(team => {
    const members = contestants.filter(c => c.team === team.name && c.status !== 'Evicted');
    const totalPts = members.reduce((sum, c) => sum + c.points, 0);
    const avgPts = members.length > 0 ? Math.round(totalPts / members.length) : 0;
    return {
      ...team,
      memberCount: members.length,
      totalPts,
      avgPts
    };
  }).sort((a, b) => b.totalPts - a.totalPts);

  const totalPointsInHouse = activeContestants.reduce((sum, c) => sum + c.points, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-[#0e1526] border border-cyan-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/20 border border-cyan-500/40 rounded-xl text-cyan-400">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-chakra text-white uppercase tracking-wider flex items-center space-x-2">
              <span>House Intelligence & Analytics</span>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono border border-cyan-500/30">
                LIVE METRICS
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Aggregate house analytics, team rivalry standings, and audit logs
            </p>
          </div>
        </div>

        <button
          onClick={onResetData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono font-bold rounded-xl flex items-center space-x-1.5 transition"
          title="Reset back to default Big Boss template state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample House</span>
        </button>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Highest Scorer (MVP) */}
        <div className="bg-gradient-to-b from-[#1f190b] to-[#0e1424] border border-amber-500/50 rounded-2xl p-4 shadow-lg flex items-center space-x-3.5">
          <div className="relative">
            <img
              src={highestScorer?.avatar}
              alt={highestScorer?.name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-amber-400"
            />
            <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black p-0.5 rounded-full">
              <Trophy className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="truncate">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">MVP OF THE HOUSE</span>
            <div className="font-chakra font-bold text-white text-base truncate">{highestScorer?.name}</div>
            <div className="text-xs font-mono text-amber-300 font-black">{highestScorer?.points} PTS</div>
          </div>
        </div>

        {/* Lowest Scorer (In Jeopardy) */}
        <div className="bg-gradient-to-b from-[#1c0c11] to-[#0e1424] border border-red-500/50 rounded-2xl p-4 shadow-lg flex items-center space-x-3.5">
          <div className="relative">
            <img
              src={lowestScorer?.avatar}
              alt={lowestScorer?.name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-red-500"
            />
            <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white p-0.5 rounded-full">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="truncate">
            <span className="text-[10px] font-mono uppercase text-red-400 font-bold block">LOWEST HOUSE SCORE</span>
            <div className="font-chakra font-bold text-white text-base truncate">{lowestScorer?.name}</div>
            <div className="text-xs font-mono text-red-300 font-black">{lowestScorer?.points} PTS</div>
          </div>
        </div>

        {/* Reigning Captain */}
        <div className="bg-gradient-to-b from-[#181309] to-[#0e1424] border border-amber-500/40 rounded-2xl p-4 shadow-lg flex items-center space-x-3.5">
          <div className="relative">
            <img
              src={captain?.avatar}
              alt={captain?.name}
              className="w-14 h-14 rounded-xl object-cover border-2 border-amber-400"
            />
            <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black p-0.5 rounded-full">
              <Crown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="truncate">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">HOUSE CAPTAIN</span>
            <div className="font-chakra font-bold text-white text-base truncate">{captain ? captain.name : 'Unassigned'}</div>
            <div className="text-xs font-mono text-amber-300 font-bold">{captain ? `${captain.team}` : 'No Captain'}</div>
          </div>
        </div>

        {/* Tasks Completion Rate */}
        <div className="bg-gradient-to-b from-[#0b1b17] to-[#0e1424] border border-emerald-500/40 rounded-2xl p-4 shadow-lg flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">TASK SUCCESS RATE</span>
            <div className="font-chakra font-black text-white text-2xl">{taskCompletionRate}%</div>
            <div className="text-xs font-mono text-slate-400">{completedTasks} / {tasks.length} Completed</div>
          </div>
        </div>

      </div>

      {/* Team Rivalry Leaderboard */}
      <div className="bg-[#0e1526] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="font-chakra font-bold text-white uppercase text-base mb-1 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Team Rivalry Matrix & Score Distribution</span>
        </h3>
        <p className="text-xs text-slate-400 font-mono mb-4">
          Comparative performance and point dominance across all 4 house alliances
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamStats.map((team, idx) => (
            <div
              key={team.name}
              className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-chakra font-bold text-white text-sm">{team.name}</span>
                <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
              </div>

              <div className="text-2xl font-black font-chakra text-amber-400">
                {team.totalPts.toLocaleString()} <span className="text-xs text-slate-400 font-normal">PTS</span>
              </div>

              <div className="space-y-1 text-xs font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Active Members:</span>
                  <span className="text-white">{team.memberCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average / Member:</span>
                  <span className="text-white">{team.avgPts} PTS</span>
                </div>
              </div>

              {/* Share bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: `${Math.round((team.totalPts / (totalPointsInHouse || 1)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* House Census & Chronological Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* House Census Breakdown */}
        <div className="bg-[#0e1526] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="font-chakra font-bold text-white uppercase text-base mb-3 flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>House Demographic Census</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Total Enlisted Contestants:</span>
              <strong className="text-white font-bold">{contestants.length}</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-emerald-400">Active Housemates:</span>
              <strong className="text-emerald-300 font-bold">{activeContestants.length}</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-red-400">Nominated in Danger Zone:</span>
              <strong className="text-red-300 font-bold">{nominees.length}</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-cyan-400">Immunity Shield Holders:</span>
              <strong className="text-cyan-300 font-bold">{immune.length}</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500">Evicted Alumni:</span>
              <strong className="text-slate-400 font-bold">{evictedContestants.length}</strong>
            </div>
          </div>
        </div>

        {/* Chronological Activity Feed / Audit Trail */}
        <div className="lg:col-span-2 bg-[#0e1526] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-chakra font-bold text-white uppercase text-base flex items-center space-x-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Surveillance Activity Audit Feed</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Real-time Event Stream
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
            {activityLogs.map((log, index) => (
              <div
                key={log.id || index}
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 flex items-start justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="flex items-start space-x-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <div>
                    <span className="text-slate-200">{log.action}</span>
                    {log.details && (
                      <span className="text-slate-400 block text-[11px] mt-0.5">{log.details}</span>
                    )}
                  </div>
                </div>
                <span className="text-slate-500 text-[10px] shrink-0 font-mono">
                  {log.timestamp || 'Recent'}
                </span>
              </div>
            ))}
            {activityLogs.length === 0 && (
              <div className="text-center py-8 text-slate-500">No activity logged yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
