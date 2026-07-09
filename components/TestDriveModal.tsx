
import React, { useState } from 'react';
import { X, ChevronRight, Activity, ArrowLeft, ExternalLink, Info, Brain } from 'lucide-react';

const SPORTS = [
    { id: 'baseball', label: 'Baseball' },
    { id: 'mbb', label: 'Basketball (Mens)' },
    { id: 'wbb', label: 'Basketball (Womens)' },
    { id: 'football', label: 'Football' },
    { id: 'hockey', label: 'Hockey' },
    { id: 'mvb', label: 'Indoor Volleyball (Mens)' },
    { id: 'wvb', label: 'Indoor Volleyball (Womens)' },
    { id: 'softball', label: 'Softball' },
    { id: 'msoc', label: 'Soccer (Mens)' },
    { id: 'wsoc', label: 'Soccer (Womens)' },
];

const SPORT_LINKS: Record<string, { clutch: string; nterpret: string }> = {
    baseball: {
        clutch: 'https://portal.ntangible.co/register/baseballdemo',
        nterpret: 'https://portal.ntangible.co/express/TestGroupBaseball'
    },
    mbb: {
        clutch: 'https://portal.ntangible.co/register/demobasketball',
        nterpret: 'https://portal.ntangible.co/express/MBasketballdemo'
    },
    wbb: {
        clutch: 'https://portal.ntangible.co/register/wbasketballdemo',
        nterpret: 'https://portal.ntangible.co/express/WBasketballDemo'
    },
    football: {
        clutch: 'https://portal.ntangible.co/register/footballdemo',
        nterpret: 'https://portal.ntangible.co/express/FootballDemo'
    },
    hockey: {
        clutch: 'https://portal.ntangible.co/register/hockeydemo',
        nterpret: 'https://portal.ntangible.co/express/hockeydemo'
    },
    mvb: {
        clutch: 'https://portal.ntangible.co/register/mvolleyballdemo',
        nterpret: 'https://portal.ntangible.co/express/MVolleyballDemo'
    },
    wvb: {
        clutch: 'https://portal.ntangible.co/register/wvolleyballdemo',
        nterpret: 'https://portal.ntangible.co/express/WVolleyballDemo'
    },
    softball: {
        clutch: 'https://portal.ntangible.co/register/softballdemo',
        nterpret: 'https://portal.ntangible.co/express/softballdemo'
    },
    msoc: {
        clutch: 'https://portal.ntangible.co/register/msoccerdemo',
        nterpret: 'https://portal.ntangible.co/express/MSoccerDemo'
    },
    wsoc: {
        clutch: 'https://portal.ntangible.co/register/wsoccerdemo',
        nterpret: 'https://portal.ntangible.co/express/WSoccerDemo'
    }
};

