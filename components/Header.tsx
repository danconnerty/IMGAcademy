import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Brain, LogOut, Circle, Menu, X } from 'lucide-react';
import { ViewType, UserProfile, TeamSummary, HomeTab } from '../types';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onStartWalkthrough: () => void;
  user?: UserProfile;
  teams?: TeamSummary[];
  onSelectTeam?: (id: string) => void;
  customOrgName?: string;
  homeTab?: HomeTab;
  onHomeTabChange?: (tab: HomeTab) => void;
  canOpenRosterInsights?: boolean;
  onExit: () => void;
}

const NAV_LINK = 'font-mono text-[11px] uppercase tracking-[0.22em] transition-colors';

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, onStartWalkthrough, user, teams, onSelectTeam, customOrgName, homeTab = 'roster', onHomeTabChange, canOpenRosterInsights = false, onExit }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isTeamsDropdownOpen, setIsTeamsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRosterInsightsDropdownOpen, setIsRosterInsightsDropdownOpen] = useState(false);
  const [isAthleteProfilesDropdownOpen, setIsAthleteProfilesDropdownOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const teamsDropdownRef = useRef<HTMLDivElement>(null);
  const rosterInsightsDropdownRef = useRef<HTMLDivElement>(null);
  const athleteProfilesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) setIsUserDropdownOpen(false);
      if (teamsDropdownRef.current && !teamsDropdownRef.current.contains(event.target as Node)) setIsTeamsDropdownOpen(false);
      if (rosterInsightsDropdownRef.current && !rosterInsightsDropdownRef.current.contains(event.target as Node)) setIsRosterInsightsDropdownOpen(false);
      if (athleteProfilesDropdownRef.current && !athleteProfilesDropdownRef.current.contains(event.target as Node)) setIsAthleteProfilesDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenus = () => {
    setIsUserDropdownOpen(false);
    setIsTeamsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsRosterInsightsDropdownOpen(false);
    setIsAthleteProfilesDropdownOpen(false);
  };

  const handleNavigation = (view: ViewType) => {
    onViewChange(view);
    closeMenus();
  };

  const handleTeamSelect = (teamId: string) => {
    if (!onSelectTeam) return;
    onSelectTeam(teamId);
    closeMenus();
  };

  const handleRosterInsightSelect = (tab: HomeTab) => {
    if (onHomeTabChange) {
      onHomeTabChange(tab);
    } else {
      onViewChange('home');
    }
    closeMenus();
  };

  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Dan Connerty';
  const displayRole = user ? user.role : 'Testing Groups';

  // White wordmark inverted to ink for the light navbar.
  const wordmarkClass = 'object-contain [filter:invert(1)]';

  const dropdownWrap = 'absolute top-full mt-3 w-60 bg-white rounded-card shadow-lift border border-line-strong overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]';
  const dropdownRow = 'w-full text-left px-4 py-3 text-sm text-body hover:bg-chip hover:text-ink transition-colors';
  const dropdownRowActive = 'w-full text-left px-4 py-3 text-sm text-ink font-medium bg-chip transition-colors';

  return (
    <header className="bg-paper/85 backdrop-blur-md border-b border-line text-ink w-full sticky top-0 z-50 transition-all duration-500">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-body hover:text-ink p-1">
              {isMobileMenuOpen ? <X size={24} strokeWidth={1.8} /> : <Menu size={24} strokeWidth={1.8} />}
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange('master')}>
              <img src="/NTangiblelogowhite.PNG" alt="NTangible" className={`h-3 w-auto ${wordmarkClass}`} />
              <span className="h-5 w-px bg-line-strong" aria-hidden="true" />
              <img src="/IMG.png" alt="IMG Academy" className="h-5 w-auto object-contain" />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7">
            <div className="relative" ref={teamsDropdownRef}>
              <button onClick={() => setIsTeamsDropdownOpen(!isTeamsDropdownOpen)} className={`flex items-center gap-1.5 ${NAV_LINK} ${isTeamsDropdownOpen || currentView === 'home' ? 'text-ink' : 'text-gray-brand hover:text-ink'}`}>
                Teams <ChevronDown size={13} strokeWidth={1.8} className={`transition-transform duration-200 ${isTeamsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isTeamsDropdownOpen && teams && (
                <div className={`${dropdownWrap} left-0`}>
                  <div className="max-h-[60vh] overflow-y-auto py-2">
                    <button onClick={() => handleNavigation('master')} className={dropdownRow}>Home</button>
                    {teams.map((team) => (
                      <button key={team.id} onClick={() => handleTeamSelect(team.id)} className={dropdownRow}>{team.name}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={rosterInsightsDropdownRef}>
              <button
                onClick={() => canOpenRosterInsights && setIsRosterInsightsDropdownOpen(!isRosterInsightsDropdownOpen)}
                className={`flex items-center gap-1.5 ${NAV_LINK} ${isRosterInsightsDropdownOpen || (currentView === 'home' && canOpenRosterInsights) ? 'text-ink' : canOpenRosterInsights ? 'text-gray-brand hover:text-ink' : 'text-gray-soft cursor-not-allowed'}`}
                disabled={!canOpenRosterInsights}
                title={canOpenRosterInsights ? 'Roster Insights' : 'Select a team first to open Roster Insights'}
              >
                Roster Insights <ChevronDown size={13} strokeWidth={1.8} className={`transition-transform duration-200 ${isRosterInsightsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isRosterInsightsDropdownOpen && canOpenRosterInsights && (
                <div className={`${dropdownWrap} left-0 py-2`}>
                  <button onClick={() => handleRosterInsightSelect('roster')} className={homeTab === 'roster' && currentView === 'home' ? dropdownRowActive : dropdownRow}>Current Roster</button>
                  <button onClick={() => handleRosterInsightSelect('alignment')} className={homeTab === 'alignment' && currentView === 'home' ? dropdownRowActive : dropdownRow}>Roster Alignment Index</button>
                </div>
              )}
            </div>

            <div className="relative" ref={athleteProfilesDropdownRef}>
              <button
                onClick={() => canOpenRosterInsights && setIsAthleteProfilesDropdownOpen(!isAthleteProfilesDropdownOpen)}
                className={`flex items-center gap-1.5 ${NAV_LINK} ${isAthleteProfilesDropdownOpen || currentView === 'nterpret-profile' || currentView === 'development-plan' ? 'text-ink' : canOpenRosterInsights ? 'text-gray-brand hover:text-ink' : 'text-gray-soft cursor-not-allowed'}`}
                disabled={!canOpenRosterInsights}
                title={canOpenRosterInsights ? 'Athlete Profiles' : 'Select a team first to open Athlete Profiles'}
              >
                Athlete Profiles <ChevronDown size={13} strokeWidth={1.8} className={`transition-transform duration-200 ${isAthleteProfilesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAthleteProfilesDropdownOpen && canOpenRosterInsights && (
                <div className={`${dropdownWrap} left-0 py-2`}>
                  <button onClick={() => handleNavigation('nterpret-profile')} className={currentView === 'nterpret-profile' ? dropdownRowActive : dropdownRow}>NTerpret Profile</button>
                  <button onClick={() => handleNavigation('development-plan')} className={currentView === 'development-plan' ? dropdownRowActive : dropdownRow}>Development Plan</button>
                </div>
              )}
            </div>

            <button onClick={() => canOpenRosterInsights && onViewChange('recruiting')} disabled={!canOpenRosterInsights} title={canOpenRosterInsights ? 'Recruiting' : 'Select a team first to open Recruiting'} className={`${NAV_LINK} ${currentView === 'recruiting' && canOpenRosterInsights ? 'text-ink' : canOpenRosterInsights ? 'text-gray-brand hover:text-ink' : 'text-gray-soft cursor-not-allowed'}`}>Recruiting</button>
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center cursor-pointer group" onClick={() => onViewChange('master')}>
          <div className="flex items-center gap-3">
            <img src="/NTangiblelogowhite.PNG" alt="NTangible" className={`h-4 w-auto ${wordmarkClass}`} />
            <span className="h-6 w-px bg-line-strong" aria-hidden="true" />
            <img src="/IMG.png" alt="IMG Academy" className="h-7 w-auto object-contain" />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5" ref={userDropdownRef}>
          <button onClick={onStartWalkthrough} className="hidden lg:flex nt-btn-ghost !py-2 !px-4 group">
            <Circle size={12} strokeWidth={2} className="opacity-80 group-hover:opacity-100" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em]">Walkthrough Demo</span>
          </button>

          <button onClick={onExit} className="flex items-center gap-2 text-gray-brand hover:text-ink transition-colors group p-2 md:p-0" title="Exit to Landing Page">
            <LogOut size={18} strokeWidth={1.8} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] hidden lg:inline-block">Exit Demo</span>
          </button>

          <div className="w-px h-8 bg-line-strong mx-1 hidden sm:block"></div>
          <div className="relative">
            <div className="flex items-center justify-end gap-2 cursor-pointer group select-none" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
              <div className="text-right hidden sm:block">
                <span className="text-sm font-medium text-ink leading-tight block">{displayName}</span>
                <p className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.12em] leading-tight">{displayRole}</p>
              </div>
              <div className="sm:hidden w-8 h-8 rounded-full bg-chip flex items-center justify-center text-gray-brand"><User size={16} strokeWidth={1.8} /></div>
              <ChevronDown size={13} strokeWidth={1.8} className={`hidden sm:block text-gray-brand transform transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
            </div>

            {isUserDropdownOpen && (
              <div className={`${dropdownWrap} right-0`}>
                <div className="px-5 py-4 border-b border-line bg-chip/40">
                  <p className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.22em]">Settings</p>
                </div>
                <div className="p-2">
                  <button onClick={() => handleNavigation('my-profile')} className="w-full text-left px-4 py-3 text-sm text-body hover:bg-chip hover:text-ink rounded-card transition-colors flex items-center gap-3">
                    <User size={16} strokeWidth={1.8} className="text-gray-soft" />
                    My Profile
                  </button>
                  <button onClick={() => handleNavigation('nterpret')} className="w-full text-left px-4 py-3 text-sm text-body hover:bg-chip hover:text-ink rounded-card transition-colors flex items-center gap-3">
                    <Brain size={16} strokeWidth={1.8} className="text-gray-soft" />
                    Coaches NTerpret
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-paper/95 backdrop-blur-xl border-t border-line shadow-lift animate-in slide-in-from-top-5 duration-300 z-40 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="flex flex-col p-6 space-y-6">
            <div className="space-y-2">
              <button onClick={() => canOpenRosterInsights && handleNavigation('recruiting')} disabled={!canOpenRosterInsights} className={`w-full text-left text-lg font-semibold tracking-tightest py-3 border-b border-line ${currentView === 'recruiting' && canOpenRosterInsights ? 'text-ink' : 'text-gray-brand'} ${canOpenRosterInsights ? '' : 'cursor-not-allowed opacity-50'}`}>Recruiting Pipeline</button>
              <button onClick={() => handleRosterInsightSelect('roster')} className={`w-full text-left text-lg font-semibold tracking-tightest py-3 border-b border-line ${currentView === 'home' && homeTab === 'roster' && canOpenRosterInsights ? 'text-ink' : 'text-gray-brand'} ${canOpenRosterInsights ? '' : 'cursor-not-allowed opacity-50'}`} disabled={!canOpenRosterInsights}>Current Roster</button>
              <button onClick={() => handleRosterInsightSelect('alignment')} className={`w-full text-left text-lg font-semibold tracking-tightest py-3 border-b border-line ${currentView === 'home' && homeTab === 'alignment' && canOpenRosterInsights ? 'text-ink' : 'text-gray-brand'} ${canOpenRosterInsights ? '' : 'cursor-not-allowed opacity-50'}`} disabled={!canOpenRosterInsights}>Roster Alignment Index</button>
              <button onClick={() => handleNavigation('nterpret-profile')} className={`w-full text-left text-lg font-semibold tracking-tightest py-3 border-b border-line ${currentView === 'nterpret-profile' && canOpenRosterInsights ? 'text-ink' : 'text-gray-brand'} ${canOpenRosterInsights ? '' : 'cursor-not-allowed opacity-50'}`} disabled={!canOpenRosterInsights}>NTerpret Profile</button>
              <button onClick={() => handleNavigation('development-plan')} className={`w-full text-left text-lg font-semibold tracking-tightest py-3 border-b border-line ${currentView === 'development-plan' && canOpenRosterInsights ? 'text-ink' : 'text-gray-brand'} ${canOpenRosterInsights ? '' : 'cursor-not-allowed opacity-50'}`} disabled={!canOpenRosterInsights}>Development Plan</button>
            </div>

            <div>
              <p className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.22em] mb-4 mt-2">Active Teams</p>
              <div className="space-y-1">
                <button onClick={() => handleNavigation('master')} className="w-full text-left py-3 px-4 rounded-card bg-white border border-line-strong text-body hover:border-ink hover:text-ink transition-colors"><span className="font-medium">Home Dashboard</span></button>
                {teams?.map(team => (
                  <button key={team.id} onClick={() => handleTeamSelect(team.id)} className="w-full text-left py-3 px-4 rounded-card bg-white border border-line-strong text-body hover:border-ink hover:text-ink transition-colors flex justify-between items-center">
                    <span className="font-medium">{team.name}</span>
                    <span className="font-mono text-[11px] bg-chip px-2 py-1 rounded-card text-gray-brand tabular-nums">{team.playerCount}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
