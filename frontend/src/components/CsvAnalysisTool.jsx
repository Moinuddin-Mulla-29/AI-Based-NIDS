import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Play,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  FileCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function CsvAnalysisTool({ onAnalysisComplete }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.name.endsWith('.csv')) {
        setFile(selected);
        setError(null);
      } else {
        setError('Please drop a valid .csv file.');
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleRunAnalysis = async () => {
    if (!file) {
      setError('Please select or upload a CSV dataset file first.');
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const res = await api.uploadCsvBatch(file, 2500);
      setAnalysisResult(res);
      if (onAnalysisComplete) onAnalysisComplete();
    } catch (err) {
      setError(err.message || 'Failed to analyze CSV dataset.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunDemoSample = async () => {
    setIsUploading(true);
    setError(null);
    try {
      // Create a mock File object from synthetic flow row data for immediate demonstration
      const dummyCsvContent = `Flow Duration,Total Fwd Packets,Total Backward Packets,Total Length of Fwd Packets,Total Length of Bwd Packets,Flow Bytes/s,Flow Packets/s,Flow IAT Mean,Flow IAT Std,Flow IAT Max,Flow IAT Min,Fwd IAT Total,Bwd IAT Total,Fwd Header Length,Bwd Header Length,Fwd Packets/s,Bwd Packets/s,Min Packet Length,Max Packet Length,Packet Length Mean,Packet Length Std,FIN Flag Count,SYN Flag Count,RST Flag Count,PSH Flag Count,ACK Flag Count,URG Flag Count,Average Packet Size,Subflow Fwd Packets,Subflow Fwd Bytes,Init_Win_bytes_forward,Init_Win_bytes_backward,Label
120000.0,150,2,48000.0,128.0,401066.6,1266.6,800.0,200.0,1500.0,10.0,108000.0,96000.0,3000,40,1250.0,16.6,64.0,640.0,316.0,80.0,0,1,0,1,1,0,316.0,150,48000.0,8192,0,DoS-Hulk
350000.0,12,15,6480.0,13800.0,57942.8,77.1,13461.5,12000.0,30000.0,50.0,315000.0,280000.0,240,300,34.2,42.8,64.0,1460.0,751.1,280.0,0,0,0,1,1,0,751.1,12,6480.0,29200,29200,BENIGN
450.0,1,0,40.0,0.0,88888.8,2222.2,450.0,0.0,450.0,450.0,400.0,0.0,20,0,2222.2,0.0,0.0,40.0,40.0,0.0,0,1,0,0,0,0,40.0,1,40.0,1024,0,PortScan
45000.0,220,1,30800.0,64.0,685866.6,4911.1,204.5,50.0,350.0,5.0,40500.0,0.0,4400,20,4888.8,22.2,0.0,140.0,139.6,15.0,0,1,0,0,0,0,139.6,220,30800.0,1024,0,DDoS
420000.0,35,28,7350.0,5040.0,29500.0,150.0,6774.1,3000.0,15000.0,120.0,378000.0,336000.0,700,560,83.3,66.6,64.0,512.0,196.6,60.0,1,1,1,1,1,0,196.6,35,7350.0,29200,29200,BruteForce`;

      const demoFile = new File([dummyCsvContent], 'CIC-IDS2017_LiveDemo_Sample.csv', { type: 'text/csv' });
      setFile(demoFile);
      const res = await api.uploadCsvBatch(demoFile, 50);
      setAnalysisResult(res);
      if (onAnalysisComplete) onAnalysisComplete();
    } catch (err) {
      setError(err.message || 'Demo analysis failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="cyber-card p-5 rounded-xl border border-sky-500/20">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Mode A: Dataset & CSV Flow Scanner</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload captured PCAP-derived CSV flows (e.g. CIC-IDS2017 / UNSW-NB15) for high-speed batch classification.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Drag & Drop Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        className="cyber-card p-8 rounded-xl border-2 border-dashed border-slate-700 hover:border-sky-500/50 transition-all text-center flex flex-col items-center justify-center cursor-pointer group"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="p-4 rounded-2xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform mb-3">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h4 className="text-sm font-bold text-white mb-1">
          {file ? file.name : 'Select or Drop Flow CSV Dataset'}
        </h4>
        <p className="text-xs text-slate-400 max-w-md mb-4">
          {file
            ? `Size: ${(file.size / 1024).toFixed(1)} KB • Ready for AI classification`
            : 'Supports CIC-IDS2017 & CSE-CIC-IDS2018 flow schemas. Max upload size: 25MB.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleRunAnalysis}
            disabled={!file || isUploading}
            className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning Network Flows...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Batch Classification</span>
              </>
            )}
          </button>

          <button
            onClick={handleRunDemoSample}
            disabled={isUploading}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs border border-slate-700 transition-all"
          >
            <FileCheck className="w-4 h-4" />
            <span>Load & Test Demo Batch</span>
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center space-x-2 text-rose-400 text-xs bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-800">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="cyber-card p-5 rounded-xl border border-emerald-500/30 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Batch Analysis Report</h4>
            </div>
            <span className="font-mono text-xs text-slate-400">
              Completed in real-time
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-xs font-mono">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">Total Analyzed</span>
              <strong className="text-white text-base">{analysisResult.total_analyzed}</strong>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-emerald-400 block">Normal Benign</span>
              <strong className="text-emerald-300 text-base">{analysisResult.normal_count}</strong>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-rose-400 block">Intrusions Flagged</span>
              <strong className="text-rose-300 text-base">{analysisResult.malicious_count}</strong>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-amber-400 block">Critical Threats</span>
              <strong className="text-amber-300 text-base">{analysisResult.critical_alerts}</strong>
            </div>
          </div>

          {/* Preview Table */}
          <h5 className="text-xs font-bold text-slate-300 font-mono uppercase mb-2">
            Classified Flow Preview (Top Samples):
          </h5>
          <div className="overflow-x-auto max-h-64 border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase sticky top-0">
                <tr>
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Classified Vector</th>
                  <th className="py-2 px-3">Confidence</th>
                  <th className="py-2 px-3">Severity</th>
                  <th className="py-2 px-3">Flow Packets/s</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {analysisResult.records?.slice(0, 12).map((r, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 text-slate-500">{i + 1}</td>
                    <td className="py-2 px-3 font-bold text-white flex items-center gap-1.5">
                      {r.is_malicious ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      <span>{r.predicted_class}</span>
                    </td>
                    <td className="py-2 px-3 text-sky-400">
                      {Math.round(r.confidence * 100)}%
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                        r.severity === 'Critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                        r.severity === 'High' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        r.severity === 'Medium' ? 'bg-yellow-950 text-yellow-400 border border-yellow-800' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {r.severity}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400">
                      {r.flow_packets_s?.toFixed(1) || '0.0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
