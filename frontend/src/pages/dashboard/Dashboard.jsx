import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Compass,
    Wallet,
    User,
    LayoutGrid,
    Search,
    Bell,
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.png';

// Import Tab Components
import HomeTab from '../../components/dashboard/tabs/HomeTab';
import DiscoverTab from '../../components/dashboard/tabs/DiscoverTab';
import WalletTab from '../../components/dashboard/tabs/WalletTab';
import ProfileTab from '../../components/dashboard/tabs/ProfileTab';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('home');

    // Render helper
    const renderContent = () => {
        switch (activeTab) {
            case 'home': return <HomeTab />;
            case 'discover': return <DiscoverTab />;
            case 'wallet': return <WalletTab />;
            case 'profile': return <ProfileTab />;
            default: return <HomeTab />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-display transition-colors duration-500">
            {/* 1. Sidebar (Desktop Only) */}
            <aside className="hidden lg:flex w-20 xl:w-[280px] flex-col bg-[#0F1E3A] border-r border-white/5 z-30 transition-all duration-500 overflow-hidden relative">
                {/* Decorative background glows */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-20%] w-[120%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full" />
                    <div className="absolute bottom-[-5%] right-[-10%] w-[80%] h-[30%] bg-cyan-500/5 blur-[80px] rounded-full" />
                </div>

                <div className="p-8 relative z-10 flex items-center gap-3">
                    <img src={logo} alt="RealSays" className="h-8 w-auto brightness-0 invert" />
                    <span className="text-white font-bold text-xl tracking-tighter xl:block lg:hidden">RealSays</span>
                </div>

                <nav className="flex-1 flex flex-col gap-1.5 p-4 relative z-10">
                    <SidebarLink icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                    <SidebarLink icon={<Compass />} label="Discover" active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} />
                    <SidebarLink icon={<Wallet />} label="Wallet" active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
                    <SidebarLink icon={<User />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                </nav>

                <div className="p-6 border-t border-white/5 space-y-4 relative z-10">
                    <SidebarLink icon={<Settings />} label="Settings" />
                    <div className="group px-4 py-3 rounded-2xl cursor-pointer hover:bg-white/5 transition-all flex items-center justify-between">
                        <div
                            onClick={() => setActiveTab('profile')}
                            className="flex items-center gap-4 flex-1 truncate"
                        >
                            <div className="w-9 h-9 min-w-[36px] rounded-full bg-gradient-to-tr from-[#5B6CFF] to-[#4FD1E8] border border-white/20 shadow-lg flex items-center justify-center text-[11px] text-white font-black uppercase">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex flex-col xl:block lg:hidden truncate">
                                <p className="text-sm font-bold text-white leading-tight truncate">{user?.name || 'Explorer'}</p>
                                <p className="text-[10px] text-white/40 font-medium truncate uppercase tracking-widest mt-0.5">Verified User</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="xl:block lg:hidden p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-y-auto">
                {/* Header / Search Bar */}
                <header className="sticky top-0 p-6 lg:p-8 flex items-center justify-between z-20 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 lg:border-none">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-full max-w-md relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#5B6CFF] transition-colors" />
                            <input
                                type="text"
                                placeholder="Command your insights..."
                                className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5B6CFF]/10 focus:border-[#5B6CFF]/30 transition-all placeholder:text-slate-300 shadow-sm shadow-blue-500/5 text-sm font-medium"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all relative">
                            <Bell className="w-5 h-5 text-slate-500" />
                            <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#5B6CFF] rounded-full border-2 border-white" />
                        </button>
                    </div>
                </header>

                <div className="p-6 lg:p-10 pt-2 lg:pt-2 max-w-7xl mx-auto w-full pb-32 lg:pb-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 25
                            }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Mobile Bottom Tab Bar */}
                <nav className="fixed bottom-6 left-6 right-6 h-20 bg-[#0F1E3A]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] flex lg:hidden items-center justify-around px-6 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                    <MobileNavLink icon={<Home />} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                    <MobileNavLink icon={<Compass />} active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} />
                    <MobileNavLink icon={<Wallet />} active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
                    <MobileNavLink icon={<User />} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                </nav>
            </main>
        </div>
    );
};

const SidebarLink = ({ icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-500 relative group overflow-hidden ${active ? '' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
    >
        {active && (
            <motion.div
                layoutId="navGlow"
                className="absolute inset-0 bg-gradient-to-r from-[#5B6CFF] to-[#4FD1E8] shadow-[0_0_20px_rgba(91,108,255,0.4)]"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        )}

        <div className={`relative z-10 transition-transform duration-500 ${active ? 'scale-110 text-white' : 'group-hover:scale-110'}`}>
            {React.cloneElement(icon, { size: 22, strokeWidth: active ? 2.5 : 2 })}
        </div>

        <span className={`relative z-10 text-sm font-bold tracking-tight xl:block lg:hidden transition-all duration-500 ${active ? 'text-white' : 'opacity-60 group-hover:opacity-100'}`}>
            {label}
        </span>

        {active && (
            <motion.div
                layoutId="activeDot"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-white relative z-10 xl:block lg:hidden shadow-[0_0_10px_#fff]"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        )}
    </div>
);

const MobileNavLink = ({ icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`relative p-4 flex flex-col items-center justify-center gap-1 transition-all ${active ? 'text-white' : 'text-white/30'}`}
    >
        <div className="relative z-10">
            {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })}
        </div>
        {active && (
            <motion.div
                layoutId="mobileActiveGlow"
                className="absolute inset-0 bg-gradient-to-tr from-[#5B6CFF] to-[#4FD1E8] rounded-full blur-xl opacity-30"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.3, scale: 1.2 }}
            />
        )}
    </button>
);

export default Dashboard;
