
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
      title: "NTangible NControl",
      subtitle: "Welcome to NControl. This isn't just a database; it's a Mental Performance Engine. We replace 'gut feeling' with quantifiable psychometric data, measuring the competitive makeup, emotional resilience, and cognitive readiness of your roster and recruits.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 bg-white nt-stat-grid rounded-card border border-line-strong w-full mb-8 relative overflow-hidden">
            <div className="z-10 text-center">
                 <h1 className="text-3xl sm:text-4xl font-semibold tracking-tightest text-ink mb-4">
                    NTangible <span className="text-gray-soft">|</span> NControl
                 </h1>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill border border-line-strong bg-white">
                    <div className="w-2 h-2 rounded-full bg-ink"></div>
                    <span className="font-mono text-[10px] font-medium text-gray-brand tracking-[0.16em] uppercase">System initialized</span>
                 </div>
            </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Master dashboard",
      subtitle: "Your new command center. The Master Dashboard aggregates every team in your organization into a single view. Get an instant snapshot of roster sizes and Clutch Factor ranges across all sports before diving into specific team details.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-white nt-stat-grid rounded-card p-6 border border-line-strong">
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                 {/* Mini Team Cards */}
                 <div className="bg-white p-3 rounded-card border border-line-strong h-20 flex flex-col justify-between transform -rotate-1">
                     <div className="w-16 h-1.5 bg-ink rounded-full"></div>
                     <div className="flex justify-between items-end">
                        <div className="w-6 h-1.5 bg-line-strong rounded-full"></div>
                        <div className="w-8 h-3 bg-chip rounded-card border border-line-strong"></div>
                     </div>
                 </div>
                 <div className="bg-white p-3 rounded-card border border-line-strong h-20 flex flex-col justify-between transform rotate-1">
                     <div className="w-20 h-1.5 bg-ink rounded-full"></div>
                     <div className="flex justify-between items-end">
                        <div className="w-6 h-1.5 bg-line-strong rounded-full"></div>
                        <div className="w-8 h-3 bg-chip rounded-card border border-line-strong"></div>
                     </div>
                 </div>
                 <div className="bg-white p-3 rounded-card border border-line-strong h-20 flex flex-col justify-between transform rotate-1">
                     <div className="w-14 h-1.5 bg-ink rounded-full"></div>
                     <div className="flex justify-between items-end">
                        <div className="w-6 h-1.5 bg-line-strong rounded-full"></div>
                        <div className="w-8 h-3 bg-chip rounded-card border border-line-strong"></div>
                     </div>
                 </div>
                 <div className="bg-white p-3 rounded-card border border-line-strong h-20 flex flex-col justify-between transform -rotate-1">
                     <div className="w-18 h-1.5 bg-ink rounded-full"></div>
                     <div className="flex justify-between items-end">
                        <div className="w-6 h-1.5 bg-line-strong rounded-full"></div>
                        <div className="w-8 h-3 bg-chip rounded-card border border-line-strong"></div>
                     </div>
                 </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-gray-brand">
                <Grid size={16} strokeWidth={1.8} />
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em]">Multi-team overview</span>
            </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Team DNA",
      subtitle: "Clicking a card takes you to that team's specific dashboard. The 'Team DNA' header instantly visualizes the pulse of that roster - tracking active headcount, average Clutch Factor, and Alignment Scores specific to that sport.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-white nt-stat-grid rounded-card border border-line-strong p-4">
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                 <div className="bg-white p-3 rounded-card border border-line-strong flex flex-col gap-2">
                     <div className="p-1.5 bg-chip text-ink rounded-card w-fit"><Target size={14} strokeWidth={1.8} /></div>
                     <div className="h-2 w-16 bg-line-strong rounded-full"></div>
                 </div>
                 <div className="bg-white p-3 rounded-card border border-line-strong flex flex-col gap-2">
                     <div className="p-1.5 bg-chip text-ink rounded-card w-fit"><Activity size={14} strokeWidth={1.8} /></div>
                     <div className="h-2 w-12 bg-line-strong rounded-full"></div>
                 </div>
                 <div className="bg-white p-3 rounded-card border border-line-strong flex flex-col gap-2">
                     <div className="p-1.5 bg-chip text-ink rounded-card w-fit"><Trophy size={14} strokeWidth={1.8} /></div>
                     <div className="h-2 w-14 bg-line-strong rounded-full"></div>
                 </div>
                 <div className="bg-white p-3 rounded-card border border-line-strong flex flex-col gap-2">
                     <div className="p-1.5 bg-chip text-ink rounded-card w-fit"><Users size={14} strokeWidth={1.8} /></div>
                     <div className="h-2 w-10 bg-line-strong rounded-full"></div>
                 </div>
            </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Filtering the pool",
      subtitle: "Once inside a team, use the sidebar filters to narrow the pool by Position and Grad Year. This clears the noise, allowing you to compare the 'Mental Differentiators' of players who already fit your physical criteria.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8">
            <div className="bg-chip px-3 py-1 rounded-card font-mono text-[10px] font-medium text-gray-brand mb-4 uppercase tracking-[0.16em] tabular-nums">
                Pool: 100+
            </div>
            {/* CSS Funnel Graphic */}
            <div className="flex flex-col items-center gap-1.5">
                <div className="w-48 h-2 bg-line-strong rounded-full"></div>
                <div className="w-40 h-2 bg-line-strong rounded-full"></div>
                <div className="w-32 h-2 bg-gray-soft rounded-full"></div>
                <div className="w-24 h-2 bg-ink rounded-full"></div>
                <div className="w-16 h-2 bg-ink rounded-full"></div>
                <div className="w-8 h-1.5 bg-ink rounded-full mt-1"></div>
            </div>

            <div className="mt-6 flex items-center gap-3 bg-white border border-line-strong shadow-lift px-5 py-3 rounded-card">
                <div className="p-2 bg-chip rounded-card text-ink">
                    <Filter size={20} strokeWidth={1.8} />
                </div>
                <div>
                    <p className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.16em] font-medium">Result</p>
                    <p className="text-sm font-semibold text-ink">Exact matches</p>
                </div>
            </div>
        </div>
      )
    },
    {
      id: 5,
      title: "The Clutch Factor",
      subtitle: "The 'Clutch Factor' is our primary composite score (0-1000). It measures performance stability under pressure. Sort the table by this column to instantly identify which players are 'High Reliability' (Elite) vs. those who may need developmental focus.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-white nt-stat-grid rounded-card border border-line-strong p-4">
             <div className="w-full space-y-3">
                 <div className="flex items-center justify-between p-3 bg-white rounded-card border border-line-strong opacity-50 scale-95">
                     <div className="w-24 h-2 bg-line-strong rounded-full"></div>
                     <div className="w-8 h-2 bg-line-strong rounded-full"></div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-white rounded-card border-l-4 border-l-ink border-y border-r border-line-strong shadow-lift scale-105 transform">
                     <div className="flex items-center gap-3">
                         <div className="w-3 h-3 bg-ink rounded-full"></div>
                         <div className="flex flex-col gap-1">
                             <div className="w-32 h-2.5 bg-ink rounded-full"></div>
                             <div className="w-20 h-2 bg-line-strong rounded-full"></div>
                         </div>
                     </div>
                     <div className="text-2xl font-semibold text-ink tabular-nums">894</div>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white rounded-card border border-line-strong opacity-50 scale-95">
                     <div className="w-24 h-2 bg-line-strong rounded-full"></div>
                     <div className="w-8 h-2 bg-line-strong rounded-full"></div>
                 </div>
             </div>
             <div className="mt-2 font-mono text-[10px] text-gray-brand uppercase tracking-[0.16em]">Sort by descending</div>
        </div>
      )
    },
    {
      id: 6,
      title: "Scouting profile",
      subtitle: "Clicking any player name opens the deep-dive Scouting Modal. The header immediately validates the metrics: Clutch Factor, Alignment Score, and their Ranking against peers in their position and grad year.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-white nt-stat-grid rounded-card border border-line-strong">
            <div className="relative">
                <Layout size={64} strokeWidth={1.8} className="text-gray-soft" />
                <div className="absolute top-0 right-0 bg-white border border-line-strong p-2 rounded-card shadow-lift">
                    <div className="w-8 h-1 bg-ink rounded-full mb-1"></div>
                    <div className="w-6 h-1 bg-line-strong rounded-full"></div>
                </div>
            </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Critical: Coach calibration",
      subtitle: "You MUST complete 'Coaches NTerpret' in the user dropdown. The system cannot calculate a 'Fit Score' without a baseline. By defining YOUR leadership style (e.g., Authoritative vs. Collaborative), you unlock the algorithm that predicts which players will thrive under your specific command.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-white nt-stat-grid rounded-card border border-line-strong text-ink relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.04] flex items-center justify-center">
                <Activity size={200} strokeWidth={1.8} />
             </div>
             <div className="z-10 flex flex-col items-center">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 border-2 border-dashed border-line-strong rounded-full flex items-center justify-center">
                        <span className="text-2xl font-semibold text-gray-soft">?</span>
                    </div>
                    <div className="w-8 h-0.5 bg-line-strong"></div>
                    <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center">
                        <UserCog size={24} strokeWidth={1.8} />
                    </div>
                 </div>
                 <div className="bg-white border border-ink px-4 py-2 rounded-card text-ink font-mono text-[10px] font-medium uppercase tracking-[0.16em]">
                    Action required
                 </div>
             </div>
        </div>
      )
    },
    {
      id: 8,
      title: "The Alignment Index",
      subtitle: "Once calibrated, every player receives a 0-100% Fit Score. This isn't a judgment of talent; it's a prediction of friction. A '95% Fit' means they are wired to respond to your coaching style. A '40% Fit' means you will be managing conflict rather than coaching performance.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8">
            <div className="flex gap-4">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-4 border-line-strong flex items-center justify-center bg-white z-10">
                        <Users size={24} strokeWidth={1.8} className="text-gray-soft" />
                    </div>
                    <p className="font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] mt-2">Player</p>
                </div>

                <div className="flex flex-col justify-center items-center -mt-6">
                    <div className="px-3 py-1 bg-ink text-white font-mono text-[10px] font-medium rounded-pill tracking-[0.16em] uppercase mb-1 tabular-nums">
                        92% Fit
                    </div>
                    <div className="w-24 h-1 bg-line-strong rounded-full"></div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-4 border-ink flex items-center justify-center bg-ink text-white z-10">
                        <Brain size={24} strokeWidth={1.8} />
                    </div>
                    <p className="font-mono text-[10px] font-medium text-ink uppercase tracking-[0.16em] mt-2">Coach</p>
                </div>
            </div>
        </div>
      )
    },
    {
      id: 9,
      title: "NSights (AI analysis)",
      subtitle: "Under the 'NSights' tab, our AI analyzes the raw data to provide narrative behavioral insights. It identifies specific tendencies like 'Tunnel Vision' under stress or 'Pressure Cracking' late in games and translates them into plain English.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-white nt-stat-grid rounded-card border border-line-strong">
             <div className="flex gap-3">
                <FileText size={48} strokeWidth={1.8} className="text-gray-soft" />
                <div className="space-y-2">
                    <div className="w-32 h-2 bg-line-strong rounded-full"></div>
                    <div className="w-24 h-2 bg-line-strong rounded-full"></div>
                    <div className="w-28 h-2 bg-line-strong rounded-full"></div>
                </div>
             </div>
             <div className="mt-4 flex items-center gap-2 text-ink">
                <Brain size={16} strokeWidth={1.8} />
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em]">AI generated</span>
             </div>
        </div>
      )
    },
    {
      id: 10,
      title: "Prescriptive drills",
      subtitle: "We don't just identify the problem; we fix it. The 'Exercises' tab generates a custom mental workout plan. If a player scores low on 'Focus,' the system prescribes drills like 'Wide-to-Narrow Toggles' to physically train that neural pathway.",
      graphic: (
         <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-white rounded-card border-2 border-dashed border-line-strong">
             <div className="bg-white p-4 rounded-full border border-line-strong shadow-lift">
                 <Dumbbell size={32} strokeWidth={1.8} className="text-ink" />
             </div>
             <div className="mt-4 text-center">
                 <div className="font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em]">Prescription</div>
                 <div className="text-sm font-semibold text-ink mt-1">Corrective drills</div>
             </div>
        </div>
      )
    },
    {
      id: 11,
      title: "NTerpret (user manual)",
      subtitle: "The 'NTerpret' tab acts as a User Manual for the human being. It tells you exactly how this player learns (Visual vs. Kinesthetic) and how they prefer to receive feedback (Direct vs. Empathetic), saving you months of trial-and-error.",
      graphic: (
         <div className="flex flex-col items-center justify-center h-48 w-full mb-8">
             <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-chip rounded-full flex items-center justify-center">
                    <MessageSquare size={20} strokeWidth={1.8} className="text-gray-brand" />
                 </div>
                 <div className="h-px w-16 bg-line-strong"></div>
                 <div className="w-12 h-12 bg-ink text-white rounded-full flex items-center justify-center">
                    <Brain size={20} strokeWidth={1.8} />
                 </div>
             </div>
             <div className="mt-4 px-4 py-2 bg-white border border-line-strong rounded-card text-xs text-body font-mono">
                "Coach logically, not emotionally."
             </div>
        </div>
      )
    },
    {
      id: 12,
      title: "Recruiting pipeline",
      subtitle: "Switch to the 'Recruiting' view to manage your pipeline across ALL sports. Use the new Sport filter to narrow down your search and find specific positions like 'C' for Hockey vs. Baseball. The '+ Send Invite' button now allows you to specify which assessment to send.",
      graphic: (
         <div className="flex flex-col items-center justify-center h-48 w-full mb-8">
            <div className="relative">
                <Database size={56} strokeWidth={1.8} className="text-ink relative z-10" />
                <div className="absolute -top-2 -right-2 bg-ink text-white rounded-full p-1 border-2 border-white">
                    <CheckCircle size={16} strokeWidth={1.8} />
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <span className="w-2 h-2 bg-line-strong rounded-full"></span>
                <span className="w-2 h-2 bg-line-strong rounded-full"></span>
                <span className="w-2 h-2 bg-ink rounded-full"></span>
            </div>
        </div>
      )
    },
    {
      id: 13,
      title: "Pipeline health",
      subtitle: "Instant visibility into your recruiting funnel. Track Active Prospects, Pending Invites, and the quality of incoming talent (Avg Clutch Factor) at a glance, ensuring no target slips through the cracks.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-white nt-stat-grid rounded-card border border-line-strong p-4">
             <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                 <div className="bg-white p-3 rounded-card border border-line-strong flex flex-col gap-2">
                     <div className="p-1.5 bg-chip text-ink rounded-card w-fit"><Users size={14} strokeWidth={1.8} /></div>
                     <div className="h-2 w-16 bg-line-strong rounded-full"></div>
                 </div>
                 <div className="bg-white p-3 rounded-card border border-line-strong flex flex-col gap-2">
                     <div className="p-1.5 bg-chip text-ink rounded-card w-fit"><UserPlus size={14} strokeWidth={1.8} /></div>
                     <div className="h-2 w-12 bg-line-strong rounded-full"></div>
                 </div>
                 <div className="bg-white p-3 rounded-card border border-line-strong flex flex-col gap-2">
                     <div className="p-1.5 bg-chip text-ink rounded-card w-fit"><Zap size={14} strokeWidth={1.8} /></div>
                     <div className="h-2 w-14 bg-line-strong rounded-full"></div>
                 </div>
                 <div className="bg-white p-3 rounded-card border border-line-strong flex flex-col gap-2">
                     <div className="p-1.5 bg-chip text-ink rounded-card w-fit"><Target size={14} strokeWidth={1.8} /></div>
                     <div className="h-2 w-10 bg-line-strong rounded-full"></div>
                 </div>
            </div>
        </div>
      )
    },
    {
      id: 14,
      title: "Profile & security",
      subtitle: "You can now manage your personal details, update your organization settings, and change your password directly from the 'My Profile' tab in the user menu. Ensure your account is secure and your role is accurately defined.",
      graphic: (
        <div className="flex flex-col items-center justify-center h-48 w-full mb-8 bg-white nt-stat-grid rounded-card border border-line-strong">
             <div className="bg-white p-6 rounded-card border border-line-strong shadow-lift flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-ink text-white flex items-center justify-center mb-3">
                    <ShieldCheck size={32} strokeWidth={1.8} />
                 </div>
                 <div className="w-32 h-2 bg-line-strong rounded-full mb-2"></div>
                 <div className="w-20 h-2 bg-line-strong rounded-full"></div>
             </div>
             <div className="mt-4 font-mono text-[10px] text-gray-brand font-medium uppercase tracking-[0.16em]">
                Account management
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-ink/40 backdrop-blur-sm transition-all duration-500">
      <div className="relative w-full max-w-[500px] bg-white rounded-card border border-line-strong shadow-lift overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* Close Button */}
        <button
            onClick={onComplete}
            className="absolute top-6 right-6 text-gray-brand hover:text-ink transition-colors z-20"
        >
            <X size={20} strokeWidth={1.8} />
        </button>

        {/* Step Indicator Pill */}
        <div className="absolute top-6 left-6 z-20">
             <span className="bg-ink text-white font-mono text-[10px] font-medium px-3 py-1.5 rounded-pill tracking-[0.16em] uppercase tabular-nums">
                Step {stepData.id} <span className="text-gray-soft">/</span> {steps.length}
             </span>
        </div>

        <div className="p-8 pt-20">

            {/* Dynamic Graphic Area */}
            {stepData.graphic}

            {/* Content */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-ink tracking-tightest text-balance">
                    {stepData.title}
                </h2>
                <p className="text-sm text-body leading-relaxed">
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
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-ink' : 'w-1.5 bg-line-strong'}`}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4">
                    {currentStep > 0 && (
                        <button
                            onClick={handleBack}
                            className="font-mono text-[11px] font-medium text-gray-brand hover:text-ink uppercase tracking-[0.16em] transition-colors"
                        >
                            Back
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        className="bg-ink text-white px-6 py-3 rounded-pill flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em] hover:opacity-90 transition-opacity active:scale-[0.97]"
                    >
                        {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                        <ChevronRight size={14} strokeWidth={1.8} className="nt-arrow" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Walkthrough;
