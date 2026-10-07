import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  Trash2, 
  Volume2, 
  Radio, 
  Sparkles,
  Flame,
  Check
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function NotificationCenter({
  isOpen,
  onClose,
  notifications = [],
  onClearAll,
  onMarkAllAsRead,
  onTriggerSimulatedNotification,
  unreadCount = 0
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD' | 'CRITICAL'

  if (!isOpen) return null;

  const filteredList = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'CRITICAL') return n.type === 'danger' || n.type === 'critical';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'danger':
      case 'critical':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'danger':
      case 'critical':
        return 'border-rose-500/50 bg-rose-950/20';
      case 'warning':
        return 'border-amber-500/50 bg-amber-950/20';
      case 'success':
        return 'border-emerald-500/50 bg-emerald-950/20';
      default:
        return 'border-cyan-500/50 bg-cyan-950/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#090e1b] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slideDown"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-chakra font-black tracking-wider text-white text-base flex items-center gap-2">
                EVENT NOTIFICATIONS <span className="text-cyan-400 font-mono text-xs">[{unreadCount} NEW]</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                House surveillance alerts & event transmissions
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Filters */}
        <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between gap-2">
          {/* Filter Pills */}
          <div className="flex items-center space-x-1">
            {['ALL', 'UNREAD', 'CRITICAL'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
                  filter === f
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                title="Mark all as read"
                className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition"
              >
                <Check className="w-3 h-3" />
                <span>Read All</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                title="Clear all notifications"
                className="text-[10px] font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications Scroll List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-800/30">
          {filteredList.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse" />
              <p>NO NOTIFICATIONS IN QUEUE</p>
              <p className="text-[10px] text-slate-600 mt-1">Surveillance channel quiet.</p>
            </div>
          ) : (
            filteredList.map((n) => (
              <div 
                key={n.id} 
                className={`p-3 rounded-xl border transition-all pt-3 ${getBorderColor(n.type)} ${
                  n.read ? 'opacity-70' : 'opacity-100 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2.5">
                    <span className="mt-0.5">{getIcon(n.type)}</span>
                    <div>
                      <h4 className="text-xs font-bold font-chakra text-white tracking-wide">
                        {n.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 font-sans mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-400">
                        <span>{n.timestamp}</span>
                        {n.source && (
                          <>
                            <span>•</span>
                            <span className="text-cyan-400 font-semibold">{n.source}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping mt-1" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Simulator Footer */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-[11px] text-slate-400">Simulate Alert:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onTriggerSimulatedNotification('siren')}
              className="px-2 py-1 rounded bg-rose-950/60 text-rose-300 border border-rose-500/40 hover:bg-rose-900/80 text-[10px] font-bold transition"
            >
              🚨 Siren
            </button>
            <button
              onClick={() => onTriggerSimulatedNotification('task')}
              className="px-2 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/80 text-[10px] font-bold transition"
            >
              📋 Task Alarm
            </button>
            <button
              onClick={() => onTriggerSimulatedNotification('captain')}
              className="px-2 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 hover:bg-amber-900/80 text-[10px] font-bold transition"
            >
              👑 Captaincy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Floating Toast Item component
export function ToastStack({ toasts = [], onDismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const borderStyle = {
          danger: 'border-rose-500 bg-[#160b12] text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)]',
          warning: 'border-amber-500 bg-[#161208] text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
          success: 'border-emerald-500 bg-[#081611] text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
          info: 'border-cyan-500 bg-[#09131d] text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
        }[toast.type] || 'border-cyan-500 bg-[#09131d] text-cyan-200';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border flex items-start justify-between gap-3 backdrop-blur-md animate-slideUp transition-all duration-300 ${borderStyle}`}
          >
            <div className="flex items-start space-x-2.5">
              <span className="mt-0.5">
                {toast.type === 'danger' && <ShieldAlert className="w-4 h-4 text-rose-400" />}
                {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
              </span>
              <div>
                <h4 className="text-xs font-bold font-chakra tracking-wide text-white">
                  {toast.title}
                </h4>
                <p className="text-[11px] text-slate-300 font-sans mt-0.5 leading-snug">
                  {toast.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
