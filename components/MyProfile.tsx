
import React, { useState } from 'react';
import { Mail, Phone, Building, BadgeCheck, Calendar, Camera, Lock, X, Save, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface MyProfileProps {
    profile: UserProfile;
    onSave: (profile: UserProfile) => void;
}

const MyProfile: React.FC<MyProfileProps> = ({ profile, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formState, setFormState] = useState(profile);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    
    // Password Modal State
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const handleEdit = () => {
        setFormState(profile); // Reset form to current profile
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormState(profile);
        setIsEditing(false);
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API delay
        setTimeout(() => {
            onSave(formState);
            setIsEditing(false);
            setIsSaving(false);
        }, 800);
    };

    const handlePasswordSave = () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            setPasswordError('All fields are required.');
            return;
        }
        if (passwords.new !== passwords.confirm) {
            setPasswordError('New passwords do not match.');
            return;
        }
        if (passwords.new.length < 8) {
             setPasswordError('Password must be at least 8 characters.');
             return;
        }

        setPasswordError('');
        setPasswordSuccess('Password successfully updated.');
        
        setTimeout(() => {
            setShowPasswordModal(false);
            setPasswords({ current: '', new: '', confirm: '' });
            setPasswordSuccess('');
        }, 1500);
    };

    const InputField = ({ label, value, field, type = 'text' }: { label: string, value: string, field: keyof UserProfile, type?: string }) => (
        <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">{label}</p>
            {isEditing ? (
                 <input 
                    type={type}
                    value={value}
                    onChange={(e) => setFormState(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                 />
            ) : (
                <p className="text-sm font-semibold text-gray-900">{value}</p>
            )}
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-300">
            {/* Header */}
            <div className="mb-8 border-b border-gray-200 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-light text-gray-900 tracking-tight">MY <span className="font-bold">PROFILE</span></h1>
                    <p className="text-gray-500 mt-2">Manage your account details and organization settings.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                {/* Loading Overlay */}
                {isSaving && (
                    <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-sm">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Saving Changes...</span>
                        </div>
                    </div>
                )}

                {/* Cover/Avatar Section */}
                <div className="h-40 bg-gradient-to-r from-gray-900 via-gray-800 to-black relative">
                    <div className="absolute -bottom-14 left-8 group cursor-pointer">
                        <div className="w-28 h-28 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-gray-400 text-3xl font-bold relative overflow-hidden">
                            {formState.firstName[0]}{formState.lastName[0]}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-20 pb-10 px-8">
                    <div className="flex justify-between items-start mb-10">
                        {/* Name & Role Section */}
                        <div className="w-full max-w-lg">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">First Name</label>
                                            <input 
                                                value={formState.firstName}
                                                onChange={(e) => setFormState({...formState, firstName: e.target.value})}
                                                className="w-full text-xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-600 focus:outline-none py-1 bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Last Name</label>
                                            <input 
                                                value={formState.lastName}
                                                onChange={(e) => setFormState({...formState, lastName: e.target.value})}
                                                className="w-full text-xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-600 focus:outline-none py-1 bg-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                             <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Role</label>
                                             <input 
                                                value={formState.role}
                                                onChange={(e) => setFormState({...formState, role: e.target.value})}
                                                className="w-full text-sm font-semibold text-blue-600 border-b border-gray-300 focus:border-blue-600 focus:outline-none py-1 bg-transparent"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Organization Name</label>
                                            <input 
                                                value={formState.orgName}
                                                onChange={(e) => setFormState({...formState, orgName: e.target.value})}
                                                className="w-full text-sm font-medium text-gray-500 border-b border-gray-300 focus:border-blue-600 focus:outline-none py-1 bg-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-blue-600 font-semibold">{profile.role}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-500">{profile.orgName}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {isEditing ? (
                                <>
                                    <button 
                                        onClick={handleCancel}
                                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        <Save size={14} />
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => setShowPasswordModal(true)}
                                        className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Change Password
                                    </button>
                                    <button 
                                        onClick={handleEdit}
                                        className="px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                                    >
                                        Edit Profile
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact Information</h3>
                                <div className="flex-grow h-px bg-gray-100"></div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex items-center gap-5 p-4 rounded-xl border border-gray-50 bg-gray-50/50">
                                    <div className="p-3 bg-white rounded-lg text-gray-400 shadow-sm border border-gray-100">
                                        <Mail size={20} />
                                    </div>
                                    <InputField 
                                        label="Email Address" 
                                        value={formState.email} 
                                        field="email" 
                                        type="email"
                                    />
                                </div>

                                <div className="flex items-center gap-5 p-4 rounded-xl border border-gray-50 bg-gray-50/50">
                                    <div className="p-3 bg-white rounded-lg text-gray-400 shadow-sm border border-gray-100">
                                        <Phone size={20} />
                                    </div>
                                    <InputField 
                                        label="Phone Number" 
                                        value={formState.phone} 
                                        field="phone"
                                    />
                                </div>

                                <div className="flex items-center gap-5 p-4 rounded-xl border border-gray-50 bg-gray-50/50">
                                    <div className="p-3 bg-white rounded-lg text-gray-400 shadow-sm border border-gray-100">
                                        <Building size={20} />
                                    </div>
                                    <InputField 
                                        label="Organization (Location)" 
                                        value={formState.organization} 
                                        field="organization"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Status */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Status</h3>
                                <div className="flex-grow h-px bg-gray-100"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-6 rounded-xl border border-blue-100 bg-blue-50/50 flex flex-col justify-between h-32">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg w-fit">
                                            <BadgeCheck size={20} />
                                        </div>
                                        <span className="text-[10px] font-bold text-blue-400 bg-white px-2 py-1 rounded-full">ACTIVE</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mb-1">Current Plan</p>
                                        <p className="text-lg font-bold text-gray-900">{profile.plan}</p>
                                    </div>
                                </div>

                                <div className="p-6 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between h-32">
                                    <div className="flex justify-between items-start">
                                        <div className="p-2 bg-white text-gray-400 rounded-lg w-fit border border-gray-100">
                                            <Calendar size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Member Since</p>
                                        <p className="text-lg font-bold text-gray-900">{profile.memberSince}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            {passwordError && (
                                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded border border-red-100">
                                    {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="p-3 bg-green-50 text-green-600 text-xs font-bold rounded border border-green-100 flex items-center gap-2">
                                    <Check size={14} />
                                    {passwordSuccess}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Current Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="password"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="password"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="password"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button 
                                onClick={() => setShowPasswordModal(false)}
                                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handlePasswordSave}
                                className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default MyProfile;
