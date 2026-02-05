import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus, Search, DollarSign, Trophy, ShieldCheck } from 'lucide-react';
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
            <div className='w-full bg-[#5B6CFF] border-b border-blue-700 h-10 shadow-sm'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center'>
                    <div className='flex items-center'>
                        <span className='text-white text-sm font-medium border-l border-white pl-2 ml-2'>
                            Trusted by leading organizations worldwide
                        </span>
                    </div>
                </div>
            </div>
            <section className="px-[3%] py-20 lg:py-24 bg-white relative overflow-hidden">

                {/* Background decoration */}
                <div className="absolute -top-1/2 -right-[10%] w-[800px] h-[800px] bg-gradient-radial from-orange-50/40 to-transparent rounded-full opacity-40 pointer-events-none" />

                <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center max-w-[1400px] mx-auto relative z-10">

                    {/* Left Column - Text */}
                    <div>
                        {/* Welcome Guest - Sequential Animation */}
                        <div className="flex gap-2 mb-4">
                            <span className="text-[#5B6CFF] font-semibold uppercase tracking-wider text-sm animate-slide-in-left inline-block opacity-0" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
                                Welcome
                            </span>
                            <span className="text-[#5B6CFF] font-semibold uppercase tracking-wider text-sm animate-slide-in-left inline-block opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
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
                                    className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#5B6CFF] to-[#4FD1E8] animate-slide-up inline-block opacity-0"
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
                                            <stop offset="0%" stopColor="#5B6CFF" />
                                            <stop offset="100%" stopColor="#4FD1E8" />
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
                        <p className="text-xl lg:text-2xl leading-relaxed text-[#0F1E3A]/70 mb-8 animate-fade-in opacity-0" style={{ animationDelay: '1300ms', animationFillMode: 'forwards' }}>
                            Fill and earn money from surveys with <span className="text-[#0F1E3A] font-semibold">RealSays</span>. You might boost market research today with your opinion.
                        </p>

                        {/* Buttons - appear after description */}
                        <div className="flex flex-row flex-wrap gap-4 items-center justify-center lg:justify-start">
                            <Link
                                to="/signup"
                                className="group px-7 py-4 rounded-full font-bold text-lg text-white bg-gradient-to-r from-[#5B6CFF] to-[#4FD1E8] shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 relative overflow-hidden animate-fade-in opacity-0"
                                style={{ animationDelay: '1500ms', animationFillMode: 'forwards', textDecoration: 'none' }}
                            >
                                <span className="relative z-10">Start Earning</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#4FD1E8] to-[#5B6CFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>

                            <a
                                href="#how-it-works"
                                className="group px-7 py-4 rounded-full font-bold text-lg bg-clip-text bg-gradient-to-r from-[#5B6CFF] to-[#4FD1E8] ring-2 ring-inset ring-[#0F1E3A]/10 transition-all duration-300 hover:ring-[#4FD1E8] hover:-translate-y-1 hover:scale-105 hover:shadow-lg relative overflow-hidden animate-fade-in opacity-0"
                                style={{ animationDelay: '1650ms', animationFillMode: 'forwards', textDecoration: 'none' }}
                            >
                                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#5B6CFF] to-[#4FD1E8]">How it Works</span>
                                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10 rounded-full" />
                            </a>
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
                                <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 whitespace-nowrap hover:scale-105 transition-transform duration-300">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#5B6CFF] to-[#4FD1E8] flex items-center justify-center text-white shadow-lg">
                                        <span className="font-bold text-sm">10+</span>
                                    </div>
                                    <div>
                                        <p className="text-[#0F1E3A] font-bold text-sm">Trusted Experience</p>
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
                                            <p className="text-[#0F1E3A] font-bold text-sm">Verified Platform</p>
                                            <p className="text-slate-500 text-xs">100% Secure</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: How It Works - PROFESSIONAL VERSION */}
            <section id="how-it-works" className="px-[5%] py-24 bg-white relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-50/50 rounded-full blur-[100px] animate-pulse-slow" />
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-50/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                </div>

                <div className="max-w-7xl mx-auto w-full relative z-10">
                    {/* Header Section */}
                    <div className="text-center mb-20 px-4">
                        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight animate-slide-up opacity-0 uppercase" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5B6CFF] via-[#4FD1E8]/90 to-[#4FD1E8]">
                                HOW DOES REALSAYS WORK?
                            </span>
                        </h1>
                        <p className="text-[#0F1E3A]/70 text-lg font-medium animate-fade-in opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
                            Earn rewards instantly by sharing your opinions.
                        </p>
                    </div>

                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                        {[
                            {
                                icon: <UserPlus className="w-10 h-10 text-[#5B6CFF]" />,
                                title: "Registration",
                                desc: "Sign up on RealSays. Join this rapidly growing community today.",
                                delay: '800ms'
                            },
                            {
                                icon: <Search className="w-10 h-10 text-[#4FD1E8]" />,
                                title: "Investigation",
                                desc: "Receive questionnaires based on your profile. We value your interests.",
                                delay: '1000ms'
                            },
                            {
                                icon: <DollarSign className="w-10 h-10 text-[#5B6CFF]" />,
                                title: "Salary",
                                desc: "Earn rewards by filling out online questionnaires with instant payment.",
                                delay: '1200ms'
                            },
                            {
                                icon: <Trophy className="w-10 h-10 text-[#4FD1E8]" />,
                                title: "Award",
                                desc: "Earn rewards by referring friends. Special offers from top brands available.",
                                delay: '1400ms'
                            }
                        ].map((step, idx) => (
                            <div
                                key={idx}
                                className="group bg-white p-10 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col items-center text-center animate-slide-up opacity-0 hover:-translate-y-2"
                                style={{ animationDelay: step.delay, animationFillMode: 'forwards' }}
                            >
                                <div className="w-24 h-24 bg-blue-50/30 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#5B6CFF] group-hover:shadow-2xl group-hover:shadow-blue-500/30 transition-all duration-500 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#5B6CFF] to-[#4FD1E8] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                                    <div className="transition-all duration-500 group-hover:scale-110 group-hover:text-white relative z-10">
                                        {step.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-[#0F1E3A] mb-4">{step.title}</h3>
                                <p className="text-[#0F1E3A]/60 leading-relaxed text-sm">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Privacy Note - Reference Style (Yellow Banner) */}
                    <div className="max-w-4xl mx-auto mb-16 animate-fade-in opacity-0 px-4" style={{ animationDelay: '1600ms', animationFillMode: 'forwards' }}>
                        <div className="bg-[#FFF9C4]/80 backdrop-blur-sm border border-yellow-200 rounded-full py-4 px-10 text-center shadow-sm flex items-center justify-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-yellow-700" />
                            <p className="text-[15px] text-[#0F1E3A] font-medium">
                                <span className="font-bold">P.S.:</span> We will absolutely not leak your personal information or privacy. This is RealSays's promise.
                            </p>
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="text-center animate-fade-in opacity-0" style={{ animationDelay: '1800ms', animationFillMode: 'forwards' }}>
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center px-12 py-5 rounded-full bg-gradient-to-r from-[#5B6CFF] to-[#4FD1E8] text-white font-bold text-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all active:scale-95 group"
                            style={{ textDecoration: 'none' }}
                        >
                            JOIN NOW
                            <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
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
                                <h2 className="text-[#5B6CFF] font-bold uppercase tracking-widest text-sm">
                                    Community Impact
                                </h2>
                                <h1 className="text-4xl md:text-5xl font-bold text-[#0F1E3A] leading-[1.15] tracking-tight">
                                    We've Paid Our Community Over <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5B6CFF] to-[#4FD1E8]">
                                        $14,320
                                    </span>
                                </h1>
                            </div>

                            <div className="space-y-6">
                                <p className="text-[#0F1E3A]/70 text-lg md:text-xl leading-relaxed">
                                    Whether you're a student, a professional, or a homemaker, <span className="text-[#0F1E3A] font-medium">RealSays</span> is the perfect space to monetize your opinions.
                                </p>
                                <p className="text-[#0F1E3A]/70 text-lg md:text-xl leading-relaxed">
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