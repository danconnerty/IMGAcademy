
import React, { useState, useEffect, useRef } from 'react';
import {
    Activity, Brain, ArrowRight, Check, X, FileText, Target,
} from 'lucide-react';
import { ViewType } from '../types';
import { preloadDashboard } from '../App';
import { TestDriveModal } from './TestDriveModal';
import ClutchAssessment from './ClutchAssessment';
import NTerpretAssessment from './NTerpretAssessment';
import TrustedTeams from './TrustedTeams';

interface LandingPageProps {
  onEnter: (orgName: string, initialView?: ViewType) => void;
}

// --- CO-BRANDED LOGO ---
const Logo = ({ className = "", size = "normal" }: { className?: string, size?: "small" | "normal" }) => {
    const imgHeight = size === "small" ? "h-7" : "h-9";
    const ntHeight = size === "small" ? "h-3.5" : "h-4";

    return (
        <div className={`flex items-center gap-2.5 select-none ${className}`}>
            <img src="/NTangiblelogowhite.PNG" alt="NTangible" className={`${ntHeight} w-auto object-contain`} />
            <span className="text-white/25 text-lg font-light leading-none">&times;</span>
            <img
                src="/IMG.png"
                alt="IMG Academy"
                className={`${imgHeight} w-auto object-contain`}
            />
        </div>
    );
};

// --- BOOKING MODAL ---
const BookingModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-5xl h-[85vh] bg-[#0f1115] border border-gray-800 rounded-2xl relative shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center bg-[#0f1115]">
                <h2 className="text-xl font-bold text-white">Continue the conversation</h2>
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
                    title="Schedule Integration Call"
                    className="w-full h-full"
                ></iframe>
            </div>
        </div>
    </div>
);

