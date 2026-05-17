
import React, { useState, useEffect, useRef } from 'react';
import {
    Activity, Brain, ArrowRight, Check, X, FileText, Monitor, ShieldCheck,
    Megaphone, RefreshCw, Mail, Database, Tv, Building2, Send, Trophy, LayoutGrid,
    Target, ClipboardList, Search, UserCheck
} from 'lucide-react';
import { ViewType } from '../types';
import { TestDriveModal } from './TestDriveModal';
import ClutchAssessment from './ClutchAssessment';
import NTerpretAssessment from './NTerpretAssessment';
import TrustedTeams from './TrustedTeams';

interface LandingPageProps {
  onEnter: (orgName: string, initialView?: ViewType) => void;
}

// --- CO-BRANDED LOGO ---
const Logo = ({ className = "", size = "normal" }: { className?: string, size?: "small" | "normal" }) => {
    const height = size === "small" ? "h-7" : "h-9";
    const textSize = size === "small" ? "text-xs" : "text-sm";

    return (
        <div className={`flex items-center gap-2.5 select-none ${className}`}>
            <span className={`${textSize} font-light text-white tracking-[0.25em] uppercase`}>NTangible</span>
            <span className="text-white/25 text-lg font-light leading-none">&times;</span>
            <img
                src="/IMG.png"
                alt="IMG Academy"
                className={`${height} w-auto object-contain`}
            />
        </div>
    );
};

// --- BOOKING MODAL ---
const BookingModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-5xl h-[85vh] bg-[#0f1115] border border-gray-800 rounded-2xl relative shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center bg-[#0f1115]">
                <h2 className="text-xl font-bold text-white">Book An Integration Call</h2>
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
    { min: 0,       max: 100_000,  price: 10, imgShare: 3, label: 'Entry',            tone: 'text-blue-400' },
    { min: 100_000, max: 250_000,  price: 8,  imgShare: 3, label: 'Scale',            tone: 'text-blue-400' },
    { min: 250_000, max: 500_000,  price: 7,  imgShare: 3, label: 'Platform',         tone: 'text-emerald-400' },
    { min: 500_000, max: Infinity, price: 6,  imgShare: 3, label: 'Full integration', tone: 'text-emerald-400' },
];

const MAX_PROFILES = 1_000_000;

const tierForVolume = (v: number): VolumeTier =>
    VOLUME_TIERS.find(t => v >= t.min && v < t.max) ?? VOLUME_TIERS[VOLUME_TIERS.length - 1];

