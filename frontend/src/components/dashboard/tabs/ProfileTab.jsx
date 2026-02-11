import React, { useState, useRef, useEffect } from 'react';
import { User, Shield, Bell, Settings, LogOut, Camera, Loader2, Mail, MapPin, Calendar, Briefcase, Award, ChevronRight, Fingerprint } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import userService from '../../../services/user.service';

const ProfileTab = () => {
    const { user, refreshUser, logout } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
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
        <div className="max-w-4xl mx-auto py-4 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
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
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all text-sm font-bold text-slate-700 group">
                                <span>Change Password</span>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all text-sm font-bold text-slate-700 group">
                                <span>Privacy Settings</span>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
