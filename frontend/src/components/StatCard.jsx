import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', percentage, badge }) {
  const colorMap = {
    blue: {
      border: 'border-sky-500/30',
      iconBg: 'bg-sky-500/10 text-sky-400',
      progress: 'bg-sky-500',
      glow: 'shadow-sky-500/5',
      badge: 'bg-sky-950 text-sky-400 border-sky-800/40',
    },
    emerald: {
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      progress: 'bg-emerald-500',
      glow: 'shadow-emerald-500/5',
      badge: 'bg-emerald-950 text-emerald-400 border-emerald-800/40',
    },
    amber: {
      border: 'border-amber-500/30',
      iconBg: 'bg-amber-500/10 text-amber-400',
      progress: 'bg-amber-500',
      glow: 'shadow-amber-500/5',
      badge: 'bg-amber-950 text-amber-400 border-amber-800/40',
    },
    rose: {
      border: 'border-rose-500/40',
      iconBg: 'bg-rose-500/15 text-rose-400',
      progress: 'bg-rose-500',
      glow: 'shadow-rose-500/10',
      badge: 'bg-rose-950 text-rose-400 border-rose-800/40',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`cyber-card p-5 rounded-xl border ${scheme.border} shadow-lg ${scheme.glow} relative overflow-hidden group`}>
      {/* Background Accent Glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-slate-800/40 blur-2xl group-hover:scale-125 transition-transform duration-500"></div>

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1.5 tracking-tight font-mono">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${scheme.iconBg} border border-white/5`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Subtitle / Percentage Progress Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs relative z-10">
        <span className="text-slate-400 flex items-center gap-1.5 truncate max-w-[70%]">
          {subtitle}
        </span>
        {badge && (
          <span className={`px-2 py-0.5 rounded-full font-mono font-semibold border ${scheme.badge}`}>
            {badge}
          </span>
        )}
      </div>

      {percentage !== undefined && (
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-2.5 overflow-hidden">
          <div
            className={`h-full ${scheme.progress} rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
