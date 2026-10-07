# 👁️ BIG BOSS: TECH HOUSE COMMAND CENTER 2026

An ultra-sleek, real-time command dashboard engineered for Big Boss to monitor, control, and orchestrate the Tech House. Built with **React 18**, **Tailwind CSS**, **Lucide Icons**, **Canvas Confetti**, and the **Web Audio & Web Speech APIs**.

![Big Boss Command Center](https://img.shields.io/badge/Big_Boss-Command_Center-red?style=for-the-badge&logo=shield)
![Status](https://img.shields.io/badge/Status-Production_Ready-emerald?style=for-the-badge)
![Deliverables](https://img.shields.io/badge/Checklist-12%2F12_Verified-gold?style=for-the-badge)
![Upgrades](https://img.shields.io/badge/Upgrades-Phases%20%7C%20Undo%20%7C%20Live%20Log-purple?style=for-the-badge)

---

## 🎯 Mandatory Deliverables Checklist (100% Implemented)

Every mandatory deliverable has been built, tested, and styled with high-fidelity cyberpunk reality-show aesthetics:

| # | Mandatory Feature | Status | Description & Implementation Details |
|---|---|---|---|
| **1** | **Contestant Management** | ✅ Verified | 10+ initial tech contestants with Name, Role, Team, Points, and Status. Supports enlisting new housemates, editing profiles, and setting avatars. |
| **2** | **Live Leaderboard** | ✅ Verified | Real-time standings sorted dynamically by points with deterministic alphabetical tie-breaking, featuring a 3D Top-3 podium (Gold/Silver/Bronze), progress bar shares, and quick score adjustments. |
| **3** | **Task Management** | ✅ Verified | Commission directives to individual contestants or entire teams. Mark tasks complete to auto-award points with confetti celebration; mark failed with penalties. |
| **4** | **Point System** | ✅ Verified | Quick point modifiers (+50, -25) and dedicated Big Boss Point Ledger modal with presets (+10, +25, +50, +100, -10, -25, -50, -100) and custom justifications. Protected against NaN and negative values. |
| **5** | **Captaincy** | ✅ Verified | Appoint/replace House Captain. Bestows the Golden Crown, dedicated Captain's Suite widget, and automatic Immunity Shield protection. Strictly 1 captain at any time. |
| **6** | **Nominations** | ✅ Verified | Put contestants up for eviction in the Danger Zone with formal justification charges. |
| **7** | **Immunity** | ✅ Verified | Grant/revoke Immunity Shields. **Strict enforcement**: contestants holding Immunity or Captaincy cannot be nominated (attempts trigger alerts and rejection sound). |
| **8** | **Danger Zone** | ✅ Verified | High-alert danger console highlighting all nominees on the chopping block with simulated live audience voting bars and threat meters. |
| **9** | **Big Boss Announcement** | ✅ Verified | Live surveillance broadcast feed with real-time ticker, dramatic fullscreen decree overlays, and **Web Speech API text-to-speech synthesis** (Hindi & English presets). Empty announcements blocked. |
| **10** | **Task Timer** | ✅ Verified | Precision countdown clock with Start, Pause, Resume, Reset controls, 1m/3m/5m/10m/15m/30m presets, custom minutes, and buzzer alarm upon expiry. Drift-free single interval ref. |
| **11** | **House Statistics** | ✅ Verified | Live house telemetry: Highest Scorer (MVP), Lowest Scorer in Jeopardy, Task completion rate %, Team Rivalry Matrix, and full chronological activity audit trail. |
| **12** | **Eviction** | ✅ Verified | Dramatic 3-2-1 eviction countdown sequence with elimination decree. Evicts nominees, removes them from active house & leaderboard, and logs eviction reason. |

---

## ⚡ High-Value Feature Upgrades

### 1. 🔄 House Phase / Round Control
- Global phase indicator on top header and dedicated interactive control panel on Command Hub.
- 7 distinct house phases: `HOUSE`, `TASK`, `RESULTS`, `NOMINATION`, `DANGER ZONE`, `EVICTION`, `FINAL`.
- Dynamic color branding per phase with instant updates across all displays.
- Changing phases updates surveillance status without resetting house records, contestants, or tasks.
- Persisted locally to `localStorage`.

### 2. ↩️ Undo Last Action
- Safety mechanism for live manual judging and demo use.
- Reverts point additions/deductions, captaincy appointments, immunity toggles, nominations, task completions, evictions, and phase transitions.
- Fully restores affected contestants, tasks, points, and derived statistics.
- Disabled state when history is empty, with toast confirmation on revert.

### 3. 📜 Enhanced Live Action Log
- Real-time chronological telemetry feed with multi-category inspection.
- Filter chips with live counters: `ALL`, `POINTS`, `TASKS`, `CAPTAINCY`, `IMMUNITY`, `NOMINATIONS`, `EVICTIONS`, `SYSTEM`.
- Color-coded badges with timestamps, event titles, and detailed context.
- Latest events appear first; zero timer-tick spam.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3 with custom dark cyberpunk theme
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Audio & Speech**: HTML5 Web Audio API + SpeechSynthesis API

---

## ⚡ Quick Start & Verification

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Automated Regression Test Suite (82/82 Assertions)
```bash
npm test
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates production-optimized static files in the `dist/` directory.

---

## 📂 Project Structure

```
Tech_Boss/
├── dist/                     # Optimized production build artifacts
├── src/
│   ├── components/
│   │   ├── BroadcastBanner.jsx      # Surveillance marquee & decree overlay
│   │   ├── CaptaincyModal.jsx       # House captain assignment chamber
│   │   ├── CommandHub.jsx           # Master executive dashboard & Phase Control
│   │   ├── ContestantManagement.jsx  # Roster grid, immunity, nominations
│   │   ├── ContestantModal.jsx       # Add & edit contestant modal
│   │   ├── DangerZone.jsx           # Nominees, voting simulation & eviction
│   │   ├── EvictionModal.jsx        # Dramatic eviction sequence
│   │   ├── EyeLogo.jsx              # Cyber surveillance glowing eye
│   │   ├── Header.jsx               # Top bar with clock, phase badge, chaos meter & audio
│   │   ├── HouseStats.jsx           # Analytics, team showdown & Enhanced Live Action Log
│   │   ├── Leaderboard.jsx          # Live rankings, podium & score ledger
│   │   ├── Navbar.jsx               # High-tech navigation tab bar
│   │   ├── PointModal.jsx           # Add/deduct points with preset reasons
│   │   ├── TaskManagement.jsx       # Challenge dispatcher & bounties
│   │   ├── TaskModal.jsx            # Create and assign new directives
│   │   └── TaskTimer.jsx            # Precision countdown clock & buzzer
│   ├── data/
│   │   └── initialData.js           # Default contestants, tasks & decrees
│   ├── utils/
│   │   └── audio.js                 # Web Audio synthesizer & speech engine
│   ├── App.jsx                      # Main controller with integrated state & Undo stack
│   ├── index.css                    # Tailwind & custom glow utilities
│   └── main.jsx                     # Application bootstrap
├── test-audit.js                    # Automated 82-assertion test suite
├── package.json
├── tailwind.config.js
└── vite.config.js
```
