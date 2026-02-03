import React, { useState, useEffect } from 'react';
import banner from '../../assets/hero_banner.png';

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
                        <h1 className="text-5xl lg:text-[4.5rem] font-bold leading-tight mb-6 text-slate-900 tracking-tight animate-slide-up">
                            Join the Official <br />
                            <span className="relative inline-block">
                                <span className="relative z-10">Market Research</span>

                                {/* SVG underline */}
                                <svg
                                    className="absolute -bottom-2 left-0 w-full h-[30px] pointer-events-none"
                                    viewBox="0 0 350 40"
                                    preserveAspectRatio="none"
                                >
                                    <defs>
                                        <linearGradient id="heroUnderline" x1="0%" y1="100%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#9EDAEF" />
                                            <stop offset="100%" stopColor="#1F6AE1" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M10 28 C80 30 140 22 200 18 C260 14 300 12 340 10"
                                        stroke="url(#heroUnderline)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        className="animate-highlight-grow origin-left"
                                    />
                                </svg>
                            </span>
                            <br />
                            Panel
                        </h1>

                        <p className="text-xl lg:text-2xl leading-relaxed text-gray-600 mb-8 animate-slide-up [animation-delay:100ms]">
                            Share your opinion and earn real rewards. Qualified participants earn{' '}
                            <span className="font-bold text-taobao-primary">$3 to $20</span> per survey.
                        </p>

                        <ul className="space-y-4 mb-10 animate-slide-up [animation-delay:200ms]">
                            {[
                                'High-paying opportunities for professionals & consumers',
                                'Redeem rewards for cash, gift cards, and more',
                            ].map((text) => (
                                <li key={text} className="flex items-center gap-3 text-lg text-slate-800">
                                    <span className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        ✓
                                    </span>
                                    {text}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4 items-center animate-slide-up [animation-delay:300ms]">
                            <button className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg text-white bg-gradient-to-r from-[#9EDAEF] to-[#1F6AE1] shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
                                Start Earning
                            </button>

                            <button className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#9EDAEF] to-[#1F6AE1] ring-1 ring-inset ring-gray-300 transition-all duration-300 hover:ring-gray-400 hover:-translate-y-0.5">
                                How it Works
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div
                        className="relative hidden lg:flex items-center justify-end animate-slide-up [animation-delay:400ms]"
                        style={{ transform: `translateY(${scrollY * 0.08}px)` }}
                    >
                        <div className="relative">
                            {/* Soft glow behind image */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 to-orange-100/40 blur-3xl rounded-full scale-110" />

                            <img
                                src={banner}
                                alt="Market Research Panel"
                                className="relative w-full max-w-[800px] h-auto object-cover drop-shadow-2xl"
                            />

                            {/* Trust Badge / Tooltip */}
                            <div className="absolute -left-12 top-1/4 animate-float [animation-delay:1s]">
                                <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 whitespace-nowrap">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#9EDAEF] to-[#1F6AE1] flex items-center justify-center text-white shadow-lg">
                                        <span className="font-bold text-sm">10+</span>
                                    </div>
                                    <div>
                                        <p className="text-slate-900 font-bold text-sm">Trusted Experience</p>
                                        <p className="text-slate-500 text-xs">10 years in the field</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;
