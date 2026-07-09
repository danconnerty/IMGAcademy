import React, { useState } from 'react';
import { Play, FileText, CheckCircle, Video, Lock, X, Brain, Users, ExternalLink, Mic } from 'lucide-react';

const BookingModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-5xl h-[85vh] nt-card shadow-lift relative overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-line flex justify-between items-center bg-white">
                <h2 className="text-xl font-semibold text-ink tracking-tightest">Schedule strategy audit</h2>
                <button onClick={onClose} className="text-gray-brand hover:text-ink transition-colors">
                    <X size={24} strokeWidth={1.8} />
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
      <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-line pb-8">
        <div>
            <p className="font-mono text-[11px] text-gray-brand uppercase font-medium tracking-[0.25em] mb-3">The science</p>
            <h1 className="text-3xl font-semibold text-ink tracking-tightest">Methodology &amp; demos</h1>
            <p className="text-body mt-2 max-w-2xl leading-relaxed">
            See the platform in action. Watch our detailed product walkthroughs and understand the science behind the score.
            </p>
        </div>
        <button className="nt-btn-ghost">
            <Lock size={14} strokeWidth={1.8} />
            Request full whitepaper
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">

            {/* FEATURED SECTION */}
            <div className="nt-card p-8 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <Brain size={200} className="text-ink" strokeWidth={1.8} />
                </div>

                <div className="flex flex-col gap-8">
                    {/* Header Text Area */}
                    <div>
                        <div className="inline-flex items-center gap-2 font-mono text-[11px] text-gray-brand uppercase font-medium tracking-[0.25em] mb-6">
                            <Mic size={14} strokeWidth={1.8} />
                            <span>The methodology</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-semibold text-ink mb-6 tracking-tightest leading-tight text-balance">
                            CEO Dan Connerty on measuring intangibles.
                        </h2>
                        <p className="text-body text-lg leading-relaxed mb-8">
                            Watch NControl CEO Dan Connerty discuss the process and exactly what we are trying to measure in this deep dive into the psychology of performance. This TED Talk explores the psychological mechanisms behind "Clutch" performance and Mental Toughness.
                        </p>

                        {/* "The Concept" key line */}
                        <div className="nt-callout flex items-center gap-4 mb-8 max-w-lg">
                            <div className="w-10 h-10 text-ink flex items-center justify-center shrink-0">
                                <Brain size={20} strokeWidth={1.8} />
                            </div>
                            <div>
                                <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.25em]">The concept</p>
                                <p className="text-ink font-medium">"Measuring the Invisible: The Science of Clutch"</p>
                            </div>
                        </div>
                    </div>

                    {/* Video Player */}
                    <div className="aspect-video w-full bg-ink rounded-card overflow-hidden border border-line-strong relative">
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

                    {/* Links Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <a
                            href="https://ntangible.co/#/team"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nt-card nt-card-hover flex items-center gap-4 p-4 cursor-pointer group/link"
                        >
                            <div className="shrink-0">
                                <div className="text-gray-soft group-hover/link:text-ink transition-colors">
                                    <Users size={20} strokeWidth={1.8} />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-ink mb-0.5 flex items-center gap-2">
                                    Psychologist team
                                    <ExternalLink size={12} strokeWidth={1.8} className="text-gray-soft opacity-60 group-hover/link:opacity-100" />
                                </h4>
                                <p className="text-xs text-gray-brand leading-tight">
                                    Meet the PhDs behind the science.
                                </p>
                            </div>
                        </a>

                        <a
                            href="https://ntangible.co/#/research"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nt-card nt-card-hover flex items-center gap-4 p-4 cursor-pointer group/link"
                        >
                            <div className="shrink-0">
                                <div className="text-gray-soft group-hover/link:text-ink transition-colors">
                                    <FileText size={20} strokeWidth={1.8} />
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-ink mb-0.5 flex items-center gap-2">
                                    Research foundation
                                    <ExternalLink size={12} strokeWidth={1.8} className="text-gray-soft opacity-60 group-hover/link:opacity-100" />
                                </h4>
                                <p className="text-xs text-gray-brand leading-tight">
                                    View our peer-reviewed studies.
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* Video 2: Recruiting Dashboard */}
            <div className="nt-card p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Video size={150} className="text-ink" strokeWidth={1.8} />
                </div>

                <div className="flex flex-col gap-6">
                     <div className="inline-flex items-center gap-2 font-mono text-[11px] text-gray-brand uppercase font-medium tracking-[0.25em]">
                        <CheckCircle size={14} strokeWidth={1.8} />
                        <span>Recruiting &amp; transfer portal</span>
                     </div>

                     <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-ink tracking-tightest">Recruiting dashboard demo</h2>
                        <p className="text-body leading-relaxed text-sm">
                            The cost of a bad transfer is too high. This deep dive into the Recruiting module shows you how to filter the transfer portal by 'Mental Alignment'. See how to identify players who fit your specific coaching style before you sign them.
                        </p>
                     </div>

                     <div className="aspect-video w-full bg-ink rounded-card overflow-hidden border border-line-strong relative mt-2">
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

        {/* Sidebar / Case Studies */}
        <div className="space-y-6">
            <h3 className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.25em] mb-2">Case studies</h3>

            <div className="nt-card nt-card-hover p-6 cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-ink">
                        <CheckCircle size={20} strokeWidth={1.8} />
                    </div>
                    <span className="font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] border border-line-strong bg-white px-2 py-1 rounded-pill tabular-nums">ROI: +12 wins</span>
                </div>
                <h4 className="font-semibold text-ink mb-2 tracking-tightest">The turnaround: Power 5 football</h4>
                <p className="text-sm text-body leading-relaxed mb-4">
                    How a struggling SEC program used NControl to overhaul their roster culture, identifying 8 "cancerous" recruits to avoid.
                </p>
                <div className="nt-btn-link">
                    <FileText size={12} strokeWidth={1.8} />
                    Read case study
                </div>
            </div>

            <div className="nt-card nt-card-hover p-6 cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-ink">
                        <CheckCircle size={20} strokeWidth={1.8} />
                    </div>
                    <span className="font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] border border-line-strong bg-white px-2 py-1 rounded-pill tabular-nums">Retention: 94%</span>
                </div>
                <h4 className="font-semibold text-ink mb-2 tracking-tightest">Stopping the transfer bleed</h4>
                <p className="text-sm text-body leading-relaxed mb-4">
                    A Big 12 Basketball program used our "Fit Score" algorithm to reduce transfer portal attrition by 60% in one season.
                </p>
                <div className="nt-btn-link">
                    <FileText size={12} strokeWidth={1.8} />
                    Read case study
                </div>
            </div>

            <div className="nt-callout p-6">
                <h4 className="font-semibold text-lg text-ink mb-2 tracking-tightest">Schedule a custom audit</h4>
                <p className="text-sm text-body leading-relaxed mb-6">
                    We will analyze your last 3 recruiting classes to show you exactly where the "Alignment Gap" exists.
                </p>
                <button
                    onClick={() => setShowBooking(true)}
                    className="nt-btn-primary w-full justify-center"
                >
                    Book consultation
                </button>
            </div>

        </div>
      </div>

      {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}
    </div>
  );
};

export default MethodologyView;
