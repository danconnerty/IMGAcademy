
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
            <img src="/NTangiblelogowhite.PNG" alt="NTangible" className={`${ntHeight} w-auto object-contain [filter:invert(1)]`} />
            <span className="text-gray-soft text-lg font-light leading-none">&times;</span>
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-5xl h-[85vh] bg-white border border-line-strong rounded-card relative shadow-lift overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-line flex justify-between items-center bg-white">
                <h2 className="text-xl font-semibold tracking-tightest text-ink">Continue the conversation</h2>
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
                    title="Schedule Integration Call"
                    className="w-full h-full"
                ></iframe>
            </div>
        </div>
    </div>
);

// --- SAMPLE REPORT MODAL ---
const SampleReportModal = ({ onClose, onViewClutch, onViewNterpret }: { onClose: () => void, onViewClutch: () => void, onViewNterpret: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="w-full max-w-lg bg-white border border-line-strong rounded-card relative shadow-lift overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-line flex justify-between items-center bg-white">
                <h2 className="text-xl font-semibold tracking-tightest text-ink">Inside the profile</h2>
                <button onClick={onClose} className="text-gray-brand hover:text-ink transition-colors">
                    <X size={24} strokeWidth={1.8} />
                </button>
            </div>
            <div className="p-6 space-y-4">
                <button
                    onClick={onViewClutch}
                    className="w-full group relative p-6 bg-white hover:bg-chip border border-line-strong hover:border-ink rounded-card transition-all text-left"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-card text-ink">
                                <Activity size={20} strokeWidth={1.8} />
                            </div>
                            <h3 className="text-lg font-semibold tracking-tightest text-ink">Clutch Factor assessment</h3>
                        </div>
                        <ArrowRight size={18} strokeWidth={1.8} className="text-gray-soft group-hover:text-ink group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-body pl-[52px]">
                        See a sample report - how an athlete handles pressure when the game is on the line.
                    </p>
                </button>

                <button
                    onClick={onViewNterpret}
                    className="w-full group relative p-6 bg-white hover:bg-chip border border-line-strong hover:border-ink rounded-card transition-all text-left"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-card text-ink">
                                <Brain size={20} strokeWidth={1.8} />
                            </div>
                            <h3 className="text-lg font-semibold tracking-tightest text-ink">NTerpret Mental Scouting Report</h3>
                        </div>
                        <ArrowRight size={18} strokeWidth={1.8} className="text-gray-soft group-hover:text-ink group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-body pl-[52px]">
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
    { min: 0,       max: 100_000,  price: 10,   imgShare: 3, label: 'Entry',    tone: 'text-ink' },
    { min: 100_000, max: 250_000,  price: 8.5,  imgShare: 3, label: 'Scale',    tone: 'text-ink' },
    { min: 250_000, max: Infinity, price: 7.5,  imgShare: 3, label: 'Platform', tone: 'text-ink' },
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
                <p className="nt-kicker mb-3">The economics</p>
                <h2 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tightest leading-[1.05] mb-4">
                    Annual per-athlete subscription. Volume drops the price.
                </h2>
                <p className="text-lg text-body leading-relaxed">
                    Per active subscriber, per year, bundled into the NCSA membership. IMG Academy's $3 share
                    is flat across every tier - growth comes from volume, not from renegotiating rate.
                </p>
            </div>

            {/* Volume tier table */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line-strong border border-line-strong rounded-card overflow-hidden mb-10">
                {VOLUME_TIERS.map((t) => (
                    <div key={t.label} className="bg-white p-6 sm:p-7 flex flex-col">
                        <p className={`font-mono text-[11px] font-medium uppercase tracking-[0.25em] ${t.tone} mb-3`}>{t.label}</p>
                        <p className="text-sm text-gray-brand tabular-nums mb-4">{fmtRange(t)} active subscribers</p>
                        <p className="text-4xl sm:text-5xl font-semibold text-ink tracking-tightest tabular-nums mb-1">
                            ${fmtMoney(t.price)}
                        </p>
                        <p className="text-xs text-gray-brand mb-4">per subscriber / year</p>
                        <div className="border-t border-line pt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-brand">IMG Academy take</span>
                                <span className="text-ink font-semibold tabular-nums">${fmtMoney(t.imgShare)} / yr</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ---- UNIFIED COST <-> EARN CARD ---- */}
            <div className="bg-white border border-line-strong rounded-card p-6 sm:p-10 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line-strong rounded-card overflow-hidden mb-8 border border-line-strong">
                    {/* LEFT: what it costs the family */}
                    <div className="bg-white p-6 sm:p-8">
                        <p className="nt-kicker mb-4">What it costs the family</p>
                        <div className="flex items-baseline gap-3 mb-1">
                            <p className="text-5xl sm:text-6xl font-semibold text-ink tracking-tightest tabular-nums">$30</p>
                            <p className="text-sm text-gray-brand font-semibold tabular-nums">/ 0.5% of NCSA spend</p>
                        </div>
                        <p className="text-sm text-body leading-relaxed mb-4">
                            $7.50 / yr &times; 4 years on a $6,000 MVP+ multi-year package.
                            A rounding-error line on the family's NCSA invoice.
                        </p>
                        <p className="text-[11px] text-gray-brand leading-relaxed pt-3 border-t border-line">
                            Entry-tier Champion package (~$1,500): still ~2% of family spend.
                        </p>
                    </div>

                    {/* RIGHT: what it earns IMG */}
                    <div className="bg-white p-6 sm:p-8">
                        <p className="nt-kicker mb-4">What it earns IMG &middot; live</p>
                        <p className="text-5xl sm:text-6xl font-semibold text-ink tracking-tightest tabular-nums mb-2">{fmt(allInTotal)}</p>
                        <p className="text-sm text-body leading-relaxed mb-2 tabular-nums">
                            annually, at {clamped.toLocaleString('en-US')} active subscribers
                        </p>
                        <p className="text-[12px] text-gray-brand leading-relaxed pt-3 border-t border-line">
                            Subscriptions {fmt(baselineRev)}
                            {academyPlusRev > 0 && <> &middot; Academy+ {fmt(academyPlusRev)}</>}
                            {elevateRev > 0 && <> &middot; Elevate {fmt(elevateRev)}</>}
                        </p>
                    </div>
                </div>

                {/* Slider spanning both halves */}
                <div className="pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-3 gap-3 sm:gap-4">
                        <label className="text-sm font-medium text-body">
                            Active NCSA + SR subscribers
                            <span className={`ml-2 ${tier.tone} font-mono font-medium uppercase tracking-[0.16em] text-[11px]`}>
                                {tier.label} &middot; ${fmtMoney(tier.price)} / yr
                            </span>
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={MAX_PROFILES}
                            value={clamped}
                            onChange={(e) => setProfiles(parseInt(e.target.value || '0', 10))}
                            className="w-full sm:w-44 bg-transparent border-0 border-b border-line-strong px-0 py-2 text-right text-xl sm:text-2xl font-semibold text-ink tracking-tightest tabular-nums focus:outline-none focus:border-ink"
                        />
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={MAX_PROFILES}
                        step={5000}
                        value={clamped}
                        onChange={(e) => setProfiles(parseInt(e.target.value, 10))}
                        className="nt-range w-full"
                    />
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                        {[50_000, 100_000, 250_000, 500_000, 1_000_000].map(n => (
                            <button
                                key={n}
                                onClick={() => setProfiles(n)}
                                className={`px-3.5 py-1.5 rounded-pill border font-mono text-[11px] font-medium tracking-[0.08em] transition-colors duration-150 ease-nt tabular-nums ${
                                    clamped === n ? 'bg-ink text-white border-ink' : 'bg-white text-body border-line-strong hover:border-ink hover:text-ink'
                                }`}
                            >
                                {fmtCompact(n)}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-[12px] text-gray-brand leading-relaxed mt-6 pt-5 border-t border-line">
                    The all-in number folds in Academy+ session-funnel revenue and Elevate B2B channel revenue.
                    See those tabs for the full mechanics. Optional in-cycle retakes are an additional revenue
                    line not modeled here. Settlement is monthly on completed tests.
                </p>
            </div>

            {/* ADVANCED ASSUMPTIONS */}
            <div className="bg-white border border-line-strong rounded-card p-5 sm:p-6">
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="font-mono text-[11px] font-medium text-gray-brand hover:text-ink uppercase tracking-[0.16em] transition-colors flex items-center gap-2"
                >
                    <span>{showAdvanced ? '−' : '+'}</span> Assumptions behind the all-in number
                </button>
                {!showAdvanced && (
                    <p className="text-[11px] text-gray-brand mt-2 leading-relaxed">
                        {lowScorePct}% of athletes score Below Average &middot; {conversionPct}% convert on
                        Academy+ outreach &middot; ${sessionPrice} per session &middot; {elevateAcademies} Elevate
                        academies at ~{academySize} athletes each.
                    </p>
                )}
                {showAdvanced && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <label className="flex flex-col gap-1">
                            <span className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.16em]">Low-score share %</span>
                            <input
                                type="number" min={0} max={100} step={1}
                                value={lowScorePct}
                                onChange={(e) => setLowScorePct(Math.max(0, Math.min(100, parseInt(e.target.value || '0', 10))))}
                                className="bg-transparent border-0 border-b border-line-strong px-0 py-2 text-right text-sm font-semibold text-ink tabular-nums focus:outline-none focus:border-ink"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.16em]">A+ conversion %</span>
                            <input
                                type="number" min={0} max={100} step={1}
                                value={conversionPct}
                                onChange={(e) => setConversionPct(Math.max(0, Math.min(100, parseInt(e.target.value || '0', 10))))}
                                className="bg-transparent border-0 border-b border-line-strong px-0 py-2 text-right text-sm font-semibold text-ink tabular-nums focus:outline-none focus:border-ink"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.16em]">Session price $</span>
                            <input
                                type="number" min={0} step={5}
                                value={sessionPrice}
                                onChange={(e) => setSessionPrice(Math.max(0, parseInt(e.target.value || '0', 10)))}
                                className="bg-transparent border-0 border-b border-line-strong px-0 py-2 text-right text-sm font-semibold text-ink tabular-nums focus:outline-none focus:border-ink"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.16em]">Elevate academies</span>
                            <input
                                type="number" min={0} step={1}
                                value={elevateAcademies}
                                onChange={(e) => setElevateAcademies(Math.max(0, parseInt(e.target.value || '0', 10)))}
                                className="bg-transparent border-0 border-b border-line-strong px-0 py-2 text-right text-sm font-semibold text-ink tabular-nums focus:outline-none focus:border-ink"
                            />
                        </label>
                        <label className="flex flex-col gap-1">
                            <span className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.16em]">Athletes / academy</span>
                            <input
                                type="number" min={0} step={50}
                                value={academySize}
                                onChange={(e) => setAcademySize(Math.max(0, parseInt(e.target.value || '0', 10)))}
                                className="bg-transparent border-0 border-b border-line-strong px-0 py-2 text-right text-sm font-semibold text-ink tabular-nums focus:outline-none focus:border-ink"
                            />
                        </label>
                    </div>
                )}
            </div>
        </section>
    );
};

