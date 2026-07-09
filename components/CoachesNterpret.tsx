
import React from 'react';
import { Brain, ArrowLeft } from 'lucide-react';

const QUESTIONS = [
  {
    id: "01",
    topic: "Role Definition",
    question: "How important is it to you that your players have clearly defined roles to perform at their best?",
    answer: "Critical. I operate best when every player knows their specific lane. Ambiguity leads to hesitation."
  },
  {
    id: "02",
    topic: "Adaptability Support",
    question: "When a player's role changes mid-season, how much do you expect them to adapt without extra support?",
    answer: "High expectation. We train for versatility; I expect them to leverage their foundational IQ to adjust immediately."
  },
  {
    id: "03",
    topic: "Communication Style",
    question: "What style of communication do you believe is most effective for improving performance?",
    answer: "Direct, brief, and objective. I prefer data-points over emotional narratives during competition."
  },
  {
    id: "04",
    topic: "Feedback Cadence",
    question: "How often do you typically give feedback or check-ins during training or competition?",
    answer: "Continuous micro-dosing. I provide immediate, short feedback loops after almost every rep rather than waiting for film sessions."
  },
  {
    id: "05",
    topic: "Pressure Motivation",
    question: "What coaching approach do you believe motivates players most under pressure?",
    answer: "High-stakes consequences. I simulate 'must-win' scenarios where failure has a tangible physical or social cost."
  },
  {
    id: "06",
    topic: "Accountability Style",
    question: "What accountability style do you believe works best when addressing player mistakes?",
    answer: "Public and immediate. The standard is the standard, and the team needs to see that no one is exempt."
  },
  {
    id: "07",
    topic: "Trust Formation",
    question: "How quickly do you expect trust to form between you and a new player?",
    answer: "Slow build. Trust is earned through weeks of consistent execution, not given freely upon arrival."
  },
  {
    id: "08",
    topic: "Teaching Approach",
    question: "What teaching approach do you believe works best for helping players learn new skills or strategies?",
    answer: "Experiential Discovery. I set up the constraints and let them fail until they figure out the solution themselves."
  },
  {
    id: "09",
    topic: "Decision-Making",
    question: "What decision-making style do you believe players should develop for high-pressure moments?",
    answer: "Instinctual Aggression. I prefer a player who makes a fast, aggressive mistake over one who hesitates to be perfect."
  },
  {
    id: "010",
    topic: "Team Culture",
    question: "What kind of team culture do you aim to create?",
    answer: "A regimented, precision-based unit where individual discipline creates collective freedom."
  }
];

const CoachesNterpret: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="mb-10 border-b border-line pb-8">
        <div className="flex items-center gap-3 mb-3">
          <Brain size={26} strokeWidth={1.8} className="text-ink" />
          <h1 className="text-3xl font-semibold text-ink tracking-tightest">Coaches <span className="font-semibold">NTerpret</span><span className="align-super text-sm">™</span></h1>
        </div>
        <p className="text-body max-w-2xl leading-relaxed">
          Your coaching philosophy profile. This data is used to calculate alignment scores with prospective recruits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {QUESTIONS.map((q) => (
          <div key={q.id} className="nt-card nt-card-hover p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.04] font-semibold text-6xl text-ink tabular-nums group-hover:opacity-[0.07] transition-opacity select-none">
              {q.id}
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[11px] font-medium bg-chip text-ink px-2 py-1 rounded-card uppercase tracking-[0.16em] tabular-nums">
                  {q.id}
                </span>
                <h3 className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em]">
                  {q.topic}
                </h3>
              </div>

              <h4 className="text-lg font-medium text-ink mb-6 min-h-[56px] leading-snug">
                {q.question}
              </h4>

              <div className="bg-chip p-5 rounded-card border-l-2 border-ink">
                <p className="text-sm font-medium text-body leading-relaxed italic">
                  "{q.answer}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 mb-20 nt-card p-6 flex justify-between items-center">
        <div>
          <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-2">Profile status · Active</p>
          <p className="text-gray-brand text-sm">Last updated: October 24, 2024</p>
        </div>
        <button className="nt-btn-primary">
          Edit profile
        </button>
      </div>
    </div>
  );
};

export default CoachesNterpret;
