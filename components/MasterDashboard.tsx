
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
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 nt-card px-5 py-4">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-gray-brand mb-2">Powered by NTangible</p>
          <h1 className="text-xl sm:text-2xl font-semibold text-ink tracking-tightest">IMG Academy · Mental performance dashboard</h1>
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
