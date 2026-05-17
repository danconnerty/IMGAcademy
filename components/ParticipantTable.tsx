
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
             <ChevronUp size={8} className={`${sortField === field && sortDirection === 'asc' ? 'text-gray-800' : 'text-gray-300'}`} />
             <ChevronDown size={8} className={`-mt-0.5 ${sortField === field && sortDirection === 'desc' ? 'text-gray-800' : 'text-gray-300'}`} />
        </div>
    );
  };

  const getSignifier = (player: Player) => {
    const fitScore = player.fitScore ?? 0;
    if (fitScore >= 62.5 && player.clutchFactor >= 750) {
      return { label: 'Top Profile', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
    }
    if (fitScore < 62.5 && player.clutchFactor < 750) {
      return { label: 'At-Risk', className: 'bg-rose-100 text-rose-700 border-rose-200' };
    }
    return { label: 'Conditional', className: 'bg-amber-100 text-amber-700 border-amber-200' };
  };


  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-5 lg:p-6">
        
      <div className="mb-4">
        <h2 className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.14em] mb-3">PARTICIPANTS ({processedPlayers.length})</h2>
        <div className="mb-3 rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-600">
          <span className="font-semibold text-gray-800">Interpretation note:</span> Treat Clutch and Alignment as directional planning signals, then confirm with context from coaches and recent film.
        </div>

        <div className="mb-4 rounded border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-[11px] font-semibold text-gray-700 mb-3 flex items-center gap-2 uppercase tracking-wide"><CircleAlert size={14} /> Performance Signifier Key</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs leading-relaxed">
            <div className="rounded border border-gray-200 bg-white p-3">
              <span className="inline-block px-2 py-0.5 rounded-full border bg-emerald-100 text-emerald-700 border-emerald-200 font-semibold">Top Profile</span>
              <p className="mt-2 text-gray-500">Alignment ≥ 62.5% and Clutch ≥ 750</p>
              <p className="mt-1 text-gray-700">Reliable under pressure and aligned with staff intent. Consider leadership responsibilities.</p>
            </div>
            <div className="rounded border border-gray-200 bg-white p-3">
              <span className="inline-block px-2 py-0.5 rounded-full border bg-amber-100 text-amber-700 border-amber-200 font-semibold">Conditional</span>
              <p className="mt-2 text-gray-500">One metric is high while the other needs development</p>
              <p className="mt-1 text-gray-700">Strong upside with targeted coaching. Pair role clarity with a defined development plan.</p>
            </div>
            <div className="rounded border border-gray-200 bg-white p-3">
              <span className="inline-block px-2 py-0.5 rounded-full border bg-rose-100 text-rose-700 border-rose-200 font-semibold">At-Risk</span>
              <p className="mt-2 text-gray-500">Alignment &lt; 62.5% and Clutch &lt; 750</p>
              <p className="mt-1 text-gray-700">Higher friction and performance volatility. Increase communication cadence and accountability checkpoints.</p>
            </div>
          </div>
        </div>

        <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-300 transition-colors placeholder-gray-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 pr-2 w-8"></th>
              <th 
                className="py-3.5 pr-6 text-xs font-semibold uppercase tracking-wide text-gray-600 cursor-pointer select-none group"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Name <SortIndicator field="name" />
                </div>
              </th>
              <th 
                className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wide text-gray-600 cursor-pointer select-none"
                onClick={() => handleSort('position')}
              >
                 <div className="flex items-center">
                  Position <SortIndicator field="position" />
                </div>
              </th>
              <th 
                className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wide text-gray-600 cursor-pointer select-none"
                onClick={() => handleSort('round')}
              >
                  <div className="flex items-center">
                  Round <SortIndicator field="round" />
                </div>
              </th>
              <th 
                className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wide text-gray-600 cursor-pointer select-none"
                onClick={() => handleSort('graduationYear')}
              >
                 <div className="flex items-center">
                  Graduation <SortIndicator field="graduationYear" />
                </div>
              </th>
              <th 
                className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wide text-gray-600 cursor-pointer select-none"
                onClick={() => handleSort('clutchFactor')}
              >
                  <div className="flex items-center">
                  Clutch Factor <SortIndicator field="clutchFactor" />
                </div>
              </th>
              <th 
                className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wide text-gray-600 cursor-pointer select-none"
                onClick={() => handleSort('fitScore')}
              >
                  <div className="flex items-center">
                  Alignment <SortIndicator field="fitScore" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {processedPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-5 pr-2">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    </td>
                    <td className="py-4 pr-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${player.clutchFactor > 700 ? 'bg-emerald-300' : 'bg-gray-400'}`}></div>
                            <button 
                                onClick={() => setSelectedPlayerId(player.id)}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                {player.name}
                            </button>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] border font-semibold ${getSignifier(player).className}`}>
                              {getSignifier(player).label}
                            </span>
                            {getRecruitStatusSignifier(player) && (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] border font-semibold ${getRecruitStatusSignifier(player)?.className}`}>
                                {getRecruitStatusSignifier(player)?.label}
                              </span>
                            )}
                        </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                        {player.position}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                        {player.round}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                        {player.graduationYear}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                        {player.clutchFactor}
                    </td>
                     <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                        {player.fitScore !== undefined ? `${player.fitScore}%` : '-'}
                    </td>
                </tr>
            ))}
             {processedPlayers.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                  No participants found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
          <p className="text-sm text-gray-500">
              Showing <span className="font-semibold">1 to {Math.min(10, processedPlayers.length)}</span> of {processedPlayers.length} players
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
