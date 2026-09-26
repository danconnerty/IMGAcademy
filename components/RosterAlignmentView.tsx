import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Grid2X2, Info, MoveRight, X } from 'lucide-react';
import { Player } from '../types';
import { getRecruitStatusSignifier } from '../utils/recruiting';

interface RosterAlignmentViewProps {
  rosterPlayers: Player[];
  recruitPlayers: Player[];
  teamName: string;
  positions: string[];
  onOpenRubric: () => void;
  focusedPlayerId?: string | null;
}

type CohortKey = 'trust' | 'high-reward' | 'culture' | 'at-risk';
type DataScope = 'roster' | 'recruits';

const COHORT_CONFIG: Record<CohortKey, {
  title: string;
  subtitle: string;
  border: string;
  bar: string;
  badge: string;
}> = {
  trust: {
    title: 'Trust / Anchors',
    subtitle: 'High Clutch / High Alignment · Alignment ≥ 62.5% · Clutch ≥ 750',
    border: 'border-ink',
    bar: 'bg-ink',
    badge: 'bg-ink text-white border-ink'
  },
  'high-reward': {
    title: 'High Reward / High Maintenance',
    subtitle: 'High Clutch / Low Alignment · Alignment < 62.5% · Clutch ≥ 750',
    border: 'border-line-strong',
    bar: 'bg-ink',
    badge: 'bg-chip text-body border-line-strong'
  },
  culture: {
    title: 'Culture Carriers',
    subtitle: 'Low Clutch / High Alignment · Alignment ≥ 62.5% · Clutch < 750',
    border: 'border-line-strong',
    bar: 'bg-ink',
    badge: 'bg-chip text-body border-line-strong'
  },
  'at-risk': {
    title: 'At Risk',
    subtitle: 'Low Clutch / Low Alignment · Alignment < 62.5% · Clutch < 750',
    border: 'border-line-strong',
    bar: 'bg-line-strong',
    badge: 'bg-chip text-body border-line-strong'
  }
};

const GUIDE_CONTENT: Record<CohortKey, { tag: string; profile: string; playbook: string; tagClass: string; arrowClass: string; title: string; }> = {
  trust: {
    title: 'Trust / Anchors',
    tag: 'High Clutch / High Alignment',
    profile: 'The backbone of your program. These athletes naturally embody your culture and deliver in high-pressure moments without needing constant oversight. They are force multipliers.',
    playbook: 'Empower them immediately. Give them ownership of team standards. Use them to onboard new players and model the expected behavior. Do not micromanage; validate their leadership.',
    tagClass: 'bg-ink text-white',
    arrowClass: 'text-ink'
  },
  'high-reward': {
    title: 'High Reward / High Maintenance',
    tag: 'High Clutch / Low Alignment',
    profile: 'These athletes produce wins but often challenge the established system. They may prioritize personal statistics over team goals, yet they reliably deliver when the game is on the line.',
    playbook: 'Establish strict transactional boundaries. Praise the output, but correct cultural misses privately. Do not let their talent excuse toxicity. Keep the relationship professional and performance-focused.',
    tagClass: 'bg-chip text-ink',
    arrowClass: 'text-ink'
  },
  culture: {
    title: 'Culture Carriers',
    tag: 'Low Clutch / High Alignment',
    profile: 'These athletes are your biggest advocates. They consistently model the right behaviors but may struggle to execute under elite pressure. They are vital for maintaining team cohesion.',
    playbook: 'Develop their physical skills while leaning on their cultural buy-in. Reward their effort publicly to reinforce standards. Find roles where cultural influence outweighs raw performance needs.',
    tagClass: 'bg-chip text-ink',
    arrowClass: 'text-ink'
  },
  'at-risk': {
    title: 'At Risk',
    tag: 'Low Clutch / Low Alignment',
    profile: 'These athletes neither produce results nor support the culture. They drain coaching energy and can become a source of negativity if left unchecked.',
    playbook: 'Evaluate future fit immediately. Reduce their influence on the group. Set clear, short-term performance and behavioral targets; if missed, move to separate.',
    tagClass: 'bg-chip text-ink',
    arrowClass: 'text-ink'
  }
};

const getSignifier = (player: Player) => {
  const fit = player.fitScore ?? 0;
  if (fit >= 62.5 && player.clutchFactor >= 750) {
    return { label: 'Top Profile', className: 'bg-ink text-white border-ink' };
  }
  if (fit < 62.5 && player.clutchFactor < 750) {
    return { label: 'At-Risk', className: 'bg-white text-ink border-ink' };
  }
  return { label: 'Conditional', className: 'bg-chip text-body border-line-strong' };
};


const getCohort = (player: Player): CohortKey => {
  const fit = player.fitScore ?? 0;

  if (player.clutchFactor >= 750 && fit >= 62.5) return 'trust';
  if (player.clutchFactor >= 750 && fit < 62.5) return 'high-reward';
  if (player.clutchFactor < 750 && fit >= 62.5) return 'culture';
  return 'at-risk';
};

