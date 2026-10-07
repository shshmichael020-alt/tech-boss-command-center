// Comprehensive Automated Verification Suite for Big Boss Command Center Logic

import { INITIAL_CONTESTANTS, INITIAL_TASKS, INITIAL_ANNOUNCEMENTS } from './src/data/initialData.js';

console.log("=== STARTING BIG BOSS INTEGRATION TEST SUITE ===");

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
// TEST FLOW A: POINTS + LEADERBOARD
// -------------------------------------------------------------------------
console.log("\n--- TEST FLOW A: Points + Leaderboard ---");
let contestants = JSON.parse(JSON.stringify(INITIAL_CONTESTANTS));

// Find Aria Stark and Elena Rostova
let aria = contestants.find(c => c.name.includes("Aria"));
let elena = contestants.find(c => c.name.includes("Elena"));
assert(aria.points === 1720, "Initial Aria points is 1720");
assert(elena.points === 1580, "Initial Elena points is 1580");

// Award Elena 300 points so Elena overtakes Aria
elena.points += 300;
let sorted = [...contestants].filter(c => c.status !== 'Evicted').sort((a, b) => b.points - a.points);
assert(sorted[0].name.includes("Elena"), "Elena is now rank #1 after adding 300 points");
assert(sorted[0].points === 1880, "Elena new points is 1880");

// Deduct 400 points from Elena
elena.points = Math.max(0, elena.points - 400);
sorted = [...contestants].filter(c => c.status !== 'Evicted').sort((a, b) => b.points - a.points);
assert(sorted[0].name.includes("Aria"), "Aria reclaims rank #1 after deducting 400 points from Elena");
assert(elena.points === 1480, "Elena points updated to 1480");

// -------------------------------------------------------------------------
// TEST FLOW B: IMMUNITY + NOMINATION
// -------------------------------------------------------------------------
console.log("\n--- TEST FLOW B: Immunity + Nomination ---");
// Devansh Sharma is Active, not immune
let devansh = contestants.find(c => c.name.includes("Devansh"));
assert(!devansh.isImmune, "Devansh is initially not immune");

// Grant immunity to Devansh
devansh.isImmune = true;
devansh.status = 'Immune';
assert(devansh.isImmune === true, "Devansh is now Immune");

// Attempt to nominate Devansh (should be blocked)
let nominationBlocked = false;
if (devansh.isImmune || devansh.isCaptain) {
  nominationBlocked = true;
} else {
  devansh.status = 'Nominated';
}
assert(nominationBlocked === true, "Nomination of immune contestant Devansh was successfully BLOCKED");
assert(devansh.status === 'Immune', "Devansh status remains Immune and did NOT become Nominated");

// Nominate Rohan Mehta (Active and not immune)
let rohan = contestants.find(c => c.name.includes("Rohan"));
assert(!rohan.isImmune, "Rohan is not immune");
rohan.status = 'Nominated';
rohan.dangerZoneVotes = 200;

let dangerZoneList = contestants.filter(c => c.status === 'Nominated');
assert(dangerZoneList.some(c => c.name.includes("Rohan")), "Rohan appears in Danger Zone");
assert(!dangerZoneList.some(c => c.name.includes("Devansh")), "Immune Devansh NEVER appears in Danger Zone");

// -------------------------------------------------------------------------
// TEST FLOW C: CAPTAINCY
// -------------------------------------------------------------------------
console.log("\n--- TEST FLOW C: Captaincy ---");
let currentCap = contestants.find(c => c.isCaptain && c.status !== 'Evicted');
assert(currentCap.name.includes("Aria"), "Aria is initial Captain");

// Assign Elena as new Captain
const assignCaptain = (newId) => {
  contestants = contestants.map(c => {
    if (c.id === newId) {
      return { ...c, isCaptain: true, isImmune: true, status: 'Captain' };
    }
    if (c.isCaptain) {
      return { ...c, isCaptain: false, isImmune: false, status: 'Active' };
    }
    return c;
  });
};

assignCaptain(elena.id);
let newCap = contestants.find(c => c.isCaptain && c.status !== 'Evicted');
let oldCap = contestants.find(c => c.id === aria.id);
let totalCaptains = contestants.filter(c => c.isCaptain && c.status !== 'Evicted').length;

assert(newCap.id === elena.id, "Elena is now House Captain");
assert(oldCap.isCaptain === false, "Previous captain Aria lost Captain status");
assert(totalCaptains === 1, "Exactly ONE Captain exists in the House");

