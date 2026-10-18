import React from 'react';
import {
  AlertTriangle,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AlertsTable({
  alerts = [],
  total = 0,
  page = 1,
  totalPages = 1,
  onPageChange,
  filters,
  onFilterChange,
  onSelectAlert,
  onUpdateStatus,
}) {
  const severityBadge = (severity) => {
    const map = {
      Critical: 'bg-rose-950/80 text-rose-400 border-rose-700/50',
      High: 'bg-amber-950/80 text-amber-400 border-amber-700/50',
      Medium: 'bg-yellow-950/80 text-yellow-400 border-yellow-700/50',
      Low: 'bg-emerald-950/80 text-emerald-400 border-emerald-700/50',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold border ${map[severity] || map.Medium}`}>
        {severity}
      </span>
    );
  };

  return (
    <div className="cyber-card p-5 rounded-xl border border-slate-800">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Intrusion Incident Feed
              <span className="text-xs font-mono font-normal text-slate-400">
                ({total.toLocaleString()} total alerts)
              </span>
            </h4>
            <p className="text-xs text-slate-400">Real-time alerts classified by Machine Learning</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search IP, Port, Threat..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-44 sm:w-56"
            />
          </div>

          {/* Severity Filter */}
          <select
            value={filters.severity}
            onChange={(e) => onFilterChange('severity', e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="FALSE_POSITIVE">FALSE POSITIVE</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Attack Type</th>
              <th className="py-2.5 px-3">Severity</th>
              <th className="py-2.5 px-3">Source & Destination</th>
              <th className="py-2.5 px-3">Confidence</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Forensic Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No alerts matching current filter criteria.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Timestamp */}
                  <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>

                  {/* Attack Type */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-white group-hover:text-sky-400 transition-colors">
                        {alert.attack_type}
                      </span>
                      {alert.is_anomaly && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-purple-950 text-purple-400 border border-purple-800" title="Flagged as anomaly by Isolation Forest">
                          Outlier
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Severity */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {severityBadge(alert.severity)}
                  </td>

                  {/* 5-tuple */}
                  <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                    <span className="text-slate-300">{alert.src_ip}:{alert.src_port}</span>
                    <span className="text-slate-500 mx-1.5">→</span>
                    <span className="text-sky-400">{alert.dst_ip}:{alert.dst_port}</span>
                    <span className="text-[10px] ml-1.5 text-slate-400">({alert.protocol})</span>
                  </td>

                  {/* Confidence */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-14 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-sky-400 rounded-full"
                          style={{ width: `${Math.round(alert.confidence * 100)}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-slate-300 font-semibold">
                        {Math.round(alert.confidence * 100)}%
                      </span>
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <select
                      value={alert.status}
                      onChange={(e) => onUpdateStatus(alert.id, e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-sky-500 cursor-pointer"
                    >
                      <option value="NEW">NEW</option>
                      <option value="ACKNOWLEDGED">ACKNOWLEDGED</option>
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="FALSE_POSITIVE">FALSE POSITIVE</option>
                    </select>
                  </td>

                  {/* Forensic Action */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onSelectAlert(alert.id)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-300 font-medium transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Investigate</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div>
          Showing page <span className="font-mono font-semibold text-white">{page}</span> of{' '}
          <span className="font-mono font-semibold text-white">{totalPages}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="flex items-center space-x-1 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex items-center space-x-1 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
