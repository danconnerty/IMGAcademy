
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
      <div className="mb-10 border-b border-gray-200 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-black text-white p-2 rounded-lg">
            <Brain size={24} />
          </div>
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">COACHES <span className="font-bold">NTERPRET</span></h1>
        </div>
        <p className="text-gray-500 max-w-2xl leading-relaxed">
          Your coaching philosophy profile. This data is used to calculate alignment scores with prospective recruits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {QUESTIONS.map((q) => (
          <div key={q.id} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl text-gray-300 group-hover:opacity-10 transition-opacity select-none">
              {q.id}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase tracking-wider">
                  {q.id}
                </span>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {q.topic}
                </h3>
              </div>
              
              <h4 className="text-lg font-medium text-gray-900 mb-6 min-h-[56px]">
                {q.question}
              </h4>
              
              <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm font-semibold text-gray-700 leading-relaxed italic">
                  "{q.answer}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 mb-20 p-6 bg-gray-900 text-white rounded-xl flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg mb-1">Profile Status: Active</h3>
          <p className="text-gray-400 text-sm">Last updated: October 24, 2024</p>
        </div>
        <button className="px-6 py-2 bg-white text-black font-bold text-sm rounded hover:bg-gray-100 transition-colors uppercase tracking-widest">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default CoachesNterpret;
