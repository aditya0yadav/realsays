import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    Compass,
    Wallet,
    User,
    Heart,
    Sparkles,
    CheckCircle2,
    Briefcase,
    Calendar,
    Users,
    ArrowRight
} from 'lucide-react';

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [animationPhase, setAnimationPhase] = useState('star'); // 'star' -> 'content'
    const [answers, setAnswers] = useState({});

    const questions = [
        {
            id: 'gender',
            question: "How should we address you?",
            options: [
                { label: 'Male', value: 'male', icon: <User className="w-5 h-5" /> },
                { label: 'Female', value: 'female', icon: <User className="w-5 h-5" /> },
                { label: 'Other', value: 'other', icon: <Sparkles className="w-5 h-5" /> }
            ]
        },
        {
            id: 'age',
            question: "In which orbit is your age?",
            options: [
                { label: 'Gen Z (18-24)', value: '18-24', icon: <Calendar className="w-5 h-5" /> },
                { label: 'Millennial (25-34)', value: '25-34', icon: <Calendar className="w-5 h-5" /> },
                { label: 'Prime (35+)', value: '35+', icon: <Briefcase className="w-5 h-5" /> }
            ]
        },
        {
            id: 'maritalStatus',
            question: "What's your current life status?",
            options: [
                { label: 'Single', value: 'single', icon: <Heart className="w-5 h-5" /> },
                { label: 'Married', value: 'married', icon: <Users className="w-5 h-5" /> },
                { label: 'Private', value: 'private', icon: <User className="w-5 h-5" /> }
            ]
        }
    ];

    useEffect(() => {
        setAnimationPhase('star');
        const timer = setTimeout(() => setAnimationPhase('content'), 400);
        return () => clearTimeout(timer);
    }, [step]);

    const handleOptionSelect = (option) => {
        const currentId = questions[step].id;
        setAnswers(prev => ({ ...prev, [currentId]: option.value }));

        if (step < questions.length - 1) {
            setStep(prev => prev + 1);
        } else {
            setTimeout(() => navigate('/dashboard'), 800);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col lg:flex-row font-sans overflow-hidden relative">

            {/* Left Side: Question Logic */}
            <div className="w-full lg:w-[45%] flex flex-col p-8 lg:px-12 lg:py-24 relative z-20 bg-white">
                <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-12"
                        >
                            <h1 className="text-4xl lg:text-5xl font-sans font-[300] text-slate-900 leading-[1.3] tracking-[-0.02em] text-center">
                                {questions[step].question.split('').map((char, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: animationPhase === 'content' ? 1 : 0 }}
                                        transition={{ delay: i * 0.01 }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </h1>

                            <motion.div
                                className="grid grid-cols-1 gap-4 w-full max-w-sm mx-auto"
                                initial="hidden"
                                animate={animationPhase === 'content' ? "visible" : "hidden"}
                                variants={{
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.1,
                                            delayChildren: 0.5 // Wait for question to partially type
                                        }
                                    }
                                }}
                            >
                                {questions[step].options.map((option, idx) => (
                                    <motion.button
                                        key={option.value}
                                        variants={{
                                            hidden: { opacity: 0, y: 50 },
                                            visible: {
                                                opacity: 1,
                                                y: 50,
                                                transition: {
                                                    type: "spring",
                                                    stiffness: 120,
                                                    damping: 20,
                                                    mass: 0.8
                                                }
                                            }
                                        }}
                                        onClick={() => handleOptionSelect(option)}
                                        className="group flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5 transition-[border-color,background-color,box-shadow,transform] duration-300"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-50 flex items-center justify-center text-blue-500/80 group-hover:text-blue-600 transition-colors">
                                                {option.icon}
                                            </div>
                                            <span className="text-[17px] font-[400] text-slate-700 font-sans tracking-tight">{option.label}</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                    </motion.button>
                                ))}
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Side: AI Halo Banner */}
            <div className="hidden lg:flex flex-1 bg-slate-50 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-cyan-50/40" />

                {/* Background Textures */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-[120px] animate-pulse" />

                {/* AI Halo Visualization */}
                <div className="relative w-[500px] h-[500px] flex items-center justify-center">

                    {/* Pulsing Auras */}
                    <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute inset-20 bg-cyan-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

                    {/* The Core Orb */}
                    <motion.div
                        animate={{
                            scale: animationPhase === 'star' ? [1, 1.05, 1] : 1,
                            rotate: 360
                        }}
                        transition={{
                            scale: { repeat: Infinity, duration: 4 },
                            rotate: { repeat: Infinity, duration: 24, ease: "linear" }
                        }}
                        className="relative w-80 h-80"
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_60px_rgba(59,130,246,0.15)]">
                            <defs>
                                <linearGradient id="haloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
                                </linearGradient>
                            </defs>

                            {/* Outer Rings */}
                            <circle cx="50" cy="50" r="48" fill="none" stroke="url(#haloGrad)" strokeWidth="0.2" strokeDasharray="6 4" className="opacity-30" />
                            <circle cx="50" cy="50" r="42" fill="none" stroke="url(#haloGrad)" strokeWidth="0.1" className="opacity-20" />

                            {/* Pulsing Core */}
                            <motion.circle
                                cx="50" cy="50" r="28"
                                fill="url(#haloGrad)"
                                initial={{ opacity: 0.1 }}
                                animate={{ opacity: [0.05, 0.2, 0.05] }}
                                transition={{ repeat: Infinity, duration: 8 }}
                                filter="blur(15px)"
                            />

                            {/* Center Star */}
                            <path
                                d="M50 20 L56 44 L80 50 L56 56 L50 80 L44 56 L20 50 L44 44 Z"
                                fill="url(#haloGrad)"
                                className="opacity-50 drop-shadow-md"
                            />
                        </svg>

                        {/* Orbiting Data Particles */}
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full blur-[0.5px]"
                                animate={{
                                    x: [0, Math.cos(i * 72) * 160, 0],
                                    y: [0, Math.sin(i * 72) * 160, 0],
                                    opacity: [0, 0.8, 0]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 4 + i,
                                    ease: "easeInOut",
                                    delay: i * 0.8
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* Status Pill */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/50 backdrop-blur-xl px-5 py-2.5 rounded-full border border-slate-200 flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                            <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                            {animationPhase === 'star' ? 'Active Thinking' : 'Synchronized'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;