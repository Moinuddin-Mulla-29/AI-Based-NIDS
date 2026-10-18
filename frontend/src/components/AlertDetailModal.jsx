import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Cpu,
  Info,
  Server,
  Layers,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function AlertDetailModal({ alert, onClose, onUpdateStatus }) {
  const [showRawFeatures, setShowRawFeatures] = useState(false);

  if (!alert) return null;

  const severityColor = {
    Critical: 'text-rose-400 bg-rose-950/80 border-rose-700/60',
    High: 'text-amber-400 bg-amber-950/80 border-amber-700/60',
    Medium: 'text-yellow-400 bg-yellow-950/80 border-yellow-700/60',
    Low: 'text-emerald-400 bg-emerald-950/80 border-emerald-700/60',
  }[alert.severity] || 'text-sky-400 bg-sky-950/80 border-sky-700/60';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="cyber-card w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-sky-500/30 shadow-2xl bg-slate-950 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-950/95 backdrop-blur-md z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Incident Forensic Analysis</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${severityColor}`}>
                  {alert.severity}
                </span>
                {alert.is_anomaly && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800">
                    Isolation Forest Outlier
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Flow ID: {alert.flow_id || `flow_${alert.id}`} • {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Key Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-mono">Predicted Vector</span>
              <p className="text-lg font-bold text-white mt-1">{alert.attack_type}</p>
            </div>
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-mono">Model Confidence</span>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-lg font-bold text-sky-400 font-mono">
                  {Math.round(alert.confidence * 100)}%
                </p>
                <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-400 h-full rounded-full"
                    style={{ width: `${Math.round(alert.confidence * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-mono">Triage Status</span>
              <div className="mt-1">
                <select
                  value={alert.status}
                  onChange={(e) => onUpdateStatus(alert.id, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="NEW">NEW</option>
                  <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="FALSE_POSITIVE">FALSE POSITIVE</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5-Tuple Network Telemetry */}
          <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-sky-400" />
              Network Flow 5-Tuple Connection
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div>
                <span className="text-slate-500 text-[10px]">Source IP</span>
                <p className="text-slate-200 font-semibold">{alert.src_ip}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Source Port</span>
                <p className="text-slate-200 font-semibold">{alert.src_port}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Destination IP</span>
                <p className="text-sky-400 font-semibold">{alert.dst_ip}</p>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Dest Port / Protocol</span>
                <p className="text-slate-200 font-semibold">{alert.dst_port} ({alert.protocol})</p>
              </div>
            </div>
          </div>

          {/* Explainable AI (XAI) Section */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-sky-500/20">
            <div className="flex items-center space-x-2 mb-2.5">
              <Cpu className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Explainable AI (XAI) Attribution
              </h4>
            </div>

            {/* SOC Insight Narrative */}
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed mb-4">
              <p className="font-semibold text-sky-400 mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                SOC Analyst Intelligence:
              </p>
              {alert.security_insight || 'Statistical analysis indicates this flow exhibits abnormal packet and duration characteristics indicative of intrusion.'}
            </div>

            {/* Top Influential Features List */}
            {alert.top_features && alert.top_features.length > 0 ? (
              <div className="space-y-2.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                  Key Contributing Feature Signatures:
                </span>
                {alert.top_features.map((feat, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between font-mono mb-1">
                      <span className="font-bold text-slate-200">{feat.feature}</span>
                      <span className="text-sky-400 font-semibold">
                        Impact: {Math.round(feat.impact * 100)}%
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mb-1.5">{feat.reason}</p>
                    <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-500">
                      <span>Observed Value: <strong className="text-white">{feat.value}</strong></span>
                      {feat.baseline !== undefined && (
                        <span>Normal Baseline: <strong className="text-slate-300">{feat.baseline} {feat.unit}</strong></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Local feature impact weights derived from Random Forest feature ranking.
              </p>
            )}

            {/* Disclaimer */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 leading-normal flex items-start space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500/80 shrink-0 mt-0.5" />
              <span>
                <strong>Model Confidence Disclaimer:</strong> Confidence score signifies mathematical similarity to known intrusion signatures. SOC personnel should correlate with network firewalls, host logs, and NetFlow metrics before initiating automated network isolation.
              </span>
            </div>
          </div>

          {/* Raw Flow Features Collapsible Viewer */}
          {alert.flow_features && (
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowRawFeatures(!showRawFeatures)}
                className="w-full p-3.5 bg-slate-900 flex items-center justify-between text-xs font-mono text-slate-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  Raw CIC-IDS2017 Extracted Flow Features ({Object.keys(alert.flow_features).length} attributes)
                </span>
                {showRawFeatures ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showRawFeatures && (
                <div className="p-4 bg-slate-950 font-mono text-[11px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 border-t border-slate-800 max-h-56 overflow-y-auto">
                  {Object.entries(alert.flow_features).map(([k, v]) => (
                    <div key={k} className="p-1.5 rounded bg-slate-900/60 border border-slate-800/60">
                      <span className="text-slate-500 block truncate">{k}</span>
                      <span className="text-sky-300 font-bold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/95 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close Investigation
          </button>
        </div>
      </div>
    </div>
  );
}
