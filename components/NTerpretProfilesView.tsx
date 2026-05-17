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
    return { label: 'Top Profile', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  }
  if (fitScore < 62.5 && player.clutchFactor < 750) {
    return { label: 'At-Risk', className: 'bg-rose-100 text-rose-700 border-rose-200' };
  }
  return { label: 'Conditional', className: 'bg-amber-100 text-amber-700 border-amber-200' };
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
    className={`px-3 py-1.5 rounded-full border text-xs font-semibold leading-tight ${selected ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
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
        <aside className="col-span-12 xl:col-span-2 bg-white border border-gray-200 rounded-xl p-4 xl:sticky xl:top-24 h-fit">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">Filters</p>
            <button
              onClick={() => {
                setCommunicationFilter('All');
                setLearningFilter('All');
                setMotivationFilter('All');
              }}
              className="text-[11px] font-semibold uppercase tracking-wide text-blue-600"
            >
              Reset
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 mb-3">Communication Style</p>
              <div className="flex gap-2 flex-wrap">
                <Chip label="All" selected={communicationFilter === 'All'} onClick={() => setCommunicationFilter('All')} />
                {COMMUNICATION_STYLES.map((style) => <Chip key={style.name} label={style.name} selected={communicationFilter === style.name} onClick={() => setCommunicationFilter(style.name)} />)}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 mb-3">Learning Style</p>
              <div className="flex gap-2 flex-wrap">
                <Chip label="All" selected={learningFilter === 'All'} onClick={() => setLearningFilter('All')} />
                {LEARNING_STYLES.map((style) => <Chip key={style.name} label={style.name} selected={learningFilter === style.name} onClick={() => setLearningFilter(style.name)} />)}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 mb-3">Motivational Anchor</p>
              <div className="flex gap-2 flex-wrap">
                <Chip label="All" selected={motivationFilter === 'All'} onClick={() => setMotivationFilter('All')} />
                {MOTIVATIONAL_ANCHORS.map((style) => <Chip key={style.name} label={style.name} selected={motivationFilter === style.name} onClick={() => setMotivationFilter(style.name)} />)}
              </div>
            </div>

            <button onClick={() => setIsGuideOpen(true)} className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50 text-left border-t border-gray-100 pt-4">
              <span className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center"><BookOpen size={14} className="text-gray-500" /></span>
              <div>
                <p className="text-[11px] font-semibold text-gray-800 uppercase tracking-wide">NTerpret</p>
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">Guide</p>
              </div>
            </button>
          </div>
        </aside>

        <section className="col-span-12 xl:col-span-10 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl md:text-[2rem] font-semibold text-gray-900 capitalize leading-tight break-words">{teamName}</h1>
            <p className="text-gray-500 mt-1 text-sm">2026 Pre-Season Athlete Profile Analysis</p>
          </div>

          <div className="px-6 pt-3 border-b border-gray-200 flex gap-3">
            <button onClick={() => setActiveDataTab('roster')} className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide border ${activeDataTab === 'roster' ? 'bg-white border-gray-900 text-gray-900' : 'bg-transparent border-transparent text-gray-500'}`}>Current Roster</button>
            <button onClick={() => setActiveDataTab('recruits')} className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide border ${activeDataTab === 'recruits' ? 'bg-white border-gray-900 text-gray-900' : 'bg-transparent border-transparent text-gray-500'}`}>Recruits</button>
          </div>

          <div className="grid grid-cols-12 min-h-[70vh]">
            <div className="col-span-12 lg:col-span-4 border-r border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-[0.14em]">Athletes ({filteredPlayers.length})</h2>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search athletes..." className="mt-2 w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm" />

              <div className="mt-4 space-y-2 max-h-[58vh] overflow-auto pr-1">
                {filteredPlayers.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">No athletes match the current filters.</div>
                )}
                {filteredPlayers.map((player) => {
                  const signifier = getSignifier(player);
                  const recruitStatus = getRecruitStatusSignifier(player);
                  return (
                    <button
                      key={player.id}
                      onClick={() => setSelectedPlayerId(player.id)}
                      className={`w-full text-left p-3 border rounded-lg ${selectedPlayer?.id === player.id ? 'border-blue-300 bg-blue-50/70' : 'border-transparent bg-white hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="h-8 w-8 rounded-full bg-slate-200 text-slate-500 text-xs font-bold flex items-center justify-center">{player.name.slice(0, 1)}</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{player.name}</p>
                            <p className="text-xs text-gray-500">{player.position} • {player.graduationYear}</p>
                          </div>
                        </div>
                        <ChevronRight size={15} className="text-gray-400" />
                      </div>
                      <div className="mt-2 flex gap-2 flex-wrap pl-11">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] border font-semibold ${signifier.className}`}>{signifier.label}</span>
                        {recruitStatus && <span className={`px-2 py-0.5 rounded-full text-[10px] border font-semibold ${recruitStatus.className}`}>{recruitStatus.label}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8">
              {!selectedPlayer || !selectedProfile ? (
                <p className="text-sm text-gray-500 p-5">Select a player to view NTerpret profile.</p>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-2xl md:text-[1.75rem] font-semibold text-gray-900 leading-tight break-words">{selectedPlayer.name}</h3>
                        <p className="text-base text-gray-500 mt-1 leading-relaxed">{selectedPlayer.position} • {selectedPlayer.level} • {selectedPlayer.graduationYear}</p>
                        <p className="text-gray-500 mt-2">Interpretive profile used for coaching alignment decisions.</p>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {selectedSignifier && <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${selectedSignifier.className}`}>{selectedSignifier.label}</span>}
                        {selectedRecruitStatus && <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${selectedRecruitStatus.className}`}>{selectedRecruitStatus.label}</span>}
                        <button onClick={onOpenAlignment} className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold">NTerpret</button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-5 text-center">
                      <Mic size={18} className="mx-auto text-gray-500" />
                      <p className="text-[11px] mt-4 uppercase tracking-[0.14em] text-gray-500 font-semibold">Communication Style</p>
                      <p className="text-xl md:text-2xl mt-1 font-semibold text-gray-900 leading-tight break-words">{renderStackedSlashLabel(selectedProfile.communication.name)}</p>
                      <p className="text-sm text-gray-600 mt-4 leading-relaxed">{selectedProfile.communication.description}</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-5 text-center">
                      <GraduationCap size={18} className="mx-auto text-gray-500" />
                      <p className="text-[11px] mt-4 uppercase tracking-[0.14em] text-gray-500 font-semibold">Learning Style</p>
                      <p className="text-xl md:text-2xl mt-1 font-semibold text-gray-900 leading-tight break-words">{renderStackedSlashLabel(selectedProfile.learning.name)}</p>
                      <p className="text-sm text-gray-600 mt-4 leading-relaxed">{selectedProfile.learning.description}</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-5 text-center">
                      <Rocket size={18} className="mx-auto text-gray-500" />
                      <p className="text-[11px] mt-4 uppercase tracking-[0.14em] text-gray-500 font-semibold">Motivation Anchor</p>
                      <p className="text-xl md:text-2xl mt-1 font-semibold text-gray-900 leading-tight break-words">{renderStackedSlashLabel(selectedProfile.motivation.name)}</p>
                      <p className="text-sm text-gray-600 mt-4 leading-relaxed">{selectedProfile.motivation.description}</p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 border-t border-gray-100">
                    <h4 className="text-xl md:text-2xl font-semibold text-gray-900 mt-5">Coaching Considerations</h4>
                    <ul className="space-y-2 text-gray-700 list-disc ml-5 mt-3 text-sm leading-relaxed">
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
          <button className="absolute inset-0 bg-black/45" onClick={() => setIsGuideOpen(false)} aria-label="Close style guide" />
          <div className="relative bg-white rounded-3xl border border-gray-200 max-w-7xl w-full max-h-[92vh] overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg tracking-[0.08em] font-semibold uppercase">NTERPRET STYLE GUIDE</h3>
              <button onClick={() => setIsGuideOpen(false)} className="text-gray-500 hover:text-gray-900"><X size={34} /></button>
            </div>

            <div className="px-4 sm:px-6 pt-3 border-b border-gray-200 flex gap-2 overflow-x-auto">
              <button onClick={() => setGuideTab('communication')} className={`px-4 py-2.5 text-sm sm:text-base font-semibold whitespace-nowrap ${guideTab === 'communication' ? 'border border-b-white rounded-t-lg -mb-px' : 'text-gray-500'}`}>Communication Styles</button>
              <button onClick={() => setGuideTab('learning')} className={`px-4 py-2.5 text-sm sm:text-base font-semibold whitespace-nowrap ${guideTab === 'learning' ? 'border border-b-white rounded-t-lg -mb-px' : 'text-gray-500'}`}>Learning Styles</button>
              <button onClick={() => setGuideTab('motivation')} className={`px-4 py-2.5 text-sm sm:text-base font-semibold whitespace-nowrap ${guideTab === 'motivation' ? 'border border-b-white rounded-t-lg -mb-px' : 'text-gray-500'}`}>Motivational Anchors</button>
            </div>

            <div className="p-4 sm:p-6 max-h-[70vh] overflow-auto">
              <div className="mb-6 border border-blue-300 bg-blue-50 rounded-xl p-4 flex items-start gap-3 text-gray-700">
                <CircleHelp size={20} className="text-blue-600 mt-0.5" />
                <p>{guideTab === 'communication' ? 'How your athletes prefer to give and receive information. Adapting your communication approach improves trust, clarity, and buy-in.' : guideTab === 'learning' ? 'How your athletes absorb and retain new information most effectively. Matching instruction to learning style accelerates skill development.' : 'What drives your athletes to compete and commit. Understanding motivational anchors helps you sustain engagement and peak performance.'}</p>
              </div>

              <div className="hidden md:grid md:grid-cols-[minmax(180px,1fr)_2fr_2fr] text-xs font-semibold uppercase tracking-[0.14em] text-gray-900 border-b border-gray-200 pb-3">
                <p>Style</p><p>Description</p><p>Strategy</p>
              </div>

              {(guideTab === 'communication' ? COMMUNICATION_STYLES : guideTab === 'learning' ? LEARNING_STYLES : MOTIVATIONAL_ANCHORS).map((style) => (
                <div key={style.name} className="grid grid-cols-1 md:grid-cols-[minmax(180px,1fr)_2fr_2fr] gap-3 md:gap-4 py-5 border-b border-gray-200">
                  <p><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-semibold break-words">{style.name}</span></p>
                  <p className="text-gray-600">{style.description}</p>
                  <p className="text-gray-600 leading-relaxed"><Check size={16} className="inline mr-2 text-green-600" />{style.strategy}</p>
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
