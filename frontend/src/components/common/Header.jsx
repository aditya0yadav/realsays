import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { Wallet, Lock } from 'lucide-react';

const Header = () => {
    const isAuthenticated = false;
    const userBalance = 0.00;

    return (
        <header className="w-full bg-white border-b border-gray-200 h-20 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
                {/* Left Side: Institutional Branding */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center gap-2 text-slate-900 no-underline hover:opacity-90">
                        <img src={logo} alt="RealSays" className="h-10 w-auto" />
                        <span className="hidden sm:inline-block text-gray-500 text-sm font-medium border-l border-gray-300 pl-2 ml-2">
                            Official Research Platform
                        </span>
                    </Link>
                </div>

                {/* Right Side: User Control */}
                <div className="flex items-center gap-2 md:gap-6">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2 md:gap-6">
                            <div className="flex items-center gap-2 md:gap-3 bg-gray-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-gray-100 shadow-sm">
                                <Wallet className="h-4 w-4 md:h-5 md:w-5 text-taobao-primary" />
                                <div className="flex flex-col items-start leading-none">
                                    <span className="hidden md:block text-[10px] text-gray-500 font-medium uppercase tracking-wide mb-0.5">My Rewards</span>
                                    <span className="text-sm md:text-lg font-bold text-taobao-primary">${userBalance.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                                US
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Mobile Login Button */}
                            <Link
                                to="/login"
                                className="md:hidden flex items-center gap-2 border-2 border-orange-500 rounded-full px-4 py-1.5 transition-all active:scale-95"
                                style={{ textDecoration: 'none' }}
                            >
                                <Lock className="h-4 w-4 text-orange-500" />
                                <span className="text-sm font-bold text-orange-500">Login</span>
                            </Link>

                            {/* Desktop Buttons */}
                            <Link
                                to="/login"
                                className="hidden md:block text-xs md:text-sm font-medium text-slate-900 hover:bg-gray-50 border border-slate-300 rounded-full px-3 py-1.5 md:px-5 md:py-2 transition-colors"
                                style={{ textDecoration: 'none' }}
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="hidden md:block text-xs md:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full px-4 py-1.5 md:px-6 md:py-2 shadow-sm transition-colors"
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
