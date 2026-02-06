import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Home,
    Compass,
    Wallet,
    User,
    TrendingUp,
    Clock,
    ChevronRight,
    Zap,
    LayoutGrid,
    Search,
    Bell,
    Settings,
    DollarSign,
    PieChart,
    Activity
} from 'lucide-react';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('home');

    // Stats data - Updated for Light Theme
    const stats = [
        { label: 'Total Earnings', value: '$1,240.50', change: '+12.5%', icon: <DollarSign className="w-5 h-5" />, theme: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' } },
        { label: 'Surveys Completed', value: '42', change: '+4', icon: <Activity className="w-5 h-5" />, theme: { text: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' } },
        { label: 'Active Missions', value: '7', change: 'New', icon: <Zap className="w-5 h-5" />, theme: { text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' } },
        { label: 'Impact Score', value: '850', change: '+20', icon: <TrendingUp className="w-5 h-5" />, theme: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' } },
    ];

    // Activity feed
    const activities = [
        { title: 'Market Sentiment Survey', status: 'Completed', reward: '+$15.00', time: '2h ago' },
        { title: 'Tech Trends Discussion', status: 'Pending', reward: '+$25.00', time: '5h ago' },
        { title: 'Brand Loyalty Analysis', status: 'Completed', reward: '+$10.00', time: '1d ago' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans">
            {/* 1. Sidebar (Desktop Only) */}
            <aside className="hidden lg:flex w-20 xl:w-64 flex-col border-r border-slate-200 bg-white z-30 transition-all duration-500 overflow-hidden">
                <div className="p-8">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl shadow-lg shadow-blue-500/20" />
                </div>

                <nav className="flex-1 flex flex-col gap-2 p-4">
                    <SidebarLink icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                    <SidebarLink icon={<Compass />} label="Discover" active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} />
                    <SidebarLink icon={<Wallet />} label="Wallet" active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
                    <SidebarLink icon={<User />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                </nav>

                <div className="p-6 border-t border-slate-100 space-y-4">
                    <SidebarLink icon={<Settings />} label="Settings" />
                    <div className="flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 border border-white shadow-sm" />
                        <span className="text-sm font-[600] text-slate-700 opacity-0 xl:opacity-100 transition-opacity">Alex Rivera</span>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-y-auto">
                {/* Header / Search Bar */}
                <header className="sticky top-0 p-6 lg:p-8 flex items-center justify-between z-20 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 lg:border-none">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-full max-w-md relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search insights..."
                                className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all relative">
                            <Bell className="w-5 h-5 text-slate-500 outline-none" />
                            <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
                        </button>
                        <button className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200">
                            <LayoutGrid className="w-5 h-5 text-slate-500 outline-none" />
                        </button>
                    </div>
                </header>

                <div className="p-6 lg:p-10 pt-2 lg:pt-2 max-w-7xl mx-auto w-full space-y-8">
                    {/* Welcome Section */}
                    <div className="space-y-1">
                        <h1 className="text-4xl font-sans font-[300] tracking-tight text-slate-900">System Status: <span className="text-blue-600">Optimal</span></h1>
                        <p className="text-slate-400 font-[400]">Tracking your research impact across the decentralized web.</p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Summary Cards */}
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm shadow-blue-500/5 group hover:border-blue-100 hover:shadow-md transition-all relative overflow-hidden"
                            >
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-2xl ${stat.theme.bg} ${stat.theme.border} ${stat.theme.text}`}>
                                        {stat.icon}
                                    </div>
                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${stat.theme.bg} ${stat.theme.text} ${stat.theme.border}`}>
                                        {stat.change}
                                    </span>
                                </div>
                                <div className="space-y-1 relative z-10">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    <h3 className="text-3xl font-sans font-[400] tracking-tighter text-slate-900">{stat.value}</h3>
                                </div>
                            </motion.div>
                        ))}

                        {/* Large Chart Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="col-span-1 md:col-span-2 lg:col-span-3 p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm shadow-blue-500/5 relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-sans font-[400] tracking-tight text-slate-900 flex items-center gap-2">
                                        Earnings Trend <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                    </h3>
                                    <p className="text-slate-400 text-sm font-[400]">Real-time revenue visualization</p>
                                </div>
                                <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all">
                                    <option>Last 7 Days</option>
                                    <option>Monthly</option>
                                </select>
                            </div>

                            {/* Simulated Area Chart */}
                            <div className="h-64 w-full relative">
                                <svg viewBox="0 0 1000 300" className="w-full h-full preserve-3d">
                                    <defs>
                                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 2, ease: "easeInOut" }}
                                        d="M0,250 C100,220 200,280 300,150 C400,180 500,80 600,120 C700,100 800,200 1000,50 L1000,300 L0,300 Z"
                                        fill="url(#chartGrad)"
                                    />
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 2, ease: "easeInOut" }}
                                        d="M0,250 C100,220 200,280 300,150 C400,180 500,80 600,120 C700,100 800,200 1000,50"
                                        stroke="#2563EB"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        fill="none"
                                    />
                                </svg>
                                {/* Floating Tooltip Shadow */}
                                <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                            </div>
                        </motion.div>

                        {/* Recent Activity Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm shadow-blue-500/5 flex flex-col"
                        >
                            <h3 className="text-xl font-sans font-[400] text-slate-800 mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-cyan-500" /> Activity
                            </h3>
                            <div className="space-y-4 flex-1">
                                {activities.map((act, i) => (
                                    <div key={i} className="group p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:border-blue-100 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-[600] text-slate-700 tracking-tight truncate pr-4">{act.title}</span>
                                            <span className="text-blue-600 text-sm font-bold leading-none">{act.reward}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">{act.status}</span>
                                            <span className="text-[10px] font-medium text-slate-300">{act.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-6 w-full py-4 rounded-2xl bg-slate-50 text-blue-600 text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                                View History <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile Bottom Tab Bar */}
                <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-3xl border-t border-slate-100 flex lg:hidden items-center justify-around px-6 z-50">
                    <MobileNavLink icon={<Home />} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                    <MobileNavLink icon={<Compass />} active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} />
                    <MobileNavLink icon={<Wallet />} active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
                    <MobileNavLink icon={<User />} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                </nav>
            </main>

            <style jsx>{`
                . shadow-soft {
                    box-shadow: inset 0 0 20px 0 rgba(255,255,255,0.05);
                }
            `}</style>
        </div>
    );
};

const SidebarLink = ({ icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300 group ${active ? 'bg-blue-600 shadow-lg shadow-blue-500/20 text-white' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
    >
        <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
            {React.cloneElement(icon, { size: active ? 24 : 22, strokeWidth: active ? 2.5 : 2 })}
        </div>
        <span className={`text-sm font-[600] tracking-tight xl:block lg:hidden transition-opacity ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
            {label}
        </span>
        {active && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 xl:block lg:hidden animate-pulse" />
        )}
    </div>
);

const MobileNavLink = ({ icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`relative p-4 flex flex-col items-center justify-center gap-1 transition-all ${active ? 'text-blue-600' : 'text-slate-400'}`}
    >
        <div className="relative">
            {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })}
            {active && (
                <motion.div
                    layoutId="activeGlow"
                    className="absolute -inset-4 bg-blue-600/10 rounded-full blur-xl -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                />
            )}
        </div>
    </button>
);

export default Dashboard;
