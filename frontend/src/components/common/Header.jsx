import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { Wallet, Lock, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const { user, isAuthenticated } = useAuth();
    const userBalance = user?.panelist?.balance || 0;

    const getAvatarUrl = () => {
        const path = user?.avatar_url || user?.panelist?.profile_picture;
        if (!path) return `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || user?.email || 'User'}&backgroundColor=5B6CFF,0F1E3A&fontFamily=Arial&fontSize=40`;

        if (path.startsWith('/uploads')) {
            const { hostname, protocol } = window.location;
            const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || `${protocol}//${hostname}:5000`;
            return `${baseUrl}${path}`;
        }
        return path;
    };

    const avatarUrl = getAvatarUrl();

    return (
        <header className="w-full bg-white border-b border-gray-200 h-20 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
                {/* Left Side: Institutional Branding */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center gap-3 text-[#0F1E3A] no-underline hover:opacity-90">
                        <img src={logo} alt="RealSays" className="h-10 w-auto object-contain" />
                        <span className="hidden sm:inline-block text-gray-400 text-sm font-medium border-l border-gray-200 pl-3 ml-3">
                            Official Research Platform
                        </span>
                    </Link>
                </div>

                {/* Right Side: User Control */}
                <div className="flex items-center gap-2 md:gap-6">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2 md:gap-6">
                            <Link to="/dashboard" className="flex items-center gap-2 md:gap-3 bg-gray-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-gray-100 shadow-sm hover:bg-gray-100 transition-colors no-underline group">
                                <Wallet className="h-4 w-4 md:h-5 md:w-5 text-[#5B6CFF] group-hover:scale-110 transition-transform" />
                                <div className="flex flex-col items-start leading-none">
                                    <span className="hidden md:block text-[10px] text-gray-500 font-medium uppercase tracking-wide mb-0.5">My Rewards</span>
                                    <span className="text-sm md:text-lg font-bold text-[#5B6CFF]">${Number(userBalance).toFixed(2)}</span>
                                </div>
                            </Link>
                            <Link to="/dashboard" className="h-10 w-10 md:h-11 md:w-11 rounded-full bg-slate-100 flex items-center justify-center cursor-pointer relative overflow-hidden ring-1 ring-slate-200 transition-all hover:ring-blue-500/30">
                                <img src={avatarUrl} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Mobile Login Button */}
                            <Link
                                to="/login"
                                className="md:hidden flex items-center gap-2 border-2 border-[#5B6CFF] rounded-full px-4 py-1.5 transition-all active:scale-95"
                                style={{ textDecoration: 'none' }}
                            >
                                <Lock className="h-4 w-4 text-[#5B6CFF]" />
                                <span className="text-sm font-bold text-[#5B6CFF]">Login</span>
                            </Link>

                            {/* Desktop Buttons */}
                            <Link
                                to="/login"
                                className="hidden md:block text-xs md:text-sm font-medium text-[#0F1E3A] hover:bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 md:px-5 md:py-2 transition-colors"
                                style={{ textDecoration: 'none' }}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="hidden md:block text-xs md:text-sm font-bold text-white bg-gradient-to-r from-[#5B6CFF] to-[#4FD1E8] hover:shadow-lg hover:shadow-blue-500/20 rounded-full px-4 py-1.5 md:px-6 md:py-2 shadow-sm transition-all"
                                style={{ textDecoration: 'none' }}
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;