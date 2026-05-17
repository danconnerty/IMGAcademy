import React, { useState, useMemo } from 'react';
import { X, Activity, Users, Trophy, Target, ArrowLeft, Filter, ChevronDown } from 'lucide-react';
import Header from './components/Header';
import ParticipantTable from './components/ParticipantTable';
import CoachesNterpret from './components/CoachesNterpret';
import MyProfile from './components/MyProfile';
import FitScoreRubric from './components/FitScoreRubric';
import RecruitingView from './components/RecruitingView';
import Walkthrough from './components/Walkthrough';
import MasterDashboard from './components/MasterDashboard';
import LandingPage from './components/LandingPage';
import MethodologyView from './components/MethodologyView';
import { ViewType, Player, UserProfile } from './types';
import { MOCK_TEAMS } from './mockTeams';

// STRICT SEPARATION: Import separate data sources
import { ALL_ROSTERS, SPORT_CONFIG } from './mockRoster';
import { RECRUIT_PLAYERS } from './mockRecruits';

const App: React.FC = () => {
  const [demoStarted, setDemoStarted] = useState(false);
  // NEW: State for the custom organization name entered on landing page
  const [customOrgName, setCustomOrgName] = useState<string>('NTANGIBLE');
  
  const [currentView, setCurrentView] = useState<ViewType>('master');
  // Walkthrough set to false initially - requires button click to start
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  
  // State for all rosters (mapped by team ID)
  const [allRosters, setAllRosters] = useState<Record<string, Player[]>>(ALL_ROSTERS);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('football');
  
  // Independent Recruit Data
  const [recruitData, setRecruitData] = useState<Player[]>(RECRUIT_PLAYERS);
  
  // Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: 'Dan',
    lastName: 'Connerty',
    role: 'Testing Groups',
    orgName: 'NTangible',
    email: 'dan.connerty@ntangible.co',
    phone: '(555) 123-4567',
    organization: 'NTangible',
    memberSince: 'January 2026',
    plan: 'Head Coach'
  });

  const [isRubricOpen, setIsRubricOpen] = useState(false);
  
  // Filter States
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedGradYear, setSelectedGradYear] = useState<string>('All');
  
  // Mobile Filter Visibility State
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Helper to get current sport config
  const currentSportConfig = useMemo(() => {
     return SPORT_CONFIG[selectedTeamId] || SPORT_CONFIG['football'];
  }, [selectedTeamId]);

  const positions = ['All', ...currentSportConfig.positions];
  const levels = ['All', 'Freshman', 'Sophomore', 'Junior', 'Senior', 'Redshirt'];
  const gradYears = ['All', '2025', '2026', '2027', '2028'];

  // Get current roster based on selected team
  const currentRoster = useMemo(() => {
    return allRosters[selectedTeamId] || [];
  }, [allRosters, selectedTeamId]);

  // Handle updates to current roster (e.g. from table edits if implemented)
  const handleSetCurrentRoster = (newRoster: React.SetStateAction<Player[]>) => {
      // Allow passing a function or value, similar to standard setState
      const nextRoster = typeof newRoster === 'function' 
        ? newRoster(currentRoster) 
        : newRoster;

      setAllRosters(prev => ({
          ...prev,
          [selectedTeamId]: nextRoster
      }));
  };

  // CALCULATE CURRENT TEAM STATS (For Home View)
  const teamStats = useMemo(() => {
    const active = currentRoster.filter(p => p.status === 'active');
    const totalClutch = active.reduce((sum, p) => sum + p.clutchFactor, 0);
    const avgClutch = Math.round(totalClutch / (active.length || 1));
    
    const fitScores = active.map(p => p.fitScore).filter((s): s is number => s !== undefined);
    const totalFit = fitScores.reduce((sum, s) => sum + s, 0);
    const avgFit = Math.round(totalFit / (fitScores.length || 1));

    const eliteCount = active.filter(p => p.clutchFactor > 800).length;

    return { count: active.length, avgClutch, avgFit, eliteCount };
  }, [currentRoster]);

  // CALCULATE MASTER DASHBOARD SUMMARIES DYNAMICALLY FOR ALL TEAMS
  const dashboardTeams = useMemo(() => {
    return MOCK_TEAMS.map(team => {
        const roster = allRosters[team.id];
        if (!roster) return team; // Fallback to mock data if no roster found

        const active = roster.filter(p => p.status === 'active');
        const clutchScores = active.map(p => p.clutchFactor).filter(s => s > 0);
        
        const minClutch = clutchScores.length > 0 ? Math.min(...clutchScores) : 0;
        const maxClutch = clutchScores.length > 0 ? Math.max(...clutchScores) : 0;
        const totalClutch = clutchScores.reduce((a, b) => a + b, 0);
        const avgClutch = Math.round(totalClutch / (clutchScores.length || 1));

        return {
            ...team,
            playerCount: active.length,
            avgClutchFactor: avgClutch,
            clutchFactorRange: clutchScores.length > 0 ? `${minClutch} - ${maxClutch}` : '-'
        };
    });
  }, [allRosters]);

  // Handle view change
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  const handleSelectTeam = (id: string) => {
      setSelectedTeamId(id);
      setCurrentView('home');
      // Reset filters when switching teams
      setSelectedPosition('All');
      setSelectedLevel('All');
      setSelectedGradYear('All');
  };

  // Handle Exit Demo
  const handleExitDemo = () => {
    setDemoStarted(false);
    setCustomOrgName('NTANGIBLE');
    setCurrentView('master');
  };

  const selectedTeamName = MOCK_TEAMS.find(t => t.id === selectedTeamId)?.name || 'TEAM';

  const FilterSection = ({ title, options, selected, onSelect }: { title: string, options: string[], selected: string, onSelect: (val: string) => void }) => (
    <div className="mb-7">
      <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.16em] mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              selected === opt 
                ? 'bg-black text-white border-black shadow-sm' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const StatCard = ({ label, value, subtext, icon: Icon, colorClass }: { label: string, value: string | number, subtext: string, icon: any, colorClass: string }) => (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex-1 min-w-[100%] sm:min-w-[200px]">
        <div className="flex justify-between items-start mb-3">
            <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
                <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
            </div>
        </div>
        <div>
            <h4 className="text-2xl lg:text-[1.75rem] font-medium text-gray-900 tracking-tight leading-none mb-2">{value}</h4>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.14em] mb-1">{label}</p>
            <p className="text-xs text-gray-500 leading-snug">{subtext}</p>
        </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'master':
        return (
            <MasterDashboard 
                teams={dashboardTeams} 
                onSelectTeam={handleSelectTeam}
            />
        );
      case 'recruiting':
        return (
           <RecruitingView 
              players={recruitData} 
              setPlayers={setRecruitData} 
           />
        );
      case 'nterpret':
        return <CoachesNterpret />;
      case 'my-profile':
        return <MyProfile profile={userProfile} onSave={setUserProfile} />;
      case 'methodology':
        return <MethodologyView />;
      case 'home':
      default:
        return (
          <>
            <div className="mb-8 flex flex-col gap-6">
              <div>
                <button 
                  onClick={() => setCurrentView('master')}
                  className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest mb-4 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Dashboard
                </button>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4">
                    <h1 className="text-2xl md:text-[2rem] font-medium text-gray-900 tracking-tight capitalize leading-tight">
                        {selectedTeamName.toLowerCase()}
                    </h1>
                    <p className="text-gray-500 text-sm md:text-[0.95rem] mt-1 sm:mt-0">2025 Pre-Season Roster Assessment</p>
                </div>
              </div>

              {/* TEAM DNA / KPI SECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard 
                    label="Active Roster" 
                    value={teamStats.count} 
                    subtext="Players assessed"
                    icon={Users}
                    colorClass="text-blue-600 bg-blue-600"
                  />
                  <StatCard 
                    label="Team Clutch Avg" 
                    value={teamStats.avgClutch} 
                    subtext="Target: >750"
                    icon={Target}
                    colorClass="text-emerald-600 bg-emerald-600"
                  />
                  <StatCard 
                    label="Alignment Score" 
                    value={`${teamStats.avgFit}%`} 
                    subtext="Culture Fit Avg"
                    icon={Activity}
                    colorClass="text-purple-600 bg-purple-600"
                  />
                  <StatCard 
                    label="Elite Tier" 
                    value={teamStats.eliteCount} 
                    subtext="Clutch Factor > 800"
                    icon={Trophy}
                    colorClass="text-amber-500 bg-amber-500"
                  />
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden">
                  <button 
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 shadow-sm"
                  >
                      <span className="flex items-center gap-2"><Filter size={16} /> Filters</span>
                      <ChevronDown size={16} className={`transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                  </button>
              </div>

              {/* Sidebar Filters */}
              <aside className={`w-full lg:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Filters</h2>
                    <button 
                      onClick={() => { setSelectedPosition('All'); setSelectedLevel('All'); setSelectedGradYear('All'); }}
                      className="text-[11px] text-blue-600 font-semibold uppercase tracking-wide hover:underline"
                    >
                      Reset
                    </button>
                  </div>

                  <FilterSection 
                    title="Position" 
                    options={positions} 
                    selected={selectedPosition} 
                    onSelect={setSelectedPosition} 
                  />

                  <FilterSection 
                    title="Class" 
                    options={levels} 
                    selected={selectedLevel} 
                    onSelect={(val) => {
                        setSelectedLevel(val);
                    }} 
                  />

                  <FilterSection 
                    title="Graduation Year" 
                    options={gradYears} 
                    selected={selectedGradYear} 
                    onSelect={setSelectedGradYear} 
                  />

                  {/* Alignment Score Rubric Button */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                      <button 
                        onClick={() => setIsRubricOpen(true)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors uppercase tracking-wide"
                      >
                         <Activity size={14} className="text-gray-400" />
                         Alignment Score Rubric
                      </button>
                  </div>

                   <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                     <p className="text-xs text-gray-500 leading-relaxed italic">
                        Filters apply to the table view only. Aggregate stats above reflect the entire active roster.
                     </p>
                  </div>
                </div>
              </aside>

              {/* Main Table Content */}
              <div className="flex-grow overflow-hidden">
                <ParticipantTable 
                  view={currentView} 
                  players={currentRoster} 
                  setPlayers={handleSetCurrentRoster} 
                  externalPositionFilter={selectedPosition}
                  externalLevelFilter={selectedLevel === 'Redshirt' ? 'Redshirt Fr' : selectedLevel} 
                  externalGradYearFilter={selectedGradYear}
                />
              </div>
            </div>
          </>
        );
    }
  };

  // NEW: Handle Landing Page Organization Entry with optional direct view link
  const handleLandingPageEnter = (orgName: string, initialView?: ViewType) => {
    setCustomOrgName(orgName);
    // Update profile automatically to match branding
    setUserProfile(prev => ({
        ...prev,
        orgName: orgName,
        organization: orgName
    }));
    setDemoStarted(true);
    if (initialView) {
        setCurrentView(initialView);
    }
  };

  if (!demoStarted) {
    return <LandingPage onEnter={handleLandingPageEnter} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Walkthrough Demo Overlay */}
      {showWalkthrough && (
        <Walkthrough onComplete={() => setShowWalkthrough(false)} />
      )}

      <Header 
        currentView={currentView} 
        onViewChange={handleViewChange} 
        onStartWalkthrough={() => setShowWalkthrough(true)}
        user={userProfile}
        teams={dashboardTeams}
        onSelectTeam={handleSelectTeam}
        customOrgName={customOrgName}
        onExit={handleExitDemo}
      />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-[1600px]">
        {renderContent()}
      </main>

       {isRubricOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
            <div 
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
                onClick={() => setIsRubricOpen(false)}
            />
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                 <div className="sticky top-0 right-0 z-10 flex justify-end p-4 bg-white/0 pointer-events-none">
                    <button 
                        onClick={() => setIsRubricOpen(false)}
                        className="pointer-events-auto p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-gray-900 transition-colors border border-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-1 pt-0 -mt-10">
                    <FitScoreRubric />
                </div>
            </div>
        </div>
      )}

      <footer className="py-8 flex flex-col items-center border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2 text-[11px] text-gray-400 tracking-widest uppercase font-bold">
          <span>{customOrgName}</span>
          <span className="text-gray-300">|</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
