import React, { useState } from 'react';
import { Play, FileText, CheckCircle, Video, Lock, X, Brain, Users, ExternalLink, Mic } from 'lucide-react';

const BookingModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-5xl h-[85vh] bg-[#0f1115] border border-gray-800 rounded-2xl relative shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center bg-[#0f1115]">
                <h2 className="text-xl font-bold text-white">Schedule Strategy Audit</h2>
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

const MethodologyView: React.FC = () => {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300 px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
        <div>
            <h1 className="text-3xl font-light text-white tracking-tight">METHODOLOGY <span className="font-bold text-blue-500">& DEMOS</span></h1>
            <p className="text-gray-400 mt-2 max-w-2xl">
            See the platform in action. Watch our detailed product walkthroughs and understand the science behind the score.
            </p>
        </div>
        <button className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2">
            <Lock size={14} />
            Request Full Whitepaper
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* FEATURED SECTION: Mimicking the Screenshot */}
            <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Brain size={200} className="text-white" />
                </div>
                
                <div className="flex flex-col gap-8">
                    {/* Header Text Area */}
                    <div>
                        <div className="inline-flex items-center gap-2 text-blue-400 border border-blue-500/30 bg-blue-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                            <Mic size={14} />
                            <span>The Methodology</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black italic text-white mb-6 tracking-tighter uppercase leading-[0.9]">
                            CEO Dan Connerty on <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-white">Measuring Intangibles.</span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Watch NControl CEO Dan Connerty discuss the process and exactly what we are trying to measure in this deep dive into the psychology of performance. This TED Talk explores the psychological mechanisms behind "Clutch" performance and Mental Toughness.
                        </p>
                        
                        {/* "The Concept" Card from Screenshot */}
                        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 mb-8 max-w-lg">
                            <div className="w-10 h-10 bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                                <Brain size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">The Concept</p>
                                <p className="text-white font-medium">"Measuring the Invisible: The Science of Clutch"</p>
                            </div>
                        </div>
                    </div>

                    {/* Video Player */}
                    <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/SmXZSYEnau0" 
                            title="Dr. Sean Richardson TED Talk" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="absolute inset-0"
                        ></iframe>
                    </div>

                    {/* Links Section (The "Button Links" below the video as actionable items) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <a 
                            href="https://ntangible.co/#/team" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-blue-900/20 hover:border-blue-500/50 hover:shadow-lg transition-all cursor-pointer group"
                        >
                            <div className="shrink-0">
                                <div className="p-3 bg-gray-800 border border-white/10 text-gray-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-colors">
                                    <Users size={20} />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-0.5 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                                    Psychologist Team
                                    <ExternalLink size={12} className="opacity-30 group-hover:opacity-100" />
                                </h4>
                                <p className="text-xs text-gray-500 leading-tight group-hover:text-gray-400">
                                    Meet the PhDs behind the science.
                                </p>
                            </div>
                        </a>
                        
                        <a 
                            href="https://ntangible.co/#/research" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-900/20 hover:border-emerald-500/50 hover:shadow-lg transition-all cursor-pointer group"
                        >
                            <div className="shrink-0">
                                <div className="p-3 bg-gray-800 border border-white/10 text-gray-400 rounded-lg group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-500 transition-colors">
                                    <FileText size={20} />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-0.5 flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                                    Research Foundation
                                    <ExternalLink size={12} className="opacity-30 group-hover:opacity-100" />
                                </h4>
                                <p className="text-xs text-gray-500 leading-tight group-hover:text-gray-400">
                                    View our peer-reviewed studies.
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* Video 2: Recruiting Dashboard (Dark Mode) */}
            <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Video size={150} className="text-emerald-500" />
                </div>
                
                <div className="flex flex-col gap-6">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-900/20 text-emerald-500 rounded-lg">
                            <CheckCircle size={20} />
                        </div>
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Recruiting & Transfer Portal</span>
                     </div>
                     
                     <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Recruiting Dashboard Demo</h2>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            The cost of a bad transfer is too high. This deep dive into the Recruiting module shows you how to filter the transfer portal by 'Mental Alignment'. See how to identify players who fit your specific coaching style before you sign them.
                        </p>
                     </div>

                     <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-white/10 shadow-lg relative mt-2">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            src="https://www.youtube.com/embed/NMKUJfjI_HQ" 
                            title="NControl Recruiting Dashboard Demo" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                             className="absolute inset-0"
                        ></iframe>
                    </div>
                </div>
            </div>

        </div>

        {/* Sidebar / Case Studies (Dark Mode) */}
        <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Case Studies</h3>
            
            <div className="bg-[#0f0f0f] p-6 rounded-xl border border-white/10 shadow-sm hover:border-blue-500/50 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-emerald-900/20 text-emerald-500 rounded-lg">
                        <CheckCircle size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/20 border border-emerald-500/20 px-2 py-1 rounded">ROI: +12 Wins</span>
                </div>
                <h4 className="font-bold text-gray-200 mb-2 group-hover:text-blue-400 transition-colors">The Turnaround: Power 5 Football</h4>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    How a struggling SEC program used NControl to overhaul their roster culture, identifying 8 "cancerous" recruits to avoid.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase group-hover:text-blue-400 transition-colors">
                    <FileText size={12} />
                    Read Case Study
                </div>
            </div>

            <div className="bg-[#0f0f0f] p-6 rounded-xl border border-white/10 shadow-sm hover:border-blue-500/50 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-900/20 text-blue-500 rounded-lg">
                        <CheckCircle size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-900/20 border border-blue-500/20 px-2 py-1 rounded">Retention: 94%</span>
                </div>
                <h4 className="font-bold text-gray-200 mb-2 group-hover:text-blue-400 transition-colors">Stopping the Transfer Bleed</h4>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    A Big 12 Basketball program used our "Fit Score" algorithm to reduce transfer portal attrition by 60% in one season.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600 uppercase group-hover:text-blue-400 transition-colors">
                    <FileText size={12} />
                    Read Case Study
                </div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-xl text-white shadow-lg border border-white/10">
                <h4 className="font-bold text-lg mb-2">Schedule a Custom Audit</h4>
                <p className="text-sm text-gray-400 mb-6">
                    We will analyze your last 3 recruiting classes to show you exactly where the "Alignment Gap" exists.
                </p>
                <button 
                    onClick={() => setShowBooking(true)}
                    className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Book Consultation
                </button>
            </div>

        </div>
      </div>

      {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}
    </div>
  );
};

export default MethodologyView;
