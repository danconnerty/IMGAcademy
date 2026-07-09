
import React from 'react';
import { Info } from 'lucide-react';

export interface RubricLevel {
    min: number;
    max: number;
    range: string;
    rating: string;
    ratingColor: string;
    desc: string;
    quote: string;
    bullets: string[];
}

export const RUBRIC_DATA: RubricLevel[] = [
    {
      min: 75,
      max: 100,
      range: "75% - 100%",
      rating: "EXCEPTIONAL",
      ratingColor: "bg-ink text-white border-ink",
      desc: "This player processes the game exactly like the coach. In high-pressure moments, they will instinctively make the decision the coach would have called. They require minimal verbal instruction because the intent is implicitly understood.",
      quote: "A symbiotic relationship where intent is implicitly understood. The athlete operates as an on-field extension of the coaching philosophy.",
      bullets: [
          "Minimize verbal instruction; rely on shared instincts to drive decision making.",
          "Empower this player to lead on-field adjustments without prior approval.",
          "Focus coaching on micro-refinements rather than system installation."
      ]
    },
    {
      min: 62.5,
      max: 74.9,
      range: "62.5% - 74%",
      rating: "STRONG",
      ratingColor: "bg-chip text-ink border-line-strong",
      desc: "This player agrees with the coach's goals but may see a different path to get there. They will execute the system, but they will ask questions in the film room. This friction is healthy; it prevents the coach from becoming stale without breaking the system.",
      quote: "A productive partnership driven by healthy friction. The athlete executes the system but constantly stress-tests the logic behind it.",
      bullets: [
          "Encourage questions in film sessions to leverage their analytical processing.",
          "Explain the 'why' behind scheme changes to ensure full buy-in.",
          "Use their skepticism to pressure-test new game plans before implementation."
      ]
    },
    {
      min: 50,
      max: 62.4,
      range: "50% - 62%",
      rating: "CONDITIONAL",
      ratingColor: "bg-chip text-ink border-line-strong",
      desc: "This is a transactional fit. The player does not naturally \"get\" the coach's philosophy. The relationship requires constant maintenance (clear rules, explicit rewards). If playing time drops or the team loses, the disconnect in values will surface as conflict.",
      quote: "This relationship requires constant maintenance. While goals may align, the path to achieving them differs significantly, necessitating clear rules and explicit rewards.",
      bullets: [
          "Refine communication to blend collaborative discussion with the athlete's preference for clear, direct guidance.",
          "Acknowledge the athlete's gradual approach to trust-building, ensuring consistent effort fosters deeper connection.",
          "Integrate more initial explanations into the 'learning by doing' teaching style to fully support the athlete's preferred balance."
      ]
    },
    {
      min: 37.5,
      max: 49.9,
      range: "37.5% - 49%",
      rating: "DEVELOPMENTAL",
      ratingColor: "bg-white text-body border-line-strong",
      desc: "This player fundamentally sees the game differently than the coach (e.g., a \"Freestyler\" playing for a \"System Coach\"). To make this work, the coach must compromise their standard operating procedure. You are not just recruiting a player; you are signing up for a management challenge.",
      quote: "A management challenge requiring structural compromise. The athlete's natural instincts often conflict with the system's demands.",
      bullets: [
          "Establish strict non-negotiables to prevent 'freestyling' in critical moments.",
          "Accept that high-variance play is part of the package; do not over-coach creativity.",
          "Require explicit confirmation of instructions to bridge the communication gap."
      ]
    },
    {
      min: 0,
      max: 37.4,
      range: "0% - 37%",
      rating: "POOR",
      ratingColor: "bg-white text-gray-brand border-line",
      desc: "The player's instincts are the exact inverse of the coach's demands. Every instruction will feel like a constraint to the player. The coach will view the player as \"uncoachable,\" and the player will view the coach as \"controlling.\" This is a roster spot wasted on internal conflict.",
      quote: "Fundamental incompatibility. The athlete views the coaching style as a constraint rather than a support system.",
      bullets: [
          "Drastically simplify the role to minimize decision-making friction.",
          "Focus purely on physical output; tactical alignment is unlikely to occur.",
          "Prepare for potential transfer or roster turnover if playing time decreases."
      ]
    }
  ];

interface FitScoreRubricProps {
  score?: number;
  isModal?: boolean;
}

const FitScoreRubric: React.FC<FitScoreRubricProps> = ({ score, isModal = false }) => {
  const displayRows = score !== undefined 
    ? RUBRIC_DATA.filter(r => score >= r.min && score <= r.max)
    : RUBRIC_DATA;

  const containerClasses = isModal
    ? "w-full bg-white overflow-hidden"
    : "w-full nt-card overflow-hidden";

  const headerPadding = isModal ? "px-8 pt-8 pb-6" : "px-6 py-4";
  const cellPadding = isModal ? "px-8" : "px-6";

  return (
    <div className={containerClasses}>
      <div className={`${headerPadding} border-b border-line flex items-center justify-between bg-white`}>
          <h3 className="font-mono text-[11px] font-medium text-ink uppercase tracking-[0.16em]">
            {score !== undefined ? 'Projected Dynamic' : 'Alignment Score Rubric'}
          </h3>
          {score !== undefined && <Info size={16} strokeWidth={1.8} className="text-gray-soft" />}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line bg-chip/40">
              <th className={`py-4 font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] w-32 whitespace-nowrap ${cellPadding}`}>Score Range</th>
              <th className={`py-4 font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] w-32 ${cellPadding}`}>Rating</th>
              <th className={`py-4 font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] ${cellPadding}`}>Coach/Player Dynamic</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {displayRows.map((row, idx) => (
              <tr key={idx} className={score !== undefined ? "bg-chip/40" : "hover:bg-chip transition-colors"}>
                <td className={`py-6 font-mono text-xs font-medium text-ink tabular-nums whitespace-nowrap align-top ${cellPadding}`}>{row.range}</td>
                <td className={`py-6 align-top ${cellPadding}`}>
                  <span className={`px-2 py-1 rounded-card font-mono text-[10px] font-medium uppercase tracking-[0.12em] border ${row.ratingColor}`}>
                    {row.rating}
                  </span>
                </td>
                <td className={`py-6 text-xs text-body leading-relaxed align-top ${cellPadding}`}>
                  {row.desc}
                </td>
              </tr>
            ))}
             {displayRows.length === 0 && (
                <tr>
                    <td colSpan={3} className={`py-6 text-xs text-gray-brand text-center ${cellPadding}`}>
                        Score data unavailable for this range.
                    </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FitScoreRubric;
