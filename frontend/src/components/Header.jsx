import React, { useEffect, useState } from 'react';
import { Shield, Activity, Radio, Download, RefreshCw, Cpu, FileSpreadsheet } from 'lucide-react';
import { api } from '../services/api';

export default function Header({ activeTab, setActiveTab, onRefresh, isRefreshing, monitorStatus }) {
  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString());
  const [backendHealthy, setBackendHealthy] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.getHealth();
        setBackendHealthy(true);
      } catch {
        setBackendHealthy(false);
      }
    };
    checkHealth();
    const healthInterval = setInterval(checkHealth, 15000);
    return () => clearInterval(healthInterval);
  }, []);

  const navItems = [
    { id: 'overview', label: 'SOC Operations', icon: Activity },
    { id: 'model', label: 'AI Model & XAI', icon: Cpu },
    { id: 'csv', label: 'Dataset & CSV Scanner', icon: FileSpreadsheet },
    { id: 'monitor', label: 'Traffic Monitor (Mode B)', icon: Radio },
  ];

  return (
    <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 text-slate-950 font-bold shadow-lg shadow-sky-500/20">
            <Shield className="w-5 h-5 text-slate-950" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${backendHealthy ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${backendHealthy ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                AI-NIDS
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800/50">
                  v2.0 Project Edition
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Intelligent Network Intrusion Detection & Explainable AI
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Status Indicators & Global Controls */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Monitoring Badge */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <Radio className={`w-3.5 h-3.5 ${monitorStatus?.is_running ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-slate-400">Engine:</span>
            <span className={`font-semibold ${monitorStatus?.is_running ? 'text-emerald-400' : 'text-slate-400'}`}>
              {monitorStatus?.is_running ? `LIVE (${monitorStatus.mode})` : 'IDLE'}
            </span>
          </div>

          {/* Time indicator */}
          <div className="hidden sm:block font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
            {currentTime}
          </div>

          {/* Export Report */}
          <a
            href={api.getExportAlertsUrl()}
            download
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700/60 font-medium transition-colors"
            title="Download CSV Audit Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV Export</span>
          </a>

          {/* Manual Refresh */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
