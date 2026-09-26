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
  if (fit >= 62.5 && player.clutchFactor >= 750) return { label: 'Top Profile', className: 'bg-ink text-white border-ink' };
  if (fit < 62.5 && player.clutchFactor < 750) return { label: 'At-Risk', className: 'bg-white text-ink border-ink' };
  return { label: 'Conditional', className: 'bg-chip text-body border-line-strong' };
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
        <h1 className="text-5 font-semibold tracking-tightest text-ink">Recruiting</h1>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="nt-btn-primary !py-2.5"
        >
          <Plus size={16} strokeWidth={1.8} />
          Send invite
        </button>
      </div>

      <div className="border-b border-line mb-6 flex items-center gap-6">
        <button onClick={() => setMainTab('active')} className={`pb-3 font-mono text-[11px] uppercase tracking-[0.22em] ${mainTab === 'active' ? 'text-ink border-b-2 border-ink' : 'text-gray-brand hover:text-ink'}`}>Active pipeline</button>
        <button onClick={() => setMainTab('archived')} className={`pb-3 font-mono text-[11px] uppercase tracking-[0.22em] ${mainTab === 'archived' ? 'text-ink border-b-2 border-ink' : 'text-gray-brand hover:text-ink'}`}>Archived</button>
      </div>

      <div className="nt-card p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'signed', 'offered', 'uncommitted'] as PipelineFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setPipelineFilter(filter)}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] rounded-pill border transition-colors ${pipelineFilter === filter ? 'bg-ink border-ink text-white' : 'bg-white border-line-strong text-gray-brand hover:text-ink hover:border-ink'}`}
              >
                {filter === 'all' ? 'All recruits' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                {mainTab === 'active' && (
                  <span className={`ml-1.5 tabular-nums ${pipelineFilter === filter ? 'text-white/70' : 'text-gray-brand'}`}>({activeTabCounts[filter]})</span>
                )}
              </button>
            ))}
            <span className="text-line-strong" aria-hidden="true">·</span>
            {(['completed', 'pending'] as CompletionFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setCompletionFilter(filter)}
                className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] rounded-pill border transition-colors ${completionFilter === filter ? 'bg-ink border-ink text-white' : 'bg-white border-line-strong text-gray-brand hover:text-ink hover:border-ink'}`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-gray-brand">Grad year</span>
            <div className="relative">
              <select value={gradYearFilter} onChange={(e) => setGradYearFilter(e.target.value)} className="appearance-none border border-line-strong rounded-card px-3 py-1.5 pr-8 text-sm bg-white text-ink">
                <option value="all">All</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
              <ChevronDown size={14} strokeWidth={1.8} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-brand pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="relative mt-4 mb-5">
          <Search size={16} strokeWidth={1.8} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-soft" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search recruits..." className="nt-input pl-7" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tightest text-ink mb-3">
          {mainTab === 'active' ? 'Recruiting pipeline' : 'Archived database'}
          <span className="text-gray-brand font-normal ml-2 tabular-nums">({tableRows.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="text-left font-mono text-[11px] uppercase tracking-[0.12em] text-gray-brand border-b border-line">
                <th className="py-3 font-medium">Name ↕</th>
                <th className="py-3 font-medium">Position ↕</th>
                <th className="py-3 font-medium">Graduation ↕</th>
                <th className="py-3 font-medium">Alignment ↕</th>
                <th className="py-3 font-medium">Clutch Factor ↓</th>
                <th className="py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-brand">No recruits found in this view</td>
                </tr>
              ) : (
                tableRows.map((player) => {
                  const signifier = getSignifier(player);
                  const commitment = getRecruitCommitment(player);
                  return (
                    <tr key={player.id} className="border-b border-line hover:bg-chip transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded-card border-line-strong accent-ink" />
                          <button
                            onClick={() => setSelectedPlayerId(player.id)}
                            className="text-ink hover:underline font-semibold"
                          >
                            {player.name}
                          </button>
                          <span className={`font-mono text-[10px] uppercase tracking-[0.1em] border px-2 py-0.5 rounded-pill ${signifier.className}`}>{signifier.label}</span>
                          <div className="relative">
                            <select
                              value={commitment ?? ''}
                              onChange={(e) => handleCommitmentChange(player.id, e.target.value as RecruitCommitment | '')}
                              className="appearance-none text-xs border border-line-strong rounded-card px-2 py-1 pr-6 bg-white text-ink"
                            >
                              <option value=""> </option>
                              <option value="signed">Signed</option>
                              <option value="offered">Offered</option>
                              <option value="uncommitted">Uncommitted</option>
                            </select>
                            <ChevronDown size={12} strokeWidth={1.8} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-brand pointer-events-none" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-body">{player.position}</td>
                      <td className="py-3 text-gray-brand tabular-nums">{player.graduationYear ?? '-'}</td>
                      <td className="py-3 font-mono font-semibold tabular-nums text-ink">{Math.round(player.fitScore ?? 0)}%</td>
                      <td className="py-3 font-mono font-semibold tabular-nums text-ink">{player.clutchFactor}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setSelectedPlayerId(player.id)} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink border border-line-strong rounded-pill px-2.5 py-1 hover:border-ink hover:bg-chip transition-colors">Player view</button>
                          <button onClick={() => onOpenAlignmentForPlayer?.(player.sport, player.id)} className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink border border-line-strong rounded-pill px-2.5 py-1 hover:border-ink hover:bg-chip transition-colors">Alignment</button>
                          {mainTab === 'active' ? (
                            <button onClick={() => setArchiveCandidate(player)} className="text-gray-brand hover:text-ink transition-colors" title="Archive athlete">
                              <Trash2 size={14} strokeWidth={1.8} />
                            </button>
                          ) : (
                            <button onClick={() => setRestoreCandidate(player)} className="text-gray-brand hover:text-ink transition-colors" title="Restore athlete">
                              <RotateCcw size={14} strokeWidth={1.8} />
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
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setArchiveCandidate(null)} />
          <div className="relative w-full max-w-md bg-white rounded-card shadow-lift border border-line-strong p-6">
            <h3 className="text-xl font-semibold tracking-tightest text-ink">Archive athlete?</h3>
            <p className="text-sm text-body mt-2">
              Do you want to archive <span className="font-semibold text-ink">{archiveCandidate.name}</span>? You can restore this athlete later from the Archived view.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setArchiveCandidate(null)} className="nt-btn-ghost !py-2 !px-4">Cancel</button>
              <button onClick={() => handleArchiveRecruit(archiveCandidate.id)} className="nt-btn-primary !py-2 !px-4">Yes, archive</button>
            </div>
          </div>
        </div>
      )}

      {restoreCandidate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setRestoreCandidate(null)} />
          <div className="relative w-full max-w-md bg-white rounded-card shadow-lift border border-line-strong p-6">
            <h3 className="text-xl font-semibold tracking-tightest text-ink">Restore athlete?</h3>
            <p className="text-sm text-body mt-2">
              Do you want to restore <span className="font-semibold text-ink">{restoreCandidate.name}</span> to the active recruiting pipeline?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setRestoreCandidate(null)} className="nt-btn-ghost !py-2 !px-4">Cancel</button>
              <button onClick={() => { handleRestoreRecruit(restoreCandidate.id); setRestoreCandidate(null); }} className="nt-btn-primary !py-2 !px-4">Yes, restore</button>
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
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative w-full max-w-3xl bg-white rounded-card border border-line-strong shadow-lift overflow-hidden">
            <div className="px-8 py-6 border-b border-line flex items-center justify-between">
              <h3 className="text-5 font-semibold tracking-tightest text-ink">Invite new player</h3>
              <button onClick={handleCloseModal} className="text-gray-brand hover:text-ink transition-colors"><X size={36} strokeWidth={1.5} /></button>
            </div>

            <div className="flex items-end border-b border-line px-8 pt-5">
              <button onClick={() => setInviteTab('single')} className={`px-8 py-3 font-mono text-[11px] uppercase tracking-[0.16em] border-b-2 ${inviteTab === 'single' ? 'border-ink text-ink' : 'border-transparent text-gray-brand hover:text-ink'}`}>Single invite</button>
              <button onClick={() => setInviteTab('bulk')} className={`px-8 py-3 font-mono text-[11px] uppercase tracking-[0.16em] border-b-2 ${inviteTab === 'bulk' ? 'border-ink text-ink' : 'border-transparent text-gray-brand hover:text-ink'}`}>Bulk upload</button>
            </div>

            {inviteTab === 'single' ? (
              <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-gray-brand mb-2">First name</label>
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" className="nt-input" />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-gray-brand mb-2">Last name</label>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" className="nt-input" />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-gray-brand mb-2">Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="nt-input" />
                </div>

                <div className="mt-6">
                  <label className="block font-mono text-[11px] uppercase tracking-[0.16em] text-gray-brand mb-2">Sport</label>
                  <div className="relative">
                    <select
                      value={inviteSport}
                      onChange={(e) => setInviteSport(e.target.value)}
                      disabled={!hasSelectedTeam}
                      className={`w-full appearance-none border-b bg-transparent px-0 py-2 pr-10 text-[15px] ${hasSelectedTeam ? 'border-line-strong text-ink focus:border-ink outline-none' : 'border-line text-gray-soft cursor-not-allowed'}`}
                    >
                      <option value="">{hasSelectedTeam ? 'Select sport...' : 'Select a team in header first'}</option>
                      {MOCK_TEAMS.map((team) => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} strokeWidth={1.8} className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-brand pointer-events-none" />
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-line flex justify-end gap-3">
                  <button onClick={handleCloseModal} className="nt-btn-ghost !py-2.5 !px-6">Cancel</button>
                  <button onClick={handleSubmitInvite} disabled={!firstName || !lastName || !email || !inviteSport} className="nt-btn-primary !py-2.5 !px-6 disabled:opacity-40">Send invite</button>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="border border-dashed border-line-strong rounded-card h-64 flex flex-col items-center justify-center text-center text-gray-brand">
                  <Upload size={34} strokeWidth={1.8} className="mb-3 text-gray-soft" />
                  <p className="text-2xl font-semibold tracking-tightest text-ink">Click to upload CSV</p>
                  <p className="text-base text-body">or drag and drop file here</p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <button className="nt-btn-link"><Download size={16} strokeWidth={1.8} /> Download template</button>
                  <div className="flex items-center gap-3">
                    <button onClick={handleCloseModal} className="nt-btn-ghost !py-2.5 !px-6">Cancel</button>
                    <button className="nt-btn-primary !py-2.5 !px-6">Upload</button>
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
