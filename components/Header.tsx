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
  const brandingName = customOrgName && customOrgName !== 'NTANGIBLE' ? customOrgName : 'NTANGIBLE';
  const isDefaultBranding = brandingName === 'NTANGIBLE';

  return (
    <header className="bg-black text-white w-full sticky top-0 z-50 transition-all duration-500 shadow-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white p-1">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange('master')}>
              <img src="/NTangiblelogowhite.PNG" alt="NTangible" className="h-3 w-auto object-contain" />
              <span className="h-5 w-px bg-white/20" aria-hidden="true" />
              <img src="/IMG.png" alt="IMG Academy" className="h-5 w-auto object-contain" />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium">
            <div className="relative" ref={teamsDropdownRef}>
              <button onClick={() => setIsTeamsDropdownOpen(!isTeamsDropdownOpen)} className={`flex items-center gap-1 transition-colors ${isTeamsDropdownOpen || currentView === 'home' ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
                Teams <ChevronDown size={14} className={`transition-transform duration-200 ${isTeamsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isTeamsDropdownOpen && teams && (
                <div className="absolute left-0 top-full mt-4 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                  <div className="max-h-[60vh] overflow-y-auto py-2">
                    <button onClick={() => handleNavigation('master')} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">Home</button>
                    {teams.map((team) => (
                      <button key={team.id} onClick={() => handleTeamSelect(team.id)} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">{team.name}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={rosterInsightsDropdownRef}>
              <button
                onClick={() => canOpenRosterInsights && setIsRosterInsightsDropdownOpen(!isRosterInsightsDropdownOpen)}
                className={`flex items-center gap-1 transition-colors ${isRosterInsightsDropdownOpen || (currentView === 'home' && canOpenRosterInsights) ? 'text-white' : canOpenRosterInsights ? 'text-gray-300 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                disabled={!canOpenRosterInsights}
                title={canOpenRosterInsights ? 'Roster Insights' : 'Select a team first to open Roster Insights'}
              >
                Roster Insights <ChevronDown size={14} className={`transition-transform duration-200 ${isRosterInsightsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isRosterInsightsDropdownOpen && canOpenRosterInsights && (
                <div className="absolute left-0 top-full mt-4 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60] py-2">
                  <button onClick={() => handleRosterInsightSelect('roster')} className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${homeTab === 'roster' && currentView === 'home' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}>Current Roster</button>
                  <button onClick={() => handleRosterInsightSelect('alignment')} className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${homeTab === 'alignment' && currentView === 'home' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}>Roster Alignment Index</button>
                </div>
              )}
            </div>

            <div className="relative" ref={athleteProfilesDropdownRef}>
              <button
                onClick={() => canOpenRosterInsights && setIsAthleteProfilesDropdownOpen(!isAthleteProfilesDropdownOpen)}
                className={`flex items-center gap-1 transition-colors ${isAthleteProfilesDropdownOpen || currentView === 'nterpret-profile' || currentView === 'development-plan' ? 'text-white' : canOpenRosterInsights ? 'text-gray-300 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                disabled={!canOpenRosterInsights}
                title={canOpenRosterInsights ? 'Athlete Profiles' : 'Select a team first to open Athlete Profiles'}
              >
                Athlete Profiles <ChevronDown size={14} className={`transition-transform duration-200 ${isAthleteProfilesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAthleteProfilesDropdownOpen && canOpenRosterInsights && (
                <div className="absolute left-0 top-full mt-4 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60] py-2">
                  <button onClick={() => handleNavigation('nterpret-profile')} className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${currentView === 'nterpret-profile' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}>NTerpret Profile</button>
                  <button onClick={() => handleNavigation('development-plan')} className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${currentView === 'development-plan' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`}>Development Plan</button>
                </div>
              )}
            </div>

            <button onClick={() => canOpenRosterInsights && onViewChange('recruiting')} disabled={!canOpenRosterInsights} title={canOpenRosterInsights ? 'Recruiting' : 'Select a team first to open Recruiting'} className={`transition-colors ${currentView === 'recruiting' && canOpenRosterInsights ? 'text-white' : canOpenRosterInsights ? 'text-gray-300 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}>Recruiting</button>
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-col items-center cursor-pointer group" onClick={() => onViewChange('master')}>
          <div className="flex items-center gap-3">
            <img src="/NTangiblelogowhite.PNG" alt="NTangible" className="h-4 w-auto object-contain" />
            <span className="h-6 w-px bg-white/25" aria-hidden="true" />
            <img src="/IMG.png" alt="IMG Academy" className="h-7 w-auto object-contain" />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6" ref={userDropdownRef}>
          <button onClick={onStartWalkthrough} className="hidden lg:flex items-center gap-2 bg-[#4263EB] hover:bg-[#3651C9] text-white px-5 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(66,99,235,0.5)] hover:shadow-[0_0_20px_rgba(66,99,235,0.7)] group">
            <Circle size={14} strokeWidth={3} className="text-white opacity-80 group-hover:opacity-100" />
            <span className="text-[10px] font-black uppercase tracking-widest">Walkthrough Demo</span>
          </button>

          <button onClick={onExit} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors group p-2 md:p-0" title="Exit to Landing Page">
            <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] hidden lg:inline-block">Exit Demo</span>
          </button>

          <div className="w-px h-8 bg-gray-800 mx-2 hidden sm:block"></div>
          <div className="relative">
            <div className="flex items-center justify-end gap-2 cursor-pointer hover:text-gray-300 group select-none" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
              <div className="text-right hidden sm:block">
                <span className="text-sm font-medium leading-tight block">{displayName}</span>
                <p className="text-[11px] text-gray-400 leading-tight">{displayRole}</p>
              </div>
              <div className="sm:hidden w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400"><User size={16} /></div>
              <ChevronDown size={14} className={`hidden sm:block transform transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
            </div>

            {isUserDropdownOpen && (
              <div className="absolute right-0 top-full mt-4 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Settings</p>
                </div>
                <div className="p-2">
                  <button onClick={() => handleNavigation('my-profile')} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-3">
                    <div className="p-1.5 bg-gray-100 rounded text-gray-500"><User size={16} /></div>
                    My Profile
                  </button>
                  <button onClick={() => handleNavigation('nterpret')} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors flex items-center gap-3">
                    <div className="p-1.5 bg-gray-100 rounded text-gray-500"><Brain size={16} /></div>
                    Coaches NTerpret
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-xl border-t border-gray-800 shadow-2xl animate-in slide-in-from-top-5 duration-300 z-40 h-[calc(100vh-64px)] overflow-y-auto">
          <div className="flex flex-col p-6 space-y-6">
            <div className="space-y-2">
              <button onClick={() => canOpenRosterInsights && handleNavigation('recruiting')} disabled={!canOpenRosterInsights} className={`w-full text-left text-lg font-semibold py-3 border-b border-gray-800 ${currentView === 'recruiting' && canOpenRosterInsights ? 'text-white' : 'text-gray-500'} ${canOpenRosterInsights ? '' : 'cursor-not-allowed opacity-50'}`}>Recruiting Pipeline</button>
              <button onClick={() => handleRosterInsightSelect('roster')} className={`w-full text-left text-lg font-semibold py-3 border-b border-gray-800 ${currentView === 'home' && homeTab === 'roster' && canOpenRosterInsights ? 'text-white' : 'text-gray-500'} ${canOpenRosterInsights ? '' : 'cursor-not-allowed opacity-50'}`} disabled={!canOpenRosterInsights}>Current Roster</button>
              <button onClick={() => handleRosterInsightSelect('alignment')} className={`w-full text-left text-lg font-semibold py-3 border-b border-gray-800 ${currentView === 'home' && homeTab === 'alignment' && canOpenRosterInsights ? 'text-white' : 'text-gray-500'} ${canOpenRosterInsights ? '' : 'cursor-not-allowed opacity-50'}`} disabled={!canOpenRosterInsights}>Roster Alignment Index</button>
              <button onClick={() => handleNavigation('nterpret-profile')} className={`w-full text-left text-lg font-semibold py-3 border-b border-gray-800 ${currentView === 'nterpret-profile' && canOpenRosterInsights ? 'text-white' : 'text-gray-500'} ${canOpenRosterInsights ? '' : 'cursor-not-allowed opacity-50'}`} disabled={!canOpenRosterInsights}>NTerpret Profile</button>
              <button onClick={() => handleNavigation('development-plan')} className={`w-full text-left text-lg font-semibold py-3 border-b border-gray-800 ${currentView === 'development-plan' && canOpenRosterInsights ? 'text-white' : 'text-gray-500'} ${canOpenRosterInsights ? '' : 'cursor-not-allowed opacity-50'}`} disabled={!canOpenRosterInsights}>Development Plan</button>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.14em] mb-4 mt-2">Active Teams</p>
              <div className="space-y-1">
                <button onClick={() => handleNavigation('master')} className="w-full text-left py-3 px-4 rounded-lg bg-gray-900/50 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"><span className="font-medium">Home Dashboard</span></button>
                {teams?.map(team => (
                  <button key={team.id} onClick={() => handleTeamSelect(team.id)} className="w-full text-left py-3 px-4 rounded-lg bg-gray-900/50 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors flex justify-between items-center">
                    <span className="font-medium">{team.name}</span>
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-500">{team.playerCount}</span>
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
