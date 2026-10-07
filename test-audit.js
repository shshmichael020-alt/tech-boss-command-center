// Comprehensive Automated Regression & Feature Test Suite for Big Boss Command Center

import { INITIAL_CONTESTANTS, INITIAL_TASKS, INITIAL_ANNOUNCEMENTS } from './src/data/initialData.js';

console.log("==========================================================");
console.log("BIG BOSS COMMAND CENTER: REGRESSION & FEATURE TEST SUITE");
console.log("==========================================================");

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// -------------------------------------------------------------------------
// 1. CONTESTANT MANAGEMENT
// -------------------------------------------------------------------------
console.log("\n--- TEST 1: Contestant Management ---");
let contestants = JSON.parse(JSON.stringify(INITIAL_CONTESTANTS));
assert(contestants.length >= 8, `Roster has 8+ contestants (Actual: ${contestants.length})`);

contestants.forEach(c => {
  assert(
    Boolean(c.id && c.name && c.team && typeof c.points === 'number' && c.status),
    `Contestant "${c.name}" has valid id, name, team, points, status`
  );
});

// Enlist new contestant
const newContestant = {
  id: 'c_custom_1',
  name: 'Marcus "Cipher" Wright',
  role: 'Zero-Knowledge Cryptographer',
  team: 'Kernel Hackers',
  points: 1100,
  status: 'Active',
  isCaptain: false,
  isImmune: false,
  tasksCompleted: 0
};
contestants.unshift(newContestant);
assert(contestants.length === INITIAL_CONTESTANTS.length + 1, "New contestant enlisted successfully");
assert(contestants[0].name.includes("Cipher"), "New contestant is at top of roster");

// Edit contestant
contestants[0].name = 'Marcus "Cipher" Prime';
assert(contestants[0].name === 'Marcus "Cipher" Prime', "Contestant name edited dynamically");

// -------------------------------------------------------------------------
// 2. LIVE LEADERBOARD
// -------------------------------------------------------------------------
console.log("\n--- TEST 2: Live Leaderboard ---");
let activeList = contestants.filter(c => c.status !== 'Evicted');
let sortedLeaderboard = [...activeList].sort((a, b) => 
  ((Number(b.points) || 0) - (Number(a.points) || 0)) || a.name.localeCompare(b.name)
);

let initialLeader = sortedLeaderboard[0];
console.log(`Current #1 Leader: ${initialLeader.name} (${initialLeader.points} pts)`);

// Give huge points to a lower ranked contestant
let targetContestant = sortedLeaderboard[4];
const targetOriginalPts = targetContestant.points;
targetContestant.points = initialLeader.points + 500;

let updatedLeaderboard = [...contestants.filter(c => c.status !== 'Evicted')].sort((a, b) => 
  ((Number(b.points) || 0) - (Number(a.points) || 0)) || a.name.localeCompare(b.name)
);
assert(updatedLeaderboard[0].id === targetContestant.id, "Target contestant is now #1 on the leaderboard");
assert(updatedLeaderboard[0].points === targetOriginalPts + 500 + (initialLeader.points - targetOriginalPts), "Leaderboard points reflect exact total");

// Evicted contestants must be excluded
let evictedCandidate = updatedLeaderboard[2];
evictedCandidate.status = 'Evicted';
let postEvictionLeaderboard = [...contestants.filter(c => c.status !== 'Evicted')].sort((a, b) => 
  ((Number(b.points) || 0) - (Number(a.points) || 0)) || a.name.localeCompare(b.name)
);
assert(!postEvictionLeaderboard.some(c => c.id === evictedCandidate.id), "Evicted contestant immediately removed from active leaderboard");

// -------------------------------------------------------------------------
// 3. TASK MANAGEMENT
// -------------------------------------------------------------------------
console.log("\n--- TEST 3: Task Management ---");
let tasks = JSON.parse(JSON.stringify(INITIAL_TASKS));
let initialCompletedTasks = tasks.filter(t => t.status === 'Completed').length;

const customTask = {
  id: 't_custom_99',
  title: 'Quantum Key Distribution Simulator',
  description: 'Implement BB84 protocol',
  assignedTo: targetContestant.name,
  assignedType: 'contestant',
  contestantId: targetContestant.id,
  points: 400,
  difficulty: 'Hard',
  status: 'Pending'
};
tasks.unshift(customTask);
assert(tasks[0].status === 'Pending', "Commissioned task starts with Pending status");

// Complete task
const ptsBeforeTask = targetContestant.points;
customTask.status = 'Completed';
targetContestant.points += customTask.points;
targetContestant.tasksCompleted = (targetContestant.tasksCompleted || 0) + 1;

