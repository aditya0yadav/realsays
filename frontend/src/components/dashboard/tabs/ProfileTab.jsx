import React from 'react';
import { User, Shield, Bell, Settings, LogOut, Camera } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

const ProfileTab = () => {
    const { user, logout } = useAuth();

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="space-y-1">
                <h1 className="text-4xl font-sans font-[300] tracking-tight text-slate-900">Account <span className="text-slate-500 font-[400]">Settings</span></h1>
                <p className="text-slate-400 font-[400]">Manage your identity and preferences.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-400" />
                <div className="px-8 pb-8 relative">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12 mb-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl">
                                <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 relative overflow-hidden">
                                    <User size={64} />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Camera className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-2">
                            <h2 className="text-2xl font-bold text-slate-900">{user?.name || 'Explorer'}</h2>
                            <p className="text-slate-500 font-medium">{user?.email}</p>
                        </div>
                        <div className="md:ml-auto mb-2 flex gap-3">
                            <button className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:shadow-lg transition-all" onClick={logout}>
                                Sign Out
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preferences</h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all font-medium text-slate-700">
                                    <div className="flex items-center gap-3">
                                        <Bell className="w-5 h-5 text-blue-500" /> Notifications
                                    </div>
                                    <div className="w-10 h-5 bg-blue-600 rounded-full relative p-1">
                                        <div className="w-3 h-3 bg-white rounded-full ml-auto" />
                                    </div>
                                </button>
                                <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all font-medium text-slate-700">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-cyan-500" /> Privacy & Security
                                    </div>
                                    <Settings className="w-5 h-5 text-slate-300" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Data & Privacy</h3>
                            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                                <p className="text-sm font-bold text-blue-700 mb-2">Anonymous Contribution</p>
                                <p className="text-xs text-blue-600/80 leading-relaxed mb-4">
                                    Your personal data is encrypted and separated from your research contributions. Your identity remains private.
                                </p>
                                <button className="text-xs font-bold text-blue-700 hover:underline">Learn more about privacy</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
