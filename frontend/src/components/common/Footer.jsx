import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#121212] text-white pt-16 pb-8 border-t border-white/5 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* Column 1: Company Info */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <img src={logo} alt="RealSays Logo" className="h-10 w-auto brightness-0 invert" />
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-[15px] max-w-xs">
                            RealSays is a premier market research platform connecting voices globally. We empower individuals to monetize their time through meaningful surveys while helping organizations gain verified, actionable insights.
                        </p>
                    </div>

                    {/* Column 2: Resources */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white/90">Resources</h4>
                        <ul className="space-y-4">
                            {['Surveys', 'How it Works', 'Referral Program', 'Research Panels', 'FAQs'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to="#"
                                        className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-base"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Legal */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-white/90">Legal</h4>
                        <ul className="space-y-4">
                            {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Security Standards', 'Member Agreement'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to="#"
                                        className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-base"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold mb-2 text-white/90">Contact Us</h4>
                        <div className="space-y-4">
                            <a
                                href="mailto:support@realsays.com"
                                className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-all duration-200 group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-base font-medium">support@realsays.com</span>
                            </a>
                        </div>

                        <div className="pt-4">
                            <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Follow Us</h5>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all duration-300"
                                    aria-label="LinkedIn"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
                    <p>© {currentYear} RealSays. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
