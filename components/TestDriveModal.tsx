
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-4xl bg-[#0f1115] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center bg-[#0f1115]">
                    <div className="flex items-center gap-4">
                        {selectedSport && (
                            <button 
                                onClick={() => setSelectedSport(null)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                {selectedSport ? selectedSport.label : 'Select Sport'}
                            </h2>
                            <p className="text-sm text-gray-400">
                                {selectedSport ? 'Available cognitive tests.' : 'Choose a sport to access testing links.'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar bg-[#0f1115]">
                    {!selectedSport ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {SPORTS.map((sport) => (
                                <button
                                    key={sport.id}
                                    onClick={() => setSelectedSport(sport)}
                                    className="flex items-center justify-between p-4 bg-[#181b21] hover:bg-[#22262e] border border-gray-800 hover:border-blue-500/30 rounded-xl transition-all group text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-800 rounded-lg text-gray-400 group-hover:text-blue-400 group-hover:bg-blue-900/20 transition-colors">
                                            <Activity size={18} />
                                        </div>
                                        <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">
                                            {sport.label}
                                        </span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-600 group-hover:text-gray-300 transition-colors" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-3xl mx-auto">
                            
                            {/* Requirement Banner */}
                            <div className="p-4 bg-blue-900/10 border border-blue-900/30 rounded-xl flex gap-3">
                                <div className="mt-0.5">
                                    <Info size={18} className="text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-100 uppercase tracking-wide mb-1">Testing Requirement</h4>
                                    <p className="text-sm text-blue-200/70 leading-relaxed">
                                        To ensure a complete cognitive profile, the athlete must complete <span className="font-bold text-white">BOTH</span> the Clutch Factor™ and NTerpret™ assessments.
                                    </p>
                                </div>
                            </div>

                            {/* Test Card 1 - Clutch */}
                            <button 
                                onClick={() => handleOpenTest('clutch')}
                                className="w-full group relative p-6 bg-[#181b21] hover:bg-[#22262e] border border-gray-800 hover:border-blue-500/50 rounded-xl transition-all cursor-pointer text-left"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-900/20 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            <Activity size={20} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Clutch Factor™ Assessment</h3>
                                        <span className="ml-2 px-2 py-0.5 bg-green-900/20 text-green-400 border border-green-900/30 text-[10px] font-bold uppercase rounded tracking-wider">
                                            Active
                                        </span>
                                    </div>
                                    <ExternalLink size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                                </div>
                                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors pl-[52px]">
                                    Determine your clutch factor, and see if you have what it takes to perform in high leverage situations.
                                </p>
                            </button>

                            {/* Test Card 2 - NTerpret */}
                             <button 
                                onClick={() => handleOpenTest('nterpret')}
                                className="w-full group relative p-6 bg-[#181b21] hover:bg-[#22262e] border border-gray-800 hover:border-purple-500/50 rounded-xl transition-all cursor-pointer text-left"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-900/20 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                            <Brain size={20} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">NTerpret Assessment</h3>
                                        <span className="ml-2 px-2 py-0.5 bg-green-900/20 text-green-400 border border-green-900/30 text-[10px] font-bold uppercase rounded tracking-wider">
                                            Active
                                        </span>
                                    </div>
                                    <ExternalLink size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                                </div>
                                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors pl-[52px]">
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