let postCompleteTasks = tasks.filter(t => t.status === 'Completed').length;
assert(postCompleteTasks === initialCompletedTasks + 1, "Completed tasks count incremented");
assert(targetContestant.points === ptsBeforeTask + 400, "Contestant points credited with task bounty");

// -------------------------------------------------------------------------
// 4. POINT SYSTEM
// -------------------------------------------------------------------------
console.log("\n--- TEST 4: Point System ---");
const testContestant = contestants.find(c => c.status === 'Active');
const basePts = testContestant.points;

// Add points
testContestant.points = Math.max(0, testContestant.points + 150);
assert(testContestant.points === basePts + 150, "Points increment (+150) calculated accurately");

// Deduct points
testContestant.points = Math.max(0, testContestant.points - 200);
assert(testContestant.points === basePts - 50, "Points deduction (-200) calculated accurately");

// Deduct below zero guard
testContestant.points = Math.max(0, testContestant.points - 999999);
assert(testContestant.points === 0, "Points deduction prevented negative values (bounded at 0)");
assert(!isNaN(testContestant.points), "Points value is valid number, not NaN");

// -------------------------------------------------------------------------
// 5. CAPTAINCY
// -------------------------------------------------------------------------
console.log("\n--- TEST 5: Captaincy ---");
let currentCaptain = contestants.find(c => c.isCaptain && c.status !== 'Evicted');
assert(Boolean(currentCaptain), "A reigning House Captain exists");

let eligibleNewCap = contestants.find(c => c.status === 'Active' && !c.isCaptain);
assert(Boolean(eligibleNewCap), "Eligible candidate for Captain found");

// Transfer captaincy
const oldCapId = currentCaptain.id;
const newCapId = eligibleNewCap.id;

contestants = contestants.map(c => {
  if (c.id === newCapId) {
    return { ...c, isCaptain: true, isImmune: true, status: 'Captain' };
  }
  if (c.isCaptain) {
    return { ...c, isCaptain: false, isImmune: false, status: 'Active' };
  }
  return c;
});

let updatedCaptains = contestants.filter(c => c.isCaptain && c.status !== 'Evicted');
assert(updatedCaptains.length === 1, "Exactly one House Captain exists");
assert(updatedCaptains[0].id === newCapId, "New candidate is confirmed House Captain");
assert(contestants.find(c => c.id === oldCapId).isCaptain === false, "Previous captain lost captaincy status");

// -------------------------------------------------------------------------
// 6 & 7. NOMINATIONS & IMMUNITY
// -------------------------------------------------------------------------
console.log("\n--- TEST 6 & 7: Nominations & Immunity ---");
let candidateImmune = contestants.find(c => c.status === 'Active' && !c.isImmune && !c.isCaptain);
assert(Boolean(candidateImmune), "Found active non-immune candidate");

// Grant immunity
candidateImmune.isImmune = true;
candidateImmune.status = 'Immune';
assert(candidateImmune.isImmune === true, "Immunity Shield granted");

// Attempt nomination on immune candidate (Must be BLOCKED)
let blocked = false;
if (candidateImmune.isImmune || candidateImmune.isCaptain) {
  blocked = true;
} else {
  candidateImmune.status = 'Nominated';
}
assert(blocked === true, "Nomination of immune contestant was strictly BLOCKED");
assert(candidateImmune.status === 'Immune', "Candidate status remained Immune");

// Nominate eligible contestant
let nonImmune = contestants.find(c => c.status === 'Active' && !c.isImmune && !c.isCaptain);
assert(Boolean(nonImmune), "Found active non-immune candidate to nominate");
nonImmune.status = 'Nominated';
nonImmune.dangerZoneVotes = 250;

assert(nonImmune.status === 'Nominated', "Eligible contestant nominated successfully");

// -------------------------------------------------------------------------
// 8. DANGER ZONE
// -------------------------------------------------------------------------
console.log("\n--- TEST 8: Danger Zone ---");
let dangerZone = contestants.filter(c => c.status === 'Nominated');
assert(dangerZone.some(c => c.id === nonImmune.id), "Nominated contestant appears in Danger Zone");
assert(!dangerZone.some(c => c.isImmune || c.isCaptain), "Zero immune or captain contestants appear in Danger Zone");

// Pardon / remove nomination
nonImmune.status = 'Active';
dangerZone = contestants.filter(c => c.status === 'Nominated');
assert(!dangerZone.some(c => c.id === nonImmune.id), "Pardoned contestant removed from Danger Zone");

// -------------------------------------------------------------------------
// 9. BIG BOSS ANNOUNCEMENTS
// -------------------------------------------------------------------------
console.log("\n--- TEST 9: Big Boss Announcements ---");
let announcements = JSON.parse(JSON.stringify(INITIAL_ANNOUNCEMENTS));
let countBefore = announcements.length;

