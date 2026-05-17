
import React, { useState } from 'react';
import { Bell, Shield, Eye, Download, Moon, Sun, Monitor, Lock, Globe, Database, Smartphone } from 'lucide-react';

const SettingsView: React.FC = () => {
    const [emailDigest, setEmailDigest] = useState(true);
    const [theme, setTheme] = useState('light');
    const [matchAlerts, setMatchAlerts] = useState(true);

    const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
        <div 
            onClick={onChange}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${checked ? 'bg-black' : 'bg-gray-200'}`}
        >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
    );

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-300">
        <div className="mb-10 border-b border-gray-200 pb-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">SYSTEM <span className="font-bold">SETTINGS</span></h1>
            <p className="text-gray-500 mt-2 max-w-2xl">Control your notification preferences, display options, and data privacy settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar Navigation (Mock) */}
            <div className="lg:col-span-1 space-y-2">
                <button className="w-full text-left px-4 py-3 bg-gray-100 text-black font-semibold rounded-lg text-sm flex items-center gap-3">
                    <Bell size={16} />
                    Notifications
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-50 font-medium rounded-lg text-sm flex items-center gap-3 transition-colors">
                    <Eye size={16} />
                    Display
                </button>
                <button className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-50 font-medium rounded-lg text-sm flex items-center gap-3 transition-colors">
                    <Shield size={16} />
                    Security
                </button>
                 <button className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-50 font-medium rounded-lg text-sm flex items-center gap-3 transition-colors">
                    <Database size={16} />
                    Data Management
                </button>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Notifications Section */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             <Bell className="text-gray-400" size={18} />
                             <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Notification Preferences</h2>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between group">
                            <div>
                                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Weekly Scouting Digest</p>
                                <p className="text-xs text-gray-500 mt-1">Receive a comprehensive summary of new athlete matches every Monday morning.</p>
                            </div>
                            <Toggle checked={emailDigest} onChange={() => setEmailDigest(!emailDigest)} />
                        </div>
                        
                        <div className="w-full h-px bg-gray-100"></div>

                        <div className="flex items-center justify-between group">
                             <div>
                                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Instant Match Alerts</p>
                                <p className="text-xs text-gray-500 mt-1">Get notified via email immediately when a player hits your clutch factor threshold.</p>
                            </div>
                            <Toggle checked={matchAlerts} onChange={() => setMatchAlerts(!matchAlerts)} />
                        </div>

                         <div className="w-full h-px bg-gray-100"></div>

                         <div className="flex items-center justify-between group">
                             <div>
                                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Mobile Push Notifications</p>
                                <p className="text-xs text-gray-500 mt-1">Receive alerts on your mobile device (requires app installation).</p>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Smartphone size={16} />
                                <span className="text-xs font-medium">Coming Soon</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Display Section */}
                 <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             <Eye className="text-gray-400" size={18} />
                             <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Appearance</h2>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-3 gap-4">
                            <button 
                                onClick={() => setTheme('light')}
                                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-black bg-gray-50 text-black' : 'border-transparent bg-white hover:bg-gray-50 text-gray-500'}`}
                            >
                                <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100">
                                     <Sun size={20} />
                                </div>
                                <span className="text-xs font-bold">Light Mode</span>
                            </button>
                            <button 
                                onClick={() => setTheme('dark')}
                                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-black bg-gray-900 text-white' : 'border-transparent bg-white hover:bg-gray-50 text-gray-500'}`}
                            >
                                 <div className={`p-2 rounded-full shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                     <Moon size={20} />
                                </div>
                                <span className="text-xs font-bold">Dark Mode</span>
                            </button>
                             <button 
                                onClick={() => setTheme('system')}
                                className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-black bg-gray-50 text-black' : 'border-transparent bg-white hover:bg-gray-50 text-gray-500'}`}
                            >
                                <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100">
                                     <Monitor size={20} />
                                </div>
                                <span className="text-xs font-bold">System Default</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Data Section */}
                 <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             <Database className="text-gray-400" size={18} />
                             <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Data & Privacy</h2>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                             <div>
                                <p className="font-semibold text-gray-900">Export Scout Data</p>
                                <p className="text-xs text-gray-500 mt-1">Download a CSV containing all current "Interested" player profiles and their NTerpret data.</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold hover:bg-black hover:text-white hover:border-black transition-colors">
                                <Download size={14} />
                                Export CSV
                            </button>
                        </div>
                        
                        <div className="p-4 bg-red-50 rounded-lg border border-red-100 flex items-start gap-4">
                            <div className="mt-1">
                                <Lock className="text-red-500" size={16} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-red-700 mb-1">Clear Local Cache</h4>
                                <p className="text-xs text-red-600/80 mb-3">This will remove all locally stored temporary data, including sort preferences and recent searches.</p>
                                <button className="text-xs font-bold text-red-600 border-b border-red-200 pb-0.5 hover:text-red-800 hover:border-red-800 transition-colors">
                                    Clear Cache Now
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
  );
};

export default SettingsView;