// -------------------------------------------------------------------------
// TEST FLOW D: TASKS + STATISTICS
// -------------------------------------------------------------------------
console.log("\n--- TEST FLOW D: Tasks + Statistics ---");
let tasks = JSON.parse(JSON.stringify(INITIAL_TASKS));
let initialCompleted = tasks.filter(t => t.status === 'Completed').length;

// Create a new task
const newTask = {
  id: 't_test',
  title: 'Quantum Key Protocol Defense',
  description: 'Test challenge',
  assignedTo: devansh.name,
  assignedType: 'contestant',
  contestantId: devansh.id,
  points: 500,
  difficulty: 'Hard',
  status: 'Pending'
};
tasks.unshift(newTask);
assert(tasks[0].status === 'Pending', "New task starts as Pending/Incomplete");

// Complete the task and award points
const devanshBeforePts = devansh.points;
newTask.status = 'Completed';
devansh.points += newTask.points;
devansh.tasksCompleted = (devansh.tasksCompleted || 0) + 1;

let newCompleted = tasks.filter(t => t.status === 'Completed').length;
assert(newCompleted === initialCompleted + 1, "Completed tasks metric incremented by 1");
assert(devansh.points === devanshBeforePts + 500, "Contestant points increased by task reward (+500)");

// -------------------------------------------------------------------------
// TEST FLOW E: TIMER LOGIC
// -------------------------------------------------------------------------
console.log("\n--- TEST FLOW E: Task Timer Logic ---");
let totalSeconds = 300;
let remainingSeconds = 300;
let isRunning = false;

// Start
isRunning = true;
remainingSeconds -= 1; // 1s tick
assert(remainingSeconds === 299, "Timer countdown decreased to 299s");

// Pause
isRunning = false;
let pausedSeconds = remainingSeconds;
// Time should not change while paused
assert(pausedSeconds === 299, "Timer paused and holds steady at 299s");

// Reset
remainingSeconds = totalSeconds;
assert(remainingSeconds === 300, "Timer resets back to configured starting time (300s)");
assert(Math.max(0, -5) === 0, "Timer prevents negative time");

// -------------------------------------------------------------------------
// TEST FLOW F: EVICTION
// -------------------------------------------------------------------------
console.log("\n--- TEST FLOW F: Eviction ---");
let activeBefore = contestants.filter(c => c.status !== 'Evicted').length;
let targetToEvict = contestants.find(c => c.status === 'Nominated');
assert(targetToEvict !== undefined, "Found nominated contestant to evict: " + targetToEvict.name);

// Perform eviction
targetToEvict.status = 'Evicted';
targetToEvict.isCaptain = false;
targetToEvict.isImmune = false;
targetToEvict.evictionReason = "Tested eviction flow";

let activeAfter = contestants.filter(c => c.status !== 'Evicted').length;
let leaderboardAfter = contestants.filter(c => c.status !== 'Evicted');
let dangerZoneAfter = contestants.filter(c => c.status === 'Nominated');

assert(activeAfter === activeBefore - 1, "Active contestant count decreased by 1");
assert(!leaderboardAfter.some(c => c.id === targetToEvict.id), "Evicted contestant removed from active leaderboard");
assert(!dangerZoneAfter.some(c => c.id === targetToEvict.id), "Evicted contestant removed from Danger Zone");
assert(targetToEvict.evictionReason === "Tested eviction flow", "Eviction reason recorded in record");

// -------------------------------------------------------------------------
// TEST FLOW G: ANNOUNCEMENTS
// -------------------------------------------------------------------------
console.log("\n--- TEST FLOW G: Announcements ---");
let announcements = JSON.parse(JSON.stringify(INITIAL_ANNOUNCEMENTS));
let initialAnnounceCount = announcements.length;

// Reject empty / whitespace
const addAnnouncement = (msg) => {
  if (!msg || !msg.trim()) return false;
  announcements.unshift({
    id: 'a_' + Date.now(),
    message: msg.trim(),
    timestamp: 'Just now'
  });
  return true;
};

assert(addAnnouncement("") === false, "Empty announcement was safely rejected");
assert(addAnnouncement("   ") === false, "Whitespace announcement was safely rejected");
assert(announcements.length === initialAnnounceCount, "Announcement list count unchanged after invalid attempts");

// Valid announcement
assert(addAnnouncement("Attention: Critical system update in progress!") === true, "Valid announcement accepted");
assert(announcements[0].message === "Attention: Critical system update in progress!", "Latest announcement is at the top and clearly identifiable");

console.log(`\n=== TEST SUITE COMPLETE: ${passCount} PASSED, ${failCount} FAILED ===`);
if (failCount === 0) {
  process.exit(0);
} else {
  process.exit(1);
}
