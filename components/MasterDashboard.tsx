
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
