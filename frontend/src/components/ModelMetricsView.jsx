import React, { useState } from 'react';
import { Cpu, Award, BarChart3, AlertCircle, Shield, Sliders } from 'lucide-react';

export default function ModelMetricsView({ metricsData }) {
  const [selectedModel, setSelectedModel] = useState('RandomForest');

  if (!metricsData || !metricsData.metrics) {
    return (
      <div className="cyber-card p-12 text-center text-slate-500 text-sm">
        Model metrics are not available. Please verify model training.
      </div>
    );
  }

  const { best_model, models_evaluated, metrics, feature_importances, classes, num_features } = metricsData;

  const currentMetrics = metrics[selectedModel] || metrics[best_model] || {};
  const perClass = currentMetrics.per_class || {};
  const confusionMatrix = currentMetrics.confusion_matrix || [];

  return (
    <div className="space-y-6">
      {/* Top Banner / Model Selection */}
      <div className="cyber-card p-5 rounded-xl border border-sky-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Machine Learning Model Evaluation</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                  Primary Model: {best_model}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated on {num_features} standardized flow features across {classes?.length} network categories.
              </p>
            </div>
          </div>

          {/* Model Switcher Tabs */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
            {models_evaluated?.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedModel(name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                  selectedModel === name
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Model Benchmark Comparison Table */}
      <div className="cyber-card p-5 rounded-xl border border-slate-800">
        <h4 className="text-sm font-bold text-white tracking-wide mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-sky-400" />
          Cross-Model Performance Benchmarking
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">F1-Macro</th>
                <th className="py-2.5 px-3">Recall (Macro)</th>
                <th className="py-2.5 px-3">Benign FPR (Alert Fatigue)</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {models_evaluated?.map((name) => {
                const m = metrics[name];
                const isBest = name === best_model;
                if (!m || !m.accuracy) {
                  return (
                    <tr key={name} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-bold text-purple-400">{name}</td>
                      <td colSpan={4} className="py-3 px-3 text-slate-400 italic font-sans">
                        Unsupervised Novelty & Zero-Day Anomaly Detector (Trained on Benign Baselines)
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                          Active Anomaly Filter
                        </span>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr
                    key={name}
                    className={`hover:bg-slate-800/40 transition-colors ${selectedModel === name ? 'bg-sky-500/5' : ''}`}
                  >
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-1.5">
                      {name}
                      {isBest && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 border border-sky-800">
                          Production Choice
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-200">{(m.accuracy * 100).toFixed(2)}%</td>
                    <td className="py-3 px-3 text-sky-400 font-bold">{m.f1_macro.toFixed(4)}</td>
                    <td className="py-3 px-3 text-slate-200">{m.recall_macro.toFixed(4)}</td>
                    <td className="py-3 px-3 text-emerald-400">{(m.benign_fpr * 100).toFixed(2)}%</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                        Evaluated
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-Class Performance & Confusion Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Per-Class Metrics */}
        <div className="cyber-card p-5 rounded-xl border border-slate-800">
          <h4 className="text-sm font-bold text-white tracking-wide mb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            Per-Class Performance Breakdown ({selectedModel})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2 px-2">Class</th>
                  <th className="py-2 px-2">Precision</th>
                  <th className="py-2 px-2">Recall</th>
                  <th className="py-2 px-2">F1-Score</th>
                  <th className="py-2 px-2">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {Object.entries(perClass).map(([className, stats]) => (
                  <tr key={className} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-2 font-bold text-slate-200">{className}</td>
                    <td className="py-2.5 px-2 text-slate-300">{stats.precision.toFixed(4)}</td>
                    <td className="py-2.5 px-2 text-slate-300">{stats.recall.toFixed(4)}</td>
                    <td className="py-2.5 px-2 text-sky-400 font-semibold">{stats.f1_score.toFixed(4)}</td>
                    <td className="py-2.5 px-2 text-slate-500">{stats.support.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Confusion Matrix Visualization */}
        <div className="cyber-card p-5 rounded-xl border border-slate-800">
          <h4 className="text-sm font-bold text-white tracking-wide mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-400" />
            Confusion Matrix ({selectedModel})
          </h4>
          {confusionMatrix && confusionMatrix.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-center text-[10px] font-mono border-collapse">
                <thead>
                  <tr>
                    <th className="p-1.5 text-slate-500 text-left">True \ Pred</th>
                    {classes?.map((c) => (
                      <th key={c} className="p-1.5 text-slate-300 font-semibold truncate max-w-[55px]" title={c}>
                        {c.substring(0, 5)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {confusionMatrix.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      <td className="p-1.5 text-left font-semibold text-slate-300 truncate max-w-[65px]" title={classes[rowIdx]}>
                        {classes[rowIdx]?.substring(0, 6)}
                      </td>
                      {row.map((val, colIdx) => {
                        const isDiag = rowIdx === colIdx;
                        const cellColor = isDiag
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/30 font-bold'
                          : val > 0
                          ? 'bg-rose-500/25 text-rose-300 border-rose-500/40 font-bold'
                          : 'bg-slate-900/60 text-slate-600 border-slate-800/40';

                        return (
                          <td
                            key={colIdx}
                            className={`p-1.5 border rounded-sm ${cellColor}`}
                            title={`True: ${classes[rowIdx]}, Predicted: ${classes[colIdx]}, Count: ${val}`}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[10px] text-slate-500 mt-3 italic text-center">
                Diagonal values indicate correct classifications. Off-diagonal represents misclassifications.
              </p>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-slate-500 text-xs">
              Confusion matrix unavailable for selected model.
            </div>
          )}
        </div>
      </div>

      {/* Top 10 Discriminating Features (XAI) & Security Trade-Offs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Feature Importance */}
        <div className="cyber-card p-5 rounded-xl border border-slate-800">
          <h4 className="text-sm font-bold text-white tracking-wide mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400" />
            Top 10 Discriminating Features (Global XAI)
          </h4>
          <div className="space-y-2.5">
            {Object.entries(feature_importances || {})
              .slice(0, 10)
              .map(([feat, imp], i) => (
                <div key={feat} className="text-xs">
                  <div className="flex justify-between font-mono text-[11px] mb-1">
                    <span className="text-slate-300 font-medium">
                      {i + 1}. {feat}
                    </span>
                    <span className="text-sky-400 font-bold">{(imp * 100).toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"
                      style={{ width: `${Math.min(100, imp * 600)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Security Trade-Off Analysis */}
        <div className="cyber-card p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              SOC Security Trade-Off Analysis
            </h4>

            <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">
                  1. False Positives (Alert Fatigue Defense):
                </span>
                In a Security Operations Center (SOC), false alarms cost valuable analyst hours.
                Our Random Forest model achieved a calibrated Benign False Positive Rate of{' '}
                <strong className="text-white font-mono">
                  {(currentMetrics.benign_fpr || 0) * 100}%
                </strong>, minimizing noisy notifications on routine web, API, and DNS traffic.
              </div>

              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                <span className="font-bold text-rose-400 block mb-1">
                  2. False Negatives (Breach Prevention):
                </span>
                A false negative allows malicious actors to persist undetected. We prioritized{' '}
                <strong className="text-white font-mono">F1-Macro</strong> and high recall on DoS, DDoS, and
                Infiltration families over raw accuracy alone, ensuring severe zero-day or high-cadence threats are not swallowed by majority benign class bias.
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between font-mono">
            <span>Decision Criterion: Balanced F1-Macro</span>
            <span className="text-sky-400 font-bold">Standard: CIC-IDS2017</span>
          </div>
        </div>
      </div>
    </div>
  );
}
