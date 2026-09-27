import React, { useState } from 'react';
import { X, Sliders, IndianRupee, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { TariffConfig } from '../types';
import { DEFAULT_TARIFFS } from '../data/mockData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tariffs: TariffConfig;
  onSaveTariffs: (newTariffs: TariffConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  tariffs,
  onSaveTariffs,
}) => {
  const [waterRate, setWaterRate] = useState(tariffs.waterPerLitre);
  const [elecRate, setElecRate] = useState(tariffs.electricityPerKWh);
  const [thresholdSigma, setThresholdSigma] = useState(1.4);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveTariffs({
      waterPerLitre: Number(waterRate),
      electricityPerKWh: Number(elecRate),
      municipalBaselineCharge: tariffs.municipalBaselineCharge,
    });
    onClose();
  };

  const handleReset = () => {
    setWaterRate(DEFAULT_TARIFFS.waterPerLitre);
    setElecRate(DEFAULT_TARIFFS.electricityPerKWh);
    setThresholdSigma(1.4);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b121e] border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white font-mono space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Tariffs & System Assumptions</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span className="font-sans leading-relaxed">
            <strong>Demo Assumptions Notice:</strong> These tariff rates and sensitivity thresholds drive the financial loss calculations and failure chain projections dynamically.
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">
              Water Tariff (₹ per Litre)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
              <input
                type="number"
                step="0.01"
                min="0.001"
                value={waterRate}
                onChange={(e) => setWaterRate(parseFloat(e.target.value) || 0.05)}
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold focus:border-cyan-400 focus:outline-hidden"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Default: ₹0.05 / L (₹50 per 1,000 Litres municipal rate)
            </span>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">
              Electricity Tariff (₹ per kWh)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
              <input
                type="number"
                step="0.5"
                min="1.0"
                value={elecRate}
                onChange={(e) => setElecRate(parseFloat(e.target.value) || 8.0)}
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold focus:border-cyan-400 focus:outline-hidden"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Default: ₹8.00 / kWh (Commercial / Residential blended tier)
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-400">Anomaly Detection Sensitivity (Z-Score Threshold)</label>
              <span className="text-cyan-300 font-bold">{thresholdSigma}σ</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.1"
              value={thresholdSigma}
              onChange={(e) => setThresholdSigma(parseFloat(e.target.value))}
              className="w-full accent-cyan-400"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Lower = higher sensitivity; Higher = only extreme spikes flag alerts.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
