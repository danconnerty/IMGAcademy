
import React, { useState, useEffect, useRef } from 'react';
import { 
    Activity, Trophy, Target, Brain, ArrowRight, Building2, Beaker, Clock, 
    TrendingDown, Check, Zap, Users, Database, Monitor, Search, X, ChevronRight, 
    ChevronLeft, Play, Calendar, Stethoscope, Maximize2, Minimize2, Wallet, 
    BarChart3, CheckCircle, Video, AlertTriangle, ShieldAlert, Layers, FileText,
    Lock, Swords, Gavel, Map, ChevronDown, Layout, DollarSign, RefreshCw, UserPlus,
    Cpu, Stethoscope as StethoscopeIcon, FileSpreadsheet, GraduationCap, Mic
} from 'lucide-react';
import { ViewType } from '../types';
import { TestDriveModal } from './TestDriveModal';
import ClutchAssessment from './ClutchAssessment';
import NTerpretAssessment from './NTerpretAssessment';
import TrustedTeams from './TrustedTeams';

interface LandingPageProps {
  onEnter: (orgName: string, initialView?: ViewType) => void;
}

// --- LOGO COMPONENT ---
const Logo = ({ className = "", size = "normal" }: { className?: string, size?: "small" | "normal" }) => {
    const height = size === "small" ? "h-8" : "h-10";
    
    return (
        <div className={`flex items-center select-none ${className}`}>
            <img 
                src="/white_logo_transparent_background - name only.PNG" 
                alt="NTANGIBLE" 
                className={`${height} w-auto object-contain`} 
            />
        </div>
    );
};

// --- ANIMATION HOOK ---
const useScrollReveal = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const BookingModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-5xl h-[85vh] bg-[#0f1115] border border-gray-800 rounded-2xl relative shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center bg-[#0f1115]">
                <h2 className="text-xl font-bold text-white">Book A Coach Demo</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>
            <div className="w-full h-full bg-white">
                <iframe 
                    src="https://calendly.com/ntangible/30min" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    title="Schedule Demo"
                    className="w-full h-full"
                ></iframe>
            </div>
        </div>
    </div>
);