interface TestDriveModalProps {
    onClose: () => void;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({ onClose }) => {
    const [selectedSport, setSelectedSport] = useState<{id: string, label: string} | null>(null);

    const handleOpenTest = (testType: 'clutch' | 'nterpret') => {
        if (!selectedSport) return;
        
        const links = SPORT_LINKS[selectedSport.id];
        if (links) {
            const url = testType === 'clutch' ? links.clutch : links.nterpret;
            window.open(url, '_blank');
        } else {
            alert("Configuration error: Links not found for this sport.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-4xl bg-white border border-line-strong rounded-card shadow-lift overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-5 border-b border-line flex justify-between items-center bg-white">
                    <div className="flex items-center gap-4">
                        {selectedSport && (
                            <button
                                onClick={() => setSelectedSport(null)}
                                className="text-gray-brand hover:text-ink transition-colors"
                            >
                                <ArrowLeft size={20} strokeWidth={1.8} />
                            </button>
                        )}
                        <div>
                            <h2 className="text-xl font-semibold text-ink tracking-tightest flex items-center gap-2">
                                {selectedSport ? selectedSport.label : 'Select sport'}
                            </h2>
                            <p className="text-sm text-body">
                                {selectedSport ? 'Available cognitive tests.' : 'Choose a sport to access testing links.'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-brand hover:text-ink transition-colors">
                        <X size={24} strokeWidth={1.8} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar bg-white">
                    {!selectedSport ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {SPORTS.map((sport) => (
                                <button
                                    key={sport.id}
                                    onClick={() => setSelectedSport(sport)}
                                    className="flex items-center justify-between p-4 nt-card nt-card-hover hover:border-ink transition-all group text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-9 h-9 rounded-full border border-line-strong bg-white flex items-center justify-center text-ink transition-colors">
                                            <Activity size={18} strokeWidth={1.8} />
                                        </span>
                                        <span className="font-semibold text-body group-hover:text-ink transition-colors">
                                            {sport.label}
                                        </span>
                                    </div>
                                    <ChevronRight size={16} strokeWidth={1.8} className="text-gray-soft group-hover:text-ink transition-colors" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-3xl mx-auto">

                            {/* Requirement Banner */}
                            <div className="nt-callout flex gap-3">
                                <div className="mt-0.5">
                                    <Info size={18} strokeWidth={1.8} className="text-ink" />
                                </div>
                                <div>
                                    <h4 className="font-mono text-[11px] font-medium text-ink uppercase tracking-[0.16em] mb-1">Testing requirement</h4>
                                    <p className="text-sm text-body leading-relaxed">
                                        To ensure a complete cognitive profile, the athlete must complete <span className="font-semibold text-ink">both</span> the Clutch Factor™ and NTerpret™ assessments.
                                    </p>
                                </div>
                            </div>

                            {/* Test Card 1 - Clutch */}
                            <button
                                onClick={() => handleOpenTest('clutch')}
                                className="w-full group relative p-6 nt-card nt-card-hover hover:border-ink transition-all cursor-pointer text-left"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 h-10 rounded-full border border-line-strong bg-white flex items-center justify-center text-ink transition-colors">
                                            <Activity size={20} strokeWidth={1.8} />
                                        </span>
                                        <h3 className="text-lg font-semibold text-ink tracking-tightest group-hover:text-ink transition-colors">Clutch Factor™ Assessment</h3>
                                        <span className="ml-2 px-2 py-0.5 bg-white border border-line-strong text-gray-brand font-mono text-[10px] font-medium uppercase rounded-card tracking-[0.12em]">
                                            Active
                                        </span>
                                    </div>
                                    <ExternalLink size={18} strokeWidth={1.8} className="text-gray-soft group-hover:text-ink transition-colors" />
                                </div>
                                <p className="text-sm text-body transition-colors pl-[56px]">
                                    Determine your clutch factor, and see if you have what it takes to perform in high leverage situations.
                                </p>
                            </button>

                            {/* Test Card 2 - NTerpret */}
                             <button
                                onClick={() => handleOpenTest('nterpret')}
                                className="w-full group relative p-6 nt-card nt-card-hover hover:border-ink transition-all cursor-pointer text-left"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 h-10 rounded-full border border-line-strong bg-white flex items-center justify-center text-ink transition-colors">
                                            <Brain size={20} strokeWidth={1.8} />
                                        </span>
                                        <h3 className="text-lg font-semibold text-ink tracking-tightest group-hover:text-ink transition-colors">NTerpret™ Assessment</h3>
                                        <span className="ml-2 px-2 py-0.5 bg-white border border-line-strong text-gray-brand font-mono text-[10px] font-medium uppercase rounded-card tracking-[0.12em]">
                                            Active
                                        </span>
                                    </div>
                                    <ExternalLink size={18} strokeWidth={1.8} className="text-gray-soft group-hover:text-ink transition-colors" />
                                </div>
                                <p className="text-sm text-body transition-colors pl-[56px]">
                                    The mental scouting report which determines how you learn, communicate, and specific motivations towards sports.
                                </p>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
