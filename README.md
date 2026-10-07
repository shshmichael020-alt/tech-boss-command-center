# 👁️ BIG BOSS: TECH HOUSE COMMAND CENTER 2026

An ultra-sleek, real-time command dashboard engineered for Big Boss to monitor, control, and orchestrate the Tech House. Built with **React 18**, **Tailwind CSS**, **Lucide Icons**, **Canvas Confetti**, and the **Web Audio & Web Speech APIs**.

![Big Boss Command Center](https://img.shields.io/badge/Big_Boss-Command_Center-red?style=for-the-badge&logo=shield)
![Status](https://img.shields.io/badge/Status-Production_Ready-emerald?style=for-the-badge)
![Deliverables](https://img.shields.io/badge/Checklist-12%2F12_Verified-gold?style=for-the-badge)

---

## 🎯 Mandatory Deliverables Checklist (100% Implemented)

Every mandatory deliverable has been built, tested, and styled with high-fidelity cyberpunk reality-show aesthetics:

| # | Mandatory Feature | Status | Description & Implementation Details |
|---|---|---|---|
| **1** | **Contestant Management** | ✅ Verified | 10+ initial tech contestants with Name, Role, Team, Points, and Status. Supports enlisting new housemates, editing profiles, and setting avatars. |
| **2** | **Live Leaderboard** | ✅ Verified | Real-time standings sorted dynamically by points, featuring a 3D Top-3 podium (Gold/Silver/Bronze), progress bar shares, and quick score adjustments. |
| **3** | **Task Management** | ✅ Verified | Commission directives to individual contestants or entire teams. Mark tasks complete to auto-award points with confetti celebration; mark failed with penalties. |
| **4** | **Point System** | ✅ Verified | Quick point modifiers (+50, -25) and dedicated Big Boss Point Ledger modal with presets (+10, +25, +50, +100, -10, -25, -50, -100) and custom justifications. |
| **5** | **Captaincy** | ✅ Verified | Appoint/replace House Captain. Bestows the Golden Crown, dedicated Captain's Suite widget, and automatic Immunity Shield protection. |
| **6** | **Nominations** | ✅ Verified | Put contestants up for eviction in the Danger Zone with formal justification charges. |
| **7** | **Immunity** | ✅ Verified | Grant/revoke Immunity Shields. **Strict enforcement**: contestants holding Immunity or Captaincy cannot be nominated (attempts trigger alerts and rejection sound). |
| **8** | **Danger Zone** | ✅ Verified | High-alert danger console highlighting all nominees on the chopping block with simulated live audience voting bars and threat meters. |
| **9** | **Big Boss Announcement** | ✅ Verified | Live surveillance broadcast feed with real-time ticker, dramatic fullscreen decree overlays, and **Web Speech API text-to-speech synthesis** (Hindi & English presets). |
| **10** | **Task Timer** | ✅ Verified | Precision countdown clock with Start, Pause, Resume, Reset controls, 1m/3m/5m/10m/15m/30m presets, custom minutes, and buzzer alarm upon expiry. |
| **11** | **House Statistics** | ✅ Verified | Live house telemetry: Highest Scorer (MVP), Lowest Scorer in Jeopardy, Task completion rate %, Team Rivalry Matrix, and full chronological activity audit trail. |
| **12** | **Eviction** | ✅ Verified | Dramatic 3-2-1 eviction countdown sequence with elimination decree. Evicts nominees, removes them from active house & leaderboard, and logs eviction reason. |

---

## 🚀 Additional Power Features (Bonus Points & Immersion)

- **Interactive Surveillance Eye (`<EyeLogo />`)**: Glowing cyber-eye visualizer with concentric rotating sensor rings and animated pulse.
- **Web Audio Sound Effects (`audio.js`)**: Real-time synthesizer sounds for dramatic Big Boss gongs, eviction alarms, victory chimes, deduction buzzers, and timer ticks.
- **Audience Live Voting Simulator**: Simulate incoming audience votes with real-time percentage adjustments on nominated housemates.
- **Wildcard Recall Protocol**: Ability to recall evicted alumni back into the Tech House as a surprise wildcard entry.
- **Local Storage Persistence**: All contestants, tasks, points, announcements, and activity logs are persisted locally.
- **One-Click Demo Reset**: Reset all house parameters back to pristine demo state at any time.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3 with custom dark cyberpunk theme
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Audio & Speech**: HTML5 Web Audio API + SpeechSynthesis API

---

## ⚡ Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
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
│   │   ├── CommandHub.jsx           # Master executive dashboard
│   │   ├── ContestantManagement.jsx  # Roster grid, immunity, nominations
│   │   ├── ContestantModal.jsx       # Add & edit contestant modal
│   │   ├── DangerZone.jsx           # Nominees, voting simulation & eviction
│   │   ├── EvictionModal.jsx        # Dramatic eviction sequence
│   │   ├── EyeLogo.jsx              # Cyber surveillance glowing eye
│   │   ├── Header.jsx               # Top bar with clock, chaos meter & audio
│   │   ├── HouseStats.jsx           # Analytics, team showdown & audit log
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
│   ├── App.jsx                      # Main controller with integrated state
│   ├── index.css                    # Tailwind & custom glow utilities
│   └── main.jsx                     # Application bootstrap
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 👑 Big Boss Decrees & Rules

1. *House Captain holds absolute immunity from nominations.*
2. *Any contestant granted an Immunity Shield is immune from Danger Zone placement.*
3. *Points determine house rank in real time.*
4. *Big Boss is watching 24/7.*
