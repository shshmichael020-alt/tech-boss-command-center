import React, { useState } from 'react';
import { Volume2, VolumeX, Radio, AlertTriangle, Send, X, Mic } from 'lucide-react';
import EyeLogo from './EyeLogo';
import { soundManager } from '../utils/audio';

export default function BroadcastBanner({
  announcements,
  onAddAnnouncement,
  isOpen,
  onClose,
  latestAnnouncement,
  onDismissLatest
}) {
  const [customMsg, setCustomMsg] = useState('');
  const [preset, setPreset] = useState('');
  const [speakVoice, setSpeakVoice] = useState(true);

  const presets = [
    { label: "Hindi: Living Area Assembly", text: "Bigg Boss chahte hain ki sabhi gharwale turant Living Area mein ekatrit hon!" },
    { label: "English: General Assembly", text: "Attention all housemates: Big Boss requires your immediate presence in the Living Area!" },
    { label: "Hindi: Rule Violation Warning", text: "Gharwalon ko aadesh diya jata hai ki niyam ullanghan na karein, anyatha dand diya jayega." },
    { label: "English: Microphone Warning", text: "Warning: Housemates must wear their clip-on microphones at all times. Penalty points impending." },
    { label: "Hindi: Task Commencement", text: "Agla task prarambh hota hai! Apne nirdharit sthaan par pahunchein." },
    { label: "English: Danger Zone Alert", text: "Attention: The Danger Zone voting lines are now open. One contestant will leave the House!" },
    { label: "English: House Captain Order", text: "House Captain has issued a special directive. All contestants must comply." }
  ];

  const handleSend = (e) => {
    e?.preventDefault();
    const message = customMsg.trim() || preset;
    if (!message) return;

    soundManager.playGong();
    if (speakVoice) {
      soundManager.speak(message);
    }

    onAddAnnouncement(message);
    setCustomMsg('');
    setPreset('');
    if (onClose) onClose();
  };

  const handleSelectPreset = (pText) => {
    setPreset(pText);
    setCustomMsg(pText);
  };

  return (
    <>
      {/* Real-time Ticker at the top */}
      <div className="bg-red-950/80 border-b border-red-500/40 px-4 py-2 flex items-center justify-between text-xs font-mono overflow-hidden shadow-lg backdrop-blur-md">
        <div className="flex items-center space-x-2 text-red-400 font-bold tracking-wider uppercase shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
          <Radio className="w-4 h-4 text-red-400 animate-pulse" />
          <span>BIG BOSS SURVEILLANCE FEED:</span>
        </div>
        
        <div className="flex-1 mx-4 overflow-hidden">
          <div className="whitespace-nowrap animate-marquee flex items-center space-x-8 text-slate-200">
            {announcements.length > 0 ? (
              <span>🔊 {announcements[0].message} <span className="text-red-400 font-bold ml-2">[{announcements[0].timestamp}]</span></span>
            ) : (
              <span>ALL PROTOCOLS ACTIVE. CAMERAS RECORDING 24/7. BIG BOSS IS WATCHING.</span>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            if (announcements.length > 0) {
              soundManager.speak(announcements[0].message);
            }
          }}
          title="Repeat Announcement via Voice"
          className="text-xs bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-red-300 px-2 py-1 rounded flex items-center space-x-1 shrink-0 transition"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Audio Repeat</span>
        </button>
      </div>

      {/* Dramatic Overlay for newly triggered announcement */}
      {latestAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-2xl w-full bg-[#110714] border-2 border-red-500 rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(239,68,68,0.6)]">
            <button
              onClick={onDismissLatest}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex justify-center mb-4">
              <EyeLogo isPulsing={true} size="lg" />
            </div>
            <div className="inline-block px-3 py-1 bg-red-900/60 border border-red-500 text-red-400 text-xs font-mono font-bold tracking-widest uppercase rounded-full mb-3">
              OFFICIAL BIG BOSS DECREE
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-wide font-sans">
              "{latestAnnouncement.message}"
            </h2>
            <div className="text-xs font-mono text-slate-400 mb-6">
              TIMESTAMP: {latestAnnouncement.timestamp} | PRIORITY: CRITICAL BROADCAST
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => soundManager.speak(latestAnnouncement.message)}
                className="px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-500/70 text-red-200 text-sm font-semibold rounded-xl flex items-center space-x-2 transition"
              >
                <Mic className="w-4 h-4 text-red-400" />
                <span>Hear Voice</span>
              </button>
              <button
                onClick={onDismissLatest}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-600/40 transition"
              >
                Acknowledge Decree
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0e1424] border border-red-500/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <EyeLogo size="sm" />
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Big Boss Broadcast Studio</h3>
                  <p className="text-xs text-slate-400">Trigger live speech synthesis & house-wide alert</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSend} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Preset Big Boss Decrees (Click to load):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(p.text)}
                      className={`text-left text-xs p-2 rounded-lg border transition truncate ${
                        preset === p.text 
                          ? 'border-red-500 bg-red-950/60 text-red-200' 
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                      }`}
                      title={p.text}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Custom Broadcast Message:
                </label>
                <textarea
                  rows="3"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Bigg Boss chahte hain ki... (or custom directive)"
                  className="w-full bg-[#080d1a] border border-slate-700 focus:border-red-500 focus:outline-none rounded-xl p-3 text-sm text-white placeholder-slate-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-red-400" />
                  <span>Synthesize Big Boss Voice (Speech API):</span>
                </div>
                <input
                  type="checkbox"
                  checked={speakVoice}
                  onChange={(e) => setSpeakVoice(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded bg-slate-800 border-slate-700 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono uppercase rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customMsg.trim() && !preset}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-bold text-xs uppercase font-mono tracking-wider rounded-xl shadow-lg shadow-red-600/30 flex items-center space-x-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Broadcast Decree</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
