
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
            <p className="font-mono text-[11px] text-gray-brand uppercase font-medium tracking-[0.25em] mb-1">{label}</p>
            {isEditing ? (
                 <input
                    type={type}
                    value={value}
                    onChange={(e) => setFormState(prev => ({ ...prev, [field]: e.target.value }))}
                    className="nt-input font-semibold"
                 />
            ) : (
                <p className="text-sm font-semibold text-ink">{value}</p>
            )}
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-300">
            {/* Header */}
            <div className="mb-8 border-b border-line pb-6 flex justify-between items-end">
                <div>
                    <p className="font-mono text-[11px] text-gray-brand uppercase font-medium tracking-[0.25em] mb-3">Account</p>
                    <h1 className="text-3xl font-semibold text-ink tracking-tightest">My profile</h1>
                    <p className="text-body mt-2">Manage your account details and organization settings.</p>
                </div>
            </div>

            <div className="nt-card overflow-hidden relative">
                {/* Loading Overlay */}
                {isSaving && (
                    <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center backdrop-blur-sm">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-2 border-ink border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.25em]">Saving changes...</span>
                        </div>
                    </div>
                )}

                {/* Cover/Avatar Section */}
                <div className="h-40 bg-chip border-b border-line relative nt-stat-grid">
                    <div className="absolute -bottom-14 left-8 group cursor-pointer">
                        <div className="w-28 h-28 rounded-full border-4 border-white bg-paper flex items-center justify-center text-gray-brand text-3xl font-semibold relative overflow-hidden">
                            {formState.firstName[0]}{formState.lastName[0]}
                            <div className="absolute inset-0 bg-ink/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={24} strokeWidth={1.8} />
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
                                            <label className="font-mono text-[11px] text-gray-brand uppercase font-medium tracking-[0.25em]">First name</label>
                                            <input
                                                value={formState.firstName}
                                                onChange={(e) => setFormState({...formState, firstName: e.target.value})}
                                                className="nt-input text-xl font-semibold"
                                            />
                                        </div>
                                        <div>
                                            <label className="font-mono text-[11px] text-gray-brand uppercase font-medium tracking-[0.25em]">Last name</label>
                                            <input
                                                value={formState.lastName}
                                                onChange={(e) => setFormState({...formState, lastName: e.target.value})}
                                                className="nt-input text-xl font-semibold"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                             <label className="font-mono text-[11px] text-gray-brand uppercase font-medium tracking-[0.25em]">Role</label>
                                             <input
                                                value={formState.role}
                                                onChange={(e) => setFormState({...formState, role: e.target.value})}
                                                className="nt-input text-sm font-semibold"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="font-mono text-[11px] text-gray-brand uppercase font-medium tracking-[0.25em]">Organization name</label>
                                            <input
                                                value={formState.orgName}
                                                onChange={(e) => setFormState({...formState, orgName: e.target.value})}
                                                className="nt-input text-sm font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-3xl font-semibold text-ink tracking-tightest">{profile.firstName} {profile.lastName}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-ink font-semibold">{profile.role}</span>
                                        <span className="text-gray-soft">·</span>
                                        <span className="text-gray-brand">{profile.orgName}</span>
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
                                        className="nt-btn-ghost !py-2.5 !px-5 !text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="nt-btn-primary !py-2.5 !px-5 !text-xs"
                                    >
                                        <Save size={14} strokeWidth={1.8} />
                                        Save changes
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setShowPasswordModal(true)}
                                        className="nt-btn-ghost !py-2.5 !px-5 !text-xs"
                                    >
                                        Change password
                                    </button>
                                    <button
                                        onClick={handleEdit}
                                        className="nt-btn-primary !py-2.5 !px-5 !text-xs"
                                    >
                                        Edit profile
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <h3 className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.25em]">Contact information</h3>
                                <div className="flex-grow h-px bg-line"></div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-5 p-4 nt-card">
                                    <div className="text-gray-soft">
                                        <Mail size={20} strokeWidth={1.8} />
                                    </div>
                                    <InputField
                                        label="Email address"
                                        value={formState.email}
                                        field="email"
                                        type="email"
                                    />
                                </div>

                                <div className="flex items-center gap-5 p-4 nt-card">
                                    <div className="text-gray-soft">
                                        <Phone size={20} strokeWidth={1.8} />
                                    </div>
                                    <InputField
                                        label="Phone number"
                                        value={formState.phone}
                                        field="phone"
                                    />
                                </div>

                                <div className="flex items-center gap-5 p-4 nt-card">
                                    <div className="text-gray-soft">
                                        <Building size={20} strokeWidth={1.8} />
                                    </div>
                                    <InputField
                                        label="Organization (location)"
                                        value={formState.organization}
                                        field="organization"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Status */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <h3 className="font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.25em]">Account status</h3>
                                <div className="flex-grow h-px bg-line"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-6 nt-card flex flex-col justify-between h-32">
                                    <div className="flex justify-between items-start">
                                        <div className="text-ink w-fit">
                                            <BadgeCheck size={20} strokeWidth={1.8} />
                                        </div>
                                        <span className="font-mono text-[10px] font-medium text-gray-brand uppercase tracking-[0.16em] border border-line-strong bg-white px-2 py-1 rounded-pill">Active</span>
                                    </div>
                                    <div>
                                        <p className="font-mono text-[11px] text-gray-brand uppercase font-medium tracking-[0.25em] mb-1">Current plan</p>
                                        <p className="text-lg font-semibold text-ink">{profile.plan}</p>
                                    </div>
                                </div>

                                <div className="p-6 nt-card flex flex-col justify-between h-32">
                                    <div className="flex justify-between items-start">
                                        <div className="text-gray-soft w-fit">
                                            <Calendar size={20} strokeWidth={1.8} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-mono text-[11px] text-gray-brand uppercase font-medium tracking-[0.25em] mb-1">Member since</p>
                                        <p className="text-lg font-semibold text-ink tabular-nums">{profile.memberSince}</p>
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
                    <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
                    <div className="relative w-full max-w-md nt-card shadow-lift overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="px-6 py-4 border-b border-line flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-ink tracking-tightest">Change password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-gray-brand hover:text-ink transition-colors">
                                <X size={20} strokeWidth={1.8} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {passwordError && (
                                <div className="p-3 bg-white text-red-600 text-xs font-medium rounded-card border border-red-200">
                                    {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="p-3 bg-white text-ink text-xs font-medium rounded-card border border-line-strong flex items-center gap-2">
                                    <Check size={14} strokeWidth={1.8} />
                                    {passwordSuccess}
                                </div>
                            )}

                            <div>
                                <label className="block font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.25em] mb-1.5">Current password</label>
                                <div className="relative flex items-center gap-2">
                                    <Lock className="text-gray-soft shrink-0" size={16} strokeWidth={1.8} />
                                    <input
                                        type="password"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                        className="nt-input"
                                    />
                                </div>
                            </div>
                             <div>
                                <label className="block font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.25em] mb-1.5">New password</label>
                                <div className="relative flex items-center gap-2">
                                    <Lock className="text-gray-soft shrink-0" size={16} strokeWidth={1.8} />
                                    <input
                                        type="password"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                        className="nt-input"
                                    />
                                </div>
                            </div>
                             <div>
                                <label className="block font-mono text-[11px] font-medium text-gray-brand uppercase tracking-[0.25em] mb-1.5">Confirm new password</label>
                                <div className="relative flex items-center gap-2">
                                    <Lock className="text-gray-soft shrink-0" size={16} strokeWidth={1.8} />
                                    <input
                                        type="password"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                        className="nt-input"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-chip/40 border-t border-line flex justify-end gap-3 items-center">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="font-mono text-[11px] font-medium text-gray-brand hover:text-ink uppercase tracking-[0.16em] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordSave}
                                className="nt-btn-primary !py-2.5 !px-5 !text-xs"
                            >
                                Update password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default MyProfile;
