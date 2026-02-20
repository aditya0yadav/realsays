import React from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Calendar, MapPin, DollarSign, Activity, Clock, Shield, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AdminUserDetails = ({ user, onClose }) => {
    if (!user) return null;

    // Mock Data for charts (since we might not have historical granular data yet)
    const earningsData = [
        { name: 'Jan', value: 0 },
        { name: 'Feb', value: user.lifetime_earnings * 0.2 },
        { name: 'Mar', value: user.lifetime_earnings * 0.4 },
        { name: 'Apr', value: user.lifetime_earnings * 0.5 },
        { name: 'May', value: user.lifetime_earnings * 0.8 },
        { name: 'Jun', value: user.lifetime_earnings }
    ];

    return (
        <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            className="fixed inset-y-0 right-0 w-full max-w-6xl bg-[#F8F9FE] shadow-2xl z-50 flex flex-col md:flex-row overflow-hidden"
        >
            {/* Close Button Mobile */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md z-50 md:hidden"
            >
                <X className="w-5 h-5" />
            </button>

            {/* LEFT: Main Dashboard Area */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[#6366F1]">Profile Overview</h2>
                </div>

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Earnings */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-slate-800">${user.lifetime_earnings.toFixed(2)}</h3>
                            <p className="text-slate-400 text-sm mt-1">Total Earnings</p>
                        </div>
                        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={earningsData}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="value" stroke="#6366F1" fillOpacity={1} fill="url(#colorVal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Card 2: Balance */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-3xl font-bold text-slate-800">${user.balance?.toFixed(2) || '0.00'}</h3>
                                <p className="text-slate-400 text-sm mt-1">Current Balance</p>
                            </div>
                            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Quality Score */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-3xl font-bold text-slate-800">{user.stats?.quality_score || 100}%</h3>
                                <p className="text-slate-400 text-sm mt-1">Quality Score</p>
                            </div>
                            <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
                                <Award className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Activities Chart */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 h-96">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Earnings Activity</h3>
                        <div className="flex gap-2 text-xs">
                            <span className="flex items-center gap-1 text-[#6366F1]"><div className="w-2 h-2 rounded-full bg-[#6366F1]"></div> Income</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={earningsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} fill="url(#colorMain)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Activity List */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Interaction</h3>
                    <div className="space-y-4">
                        {user.activity_log?.length > 0 ? (
                            user.activity_log.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{activity.survey_title}</h4>
                                            <p className="text-xs text-slate-400">{new Date(activity.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold ${activity.status === 'complete' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        +{activity.payout.toFixed(2)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-center py-4">No recent activity found.</p>
                        )}
                    </div>
                </div>

            </div>

            {/* RIGHT: Profile Sidebar */}
            <div className="w-full md:w-96 bg-white border-l border-slate-100 p-8 flex flex-col h-full overflow-y-auto">
                <div className="flex justify-between items-start mb-8">
                    <h3 className="text-xl font-bold text-slate-800">User Profile</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Avatar Area */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-32 h-32 rounded-full p-1 border-2 border-dashed border-[#6366F1] mb-4 relative">
                        <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#6366F1] bg-indigo-50">
                                    {user.name?.charAt(0)}
                                </div>
                            )}
                        </div>
                        {/* Status Badge */}
                        <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                    <p className="text-slate-400">User</p>
                </div>

                {/* Status Section */}
                <div className="space-y-6">
                    <div className="bg-[#6366F1]/5 p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[#6366F1] font-bold">Account Status</span>
                            <span className="text-2xl font-bold text-[#6366F1]">Active</span>
                        </div>
                        <div className="w-full bg-white h-2 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-[#6366F1]"></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-slate-600">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600">
                            <Calendar className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium">Joined {new Date(user.joined_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600">
                            <Clock className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium">Last Login: {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600">
                            <MapPin className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium">{user.country || 'Unknown Location'}</span>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-4">Actions</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="py-3 px-4 bg-slate-50 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors">
                                Reset Pass
                            </button>
                            <button className="py-3 px-4 bg-red-50 rounded-xl text-red-500 font-bold text-sm hover:bg-red-100 transition-colors">
                                Ban User
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminUserDetails;
