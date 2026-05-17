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
    subtitle: 'High Clutch / High Alignment • Alignment ≥ 62.5% • Clutch ≥ 750',
    border: 'border-emerald-500',
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  },
  'high-reward': {
    title: 'High Reward / High Maintenance',
    subtitle: 'High Clutch / Low Alignment • Alignment < 62.5% • Clutch ≥ 750',
    border: 'border-orange-500',
    bar: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  culture: {
    title: 'Culture Carriers',
    subtitle: 'Low Clutch / High Alignment • Alignment ≥ 62.5% • Clutch < 750',
    border: 'border-blue-600',
    bar: 'bg-blue-600',
    badge: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  'at-risk': {
    title: 'At Risk',
    subtitle: 'Low Clutch / Low Alignment • Alignment < 62.5% • Clutch < 750',
    border: 'border-slate-500',
    bar: 'bg-slate-500',
    badge: 'bg-rose-100 text-rose-700 border-rose-200'
  }
};

const GUIDE_CONTENT: Record<CohortKey, { tag: string; profile: string; playbook: string; tagClass: string; arrowClass: string; title: string; }> = {
  trust: {
    title: 'Trust / Anchors',
    tag: 'High Clutch / High Alignment',
    profile: 'The backbone of your program. These athletes naturally embody your culture and deliver in high-pressure moments without needing constant oversight. They are force multipliers.',
    playbook: 'Empower them immediately. Give them ownership of team standards. Use them to onboard new players and model the expected behavior. Do not micromanage; validate their leadership.',
    tagClass: 'bg-emerald-100 text-emerald-700',
    arrowClass: 'text-emerald-600'
  },
  'high-reward': {
    title: 'High Reward / High Maintenance',
    tag: 'High Clutch / Low Alignment',
    profile: 'These athletes produce wins but often challenge the established system. They may prioritize personal statistics over team goals, yet they reliably deliver when the game is on the line.',
    playbook: 'Establish strict transactional boundaries. Praise the output, but correct cultural misses privately. Do not let their talent excuse toxicity. Keep the relationship professional and performance-focused.',
    tagClass: 'bg-orange-100 text-orange-700',
    arrowClass: 'text-orange-600'
  },
  culture: {
    title: 'Culture Carriers',
    tag: 'Low Clutch / High Alignment',
    profile: 'These athletes are your biggest advocates. They consistently model the right behaviors but may struggle to execute under elite pressure. They are vital for maintaining team cohesion.',
    playbook: 'Develop their physical skills while leaning on their cultural buy-in. Reward their effort publicly to reinforce standards. Find roles where cultural influence outweighs raw performance needs.',
    tagClass: 'bg-blue-100 text-blue-700',
    arrowClass: 'text-blue-600'
  },
  'at-risk': {
    title: 'At Risk',
    tag: 'Low Clutch / Low Alignment',
    profile: 'These athletes neither produce results nor support the culture. They drain coaching energy and can become a source of negativity if left unchecked.',
    playbook: 'Evaluate future fit immediately. Reduce their influence on the group. Set clear, short-term performance and behavioral targets; if missed, move to separate.',
    tagClass: 'bg-slate-100 text-slate-600',
    arrowClass: 'text-slate-500'
  }
};

const getSignifier = (player: Player) => {
  const fit = player.fitScore ?? 0;
  if (fit >= 62.5 && player.clutchFactor >= 750) {
    return { label: 'Top Profile', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  }
  if (fit < 62.5 && player.clutchFactor < 750) {
    return { label: 'At-Risk', className: 'bg-rose-100 text-rose-700 border-rose-200' };
  }
  return { label: 'Conditional', className: 'bg-amber-100 text-amber-700 border-amber-200' };
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
      <div key={player.id} className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 ${focusedPlayerId === player.id ? "ring-2 ring-blue-400 ring-offset-1" : ""}`}> 
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-gray-800">{player.name}</p>
              <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${signifier.className}`}>{signifier.label}</span>
              {recruitSignifier && <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${recruitSignifier.className}`}>{recruitSignifier.label}</span>}
            </div>
            <span className="mt-2 inline-block px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50 text-[10px] text-gray-500 font-bold">{player.position}</span>
          </div>
          <div className="text-right">
            <p className="text-4 font-bold text-gray-900">{player.clutchFactor}</p>
            <p className="text-[9px] text-gray-400 tracking-wide uppercase">Clutch</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full ${COHORT_CONFIG[cohort].bar}`} style={{ width: `${Math.max(0, Math.min(100, player.fitScore ?? 0))}%` }} />
          </div>
          <p className="text-right mt-1 text-[11px] font-semibold text-gray-500">{Math.round(player.fitScore ?? 0)}%</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <aside className="w-full lg:w-72">
        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filters</p>
            <button onClick={() => { setSelectedPosition('All'); setSelectedCohort('All'); }} className="text-[10px] text-blue-600 font-bold uppercase">Reset</button>
          </div>
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Position</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['All', ...positions].map(position => (
              <button key={position} onClick={() => setSelectedPosition(position)} className={`px-3 py-1.5 rounded-full border text-[11px] font-bold ${selectedPosition === position ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'}`}>{position}</button>
            ))}
          </div>

          <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Cohorts</p>
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setSelectedCohort('All')} className={`px-3 py-1.5 rounded-full border text-[11px] font-bold ${selectedCohort === 'All' ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'}`}>All</button>
            {(Object.keys(COHORT_CONFIG) as CohortKey[]).map(key => (
              <button key={key} onClick={() => setSelectedCohort(key)} className={`px-3 py-1.5 rounded-full border text-[11px] ${selectedCohort === key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200'}`}>{COHORT_CONFIG[key].title}</button>
            ))}
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-4">
            <button onClick={() => setIsGuideOpen(true)} className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50 text-left">
              <span className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center"><Grid2X2 size={14} className="text-gray-500" /></span>
              <div>
                <p className="text-xs font-bold text-gray-800 uppercase">Action Matrix</p>
                <p className="text-[11px] text-gray-500 uppercase">Guide</p>
              </div>
            </button>
            <button onClick={onOpenRubric} className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50 text-left">
              <span className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center"><Activity size={14} className="text-gray-500" /></span>
              <div>
                <p className="text-xs font-bold text-gray-800 uppercase">Alignment Score</p>
                <p className="text-[11px] text-gray-500 uppercase">Rubric</p>
              </div>
            </button>
          </div>
        </div>
      </aside>

      <section className="flex-1">
        <h1 className="text-3xl font-semibold text-gray-900">{teamName}</h1>
        <p className="text-gray-500 text-sm mt-1">Roster Alignment</p>

        <div className="mt-5 border-b border-gray-200 pb-4 flex items-center gap-3">
          <button onClick={() => setScope('roster')} className={`px-5 py-3 text-xs font-bold uppercase border ${scope === 'roster' ? 'border-gray-900 text-gray-900 bg-white' : 'border-transparent text-gray-500'}`}>Current Roster</button>
          <button onClick={() => setScope('recruits')} className={`px-5 py-3 text-xs font-bold uppercase border ${scope === 'recruits' ? 'border-gray-900 text-gray-900 bg-white' : 'border-transparent text-gray-500'}`}>Recruits</button>
        </div>

        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="mt-4 w-full border border-gray-200 bg-white rounded px-4 py-3 text-sm" />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-4">
          {(Object.keys(COHORT_CONFIG) as CohortKey[]).map(cohort => (
            <div key={cohort} className="bg-slate-50 border border-gray-200 rounded-xl p-3">
              <div className={`pb-3 border-b ${COHORT_CONFIG[cohort].border}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs font-bold uppercase ${cohort === 'trust' ? 'text-emerald-700' : cohort === 'high-reward' ? 'text-orange-700' : cohort === 'culture' ? 'text-blue-700' : 'text-slate-600'}`}>{COHORT_CONFIG[cohort].title}</p>
                  <span className={`h-5 min-w-5 px-1 rounded-full text-[10px] font-bold border ${COHORT_CONFIG[cohort].badge}`}>{groupedPlayers[cohort].length}</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">{COHORT_CONFIG[cohort].subtitle}</p>
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
          <button className="absolute inset-0 bg-black/40" onClick={() => setIsGuideOpen(false)} aria-label="Close guide" />
          <div className="relative bg-white rounded-3xl border border-gray-200 max-w-5xl w-full shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-3 font-bold tracking-[0.15em] uppercase text-gray-900">Action Matrix Guide</h2>
                <button onClick={() => setIsGuideOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={30} /></button>
              </div>
              <div className="mt-5 bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500 text-sm flex items-center gap-3">
                <Info size={18} />
                <p>The Action Matrix segments your roster based on <strong>Performance under pressure</strong> and <strong>Cultural fit</strong>.</p>
              </div>
            </div>

            <div className="border-b border-gray-200 px-4 flex gap-1">
              {(Object.keys(GUIDE_CONTENT) as CohortKey[]).map(tab => (
                <button key={tab} onClick={() => setGuideTab(tab)} className={`px-5 py-3 text-2 font-medium ${guideTab === tab ? 'border border-gray-200 border-b-white rounded-t-lg -mb-px text-gray-900' : 'text-gray-500'}`}>
                  {GUIDE_CONTENT[tab].title}
                </button>
              ))}
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div>
                <span className={`inline-block px-4 py-1 rounded-md text-sm font-semibold ${GUIDE_CONTENT[guideTab].tagClass}`}>{GUIDE_CONTENT[guideTab].tag}</span>
                <h3 className="mt-3 text-5 font-bold text-gray-800">{GUIDE_CONTENT[guideTab].title}</h3>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-gray-500">The Player Profile</p>
                <p className="mt-4 text-2xl leading-relaxed text-gray-700">{GUIDE_CONTENT[guideTab].profile}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-gray-500">The Playbook Strategy</p>
                <div className="mt-4 border border-gray-200 rounded-xl bg-gray-50 p-6 flex gap-4">
                  <MoveRight className={`mt-1 ${GUIDE_CONTENT[guideTab].arrowClass}`} />
                  <p className="text-2xl leading-relaxed text-gray-700">{GUIDE_CONTENT[guideTab].playbook}</p>
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
