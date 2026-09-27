import React from 'react';
import { AlertTriangle, Droplets, Zap, ArrowRight, Eye, ShieldAlert } from 'lucide-react';
import { AlertItem } from '../types';

interface ActiveAlertsPanelProps {
  alerts: AlertItem[];
  onSelectAlert: (alert: AlertItem) => void;
}

export const ActiveAlertsPanel: React.FC<ActiveAlertsPanelProps> = ({ alerts, onSelectAlert }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
          <span>SECTION 3</span>
          <span className="text-slate-500">•</span>
          <span>Active Infrastructure Alerts</span>
        </h2>
        <span className="text-xs text-slate-400 font-mono">
          {alerts.length} Triggered Incident{alerts.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          const isWarning = alert.severity === 'WARNING';

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isCritical
                  ? 'bg-rose-950/20 border-rose-800/80 shadow-md shadow-rose-950/20'
                  : isWarning
                  ? 'bg-amber-950/20 border-amber-800/70 shadow-md shadow-amber-950/20'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {/* Left Info */}
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    alert.utility === 'water'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {alert.utility === 'water' ? (
                    <Droplets className="w-5 h-5" />
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {alert.id}
                    </span>
                    <span className="font-bold text-sm text-slate-100">{alert.buildingName}</span>
                    <span className="text-xs text-slate-400 font-mono">({alert.utility.toUpperCase()})</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-sans">{alert.summary}</p>
                </div>
              </div>

              {/* Right Metrics & CTA */}
              <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 font-mono text-xs border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Deviation</span>
                    <span className="font-bold text-rose-400">+{alert.anomalyPercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Probability</span>
                    <span className="font-bold text-cyan-300">{alert.probabilityPercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Priority</span>
                    <span
                      className={`font-bold ${
                        alert.priority === 'CRITICAL'
                          ? 'text-rose-400'
                          : alert.priority === 'HIGH'
                          ? 'text-amber-400'
                          : 'text-yellow-400'
                      }`}
                    >
                      {alert.priority}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectAlert(alert)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Investigate</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
