import React, { useState } from 'react';
import { Activity, ShieldCheck, AlertOctagon } from 'lucide-react';

export default function TrafficChart({ data = [] }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="cyber-card p-6 flex items-center justify-center h-64 text-slate-500 text-sm">
        No traffic telemetry collected yet.
      </div>
    );
  }

  // Chart dimensions
  const width = 640;
  const height = 200;
  const paddingX = 40;
  const paddingY = 25;

  const maxVal = Math.max(...data.map((d) => Math.max(d.normal_count, d.attack_count, 10)), 50);

  const getX = (index) => paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
  const getY = (val) => height - paddingY - (val / maxVal) * (height - paddingY * 2);

  // Generate SVG path strings
  const normalPoints = data.map((d, i) => `${getX(i)},${getY(d.normal_count)}`).join(' ');
  const attackPoints = data.map((d, i) => `${getX(i)},${getY(d.attack_count)}`).join(' ');

  const activePoint = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div className="cyber-card p-5 rounded-xl border border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">Traffic Volume Timeline (24h)</h4>
            <p className="text-xs text-slate-400">Normal vs Suspicious network flow throughput</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-medium">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
            <span className="text-slate-300">Normal Flows</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
            <span className="text-slate-300">Suspicious Attacks</span>
          </div>
        </div>
      </div>

      {/* SVG Timeline Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-52 overflow-visible select-none"
        >
          <defs>
            <linearGradient id="normalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="attackGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = height - paddingY - pct * (height - paddingY * 2);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#64748b"
                  fontFamily="monospace"
                >
                  {Math.round(pct * maxVal)}
                </text>
              </g>
            );
          })}

          {/* Normal Traffic Area & Line */}
          <polygon
            points={`${paddingX},${height - paddingY} ${normalPoints} ${width - paddingX},${height - paddingY}`}
            fill="url(#normalGradient)"
          />
          <polyline
            points={normalPoints}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Attack Traffic Area & Line */}
          <polygon
            points={`${paddingX},${height - paddingY} ${attackPoints} ${width - paddingX},${height - paddingY}`}
            fill="url(#attackGradient)"
          />
          <polyline
            points={attackPoints}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Hover Nodes */}
          {data.map((d, i) => {
            const x = getX(i);
            const isHovered = hoverIndex === i;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className="cursor-pointer"
              >
                {/* Invisible hover bar */}
                <rect
                  x={x - (width / data.length) / 2}
                  y={paddingY}
                  width={width / data.length}
                  height={height - paddingY * 2}
                  fill="transparent"
                />

                {isHovered && (
                  <line
                    x1={x}
                    y1={paddingY}
                    x2={x}
                    y2={height - paddingY}
                    stroke="#38bdf8"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Data point dots */}
                <circle
                  cx={x}
                  cy={getY(d.attack_count)}
                  r={isHovered ? 5 : 3}
                  fill="#f43f5e"
                  stroke="#090d16"
                  strokeWidth="1.5"
                  className="transition-all"
                />
                <circle
                  cx={x}
                  cy={getY(d.normal_count)}
                  r={isHovered ? 5 : 3}
                  fill="#10b981"
                  stroke="#090d16"
                  strokeWidth="1.5"
                  className="transition-all"
                />

                {/* X-axis labels */}
                <text
                  x={x}
                  y={height - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#64748b"
                  fontFamily="monospace"
                >
                  {d.timestamp}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Popup */}
        {activePoint && hoverIndex !== null && (
          <div
            className="absolute top-2 right-4 bg-slate-900/95 border border-sky-500/40 rounded-lg p-2.5 shadow-xl pointer-events-none text-xs backdrop-blur-md"
          >
            <div className="font-mono text-sky-400 font-bold mb-1">Time: {activePoint.timestamp}</div>
            <div className="flex items-center space-x-2 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Normal: {activePoint.normal_count.toLocaleString()} flows</span>
            </div>
            <div className="flex items-center space-x-2 text-rose-400 font-medium mt-0.5">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Attacks: {activePoint.attack_count.toLocaleString()} alerts</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
