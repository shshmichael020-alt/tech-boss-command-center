import React from 'react';

export default function EyeLogo({ isPulsing = false, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  }[size] || 'w-12 h-12';

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses} select-none`}>
      {/* Outer ambient glow rings */}
      <div className={`absolute inset-0 rounded-full bg-red-600/20 blur-md ${isPulsing ? 'animate-ping' : 'animate-pulse'}`} />
      <div className="absolute inset-1 rounded-full border border-red-500/40 animate-spin" style={{ animationDuration: '16s' }} />
      <div className="absolute inset-2 rounded-full border border-dashed border-red-400/60 animate-spin" style={{ animationDuration: '24s', animationDirection: 'reverse' }} />
      
      {/* Eye Shape */}
      <svg
        viewBox="0 0 100 60"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Eye Outline */}
        <path
          d="M 5 30 Q 50 -10 95 30 Q 50 70 5 30 Z"
          stroke="#ef4444"
          strokeWidth="3.5"
          fill="#130910"
        />
        {/* Iris */}
        <circle cx="50" cy="30" r="18" fill="#1f0a14" stroke="#f87171" strokeWidth="2" />
        
        {/* Glowing Pupil */}
        <circle cx="50" cy="30" r="10" fill="#ef4444" className="animate-pulse" />
        <circle cx="50" cy="30" r="4" fill="#ffffff" />
        
        {/* Tech crosshairs */}
        <line x1="28" y1="30" x2="72" y2="30" stroke="#fca5a5" strokeWidth="0.8" strokeDasharray="2 2" />
        <line x1="50" y1="12" x2="50" y2="48" stroke="#fca5a5" strokeWidth="0.8" strokeDasharray="2 2" />
      </svg>
    </div>
  );
}
