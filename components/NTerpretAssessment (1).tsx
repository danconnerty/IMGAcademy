
import React from 'react';
import { 
  CheckCircle, 
  Calendar, 
  MessageSquare, 
  Brain, 
  Anchor,
  ArrowLeft 
} from 'lucide-react';

interface NTerpretAssessmentProps {
  onBack?: () => void;
}

const NTerpretAssessment: React.FC<NTerpretAssessmentProps> = ({ onBack }) => {
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
        }
        .hero-text-glow {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
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
            radial-gradient(at 10% 10%, rgba(255, 255, 255, 0.03) 0px, transparent 60%),
            radial-gradient(at 90% 10%, rgba(100, 100, 100, 0.05) 0px, transparent 60%),
            radial-gradient(at 50% 90%, rgba(16, 185, 129, 0.02) 0px, transparent 60%)
          `,
          backgroundAttachment: 'fixed'
        }}
      />

      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto space-y-12">
        
        {/* Header Section */}
        <section className="relative min-h-[50vh] flex flex-col justify-center items-center text-center overflow-hidden rounded-2xl glass-panel p-6 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent opacity-30 pointer-events-none"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="relative z-10 space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)] backdrop-blur-sm">
                <CheckCircle size={16} />
                <span className="text-xs font-mono font-bold tracking-widest uppercase">Analysis Complete</span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-bold uppercase leading-[0.85] tracking-tight relative">
              <span className="block text-white">Reagan</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-2xl hero-text-glow mt-2">Zepeda</span>
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-500 to-transparent mx-auto my-6"></div>
            <p className="text-lg md:text-2xl font-tech text-gray-400 uppercase tracking-[0.3em] font-light">
                NTERPRET / MENTAL SCOUTING REPORT
            </p>
          </div>
          <div className="absolute inset-0 opacity-20 grayscale pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMDQwIDAiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgZmlsbD0ibm9uZSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==")`}}></div>
        </section>

        {/* Summary Section */}
        <section className="space-y-6">
          <div className="flex items-center space-x-4 mb-6 md:mb-8">
            <div className="w-1 h-8 bg-white rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-wide">Summary Insights</h2>
          </div>
          <div className="glass-card rounded-xl p-6 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-30 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex flex-wrap gap-x-6 gap-y-3 pb-8 border-b border-white/10 items-center justify-start w-full">
                <div className="flex items-center gap-2 opacity-50 text-xs font-mono text-gray-400 border border-white/10 px-3 py-1 rounded-full bg-black/20">
                  <Calendar size={16} />
                  <span>GENERATED: DEC 19 2025</span>
                </div>
              </div>
              <p className="text-gray-300 text-base md:text-xl leading-relaxed font-light">
                  You perform best when you know your role and feel like you belong. When your role is unclear you say you "mentally begin to spiral." You respond strongly to coaches who show they care and believe in you — that belief makes you try to exceed expectations. You want frequent feedback, prefer to have skills shown to you and then do them while being watched, and you open up slowly because you're shy and need time to build trust.
              </p>
              <div className="w-full h-1 bg-gradient-to-r from-white via-purple-500 to-[#F59E0B] rounded-full opacity-60"></div>
            </div>
          </div>
        </section>

        {/* The Three Pillars Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-1">
          {/* Communication Style */}
          <div className="bg-[#0A0A0A]/50 border border-white/5 p-6 md:p-8 relative lg:rounded-l-2xl border-r-0 lg:border-r border-b lg:border-b-0">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <MessageSquare size={32} className="text-gray-300" />
              </div>
              <h4 className="text-sm font-tech font-bold text-gray-500 uppercase tracking-widest mb-2">Communication Style</h4>
              <div className="h-px w-8 bg-white/30 mb-4"></div>
              <h3 className="text-xl font-display text-white mb-2">Supportive</h3>
              <p className="text-sm text-gray-400 font-light leading-snug mb-4">
                  You typically share cautiously and respond best to caring, belief, and kindness. You open up after a relationship is built and do best when feedback is delivered with trust and encouragement.
              </p>
              <div className="block">
                <p className="text-xs text-gray-500 font-light pt-4 border-t border-white/10">
                    Athletes with a Supportive communication style thrive in environments built on trust, encouragement, and connection. They respond best when direction is paired with belief - when a coach’s words reinforce that they are valued and capable.
                </p>
              </div>
            </div>
          </div>

          {/* Learning Style */}
          <div className="bg-[#0A0A0A]/50 border border-white/5 p-6 md:p-8 relative lg:border-r border-b lg:border-b-0">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-50"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
                <Brain size={32} className="text-purple-400" />
              </div>
              <h4 className="text-sm font-tech font-bold text-gray-500 uppercase tracking-widest mb-2">Learning Style</h4>
              <div className="h-px w-8 bg-purple-500/50 mb-4"></div>
              <h3 className="text-xl font-display text-white mb-2">Kinesthetic</h3>
              <p className="text-sm text-gray-400 font-light leading-snug mb-4">
                  You learn fastest by doing — you want skills shown to you and then to try them while someone watches. Hands-on reps with coach observation and immediate, specific feedback help you improve fastest.
              </p>
              <div className="block">
                <p className="text-xs text-gray-500 font-light pt-4 border-t border-white/10">
                    Kinesthetic learners learn through experience - by physically doing, not by watching or hearing. They need to feel the skill in motion before it truly sticks. In practice, repetition, muscle memory, and live scenarios drive their development.
                </p>
              </div>
            </div>
          </div>

          {/* Motivational Anchor */}
          <div className="bg-[#0A0A0A]/50 border border-white/5 p-6 md:p-8 relative lg:rounded-r-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-50"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                <Anchor size={32} className="text-emerald-400" />
              </div>
              <h4 className="text-sm font-tech font-bold text-gray-500 uppercase tracking-widest mb-2">Motivational Anchor</h4>
              <div className="h-px w-8 bg-emerald-500/50 mb-4"></div>
              <h3 className="text-xl font-display text-white mb-2">Team Commitment</h3>
              <p className="text-sm text-gray-400 font-light leading-snug mb-4">
                  Belonging and harmony motivate you. You want a team where people get along and support each other — that sense of connection makes you feel secure and pushes you to perform for the group.
              </p>
              <div className="block">
                <p className="text-xs text-gray-500 font-light pt-4 border-t border-white/10">
                    Athletes anchored by Team Commitment are driven by loyalty, trust, and the collective purpose of the group. Their best performances come when they feel their role directly impacts team success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Growth Areas */}
        <section className="glass-panel rounded-2xl p-6 md:p-12 relative overflow-hidden">
          <div className="absolute -left-32 -bottom-32 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="flex items-center space-x-4 mb-8 md:mb-10">
            <div className="w-1 h-8 bg-[#F59E0B] rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-wide">Growth Areas</h2>
          </div>
          <div className="relative space-y-8 pl-4 md:pl-0">
            <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-white/20 via-white/10 to-transparent -translate-x-1/2 hidden md:block"></div>
            
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="md:w-1/2 md:text-right md:pr-12 order-2 md:order-1">
                <h3 className="text-xl font-tech font-bold text-white mb-2">REDUCE ROLE-RELATED SPIRALING</h3>
                <p className="text-gray-400 text-sm">Unclear roles or perceived punishment trigger insecurity. Building a short routine to re-center and clarify your immediate responsibilities will cut that spiral short.</p>
              </div>
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-[#0A0A0A] border-2 border-white/50 z-10 -translate-x-[5px] md:-translate-x-1/2 shadow-[0_0_10px_rgba(255,255,255,0.2)] order-1 md:order-2">
                <div className="absolute inset-0 rounded-full bg-white opacity-20"></div>
              </div>
              <div className="md:w-1/2 md:pl-12 order-3">
                <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest border border-white/20 px-2 py-0.5 rounded">Growth Focus</span>
              </div>
            </div>

            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="md:w-1/2 md:text-right md:pr-12 order-2 md:order-1">
                <span className="text-[10px] font-mono text-[#F59E0B]/70 uppercase tracking-widest border border-[#F59E0B]/20 px-2 py-0.5 rounded">Trust Development</span>
              </div>
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-[#0A0A0A] border-2 border-[#F59E0B] z-10 -translate-x-[5px] md:-translate-x-1/2 order-1 md:order-2"></div>
              <div className="md:w-1/2 md:pl-12 order-3">
                <h3 className="text-xl font-tech font-bold text-white mb-2 text-[#F59E0B]">SPEED UP TRUST</h3>
                <p className="text-gray-400 text-sm">You take time to open up and sometimes say 'yes' even when you don’t fully understand — practicing small, increasing responsibilities can accelerate trust and confidence.</p>
              </div>
            </div>

            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="md:w-1/2 md:text-right md:pr-12 order-2 md:order-1">
                <h3 className="text-xl font-tech font-bold text-white mb-2 text-[#10B981]">PRACTICAL IMPROVEMENTS</h3>
                <p className="text-gray-400 text-sm">Team-first mindset — you genuinely support teammates and thrive in a positive, cooperative environment. High coachability — when a coach shows belief in you and gives clear feedback, you immediately try to improve and follow through.</p>
              </div>
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-[#0A0A0A] border-2 border-[#10B981] z-10 -translate-x-[5px] md:-translate-x-1/2 shadow-[0_0_15px_rgba(16,185,129,0.4)] order-1 md:order-2"></div>
              <div className="md:w-1/2 md:pl-12 order-3">
                <span className="text-[10px] font-mono text-[#10B981]/70 uppercase tracking-widest border border-[#10B981]/20 px-2 py-0.5 rounded">Key Strengths</span>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Hacks */}
        <section className="space-y-8">
          <div className="flex items-center space-x-4">
            <div className="w-1 h-8 bg-white/20 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-wide">Performance Hacks</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hack 1 */}
            <div className="relative bg-[#0F0F0F] rounded-lg border border-white/10 p-1">
              <div className="h-full bg-[#141414]/30 rounded border border-dashed border-white/10 p-6 flex flex-col relative overflow-hidden">
                <div className="flex items-start justify-end mb-6">
                  <span className="text-4xl font-display font-bold text-white/10">01</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2 uppercase">Role Statement</h3>
                <div className="flex-grow space-y-4">
                  <p className="text-sm text-gray-400 font-light leading-relaxed">
                      Ask for a one-line role statement before games (e.g., “Reagan, your role tonight is ___”) so you feel grounded and don’t overthink.
                  </p>
                  <div className="bg-black/40 p-3 rounded border-l-2 border-white/50">
                    <p className="text-xs text-gray-300 font-mono uppercase"><strong>Takeaway:</strong> Grounded Focus</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Hack 2 */}
            <div className="relative bg-[#0F0F0F] rounded-lg border border-white/10 p-1">
              <div className="h-full bg-[#141414]/30 rounded border border-dashed border-white/10 p-6 flex flex-col relative overflow-hidden">
                <div className="flex items-start justify-end mb-6">
                  <span className="text-4xl font-display font-bold text-white/10">02</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2 uppercase">Pre-Play Routine</h3>
                <div className="flex-grow space-y-4">
                  <p className="text-sm text-gray-400 font-light leading-relaxed">
                      Use a quick 30-second pre-play routine (3 deep breaths + one short cue phrase like “I’ve got this”) to stop spiraling and reset focus.
                  </p>
                  <div className="bg-black/40 p-3 rounded border-l-2 border-purple-500">
                    <p className="text-xs text-purple-300 font-mono uppercase"><strong>Takeaway:</strong> Stop Spiraling</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Hack 3 */}
            <div className="relative bg-[#0F0F0F] rounded-lg border border-white/10 p-1">
              <div className="h-full bg-[#141414]/30 rounded border border-dashed border-white/10 p-6 flex flex-col relative overflow-hidden">
                <div className="flex items-start justify-end mb-6">
                  <span className="text-4xl font-display font-bold text-white/10">03</span>
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2 uppercase">'Show Then Do' Reps</h3>
                <div className="flex-grow space-y-4">
                  <p className="text-sm text-gray-400 font-light leading-relaxed">
                      Request ‘show then do’ reps in practice: watch the skill, perform it while the coach watches, then get one quick piece of specific feedback so you leave with clarity.
                  </p>
                  <div className="bg-black/40 p-3 rounded border-l-2 border-[#F59E0B]">
                    <p className="text-xs text-[#F59E0B] font-mono uppercase"><strong>Takeaway:</strong> Clarity & Confidence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps / Footer */}
        <section className="relative rounded-2xl overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20 grayscale"></div>
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/5 to-transparent"></div>
          <div className="relative z-10 p-10 md:p-16 flex flex-col items-center justify-center text-center gap-10">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center space-x-2 text-white font-mono text-xs tracking-widest uppercase justify-center w-full">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span>Action Required</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                  NEXT STEPS <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">YOUR GROWTH</span>
              </h2>
              <p className="text-gray-300 font-light text-base md:text-lg leading-relaxed pl-6 border-l-2 border-white/20 text-left mx-auto max-w-[600px] mb-8">
                  Build a short, reliable confidence routine tied to role clarity: get a concise role statement before games, use a brief reset cue when you feel insecure, and take on small, visible responsibilities in practice to accelerate trust and independence.
              </p>
            </div>
          </div>
        </section>

        <div className="text-center mt-12 pb-6">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">© NTANGIBLE, INC. ALL RIGHTS RESERVED</p>
        </div>
      </main>

      <div className="fixed top-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
    </div>
  );
};

export default NTerpretAssessment;
