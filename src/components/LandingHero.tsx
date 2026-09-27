import React from 'react';
import {
  Activity,
  ArrowRight,
  Database,
  Cpu,
  TrendingUp,
  Search,
  ShieldAlert,
  GitBranch,
  Wrench,
  Play,
  Layers,
  Sparkles,
} from 'lucide-react';

interface LandingHeroProps {
  onLaunch: () => void;
  onRunDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onLaunch, onRunDemo }) => {
  const steps = [
    {
      title: 'Existing Data',
      desc: 'Bills, hourly meters, weather, occupancy',
      icon: Database,
      color: 'text-cyan-400',
    },
    {
      title: 'Anomaly Detection',
      desc: 'Z-score & multi-day persistence baseline',
      icon: Cpu,
      color: 'text-blue-400',
    },
    {
      title: 'Forecasting',
      desc: 'Trend projection & bound estimation',
      icon: TrendingUp,
      color: 'text-indigo-400',
    },
    {
      title: 'Root-Cause Analysis',
      desc: 'Evidence-based multi-variable likelihood',
      icon: Search,
      color: 'text-violet-400',
    },
    {
      title: 'Risk Scoring',
      desc: 'P × I × E formulation normalized to 100',
      icon: ShieldAlert,
      color: 'text-amber-400',
    },
    {
      title: 'Failure Simulation',
      desc: '24h / 48h / 72h physical escalation',
      icon: GitBranch,
      color: 'text-rose-400',
    },
    {
      title: 'Recommended Action',
      desc: 'Targeted physical intervention checklist',
      icon: Wrench,
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#090d16] via-[#0c121e] to-[#080c14] border-b border-slate-800 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI-Powered Early-Warning Platform</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
            <span>Zero New Hardware Required</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs font-mono">
            <span>SIMULATED DEMO DATA</span>
          </div>
        </div>

        {/* Hero Title & Pitch */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans'] leading-[1.15]">
            Detect what infrastructure{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              doesn't tell you.
            </span>
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-slate-300 leading-relaxed font-light">
            ShadowGrid detects hidden utility failures from existing data{' '}
            <span className="text-cyan-300 font-medium">
              before the infrastructure visibly fails.
            </span>
          </p>

          {/* Core Differentiator Callout Banner */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-blue-950/40 border border-cyan-500/30 shadow-lg shadow-cyan-950/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono text-cyan-400 font-semibold tracking-wider">
                  The Core Differentiator
                </span>
                <p className="text-sm font-semibold text-white">
                  “Hardware adds sensors. ShadowGrid adds intelligence to the data you already have.”
                </p>
              </div>
            </div>
            <div className="shrink-0 text-xs text-slate-400 border-l border-slate-700/60 pl-3 hidden sm:block">
              Uses utility bills, hourly logs, weather & occupancy
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onLaunch}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onRunDemo}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all hover:border-cyan-500/50"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-current" />
              <span>Run Live Hackathon Demo (Building B)</span>
            </button>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 pt-8 border-t border-slate-800/80">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all">
            <div className="w-8 h-8 rounded-md bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm mb-3">
              01
            </div>
            <h2 className="text-base font-bold text-white mb-1">Detect</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discovers hidden water leaks, electric overloads, and equipment slippage through statistical deviation from baseline, without deploying new IoT meters.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all">
            <div className="w-8 h-8 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm mb-3">
              02
            </div>
            <h2 className="text-base font-bold text-white mb-1">Predict</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulates progressive infrastructure failure over 24h, 48h, and 72h. Computes escalation probabilities and financial compounding over time.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all">
            <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
              03
            </div>
            <h2 className="text-base font-bold text-white mb-1">Act</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides actionable physical inspection checklists and golden intervention windows to eliminate resource loss before catastrophic burst or blackout.
            </p>
          </div>
        </div>

        {/* How ShadowGrid Works Flow */}
        <div className="mt-10 p-5 rounded-xl bg-[#0a0f19] border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                Technical Intelligence Pipeline
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Deterministic Analytics + Generative Explanation
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/90 relative group hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                    <Icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                  <h3 className="text-xs font-bold text-slate-200">{step.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
