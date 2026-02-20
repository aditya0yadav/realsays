import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Calendar, MapPin, DollarSign, Activity, Clock, Shield, Award, User, Target, BarChart3, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminService } from '../../services/admin-api';

const AdminUserDetails = ({ userId, userData, onClose }) => {
    const [fullUser, setFullUser] = useState(userData || null);
    const [loading, setLoading] = useState(!userData);
    const [activeTab, setActiveTab] = useState('overview'); // overview | profile | activity

    useEffect(() => {
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const response = await adminService.getUserDetails(userId);
            if (response.success) {
                setFullUser(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch user details', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !fullUser) {
        return (
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="fixed inset-y-0 right-0 w-full max-w-4xl bg-white shadow-2xl z-50 flex items-center justify-center"
            >
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <p className="text-sm font-medium text-slate-400">Synchronizing panelist data...</p>
                </div>
            </motion.div>
        );
    }

    if (!fullUser) return null;

    const { profile, financials, stats, attributes, activity_log } = fullUser;

    const earningsData = [
        { name: 'Jan', value: financials.lifetime_earnings * 0.2 },
        { name: 'Feb', value: financials.lifetime_earnings * 0.4 },
        { name: 'Mar', value: financials.lifetime_earnings * 0.5 },
        { name: 'Apr', value: financials.lifetime_earnings * 0.7 },
        { name: 'May', value: financials.lifetime_earnings * 0.9 },
        { name: 'Jun', value: financials.lifetime_earnings }
    ];

    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            className="fixed inset-y-0 right-0 w-full max-w-5xl bg-[#F8F9FB] shadow-2xl z-50 flex flex-col md:flex-row overflow-hidden border-l border-slate-200"
        >
            {/* Main Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col h-full bg-slate-50/30">
                {/* Header Section */}
                <div className="bg-white px-8 pt-8 pb-6 border-b border-slate-100 sticky top-0 z-20">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                <User className="w-7 h-7 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 font-display">{profile.name || 'Anonymous User'}</h2>
                                <p className="text-sm text-slate-400 font-medium">{profile.email}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors md:hidden">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>

                    <div className="flex items-center gap-8">
                        {['overview', 'profile', 'activity'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Performance Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { label: 'Lifetime Yield', value: `$${financials.lifetime_earnings.toFixed(2)}`, icon: DollarSign, color: 'indigo' },
                                    { label: 'Current Balance', value: `$${financials.balance.toFixed(2)}`, icon: Activity, color: 'emerald' },
                                    { label: 'Quality Score', value: `${stats.quality_score || 100}%`, icon: Shield, color: 'amber' }
                                ].map((card, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-3 rounded-xl bg-${card.color}-50 text-${card.color}-600`}>
                                                <card.icon className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</span>
                                        <h4 className="text-2xl font-bold text-slate-900 mt-1 font-display tracking-tight">{card.value}</h4>
                                    </div>
                                ))}
                            </div>

                            {/* Chart Area */}
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-80">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider opacity-50 mb-8">Performance Trajectory</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={earningsData}>
                                        <defs>
                                            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            formatter={(value) => [`$${value.toFixed(2)}`, 'Earnings']}
                                        />
                                        <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} fill="url(#colorEarnings)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            {attributes.length > 0 ? (
                                attributes.map(attr => (
                                    <div key={attr.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{attr.label}</span>
                                            <p className="text-sm font-bold text-slate-900">{attr.value || 'Not Disclosed'}</p>
                                        </div>
                                        <Target className="w-4 h-4 text-indigo-300" />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 text-sm font-medium">No persona attributes available for this panelist.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {activity_log.length > 0 ? (
                                activity_log.map(activity => (
                                    <div key={activity.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                                <BarChart3 className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">{activity.survey_title}</h4>
                                                <p className="text-[11px] text-slate-400 font-medium">{new Date(activity.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-sm font-bold ${activity.status === 'complete' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                {activity.status === 'complete' ? '+' : ''}${activity.payout.toFixed(2)}
                                            </span>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">{activity.status}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-slate-400 text-sm font-medium">No survey activity recorded.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Sidebar - Critical Info */}
            <div className="w-full md:w-96 bg-white border-l border-slate-100 p-8 flex flex-col z-30">
                <div className="flex justify-between items-center mb-10 h-10">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Administrative Details</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors hidden md:block">
                        <X className="w-5 h-5 text-slate-300" />
                    </button>
                </div>

                <div className="space-y-10">
                    <div>
                        <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100">
                            {[
                                { label: 'Account ID', value: `#${profile.id.substring(0, 8)}`, icon: Shield },
                                { label: 'Last Interaction', value: profile.last_login ? new Date(profile.last_login).toLocaleDateString() : 'Never', icon: Clock },
                                { label: 'Enrollment', value: new Date(profile.joined_at).toLocaleDateString(), icon: Calendar },
                                { label: 'Security Status', value: profile.verified ? 'Verified' : 'Unverified', icon: Target }
                            ].map((info, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <info.icon className="w-3.5 h-3.5 text-slate-300" />
                                        <span className="text-[11px] font-semibold text-slate-400">{info.label}</span>
                                    </div>
                                    <span className={`text-[11px] font-bold ${info.label === 'Security Status' ? (profile.verified ? 'text-emerald-500' : 'text-amber-500') : 'text-slate-900'}`}>
                                        {info.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Governing Actions</h4>
                        <div className="space-y-3">
                            <button className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl text-[11px] font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]">
                                Send Security Alert
                            </button>
                            <button className="w-full py-4 px-6 bg-white border border-slate-100 text-red-500 rounded-2xl text-[11px] font-bold hover:bg-red-50 hover:border-red-100 transition-all active:scale-[0.98]">
                                Suspend Account
                            </button>
                        </div>
                    </div>

                    <div className="mt-auto pt-10">
                        <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 flex flex-col items-center text-center">
                            <BarChart3 className="w-8 h-8 text-indigo-400 mb-2" />
                            <h5 className="text-xs font-bold text-indigo-900 mb-1">Total Completions</h5>
                            <p className="text-2xl font-bold text-indigo-600 font-display">{stats.total_surveys}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminUserDetails;
