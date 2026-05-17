
import React from 'react';
import { TeamSummary } from '../types';

interface TeamCardProps {
  team: TeamSummary;
  onClick?: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between min-h-56 transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : ''}`}
    >
      <div className="uppercase text-xs font-semibold text-gray-500 tracking-[0.14em] mb-4 truncate">
        {team.name}
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Players</span>
          <span className="font-semibold text-gray-900">{team.playerCount}</span>
        </div>
        
        <div className="w-full h-px bg-gray-100"></div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Avg Clutch Factor</span>
          <span className="font-semibold text-gray-900">{team.avgClutchFactor > 0 ? team.avgClutchFactor : '-'}</span>
        </div>
        
        <div className="w-full h-px bg-gray-100"></div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Range</span>
          <span className="font-semibold text-gray-900">{team.clutchFactorRange}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
