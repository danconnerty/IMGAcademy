
import React, { useState, useMemo } from 'react';
import { X, Copy, ChevronRight, RefreshCw, Info, Activity, FileText, Brain, Dumbbell, Mic, GraduationCap, Rocket } from 'lucide-react';
import { Player } from '../types';
import FitScoreRubric, { RUBRIC_DATA } from './FitScoreRubric';
import ClutchAssessment from './ClutchAssessment';
import NTerpretAssessment from './NTerpretAssessment';
import { getPlayerPrescribedDrills, getPlayerProfile } from '../utils/playerInsights';

interface ScoutingModalProps {
  player: Player | null;
  allPlayers: Player[]; // Context needed for accurate rankings
  onClose: () => void;
}

type Tab = 'Rankings' | 'NSights' | 'Exercises' | 'NTerpret' | 'Alignment';

const DRILL_VIDEO_LINKS: Record<string, string> = {
  'focus interval training': 'https://www.youtube.com/watch?v=4pLUleLdwY4',
  'confidence scripting': 'https://www.youtube.com/watch?v=Q6M0S0d8uZk'
};

const PSYCH_TEMPLATES = {
    summary: [
        (name: string) => `${name} demonstrated significant involvement in a high-pressure situation by taking a lead role in the simulation. This indicates trust from the staff and clutch potential. However, ${name.split(' ')[0]} struggled to articulate the reasons behind performance variances. Enhancing understanding of game dynamics and self-reflection can help identify areas for growth, ultimately improving performance in clutch situations.`,
        (name: string) => `Analysis indicates ${name} thrives on competitive energy but occasionally lacks the cognitive framework to self-correct during 'spirals'. While physical output is high, data suggests a tendency to rush processing when the pocket collapses. ${name.split(' ')[0]} recognizes the need for mental poise but has not yet defined actionable steps to regain control in real-time.`,
        (name: string) => `${name}'s assessment reveals a player who pushes hard but can become emotionally reactive under duress. The 'Clutch' metrics show high engagement, yet decision-making speed fluctuates when things go off-script. Developing a consistent internal 'reset' mechanism is critical to transforming raw effort into surgical execution.`
    ],
    practiceSuggestion: [
        (name: string) => `Consider incorporating a scenario where ${name} faces a '2-Minute Drill' simulation with a deficit. Create a practice environment that replicates the pressure of the game, utilizing time constraints and noise. Encourage ${name.split(' ')[0]} to focus on specific breath-work strategies when feeling the pressure. This builds familiarity with high-stakes physiological responses.`,
        (name: string) => `Implement 'Adversity Scripts'. Start a drive for ${name} with a penalty or a negative play (e.g., 2nd & 20). This forces the athlete to practice 'Neutral Thinking' - ignoring the past error to execute the current assignment. Success is defined not just by the result, but by the maintenance of positive body language.`,
        (name: string) => `Utilize 'Constraint-Led' decision drills. Force ${name} to make pre-snap reads with limited information or disguised coverages while under physical load. This trains the brain to maintain executive function and process patterns even when the body is fatigued or the environment is chaotic.`
    ],
    approach: [
        (name: string) => `Engage ${name} in a conversation about recent experiences by asking open-ended questions. Inquire about feelings during the scrimmage and how performance was perceived. Frame the discussion around identifying specific moments of pressure and exploring what went through ${name.split(' ')[0]}'s mind at that time to foster a deeper understanding of mental processes.`,
        (name: string) => `Adopt a 'Socratic' review method. Instead of correcting errors on film, ask ${name}: 'What did you see here?' and 'What led you to that decision?'. This shifts the dynamic from passive instruction to active analysis, building the player's own internal feedback loop.`,
        (name: string) => `Focus on 'Process over Outcome'. When discussing performance, steer ${name} away from 'I played bad' statements. Direct the focus to specific mechanics and decisions. This detaches self-worth from the scoreboard and keeps execution clean under pressure.`
    ],
    coachingSuggestion: [
        (name: string) => `Encourage ${name} to keep a reflective journal focused on competitive experiences. This practice allows for analysis of performances, noting what worked well and what didn’t. By revisiting these entries, patterns can be identified to address specific challenges like handling the pressure of a championship environment.`,
        (name: string) => `Assign ${name} a specific 'Reset Anchor'. Identify a physical action (e.g., unstrapping gloves, a deep breath) that signals 'The last play is over'. Drill this: Error -> Anchor -> Next Play. This conditions the mind to flush mistakes instantly.`,
        (name: string) => `Implement 'Visualization Protocols'. Have ${name} spend 5 minutes pre-practice visualizing perfect execution of their specific role in a high-leverage situation. This 'mental rep' builds the neural pathways for confidence before the physical ball is even snapped.`
    ]
};

