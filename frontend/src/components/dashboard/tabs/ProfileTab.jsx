import React, { useState, useRef, useEffect } from 'react';
import { User, Shield, Bell, Settings, LogOut, Camera, Loader2, Mail, MapPin, Calendar, Briefcase, Award, ChevronRight, Fingerprint, Lock, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import userService from '../../../services/user.service';

const ProfileTab = () => {
    const { user, refreshUser, logout, changePassword } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: null, success: false });
    const fileInputRef = useRef(null);

    // Refresh user data on mount to ensure we have the latest summary
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await refreshUser();
            setLoading(false);
        };
        loadData();
    }, []);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const response = await userService.updateAvatar(file);
            if (response.success) {
                await refreshUser();
            }
        } catch (error) {
            console.error('Failed to upload avatar:', error);
            alert('Failed to upload avatar. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handlePasswordChangeSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordStatus({ ...passwordStatus, error: 'New passwords do not match' });
            return;
        }

        try {
            setPasswordStatus({ loading: true, error: null, success: false });
            await changePassword(passwordData.oldPassword, passwordData.newPassword);
            setPasswordStatus({ loading: false, error: null, success: true });
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordStatus({ loading: false, error: null, success: false });
            }, 2000);
        } catch (error) {
            setPasswordStatus({ loading: false, error: error || 'Failed to change password', success: false });
        }
    };

    const getAvatarUrl = () => {
        if (!user?.avatar_url) return null;
        if (user.avatar_url.startsWith('/uploads')) {
            const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
            return `${baseUrl}${user.avatar_url}`;
        }
        return user.avatar_url;
    };

    const avatarUrl = getAvatarUrl();
    const responses = user?.panelist?.responses || {};

    if (loading && !user) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-4 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative">
            {/* Header Section - Stripped & Minimalist */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-slate-200/60">
                <div className="flex items-center gap-8">
                    {/* Minimalist Avatar */}
                    <div className="relative group/avatar">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        <div
                            onClick={handleAvatarClick}
                            className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer relative overflow-hidden ring-1 ring-slate-200 transition-all hover:ring-blue-500/30"
                        >
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={32} className="text-slate-300" strokeWidth={1} />
                            )}
                            <div className={`absolute inset-0 bg-[#0F1E3A]/40 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center ${uploading ? 'opacity-100' : 'opacity-0 group-hover/avatar:opacity-100'}`}>
                                {uploading ? (
                                    <Loader2 className="text-white animate-spin w-5 h-5" />
                                ) : (
                                    <Camera className="text-white w-5 h-5" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-[#0F1E3A] tracking-tight">
                            {user?.name || 'Researcher'}
                        </h1>
                        <p className="text-slate-500 font-medium flex items-center gap-2">
                            <Mail size={14} className="text-slate-400" /> {user?.email}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95">
                        Edit
                    </button>
                    <button
                        onClick={logout}
                        className="px-5 py-2.5 rounded-xl bg-[#0F1E3A] text-white font-bold text-sm hover:opacity-90 transition-all active:scale-95"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left: Research Identity (The core data) */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Fingerprint className="w-5 h-5 text-[#0F1E3A]" />
                            <h2 className="text-xl font-bold text-[#0F1E3A] tracking-tight">Research Identity</h2>
                        </div>

                        <div className="space-y-0 divide-y divide-slate-100">
                            {Object.entries(responses).map(([key, data]) => (
                                <div key={key} className="py-4 flex items-center justify-between group">
                                    <div className="space-y-0.5">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{data.title}</p>
                                        <p className="text-slate-900 font-medium capitalize">
                                            {typeof data.value === 'string' ? data.value : JSON.stringify(data.value)}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-slate-400 transition-colors" />
                                </div>
                            ))}
                            {Object.keys(responses).length === 0 && (
                                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-slate-500 font-medium">No persona data found.</p>
                                    <button className="text-blue-600 font-bold text-sm mt-1 hover:underline">Complete Onboarding</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Insights & Stats */}
                <div className="lg:col-span-4 space-y-12">
                    {/* Stats Module */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Insights</h3>
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                    <Award className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trust Score</p>
                                    <p className="text-lg font-bold text-[#0F1E3A]">{user?.panelist?.quality_score || 0}%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contributions</p>
                                    <p className="text-lg font-bold text-[#0F1E3A]">12 Studies</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Module */}
                    <div className="space-y-6 pt-12 border-t border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Security</h3>
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <Lock className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Password & Security</h4>
                                        <p className="text-xs text-slate-400">Manage your account access</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-between group"
                                >
                                    <span>Change Password</span>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F1E3A]/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setShowPasswordModal(false)}
                            className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-8">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                <Lock className="text-blue-500" size={28} />
                            </div>
                            <h2 className="text-2xl font-bold text-[#0F1E3A] tracking-tight">Update Password</h2>
                            <p className="text-slate-500 text-sm mt-2 font-medium">Ensure your account stays secure.</p>
                        </div>

                        <form onSubmit={handlePasswordChangeSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                    placeholder="••••••••"
                                />
                            </div>

                            {passwordStatus.error && (
                                <div className="p-4 rounded-2xl bg-red-50 flex items-center gap-3 text-red-600 text-sm font-bold border border-red-100 animate-in shake-in duration-300">
                                    <AlertCircle size={18} />
                                    {passwordStatus.error}
                                </div>
                            )}

                            {passwordStatus.success && (
                                <div className="p-4 rounded-2xl bg-green-50 flex items-center gap-3 text-green-600 text-sm font-bold border border-green-100">
                                    <CheckCircle2 size={18} />
                                    Password updated successfully!
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={passwordStatus.loading || passwordStatus.success}
                                className="w-full py-4 rounded-2xl bg-[#0F1E3A] text-white font-bold text-sm shadow-xl shadow-blue-900/10 hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95 mt-4"
                            >
                                {passwordStatus.loading ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                ) : (
                                    <>
                                        Update Password
                                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileTab;
