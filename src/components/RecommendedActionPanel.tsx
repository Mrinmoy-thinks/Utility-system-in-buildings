import React, { useState } from 'react';
import {
  Wrench,
  Clock,
  AlertOctagon,
  CheckSquare,
  Square,
  MapPin,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { RecommendedAction } from '../types';

interface RecommendedActionPanelProps {
  action: RecommendedAction;
}

export const RecommendedActionPanel: React.FC<RecommendedActionPanelProps> = ({ action }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [dispatched, setDispatched] = useState(false);

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleDispatch = () => {
    setDispatched(true);
    setTimeout(() => setDispatched(false), 4000);
  };

  return (
    <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
            <span>SECTION 6</span>
            <span className="text-slate-500">•</span>
            <span>Recommended Physical Intervention</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pre-configured diagnostic action plan to resolve anomaly before structural escalation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded text-xs font-mono font-bold tracking-wide flex items-center gap-1.5 ${
              action.urgency === 'IMMEDIATE'
                ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>URGENCY: {action.urgency}</span>
          </span>

          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">
            Window: ~{action.goldenInterventionWindowHours}h
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Action & Consequence of Delay */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold block mb-1">
              Primary Directive
            </span>
            <h3 className="text-base font-bold text-white leading-snug font-['Plus_Jakarta_Sans']">
              {action.actionTitle}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mt-2">
              {action.description}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-xs font-mono text-slate-300">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Target Zone:</span>
            <span className="text-white font-bold">{action.targetLocation}</span>
          </div>

          <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-900/60 text-xs text-rose-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold uppercase font-mono text-[11px] text-rose-400">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Potential Consequence of Inaction:</span>
            </div>
            <p className="leading-relaxed text-slate-300 font-sans">
              {action.consequenceOfDelay}
            </p>
          </div>
        </div>

        {/* Technician Checklist & Work Order Dispatch */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono uppercase text-slate-300 font-semibold flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>Field Diagnostic Checklist</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {completedSteps.length} of {action.checklist.length} Complete
            </span>
          </div>

          <div className="space-y-2">
            {action.checklist.map((item, idx) => {
              const isChecked = completedSteps.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300 line-through opacity-75'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                  <span className="leading-snug">{item}</span>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleDispatch}
            disabled={dispatched}
            className={`w-full mt-2 py-2.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
              dispatched
                ? 'bg-emerald-600 text-white'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
            }`}
          >
            {dispatched ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Work Order #WO-8942 Dispatched!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Facility Work Order</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
