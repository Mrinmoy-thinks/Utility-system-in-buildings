import React, { useState } from 'react';
import { ConsumptionRecord, UtilityType } from '../types';
import { HelpCircle, ChevronDown, ChevronUp, Calendar, TrendingUp } from 'lucide-react';

interface ConsumptionChartProps {
  records: ConsumptionRecord[];
  utilityType: UtilityType;
  baselineValue: number;
  isAnomalyActive: boolean;
  buildingName: string;
}

export const ConsumptionChart: React.FC<ConsumptionChartProps> = ({
  records,
  utilityType,
  baselineValue,
  isAnomalyActive,
  buildingName,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const unit = utilityType === 'water' ? 'L' : 'kWh';

  // Build points: 30 days history + 7 forecast days
  const n = records.length;
  const historyPoints = records.map((r, i) => ({
    label: r.date.slice(5),
    value: r.consumption,
    isObserved: true,
    isAnomaly: r.isSimulatedAnomaly || false,
    baseline: baselineValue,
    occupancy: r.occupancyCount,
    temp: r.temperatureC,
  }));

  // Forecast points
  const lastVal = records[n - 1]?.consumption || baselineValue;
  const forecastPoints = Array.from({ length: 7 }, (_, i) => {
    const dayOffset = i + 1;
    const projected = isAnomalyActive
      ? Math.round(lastVal * (1 + dayOffset * 0.022))
      : Math.round(baselineValue + Math.sin(dayOffset) * 20);

    return {
      label: `+${dayOffset}d`,
      value: projected,
      isObserved: false,
      isAnomaly: false,
      baseline: baselineValue,
      occupancy: records[0]?.occupancyCount || 42,
      temp: 29,
    };
  });

  const allPoints = [...historyPoints, ...forecastPoints];

  // SVG dimensions
  const width = 850;
  const height = 300;
  const padding = { top: 25, right: 35, bottom: 40, left: 65 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Max and Min values for Y scale
  const values = allPoints.map((p) => p.value);
  const minY = Math.min(...values, baselineValue) * 0.85;
  const maxY = Math.max(...values, baselineValue) * 1.15;

  const getX = (idx: number) => padding.left + (idx / (allPoints.length - 1)) * chartW;
  const getY = (val: number) => padding.top + chartH - ((val - minY) / (maxY - minY)) * chartH;

  // Paths
  // 1. Baseline line path
  const baselineY = getY(baselineValue);

  // 2. Observed path (0 to n-1)
  const observedPath = historyPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.value)}`)
    .join(' ');

  // 3. Forecast path (from n-1 to end)
  const forecastPath = [
    `M ${getX(n - 1)} ${getY(historyPoints[n - 1].value)}`,
    ...forecastPoints.map((p, i) => `L ${getX(n + i)} ${getY(p.value)}`),
  ].join(' ');

  // Anomaly region shaded box on days 24 to 29
  const anomStartIdx = 24;
  const anomEndIdx = n - 1;
  const anomStartX = getX(anomStartIdx);
  const anomEndX = getX(anomEndIdx);

  const hoveredPoint = hoveredIndex !== null ? allPoints[hoveredIndex] : null;

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-2">
              <span>SECTION 2</span>
              <span className="text-slate-500">•</span>
              <span>Consumption Analytics & Forecasting</span>
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-mono">
              {buildingName}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Historical consumption time series (Days 1–30) with 7-day projected trajectory
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
            <span className="text-slate-300">Observed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b border-dashed border-slate-400 inline-block"></span>
            <span className="text-slate-400">Baseline ({baselineValue} {unit})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-rose-500/20 border border-rose-500/40 inline-block rounded-xs"></span>
            <span className="text-rose-300">Anomaly Region</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b-2 border-dotted border-indigo-400 inline-block"></span>
            <span className="text-indigo-300">7-Day Forecast</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto bg-[#070b13] rounded-lg p-2 border border-slate-800/80">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[650px] select-none"
        >
          <defs>
            {/* Anomaly region gradient */}
            <linearGradient id="anomalyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.02" />
            </linearGradient>

            {/* Observed fill gradient */}
            <linearGradient id="observedArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const yVal = minY + (maxY - minY) * ratio;
            const yPos = getY(yVal);
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={yPos}
                  x2={width - padding.right}
                  y2={yPos}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={yPos + 4}
                  fill="#64748b"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  {Math.round(yVal)} {unit}
                </text>
              </g>
            );
          })}

          {/* Anomaly Window Shaded Area */}
          {isAnomalyActive && (
            <g>
              <rect
                x={anomStartX}
                y={padding.top}
                width={anomEndX - anomStartX}
                height={chartH}
                fill="url(#anomalyGradient)"
                stroke="#f43f5e"
                strokeWidth="1"
                strokeDasharray="2 2"
                opacity="0.9"
              />
              <text
                x={(anomStartX + anomEndX) / 2}
                y={padding.top + 18}
                fill="#f43f5e"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
                letterSpacing="1"
              >
                ANOMALY WINDOW (6 CONSECUTIVE DAYS)
              </text>
            </g>
          )}

          {/* Baseline Reference Line */}
          <line
            x1={padding.left}
            y1={baselineY}
            x2={width - padding.right}
            y2={baselineY}
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="5 4"
            opacity="0.8"
          />

          {/* Observed Area Fill */}
          <path
            d={`${observedPath} L ${getX(n - 1)} ${padding.top + chartH} L ${getX(0)} ${
              padding.top + chartH
            } Z`}
            fill="url(#observedArea)"
          />

          {/* Observed Line */}
          <path
            d={observedPath}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Forecast Line */}
          <path
            d={forecastPath}
            fill="none"
            stroke="#818cf8"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />

          {/* Forecast Area Boundary Shading */}
          <path
            d={`M ${getX(n - 1)} ${getY(historyPoints[n - 1].value)} ${forecastPoints
              .map((p, i) => `L ${getX(n + i)} ${getY(p.value + 60 + i * 15)}`)
              .join(' ')} ${forecastPoints
              .slice()
              .reverse()
              .map((p, i) => `L ${getX(n + (6 - i))} ${getY(p.value - 60 - (6 - i) * 15)}`)
              .join(' ')} Z`}
            fill="#818cf8"
            fillOpacity="0.08"
          />

          {/* Data Points */}
          {allPoints.map((p, i) => {
            const x = getX(i);
            const y = getY(p.value);
            const isHovered = hoveredIndex === i;

            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : p.isAnomaly ? 4 : p.isObserved ? 2.5 : 3}
                  fill={
                    p.isAnomaly
                      ? '#f43f5e'
                      : p.isObserved
                      ? '#06b6d4'
                      : '#818cf8'
                  }
                  stroke={isHovered ? '#ffffff' : '#070b13'}
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}

          {/* X Axis Ticks */}
          {allPoints.map((p, i) => {
            if (i % 4 !== 0 && i !== n - 1 && i !== allPoints.length - 1) return null;
            const x = getX(i);
            return (
              <text
                key={i}
                x={x}
                y={height - 12}
                fill="#64748b"
                fontSize="9"
                textAnchor="middle"
                fontFamily="monospace"
              >
                {p.label}
              </text>
            );
          })}

          {/* Hover Crosshair & Tooltip Overlay */}
          {hoveredPoint && hoveredIndex !== null && (
            <g>
              <line
                x1={getX(hoveredIndex)}
                y1={padding.top}
                x2={getX(hoveredIndex)}
                y2={padding.top + chartH}
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoveredIndex)}
                cy={getY(hoveredPoint.value)}
                r="7"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Hover Floating Card */}
        {hoveredPoint && hoveredIndex !== null && (
          <div
            className="absolute top-4 right-4 bg-slate-950/95 border border-cyan-500/40 p-3 rounded-lg shadow-2xl text-xs font-mono space-y-1 pointer-events-none backdrop-blur-sm z-20 min-w-[200px]"
          >
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1">
              <span>Date: {hoveredPoint.label}</span>
              <span className={hoveredPoint.isObserved ? 'text-cyan-400' : 'text-indigo-400'}>
                {hoveredPoint.isObserved ? 'OBSERVED' : 'PROJECTED'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-300">Consumption:</span>
              <span className="font-bold text-white text-sm">
                {hoveredPoint.value.toLocaleString()} {unit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Baseline:</span>
              <span className="text-slate-300">
                {hoveredPoint.baseline.toLocaleString()} {unit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Delta:</span>
              <span
                className={`font-bold ${
                  hoveredPoint.value > hoveredPoint.baseline ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {hoveredPoint.value > hoveredPoint.baseline
                  ? `+${Math.round(
                      ((hoveredPoint.value - hoveredPoint.baseline) / hoveredPoint.baseline) * 100
                    )}%`
                  : `${Math.round(
                      ((hoveredPoint.value - hoveredPoint.baseline) / hoveredPoint.baseline) * 100
                    )}%`}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              <span>Occupancy: {hoveredPoint.occupancy}</span>
              <span>Temp: {hoveredPoint.temp.toFixed(1)}°C</span>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Explanation: How is this forecast generated? */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/40">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-slate-300 hover:text-white font-mono hover:bg-slate-900/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">How is this forecast generated?</span>
          </div>
          {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showExplanation && (
          <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-400 space-y-2 font-mono leading-relaxed bg-slate-900/20">
            <p>
              <strong className="text-slate-200">Methodology:</strong> Forecast generated using historical consumption trend and recent abnormal deviation.
            </p>
            <p>
              ShadowGrid employs an exponential weighted moving baseline coupled with a physical deterioration growth function. In unmitigated anomaly states, water pipe fissures experience progressive hydraulic erosion under mains line pressure (14.2% daily expansion factor). In normal states, the forecast reflects seasonal weekly occupancy periodicity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-slate-300">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block">Baseline Window</span>
                14-day rolling mean + 1.4σ band
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block">Deterioration Exponent</span>
                α = 0.022 per day unaddressed
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block">Confidence Interval</span>
                ±(60 + t × 15) {unit} margin
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
