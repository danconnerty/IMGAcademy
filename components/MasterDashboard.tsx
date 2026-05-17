
import React from 'react';
import { TeamSummary } from '../types';
import TeamCard from './TeamCard';

interface MasterDashboardProps {
  teams: TeamSummary[];
  onSelectTeam: (id: string) => void;
}

const MasterDashboard: React.FC<MasterDashboardProps> = ({ teams, onSelectTeam }) => {
  return (
    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-1">Powered by NTangible</p>
          <h1 className="text-xl sm:text-2xl font-light text-gray-900 tracking-tight">IMG Academy · Mental Performance Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <img src="/IMG.png" alt="IMG Academy" className="h-12 w-auto object-contain" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            onClick={() => onSelectTeam(team.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MasterDashboard;
