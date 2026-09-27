import React from 'react';
import {
  Layers,
  Database,
  Cpu,
  TrendingUp,
  Search,
  ShieldAlert,
  GitBranch,
  Wrench,
  BrainCircuit,
  Terminal,
  CheckCircle2,
} from 'lucide-react';

export const PipelineView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2 font-mono">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-['Plus_Jakarta_Sans']">
          ShadowGrid System Architecture & Mathematical Engine
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Technical specifications for hackathon review, engineering evaluation, and algorithmic reproducibility
        </p>
      </div>

      {/* Core Principle Callout */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/40 text-xs">
        <span className="text-cyan-400 font-bold block mb-1 uppercase tracking-wider">
          Architectural Tenet: Deterministic Intelligence First
        </span>
        <p className="text-slate-300 font-sans leading-relaxed">
          ShadowGrid strictly separates mathematical analytics from natural language synthesis. All statistics, z-scores, deviations, risk quotients, and financial forecasts are computed deterministically in code. Generative AI is utilized strictly as an interpretive translation layer to synthesize readable executive briefs without risk of numerical hallucination.
        </p>
      </div>

      {/* 4 Pipeline Layers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Database className="w-4 h-4" />
            <span>1. Ingestion Layer (Existing Data)</span>
          </div>
          <p className="text-slate-400 font-sans leading-relaxed">
            Consumes existing hourly/daily utility telemetry, monthly billing records, ambient dry-bulb temperature, precipitation logs, and building occupancy counts. Requires zero retrofitted IoT smart meters.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold">
            <Cpu className="w-4 h-4" />
            <span>2. Deterministic Analytics Engine</span>
          </div>
          <p className="text-slate-400 font-sans leading-relaxed">
            Computes 14-day rolling mean baselines (μ) and standard deviation (σ). Derives standardized Z-Scores, percentage deviations, and multi-day persistence counters to generate composite anomaly scores (0-100).
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>3. Risk & Exposure Engine (P × I × E)</span>
          </div>
          <p className="text-slate-400 font-sans leading-relaxed">
            Computes explainable risk by weighting failure probability (40%), daily financial & resource loss severity (35%), and residential unit/occupant exposure (25%), normalized onto a 0-100 scale.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <BrainCircuit className="w-4 h-4" />
            <span>4. AI Synthesis & Explanation Layer</span>
          </div>
          <p className="text-slate-400 font-sans leading-relaxed">
            Proxies analytical context to Gemini 3.8-Flash via secure server-side endpoints, with instantaneous deterministic rule-based fallback if offline. Translates metrics into targeted technician checklists.
          </p>
        </div>
      </div>

      {/* Equations Section */}
      <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
          Core Mathematical Formulations
        </h3>

        <div className="space-y-4">
          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 font-bold block mb-1">Standardized Z-Score:</span>
            <code className="text-cyan-300 text-sm">Z = (x_t - μ_baseline) / σ_baseline</code>
            <p className="text-slate-400 font-sans mt-1 text-[11px]">
              Measures standard deviations above nominal rolling consumption, accounting for natural variance.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 font-bold block mb-1">Explainable Risk Index:</span>
            <code className="text-amber-300 text-sm">Risk = (0.40 × P_anomaly) + (0.35 × I_impact) + (0.25 × E_exposure)</code>
            <p className="text-slate-400 font-sans mt-1 text-[11px]">
              Normalizes probability, financial waste relative to capacity threshold, and resident headcount.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 font-bold block mb-1">Physical Deterioration Progression:</span>
            <code className="text-rose-300 text-sm">Q_excess(t) = Q_0 × (1 + α)^t</code>
            <p className="text-slate-400 font-sans mt-1 text-[11px]">
              Simulates orifice erosion in water conduits (α = 0.142) and thermal impedance escalation in power conductors.
            </p>
          </div>
        </div>
      </div>

      {/* Judge Demo Instructions */}
      <div className="p-6 rounded-xl bg-slate-900/80 border border-cyan-500/40 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <Terminal className="w-4 h-4" />
          <span>How to Operate the Live Demo (3-Minute Walkthrough)</span>
        </div>

        <ol className="list-decimal list-inside space-y-2 text-slate-300 font-sans leading-relaxed">
          <li>
            <strong>Start at Normal Baseline:</strong> Click the <em>Reset</em> button or select <em>Baseline (Bldg A)</em> to observe nominal green operational metrics.
          </li>
          <li>
            <strong>Trigger Hidden Anomaly:</strong> Click <em>Run Demo</em> or select <em>Water Leak (Bldg B)</em>. Observe the transition: Consumption surges +38% across 6 days while occupancy stays invariant at 42 occupants.
          </li>
          <li>
            <strong>Inspect Evidence:</strong> Review the <em>Why did ShadowGrid trigger this alert?</em> panel. Notice how rainfall and occupancy surges are explicitly excluded.
          </li>
          <li>
            <strong>Engage Flagship Simulator:</strong> Click <em>Simulate 24h</em>, <em>Simulate 48h</em>, and <em>Simulate 72h</em>. Watch the animated escalation of cumulative loss (3,479 L) and risk score (84 → 96).
          </li>
          <li>
            <strong>Switch Scenarios:</strong> Click <em>Power Spike (Bldg C)</em> to demonstrate versatility on electrical chiller overloads.
          </li>
          <li>
            <strong>Launch Presentation Mode:</strong> Click the monitor icon in the header for a clean, projector-ready view.
          </li>
        </ol>
      </div>
    </div>
  );
};
