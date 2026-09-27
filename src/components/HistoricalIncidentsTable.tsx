import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, Clock, Droplets, Zap, Building } from 'lucide-react';
import { IncidentHistoryItem, UtilityType } from '../types';

interface HistoricalIncidentsTableProps {
  incidents: IncidentHistoryItem[];
  onSelectIncident?: (incident: IncidentHistoryItem) => void;
}

export const HistoricalIncidentsTable: React.FC<HistoricalIncidentsTableProps> = ({
  incidents,
  onSelectIncident,
}) => {
  const [filterUtility, setFilterUtility] = useState<'all' | 'water' | 'electricity' | 'municipal'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Resolved' | 'Active'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = incidents.filter((item) => {
    if (filterUtility !== 'all' && item.utility !== filterUtility) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.buildingName.toLowerCase().includes(term) ||
        item.issue.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight font-['Plus_Jakarta_Sans']">
            Historical Incident Audit Log
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Archival records of detected utility anomalies, root-cause resolutions, and avoided losses
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 font-mono w-48"
            />
          </div>

          {/* Utility Filter Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {(['all', 'water', 'electricity', 'municipal'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterUtility(t)}
                className={`px-2.5 py-1 rounded capitalize transition-all ${
                  filterUtility === t
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3">Incident ID</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Building</th>
              <th className="py-3 px-3">Utility</th>
              <th className="py-3 px-3">Identified Issue</th>
              <th className="py-3 px-3">Detected Anomaly</th>
              <th className="py-3 px-3">Estimated Impact Avoided</th>
              <th className="py-3 px-3">Resolution & Outcome</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500 font-mono">
                  No matching incidents found
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectIncident?.(item)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-3 font-bold text-white group-hover:text-cyan-400">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">{item.date}</td>
                  <td className="py-3.5 px-3 text-slate-200 whitespace-nowrap">{item.buildingName}</td>
                  <td className="py-3.5 px-3">
                    <span className="flex items-center gap-1.5 uppercase text-[11px]">
                      {item.utility === 'water' ? (
                        <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                      ) : item.utility === 'electricity' ? (
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Building className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                      <span>{item.utility}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-white font-medium max-w-xs">{item.issue}</td>
                  <td className="py-3.5 px-3 text-rose-300/90">{item.detectedAnomaly}</td>
                  <td className="py-3.5 px-3 text-amber-300">{item.estimatedImpact}</td>
                  <td className="py-3.5 px-3 text-slate-400 max-w-xs leading-relaxed font-sans text-[11px]">
                    {item.resolution}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{item.status}</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