const SampleReportModal = ({ onClose, onViewClutch, onViewNterpret }: { onClose: () => void, onViewClutch: () => void, onViewNterpret: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-lg bg-[#0f1115] border border-gray-800 rounded-2xl relative shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center bg-[#0f1115]">
                <h2 className="text-xl font-bold text-white">Select Sample Report</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>
            <div className="p-6 space-y-4">
                <button 
                    onClick={onViewClutch}
                    className="w-full group relative p-6 bg-[#181b21] hover:bg-[#22262e] border border-gray-800 hover:border-blue-500/50 rounded-xl transition-all text-left"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Activity size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Clutch Assessment</h3>
                        </div>
                        <ArrowRight size={18} className="text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors pl-[52px]">
                        See a sample player report - how a kid handles pressure on game day.
                    </p>
                </button>

                <button 
                    onClick={onViewNterpret}
                    className="w-full group relative p-6 bg-[#181b21] hover:bg-[#22262e] border border-gray-800 hover:border-purple-500/50 rounded-xl transition-all text-left"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-900/20 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                <Brain size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">NTerpret Assessment</h3>
                        </div>
                        <ArrowRight size={18} className="text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors pl-[52px]">
                        Explore a sample player profile - learning style, motivation, and how to coach them.
                    </p>
                </button>
            </div>
        </div>
    </div>
);

// --- NIL SIMULATION COMPONENT ---
const NILSimulation = () => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "The Asset",
            content: (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-600 shrink-0">
                            <UserPlus size={32} className="text-gray-400 sm:w-[40px] sm:h-[40px]" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h4 className="text-xl sm:text-2xl font-bold text-white">Marcus J.</h4>
                            <p className="text-blue-400 font-mono uppercase tracking-widest text-xs sm:text-sm">U13 Tryout • Top Scorer</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-black/40 p-4 rounded border border-white/5">
                            <div className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mb-1">Skill Score</div>
                            <div className="text-xl sm:text-2xl font-bold text-white">9.2/10</div>
                        </div>
                        <div className="bg-black/40 p-4 rounded border border-white/5">
                            <div className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mb-1">Goals (Last Season)</div>
                            <div className="text-xl sm:text-2xl font-bold text-white">28</div>
                        </div>
                    </div>
                    <p className="text-gray-400 italic text-sm sm:text-lg leading-relaxed text-center sm:text-left">"The talent jumps off the field. But will he lift the team - or sink it?"</p>
                </div>
            )
        },
        {
            title: "The Ask",
            content: (
                <div className="space-y-6 sm:space-y-8 text-center py-4">
                    <div className="inline-block p-4 sm:p-6 bg-green-900/10 rounded-full border border-green-500/30 mb-2">
                        <DollarSign className="text-green-500 w-8 h-8 sm:w-12 sm:h-12" />
                    </div>
                    <div>
                        <h4 className="text-4xl sm:text-5xl font-black text-white tracking-tighter mb-2">1 Roster Spot</h4>
                        <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-[0.2em] font-bold">Elite Travel Team</p>
                    </div>
                    <div className="text-left bg-red-900/10 border border-red-900/30 p-4 sm:p-6 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={14} className="text-red-500" />
                            <span className="text-[10px] sm:text-xs font-bold text-red-400 uppercase tracking-widest">Locker Room Risk: High</span>
                        </div>
                        <p className="text-red-200 text-xs sm:text-sm">"Pick him and three current players might quit. Cut him and the parents will be in your inbox by Monday."</p>
                    </div>
                </div>
            )
        },
        {
            title: "Due Diligence",
            content: (
                <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <span className="text-[10px] sm:text-sm text-gray-400 uppercase tracking-widest font-bold">Mental Profile</span>
                        <span className="text-[10px] sm:text-sm text-gray-400 uppercase tracking-widest font-bold">Score</span>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm sm:text-lg font-bold text-white">Resilience</span>
                                <span className="text-sm sm:text-lg font-mono font-bold text-red-500">38% (Low)</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full w-[38%] bg-red-600"></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm sm:text-lg font-bold text-white">Coachability</span>
                                <span className="text-sm sm:text-lg font-mono font-bold text-red-500">24% (Poor)</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full w-[24%] bg-red-600"></div>
                            </div>
                        </div>

                        <div className="p-4 bg-yellow-900/10 border border-yellow-500/30 rounded-xl text-yellow-200">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle size={14} className="text-yellow-500" />
                                <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">Heads-Up</span>
                            </div>
                            <p className="text-xs sm:text-sm">"Shuts down after a mistake. Resists feedback. Likely to clash with current captains."</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "The Verdict",
            content: (
                <div className="space-y-6 sm:space-y-8 text-center py-4">
                    <div className="inline-block p-4 sm:p-6 bg-gray-800/50 rounded-full border border-gray-600 mb-2">
                        <ShieldAlert className="text-white w-8 h-8 sm:w-12 sm:h-12" />
                    </div>
                    <div>
                        <h4 className="text-4xl sm:text-5xl font-black text-red-500 tracking-tighter mb-4 uppercase">PLACE ELSEWHERE</h4>
                        <p className="text-base sm:text-xl text-gray-300">Right kid. Wrong team - for now.</p>
                    </div>
                    <div className="bg-green-900/10 border border-green-500/30 p-4 sm:p-6 rounded-xl">
                        <div className="text-[10px] sm:text-xs text-green-400 uppercase tracking-widest mb-2 font-bold">The Win</div>
                        <div className="text-2xl sm:text-4xl font-bold text-white mb-2">Team Chemistry Saved</div>
                        <p className="text-xs sm:text-sm text-green-400/80">
                            Placed Marcus on a development squad with the right coach for his style. Six months later - coachability up 40%. Now he's ready.
                        </p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-0 flex flex-col justify-center min-h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left Column: Context/Navigation */}
                <div className="space-y-6 sm:space-y-10 order-1 lg:order-1">
                     {/* Header */}
                     <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full animate-in slide-in-from-left-4 fade-in duration-700">
                            <Activity size={14} className="text-blue-500" />
                            <span className="text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-widest">Tryout Intelligence</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black italic text-white tracking-tighter uppercase leading-[0.9] animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100">
                            The roster <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">Decision.</span>
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-gray-400 font-light leading-relaxed animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
                           Every tryout has one. The talented kid you're not sure about. See how NControl helps you decide - fast, fair, and with the whole team in mind.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300">
                        <div className="flex gap-2">
                            {steps.map((_, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setStep(idx)}
                                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${idx <= step ? 'bg-blue-600' : 'bg-gray-800'}`}
                                />
                            ))}
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setStep(Math.max(0, step - 1))}
                                disabled={step === 0}
                                className="px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5 text-xs font-bold text-white uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                Back
                            </button>
                            <button 
                                onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
                                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white uppercase tracking-widest transition-colors shadow-lg shadow-blue-900/20"
                            >
                                {step === steps.length - 1 ? 'Restart Scenario' : 'Next Step'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Dynamic Content Display */}
                <div className="relative animate-in zoom-in-95 fade-in duration-1000 delay-300 order-2 lg:order-2">
                     {/* Content Box */}
                     <div className="bg-[#111] border border-white/10 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl min-h-[400px] sm:min-h-[450px] flex flex-col justify-center">
                         <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                             {step === 0 && <UserPlus size={100} />}
                             {step === 1 && <DollarSign size={100} />}
                             {step === 2 && <Activity size={100} />}
                             {step === 3 && <ShieldAlert size={100} />}
                         </div>
                         <div className="relative z-10">
                             <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">
                                    {steps[step].title}
                                </h4>
                                {steps[step].content}
                            </div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

// --- PRICING + REVENUE CALCULATOR ---
const PricingCalculator = () => {
    const [players, setPlayers] = useState(100);
    const pricePerPlayer = 29;
    const revSharePerPlayer = 10;

    const clamped = Math.max(0, Math.min(1000, players));
    const orgRevShare = clamped * revSharePerPlayer;
    const netCost = clamped * (pricePerPlayer - revSharePerPlayer);

    const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32 scroll-mt-20" id="pricing">
            <div className="mb-12 sm:mb-16 max-w-2xl">
                <p className="text-sm font-medium text-blue-400 mb-3">Pricing</p>
                <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                    $29 per player. $10 back to your organization.
                </h2>
                <p className="text-lg text-gray-400 leading-relaxed">
                    One flat rate. No seat licenses. Most clubs cover the rest with a single team fundraiser or roll it into their existing player-development fee.
                </p>
            </div>

            {/* Calculator */}
            <div className="bg-[#070707] border border-white/10 rounded-2xl p-6 sm:p-10">
                <div className="mb-6 sm:mb-8">
                    <p className="text-sm text-gray-500 font-medium mb-1">Revenue calculator</p>
                    <p className="text-base text-gray-400">Drag the slider to see what your program looks like at scale.</p>
                </div>

                <div className="mb-8">
                    <div className="flex items-end justify-between mb-3 gap-4">
                        <label className="text-sm font-medium text-gray-400">Players tested</label>
                        <input
                            type="number"
                            min={0}
                            max={1000}
                            value={clamped}
                            onChange={(e) => setPlayers(parseInt(e.target.value || '0', 10))}
                            className="w-24 sm:w-28 bg-black border border-white/10 rounded-lg px-3 py-2 text-right text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={1000}
                        step={1}
                        value={clamped}
                        onChange={(e) => setPlayers(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                        style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(clamped/1000)*100}%, #1f2937 ${(clamped/1000)*100}%, #1f2937 100%)`
                        }}
                    />
                    <div className="flex justify-between mt-3 text-xs text-gray-600 tabular-nums">
                        <span>1</span><span>250</span><span>500</span><span>750</span><span>1,000</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <div className="bg-[#070707] p-5 sm:p-6">
                        <p className="text-sm font-medium text-gray-500 mb-2">Net cost to program</p>
                        <p className="text-3xl sm:text-4xl font-semibold text-white tracking-tight tabular-nums">{fmt(netCost)}</p>
                        <p className="text-sm text-gray-500 mt-2">{clamped} × $19 (after $10 rev share)</p>
                    </div>
                    <div className="bg-[#070707] p-5 sm:p-6">
                        <p className="text-sm font-medium text-blue-400 mb-2">Your organization gets back</p>
                        <p className="text-3xl sm:text-4xl font-semibold text-blue-400 tracking-tight tabular-nums">{fmt(orgRevShare)}</p>
                        <p className="text-sm text-gray-500 mt-2">{clamped} × $10 / season</p>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                    {[25, 50, 100, 250, 500, 1000].map(n => (
                        <button
                            key={n}
                            onClick={() => setPlayers(n)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors tabular-nums ${
                                clamped === n
                                    ? 'bg-white text-black'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- PRESENTATION MODE COMPONENT ---
const PresentationMode = ({ onClose, onBook }: { onClose: () => void, onBook: () => void }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 9; 

    const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
    const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const slides = [
        // Slide 1: The Blind Spot (Problem)
        <div className="h-full w-full overflow-y-auto overflow-x-hidden">
            <div className="min-h-full w-full flex items-center justify-center py-12 md:py-0">
                <div className="w-full max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full animate-in slide-in-from-left-4 fade-in duration-700">
                            <AlertTriangle size={16} className="text-red-500" />
                            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">The Coaching Gap</span>
                        </div>

                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black italic text-white tracking-tighter uppercase leading-[0.9] animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100">
                            You see half <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">the kid.</span>
                        </h2>

                        <p className="text-sm md:text-lg text-gray-400 font-light leading-relaxed animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
                            You track touches, goals, minutes, and skill drills. <br/>
                            But you don't see how a kid handles pressure, how they learn, or why they quit.
                            <br/><br/>
                            <span className="text-white font-bold">70% of kids leave youth sports by age 13. That's the half nobody's measuring.</span>
                        </p>
                    </div>

                    <div className="relative animate-in zoom-in-95 fade-in duration-1000 delay-300 mt-8 lg:mt-0">
                        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 max-w-md mx-auto relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <FileText className="w-32 h-32" />
                            </div>
                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <span className="text-gray-500 font-mono text-xs md:text-sm">CATEGORY</span>
                                    <span className="text-gray-500 font-mono text-xs md:text-sm">STATUS</span>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-900/30 rounded text-green-500"><Activity size={16} /></div>
                                            <span className="text-white font-bold text-sm sm:text-base">Skill Drills</span>
                                        </div>
                                        <span className="text-green-500 font-mono text-[10px] md:text-xs bg-green-900/20 px-2 py-1 rounded">MEASURED</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-900/30 rounded text-green-500"><Video size={16} /></div>
                                            <span className="text-white font-bold text-sm sm:text-base">Game Stats</span>
                                        </div>
                                        <span className="text-green-500 font-mono text-[10px] md:text-xs bg-green-900/20 px-2 py-1 rounded">MEASURED</span>
                                    </div>
                                    
                                    <div className="h-px bg-white/10 my-4"></div>

                                    <div className="flex items-center justify-between opacity-50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-900/30 rounded text-red-500"><Brain size={16} /></div>
                                            <span className="text-white font-bold text-sm sm:text-base">Mental Strength</span>
                                        </div>
                                        <span className="text-red-500 font-mono text-[10px] md:text-xs bg-red-900/20 px-2 py-1 rounded">UNKNOWN</span>
                                    </div>
                                    <div className="flex items-center justify-between opacity-50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-red-900/30 rounded text-red-500"><Users size={16} /></div>
                                            <span className="text-white font-bold text-sm sm:text-base">Coachability</span>
                                        </div>
                                        <span className="text-red-500 font-mono text-[10px] md:text-xs bg-red-900/20 px-2 py-1 rounded">UNKNOWN</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                                <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl uppercase tracking-widest shadow-2xl border border-red-400 rotate-[-10deg]">
                                    Blind Spot
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,

        // Slide 2: The Advantage (Why This Wins)
        <div className="h-full w-full overflow-y-auto overflow-x-hidden">
            <div className="min-h-full w-full flex items-center justify-center py-12 md:py-0">
                <div className="w-full max-w-7xl mx-auto px-4 md:px-12 text-center">
                    <div className="mb-8 animate-in slide-in-from-bottom-8 fade-in duration-700">
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full mb-6">
                            <Zap size={16} className="text-blue-500" />
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">The Coach Edge</span>
                        </div>
                        <h2 className="text-3xl md:text-6xl font-black italic text-white tracking-tighter uppercase leading-none">
                            Coach the kid, <br/><span className="text-blue-500">not the position.</span>
                        </h2>
                        <p className="text-sm md:text-lg text-gray-400 max-w-3xl mx-auto mt-6 leading-relaxed">
                            Most coaches use the same approach for every kid on the field.
                            <br/>NControl gives you a <strong>simple profile</strong> for each player so you know exactly how to reach them.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-center text-center opacity-50 blur-[2px] hover:blur-0 hover:opacity-100 transition-all duration-500">
                            <h3 className="text-gray-500 font-bold uppercase tracking-widest mb-4">The Standard</h3>
                            <p className="text-xl md:text-2xl font-light text-gray-300">"He's a good kid. She's a bit shy."</p>
                            <div className="w-full h-px bg-white/10 my-6"></div>
                            <p className="text-red-400 font-mono text-sm uppercase">Subjective • Slow • Misses Quiet Kids</p>
                        </div>

                        <div className="bg-blue-900/20 border-2 border-blue-500 p-8 rounded-2xl flex flex-col items-center text-center shadow-[0_0_50px_rgba(37,99,235,0.2)] transform md:scale-105">
                            <h3 className="text-blue-400 font-bold uppercase tracking-widest mb-4">The NControl Edge</h3>
                            <p className="text-xl md:text-2xl font-bold text-white">"Visual learner. Resilient. Needs direct feedback."</p>
                            <div className="w-full h-px bg-blue-500/30 my-6"></div>
                            <p className="text-green-400 font-mono text-sm uppercase">Specific • Actionable • Backed By Data</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>,

        // Slide 3: The Financial Bleed (Agitation)
        <div className="h-full w-full overflow-y-auto overflow-x-hidden">
            <div className="min-h-full w-full flex items-center justify-center py-12 md:py-0">
                <div className="w-full max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div className="order-2 lg:order-1 relative animate-in zoom-in-95 fade-in duration-1000 delay-200">
                        <div className="bg-gradient-to-br from-red-900/10 to-black border border-red-500/30 p-8 md:p-10 rounded-3xl relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 text-red-900/20">
                                <Wallet className="w-48 h-48" />
                            </div>
                            
                            <div className="relative z-10">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">The Cost Of A Family Leaving</h3>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Avg. Annual Club Dues</p>
                                        <p className="text-3xl md:text-4xl font-mono font-bold text-white">$2,800</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Avg. Player Lifetime (Years)</p>
                                        <p className="text-3xl md:text-4xl font-mono font-bold text-white">3.5</p>
                                    </div>
                                    <div className="pt-6 border-t border-white/10">
                                        <p className="text-red-400 text-xs uppercase tracking-widest mb-1 font-bold">Lost Revenue Per Family</p>
                                        <p className="text-5xl md:text-6xl font-mono font-black text-red-500">$9,800</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-8">
                        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full animate-in slide-in-from-right-4 fade-in duration-700">
                            <TrendingDown size={16} className="text-red-500" />
                            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">The Quiet Quit</span>
                        </div>

                        <h2 className="text-3xl md:text-6xl font-black italic text-white tracking-tighter uppercase leading-[0.9] animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100">
                            Every kid who quits <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white">costs you.</span>
                        </h2>

                        <p className="text-sm md:text-lg text-gray-400 font-light leading-relaxed animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
                            When a player leaves your club because they "weren't having fun," you don't just lose dues - you lose siblings, referrals, and years of revenue. Each family walking away is nearly <span className="text-white font-bold">$10k</span> gone.
                            <br/><br/>
                            NControl flags shifts in a player's cognitive profile <em>before</em> they tell their parents they want to quit. Keep families. Build a community.
                        </p>
                    </div>
                </div>
            </div>
        </div>,

        // Slide 4: NIL Capital Protection (Redesigned)
        <div className="h-full w-full overflow-y-auto overflow-x-hidden">
             <div className="min-h-full w-full flex items-center justify-center">
                 <NILSimulation />
             </div>
        </div>,

        // Slide 5: The DIFFERENTIATION / COMPETITOR Comparison (NEW)
        <div className="h-full w-full overflow-y-auto overflow-x-hidden">
            <div className="min-h-full w-full flex items-center justify-center py-12 md:py-0">
                <div className="w-full max-w-7xl mx-auto px-4 md:px-12 text-center">
                    <div className="mb-12 animate-in slide-in-from-bottom-8 fade-in duration-700">
                        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6">
                            <Target size={16} className="text-white" />
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">The Competitive Landscape</span>
                        </div>
                        <h2 className="text-3xl md:text-6xl font-black italic text-white tracking-tighter uppercase leading-none mb-6">
                            Built for <br/><span className="text-blue-500">youth sports.</span>
                        </h2>
                        <p className="text-sm md:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            We're not a generic personality quiz. We're not another team-admin tool.<br/>
                            We're the <strong>insight layer</strong> your coaches actually need.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 fade-in delay-200">
                        
                        {/* Competitor 1: Cognitive Tests (Updated) */}
                        <div className="bg-[#111] border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all text-left flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <FileSpreadsheet className="w-20 h-20" />
                            </div>
                            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6 text-gray-400 shrink-0">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-300 mb-2 uppercase tracking-wide">Generic Quizzes</h3>
                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-4">Adult Personality Tests</p>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-grow">
                                Designed for corporate adults, then handed to a 13-year-old. The results don't translate to the field, the locker room, or how kids actually grow.
                            </p>
                            <div className="p-3 bg-red-900/10 border border-red-900/30 rounded text-red-400 text-xs font-bold uppercase tracking-wide flex items-center gap-2 mt-auto">
                                <X size={14} /> Not Built For Kids
                            </div>
                        </div>

                        {/* Competitor 2: Management Platforms (Updated) */}
                        <div className="bg-[#111] border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all text-left flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <Database className="w-20 h-20" />
                            </div>
                            <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center mb-6 text-purple-400 shrink-0">
                                <Layers size={24} />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-gray-300 mb-2 uppercase tracking-wide">Team Admin Apps</h3>
                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-4">TeamSnap • SportsEngine</p>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6 flex-grow">
                                Great for schedules, payments, and group chats. But silent on the things that actually grow a player - cognitive abilities, focus, and how they handle a tough game.
                            </p>
                            <div className="p-3 bg-yellow-900/10 border border-yellow-900/30 rounded text-yellow-500 text-xs font-bold uppercase tracking-wide flex items-center gap-2 mt-auto">
                                <AlertTriangle size={14} /> Logistics Only
                            </div>
                        </div>

                        {/* NControl */}
                        <div className="bg-gradient-to-b from-blue-900/20 to-black border border-blue-500 p-6 rounded-2xl relative overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.15)] transform md:-translate-y-4 text-left flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-6 opacity-20 text-blue-500">
                                <Cpu className="w-20 h-20" />
                            </div>
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6 text-white shadow-lg shadow-blue-900/50 shrink-0">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-white mb-2 uppercase tracking-wide">NControl</h3>
                            <p className="text-[10px] text-blue-300 font-mono uppercase tracking-widest mb-4">For Youth • Coach-Friendly • Actionable</p>
                            <p className="text-sm text-gray-300 leading-relaxed mb-6 flex-grow">
                                Built specifically for ages 13-18. A short, focused assessment gives every coach a complete cognitive profile for each player - and flags mental-strength shifts early.
                            </p>
                            <div className="p-3 bg-blue-900/30 border border-blue-500/50 rounded text-blue-200 text-xs font-bold uppercase tracking-wide flex items-center gap-2 mt-auto">
                                <Check size={14} /> The Whole Athlete
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>,

        // Slide 6: Force Multiplier (Sports Psych)
        <div className="h-full w-full overflow-y-auto overflow-x-hidden">
            <div className="min-h-full w-full flex items-center justify-center py-12 md:py-0">
                <div className="w-full max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 bg-purple-900/20 border border-purple-500/30 px-4 py-2 rounded-full animate-in slide-in-from-left-4 fade-in duration-700">
                            <Zap size={16} className="text-purple-400" />
                            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Force Multiplier</span>
                        </div>
                        <h2 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter text-white animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100">
                            Catch quiet kids <br/>
                            <span className="text-purple-500">before they quit.</span>
                        </h2>
                        <p className="text-sm md:text-lg text-gray-300 leading-relaxed animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
                            You can't be everywhere - and the kids whose mental strength is slipping aren't the ones telling you.
                            <br/><br/>
                            NControl is your <strong>early-warning system</strong>. We flag players who are pulling back, losing motivation, or struggling with pressure - so you can have the right conversation, before their parents call to pull them out.
                        </p>
                    </div>
                    
                    <div className="relative animate-in zoom-in-95 fade-in duration-1000 delay-300 mt-8 lg:mt-0">
                        <div className="bg-[#050505] border border-white/10 rounded-full aspect-square w-full max-w-md mx-auto relative flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent w-1/2 h-full origin-right animate-[spin_4s_linear_infinite] border-r border-purple-500/50"></div>
                            <div className="absolute inset-0 border border-white/5 rounded-full scale-75"></div>
                            <div className="absolute inset-0 border border-white/5 rounded-full scale-50"></div>
                            <div className="absolute inset-0 border border-white/5 rounded-full scale-25"></div>
                            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,1)]"></div>
                            <div className="absolute bottom-10 bg-black/80 border border-red-500/50 px-3 py-1 rounded text-red-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                                Alert: Cognitive Profile Shift
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,

        // Slide 7: The Lock (Exclusivity)
        <div className="h-full w-full overflow-y-auto overflow-x-hidden">
            <div className="min-h-full w-full flex items-center justify-center py-12 md:py-0">
                <div className="w-full max-w-6xl mx-auto px-4 md:px-12 text-center">
                    <div className="mb-8 animate-in slide-in-from-bottom-8 fade-in duration-700">
                        <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded-full mb-4">
                            <Lock size={14} className="text-yellow-500" />
                            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">Regional Exclusivity</span>
                        </div>
                        <h2 className="text-3xl md:text-6xl font-black italic text-white tracking-tighter uppercase leading-none mb-4">
                            Be the only <br/><span className="text-yellow-500">club in town.</span>
                        </h2>
                        <p className="text-sm md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Families talk. When you're the only program with NControl, parents notice.
                            <br/>
                            <span className="text-white font-bold">Lock your region. Own the reputation.</span>
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center gap-6 animate-in slide-in-from-bottom-8 fade-in delay-200">
                        <div className="bg-[#111] p-6 rounded-2xl border border-white/10 max-w-sm mx-auto w-full">
                            <div className="bg-red-500/20 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                                <X size={20} className="text-red-500 w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Open Market</h3>
                            <p className="text-gray-500 text-sm">
                                Standard license. The club across town can sign up too and pitch the same advantage to your families.
                            </p>
                        </div>
                        <div className="bg-gradient-to-b from-yellow-900/20 to-black p-6 rounded-2xl border border-yellow-500/50 max-w-sm shadow-[0_0_40px_rgba(234,179,8,0.2)] mx-auto w-full">
                            <div className="bg-yellow-500 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Lock size={20} className="text-black w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Regional Lock</h3>
                            <p className="text-yellow-200/70 text-sm">
                                We block competing clubs in your metro for your sport. You're the only program in the area with NControl.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 animate-in slide-in-from-bottom-8 fade-in delay-300">
                        <button 
                            onClick={onBook}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-yellow-500/20 transform hover:-translate-y-1 flex items-center gap-2 mx-auto"
                        >
                            <Lock size={14} /> Check Region Availability
                        </button>
                    </div>
                </div>
            </div>
        </div>,

        // Slide 8: Engagement Models (Pricing Tiers)
        <div className="h-full w-full overflow-y-auto overflow-x-hidden">
            <div className="min-h-full w-full flex items-center justify-center py-12 md:py-0">
                <div className="w-full max-w-7xl mx-auto px-4 md:px-12 text-center">
                    <div className="mb-10 animate-in slide-in-from-bottom-8 fade-in duration-700">
                        <h2 className="text-3xl md:text-5xl font-black italic text-white mb-4 tracking-tighter uppercase">Simple, Fair Pricing</h2>
                        <p className="text-gray-400 text-sm md:text-base">$29 per player tested. $10 back to your organization. No seat licenses. No hidden fees.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Single Team */}
                        <div className="bg-[#0f0f0f] border border-white/10 p-6 rounded-2xl flex flex-col hover:border-white/30 transition-all duration-300 animate-in slide-in-from-bottom-8 fade-in delay-100 group text-left h-full">
                            <div className="mb-6">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest border border-gray-700 px-3 py-1 rounded-full group-hover:bg-white group-hover:text-black transition-colors">Coach</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Single Team</h3>
                            <p className="text-gray-500 text-sm mb-6 h-10">One coach. One team. Test every player and run smarter practices.</p>

                            <ul className="space-y-3 mb-6 flex-grow border-t border-white/5 pt-6">
                                <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={16} className="text-white" /> <span className="font-bold text-white">$29</span> per player tested</li>
                                <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={16} className="text-white" /> Full Player Profiles & Reports</li>
                                <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={16} className="text-white" /> Coach Dashboard Access</li>
                            </ul>
                        </div>

                        {/* Preferred Teams */}
                        <div className="bg-gradient-to-b from-[#1a1a1a] to-black border border-blue-500 p-6 rounded-2xl flex flex-col relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(37,99,235,0.15)] animate-in slide-in-from-bottom-8 fade-in delay-200 text-left h-full">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Most Popular</div>
                            <div className="mb-6">
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest border border-blue-500/30 px-3 py-1 rounded-full">Club / Org</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Club Partnership</h3>
                            <p className="text-gray-400 text-sm mb-6 h-10">For clubs and youth organizations - earn revenue on every player tested.</p>
                            <ul className="space-y-3 mb-6 flex-grow border-t border-white/10 pt-6">
                                <li className="flex items-center gap-3 text-sm text-white"><Check size={16} className="text-blue-400" /> <span className="font-bold">$29</span> per player tested</li>
                                <li className="flex items-center gap-3 text-sm text-white"><Check size={16} className="text-blue-400" /> <span className="font-bold">$10 back</span> to your organization</li>
                                <li className="flex items-center gap-3 text-sm text-white"><Check size={16} className="text-blue-400" /> Director Dashboard (All Teams)</li>
                                <li className="flex items-center gap-3 text-sm text-white"><Check size={16} className="text-blue-400" /> Priority Support & Onboarding</li>
                            </ul>
                        </div>

                        {/* Full Varsity Package */}
                        <div className="bg-[#0f0f0f] border border-white/10 p-6 rounded-2xl flex flex-col hover:border-purple-500/50 transition-all duration-300 animate-in slide-in-from-bottom-8 fade-in delay-300 group text-left h-full">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">Best Value</div>
                            <div className="mb-6">
                                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest border border-purple-500/30 px-3 py-1 rounded-full group-hover:bg-purple-500 group-hover:text-white transition-colors">Enterprise</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">League / Multi-Club</h3>
                            <p className="text-gray-500 text-sm mb-6 h-10">For leagues, networks of clubs, and large youth organizations.</p>
                            <ul className="space-y-3 mb-6 flex-grow border-t border-white/5 pt-6">
                                <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={16} className="text-purple-500" /> Volume pricing on <strong>$29/player</strong></li>
                                <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={16} className="text-purple-500" /> <strong>$10/player</strong> revenue share</li>
                                <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={16} className="text-purple-500" /> League-Wide Director Dashboard</li>
                                <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={16} className="text-purple-500" /> Regional Exclusivity Available</li>
                            </ul>
                            
                            <div className="mt-2 pt-6 border-t border-white/5">
                                <button 
                                    onClick={() => window.open('https://calendly.com/ntangible/30min', '_blank')}
                                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 group-hover:bg-purple-900/20 group-hover:border-purple-500/30"
                                >
                                    <Calendar size={14} className="text-gray-400 group-hover:text-purple-400" />
                                    Schedule Consultation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,

        // Slide 9: CTA (Close)
        <div className="h-full w-full overflow-y-auto overflow-x-hidden">
            <div className="min-h-full w-full flex items-center justify-center py-12 md:py-0">
                 <div className="w-full max-w-4xl mx-auto px-4 md:px-12 text-center">
                    <div className="mb-12 animate-in zoom-in-95 fade-in duration-700">
                        <Trophy size={60} className="text-yellow-500 mx-auto mb-8 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)] w-20 h-20" />
                        <h2 className="text-3xl md:text-6xl font-black italic text-white mb-6 tracking-tighter leading-none">
                            COACH THE <br/> <span className="text-blue-500">WHOLE KID.</span>
                        </h2>
                    </div>
                    <p className="text-base md:text-xl text-gray-300 mb-12 max-w-2xl font-light mx-auto animate-in slide-in-from-bottom-8 fade-in duration-700 delay-100">
                        Talent gets them on the team. Mental strength keeps them in the sport. <br/>
                        <span className="text-white font-bold">Let's build that for every kid you coach.</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200">
                        <button 
                            onClick={onBook}
                            className="bg-white hover:bg-gray-200 text-black px-12 py-6 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] transform hover:-translate-y-1 flex items-center gap-3 justify-center"
                        >
                            Book A Demo <ArrowRight size={16} />
                        </button>
                        <button 
                            onClick={onClose}
                            className="border border-white/20 hover:bg-white/10 text-white px-10 py-6 rounded-full font-bold text-sm uppercase tracking-widest transition-all"
                        >
                            Close Presentation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ];

    return (
        <div className="fixed inset-0 z-[200] bg-black text-white flex flex-col h-[100dvh] animate-in fade-in duration-500">
            {/* Presentation Controls */}
            <div className="w-full p-6 flex justify-between items-center z-50 bg-black shrink-0 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <Logo className="text-white opacity-80" size="small" />
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
                    <Minimize2 size={20} />
                </button>
            </div>

            {/* Slide Content */}
            <div className="flex-grow relative overflow-hidden">
                {slides.map((slide, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                            index === currentSlide ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 
                            index < currentSlide ? 'opacity-0 -translate-y-10 scale-95 pointer-events-none' : 
                            'opacity-0 translate-y-10 scale-95 pointer-events-none'
                        }`}
                    >
                        {slide}
                    </div>
                ))}
            </div>

            {/* Footer / Navigation */}
            <div className="p-8 flex items-center justify-between z-50 bg-gradient-to-t from-black via-black/80 to-transparent shrink-0">
                <div className="text-xs font-mono text-gray-500">
                    SLIDE {currentSlide + 1} / {totalSlides}
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={prevSlide} 
                        disabled={currentSlide === 0}
                        className="p-4 rounded-full border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                        onClick={nextSlide}
                        disabled={currentSlide === totalSlides - 1}
                        className="p-4 rounded-full border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-gray-900 w-full">
                    <div 
                        className="h-full bg-blue-600 transition-all duration-500 ease-out"
                        style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

// ... Rest of the file remains the same ...
// ... Main Landing Page Component ...

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Ref for Video Section
  const videoSectionRef = useRef<HTMLElement>(null);

  const scrollToVideo = () => {
    videoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  
  // Modal States
  const [showTestDrive, setShowTestDrive] = useState(false);
  const [showClutchReport, setShowClutchReport] = useState(false);
  const [showNterpretReport, setShowNterpretReport] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Video Toggle State

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleEnter = (view?: ViewType) => {
    const finalName = 'NTANGIBLE';
    onEnter(finalName, view);
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white relative font-sans selection:bg-blue-500 selection:text-white flex flex-col scroll-smooth ${showClutchReport || showNterpretReport ? 'h-screen overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}>

      {/* Background ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full"></div>
      </div>

      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 h-16 flex items-center justify-between backdrop-blur-md border-b border-white/5 bg-black/60">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleEnter()}>
              <Logo className="text-white" size="small" />
              <span className="h-6 w-px bg-white/15" aria-hidden="true" />
              <div className="bg-white rounded-md px-2 py-1 flex items-center" title="In partnership with IMG Academy">
                  <img src="/IMG.png" alt="IMG Academy" className="h-5 w-auto object-contain" />
              </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
              <a href="#pricing" className="hidden sm:inline-flex text-sm font-medium text-gray-400 hover:text-white transition-colors px-3 py-2">
                  Pricing
              </a>
              <button
                  onClick={() => setShowBooking(true)}
                  className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                  Book demo
              </button>
          </div>
      </nav>

      {/* Main Content Container */}
      <div className="relative z-10 w-full pt-28 sm:pt-32 pb-20">
          
          {/* HERO SECTION */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20 text-center relative">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] mb-8 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                  <span className="inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                  <span className="text-[11px] font-medium text-gray-300 tracking-wide">Clutch isn't a feeling. It's a score.</span>
              </div>

              <div className={`flex items-center justify-center gap-3 mb-8 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
                  <Logo className="text-white" size="small" />
                  <span className="text-gray-500 text-xs tracking-[0.3em] uppercase font-semibold">×</span>
                  <div className="bg-white rounded-lg px-3 py-1.5 flex items-center">
                      <img src="/IMG.png" alt="IMG Academy" className="h-7 w-auto object-contain" />
                  </div>
              </div>
              <p className={`text-[11px] uppercase tracking-[0.25em] text-gray-500 font-semibold mb-8 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
                  In partnership with IMG Academy
              </p>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.02] text-white">
                  Coach the <span className="text-blue-400">whole athlete.</span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                  A complete mental scouting report for every player 13-18 - in under 15 minutes. Coaches see exactly how each athlete learns, leads, and performs under pressure.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 sm:mb-16 max-w-md sm:max-w-none mx-auto">
                 <button
                    onClick={() => setShowBooking(true)}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-400 text-white px-8 py-3.5 rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2"
                 >
                    Book a demo <ArrowRight size={16} />
                 </button>

                 <button
                    onClick={scrollToVideo}
                    className="w-full sm:w-auto text-gray-300 hover:text-white px-8 py-3.5 rounded-lg font-medium text-base transition-colors flex items-center justify-center gap-2"
                 >
                    <Play size={14} /> Watch product tour
                 </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
                  <button
                    onClick={() => setShowTestDrive(true)}
                    className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-white/40"
                  >
                      Try a sample assessment
                  </button>
                  <button
                    onClick={() => handleEnter()}
                    className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-white/40"
                  >
                      Explore the coach dashboard
                  </button>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-white/40"
                  >
                      See a sample player report
                  </button>
              </div>
          </section>

          {/* SOCIAL PROOF / TRUSTED TEAMS TICKER */}
          <div className="w-full mb-16 sm:mb-20">
              <TrustedTeams />
          </div>

          {/* FEATURED PARTNERS */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-20 sm:mb-24">
              <p className="text-center text-xs sm:text-sm font-medium text-gray-500 tracking-wide mb-8 sm:mb-10">
                  Trusted by leading youth sports organizations
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <a
                      href="https://www.alliancefastpitch.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-[#070707] hover:bg-white/[0.03] transition-colors p-8 sm:p-10 flex flex-col items-center text-center"
                  >
                      <div className="h-20 sm:h-24 flex items-center justify-center mb-5">
                          <img
                              src="/Alliance.png"
                              alt="Alliance Fastpitch"
                              className="max-h-full max-w-[220px] object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                          />
                      </div>
                      <p className="text-white text-base font-semibold mb-1">Alliance Fastpitch</p>
                      <p className="text-gray-500 text-sm">Premier youth softball</p>
                  </a>
                  <a
                      href="https://www.futurestarsseries.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-[#070707] hover:bg-white/[0.03] transition-colors p-8 sm:p-10 flex flex-col items-center text-center"
                  >
                      <div className="h-20 sm:h-24 flex items-center justify-center mb-5">
                          <img
                              src="/FSS.png"
                              alt="Future Stars Series"
                              className="max-h-full max-w-[220px] object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                          />
                      </div>
                      <p className="text-white text-base font-semibold mb-1">Future Stars Series</p>
                      <p className="text-gray-500 text-sm">Premier youth baseball showcase</p>
                  </a>
                  <a
                      href="https://www.imgacademy.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-[#070707] hover:bg-white/[0.03] transition-colors p-8 sm:p-10 flex flex-col items-center text-center"
                  >
                      <div className="h-20 sm:h-24 flex items-center justify-center mb-5">
                          <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center h-full">
                              <img
                                  src="/IMG.png"
                                  alt="IMG Academy"
                                  className="max-h-full max-w-[160px] object-contain"
                              />
                          </div>
                      </div>
                      <p className="text-white text-base font-semibold mb-1">IMG Academy</p>
                      <p className="text-gray-500 text-sm">World-class athletic training</p>
                  </a>
              </div>

              {/* Recognition lockup */}
              <div className="mt-10 sm:mt-12 flex justify-center">
                  <div className="inline-flex items-center gap-4 sm:gap-5 bg-[#070707] border border-white/10 rounded-2xl pl-3 sm:pl-4 pr-5 sm:pr-7 py-3 sm:py-4">
                      <div className="h-12 sm:h-14 w-12 sm:w-14 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                              src="/ysbr.png"
                              alt="Youth Sports Business Report"
                              className="h-10 sm:h-12 w-10 sm:w-12 object-contain"
                          />
                      </div>
                      <div className="text-left">
                          <p className="text-[10px] sm:text-xs font-medium text-blue-400 uppercase tracking-[0.2em] mb-0.5">2026 Rising Star Award Winner</p>
                          <p className="text-sm sm:text-base text-white font-semibold leading-tight">Youth Sports Business Report</p>
                      </div>
                  </div>
              </div>
          </section>

          {/* TESTIMONIAL - ALLIANCE FASTPITCH */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
              <figure className="border-l-2 border-blue-500 pl-6 sm:pl-8">
                  <blockquote className="text-xl sm:text-2xl md:text-[28px] text-white font-medium leading-[1.35] tracking-tight mb-6">
                      "We're giving athletes a clearer picture of who they are as competitors. Youth sports has spent years indexing physical tools while the mental side - how a player handles pressure, adversity, and big moments - has been left to opinion. This brings real structure and visibility to that part of development. <span className="text-blue-400">At Alliance, we build complete athletes, not just the measurable ones.</span>"
                  </blockquote>
                  <figcaption className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                          <img src="/Alliance.png" alt="" className="h-7 w-7 object-contain" />
                      </div>
                      <div>
                          <p className="text-white text-sm font-semibold">Jami Lobpries</p>
                          <p className="text-gray-500 text-sm">CEO, Alliance Fastpitch &nbsp;·&nbsp; GM, AUSL Cascade</p>
                      </div>
                  </figcaption>
              </figure>
          </section>

          {/* METHODOLOGY / TED TALK */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                  <div className="lg:col-span-5">
                      <p className="text-sm font-medium text-blue-400 mb-3">The science</p>
                      <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-5">
                          The TED Talk behind the method.
                      </h2>
                      <p className="text-lg text-gray-400 leading-relaxed mb-4">
                          NTangible's assessments are grounded in research on how athletes actually perform under pressure - the work that started with this TED Talk.
                      </p>
                      <p className="text-base text-gray-500 leading-relaxed">
                          Watch the framework that powers every NTerpret Mental Scouting Report and Clutch Assessment.
                      </p>
                  </div>
                  <div className="lg:col-span-7">
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
                          <iframe
                              width="100%"
                              height="100%"
                              src="https://www.youtube.com/embed/SmXZSYEnau0?rel=0&modestbranding=1"
                              title="TED Talk - The Science of Mental Performance"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute inset-0 w-full h-full"
                          ></iframe>
                      </div>
                  </div>
              </div>
          </section>

          {/* THE TWO ASSESSMENTS - REPORT MOCKUPS */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
              <div className="mb-12 sm:mb-16 max-w-2xl">
                  <p className="text-sm font-medium text-blue-400 mb-3">The assessments</p>
                  <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                      Two reports. One complete profile.
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                      Every athlete completes both assessments in under 15 minutes. Coaches get the reports instantly inside NControl - and athletes can share them with college coaches in one tap.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {/* NTerpret Mental Scouting Report */}
                  <div className="bg-[#070707] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                      <div className="relative px-6 sm:px-8 pt-10 sm:pt-14 pb-8 sm:pb-10 flex items-end justify-center overflow-hidden bg-gradient-to-b from-blue-500/[0.08] via-transparent to-transparent min-h-[420px] sm:min-h-[520px]">
                          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] bg-blue-500/15 blur-[100px] rounded-full pointer-events-none" />
                          <img
                              src="/NterpretMobile.png"
                              alt="NTerpret Mental Scouting Report on mobile"
                              className="relative z-10 max-h-[420px] sm:max-h-[520px] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                          />
                      </div>
                      <div className="p-6 sm:p-8 border-t border-white/5">
                          <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-[0.2em] mb-2">NTerpret<sup className="text-[8px] tracking-normal ml-0.5">™</sup></p>
                          <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3">Mental Scouting Report</h3>
                          <p className="text-base text-gray-400 leading-relaxed mb-6">
                              The complete cognitive profile - how each athlete learns, leads, communicates, and competes. The report college coaches now expect alongside the highlight tape.
                          </p>
                          <button
                              onClick={() => setShowNterpretReport(true)}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                          >
                              <FileText size={14} /> View sample NTerpret report
                          </button>
                      </div>
                  </div>

                  {/* Clutch Factor Assessment */}
                  <div className="bg-[#070707] border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                      <div className="relative px-6 sm:px-8 pt-10 sm:pt-14 pb-8 sm:pb-10 flex items-end justify-center overflow-hidden bg-gradient-to-b from-blue-500/[0.08] via-transparent to-transparent min-h-[420px] sm:min-h-[520px]">
                          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] bg-blue-500/15 blur-[100px] rounded-full pointer-events-none" />
                          <img
                              src="/ClutchMobile.png"
                              alt="Clutch Assessment on mobile"
                              className="relative z-10 max-h-[420px] sm:max-h-[520px] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                          />
                      </div>
                      <div className="p-6 sm:p-8 border-t border-white/5">
                          <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-[0.2em] mb-2">Clutch Factor<sup className="text-[8px] tracking-normal ml-0.5">™</sup></p>
                          <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3">Clutch Factor Assessment</h3>
                          <p className="text-base text-gray-400 leading-relaxed mb-6">
                              A standardized Clutch Factor<sup className="text-[8px] ml-0.5">™</sup> score that quantifies how an athlete responds when the game is on the line. Benchmarked and tracked year over year.
                          </p>
                          <button
                              onClick={() => setShowClutchReport(true)}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                          >
                              <FileText size={14} /> View sample Clutch report
                          </button>
                      </div>
                  </div>
              </div>
          </section>

          {/* USE CASES: THREE MOMENTS */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
              <div className="mb-12 sm:mb-16 max-w-2xl">
                  <p className="text-sm font-medium text-blue-400 mb-3">Built for your calendar</p>
                  <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                      Three moments that decide your season - and your athletes' future.
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                      Tryouts, annual benchmarks, and college recruiting. One assessment. One source of truth across all three.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="bg-[#070707] p-7 sm:p-8">
                      <div className="flex items-center justify-between mb-6">
                          <p className="text-sm font-medium text-gray-500">Tryout season</p>
                          <Target size={18} className="text-blue-400" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3 leading-tight">
                          Know exactly who you're recruiting.
                      </h3>
                      <p className="text-gray-400 text-base leading-relaxed mb-6">
                          A 90-minute tryout shows athletic skill. NTangible shows the mental side - so you build the right rosters, not just the most talented ones.
                      </p>
                      <ul className="space-y-2.5 border-t border-white/5 pt-5">
                          <li className="text-[15px] text-gray-300 leading-relaxed">
                              <span className="text-white font-medium">Defensible cuts</span> when parents push back.
                          </li>
                          <li className="text-[15px] text-gray-300 leading-relaxed">
                              Place every player on the team that <span className="text-white font-medium">fits how they grow</span>.
                          </li>
                          <li className="text-[15px] text-gray-300 leading-relaxed">
                              Spot the <span className="text-white font-medium">late bloomers and future captains</span>.
                          </li>
                          <li className="text-[15px] text-gray-300 leading-relaxed">
                              Onboard new players with a <span className="text-white font-medium">full profile on day one</span>.
                          </li>
                      </ul>
                  </div>

                  <div className="bg-[#070707] p-7 sm:p-8">
                      <div className="flex items-center justify-between mb-6">
                          <p className="text-sm font-medium text-gray-500">Year-over-year benchmark</p>
                          <BarChart3 size={18} className="text-blue-400" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3 leading-tight">
                          Prove the development is real.
                      </h3>
                      <p className="text-gray-400 text-base leading-relaxed mb-6">
                          Run NTangible every season. Each athlete gets a baseline, then a side-by-side year-over-year view. Growth stops being a feeling.
                      </p>
                      <ul className="space-y-2.5 border-t border-white/5 pt-5">
                          <li className="text-[15px] text-gray-300 leading-relaxed">
                              Show every family <span className="text-white font-medium">concrete growth</span> they can point to.
                          </li>
                          <li className="text-[15px] text-gray-300 leading-relaxed">
                              See which <span className="text-white font-medium">coaches actually move the needle</span>.
                          </li>
                          <li className="text-[15px] text-gray-300 leading-relaxed">
                              Identify kids <span className="text-white font-medium">ready to play up</span> before parents ask.
                          </li>
                          <li className="text-[15px] text-gray-300 leading-relaxed">
                              Report <span className="text-white font-medium">club-wide outcomes</span> to boards and renewal season.
                          </li>
                      </ul>
                  </div>

                  <div className="bg-[#070707] p-7 sm:p-8">
                      <div className="flex items-center justify-between mb-6">
                          <p className="text-sm font-medium text-gray-500">College recruiting</p>
                          <GraduationCap size={18} className="text-blue-400" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3 leading-tight">
                          The report college coaches now expect.
                      </h3>
                      <p className="text-gray-400 text-base leading-relaxed mb-6">
                          In softball, baseball, and beyond, a mental performance profile is becoming a prerequisite. Send the NTerpret report alongside the highlight tape.
                      </p>
                      <ul className="space-y-2.5 border-t border-white/5 pt-5">
                          <li className="text-[15px] text-gray-300 leading-relaxed">
                              Hand college coaches <span className="text-white font-medium">data they can't get from film</span>.
                          </li>
                          <li className="text-[15px] text-gray-300 leading-relaxed">
                              Stand out in a <span className="text-white font-medium">saturated showcase pipeline</span>.
                          </li>
                          <li className="text-[15px] text-gray-300 leading-relaxed">
                              Get ahead of programs that <span className="text-white font-medium">will require this within two years</span>.
                          </li>
                          <li className="text-[15px] text-gray-300 leading-relaxed">
                              Give your athletes a <span className="text-white font-medium">credential their teammates don't have</span>.
                          </li>
                      </ul>
                  </div>
              </div>
          </section>

          {/* THE LINE AT THE TRYOUT TABLE */}
          <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
              <figure className="border-l-2 border-blue-500 pl-6 sm:pl-8">
                  <blockquote className="text-2xl sm:text-3xl md:text-4xl text-white font-medium leading-snug tracking-tight mb-4">
                      "Every player on our roster gets a personalized cognitive profile, so our coaches know exactly how to develop them. <span className="text-blue-400">No other club in your area does this.</span>"
                  </blockquote>
                  <figcaption className="text-sm text-gray-500">
                      The line that wins tryout night.
                  </figcaption>
              </figure>
          </section>

          {/* HOW IT WORKS IN 30 DAYS */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
              <div className="mb-12 sm:mb-16 max-w-2xl">
                  <p className="text-sm font-medium text-blue-400 mb-3">How it works</p>
                  <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                      Live in your club in 30 days.
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                      No IT project. No clipboards. Three steps from kickoff to a full coach dashboard.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  <div>
                      <div className="flex items-baseline gap-3 mb-3">
                          <span className="text-blue-400 text-sm font-semibold tabular-nums">01</span>
                          <span className="text-sm text-gray-500 font-medium">Week 1</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2 leading-snug">Kickoff & player invites</h3>
                      <p className="text-base text-gray-400 leading-relaxed">
                          We meet with your director and head coaches, spin up your NControl workspace, and send personalized assessment invites to every athlete.
                      </p>
                  </div>
                  <div>
                      <div className="flex items-baseline gap-3 mb-3">
                          <span className="text-blue-400 text-sm font-semibold tabular-nums">02</span>
                          <span className="text-sm text-gray-500 font-medium">Week 2</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2 leading-snug">Athletes complete assessments</h3>
                      <p className="text-base text-gray-400 leading-relaxed">
                          Each player takes the NTerpret Mental Scouting Report and Clutch Assessment from any phone or laptop. Done in under 15 minutes, on their own time.
                      </p>
                  </div>
                  <div>
                      <div className="flex items-baseline gap-3 mb-3">
                          <span className="text-blue-400 text-sm font-semibold tabular-nums">03</span>
                          <span className="text-sm text-gray-500 font-medium">Weeks 3-4</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2 leading-snug">Coach training + live dashboard</h3>
                      <p className="text-base text-gray-400 leading-relaxed">
                          We train your coaching staff on how to read each profile, run a 1:1 with our team, and your NControl dashboard goes live with every player ready to coach.
                      </p>
                  </div>
              </div>
          </section>

          {/* FOR FAMILIES */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                  <div className="lg:col-span-5">
                      <p className="text-sm font-medium text-blue-400 mb-3">For families</p>
                      <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-5">
                          Built with parents in mind.
                      </h2>
                      <p className="text-lg text-gray-400 leading-relaxed mb-4">
                          Youth sports is a family decision. We designed the assessment experience so parents feel informed, not surveilled.
                      </p>
                      <p className="text-base text-gray-500 leading-relaxed">
                          Coaches see actionable insight on how each athlete learns and competes - never psychological labels, never anything that follows the kid outside your program.
                      </p>
                  </div>
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      <div className="bg-[#070707] p-6">
                          <p className="text-white text-base font-semibold mb-2">COPPA-aligned</p>
                          <p className="text-gray-500 text-sm leading-relaxed">For athletes 13-18. Parental consent built into onboarding for every player.</p>
                      </div>
                      <div className="bg-[#070707] p-6">
                          <p className="text-white text-base font-semibold mb-2">Club-controlled data</p>
                          <p className="text-gray-500 text-sm leading-relaxed">Reports live inside your private workspace. Never sold, never shared with third parties.</p>
                      </div>
                      <div className="bg-[#070707] p-6">
                          <p className="text-white text-base font-semibold mb-2">Opt-out anytime</p>
                          <p className="text-gray-500 text-sm leading-relaxed">Families can remove their athlete's profile at any time. We delete everything we have on them.</p>
                      </div>
                      <div className="bg-[#070707] p-6">
                          <p className="text-white text-base font-semibold mb-2">Growth, not diagnosis</p>
                          <p className="text-gray-500 text-sm leading-relaxed">We measure how athletes learn, compete, and handle pressure - not personality or clinical labels.</p>
                      </div>
                  </div>
              </div>
          </section>

          {/* PRODUCT TOUR VIDEO */}
          <section ref={videoSectionRef} className="max-w-5xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
              <div className="mb-8 max-w-2xl">
                  <p className="text-sm font-medium text-blue-400 mb-3">Product tour</p>
                  <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05]">
                      See what your coaches will see.
                  </h2>
              </div>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
                  <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/spKsM_5c0iM?autoplay=0&controls=1&rel=0&modestbranding=1"
                      title="NControl Product Tour"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                  ></iframe>
              </div>
          </section>

          {/* PRICING + REVENUE CALCULATOR */}
          <PricingCalculator />

          {/* FINAL CTA */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
              <div className="border-t border-white/10 pt-16 sm:pt-20 text-center">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight leading-[1.05] mb-5">
                      Give every player an unfair advantage.
                  </h2>
                  <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
                      We'll walk through a sample player profile from your sport and show you how NTangible would fit into your next season. 15 minutes, no slides.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md sm:max-w-none mx-auto">
                      <button
                          onClick={() => setShowBooking(true)}
                          className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3.5 rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2"
                      >
                          Book a 15-min call <ArrowRight size={16} />
                      </button>
                      <button
                          onClick={() => setShowReportModal(true)}
                          className="text-gray-300 hover:text-white px-8 py-3.5 rounded-lg font-medium text-base transition-colors flex items-center justify-center gap-2"
                      >
                          See a sample report
                      </button>
                  </div>
              </div>
          </section>

      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-black/60 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
                  <div className="col-span-2 sm:col-span-1">
                      <Logo className="text-white opacity-90 mb-4" size="small" />
                      <p className="text-sm text-gray-500 leading-relaxed mb-5">
                          The Operating System for Mental Performance.
                      </p>
                      <div className="inline-flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-semibold">In partnership with</span>
                      </div>
                      <div className="mt-3 bg-white rounded-md px-3 py-2 inline-flex items-center">
                          <img src="/IMG.png" alt="IMG Academy" className="h-7 w-auto object-contain" />
                      </div>
                  </div>
                  <div>
                      <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Product</p>
                      <ul className="space-y-2.5 text-sm">
                          <li><button onClick={() => handleEnter()} className="text-gray-400 hover:text-white transition-colors">Coach dashboard</button></li>
                          <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                      </ul>
                  </div>
                  <div>
                      <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Try it</p>
                      <ul className="space-y-2.5 text-sm">
                          <li><button onClick={() => setShowTestDrive(true)} className="text-gray-400 hover:text-white transition-colors">Sample assessments</button></li>
                          <li><button onClick={() => setShowReportModal(true)} className="text-gray-400 hover:text-white transition-colors">Sample reports</button></li>
                      </ul>
                  </div>
                  <div>
                      <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Company</p>
                      <ul className="space-y-2.5 text-sm">
                          <li><button onClick={() => setShowBooking(true)} className="text-gray-400 hover:text-white transition-colors">Book a demo</button></li>
                          <li><a href="https://calendly.com/ntangible/30min" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                      </ul>
                  </div>
              </div>
              <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-600">
                  <span>© 2026 NTangible, Inc. • In partnership with IMG Academy</span>
                  <div className="flex gap-5">
                      <span>COPPA-aligned</span>
                      <span>Encrypted data</span>
                      <span>Club-controlled</span>
                  </div>
              </div>
          </div>
      </footer>
      
      {/* Interactive Modals */}
      {showTestDrive && <TestDriveModal onClose={() => setShowTestDrive(false)} />}
      
      {showReportModal && (
        <SampleReportModal 
            onClose={() => setShowReportModal(false)}
            onViewClutch={() => {
                setShowReportModal(false);
                setShowClutchReport(true);
            }}
            onViewNterpret={() => {
                setShowReportModal(false);
                setShowNterpretReport(true);
            }}
        />
      )}

      {showClutchReport && (
        <ClutchAssessment onBack={() => setShowClutchReport(false)} />
      )}

      {showNterpretReport && (
        <NTerpretAssessment onBack={() => setShowNterpretReport(false)} />
      )}

      {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}

    </div>
  );
};

const DumbbellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6.5 6.5 11 11"/>
        <path d="m21 21-1-1"/>
        <path d="m3 3 1 1"/>
        <path d="m18 22 4-4"/>
        <path d="m2 6 4-4"/>
        <path d="m3 10 7-7"/>
        <path d="m14 21 7-7"/>
    </svg>
);

export default LandingPage;
