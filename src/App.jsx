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
import PerformanceAnalytics from './components/PerformanceAnalytics';
import NotificationCenter, { ToastStack } from './components/NotificationCenter';
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
import { ROLES } from './data/roles';
import { soundManager } from './utils/audio';

// Safe localStorage loaders
const loadStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch (err) {
    console.warn(`Error loading ${key} from storage, using fallback`, err);
    return fallback;
  }
};

const loadStorageString = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item || fallback;
  } catch (err) {
    return fallback;
  }
};

export default function App() {
  // Navigation active tab: 'hub' | 'contestants' | 'leaderboard' | 'tasks' | 'danger' | 'timer' | 'stats'
  const [activeTab, setActiveTab] = useState('hub');

  // FEATURE 1: House Phase state
  const [housePhase, setHousePhase] = useState(() => 
    loadStorageString('bigboss_phase', 'HOUSE')
  );

  // FEATURE 2: Undo History Stack
  const [history, setHistory] = useState([]);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState(null);

  // Contestants state (with safe LocalStorage fallback)
  const [contestants, setContestants] = useState(() => 
    loadStorage('bigboss_contestants', INITIAL_CONTESTANTS)
  );

  // Tasks state
  const [tasks, setTasks] = useState(() => 
    loadStorage('bigboss_tasks', INITIAL_TASKS)
  );

  // FEATURE 1 (New): Role Based Access Control
  const [currentRole, setCurrentRole] = useState(() => 
    loadStorageString('bigboss_role', 'BIG_BOSS')
  );

  // FEATURE 3 (New): Event Notification System
  const [notifications, setNotifications] = useState(() => 
    loadStorage('bigboss_notifications', [
      { id: 'n1', title: 'Surveillance Active', message: 'Big Boss Command Center initialized for Day 22.', type: 'info', source: 'Control Room', timestamp: '08:00', read: true },
      { id: 'n2', title: 'Captaincy Sworn', message: 'Aria Stark crowned reigning House Captain.', type: 'success', source: 'Big Boss', timestamp: '19:30', read: true },
      { id: 'n3', title: 'Danger Zone Alert', message: 'Vikram, Marcus, and Chloe in immediate eviction jeopardy.', type: 'danger', source: 'Nominations', timestamp: '16:00', read: false }
    ])
  );
  const [toasts, setToasts] = useState([]);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Announcements state
  const [announcements, setAnnouncements] = useState(() => 
    loadStorage('bigboss_announcements', INITIAL_ANNOUNCEMENTS)
  );

  // FEATURE 2 (New): Real Time Activity audit log with categories & actors
  const [activityLogs, setActivityLogs] = useState(() => 
    loadStorage('bigboss_logs', [
      { id: 'l1', action: 'System online: Tech House Command Center operational', details: 'All surveillance telemetry active', category: 'SYSTEM', actor: 'System Auto', timestamp: 'Day 22, 08:00:00' },
      { id: 'l2', action: 'Captaincy conferred upon Aria Stark', details: 'Aria Stark sworn in as House Captain', category: 'CAPTAINCY', actor: 'Big Boss', timestamp: 'Day 21, 19:30:00' },
      { id: 'l3', action: 'Danger Zone activated with 3 nominees', details: 'Vikram, Marcus and Chloe on the block', category: 'NOMINATIONS', actor: 'Surveillance AI', timestamp: 'Day 21, 16:00:00' },
    ])
  );

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
    try {
      localStorage.setItem('bigboss_role', currentRole);
    } catch (e) { console.warn(e); }
  }, [currentRole]);

  useEffect(() => {
    try {
      localStorage.setItem('bigboss_notifications', JSON.stringify(notifications));
    } catch (e) { console.warn(e); }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('bigboss_phase', housePhase);
    } catch (e) { console.warn(e); }
  }, [housePhase]);

  useEffect(() => {
    try {
      localStorage.setItem('bigboss_contestants', JSON.stringify(contestants));
    } catch (e) { console.warn(e); }
  }, [contestants]);

  useEffect(() => {
    try {
      localStorage.setItem('bigboss_tasks', JSON.stringify(tasks));
    } catch (e) { console.warn(e); }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('bigboss_announcements', JSON.stringify(announcements));
    } catch (e) { console.warn(e); }
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem('bigboss_logs', JSON.stringify(activityLogs));
    } catch (e) { console.warn(e); }
  }, [activityLogs]);

  // Helper: Toast notification
  const showToast = (msg, isError = false) => {
    setToastMessage({ msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper: Event Notification & Floating Toast
  const addNotification = ({ title, message, type = 'info', source = 'Surveillance' }) => {
    const id = 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const newNotif = {
      id,
      title,
      message,
      type,
      source,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      read: false
    };

    setNotifications(prev => [newNotif, ...prev.slice(0, 49)]);
    setToasts(prev => [...prev.slice(-3), { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);

    if (type === 'danger') soundManager.playAlert();
    else if (type === 'success') soundManager.playSuccess();
    else if (type === 'warning') soundManager.playGong();
  };

  // Helper: RBAC Permission Verification
  const checkPermission = (actionName, permissionKey) => {
    const roleConfig = ROLES[currentRole] || ROLES.BIG_BOSS;
    if (!roleConfig.permissions[permissionKey]) {
      soundManager.playAlert();
      addNotification({
        title: 'ACCESS RESTRICTED (RBAC)',
        message: `Action "${actionName}" denied for role [${roleConfig.name}]. Switch to Big Boss or authorized authority.`,
        type: 'danger',
        source: 'Security Grid'
      });
      showToast(`Denied: Role [${roleConfig.name}] lacks permission for ${actionName}`, true);
      return false;
    }
    return true;
  };

  // Helper: Log House Activity (Enhanced with Actor & Real-time timestamp)
  const logActivity = (action, details = '', category = 'SYSTEM', actor = 'Big Boss') => {
    const newLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      action,
      details,
      category,
      actor,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 99)]); // keep last 100
  };

  // Helper: Push state snapshot onto Undo History
  const pushHistory = (label, category = 'SYSTEM') => {
    setHistory(prev => [
      {
        id: 'snap_' + Date.now(),
        label,
        category,
        contestants: JSON.parse(JSON.stringify(contestants)),
        tasks: JSON.parse(JSON.stringify(tasks)),
        housePhase
      },
      ...prev.slice(0, 19) // keep max 20 entries
    ]);
  };

  // FEATURE 1 (New): Role Switch Handler
  const handleRoleChange = (newRoleId) => {
    const targetRole = ROLES[newRoleId];
    if (!targetRole) return;
    setCurrentRole(newRoleId);
    soundManager.playClick();
    logActivity(`Access Role Switched`, `Operative is now authenticated as [${targetRole.name}]`, 'SECURITY', targetRole.name);
    addNotification({
      title: 'ACCESS ROLE SWITCHED',
      message: `Operating authorization set to [${targetRole.name}] (${targetRole.shortTitle}).`,
      type: 'info',
      source: 'RBAC Security'
    });
    showToast(`Active Role: [ ${targetRole.name} ]`);
  };

  // FEATURE 2 (New): Simulate Incident
  const handleSimulateIncident = () => {
    if (!checkPermission('Simulate Incident', 'canSimulateIncident')) return;
    const incidents = [
      { action: 'Surveillance Alert: Unauthorized whisper in Pantry', details: 'Aria and Devansh discussing secret voting pact', cat: 'SECURITY', actor: 'Surveillance AI', type: 'warning' },
      { action: 'Rule Violation: Microphones covered near Pool', details: 'Penalty warning issued to Cyber Sentinel team', cat: 'SECURITY', actor: 'Big Boss', type: 'danger' },
      { action: 'House Matrix: Bounty Hack detected in Mainframe', details: 'Marcus attempted unauthorized point spoofing', cat: 'SYSTEM', actor: 'Security Grid', type: 'danger' },
      { action: 'Confession Room summons issued', details: 'House Captain summoned for secret nominations discussion', cat: 'CAPTAINCY', actor: 'Big Boss', type: 'info' },
      { action: 'Emergency Siren: Flash House Meeting ordered', details: 'All housemates assemble at Living Room podium immediately', cat: 'SYSTEM', actor: 'Control Room', type: 'warning' },
      { action: 'Alliance Detected: Quantum Core & Cloud Forge pact', details: 'Collaborative strategy identified in Garden area', cat: 'SECURITY', actor: 'Surveillance AI', type: 'info' }
    ];

    const inc = incidents[Math.floor(Math.random() * incidents.length)];
    logActivity(inc.action, inc.details, inc.cat, inc.actor);
    addNotification({
      title: inc.action,
      message: inc.details,
      type: inc.type,
      source: inc.actor
    });
  };

  // Clear Activity Logs
  const handleClearLogs = () => {
    if (!checkPermission('Clear Logs', 'canResetData')) return;
    pushHistory('Clear Telemetry Logs', 'SYSTEM');
    setActivityLogs([]);
    addNotification({
      title: 'Telemetry Cleared',
      message: 'Surveillance audit log reset by Big Boss.',
      type: 'info',
      source: 'Control Room'
    });
    showToast('Activity logs cleared');
  };

  // Notification Center Handlers
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    soundManager.playSuccess();
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    soundManager.playClick();
  };

  const handleTriggerSimulatedNotification = (type) => {
    switch (type) {
      case 'siren':
        addNotification({
          title: '🚨 EMERGENCY HOUSE SIREN',
          message: 'Big Boss has sounded the House siren. All housemates must freeze immediately!',
          type: 'danger',
          source: 'Big Boss'
        });
        break;
      case 'task':
        addNotification({
          title: '📋 TASK DIRECTIVE TRANSMISSION',
          message: 'New high-stakes task commissioned in Tasks HQ. Bounty clock running.',
          type: 'warning',
          source: 'Tasks Master'
        });
        break;
      case 'captain':
        addNotification({
          title: '👑 CAPTAINCY SUMMONS',
          message: 'House Captain is summoned to the Confession Room for secret nominations review.',
          type: 'info',
          source: 'House Captain'
        });
        break;
      default:
        addNotification({
          title: 'HOUSE NOTICE',
          message: 'Daily routine schedule updated.',
          type: 'info',
          source: 'House Control'
        });
    }
  };

  // FEATURE 2: Undo Last Action handler
  const handleUndo = () => {
    if (!checkPermission('Undo Action', 'canUndo')) return;
    if (history.length === 0) return;
    const [lastSnapshot, ...remainingHistory] = history;
    if (!lastSnapshot) return;

    setContestants(lastSnapshot.contestants);
    setTasks(lastSnapshot.tasks);
    if (lastSnapshot.housePhase) {
      setHousePhase(lastSnapshot.housePhase);
    }
    setHistory(remainingHistory);

    soundManager.playSuccess();
    showToast(`Undo: Reverted "${lastSnapshot.label}"`);
    logActivity(`UNDO ACTION`, `Reverted "${lastSnapshot.label}"`, 'SYSTEM', 'Big Boss');
    addNotification({
      title: 'Action Undone',
      message: `Reverted "${lastSnapshot.label}" safely.`,
      type: 'info',
      source: 'Undo Safety Engine'
    });
  };

  // FEATURE 1: Phase change handler
  const handlePhaseChange = (newPhase) => {
    if (newPhase === housePhase) return;
    if (!checkPermission('Change House Phase', 'canChangePhase')) return;
    pushHistory(`House Phase changed to ${newPhase}`, 'SYSTEM');
    const oldPhase = housePhase;
    setHousePhase(newPhase);
    soundManager.playGong();
    logActivity(`House Phase changed`, `${oldPhase} → ${newPhase}`, 'SYSTEM', 'Big Boss');
    addNotification({
      title: 'House Phase Transition',
      message: `The Tech House has moved to phase [ ${newPhase} ].`,
      type: 'info',
      source: 'Big Boss'
    });
    showToast(`Current House Phase: [ ${newPhase} ]`);
  };

  // Derived Single Source of Truth
  const captain = contestants.find(c => c.isCaptain && c.status !== 'Evicted');
  const dangerCount = contestants.filter(c => c.status === 'Nominated').length;

  // ----------------------------------------------------
  // ACTION HANDLERS
  // ----------------------------------------------------

  // Points Add / Deduct (Prevents NaN/undefined/negative values)
  const handleAdjustPoints = (contestantId, amount, reason) => {
    if (!checkPermission('Adjust Points', 'canAdjustPoints')) return;
    const numAmount = Math.round(Number(amount));
    if (isNaN(numAmount) || numAmount === 0) return;

    const target = contestants.find(c => c.id === contestantId);
    const sign = numAmount > 0 ? `+${numAmount}` : `${numAmount}`;

    // Snapshot before modifying
    pushHistory(`${sign} points to ${target ? target.name.split(' ')[0] : 'Contestant'}`, 'POINTS');

    setContestants(prev => prev.map(c => {
      if (c.id === contestantId) {
        const currentPoints = Number(c.points) || 0;
        const updatedPoints = Math.max(0, currentPoints + numAmount);
        return { ...c, points: updatedPoints };
      }
      return c;
    }));

    const actor = ROLES[currentRole]?.name || 'Big Boss';
    logActivity(`Points Transaction: ${sign} PTS to ${target ? target.name : contestantId}`, `Reason: ${reason}`, 'POINTS', actor);
    addNotification({
      title: 'Points Transaction',
      message: `${sign} PTS awarded to ${target ? target.name.split(' ')[0] : 'Contestant'} (${reason || 'Rule update'}).`,
      type: numAmount > 0 ? 'success' : 'warning',
      source: actor
    });
  };

  const handleQuickPoints = (contestantId, amount, reason = 'Quick adjustment') => {
    handleAdjustPoints(contestantId, amount, reason);
    if (amount > 0) {
      soundManager.playSuccess();
    } else {
      soundManager.playDeduct();
    }
  };

  // Captaincy Assignment (Only 1 Captain, previous captain loses status, new captain gets immunity)
  const handleAssignCaptain = (newCaptainId) => {
    if (!checkPermission('Assign Captain', 'canAssignCaptain')) return;
    const newCap = contestants.find(c => c.id === newCaptainId);
    if (!newCap) return;

    // Snapshot before modifying
    pushHistory(`Appointed ${newCap.name.split(' ')[0]} as Captain`, 'CAPTAINCY');

    setContestants(prev => prev.map(c => {
      if (c.id === newCaptainId) {
        return {
          ...c,
          status: 'Captain',
          isCaptain: true,
          isImmune: true,
          dangerZoneVotes: 0,
          nominationReason: null
        };
      }
      if (c.isCaptain) {
        // Step down previous captain cleanly
        return {
          ...c,
          status: 'Active',
          isCaptain: false,
          isImmune: false,
        };
      }
      return c;
    }));

    const msg = `Captaincy Decree: ${newCap.name} has been sworn in as the new House Captain!`;
    handleAddAnnouncement(msg, 'captaincy');
    logActivity(`House Captain Inauguration`, `${newCap.name} sworn into office with full immunity.`, 'CAPTAINCY');
  };

  // Immunity Toggle (If granted to nominated contestant, automatically removes them from Danger Zone)
  const handleToggleImmunity = (contestantId) => {
    if (!checkPermission('Grant/Revoke Immunity', 'canGrantImmunity')) return;
    const target = contestants.find(c => c.id === contestantId);
    if (!target || target.status === 'Evicted') return;

    // Snapshot before modifying
    pushHistory(`${target.isImmune ? 'Revoked' : 'Granted'} immunity for ${target.name.split(' ')[0]}`, 'IMMUNITY');

    setContestants(prev => prev.map(c => {
      if (c.id === contestantId) {
        const nextImmune = !c.isImmune;
        
        let nextStatus = c.status;
        if (c.isCaptain) {
          nextStatus = 'Captain';
        } else if (nextImmune) {
          nextStatus = 'Immune';
        } else {
          nextStatus = 'Active';
        }

        return {
          ...c,
          isImmune: nextImmune,
          status: nextStatus,
          dangerZoneVotes: nextImmune ? 0 : c.dangerZoneVotes,
          nominationReason: nextImmune ? null : c.nominationReason
        };
      }
      return c;
    }));

    const statusText = !target.isImmune ? 'GRANTED' : 'REVOKED';
    logActivity(`Immunity Protocol: ${statusText} for ${target.name}`, '', 'IMMUNITY', 'House Rules');
    addNotification({
      title: 'Immunity Protocol',
      message: `Immunity shield ${statusText.toLowerCase()} for ${target.name.split(' ')[0]}.`,
      type: 'info',
      source: 'House Rules'
    });
  };

  // Nomination Toggle (Strict validation: immune, captain, or evicted CANNOT be nominated)
  const handleToggleNomination = (contestantId, reason = '') => {
    if (!checkPermission('Toggle Nomination', 'canNominate')) return;
    const target = contestants.find(c => c.id === contestantId);
    if (!target) return;

    // Strict guard against nominating immune / captain / evicted
    if (target.status !== 'Nominated') {
      if (target.isImmune || target.isCaptain || target.status === 'Evicted') {
        logActivity(`Nomination Blocked`, `${target.name} has immunity shield / captaincy and cannot be nominated.`, 'NOMINATIONS', 'House Rules');
        return;
      }
    }

    const isNom = target.status === 'Nominated';
    pushHistory(`${isNom ? 'Pardoned' : 'Nominated'} ${target.name.split(' ')[0]}`, 'NOMINATIONS');

    setContestants(prev => prev.map(c => {
      if (c.id === contestantId) {
        const isNominated = c.status === 'Nominated';
        return {
          ...c,
          status: isNominated ? (c.isImmune ? 'Immune' : c.isCaptain ? 'Captain' : 'Active') : 'Nominated',
          dangerZoneVotes: isNominated ? 0 : 200,
          nominationReason: isNominated ? null : (reason || 'House tactical consensus'),
        };
      }
      return c;
    }));

    const actor = ROLES[currentRole]?.name || 'Big Boss';
    logActivity(
      isNom ? `Pardoned from Danger Zone: ${target.name}` : `Nominated to Danger Zone: ${target.name}`,
      reason || '',
      'NOMINATIONS',
      actor
    );
    addNotification({
      title: 'Danger Zone Updated',
      message: isNom ? `${target.name} pardoned from Danger Zone.` : `${target.name} placed on the eviction block!`,
      type: 'warning',
      source: actor
    });
  };

  // Eviction Execution (Removes from active house & leaderboard, clears immunity & captaincy)
  const handleConfirmEviction = (contestantId, reason) => {
    if (!checkPermission('Evict Contestant', 'canEvict')) return;
    const target = contestants.find(c => c.id === contestantId);
    if (!target) return;

    pushHistory(`Evicted ${target.name.split(' ')[0]}`, 'EVICTIONS');

    setContestants(prev => prev.map(c => {
      if (c.id === contestantId) {
        return {
          ...c,
          status: 'Evicted',
          isCaptain: false,
          isImmune: false,
          dangerZoneVotes: 0,
          nominationReason: null,
          evictedDay: 22,
          evictionReason: reason || 'Evicted via official Big Boss verdict.',
        };
      }
      return c;
    }));

    const decree = `EVICTION VERDICT: ${target.name} has been formally evicted from the Tech House.`;
    handleAddAnnouncement(decree, 'danger');
    logActivity(`CONTESTANT EVICTED: ${target.name}`, `Reason: ${reason}`, 'EVICTIONS', 'Big Boss');
    addNotification({
      title: '🚨 EVICTION EXECUTION',
      message: `${target.name} has been permanently evicted from the Tech House.`,
      type: 'danger',
      source: 'Big Boss Verdict'
    });
  };

  // Wildcard Revive Evicted Contestant
  const handleReviveContestant = (contestantId) => {
    if (!checkPermission('Revive Contestant', 'canEvict')) return;
    const target = contestants.find(c => c.id === contestantId);
    if (!target) return;

    pushHistory(`Wildcard restored ${target.name.split(' ')[0]}`, 'EVICTIONS');

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

    soundManager.playSuccess();
    handleAddAnnouncement(`WILDCARD RETURN: ${target.name} has re-entered the Tech House!`, 'alert');
    logActivity(`Wildcard Entry Reinstated: ${target.name}`, '', 'EVICTIONS', 'Big Boss');
    addNotification({
      title: 'Wildcard Re-entry',
      message: `${target.name} has re-entered the Tech House with active standing!`,
      type: 'success',
      source: 'Big Boss'
    });
  };

  // Add or Edit Contestant
  const handleSaveContestant = (data) => {
    if (!checkPermission('Modify Contestant', 'canEditContestants')) return;
    if (editingContestant) {
      pushHistory(`Modified ${data.name.split(' ')[0]}`, 'SYSTEM');
      setContestants(prev => prev.map(c => c.id === data.id ? { ...c, ...data, points: Math.max(0, Number(data.points) || 0) } : c));
      logActivity(`Contestant Profile Modified: ${data.name}`, '', 'SYSTEM', 'Big Boss');
      addNotification({
        title: 'Profile Updated',
        message: `${data.name} profile credentials updated.`,
        type: 'info',
        source: 'Contestant Registry'
      });
    } else {
      pushHistory(`Enlisted ${data.name.split(' ')[0]}`, 'SYSTEM');
      const validatedData = {
        ...data,
        points: Math.max(0, Number(data.points) || 0)
      };
      setContestants(prev => [validatedData, ...prev]);
      logActivity(`New Contestant Enlisted: ${data.name} (${data.team})`, '', 'SYSTEM', 'Big Boss');
      addNotification({
        title: 'Contestant Enlisted',
        message: `${data.name} enrolled in ${data.team}.`,
        type: 'success',
        source: 'Big Boss'
      });
      soundManager.playSuccess();
    }
    setEditingContestant(null);
  };

  // Task Completion (Awards points cleanly by ID or by name)
  const handleCompleteTask = (taskId) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    pushHistory(`Completed task "${targetTask.title}"`, 'TASKS');

    // Mark task complete
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'Completed', completedAt: 'Just Now' };
      }
      return t;
    }));

    const rewardPts = Number(targetTask.points) || 0;

    // Reward points
    if (targetTask.assignedType === 'contestant') {
      setContestants(prev => prev.map(c => {
        if ((targetTask.contestantId && c.id === targetTask.contestantId) || (!targetTask.contestantId && c.name === targetTask.assignedTo)) {
          return {
            ...c,
            points: (Number(c.points) || 0) + rewardPts,
            tasksCompleted: (Number(c.tasksCompleted) || 0) + 1
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
            points: (Number(c.points) || 0) + rewardPts,
            tasksCompleted: (Number(c.tasksCompleted) || 0) + 1
          };
        }
        return c;
      }));
    }

    const actor = ROLES[currentRole]?.name || 'Big Boss';
    logActivity(`Task Completed: "${targetTask.title}"`, `+${rewardPts} PTS awarded to ${targetTask.assignedTo}`, 'TASKS', actor);
    addNotification({
      title: 'Task Bounty Credited',
      message: `Directive "${targetTask.title}" completed! +${rewardPts} PTS awarded to ${targetTask.assignedTo}.`,
      type: 'success',
      source: actor
    });
  };

  const handleFailTask = (taskId) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    pushHistory(`Failed task "${targetTask.title}"`, 'TASKS');

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'Failed' };
      }
      return t;
    }));

    logActivity(`Task Failed: "${targetTask.title}" by ${targetTask.assignedTo}`, '', 'TASKS', 'Tasks HQ');
  };

  const handleDeleteTask = (taskId) => {
    if (!checkPermission('Delete Task', 'canCommissionTasks')) return;
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    pushHistory(`Deleted task "${targetTask.title}"`, 'TASKS');
    setTasks(prev => prev.filter(t => t.id !== taskId));
    logActivity(`Task Record Deleted: "${targetTask.title}"`, '', 'TASKS', 'Tasks HQ');
  };

  const handleAddTask = (newTask) => {
    if (!checkPermission('Commission Task', 'canCommissionTasks')) return;
    pushHistory(`Commissioned task "${newTask.title}"`, 'TASKS');
    setTasks(prev => [newTask, ...prev]);
    soundManager.playSuccess();
    const actor = ROLES[currentRole]?.name || 'Big Boss';
    logActivity(`New Directive Dispatched: "${newTask.title}" for ${newTask.assignedTo}`, '', 'TASKS', actor);
    addNotification({
      title: 'Task Commissioned',
      message: `New task "${newTask.title}" (${newTask.points} pts) assigned to ${newTask.assignedTo}.`,
      type: 'info',
      source: actor
    });
  };

  // Announcements (Rejects empty / whitespace)
  const handleAddAnnouncement = (message, type = 'alert') => {
    if (!message || !message.trim()) return;
    const cleanMessage = message.trim();

    const item = {
      id: 'a_' + Date.now(),
      message: cleanMessage,
      timestamp: `Day 22, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      type,
      priority: 'HIGH'
    };
    setAnnouncements(prev => [item, ...prev]);
    setLatestAnnouncementOverlay(item);

    addNotification({
      title: '📢 Big Boss Announcement',
      message: cleanMessage,
      type: type === 'danger' ? 'danger' : 'info',
      source: 'Big Boss Voice'
    });
    logActivity(`Announcement Broadcast: "${cleanMessage}"`, '', 'SYSTEM');
  };

  // Nominee Votes Update
  const handleUpdateNomineeVotes = (contestantId, delta) => {
    setContestants(prev => prev.map(c => {
      if (c.id === contestantId) {
        return { ...c, dangerZoneVotes: Math.max(10, (Number(c.dangerZoneVotes) || 150) + delta) };
      }
      return c;
    }));
  };

  // Reset to Sample Demo Data
  const handleResetData = () => {
    if (window.confirm("Reset all Tech House data back to fresh Big Boss initial state?")) {
      pushHistory('Reset House to Default Demo State', 'SYSTEM');
      setContestants(INITIAL_CONTESTANTS);
      setTasks(INITIAL_TASKS);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setHousePhase('HOUSE');
      setActivityLogs([
        { id: 'l_init', action: 'House data reset to default Big Boss demo state', details: 'Initial conditions restored', category: 'SYSTEM', timestamp: 'Just now' }
      ]);
      try { localStorage.clear(); } catch (e) { console.warn(e); }
      soundManager.playGong();
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans grid-bg">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-16 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl font-mono text-xs flex items-center space-x-3 border animate-bounce ${
          toastMessage.isError
            ? 'bg-red-950/95 border-red-500 text-red-200'
            : 'bg-emerald-950/95 border-emerald-500 text-emerald-200'
        }`}>
          <span className="font-semibold">{toastMessage.msg}</span>
        </div>
      )}

      {/* Top Surveillance Ticker */}
      <BroadcastBanner
        announcements={announcements}
        onAddAnnouncement={handleAddAnnouncement}
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        latestAnnouncement={latestAnnouncementOverlay}
        onDismissLatest={() => setLatestAnnouncementOverlay(null)}
      />

      {/* Main Command Header with Phase Display & Undo */}
      <Header
        captain={captain}
        dangerCount={dangerCount}
        onOpenBroadcast={() => setIsBroadcastOpen(true)}
        onOpenCaptaincy={() => setIsCaptaincyModalOpen(true)}
        currentDay={22}
        chaosIndex={68}
        housePhase={housePhase}
        canUndo={history.length > 0}
        onUndo={handleUndo}
        undoCount={history.length}
        lastUndoAction={history[0]?.label || ''}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        unreadNotificationCount={notifications.filter(n => !n.read).length}
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
            housePhase={housePhase}
            onPhaseChange={handlePhaseChange}
            canUndo={history.length > 0}
            onUndo={handleUndo}
            lastUndoAction={history[0]?.label || ''}
            activityLogs={activityLogs}
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

        {/* Task Timer is kept mounted with display toggle so countdown is never interrupted across tab switches */}
        <div className={activeTab === 'timer' ? 'block' : 'hidden'}>
          <TaskTimer
            onAnnounceTimerDone={(msg) => {
              handleAddAnnouncement(msg, 'danger');
              logActivity('Timer Notification', msg, 'SYSTEM', 'Timer Master');
            }}
          />
        </div>

        {activeTab === 'stats' && (
          <HouseStats
            contestants={contestants}
            tasks={tasks}
            captain={captain}
            activityLogs={activityLogs}
            onResetData={handleResetData}
            onSimulateIncident={handleSimulateIncident}
            onClearLogs={handleClearLogs}
            currentRole={currentRole}
          />
        )}

        {activeTab === 'analytics' && (
          <PerformanceAnalytics
            contestants={contestants}
            tasks={tasks}
            housePhase={housePhase}
            chaosIndex={68}
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

      {/* Floating Toast Notification Stack */}
      <ToastStack
        toasts={toasts}
        onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
      />

      {/* Event Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onClearAll={handleClearAllNotifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onTriggerSimulatedNotification={handleTriggerSimulatedNotification}
        unreadCount={notifications.filter(n => !n.read).length}
      />

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