// --- HELPER: NAME RANDOMIZER FOR SYNTHETIC PEERS ---
const FIRST_NAMES = ["Jalen", "Caden", "Trey", "Deon", "Marcus", "Ty", "Kobe", "Jordan", "Isaiah", "Malik", "Cooper", "Brody", "Xavier", "Andre", "Zion"];
const LAST_NAMES = ["Williams", "Johnson", "Davis", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez"];

const getRandomName = () => {
    return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
};

const ScoutingModal: React.FC<ScoutingModalProps> = ({ player, allPlayers, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Rankings');
  const [activeReport, setActiveReport] = useState<'clutch' | 'nterpret' | null>(null);

  // We use useMemo to effectively "Randomize" the data for this specific player/session
  // Since 'player' changes when a new modal opens, this re-rolls the psych profile.
  const details = useMemo(() => {
    if (!player) return null;

    // 1. GENERATE SCORING RANGE
    // Elite = >800, Great = 751 - 799, Above Average = 725 - 750, Average = 651 - 724, Below Average = Under 650
    let scoringRange = '';
    const cf = player.clutchFactor;

    if (cf > 800) scoringRange = 'Elite';
    else if (cf >= 751) scoringRange = 'Great';
    else if (cf >= 725) scoringRange = 'Above Average';
    else if (cf >= 651) scoringRange = 'Average';
    else scoringRange = 'Below Average';
    
    // 2. GENERATE RANKINGS
    const generateRankingContext = (category: 'overall' | 'position' | 'grad') => {
        let pool = [...allPlayers];
        if (category === 'position') pool = pool.filter(p => p.position === player.position);
        else if (category === 'grad') pool = pool.filter(p => p.graduationYear === player.graduationYear);

        let rankedList = pool.map(p => ({
            name: p.name,
            score: p.clutchFactor,
            isMe: p.id === player.id
        }));

        if (rankedList.length < 6) {
            const needed = 6 - rankedList.length;
            for (let i = 0; i < needed; i++) {
                const variance = Math.floor(Math.random() * 150) - 75; 
                rankedList.push({
                    name: getRandomName(),
                    // Cap scores at 900 max
                    score: Math.max(0, Math.min(900, player.clutchFactor + variance)),
                    isMe: false
                });
            }
        }
        rankedList.sort((a, b) => b.score - a.score);
        const finalRankedWithIndex = rankedList.map((item, idx) => ({ ...item, rank: idx + 1 }));
        const myIndex = finalRankedWithIndex.findIndex(x => x.isMe);
        const specificRank = myIndex + 1;

        let viewSlice = [];
        if (finalRankedWithIndex.length <= 5) viewSlice = finalRankedWithIndex;
        else viewSlice = finalRankedWithIndex.slice(0, 8); 

        return { list: viewSlice, myRank: specificRank };
    };

    const overallData = generateRankingContext('overall');
    const positionData = generateRankingContext('position');
    const gradData = generateRankingContext('grad');

    // 3. GENERATE RANDOMIZED PSYCH REPORT (Replaces old NSights)
    // Select one random template for each section to create a unique report per player session
    const summaryTemplate = PSYCH_TEMPLATES.summary[Math.floor(Math.random() * PSYCH_TEMPLATES.summary.length)];
    const practiceTemplate = PSYCH_TEMPLATES.practiceSuggestion[Math.floor(Math.random() * PSYCH_TEMPLATES.practiceSuggestion.length)];
    const approachTemplate = PSYCH_TEMPLATES.approach[Math.floor(Math.random() * PSYCH_TEMPLATES.approach.length)];
    const coachingTemplate = PSYCH_TEMPLATES.coachingSuggestion[Math.floor(Math.random() * PSYCH_TEMPLATES.coachingSuggestion.length)];
    
    const psychReport = {
        summary: summaryTemplate(player.name),
        practice: practiceTemplate(player.name),
        approach: approachTemplate(player.name),
        coaching: coachingTemplate(player.name)
    };

    // 4. GENERATE PLAYER-SYNCED DRILLS + NTERPRET PROFILE
    const prescribedDrills = getPlayerPrescribedDrills(player, 2);
    const profile = getPlayerProfile(player);

    const nterpretSummary = `${player.name.split(',')[0]} demonstrates a ${profile.communication.name.toLowerCase()} communication style and learns best through ${profile.learning.name.toLowerCase()} instruction. Motivation is anchored in ${profile.motivation.name.toLowerCase()}, so coaching should reinforce that profile with consistent cues and role clarity.`;

    const coachingConsiderations = [
        profile.communication.strategy,
        profile.learning.strategy,
        profile.motivation.strategy
    ];

    const email = (() => {
        const parts = player.name.split(',');
        const lastName = parts[0].trim().toLowerCase();
        const firstName = parts[1] ? parts[1].trim().toLowerCase() : 'player';
        return `${firstName}.${lastName}+NControlTest1@gmail.com`;
    })();

    // 6. RUBRIC DATA MATCHING
    const rubricData = player.fitScore !== undefined 
        ? RUBRIC_DATA.find(r => player.fitScore! >= r.min && player.fitScore! <= r.max) 
        : undefined;

    return { 
        scoringRange, 
        email, 
        rankings: {
            overall: overallData.list,
            position: positionData.list,
            graduation: gradData.list,
            stats: { overallRank: overallData.myRank, posRank: positionData.myRank, gradRank: gradData.myRank }
        },
        psychReport, // New structured report
        exercises: prescribedDrills,
        nterpret: {
            summary: nterpretSummary,
            coachingConsiderations,
            learningStyle: profile.learning,
            commStyle: profile.communication,
            motivation: profile.motivation
        },
        rubric: rubricData
    };
  }, [player, allPlayers]);

  if (activeReport === 'clutch') {
      return <ClutchAssessment onBack={() => setActiveReport(null)} />;
  }

  if (activeReport === 'nterpret') {
      return <NTerpretAssessment onBack={() => setActiveReport(null)} />;
  }

  if (!player || !details) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl bg-white rounded-card border border-line-strong shadow-lift flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header Section */}
        <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 bg-white flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tightest mb-2 sm:mb-4">{player.name}</h1>
                    <div className="space-y-1.5">
                        <p className="text-sm text-body flex items-center gap-2"><span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gray-brand w-16">Position</span> {player.position}</p>
                        <p className="text-sm text-body flex items-center gap-2"><span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gray-brand w-16">Level</span> {player.level}</p>
                        <p className="text-sm text-body flex items-center gap-2 truncate max-w-xs sm:max-w-none">
                            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gray-brand w-16 flex-shrink-0">Email</span> {details.email}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                     <button
                        onClick={() => setActiveReport('clutch')}
                        className="px-3 py-2 bg-white hover:border-ink border border-line-strong text-body hover:text-ink font-mono text-[10px] font-medium uppercase tracking-[0.16em] rounded-pill transition-colors flex items-center gap-2"
                     >
                        <FileText size={14} strokeWidth={1.8} />
                        Clutch Report
                     </button>
                     <button
                        onClick={() => setActiveReport('nterpret')}
                        className="px-3 py-2 bg-white hover:border-ink border border-line-strong text-body hover:text-ink font-mono text-[10px] font-medium uppercase tracking-[0.16em] rounded-pill transition-colors flex items-center gap-2"
                     >
                        <Brain size={14} strokeWidth={1.8} />
                        NTerpret Report
                     </button>
                     <button className="text-gray-brand hover:text-ink ml-2 hidden sm:block transition-colors">
                        <Copy size={18} strokeWidth={1.8} />
                     </button>
                </div>
            </div>

            {/* Metrics Row - Stack on mobile, row on desktop */}
            <div className="border border-line-strong rounded-card flex flex-wrap md:flex-nowrap divide-y md:divide-y-0 md:divide-x divide-line">
                <div className="w-1/2 md:flex-1 p-4">
                    <p className="font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-1">Clutch Factor</p>
                    <p className="text-2xl sm:text-3xl font-semibold text-ink tracking-tightest tabular-nums">{player.clutchFactor}</p>
                </div>
                <div className="w-1/2 md:flex-1 p-4">
                    <p className="font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-1">Alignment</p>
                    <p className={`text-2xl sm:text-3xl font-semibold tracking-tightest tabular-nums ${player.fitScore !== undefined ? 'text-ink' : 'text-gray-brand'}`}>
                        {player.fitScore !== undefined ? `${player.fitScore}%` : 'N/A'}
                    </p>
                </div>
                <div className="w-full md:flex-1 p-4">
                    <p className="font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-1">Scoring Range</p>
                    <p className="text-2xl sm:text-3xl font-semibold text-ink tracking-tightest leading-tight">{details.scoringRange}</p>
                </div>
                <div className="w-1/2 md:flex-1 p-4">
                    <p className="font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-1">Overall Rank</p>
                    <p className="text-2xl sm:text-3xl font-semibold text-ink tracking-tightest tabular-nums">#{details.rankings.stats.overallRank}</p>
                </div>
                <div className="w-1/2 md:flex-1 p-4">
                    <p className="font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-1">Positional Rank</p>
                    <p className="text-2xl sm:text-3xl font-semibold text-ink tracking-tightest tabular-nums">#{details.rankings.stats.posRank}</p>
                </div>
            </div>
        </div>

        {/* Tabs - Scrollable on mobile */}
        <div className="px-6 sm:px-8 border-b border-line bg-white flex-shrink-0 overflow-x-auto scrollbar-hide">
             <div className="flex gap-8 min-w-max">
                {(['Rankings', 'NSights', 'Exercises', 'NTerpret', 'Alignment'] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-3 font-mono text-[11px] uppercase tracking-[0.16em] border-b-2 transition-colors ${
                            activeTab === tab
                            ? 'text-ink border-ink'
                            : 'text-gray-brand border-transparent hover:text-ink'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
             </div>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto bg-white p-6 sm:p-8">
            {activeTab === 'Rankings' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {/* Overall */}
                    <div>
                        <h3 className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-4">Overall leaderboard</h3>
                        <div className="space-y-4">
                            {details.rankings.overall.map((item) => (
                                <div key={item.name} className={`flex items-center justify-between text-sm ${item.isMe ? 'bg-chip -mx-2 px-2 py-2 rounded-card border border-line-strong' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-brand w-4 font-mono tabular-nums">{item.rank}.</span>
                                        <span className={`font-medium ${item.isMe ? 'text-ink' : 'text-body'}`}>{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-mono font-medium tabular-nums ${item.isMe ? 'text-ink' : 'text-ink'}`}>{item.score}</span>
                                        <div className="w-12 h-1.5 bg-line rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.isMe ? 'bg-ink' : 'bg-line-strong'}`}
                                                style={{ width: `${(item.score / 1000) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Position */}
                    <div>
                         <h3 className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-4">Position leaders ({player.position})</h3>
                         <div className="space-y-4">
                            {details.rankings.position.map((item) => (
                                <div key={item.name} className={`flex items-center justify-between text-sm ${item.isMe ? 'bg-chip -mx-2 px-2 py-2 rounded-card border border-line-strong' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-brand w-4 font-mono tabular-nums">{item.rank}.</span>
                                        <span className={`font-medium ${item.isMe ? 'text-ink' : 'text-body'}`}>{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-mono font-medium tabular-nums ${item.isMe ? 'text-ink' : 'text-ink'}`}>{item.score}</span>
                                        <div className="w-12 h-1.5 bg-line rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.isMe ? 'bg-ink' : 'bg-line-strong'}`}
                                                style={{ width: `${(item.score / 1000) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Graduation */}
                    <div>
                         <h3 className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-4">Class leaders ({player.graduationYear})</h3>
                          <div className="space-y-4">
                            {details.rankings.graduation.map((item) => (
                                <div key={item.name} className={`flex items-center justify-between text-sm ${item.isMe ? 'bg-chip -mx-2 px-2 py-2 rounded-card border border-line-strong' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-brand w-4 font-mono tabular-nums">{item.rank}.</span>
                                        <span className={`font-medium ${item.isMe ? 'text-ink' : 'text-body'}`}>{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-mono font-medium tabular-nums ${item.isMe ? 'text-ink' : 'text-ink'}`}>{item.score}</span>
                                        <div className="w-12 h-1.5 bg-line rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.isMe ? 'bg-ink' : 'bg-line-strong'}`}
                                                style={{ width: `${(item.score / 1000) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'Alignment' && (
                 <div className="max-w-5xl space-y-8">
                     {player.fitScore !== undefined && details.rubric ? (
                        <>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Validated Metrics Card */}
                                <div className="nt-card p-8 flex flex-col justify-between relative overflow-hidden">
                                    {/* Pulse graphic background effect */}
                                    <div className="absolute top-8 right-8 text-line opacity-60">
                                         <Activity size={120} strokeWidth={1} />
                                    </div>

                                    <div>
                                        <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-1">Validated metrics</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-6xl font-semibold text-ink tracking-tightest tabular-nums">{player.fitScore}%</span>
                                        </div>
                                    </div>

                                    <div className="relative z-10 mt-8">
                                         <p className="font-mono text-[11px] font-medium text-ink uppercase tracking-[0.16em] mb-1">
                                             {details.rubric.rating}
                                         </p>
                                         <p className="text-xs text-gray-brand">Based on 10 psychometric dimensions</p>
                                    </div>
                                </div>

                                {/* Executive Summary Card */}
                                <div className="md:col-span-2 nt-card p-8 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="w-7 h-7 rounded-full border border-line-strong bg-white flex items-center justify-center">
                                            <Activity size={14} strokeWidth={1.8} className="text-ink" />
                                        </span>
                                        <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em]">Executive summary</p>
                                    </div>

                                    <p className="text-lg text-body italic leading-relaxed mb-6 font-medium">
                                        "{details.rubric.quote}"
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {details.rubric.bullets.map((bullet, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-ink mt-2 flex-shrink-0"></div>
                                                <p className="text-xs text-gray-brand leading-relaxed">
                                                    {bullet}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             </div>

                             {/* Projected Dynamic Table Row */}
                             <div className="nt-card overflow-hidden">
                                 <div className="px-6 py-4 border-b border-line bg-white">
                                     <h3 className="font-mono text-[11px] font-medium text-ink uppercase tracking-[0.16em]">Projected dynamic</h3>
                                 </div>
                                 <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-chip/40 border-b border-line">
                                                <th className="px-6 py-4 font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] w-32 whitespace-nowrap">Score Range</th>
                                                <th className="px-6 py-4 font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] w-32">Rating</th>
                                                <th className="px-6 py-4 font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em]">Coach/Player Dynamic</th>
                                                <th className="px-6 py-4 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-white">
                                                <td className="px-6 py-6 text-sm font-medium text-body whitespace-nowrap align-top tabular-nums">{details.rubric.range}</td>
                                                <td className="px-6 py-6 align-top">
                                                    <span className="px-2 py-1 rounded-card font-mono text-[10px] font-medium uppercase tracking-[0.12em] border border-line-strong bg-white text-ink">
                                                        {details.rubric.rating}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 text-sm text-body leading-relaxed align-top">
                                                    {details.rubric.desc}
                                                </td>
                                                <td className="px-6 py-6 align-top text-gray-soft">
                                                    <Info size={16} strokeWidth={1.8} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                 </div>
                             </div>
                        </>
                    ) : (
                         <div className="py-12 text-center text-gray-brand italic">
                             No alignment data available for this player.
                         </div>
                    )}
                 </div>
            )}

            {activeTab === 'NSights' && (
                <div className="max-w-4xl space-y-8">
                    {/* Summary Section */}
                    <div>
                         <h3 className="text-base font-semibold text-ink tracking-tightest mb-2">Summary</h3>
                         <p className="text-sm text-body leading-relaxed">{details.psychReport.summary}</p>
                    </div>

                    {/* Practice Suggestion Section */}
                    <div>
                         <h3 className="text-base font-semibold text-ink tracking-tightest mb-2">Practice suggestion</h3>
                         <p className="text-sm text-body leading-relaxed">{details.psychReport.practice}</p>
                    </div>

                    {/* Approach Section */}
                    <div>
                         <h3 className="text-base font-semibold text-ink tracking-tightest mb-2">Approach</h3>
                         <p className="text-sm text-body leading-relaxed">{details.psychReport.approach}</p>
                    </div>

                    {/* Coaching Suggestion Section */}
                    <div>
                         <h3 className="text-base font-semibold text-ink tracking-tightest mb-2">Coaching suggestion</h3>
                         <p className="text-sm text-body leading-relaxed">{details.psychReport.coaching}</p>
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-line mt-8">
                         <div className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.12em] flex items-center gap-2">
                             <RefreshCw size={12} strokeWidth={1.8} />
                             Analysis updated from latest session data
                         </div>
                    </div>
                </div>
            )}

            {activeTab === 'Exercises' && (
                <div className="max-w-4xl space-y-8">
                    <div className="mb-6">
                        <p className="text-sm text-body">Based on {player.name.split(',')[0]}'s assessment, these 2 drills are recommended to improve clutch performance.</p>
                    </div>
                    <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-gray-brand mb-3">Prescribed development plan</h4>
                    {details.exercises.map((ex) => {
                        const videoUrl = DRILL_VIDEO_LINKS[ex.title.toLowerCase()];

                        return (
                          <div key={ex.id} className="nt-card p-4 space-y-3">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <span className="h-10 w-10 rounded-full border border-line-strong bg-white text-ink flex items-center justify-center"><Dumbbell size={18} strokeWidth={1.8} /></span>
                                  <div>
                                    <p className="font-semibold text-base text-ink tracking-tightest">{ex.title}</p>
                                    <p className="text-body text-sm">{ex.breakdown.slice(0, 100)}...</p>
                                  </div>
                                </div>
                              </div>
                              {videoUrl && (
                                <a
                                  href={videoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="group relative block overflow-hidden rounded-card border border-line-strong"
                                  aria-label={`Open ${ex.title} drill video on YouTube`}
                                >
                                  <img
                                    src={`https://i.ytimg.com/vi/${new URL(videoUrl).searchParams.get('v')}/hqdefault.jpg`}
                                    alt={`${ex.title} YouTube drill video thumbnail`}
                                    className="h-36 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="rounded-pill bg-ink px-4 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white">
                                      Watch drill on YouTube →
                                    </span>
                                  </div>
                                </a>
                              )}
                          </div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'NTerpret' && (
                <div className="max-w-4xl space-y-8 pb-8">
                    <div>
                        <h3 className="text-base font-semibold text-ink tracking-tightest mb-2">Summary</h3>
                        <p className="text-sm text-body leading-relaxed">{details.nterpret.summary}</p>
                    </div>

                    <div>
                         <h3 className="text-base font-semibold text-ink tracking-tightest mb-2">Coaching considerations</h3>
                         <ul className="list-disc pl-5 space-y-2">
                            {details.nterpret.coachingConsiderations.map((note, idx) => (
                                <li key={idx} className="text-sm text-body leading-relaxed">{note}</li>
                            ))}
                         </ul>
                    </div>

                    <div className="p-2 grid grid-cols-1 xl:grid-cols-3 gap-4">
                        <div className="nt-card p-6 text-center">
                          <Mic size={18} strokeWidth={1.8} className="mx-auto text-ink" />
                          <p className="font-mono text-[10px] mt-4 uppercase tracking-[0.16em] text-gray-brand font-medium">Communication Style</p>
                          <p className="text-2xl mt-1 font-semibold text-ink tracking-tightest">{details.nterpret.commStyle.name}</p>
                          <p className="text-sm text-body mt-4">{details.nterpret.commStyle.description}</p>
                        </div>
                        <div className="nt-card p-6 text-center">
                          <GraduationCap size={18} strokeWidth={1.8} className="mx-auto text-ink" />
                          <p className="font-mono text-[10px] mt-4 uppercase tracking-[0.16em] text-gray-brand font-medium">Learning Style</p>
                          <p className="text-2xl mt-1 font-semibold text-ink tracking-tightest">{details.nterpret.learningStyle.name}</p>
                          <p className="text-sm text-body mt-4">{details.nterpret.learningStyle.description}</p>
                        </div>
                        <div className="nt-card p-6 text-center">
                          <Rocket size={18} strokeWidth={1.8} className="mx-auto text-ink" />
                          <p className="font-mono text-[10px] mt-4 uppercase tracking-[0.16em] text-gray-brand font-medium">Motivation Anchor</p>
                          <p className="text-2xl mt-1 font-semibold text-ink tracking-tightest">{details.nterpret.motivation.name}</p>
                          <p className="text-sm text-body mt-4">{details.nterpret.motivation.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-line bg-white flex justify-end flex-shrink-0">
             <button
                onClick={onClose}
                className="nt-btn-primary !py-2.5 !px-6"
             >
                Close
             </button>
        </div>
      </div>
    </div>
  );
};

export default ScoutingModal;
