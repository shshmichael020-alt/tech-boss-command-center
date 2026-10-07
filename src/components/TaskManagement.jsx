import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Sparkles, 
  AlertCircle,
  Trash2,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

export default function TaskManagement({
  tasks,
  contestants,
  onOpenTaskModal,
  onCompleteTask,
  onFailTask,
  onDeleteTask
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTasks = tasks.filter(t => {
    if (statusFilter === 'ALL') return true;
    return t.status === statusFilter;
  });

  const handleComplete = (taskId) => {
    soundManager.playSuccess();
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.warn(e);
    }
    onCompleteTask(taskId);
  };

  const handleFail = (taskId) => {
    soundManager.playDeduct();
    onFailTask(taskId);
  };

  const difficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300';
      case 'Medium':
        return 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300';
      case 'Hard':
        return 'bg-amber-950/80 border-amber-500/40 text-amber-300';
      case 'Legendary':
        return 'bg-purple-950/80 border-purple-500/40 text-purple-300 animate-pulse';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Action */}
      <div className="bg-[#0e1526] border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-400">
            <CheckSquare className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-chakra text-white uppercase tracking-wider flex items-center space-x-2">
              <span>Task Command Headquarters</span>
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono border border-purple-500/30">
                {tasks.filter(t => t.status === 'Completed').length} OF {tasks.length} COMPLETE
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Commission technical challenges, house chores, and evaluate results
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTaskModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-chakra font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Commission New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-mono">
        {[
          { id: 'ALL', label: 'All Tasks', count: tasks.length },
          { id: 'Pending', label: 'Pending', count: tasks.filter(t => t.status === 'Pending').length },
          { id: 'In Progress', label: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length },
          { id: 'Completed', label: 'Completed', count: tasks.filter(t => t.status === 'Completed').length },
          { id: 'Failed', label: 'Failed', count: tasks.filter(t => t.status === 'Failed').length }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setStatusFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl border transition whitespace-nowrap flex items-center space-x-1.5 ${
              statusFilter === f.id
                ? 'bg-purple-950/80 border-purple-500 text-purple-200 font-bold shadow-md'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span>{f.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((t) => {
          const isCompleted = t.status === 'Completed';
          const isFailed = t.status === 'Failed';
          const isInProgress = t.status === 'In Progress';

          return (
            <div
              key={t.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition relative overflow-hidden shadow-xl ${
                isCompleted
                  ? 'bg-[#0a1714] border-emerald-500/40'
                  : isFailed
                  ? 'bg-[#190a0d] border-red-500/40'
                  : isInProgress
                  ? 'bg-[#130f24] border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                  : 'bg-[#0e1526] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header: Difficulty & Points */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${difficultyBadge(t.difficulty)}`}>
                    {t.difficulty}
                  </span>
                  <div className="text-right">
                    <span className="font-chakra font-black text-amber-400 text-base">+{t.points} PTS</span>
                  </div>
                </div>

                {/* Title & Desc */}
                <h3 className="font-chakra font-bold text-white text-base leading-snug mb-2">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {t.description}
                </p>

                {/* Assignee & Meta */}
                <div className="space-y-1.5 bg-black/40 p-3 rounded-xl border border-slate-800/80 mb-4 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">ASSIGNED TO:</span>
                    <strong className="text-cyan-300 truncate max-w-[160px]">{t.assignedTo}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="text-slate-500">SCOPE:</span>
                    <span>{t.assignedType === 'team' ? 'Whole Team Bounties' : 'Individual Contestant'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="text-slate-500">ISSUED:</span>
                    <span>{t.createdAt}</span>
                  </div>
                  {t.completedAt && (
                    <div className="flex items-center justify-between text-emerald-400 text-[11px]">
                      <span>VERIFIED:</span>
                      <span>{t.completedAt}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div>
                  {isCompleted ? (
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>COMPLETED</span>
                    </span>
                  ) : isFailed ? (
                    <span className="text-xs font-mono font-bold text-red-400 flex items-center space-x-1">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span>FAILED</span>
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-purple-400 flex items-center space-x-1 animate-pulse">
                      <Clock className="w-4 h-4" />
                      <span>{t.status.toUpperCase()}</span>
                    </span>
                  )}
                </div>

                {!isCompleted && !isFailed ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleFail(t.id)}
                      className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 transition"
                      title="Mark as Failed"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleComplete(t.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-chakra font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Award Points</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onDeleteTask(t.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition"
                    title="Remove Task Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
