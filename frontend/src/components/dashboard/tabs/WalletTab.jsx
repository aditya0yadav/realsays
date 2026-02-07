import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, History, CreditCard } from 'lucide-react';

const WalletTab = () => {
    const transactions = [
        { id: 1, type: 'earned', title: 'Market Survey Reward', amount: '+$15.00', date: 'Feb 5, 2026' },
        { id: 2, type: 'withdrawn', title: 'Transfer to PayPal', amount: '-$50.00', date: 'Feb 3, 2026' },
        { id: 3, type: 'earned', title: 'Brand Mission Bonus', amount: '+$5.00', date: 'Feb 1, 2026' },
    ];

    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <h1 className="text-4xl font-sans font-[300] tracking-tight text-slate-900">Your <span className="text-indigo-600 font-[400]">Wallet</span></h1>
                <p className="text-slate-400 font-[400]">Manage your earnings and secure payouts.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Wallet size={120} />
                        </div>
                        <p className="text-indigo-100 font-medium mb-2 uppercase tracking-widest text-xs">Total Balance</p>
                        <h2 className="text-5xl font-sans font-[400] tracking-tighter mb-8">$1,240.50</h2>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 rounded-xl bg-white text-indigo-600 font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all">
                                <ArrowDownLeft className="w-4 h-4" /> Withdraw
                            </button>
                            <button className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold flex items-center gap-2 hover:bg-white/20 transition-all">
                                <History className="w-4 h-4" /> History
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                        <h3 className="text-xl font-sans font-[400] text-slate-900 mb-6 flex items-center gap-2">
                            <History className="w-5 h-5 text-indigo-500" /> Recent Transactions
                        </h3>
                        <div className="space-y-4">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl ${tx.type === 'earned' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {tx.type === 'earned' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700 text-sm">{tx.title}</p>
                                            <p className="text-xs text-slate-400">{tx.date}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold ${tx.type === 'earned' ? 'text-green-600' : 'text-slate-900'}`}>{tx.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                        <h3 className="text-xl font-sans font-[400] text-slate-900 mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-indigo-500" /> Payout Method
                        </h3>
                        <div className="p-4 border-2 border-indigo-500 bg-indigo-50/30 rounded-2xl mb-4">
                            <p className="text-xs font-bold text-indigo-600 uppercase mb-1">Primary Method</p>
                            <p className="font-bold text-slate-900">PayPal</p>
                            <p className="text-sm text-slate-500">alex****@email.com</p>
                        </div>
                        <button className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">
                            Add New Method
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletTab;
