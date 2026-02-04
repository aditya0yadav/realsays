import React, { useState, useEffect } from 'react';
import banner from '../../assets/hero_banner.png';
import panel from "../../assets/panel.png";
import panel3 from "../../assets/panel3.png";

const Hero = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.pageYOffset);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div className='w-full bg-blue-600 border-b border-blue-700 h-10 shadow-sm'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center'>
                    <div className='flex items-center'>
                        <span className='text-white text-sm font-medium border-l border-white pl-2 ml-2'>
                            Trusted by leading organizations worldwide
                        </span>
                    </div>
                </div>
            </div>
            <section className="px-[3%] py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">

                {/* Background decoration */}
                <div className="absolute -top-1/2 -right-[10%] w-[800px] h-[800px] bg-gradient-radial from-orange-50/40 to-transparent rounded-full opacity-40 pointer-events-none" />

                <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center max-w-[1400px] mx-auto relative z-10">

                    {/* Left Column - Text */}
                    <div>
                        {/* Welcome Guest - Sequential Animation */}
                        <div className="flex gap-2 mb-4">
                            <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm animate-slide-in-left inline-block opacity-0" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
                                Welcome
                            </span>
                            <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm animate-slide-in-left inline-block opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                                Guest
                            </span>
                        </div>

                        {/* Heading - Each word appears one by one */}
                        <h1 className="text-5xl lg:text-[4rem] font-bold leading-tight mb-6 text-slate-900 tracking-tight flex flex-wrap gap-x-3">
                            <span className="animate-slide-up inline-block opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                                Monetize
                            </span>
                            <span className="animate-slide-up inline-block opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                                Your
                            </span>
                            <span className="animate-slide-up inline-block opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
                                Online
                            </span>
                            <span className="animate-slide-up inline-block opacity-0" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
                                Time
                            </span>
                            <span className="animate-slide-up inline-block opacity-0" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
                                With
                            </span>

                            {/* Free Surveys with underline */}
                            <span className="relative inline-block">
                                <span
                                    className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#9EDAEF] to-[#1F6AE1] animate-slide-up inline-block opacity-0"
                                    style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}
                                >
                                    Free Surveys
                                </span>

                                {/* SVG underline - Fixed shape and animation */}
                                <svg
                                    className="absolute -bottom-2 left-0 w-full h-[20px] pointer-events-none"
                                    viewBox="0 0 280 20"
                                    preserveAspectRatio="none"
                                >
                                    <defs>
                                        <linearGradient id="heroUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#9EDAEF" />
                                            <stop offset="100%" stopColor="#1F6AE1" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M5 15 Q70 12 140 10 T275 8"
                                        stroke="url(#heroUnderline)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        fill="none"
                                        className="animate-draw-line opacity-0"
                                        style={{
                                            animationDelay: '1100ms',
                                            animationFillMode: 'forwards',
                                            strokeDasharray: '1000',
                                            strokeDashoffset: '1000'
                                        }}
                                    />
                                </svg>
                            </span>
                        </h1>

                        {/* Description - appears after heading */}
                        <p className="text-xl lg:text-2xl leading-relaxed text-gray-600 mb-8 animate-fade-in opacity-0" style={{ animationDelay: '1300ms', animationFillMode: 'forwards' }}>
                            Fill and earn money from surveys with <span className="text-slate-900 font-semibold">RealSays</span>. You might boost market research today with your opinion.
                        </p>

                        {/* Buttons - appear after description */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <button className="group w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg text-white bg-gradient-to-r from-[#9EDAEF] to-[#1F6AE1] shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 relative overflow-hidden animate-fade-in opacity-0" style={{ animationDelay: '1500ms', animationFillMode: 'forwards' }}>
                                <span className="relative z-10">Start Earning</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#1F6AE1] to-[#9EDAEF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>

                            <button className="group w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg bg-clip-text bg-gradient-to-r from-[#9EDAEF] to-[#1F6AE1] ring-2 ring-inset ring-gray-300 transition-all duration-300 hover:ring-blue-400 hover:-translate-y-1 hover:scale-105 hover:shadow-lg relative overflow-hidden animate-fade-in opacity-0" style={{ animationDelay: '1650ms', animationFillMode: 'forwards' }}>
                                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#9EDAEF] to-[#1F6AE1]">How it Works</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-orange-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10 rounded-full" />
                            </button>
                        </div>

                    </div>

                    <div
                        className="relative hidden lg:flex items-center justify-end"
                        style={{ transform: `translateY(${scrollY * 0.08}px)` }}
                    >
                        <div className="relative w-full max-w-[800px] animate-fade-in-right opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                            {/* Soft glow behind image */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 to-orange-100/40 blur-3xl rounded-full scale-110 animate-pulse-slow" />

                            <img
                                src={banner}
                                alt="Market Research Panel"
                                className="relative w-full h-auto object-cover drop-shadow-2xl animate-float-slow"
                            />

                            {/* Trust Badge / Tooltip */}
                            <div className="absolute -left-12 top-1/4 animate-float opacity-0" style={{ animationDelay: '1400ms', animationFillMode: 'forwards' }}>
                                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 whitespace-nowrap hover:scale-105 transition-transform duration-300">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#9EDAEF] to-[#1F6AE1] flex items-center justify-center text-white shadow-lg">
                                        <span className="font-bold text-sm">10+</span>
                                    </div>
                                    <div>
                                        <p className="text-slate-900 font-bold text-sm">Trusted Experience</p>
                                        <p className="text-slate-500 text-xs">10 years in the field</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom badge */}
                            <div className="absolute -right-8 bottom-1/4 animate-float opacity-0" style={{ animationDelay: '1700ms', animationFillMode: 'forwards' }}>
                                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 hover:scale-105 transition-transform duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-slate-900 font-bold text-sm">Verified Platform</p>
                                            <p className="text-slate-500 text-xs">100% Secure</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Section 2: Commitments */}
            <section className="px-[5%] py-24 bg-white relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-50/50 rounded-full blur-[100px] animate-pulse-slow" />
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-50/30 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                </div>

                <div className="max-w-[1400px] mx-auto w-full relative z-10">
                    {/* Header Section */}
                    <div className="text-center mb-16 px-4">
                        <h2 className="text-blue-600 font-bold uppercase tracking-[0.2em] text-sm mb-4 animate-slide-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                            Our Promise
                        </h2>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight animate-slide-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                            We Stand by Our Commitments
                        </h1>
                        <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
                            Online surveys, chosen just for you, make earning rewards easy. No delays, zero conflicts.
                            Share your voice and start earning today. All this is possible in one place — <span className="text-blue-600 font-semibold underline decoration-blue-200 decoration-2 underline-offset-4">RealSays</span>.
                        </p>
                    </div>

                </div>
            </section>

            {/* Section 3: Paid Community */}
            <section className="px-[5%] py-24 bg-gradient-to-br from-orange-50/50 via-white to-blue-50/30 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/20 rounded-full blur-[150px] animate-orbital-float" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/10 rounded-full blur-[120px] animate-orbital-float-reverse" />
                </div>

                <div className="max-w-[1400px] mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                        {/* Left Column - Text Content */}
                        <div className="space-y-10 animate-fade-in opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
                            <div className="space-y-4">
                                <h2 className="text-orange-500 font-bold uppercase tracking-widest text-sm">
                                    Community Impact
                                </h2>
                                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.15] tracking-tight">
                                    We've Paid Our Community Over <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                                        $14,320
                                    </span>
                                </h1>
                            </div>

                            <div className="space-y-6">
                                <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                                    Whether you're a student, a professional, or a homemaker, <span className="text-slate-900 font-medium">RealSays</span> is the perfect space to monetize your opinions.
                                </p>
                                <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                                    Share your insights in your preferred language and grab quick rewards. Every voice matters in our growing global community.
                                </p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="h-16 w-[2px] bg-gradient-to-b from-orange-500 to-transparent opacity-30" />
                                <p className="text-slate-500 font-medium italic">
                                    "Join thousands of users turning their spare time into real earnings."
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Illustration */}
                        <div className="relative flex items-center justify-center lg:justify-end animate-fade-in-right opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>

                            {/* Decorative Floating Elements (Depth) */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-10 right-0 w-20 h-20 bg-orange-100/50 rounded-2xl rotate-12 blur-sm animate-float z-0" />
                                <div className="absolute bottom-10 left-10 w-16 h-16 bg-blue-100/40 rounded-full animate-float z-30" style={{ animationDelay: '1.5s' }} />
                            </div>

                            <div className="relative w-full max-w-[650px] group">
                                {/* Enhanced Layered Glow */}
                                <div className="absolute -inset-10 bg-orange-500/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="absolute inset-10 bg-blue-500/5 blur-[80px] rounded-full" />

                                <div className="relative transform transition-all duration-700 group-hover:scale-[1.02] group-hover:-translate-y-2">
                                    <img
                                        src={panel3}
                                        alt="Paid Community Illustration"
                                        className="relative w-full h-auto drop-shadow-[0_32px_64px_rgba(0,0,0,0.12)] animate-float-slow"
                                    />

                                    {/* Glassmorphism over-image badge */}
                                    <div className="absolute -bottom-6 -left-6 bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white flex flex-col items-center animate-float z-40">
                                        <div className="text-orange-500 font-bold text-2xl mb-1">98%</div>
                                        <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Happy Users</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slide-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes draw-line {
                    from {
                        opacity: 0;
                        stroke-dashoffset: 1000;
                    }
                    to {
                        opacity: 1;
                        stroke-dashoffset: 0;
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-15px);
                    }
                }

                @keyframes float-slow {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-10px) rotate(1deg);
                    }
                }

                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 0.4;
                        transform: scale(1.1);
                    }
                    50% {
                        opacity: 0.6;
                        transform: scale(1.15);
                    }
                }

                @keyframes orbital-float {
                    0% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                }

                @keyframes orbital-float-reverse {
                    0% {
                        transform: translate(0, 0) scale(1);
                    }
                    33% {
                        transform: translate(-40px, 30px) scale(0.95);
                    }
                    66% {
                        transform: translate(25px, -45px) scale(1.05);
                    }
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }

                .animate-fade-in-right {
                    animation: fade-in-right 1s ease-out;
                }

                .animate-slide-in-left {
                    animation: slide-in-left 0.6s ease-out;
                }

                .animate-slide-up {
                    animation: slide-up 0.5s ease-out;
                }

                .animate-draw-line {
                    animation: draw-line 1s ease-out;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-float-slow {
                    animation: float-slow 6s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
            `}</style>
        </>
    );
};

export default Hero;