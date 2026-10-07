import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  CheckSquare, 
  AlertTriangle, 
  Timer, 
  BarChart3 
} from 'lucide-react';

export default function Navbar({ activeTab, onSelectTab, counts }) {
  const tabs = [
    { id: 'hub', label: 'Command Hub', icon: LayoutDashboard },
    { id: 'contestants', label: 'Housemates', icon: Users, badge: counts.contestants },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'tasks', label: 'Tasks HQ', icon: CheckSquare, badge: counts.activeTasks },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, badge: counts.danger, badgeColor: 'bg-red-500' },
    { id: 'timer', label: 'Task Timer', icon: Timer },
    { id: 'stats', label: 'House Intel', icon: BarChart3 }
  ];

  return (
    <nav className="bg-[#0b101f] border-b border-slate-800/80 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-chakra font-semibold tracking-wider uppercase transition whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-red-600/20 to-cyan-600/20 text-white border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold text-white ${tab.badgeColor || 'bg-slate-700'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
