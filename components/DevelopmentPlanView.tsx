import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Dumbbell, Lightbulb, Play, X } from 'lucide-react';
import { Player } from '../types';
import { DRILLS, getPlayerPrescribedDrills, getPlayerProfile } from '../utils/playerInsights';

interface Props {
  teamName: string;
  players: Player[];
  positions: string[];
}


const getSignifier = (player: Player) => {
  const fit = player.fitScore ?? 0;
  if (fit >= 62.5 && player.clutchFactor >= 750) return { label: 'Top Profile', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  if (fit < 62.5 && player.clutchFactor < 750) return { label: 'At-Risk', className: 'bg-rose-100 text-rose-700 border-rose-200' };
  return { label: 'Conditional', className: 'bg-amber-100 text-amber-700 border-amber-200' };
};

const getYouTubeEmbedUrl = (url?: string): string | null => {
  if (!url) return null;
  if (url.includes('/embed/')) return url;

  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  const longMatch = url.match(/[?&]v=([^?&]+)/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;

  return null;
};

const DevelopmentPlanView: React.FC<Props> = ({ teamName, players, positions }) => {
  const [search, setSearch] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [selectedDrillId, setSelectedDrillId] = useState(DRILLS[0].id);
  const [videoDrillId, setVideoDrillId] = useState<string | null>(null);

  const filteredPlayers = useMemo(() => players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(search.toLowerCase());
    const matchesPosition = selectedPosition === 'All' || player.position === selectedPosition;
    return matchesSearch && matchesPosition;
  }), [players, search, selectedPosition]);

  const selectedPlayer = useMemo(() => {
    const fallback = filteredPlayers[0] ?? players[0] ?? null;
    return filteredPlayers.find((player) => player.id === selectedPlayerId) ?? fallback;
  }, [filteredPlayers, players, selectedPlayerId]);

  const selectedDrill = DRILLS.find((drill) => drill.id === selectedDrillId) ?? DRILLS[0];
  const selectedVideoDrill = DRILLS.find((drill) => drill.id === videoDrillId);
  const selectedVideoEmbedUrl = getYouTubeEmbedUrl(selectedVideoDrill?.videoUrl);
  const selectedDrillEmbedUrl = getYouTubeEmbedUrl(selectedDrill.videoUrl);

  const prescribed = useMemo(() => {
    if (!selectedPlayer) return DRILLS.slice(0, 2);
    return getPlayerPrescribedDrills(selectedPlayer, 2);
  }, [selectedPlayer]);



 return (
    <div className="space-y-5">
      <div className="grid grid-cols-12 gap-4">
        <aside className="col-span-12 xl:col-span-2 bg-white border border-gray-200 rounded-xl p-4 xl:sticky xl:top-24 h-fit">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Filters</p>
            <button onClick={() => setSelectedPosition('All')} className="text-[10px] font-bold uppercase text-blue-600">Reset</button>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Testing Rounds</p>
          <button className="w-full flex items-center justify-between border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 mb-5">
            <span>2026 Pre-Season</span>
            <ChevronDown size={15} />
          </button>

          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Position</p>
          <div className="flex gap-2 flex-wrap">
            {['All', ...positions].map((position) => (
              <button key={position} onClick={() => setSelectedPosition(position)} className={`px-4 py-2 rounded-full border text-xs font-bold ${selectedPosition === position ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                {position}
              </button>
            ))}
          </div>

          <button onClick={() => setIsGuideOpen(true)} className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50 text-left border-t border-gray-100 pt-6 mt-6">
            <span className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center"><Dumbbell size={14} className="text-gray-500" /></span>
            <div>
              <p className="text-xs font-bold text-gray-800 uppercase">Exercise Library</p>
              <p className="text-[11px] text-gray-500 uppercase">Guide</p>
            </div>
          </button>
        </aside>

        <section className="col-span-12 xl:col-span-10 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl md:text-[2rem] font-semibold text-gray-900 capitalize leading-tight break-words">{teamName}</h1>
            <p className="text-gray-500 mt-1 text-sm">2026 Pre-Season Athlete Development Plan</p>
          </div>

          <div className="grid grid-cols-12 min-h-[68vh]">
            <div className="col-span-12 lg:col-span-4 border-r border-gray-200 p-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-[0.14em]">Athletes ({filteredPlayers.length})</h2>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search athletes..." className="mt-2 w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm" />

              <div className="mt-4 space-y-2 max-h-[58vh] overflow-auto pr-1">
                {filteredPlayers.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">No athletes match the current filters.</div>
                )}
                {filteredPlayers.map((player) => {
                  const signifier = getSignifier(player);
                  return (
                    <button key={player.id} onClick={() => setSelectedPlayerId(player.id)} className={`w-full text-left p-3 border rounded-lg ${selectedPlayer?.id === player.id ? 'border-blue-300 bg-blue-50/70' : 'border-transparent bg-white hover:bg-gray-50'}`}>
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
                        <span className={`px-2 py-0.5 rounded-full text-[10px] border font-bold ${signifier.className}`}>{signifier.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 p-6 border-l border-gray-100 max-h-[70vh] overflow-auto">
              {selectedPlayer ? (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3 border-b border-gray-200 pb-5">
                    <div>
                      <h3 className="text-2xl md:text-[1.75rem] font-semibold text-gray-900 leading-tight break-words">{selectedPlayer.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{selectedPlayer.position} • NCAA • {selectedPlayer.graduationYear}</p>
                      <p className="text-gray-500 mt-2">Training report based on NSights recommendations from the player profile.</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSignifier(selectedPlayer).className}`}>{getSignifier(selectedPlayer).label}</span>
                    </div>
                  </div>

                  <div className="space-y-5 pt-1">
                    <div>
                      <h4 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Summary</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{selectedPlayer.name} demonstrated remarkable agility and quick thinking during a challenging play. The athlete executed under pressure with confidence, but there is room to improve mental preparation during routine moments. Focused pre-action checks and situational awareness work can further stabilize late-game decision quality and raise consistency across pressure scenarios.</p>
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Practice Suggestion</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">Consider introducing unpredictable obstacles in controlled reps so reactions become instinctive under stress. Emphasize decision speed and reset mechanics after each rep. Short, high-intensity cycles with immediate reflection will help build adaptability and confidence for chaotic game states.</p>
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Approach</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">Start with acknowledgment of the athlete's strengths, then align feedback around specific moments where focus drifted. Reinforce tactical checkpoints and ask for athlete-led reflection on what was felt in those moments. This keeps accountability high while preserving buy-in and confidence.</p>
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Coaching Suggestion</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">Layer visualization, breathing, and cue-word routines before and after high-leverage reps. Pair those routines with repeatable if-then scripts so decision-making remains clear during adversity. This builds emotional control and improves response quality when stakes are highest.</p>
                    </div>

                    <div className="pt-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Prescribed Development Plan</h4>
                      <div className="space-y-3">
                        {prescribed.map((drill) => (
                          <div key={drill.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4 bg-white shadow-sm">
                            <div className="flex items-center gap-3">
                              <span className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><Dumbbell size={18} /></span>
                              <div>
                                <p className="font-semibold text-base text-gray-900">{drill.title}</p>
                                <p className="text-gray-500 text-sm">{drill.breakdown.slice(0, 100)}...</p>
                              </div>
                            </div>
                            <button onClick={() => setVideoDrillId(drill.id)} className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"><Play size={15} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      {videoDrillId && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
          <button className="absolute inset-0 bg-black/60" onClick={() => setVideoDrillId(null)} aria-label="Close video" />
          <div className="relative bg-white rounded-3xl overflow-hidden w-full max-w-4xl border border-gray-200 shadow-2xl">
            <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold uppercase tracking-[0.08em] flex items-center gap-2"><Play size={20} />{selectedVideoDrill?.title}</h3>
              <button onClick={() => setVideoDrillId(null)} className="text-gray-400 hover:text-white"><X size={32} /></button>
            </div>
            <div className="bg-slate-900 p-4 sm:p-6">
              <div className="w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {selectedVideoEmbedUrl ? (
                <iframe
                  className="h-full w-full"
                  src={selectedVideoEmbedUrl}
                  title={selectedVideoDrill?.title || 'Drill video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-center text-gray-400 bg-slate-800">
                  <div className="h-20 w-20 rounded-full bg-white/20 mx-auto flex items-center justify-center"><Play size={36} className="text-white" /></div>
                  <p className="mt-5 text-lg font-semibold tracking-[0.15em] uppercase">Video Placeholder</p>
                </div>
              )}
              </div>
            </div>
            <div className="p-5 text-center text-gray-500 text-lg">Video overview by Howie Schwartz - NTangible Executive Advisor, Sports Psychology</div>
          </div>
        </div>
      )}

      {isGuideOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/45" onClick={() => setIsGuideOpen(false)} aria-label="Close guide" />
          <div className="relative bg-white rounded-3xl border border-gray-200 max-w-6xl w-full overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg tracking-[0.08em] font-semibold uppercase">Training Guide</h3>
              <button onClick={() => setIsGuideOpen(false)} className="text-gray-500 hover:text-gray-900"><X size={34} /></button>
            </div>

            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <span className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Dumbbell size={22} /></span>
                <div>
                  <h4 className="text-2xl md:text-[1.75rem] font-semibold text-gray-900 leading-tight break-words">NTangible Exercise Library</h4>
                  <p className="text-gray-500 text-base mt-1">Select a drill to view implementation details.</p>
                </div>
              </div>

              <div className="mt-6 relative">
                <select
                  value={selectedDrillId}
                  onChange={(event) => setSelectedDrillId(event.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-base font-semibold text-gray-800"
                >
                  {DRILLS.map((drill) => <option key={drill.id} value={drill.id}>{drill.title}</option>)}
                </select>
                <ChevronDown size={22} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
              </div>
            </div>
            <div className="p-6 grid grid-cols-12 gap-6 max-h-[70vh] overflow-auto">
              <div className="col-span-12 lg:col-span-8">
                <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500 font-semibold">Drill Breakdown</p>
                <h5 className="text-2xl md:text-[1.75rem] font-semibold text-gray-900 mt-2 leading-tight break-words">{selectedDrill.title}</h5>
                <p className="text-gray-700 text-base leading-relaxed mt-4">{selectedDrill.breakdown}</p>

                <div className="mt-8 border border-gray-200 rounded-2xl p-6 bg-gray-50">
                  <p className="text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2"><Lightbulb size={22} className="text-blue-600" />Coach's Insight</p>
                  <p className="mt-3 text-gray-500 text-base leading-relaxed">{selectedDrill.insight}</p>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4">
                <div className="bg-black rounded-2xl p-4 md:p-5 text-white h-full flex flex-col">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-gray-400 font-semibold mb-3">Drill Demo</p>
                  <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-900">
                    {selectedDrillEmbedUrl ? (
                      <iframe
                        className="h-full w-full"
                        src={selectedDrillEmbedUrl}
                        title={`${selectedDrill.title} demo`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-center text-gray-400">
                        <div>
                          <span className="h-12 w-12 rounded-full bg-white/20 mx-auto flex items-center justify-center"><Play size={22} /></span>
                          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.1em]">Video Placeholder</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <button onClick={() => setVideoDrillId(selectedDrill.id)} className="w-full rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm font-semibold transition-colors">Open Expanded Demo</button>
                    {selectedDrill.videoUrl && (
                      <a href={selectedDrill.videoUrl} target="_blank" rel="noreferrer" className="block w-full rounded-lg border border-white/20 px-4 py-2 text-sm text-center text-gray-200 hover:bg-white/10 transition-colors">Open on YouTube</a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevelopmentPlanView;
