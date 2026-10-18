import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function DistributionChart({ data = [] }) {
  const severityColors = {
    Critical: 'bg-rose-500 text-rose-400 border-rose-500/30',
    High: 'bg-amber-500 text-amber-400 border-amber-500/30',
    Medium: 'bg-yellow-500 text-yellow-400 border-yellow-500/30',
    Low: 'bg-emerald-500 text-emerald-400 border-emerald-500/30',
  };

  const barColors = {
    'DDoS': 'from-rose-500 to-red-600',
    'DoS-Hulk': 'from-rose-600 to-orange-600',
    'Botnet': 'from-amber-500 to-orange-500',
    'Infiltration': 'from-purple-500 to-indigo-600',
    'BruteForce': 'from-yellow-500 to-amber-600',
    'PortScan': 'from-cyan-500 to-sky-600',
    'BENIGN': 'from-emerald-500 to-teal-600',
  };

  const total = data.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div className="cyber-card p-5 rounded-xl border border-slate-800">
      <div className="flex items-center space-x-2.5 mb-4">
        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white tracking-wide">Attack Category Distribution</h4>
          <p className="text-xs text-slate-400">Classified intrusion vectors by threat volume</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-slate-500 text-xs">
          No intrusions logged in current session.
        </div>
      ) : (
        <div className="space-y-3.5">
          {data.map((item) => {
            const pct = Math.round((item.count / total) * 100);
            const gradient = barColors[item.name] || 'from-sky-500 to-blue-600';

            return (
              <div key={item.name} className="group">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-200 group-hover:text-sky-400 transition-colors">
                      {item.name}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono border ${severityColors[item.severity] || severityColors.Medium}`}>
                      {item.severity}
                    </span>
                  </div>
                  <div className="font-mono text-slate-400 text-right">
                    <span className="text-white font-bold">{item.count.toLocaleString()}</span>
                    <span className="text-slate-500 ml-1.5">({pct}%)</span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 group-hover:brightness-110`}
                    style={{ width: `${Math.max(4, pct)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