// --- IMG ACADEMY DIGITAL SURFACES ---
const SURFACES: { name: string; blurb: string; logo?: string; motion: 'testing' | 'distribution' | 'funnel' }[] = [
    { name: 'NCSA', motion: 'testing', blurb: 'Standard on every athlete profile. Per-active-subscriber pricing across the membership base - not an add-on, not a SKU families have to opt into.', logo: '/NCSA.jpg' },
    { name: 'SportsRecruits', motion: 'testing', blurb: 'Same integration extends across SR’s 400K-athlete club and HS audience. Adds volume, drops the per-subscriber price for IMG.', logo: '/Sportsrecruits.png' },
    { name: 'Elevate by IMG Academy', motion: 'distribution', blurb: 'Bundled into every Elevate academy license. Every athlete at every partner school gets an NCSA profile and a sport-specific assessment - the B2B distribution play that opens the TAM.', logo: '/IMGElevate.png' },
    { name: 'IMG Academy+', motion: 'funnel', blurb: 'Low Clutch scores route automatically into the Academy+ session funnel. Pre-qualified leads at $0 acquisition cost - the lead-gen engine on top of every assessment.', logo: '/IMGacademy+.png' },
];

const PartnerProperties = () => (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20 sm:mb-24">
        <div className="mb-10 sm:mb-12 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
                <img src="/IMG.png" alt="IMG Academy" className="h-7 w-auto object-contain" />
                <p className="nt-kicker">Where it plugs in</p>
            </div>
            <h2 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tightest leading-[1.05] mb-4">
                Four surfaces. One integration.
            </h2>
            <p className="text-lg text-body leading-relaxed">
                Sport-specific testing across NCSA and SportsRecruits. Bundled into Elevate academy licenses
                for B2B distribution. Routed into IMG Academy+ as a pre-qualified lead funnel. One integration,
                no new SKU to invent.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line-strong border border-line-strong rounded-card overflow-hidden mb-5">
            {SURFACES.map((s) => {
                const motionLabel =
                    s.motion === 'testing' ? 'Testing layer' :
                    s.motion === 'distribution' ? 'B2B distribution' :
                    'Lead-gen funnel';
                return (
                    <div key={s.name} className="bg-white p-5 sm:p-7 flex flex-col">
                        {s.logo && (
                            <div className="h-9 mb-4 flex items-center">
                                <img
                                    src={s.logo}
                                    alt={`${s.name} logo`}
                                    className="max-h-9 w-auto object-contain"
                                />
                            </div>
                        )}
                        <span className="self-start inline-flex items-center px-2 py-0.5 rounded-pill border border-line-strong bg-chip font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-gray-brand mb-3">
                            {motionLabel}
                        </span>
                        <p className="text-ink text-base font-semibold mb-2">{s.name}</p>
                        <p className="text-gray-brand text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: s.blurb }} />
                    </div>
                );
            })}
        </div>

        {/* Bonus inclusion strip - free on-campus access for IMG's own programs */}
        <div className="rounded-card border border-line-strong bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="shrink-0">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-pill border border-line-strong bg-chip">
                    <span className="font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em]">Bonus &middot; Included</span>
                </span>
            </div>
            <p className="text-sm sm:text-base text-body leading-relaxed flex-1">
                <span className="font-semibold text-ink">Free on-campus assessment access</span>{' '}
                <span className="text-body">for IMG's boarding students and other people on campus. Same instruments, same dashboard - no extra cost, no separate SOW.</span>
            </p>
        </div>
    </section>
);

