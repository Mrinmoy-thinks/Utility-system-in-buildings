import React, { useState } from 'react';
import { X, UploadCloud, Database, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { ConsumptionRecord, UtilityType } from '../types';

interface DataIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRecords: ConsumptionRecord[];
  onLoadDataset: (buildingId: string) => void;
  onCustomCsvIngest: (records: ConsumptionRecord[]) => void;
}

export const DataIngestionModal: React.FC<DataIngestionModalProps> = ({
  isOpen,
  onClose,
  currentRecords,
  onLoadDataset,
  onCustomCsvIngest,
}) => {
  const [csvText, setCsvText] = useState('');
  const [activeTab, setActiveTab] = useState<'demo-sets' | 'csv-upload' | 'view-table'>('demo-sets');
  const [ingestSuccess, setIngestSuccess] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParseCsv = () => {
    setParseError(null);
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV must contain a header line and at least one data row.');
      }

      // Expected: date,consumption,temperature,rainfall,occupancy
      const parsedRecords: ConsumptionRecord[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim());
        if (parts.length >= 2) {
          const date = parts[0];
          const consumption = parseFloat(parts[1]);
          const temp = parts[2] ? parseFloat(parts[2]) : 28;
          const rain = parts[3] ? parseFloat(parts[3]) : 0;
          const occ = parts[4] ? parseInt(parts[4]) : 42;

          if (isNaN(consumption)) {
            throw new Error(`Invalid consumption number on row ${i + 1}: ${parts[1]}`);
          }

          parsedRecords.push({
            date,
            dayIndex: i - 1,
            buildingId: 'custom-bldg',
            utilityType: 'water',
            consumption,
            temperatureC: temp,
            rainfallMm: rain,
            occupancyCount: occ,
            outageHours: 0,
            tariffPerUnit: 0.05,
            isSimulatedAnomaly: false,
          });
        }
      }

      if (parsedRecords.length === 0) {
        throw new Error('No valid records parsed from CSV text.');
      }

      onCustomCsvIngest(parsedRecords);
      setIngestSuccess(true);
      setTimeout(() => {
        setIngestSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse CSV format.');
    }
  };

  const sampleCsvSnippet = `date,consumption,temperature,rainfall,occupancy
2026-09-01,1840,28.2,0,42
2026-09-02,1865,28.5,0,42
2026-09-03,1850,29.0,0,42
2026-09-04,1890,29.1,0,42
2026-09-05,2100,28.7,0,42
2026-09-06,2350,28.4,0,42
2026-09-07,2550,28.9,0,42`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b121e] border border-slate-700 rounded-2xl max-w-3xl w-full p-6 text-white font-mono space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Data Ingestion Engine</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('demo-sets')}
            className={`py-2 px-4 border-b-2 transition-all ${
              activeTab === 'demo-sets'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Pre-loaded Demo Datasets
          </button>
          <button
            onClick={() => setActiveTab('csv-upload')}
            className={`py-2 px-4 border-b-2 transition-all ${
              activeTab === 'csv-upload'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            CSV Ingestion & Paste
          </button>
          <button
            onClick={() => setActiveTab('view-table')}
            className={`py-2 px-4 border-b-2 transition-all ${
              activeTab === 'view-table'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Inspect Active Records ({currentRecords.length})
          </button>
        </div>

        {/* Tab 1: Pre-loaded Demo Datasets */}
        {activeTab === 'demo-sets' && (
          <div className="space-y-4 text-xs font-sans">
            <p className="text-slate-300">
              Select one of the 4 synthetic benchmark datasets to evaluate ShadowGrid’s anomaly detection:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
              <div
                onClick={() => {
                  onLoadDataset('bldg-b');
                  onClose();
                }}
                className="p-4 rounded-xl bg-slate-900 border border-cyan-500/50 hover:border-cyan-400 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white text-sm">Building B (Primary Demo)</span>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] border border-rose-800">
                    WATER LEAK
                  </span>
                </div>
                <p className="text-slate-400 text-xs font-sans">
                  Normal baseline ~1,850 L/d ramps to 2,550 L/d (+38%) over 6 consecutive days. Constant occupancy.
                </p>
              </div>

              <div
                onClick={() => {
                  onLoadDataset('bldg-c');
                  onClose();
                }}
                className="p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white text-sm">Building C (Electricity)</span>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] border border-amber-800">
                    OVERLOAD
                  </span>
                </div>
                <p className="text-slate-400 text-xs font-sans">
                  Baseline ~420 kWh/d spikes to 590 kWh/d (+40%) over 5 consecutive days. Chiller short-cycling signature.
                </p>
              </div>

              <div
                onClick={() => {
                  onLoadDataset('bldg-a');
                  onClose();
                }}
                className="p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-400 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white text-sm">Building A (Normal Baseline)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-800">
                    NORMAL
                  </span>
                </div>
                <p className="text-slate-400 text-xs font-sans">
                  Nominal consumption (~1,200 L/d water, ~310 kWh/d power) with standard weekend diurnal variations.
                </p>
              </div>

              <div
                onClick={() => {
                  onLoadDataset('bldg-d');
                  onClose();
                }}
                className="p-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-400 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white text-sm">Building D (Weather Spike)</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[10px] border border-indigo-800">
                    CORRELATED
                  </span>
                </div>
                <p className="text-slate-400 text-xs font-sans">
                  Draw surges in response to 39°C heatwave. ShadowGrid correlates temperature to avoid false positive alarm!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: CSV Upload */}
        {activeTab === 'csv-upload' && (
          <div className="space-y-4 text-xs font-mono">
            <p className="text-slate-300 font-sans">
              Paste custom telemetry rows (format: <code>date,consumption,temperature,rainfall,occupancy</code>):
            </p>

            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={sampleCsvSnippet}
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-700 text-cyan-200 text-xs focus:border-cyan-400 focus:outline-hidden"
            />

            {parseError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{parseError}</span>
              </div>
            )}

            {ingestSuccess && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Successfully ingested records! Re-computing anomaly matrix...</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setCsvText(sampleCsvSnippet)}
                className="text-slate-400 hover:text-white underline text-[11px]"
              >
                Insert Sample Anomaly CSV
              </button>

              <button
                onClick={handleParseCsv}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Ingest & Calculate Anomaly</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Inspect Active Records */}
        {activeTab === 'view-table' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="max-h-64 overflow-y-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Consumption</th>
                    <th className="p-2">Temp (°C)</th>
                    <th className="p-2">Rain (mm)</th>
                    <th className="p-2">Occupants</th>
                    <th className="p-2">Anomaly Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {currentRecords.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-900/60">
                      <td className="p-2">{r.date}</td>
                      <td className="p-2 font-bold text-white">{r.consumption.toLocaleString()}</td>
                      <td className="p-2">{r.temperatureC.toFixed(1)}</td>
                      <td className="p-2">{r.rainfallMm}</td>
                      <td className="p-2">{r.occupancyCount}</td>
                      <td className="p-2">
                        {r.isSimulatedAnomaly ? (
                          <span className="text-rose-400 font-bold">TRUE</span>
                        ) : (
                          <span className="text-slate-500">FALSE</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
