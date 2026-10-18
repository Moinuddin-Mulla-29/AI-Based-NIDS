import React, { useState } from 'react';
import {
  Radio,
  Play,
  Square,
  Activity,
  Zap,
  Shield,
  AlertTriangle,
  Send,
  Loader2,
  Clock,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

export default function LiveMonitorControl({ monitorStatus, onStatusChange }) {
  const [isToggling, setIsToggling] = useState(false);
  const [selectedAttack, setSelectedAttack] = useState('DDoS');
  const [burstCount, setBurstCount] = useState(5);
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectMessage, setInjectMessage] = useState(null);

  const isRunning = monitorStatus?.is_running;

  const handleToggle = async () => {
    setIsToggling(true);
    setInjectMessage(null);
    try {
      if (isRunning) {
        await api.stopMonitoring();
      } else {
        await api.startMonitoring('SIMULATED');
      }
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error(err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleSimulateBurst = async () => {
    setIsInjecting(true);
    setInjectMessage(null);
    try {
      const res = await api.simulateBurst(selectedAttack, burstCount);
      setInjectMessage(res.message);
      if (onStatusChange) onStatusChange();
    } catch (err) {
      setInjectMessage(`Error: ${err.message}`);
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="cyber-card p-5 rounded-xl border border-sky-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className={`p-3 rounded-xl border ${isRunning ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
              <Radio className={`w-6 h-6 ${isRunning ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Mode B: Real-Time Traffic Ingestion Engine</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${isRunning ? 'bg-emerald-950 text-emerald-400 border-emerald-700' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                  {isRunning ? 'STREAMING ACTIVE' : 'ENGINE STANDBY'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregates packets into 5-tuple statistical flows, extracts 32 features, and generates real-time alerts.
              </p>
            </div>
          </div>

          {/* Start / Stop Toggle */}
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all shadow-lg ${
              isRunning
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isToggling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRunning ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>HALT INGESTION</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>START CONTINUOUS REPLAY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="cyber-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono mb-1">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>SESSION UPTIME</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {monitorStatus?.uptime_seconds || 0}s
          </p>
        </div>

        <div className="cyber-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono mb-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>PACKETS PROCESSED</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {(monitorStatus?.total_packets || 0).toLocaleString()}
          </p>
        </div>

        <div className="cyber-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>FLOWS INGESTED</span>
          </div>
          <p className="text-xl font-bold font-mono text-white">
            {(monitorStatus?.total_flows || 0).toLocaleString()}
          </p>
        </div>

        <div className="cyber-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>ALERTS TRIGGERED</span>
          </div>
          <p className="text-xl font-bold font-mono text-rose-400">
            {(monitorStatus?.alerts_generated || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Interactive Attack Simulator (College Viva & Examiner Demo Panel) */}
      <div className="cyber-card p-5 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-2.5 mb-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              Live Intrusion Simulator (Demonstration Panel)
            </h4>
            <p className="text-xs text-slate-400">
              Inject authorized synthetic test attacks into the live pipeline to showcase real-time alert trigger
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Attack selector */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
              Target Threat Profile:
            </label>
            <select
              value={selectedAttack}
              onChange={(e) => setSelectedAttack(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
            >
              <option value="DDoS">DDoS (SYN Flood Surge)</option>
              <option value="DoS-Hulk">DoS-Hulk (HTTP Flood Exhaustion)</option>
              <option value="PortScan">PortScan (Host Reconnaissance)</option>
              <option value="BruteForce">BruteForce (Iterative Credential Guessing)</option>
              <option value="Botnet">Botnet (Periodic C2 Heartbeat)</option>
              <option value="Infiltration">Infiltration (Asymmetric Data Exfiltration)</option>
              <option value="BENIGN">BENIGN (Legitimate Web Browsing)</option>
            </select>
          </div>

          {/* Count selector */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1.5">
              Flow Burst Quantity:
            </label>
            <input
              type="number"
              min="1"
              max="25"
              value={burstCount}
              onChange={(e) => setBurstCount(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Trigger Button */}
          <div className="flex items-end">
            <button
              onClick={handleSimulateBurst}
              disabled={isInjecting}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all shadow-md shadow-sky-500/20"
            >
              {isInjecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Transmit Attack Stream</span>
                </>
              )}
            </button>
          </div>
        </div>

        {injectMessage && (
          <div className="mt-4 p-3 rounded-lg bg-sky-950/60 border border-sky-800 text-xs font-mono text-sky-300 flex items-center space-x-2">
            <Shield className="w-4 h-4 shrink-0" />
            <span>{injectMessage} Check SOC Operations feed for generated incidents.</span>
          </div>
        )}
      </div>

      {/* Security Disclaimer Note */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-start space-x-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">Ethical & Operational Safety Policy:</strong> AI-NIDS operates strictly within authorized testing parameters. Replay mode generates statistically compliant simulated telemetry matching CIC-IDS2017 distribution. Live PCAP interface capture requires local promiscuous interface rights and explicit network owner consent. No offensive packet injection or credential exfiltration occurs.
        </div>
      </div>
    </div>
  );
}
