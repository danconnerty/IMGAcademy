import React, { useState, useMemo, useTransition, lazy, Suspense } from 'react';
import { X, Activity, Users, Target, ArrowLeft, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';
import LandingPage from './components/LandingPage';

// Lazy-load everything that only renders after the user enters the demo, so the
// landing page (the first paint on mobile) doesn't pay for the whole app bundle.
// Each import factory is named so we can both lazy() it and preload() it.
const loadRagChat = () => import('./components/RagChat');
const loadHeader = () => import('./components/Header');
const loadParticipantTable = () => import('./components/ParticipantTable');
const loadCoachesNterpret = () => import('./components/CoachesNterpret');
const loadMyProfile = () => import('./components/MyProfile');
const loadFitScoreRubric = () => import('./components/FitScoreRubric');
const loadClutchFactorGuide = () => import('./components/ClutchFactorGuide');
const loadRecruitingView = () => import('./components/RecruitingView');
const loadWalkthrough = () => import('./components/Walkthrough');
const loadMasterDashboard = () => import('./components/MasterDashboard');
const loadMethodologyView = () => import('./components/MethodologyView');
const loadRosterAlignmentView = () => import('./components/RosterAlignmentView');
const loadNTerpretProfilesView = () => import('./components/NTerpretProfilesView');
const loadDevelopmentPlanView = () => import('./components/DevelopmentPlanView');

const RagChat = lazy(loadRagChat);
const Header = lazy(loadHeader);
const ParticipantTable = lazy(loadParticipantTable);
const CoachesNterpret = lazy(loadCoachesNterpret);
const MyProfile = lazy(loadMyProfile);
const FitScoreRubric = lazy(loadFitScoreRubric);
const ClutchFactorGuide = lazy(loadClutchFactorGuide);
const RecruitingView = lazy(loadRecruitingView);
const Walkthrough = lazy(loadWalkthrough);
const MasterDashboard = lazy(loadMasterDashboard);
const MethodologyView = lazy(loadMethodologyView);
const RosterAlignmentView = lazy(loadRosterAlignmentView);
const NTerpretProfilesView = lazy(loadNTerpretProfilesView);
const DevelopmentPlanView = lazy(loadDevelopmentPlanView);

// Warm every dashboard chunk so view-to-view navigation is from cache.
// Called from LandingPage on mount and immediately on enter.
export const preloadDashboard = () => {
  loadHeader(); loadParticipantTable(); loadCoachesNterpret(); loadMyProfile();
  loadFitScoreRubric(); loadClutchFactorGuide(); loadRecruitingView(); loadWalkthrough();
  loadRagChat(); loadMasterDashboard(); loadMethodologyView(); loadRosterAlignmentView();
  loadNTerpretProfilesView(); loadDevelopmentPlanView();
};

// Near-invisible fallback. With preload + useTransition on view changes this
// almost never renders in practice - and when it does, the dashboard chrome
// stays mounted around it (Suspense is scoped inside main, not the whole tree).
const ViewFallback: React.FC = () => (
  <div className="fixed top-16 left-0 right-0 h-0.5 bg-ink/50 animate-pulse z-[60]" />
);
import { ViewType, Player, UserProfile, HomeTab } from './types';
import { MOCK_TEAMS } from './mockTeams';

// STRICT SEPARATION: Import separate data sources
import { ALL_ROSTERS, SPORT_CONFIG } from './mockRoster';
import { RECRUIT_PLAYERS } from './mockRecruits';
import { isRecruitVisibleOutsideRecruitingPage } from './utils/recruiting';

const App: React.FC = () => {
  const [demoStarted, setDemoStarted] = useState(false);
  // NEW: State for the custom organization name entered on landing page
  const [customOrgName, setCustomOrgName] = useState<string>('IMG ACADEMY');
  
  const [currentView, setCurrentView] = useState<ViewType>('master');
  // Walkthrough set to false initially - requires button click to start
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  
  // State for all rosters (mapped by team ID)
  const [allRosters, setAllRosters] = useState<Record<string, Player[]>>(ALL_ROSTERS);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('football');
  const [hasSelectedTeam, setHasSelectedTeam] = useState(false);
  
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
  const [isClutchGuideOpen, setIsClutchGuideOpen] = useState(false);
  
  // Filter States
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedGradYear, setSelectedGradYear] = useState<string>('All');
  const [homeTab, setHomeTab] = useState<HomeTab>('roster');
  const [alignmentFocusPlayerId, setAlignmentFocusPlayerId] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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

  const displayedPlayers = useMemo(() => {
    if (homeTab === 'roster') {
      return currentRoster;
    }

    return recruitData.filter(
      p => p.sport === selectedTeamId && isRecruitVisibleOutsideRecruitingPage(p)
    );
  }, [homeTab, currentRoster, recruitData, selectedTeamId]);

  const displayedStats = useMemo(() => {
    const active = displayedPlayers.filter(p => p.status === 'active');
    const totalClutch = active.reduce((sum, p) => sum + p.clutchFactor, 0);
    const avgClutch = Math.round(totalClutch / (active.length || 1));

    const fitScores = active.map(p => p.fitScore).filter((s): s is number => s !== undefined);
    const totalFit = fitScores.reduce((sum, s) => sum + s, 0);
    const avgFit = Math.round(totalFit / (fitScores.length || 1));

    const byPosition = active.reduce<Record<string, { totalClutch: number; totalFit: number; count: number }>>((acc, player) => {
      const fit = player.fitScore ?? 0;
      const current = acc[player.position] ?? { totalClutch: 0, totalFit: 0, count: 0 };
      acc[player.position] = {
        totalClutch: current.totalClutch + player.clutchFactor,
        totalFit: current.totalFit + fit,
        count: current.count + 1
      };
      return acc;
    }, {});

    const rankedUnits = Object.entries(byPosition)
      .map(([unit, metrics]) => ({
        unit,
        avgClutch: Math.round(metrics.totalClutch / (metrics.count || 1)),
        avgFit: Math.round(metrics.totalFit / (metrics.count || 1))
      }))
      .sort((a, b) => (b.avgClutch + b.avgFit) - (a.avgClutch + a.avgFit));

    const topUnit = rankedUnits[0];
    const bottomUnit = rankedUnits[rankedUnits.length - 1];

    return {
      count: active.length,
      avgClutch,
      avgFit,
      topUnit,
      bottomUnit
    };
  }, [displayedPlayers]);

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

  const [, startViewTransition] = useTransition();

  // Handle view change. useTransition keeps the previous view rendered while
  // the next one is being prepared, so navigation feels instant and Suspense
  // doesn't unmount the screen even if a chunk hasn't finished loading.
  const handleViewChange = (view: ViewType) => {
    startViewTransition(() => {
      setCurrentView(view);
      if (view === 'master') {
        setHasSelectedTeam(false);
      }
    });
  };

  const handleSelectTeam = (id: string) => {
      startViewTransition(() => {
        setSelectedTeamId(id);
        setHasSelectedTeam(true);
        setCurrentView('home');
        setSelectedPosition('All');
        setSelectedLevel('All');
        setSelectedGradYear('All');
        setHomeTab('roster');
        setAlignmentFocusPlayerId(null);
      });
  };

  const handleHomeTabChange = (tab: HomeTab) => {
    startViewTransition(() => {
      setCurrentView('home');
      setHomeTab(tab);
      setIsMobileFiltersOpen(false);
      if (tab !== 'alignment') {
        setAlignmentFocusPlayerId(null);
      }
    });
  };

  // Handle Exit Demo
  const handleExitDemo = () => {
    setDemoStarted(false);
    setCustomOrgName('IMG ACADEMY');
    setCurrentView('master');
    setHasSelectedTeam(false);
    setIsMobileFiltersOpen(false);
  };

  const selectedTeamName = MOCK_TEAMS.find(t => t.id === selectedTeamId)?.name || 'TEAM';

  const FilterSection = ({ title, options, selected, onSelect }: { title: string, options: string[], selected: string, onSelect: (val: string) => void }) => (
    <div className="mb-8">
      <h3 className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.25em] mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`px-3 py-2 rounded-card font-mono text-[11px] tracking-[0.08em] uppercase transition-all border ${
              selected === opt
                ? 'bg-ink text-white border-ink'
                : 'bg-white text-body border-line-strong hover:border-ink'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const StatCard = ({ label, value, subtext, icon: Icon }: { label: string, value: string | number, subtext: string, icon: any, colorClass?: string }) => (
    <div className="nt-card nt-card-hover p-4 sm:p-5 flex-1 min-w-[200px]">
        <div className="flex justify-between items-start mb-4">
            <Icon size={20} strokeWidth={1.8} className="text-gray-soft" />
        </div>
        <div>
            <h4 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tightest tabular-nums mb-2 break-words">{value}</h4>
            <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-1">{label}</p>
            <p className="font-mono text-[10px] text-gray-soft uppercase tracking-[0.12em]">{subtext}</p>
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
              selectedTeamId={hasSelectedTeam ? selectedTeamId : null}
              hasSelectedTeam={hasSelectedTeam}
              onOpenAlignmentForPlayer={(teamId, playerId) => {
                setSelectedTeamId(teamId);
                setHasSelectedTeam(true);
                setAlignmentFocusPlayerId(playerId);
                setCurrentView('home');
                setHomeTab('alignment');
                setSelectedPosition('All');
                setSelectedLevel('All');
                setSelectedGradYear('All');
              }}
           />
        );
      case 'nterpret':
        return <CoachesNterpret />;
      case 'nterpret-profile':
        return (
          <NTerpretProfilesView
            teamName={selectedTeamName}
            rosterPlayers={currentRoster}
            recruitPlayers={recruitData.filter(p => p.sport === selectedTeamId && isRecruitVisibleOutsideRecruitingPage(p))}
            onOpenAlignment={() => {
              setCurrentView('home');
              setHomeTab('alignment');
            }}
          />
        );
      case 'development-plan':
        return (
          <DevelopmentPlanView
            teamName={selectedTeamName}
            players={currentRoster}
            positions={currentSportConfig.positions}
          />
        );
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
                  onClick={() => { setCurrentView('master'); setHasSelectedTeam(false); }}
                  className="flex items-center gap-2 font-mono text-[11px] font-medium text-gray-brand hover:text-ink uppercase tracking-[0.16em] mb-4 transition-colors"
                >
                  <ArrowLeft size={14} strokeWidth={1.8} />
                  Back to Dashboard
                </button>
                <h1 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest capitalize">
                    {selectedTeamName.toLowerCase()}
                </h1>
                <p className="text-body text-sm mt-2">2025 Pre-Season Roster Assessment</p>
              </div>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-4 border-b border-line pb-4">
                <button
                  onClick={() => setHomeTab('roster')}
                  className={`px-4 sm:px-5 py-3 border font-mono text-[11px] uppercase tracking-[0.16em] transition-colors rounded-card ${homeTab === 'roster' ? 'bg-white border-ink text-ink' : 'bg-transparent border-transparent text-gray-brand hover:text-ink'}`}
                >
                  Current Roster
                </button>
                <button
                  onClick={() => setHomeTab('recruits')}
                  className={`px-4 sm:px-5 py-3 border font-mono text-[11px] uppercase tracking-[0.16em] transition-colors rounded-card ${homeTab === 'recruits' ? 'bg-white border-ink text-ink' : 'bg-transparent border-transparent text-gray-brand hover:text-ink'}`}
                >
                  Recruits
                </button>
              </div>

              {/* TEAM PULSE / KPI SECTION */}
              {homeTab === 'roster' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard 
                      label="Team Clutch" 
                      value={displayedStats.avgClutch}
                      subtext="Roster Average"
                      icon={Users}
                      colorClass="text-blue-600 bg-blue-600"
                    />
                    <StatCard 
                      label="Team Alignment" 
                      value={`${displayedStats.avgFit}%`} 
                      subtext="Roster Average"
                      icon={Target}
                      colorClass="text-emerald-600 bg-emerald-600"
                    />
                    <StatCard 
                      label="Top Unit" 
                      value={displayedStats.topUnit?.unit || '-'}
                      subtext={`Avg Clutch: ${displayedStats.topUnit?.avgClutch ?? '-'}   Avg Fit: ${displayedStats.topUnit ? `${displayedStats.topUnit.avgFit}%` : '-'}`}
                      icon={ShieldCheck}
                      colorClass="text-purple-600 bg-purple-600"
                    />
                    <StatCard 
                      label="Bottom Unit" 
                      value={displayedStats.bottomUnit?.unit || '-'}
                      subtext={`Avg Clutch: ${displayedStats.bottomUnit?.avgClutch ?? '-'}   Avg Fit: ${displayedStats.bottomUnit ? `${displayedStats.bottomUnit.avgFit}%` : '-'}`}
                      icon={ShieldAlert}
                      colorClass="text-rose-500 bg-rose-500"
                    />
                </div>
              )}
            </div>
            
            {homeTab === 'alignment' ? (
              <RosterAlignmentView
                rosterPlayers={currentRoster}
                recruitPlayers={recruitData.filter(p => p.sport === selectedTeamId && isRecruitVisibleOutsideRecruitingPage(p))}
                teamName={selectedTeamName}
                positions={currentSportConfig.positions}
                focusedPlayerId={alignmentFocusPlayerId}
                onOpenRubric={() => setIsRubricOpen(true)}
              />
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                  <div className="nt-card p-4 sm:p-6 lg:sticky lg:top-24">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-mono text-[11px] font-medium text-ink uppercase tracking-[0.16em]">Filters</h2>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => { setSelectedPosition('All'); setSelectedLevel('All'); setSelectedGradYear('All'); }}
                          className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.12em] hover:text-ink transition-colors"
                        >
                          Reset
                        </button>
                        <button
                          onClick={() => setIsMobileFiltersOpen(prev => !prev)}
                          className="lg:hidden font-mono text-[10px] text-gray-brand uppercase tracking-[0.12em] border border-line-strong rounded-card px-2 py-1"
                        >
                          {isMobileFiltersOpen ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>

                    <div className={`${isMobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
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

                      {/* Guides */}
                      <div className="mt-6 pt-6 border-t border-line space-y-3">
                          <button
                            onClick={() => setIsClutchGuideOpen(true)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-card hover:bg-chip transition-colors text-left"
                          >
                            <span className="w-8 h-8 rounded-full border border-line-strong bg-white flex items-center justify-center">
                              <Zap size={14} strokeWidth={1.8} className="text-ink" />
                            </span>
                            <div>
                              <p className="font-mono text-[11px] font-medium text-ink uppercase tracking-[0.12em]">Clutch Factor</p>
                              <p className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.12em]">Guide</p>
                            </div>
                          </button>

                          <button
                            onClick={() => setIsRubricOpen(true)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-card hover:bg-chip transition-colors text-left"
                          >
                            <span className="w-8 h-8 rounded-full border border-line-strong bg-white flex items-center justify-center">
                              <Activity size={14} strokeWidth={1.8} className="text-ink" />
                            </span>
                            <div>
                              <p className="font-mono text-[11px] font-medium text-ink uppercase tracking-[0.12em]">Alignment Score</p>
                              <p className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.12em]">Rubric</p>
                            </div>
                          </button>
                      </div>

                      <div className="mt-8 pt-6 border-t border-line space-y-4">
                        <p className="text-[11px] text-gray-brand leading-relaxed">
                            Filters apply to the table view only. Aggregate stats above reflect the entire active roster.
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Main Table Content */}
                <div className="flex-grow overflow-visible lg:overflow-hidden">
                  <ParticipantTable 
                    view={currentView} 
                    players={displayedPlayers}
                    setPlayers={homeTab === 'roster' ? handleSetCurrentRoster : setRecruitData}
                    externalPositionFilter={selectedPosition}
                    externalLevelFilter={selectedLevel === 'Redshirt' ? 'Redshirt Fr' : selectedLevel} 
                    externalGradYearFilter={selectedGradYear}
                  />
                </div>
              </div>
            )}
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
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <Suspense fallback={null}><RagChat /></Suspense>

      {/* Walkthrough Demo Overlay */}
      {showWalkthrough && (
        <Suspense fallback={null}>
          <Walkthrough onComplete={() => setShowWalkthrough(false)} />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <Header
          currentView={currentView}
          onViewChange={handleViewChange}
          onStartWalkthrough={() => setShowWalkthrough(true)}
          user={userProfile}
          teams={dashboardTeams}
          onSelectTeam={handleSelectTeam}
          homeTab={homeTab}
          onHomeTabChange={handleHomeTabChange}
          canOpenRosterInsights={hasSelectedTeam}
          customOrgName={customOrgName}
          onExit={handleExitDemo}
        />
      </Suspense>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-[1600px]">
        <Suspense fallback={<ViewFallback />}>
          {renderContent()}
        </Suspense>
      </main>

       {isRubricOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
            <div
                className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
                onClick={() => setIsRubricOpen(false)}
            />
            <div className="relative w-full max-w-4xl bg-white rounded-card border border-line-strong shadow-lift overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                 <div className="sticky top-0 right-0 z-10 flex justify-end p-4 bg-white/0 pointer-events-none">
                    <button
                        onClick={() => setIsRubricOpen(false)}
                        className="pointer-events-auto p-2 bg-white rounded-full text-gray-brand hover:text-ink transition-colors border border-line-strong"
                    >
                        <X size={20} strokeWidth={1.8} />
                    </button>
                </div>
                <div className="p-1 pt-0 -mt-10">
                    <FitScoreRubric />
                </div>
            </div>
        </div>
      )}



      {isClutchGuideOpen && (
        <ClutchFactorGuide onClose={() => setIsClutchGuideOpen(false)} />
      )}

            <footer className="py-10 flex flex-col items-center gap-3 border-t border-line bg-white">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-gray-brand tracking-[0.25em] uppercase">In partnership with</span>
          <img src="/IMG.png" alt="IMG Academy" className="h-8 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-gray-brand tracking-[0.16em] uppercase">
          <span>{customOrgName}</span>
          <span className="text-line-strong">·</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
