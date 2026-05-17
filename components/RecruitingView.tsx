import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Download, Plus, RotateCcw, Search, Trash2, Upload, X } from 'lucide-react';
import { Player } from '../types';
import ScoutingModal from './ScoutingModal';
import { MOCK_TEAMS } from '../mockTeams';

interface RecruitingViewProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  selectedTeamId?: string | null;
  hasSelectedTeam?: boolean;
  onOpenAlignmentForPlayer?: (teamId: string, playerId: string) => void;
}

type InviteTab = 'single' | 'bulk';
type MainTab = 'active' | 'archived';
type PipelineFilter = 'all' | 'signed' | 'offered' | 'uncommitted';
type CompletionFilter = 'completed' | 'pending';
type RecruitCommitment = Exclude<PipelineFilter, 'all'>;

const getSignifier = (player: Player) => {
  const fit = player.fitScore ?? 0;
  if (fit >= 62.5 && player.clutchFactor >= 750) return { label: 'Top Profile', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  if (fit < 62.5 && player.clutchFactor < 750) return { label: 'At-Risk', className: 'bg-rose-100 text-rose-700 border-rose-200' };
  return { label: 'Conditional', className: 'bg-amber-100 text-amber-700 border-amber-200' };
};

const getRecruitCommitment = (player: Player): RecruitCommitment | undefined => player.recruitCommitment;

const RecruitingView: React.FC<RecruitingViewProps> = ({
  players,
  setPlayers,
  selectedTeamId = null,
  hasSelectedTeam = false,
  onOpenAlignmentForPlayer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteTab, setInviteTab] = useState<InviteTab>('single');
  const [mainTab, setMainTab] = useState<MainTab>('active');
  const [pipelineFilter, setPipelineFilter] = useState<PipelineFilter>('all');
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('completed');
  const [gradYearFilter, setGradYearFilter] = useState<string>('all');
  const [archiveCandidate, setArchiveCandidate] = useState<Player | null>(null);
  const [restoreCandidate, setRestoreCandidate] = useState<Player | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [inviteSport, setInviteSport] = useState('');

  useEffect(() => {
    if (selectedTeamId) {
      setInviteSport(selectedTeamId);
    }
  }, [selectedTeamId]);

  const allRecruits = useMemo(() => {
    return players.filter((p) => p.type === 'recruit' && (!selectedTeamId || p.sport === selectedTeamId));
  }, [players, selectedTeamId]);

  const activePipeline = useMemo(
    () => allRecruits.filter((p) => p.inviteStatus !== 'sent' && !p.isArchived),
    [allRecruits]
  );

  const archivedPipeline = useMemo(
    () => allRecruits.filter((p) => p.inviteStatus !== 'sent' && p.isArchived),
    [allRecruits]
  );

  const tableRows = useMemo(() => {
    const rows = mainTab === 'active' ? activePipeline : archivedPipeline;

    return rows
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((p) => (gradYearFilter === 'all' ? true : String(p.graduationYear) === gradYearFilter))
      .filter((p) => {
        if (pipelineFilter === 'all') return true;
        return getRecruitCommitment(p) === pipelineFilter;
      })
      .filter((p) => {
        if (completionFilter === 'pending') return p.inviteStatus === 'opened' || p.inviteStatus === 'sent';
        return p.inviteStatus !== 'sent';
      })
      .sort((a, b) => b.clutchFactor - a.clutchFactor);
  }, [activePipeline, archivedPipeline, completionFilter, gradYearFilter, mainTab, pipelineFilter, searchQuery]);

  const activeTabCounts = useMemo(() => {
    return {
      all: activePipeline.length,
      signed: activePipeline.filter((p) => getRecruitCommitment(p) === 'signed').length,
      offered: activePipeline.filter((p) => getRecruitCommitment(p) === 'offered').length,
      uncommitted: activePipeline.filter((p) => getRecruitCommitment(p) === 'uncommitted').length
    };
  }, [activePipeline]);

  const handleCloseModal = () => {
    setIsInviteModalOpen(false);
    setInviteTab('single');
    setFirstName('');
    setLastName('');
    setEmail('');
    setInviteSport(selectedTeamId ?? '');
  };

  const handleSubmitInvite = () => {
    if (!firstName || !lastName || !email || !inviteSport) return;

    const newPlayer: Player = {
      id: `invite-${Date.now()}`,
      type: 'recruit',
      name: `${lastName}, ${firstName}`,
      sport: inviteSport,
      position: 'ATH',
      level: 'HS Senior',
      round: 'Prospect',
      graduationYear: 2025,
      clutchFactor: 0,
      status: 'active',
      needsRetest: false,
      lastTestedDate: new Date().toISOString(),
      inviteStatus: 'sent',
      dateInvited: 'Just now',
      fitScore: undefined,
      height: '-',
      weight: '-'
    };

    setPlayers((prev) => [newPlayer, ...prev]);
    handleCloseModal();
  };

  const handleCommitmentChange = (playerId: string, commitment: RecruitCommitment | '') => {
    setPlayers((prev) => prev.map((player) => (player.id === playerId ? { ...player, recruitCommitment: commitment || undefined } : player)));
    if (commitment) {
      setPipelineFilter(commitment);
    }
    setMainTab('active');
  };

  const handleArchiveRecruit = (playerId: string) => {
    setPlayers((prev) => prev.map((player) => (player.id === playerId ? { ...player, isArchived: true } : player)));
    setArchiveCandidate(null);
  };

  const handleRestoreRecruit = (playerId: string) => {
    setPlayers((prev) => prev.map((player) => (player.id === playerId ? { ...player, isArchived: false } : player)));
    setMainTab('active');
  };

  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-5 font-semibold text-gray-900">Recruiting</h1>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          Send invite
        </button>
      </div>

      <div className="border-b border-gray-200 mb-6 flex items-center gap-6">
        <button onClick={() => setMainTab('active')} className={`pb-3 text-sm font-semibold ${mainTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Active Pipeline</button>
        <button onClick={() => setMainTab('archived')} className={`pb-3 text-sm font-semibold ${mainTab === 'archived' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Archived</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'signed', 'offered', 'uncommitted'] as PipelineFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setPipelineFilter(filter)}
                className={`px-3 py-1.5 text-xs rounded-md border ${pipelineFilter === filter ? 'bg-white border-gray-300 text-gray-900 font-semibold' : 'bg-slate-100 border-transparent text-gray-600'}`}
              >
                {filter === 'all' ? 'All Recruits' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                {mainTab === 'active' && (
                  <span className="ml-1.5 text-gray-400">({activeTabCounts[filter]})</span>
                )}
              </button>
            ))}
            <span className="text-gray-300">|</span>
            {(['completed', 'pending'] as CompletionFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setCompletionFilter(filter)}
                className={`px-3 py-1.5 text-xs rounded-md border ${completionFilter === filter ? 'bg-white border-gray-300 text-gray-900 font-semibold' : 'bg-slate-100 border-transparent text-gray-600'}`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase font-semibold tracking-wide text-gray-500">Grad Year</span>
            <div className="relative">
              <select value={gradYearFilter} onChange={(e) => setGradYearFilter(e.target.value)} className="appearance-none border border-gray-200 rounded-md px-3 py-1.5 pr-8 text-sm bg-white">
                <option value="all">All</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="relative mt-4 mb-5">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search recruits..." className="w-full border border-gray-100 bg-slate-50 rounded-md py-2.5 pl-9 pr-3 text-sm" />
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          {mainTab === 'active' ? 'Recruiting Pipeline' : 'Archived Database'}
          <span className="text-gray-400 font-normal ml-2">({tableRows.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-600 border-b border-gray-200">
                <th className="py-3 font-semibold">Name ↕</th>
                <th className="py-3 font-semibold">Position ↕</th>
                <th className="py-3 font-semibold">Graduation ↕</th>
                <th className="py-3 font-semibold">Alignment ↕</th>
                <th className="py-3 font-semibold">Clutch Factor ↓</th>
                <th className="py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">No recruits found in this view</td>
                </tr>
              ) : (
                tableRows.map((player) => {
                  const signifier = getSignifier(player);
                  const commitment = getRecruitCommitment(player);
                  return (
                    <tr key={player.id} className="border-b border-gray-100">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300" />
                          <button
                            onClick={() => setSelectedPlayerId(player.id)}
                            className="text-blue-600 hover:underline font-semibold"
                          >
                            {player.name}
                          </button>
                          <span className={`text-[10px] border px-2 py-0.5 rounded-full font-semibold ${signifier.className}`}>{signifier.label}</span>
                          <div className="relative">
                            <select
                              value={commitment ?? ''}
                              onChange={(e) => handleCommitmentChange(player.id, e.target.value as RecruitCommitment | '')}
                              className="appearance-none text-xs border border-gray-200 rounded-md px-2 py-1 pr-6 bg-slate-50"
                            >
                              <option value=""> </option>
                              <option value="signed">Signed</option>
                              <option value="offered">Offered</option>
                              <option value="uncommitted">Uncommitted</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-gray-700">{player.position}</td>
                      <td className="py-3 text-gray-500">{player.graduationYear ?? '-'}</td>
                      <td className="py-3 font-semibold text-gray-700">{Math.round(player.fitScore ?? 0)}%</td>
                      <td className="py-3 font-semibold text-gray-700">{player.clutchFactor}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setSelectedPlayerId(player.id)} className="text-xs text-blue-600 border border-blue-300 rounded px-2 py-0.5 hover:bg-blue-50">Player View</button>
                          <button onClick={() => onOpenAlignmentForPlayer?.(player.sport, player.id)} className="text-xs text-indigo-600 border border-indigo-300 rounded px-2 py-0.5 hover:bg-indigo-50">Alignment</button>
                          {mainTab === 'active' ? (
                            <button onClick={() => setArchiveCandidate(player)} className="text-gray-500 hover:text-rose-600" title="Archive athlete">
                              <Trash2 size={14} />
                            </button>
                          ) : (
                            <button onClick={() => setRestoreCandidate(player)} className="text-gray-500 hover:text-emerald-600" title="Restore athlete">
                              <RotateCcw size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {archiveCandidate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/45" onClick={() => setArchiveCandidate(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900">Archive athlete?</h3>
            <p className="text-sm text-gray-600 mt-2">
              Do you want to archive <span className="font-semibold">{archiveCandidate.name}</span>? You can restore this athlete later from the Archived view.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setArchiveCandidate(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Cancel</button>
              <button onClick={() => handleArchiveRecruit(archiveCandidate.id)} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold">Yes, archive</button>
            </div>
          </div>
        </div>
      )}

      {restoreCandidate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/45" onClick={() => setRestoreCandidate(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900">Restore athlete?</h3>
            <p className="text-sm text-gray-600 mt-2">
              Do you want to restore <span className="font-semibold">{restoreCandidate.name}</span> to the active recruiting pipeline?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setRestoreCandidate(null)} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700">Cancel</button>
              <button onClick={() => { handleRestoreRecruit(restoreCandidate.id); setRestoreCandidate(null); }} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold">Yes, restore</button>
            </div>
          </div>
        </div>
      )}


      {selectedPlayerId && (
        <ScoutingModal
          player={allRecruits.find((player) => player.id === selectedPlayerId) ?? null}
          allPlayers={allRecruits}
          onClose={() => setSelectedPlayerId(null)}
        />
      )}

      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/45" onClick={handleCloseModal} />
          <div className="relative w-full max-w-3xl bg-white rounded-[22px] shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-5 font-medium text-gray-800">Invite new player</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-700"><X size={36} strokeWidth={1.5} /></button>
            </div>

            <div className="flex items-end border-b border-gray-200 px-8 pt-5">
              <button onClick={() => setInviteTab('single')} className={`px-8 py-3 rounded-t-lg border ${inviteTab === 'single' ? 'border-gray-300 border-b-white bg-white text-gray-900' : 'border-transparent text-gray-500'}`}>Single Invite</button>
              <button onClick={() => setInviteTab('bulk')} className={`px-8 py-3 rounded-t-lg border ${inviteTab === 'bulk' ? 'border-gray-300 border-b-white bg-white text-gray-900' : 'border-transparent text-gray-500'}`}>Bulk Upload</button>
            </div>

            {inviteTab === 'single' ? (
              <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xl font-semibold text-gray-600 mb-2">First name</label>
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" className="w-full border border-gray-200 bg-slate-50 rounded-xl px-4 py-3 text-3.5" />
                  </div>
                  <div>
                    <label className="block text-xl font-semibold text-gray-600 mb-2">Last name</label>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" className="w-full border border-gray-200 bg-slate-50 rounded-xl px-4 py-3 text-3.5" />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-xl font-semibold text-gray-600 mb-2">Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full border border-gray-200 bg-slate-50 rounded-xl px-4 py-3 text-3.5" />
                </div>

                <div className="mt-5">
                  <label className="block text-xl font-semibold text-gray-600 mb-2">Sport</label>
                  <div className="relative">
                    <select
                      value={inviteSport}
                      onChange={(e) => setInviteSport(e.target.value)}
                      disabled={!hasSelectedTeam}
                      className={`w-full appearance-none border rounded-xl px-4 py-3 pr-10 text-4 ${hasSelectedTeam ? 'border-indigo-200 bg-white' : 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'}`}
                    >
                      <option value="">{hasSelectedTeam ? 'Select sport...' : 'Select a team in header first'}</option>
                      {MOCK_TEAMS.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                <div className="mt-7 pt-5 border-t border-gray-200 flex justify-end gap-3">
                  <button onClick={handleCloseModal} className="px-8 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-800 font-medium">Cancel</button>
                  <button onClick={handleSubmitInvite} disabled={!firstName || !lastName || !email || !inviteSport} className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-40">Send Invite</button>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl h-64 flex flex-col items-center justify-center text-center text-gray-500">
                  <Upload size={34} className="mb-3 text-gray-400" />
                  <p className="text-2xl font-semibold text-gray-800">Click to upload CSV</p>
                  <p className="text-xl">or drag and drop file here</p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <button className="inline-flex items-center gap-2 text-blue-500 text-2xl"><Download size={18} /> Download template</button>
                  <div className="flex items-center gap-3">
                    <button onClick={handleCloseModal} className="px-8 py-3 rounded-xl bg-gray-500 text-white font-medium">Cancel</button>
                    <button className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold">Upload</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitingView;
