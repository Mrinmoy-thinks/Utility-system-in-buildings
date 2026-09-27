import React from 'react';
import {
  X,
  AlertTriangle,
  Droplets,
  Zap,
  CheckCircle,
  Clock,
  Search,
  IndianRupee,
  Wrench,
  ShieldAlert,
} from 'lucide-react';
import { AlertItem } from '../types';

interface AlertDetailModalProps {
  alert: AlertItem | null;
  onClose: () => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({ alert, onClose }) => {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b121e] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-white font-mono space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                alert.utility === 'water'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {alert.utility === 'water' ? (
                <Droplets className="w-4 h-4" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">{alert.id}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {alert.buildingName}
                </span>
              </div>
              <span className="text-xs text-slate-400">{alert.detectedTime}</span>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Priority & Status Bar */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Severity Level:</span>
            <span
              className={`font-bold uppercase ${
                alert.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
              }`}
            >
              {alert.severity}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 font-bold border border-amber-800">
              {alert.status}
            </span>
          </div>
        </div>

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Deviation</span>
            <span className="text-base font-bold text-rose-400">+{alert.anomalyPercent}%</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Likelihood</span>
            <span className="text-base font-bold text-cyan-300">{alert.probabilityPercent}%</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Risk Score</span>
            <span className="text-base font-bold text-amber-400">{alert.riskScore} / 100</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Priority</span>
            <span className="text-base font-bold text-white">{alert.priority}</span>
          </div>
        </div>

        {/* Technical Summary */}
        <div className="space-y-2 text-xs">
          <span className="text-slate-400 uppercase font-semibold block">Incident Summary</span>
          <p className="text-slate-200 font-sans leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
            {alert.summary}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
          >
            Close Incident File
          </button>
        </div>
      </div>
    </div>
  );
};
