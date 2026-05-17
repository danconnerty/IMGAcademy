
import React, { useState } from 'react';
import { X, ChevronRight, Activity, Users, Brain, Filter, Database, CheckCircle, Layout, FileText, Dumbbell, MessageSquare, Settings, UserCog, ShieldCheck, Trophy, Target, Zap, UserPlus, Grid } from 'lucide-react';

interface WalkthroughProps {
  onComplete: () => void;
}

const Walkthrough: React.FC<WalkthroughProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "NTANGIBLE NCONTROL",
      subtitle: "Welcome to NControl. This isn't just a database; it's a Mental Performance Engine. We replace 'gut feeling' with quantifiable psychometric data, measuring the competitive makeup, emotional resilience, and cognitive readiness of your roster and recruits.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 bg-black rounded-lg w-full mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            <div className="z-10 text-center">
                 <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-white mb-4">
                    NTANGIBLE <span className="text-blue-500">|</span> NCONTROL
                 </h1>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-700 bg-gray-900/50 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase">System Initialized</span>
                 </div>
            </div>
        </div>
      )
    },
    {
      id: 2,
      title: "MASTER DASHBOARD",
      subtitle: "Your new command center. The Master Dashboard aggregates every team in your organization into a single view. Get an instant snapshot of roster sizes and Clutch Factor ranges across all sports before diving into specific team details.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-slate-50 rounded-lg p-6 border border-gray-100">
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm opacity-90">
                 {/* Mini Team Cards */}
                 <div className="bg-white p-3 rounded shadow-sm border border-gray-200 h-20 flex flex-col justify-between transform -rotate-1">
                     <div className="w-16 h-1.5 bg-gray-800 rounded"></div>
                     <div className="flex justify-between items-end">
                        <div className="w-6 h-1.5 bg-gray-200 rounded"></div>
                        <div className="w-8 h-3 bg-blue-100 rounded border border-blue-200"></div>
                     </div>
                 </div>
                 <div className="bg-white p-3 rounded shadow-sm border border-gray-200 h-20 flex flex-col justify-between transform rotate-1">
                     <div className="w-20 h-1.5 bg-gray-800 rounded"></div>
                     <div className="flex justify-between items-end">
                        <div className="w-6 h-1.5 bg-gray-200 rounded"></div>
                        <div className="w-8 h-3 bg-emerald-100 rounded border border-emerald-200"></div>
                     </div>
                 </div>
                 <div className="bg-white p-3 rounded shadow-sm border border-gray-200 h-20 flex flex-col justify-between transform rotate-1">
                     <div className="w-14 h-1.5 bg-gray-800 rounded"></div>
                     <div className="flex justify-between items-end">
                        <div className="w-6 h-1.5 bg-gray-200 rounded"></div>
                        <div className="w-8 h-3 bg-blue-100 rounded border border-blue-200"></div>
                     </div>
                 </div>
                 <div className="bg-white p-3 rounded shadow-sm border border-gray-200 h-20 flex flex-col justify-between transform -rotate-1">
                     <div className="w-18 h-1.5 bg-gray-800 rounded"></div>
                     <div className="flex justify-between items-end">
                        <div className="w-6 h-1.5 bg-gray-200 rounded"></div>
                        <div className="w-8 h-3 bg-amber-100 rounded border border-amber-200"></div>
                     </div>
                 </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-gray-400">
                <Grid size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Multi-Team Overview</span>
            </div>
        </div>
      )
    },
    {
      id: 3,
      title: "TEAM DNA",
      subtitle: "Clicking a card takes you to that team's specific dashboard. The 'Team DNA' header instantly visualizes the pulse of that roster—tracking active headcount, average Clutch Factor, and Alignment Scores specific to that sport.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-slate-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                 <div className="bg-white p-3 rounded shadow-sm border border-gray-100 flex flex-col gap-2">
                     <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded w-fit"><Target size={14} /></div>
                     <div className="h-2 w-16 bg-gray-200 rounded"></div>
                 </div>
                 <div className="bg-white p-3 rounded shadow-sm border border-gray-100 flex flex-col gap-2">
                     <div className="p-1.5 bg-purple-100 text-purple-600 rounded w-fit"><Activity size={14} /></div>
                     <div className="h-2 w-12 bg-gray-200 rounded"></div>
                 </div>
                 <div className="bg-white p-3 rounded shadow-sm border border-gray-100 flex flex-col gap-2">
                     <div className="p-1.5 bg-amber-100 text-amber-600 rounded w-fit"><Trophy size={14} /></div>
                     <div className="h-2 w-14 bg-gray-200 rounded"></div>
                 </div>
                 <div className="bg-white p-3 rounded shadow-sm border border-gray-100 flex flex-col gap-2">
                     <div className="p-1.5 bg-blue-100 text-blue-600 rounded w-fit"><Users size={14} /></div>
                     <div className="h-2 w-10 bg-gray-200 rounded"></div>
                 </div>
            </div>
        </div>
      )
    },
    {
      id: 4,
      title: "FILTERING THE POOL",
      subtitle: "Once inside a team, use the sidebar filters to narrow the pool by Position and Grad Year. This clears the noise, allowing you to compare the 'Mental Differentiators' of players who already fit your physical criteria.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8">
            <div className="bg-gray-100 px-3 py-1 rounded text-[10px] font-bold text-gray-500 mb-4 uppercase tracking-wider">
                Pool: 100+
            </div>
            {/* CSS Funnel Graphic */}
            <div className="flex flex-col items-center gap-1.5">
                <div className="w-48 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-40 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-32 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-24 h-2 bg-black rounded-full"></div>
                <div className="w-16 h-2 bg-black rounded-full"></div>
                <div className="w-8 h-1.5 bg-blue-600 rounded-full mt-1 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
            </div>
            
            <div className="mt-6 flex items-center gap-3 bg-white border border-gray-200 shadow-lg px-5 py-3 rounded-lg">
                <div className="p-2 bg-blue-50 rounded text-blue-600">
                    <Filter size={20} />
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Result</p>
                    <p className="text-sm font-bold text-gray-900">Exact Matches</p>
                </div>
            </div>
        </div>
      )
    },
    {
      id: 5,
      title: "THE CLUTCH FACTOR",
      subtitle: "The 'Clutch Factor' is our primary composite score (0-1000). It measures performance stability under pressure. Sort the table by this column to instantly identify which players are 'High Reliability' (Elite) vs. those who may need developmental focus.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-gray-50 rounded-lg border border-gray-100 p-4">
             <div className="w-full space-y-3">
                 <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 shadow-sm opacity-50 scale-95">
                     <div className="w-24 h-2 bg-gray-200 rounded"></div>
                     <div className="w-8 h-2 bg-gray-200 rounded"></div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-white rounded-lg border-l-4 border-l-emerald-400 border-y border-r border-gray-200 shadow-md scale-105 transform">
                     <div className="flex items-center gap-3">
                         <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                         <div className="flex flex-col gap-1">
                             <div className="w-32 h-2.5 bg-gray-800 rounded"></div>
                             <div className="w-20 h-2 bg-gray-300 rounded"></div>
                         </div>
                     </div>
                     <div className="text-2xl font-bold text-gray-900">894</div>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 shadow-sm opacity-50 scale-95">
                     <div className="w-24 h-2 bg-gray-200 rounded"></div>
                     <div className="w-8 h-2 bg-gray-200 rounded"></div>
                 </div>
             </div>
             <div className="mt-2 text-[10px] text-gray-400 font-mono uppercase">Sort by Descending</div>
        </div>
      )
    },
    {
      id: 6,
      title: "SCOUTING PROFILE",
      subtitle: "Clicking any player name opens the deep-dive Scouting Modal. The header immediately validates the metrics: Clutch Factor, Alignment Score, and their Ranking against peers in their position and grad year.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-slate-50 rounded-lg border border-slate-100">
            <div className="relative">
                <Layout size={64} className="text-slate-200" />
                <div className="absolute top-0 right-0 bg-white border border-gray-200 p-2 rounded shadow-sm">
                    <div className="w-8 h-1 bg-blue-500 rounded mb-1"></div>
                    <div className="w-6 h-1 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
      )
    },
    {
      id: 7,
      title: "CRITICAL: COACH CALIBRATION",
      subtitle: "You MUST complete 'Coaches NTerpret' in the user dropdown. The system cannot calculate a 'Fit Score' without a baseline. By defining YOUR leadership style (e.g., Authoritative vs. Collaborative), you unlock the algorithm that predicts which players will thrive under your specific command.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-gray-900 rounded-lg text-white relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                <Activity size={200} />
             </div>
             <div className="z-10 flex flex-col items-center">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 border-2 border-dashed border-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-500">?</span>
                    </div>
                    <div className="w-8 h-0.5 bg-gray-600"></div>
                    <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg">
                        <UserCog size={24} />
                    </div>
                 </div>
                 <div className="bg-red-500/20 border border-red-500/50 px-4 py-2 rounded text-red-200 text-xs font-bold uppercase tracking-widest animate-pulse">
                    Action Required
                 </div>
             </div>
        </div>
      )
    },
    {
      id: 8,
      title: "THE ALIGNMENT INDEX",
      subtitle: "Once calibrated, every player receives a 0-100% Fit Score. This isn't a judgment of talent; it's a prediction of friction. A '95% Fit' means they are wired to respond to your coaching style. A '40% Fit' means you will be managing conflict rather than coaching performance.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8">
            <div className="flex gap-4">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center bg-white z-10">
                        <Users size={24} className="text-gray-400" />
                    </div>
                    <p className="text-xs font-bold text-gray-400 mt-2">PLAYER</p>
                </div>
                
                <div className="flex flex-col justify-center items-center -mt-6">
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 mb-1">
                        92% FIT
                    </div>
                    <div className="w-24 h-1 bg-gradient-to-r from-gray-200 via-green-400 to-gray-200 rounded-full"></div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center bg-black text-white z-10 shadow-xl">
                        <Brain size={24} />
                    </div>
                    <p className="text-xs font-bold text-black mt-2">COACH</p>
                </div>
            </div>
        </div>
      )
    },
    {
      id: 9,
      title: "NSIGHTS (AI ANALYSIS)",
      subtitle: "Under the 'NSights' tab, our AI analyzes the raw data to provide narrative behavioral insights. It identifies specific tendencies like 'Tunnel Vision' under stress or 'Performance Anxiety' and translates them into plain English.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-blue-50 rounded-lg">
             <div className="flex gap-3">
                <FileText size={48} className="text-blue-200" />
                <div className="space-y-2">
                    <div className="w-32 h-2 bg-blue-200 rounded animate-pulse"></div>
                    <div className="w-24 h-2 bg-blue-200 rounded animate-pulse"></div>
                    <div className="w-28 h-2 bg-blue-200 rounded animate-pulse"></div>
                </div>
             </div>
             <div className="mt-4 flex items-center gap-2 text-blue-600">
                <Brain size={16} />
                <span className="text-xs font-bold uppercase">AI Generated</span>
             </div>
        </div>
      )
    },
    {
      id: 10,
      title: "PRESCRIPTIVE DRILLS",
      subtitle: "We don't just identify the problem; we fix it. The 'Exercises' tab generates a custom mental workout plan. If a player scores low on 'Focus,' the system prescribes drills like 'Wide-to-Narrow Toggles' to physically train that neural pathway.",
      graphic: (
         <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
             <div className="bg-white p-4 rounded-full shadow-lg">
                 <Dumbbell size={32} className="text-black" />
             </div>
             <div className="mt-4 text-center">
                 <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prescription</div>
                 <div className="text-sm font-bold text-gray-900">Corrective Drills</div>
             </div>
        </div>
      )
    },
    {
      id: 11,
      title: "NTERPRET (USER MANUAL)",
      subtitle: "The 'NTerpret' tab acts as a User Manual for the human being. It tells you exactly how this player learns (Visual vs. Kinesthetic) and how they prefer to receive feedback (Direct vs. Empathetic), saving you months of trial-and-error.",
      graphic: (
         <div className="flex flex-col items-center justify-center h-48 w-full mb-8">
             <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <MessageSquare size={20} className="text-gray-500" />
                 </div>
                 <div className="h-px w-16 bg-gray-300"></div>
                 <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                    <Brain size={20} />
                 </div>
             </div>
             <div className="mt-4 px-4 py-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 font-mono">
                "Coach logically, not emotionally."
             </div>
        </div>
      )
    },
    {
      id: 12,
      title: "RECRUITING PIPELINE",
      subtitle: "Switch to the 'Recruiting' view to manage your pipeline across ALL sports. Use the new Sport filter to narrow down your search and find specific positions like 'C' for Hockey vs. Baseball. The '+ Send Invite' button now allows you to specify which assessment to send.",
      graphic: (
         <div className="flex flex-col items-center justify-center h-48 w-full mb-8">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <Database size={56} className="text-gray-800 relative z-10" />
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 border-2 border-white">
                    <CheckCircle size={16} />
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            </div>
        </div>
      )
    },
    {
      id: 13,
      title: "PIPELINE HEALTH",
      subtitle: "Instant visibility into your recruiting funnel. Track Active Prospects, Pending Invites, and the quality of incoming talent (Avg Clutch Factor) at a glance, ensuring no target slips through the cracks.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-slate-50 rounded-lg p-4">
             <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                 <div className="bg-white p-3 rounded shadow-sm border border-gray-100 flex flex-col gap-2">
                     <div className="p-1.5 bg-blue-100 text-blue-600 rounded w-fit"><Users size={14} /></div>
                     <div className="h-2 w-16 bg-gray-200 rounded"></div>
                 </div>
                 <div className="bg-white p-3 rounded shadow-sm border border-gray-100 flex flex-col gap-2">
                     <div className="p-1.5 bg-orange-100 text-orange-600 rounded w-fit"><UserPlus size={14} /></div>
                     <div className="h-2 w-12 bg-gray-200 rounded"></div>
                 </div>
                 <div className="bg-white p-3 rounded shadow-sm border border-gray-100 flex flex-col gap-2">
                     <div className="p-1.5 bg-yellow-100 text-yellow-600 rounded w-fit"><Zap size={14} /></div>
                     <div className="h-2 w-14 bg-gray-200 rounded"></div>
                 </div>
                 <div className="bg-white p-3 rounded shadow-sm border border-gray-100 flex flex-col gap-2">
                     <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded w-fit"><Target size={14} /></div>
                     <div className="h-2 w-10 bg-gray-200 rounded"></div>
                 </div>
            </div>
        </div>
      )
    },
    {
      id: 14,
      title: "PROFILE & SECURITY",
      subtitle: "You can now manage your personal details, update your organization settings, and change your password directly from the 'My Profile' tab in the user menu. Ensure your account is secure and your role is accurately defined.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-gray-50 rounded-lg border border-gray-200">
             <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mb-3">
                    <ShieldCheck size={32} />
                 </div>
                 <div className="w-32 h-2 bg-gray-100 rounded mb-2"></div>
                 <div className="w-20 h-2 bg-gray-100 rounded"></div>
             </div>
             <div className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Account Management
             </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const stepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-gray-900/90 backdrop-blur-md transition-all duration-500">
      <div className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
            onClick={onComplete}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors z-20"
        >
            <X size={20} />
        </button>

        {/* Step Indicator Pill */}
        <div className="absolute top-6 left-6 z-20">
             <span className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full tracking-widest uppercase shadow-lg">
                Step {stepData.id} <span className="text-gray-500">/</span> {steps.length}
             </span>
        </div>

        <div className="p-8 pt-20">
            
            {/* Dynamic Graphic Area */}
            {stepData.graphic}

            {/* Content */}
            <div className="space-y-4">
                <h2 className="text-2xl font-black italic text-gray-900 uppercase tracking-tighter">
                    {stepData.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {stepData.subtitle}
                </p>
            </div>

            {/* Navigation & Progress */}
            <div className="mt-10 flex items-center justify-between">
                
                {/* Pagination Dots */}
                <div className="flex gap-1.5">
                    {steps.map((s, idx) => (
                        <div 
                            key={s.id} 
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-200'}`}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4">
                    {currentStep > 0 && (
                        <button 
                            onClick={handleBack}
                            className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors"
                        >
                            Back
                        </button>
                    )}
                    
                    <button 
                        onClick={handleNext}
                        className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Walkthrough;
