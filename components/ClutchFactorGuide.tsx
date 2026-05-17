import React, { useState } from 'react';
import { Activity, AlertTriangle, Info, Orbit, TrendingUp, Waves, X } from 'lucide-react';

type GuideTab = 'scoring' | 'methodology' | 'howto';

interface ClutchFactorGuideProps {
  onClose: () => void;
}

const ClutchFactorGuide: React.FC<ClutchFactorGuideProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<GuideTab>('scoring');

  const tabClass = (tab: GuideTab) =>
    `px-3 sm:px-5 py-2 sm:py-2.5 rounded-t-lg border text-xs sm:text-base lg:text-xl leading-tight whitespace-nowrap ${
      activeTab === tab ? 'bg-white border-gray-300 text-gray-900' : 'border-transparent text-gray-500'
    }`;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-2 py-3 sm:px-6 sm:py-6 lg:px-8">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-[#f8f8f8] rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 max-h-[94vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-gray-200 bg-[#f8f8f8]">
          <h2 className="text-base sm:text-2xl font-bold tracking-[0.15em] uppercase text-gray-900">Clutch Factor Guide</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 -m-1">
            <X size={24} className="sm:hidden" />
            <X size={30} className="hidden sm:block" />
          </button>
        </div>

        <div className="px-3 sm:px-6 pt-1 border-b border-gray-200 bg-[#f8f8f8] overflow-x-auto">
          <div className="flex gap-1 sm:gap-2 min-w-max">
            <button onClick={() => setActiveTab('scoring')} className={tabClass('scoring')}>Scoring Rubric</button>
            <button onClick={() => setActiveTab('methodology')} className={tabClass('methodology')}>Methodology & Insights</button>
            <button onClick={() => setActiveTab('howto')} className={tabClass('howto')}>How to Use</button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          {activeTab === 'scoring' && (
            <>
              <div className="rounded-xl border border-gray-200 bg-[#f1f3f6] p-4 sm:p-5">
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-3"><Info size={20} className="shrink-0" /> About Clutch Factor</p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">The Clutch Factor is a proprietary metric derived from psychometric testing that quantifies an athlete&apos;s ability to maintain or elevate performance during high-pressure coaching scenarios. It measures the delta between baseline cognitive processing and processing under simulated game-day stress - including contested calls, crowd pressure, and coach confrontations.</p>
              </div>

              <h3 className="text-base sm:text-xl font-bold text-gray-500 uppercase tracking-[0.15em]">Scoring Rubric</h3>
              <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <div className="hidden md:grid grid-cols-12 px-6 py-4 border-b text-sm font-bold text-gray-500 uppercase tracking-[0.12em]">
                  <div className="col-span-2">Score Range</div><div className="col-span-2">Rating</div><div className="col-span-8">Performance Profile</div>
                </div>
                {[
                  ['800 - 1000', 'ELITE', 'bg-lime-100 text-lime-800', 'Performance typically improves as game pressure increases. These athletes actively raise their level in high-leverage moments and appear visibly calm, making deliberate and decisive plays when stakes are highest.'],
                  ['750 - 799', 'HIGH', 'bg-blue-100 text-blue-800', 'Consistent execution regardless of game situation. These athletes do not let crowd noise or score dictate their internal state, remaining reliable and technically sound in contested moments.'],
                  ['725 - 749', 'ABOVE AVERAGE', 'bg-indigo-100 text-indigo-800', 'Shows better-than-typical pressure stability and decision quality on the floor. These athletes generally stay composed in difficult possessions and can be trusted to execute when game leverage rises.'],
                  ['651 - 724', 'AVERAGE', 'bg-amber-100 text-amber-800', 'Play quality is generally stable but does not elevate under pressure. May experience some degradation in decision-making speed or read clarity in extreme pressure situations, but remains functional.'],
                  ['0 - 650', 'DEVELOPING', 'bg-orange-100 text-orange-800', "Performance visibly degrades under high-stakes conditions. Signs of rushing, hesitation, or misreads are common. Requires specific mental conditioning and pressure development work."],
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-0 px-4 sm:px-6 py-4 sm:py-5 border-b last:border-b-0 md:items-start">
                    <div className="md:col-span-2 flex items-center gap-2 md:block">
                      <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-widest">Range</span>
                      <div className="text-base sm:text-xl font-semibold text-gray-800">{row[0]}</div>
                    </div>
                    <div className="md:col-span-2">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold tracking-wide ${row[2]}`}>{row[1]}</span>
                    </div>
                    <div className="md:col-span-8 text-sm sm:text-base text-gray-600 leading-relaxed">{row[3]}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'methodology' && (
            <>
              <h3 className="text-base sm:text-xl font-bold text-gray-500 uppercase tracking-[0.15em]">Understanding the Score</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {[
                  [TrendingUp, 'Performance Probability', 'The higher an athlete scores on the Clutch Factor, the more likely they are to perform in high-leverage game situations. A high score signifies a neurological ability to maintain cognitive processing speed and decisiveness when game-day stress increases.'],
                  [Activity, 'Holistic Context', 'Clutch Factor is one piece of the coaching profile, not the sole determinant of assignment readiness. It must be contextualized alongside coach alignment and experience level. High Clutch with low alignment may indicate crew assignment mismatch.'],
                  [AlertTriangle, 'The "Underdog" Pattern', 'Some athletes score exceptionally high in Clutch Factor despite fewer years of experience. They compensate for limited game experience with superior pressure processing and composure, often becoming reliable crew anchors faster than expected.'],
                  [Waves, 'The Experience/Composure Gap', 'A low Clutch Factor in a high-experience athlete is a specific development opportunity. It indicates that their procedural knowledge (experience) is strong, but their mental composure under pressure requires targeted development work.']
                ].map(([Icon, title, body], idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 bg-[#f1f3f6] p-4 sm:p-6">
                    <p className="text-base sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-3"><Icon size={20} className="text-blue-500 shrink-0" /> {title as string}</p>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{body as string}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-base sm:text-xl font-bold text-gray-500 uppercase tracking-[0.15em] pt-6 sm:pt-8">Predictive Correlations</h3>
              <div className="space-y-4">
                {[
                  ['Championship Assignment Readiness', 'Athletes scoring above 750 are significantly more likely to perform consistently in high-profile conference and postseason assignments based on observed performance patterns in the evaluation dataset.'],
                  ['Coach Compatibility', 'High Clutch Factor athletes show stronger adaptation to coach transitions - when reassigned to a new coach, they maintain consistent performance while athletes with lower scores may experience a temporary performance dip during adaptation.'],
                  ['Cross-Sport Consistency', 'Across all partner programs, higher Clutch Factor athletes consistently produce cleaner call records and lower protest rates. In high-tempo sports (Basketball/Hockey), this correlates to better positioning and faster decision-making under pace pressure.']
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 sm:gap-4 border-b border-gray-200 pb-5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">{idx + 1}</div>
                    <div className="min-w-0">
                      <p className="text-base sm:text-xl font-semibold text-gray-900">{item[0]}</p>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item[1]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'howto' && (
            <>
              <div className="rounded-xl border border-gray-200 bg-[#f1f3f6] p-4 sm:p-5">
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-3"><Orbit size={20} className="text-blue-500 shrink-0" /> Applying the Data</p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">The Clutch Factor is not just a label; it is a tool for decision-making. Use these four strategies to integrate cognitive metrics into your pool management and identification camp evaluation workflows.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {[
                  ['1. POOL HIERARCHY', 'Rank', 'Predictive Assignment Charting', "Don't just rank athletes by years of experience. Stack-rank your athlete pool based on Clutch Factor to identify who is truly ready for high-leverage tournament minutes.", '"Who do I trust in a championship game? Use this score to validate your instinct on who handles high-stakes pressure."'],
                  ['2. THE AUDIT', 'Compare', 'Experience vs. Composure Audit', 'Cross-reference experience level with Clutch Factor. Identify "Paper Veterans" (High Experience/Low Clutch) and "Composure Prospects" (Lower Experience/High Clutch).', '"If an athlete has years of experience but keeps struggling in big games, the disconnect is likely here. This score confirms if the issue is composure-related."'],
                  ['3. CAMP EVALUATION', 'Filter', 'Prospect Pre-Screening', 'Establish a Clutch Factor floor for conference advancement. Use the score to evaluate camp prospects before investing significant development resources.', '"Does this camp prospect have the baseline neurological resilience to handle conference-level coaching pressure? Evaluate early to avoid misaligned development investments."'],
                  ['4. DEVELOPMENT', 'Track', 'Longitudinal Tracking', 'On re-assessments, monitor if Clutch Factor is improving over time through targeted development drills.', '"A declining score is a leading indicator of burnout or off-field stress. Catch it before it shows up as a pattern of missed calls in high-stakes assignments."']
                ].map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
                    <div className="flex justify-between items-center gap-2 mb-3">
                      <p className="text-base sm:text-xl font-bold text-gray-800">{item[0]}</p>
                      <span className="px-2 sm:px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold shrink-0">{item[1]}</span>
                    </div>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900 mb-2">{item[2]}</p>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">{item[3]}</p>
                    <div className="rounded-lg bg-gray-100 p-3 sm:p-4 text-sm sm:text-base text-gray-700 italic leading-relaxed">{item[4]}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClutchFactorGuide;
