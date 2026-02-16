import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Compass,
    Wallet,
    User,
    Settings,
    LogOut,
    Search
} from 'lucide-react';
import logo from '../../assets/logo.png';

const Sidebar = ({ activeTab, setActiveTab, user, logout }) => {
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    return (
        <aside className="hidden lg:flex w-20 xl:w-[280px] flex-col bg-[#0F1E3A] border-r border-white/5 z-30 transition-all duration-500 overflow-hidden relative">
            {/* Decorative background glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-20%] w-[120%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-5%] right-[-10%] w-[80%] h-[30%] bg-cyan-500/5 blur-[80px] rounded-full" />
            </div>

            <div className="p-8 relative z-10 flex items-center gap-3">
                <img src={logo} alt="RealSays" className="h-8 w-auto brightness-0 invert" />
            </div>

            <div className="px-4 mb-4 relative z-10">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#5B6CFF] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5B6CFF]/30 focus:border-[#5B6CFF]/50 transition-all placeholder:text-white/20 text-xs font-medium text-white"
                    />
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-1.5 p-4 relative z-10">
                <SidebarLink icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                <SidebarLink icon={<Compass />} label="Discover" active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} />
                <SidebarLink icon={<Wallet />} label="Wallet" active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
                <SidebarLink icon={<User />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            </nav>

            <div className="p-6 border-t border-white/5 space-y-4 relative z-10">

                <div className="group px-4 py-3 rounded-2xl cursor-pointer hover:bg-white/5 transition-all flex items-center justify-between">
                    <div
                        onClick={() => setActiveTab('profile')}
                        className="flex items-center gap-4 flex-1 truncate"
                    >
                        <div className="w-9 h-9 min-w-[36px] rounded-full bg-gradient-to-tr from-[#5B6CFF] to-[#4FD1E8] border border-white/20 shadow-lg flex items-center justify-center text-[11px] text-white font-black uppercase overflow-hidden">
                            {user?.avatar_url ? (
                                <img
                                    src={user.avatar_url.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.avatar_url}` : user.avatar_url}
                                    alt={user?.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                user?.name?.charAt(0) || 'U'
                            )}
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

export default Sidebar;
