import React, { useMemo, useState } from 'react';
import { Check, ChevronRight, CircleHelp, Mic, X, BookOpen, GraduationCap, Rocket } from 'lucide-react';
import { Player } from '../types';
import { getRecruitStatusSignifier } from '../utils/recruiting';
import { COMMUNICATION_STYLES, LEARNING_STYLES, MOTIVATIONAL_ANCHORS, getPlayerProfile } from '../utils/playerInsights';

type ProfileTab = 'communication' | 'learning' | 'motivation';
type DataTab = 'roster' | 'recruits';

interface Props {
  teamName: string;
  rosterPlayers: Player[];
  recruitPlayers: Player[];
  onOpenAlignment: () => void;
}


const getSignifier = (player: Player) => {
  const fitScore = player.fitScore ?? 0;
  if (fitScore >= 62.5 && player.clutchFactor >= 750) {
    return { label: 'Top Profile', className: 'bg-ink text-white border-ink' };
  }
  if (fitScore < 62.5 && player.clutchFactor < 750) {
    return { label: 'At-Risk', className: 'bg-white text-gray-brand border-line-strong' };
  }
  return { label: 'Conditional', className: 'bg-chip text-body border-line-strong' };
};



const renderStackedSlashLabel = (label: string) => {
  if (!label.includes('/')) {
    return label;
  }

  const [first, ...rest] = label.split('/');
  const second = rest.join('/');

  return (
    <>
      {first}/
      <br />
      {second}
    </>
  );
};


