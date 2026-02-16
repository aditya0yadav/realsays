import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import earnImage from '../../assets/img1.png';

const EarnMoneySection = () => {
    return (
        <section className="py-24 px-[5%] bg-white relative overflow-hidden">
            {/* Background Decoration */}
            {/* <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-50/50 rounded-full blur-[100px] -z-10" /> */}

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                {/* Image Side */}
                {/* <div className="relative order-2 lg:order-1 flex justify-center"> */}
                {/* <div className="relative rounded-[2rem] overflow-hidden shadow-xl transform transition-transform duration-500 hover:scale-[1.01]"> */}
                <img
                    src={earnImage}
                    alt="Earn Money with RealSays"
                    className="w-full h-auto object-cover"
                />
                {/* </div> */}

                {/* Text Side */}
                <div className="order-1 lg:order-2 space-y-8">
                    <div className="space-y-4">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider">
                            Start Earning Today
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                            Your Favorite Place <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                To Earn Money
                            </span>
                        </h2>
                    </div>

                    <p className="text-lg text-slate-600 leading-relaxed">
                        Turn your spare time into real cash. Whether you're on your daily commute or relaxing at home, RealSays gives you the power to earn from anywhere. Join the community that pays you for your opinion.
                    </p>

                    <ul className="space-y-4">
                        {[
                            "High-paying surveys updated daily",
                            "Instant cashouts to your favorite wallets",
                            "Safe, secure, and transparent platform"
                        ].map((item, index) => (
                            <li key={index} className="flex items-center gap-3 text-slate-700 font-medium">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-4 h-4 text-blue-600" />
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="pt-4">
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold transition-all hover:bg-blue-600 hover:shadow-lg hover:gap-4"
                        >
                            Start Earning Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EarnMoneySection;
