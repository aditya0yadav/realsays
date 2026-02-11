import {
    DollarSign,
    Activity,
    Zap,
    TrendingUp,
    Clock,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const HomeTab = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Total Earnings', value: '$1,240.50', change: '+12.5%', icon: <DollarSign className="w-5 h-5" />, theme: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' } },
        { label: 'Surveys Completed', value: '42', change: '+4', icon: <Activity className="w-5 h-5" />, theme: { text: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100' } },
        { label: 'Active Missions', value: '7', change: 'New', icon: <Zap className="w-5 h-5" />, theme: { text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' } },
        { label: 'Impact Score', value: '850', change: '+20', icon: <TrendingUp className="w-5 h-5" />, theme: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' } },
    ];

    const activities = [
        { title: 'Market Sentiment Survey', status: 'Completed', reward: '+$15.00', time: '2h ago' },
        { title: 'Tech Trends Discussion', status: 'Pending', reward: '+$25.00', time: '5h ago' },
        { title: 'Brand Loyalty Analysis', status: 'Completed', reward: '+$10.00', time: '1d ago' },
    ];

    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <h1 className="text-4xl font-sans font-[300] tracking-tight text-slate-900">
                    Welcome back, <span className="text-blue-600 font-[400]">{user?.name || 'Explorer'}</span>
                </h1>
                <p className="text-slate-400 font-[400]">System Status: <span className="text-blue-500 font-bold uppercase text-[10px] tracking-widest ml-1">Optimal</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
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
                    </div>
                ))}

                <div
                    className="col-span-1 md:col-span-2 lg:col-span-3 p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm shadow-blue-500/5 relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-sans font-[400] tracking-tight text-slate-900 flex items-center gap-2">
                                Earnings Trend <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            </h3>
                            <p className="text-slate-400 text-sm font-[400]">Real-time revenue visualization</p>
                        </div>
                    </div>

                    <div className="h-64 w-full relative">
                        <svg viewBox="0 0 1000 300" className="w-full h-full preserve-3d">
                            <defs>
                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,250 C100,220 200,280 300,150 C400,180 500,80 600,120 C700,100 800,200 1000,50 L1000,300 L0,300 Z"
                                fill="url(#chartGrad)"
                            />
                            <path
                                d="M0,250 C100,220 200,280 300,150 C400,180 500,80 600,120 C700,100 800,200 1000,50"
                                stroke="#2563EB"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </svg>
                        <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                    </div>
                </div>

                <div
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
                </div>
            </div>
        </div>
    );
};

export default HomeTab;