const RosterAlignmentView: React.FC<RosterAlignmentViewProps> = ({ rosterPlayers, recruitPlayers, teamName, positions, onOpenRubric, focusedPlayerId }) => {
  const [scope, setScope] = useState<DataScope>('roster');
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [selectedCohort, setSelectedCohort] = useState<'All' | CohortKey>('All');
  const [search, setSearch] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideTab, setGuideTab] = useState<CohortKey>('trust');

  const sourcePlayers = scope === 'roster' ? rosterPlayers : recruitPlayers;

  useEffect(() => {
    if (!focusedPlayerId) return;
    const focusedRecruit = recruitPlayers.find((player) => player.id === focusedPlayerId);
    if (focusedRecruit) {
      setScope('recruits');
      setSearch(focusedRecruit.name);
    }
  }, [focusedPlayerId, recruitPlayers]);

  const filteredPlayers = useMemo(() => {
    return sourcePlayers
      .filter(player => selectedPosition === 'All' || player.position === selectedPosition)
      .filter(player => search.length === 0 || player.name.toLowerCase().includes(search.toLowerCase()))
      .filter(player => selectedCohort === 'All' || getCohort(player) === selectedCohort);
  }, [search, selectedCohort, selectedPosition, sourcePlayers]);

  const groupedPlayers = useMemo(() => {
    const groups: Record<CohortKey, Player[]> = { trust: [], 'high-reward': [], culture: [], 'at-risk': [] };

    filteredPlayers.forEach(player => {
      groups[getCohort(player)].push(player);
    });

    (Object.keys(groups) as CohortKey[]).forEach(key => {
      groups[key].sort((a, b) => b.clutchFactor - a.clutchFactor);
    });

    return groups;
  }, [filteredPlayers]);

  const renderCard = (player: Player, cohort: CohortKey) => {
    const signifier = getSignifier(player);
    const recruitSignifier = getRecruitStatusSignifier(player);

    return (
      <div key={player.id} className={`nt-card p-4 mb-3 ${focusedPlayerId === player.id ? "ring-2 ring-ink ring-offset-1" : ""}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-ink">{player.name}</p>
              <span className={`px-2 py-0.5 rounded-pill border font-mono text-[10px] uppercase tracking-[0.12em] ${signifier.className}`}>{signifier.label}</span>
              {recruitSignifier && <span className={`px-2 py-0.5 rounded-pill border font-mono text-[10px] uppercase tracking-[0.12em] ${recruitSignifier.className}`}>{recruitSignifier.label}</span>}
            </div>
            <span className="mt-2 inline-block px-1.5 py-0.5 rounded-card border border-line-strong bg-white font-mono text-[10px] text-gray-brand uppercase tracking-[0.12em]">{player.position}</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-ink tabular-nums">{player.clutchFactor}</p>
            <p className="font-mono text-[9px] text-gray-brand tracking-[0.16em] uppercase">Clutch</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="h-1 bg-line rounded-full overflow-hidden">
            <div className={`h-full ${COHORT_CONFIG[cohort].bar}`} style={{ width: `${Math.max(0, Math.min(100, player.fitScore ?? 0))}%` }} />
          </div>
          <p className="text-right mt-1 font-mono text-[11px] font-medium text-gray-brand tabular-nums">{Math.round(player.fitScore ?? 0)}%</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <aside className="w-full lg:w-72">
        <div className="nt-card p-5 sticky top-24">
          <div className="flex items-center justify-between mb-5">
            <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.25em]">Filters</p>
            <button onClick={() => { setSelectedPosition('All'); setSelectedCohort('All'); }} className="font-mono text-[10px] text-gray-brand hover:text-ink font-medium uppercase tracking-[0.16em] transition-colors">Reset</button>
          </div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-gray-brand mb-2">Position</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['All', ...positions].map(position => (
              <button key={position} onClick={() => setSelectedPosition(position)} className={`px-3 py-1.5 rounded-pill border text-[11px] font-semibold transition-colors ${selectedPosition === position ? 'bg-ink text-white border-ink' : 'bg-white text-gray-brand border-line-strong hover:border-ink hover:text-ink'}`}>{position}</button>
            ))}
          </div>

          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-gray-brand mb-2">Cohorts</p>
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setSelectedCohort('All')} className={`px-3 py-1.5 rounded-pill border text-[11px] font-semibold transition-colors ${selectedCohort === 'All' ? 'bg-ink text-white border-ink' : 'bg-white text-gray-brand border-line-strong hover:border-ink hover:text-ink'}`}>All</button>
            {(Object.keys(COHORT_CONFIG) as CohortKey[]).map(key => (
              <button key={key} onClick={() => setSelectedCohort(key)} className={`px-3 py-1.5 rounded-pill border text-[11px] transition-colors ${selectedCohort === key ? 'bg-ink text-white border-ink' : 'bg-white text-gray-brand border-line-strong hover:border-ink hover:text-ink'}`}>{COHORT_CONFIG[key].title}</button>
            ))}
          </div>

          <div className="space-y-2 border-t border-line pt-4">
            <button onClick={() => setIsGuideOpen(true)} className="w-full flex items-center gap-3 px-2 py-2 rounded-card hover:bg-chip text-left transition-colors">
              <span className="h-8 w-8 rounded-full border border-line-strong flex items-center justify-center"><Grid2X2 size={14} strokeWidth={1.8} className="text-gray-soft" /></span>
              <div>
                <p className="font-mono text-[11px] font-medium text-ink uppercase tracking-[0.16em]">Action Matrix</p>
                <p className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.16em]">Guide</p>
              </div>
            </button>
            <button onClick={onOpenRubric} className="w-full flex items-center gap-3 px-2 py-2 rounded-card hover:bg-chip text-left transition-colors">
              <span className="h-8 w-8 rounded-full border border-line-strong flex items-center justify-center"><Activity size={14} strokeWidth={1.8} className="text-gray-soft" /></span>
              <div>
                <p className="font-mono text-[11px] font-medium text-ink uppercase tracking-[0.16em]">Alignment Score</p>
                <p className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.16em]">Rubric</p>
              </div>
            </button>
          </div>
        </div>
      </aside>

      <section className="flex-1">
        <h1 className="text-3xl font-semibold tracking-tightest text-ink">{teamName}</h1>
        <p className="text-body text-sm mt-1">Roster alignment</p>

        <div className="mt-5 border-b border-line pb-4 flex items-center gap-3">
          <button onClick={() => setScope('roster')} className={`px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.16em] border transition-colors ${scope === 'roster' ? 'border-ink text-ink bg-white' : 'border-transparent text-gray-brand hover:text-ink'}`}>Current Roster</button>
          <button onClick={() => setScope('recruits')} className={`px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.16em] border transition-colors ${scope === 'recruits' ? 'border-ink text-ink bg-white' : 'border-transparent text-gray-brand hover:text-ink'}`}>Recruits</button>
        </div>

        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="nt-input mt-4" />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-6">
          {(Object.keys(COHORT_CONFIG) as CohortKey[]).map(cohort => (
            <div key={cohort} className="bg-paper border border-line-strong rounded-card p-3">
              <div className={`pb-3 border-b-2 ${COHORT_CONFIG[cohort].border}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink">{COHORT_CONFIG[cohort].title}</p>
                  <span className={`h-5 min-w-5 px-1 rounded-pill font-mono text-[10px] tabular-nums flex items-center justify-center border ${COHORT_CONFIG[cohort].badge}`}>{groupedPlayers[cohort].length}</span>
                </div>
                <p className="text-[10px] text-gray-brand mt-2">{COHORT_CONFIG[cohort].subtitle}</p>
              </div>
              <div className="pt-3 max-h-[68vh] overflow-auto pr-1">
                {groupedPlayers[cohort].map(player => renderCard(player, cohort))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {isGuideOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsGuideOpen(false)} aria-label="Close guide" />
          <div className="relative bg-white rounded-card border border-line-strong shadow-lift max-w-5xl w-full overflow-hidden">
            <div className="p-6 border-b border-line">
              <div className="flex justify-between items-center">
                <h2 className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase text-gray-brand">Action Matrix Guide</h2>
                <button onClick={() => setIsGuideOpen(false)} className="text-gray-brand hover:text-ink transition-colors"><X size={28} strokeWidth={1.8} /></button>
              </div>
              <div className="mt-5 bg-paper border border-line-strong rounded-card p-4 text-body text-sm flex items-center gap-3">
                <Info size={18} strokeWidth={1.8} className="text-gray-soft shrink-0" />
                <p>The Action Matrix segments your roster based on <strong className="text-ink font-semibold">Performance under pressure</strong> and <strong className="text-ink font-semibold">Cultural fit</strong>.</p>
              </div>
            </div>

            <div className="border-b border-line px-4 flex gap-1">
              {(Object.keys(GUIDE_CONTENT) as CohortKey[]).map(tab => (
                <button key={tab} onClick={() => setGuideTab(tab)} className={`px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${guideTab === tab ? 'border border-line-strong border-b-white rounded-t-card -mb-px text-ink' : 'text-gray-brand hover:text-ink'}`}>
                  {GUIDE_CONTENT[tab].title}
                </button>
              ))}
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div>
                <span className={`inline-block px-4 py-1 rounded-pill font-mono text-[11px] font-medium uppercase tracking-[0.12em] border border-line-strong ${GUIDE_CONTENT[guideTab].tagClass}`}>{GUIDE_CONTENT[guideTab].tag}</span>
                <h3 className="mt-3 text-xl font-semibold tracking-tightest text-ink">{GUIDE_CONTENT[guideTab].title}</h3>
                <p className="mt-4 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-gray-brand">The Player Profile</p>
                <p className="mt-4 text-base leading-relaxed text-body">{GUIDE_CONTENT[guideTab].profile}</p>
              </div>
              <div>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-gray-brand">The Playbook Strategy</p>
                <div className="mt-4 border border-line-strong rounded-card bg-paper p-6 flex gap-4">
                  <MoveRight strokeWidth={1.8} className={`mt-1 shrink-0 ${GUIDE_CONTENT[guideTab].arrowClass}`} />
                  <p className="text-base leading-relaxed text-body">{GUIDE_CONTENT[guideTab].playbook}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RosterAlignmentView;
