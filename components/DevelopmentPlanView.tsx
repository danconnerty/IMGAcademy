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
  if (fit >= 62.5 && player.clutchFactor >= 750) return { label: 'Top Profile', className: 'bg-ink text-white border-ink' };
  if (fit < 62.5 && player.clutchFactor < 750) return { label: 'At-Risk', className: 'bg-white text-ink border-ink' };
  return { label: 'Conditional', className: 'bg-chip text-body border-line-strong' };
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
        <aside className="col-span-12 xl:col-span-2 nt-card p-4 xl:sticky xl:top-24 h-fit">
          <div className="flex items-center justify-between mb-5">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-gray-brand">Filters</p>
            <button onClick={() => setSelectedPosition('All')} className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gray-brand hover:text-ink transition-colors">Reset</button>
          </div>

          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-gray-brand mb-2">Testing Rounds</p>
          <button className="w-full flex items-center justify-between border border-line-strong bg-white rounded-card px-3 py-2 text-sm font-semibold text-ink mb-5">
            <span>2026 Pre-Season</span>
            <ChevronDown size={15} strokeWidth={1.8} className="text-gray-soft" />
          </button>

          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-gray-brand mb-3">Position</p>
          <div className="flex gap-2 flex-wrap">
            {['All', ...positions].map((position) => (
              <button key={position} onClick={() => setSelectedPosition(position)} className={`px-4 py-2 rounded-pill border text-xs font-semibold transition-colors ${selectedPosition === position ? 'bg-ink text-white border-ink' : 'bg-white text-gray-brand border-line-strong hover:border-ink hover:text-ink'}`}>
                {position}
              </button>
            ))}
          </div>

          <button onClick={() => setIsGuideOpen(true)} className="w-full flex items-center gap-3 px-2 py-2 rounded-card hover:bg-chip text-left border-t border-line pt-6 mt-6 transition-colors">
            <span className="h-8 w-8 rounded-full border border-line-strong flex items-center justify-center"><Dumbbell size={14} strokeWidth={1.8} className="text-gray-soft" /></span>
            <div>
              <p className="font-mono text-[11px] font-medium text-ink uppercase tracking-[0.16em]">Exercise Library</p>
              <p className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.16em]">Guide</p>
            </div>
          </button>
        </aside>

        <section className="col-span-12 xl:col-span-10 nt-card overflow-hidden">
          <div className="p-6 border-b border-line">
            <h1 className="text-2xl md:text-[2rem] font-semibold tracking-tightest text-ink capitalize leading-tight break-words">{teamName}</h1>
            <p className="text-body mt-1 text-sm">2026 Pre-Season Athlete Development Plan</p>
          </div>

          <div className="grid grid-cols-12 min-h-[68vh]">
            <div className="col-span-12 lg:col-span-4 border-r border-line p-4">
              <h2 className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em]">Athletes ({filteredPlayers.length})</h2>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search athletes..." className="nt-input mt-3" />

              <div className="mt-4 space-y-2 max-h-[58vh] overflow-auto pr-1">
                {filteredPlayers.length === 0 && (
                  <div className="rounded-card border border-dashed border-line-strong p-6 text-center text-sm text-gray-brand">No athletes match the current filters.</div>
                )}
                {filteredPlayers.map((player) => {
                  const signifier = getSignifier(player);
                  return (
                    <button key={player.id} onClick={() => setSelectedPlayerId(player.id)} className={`w-full text-left p-3 border rounded-card transition-colors ${selectedPlayer?.id === player.id ? 'border-ink bg-chip' : 'border-transparent bg-white hover:bg-chip'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="h-8 w-8 rounded-full bg-chip text-body text-xs font-semibold flex items-center justify-center">{player.name.slice(0, 1)}</span>
                          <div>
                            <p className="text-sm font-semibold text-ink">{player.name}</p>
                            <p className="text-xs text-gray-brand">{player.position} · {player.graduationYear}</p>
                          </div>
                        </div>
                        <ChevronRight size={15} strokeWidth={1.8} className="text-gray-soft" />
                      </div>
                      <div className="mt-2 flex gap-2 flex-wrap pl-11">
                        <span className={`px-2 py-0.5 rounded-pill font-mono text-[10px] uppercase tracking-[0.12em] border ${signifier.className}`}>{signifier.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 p-6 border-l border-line max-h-[70vh] overflow-auto">
              {selectedPlayer ? (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-3 border-b border-line pb-5">
                    <div>
                      <h3 className="text-2xl md:text-[1.75rem] font-semibold tracking-tightest text-ink leading-tight break-words">{selectedPlayer.name}</h3>
                      <p className="text-sm text-gray-brand mt-1">{selectedPlayer.position} · NCAA · {selectedPlayer.graduationYear}</p>
                      <p className="text-body mt-2">Training report based on NSights recommendations from the player profile.</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className={`px-2 py-1 rounded-pill font-mono text-[10px] uppercase tracking-[0.12em] border ${getSignifier(selectedPlayer).className}`}>{getSignifier(selectedPlayer).label}</span>
                    </div>
                  </div>

                  <div className="space-y-5 pt-1">
                    <div>
                      <h4 className="text-xl md:text-2xl font-semibold tracking-tightest text-ink mb-2">Summary</h4>
                      <p className="text-body text-sm leading-relaxed">{selectedPlayer.name} demonstrated remarkable agility and quick thinking during a challenging play. The athlete executed under pressure with confidence, but there is room to improve mental preparation during routine moments. Focused pre-action checks and situational awareness work can further stabilize late-game decision quality and raise consistency across pressure scenarios.</p>
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-semibold tracking-tightest text-ink mb-2">Practice Suggestion</h4>
                      <p className="text-body text-sm leading-relaxed">Consider introducing unpredictable obstacles in controlled reps so reactions become instinctive under stress. Emphasize decision speed and reset mechanics after each rep. Short, high-intensity cycles with immediate reflection will help build adaptability and confidence for chaotic game states.</p>
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-semibold tracking-tightest text-ink mb-2">Approach</h4>
                      <p className="text-body text-sm leading-relaxed">Start with acknowledgment of the athlete's strengths, then align feedback around specific moments where focus drifted. Reinforce tactical checkpoints and ask for athlete-led reflection on what was felt in those moments. This keeps accountability high while preserving buy-in and confidence.</p>
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-semibold tracking-tightest text-ink mb-2">Coaching Suggestion</h4>
                      <p className="text-body text-sm leading-relaxed">Layer visualization, breathing, and cue-word routines before and after high-leverage reps. Pair those routines with repeatable if-then scripts so decision-making remains clear during adversity. This builds emotional control and improves response quality when stakes are highest.</p>
                    </div>

                    <div className="pt-3">
                      <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-gray-brand mb-3">Prescribed Development Plan</h4>
                      <div className="space-y-3">
                        {prescribed.map((drill) => (
                          <div key={drill.id} className="nt-card p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <span className="h-10 w-10 rounded-full border border-line-strong flex items-center justify-center text-ink"><Dumbbell size={18} strokeWidth={1.8} /></span>
                              <div>
                                <p className="font-semibold text-base text-ink">{drill.title}</p>
                                <p className="text-gray-brand text-sm">{drill.breakdown.slice(0, 100)}...</p>
                              </div>
                            </div>
                            <button onClick={() => setVideoDrillId(drill.id)} className="h-10 w-10 rounded-full border border-line-strong flex items-center justify-center text-gray-brand hover:border-ink hover:text-ink transition-colors"><Play size={15} strokeWidth={1.8} /></button>
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
          <button className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setVideoDrillId(null)} aria-label="Close video" />
          <div className="relative bg-white rounded-card overflow-hidden w-full max-w-4xl border border-line-strong shadow-lift">
            <div className="px-6 py-4 flex items-center justify-between border-b border-line">
              <h3 className="text-lg font-semibold tracking-tightest text-ink flex items-center gap-2"><Play size={20} strokeWidth={1.8} />{selectedVideoDrill?.title}</h3>
              <button onClick={() => setVideoDrillId(null)} className="text-gray-brand hover:text-ink transition-colors"><X size={28} strokeWidth={1.8} /></button>
            </div>
            <div className="p-4 sm:p-6 bg-paper">
              <div className="w-full max-w-3xl mx-auto aspect-video rounded-card overflow-hidden border border-line-strong">
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
                <div className="h-full w-full flex flex-col items-center justify-center text-center text-gray-brand bg-chip">
                  <div className="h-20 w-20 rounded-full border border-line-strong mx-auto flex items-center justify-center text-ink"><Play size={36} strokeWidth={1.8} /></div>
                  <p className="mt-5 font-mono text-sm font-medium tracking-[0.16em] uppercase text-gray-brand">Video Placeholder</p>
                </div>
              )}
              </div>
            </div>
            <div className="p-5 text-center text-gray-brand text-sm border-t border-line">Video overview by Howie Schwartz - NTangible Executive Advisor, Sports Psychology</div>
          </div>
        </div>
      )}

      {isGuideOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsGuideOpen(false)} aria-label="Close guide" />
          <div className="relative bg-white rounded-card border border-line-strong shadow-lift max-w-6xl w-full overflow-hidden">
            <div className="p-6 border-b border-line flex items-center justify-between">
              <h3 className="font-mono text-[11px] tracking-[0.22em] font-medium uppercase text-gray-brand">Training Guide</h3>
              <button onClick={() => setIsGuideOpen(false)} className="text-gray-brand hover:text-ink transition-colors"><X size={28} strokeWidth={1.8} /></button>
            </div>

            <div className="p-6 border-b border-line">
              <div className="flex items-center gap-4">
                <span className="h-12 w-12 rounded-card border border-line-strong flex items-center justify-center text-ink"><Dumbbell size={22} strokeWidth={1.8} /></span>
                <div>
                  <h4 className="text-2xl md:text-[1.75rem] font-semibold tracking-tightest text-ink leading-tight break-words">NTangible Exercise Library</h4>
                  <p className="text-body text-base mt-1">Select a drill to view implementation details.</p>
                </div>
              </div>

              <div className="mt-6 relative">
                <select
                  value={selectedDrillId}
                  onChange={(event) => setSelectedDrillId(event.target.value)}
                  className="w-full appearance-none bg-white border border-line-strong rounded-card px-4 py-2.5 text-base font-semibold text-ink"
                >
                  {DRILLS.map((drill) => <option key={drill.id} value={drill.id}>{drill.title}</option>)}
                </select>
                <ChevronDown size={22} strokeWidth={1.8} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-soft pointer-events-none" />
              </div>
            </div>
            <div className="p-6 grid grid-cols-12 gap-6 max-h-[70vh] overflow-auto">
              <div className="col-span-12 lg:col-span-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gray-brand font-medium">Drill Breakdown</p>
                <h5 className="text-2xl md:text-[1.75rem] font-semibold tracking-tightest text-ink mt-2 leading-tight break-words">{selectedDrill.title}</h5>
                <p className="text-body text-base leading-relaxed mt-4">{selectedDrill.breakdown}</p>

                <div className="mt-8 border border-line-strong rounded-card p-6 bg-paper">
                  <p className="text-xl md:text-2xl font-semibold tracking-tightest text-ink flex items-center gap-2"><Lightbulb size={22} strokeWidth={1.8} className="text-ink" />Coach's Insight</p>
                  <p className="mt-3 text-body text-base leading-relaxed">{selectedDrill.insight}</p>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4">
                <div className="nt-card p-4 md:p-5 h-full flex flex-col">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gray-brand font-medium mb-3">Drill Demo</p>
                  <div className="aspect-video rounded-card overflow-hidden border border-line-strong bg-chip">
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
                      <div className="h-full w-full flex items-center justify-center text-center text-gray-brand">
                        <div>
                          <span className="h-12 w-12 rounded-full border border-line-strong mx-auto flex items-center justify-center text-ink"><Play size={22} strokeWidth={1.8} /></span>
                          <p className="mt-3 font-mono text-sm font-medium uppercase tracking-[0.16em] text-gray-brand">Video Placeholder</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <button onClick={() => setVideoDrillId(selectedDrill.id)} className="w-full rounded-pill bg-ink text-white hover:opacity-90 border border-ink px-4 py-2 text-sm font-semibold transition-opacity">Open Expanded Demo</button>
                    {selectedDrill.videoUrl && (
                      <a href={selectedDrill.videoUrl} target="_blank" rel="noreferrer" className="block w-full rounded-pill border border-ink px-4 py-2 text-sm text-center text-ink hover:bg-ink hover:text-white transition-colors">Open on YouTube</a>
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
