import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  ShieldAlert, 
  Zap, 
  Award, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Target, 
  Layers, 
  ArrowUpRight, 
  Sparkles,
  Crown
} from 'lucide-react';

export default function PerformanceAnalytics({ contestants, tasks, housePhase, chaosIndex = 68 }) {
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('ALL');
  const [compareContestantA, setCompareContestantA] = useState(null);
  const [compareContestantB, setCompareContestantB] = useState(null);

  // Active contestants
  const activeContestants = useMemo(() => 
    contestants.filter(c => c.status !== 'Evicted'), 
    [contestants]
  );

  const evictedContestants = useMemo(() => 
    contestants.filter(c => c.status === 'Evicted'), 
    [contestants]
  );

  // Totals & Averages
  const totalHousePoints = useMemo(() => 
    activeContestants.reduce((sum, c) => sum + (Number(c.points) || 0), 0),
    [activeContestants]
  );

  const avgPoints = useMemo(() => 
    activeContestants.length > 0 ? Math.round(totalHousePoints / activeContestants.length) : 0,
    [totalHousePoints, activeContestants]
  );

  const highestScore = useMemo(() => 
    Math.max(...activeContestants.map(c => Number(c.points) || 0), 0),
    [activeContestants]
  );

  const lowestScore = useMemo(() => 
    Math.min(...activeContestants.map(c => Number(c.points) || 0), 99999),
    [activeContestants]
  );

  const mvp = useMemo(() => 
    activeContestants.find(c => Number(c.points) === highestScore),
    [activeContestants, highestScore]
  );

  const inJeopardy = useMemo(() => 
    [...activeContestants].sort((a, b) => (Number(a.points) || 0) - (Number(b.points) || 0))[0],
    [activeContestants]
  );

  // Tasks statistics
  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'Completed'), [tasks]);
  const pendingTasks = useMemo(() => tasks.filter(t => t.status === 'Pending'), [tasks]);
  const totalBountiesAwarded = useMemo(() => 
    completedTasks.reduce((sum, t) => sum + (Number(t.points) || 0), 0),
    [completedTasks]
  );
  const taskCompletionRate = useMemo(() => 
    tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
    [tasks, completedTasks]
  );

  // Team aggregation
  const teamStats = useMemo(() => {
    const teams = {};
    activeContestants.forEach(c => {
      const t = c.team || 'Unaffiliated';
      if (!teams[t]) {
        teams[t] = { name: t, totalPoints: 0, members: 0, tasksDone: 0, nominees: 0, captains: 0 };
      }
      teams[t].totalPoints += Number(c.points) || 0;
      teams[t].members += 1;
      teams[t].tasksDone += Number(c.tasksCompleted) || 0;
      if (c.status === 'Nominated') teams[t].nominees += 1;
      if (c.isCaptain) teams[t].captains += 1;
    });

    return Object.values(teams).sort((a, b) => b.totalPoints - a.totalPoints);
  }, [activeContestants]);

  // Performance Tiers
  const tiers = useMemo(() => {
    const diamond = activeContestants.filter(c => c.points >= 1600);
    const platinum = activeContestants.filter(c => c.points >= 1300 && c.points < 1600);
    const gold = activeContestants.filter(c => c.points >= 1000 && c.points < 1300);
    const danger = activeContestants.filter(c => c.points < 1000);
    return { diamond, platinum, gold, danger };
  }, [activeContestants]);

  // Filtered contestants for list
  const filteredContestants = useMemo(() => {
    if (selectedTeamFilter === 'ALL') return activeContestants;
    return activeContestants.filter(c => c.team === selectedTeamFilter);
  }, [activeContestants, selectedTeamFilter]);

  // Calculate Vulnerability Score (0-100%)
  const calculateVulnerability = (contestant) => {
    if (contestant.isImmune) return 0;
    if (contestant.isCaptain) return 5;
    const pointRatio = highestScore > 0 ? (contestant.points / highestScore) : 1;
    let baseRisk = Math.max(10, Math.round((1 - pointRatio) * 60));
    if (contestant.status === 'Nominated') baseRisk += 35;
    return Math.min(95, baseRisk);
  };

  // Default comparison candidates
  const candidateA = compareContestantA || activeContestants[0] || null;
  const candidateB = compareContestantB || activeContestants[1] || null;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/60 border border-purple-500/30 p-6 shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-purple-900/50 text-purple-400 border border-purple-500/40">
                <BarChart3 className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-2xl font-black font-chakra tracking-wider text-white flex items-center gap-2">
                  PERFORMANCE ANALYTICS <span className="text-purple-400 text-sm font-mono">[DEEP TELEMETRY]</span>
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  Live algorithmic assessment, team power metrics, bounty yield, and eviction risk indexes
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">HOUSE PHASE: </span>
              <span className="text-cyan-400 font-bold">{housePhase}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-red-950/80 border border-red-500/40 text-xs font-mono text-red-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span>CHAOS INDEX: {chaosIndex}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Points */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>TOTAL HOUSE CAPITAL</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-chakra text-white tracking-wider">
            {totalHousePoints.toLocaleString()} <span className="text-xs text-cyan-400 font-mono">PTS</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Avg: <span className="text-slate-200 font-semibold">{avgPoints} pts</span> / housemate
          </div>
        </div>

        {/* Task Velocity */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>TASK COMPLETION RATE</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-chakra text-emerald-400 tracking-wider">
            {taskCompletionRate}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            {completedTasks.length} / {tasks.length} tasks completed ({totalBountiesAwarded} bounty pts)
          </div>
        </div>

        {/* House MVP */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>HOUSE MVP [DOMINANT]</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-chakra text-amber-400 tracking-wider truncate">
            {mvp ? mvp.name.split(' ')[0] : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Score: <span className="text-amber-300 font-semibold">{highestScore} pts</span> ({mvp?.team})
          </div>
        </div>

        {/* In Jeopardy */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>MAX EVICTION RISK</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-lg sm:text-xl font-black font-chakra text-rose-400 tracking-wider truncate">
            {inJeopardy ? inJeopardy.name.split(' ')[0] : 'None'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">
            Score: <span className="text-rose-300 font-semibold">{lowestScore} pts</span> (Risk: {inJeopardy ? calculateVulnerability(inJeopardy) : 0}%)
          </div>
        </div>
      </div>

      {/* Grid: Team Power Hierarchy & Performance Tier Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Team Power Hierarchy */}
        <div className="bg-[#0b101f] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h3 className="font-chakra font-black tracking-wider text-white text-lg">
                TEAM POWER HIERARCHY
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              {teamStats.length} TEAMS ACTIVE
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            Aggregated point capital and task productivity share across all active tech teams.
          </p>

          <div className="space-y-4 pt-2">
            {teamStats.map((team, idx) => {
              const share = totalHousePoints > 0 ? Math.round((team.totalPoints / totalHousePoints) * 100) : 0;
              const maxTeamPoints = teamStats[0]?.totalPoints || 1;
              const widthPct = Math.round((team.totalPoints / maxTeamPoints) * 100);

              return (
                <div key={team.name} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-300">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-white tracking-wide">{team.name}</span>
                      {team.captains > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                          👑 Captain
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-400 font-bold">{team.totalPoints.toLocaleString()} pts</span>
                      <span className="text-slate-400 text-[10px]">({share}% share)</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>{team.members} Members</span>
                    <span>{team.tasksDone} Tasks Done</span>
                    <span>{team.nominees > 0 ? `⚠️ ${team.nominees} in Danger` : '🛡️ Safe'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Tier Matrix */}
        <div className="bg-[#0b101f] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              <h3 className="font-chakra font-black tracking-wider text-white text-lg">
                CONTESTANT TIER MATRIX
              </h3>
            </div>
            <span className="text-[11px] font-mono text-purple-400">
              4 ECHELONS
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            Echelon classification based on cumulative points and vulnerability profile.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            
            {/* Diamond */}
            <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300 mb-1">
                <span>DIAMOND</span>
                <span>&gt;1600 PTS</span>
              </div>
              <div className="text-2xl font-black font-chakra text-white mb-2">
                {tiers.diamond.length}
              </div>
              <div className="space-y-1">
                {tiers.diamond.map(c => (
                  <div key={c.id} className="text-[11px] font-mono text-cyan-200/80 truncate">
                    • {c.name.split(' ')[0]} ({c.points})
                  </div>
                ))}
              </div>
            </div>

            {/* Platinum */}
            <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-300 mb-1">
                <span>PLATINUM</span>
                <span>1300-1599</span>
              </div>
              <div className="text-2xl font-black font-chakra text-white mb-2">
                {tiers.platinum.length}
              </div>
              <div className="space-y-1">
                {tiers.platinum.map(c => (
                  <div key={c.id} className="text-[11px] font-mono text-purple-200/80 truncate">
                    • {c.name.split(' ')[0]} ({c.points})
                  </div>
                ))}
              </div>
            </div>

            {/* Gold */}
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300 mb-1">
                <span>GOLD</span>
                <span>1000-1299</span>
              </div>
              <div className="text-2xl font-black font-chakra text-white mb-2">
                {tiers.gold.length}
              </div>
              <div className="space-y-1">
                {tiers.gold.map(c => (
                  <div key={c.id} className="text-[11px] font-mono text-amber-200/80 truncate">
                    • {c.name.split(' ')[0]} ({c.points})
                  </div>
                ))}
              </div>
            </div>

            {/* Jeopardy / Danger */}
            <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-300 mb-1">
                <span>JEOPARDY</span>
                <span>&lt;1000 PTS</span>
              </div>
              <div className="text-2xl font-black font-chakra text-rose-400 mb-2">
                {tiers.danger.length}
              </div>
              <div className="space-y-1">
                {tiers.danger.length === 0 ? (
                  <div className="text-[10px] font-mono text-slate-500 italic">None below 1000 pts</div>
                ) : (
                  tiers.danger.map(c => (
                    <div key={c.id} className="text-[11px] font-mono text-rose-200/80 truncate">
                      • {c.name.split(' ')[0]} ({c.points})
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Evicted count note */}
          {evictedContestants.length > 0 && (
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Evicted Roster ({evictedContestants.length}):</span>
              <span className="text-rose-400 font-bold">
                {evictedContestants.map(c => c.name.split(' ')[0]).join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Head-to-Head Comparative Intelligence */}
      <div className="bg-[#0b101f] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <h3 className="font-chakra font-black tracking-wider text-white text-lg">
              HEAD-TO-HEAD COMPARATIVE INTELLIGENCE
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Compare any two housemates in real time
          </span>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Candidate A */}
          <div className="space-y-3">
            <label className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              Contestant Alpha:
            </label>
            <select
              value={candidateA?.id || ''}
              onChange={(e) => setCompareContestantA(activeContestants.find(c => c.id === e.target.value))}
              className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
            >
              {activeContestants.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.points} pts - {c.team})
                </option>
              ))}
            </select>

            {candidateA && (
              <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-3">
                  <img src={candidateA.avatar} alt={candidateA.name} className="w-12 h-12 rounded-xl object-cover border border-cyan-500/50" />
                  <div>
                    <h4 className="font-bold text-white font-chakra text-base">{candidateA.name}</h4>
                    <p className="text-xs text-cyan-400 font-mono">{candidateA.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">POINTS</span>
                    <span className="text-lg font-black text-cyan-400 font-chakra">{candidateA.points}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">TASKS DONE</span>
                    <span className="text-lg font-black text-emerald-400 font-chakra">{candidateA.tasksCompleted}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">STATUS</span>
                    <span className="text-xs font-bold text-white">{candidateA.status}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">VULNERABILITY</span>
                    <span className={`text-xs font-bold ${calculateVulnerability(candidateA) > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {calculateVulnerability(candidateA)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Candidate B */}
          <div className="space-y-3">
            <label className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider block">
              Contestant Beta:
            </label>
            <select
              value={candidateB?.id || ''}
              onChange={(e) => setCompareContestantB(activeContestants.find(c => c.id === e.target.value))}
              className="w-full bg-slate-900 border border-purple-500/40 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-400"
            >
              {activeContestants.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.points} pts - {c.team})
                </option>
              ))}
            </select>

            {candidateB && (
              <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-3">
                  <img src={candidateB.avatar} alt={candidateB.name} className="w-12 h-12 rounded-xl object-cover border border-purple-500/50" />
                  <div>
                    <h4 className="font-bold text-white font-chakra text-base">{candidateB.name}</h4>
                    <p className="text-xs text-purple-400 font-mono">{candidateB.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">POINTS</span>
                    <span className="text-lg font-black text-purple-400 font-chakra">{candidateB.points}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">TASKS DONE</span>
                    <span className="text-lg font-black text-emerald-400 font-chakra">{candidateB.tasksCompleted}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">STATUS</span>
                    <span className="text-xs font-bold text-white">{candidateB.status}</span>
                  </div>
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">VULNERABILITY</span>
                    <span className={`text-xs font-bold ${calculateVulnerability(candidateB) > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {calculateVulnerability(candidateB)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Head-to-Head Delta Summary */}
        {candidateA && candidateB && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-400">POINT DIFFERENTIAL: </span>
              <span className="text-white font-bold font-chakra text-sm">
                {Math.abs(candidateA.points - candidateB.points)} PTS
              </span>
              <span className="text-slate-400 ml-1.5">
                ({candidateA.points >= candidateB.points ? candidateA.name.split(' ')[0] : candidateB.name.split(' ')[0]} leads)
              </span>
            </div>
            <div>
              <span className="text-slate-400">TASK SPREAD: </span>
              <span className="text-emerald-400 font-bold font-chakra text-sm">
                {Math.abs(candidateA.tasksCompleted - candidateB.tasksCompleted)} TASKS
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