const Chip = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void; }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-pill border text-xs font-medium leading-tight transition-colors ${selected ? 'bg-ink text-white border-ink' : 'bg-white text-gray-brand border-line-strong hover:border-ink hover:text-ink'}`}
  >
    {label}
  </button>
);

const NTerpretProfilesView: React.FC<Props> = ({ teamName, rosterPlayers, recruitPlayers, onOpenAlignment }) => {
  const [activeDataTab, setActiveDataTab] = useState<DataTab>('roster');
  const [search, setSearch] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [guideTab, setGuideTab] = useState<ProfileTab>('communication');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [communicationFilter, setCommunicationFilter] = useState('All');
  const [learningFilter, setLearningFilter] = useState('All');
  const [motivationFilter, setMotivationFilter] = useState('All');

  const players = activeDataTab === 'roster' ? rosterPlayers : recruitPlayers;

  const filteredPlayers = useMemo(() => players.filter((player) => {
    const profile = getPlayerProfile(player);
    const matchesSearch = player.name.toLowerCase().includes(search.toLowerCase());
    const matchesCommunication = communicationFilter === 'All' || profile.communication.name === communicationFilter;
    const matchesLearning = learningFilter === 'All' || profile.learning.name === learningFilter;
    const matchesMotivation = motivationFilter === 'All' || profile.motivation.name === motivationFilter;
    return matchesSearch && matchesCommunication && matchesLearning && matchesMotivation;
  }), [players, search, communicationFilter, learningFilter, motivationFilter]);

  const selectedPlayer = useMemo(() => {
    const fallback = filteredPlayers[0] ?? players[0] ?? null;
    return filteredPlayers.find((player) => player.id === selectedPlayerId) ?? fallback;
  }, [filteredPlayers, players, selectedPlayerId]);

  const selectedProfile = selectedPlayer ? getPlayerProfile(selectedPlayer) : null;
  const selectedSignifier = selectedPlayer ? getSignifier(selectedPlayer) : null;
  const selectedRecruitStatus = selectedPlayer ? getRecruitStatusSignifier(selectedPlayer) : null;



  return (
    <div className="space-y-5">
      <div className="grid grid-cols-12 gap-4">
        <aside className="col-span-12 xl:col-span-2 nt-card p-4 xl:sticky xl:top-24 h-fit">
          <div className="flex items-center justify-between mb-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-gray-brand">Filters</p>
            <button
              onClick={() => {
                setCommunicationFilter('All');
                setLearningFilter('All');
                setMotivationFilter('All');
              }}
              className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-gray-brand hover:text-ink transition-colors"
            >
              Reset
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-gray-brand mb-3">Communication style</p>
              <div className="flex gap-2 flex-wrap">
                <Chip label="All" selected={communicationFilter === 'All'} onClick={() => setCommunicationFilter('All')} />
                {COMMUNICATION_STYLES.map((style) => <Chip key={style.name} label={style.name} selected={communicationFilter === style.name} onClick={() => setCommunicationFilter(style.name)} />)}
              </div>
            </div>

            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-gray-brand mb-3">Learning style</p>
              <div className="flex gap-2 flex-wrap">
                <Chip label="All" selected={learningFilter === 'All'} onClick={() => setLearningFilter('All')} />
                {LEARNING_STYLES.map((style) => <Chip key={style.name} label={style.name} selected={learningFilter === style.name} onClick={() => setLearningFilter(style.name)} />)}
              </div>
            </div>

            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-gray-brand mb-3">Motivational anchor</p>
              <div className="flex gap-2 flex-wrap">
                <Chip label="All" selected={motivationFilter === 'All'} onClick={() => setMotivationFilter('All')} />
                {MOTIVATIONAL_ANCHORS.map((style) => <Chip key={style.name} label={style.name} selected={motivationFilter === style.name} onClick={() => setMotivationFilter(style.name)} />)}
              </div>
            </div>

            <button onClick={() => setIsGuideOpen(true)} className="w-full flex items-center gap-3 px-2 py-2 rounded-card hover:bg-chip text-left border-t border-line pt-4 transition-colors">
              <span className="h-8 w-8 rounded-full border border-line-strong flex items-center justify-center"><BookOpen size={14} strokeWidth={1.8} className="text-gray-soft" /></span>
              <div>
                <p className="font-mono text-[11px] font-medium text-ink uppercase tracking-[0.16em]">NTerpret</p>
                <p className="font-mono text-[11px] text-gray-brand uppercase tracking-[0.16em]">Guide</p>
              </div>
            </button>
          </div>
        </aside>

        <section className="col-span-12 xl:col-span-10 nt-card overflow-hidden">
          <div className="p-6 border-b border-line">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-gray-brand mb-2">Athlete profiles</p>
            <h1 className="text-2xl md:text-[2rem] font-semibold text-ink tracking-tightest capitalize leading-tight break-words">{teamName}</h1>
            <p className="text-gray-brand mt-1 text-sm">2026 pre-season athlete profile analysis</p>
          </div>

          <div className="px-6 pt-3 border-b border-line flex gap-6">
            <button onClick={() => setActiveDataTab('roster')} className={`px-1 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] border-b-2 -mb-px transition-colors ${activeDataTab === 'roster' ? 'border-ink text-ink' : 'border-transparent text-gray-brand hover:text-ink'}`}>Current roster</button>
            <button onClick={() => setActiveDataTab('recruits')} className={`px-1 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] border-b-2 -mb-px transition-colors ${activeDataTab === 'recruits' ? 'border-ink text-ink' : 'border-transparent text-gray-brand hover:text-ink'}`}>Recruits</button>
          </div>

          <div className="grid grid-cols-12 min-h-[70vh]">
            <div className="col-span-12 lg:col-span-4 border-r border-line p-4">
              <h2 className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em]">Athletes ({filteredPlayers.length})</h2>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search athletes..." className="nt-input mt-2" />

              <div className="mt-4 space-y-2 max-h-[58vh] overflow-auto pr-1">
                {filteredPlayers.length === 0 && (
                  <div className="rounded-card border border-dashed border-line-strong p-6 text-center text-sm text-gray-brand">No athletes match the current filters.</div>
                )}
                {filteredPlayers.map((player) => {
                  const signifier = getSignifier(player);
                  const recruitStatus = getRecruitStatusSignifier(player);
                  return (
                    <button
                      key={player.id}
                      onClick={() => setSelectedPlayerId(player.id)}
                      className={`w-full text-left p-3 border rounded-card transition-colors ${selectedPlayer?.id === player.id ? 'border-ink bg-chip' : 'border-transparent bg-white hover:bg-chip'}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="h-8 w-8 rounded-full bg-chip text-gray-brand text-xs font-semibold flex items-center justify-center">{player.name.slice(0, 1)}</span>
                          <div>
                            <p className="text-sm font-semibold text-ink">{player.name}</p>
                            <p className="text-xs text-gray-brand">{player.position} · {player.graduationYear}</p>
                          </div>
                        </div>
                        <ChevronRight size={15} strokeWidth={1.8} className="text-gray-soft" />
                      </div>
                      <div className="mt-2 flex gap-2 flex-wrap pl-11">
                        <span className={`px-2 py-0.5 rounded-pill text-[10px] border font-mono uppercase tracking-[0.12em] ${signifier.className}`}>{signifier.label}</span>
                        {recruitStatus && <span className={`px-2 py-0.5 rounded-pill text-[10px] border font-semibold ${recruitStatus.className}`}>{recruitStatus.label}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8">
              {!selectedPlayer || !selectedProfile ? (
                <p className="text-sm text-gray-brand p-5">Select a player to view NTerpret profile.</p>
              ) : (
                <>
                  <div className="p-6 border-b border-line">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-2xl md:text-[1.75rem] font-semibold text-ink tracking-tightest leading-tight break-words">{selectedPlayer.name}</h3>
                        <p className="text-base text-gray-brand mt-1 leading-relaxed">{selectedPlayer.position} · {selectedPlayer.level} · {selectedPlayer.graduationYear}</p>
                        <p className="text-body mt-2">Interpretive profile used for coaching alignment decisions.</p>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end items-center">
                        {selectedSignifier && <span className={`px-2 py-1 rounded-pill text-xs font-mono uppercase tracking-[0.12em] border ${selectedSignifier.className}`}>{selectedSignifier.label}</span>}
                        {selectedRecruitStatus && <span className={`px-2 py-1 rounded-pill text-xs font-semibold border ${selectedRecruitStatus.className}`}>{selectedRecruitStatus.label}</span>}
                        <button onClick={onOpenAlignment} className="nt-btn-primary !py-1.5 !px-4 !text-xs">NTerpret</button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="nt-card p-5 text-center">
                      <Mic size={18} strokeWidth={1.8} className="mx-auto text-gray-soft" />
                      <p className="font-mono text-[11px] mt-4 uppercase tracking-[0.16em] text-gray-brand font-medium">Communication style</p>
                      <p className="text-xl md:text-2xl mt-1 font-semibold text-ink tracking-tightest leading-tight break-words">{renderStackedSlashLabel(selectedProfile.communication.name)}</p>
                      <p className="text-sm text-body mt-4 leading-relaxed">{selectedProfile.communication.description}</p>
                    </div>
                    <div className="nt-card p-5 text-center">
                      <GraduationCap size={18} strokeWidth={1.8} className="mx-auto text-gray-soft" />
                      <p className="font-mono text-[11px] mt-4 uppercase tracking-[0.16em] text-gray-brand font-medium">Learning style</p>
                      <p className="text-xl md:text-2xl mt-1 font-semibold text-ink tracking-tightest leading-tight break-words">{renderStackedSlashLabel(selectedProfile.learning.name)}</p>
                      <p className="text-sm text-body mt-4 leading-relaxed">{selectedProfile.learning.description}</p>
                    </div>
                    <div className="nt-card p-5 text-center">
                      <Rocket size={18} strokeWidth={1.8} className="mx-auto text-gray-soft" />
                      <p className="font-mono text-[11px] mt-4 uppercase tracking-[0.16em] text-gray-brand font-medium">Motivation anchor</p>
                      <p className="text-xl md:text-2xl mt-1 font-semibold text-ink tracking-tightest leading-tight break-words">{renderStackedSlashLabel(selectedProfile.motivation.name)}</p>
                      <p className="text-sm text-body mt-4 leading-relaxed">{selectedProfile.motivation.description}</p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 border-t border-line">
                    <h4 className="text-xl md:text-2xl font-semibold text-ink tracking-tightest mt-5">Coaching considerations</h4>
                    <ul className="space-y-2 text-body list-disc ml-5 mt-3 text-sm leading-relaxed">
                      <li>{selectedProfile.communication.strategy}</li>
                      <li>{selectedProfile.learning.strategy}</li>
                      <li>{selectedProfile.motivation.strategy}</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      {isGuideOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsGuideOpen(false)} aria-label="Close style guide" />
          <div className="relative bg-white rounded-card border border-line-strong shadow-lift max-w-7xl w-full max-h-[92vh] overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-line flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tightest text-ink">NTerpret style guide</h3>
              <button onClick={() => setIsGuideOpen(false)} className="text-gray-brand hover:text-ink transition-colors"><X size={28} strokeWidth={1.8} /></button>
            </div>

            <div className="px-4 sm:px-6 pt-3 border-b border-line flex gap-6 overflow-x-auto">
              <button onClick={() => setGuideTab('communication')} className={`px-1 py-2.5 text-sm sm:text-base font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${guideTab === 'communication' ? 'border-ink text-ink' : 'border-transparent text-gray-brand hover:text-ink'}`}>Communication styles</button>
              <button onClick={() => setGuideTab('learning')} className={`px-1 py-2.5 text-sm sm:text-base font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${guideTab === 'learning' ? 'border-ink text-ink' : 'border-transparent text-gray-brand hover:text-ink'}`}>Learning styles</button>
              <button onClick={() => setGuideTab('motivation')} className={`px-1 py-2.5 text-sm sm:text-base font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${guideTab === 'motivation' ? 'border-ink text-ink' : 'border-transparent text-gray-brand hover:text-ink'}`}>Motivational anchors</button>
            </div>

            <div className="p-4 sm:p-6 max-h-[70vh] overflow-auto">
              <div className="mb-6 border border-line-strong bg-chip rounded-card p-4 flex items-start gap-3 text-body">
                <CircleHelp size={20} strokeWidth={1.8} className="text-gray-soft mt-0.5 shrink-0" />
                <p>{guideTab === 'communication' ? 'How your athletes prefer to give and receive information. Adapting your communication approach improves trust, clarity, and buy-in.' : guideTab === 'learning' ? 'How your athletes absorb and retain new information most effectively. Matching instruction to learning style accelerates skill development.' : 'What drives your athletes to compete and commit. Understanding motivational anchors helps you sustain engagement and peak performance.'}</p>
              </div>

              <div className="hidden md:grid md:grid-cols-[minmax(180px,1fr)_2fr_2fr] font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-gray-brand border-b border-line pb-3">
                <p>Style</p><p>Description</p><p>Strategy</p>
              </div>

              {(guideTab === 'communication' ? COMMUNICATION_STYLES : guideTab === 'learning' ? LEARNING_STYLES : MOTIVATIONAL_ANCHORS).map((style) => (
                <div key={style.name} className="grid grid-cols-1 md:grid-cols-[minmax(180px,1fr)_2fr_2fr] gap-3 md:gap-4 py-5 border-b border-line">
                  <p><span className="bg-chip text-ink border border-line-strong px-3 py-1 rounded-card text-sm font-semibold break-words">{style.name}</span></p>
                  <p className="text-body">{style.description}</p>
                  <p className="text-body leading-relaxed"><Check size={16} strokeWidth={1.8} className="inline mr-2 text-ink" />{style.strategy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NTerpretProfilesView;
