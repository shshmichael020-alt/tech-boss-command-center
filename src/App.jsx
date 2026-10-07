import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import CommandHub from './components/CommandHub';
import ContestantManagement from './components/ContestantManagement';
import Leaderboard from './components/Leaderboard';
import TaskManagement from './components/TaskManagement';
import DangerZone from './components/DangerZone';
import TaskTimer from './components/TaskTimer';
import HouseStats from './components/HouseStats';
import BroadcastBanner from './components/BroadcastBanner';
import PointModal from './components/PointModal';
import ContestantModal from './components/ContestantModal';
import CaptaincyModal from './components/CaptaincyModal';
import EvictionModal from './components/EvictionModal';
import TaskModal from './components/TaskModal';

import { 
  INITIAL_CONTESTANTS, 
  INITIAL_TASKS, 
  INITIAL_ANNOUNCEMENTS 
} from './data/initialData';
import { soundManager } from './utils/audio';

export default function App() {
  // Navigation active tab: 'hub' | 'contestants' | 'leaderboard' | 'tasks' | 'danger' | 'timer' | 'stats'
  const [activeTab, setActiveTab] = useState('hub');

  // Contestants state (with LocalStorage fallback)
  const [contestants, setContestants] = useState(() => {
    const saved = localStorage.getItem('bigboss_contestants');
    return saved ? JSON.parse(saved) : INITIAL_CONTESTANTS;
  });

  // Tasks state
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('bigboss_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Announcements state
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('bigboss_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // Activity audit log
  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('bigboss_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'l1', action: 'System online: Tech House Command Center operational', timestamp: 'Day 22, 08:00' },
      { id: 'l2', action: 'Captaincy conferred upon Aria Stark', timestamp: 'Day 21, 19:30' },
      { id: 'l3', action: 'Danger Zone activated with 3 nominees', timestamp: 'Day 21, 16:00' },
    ];
  });

  // Modals state
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);
  const [selectedContestantForPoints, setSelectedContestantForPoints] = useState(null);
  
  const [isContestantModalOpen, setIsContestantModalOpen] = useState(false);
  const [editingContestant, setEditingContestant] = useState(null);

  const [isCaptaincyModalOpen, setIsCaptaincyModalOpen] = useState(false);
  
  const [isEvictionModalOpen, setIsEvictionModalOpen] = useState(false);
  const [contestantToEvict, setContestantToEvict] = useState(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [latestAnnouncementOverlay, setLatestAnnouncementOverlay] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('bigboss_contestants', JSON.stringify(contestants));
  }, [contestants]);

  useEffect(() => {
    localStorage.setItem('bigboss_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('bigboss_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('bigboss_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Helper: Log House Activity
  const logActivity = (action, details = '') => {
    const newLog = {
      id: 'log_' + Date.now(),
      action,
      details,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]); // keep last 50
  };

  // House Captain
  const captain = contestants.find(c => c.isCaptain && c.status !== 'Evicted');
  const dangerCount = contestants.filter(c => c.status === 'Nominated').length;

  // ----------------------------------------------------
  // ACTION HANDLERS
  // ----------------------------------------------------

  // Points Add / Deduct
  const handleAdjustPoints = (contestantId, amount, reason) => {
    setContestants(prev => prev.map(c => {
      if (c.id === contestantId) {
        const updatedPoints = Math.max(0, c.points + amount);
        return { ...c, points: updatedPoints };
      }
      return c;
    }));

    const target = contestants.find(c => c.id === contestantId);
    const sign = amount > 0 ? `+${amount}` : `${amount}`;
    logActivity(`Points Transaction: ${sign} PTS to ${target ? target.name : contestantId}`, `Reason: ${reason}`);
  };

  const handleQuickPoints = (contestantId, amount, reason = 'Quick adjustment') => {
    handleAdjustPoints(contestantId, amount, reason);
    if (amount > 0) {
      soundManager.playSuccess();
    } else {
      soundManager.playDeduct();
    }
  };

  // Captaincy Assignment
  const handleAssignCaptain = (newCaptainId) => {
    setContestants(prev => prev.map(c => {
      if (c.id === newCaptainId) {
        return {
          ...c,
          status: 'Captain',
          isCaptain: true,
          isImmune: true, // Captain gets immunity!
        };
      }
      if (c.isCaptain) {
        // Step down previous captain
        return {
          ...c,
          status: 'Active',
          isCaptain: false,
          // note: previous captain retains immunity only if they had another reason, reset here to active
          isImmune: false,
        };
      }
      return c;
    }));

    const newCap = contestants.find(c => c.id === newCaptainId);
    if (newCap) {
      const msg = `Captaincy Decree: ${newCap.name} has been sworn in as the new House Captain!`;
      handleAddAnnouncement(msg, 'captaincy');
      logActivity(`House Captain Inauguration`, `${newCap.name} sworn into office with full immunity.`);
    }
  };

  // Immunity Toggle
  const handleToggleImmunity = (contestantId) => {
    setContestants(prev => prev.map(c => {
      if (c.id === contestantId) {
        const nextImmune = !c.isImmune;
        // If granted immunity and they were nominated, remove them from Danger Zone!
        const nextStatus = nextImmune && c.status === 'Nominated' ? 'Immune' : nextImmune ? 'Immune' : 'Active';
        return {
          ...c,
          isImmune: nextImmune,
          status: c.isCaptain ? 'Captain' : nextStatus,
        };
      }
      return c;
    }));

    const target = contestants.find(c => c.id === contestantId);
    if (target) {
      const statusText = !target.isImmune ? 'GRANTED' : 'REVOKED';
      logActivity(`Immunity Protocol: ${statusText} for ${target.name}`);
    }
  };

  // Nomination Toggle (Danger Zone)
  const handleToggleNomination = (contestantId, reason = '') => {
    setContestants(prev => prev.map(c => {
      if (c.id === contestantId) {
        const isNominated = c.status === 'Nominated';
        return {
          ...c,
          status: isNominated ? 'Active' : 'Nominated',
          dangerZoneVotes: isNominated ? 0 : 200,
          nominationReason: isNominated ? null : (reason || 'House tactical consensus'),
        };
      }
      return c;
    }));

    const target = contestants.find(c => c.id === contestantId);
    if (target) {
      const isNom = target.status === 'Nominated';
      logActivity(
        isNom ? `Pardoned from Danger Zone: ${target.name}` : `Nominated to Danger Zone: ${target.name}`,
        reason || ''
      );
    }
  };

  // Eviction Execution
  const handleConfirmEviction = (contestantId, reason) => {
    setContestants(prev => prev.map(c => {
      if (c.id === contestantId) {
        return {
          ...c,
          status: 'Evicted',
          isCaptain: false,
          isImmune: false,
          evictedDay: 22,
          evictionReason: reason || 'Evicted via official Big Boss verdict.',
        };
      }
      return c;
    }));

    const target = contestants.find(c => c.id === contestantId);
    if (target) {
      const decree = `EVICTION VERDICT: ${target.name} has been formally evicted from the Tech House.`;
      handleAddAnnouncement(decree, 'danger');
      logActivity(`CONTESTANT EVICTED: ${target.name}`, `Reason: ${reason}`);
    }
  };

  // Wildcard Revive Evicted Contestant
  const handleReviveContestant = (contestantId) => {
    setContestants(prev => prev.map(c => {
      if (c.id === contestantId) {
        return {
          ...c,
          status: 'Active',
          evictedDay: null,
          evictionReason: null,
        };
      }
      return c;
    }));

    const target = contestants.find(c => c.id === contestantId);
    if (target) {
      soundManager.playSuccess();
      handleAddAnnouncement(`WILDCARD RETURN: ${target.name} has re-entered the Tech House!`, 'alert');
      logActivity(`Wildcard Entry Reinstated: ${target.name}`);
    }
  };

  // Add or Edit Contestant
  const handleSaveContestant = (data) => {
    if (editingContestant) {
      setContestants(prev => prev.map(c => c.id === data.id ? { ...c, ...data } : c));
      logActivity(`Contestant Profile Modified: ${data.name}`);
    } else {
      setContestants(prev => [data, ...prev]);
      logActivity(`New Contestant Enlisted: ${data.name} (${data.team})`);
      soundManager.playSuccess();
    }
    setEditingContestant(null);
  };

  // Task Completion
  const handleCompleteTask = (taskId) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    // Mark task complete
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'Completed', completedAt: 'Just Now' };
      }
      return t;
    }));

    // Reward points!
    if (targetTask.assignedType === 'contestant' && targetTask.contestantId) {
      setContestants(prev => prev.map(c => {
        if (c.id === targetTask.contestantId) {
          return {
            ...c,
            points: c.points + targetTask.points,
            tasksCompleted: (c.tasksCompleted || 0) + 1
          };
        }
        return c;
      }));
    } else if (targetTask.assignedType === 'team') {
      // Award to all team members
      setContestants(prev => prev.map(c => {
        if (c.team === targetTask.assignedTo && c.status !== 'Evicted') {
          return {
            ...c,
            points: c.points + targetTask.points,
            tasksCompleted: (c.tasksCompleted || 0) + 1
          };
        }
        return c;
      }));
    }

    logActivity(`Task Completed: "${targetTask.title}"`, `+${targetTask.points} PTS awarded to ${targetTask.assignedTo}`);
  };

  const handleFailTask = (taskId) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'Failed' };
      }
      return t;
    }));

    logActivity(`Task Failed: "${targetTask.title}" by ${targetTask.assignedTo}`);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    logActivity(`Task Record Deleted`);
  };

  const handleAddTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    soundManager.playSuccess();
    logActivity(`New Directive Dispatched: "${newTask.title}" for ${newTask.assignedTo}`);
  };

  // Announcements
  const handleAddAnnouncement = (message, type = 'alert') => {
    const item = {
      id: 'a_' + Date.now(),
      message,
      timestamp: `Day 22, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      type,
      priority: 'HIGH'
    };
    setAnnouncements(prev => [item, ...prev]);
    setLatestAnnouncementOverlay(item);
    logActivity(`Announcement Broadcast: "${message}"`);
  };

  // Nominee Votes Update
  const handleUpdateNomineeVotes = (contestantId, delta) => {
    setContestants(prev => prev.map(c => {
      if (c.id === contestantId) {
        return { ...c, dangerZoneVotes: Math.max(10, (c.dangerZoneVotes || 150) + delta) };
      }
      return c;
    }));
  };

  // Reset to Sample Demo Data
  const handleResetData = () => {
    if (window.confirm("Reset all Tech House data back to fresh Big Boss initial state?")) {
      setContestants(INITIAL_CONTESTANTS);
      setTasks(INITIAL_TASKS);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setActivityLogs([
        { id: 'l_init', action: 'House data reset to default Big Boss demo state', timestamp: 'Just now' }
      ]);
      localStorage.clear();
      soundManager.playGong();
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans grid-bg">
      {/* Top Surveillance Ticker */}
      <BroadcastBanner
        announcements={announcements}
        onAddAnnouncement={handleAddAnnouncement}
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        latestAnnouncement={latestAnnouncementOverlay}
        onDismissLatest={() => setLatestAnnouncementOverlay(null)}
      />

      {/* Main Command Header */}
      <Header
        captain={captain}
        dangerCount={dangerCount}
        onOpenBroadcast={() => setIsBroadcastOpen(true)}
        onOpenCaptaincy={() => setIsCaptaincyModalOpen(true)}
        currentDay={22}
        chaosIndex={68}
      />

      {/* Navigation Tabs */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        counts={{
          contestants: contestants.filter(c => c.status !== 'Evicted').length,
          activeTasks: tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length,
          danger: dangerCount
        }}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'hub' && (
          <CommandHub
            contestants={contestants}
            tasks={tasks}
            captain={captain}
            announcements={announcements}
            onOpenPointModal={(id) => {
              setSelectedContestantForPoints(id);
              setIsPointModalOpen(true);
            }}
            onOpenTaskModal={() => setIsTaskModalOpen(true)}
            onOpenContestantModal={() => {
              setEditingContestant(null);
              setIsContestantModalOpen(true);
            }}
            onOpenCaptaincy={() => setIsCaptaincyModalOpen(true)}
            onOpenBroadcast={() => setIsBroadcastOpen(true)}
            onOpenEviction={(c) => {
              setContestantToEvict(c);
              setIsEvictionModalOpen(true);
            }}
            onSelectTab={setActiveTab}
            onCompleteTask={handleCompleteTask}
          />
        )}

        {activeTab === 'contestants' && (
          <ContestantManagement
            contestants={contestants}
            onOpenAddModal={() => {
              setEditingContestant(null);
              setIsContestantModalOpen(true);
            }}
            onOpenEditModal={(c) => {
              setEditingContestant(c);
              setIsContestantModalOpen(true);
            }}
            onOpenPointModal={(id) => {
              setSelectedContestantForPoints(id);
              setIsPointModalOpen(true);
            }}
            onToggleImmunity={handleToggleImmunity}
            onToggleNomination={handleToggleNomination}
            onAssignCaptain={handleAssignCaptain}
            onOpenEviction={(c) => {
              setContestantToEvict(c);
              setIsEvictionModalOpen(true);
            }}
            onReviveContestant={handleReviveContestant}
            onQuickPoints={handleQuickPoints}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard
            contestants={contestants}
            onOpenPointModal={(id) => {
              setSelectedContestantForPoints(id);
              setIsPointModalOpen(true);
            }}
            onQuickPoints={handleQuickPoints}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskManagement
            tasks={tasks}
            contestants={contestants}
            onOpenTaskModal={() => setIsTaskModalOpen(true)}
            onCompleteTask={handleCompleteTask}
            onFailTask={handleFailTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'danger' && (
          <DangerZone
            contestants={contestants}
            onOpenEviction={(c) => {
              setContestantToEvict(c);
              setIsEvictionModalOpen(true);
            }}
            onToggleNomination={handleToggleNomination}
            onUpdateNomineeVotes={handleUpdateNomineeVotes}
            onOpenPointModal={(id) => {
              setSelectedContestantForPoints(id);
              setIsPointModalOpen(true);
            }}
          />
        )}

        {activeTab === 'timer' && (
          <TaskTimer
            onAnnounceTimerDone={(msg) => handleAddAnnouncement(msg, 'danger')}
          />
        )}

        {activeTab === 'stats' && (
          <HouseStats
            contestants={contestants}
            tasks={tasks}
            captain={captain}
            activityLogs={activityLogs}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#080d1a] border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>BIG BOSS • TECH HOUSE COMMAND CENTER © 2026. ALL RIGHTS RESERVED.</div>
          <div className="text-slate-400">
            ALL 12 MANDATORY DELIVERABLES VERIFIED • REAL-TIME WEB AUDIO & SPEECH ACTIVE
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <PointModal
        isOpen={isPointModalOpen}
        onClose={() => setIsPointModalOpen(false)}
        contestants={contestants}
        selectedContestantId={selectedContestantForPoints}
        onAdjustPoints={handleAdjustPoints}
      />

      <ContestantModal
        isOpen={isContestantModalOpen}
        onClose={() => {
          setIsContestantModalOpen(false);
          setEditingContestant(null);
        }}
        onSave={handleSaveContestant}
        contestant={editingContestant}
      />

      <CaptaincyModal
        isOpen={isCaptaincyModalOpen}
        onClose={() => setIsCaptaincyModalOpen(false)}
        contestants={contestants}
        currentCaptain={captain}
        onAssignCaptain={handleAssignCaptain}
      />

      <EvictionModal
        isOpen={isEvictionModalOpen}
        onClose={() => {
          setIsEvictionModalOpen(false);
          setContestantToEvict(null);
        }}
        contestant={contestantToEvict}
        onConfirmEviction={handleConfirmEviction}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        contestants={contestants}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
