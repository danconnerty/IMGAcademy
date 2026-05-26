import { Player } from '../types';
import { ALL_ROSTERS, SPORT_CONFIG } from '../mockRoster';
import { RECRUIT_PLAYERS } from '../mockRecruits';
import { DRILLS, COMMUNICATION_STYLES, LEARNING_STYLES, MOTIVATIONAL_ANCHORS, getPlayerProfile, getPlayerPrescribedDrills, getPlayerSeed, StyleDefinition } from '../utils/playerInsights';

export interface RagMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SPORT_LABELS: Record<string, string> = {
  football: 'Football', baseball: 'Baseball', softball: 'Softball',
  mbball: "Men's Basketball", wbball: "Women's Basketball",
  msoccer: "Men's Soccer", wsoccer: "Women's Soccer",
  mvolleyball: "Men's Volleyball", wvolleyball: "Women's Volleyball",
  hockey: 'Hockey'
};

function extractTerms(text: string): string[] {
  const stopWords = new Set(['the','and','for','with','that','this','from','have',
    'what','who','when','where','which','show','give','about','does','please',
    'could','would','their','across','sports','tell','me','is','are','was','a','an',
    'his','her','him','they','them','more','too','also']);
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
    .filter(t => t.length >= 3 && !stopWords.has(t));
}

function scoreMatch(text: string, terms: string[]): number {
  const lower = text.toLowerCase();
  return terms.reduce((s, t) => s + (lower.includes(t) ? 1 : 0), 0);
}

// Players whose names appear in the recent assistant message get a heavy
// match-score boost so follow-ups like "tell me more about David" resolve
// to the David the assistant just mentioned, not an arbitrary other one.
function extractFocusedPlayerIds(history: RagMessage[], pool: Player[]): Set<string> {
  const focus = new Set<string>();
  const recent = history.slice(-2).filter(m => m.role === 'assistant').map(m => m.content.toLowerCase()).join(' ');
  if (!recent) return focus;
  for (const p of pool) {
    if (recent.includes(p.name.toLowerCase())) focus.add(p.id);
  }
  return focus;
}