// --- ASSESSMENT SHOWCASE (compact two-up: NTerpret + Clutch Factor) ---
const AssessmentShowcase: React.FC<{ onViewNterpret: () => void; onViewClutch: () => void }> = ({ onViewNterpret, onViewClutch }) => (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20 sm:mb-24">
        <div className="mb-8 sm:mb-10 max-w-2xl">
            <p className="nt-kicker mb-3">What powers the profile</p>
            <h2 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tightest leading-[1.05] mb-4">
                Two reports. One complete profile.
            </h2>
            <p className="text-lg text-body leading-relaxed">
                Every athlete completes both assessments in under 15 minutes from any phone. Reports live
                inside the IMG Academy dashboard and share to college coaches in one tap.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line-strong border border-line-strong rounded-card overflow-hidden">
            {/* NTerpret */}
            <div className="bg-white flex flex-col sm:flex-row items-stretch">
                <div className="relative shrink-0 w-full sm:w-44 md:w-48 lg:w-52 flex items-end justify-center overflow-hidden bg-chip min-h-[200px] sm:min-h-0">
                    <img
                        src="/NterpretMobile.png"
                        alt="NTerpret Mental Scouting Report on mobile"
                        loading="lazy"
                        decoding="async"
                        className="relative z-10 max-h-[280px] sm:max-h-[340px] w-auto object-contain"
                    />
                </div>
                <div className="flex-1 p-5 sm:p-6 flex flex-col">
                    <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.2em] mb-2">NTerpret<sup className="text-[8px] tracking-normal ml-0.5">&trade;</sup></p>
                    <h3 className="text-lg sm:text-xl font-semibold text-ink tracking-tightest mb-2">Mental Scouting Report</h3>
                    <p className="text-sm text-body leading-relaxed mb-4">
                        The complete cognitive profile - how each athlete learns, leads, communicates, and competes.
                    </p>
                    <button
                        onClick={onViewNterpret}
                        className="nt-btn-ghost self-start !py-2 !px-4 !text-sm"
                    >
                        <FileText size={14} strokeWidth={1.8} /> View sample report
                    </button>
                </div>
            </div>

            {/* Clutch Factor */}
            <div className="bg-white flex flex-col sm:flex-row items-stretch">
                <div className="relative shrink-0 w-full sm:w-44 md:w-48 lg:w-52 flex items-end justify-center overflow-hidden bg-chip min-h-[200px] sm:min-h-0">
                    <img
                        src="/ClutchMobile.png"
                        alt="Clutch Factor Assessment on mobile"
                        loading="lazy"
                        decoding="async"
                        className="relative z-10 max-h-[280px] sm:max-h-[340px] w-auto object-contain"
                    />
                </div>
                <div className="flex-1 p-5 sm:p-6 flex flex-col">
                    <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.2em] mb-2">Clutch Factor<sup className="text-[8px] tracking-normal ml-0.5">&trade;</sup></p>
                    <h3 className="text-lg sm:text-xl font-semibold text-ink tracking-tightest mb-2">Clutch Factor assessment</h3>
                    <p className="text-sm text-body leading-relaxed mb-4">
                        A standardized score that quantifies how an athlete responds when the game is on the line.
                    </p>
                    <button
                        onClick={onViewClutch}
                        className="nt-btn-ghost self-start !py-2 !px-4 !text-sm"
                    >
                        <FileText size={14} strokeWidth={1.8} /> View sample report
                    </button>
                </div>
            </div>
        </div>
    </section>
);

// --- RECRUITING CORRELATIONS (proof-of-value block, lives on landing page) ---
const RecruitingCorrelations: React.FC = () => (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20 sm:mb-24">
        <div className="mb-8 sm:mb-10 max-w-2xl">
            <p className="nt-kicker mb-3">What the score predicts</p>
            <h2 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tightest leading-[1.05] mb-4">
                Look at the recruiting correlations.
            </h2>
            <p className="text-lg text-body leading-relaxed">
                The Clutch Factor isn't a vanity metric. The score correlates directly with the two outcomes
                families pay NCSA to deliver: a D1 commitment and a college career that ends in conference honors.
            </p>
        </div>

        <div className="rounded-card border border-line-strong bg-white overflow-hidden">
            {/* Header strip */}
            <div className="px-5 sm:px-7 py-4 border-b border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <FileText size={14} strokeWidth={1.8} className="text-gray-soft" />
                    <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em]">Look at the recruiting correlations</p>
                </div>
                <a
                    href="https://ntangible.co/research"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nt-btn-link self-start sm:self-auto"
                >
                    See all papers <ArrowRight size={12} strokeWidth={1.8} className="nt-arrow" />
                </a>
            </div>

            {/* Stat grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-line">
                <div className="p-6 sm:p-7">
                    <p className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest mb-2 tabular-nums">2&times;</p>
                    <p className="text-ink text-sm sm:text-base font-semibold mb-1">The D1 rate at 750+</p>
                    <p className="text-gray-brand text-sm leading-relaxed">High school baseball players scoring 750+ at national showcases reached NCAA Division I at twice the rate of those below 750: 49% vs. 23% across 309 players (The D1 Signal, NTangible white paper, Oct 2026).</p>
                </div>
                <div className="p-6 sm:p-7">
                    <p className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest mb-2 tabular-nums">73%</p>
                    <p className="text-ink text-sm sm:text-base font-semibold mb-1">All-American or All-Conference</p>
                    <p className="text-gray-brand text-sm leading-relaxed">Of collegiate athletes scoring above 800, 73% are named All-American or All-Conference selections. The signal college coaches don't have today.</p>
                </div>
            </div>

            {/* Whitepaper sub-section */}
            <div className="border-t border-line">
                <div className="px-5 sm:px-7 py-3 bg-chip/40 border-b border-line">
                    <p className="font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em]">The supporting research</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line">
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
                            className="group p-5 sm:p-7 flex items-start gap-4 hover:bg-chip/40 transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-2">{paper.eyebrow}</p>
                                <p className="text-[15px] sm:text-base font-semibold text-ink tracking-tightest leading-snug mb-1 group-hover:opacity-70 transition-opacity">
                                    {paper.title}
                                </p>
                                <p className="text-[13px] text-gray-brand leading-snug mb-2.5">{paper.subtitle}</p>
                                <p className="font-mono text-[11px] text-gray-brand uppercase tracking-[0.16em] font-medium tabular-nums">{paper.meta}</p>
                            </div>
                            <span className="shrink-0 mt-1 w-8 h-8 rounded-full border border-line-strong group-hover:border-ink text-gray-brand group-hover:text-ink flex items-center justify-center transition-all">
                                <ArrowRight size={14} strokeWidth={1.8} className="group-hover:translate-x-0.5 transition-transform" />
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

// --- INSET TAB NAVIGATION ---
type TabId = 'coaches' | 'elevate' | 'academy-plus' | 'economics' | 'activation';

