import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Sparkles,
  X,
  ChevronRight,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { DemoStage } from '../types';

interface DemoControllerBarProps {
  currentStage: DemoStage;
  onSelectStage: (stage: DemoStage) => void;
  onClose: () => void;
}

const STAGE_CONFIG: Record<
  DemoStage,
  { label: string; title: string; synopsis: string; actionHighlight?: string }
> = {
  1: {
    label: 'Stage 1',
    title: 'SYSTEM STATUS: NORMAL',
    synopsis: 'Baseline consumption ~1,850 L/day. Anomaly score: 12/100. Grid operates nominal.',
    actionHighlight: 'Notice nominal green health badge and steady 14-day baseline.',
  },
  2: {
    label: 'Stage 2',
    title: 'GRADUAL CONSUMPTION ELEVATION',
    synopsis: 'New telemetry arrives. Draw ramps: 1,900 → 2,050 → 2,250 → 2,400 → 2,500 → 2,550 L/day.',
    actionHighlight: 'Notice continuous night draw without usual zero-flow periods.',
  },
  3: {
    label: 'Stage 3',
    title: 'HIDDEN ANOMALY DETECTED',
    synopsis: '+38% abnormal deviation sustained across 6 consecutive days. Z-Score: +3.2σ.',
    actionHighlight: 'System trips WARNING state: Anomaly score escalates to 88/100.',
  },
  4: {
    label: 'Stage 4',
    title: 'ROOT-CAUSE INFERRED: WATER LEAK',
    synopsis: 'Likely issue: Concealed Pipe Leak (87% probability). Occupancy invariant, zero rainfall.',
    actionHighlight: 'Evidence engine excludes weather and domestic occupancy surges.',
  },
  5: {
    label: 'Stage 5',
    title: 'RISK & FINANCIAL IMPACT ASSESSED',
    synopsis: 'Excess: ~700 L/day. 14 apartments / 42 occupants exposed. Risk Score: 84/100 (HIGH).',
    actionHighlight: 'Calculates ₹35/day direct waste with ₹245/week compounding.',
  },
  6: {
    label: 'Stage 6',
    title: 'FAILURE CHAIN SIMULATOR ENGAGED',
    synopsis: 'Judge clicks 24h, 48h, 72h. Physics engine projects progressive micro-fissure expansion.',
    actionHighlight: 'Inspect the 24h / 48h / 72h buttons in the Flagship Simulator below.',
  },
  7: {
    label: 'Stage 7',
    title: 'ANIMATED ESCALATION & CUMULATIVE LOSS',
    synopsis: 'Cumulative loss hits 3,479 L. Risk accelerates to 96/100. Secondary drywall threat.',
    actionHighlight: 'Shows exponential escalation factor (×2.4 per day of delay).',
  },
  8: {
    label: 'Stage 8',
    title: 'RECOMMENDED INTERVENTION ISSUED',
    synopsis: 'Targeted physical valve inspection checklist dispatched. Golden window: 36h.',
    actionHighlight: 'Field technician checklist prevents ₹120,000 in ceiling remediation.',
  },
};

export const DemoControllerBar: React.FC<DemoControllerBarProps> = ({
  currentStage,
  onSelectStage,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        onSelectStage(currentStage < 8 ? ((currentStage + 1) as DemoStage) : 1);
      }, 4500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStage, onSelectStage]);

  const currentInfo = STAGE_CONFIG[currentStage];

  const handleNext = () => {
    if (currentStage < 8) onSelectStage((currentStage + 1) as DemoStage);
    else onSelectStage(1);
  };

  const handlePrev = () => {
    if (currentStage > 1) onSelectStage((currentStage - 1) as DemoStage);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-5xl mx-auto">
      <div className="p-4 rounded-2xl bg-[#090e17]/95 border-2 border-cyan-500/60 shadow-2xl backdrop-blur-md text-white font-mono space-y-3">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                LIVE DEMO WORKFLOW (BUILDING B)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Stage {currentStage} of 8
              </span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/30"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause Auto' : 'Auto Play'}</span>
            </button>

            <button
              onClick={handlePrev}
              disabled={currentStage === 1}
              className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
              title="Previous Stage"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleNext}
              className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Next Stage"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onSelectStage(1)}
              className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Restart Demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-2"
              title="Close Demo Bar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stage Timeline Pills */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-center text-[10px]">
          {([1, 2, 3, 4, 5, 6, 7, 8] as DemoStage[]).map((st) => (
            <button
              key={st}
              onClick={() => onSelectStage(st)}
              className={`py-1.5 px-1 rounded transition-all truncate ${
                currentStage === st
                  ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm'
                  : currentStage > st
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-800/40'
                  : 'bg-slate-900/60 text-slate-500 hover:text-slate-300'
              }`}
            >
              S{st}: {STAGE_CONFIG[st].label}
            </button>
          ))}
        </div>

        {/* Active Stage Callout */}
        <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-cyan-400 font-bold">{currentInfo.title}: </span>
            <span className="text-slate-300 font-sans">{currentInfo.synopsis}</span>
          </div>

          <div className="shrink-0 text-[11px] text-amber-300 font-sans bg-amber-950/40 px-2.5 py-1 rounded border border-amber-800/60">
            {currentInfo.actionHighlight}
          </div>
        </div>
      </div>
    </div>
  );
};
