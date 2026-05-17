
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ClutchAssessmentProps {
  onBack?: () => void;
}

const ClutchAssessment: React.FC<ClutchAssessmentProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E7EB] font-sans selection:bg-white/20 selection:text-white overflow-x-hidden">
      <style>{`
        .font-display { font-family: 'Oswald', sans-serif; }
        .font-tech { font-family: 'Rajdhani', sans-serif; }
        .glass-panel {
            background: rgba(10, 10, 10, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .glass-card {
            background: rgba(20, 20, 20, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .glass-card:hover {
            background: rgba(30, 30, 30, 0.6);
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 30px -10px rgba(255, 255, 255, 0.1);
        }
        .hero-text-glow {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
        .bg-surface-highlight { background-color: #141414; }
        .bg-gradient-primary { background-image: linear-gradient(to right, #FFFFFF, #9CA3AF); }
      `}</style>

      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Exit Report
        </button>
      )}

      {/* Background patterns */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(at 10% 10%, rgba(20, 20, 20, 0.1) 0px, transparent 60%),
            radial-gradient(at 90% 10%, rgba(20, 20, 20, 0.1) 0px, transparent 60%),
            radial-gradient(at 50% 90%, rgba(20, 20, 20, 0.05) 0px, transparent 60%)
          `
        }}
      />

      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-12">
        
        {/* Header Section */}
        <section className="relative min-h-[50vh] flex flex-col justify-center items-center text-center overflow-hidden rounded-2xl glass-panel p-6 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent opacity-30 pointer-events-none"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
              <span className="w-2 h-2 rounded-full bg-white mr-2"></span>
              <span className="text-[10px] md:text-xs font-mono text-gray-300 tracking-widest uppercase">Analysis Complete // December 19 2025</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-bold uppercase leading-[0.85] tracking-tight relative group">
              <span className="block text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-gray-500 transition-all duration-500">Reagan</span>
              <span className="block text-transparent bg-clip-text bg-gradient-primary drop-shadow-2xl hero-text-glow mt-2">Zepeda</span>
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto my-6"></div>
            <p className="text-lg md:text-2xl font-tech text-gray-400 uppercase tracking-[0.3em] font-light">
              NTANGIBLE ASSESSMENT / CLUTCH FACTOR REPORT
            </p>
          </div>
          <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-luminosity" style={{ backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQwIDAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgZmlsbD0ibm9uZSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==")`}}></div>
        </section>

        {/* Score Section */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card rounded-xl p-6 md:p-10 flex flex-col justify-center items-center relative overflow-hidden group">
              <h2 className="text-xl md:text-2xl font-tech font-bold text-gray-400 uppercase tracking-widest mb-8 md:mb-12">Clutch Factor™</h2>
              <div className="flex flex-col items-center justify-center my-4 md:my-8">
                <span className="text-8xl md:text-[12rem] leading-none font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter drop-shadow-2xl">850</span>
                <span className="text-xs font-mono text-white uppercase tracking-widest mt-4">Scored on 1000 point scale</span>
              </div>
              <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-full mt-8">
                <span className="text-sm font-bold text-gray-200 uppercase tracking-wider">Highest Score: TBD</span>
              </div>
            </div>
            <div className="glass-card rounded-xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-center">
              <div className="flex flex-col space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-6 bg-[#F59E0B] rounded-full"></div>
                  <h3 className="text-lg md:text-xl font-display font-bold text-white uppercase tracking-wide">What Do NTangible Scores Mean</h3>
                </div>
                <p className="text-sm text-gray-400 font-light leading-relaxed">
                  NTangible Scores accurately measure mental fitness, reflecting self-perception in sports roles. These scores predict performance, evolve over time, and establish baselines for improvement. Like physical skills, mental fitness can be trained to enhance overall athletic performance.
                </p>
              </div>
              <div className="space-y-4 font-tech">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-gray-400 uppercase tracking-wider text-xs md:text-sm">Elite</span>
                  <span className="font-mono font-bold text-green-400">800+</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-gray-400 uppercase tracking-wider text-xs md:text-sm">Great</span>
                  <span className="font-mono font-bold text-emerald-400">750 - 799</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-gray-400 uppercase tracking-wider text-xs md:text-sm">Above Average</span>
                  <span className="font-mono font-bold text-white">725 - 749</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-gray-400 uppercase tracking-wider text-xs md:text-sm">Average</span>
                  <span className="font-mono font-bold text-yellow-400">651 - 724</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-gray-400 uppercase tracking-wider text-xs md:text-sm">Below Average</span>
                  <span className="font-mono font-bold text-orange-400">650 and under</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explanation Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 md:p-12 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute -left-32 -top-32 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6 md:mb-8">
                <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-wide">Your Assessment Explained</h2>
              </div>
              <p className="text-gray-300 font-light leading-relaxed text-base md:text-lg max-w-2xl">
                You did well recognizing the importance of your routine and focusing on it during a high-pressure situation. Your ability to stay involved and understand the impact of your actions shows great potential. Since your score suggests there’s room to strengthen your mental focus and resilience, continuing to develop these areas will support your growth as an athlete. Keep building on your awareness of your mental game, and remember that every experience is an opportunity to learn and improve. With consistent effort, you can enhance your confidence and focus under pressure, leading to even greater success on the field.
              </p>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-surface-highlight border border-white/10 p-6 md:p-8 rounded-2xl relative overflow-hidden group h-full flex flex-col justify-center shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-gray-500/5 opacity-50"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <h4 className="text-white font-bold font-display uppercase tracking-wide text-lg md:text-xl">Momentum Message</h4>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-purple-500/50 to-transparent mb-6"></div>
                <p className="text-sm text-gray-300 leading-relaxed font-light">
                  Reagan, every pitch and every moment on the field is a chance to grow stronger mentally and physically. Your awareness of the game situation shows you have the foundation to develop incredible resilience and focus. By dedicating time to mental training, you can turn challenges into opportunities, boosting your confidence and consistency. Remember, even the most accomplished athletes continually refine their mental skills. Keep pushing forward, stay committed to your routines, and trust in your ability to rise to each new challenge. Your best is yet to come!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Exercises Section */}
        <section className="space-y-8 relative py-8 md:py-12 px-6 lg:px-12 -mx-4 lg:-mx-8 rounded-3xl overflow-hidden shadow-2xl border border-[#F59E0B]/20">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1505] to-black opacity-90 z-0"></div>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent opacity-70"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-1.5 h-10 bg-gradient-to-b from-yellow-300 to-amber-500 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]"></div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-100 to-white">Suggested Exercises</span>
                </h2>
              </div>
              <div className="flex items-center space-x-2 bg-[#F59E0B]/10 px-4 py-1.5 rounded-full border border-[#F59E0B]/30">
                <span className="text-xs font-tech font-bold text-[#F59E0B] uppercase tracking-widest">Priority Focus</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f] rounded-xl border border-[#F59E0B]/40 p-[2px] hover:border-[#F59E0B] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-500 group transform hover:-translate-y-1">
                <div className="h-full bg-[#111] rounded-[10px] p-6 md:p-8 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F59E0B]/0 via-[#F59E0B]/50 to-[#F59E0B]/0 opacity-50"></div>
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <span className="text-6xl font-display font-bold text-white/5 group-hover:text-[#F59E0B]/20 transition-colors">01</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3 uppercase tracking-wide group-hover:text-[#F59E0B] transition-colors">Focus Interval Training</h3>
                  <div className="flex-grow space-y-6">
                    <p className="text-base text-gray-300 font-light leading-relaxed">
                      Practice focusing on a single task or image for a set amount of time, gradually increasing duration. This drill helps improve your concentration and ability to stay present during high-pressure situations, which is essential for maintaining focus during critical moments like pitching.
                    </p>
                    <div className="bg-black/60 p-4 rounded-lg border-l-4 border-[#F59E0B] shadow-inner">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs text-[#F59E0B] font-bold uppercase tracking-wider">Primary Objective</span>
                      </div>
                      <p className="text-sm text-white font-mono uppercase tracking-wide">Mental Rehearsal</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f] rounded-xl border border-purple-500/40 p-[2px] hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-500 group transform hover:-translate-y-1">
                <div className="h-full bg-[#111] rounded-[10px] p-6 md:p-8 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-700 blur-xl"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 opacity-50"></div>
                  <div className="flex items-start justify-between mb-8 relative z-10">
                    <span className="text-6xl font-display font-bold text-white/5 group-hover:text-purple-500/20 transition-colors">02</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3 uppercase tracking-wide group-hover:text-purple-400 transition-colors">Distraction Control Drills</h3>
                  <div className="flex-grow space-y-6">
                    <p className="text-base text-gray-300 font-light leading-relaxed">
                      Simulate game scenarios with background noise or interruptions while you practice your routine. This exercise will help you learn to tune out distractions and stay centered, enhancing your mental resilience during stressful game situations.
                    </p>
                    <div className="bg-black/60 p-4 rounded-lg border-l-4 border-purple-500 shadow-inner">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Primary Objective</span>
                      </div>
                      <p className="text-sm text-white font-mono uppercase tracking-wide">Physiological Regulation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final Word Section */}
        <section className="relative bg-gradient-to-br from-white/10 to-gray-900/50 rounded-3xl p-8 md:p-14 overflow-hidden border border-white/20 shadow-2xl backdrop-blur-xl group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-20 pointer-events-none"></div>
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-white/15 transition-all duration-700"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-12 bg-white"></div>
                <h3 className="text-sm font-tech font-bold text-white uppercase tracking-[0.2em]">Final Word</h3>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase leading-tight tracking-wide">
                <span className="block">Your Journey</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">Is Just Beginning</span>
              </h2>
              <p className="text-base md:text-lg text-gray-300 font-light leading-relaxed max-w-2xl border-l-2 border-white/30 pl-6 py-2">
                Keep up the great work, Reagan. Your willingness to reflect and grow is a strength that will serve you well on and off the field. Continue practicing these mental skills, and remember to re-take the assessment in six months. Stay resilient and confident!
              </p>
            </div>
            <div className="flex flex-col items-end gap-4 shrink-0">
              <div className="text-right">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Suggested Retest Date</p>
                <p className="text-sm font-bold text-white uppercase tracking-wider">June 2026</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer/Partner Section */}
        <section className="border-t border-white/5 pt-12 pb-6">
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/5 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-gray-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 p-3 shrink-0">
                <span className="font-display font-bold text-xl text-white">MLM</span>
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider mb-1">Official Mental Training Partner</h3>
                <p className="text-xs text-gray-400 font-light max-w-md">
                  Major League Mindset is available to all NTangible members at a significant savings. 
                  Access the 8 week virtual training program.
                </p>
              </div>
            </div>
            <a className="relative z-10 flex-shrink-0 group/btn" href="#">
              <div className="relative overflow-hidden bg-surface-highlight border border-white/10 hover:border-white/30 rounded px-6 py-3 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-white opacity-10 group-hover/btn:opacity-30 transition-opacity"></div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-1">Unlock Program</span>
                  <span className="text-[10px] font-mono text-gray-400">CODE: NTANGIBLE100</span>
                </div>
              </div>
            </a>
          </div>
          <div className="text-center mt-12">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">© NTANGIBLE, INC. ALL RIGHTS RESERVED</p>
          </div>
        </section>
      </main>

      <div className="fixed top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
    </div>
  );
};

export default ClutchAssessment;