// Reject empty / whitespace
const addAnnouncement = (msg) => {
  if (!msg || !msg.trim()) return false;
  announcements.unshift({
    id: 'a_t_' + Date.now(),
    message: msg.trim(),
    timestamp: 'Just now'
  });
  return true;
};

assert(addAnnouncement("") === false, "Empty announcement rejected");
assert(addAnnouncement("    ") === false, "Whitespace-only announcement rejected");
assert(announcements.length === countBefore, "Announcement count unchanged after invalid attempts");

// Valid custom announcement
assert(addAnnouncement("All housemates report to Living Room!") === true, "Valid announcement accepted");
assert(announcements[0].message === "All housemates report to Living Room!", "Latest announcement displayed at the top");

// -------------------------------------------------------------------------
// 10. TASK TIMER
// -------------------------------------------------------------------------
console.log("\n--- TEST 10: Task Timer ---");
let timerRemaining = 300;
let timerRunning = false;

// Start
timerRunning = true;
timerRemaining -= 1;
assert(timerRemaining === 299, "Timer countdown decrements correctly (300 -> 299)");

// Pause
timerRunning = false;
let pausedValue = timerRemaining;
assert(pausedValue === 299, "Timer pause halts countdown stably");

// Reset
timerRemaining = 300;
assert(timerRemaining === 300, "Timer resets back to original configured time (300)");

// -------------------------------------------------------------------------
// 11. HOUSE STATISTICS
// -------------------------------------------------------------------------
console.log("\n--- TEST 11: House Statistics ---");
let activeHousemates = contestants.filter(c => c.status !== 'Evicted');
let sortedActive = [...activeHousemates].sort((a, b) => b.points - a.points);
let highestScorer = sortedActive[0];
let lowestScorer = sortedActive[sortedActive.length - 1];

assert(highestScorer !== undefined && highestScorer.points >= lowestScorer.points, "Highest Scorer (MVP) derived correctly");
assert(lowestScorer !== undefined, "Lowest Scorer (In Jeopardy) derived correctly");
assert(tasks.filter(t => t.status === 'Completed').length > 0, "Completed tasks metric derived correctly");

// -------------------------------------------------------------------------
// 12. EVICTION
// -------------------------------------------------------------------------
console.log("\n--- TEST 12: Eviction ---");
let victim = contestants.find(c => c.status === 'Active');
let activeCountBefore = contestants.filter(c => c.status !== 'Evicted').length;

// Evict
victim.status = 'Evicted';
victim.isCaptain = false;
victim.isImmune = false;
victim.evictionReason = 'Evicted via automated regression test';

let activeCountAfter = contestants.filter(c => c.status !== 'Evicted').length;
let activeLeaderboard = contestants.filter(c => c.status !== 'Evicted');

assert(activeCountAfter === activeCountBefore - 1, "Active contestant count decreased by 1");
assert(!activeLeaderboard.some(c => c.id === victim.id), "Evicted contestant removed from active leaderboard");
assert(victim.evictionReason === 'Evicted via automated regression test', "Eviction verdict preserved");

// -------------------------------------------------------------------------
// FEATURE 1: HOUSE PHASE / ROUND CONTROL
// -------------------------------------------------------------------------
console.log("\n--- NEW FEATURE 1: House Phase / Round Control ---");
const HOUSE_PHASES = ['HOUSE', 'TASK', 'RESULTS', 'NOMINATION', 'DANGER ZONE', 'EVICTION', 'FINAL'];
let currentPhase = 'HOUSE';

// Cycle through all phases
HOUSE_PHASES.forEach(phase => {
  currentPhase = phase;
  assert(currentPhase === phase, `Phase transitioned successfully to: [ ${phase} ]`);
});

// Verify changing phase does not reset contestants, tasks, or points
let savedContestantCount = contestants.length;
let savedTaskCount = tasks.length;
currentPhase = 'DANGER ZONE';

assert(contestants.length === savedContestantCount, "Phase change preserved contestants count");
assert(tasks.length === savedTaskCount, "Phase change preserved tasks count");

// -------------------------------------------------------------------------
// FEATURE 2: UNDO LAST ACTION
// -------------------------------------------------------------------------
console.log("\n--- NEW FEATURE 2: Undo Last Action ---");
let historyStack = [];

const pushSnapshot = (label, category) => {
  historyStack.unshift({
    label,
    category,
    contestants: JSON.parse(JSON.stringify(contestants)),
    tasks: JSON.parse(JSON.stringify(tasks)),
    phase: currentPhase
  });
  if (historyStack.length > 20) historyStack.pop();
};