// --- SAMPLE REPORT MODAL ---
const SampleReportModal = ({ onClose, onViewClutch, onViewNterpret }: { onClose: () => void, onViewClutch: () => void, onViewNterpret: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-lg bg-[#0f1115] border border-gray-800 rounded-2xl relative shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center bg-[#0f1115]">
                <h2 className="text-xl font-bold text-white">Inside The Profile</h2>
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
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Clutch Factor Assessment</h3>
                        </div>
                        <ArrowRight size={18} className="text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors pl-[52px]">
                        See a sample report - how an athlete handles pressure when the game is on the line.
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
                            <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">NTerpret Mental Scouting Report</h3>
                        </div>
                        <ArrowRight size={18} className="text-gray-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors pl-[52px]">
                        Explore a sample profile - learning style, motivation, and how to coach the athlete.
                    </p>
                </button>
            </div>
        </div>
    </div>
);

// --- ECONOMICS + REVENUE CALCULATOR ---
type VolumeTier = { min: number; max: number; price: number; imgShare: number; label: string; tone: string };

const VOLUME_TIERS: VolumeTier[] = [
    { min: 0,       max: 100_000,  price: 10,   imgShare: 3, label: 'Entry',    tone: 'text-blue-400' },
    { min: 100_000, max: 250_000,  price: 8.5,  imgShare: 3, label: 'Scale',    tone: 'text-blue-400' },
    { min: 250_000, max: Infinity, price: 7.5,  imgShare: 3, label: 'Platform', tone: 'text-emerald-400' },
];

const MAX_PROFILES = 1_000_000;

const tierForVolume = (v: number): VolumeTier =>
    VOLUME_TIERS.find(t => v >= t.min && v < t.max) ?? VOLUME_TIERS[VOLUME_TIERS.length - 1];

const PricingCalculator = () => {
    const [profiles, setProfiles] = useState(500_000);
    const [elevateAcademies, setElevateAcademies] = useState(5);

    // Tunable assumptions hidden behind a disclosure
    const [showAdvanced, setShowAdvanced]   = useState(false);
    const [lowScorePct, setLowScorePct]     = useState(20);
    const [conversionPct, setConversionPct] = useState(5);
    const [sessionPrice, setSessionPrice]   = useState(90);
    const [academySize, setAcademySize]     = useState(400);

    const clamped = Math.max(0, Math.min(MAX_PROFILES, Number.isFinite(profiles) ? profiles : 0));
    const tier = tierForVolume(clamped);

    // Annual subscription model - one assessment per year bundled in the fee
    const baselineRev    = clamped * tier.imgShare;
    const academyPlusRev = clamped * (lowScorePct / 100) * (conversionPct / 100) * sessionPrice;
    const elevateRev     = elevateAcademies * academySize * tier.imgShare;
    const allInTotal     = baselineRev + academyPlusRev + elevateRev;

    const fmt = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
    const fmtMoney = (n: number) => Number.isInteger(n) ? `${n}` : n.toFixed(2);
    const fmtCompact = (n: number) => n >= 1000 ? `${(n / 1000).toLocaleString('en-US')}k` : `${n}`;
    const fmtRange = (t: VolumeTier) =>
        t.max === Infinity
            ? `${fmtCompact(t.min)}+`
            : `${fmtCompact(t.min)}–${fmtCompact(t.max)}`;

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32 scroll-mt-20" id="economics">
            {/* Header */}
            <div className="mb-12 sm:mb-16 max-w-2xl">
                <p className="text-sm font-medium text-blue-400 mb-3">The economics</p>
                <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                    Annual per-athlete subscription. Volume drops the price.
                </h2>
                <p className="text-lg text-gray-400 leading-relaxed">
                    Per active subscriber, per year, bundled into the NCSA membership. IMG Academy's $3 share
                    is flat across every tier - growth comes from volume, not from renegotiating rate.
                </p>
            </div>

            {/* Volume tier table */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-10">
                {VOLUME_TIERS.map((t) => (
                    <div key={t.label} className="bg-[#070707] p-6 sm:p-7 flex flex-col">
                        <p className={`text-xs font-semibold uppercase tracking-wider ${t.tone} mb-3`}>{t.label}</p>
                        <p className="text-sm text-gray-500 tabular-nums mb-4">{fmtRange(t)} active subscribers</p>
                        <p className="text-4xl sm:text-5xl font-semibold text-white tracking-tight tabular-nums mb-1">
                            ${fmtMoney(t.price)}
                        </p>
                        <p className="text-xs text-gray-500 mb-4">per subscriber / year</p>
                        <div className="border-t border-white/5 pt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">IMG Academy take</span>
                                <span className="text-white font-semibold tabular-nums">${fmtMoney(t.imgShare)} / yr</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ---- UNIFIED COST <-> EARN CARD ---- */}
            <div className="bg-[#070707] border border-white/10 rounded-2xl p-6 sm:p-10 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden mb-8 border border-white/10">
                    {/* LEFT: what it costs the family */}
                    <div className="bg-gradient-to-b from-blue-500/[0.06] to-transparent p-6 sm:p-8">
                        <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest mb-4">What it costs the family</p>
                        <div className="flex items-baseline gap-3 mb-1">
                            <p className="text-5xl sm:text-6xl font-semibold text-white tracking-tight tabular-nums">$30</p>
                            <p className="text-sm text-blue-300 font-semibold tabular-nums">/ 0.5% of NCSA spend</p>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            $7.50 / yr &times; 4 years on a $6,000 MVP+ multi-year package.
                            A rounding-error line on the family's NCSA invoice.
                        </p>
                        <p className="text-[11px] text-gray-500 leading-relaxed pt-3 border-t border-blue-400/10">
                            Entry-tier Champion package (~$1,500): still ~2% of family spend.
                        </p>
                    </div>

                    {/* RIGHT: what it earns IMG */}
                    <div className="bg-gradient-to-b from-emerald-500/[0.08] to-transparent p-6 sm:p-8">
                        <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest mb-4">What it earns IMG &middot; live</p>
                        <p className="text-5xl sm:text-6xl font-semibold text-white tracking-tight tabular-nums mb-2">{fmt(allInTotal)}</p>
                        <p className="text-sm text-gray-400 leading-relaxed mb-2 tabular-nums">
                            annually, at {clamped.toLocaleString('en-US')} active subscribers
                        </p>
                        <p className="text-[12px] text-gray-500 leading-relaxed pt-3 border-t border-emerald-400/10">
                            Subscriptions {fmt(baselineRev)}
                            {academyPlusRev > 0 && <> &middot; Academy+ {fmt(academyPlusRev)}</>}
                            {elevateRev > 0 && <> &middot; Elevate {fmt(elevateRev)}</>}
                        </p>
                    </div>
                </div>

                {/* Slider spanning both halves */}
                <div className="pt-2">
                    <div className="flex items-end justify-between mb-3 gap-4">
                        <label className="text-sm font-medium text-gray-400">
                            Active NCSA + SR subscribers
                            <span className={`ml-2 ${tier.tone} font-semibold uppercase tracking-wider text-[11px]`}>
                                {tier.label} &middot; ${fmtMoney(tier.price)} / yr
                            </span>
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={MAX_PROFILES}
                            value={clamped}
                            onChange={(e) => setProfiles(parseInt(e.target.value || '0', 10))}
                            className="w-32 sm:w-44 bg-black border border-white/10 rounded-lg px-3 py-2 text-right text-xl sm:text-2xl font-semibold text-white tracking-tight tabular-nums focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={MAX_PROFILES}
                        step={5000}
                        value={clamped}
                        onChange={(e) => setProfiles(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                        style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(clamped / MAX_PROFILES) * 100}%, #1f2937 ${(clamped / MAX_PROFILES) * 100}%, #1f2937 100%)`
                        }}
                    />
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                        {[50_000, 100_000, 250_000, 500_000, 1_000_000].map(n => (
                            <button
                                key={n}
                                onClick={() => setProfiles(n)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors tabular-nums ${
                                    clamped === n ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {fmtCompact(n)}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-[12px] text-gray-500 leading-relaxed mt-6 pt-5 border-t border-white/5">
                    The all-in number folds in Academy+ session-funnel revenue and Elevate B2B channel revenue.
                    See those tabs for the full mechanics. Optional in-cycle retakes are an additional revenue
                    line not modeled here. Settlement is monthly on completed tests.
                </p>
            </div>

            {/* ADVANCED ASSUMPTIONS */}
            <div className="bg-[#070707] border border-white/10 rounded-2xl p-5 sm:p-6">
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-[11px] font-semibold text-gray-400 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                    <span>{showAdvanced ? '−' : '+'}</span> Assumptions behind the all-in number
                </button>
                {!showAdvanced && (
                    <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">
                        {lowScorePct}% of athletes score Below Average &middot; {conversionPct}% convert on
                        Academy+ outreach &middot; ${sessionPrice} per session &middot; {elevateAcademies} Elevate
                        academies at ~{academySize} athletes each.
                    </p>
                )}
                {showAdvanced && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <label className="flex flex-col gap-1">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Low-score share %</span>
                            <input
                                type="number" min={0} max={100} step={1}
                                value={lowScorePct}
                                onChange={(e) => setLowScorePct(Math.max(0, Math.min(100, parseInt(e.target.value || '0', 10))))}
                                className="bg-black border border-white/10 rounded-lg px-3 py-2 text-right text-sm font-semibold text-white tabular-nums focus:outline-none focus:border-amber-400"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">A+ conversion %</span>
                            <input
                                type="number" min={0} max={100} step={1}
                                value={conversionPct}
                                onChange={(e) => setConversionPct(Math.max(0, Math.min(100, parseInt(e.target.value || '0', 10))))}
                                className="bg-black border border-white/10 rounded-lg px-3 py-2 text-right text-sm font-semibold text-white tabular-nums focus:outline-none focus:border-amber-400"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Session price $</span>
                            <input
                                type="number" min={0} step={5}
                                value={sessionPrice}
                                onChange={(e) => setSessionPrice(Math.max(0, parseInt(e.target.value || '0', 10)))}
                                className="bg-black border border-white/10 rounded-lg px-3 py-2 text-right text-sm font-semibold text-white tabular-nums focus:outline-none focus:border-amber-400"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Elevate academies</span>
                            <input
                                type="number" min={0} step={1}
                                value={elevateAcademies}
                                onChange={(e) => setElevateAcademies(Math.max(0, parseInt(e.target.value || '0', 10)))}
                                className="bg-black border border-white/10 rounded-lg px-3 py-2 text-right text-sm font-semibold text-white tabular-nums focus:outline-none focus:border-emerald-400"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Athletes / academy</span>
                            <input
                                type="number" min={0} step={50}
                                value={academySize}
                                onChange={(e) => setAcademySize(Math.max(0, parseInt(e.target.value || '0', 10)))}
                                className="bg-black border border-white/10 rounded-lg px-3 py-2 text-right text-sm font-semibold text-white tabular-nums focus:outline-none focus:border-emerald-400"
                            />
                        </label>
                    </div>
                )}
            </div>
        </section>
    );
};

// --- IMG ACADEMY DIGITAL SURFACES ---
const SURFACES: { name: string; blurb: string; logo?: string; motion: 'testing' | 'distribution' }[] = [
    { name: 'NCSA', motion: 'testing', blurb: 'Standard on every athlete profile. Per-athlete pricing across the membership base - not an add-on, not a SKU families have to opt into.', logo: '/NCSA.jpg' },
    { name: 'SportsRecruits', motion: 'testing', blurb: 'Same integration extends across SR’s 400K-athlete club and HS audience. Adds volume, drops the per-profile price for IMG.', logo: '/Sportsrecruits.png' },
    { name: 'Elevate by IMG Academy', motion: 'distribution', blurb: 'Bundled into every Elevate academy license. Every athlete at every partner school gets an NCSA profile and a sport-specific assessment - the B2B distribution play that opens the TAM.', logo: '/IMGElevate.png' },
];

const PartnerProperties = () => (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20 sm:mb-24">
        <div className="mb-10 sm:mb-12 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
                <img src="/IMG.png" alt="IMG Academy" className="h-7 w-auto object-contain" />
                <p className="text-sm font-medium text-blue-400">Where it plugs in</p>
            </div>
            <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                Three surfaces. Two motions.
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
                Sport-specific testing across NCSA and SportsRecruits - the recruiting layer IMG already
                owns. And a bundled NCSA-profile-plus-assessment that ships with every Elevate academy license,
                opening a B2B funnel NCSA can't reach on its own. One integration, no new SKU to invent.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {SURFACES.map((s) => {
                const motionLabel = s.motion === 'testing' ? 'Testing layer' : 'B2B distribution';
                const motionTone =
                    s.motion === 'testing'
                        ? 'text-blue-300 border-blue-400/30 bg-blue-400/[0.06]'
                        : 'text-emerald-300 border-emerald-400/30 bg-emerald-400/[0.06]';
                return (
                    <div key={s.name} className="bg-[#070707] p-5 sm:p-7 flex flex-col">
                        {s.logo && (
                            <div className="h-9 mb-4 flex items-center">
                                <img
                                    src={s.logo}
                                    alt={`${s.name} logo`}
                                    className="max-h-9 w-auto object-contain"
                                />
                            </div>
                        )}
                        <span className={`self-start inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-widest mb-3 ${motionTone}`}>
                            {motionLabel}
                        </span>
                        <p className="text-white text-base font-semibold mb-2">{s.name}</p>
                        <p className="text-gray-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: s.blurb }} />
                    </div>
                );
            })}
        </div>
    </section>
);

// --- INSET TAB NAVIGATION ---
type TabId = 'assessments' | 'coaches' | 'elevate' | 'academy-plus' | 'economics' | 'activation';

const TABS: { id: TabId; label: string }[] = [
    { id: 'assessments', label: 'The Assessments' },
    { id: 'coaches', label: "For College Coaches" },
    { id: 'elevate', label: 'The Elevate Play' },
    { id: 'academy-plus', label: 'The Academy+ Funnel' },
    { id: 'economics', label: 'The Economics' },
    { id: 'activation', label: 'Activation & Rollout' },
];

// --- MAIN LANDING PAGE ---
const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const tabSectionRef = useRef<HTMLDivElement>(null);

  const [showTestDrive, setShowTestDrive] = useState(false);
  const [showClutchReport, setShowClutchReport] = useState(false);
  const [showNterpretReport, setShowNterpretReport] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('assessments');

  useEffect(() => {
    setIsLoaded(true);
    // Warm dashboard chunks in the background so view-to-view navigation
    // later is instant rather than chunk-loaded.
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (idle) idle(() => preloadDashboard());
    else setTimeout(preloadDashboard, 300);
  }, []);

  const handleEnter = (view?: ViewType) => {
    onEnter('IMG ACADEMY', view);
  };

  const handleTabChange = (id: TabId) => {
    setActiveTab(id);
    requestAnimationFrame(() => {
      tabSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const renderTabPanel = () => {
    switch (activeTab) {
      case 'assessments':
        return (
          <>
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-12 sm:mb-16 max-w-2xl">
                      <p className="text-sm font-medium text-blue-400 mb-3">What powers the profile</p>
                      <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                          Two reports. One complete profile.
                      </h2>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          Every athlete completes both assessments in under 15 minutes from any phone. The reports live inside the
                          IMG Academy dashboard - and athletes can share them with college coaches in one tap.
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
                                  loading="lazy"
                                  decoding="async"
                                  className="relative z-10 max-h-[420px] sm:max-h-[520px] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                              />
                          </div>
                          <div className="p-6 sm:p-8 border-t border-white/5">
                              <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-[0.2em] mb-2">NTerpret<sup className="text-[8px] tracking-normal ml-0.5">&trade;</sup></p>
                              <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3">Mental Scouting Report</h3>
                              <p className="text-base text-gray-400 leading-relaxed mb-6">
                                  The complete cognitive profile - how each athlete learns, leads, communicates, and competes.
                                  The report college coaches now expect alongside the highlight tape.
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
                                  loading="lazy"
                                  decoding="async"
                                  className="relative z-10 max-h-[420px] sm:max-h-[520px] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                              />
                          </div>
                          <div className="p-6 sm:p-8 border-t border-white/5">
                              <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-[0.2em] mb-2">Clutch Factor<sup className="text-[8px] tracking-normal ml-0.5">&trade;</sup></p>
                              <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3">Clutch Factor Assessment</h3>
                              <p className="text-base text-gray-400 leading-relaxed mb-6">
                                  A standardized Clutch Factor<sup className="text-[8px] ml-0.5">&trade;</sup> score that quantifies how an
                                  athlete responds when the game is on the line. Benchmarked and tracked year over year.
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

              {/* OUTCOMES - what the score actually predicts */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-8 sm:mb-10 max-w-2xl">
                      <p className="text-sm font-medium text-blue-400 mb-3">What the score predicts</p>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-[1.08] mb-4">
                          Look at the recruiting correlations.
                      </h3>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          The Clutch Factor isn't a vanity metric. The score correlates directly with the
                          two outcomes families pay NCSA to deliver: a D1 commitment and a college career
                          that ends in conference honors.
                      </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#070707] overflow-hidden">
                      {/* Header strip */}
                      <div className="px-5 sm:px-7 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                              <FileText size={14} className="text-blue-400" />
                              <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest">Look at the recruiting correlations</p>
                          </div>
                          <a
                              href="https://ntangible.co/research"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold text-white bg-blue-500 hover:bg-blue-400 px-3 py-1.5 rounded-md transition-colors"
                          >
                              See all papers <ArrowRight size={12} />
                          </a>
                      </div>

                      {/* Stat grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
                          <div className="p-6 sm:p-7">
                              <p className="text-3xl sm:text-4xl font-semibold text-blue-400 tracking-tight mb-2 tabular-nums">2&times;</p>
                              <p className="text-white text-sm sm:text-base font-semibold mb-1">More likely to commit D1</p>
                              <p className="text-gray-500 text-sm leading-relaxed">Athletes scoring above 750 on the Clutch Factor commit to Division I programs at twice the rate of athletes below the threshold.</p>
                          </div>
                          <div className="p-6 sm:p-7">
                              <p className="text-3xl sm:text-4xl font-semibold text-blue-400 tracking-tight mb-2 tabular-nums">73%</p>
                              <p className="text-white text-sm sm:text-base font-semibold mb-1">All-American or All-Conference</p>
                              <p className="text-gray-500 text-sm leading-relaxed">Of collegiate athletes scoring above 800, 73% are named All-American or All-Conference selections. The signal college coaches don't have today.</p>
                          </div>
                      </div>

                      {/* Whitepaper sub-section */}
                      <div className="border-t border-white/10">
                          <div className="px-5 sm:px-7 py-3 bg-white/[0.02] border-b border-white/5">
                              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">The supporting research</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
                              {[
                                  {
                                      eyebrow: 'Whitepaper · The research',
                                      title: 'From Clutch Outcomes to Pressure Behavior',
                                      subtitle: 'A plate-appearance framework for evaluating NTangible in collegiate hitters. Extends Predictive Findings of Clutch Performance in Collegiate Baseball (Sept 2025).',
                                      meta: 'April 15, 2026',
                                      href: 'https://drive.google.com/file/u/1/d/1Co3EUQOxadIwDkTSastxkQ4IJouXBAdB/view?usp=sharing',
                                  },
                                  {
                                      eyebrow: "Whitepaper · Decision-maker's companion",
                                      title: 'From Pressure Performance to Program Economics',
                                      subtitle: 'A decision-maker’s companion to the April 2026 NTangible whitepaper',
                                      meta: 'Executive summary',
                                      href: 'https://drive.google.com/file/d/1Qn8SMEzoStulq9UzsGF1aHGmjqRuiFBj/view',
                                  },
                              ].map((paper) => (
                                  <a
                                      key={paper.title}
                                      href={paper.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group p-5 sm:p-7 flex items-start gap-4 hover:bg-white/[0.02] transition-colors"
                                  >
                                      <div className="flex-1 min-w-0">
                                          <p className="text-[10px] font-semibold text-blue-300 uppercase tracking-widest mb-2">{paper.eyebrow}</p>
                                          <p className="text-[15px] sm:text-base font-semibold text-white tracking-tight leading-snug mb-1 group-hover:text-blue-300 transition-colors">
                                              {paper.title}
                                          </p>
                                          <p className="text-[13px] text-gray-500 leading-snug mb-2.5">{paper.subtitle}</p>
                                          <p className="text-[11px] text-gray-600 uppercase tracking-widest font-semibold tabular-nums">{paper.meta}</p>
                                      </div>
                                      <span className="shrink-0 mt-1 w-8 h-8 rounded-full border border-white/10 group-hover:border-blue-400/40 group-hover:bg-blue-500/10 text-gray-500 group-hover:text-blue-300 flex items-center justify-center transition-all">
                                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                      </span>
                                  </a>
                              ))}
                          </div>
                      </div>
                  </div>
              </section>

          </>
        );

      case 'coaches':
        return (
          <>
              {/* HERO - THESIS */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="max-w-3xl">
                      <h2 className="text-4xl sm:text-6xl font-semibold text-white tracking-tight leading-[1.02] mb-6">
                          Coaches log in.
                      </h2>
                      <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                          NTangible isn't just an assessment. College coaches integrate directly into the platform
                          and run the Coach&ndash;Player Alignment Index against any NCSA or SportsRecruits profile -
                          a free, always-on dashboard that answers <span className="text-white font-medium">will this athlete fit my system</span>{' '}
                          before the first call.
                      </p>
                  </div>
              </section>

              {/* INSIDE THE NCSA PROFILE - native integration mockup */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-10 sm:mb-12 max-w-2xl">
                      <div className="flex items-center gap-3 mb-3">
                          <img src="/NCSA.jpg" alt="NCSA" className="h-6 w-auto object-contain rounded" />
                          <p className="text-sm font-medium text-emerald-400">Inside the NCSA profile</p>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-[1.08] mb-4">
                          This is your NCSA profile with NTangible inside.
                      </h3>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          Two surfaces NCSA already ships - the athlete card families share with coaches,
                          and the match analysis the coach sees on their end. Both extend with a Clutch Factor
                          score and a Coach&ndash;Player Alignment Index that live native to the existing chrome.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-start">
                      {/* Athlete card with Clutch Factor baked into the image */}
                      <div>
                          <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest mb-4">
                              Athlete profile card
                          </p>
                          <img
                              src="/get-noticed-clutch.png"
                              alt="NCSA athlete profile card for Marcus Copeland with Clutch Factor"
                              className="w-full h-auto block"
                          />
                          <p className="text-sm text-gray-300 leading-relaxed mt-5">
                              <span className="text-white font-semibold">What we add:</span> a Clutch Factor
                              score sitting alongside GPA and SAT - the recruiting signal college coaches
                              don't have today.
                          </p>
                      </div>

                      {/* Match analysis with Coach-Player Alignment Index baked in */}
                      <div>
                          <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest mb-4">
                              Match analysis (coach view)
                          </p>
                          <img
                              src="/match-analysis-aligned.png"
                              alt="NCSA match analysis with Coach-Player Alignment Index integrated"
                              className="w-full h-auto block"
                          />
                          <p className="text-sm text-gray-300 leading-relaxed mt-5">
                              <span className="text-white font-semibold">What we add:</span> a Coach&ndash;Player
                              Alignment Index that extends NCSA's Athletic and Academic comparisons with
                              system, room, and pressure-response fit.
                          </p>
                      </div>
                  </div>
              </section>

              {/* THREE VIEWS - how a coach actually uses the dashboard */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-10 sm:mb-12 max-w-2xl">
                      <p className="text-sm font-medium text-emerald-400 mb-3">The coach workflow</p>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-[1.08] mb-4">
                          From the public board to the private note.
                      </h3>
                      <p className="text-lg text-gray-400 leading-relaxed mb-4">
                          Three views, one workflow - the path every coach walks from first scroll to final decision.
                      </p>
                      <p className="text-sm text-gray-500 italic leading-relaxed border-l-2 border-emerald-400/30 pl-4">
                          Screens below are from NTangible's internal college coach dashboard. These three
                          views would be integrated directly into the NCSA interface, not run as a separate tool.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                      {[
                          {
                              step: '01',
                              eyebrow: 'Discover',
                              title: 'Clutch Factor Leaderboard',
                              blurb: "The public ranking every coach lands on first. Filterable by sport, position, state, grad year, GPA, and height/weight - thousands narrowed to a short list in seconds.",
                              src: '/collegeleaderboard.png',
                              alt: 'Clutch Factor Leaderboard - public ranking of every assessed athlete',
                          },
                          {
                              step: '02',
                              eyebrow: 'Shortlist',
                              title: 'My Top Targets',
                              blurb: "The Trust Anchor view (Alignment ≥ 62.5%, Clutch ≥ 750) - the coach's personal board, ranked by fit to their program.",
                              src: '/collegetoptargets.png',
                              alt: "My Top Targets - athletes ranked by Alignment for the coach's program",
                          },
                          {
                              step: '03',
                              eyebrow: 'Decide',
                              title: 'My Watchlist',
                              blurb: "Clutch Factor, NTerpret, highlight tape, and the staff's in-person observations on the same card. Shareable with assistants in one link.",
                              src: '/collegenotes.png',
                              alt: 'My Watchlist - private scouting log tied to each athlete profile',
                          },
                      ].map((view) => (
                          <div key={view.step} className="rounded-2xl border border-white/10 bg-[#070707] overflow-hidden flex flex-col">
                              <div className="bg-black/40 border-b border-white/5">
                                  <img
                                      src={view.src}
                                      alt={view.alt}
                                      loading="lazy"
                                      className="w-full h-auto block"
                                  />
                              </div>
                              <div className="p-5 sm:p-6 flex flex-col">
                                  <div className="flex items-center gap-2.5 mb-3">
                                      <span className="text-[10px] font-bold tabular-nums text-emerald-300 tracking-widest">{view.step}</span>
                                      <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest">{view.eyebrow}</span>
                                  </div>
                                  <h4 className="text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug mb-2">{view.title}</h4>
                                  <p className="text-sm text-gray-400 leading-relaxed">{view.blurb}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </section>

              {/* WHY IMG WANTS THIS - single-panel value + dashboard disclaimer */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-500/[0.08] to-transparent p-7 sm:p-10">
                      <div className="max-w-3xl">
                          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                              <Activity size={20} className="text-blue-400" />
                          </div>
                          <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest mb-3">Why IMG wants this on every profile</p>
                          <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-5">
                              Stickier coaches, stickier families.
                          </h3>
                          <ul className="space-y-3 mb-7">
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> A signal college coaches can't get anywhere else - pulls them into NCSA/SR instead of competing platforms</li>
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> Higher coach engagement per profile = higher commit conversion = the metric NCSA already sells on</li>
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> Every alignment view is a touchpoint NCSA can surface to the family</li>
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> Differentiates NCSA + SR against 247, On3, Rivals - they have stats; you'd have fit</li>
                          </ul>
                          <p className="text-sm text-gray-500 italic leading-relaxed border-l-2 border-white/10 pl-4">
                              Heads-up on the visuals: the dashboards and athlete cards shown on this tab are
                              NTangible's current production product. At integration, the Alignment Index,
                              Clutch Factor, and workflow surfaces would adopt IMG's design system and ship
                              native to NCSA + SportsRecruits, not as a separate tool.
                          </p>
                      </div>
                  </div>
              </section>

              {/* CPA INDEX - signature feature spotlight */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.10] via-emerald-500/[0.03] to-transparent p-6 sm:p-10 lg:p-12">
                      <div className="max-w-3xl mb-10 sm:mb-12">
                          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full mb-5">
                              <Target size={13} className="text-emerald-400" />
                              <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest">Powered by NTangible IP</span>
                          </div>
                          <h3 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-5">
                              The Alignment Index.
                          </h3>
                          <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                              One 0-100 score that tells a coach - before the first call - whether an athlete
                              will execute the system, fit the room, and stay.
                          </p>
                      </div>

                      {/* MOCKUP */}
                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#070707] shadow-[0_30px_80px_rgba(0,0,0,0.5)] ring-1 ring-white/5 mb-10 sm:mb-12">
                          <img
                              src="/coachalignmentmockup.png"
                              alt="Alignment Index - athlete card showing a 93% Exceptional alignment score"
                              className="w-full h-auto block"
                          />
                      </div>

                      {/* RUBRIC - 5 tiers, compact horizontal */}
                      <div className="mb-10 sm:mb-12">
                          <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest mb-4">
                              The rubric
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                              {[
                                  { range: '75 - 100',    tier: 'Exceptional',   bar: 'bg-emerald-400', tone: 'text-emerald-400', line: 'Processes the game exactly like the coach.' },
                                  { range: '62.5 - 74.9', tier: 'Strong',        bar: 'bg-blue-400',    tone: 'text-blue-400',    line: "Agrees with the goal, may take a different path." },
                                  { range: '50 - 62.4',   tier: 'Conditional',   bar: 'bg-amber-400',   tone: 'text-amber-400',   line: 'Transactional fit. Cracks under losing.' },
                                  { range: '37.5 - 49.9', tier: 'Developmental', bar: 'bg-orange-400',  tone: 'text-orange-400',  line: 'Processes decisions differently. Needs structure.' },
                                  { range: '0 - 37.4',    tier: 'Low alignment', bar: 'bg-red-400',     tone: 'text-red-400',     line: 'High friction risk. Talk before committing.' },
                              ].map((row) => (
                                  <div key={row.tier} className="bg-[#070707] p-4 sm:p-5 flex flex-col">
                                      <span className={`block h-0.5 w-8 ${row.bar} rounded-full mb-3`} />
                                      <p className="text-white text-sm sm:text-base font-semibold tabular-nums mb-0.5">{row.range}%</p>
                                      <p className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${row.tone} mb-2`}>{row.tier}</p>
                                      <p className="text-xs sm:text-[13px] text-gray-500 leading-snug">{row.line}</p>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* THE PUNCH LINE */}
                      <div className="rounded-2xl border border-emerald-500/30 bg-[#070707] p-7 sm:p-9">
                          <p className="text-xl sm:text-2xl text-white leading-snug font-medium max-w-3xl">
                              Coaches keep coming back to IMG Academy because this signal lives nowhere else.
                              Athletes buy the profile to be seen by the programs they'll actually fit.
                              That's the moat.
                          </p>
                      </div>
                  </div>
              </section>
          </>
        );

      case 'elevate':
        return (
          <>
              {/* HERO - THE THESIS */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
                  <div className="max-w-3xl">
                      <div className="flex items-center gap-3 mb-6">
                          <img src="/IMGElevate.png" alt="Elevate by IMG Academy" className="h-9 w-auto object-contain" />
                      </div>
                      <h2 className="text-4xl sm:text-6xl font-semibold text-white tracking-tight leading-[1.02] mb-6">
                          Every athlete at every Elevate academy.
                      </h2>
                      <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                          Elevate already sells IMG curriculum into outside academies. Bundle an NCSA profile
                          and a sport-specific assessment into that license, and every academy deal becomes
                          hundreds of recruiting-ready athletes on day one.
                      </p>
                  </div>
              </section>

              {/* VISUAL - Elevate Essentials with a Clutch Factor lesson on the laptop */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#070707]">
                      <img
                          src="/elevate-main-essentials.png"
                          alt="Elevate by IMG Academy Essentials - a Clutch Factor lesson"
                          className="w-full h-auto block"
                          loading="lazy"
                      />
                  </div>
              </section>

              {/* THE TAM UNLOCK */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-10 sm:mb-12 max-w-2xl">
                      <p className="text-sm font-medium text-emerald-400 mb-3">Why this changes the ceiling</p>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-[1.08] mb-4">
                          NCSA's TAM stops being self-signup.
                      </h3>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          The 4.5M-athlete pool is the floor, not the ceiling. The ceiling is every program
                          Elevate already touches - sports academies, Nord Anglia campuses, federation
                          training centers. None of them currently flow through NCSA's funnel.
                      </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      <div className="bg-[#070707] p-6 sm:p-7">
                          <p className="text-3xl sm:text-4xl font-semibold text-emerald-400 tracking-tight mb-2 tabular-nums">80+</p>
                          <p className="text-white text-sm sm:text-base font-semibold mb-1">Nord Anglia campuses</p>
                          <p className="text-gray-500 text-sm leading-relaxed">Across 30 countries, already in EQT's distribution graph. Each one a candidate Elevate license.</p>
                      </div>
                      <div className="bg-[#070707] p-6 sm:p-7">
                          <p className="text-3xl sm:text-4xl font-semibold text-emerald-400 tracking-tight mb-2 tabular-nums">100%</p>
                          <p className="text-white text-sm sm:text-base font-semibold mb-1">Roster coverage per academy</p>
                          <p className="text-gray-500 text-sm leading-relaxed">Bundled, not opt-in. Every athlete on the roster gets the profile and the assessment as part of the school's license.</p>
                      </div>
                      <div className="bg-[#070707] p-6 sm:p-7">
                          <p className="text-3xl sm:text-4xl font-semibold text-emerald-400 tracking-tight mb-2 tabular-nums">0</p>
                          <p className="text-white text-sm sm:text-base font-semibold mb-1">Net-new sales motion</p>
                          <p className="text-gray-500 text-sm leading-relaxed">Rides Elevate's existing B2B-to-schools pipeline. No separate NCSA outbound, no per-family conversion funnel.</p>
                      </div>
                      <div className="bg-[#070707] p-6 sm:p-7">
                          <p className="text-3xl sm:text-4xl font-semibold text-emerald-400 tracking-tight mb-2 tabular-nums">8</p>
                          <p className="text-white text-sm sm:text-base font-semibold mb-1">European languages live</p>
                          <p className="text-gray-500 text-sm leading-relaxed">Madrid, Frankfurt, Stockholm - addressable day one. Every major language live by year-end.</p>
                      </div>
                  </div>
              </section>

              {/* THE MECHANICS - 3 steps */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-10 sm:mb-12 max-w-2xl">
                      <p className="text-sm font-medium text-emerald-400 mb-3">How the bundle works</p>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-[1.08] mb-4">
                          One signature. Every athlete recruiting-ready.
                      </h3>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          The academy doesn't run a separate procurement for NCSA. The bundle ships with the
                          Elevate license - same contract, same renewal cycle, same admin owner.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      {[
                          {
                              step: '01',
                              title: 'Academy signs the Elevate license',
                              body: "NCSA + assessment is a line item on the contract Elevate already sells - not a separate sale.",
                          },
                          {
                              step: '02',
                              title: 'Roster ingest creates profiles automatically',
                              body: 'Athletic department uploads the roster. Every athlete gets an NCSA profile and a sport-specific assessment invite as part of the school program.',
                          },
                          {
                              step: '03',
                              title: 'Profiles become searchable to coaches',
                              body: "Clutch Factor, Coach-Player Alignment Index, full NCSA chrome - on every athlete card. The academy gets a recruiting outcome it can market to the next parent.",
                          },
                      ].map((s) => (
                          <div key={s.step} className="bg-[#070707] p-6 sm:p-8 flex flex-col">
                              <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest mb-3 tabular-nums">Step {s.step}</p>
                              <h4 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-3 leading-snug">{s.title}</h4>
                              <p className="text-sm text-gray-400 leading-relaxed">{s.body}</p>
                          </div>
                      ))}
                  </div>
              </section>

              {/* CLOSER */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-3xl border border-emerald-400/30 bg-gradient-to-b from-emerald-400/[0.08] via-emerald-400/[0.02] to-transparent p-7 sm:p-10">
                      <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-9">
                          <div className="shrink-0">
                              <img
                                  src="/IMGElevate.png"
                                  alt="Elevate by IMG Academy"
                                  className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_10px_30px_rgba(16,185,129,0.20)]"
                              />
                          </div>
                          <div className="flex-1 sm:border-l sm:border-emerald-400/20 sm:pl-9">
                              <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest mb-3">The strategic frame</p>
                              <p className="text-xl sm:text-2xl text-white leading-snug font-medium mb-3">
                                  Elevate is the channel. NCSA is the destination. The assessment is the proof.
                              </p>
                              <p className="text-base text-gray-400 leading-relaxed">
                                  Each Elevate academy deal becomes a hundreds-of-profiles-a-year subscription to NCSA,
                                  sold once at the institutional level instead of one family at a time -
                                  NCSA volume that doesn't depend on consumer marketing spend, a higher Elevate
                                  ASP, and a bundle that ships internationally without a US-only dependency.
                                  That's the play the EQT &times; Nord Anglia thesis was built to fund.
                              </p>
                          </div>
                      </div>
                  </div>
              </section>
          </>
        );

      case 'academy-plus':
        return (
          <>
              {/* HERO */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
                  <div className="max-w-3xl">
                      <div className="flex items-center gap-3 mb-6">
                          <img src="/IMGacademy+.png" alt="IMG Academy+" className="h-9 sm:h-10 w-auto object-contain" />
                      </div>
                      <h2 className="text-4xl sm:text-6xl font-semibold text-white tracking-tight leading-[1.02] mb-6">
                          Every low Clutch score is a qualified IMG Academy+ lead.
                      </h2>
                      <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                          The assessment identifies the athletes whose mental performance is the gap
                          between their physical ceiling and their recruiting outcome, then routes them
                          straight into the IMG Academy+ sports psychology funnel. Testing volume becomes
                          coaching revenue.
                      </p>
                  </div>
              </section>

              {/* THE NO-BRAINER */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 items-center mb-10 sm:mb-12">
                      {/* Visual */}
                      <div className="md:col-span-5">
                          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#070707] max-w-sm md:max-w-none mx-auto">
                              <img
                                  src="/mindbody1.jpg"
                                  alt="Mind and body - the cognitive performance dimension Academy+ closes on"
                                  className="w-full h-auto block"
                                  loading="lazy"
                              />
                              <div
                                  className="absolute inset-0 pointer-events-none"
                                  style={{
                                      background:
                                          'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%), linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 18%, transparent 78%, rgba(0,0,0,0.55) 100%)',
                                  }}
                              />
                          </div>
                      </div>

                      {/* Copy */}
                      <div className="md:col-span-7">
                          <p className="text-sm font-medium text-amber-400 mb-3">Why this is the no-brainer</p>
                          <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-[1.08] mb-4">
                              A pre-qualified lead, not a cold one.
                          </h3>
                          <p className="text-lg text-gray-400 leading-relaxed">
                              Every Academy+ outbound today starts from zero - cold list, no read on whether
                              the athlete actually needs the service. The assessment changes that. By the time
                              a low-scoring profile reaches the Academy+ team, the development gap is named,
                              quantified, and already visible to the family on their NCSA dashboard.
                          </p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      <div className="bg-[#070707] p-6 sm:p-7">
                          <p className="text-3xl sm:text-4xl font-semibold text-amber-400 tracking-tight mb-2 tabular-nums">100%</p>
                          <p className="text-white text-sm sm:text-base font-semibold mb-1">Scored before contact</p>
                          <p className="text-gray-500 text-sm leading-relaxed">Every routed lead arrives with a Clutch Factor score, a position-specific assessment, and a named development gap. No discovery call required.</p>
                      </div>
                      <div className="bg-[#070707] p-6 sm:p-7">
                          <p className="text-3xl sm:text-4xl font-semibold text-amber-400 tracking-tight mb-2 tabular-nums">$0</p>
                          <p className="text-white text-sm sm:text-base font-semibold mb-1">CAC on routed leads</p>
                          <p className="text-gray-500 text-sm leading-relaxed">The assessment is already paid for as part of the NCSA profile. Academy+ inherits the lead at zero acquisition cost.</p>
                      </div>
                  </div>
              </section>

              {/* THE RETEST CYCLE */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-10 sm:mb-12 max-w-2xl">
                      <p className="text-sm font-medium text-amber-400 mb-3">Recurring revenue, three ways</p>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-[1.08] mb-4">
                          The retest is the revenue.
                      </h3>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          Three retest modes, stacked - each a billable event and a new routing trigger for
                          Academy+ outreach. The standard cycle doubles assessment volume; on-demand retakes
                          add a new SKU; post-coaching retests bundle with the Academy+ session fee.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      {[
                          {
                              cadence: 'Every 6 months',
                              label: 'Standard cycle',
                              title: 'The annual-recurring baseline',
                              body: "Bundled into the profile. Every athlete retests on the 6-month mark, no opt-in required. Each retest refreshes the Clutch Factor on the NCSA profile and re-routes the score against Academy+ tiers.",
                              tone: 'border-amber-400/30 bg-amber-400/[0.04]',
                              chip: 'text-amber-300 border-amber-400/30 bg-amber-400/[0.06]',
                              bar: 'bg-amber-400',
                          },
                          {
                              cadence: 'Athlete-initiated',
                              label: 'On-demand retake',
                              title: 'Pay to improve the score early',
                              body: "Athletes can purchase an out-of-cycle retake any time they want to push a higher number to coaches. A new revenue line on top of the subscription, owned entirely by IMG.",
                              tone: 'border-emerald-400/30 bg-emerald-400/[0.04]',
                              chip: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/[0.06]',
                              bar: 'bg-emerald-400',
                          },
                          {
                              cadence: 'Post-coaching',
                              label: 'Intervention retest',
                              title: 'Prove Academy+ worked',
                              body: "After an Academy+ session block, athletes can retest early - inside the 6-month window - to validate the score lift. Closes the loop on coaching ROI and bundles naturally with the Academy+ SKU.",
                              tone: 'border-blue-400/30 bg-blue-400/[0.04]',
                              chip: 'text-blue-300 border-blue-400/30 bg-blue-400/[0.06]',
                              bar: 'bg-blue-400',
                          },
                      ].map((m) => (
                          <div key={m.label} className={`bg-[#070707] p-6 sm:p-7 flex flex-col border ${m.tone}`}>
                              <span className={`block h-0.5 w-10 ${m.bar} rounded-full mb-4`} />
                              <p className="text-white text-[15px] font-semibold tabular-nums mb-1">{m.cadence}</p>
                              <span className={`self-start inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-widest mb-4 ${m.chip}`}>
                                  {m.label}
                              </span>
                              <h4 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-2 leading-snug">{m.title}</h4>
                              <p className="text-sm text-gray-400 leading-relaxed">{m.body}</p>
                          </div>
                      ))}
                  </div>

              </section>

              {/* THE ROUTING TIERS */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-10 sm:mb-12 max-w-2xl">
                      <p className="text-sm font-medium text-amber-400 mb-3">The routing logic</p>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-[1.08] mb-4">
                          Every score becomes a next-best-action.
                      </h3>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          Three Clutch tiers, three outbound motions. No new ops, no new CRM step - the routing
                          logic ships inside the profile.
                      </p>
                  </div>

                  <div className="space-y-3">
                      {[
                          {
                              range: 'Clutch 750+',
                              reportTier: 'Great + Elite',
                              label: 'Showcase',
                              tone: 'emerald',
                              barClass: 'bg-emerald-400',
                              ringClass: 'border-emerald-400/30 bg-emerald-400/[0.04]',
                              tagClass: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/[0.06]',
                              headline: 'Surface to college coaches.',
                              detail: "Promoted in the Coach Dashboard and Clutch Factor Leaderboard - the proof points Academy+ marketing leans on.",
                          },
                          {
                              range: 'Clutch 651-749',
                              reportTier: 'Average + Above Average',
                              label: 'Workshop nudge',
                              tone: 'amber',
                              barClass: 'bg-amber-400',
                              ringClass: 'border-amber-400/30 bg-amber-400/[0.04]',
                              tagClass: 'text-amber-300 border-amber-400/30 bg-amber-400/[0.06]',
                              headline: 'Route into Academy+ group workshops.',
                              detail: "Automated in-app and email nudge surfaces a group workshop or self-guided module - low-ticket entry into the Academy+ catalog.",
                          },
                          {
                              range: 'Clutch < 651',
                              reportTier: 'Below Average',
                              label: '1-on-1 session offer',
                              tone: 'red',
                              barClass: 'bg-red-400',
                              ringClass: 'border-red-400/30 bg-red-400/[0.04]',
                              tagClass: 'text-red-300 border-red-400/30 bg-red-400/[0.06]',
                              headline: 'Direct to Academy+ 1-on-1 sports psychology.',
                              detail: "The family already sees the gap on their dashboard - Academy+ offers a $85-$100 1-on-1 session with a clear before/after tied to the next retest.",
                          },
                      ].map((tier) => (
                          <div key={tier.range} className={`rounded-2xl border ${tier.ringClass} p-5 sm:p-7 flex flex-col sm:flex-row sm:items-start gap-5`}>
                              <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 sm:w-48">
                                  <span className={`h-0.5 w-10 ${tier.barClass} rounded-full hidden sm:block`} />
                                  <p className="text-white text-base sm:text-lg font-semibold tabular-nums">{tier.range}</p>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold hidden sm:block">Report tier &middot; {tier.reportTier}</p>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-widest ${tier.tagClass}`}>
                                      {tier.label}
                                  </span>
                              </div>
                              <div className="flex-1 sm:border-l sm:border-white/10 sm:pl-6">
                                  <h4 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-2 leading-snug">{tier.headline}</h4>
                                  <p className="text-sm sm:text-[15px] text-gray-400 leading-relaxed">{tier.detail}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </section>

              {/* CLOSER */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-b from-amber-400/[0.10] via-amber-400/[0.02] to-transparent p-7 sm:p-10">
                      <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-9">
                          <div className="shrink-0">
                              <div className="w-14 h-14 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
                                  <Activity size={26} className="text-amber-300" />
                              </div>
                          </div>
                          <div className="flex-1 sm:border-l sm:border-amber-400/20 sm:pl-9">
                              <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-widest mb-3">The strategic frame</p>
                              <p className="text-xl sm:text-2xl text-white leading-snug font-medium mb-3">
                                  The assessment is the qualifier. NCSA is the channel. Academy+ is the close.
                              </p>
                              <p className="text-base text-gray-400 leading-relaxed">
                                  Academy+ inherits a pre-qualified pipeline with a named gap, demonstrated
                                  intent, and zero acquisition cost - and every six months the retest cycle
                                  refreshes the pool with new leads, win-backs, and validation upsells. The
                                  coaching pipeline scales linearly with every new NCSA profile created, on
                                  zero net-new outbound spend.
                              </p>
                          </div>
                      </div>
                  </div>
              </section>
          </>
        );

      case 'economics':
        return <PricingCalculator />;

      case 'activation':
        return (
          <>
              {/* TRY IT TODAY - icing moment, leads the tab */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-b from-amber-400/[0.10] via-amber-400/[0.02] to-transparent p-7 sm:p-10">
                      <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-widest mb-4">Try it today</p>
                      <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-5 max-w-3xl">
                          The assessment is live. Run it yourself in 60 seconds.
                      </h2>
                      <p className="text-lg text-gray-300 leading-relaxed mb-7 max-w-3xl">
                          Don't take the pitch at face value. Pick any of our 9 live sports, complete the
                          assessment from your phone, and see the actual report inside this prototype. No
                          commitment, no integration required - the experience IMG families would see is
                          something you can hold in your hand right now.
                      </p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <button
                              onClick={() => setShowTestDrive(true)}
                              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-6 py-3.5 rounded-lg font-semibold text-base transition-colors"
                          >
                              Run a live assessment <ArrowRight size={16} />
                          </button>
                          <p className="text-[12px] text-gray-500 leading-relaxed max-w-md">
                              Full NCSA backend integration (profile views, leaderboards, Coach Dashboard) is
                              the 60-day buildout below. The assessment is live now.
                          </p>
                      </div>
                  </div>
              </section>

              {/* THE 60-DAY DEAL + WHAT SHIPS */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-10 sm:mb-12 max-w-2xl">
                      <p className="text-sm font-medium text-blue-400 mb-3">The commitment</p>
                      <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                          60 days from signature. Every sport built and integrated.
                      </h2>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          With a signed agreement, every NCSA and SportsRecruits sport ships in 60 days. 9 are
                          live today; the rest take roughly two days each on our backend. The calendar is the
                          whole differentiator.
                      </p>
                  </div>

                  <div className="bg-gradient-to-b from-blue-500/[0.08] to-transparent border border-blue-500/30 rounded-2xl p-7 sm:p-10 mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
                          <div>
                              <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest mb-3">Sport coverage timeline</p>
                              <p className="text-6xl sm:text-7xl font-semibold text-white tracking-tight leading-none mb-3 tabular-nums">60 days</p>
                              <p className="text-lg text-gray-300 leading-relaxed">
                                  from signature to <span className="text-white font-medium">every sport, live and integrated</span>
                              </p>
                          </div>
                          <div className="grid grid-cols-3 gap-3 max-w-md sm:max-w-sm">
                              <div className="bg-black/40 border border-white/10 rounded-lg p-3 text-center">
                                  <p className="text-2xl font-semibold text-white tracking-tight tabular-nums">9</p>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">live today</p>
                              </div>
                              <div className="bg-black/40 border border-white/10 rounded-lg p-3 text-center">
                                  <p className="text-2xl font-semibold text-white tracking-tight tabular-nums">~2d</p>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">per new sport</p>
                              </div>
                              <div className="bg-black/40 border border-white/10 rounded-lg p-3 text-center">
                                  <p className="text-2xl font-semibold text-white tracking-tight tabular-nums">0</p>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">cost to IMG</p>
                              </div>
                          </div>
                      </div>

                      <div className="pt-6 border-t border-blue-400/15">
                          <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest mb-4">What ships in 60 days</p>
                          <ul className="space-y-2.5">
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> Every NCSA and SportsRecruits sport, live with a sport-specific assessment</li>
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> Native NCSA integration: Clutch Factor on every athlete card, Alignment Index inside match analysis</li>
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> Free Coach Dashboard launched: alignment-scored prospect pool across every profile</li>
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> Academy+ routing live: low scores flow to the funnel automatically by tier</li>
                          </ul>
                      </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.06] to-transparent p-6 sm:p-7">
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                          <span className="text-white font-semibold">Bundled with the deal:</span> on-campus
                          assessment access for IMG's boarding students, camp athletes, and corporate
                          performance clients - no additional cost, no separate SOW. Same instruments, same
                          dashboard, deployed inside the campus environment.
                      </p>
                  </div>
              </section>

              {/* TECHNICAL FIT (with data ownership folded in) */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="max-w-3xl">
                      <p className="text-sm font-medium text-blue-400 mb-3">Technical fit</p>
                      <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-[1.08] mb-4">
                          Built into NCSA, not bolted onto it.
                      </h2>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          REST API + Single Sign-On + responsive embed. Roster sync via webhook. NTangible
                          handles all assessment delivery, scoring, retest scheduling, and routing logic. The
                          NCSA backend integration - Clutch Factor on athlete cards, Coach Dashboard wiring,
                          Alignment Index inside match analysis - is built out and finalized during the 60-day
                          window above.
                          <span className="text-white font-medium"> IMG defines the schema, owns the records,
                          and controls family consent.</span> COPPA-aligned today; FERPA-aware data handling
                          for student records.
                      </p>
                  </div>
              </section>

              {/* THE MOAT - what an internal build can't ship */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
                  <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-500/[0.06] to-transparent p-7 sm:p-10">
                      <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest mb-3">The five-year head start</p>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug mb-5 max-w-3xl">
                          What an internal build can't ship.
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
                          <div>
                              <p className="text-3xl sm:text-4xl font-semibold text-blue-300 tracking-tight tabular-nums mb-1">5 yrs</p>
                              <p className="text-sm text-white font-semibold mb-1">Calibrated scoring data</p>
                              <p className="text-[12px] text-gray-500 leading-relaxed">Benchmarked against committed athletes. A clean-room build starts at zero on validation.</p>
                          </div>
                          <div>
                              <p className="text-3xl sm:text-4xl font-semibold text-blue-300 tracking-tight tabular-nums mb-1">9</p>
                              <p className="text-sm text-white font-semibold mb-1">Sports already in production</p>
                              <p className="text-[12px] text-gray-500 leading-relaxed">Scoring engine, retest pipeline, position-specific library - all live. Not a build plan.</p>
                          </div>
                          <div>
                              <p className="text-3xl sm:text-4xl font-semibold text-blue-300 tracking-tight tabular-nums mb-1">~6 mo</p>
                              <p className="text-sm text-white font-semibold mb-1">Continuous validation loop</p>
                              <p className="text-[12px] text-gray-500 leading-relaxed">Every retest sharpens the model. An internal build doesn't get that loop until it ships.</p>
                          </div>
                          <div>
                              <p className="text-3xl sm:text-4xl font-semibold text-blue-300 tracking-tight tabular-nums mb-1">60d &middot; 18mo</p>
                              <p className="text-sm text-white font-semibold mb-1">Integration vs. internal build</p>
                              <p className="text-[12px] text-gray-500 leading-relaxed">By the time an in-house v1 ships, NTangible's on year 6 of data.</p>
                          </div>
                      </div>
                      <p className="text-base sm:text-lg text-white leading-relaxed font-medium border-t border-blue-400/15 pt-5">
                          You're not buying software. You're buying time and a five-year dataset.
                      </p>
                  </div>
              </section>

              {/* ALREADY IN MARKET - social proof + active conversations */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.06] to-transparent p-7 sm:p-10">
                      <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest mb-3">Already in market</p>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug mb-5 max-w-3xl">
                          The assessment is shipping today &mdash; and others are moving on it.
                      </h3>
                      <p className="text-base text-gray-300 leading-relaxed mb-7 max-w-3xl">
                          NTangible isn't vaporware looking for its first customer. The platform is live with
                          established partners across youth sports, with additional conversations active across
                          residential training campuses, athletic departments, and youth-sport organizations.
                      </p>

                      <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest mb-4">Active partners include</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                          {[
                              { name: 'Alliance' },
                              { name: 'Future Stars Series' },
                              { name: "Governor's Challenge" },
                          ].map((p) => (
                              <div key={p.name} className="rounded-lg border border-white/10 bg-black/30 px-4 py-3">
                                  <p className="text-white text-sm font-semibold">{p.name}</p>
                              </div>
                          ))}
                      </div>

                      <p className="text-[12px] text-gray-500 leading-relaxed pt-4 border-t border-emerald-400/15">
                          <span className="text-emerald-300 font-semibold">Advanced integration negotiations</span>{' '}
                          underway with a flagship multi-sport residential training campus. Active
                          conversations across additional college athletic departments and youth sports
                          organizations. First-mover position on the NCSA + SportsRecruits surface is open today.
                      </p>
                  </div>
              </section>

              {/* HOW THIS STARTS - the explicit ask */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-b from-amber-400/[0.10] via-amber-400/[0.02] to-transparent p-7 sm:p-10">
                      <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-widest mb-3">How this starts</p>
                      <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-[1.08] mb-5 max-w-3xl">
                          The first 48 hours after the Letter of Intent.
                      </h2>
                      <p className="text-base text-gray-300 leading-relaxed mb-7 max-w-3xl">
                          We start with a Letter of Intent &mdash; not a full contract &mdash; so the 60-day
                          clock can start immediately while the Master Service Agreement gets negotiated in
                          parallel. No waiting on legal.
                      </p>

                      <ol className="space-y-4 mb-8">
                          <li className="flex gap-4">
                              <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-200 text-xs font-bold tabular-nums">1</span>
                              <div>
                                  <p className="text-white text-base font-semibold mb-0.5">Sign the Letter of Intent</p>
                                  <p className="text-sm text-gray-400 leading-relaxed">
                                      Non-binding except for the pricing tier alignment, exclusivity through
                                      formal-contract negotiation, and confidentiality. Terms sent within 48
                                      hours of the integration call.
                                  </p>
                              </div>
                          </li>
                          <li className="flex gap-4">
                              <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-200 text-xs font-bold tabular-nums">2</span>
                              <div>
                                  <p className="text-white text-base font-semibold mb-0.5">Designate one IMG engineering point of contact</p>
                                  <p className="text-sm text-gray-400 leading-relaxed">
                                      The bridge between NTangible's build team and the NCSA backend.
                                  </p>
                              </div>
                          </li>
                          <li className="flex gap-4">
                              <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-200 text-xs font-bold tabular-nums">3</span>
                              <div>
                                  <p className="text-white text-base font-semibold mb-0.5">Day 1 starts the 60-day clock</p>
                                  <p className="text-sm text-gray-400 leading-relaxed">
                                      NTangible begins sport buildout and backend integration immediately. The
                                      Master Service Agreement is finalized in parallel during the same window.
                                  </p>
                              </div>
                          </li>
                          <li className="flex gap-4">
                              <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-200 text-xs font-bold tabular-nums">4</span>
                              <div>
                                  <p className="text-white text-base font-semibold mb-0.5">First sport ships within 7 days of Letter of Intent signature</p>
                                  <p className="text-sm text-gray-400 leading-relaxed">
                                      Visible product in IMG's hands the same week.
                                  </p>
                              </div>
                          </li>
                      </ol>

                      <div className="rounded-2xl border border-white/10 bg-black/30 p-5 sm:p-6 mb-7">
                          <p className="text-sm text-gray-300 leading-relaxed">
                              <span className="text-white font-semibold">NTangible cost to IMG until the integration goes live: $0.</span>
                              {' '}Billing only starts on the first completed assessment after launch.
                          </p>
                      </div>

                      <button
                          onClick={() => setShowBooking(true)}
                          className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-6 py-3.5 rounded-lg font-semibold text-base transition-colors"
                      >
                          Move to Letter of Intent terms <ArrowRight size={16} />
                      </button>
                  </div>
              </section>
          </>
        );

      default:
        return null;
    }
  };

  const renderTabPager = () => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    const nextTab = TABS[currentIndex + 1];

    if (nextTab) {
      return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <button
                onClick={() => handleTabChange(nextTab.id)}
                className="group w-full flex items-center justify-between gap-4 sm:gap-6 rounded-2xl border border-white/10 bg-[#070707] hover:border-blue-500/40 hover:bg-[#0a0b0f] p-6 sm:p-8 transition-all text-left"
            >
                <div>
                    <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-widest mb-1.5">
                        Next &middot; {String(currentIndex + 2).padStart(2, '0')} of {String(TABS.length).padStart(2, '0')}
                    </p>
                    <p className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                        {nextTab.label}
                    </p>
                </div>
                <span className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-500 group-hover:bg-blue-400 text-white flex items-center justify-center transition-all group-hover:translate-x-0.5">
                    <ArrowRight size={22} />
                </span>
            </button>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-500/[0.08] to-transparent p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
              <div className="max-w-md">
                  <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest mb-1.5">
                      That's the full proposal
                  </p>
                  <p className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                      You've seen every section. Let's make it official.
                  </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                  <button
                      onClick={() => handleTabChange('offer')}
                      className="inline-flex items-center justify-center text-gray-300 hover:text-white border border-white/10 hover:border-white/25 text-sm font-medium px-4 py-3 rounded-lg transition-colors"
                  >
                      Back to start
                  </button>
                  <button
                      onClick={() => setShowBooking(true)}
                      className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors"
                  >
                      Continue the conversation <ArrowRight size={15} />
                  </button>
              </div>
          </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white relative font-sans selection:bg-blue-500 selection:text-white flex flex-col scroll-smooth ${showClutchReport || showNterpretReport ? 'h-screen overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}>

      <style>{`
        @keyframes lpTabFade {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .lp-tab-panel { animation: lpTabFade 0.35s ease-out; }
        .lp-no-scrollbar::-webkit-scrollbar { display: none; }
        .lp-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Background ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full"></div>
      </div>

      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 h-16 flex items-center justify-between backdrop-blur-md border-b border-white/5 bg-black/60">
          <div className="flex items-center gap-3">
              <Logo className="text-white" size="small" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
              <button
                  onClick={() => setShowBooking(true)}
                  className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                  Send questions
              </button>
          </div>
      </nav>

      {/* Main Content Container */}
      <div className="relative z-10 w-full pt-28 sm:pt-32 pb-20">

          {/* HERO SECTION */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20 text-center relative">
              <div className={`flex justify-center mb-7 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'} transition-all duration-700`}>
                  <img
                      src="/IMG.png"
                      alt="IMG Academy"
                      className="h-20 sm:h-24 w-auto object-contain drop-shadow-[0_10px_40px_rgba(37,99,235,0.25)]"
                  />
              </div>
              <div className={`flex flex-wrap items-center justify-center gap-2 mb-8 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                  <div className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border border-amber-400/25 bg-amber-400/[0.05]">
                      <img src="/ysbr.png" alt="Youth Sports Business Report" className="h-5 w-5 object-contain rounded-full" />
                      <span className="text-[11px] font-semibold text-amber-100 tracking-wide">Youth Sports Business Report &middot; 2026 Rising Star Award</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">
                      <span className="inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                      <span className="text-[11px] font-medium text-gray-300 tracking-wide">NTangible &times; IMG Academy</span>
                  </div>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.02] text-white">
                  A mental performance score for <span className="text-blue-400">every NCSA athlete.</span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Sport-specific testing across NCSA and SportsRecruits. Standalone tool on one side -
                  Elevate-bundled distribution into every partner academy's roster on the other.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 max-w-md sm:max-w-none mx-auto">
                 <button
                    onClick={() => setShowTestDrive(true)}
                    className="w-full sm:w-auto bg-blue-500 hover:bg-blue-400 text-white px-8 py-3.5 rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2"
                 >
                    Try the assessment <ArrowRight size={16} />
                 </button>

                 <button
                    onClick={() => setShowBooking(true)}
                    className="w-full sm:w-auto bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 hover:border-white/20 text-white px-8 py-3.5 rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2"
                 >
                    Send questions
                 </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8 mb-14 sm:mb-16">
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-white/40"
                  >
                      See a sample profile
                  </button>
                  <button
                    onClick={() => handleEnter('master')}
                    className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-white/40"
                  >
                      Open the dashboard demo
                  </button>
                  <button
                    onClick={() => handleTabChange('economics')}
                    className="text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors underline underline-offset-4 decoration-white/10 hover:decoration-white/40"
                  >
                      See the economics
                  </button>
              </div>
          </section>

          {/* RECOGNIZED BY - YSBR 2026 RISING STAR */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
              <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-b from-amber-400/[0.08] via-amber-400/[0.02] to-transparent p-6 sm:p-9">
                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
                      <div className="shrink-0">
                          <img
                              src="/ysbr.png"
                              alt="Youth Sports Business Report"
                              className="h-20 sm:h-24 w-auto object-contain drop-shadow-[0_10px_30px_rgba(251,191,36,0.25)]"
                          />
                      </div>
                      <div className="flex-1 sm:border-l sm:border-amber-400/20 sm:pl-8">
                          <p className="text-[11px] font-semibold text-amber-300 uppercase tracking-widest mb-2">Industry recognition</p>
                          <p className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-tight mb-2">
                              2026 Rising Star Award &middot; <span className="text-amber-200">Youth Sports Business Report</span>
                          </p>
                          <p className="text-base text-gray-400 leading-relaxed">
                              Selected by the industry trade for category-defining work in youth sports
                              technology - the same year IMG Academy is consolidating its digital
                              recruiting portfolio.
                          </p>
                      </div>
                  </div>
              </div>
          </section>

          {/* SOCIAL PROOF / TRUSTED TEAMS TICKER */}
          <div className="w-full mb-16 sm:mb-20">
              <TrustedTeams />
          </div>

          {/* IMG ACADEMY DIGITAL SURFACES */}
          <PartnerProperties />

          {/* INSET TABBED SECTION */}
          <div className="mb-24 sm:mb-32">
              {/* Sticky inset tab bar */}
              <div
                  ref={tabSectionRef}
                  className="sticky top-16 z-40 scroll-mt-16 bg-[#070709]/90 backdrop-blur-xl border-y border-white/10 shadow-[0_14px_30px_-12px_rgba(0,0,0,0.85)]"
              >
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                      <div className="overflow-x-auto lp-no-scrollbar">
                          <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-2xl border border-white/10 bg-white/[0.05]">
                              {TABS.map((t, i) => (
                                  <button
                                      key={t.id}
                                      onClick={() => handleTabChange(t.id)}
                                      className={`group shrink-0 inline-flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-[13px] sm:text-sm font-semibold transition-all whitespace-nowrap ${
                                          activeTab === t.id
                                              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                              : 'text-gray-400 hover:text-white hover:bg-white/[0.07]'
                                      }`}
                                  >
                                      <span className={`text-[11px] font-bold tabular-nums ${activeTab === t.id ? 'text-blue-200' : 'text-gray-600 group-hover:text-gray-400'}`}>
                                          {String(i + 1).padStart(2, '0')}
                                      </span>
                                      {t.label}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>

              {/* Active tab panel */}
              <div key={activeTab} className="lp-tab-panel pt-12 sm:pt-16">
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-semibold">
                          {TABS.find(t => t.id === activeTab)?.label}
                      </span>
                  </div>
                  {renderTabPanel()}
                  {renderTabPager()}
              </div>
          </div>

          {/* FINAL CTA */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
              <div className="border-t border-white/10 pt-16 sm:pt-20 text-center">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight leading-[1.05] mb-5">
                      Ready when you are.
                  </h2>
                  <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
                      Questions, comments, or ready to move to the Letter of Intent? Drop us a line and we'll
                      send the next step within 24 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md sm:max-w-none mx-auto">
                      <button
                          onClick={() => setShowBooking(true)}
                          className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-3.5 rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2"
                      >
                          Continue the conversation <ArrowRight size={16} />
                      </button>
                      <button
                          onClick={() => setShowReportModal(true)}
                          className="text-gray-300 hover:text-white px-8 py-3.5 rounded-lg font-medium text-base transition-colors flex items-center justify-center gap-2"
                      >
                          See a sample profile
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
                      <p className="text-sm text-gray-500 leading-relaxed">
                          An integration proposal for IMG Academy.
                      </p>
                  </div>
                  <div>
                      <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Proposal</p>
                      <ul className="space-y-2.5 text-sm">
                          <li><button onClick={() => handleTabChange('assessments')} className="text-gray-400 hover:text-white transition-colors">The assessments</button></li>
                          <li><button onClick={() => handleTabChange('coaches')} className="text-gray-400 hover:text-white transition-colors">For college coaches</button></li>
                          <li><button onClick={() => handleTabChange('economics')} className="text-gray-400 hover:text-white transition-colors">Economics</button></li>
                          <li><button onClick={() => handleTabChange('activation')} className="text-gray-400 hover:text-white transition-colors">Activation &amp; rollout</button></li>
                      </ul>
                  </div>
                  <div>
                      <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Explore</p>
                      <ul className="space-y-2.5 text-sm">
                          <li><button onClick={() => setShowTestDrive(true)} className="text-gray-400 hover:text-white transition-colors">Sample assessments</button></li>
                          <li><button onClick={() => setShowReportModal(true)} className="text-gray-400 hover:text-white transition-colors">Sample profile</button></li>
                      </ul>
                  </div>
                  <div>
                      <p className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Talk to us</p>
                      <ul className="space-y-2.5 text-sm">
                          <li><button onClick={() => setShowBooking(true)} className="text-gray-400 hover:text-white transition-colors">Continue the conversation</button></li>
                          <li><a href="https://calendly.com/ntangible/30min" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Contact NTangible</a></li>
                      </ul>
                  </div>
              </div>
              <div className="border-t border-white/5 pt-6 mb-5 flex items-center justify-center sm:justify-start gap-3">
                  <img src="/ysbr.png" alt="Youth Sports Business Report" className="h-8 w-auto object-contain opacity-90" />
                  <span className="text-[11px] font-medium text-amber-200/80 tracking-wide">
                      2026 Rising Star Award &middot; Youth Sports Business Report
                  </span>
              </div>
              <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-600">
                  <span>&copy; 2026 NTangible, Inc. - Proposal for IMG Academy</span>
                  <div className="flex gap-5">
                      <span>COPPA-aligned</span>
                      <span>Encrypted data</span>
                      <span>IMG Academy-branded</span>
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

export default LandingPage;
