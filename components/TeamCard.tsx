
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TeamSummary } from '../types';

interface TeamCardProps {
  team: TeamSummary;
  onClick?: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`nt-card p-6 flex flex-col justify-between min-h-56 ${onClick ? 'nt-card-hover cursor-pointer group' : ''}`}
    >
      <div className="font-mono uppercase text-[11px] font-medium text-gray-brand tracking-[0.16em] mb-4 truncate">
        {team.name}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-brand">Players</span>
          <span className="font-semibold text-ink tabular-nums">{team.playerCount}</span>
        </div>

        <div className="w-full h-px bg-line"></div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-brand">Avg Clutch Factor</span>
          <span className="font-semibold text-ink tabular-nums">{team.avgClutchFactor > 0 ? team.avgClutchFactor : '-'}</span>
        </div>

        <div className="w-full h-px bg-line"></div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-brand">Range</span>
          <span className="font-semibold text-ink tabular-nums">{team.clutchFactorRange}</span>
        </div>
      </div>

      {onClick && (
        <div className="mt-5 pt-4 border-t border-line flex items-center gap-2 font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] group-hover:text-ink transition-colors">
          View team
          <ArrowRight size={13} strokeWidth={1.8} className="nt-arrow" />
        </div>
      )}
    </div>
  );
};

export default TeamCard;