const TABS: { id: TabId; label: string }[] = [
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
  const [activeTab, setActiveTab] = useState<TabId>('coaches');

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
      case 'coaches':
        return (
          <>
              {/* HERO - THESIS */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
                  <div className="max-w-3xl">
                      <h2 className="text-4xl sm:text-6xl font-semibold text-ink tracking-tightest leading-[1.02] mb-6">
                          Coaches log in.
                      </h2>
                      <p className="text-lg sm:text-xl text-body leading-relaxed">
                          NTangible isn't just an assessment. College coaches integrate directly into the platform
                          and run the Coach&ndash;Player Alignment Index against any NCSA or SportsRecruits profile -
                          a free, always-on dashboard that answers <span className="text-ink font-medium">will this athlete fit my system</span>{' '}
                          before the first call.
                      </p>
                  </div>
              </section>

              {/* INSIDE THE NCSA PROFILE - native integration mockup */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-10 sm:mb-12 max-w-2xl">
                      <div className="flex items-center gap-3 mb-3">
                          <img src="/NCSA.jpg" alt="NCSA" className="h-6 w-auto object-contain rounded" />
                          <p className="nt-kicker">Inside the NCSA profile</p>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest leading-[1.08] mb-4">
                          This is your NCSA profile with NTangible inside.
                      </h3>
                      <p className="text-lg text-body leading-relaxed">
                          Two surfaces NCSA already ships - the athlete card families share with coaches,
                          and the match analysis the coach sees on their end. Both extend with a Clutch Factor
                          score and a Coach&ndash;Player Alignment Index that live native to the existing chrome.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-start">
                      {/* Athlete card with Clutch Factor baked into the image */}
                      <div>
                          <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-4">
                              Athlete profile card
                          </p>
                          <img
                              src="/get-noticed-clutch.png"
                              alt="NCSA athlete profile card for Marcus Copeland with Clutch Factor"
                              className="w-full h-auto block rounded-card border border-line-strong"
                          />
                          <p className="text-sm text-body leading-relaxed mt-5">
                              <span className="text-ink font-semibold">What we add:</span> a Clutch Factor
                              score sitting alongside GPA and SAT - the recruiting signal college coaches
                              don't have today.
                          </p>
                      </div>

                      {/* Match analysis with Coach-Player Alignment Index baked in */}
                      <div>
                          <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-4">
                              Match analysis (coach view)
                          </p>
                          <img
                              src="/match-analysis-aligned.png"
                              alt="NCSA match analysis with Coach-Player Alignment Index integrated"
                              className="w-full h-auto block rounded-card border border-line-strong"
                          />
                          <p className="text-sm text-body leading-relaxed mt-5">
                              <span className="text-ink font-semibold">What we add:</span> a Coach&ndash;Player
                              Alignment Index that extends NCSA's Athletic and Academic comparisons with
                              system, room, and pressure-response fit.
                          </p>
                      </div>
                  </div>
              </section>

              {/* THREE VIEWS - how a coach actually uses the dashboard */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-10 sm:mb-12 max-w-2xl">
                      <p className="nt-kicker mb-3">The coach workflow</p>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest leading-[1.08] mb-4">
                          From the public board to the private note.
                      </h3>
                      <p className="text-lg text-body leading-relaxed mb-4">
                          Three views, one workflow - the path every coach walks from first scroll to final decision.
                      </p>
                      <p className="text-sm text-gray-brand italic leading-relaxed border-l-2 border-line-strong pl-4">
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
                          <div key={view.step} className="rounded-card border border-line-strong bg-white overflow-hidden flex flex-col">
                              <div className="bg-chip border-b border-line">
                                  <img
                                      src={view.src}
                                      alt={view.alt}
                                      loading="lazy"
                                      className="w-full h-auto block"
                                  />
                              </div>
                              <div className="p-5 sm:p-6 flex flex-col">
                                  <div className="flex items-center gap-2.5 mb-3">
                                      <span className="font-mono text-[10px] font-medium tabular-nums text-gray-brand tracking-[0.16em]">{view.step}</span>
                                      <span className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em]">{view.eyebrow}</span>
                                  </div>
                                  <h4 className="text-lg sm:text-xl font-semibold text-ink tracking-tightest leading-snug mb-2">{view.title}</h4>
                                  <p className="text-sm text-body leading-relaxed">{view.blurb}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </section>

              {/* WHY IMG WANTS THIS - single-panel value + dashboard disclaimer */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-card border border-line-strong bg-white p-7 sm:p-10">
                      <div className="max-w-3xl">
                          <div className="w-11 h-11 rounded-card bg-chip border border-line-strong flex items-center justify-center mb-5">
                              <Activity size={20} strokeWidth={1.8} className="text-ink" />
                          </div>
                          <p className="nt-kicker mb-3">Why IMG wants this on every profile</p>
                          <h3 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tightest mb-5">
                              Stickier coaches, stickier families.
                          </h3>
                          <ul className="space-y-3 mb-7">
                              <li className="text-[15px] text-body leading-relaxed flex gap-2.5"><Check size={17} strokeWidth={1.8} className="text-ink shrink-0 mt-0.5" /> A signal college coaches can't get anywhere else - pulls them into NCSA/SR instead of competing platforms</li>
                              <li className="text-[15px] text-body leading-relaxed flex gap-2.5"><Check size={17} strokeWidth={1.8} className="text-ink shrink-0 mt-0.5" /> Higher coach engagement per profile = higher commit conversion = the metric NCSA already sells on</li>
                              <li className="text-[15px] text-body leading-relaxed flex gap-2.5"><Check size={17} strokeWidth={1.8} className="text-ink shrink-0 mt-0.5" /> Every alignment view is a touchpoint NCSA can surface to the family</li>
                              <li className="text-[15px] text-body leading-relaxed flex gap-2.5"><Check size={17} strokeWidth={1.8} className="text-ink shrink-0 mt-0.5" /> Differentiates NCSA + SR against 247, On3, Rivals - they have stats; you'd have fit</li>
                          </ul>
                          <p className="text-sm text-gray-brand italic leading-relaxed border-l-2 border-line-strong pl-4">
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
                  <div className="rounded-card border border-line-strong bg-white p-7 sm:p-10">
                      <div className="max-w-3xl mb-10 sm:mb-12">
                          <div className="inline-flex items-center gap-2 bg-chip border border-line-strong px-3 py-1 rounded-pill mb-5">
                              <Target size={13} strokeWidth={1.8} className="text-ink" />
                              <span className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em]">Powered by NTangible IP</span>
                          </div>
                          <h3 className="text-3xl sm:text-5xl font-semibold text-ink tracking-tightest leading-[1.05] mb-5">
                              The Alignment Index.
                          </h3>
                          <p className="text-lg sm:text-xl text-body leading-relaxed">
                              One 0-100 score that tells a coach - before the first call - whether an athlete
                              will execute the system, fit the room, and stay.
                          </p>
                      </div>

                      {/* MOCKUP */}
                      <div className="rounded-card overflow-hidden border border-line-strong bg-white mb-10 sm:mb-12">
                          <img
                              src="/coachalignmentmockup.png"
                              alt="Alignment Index - athlete card showing a 93% Exceptional alignment score"
                              className="w-full h-auto block"
                          />
                      </div>

                      {/* RUBRIC - 5 tiers, compact horizontal */}
                      <div className="mb-10 sm:mb-12">
                          <p className="nt-kicker mb-4">
                              The rubric
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-line-strong border border-line-strong rounded-card overflow-hidden">
                              {[
                                  { range: '75 - 100',    tier: 'Exceptional',   bar: 'bg-ink',          line: 'Processes the game exactly like the coach.' },
                                  { range: '62.5 - 74.9', tier: 'Strong',        bar: 'bg-ink/70',       line: "Agrees with the goal, may take a different path." },
                                  { range: '50 - 62.4',   tier: 'Conditional',   bar: 'bg-ink/50',       line: 'Transactional fit. Cracks under losing.' },
                                  { range: '37.5 - 49.9', tier: 'Developmental', bar: 'bg-ink/30',       line: 'Processes decisions differently. Needs structure.' },
                                  { range: '0 - 37.4',    tier: 'Low alignment', bar: 'bg-line-strong',  line: 'High friction risk. Talk before committing.' },
                              ].map((row) => (
                                  <div key={row.tier} className="bg-white p-4 sm:p-5 flex flex-col">
                                      <span className={`block h-0.5 w-8 ${row.bar} rounded-full mb-3`} />
                                      <p className="text-ink text-sm sm:text-base font-semibold tabular-nums mb-0.5">{row.range}%</p>
                                      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-gray-brand mb-2">{row.tier}</p>
                                      <p className="text-xs sm:text-[13px] text-gray-brand leading-snug">{row.line}</p>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* THE PUNCH LINE */}
                      <div className="rounded-card border border-ink bg-white p-7 sm:p-9">
                          <p className="text-xl sm:text-2xl text-ink leading-snug font-medium max-w-3xl">
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
                      <h2 className="text-4xl sm:text-6xl font-semibold text-ink tracking-tightest leading-[1.02] mb-6">
                          Every athlete at every Elevate academy.
                      </h2>
                      <p className="text-lg sm:text-xl text-body leading-relaxed">
                          Elevate already sells IMG curriculum into outside academies. Bundle an NCSA profile
                          and a sport-specific assessment into that license, and every academy deal becomes
                          hundreds of recruiting-ready athletes on day one.
                      </p>
                  </div>
              </section>

              {/* VISUAL - Elevate Essentials with a Clutch Factor lesson on the laptop */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-card overflow-hidden border border-line-strong bg-white">
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
                      <p className="nt-kicker mb-3">Why this changes the ceiling</p>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest leading-[1.08] mb-4">
                          NCSA's TAM stops being self-signup.
                      </h3>
                      <p className="text-lg text-body leading-relaxed">
                          The 4.5M-athlete pool is the floor, not the ceiling. The ceiling is every program
                          Elevate already touches - sports academies, Nord Anglia campuses, federation
                          training centers. None of them currently flow through NCSA's funnel.
                      </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line-strong border border-line-strong rounded-card overflow-hidden">
                      <div className="bg-white p-6 sm:p-7">
                          <p className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest mb-2 tabular-nums">80+</p>
                          <p className="text-ink text-sm sm:text-base font-semibold mb-1">Nord Anglia campuses</p>
                          <p className="text-gray-brand text-sm leading-relaxed">Across 30 countries, already in EQT's distribution graph. Each one a candidate Elevate license.</p>
                      </div>
                      <div className="bg-white p-6 sm:p-7">
                          <p className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest mb-2 tabular-nums">100%</p>
                          <p className="text-ink text-sm sm:text-base font-semibold mb-1">Roster coverage per academy</p>
                          <p className="text-gray-brand text-sm leading-relaxed">Bundled, not opt-in. Every athlete on the roster gets the profile and the assessment as part of the school's license.</p>
                      </div>
                      <div className="bg-white p-6 sm:p-7">
                          <p className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest mb-2 tabular-nums">0</p>
                          <p className="text-ink text-sm sm:text-base font-semibold mb-1">Net-new sales motion</p>
                          <p className="text-gray-brand text-sm leading-relaxed">Rides Elevate's existing B2B-to-schools pipeline. No separate NCSA outbound, no per-family conversion funnel.</p>
                      </div>
                      <div className="bg-white p-6 sm:p-7">
                          <p className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest mb-2 tabular-nums">8</p>
                          <p className="text-ink text-sm sm:text-base font-semibold mb-1">European languages live</p>
                          <p className="text-gray-brand text-sm leading-relaxed">Madrid, Frankfurt, Stockholm - addressable day one. Every major language live by year-end.</p>
                      </div>
                  </div>
              </section>

              {/* THE MECHANICS - 3 steps */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-10 sm:mb-12 max-w-2xl">
                      <p className="nt-kicker mb-3">How the bundle works</p>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest leading-[1.08] mb-4">
                          One signature. Every athlete recruiting-ready.
                      </h3>
                      <p className="text-lg text-body leading-relaxed">
                          The academy doesn't run a separate procurement for NCSA. The bundle ships with the
                          Elevate license - same contract, same renewal cycle, same admin owner.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line-strong border border-line-strong rounded-card overflow-hidden">
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
                          <div key={s.step} className="bg-white p-6 sm:p-8 flex flex-col">
                              <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-3 tabular-nums">Step {s.step}</p>
                              <h4 className="text-lg sm:text-xl font-semibold text-ink tracking-tightest mb-3 leading-snug">{s.title}</h4>
                              <p className="text-sm text-body leading-relaxed">{s.body}</p>
                          </div>
                      ))}
                  </div>
              </section>

              {/* CLOSER */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-card border border-line-strong bg-white p-7 sm:p-10">
                      <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-9">
                          <div className="shrink-0">
                              <img
                                  src="/IMGElevate.png"
                                  alt="Elevate by IMG Academy"
                                  className="h-16 sm:h-20 w-auto object-contain"
                              />
                          </div>
                          <div className="flex-1 sm:border-l sm:border-line-strong sm:pl-9">
                              <p className="nt-kicker mb-3">The strategic frame</p>
                              <p className="text-xl sm:text-2xl text-ink leading-snug font-medium mb-3">
                                  Elevate is the channel. NCSA is the destination. The assessment is the proof.
                              </p>
                              <p className="text-base text-body leading-relaxed">
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
                      <h2 className="text-4xl sm:text-6xl font-semibold text-ink tracking-tightest leading-[1.02] mb-6">
                          Every low Clutch score is a qualified IMG Academy+ lead.
                      </h2>
                      <p className="text-lg sm:text-xl text-body leading-relaxed">
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
                          <div className="relative rounded-card overflow-hidden border border-line-strong bg-white max-w-sm md:max-w-none mx-auto">
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
                          <p className="nt-kicker mb-3">Why this is the no-brainer</p>
                          <h3 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest leading-[1.08] mb-4">
                              A pre-qualified lead, not a cold one.
                          </h3>
                          <p className="text-lg text-body leading-relaxed">
                              Every Academy+ outbound today starts from zero - cold list, no read on whether
                              the athlete actually needs the service. The assessment changes that. By the time
                              a low-scoring profile reaches the Academy+ team, the development gap is named,
                              quantified, and already visible to the family on their NCSA dashboard.
                          </p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line-strong border border-line-strong rounded-card overflow-hidden">
                      <div className="bg-white p-6 sm:p-7">
                          <p className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest mb-2 tabular-nums">100%</p>
                          <p className="text-ink text-sm sm:text-base font-semibold mb-1">Scored before contact</p>
                          <p className="text-gray-brand text-sm leading-relaxed">Every routed lead arrives with a Clutch Factor score, a position-specific assessment, and a named development gap. No discovery call required.</p>
                      </div>
                      <div className="bg-white p-6 sm:p-7">
                          <p className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest mb-2 tabular-nums">$0</p>
                          <p className="text-ink text-sm sm:text-base font-semibold mb-1">CAC on routed leads</p>
                          <p className="text-gray-brand text-sm leading-relaxed">The assessment is already paid for as part of the NCSA profile. Academy+ inherits the lead at zero acquisition cost.</p>
                      </div>
                  </div>
              </section>

              {/* THE RETEST CYCLE */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-10 sm:mb-12 max-w-2xl">
                      <p className="nt-kicker mb-3">Recurring revenue, three ways</p>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest leading-[1.08] mb-4">
                          The retest is the revenue.
                      </h3>
                      <p className="text-lg text-body leading-relaxed">
                          Three retest modes, stacked - each a billable event and a new routing trigger for
                          Academy+ outreach. The standard cycle doubles assessment volume; on-demand retakes
                          add a new SKU; post-coaching retests bundle with the Academy+ session fee.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line-strong border border-line-strong rounded-card overflow-hidden">
                      {[
                          {
                              cadence: 'Every 6 months',
                              label: 'Standard cycle',
                              title: 'The annual-recurring baseline',
                              body: "Bundled into the profile. Every athlete retests on the 6-month mark, no opt-in required. Each retest refreshes the Clutch Factor on the NCSA profile and re-routes the score against Academy+ tiers.",
                              chip: 'text-body border-line-strong bg-chip',
                              bar: 'bg-ink',
                          },
                          {
                              cadence: 'Athlete-initiated',
                              label: 'On-demand retake',
                              title: 'Pay to improve the score early',
                              body: "Athletes can purchase an out-of-cycle retake any time they want to push a higher number to coaches. A new revenue line on top of the subscription, owned entirely by IMG.",
                              chip: 'text-body border-line-strong bg-chip',
                              bar: 'bg-ink/60',
                          },
                          {
                              cadence: 'Post-coaching',
                              label: 'Intervention retest',
                              title: 'Prove Academy+ worked',
                              body: "After an Academy+ session block, athletes can retest early - inside the 6-month window - to validate the score lift. Closes the loop on coaching ROI and bundles naturally with the Academy+ SKU.",
                              chip: 'text-body border-line-strong bg-chip',
                              bar: 'bg-line-strong',
                          },
                      ].map((m) => (
                          <div key={m.label} className="bg-white p-6 sm:p-7 flex flex-col">
                              <span className={`block h-0.5 w-10 ${m.bar} rounded-full mb-4`} />
                              <p className="text-ink text-[15px] font-semibold tabular-nums mb-1">{m.cadence}</p>
                              <span className={`self-start inline-flex items-center px-2 py-0.5 rounded-pill border font-mono text-[10px] font-medium uppercase tracking-[0.16em] mb-4 ${m.chip}`}>
                                  {m.label}
                              </span>
                              <h4 className="text-lg sm:text-xl font-semibold text-ink tracking-tightest mb-2 leading-snug">{m.title}</h4>
                              <p className="text-sm text-body leading-relaxed">{m.body}</p>
                          </div>
                      ))}
                  </div>

              </section>

              {/* THE ROUTING TIERS */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-10 sm:mb-12 max-w-2xl">
                      <p className="nt-kicker mb-3">The routing logic</p>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest leading-[1.08] mb-4">
                          Every score becomes a next-best-action.
                      </h3>
                      <p className="text-lg text-body leading-relaxed">
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
                              barClass: 'bg-ink',
                              ringClass: 'border-line-strong bg-white',
                              tagClass: 'text-body border-line-strong bg-chip',
                              headline: 'Surface to college coaches.',
                              detail: "Promoted in the Coach Dashboard and Clutch Factor Leaderboard - the proof points Academy+ marketing leans on.",
                          },
                          {
                              range: 'Clutch 651-749',
                              reportTier: 'Average + Above Average',
                              label: 'Workshop nudge',
                              barClass: 'bg-ink/60',
                              ringClass: 'border-line-strong bg-white',
                              tagClass: 'text-body border-line-strong bg-chip',
                              headline: 'Route into Academy+ group workshops.',
                              detail: "Automated in-app and email nudge surfaces a group workshop or self-guided module - low-ticket entry into the Academy+ catalog.",
                          },
                          {
                              range: 'Clutch < 651',
                              reportTier: 'Below Average',
                              label: '1-on-1 session offer',
                              barClass: 'bg-line-strong',
                              ringClass: 'border-line-strong bg-white',
                              tagClass: 'text-body border-line-strong bg-chip',
                              headline: 'Direct to Academy+ 1-on-1 sports psychology.',
                              detail: "The family already sees the gap on their dashboard - Academy+ offers a $85-$100 1-on-1 session with a clear before/after tied to the next retest.",
                          },
                      ].map((tier) => (
                          <div key={tier.range} className={`rounded-card border ${tier.ringClass} p-5 sm:p-7 flex flex-col sm:flex-row sm:items-start gap-5`}>
                              <div className="shrink-0 flex flex-col sm:flex-col gap-2 sm:w-48">
                                  <span className={`h-0.5 w-10 ${tier.barClass} rounded-full hidden sm:block`} />
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:block">
                                      <p className="text-ink text-base sm:text-lg font-semibold tabular-nums">{tier.range}</p>
                                      <span className={`inline-flex items-center px-2 py-0.5 rounded-pill border font-mono text-[10px] font-medium uppercase tracking-[0.16em] ${tier.tagClass} sm:mt-1`}>
                                          {tier.label}
                                      </span>
                                  </div>
                                  <p className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.16em] font-medium">Report tier &middot; {tier.reportTier}</p>
                              </div>
                              <div className="flex-1 sm:border-l sm:border-line-strong sm:pl-6">
                                  <h4 className="text-lg sm:text-xl font-semibold text-ink tracking-tightest mb-2 leading-snug">{tier.headline}</h4>
                                  <p className="text-sm sm:text-[15px] text-body leading-relaxed">{tier.detail}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </section>

              {/* CLOSER */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-card border border-line-strong bg-white p-7 sm:p-10">
                      <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-9">
                          <div className="shrink-0">
                              <div className="w-14 h-14 rounded-card bg-chip border border-line-strong flex items-center justify-center">
                                  <Activity size={26} strokeWidth={1.8} className="text-ink" />
                              </div>
                          </div>
                          <div className="flex-1 sm:border-l sm:border-line-strong sm:pl-9">
                              <p className="nt-kicker mb-3">The strategic frame</p>
                              <p className="text-xl sm:text-2xl text-ink leading-snug font-medium mb-3">
                                  The assessment is the qualifier. NCSA is the channel. Academy+ is the close.
                              </p>
                              <p className="text-base text-body leading-relaxed">
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
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
                  <div className="rounded-card border border-ink bg-white p-7 sm:p-10">
                      <p className="nt-kicker mb-4">Try it today</p>
                      <h2 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tightest leading-[1.05] mb-5 max-w-3xl">
                          The assessment is live. Run it yourself in 60 seconds.
                      </h2>
                      <p className="text-lg text-body leading-relaxed mb-7 max-w-3xl">
                          Don't take the pitch at face value. Pick any of our 9 live sports, complete the
                          assessment from your phone, and see the actual report inside this prototype. No
                          commitment, no integration required - the experience IMG families would see is
                          something you can hold in your hand right now.
                      </p>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <button
                              onClick={() => setShowTestDrive(true)}
                              className="nt-btn-primary"
                          >
                              Run a live assessment <ArrowRight size={16} strokeWidth={1.8} className="nt-arrow" />
                          </button>
                          <p className="text-[12px] text-gray-brand leading-relaxed max-w-md">
                              Full NCSA backend integration (profile views, leaderboards, Coach Dashboard) is
                              the 60-day buildout below. The assessment is live now.
                          </p>
                      </div>
                  </div>
              </section>

              {/* THE 60-DAY DEAL + WHAT SHIPS */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-10 sm:mb-12 max-w-2xl">
                      <p className="nt-kicker mb-3">The commitment</p>
                      <h2 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tightest leading-[1.05] mb-4">
                          60 days from signature. Every sport built and integrated.
                      </h2>
                      <p className="text-lg text-body leading-relaxed">
                          With a signed agreement, every NCSA and SportsRecruits sport ships in 60 days. 9 are
                          live today; the rest take roughly two days each on our backend. The calendar is the
                          whole differentiator.
                      </p>
                  </div>

                  <div className="bg-white border border-line-strong rounded-card p-7 sm:p-10 mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
                          <div>
                              <p className="nt-kicker mb-3">Sport coverage timeline</p>
                              <p className="text-6xl sm:text-7xl font-semibold text-ink tracking-tightest leading-none mb-3 tabular-nums">60 days</p>
                              <p className="text-lg text-body leading-relaxed">
                                  from signature to <span className="text-ink font-medium">every sport, live and integrated</span>
                              </p>
                          </div>
                          <div className="grid grid-cols-3 gap-3 max-w-md sm:max-w-sm">
                              <div className="bg-chip border border-line-strong rounded-card p-3 text-center">
                                  <p className="text-2xl font-semibold text-ink tracking-tightest tabular-nums">9</p>
                                  <p className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.16em] mt-1">live today</p>
                              </div>
                              <div className="bg-chip border border-line-strong rounded-card p-3 text-center">
                                  <p className="text-2xl font-semibold text-ink tracking-tightest tabular-nums">~2d</p>
                                  <p className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.16em] mt-1">per new sport</p>
                              </div>
                              <div className="bg-chip border border-line-strong rounded-card p-3 text-center">
                                  <p className="text-2xl font-semibold text-ink tracking-tightest tabular-nums">0</p>
                                  <p className="font-mono text-[10px] text-gray-brand uppercase tracking-[0.16em] mt-1">cost to IMG</p>
                              </div>
                          </div>
                      </div>

                      <div className="pt-6 border-t border-line">
                          <p className="nt-kicker mb-4">What ships in 60 days</p>
                          <ul className="space-y-2.5">
                              <li className="text-[15px] text-body leading-relaxed flex gap-2.5"><Check size={17} strokeWidth={1.8} className="text-ink shrink-0 mt-0.5" /> Every NCSA and SportsRecruits sport, live with a sport-specific assessment</li>
                              <li className="text-[15px] text-body leading-relaxed flex gap-2.5"><Check size={17} strokeWidth={1.8} className="text-ink shrink-0 mt-0.5" /> Native NCSA integration: Clutch Factor on every athlete card, Alignment Index inside match analysis</li>
                              <li className="text-[15px] text-body leading-relaxed flex gap-2.5"><Check size={17} strokeWidth={1.8} className="text-ink shrink-0 mt-0.5" /> Free Coach Dashboard launched: alignment-scored prospect pool across every profile</li>
                              <li className="text-[15px] text-body leading-relaxed flex gap-2.5"><Check size={17} strokeWidth={1.8} className="text-ink shrink-0 mt-0.5" /> Academy+ routing live: low scores flow to the funnel automatically by tier</li>
                          </ul>
                      </div>
                  </div>

              </section>

              {/* ON-CAMPUS BUNDLE - free assessment access for IMG's own programs */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-card border border-line-strong bg-white p-7 sm:p-10">
                      <p className="nt-kicker mb-3">Bundled in the deal</p>
                      <h2 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest leading-[1.08] mb-5 max-w-3xl">
                          On-campus assessment access for IMG's flagship programs. Free.
                      </h2>
                      <p className="text-base sm:text-lg text-body leading-relaxed max-w-3xl">
                          Once the integration is live, the same Clutch Factor and NTerpret assessments are
                          available across IMG's campus - boarding students and other people on campus - at
                          zero additional cost. Same instruments, same dashboard, same scoring engine,
                          deployed alongside IMG's existing mental performance staff. No separate SOW,
                          no per-seat invoice, no per-cohort negotiation.
                      </p>
                  </div>
              </section>

              {/* TECHNICAL FIT (with data ownership folded in) */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="max-w-3xl">
                      <p className="nt-kicker mb-3">Technical fit</p>
                      <h2 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest leading-[1.08] mb-4">
                          Built into NCSA, not bolted onto it.
                      </h2>
                      <p className="text-lg text-body leading-relaxed">
                          REST API + Single Sign-On + responsive embed. Roster sync via webhook. NTangible
                          handles all assessment delivery, scoring, retest scheduling, and routing logic. The
                          NCSA backend integration - Clutch Factor on athlete cards, Coach Dashboard wiring,
                          Alignment Index inside match analysis - is built out and finalized during the 60-day
                          window above.
                          <span className="text-ink font-medium"> IMG defines the schema, owns the records,
                          and controls family consent.</span> COPPA-aligned today; FERPA-aware data handling
                          for student records.
                      </p>
                  </div>
              </section>

              {/* THE MOAT - what an internal build can't ship */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-card border border-line-strong bg-white p-7 sm:p-10">
                      <p className="nt-kicker mb-3">The five-year head start</p>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tightest leading-snug mb-5 max-w-3xl">
                          What an internal build can't ship.
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
                          <div>
                              <p className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest tabular-nums mb-1">5 yrs</p>
                              <p className="text-sm text-ink font-semibold mb-1">Calibrated scoring data</p>
                              <p className="text-[12px] text-gray-brand leading-relaxed">Benchmarked against committed athletes. A clean-room build starts at zero on validation.</p>
                          </div>
                          <div>
                              <p className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest tabular-nums mb-1">9</p>
                              <p className="text-sm text-ink font-semibold mb-1">Sports already in production</p>
                              <p className="text-[12px] text-gray-brand leading-relaxed">Scoring engine, retest pipeline, position-specific library - all live. Not a build plan.</p>
                          </div>
                          <div>
                              <p className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest tabular-nums mb-1">~6 mo</p>
                              <p className="text-sm text-ink font-semibold mb-1">Continuous validation loop</p>
                              <p className="text-[12px] text-gray-brand leading-relaxed">Every retest sharpens the model. An internal build doesn't get that loop until it ships.</p>
                          </div>
                          <div>
                              <p className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest tabular-nums mb-1">60d &middot; 18mo</p>
                              <p className="text-sm text-ink font-semibold mb-1">Integration vs. internal build</p>
                              <p className="text-[12px] text-gray-brand leading-relaxed">By the time an in-house v1 ships, NTangible's on year 6 of data.</p>
                          </div>
                      </div>
                      <p className="text-base sm:text-lg text-ink leading-relaxed font-medium border-t border-line pt-5">
                          You're not buying software. You're buying time and a five-year dataset.
                      </p>
                  </div>
              </section>

              {/* HOW THIS STARTS - the explicit ask */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-card border border-ink bg-white p-7 sm:p-10">
                      <p className="nt-kicker mb-3">How this starts</p>
                      <h2 className="text-3xl sm:text-4xl font-semibold text-ink tracking-tightest leading-[1.08] mb-5 max-w-3xl">
                          The first 48 hours after the Letter of Intent.
                      </h2>
                      <p className="text-base text-body leading-relaxed mb-7 max-w-3xl">
                          We start with a Letter of Intent - not a full contract - so the 60-day
                          clock can start immediately while the Master Service Agreement gets negotiated in
                          parallel. No waiting on legal.
                      </p>

                      <ol className="space-y-4 mb-8">
                          <li className="flex gap-4">
                              <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-ink text-white text-xs font-semibold tabular-nums">1</span>
                              <div>
                                  <p className="text-ink text-base font-semibold mb-0.5">Sign the Letter of Intent</p>
                                  <p className="text-sm text-body leading-relaxed">
                                      Non-binding except for the pricing tier alignment, exclusivity through
                                      formal-contract negotiation, and confidentiality. Terms sent within 48
                                      hours of the integration call.
                                  </p>
                              </div>
                          </li>
                          <li className="flex gap-4">
                              <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-ink text-white text-xs font-semibold tabular-nums">2</span>
                              <div>
                                  <p className="text-ink text-base font-semibold mb-0.5">Designate one IMG engineering point of contact</p>
                                  <p className="text-sm text-body leading-relaxed">
                                      The bridge between NTangible's build team and the NCSA backend.
                                  </p>
                              </div>
                          </li>
                          <li className="flex gap-4">
                              <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-ink text-white text-xs font-semibold tabular-nums">3</span>
                              <div>
                                  <p className="text-ink text-base font-semibold mb-0.5">Day 1 starts the 60-day clock</p>
                                  <p className="text-sm text-body leading-relaxed">
                                      NTangible begins sport buildout and backend integration immediately. The
                                      Master Service Agreement is finalized in parallel during the same window.
                                  </p>
                              </div>
                          </li>
                          <li className="flex gap-4">
                              <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-ink text-white text-xs font-semibold tabular-nums">4</span>
                              <div>
                                  <p className="text-ink text-base font-semibold mb-0.5">First sport ships within 7 days of Letter of Intent signature</p>
                                  <p className="text-sm text-body leading-relaxed">
                                      Visible product in IMG's hands the same week.
                                  </p>
                              </div>
                          </li>
                      </ol>

                      <div className="rounded-card border border-line-strong bg-chip/50 p-5 sm:p-6 mb-7">
                          <p className="text-sm text-body leading-relaxed">
                              <span className="text-ink font-semibold">NTangible cost to IMG until the integration goes live: $0.</span>
                              {' '}Billing only starts on the first completed assessment after launch.
                          </p>
                      </div>

                      <button
                          onClick={() => setShowBooking(true)}
                          className="nt-btn-primary"
                      >
                          Move to Letter of Intent terms <ArrowRight size={16} strokeWidth={1.8} className="nt-arrow" />
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
                className="group w-full flex items-center justify-between gap-4 sm:gap-6 rounded-card border border-line-strong bg-white hover:border-ink nt-card-hover p-6 sm:p-8 transition-all text-left"
            >
                <div>
                    <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-1.5">
                        Next &middot; {String(currentIndex + 2).padStart(2, '0')} of {String(TABS.length).padStart(2, '0')}
                    </p>
                    <p className="text-xl sm:text-2xl font-semibold text-ink tracking-tightest">
                        {nextTab.label}
                    </p>
                </div>
                <span className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-ink text-white flex items-center justify-center transition-all group-hover:translate-x-0.5">
                    <ArrowRight size={22} strokeWidth={1.8} />
                </span>
            </button>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-card border border-ink bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
              <div className="max-w-md">
                  <p className="nt-kicker mb-1.5">
                      That's the full proposal
                  </p>
                  <p className="text-xl sm:text-2xl font-semibold text-ink tracking-tightest">
                      You've seen every section. Let's make it official.
                  </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                  <button
                      onClick={() => handleTabChange('offer')}
                      className="nt-btn-ghost"
                  >
                      Back to start
                  </button>
                  <button
                      onClick={() => setShowBooking(true)}
                      className="nt-btn-primary"
                  >
                      Continue the conversation <ArrowRight size={15} strokeWidth={1.8} className="nt-arrow" />
                  </button>
              </div>
          </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-paper text-ink relative font-sans selection:bg-ink selection:text-white flex flex-col scroll-smooth ${showClutchReport || showNterpretReport ? 'h-screen overflow-hidden' : 'overflow-y-auto overflow-x-hidden'}`}>

      <style>{`
        .lp-tab-panel { animation: nt-fade-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .lp-no-scrollbar::-webkit-scrollbar { display: none; }
        .lp-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Background texture - faint hairline stat-grid */}
      <div className="fixed inset-0 z-0 pointer-events-none nt-stat-grid"></div>

      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 h-16 flex items-center justify-between backdrop-blur-md border-b border-line bg-paper/85">
          <div className="flex items-center gap-3">
              <Logo size="small" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
              <button
                  onClick={() => setShowBooking(true)}
                  className="nt-btn-primary !py-2 !px-4 !text-sm"
              >
                  Send questions
              </button>
          </div>
      </nav>

      {/* Main Content Container */}
      <div className="relative z-10 w-full pt-28 sm:pt-32">

          {/* HERO SECTION */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-16 sm:mb-20 text-center relative">
              <div className={`flex justify-center mb-7 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'} transition-all duration-700`}>
                  <img
                      src="/IMG.png"
                      alt="IMG Academy"
                      className="h-20 sm:h-24 w-auto object-contain"
                  />
              </div>
              <div className={`flex justify-center mb-8 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                  <div className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-pill border border-line-strong bg-white">
                      <img src="/ysbr.png" alt="Youth Sports Business Report" className="h-5 w-5 object-contain rounded-full" />
                      <span className="font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em]">Youth Sports Business Report &middot; 2026 Rising Star Award</span>
                  </div>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tightest mb-6 leading-[1.02] text-ink">
                  A mental performance score for <span className="text-ink">every NCSA and SportsRecruits athlete.</span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-body max-w-3xl mx-auto mb-10 leading-relaxed">
                  Sport-specific testing across NCSA and SportsRecruits, bundled into every Elevate academy
                  license, with low scores routed straight into the IMG Academy+ funnel.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 max-w-md sm:max-w-none mx-auto">
                 <button
                    onClick={() => setShowTestDrive(true)}
                    className="nt-btn-primary nt-btn-hero w-full sm:w-auto"
                 >
                    Try the assessment <ArrowRight size={16} strokeWidth={1.8} className="nt-arrow" />
                 </button>

                 <button
                    onClick={() => setShowBooking(true)}
                    className="nt-btn-ghost nt-btn-hero w-full sm:w-auto"
                 >
                    Send questions
                 </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8 mb-14 sm:mb-16">
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="nt-btn-link"
                  >
                      See a sample profile
                  </button>
                  <button
                    onClick={() => handleEnter('master')}
                    className="nt-btn-link"
                  >
                      Open the dashboard demo
                  </button>
                  <button
                    onClick={() => handleTabChange('economics')}
                    className="nt-btn-link"
                  >
                      See the economics
                  </button>
              </div>
          </section>

          {/* SOCIAL PROOF / TRUSTED TEAMS TICKER */}
          <div className="w-full mb-16 sm:mb-20">
              <TrustedTeams />
          </div>

          {/* IMG ACADEMY DIGITAL SURFACES */}
          <PartnerProperties />

          {/* TWO ASSESSMENTS - compact showcase */}
          <AssessmentShowcase
              onViewNterpret={() => setShowNterpretReport(true)}
              onViewClutch={() => setShowClutchReport(true)}
          />

          {/* RECRUITING CORRELATIONS (proof-of-value) */}
          <RecruitingCorrelations />

          {/* INSET TABBED SECTION */}
          <div className="mb-24 sm:mb-32">
              {/* Section intro - signposts the shift from product/proof into deal arguments */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10 sm:mb-12">
                  <p className="nt-kicker mb-3">Where the value lives</p>
                  <h2 className="text-4xl sm:text-5xl font-semibold text-ink tracking-tightest leading-[1.05] mb-4">
                      The five arguments for IMG to integrate.
                  </h2>
                  <p className="text-lg text-body leading-relaxed max-w-3xl">
                      Coach moat. Distribution play. Lead-gen funnel. Economics. Rollout.
                  </p>
              </div>

              {/* Sticky inset tab bar */}
              <div
                  ref={tabSectionRef}
                  className="sticky top-16 z-40 scroll-mt-16 bg-paper/90 backdrop-blur-xl border-y border-line"
              >
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                      <div className="overflow-x-auto lp-no-scrollbar">
                          <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-pill border border-line-strong bg-white">
                              {TABS.map((t, i) => (
                                  <button
                                      key={t.id}
                                      onClick={() => handleTabChange(t.id)}
                                      className={`group shrink-0 inline-flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-pill text-[13px] sm:text-sm font-semibold transition-colors duration-150 ease-nt whitespace-nowrap ${
                                          activeTab === t.id
                                              ? 'bg-ink text-white'
                                              : 'text-body hover:text-ink hover:bg-chip'
                                      }`}
                                  >
                                      <span className={`font-mono text-[11px] font-medium tabular-nums ${activeTab === t.id ? 'text-white/60' : 'text-gray-brand group-hover:text-ink'}`}>
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
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-brand font-medium">
                          {TABS.find(t => t.id === activeTab)?.label}
                      </span>
                  </div>
                  {renderTabPanel()}
                  {renderTabPager()}
              </div>
          </div>

          {/* FINAL CTA - the page's one ink chapter break */}
          <section className="nt-ink-section py-20 md:py-28">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
                  <h2 className="text-4xl sm:text-5xl font-semibold text-paper tracking-tightest leading-[1.05] mb-5">
                      Ready when you are.
                  </h2>
                  <p className="text-lg text-paper/80 max-w-2xl mx-auto leading-relaxed mb-10">
                      Questions, comments, or ready to move to the Letter of Intent? Drop us a line and we'll
                      send the next step within 24 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md sm:max-w-none mx-auto">
                      <button
                          onClick={() => setShowBooking(true)}
                          className="nt-btn-primary-inverse nt-btn-hero"
                      >
                          Continue the conversation <ArrowRight size={16} strokeWidth={1.8} className="nt-arrow" />
                      </button>
                      <button
                          onClick={() => setShowReportModal(true)}
                          className="nt-btn-ghost-inverse nt-btn-hero"
                      >
                          See a sample profile
                      </button>
                  </div>
              </div>
          </section>

      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-line bg-paper">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
                  <div className="col-span-2 sm:col-span-1">
                      <Logo className="opacity-90 mb-4" size="small" />
                      <p className="text-sm text-gray-brand leading-relaxed">
                          An integration proposal for IMG Academy.
                      </p>
                  </div>
                  <div>
                      <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-4">Proposal</p>
                      <ul className="space-y-2.5 text-sm">
                          <li><button onClick={() => handleTabChange('coaches')} className="text-body hover:text-ink transition-colors">For college coaches</button></li>
                          <li><button onClick={() => handleTabChange('elevate')} className="text-body hover:text-ink transition-colors">The Elevate Play</button></li>
                          <li><button onClick={() => handleTabChange('academy-plus')} className="text-body hover:text-ink transition-colors">The Academy+ Funnel</button></li>
                          <li><button onClick={() => handleTabChange('economics')} className="text-body hover:text-ink transition-colors">Economics</button></li>
                          <li><button onClick={() => handleTabChange('activation')} className="text-body hover:text-ink transition-colors">Activation &amp; rollout</button></li>
                      </ul>
                  </div>
                  <div>
                      <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-4">Explore</p>
                      <ul className="space-y-2.5 text-sm">
                          <li><button onClick={() => setShowTestDrive(true)} className="text-body hover:text-ink transition-colors">Sample assessments</button></li>
                          <li><button onClick={() => setShowReportModal(true)} className="text-body hover:text-ink transition-colors">Sample profile</button></li>
                      </ul>
                  </div>
                  <div>
                      <p className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em] mb-4">Talk to us</p>
                      <ul className="space-y-2.5 text-sm">
                          <li><button onClick={() => setShowBooking(true)} className="text-body hover:text-ink transition-colors">Continue the conversation</button></li>
                          <li><a href="https://calendly.com/ntangible/30min" target="_blank" rel="noopener noreferrer" className="text-body hover:text-ink transition-colors">Contact NTangible</a></li>
                      </ul>
                  </div>
              </div>
              <div className="border-t border-line pt-6 mb-5 flex items-center justify-center sm:justify-start gap-3">
                  <img src="/ysbr.png" alt="Youth Sports Business Report" className="h-8 w-auto object-contain opacity-90" />
                  <span className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.16em]">
                      2026 Rising Star Award &middot; Youth Sports Business Report
                  </span>
              </div>
              <div className="border-t border-line pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 font-mono text-[11px] text-gray-brand uppercase tracking-[0.16em]">
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
