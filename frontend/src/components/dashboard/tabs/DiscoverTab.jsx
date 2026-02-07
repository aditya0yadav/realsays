import React from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, Sparkles, ArrowRight } from 'lucide-react';

const DiscoverTab = () => {
    const featuredSurveys = [
        { id: 1, title: 'AI Ethics in Social Media', reward: '$5.00', duration: '10 min', category: 'Technology' },
        { id: 2, title: 'Sustainable Fashion Trends', reward: '$3.50', duration: '8 min', category: 'Lifestyle' },
        { id: 3, title: 'Future of Remote Work', reward: '$12.00', duration: '25 min', category: 'Business' },
    ];

    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <h1 className="text-4xl font-sans font-[300] tracking-tight text-slate-900">Discover <span className="text-cyan-600 font-[400]">Insights</span></h1>
                <p className="text-slate-400 font-[400]">Explore new research opportunities and missions.</p>
            </div>

            <div className="relative group max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-600 transition-colors" />
                <input
                    type="text"
                    placeholder="Search surveys by topic or keyword..."
                    className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500/30 transition-all placeholder:text-slate-300 shadow-sm shadow-cyan-500/5"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredSurveys.map((survey, idx) => (
                    <div
                        key={survey.id}
                        className="p-6 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-100 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-lg">{survey.category}</span>
                        </div>
                        <h3 className="text-lg font-sans font-[400] text-slate-900 mb-2 truncate">{survey.title}</h3>
                        <div className="flex items-center justify-between text-slate-400 text-sm mb-6">
                            <span>{survey.duration}</span>
                            <span className="font-bold text-slate-900">{survey.reward}</span>
                        </div>
                        <button className="w-full py-3 rounded-xl bg-slate-50 text-cyan-600 font-bold group-hover:bg-cyan-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
                            Start Survey <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscoverTab;
