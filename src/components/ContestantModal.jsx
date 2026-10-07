import React, { useState, useEffect } from 'react';
import { UserPlus, Edit3, X, Image, Shield, Users } from 'lucide-react';
import { TEAMS } from '../data/initialData';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
];

export default function ContestantModal({
  isOpen,
  onClose,
  onSave,
  contestant = null // if present -> edit mode; else -> add mode
}) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [team, setTeam] = useState('Cyber Sentinel');
  const [points, setPoints] = useState(1000);
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0]);
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (contestant) {
      setName(contestant.name);
      setRole(contestant.role || '');
      setTeam(contestant.team);
      setPoints(contestant.points || 0);
      setAvatar(contestant.avatar || AVATAR_PRESETS[0]);
      setBio(contestant.bio || '');
    } else {
      setName('');
      setRole('');
      setTeam('Cyber Sentinel');
      setPoints(1000);
      setAvatar(AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)]);
      setBio('');
    }
  }, [contestant, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = {
      id: contestant ? contestant.id : 'c_' + Date.now(),
      name: name.trim(),
      role: role.trim() || 'Software Engineer',
      team,
      points: Number(points) || 0,
      avatar: avatar.trim() || AVATAR_PRESETS[0],
      bio: bio.trim() || 'Tech House contestant.',
      status: contestant ? contestant.status : 'Active',
      isCaptain: contestant ? contestant.isCaptain : false,
      isImmune: contestant ? contestant.isImmune : false,
      tasksCompleted: contestant ? contestant.tasksCompleted : 0,
      dangerZoneVotes: contestant ? contestant.dangerZoneVotes : 0,
      joinedDay: contestant ? contestant.joinedDay : 1
    };

    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0e1424] border border-cyan-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              {contestant ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider font-chakra">
                {contestant ? 'Edit Housemate Profile' : 'Enlist New Contestant'}
              </h3>
              <p className="text-xs text-slate-400">
                {contestant ? `Updating record for ${contestant.name}` : 'Register a new player into Big Boss Tech House'}
              </p>
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
              Contestant Call-Sign / Full Name: *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Neo 'The Matrix' Anderson"
              className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Tech Specialization / Role:
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. AI Researcher, DevOps"
                className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Team Allocation:
              </label>
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white"
              >
                {TEAMS.map((t) => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Initial Point Balance:
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Avatar Photo Selection:
            </label>
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={avatar}
                alt="Selected"
                className="w-12 h-12 rounded-xl object-cover border-2 border-cyan-500"
                onError={(e) => { e.target.src = AVATAR_PRESETS[0]; }}
              />
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Paste Image URL"
                className="flex-1 bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2 text-xs text-white"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto py-1">
              {AVATAR_PRESETS.map((pUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(pUrl)}
                  className={`w-10 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                    avatar === pUrl ? 'border-cyan-400 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={pUrl} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
              Player Bio / House Strategy:
            </label>
            <textarea
              rows="2"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Game plan, strengths, personality in the house..."
              className="w-full bg-[#080d1a] border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-sm text-white resize-none"
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
              className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase font-mono tracking-wider rounded-xl shadow-lg shadow-cyan-600/30 transition"
            >
              {contestant ? 'Update Contestant' : 'Enlist Into House'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
