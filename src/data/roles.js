// Role Based Access Control (RBAC) Definitions for Tech House Command Center

export const ROLES = {
  BIG_BOSS: {
    id: 'BIG_BOSS',
    name: 'Big Boss',
    shortTitle: 'Supreme Master',
    badge: '👑 SUPREME MASTER',
    color: 'from-red-600 to-rose-700',
    bgColor: 'bg-red-950/80',
    borderColor: 'border-red-500/60',
    textColor: 'text-red-400',
    badgeStyle: 'bg-red-950/90 text-red-400 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    description: 'Supreme executive authority. Full control over points, evictions, immunity, nominations, announcements & house rules.',
    permissions: {
      canAdjustPoints: true,
      canEvict: true,
      canGrantImmunity: true,
      canNominate: true,
      canAssignCaptain: true,
      canChangePhase: true,
      canBroadcast: true,
      canCommissionTasks: true,
      canUndo: true,
      canEditContestants: true,
      canSimulateIncident: true,
      canResetData: true
    }
  },
  CAPTAIN: {
    id: 'CAPTAIN',
    name: 'House Captain',
    shortTitle: 'Delegated Leader',
    badge: '🛡️ HOUSE CAPTAIN',
    color: 'from-amber-500 to-yellow-600',
    bgColor: 'bg-amber-950/80',
    borderColor: 'border-amber-500/60',
    textColor: 'text-amber-400',
    badgeStyle: 'bg-amber-950/90 text-amber-400 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    description: 'House operational commander. Can commission tasks, nominate housemates, and issue house bulletins. Cannot evict or grant immunity.',
    permissions: {
      canAdjustPoints: false,
      canEvict: false,
      canGrantImmunity: false,
      canNominate: true,
      canAssignCaptain: false,
      canChangePhase: false,
      canBroadcast: true,
      canCommissionTasks: true,
      canUndo: false,
      canEditContestants: false,
      canSimulateIncident: false,
      canResetData: false
    }
  },
  JURY: {
    id: 'JURY',
    name: 'Jury / Judge',
    shortTitle: 'Official Evaluator',
    badge: '⚖️ JURY / JUDGE',
    color: 'from-purple-600 to-indigo-700',
    bgColor: 'bg-purple-950/80',
    borderColor: 'border-purple-500/60',
    textColor: 'text-purple-400',
    badgeStyle: 'bg-purple-950/90 text-purple-400 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    description: 'Official assessment panel. Can award performance points, commission evaluative tasks, and inspect deep telemetry.',
    permissions: {
      canAdjustPoints: true,
      canEvict: false,
      canGrantImmunity: false,
      canNominate: false,
      canAssignCaptain: false,
      canChangePhase: false,
      canBroadcast: false,
      canCommissionTasks: true,
      canUndo: false,
      canEditContestants: false,
      canSimulateIncident: false,
      canResetData: false
    }
  },
  CONTESTANT: {
    id: 'CONTESTANT',
    name: 'Contestant / Viewer',
    shortTitle: 'Housemate Feed',
    badge: '👤 CONTESTANT',
    color: 'from-cyan-600 to-blue-700',
    bgColor: 'bg-cyan-950/80',
    borderColor: 'border-cyan-500/60',
    textColor: 'text-cyan-400',
    badgeStyle: 'bg-cyan-950/90 text-cyan-400 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    description: 'Read-only surveillance view. Can monitor the live leaderboard, danger zone status, house phase, and public bulletins.',
    permissions: {
      canAdjustPoints: false,
      canEvict: false,
      canGrantImmunity: false,
      canNominate: false,
      canAssignCaptain: false,
      canChangePhase: false,
      canBroadcast: false,
      canCommissionTasks: false,
      canUndo: false,
      canEditContestants: false,
      canSimulateIncident: false,
      canResetData: false
    }
  }
};