const PricingCalculator = () => {
    const [profiles, setProfiles] = useState(150_000);

    const clamped = Math.max(0, Math.min(MAX_PROFILES, Number.isFinite(profiles) ? profiles : 0));
    const tier = tierForVolume(clamped);
    const imgRev = clamped * tier.imgShare;
    const ntangibleRev = clamped * (tier.price - tier.imgShare);

    const fmt = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
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
                    Per-athlete integration. Volume drops the price.
                </h2>
                <p className="text-lg text-gray-400 leading-relaxed">
                    Standard on every NCSA athlete profile. The more we ship, the cheaper per athlete &mdash;
                    IMG Academy's per-profile margin stays at $3 from day one. We compress on our side to make
                    the integration tomorrow.
                </p>
            </div>

            {/* Volume tier table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-10">
                {VOLUME_TIERS.map((t) => (
                    <div key={t.label} className="bg-[#070707] p-6 sm:p-7 flex flex-col">
                        <p className={`text-xs font-semibold uppercase tracking-wider ${t.tone} mb-3`}>{t.label}</p>
                        <p className="text-sm text-gray-500 tabular-nums mb-4">{fmtRange(t)} profiles / yr</p>
                        <p className="text-4xl sm:text-5xl font-semibold text-white tracking-tight tabular-nums mb-4">
                            ${t.price}
                        </p>
                        <div className="border-t border-white/5 pt-4 space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">IMG Academy</span>
                                <span className="text-white font-semibold tabular-nums">${t.imgShare}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">NTangible</span>
                                <span className="text-white font-semibold tabular-nums">${t.price - t.imgShare}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Why this shape */}
            <div className="bg-[#070707] border border-white/10 rounded-2xl p-6 sm:p-8 mb-10">
                <p className="text-sm font-medium text-blue-400 mb-3">Why this shape</p>
                <p className="text-base text-gray-300 leading-relaxed">
                    IMG's $3 share is flat across every tier &mdash; growth comes from volume, not from renegotiating rate.
                    NTangible's margin compresses from $7 to $3 as the integration deepens, in exchange for the certainty
                    of full per-athlete coverage across NCSA. At the floor, both sides earn the same per profile and
                    the program scales as fast as IMG wants to ship it.
                </p>
            </div>

            {/* Calculator card */}
            <div className="bg-[#070707] border border-white/10 rounded-2xl p-6 sm:p-10">
                <div className="mb-8">
                    <p className="text-sm text-gray-500 font-medium mb-1">Model it at scale</p>
                    <p className="text-base text-gray-400">Drag to set the annual profile volume across NCSA.</p>
                </div>

                {/* Slider */}
                <div className="mb-10">
                    <div className="flex items-end justify-between mb-3 gap-4">
                        <label className="text-sm font-medium text-gray-400">
                            Profiles / yr
                            <span className={`ml-2 ${tier.tone} font-semibold uppercase tracking-wider text-[11px]`}>
                                {tier.label} &middot; ${tier.price} ea
                            </span>
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={MAX_PROFILES}
                            value={clamped}
                            onChange={(e) => setProfiles(parseInt(e.target.value || '0', 10))}
                            className="w-32 sm:w-44 bg-black border border-white/10 rounded-lg px-3 py-2 text-right text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums focus:outline-none focus:border-blue-500"
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

                {/* Annual revenue to IMG - hero result */}
                <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-500/[0.08] to-transparent p-6 sm:p-8 mb-6">
                    <p className="text-sm font-medium text-blue-400 mb-2">Annual revenue to IMG Academy</p>
                    <p className="text-5xl sm:text-6xl font-semibold text-white tracking-tight tabular-nums mb-2">{fmt(imgRev)}</p>
                    <p className="text-sm text-gray-400 tabular-nums">
                        {clamped.toLocaleString('en-US')} profiles &times; ${tier.imgShare} per athlete
                    </p>
                </div>

                {/* Supporting breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <div className="bg-[#070707] p-5 sm:p-6">
                        <p className="text-sm font-medium text-blue-400 mb-2">IMG Academy share</p>
                        <p className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">{fmt(imgRev)}</p>
                        <p className="text-xs text-gray-500 mt-1 tabular-nums">{clamped.toLocaleString('en-US')} &times; ${tier.imgShare}</p>
                    </div>
                    <div className="bg-[#070707] p-5 sm:p-6">
                        <p className="text-sm font-medium text-blue-400 mb-2">NTangible share</p>
                        <p className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums">{fmt(ntangibleRev)}</p>
                        <p className="text-xs text-gray-500 mt-1 tabular-nums">{clamped.toLocaleString('en-US')} &times; ${tier.price - tier.imgShare}</p>
                    </div>
                </div>

                <p className="text-xs text-gray-600 mt-6 leading-relaxed">
                    Per-profile economics only. Doesn't reflect the 6-month retest cycle (effectively doubles
                    annual volume from a stable athlete base), SportsRecruits crossover into the same integration,
                    or international expansion through Elevate.
                </p>
            </div>
        </section>
    );
};

// --- IMG ACADEMY DIGITAL SURFACES ---
const SURFACES: { name: string; blurb: string }[] = [
    { name: 'NCSA', blurb: 'Standard on every athlete profile. Per-athlete pricing across the membership base &mdash; not an add-on, not a SKU families have to opt into.' },
    { name: 'SportsRecruits', blurb: 'Same integration extends across SR’s 400K-athlete club and HS audience. Adds volume, drops the per-profile price for IMG.' },
    { name: 'IMG Academy+', blurb: 'Low scores get flagged and routed straight to IMG Academy+ sports psychology sessions. Testing volume becomes coaching revenue.' },
    { name: 'Elevate & NGB channels', blurb: 'Same surface extends into federation deals (USA Water Polo, USA Lacrosse) and Elevate’s B2B-to-schools motion. Internationally portable as the deal scales.' },
];

const TwoWaysItWorks = () => (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20 sm:mb-24">
        <div className="mb-10 sm:mb-12 max-w-2xl">
            <p className="text-sm font-medium text-blue-400 mb-3">Two ways it works</p>
            <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                A standalone tool. And a lead-gen engine.
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
                One assessment, two integration surfaces inside IMG Academy. Sport-specific testing that ships
                across the full product suite &mdash; and a routing layer that turns every low score into a
                qualified lead for IMG Academy+ coaching.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-[#070707] p-7 sm:p-9">
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                    <Activity size={20} className="text-blue-400" />
                </div>
                <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest mb-2">Testing layer</p>
                <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3">
                    Sport-specific assessment across the suite.
                </h3>
                <p className="text-base text-gray-400 leading-relaxed">
                    Standalone testing layer that ships across NCSA, SportsRecruits, and IMG Academy+. Athletes test,
                    score, retest every six months &mdash; per-sport, per-position, with the granularity IMG's
                    cross-sport catalog doesn't carry today.
                </p>
            </div>
            <div className="bg-[#070707] p-7 sm:p-9">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                    <Megaphone size={20} className="text-emerald-400" />
                </div>
                <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest mb-2">Lead-gen engine</p>
                <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3">
                    Low scores route into IMG Academy+ sessions.
                </h3>
                <p className="text-base text-gray-400 leading-relaxed">
                    Every low-scoring profile flags a development opportunity. The system routes those families
                    straight into the IMG Academy+ sports psychology session funnel &mdash; turning every
                    assessment into a qualified lead for the existing $85&ndash;$100 coaching SKU.
                </p>
            </div>
        </div>
    </section>
);

const PartnerProperties = () => (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-20 sm:mb-24">
        <div className="mb-10 sm:mb-12 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
                <img src="/IMG.png" alt="IMG Academy" className="h-7 w-auto object-contain" />
                <p className="text-sm font-medium text-blue-400">Where it plugs in</p>
            </div>
            <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                Four surfaces. One integration.
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed">
                The profile slots directly into IMG Academy's existing digital product set &mdash; no new SKU to invent,
                no new operational lift. It extends what's already shipping.
            </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {SURFACES.map((s) => (
                <div key={s.name} className="bg-[#070707] p-5 sm:p-7 flex flex-col">
                    <p className="text-white text-base font-semibold mb-2">{s.name}</p>
                    <p className="text-gray-500 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: s.blurb }} />
                </div>
            ))}
        </div>
    </section>
);

// --- INSET TAB NAVIGATION ---
type TabId = 'offer' | 'assessments' | 'coaches' | 'economics' | 'distribution' | 'activation';

const TABS: { id: TabId; label: string }[] = [
    { id: 'offer', label: 'The Offer' },
    { id: 'assessments', label: 'The Assessments' },
    { id: 'coaches', label: "For College Coaches" },
    { id: 'economics', label: 'The Economics' },
    { id: 'distribution', label: 'Distribution' },
    { id: 'activation', label: 'Activation & Rollout' },
];

// --- MAIN LANDING PAGE ---
const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const videoSectionRef = useRef<HTMLElement>(null);
  const tabSectionRef = useRef<HTMLDivElement>(null);

  const [showTestDrive, setShowTestDrive] = useState(false);
  const [showClutchReport, setShowClutchReport] = useState(false);
  const [showNterpretReport, setShowNterpretReport] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('offer');

  useEffect(() => {
    setIsLoaded(true);
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
      case 'offer':
        return (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
              <div className="mb-12 sm:mb-16 max-w-2xl">
                  <p className="text-sm font-medium text-blue-400 mb-3">The offer</p>
                  <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                      Sport-specific. Position-specific. White-labeled.
                  </h2>
                  <p className="text-lg text-gray-400 leading-relaxed">
                      NTangible builds and operates a sport-by-sport mental performance profile that extends IMG Academy's
                      High Performance Mindset framework &mdash; Commitment, Confidence, Focus, Resilience, Handling Pressure &mdash;
                      with the position-level granularity the cross-sport digital catalog doesn't carry today. Hosted under
                      IMG Academy's brand, paired with a free coaches' dashboard that makes recruiting fit measurable.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="bg-[#070707] p-7 sm:p-9">
                      <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                          <ShieldCheck size={20} className="text-blue-400" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3">IMG Academy Mental Scouting Profile</h3>
                      <p className="text-base text-gray-400 leading-relaxed mb-5">
                          The sport-by-sport, position-level extension of IMG's HPM framework. Lives inside the
                          IMG Academy+ surfaces athletes already use &mdash; complements the in-house MPA on the IDP side,
                          ships sport-specific instruments NCSA and SportsRecruits don't have today.
                      </p>
                      <ul className="space-y-2.5 border-t border-white/5 pt-5">
                          <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> Full Clutch Factor&trade; + NTerpret&trade; reports</li>
                          <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> Personalized drills to improve performance</li>
                          <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> Verified recruiting status inside the IMG Academy dashboard</li>
                      </ul>
                  </div>
                  <div className="bg-[#070707] p-7 sm:p-9">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                          <Monitor size={20} className="text-emerald-400" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3">IMG Academy Collegiate Dashboard</h3>
                      <p className="text-base text-gray-400 leading-relaxed mb-5">
                          A free, web-based portal college coaches log into to discover IMG Academy talent - and see which
                          athletes align with their coaching style.
                      </p>
                      <ul className="space-y-2.5 border-t border-white/5 pt-5">
                          <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-emerald-400 shrink-0 mt-0.5" /> Free access for every college coach across properties</li>
                          <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-emerald-400 shrink-0 mt-0.5" /> Searchable leaderboards of IMG Academy athletes</li>
                      </ul>
                  </div>
              </div>

          </section>
        );

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

              {/* METHODOLOGY / TED TALK */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                      <div className="lg:col-span-5">
                          <p className="text-sm font-medium text-blue-400 mb-3">The science</p>
                          <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-5">
                              The TED Talk behind the method.
                          </h2>
                          <p className="text-lg text-gray-400 leading-relaxed mb-4">
                              NTangible's assessments are grounded in research on how athletes actually perform under pressure
                              - the work that started with this TED Talk.
                          </p>
                          <p className="text-base text-gray-500 leading-relaxed">
                              Watch the framework that powers every NTerpret Mental Scouting Report and Clutch Factor Assessment.
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

              {/* PRODUCT TOUR VIDEO */}
              <section ref={videoSectionRef} className="max-w-5xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-8 max-w-2xl">
                      <p className="text-sm font-medium text-blue-400 mb-3">Product tour</p>
                      <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05]">
                          See what athletes and coaches will use.
                      </h2>
                  </div>

                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
                      <iframe
                          width="100%"
                          height="100%"
                          src="https://www.youtube.com/embed/6NS4CVbeZQg?autoplay=0&controls=1&rel=0&modestbranding=1"
                          title="Product Tour"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                      ></iframe>
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
                      <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full mb-5">
                          <Target size={13} className="text-emerald-400" />
                          <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest">More than testing</span>
                      </div>
                      <h2 className="text-4xl sm:text-6xl font-semibold text-white tracking-tight leading-[1.02] mb-6">
                          Coaches log in. <span className="text-gray-500">Alignment runs against every NCSA and SportsRecruits profile.</span>
                      </h2>
                      <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
                          NTangible isn't just an assessment. College coaches integrate directly into the platform
                          and run the Coach&ndash;Player Alignment Index against any NCSA or SportsRecruits profile &mdash;
                          a free, always-on dashboard that answers <span className="text-white font-medium">will this athlete fit my system</span>{' '}
                          before the first call.
                      </p>
                  </div>
              </section>

              {/* DASHBOARD MOCKUP PLACEHOLDER */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#070707] shadow-[0_30px_80px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
                      <img
                          src="/Recruitingdashboardmockup.png"
                          alt="IMG Academy Collegiate Dashboard - coach view"
                          className="w-full h-auto block"
                      />
                  </div>
                  <p className="text-xs text-gray-600 mt-4 text-center sm:text-left">
                      One login. Every verified IMG Academy athlete, filterable by sport, position, state, grad year, and fit.
                  </p>
              </section>

              {/* WHAT THE COACH GETS */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-10 sm:mb-12 max-w-2xl">
                      <p className="text-sm font-medium text-emerald-400 mb-3">The coach integration</p>
                      <h3 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-[1.08] mb-4">
                          Free dashboard. Alignment scoring on every NCSA + SR profile.
                      </h3>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          College coaches log in for free. The Coach&ndash;Player Alignment Index runs against every
                          NCSA and SportsRecruits profile in the database &mdash; turning the recruiting database
                          IMG already owns into a scored, filterable, fit-aware prospect pool.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      <div className="bg-[#070707] p-7 sm:p-9">
                          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                              <Monitor size={20} className="text-emerald-400" />
                          </div>
                          <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest mb-2">What the coach gets</p>
                          <h4 className="text-xl font-semibold text-white tracking-tight mb-4">A live, alignment-scored prospect pool</h4>
                          <ul className="space-y-2.5">
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-emerald-400 shrink-0 mt-0.5" /> Free login from any laptop &mdash; alignment updates the moment a profile retests</li>
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-emerald-400 shrink-0 mt-0.5" /> Every NCSA and SportsRecruits athlete, searchable by sport, position, state, grad year</li>
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-emerald-400 shrink-0 mt-0.5" /> Clutch Factor + Coach&ndash;Player Alignment Index on every athlete card</li>
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-emerald-400 shrink-0 mt-0.5" /> Year-round &mdash; no event dependency, no rebuilding the list every weekend</li>
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-emerald-400 shrink-0 mt-0.5" /> Shareable with the full staff in one link</li>
                          </ul>
                      </div>
                      <div className="bg-[#070707] p-7 sm:p-9">
                          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                              <Activity size={20} className="text-blue-400" />
                          </div>
                          <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest mb-2">What IMG gets</p>
                          <h4 className="text-xl font-semibold text-white tracking-tight mb-4">Stickier coaches, stickier families</h4>
                          <ul className="space-y-2.5">
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> A signal college coaches can't get anywhere else &mdash; pulls them into NCSA/SR instead of competing platforms</li>
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> Higher coach engagement per profile = higher commit conversion = the metric NCSA already sells on</li>
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> Every alignment view is a touchpoint NCSA can surface to the family</li>
                              <li className="text-[15px] text-gray-300 leading-relaxed flex gap-2.5"><Check size={17} className="text-blue-400 shrink-0 mt-0.5" /> Differentiates NCSA + SR against 247, On3, Rivals &mdash; they have stats; you'd have fit</li>
                          </ul>
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
                      <p className="text-lg text-gray-400 leading-relaxed">
                          Three views, one workflow - the path every coach walks from first scroll to final decision.
                      </p>
                  </div>

                  <div>
                      {[
                          {
                              step: '01',
                              eyebrow: 'Discover',
                              title: 'Clutch Factor Leaderboard',
                              blurb: 'The public ranking every coach lands on first. Every NTangible-verified athlete in the IMG Academy database, filterable by sport, position, state, grad year, GPA, and height/weight - thousands narrowed to a short list in seconds.',
                              src: '/collegeleaderboard.png',
                              alt: 'Clutch Factor Leaderboard - public ranking of every assessed athlete',
                          },
                          {
                              step: '02',
                              eyebrow: 'Shortlist',
                              title: 'My Top Targets',
                              blurb: 'The Trust Anchor view (Alignment ≥ 62.5% & Clutch Factor ≥ 750) - the coach’s personal board, ranked by fit to their program. Underneath every name: how each athlete learns, leads, communicates, and competes under pressure - the stuff a stat line never tells you.',
                              src: '/collegetoptargets.png',
                              alt: 'My Top Targets - athletes ranked by Alignment for the coach’s program',
                          },
                          {
                              step: '03',
                              eyebrow: 'Decide',
                              title: 'My Watchlist',
                              blurb: 'Clutch Factor, NTerpret, highlight tape, and the staff’s in-person observations all live on the same card - the dashboard is the workflow, shareable with assistants and analysts in one link.',
                              src: '/collegenotes.png',
                              alt: 'My Watchlist - private scouting log tied to each athlete profile',
                          },
                      ].map((view, idx, arr) => (
                          <div key={view.step}>
                              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 sm:p-10 lg:p-12">
                                  <div className="flex items-center gap-4 mb-8 sm:mb-10">
                                      <div className="flex items-center justify-center w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/30 shrink-0">
                                          <span className="text-emerald-300 text-sm font-semibold tabular-nums">{view.step}</span>
                                      </div>
                                      <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest">{view.eyebrow}</span>
                                      <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/20 to-transparent ml-2" />
                                  </div>

                                  <div className="max-w-2xl mb-8 sm:mb-12">
                                      <h4 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-tight mb-4">{view.title}</h4>
                                      <p className="text-base sm:text-lg text-gray-400 leading-relaxed">{view.blurb}</p>
                                  </div>

                                  <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#070707] shadow-[0_30px_80px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
                                      <img
                                          src={view.src}
                                          alt={view.alt}
                                          className="w-full h-auto block"
                                      />
                                  </div>
                              </div>
                              {idx < arr.length - 1 && (
                                  <div className="flex justify-center py-16 sm:py-20">
                                      <div className="flex flex-col items-center gap-3">
                                          <div className="h-12 w-px bg-gradient-to-b from-transparent to-emerald-500/40" />
                                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                                          <div className="h-12 w-px bg-gradient-to-b from-emerald-500/40 to-transparent" />
                                      </div>
                                  </div>
                              )}
                          </div>
                      ))}
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

      case 'economics':
        return (
          <>
              <PricingCalculator />

              {/* MARQUEE: DIRECTED AD-SPEND / REINVESTMENT ENGINE */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-500/[0.10] via-blue-500/[0.03] to-transparent p-6 sm:p-12">
                      <div className="max-w-2xl mb-10 sm:mb-12">
                          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full mb-4">
                              <Megaphone size={13} className="text-blue-400" />
                              <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest">The reinvestment engine</span>
                          </div>
                          <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                              Every $50K in revenue buys IMG Academy $10K of reach.
                          </h2>
                          <p className="text-lg text-gray-300 leading-relaxed">
                              For every <span className="text-white font-semibold">$50,000</span> in gross program revenue, NTangible puts
                              {' '}<span className="text-white font-semibold">$10,000</span> back into a directed ad campaign run through IMG Academy.
                              The program funds its own growth.
                          </p>
                      </div>

                      {/* Revenue-increment ladder */}
                      <p className="text-sm font-medium text-blue-400 mb-3">The increment ladder</p>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-10">
                          {[
                              { rev: '$50K', spend: '$10K' },
                              { rev: '$150K', spend: '$30K' },
                              { rev: '$500K', spend: '$100K' },
                              { rev: '$1M', spend: '$200K' },
                          ].map((step) => (
                              <div key={step.rev} className="bg-[#070707] p-5 sm:p-6">
                                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Gross revenue</p>
                                  <p className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums mb-4">{step.rev}</p>
                                  <div className="flex items-center gap-2 text-blue-400">
                                      <ArrowRight size={15} className="shrink-0" />
                                      <p className="text-xl sm:text-2xl font-semibold tracking-tight tabular-nums">{step.spend}</p>
                                  </div>
                                  <p className="text-[11px] text-gray-500 mt-1">directed ad spend</p>
                              </div>
                          ))}
                      </div>

                      {/* The flywheel */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                          <div className="rounded-2xl border border-white/10 bg-[#070707] p-6">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold mb-4">1</span>
                              <h4 className="text-white text-base font-semibold mb-2">Profiles sell</h4>
                              <p className="text-gray-500 text-sm leading-relaxed">Every $10 profile across IMG Academy channels stacks toward the next $50K increment.</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-[#070707] p-6">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold mb-4">2</span>
                              <h4 className="text-white text-base font-semibold mb-2">NTangible reinvests</h4>
                              <p className="text-gray-500 text-sm leading-relaxed">Each increment triggers $10K of directed ad spend, run through IMG Academy.</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-[#070707] p-6">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-bold mb-4">3</span>
                              <h4 className="text-white text-base font-semibold mb-2">Reach compounds</h4>
                              <p className="text-gray-500 text-sm leading-relaxed">More reach drives more profiles - which triggers the next campaign. The loop tightens.</p>
                          </div>
                      </div>

                      <div className="mt-8 flex items-center gap-2 text-blue-300/80">
                          <RefreshCw size={14} className="shrink-0" />
                          <p className="text-sm">The more the program earns, the harder NTangible markets IMG Academy.</p>
                      </div>

                      {/* AD SPEND FLEXIBILITY */}
                      <div className="mt-10 rounded-2xl border border-white/10 bg-[#070707] p-6 sm:p-8">
                          <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest mb-3">
                              IMG Academy's call on where it goes
                          </p>
                          <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-tight mb-3">
                              The ad spend isn't locked to a channel - it's a marketing budget IMG Academy deploys.
                          </h3>
                          <p className="text-base text-gray-400 leading-relaxed mb-6">
                              The $10K-per-increment commitment is dollars NTangible is putting on the table. IMG Academy
                              decides how to spend them - whatever moves the needle hardest at that moment.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                              <div className="bg-[#0a0a0a] p-5 sm:p-6">
                                  <p className="text-white text-base font-semibold mb-2">General marketing fund</p>
                                  <p className="text-gray-500 text-sm leading-relaxed">
                                      Roll it into IMG Academy's broader paid media, owned-channel campaigns, or event
                                      promotion - whatever the marketing team is already pushing.
                                  </p>
                              </div>
                              <div className="bg-[#0a0a0a] p-5 sm:p-6">
                                  <p className="text-white text-base font-semibold mb-2">Redirect to strategic partners</p>
                                  <p className="text-gray-500 text-sm leading-relaxed">
                                      Or aim it at a flagship partner like <span className="text-white font-medium">Publix</span>
                                      {' '}to deepen that integration - co-branded campaigns, in-store activations, joint
                                      promotions that strengthen the relationship IMG Academy cares about most.
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

              {/* RECURRING REVENUE */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="bg-[#070707] border border-white/10 rounded-2xl p-7 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                      <div className="lg:col-span-7">
                          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full mb-5">
                              <RefreshCw size={13} className="text-blue-400" />
                              <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest">Recurring revenue funnel</span>
                          </div>
                          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-[1.1] mb-4">
                              Every profile resets the clock.
                          </h2>
                          <p className="text-lg text-gray-400 leading-relaxed">
                              Every 6 months, NTangible sends an automatic retest email so athletes can update their Clutch Factor
                              score. Each retest is another $10 profile - another $2 to IMG Academy and $1 to the partner.
                          </p>
                      </div>
                      <div className="lg:col-span-5">
                          <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                              <div className="bg-[#0a0a0a] p-5">
                                  <p className="text-3xl font-semibold text-white tracking-tight tabular-nums mb-1">6 mo</p>
                                  <p className="text-sm text-gray-500">Automatic retest cadence</p>
                              </div>
                              <div className="bg-[#0a0a0a] p-5">
                                  <p className="text-3xl font-semibold text-white tracking-tight tabular-nums mb-1">2&times;+</p>
                                  <p className="text-sm text-gray-500">Profiles per athlete, per year</p>
                              </div>
                              <div className="bg-[#0a0a0a] p-5">
                                  <p className="text-3xl font-semibold text-blue-400 tracking-tight tabular-nums mb-1">$3</p>
                                  <p className="text-sm text-gray-500">To IMG Academy + partner, per retest</p>
                              </div>
                              <div className="bg-[#0a0a0a] p-5">
                                  <p className="text-3xl font-semibold text-white tracking-tight tabular-nums mb-1">$0</p>
                                  <p className="text-sm text-gray-500">Added cost to acquire the retest</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>

              {/* INTEGRATION & ACTIVATION */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-12 sm:mb-16 max-w-2xl">
                      <p className="text-sm font-medium text-blue-400 mb-3">The commitment</p>
                      <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                          What NTangible brings to the table.
                      </h2>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          Beyond the per-profile revenue share, NTangible commits to securing official-partner status and
                          reinvesting in IMG Academy's reach.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      <div className="bg-[#070707] p-7 sm:p-8">
                          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                              <Trophy size={20} className="text-blue-400" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-2">Official partner sponsorship</h3>
                          <p className="text-base text-gray-400 leading-relaxed">
                              NTangible commits to an annual sponsorship fee to secure "Official Partner" rights with IMG Academy.
                          </p>
                      </div>
                      <div className="bg-[#070707] p-7 sm:p-8">
                          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                              <Megaphone size={20} className="text-blue-400" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-2">Directed ad-spend campaigns</h3>
                          <p className="text-base text-gray-400 leading-relaxed">
                              For every $50,000 in gross program revenue, NTangible directs $10,000 into an ad-spend campaign run
                              through IMG Academy - revenue compounds back into reach.
                          </p>
                      </div>
                      <div className="bg-[#070707] p-7 sm:p-8">
                          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                              <Database size={20} className="text-blue-400" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-2">Front-load data agreement</h3>
                          <p className="text-base text-gray-400 leading-relaxed">
                              Initial athlete data access from partners to seed the platform - structured as an annual
                              agreement to keep driving usage.
                          </p>
                      </div>
                  </div>
              </section>
          </>
        );

      case 'distribution':
        return (
          <>
              {/* DISTRIBUTION - INSIDE THE DIGITAL PRODUCTS */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-12 sm:mb-16 max-w-2xl">
                      <p className="text-sm font-medium text-blue-400 mb-3">Distribution</p>
                      <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                          Inside the digital products. Live in a quarter.
                      </h2>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          The profile ships inside the products IMG Academy already operates &mdash; no field staff, no clipboards,
                          no new SKU to build. The integration points are already there.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                      <div className="bg-[#070707] p-6 sm:p-7">
                          <Send size={20} className="text-blue-400 mb-4" />
                          <h3 className="text-white text-base font-semibold mb-2">Inside Academy+ Essentials</h3>
                          <p className="text-gray-500 text-sm leading-relaxed">Surfaced inside the Essentials bundle that already ships free Y1 with every NCSA membership. Sport-specific where the catalog is cross-sport.</p>
                      </div>
                      <div className="bg-[#070707] p-6 sm:p-7">
                          <Mail size={20} className="text-blue-400 mb-4" />
                          <h3 className="text-white text-base font-semibold mb-2">In the NCSA sales motion</h3>
                          <p className="text-gray-500 text-sm leading-relaxed">Free family-facing artifact the recruiting specialist sends between the first call and the conference call. Built to lift paid-tier conversion.</p>
                      </div>
                      <div className="bg-[#070707] p-6 sm:p-7">
                          <Building2 size={20} className="text-blue-400 mb-4" />
                          <h3 className="text-white text-base font-semibold mb-2">In the SportsRecruits feed</h3>
                          <p className="text-gray-500 text-sm leading-relaxed">Crossover hook into the 400K-athlete club/HS audience. The mechanism that pulls SR users into developmental Academy+ subs.</p>
                      </div>
                      <div className="bg-[#070707] p-6 sm:p-7">
                          <Tv size={20} className="text-blue-400 mb-4" />
                          <h3 className="text-white text-base font-semibold mb-2">In NGB & Elevate channels</h3>
                          <p className="text-gray-500 text-sm leading-relaxed">Same surface for federation deals (USA Water Polo, USA Lacrosse) and Elevate's B2B-to-schools motion. Internationally portable.</p>
                      </div>
                  </div>
              </section>

              {/* DATA & TRUST */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                      <div className="lg:col-span-5">
                          <p className="text-sm font-medium text-blue-400 mb-3">Data &amp; trust</p>
                          <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-5">
                              IMG Academy-branded. IMG Academy-controlled.
                          </h2>
                          <p className="text-lg text-gray-400 leading-relaxed">
                              The profile carries IMG Academy's name and lives on IMG Academy's official database. NTangible operates
                              it - IMG Academy owns the relationship with its athletes.
                          </p>
                      </div>
                      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                          <div className="bg-[#070707] p-6">
                              <p className="text-white text-base font-semibold mb-2">Hosted on IMG Academy's database</p>
                              <p className="text-gray-500 text-sm leading-relaxed">Verified profiles sit on the official campus database, branded as a IMG Academy product.</p>
                          </div>
                          <div className="bg-[#070707] p-6">
                              <p className="text-white text-base font-semibold mb-2">COPPA-aligned</p>
                              <p className="text-gray-500 text-sm leading-relaxed">For athletes 13-18, with parental consent built into onboarding for every athlete.</p>
                          </div>
                          <div className="bg-[#070707] p-6">
                              <p className="text-white text-base font-semibold mb-2">Opt-out anytime</p>
                              <p className="text-gray-500 text-sm leading-relaxed">Families can remove an athlete's profile at any time. We delete everything we hold on them.</p>
                          </div>
                          <div className="bg-[#070707] p-6">
                              <p className="text-white text-base font-semibold mb-2">Growth, not diagnosis</p>
                              <p className="text-gray-500 text-sm leading-relaxed">We measure how athletes compete and handle pressure - not personality or clinical labels.</p>
                          </div>
                      </div>
                  </div>
              </section>
          </>
        );

      case 'activation':
        return (
          <>
              {/* 60-DAY COMMITMENT */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-12 sm:mb-16 max-w-2xl">
                      <p className="text-sm font-medium text-blue-400 mb-3">The commitment</p>
                      <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                          Signed agreement. 60 days. Every sport.
                      </h2>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          With a signed agreement, NTangible delivers a v1 assessment for every sport NCSA and
                          SportsRecruits offer within 60 days. 9 sports are live today. The rest take roughly
                          two days each on our backend &mdash; the calendar is the whole differentiator.
                      </p>
                  </div>

                  <div className="bg-gradient-to-b from-blue-500/[0.08] to-transparent border border-blue-500/30 rounded-2xl p-7 sm:p-10 mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                          <div>
                              <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest mb-3">Sport coverage timeline</p>
                              <p className="text-6xl sm:text-7xl font-semibold text-white tracking-tight leading-none mb-3 tabular-nums">60 days</p>
                              <p className="text-lg text-gray-300 leading-relaxed">
                                  from signature to <span className="text-white font-medium">every NCSA and SportsRecruits sport, live</span>
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
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#070707] p-6 sm:p-7">
                      <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                          <span className="text-white font-medium">30-day exit. Sport buildout on us.</span> If the
                          pilot underperforms the agreed metrics, there's no obligation to scale and no cost to
                          IMG for sports we built during the integration window. The risk sits on our side of
                          the table, not yours.
                      </p>
                  </div>
              </section>

              {/* INTAKE / FIRST-PARTY DATA */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-12 sm:mb-16 max-w-3xl">
                      <p className="text-sm font-medium text-emerald-400 mb-3">Pre-assessment intake</p>
                      <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                          First-party data on every athlete that takes the assessment.
                      </h2>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          Every NTangible assessment opens with a short intake module &mdash; co-designed with
                          IMG Academy &mdash; that turns every athlete who takes the test into a structured,
                          first-party record IMG owns alongside the NCSA and SportsRecruits profile.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-10 sm:mb-12">
                      <div className="lg:col-span-5 bg-gradient-to-b from-blue-500/[0.07] to-transparent border border-blue-500/25 rounded-2xl p-7 sm:p-9">
                          <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest mb-3">
                              Why it matters
                          </p>
                          <p className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-tight mb-4">
                              The same field set across NCSA, SportsRecruits, and IMG Academy+.
                          </p>
                          <p className="text-base text-gray-400 leading-relaxed">
                              One intake schema, structured to feed every downstream system. Powers personalized
                              outreach, sport-specific content surfacing in Academy+, and the routing logic that
                              sends low-scoring athletes to IMG Academy+ coaching sessions.
                          </p>
                      </div>

                      <div className="lg:col-span-7 bg-[#070707] border border-white/10 rounded-2xl p-7 sm:p-9">
                          <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest mb-4">
                              What the intake captures
                          </p>
                          <p className="text-base text-gray-400 leading-relaxed mb-6">
                              A 60-90 second module gated in front of every assessment. Required to unlock the
                              profile &mdash; completion rate sits near 100%, not the 5&ndash;15% of an optional survey.
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                              {[
                                  { label: 'Identity', detail: 'Athlete + parent/guardian name, age, grade' },
                                  { label: 'Geography', detail: 'Home city, state, travel radius, club home base' },
                                  { label: 'Sport profile', detail: 'Primary sport, positions, level, team affiliations' },
                                  { label: 'Recruiting status', detail: 'Grad year, current offers, target divisions, commit timeline' },
                                  { label: 'Reach', detail: 'Parent email + mobile, opt-ins, communication preferences' },
                                  { label: 'Development signals', detail: 'Prior coaching, areas of focus, openness to IMG Academy+ sessions' },
                              ].map((row) => (
                                  <div key={row.label} className="flex gap-3">
                                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                      <div>
                                          <p className="text-white text-sm font-semibold mb-0.5">{row.label}</p>
                                          <p className="text-gray-500 text-sm leading-snug">{row.detail}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#070707] p-6 sm:p-7">
                      <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                          <span className="text-white font-medium">IMG defines the fields; IMG owns the data.</span>{' '}
                          NTangible operates the intake inside the assessment flow &mdash; records land in IMG's
                          database, branded as an IMG product, governed by IMG's privacy posture.
                      </p>
                  </div>
              </section>

              <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-24 sm:mb-32">
                  <div className="mb-12 sm:mb-16 max-w-2xl">
                      <p className="text-sm font-medium text-blue-400 mb-3">The rollout</p>
                      <h2 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.05] mb-4">
                          Seed the NCSA database. Then open coach access.
                      </h2>
                      <p className="text-lg text-gray-400 leading-relaxed">
                          NTangible seeds the NCSA + SportsRecruits database with verified profiles before the
                          paid rollout, so the alignment-scored prospect pool has real depth the day college
                          coaches log in.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
                      <div className="bg-[#070707] border border-white/10 rounded-2xl p-7 sm:p-9">
                          <div className="flex items-baseline gap-3 mb-4">
                              <span className="text-blue-400 text-sm font-semibold tabular-nums">Phase 1</span>
                              <span className="text-sm text-gray-500 font-medium">Seed</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3">Pre-fill the NCSA + SR database</h3>
                          <p className="text-base text-gray-400 leading-relaxed">
                              NTangible runs free testing for the pilot sport's <span className="text-white font-medium">top NCSA + SportsRecruits athletes</span>{' '}
                              before paid rollout &mdash; alignment-scored profiles ready to surface to coaches on day one.
                          </p>
                      </div>
                      <div className="bg-[#070707] border border-white/10 rounded-2xl p-7 sm:p-9">
                          <div className="flex items-baseline gap-3 mb-4">
                              <span className="text-emerald-400 text-sm font-semibold tabular-nums">Phase 2</span>
                              <span className="text-sm text-gray-500 font-medium">Open</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-3">Open the coach dashboard</h3>
                          <p className="text-base text-gray-400 leading-relaxed">
                              Free dashboard access for <span className="text-white font-medium">every college coach already in the NCSA + SR network</span>.
                              Coach engagement pulls families into paid profiles &mdash; the flywheel starts.
                          </p>
                      </div>
                  </div>

                  {/* PHASE 1 OUTPUT - SAMPLE LEADERBOARDS */}
                  <div>
                      <div className="flex items-baseline justify-between mb-5 flex-wrap gap-2">
                          <p className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest">
                              Phase 1 output &middot; sample
                          </p>
                          <p className="text-sm text-gray-500">
                              Auto-generated, co-branded per partner - ready to publish on day one.
                          </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#070707] shadow-[0_30px_80px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
                              <img
                                  src="/clutch-factor-top10-slide1.png"
                                  alt="Clutch Factor leaderboard - top 3 performers"
                                  className="w-full h-auto block"
                              />
                          </div>
                          <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#070707] shadow-[0_30px_80px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
                              <img
                                  src="/clutch-factor-top10-slide2.png"
                                  alt="Clutch Factor leaderboard - ranks 4 through 10"
                                  className="w-full h-auto block"
                              />
                          </div>
                      </div>
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
                      Book a call <ArrowRight size={15} />
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
                  Book a call
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
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] mb-8 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                  <span className="inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                  <span className="text-[11px] font-medium text-gray-300 tracking-wide">Partnership Proposal &middot; NTangible &times; IMG Academy</span>
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight mb-6 leading-[1.02] text-white">
                  A mental performance score for <span className="text-blue-400">every NCSA athlete.</span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Sport-specific testing across NCSA and SportsRecruits. Standalone tool on one side &mdash;
                  the lead-gen engine that routes low scores into IMG Academy+ sports psychology sessions on the other.
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
                    Book an integration call
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

              {/* Recruiting signal stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-2xl overflow-hidden text-left max-w-3xl mx-auto">
                  <div className="bg-[#070707] p-6 sm:p-7">
                      <p className="text-3xl sm:text-4xl font-semibold text-blue-400 tracking-tight mb-2 tabular-nums">2&times;</p>
                      <p className="text-white text-sm sm:text-base font-semibold mb-1">More likely to commit D1</p>
                      <p className="text-gray-500 text-sm leading-relaxed">Athletes scoring above 750 on the Clutch Factor commit to Division I programs at twice the rate of athletes below the threshold.</p>
                  </div>
                  <div className="bg-[#070707] p-6 sm:p-7">
                      <p className="text-3xl sm:text-4xl font-semibold text-blue-400 tracking-tight mb-2 tabular-nums">73%</p>
                      <p className="text-white text-sm sm:text-base font-semibold mb-1">All-American or All-Conference</p>
                      <p className="text-gray-500 text-sm leading-relaxed">Of collegiate athletes scoring above 800, 73% are named All-American or All-Conference selections. The signal college coaches don't have today.</p>
                  </div>
              </div>
          </section>

          {/* SOCIAL PROOF / TRUSTED TEAMS TICKER */}
          <div className="w-full mb-16 sm:mb-20">
              <TrustedTeams />
          </div>

          {/* TWO WAYS IT WORKS */}
          <TwoWaysItWorks />

          {/* IMG ACADEMY DIGITAL SURFACES */}
          <PartnerProperties />

          {/* INSET TABBED SECTION */}
          <div className="mb-24 sm:mb-32">
              {/* Section navigator prompt */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-5 sm:mb-7">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-3">
                      <LayoutGrid size={13} className="text-blue-400" />
                      <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-widest">Explore the proposal</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-1.5">
                      Click through each section.
                  </h2>
                  <p className="text-base text-gray-400 leading-relaxed">
                      Pick a tab below - the content swaps in place, so there's no endless scrolling.
                  </p>
              </div>

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
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 flex items-center gap-3">
                      <img src="/IMG.png" alt="IMG Academy" className="h-6 w-auto object-contain" />
                      <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-semibold">
                          IMG Academy &middot; {TABS.find(t => t.id === activeTab)?.label}
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
                      Let's make it official.
                  </h2>
                  <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
                      We'll walk through the integration, the rollout plan, and the numbers behind the IMG Academy Mental
                      Scouting Profile. 15 minutes, no slides.
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
                          <li><button onClick={() => handleTabChange('offer')} className="text-gray-400 hover:text-white transition-colors">The offer</button></li>
                          <li><button onClick={() => handleTabChange('economics')} className="text-gray-400 hover:text-white transition-colors">Economics</button></li>
                          <li><button onClick={() => handleTabChange('distribution')} className="text-gray-400 hover:text-white transition-colors">Distribution &amp; rollout</button></li>
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
                          <li><button onClick={() => setShowBooking(true)} className="text-gray-400 hover:text-white transition-colors">Book a call</button></li>
                          <li><a href="https://calendly.com/ntangible/30min" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Contact NTangible</a></li>
                      </ul>
                  </div>
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
