
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, CircleAlert } from 'lucide-react';
import { Player, ViewType } from '../types';
import { getRecruitStatusSignifier } from '../utils/recruiting';
import ScoutingModal from './ScoutingModal';

type SortField = 'name' | 'position' | 'round' | 'graduationYear' | 'clutchFactor' | 'fitScore';
type SortDirection = 'asc' | 'desc';

interface ParticipantTableProps {
  view: ViewType;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  externalPositionFilter: string;
  externalLevelFilter: string;
  externalGradYearFilter: string;
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({ 
  view, 
  players, 
  setPlayers, 
  externalPositionFilter, 
  externalLevelFilter,
  externalGradYearFilter 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  // Changed default sort to clutchFactor descending (highest to lowest)
  const [sortField, setSortField] = useState<SortField>('clutchFactor');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const selectedPlayer = useMemo(() => 
    players.find(p => p.id === selectedPlayerId) || null, 
  [players, selectedPlayerId]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      // For clutchFactor and fitScore, we usually want descending first, others ascending
      setSortDirection(field === 'clutchFactor' || field === 'fitScore' ? 'desc' : 'asc');
    }
  };

  const processedPlayers = useMemo(() => {
    let result = [...players];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.position.toLowerCase().includes(q)
      );
    }

    if (externalPositionFilter !== 'All') {
      result = result.filter(p => p.position === externalPositionFilter);
    }
    if (externalLevelFilter !== 'All') {
      result = result.filter(p => p.level === externalLevelFilter); // Adjust matching logic if mock levels change
    }
    if (externalGradYearFilter !== 'All') {
      result = result.filter(p => String(p.graduationYear) === externalGradYearFilter);
    }

    result.sort((a, b) => {
      const valA = a[sortField] ?? (sortDirection === 'asc' ? Infinity : -Infinity);
      const valB = b[sortField] ?? (sortDirection === 'asc' ? Infinity : -Infinity);

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [players, searchQuery, externalPositionFilter, externalLevelFilter, externalGradYearFilter, sortField, sortDirection]);

  const SortIndicator = ({ field }: { field: SortField }) => {
    return (
        <div className="flex flex-col ml-1">
             <ChevronUp size={8} className={`${sortField === field && sortDirection === 'asc' ? 'text-ink' : 'text-line-strong'}`} />
             <ChevronDown size={8} className={`-mt-0.5 ${sortField === field && sortDirection === 'desc' ? 'text-ink' : 'text-line-strong'}`} />
        </div>
    );
  };

  const getSignifier = (player: Player) => {
    const fitScore = player.fitScore ?? 0;
    if (fitScore >= 62.5 && player.clutchFactor >= 750) {
      return { label: 'Top Profile', className: 'bg-ink text-white border-ink' };
    }
    if (fitScore < 62.5 && player.clutchFactor < 750) {
      return { label: 'At-Risk', className: 'bg-white text-ink border-ink' };
    }
    return { label: 'Conditional', className: 'bg-chip text-body border-line-strong' };
  };


  return (
    <div className="w-full nt-card p-5 lg:p-6">

      <div className="mb-4">
        <h2 className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.14em] mb-3">Participants ({processedPlayers.length})</h2>
        <div className="mb-3 rounded-card border border-line bg-chip/40 px-4 py-3 text-sm leading-relaxed text-body">
          <span className="font-semibold text-ink">Interpretation note:</span> Treat Clutch and Alignment as directional planning signals, then confirm with context from coaches and recent film.
        </div>

        <div className="mb-4 rounded-card border border-line bg-chip/40 px-4 py-3">
          <p className="font-mono text-[11px] font-medium text-gray-brand mb-3 flex items-center gap-2 uppercase tracking-[0.16em]"><CircleAlert size={14} strokeWidth={1.8} /> Performance signifier key</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
            <div className="rounded-card border border-line-strong bg-white p-3">
              <span className="inline-block px-2 py-0.5 rounded-pill border bg-ink text-white border-ink font-mono text-[10px] uppercase tracking-[0.1em]">Top Profile</span>
              <p className="mt-2 text-gray-brand">Alignment ≥ 62.5% and Clutch ≥ 750</p>
              <p className="mt-1 text-body">Reliable under pressure and aligned with staff intent. Consider leadership responsibilities.</p>
            </div>
            <div className="rounded-card border border-line-strong bg-white p-3">
              <span className="inline-block px-2 py-0.5 rounded-pill border bg-chip text-body border-line-strong font-mono text-[10px] uppercase tracking-[0.1em]">Conditional</span>
              <p className="mt-2 text-gray-brand">One metric is high while the other needs development</p>
              <p className="mt-1 text-body">Strong upside with targeted coaching. Pair role clarity with a defined development plan.</p>
            </div>
            <div className="rounded-card border border-line-strong bg-white p-3">
              <span className="inline-block px-2 py-0.5 rounded-pill border bg-white text-ink border-ink font-mono text-[10px] uppercase tracking-[0.1em]">At-Risk</span>
              <p className="mt-2 text-gray-brand">Alignment &lt; 62.5% and Clutch &lt; 750</p>
              <p className="mt-1 text-body">Higher friction and performance volatility. Increase communication cadence and accountability checkpoints.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nt-input"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line">
              <th className="py-4 pr-2 w-8"></th>
              <th
                className="py-3.5 pr-6 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-gray-brand cursor-pointer select-none group"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name <SortIndicator field="name" />
                </div>
              </th>
              <th
                className="py-3.5 px-6 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-gray-brand cursor-pointer select-none"
                onClick={() => handleSort('position')}
              >
                 <div className="flex items-center">
                  Position <SortIndicator field="position" />
                </div>
              </th>
              <th
                className="py-3.5 px-6 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-gray-brand cursor-pointer select-none"
                onClick={() => handleSort('round')}
              >
                  <div className="flex items-center">
                  Round <SortIndicator field="round" />
                </div>
              </th>
              <th
                className="py-3.5 px-6 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-gray-brand cursor-pointer select-none"
                onClick={() => handleSort('graduationYear')}
              >
                 <div className="flex items-center">
                  Graduation <SortIndicator field="graduationYear" />
                </div>
              </th>
              <th
                className="py-3.5 px-6 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-gray-brand cursor-pointer select-none"
                onClick={() => handleSort('clutchFactor')}
              >
                  <div className="flex items-center">
                  Clutch Factor <SortIndicator field="clutchFactor" />
                </div>
              </th>
              <th
                className="py-3.5 px-6 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-gray-brand cursor-pointer select-none"
                onClick={() => handleSort('fitScore')}
              >
                  <div className="flex items-center">
                  Alignment <SortIndicator field="fitScore" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {processedPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-chip transition-colors group">
                    <td className="py-5 pr-2">
                      <input type="checkbox" className="h-4 w-4 rounded-card border-line-strong accent-ink" />
                    </td>
                    <td className="py-4 pr-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${player.clutchFactor > 700 ? 'bg-ink' : 'bg-line-strong'}`}></div>
                            <button
                                onClick={() => setSelectedPlayerId(player.id)}
                                className="text-ink hover:underline text-sm font-medium"
                            >
                                {player.name}
                            </button>
                            <span className={`px-2 py-0.5 rounded-pill text-[10px] border font-mono uppercase tracking-[0.1em] ${getSignifier(player).className}`}>
                              {getSignifier(player).label}
                            </span>
                            {getRecruitStatusSignifier(player) && (
                              <span className={`px-2 py-0.5 rounded-pill text-[10px] border font-semibold ${getRecruitStatusSignifier(player)?.className}`}>
                                {getRecruitStatusSignifier(player)?.label}
                              </span>
                            )}
                        </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-body">
                        {player.position}
                    </td>
                    <td className="py-4 px-6 text-sm text-body">
                        {player.round}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-brand tabular-nums">
                        {player.graduationYear}
                    </td>
                    <td className="py-4 px-6 text-sm font-mono tabular-nums text-ink">
                        {player.clutchFactor}
                    </td>
                     <td className="py-4 px-6 text-sm font-mono tabular-nums text-ink font-medium">
                        {player.fitScore !== undefined ? `${player.fitScore}%` : '-'}
                    </td>
                </tr>
            ))}
             {processedPlayers.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-brand text-sm">
                  No participants found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gray-brand">
              Showing <span className="text-ink tabular-nums">1 to {Math.min(10, processedPlayers.length)}</span> of <span className="tabular-nums">{processedPlayers.length}</span> players
          </p>
      </div>

      {selectedPlayer && (
        <ScoutingModal 
            player={selectedPlayer} 
            allPlayers={players} // PASSING FULL LIST FOR RANKING CONTEXT
            onClose={() => setSelectedPlayerId(null)} 
        />
      )}
    </div>
  );
};

export default ParticipantTable;
