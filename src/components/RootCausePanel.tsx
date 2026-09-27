import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Search,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import {
  AnomalyResult,
  BuildingInfo,
  ImpactEstimate,
  RiskFactorDecomposition,
  RootCauseHypothesis,
  UtilityType,
} from '../types';
import { generateInfrastructureExplanation, ExplanationResponse } from '../services/geminiService';

interface RootCausePanelProps {
  utilityType: UtilityType;
  anomaly: AnomalyResult;
  impact: ImpactEstimate;
  risk: RiskFactorDecomposition;
  building: BuildingInfo;
  hypotheses: RootCauseHypothesis[];
  evidencePoints: string[];
}

export const RootCausePanel: React.FC<RootCausePanelProps> = ({
  utilityType,
  anomaly,
  impact,
  risk,
  building,
  hypotheses,
  evidencePoints,
}) => {
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  const fetchExplanation = async () => {
    setIsLoading(true);
    const result = await generateInfrastructureExplanation({
      building,
      utilityType,
      anomaly,
      impact,
      risk,
      primaryHypothesis: hypotheses[0],
    });
    setExplanation(result);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExplanation();
  }, [building.id, utilityType, anomaly.observedValue]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
          <span>SECTION 4</span>
          <span className="text-slate-500">•</span>
          <span>Root-Cause Inference & Analytical Evidence</span>
        </h2>
        <span className="text-xs text-slate-400 font-mono">
          Deterministic Rule Engine + Gemini Intelligence
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols): Evidence Breakdown & Cause Probabilities */}
        <div className="lg:col-span-7 space-y-4">
          {/* Evidence Card */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Why did ShadowGrid trigger this alert?</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300">
                {anomaly.deviationPercent}% Deviation
              </span>
            </div>

            {/* Evidence Bullets */}
            <div className="space-y-2.5">
              {evidencePoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <div className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
            </div>

            {/* Inputs Contribution to Anomaly Score */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400 block mb-2 uppercase">
                Input Metrics Contribution to Anomaly Score ({anomaly.score}/100)
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Z-Score ({anomaly.zScore}σ)</span>
                  <span className="text-white font-bold">
                    +{anomaly.inputsContribution.zScoreContribution} pts
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Deviation (+{anomaly.deviationPercent}%)</span>
                  <span className="text-white font-bold">
                    +{anomaly.inputsContribution.percentageContribution} pts
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">
                    Persistence ({anomaly.consecutiveAbnormalDays}d)
                  </span>
                  <span className="text-white font-bold">
                    +{anomaly.inputsContribution.persistenceContribution} pts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Probabilistic Root Cause Hypotheses */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <span className="text-xs font-mono uppercase text-slate-300 font-semibold block">
              Inferred Root-Cause Probabilities
            </span>

            <div className="space-y-3">
              {hypotheses.map((h, i) => (
                <div key={h.cause} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span
                      className={`font-medium ${
                        i === 0 ? 'text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      {h.cause}
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        i === 0 ? 'text-cyan-400 text-sm' : 'text-slate-400'
                      }`}
                    >
                      {h.probabilityPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        i === 0 ? 'bg-cyan-500' : 'bg-slate-700'
                      }`}
                      style={{ width: `${h.probabilityPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
              Note: Probabilities are calculated dynamically using multi-variable correlation across occupancy logs, weather data, and consumption persistence.
            </p>
          </div>
        </div>

        {/* Right Column (5 cols): AI Technical Brief & Risk Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          {/* Gemini AI Technical Brief Card */}
          <div className="p-5 rounded-xl bg-gradient-to-b from-indigo-950/30 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-lg space-y-3 relative">
            <div className="flex items-center justify-between border-b border-indigo-900/40 pb-2.5">
              <div className="flex items-center gap-2 text-white font-bold text-xs font-mono">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                <span>AI Technical Diagnostic Brief</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">
                  {explanation?.source === 'gemini' ? 'Gemini 3.8-Flash' : 'Deterministic Engine'}
                </span>
                <button
                  onClick={fetchExplanation}
                  disabled={isLoading}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
                  title="Regenerate Technical Brief"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-slate-400 font-mono">
                <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
                <span>Synthesizing engineering diagnostic brief...</span>
              </div>
            ) : (
              <div className="text-xs text-slate-300 leading-relaxed font-sans space-y-2 whitespace-pre-line">
                {explanation?.technicalBrief}
              </div>
            )}
          </div>

          {/* Explainable Risk Scoring Formulation */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono uppercase text-slate-300 font-semibold">
                  Risk Formulation: P × I × E
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                {risk.compositeRiskScore} / 100
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400">1. Probability (P):</span>
                <span className="text-cyan-300 font-bold">{Math.round(risk.probabilityFactor * 100)}%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400">2. Resource Impact (I):</span>
                <span className="text-amber-300 font-bold">
                  Factor {risk.impactFactor} (₹{impact.monetaryLossPerDay}/d)
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400">3. Asset Exposure (E):</span>
                <span className="text-indigo-300 font-bold">
                  Factor {risk.exposureFactor} ({building.apartmentsCount} units, {building.totalOccupants} people)
                </span>
              </div>
            </div>

            {/* Formula Detail Toggle */}
            <button
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 font-mono pt-1"
            >
              <span>Explain Risk Calculation Equation</span>
              {showFormulaDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showFormulaDetails && (
              <div className="p-2.5 rounded bg-slate-950 text-[10px] font-mono text-slate-400 space-y-1.5 border border-slate-800">
                <p className="text-slate-300">Equation: Composite Risk = (0.40 × P) + (0.35 × I) + (0.25 × E)</p>
                <p>
                  Probability reflects anomaly persistence and lack of environmental correlation. Impact scales daily volume loss against infrastructure tolerance thresholds. Exposure scales by total occupant count and tenant units.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