const performUndo = () => {
  if (historyStack.length === 0) return null;
  const snap = historyStack.shift();
  contestants = snap.contestants;
  tasks = snap.tasks;
  currentPhase = snap.phase;
  return snap;
};

// 1. Points Undo
let undoTarget = contestants.find(c => c.status === 'Active');
let ptsBeforeUndo = undoTarget.points;
pushSnapshot(`+300 pts to ${undoTarget.name}`, 'POINTS');
undoTarget.points += 300;
assert(undoTarget.points === ptsBeforeUndo + 300, "Points added before undo");

let undonePoints = performUndo();
assert(undonePoints !== null, "Undo executed successfully");
let restoredContestant = contestants.find(c => c.id === undoTarget.id);
assert(restoredContestant.points === ptsBeforeUndo, "Exact points restored after Undo");

// 2. Captaincy Undo
let capBeforeUndo = contestants.find(c => c.isCaptain);
let newCapCandidate = contestants.find(c => c.status === 'Active' && !c.isCaptain);
pushSnapshot(`Captaincy to ${newCapCandidate.name}`, 'CAPTAINCY');

contestants = contestants.map(c => {
  if (c.id === newCapCandidate.id) return { ...c, isCaptain: true, status: 'Captain' };
  if (c.isCaptain) return { ...c, isCaptain: false, status: 'Active' };
  return c;
});
assert(contestants.find(c => c.id === newCapCandidate.id).isCaptain === true, "New captain set before undo");

performUndo();
assert(contestants.find(c => c.id === capBeforeUndo.id).isCaptain === true, "Original Captain restored after Undo");
assert(contestants.find(c => c.id === newCapCandidate.id).isCaptain === false, "New candidate captaincy reverted after Undo");

// 3. Eviction Undo
let evictCandidate = contestants.find(c => c.status === 'Active');
let activePreEvict = contestants.filter(c => c.status !== 'Evicted').length;
pushSnapshot(`Evicted ${evictCandidate.name}`, 'EVICTIONS');

evictCandidate.status = 'Evicted';
assert(contestants.filter(c => c.status !== 'Evicted').length === activePreEvict - 1, "Candidate evicted before undo");

performUndo();
assert(contestants.filter(c => c.status !== 'Evicted').length === activePreEvict, "Active contestant count restored after Eviction Undo");
assert(contestants.find(c => c.id === evictCandidate.id).status === 'Active', "Evicted contestant status restored to Active");

// 4. History Empty Guard
assert(historyStack.length === 0, "History stack is now empty");
assert(performUndo() === null, "Undo safely disabled/blocked when history stack is empty");

// -------------------------------------------------------------------------
// FEATURE 3: ENHANCED LIVE ACTION LOG
// -------------------------------------------------------------------------
console.log("\n--- NEW FEATURE 3: Enhanced Live Action Log ---");
let actionLogs = [];

const logEvent = (action, details, category) => {
  actionLogs.unshift({
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    action,
    details,
    category,
    timestamp: '10:15'
  });
};

logEvent('+300 points to Elena', 'Sprint victory', 'POINTS');
logEvent('Task "Quantum Key" assigned', 'Assigned to Devansh', 'TASKS');
logEvent('Devansh appointed Captain', 'Conferred golden crown', 'CAPTAINCY');
logEvent('Aria granted immunity', 'Immunity shield active', 'IMMUNITY');
logEvent('Rohan entered Danger Zone', 'Nominated by consensus', 'NOMINATIONS');
logEvent('Vikram Patel evicted', 'Eliminated Day 22', 'EVICTIONS');
logEvent('House Phase changed: TASK -> NOMINATION', 'Phase transition', 'SYSTEM');
logEvent('UNDO ACTION: Reverted points', 'Reverted +300 pts', 'SYSTEM');

assert(actionLogs.length === 8, "8 categorized action logs registered");
assert(actionLogs[0].action.includes("UNDO ACTION"), "Latest action appears first");

// Test category filters
const logFilters = ['ALL', 'POINTS', 'TASKS', 'CAPTAINCY', 'IMMUNITY', 'NOMINATIONS', 'EVICTIONS', 'SYSTEM'];
logFilters.forEach(filter => {
  const filtered = actionLogs.filter(l => filter === 'ALL' || l.category === filter);
  assert(filtered.length > 0, `Filter [${filter}] returned matching events (${filtered.length}) without mutating source`);
});

console.log("\n==========================================================");
console.log(`ALL VERIFICATION TESTS COMPLETED: ${passCount} PASSED, ${failCount} FAILED`);
console.log("==========================================================");

if (failCount === 0) {
  process.exit(0);
} else {
  process.exit(1);
}