function detectSport(query: string): string | null {
  const q = query.toLowerCase();

  const isWomens = /\b(women'?s?|female|girls?|woman)\b/.test(q);
  const isMens   = /\b(men'?s?|male|boys?|man)\b/.test(q) && !isWomens;

  if (/\b(basketball|bball)\b/.test(q)) {
    if (isWomens) return 'wbball';
    if (isMens)   return 'mbball';
    return null;
  }
  if (/\b(football)\b/.test(q)) return 'football';
  if (/\b(baseball)\b/.test(q)) return 'baseball';
  if (/\b(softball)\b/.test(q)) return 'softball';
  if (/\b(hockey)\b/.test(q)) return 'hockey';
  if (/\b(soccer)\b/.test(q)) {
    if (isWomens) return 'wsoccer';
    if (isMens)   return 'msoccer';
    return null;
  }
  if (/\b(volleyball)\b/.test(q)) {
    if (isWomens) return 'wvolleyball';
    if (isMens)   return 'mvolleyball';
    return null;
  }

  return null;
}

function formatPlayerDoc(p: Player): string {
  const profile = getPlayerProfile(p);
  const drills = getPlayerPrescribedDrills(p, 2);
  const parts = [
    `${p.name} (${SPORT_LABELS[p.sport] ?? p.sport}, ${p.type})`,
    `Position=${p.position}`, `Class=${p.level}`,
    `Clutch Factor=${p.clutchFactor}`,
    `Alignment Score=${p.fitScore ?? 'n/a'}`,
    `Communication Style=${profile.communication.name} (${profile.communication.description} Strategy: ${profile.communication.strategy})`,
    `Learning Style=${profile.learning.name} (${profile.learning.description})`,
    `Motivational Anchor=${profile.motivation.name} (${profile.motivation.description})`,
    `Prescribed Drills=${drills.map(d => `${d.title} — ${d.breakdown.slice(0, 200)}`).join('; ')}`
  ];
  if (p.type === 'recruit') {
    parts.push(`Commitment=${p.recruitCommitment ?? 'n/a'}`, `Invite Status=${p.inviteStatus ?? 'n/a'}`);
  }
  return parts.join(', ');
}

interface BuildContextOpts {
  sportOverride?: string | null;
  focusIds?: Set<string>;
}

function buildContext(query: string, opts: BuildContextOpts = {}): string {
  const { sportOverride, focusIds = new Set<string>() } = opts;
  const terms = extractTerms(query);
  const sport = sportOverride !== undefined ? sportOverride : detectSport(query);
  const sections: string[] = [];
  const ql = query.toLowerCase();

  // Normalise plural/singular
  const expandedTerms = [...new Set(terms.flatMap(t => t.endsWith('s') ? [t, t.slice(0, -1)] : [t, t + 's']))];

  // Search players (roster + recruits)
  const allPlayers: Player[] = [
    ...Object.values(ALL_ROSTERS).flat(),
    ...RECRUIT_PLAYERS
  ].filter(p => !sport || p.sport === sport);

  // Score players with three signals:
  //   1) base substring match against name/position/sport/level
  //   2) +5 if exact full-name match appears in the query (strong intent signal)
  //   3) +3 if this player was already in the prior assistant turn (conversational focus)
  const matchedPlayers = allPlayers
    .map(p => {
      let score = scoreMatch(`${p.name} ${p.position} ${SPORT_LABELS[p.sport] ?? p.sport} ${p.level}`, expandedTerms);
      if (ql.includes(p.name.toLowerCase())) score += 5;
      if (focusIds.has(p.id) && score > 0) score += 3;
      return { p, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(x => x.p);

  if (matchedPlayers.length > 0) {
    sections.push('MATCHED ATHLETES:\n' + matchedPlayers.map(p => formatPlayerDoc(p)).join('\n'));
  }

  // Leaderboard if ranking requested
  const wantsRank = /\b(top|highest|best|lowest|bottom|worst|leader|rank|most|least)\b/.test(ql);
  const wantsBottom = /\b(bottom|worst|lowest|least)\b/.test(ql);
  if (wantsRank) {
    const sportPlayers = sport
      ? (ALL_ROSTERS[sport] ?? [])
      : Object.values(ALL_ROSTERS).flat();

    const wantsClutch = /\b(clutch|pressure)\b/.test(ql);
    const wantsFit    = /\b(fit|alignment)\b/.test(ql);

    if (wantsClutch || (!wantsFit)) {
      const sorted = [...sportPlayers].sort((a, b) =>
        wantsBottom ? a.clutchFactor - b.clutchFactor : b.clutchFactor - a.clutchFactor
      ).slice(0, 5);
      const label = wantsBottom ? 'BOTTOM BY CLUTCH FACTOR' : 'TOP BY CLUTCH FACTOR';
      sections.push(`${label}:\n` + sorted.map((p, i) =>
        `${i + 1}. ${p.name} (${SPORT_LABELS[p.sport] ?? p.sport}) - ${p.clutchFactor}`
      ).join('\n'));
    }
    if (wantsFit) {
      const sorted = [...sportPlayers].filter(p => p.fitScore != null)
        .sort((a, b) =>
          wantsBottom ? (a.fitScore ?? 0) - (b.fitScore ?? 0) : (b.fitScore ?? 0) - (a.fitScore ?? 0)
        ).slice(0, 5);
      const label = wantsBottom ? 'BOTTOM BY ALIGNMENT SCORE' : 'TOP BY ALIGNMENT SCORE';
      sections.push(`${label}:\n` + sorted.map((p, i) =>
        `${i + 1}. ${p.name} (${SPORT_LABELS[p.sport] ?? p.sport}) - ${p.fitScore}`
      ).join('\n'));
    }
  }

  // Class/level queries
  const wantsLevel = /\b(freshman|freshmen|sophomore|sophomores|junior|juniors|senior|seniors|redshirt|class|year|experience)\b/.test(ql);
  if (wantsLevel) {
    const pool = sport ? (ALL_ROSTERS[sport] ?? []) : Object.values(ALL_ROSTERS).flat();
    const levelGroups: Record<string, Player[]> = {};
    pool.forEach(p => {
      (levelGroups[p.level] ??= []).push(p);
    });
    const lines = Object.entries(levelGroups)
      .sort(([, a], [, b]) => b.length - a.length)
      .map(([level, players]) => `${level} (${players.length}): ${players.slice(0, 5).map(p => p.name).join(', ')}${players.length > 5 ? ` +${players.length - 5} more` : ''}`);
    sections.push('ATHLETES BY CLASS:\n' + lines.join('\n'));
  }

  // Quadrant / concern-based queries
  const wantsQuadrant = /\b(at.?risk|developing|needs?\s*work|concern\w*|struggling|underperform\w*|elite|high.?variance|foundation|quadrant\w*|cohort\w*)\b/.test(ql);
  if (wantsQuadrant) {
    const pool = sport ? (ALL_ROSTERS[sport] ?? []) : Object.values(ALL_ROSTERS).flat();
    const elite = pool.filter(p => p.clutchFactor >= 750 && (p.fitScore ?? 0) >= 62.5);
    const highVariance = pool.filter(p => p.clutchFactor >= 750 && (p.fitScore ?? 0) < 62.5);
    const foundation = pool.filter(p => p.clutchFactor < 750 && (p.fitScore ?? 0) >= 62.5);
    const atRisk = pool.filter(p => p.clutchFactor < 750 && (p.fitScore ?? 0) < 62.5);
    const fmt = (p: Player) => `  ${p.name} (${SPORT_LABELS[p.sport]}) - Clutch=${p.clutchFactor}, Alignment=${p.fitScore}`;
    sections.push(`DASHBOARD QUADRANTS:\nElite Athletes (${elite.length}): Clutch>=750, Alignment>=62.5%\n${elite.map(fmt).join('\n')}\n\nHigh Variance (${highVariance.length}): Clutch>=750, Alignment<62.5%\n${highVariance.map(fmt).join('\n')}\n\nFoundation Athletes (${foundation.length}): Clutch<750, Alignment>=62.5%\n${foundation.map(fmt).join('\n')}\n\nAt Risk (${atRisk.length}): Clutch<750, Alignment<62.5%\n${atRisk.map(fmt).join('\n')}`);
  }

  // Recruit evaluation summary
  const wantsRecruits = /\b(recruit\w*|prospect\w*|commit\w*|candidate\w*|pipeline|scouting|offer\w*|sign\w*|uncommit\w*)\b/.test(ql);
  if (wantsRecruits) {
    const recruits = RECRUIT_PLAYERS.filter(p => !sport || p.sport === sport);
    const fmtRecruit = (p: Player) =>
      `  ${p.name} (${SPORT_LABELS[p.sport] ?? p.sport}) - Clutch=${p.clutchFactor}, Alignment=${p.fitScore}, Commitment=${p.recruitCommitment ?? 'n/a'}`;
    const signed = recruits.filter(p => p.recruitCommitment === 'signed');
    const offered = recruits.filter(p => p.recruitCommitment === 'offered');
    const uncommitted = recruits.filter(p => p.recruitCommitment === 'uncommitted' || !p.recruitCommitment);
    const lines: string[] = [];
    if (signed.length > 0) lines.push(`SIGNED (${signed.length}):\n` + signed.map(fmtRecruit).join('\n'));
    if (offered.length > 0) lines.push(`OFFERED (${offered.length}):\n` + offered.slice(0, 10).map(fmtRecruit).join('\n'));
    if (uncommitted.length > 0) lines.push(`UNCOMMITTED (${uncommitted.length}):\n` + uncommitted.slice(0, 10).map(fmtRecruit).join('\n'));
    if (lines.length > 0) sections.push('RECRUIT PIPELINE:\n' + lines.join('\n'));
  }

  // Sport / roster summary
  const wantsPoolInfo = /\b(roster|how\s*many|headcount|size|total|count|overview|summary|team)\b/.test(ql);
  const summarySports = sport
    ? [sport]
    : wantsPoolInfo ? Object.keys(SPORT_CONFIG) : [];
  for (const s of summarySports) {
    const cfg = SPORT_CONFIG[s];
    if (!cfg) continue;
    const players = ALL_ROSTERS[s] ?? [];
    const avgClutch = players.reduce((sum, p) => sum + p.clutchFactor, 0) / (players.length || 1);
    const avgFit = players.filter(p => p.fitScore != null).reduce((sum, p) => sum + (p.fitScore ?? 0), 0) / (players.filter(p => p.fitScore != null).length || 1);
    sections.push(`SPORT SUMMARY (${SPORT_LABELS[s] ?? s}):\nRoster size=${cfg.size}, Athletes=${players.length}, Positions=${cfg.positions.join(', ')}, Avg Clutch=${avgClutch.toFixed(1)}, Avg Alignment=${avgFit.toFixed(1)}`);
  }

  // Drills
  const matchedDrills = DRILLS
    .map(d => ({ d, score: scoreMatch(`${d.title} ${d.breakdown} ${d.insight}`, expandedTerms) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.d);
  if (matchedDrills.length > 0) {
    sections.push('RELEVANT DRILLS:\n' + matchedDrills.map(d =>
      `${d.title}: ${d.breakdown.slice(0, 120)}...`
    ).join('\n'));
  }

  // Communication / coaching style queries
  const wantsCommunication = /\b(communicat\w*|approach\w*|talk\w*|speak\w*|correct\w*|mentor\w*|coach\w*|teach\w*|learn\w*|motivat\w*|style)\b/.test(ql);
  if (wantsCommunication) {
    const formatStyle = (s: StyleDefinition) => `${s.name}: ${s.description} Strategy: ${s.strategy}`;
    sections.push('COMMUNICATION STYLES:\n' + COMMUNICATION_STYLES.map(formatStyle).join('\n'));
    sections.push('LEARNING STYLES:\n' + LEARNING_STYLES.map(formatStyle).join('\n'));
    sections.push('MOTIVATIONAL ANCHORS:\n' + MOTIVATIONAL_ANCHORS.map(formatStyle).join('\n'));
  }

  if (sections.length === 0) {
    // Generic sport overview
    const overview = Object.entries(SPORT_CONFIG).map(([id, cfg]) => {
      const players = ALL_ROSTERS[id] ?? [];
      const avg = players.reduce((s, p) => s + p.clutchFactor, 0) / (players.length || 1);
      return `${SPORT_LABELS[id] ?? id}: roster=${cfg.size}, athletes=${players.length}, avg clutch=${avg.toFixed(1)}`;
    });
    sections.push('SPORT OVERVIEW:\n' + overview.join('\n'));
  }

  return sections.join('\n\n');
}

export async function askRag(
  message: string,
  history: RagMessage[]
): Promise<string> {
  // Detect sport from current message first, then fall back to recent history
  let sport = detectSport(message);
  if (!sport) {
    const historySport = history.slice(-6).map(m => m.content).join(' ');
    sport = detectSport(historySport);
  }
  const sportLabel = sport ? (SPORT_LABELS[sport] ?? sport) : null;

  // Pull names mentioned in the prior assistant turn so follow-up questions
  // ("tell me more about David") resolve to the right person.
  const allPlayersForFocus: Player[] = [
    ...Object.values(ALL_ROSTERS).flat(),
    ...RECRUIT_PLAYERS
  ];
  const focusIds = extractFocusedPlayerIds(history, allPlayersForFocus);

  const context = buildContext(message, { sportOverride: sport, focusIds });

  const coachingGuidance = `

When asked about communication with athletes, coaching interaction styles, or how to approach specific interpersonal situations:
- Reference the athlete's communication style, learning style, and motivational anchor to tailor advice to how they are wired.
- Offer practical suggestions framed as options or considerations, not rigid directives. Use language like "consider," "one approach could be," or "based on their profile, they may respond well to."
- Acknowledge that context matters — game situation, relationship history, and individual temperament all affect what works best.
- Never prescribe a single "correct" way to handle interpersonal dynamics. Present the data and let the user draw their own conclusions.

When asked about athlete readiness or development:
- Use clutch factor, class/year, and motivational anchor to inform your analysis.
- For high-stakes situations, look for athletes with high clutch factor (750+) and composed profiles.
- Present multiple candidates with their trade-offs rather than declaring a single "best" choice.

When asked about recruits or the prospect pipeline:
- Reference commitment status (signed, offered, uncommitted) to show where each prospect is in the pipeline.
- Use clutch factor and alignment score to compare recruit quality.

Score interpretation — use these EXACT rubrics from the dashboard when discussing athlete metrics:

Clutch Factor (0-1000, measures performance under pressure):
- ELITE (800-1000): Performance typically improves as game pressure increases. Actively maintains composure in high-leverage moments. Appears visibly calm.
- HIGH (750-799): Consistent performance regardless of game situation. Does not let game pressure dictate internal state. Reliable and technically sound.
- ABOVE AVERAGE (725-749): Better-than-typical pressure stability and decision quality. Generally stays composed during difficult moments.
- AVERAGE (651-724): Performance generally stable but does not elevate under pressure. May experience some degradation in decision-making speed under extreme pressure.
- DEVELOPING (0-650): Performance visibly degrades under high-stakes conditions. Signs of rushing, hesitation, or misreads are common.

Alignment Score (0-100%, measures coaching style compatibility):
- EXCEPTIONAL (75-100%): Full alignment with coaching staff. Instinctively responds to coaching approach. Minimal adjustment needed.
- STRONG (62.5-74.9%): Core philosophy alignment. May approach specific situations differently. Productive friction.
- CONDITIONAL (50-62.4%): Does not naturally align. Requires deliberate maintenance through communication protocols.
- DEVELOPMENTAL (37.5-49.9%): Fundamental approach difference. Coaching relationship requires significant management overhead.
- POOR (0-37.4%): Instincts fundamentally at odds. Every directive creates friction. High disruption risk.

Dashboard Quadrants (used in Roster Alignment view):
- Elite Athletes: Clutch >= 750 AND Alignment >= 62.5% — high performance, high coaching fit.
- High Variance: Clutch >= 750 AND Alignment < 62.5% — strong under pressure but coaching style friction.
- Foundation Athletes: Clutch < 750 AND Alignment >= 62.5% — well-aligned but need development under pressure.
- At Risk: Clutch < 750 AND Alignment < 62.5% — low performance and low alignment, needs intervention.

CRITICAL — Data boundaries (do NOT fabricate information beyond what is in the evidence):
- You do NOT have access to: game logs, historical performance trends, error rates, play-level statistics, drill completion tracking, scheduling/availability, incident reports, coach written notes/feedback, or scholarship data.
- If asked about any of these, clearly state that the data is not available in the current system and suggest what the user can look at instead (e.g., current clutch factor and alignment scores as proxies for performance).
- Never invent specific game results, dates of incidents, percentages of plays made, or historical trends. Only reference data explicitly provided in the evidence.`;

  const systemPrompt = sportLabel
    ? `You are the NTangible youth sports intelligence assistant specializing in ${sportLabel}. Answer questions ONLY using ${sportLabel} data from the provided evidence. Do NOT reference or include athletes, recruits, or stats from any other sport. Be concise and specific with numbers when available. If asked about someone by name, look them up in the evidence.${coachingGuidance}`
    : `You are the NTangible youth sports intelligence assistant. Answer questions about athletes, recruits, clutch factors, alignment scores, and training drills using the provided evidence. Be concise and specific with numbers when available. If asked about someone by name, look them up in the evidence.${coachingGuidance}`;

  const contextHeader = sportLabel
    ? `[All evidence below is ${sportLabel} only. Do not infer or include data from other sports.]`
    : '';

  // Strip evidence blocks from history to avoid sending stale context on every turn.
  // Only keep the last 2 turns - new evidence is re-supplied with each request,
  // so longer history mostly burns tokens without adding signal.
  const cleanHistory = history.slice(-2).map(m =>
    m.role === 'user'
      ? { ...m, content: m.content.replace(/\n\nEvidence:[\s\S]*/i, '').trim() }
      : m
  );

  const messages = [
    ...cleanHistory,
    {
      role: 'user' as const,
      content: `Question: ${message}\n\nEvidence:\n${contextHeader ? contextHeader + '\n' : ''}${context}`
    }
  ];

  let response: Response;
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ system: systemPrompt, messages })
    });
  } catch (err) {
    console.error('Fetch failed:', err);
    throw new Error(`Network error: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!response.ok) {
    const err = await response.text();
    console.error('API error:', response.status, err);
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json() as { content: Array<{ type: string; text: string }> };
  return data.content.find(b => b.type === 'text')?.text ?? 'No response.';
}
