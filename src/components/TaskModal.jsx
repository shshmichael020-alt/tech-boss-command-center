import React, { useState } from 'react';
import { CheckSquare, X, Target, Zap } from 'lucide-react';
import { TEAMS } from '../data/initialData';

export default function TaskModal({
  isOpen,
  onClose,
  contestants,
  onAddTask
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignType, setAssignType] = useState('contestant'); // 'contestant' or 'team'
  const [selectedContestantId, setSelectedContestantId] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('AI Matrix');
  const [points, setPoints] = useState(250);
  const [difficulty, setDifficulty] = useState('Medium');

  if (!isOpen) return null;

  const activeContestants = contestants.filter(c => c.status !== 'Evicted');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let assignedToName = '';
    let contestantIdVal = null;

    if (assignType === 'contestant') {
      const c = activeContestants.find(item => item.id === (selectedContestantId || activeContestants[0]?.id));
      assignedToName = c ? c.name : 'Unassigned';
      contestantIdVal = c ? c.id : null;
    } else {
      assignedToName = selectedTeam;
    }

    const newTask = {
      id: 't_' + Date.now(),
      title: title.trim(),
      description: description.trim() || 'Complete the Big Boss assignment.',
      assignedTo: assignedToName,
      assignedType: assignType,
      contestantId: contestantIdVal,
      points: Number(points) || 100,
      difficulty,
      status: 'Pending',
      createdAt: 'Day 22, Now'
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0e1424] border border-cyan-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider font-chakra">
                Dispatch House Task
              </h3>
              <p className="text-xs text-slate-400">Assign challenges with point bounties</p>
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
          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Task Directive Title: *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build Quantum Key Distribution Simulator"
              className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Task Briefing / Description:
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instructions, guidelines, constraints..."
              className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Assignment Mode:
              </label>
              <select
                value={assignType}
                onChange={(e) => setAssignType(e.target.value)}
                className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white"
              >
                <option value="contestant">Individual Contestant</option>
                <option value="team">Whole Team</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Difficulty Level:
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white"
              >
                <option value="Easy">Easy (100 - 150 pts)</option>
                <option value="Medium">Medium (200 - 300 pts)</option>
                <option value="Hard">Hard (350 - 450 pts)</option>
                <option value="Legendary">Legendary (500+ pts)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Assignee:
            </label>
            {assignType === 'contestant' ? (
              <select
                value={selectedContestantId || (activeContestants[0]?.id || '')}
                onChange={(e) => setSelectedContestantId(e.target.value)}
                className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white"
              >
                {activeContestants.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.team})
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white"
              >
                {TEAMS.map(t => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Reward Points Bounty:
            </label>
            <input
              type="number"
              min="10"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white font-mono"
            />
          </div>

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
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase font-mono tracking-wider rounded-xl shadow-lg shadow-cyan-600/30 flex items-center space-x-2 transition"
            >
              <Zap className="w-4 h-4" />
              <span>Issue Directive</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
