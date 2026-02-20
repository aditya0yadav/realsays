import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../../services/admin-api';
import {
    Search, Users, DollarSign, Activity, Trophy, TrendingUp, Calendar, Filter, Loader2, Crown, ChevronRight, UserPlus, MoreHorizontal
} from 'lucide-react';

const AdminUsers = () => {
    const [activeTab, setActiveTab] = useState('users'); // 'users' | 'leaderboard'
    const [users, setUsers] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        country: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchData();
    }, [searchQuery, filters]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, leaderboardRes] = await Promise.all([
                adminService.getUsers({ search: searchQuery, ...filters }),
                adminService.getLeaderboard()
            ]);
            if (usersRes.success) {
                setUsers(usersRes.data.users || []);
            }
            if (leaderboardRes.success) setLeaderboard(leaderboardRes.data || []);
        } catch (error) {
            console.error('Failed to fetch user data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Elegant Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Member Directory</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage platform panelists and track top-tier performance.</p>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'users'
                            ? 'bg-white text-indigo-700 shadow-sm border border-slate-100'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Directory List
                    </button>
                    <button
                        onClick={() => setActiveTab('leaderboard')}
                        className={`px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'leaderboard'
                            ? 'bg-white text-indigo-700 shadow-sm border border-slate-100'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <Trophy className="w-3.5 h-3.5" />
                        Top Earners
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {activeTab === 'users' ? (
                    <motion.div
                        key="users"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-8"
                    >
                        {/* Advanced Filter Suite */}
                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                            <div className="xl:col-span-2 relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email address..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-medium placeholder:text-slate-300 shadow-sm"
                                />
                            </div>
                            <div className="flex gap-4">
                                <select
                                    className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:border-indigo-500 appearance-none shadow-sm cursor-pointer"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="">Status: All</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                                <select
                                    className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:border-indigo-500 appearance-none shadow-sm cursor-pointer"
                                    value={filters.country}
                                    onChange={(e) => handleFilterChange('country', e.target.value)}
                                >
                                    <option value="">Global Coverage</option>
                                    <option value="US">USA</option>
                                    <option value="IN">India</option>
                                    <option value="GB">UK</option>
                                    <option value="CA">Canada</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
                                    value={filters.startDate}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                />
                                <input
                                    type="date"
                                    className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
                                    value={filters.endDate}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Professional Data Grid */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="py-5 px-8 text-[11px] font-bold uppercase tracking-wider text-slate-400">Panelist</th>
                                        <th className="py-5 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">Account Status</th>
                                        <th className="py-5 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">Registration Date</th>
                                        <th className="py-5 px-8 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Lifetime Yield</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(users || []).map((user) => {
                                        const safeDate = user.created_at ? new Date(user.created_at) : null;
                                        return (
                                            <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                                                <td className="py-5 px-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-11 h-11 rounded-full bg-slate-100 p-[1px] shadow-sm">
                                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=random&color=fff&bold=true`} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name || 'Anonymous Member'}</span>
                                                            <span className="text-xs text-slate-400 font-medium">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <div className={`
                                                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                        ${user.status?.toLowerCase() === 'active'
                                                            ? 'bg-emerald-50 text-emerald-600'
                                                            : 'bg-slate-100 text-slate-500'}
                                                    `}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${user.status?.toLowerCase() === 'active' ? 'bg-emerald-500 shadow-sm' : 'bg-slate-300'}`} />
                                                        {user.status || 'Active'}
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6">
                                                    <span className="text-xs font-semibold text-slate-400">
                                                        {safeDate && !isNaN(safeDate)
                                                            ? safeDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                                            : 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-8 text-right">
                                                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                                                        ${parseFloat(user.lifetime_earnings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {users.length === 0 && (
                                <div className="py-24 text-center text-slate-300 text-sm font-semibold uppercase tracking-widest bg-slate-50/20">
                                    No records found in the directory
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="leaderboard"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-10"
                    >
                        {/* Refined Leaderboard Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {leaderboard.map((user, idx) => (
                                <div
                                    key={user.id}
                                    className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center relative overflow-hidden"
                                >
                                    {/* Subtle Rank Indicator */}
                                    <div className="absolute top-6 right-8 text-4xl font-black text-slate-50/50">
                                        {idx + 1}
                                    </div>

                                    <div className="relative mb-8">
                                        <div className={`w-28 h-28 rounded-full p-1.5 ${idx === 0 ? 'bg-indigo-100 shadow-inner' : 'bg-slate-100 shadow-inner'}`}>
                                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-sm">
                                                <img src={`https://ui-avatars.com/api/?name=${user.first_name || 'U'}&background=6366F1&color=fff&bold=true`} alt="Avatar" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        {idx === 0 && (
                                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                                                <Crown className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-1 mb-8">
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">{user.name || user.first_name || 'Anonymous'}</h3>
                                        <div className="flex items-center justify-center gap-1.5">
                                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                                                {user.country || 'Global'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full py-6 bg-slate-50 rounded-2xl mb-8 flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Lifetime Earnings</span>
                                        <span className="text-2xl font-bold text-slate-900 tabular-nums">
                                            ${parseFloat(user.earnings || user.lifetime_earnings || 0).toLocaleString()}
                                        </span>
                                    </div>

                                    <button className="w-full py-4 rounded-xl text-xs font-bold transition-all bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center gap-2">
                                        View Profile <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;
