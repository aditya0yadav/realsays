import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, DollarSign, Check, ArrowRight, MousePointer2, MonitorPlay } from 'lucide-react';
import personaService from '../../services/persona.service';

const CRITICAL_ATTRIBUTES = ['city', 'state', 'job_title', 'income', 'children'];
const QUESTIONS_PER_PAGE = 2;

const ProfileCompletionModal = ({ onClose }) => {
    // 1. Initialize viewState from localStorage or default to 'loading'
    const [viewState, setViewState] = useState(() => {
        const saved = localStorage.getItem('profileModalViewState');
        return saved === 'minimized' ? 'minimized' : 'loading'; // Default to loading, handle others in effect
    });

    const [missingFields, setMissingFields] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    // Effect to persist viewState
    useEffect(() => {
        if (viewState !== 'loading') {
            localStorage.setItem('profileModalViewState', viewState);
        }
    }, [viewState]);

    useEffect(() => {
        const checkProfile = async () => {
            try {
                const [qs, profile] = await Promise.all([
                    personaService.getQuestions(),
                    personaService.getProfile()
                ]);

                if (qs.success && profile.success) {
                    const profileData = {};
                    profile.data.forEach(p => {
                        let val = p.value;
                        if (p.definition.type === 'multi-select' && typeof val === 'string') {
                            try { val = JSON.parse(val); } catch (e) { }
                        }
                        profileData[p.definition.key] = val;
                    });

                    const missing = CRITICAL_ATTRIBUTES.filter(key => {
                        const val = profileData[key];
                        return val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);
                    });

                    if (missing.length > 0) {
                        setMissingFields(missing);
                        setQuestions(qs.data.filter(q => missing.includes(q.key)));

                        // If we had a saved state, respect it
                        setViewState(prev => {
                            const saved = localStorage.getItem('profileModalViewState');
                            // Fix: If explicitly minimized or dismissed previously, honor it
                            if (saved === 'minimized' || saved === 'dismissed') return 'minimized';
                            return 'teaser';
                        });
                    } else {
                        // If no missing fields, clear state and close
                        localStorage.removeItem('profileModalViewState');
                        onClose && onClose();
                    }
                } else {
                    onClose && onClose();
                }
            } catch (error) {
                console.error('Error checking profile:', error);
                onClose && onClose();
            }
        };

        checkProfile();
    }, []);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    // Helper to save current page data
    const saveCurrentPageData = async () => {
        setSaving(true);
        try {
            // Filter formData to only include current page questions
            const currentKeys = currentQuestions.map(q => q.key);
            const dataToSave = {};
            currentKeys.forEach(key => {
                if (formData[key] !== undefined) {
                    dataToSave[key] = formData[key];
                }
            });

            if (Object.keys(dataToSave).length > 0) {
                await personaService.updateProfile(dataToSave);
            }
        } catch (error) {
            console.error('Failed to save page data:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleNextPage = async () => {
        const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
        // Save data on every step
        await saveCurrentPageData();

        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        } else {
            // Final submit (already saved above, but maybe close?)
            onClose && onClose();
        }
    };

    const handleMinimize = async () => {
        await saveCurrentPageData();
        setViewState('minimized');
    };
    const handleMaximize = () => {
        // Restore to 'form' if we have data, otherwise teaser
        // Simple logic: if minimized, go back to form if we were in form?
        // User flow: Minimized -> Teaser (always safer to engage) -> Form
        // But user asked "remember window...".
        // Let's just go to Teaser to be safe/consistent, or check if we already started?
        setViewState('teaser');
    };

    // Get current page questions
    const currentQuestions = questions.slice(
        currentPage * QUESTIONS_PER_PAGE,
        (currentPage + 1) * QUESTIONS_PER_PAGE
    );

    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

    if (viewState === 'loading') return null;

    return (
        <AnimatePresence>
            {/* FLOATING BADGE */}
            {viewState === 'minimized' && (
                <motion.button
                    onClick={handleMaximize}
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 50 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#FFDBC2] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center text-[#1A1A1A] cursor-pointer border-2 border-white/50"
                >
                    <DollarSign className="w-7 h-7" strokeWidth={2.5} />
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FF3B30] border-2 border-white"></span>
                    </span>
                </motion.button>
            )}

            {/* MODAL WRAPPER */}
            {(viewState === 'teaser' || viewState === 'form') && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={handleMinimize}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20, rotateX: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // Apple-like spring
                        // Reference Style: Peach Card, Rounded Corners, smaller size
                        className="relative w-full max-w-[550px] min-h-[500px] bg-[#FFDBC2] rounded-[2.2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col"
                    >
                        {/* MAIN CONTENT AREA (Peach) */}
                        <div className="flex-1 p-10 sm:p-12 text-[#1A1A1A]">

                            {/* TEASER CONTENT */}
                            {viewState === 'teaser' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="relative"
                                >
                                    <div className="flex justify-between items-start mb-12">
                                        <p className="font-sans text-xs font-bold tracking-[0.2em] uppercase opacity-60">
                                            EARNINGS POTENTIAL
                                        </p>
                                        <div className="bg-[#FF3B30] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                                            <span>#PREMIUM</span>
                                            <MousePointer2 className="w-3 h-3 fill-white" />
                                        </div>
                                    </div>

                                    <h2 className="text-5xl font-serif leading-[0.9] tracking-tight mb-8">
                                        Unlock high <br />
                                        paying tasks.
                                    </h2>

                                    <div className="relative inline-block w-full group">
                                        <button
                                            onClick={() => setViewState('form')}
                                            className="w-full py-4 bg-[#1A1A1A] text-[#FFDBC2] text-lg font-medium rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
                                        >
                                            Start Earning
                                            <ArrowRight className="w-5 h-5 opacity-80" />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => {
                                            handleMinimize();
                                            localStorage.setItem('profileModalViewState', 'dismissed');
                                        }}
                                        className="w-full mt-4 text-xs font-bold text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors py-2 uppercase tracking-widest"
                                    >
                                        Remind me later
                                    </button>
                                </motion.div>
                            )}

                            {/* FORM CONTENT */}
                            {viewState === 'form' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col"
                                >
                                    <div className="flex justify-between items-center mb-8">
                                        <div className="flex items-center gap-2">
                                            <span className="font-serif text-2xl font-medium">
                                                Step {currentPage + 1}
                                                <span className="text-[#1A1A1A]/30 mx-1">/</span>
                                                {totalPages}
                                            </span>
                                        </div>
                                        <button onClick={handleMinimize} className="p-2 -mr-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-6 flex-1">
                                        {currentQuestions.map((q) => (
                                            <div key={q.key} className="space-y-3">
                                                <label className="text-sm font-bold uppercase tracking-wider opacity-60 block pl-1">
                                                    {q.title}
                                                </label>

                                                {q.type === 'single-select' || q.key === 'state' ? (
                                                    <div className="relative group">
                                                        <select
                                                            className="w-full h-12 px-4 rounded-xl bg-white/40 border border-[#1A1A1A]/5 hover:bg-white/60 focus:bg-white transition-all appearance-none outline-none text-[#1A1A1A] font-medium placeholder-transparent"
                                                            value={formData[q.key] || ''}
                                                            onChange={e => handleChange(q.key, e.target.value)}
                                                        >
                                                            <option value="">Select option...</option>
                                                            {q.options && q.options.map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40 pointer-events-none rotate-90" />
                                                    </div>
                                                ) : q.type === 'multi-select' ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {q.options && q.options.map(opt => {
                                                            const isSelected = Array.isArray(formData[q.key]) && formData[q.key].includes(opt);
                                                            return (
                                                                <label
                                                                    key={opt}
                                                                    className={`px-3 py-2 rounded-lg cursor-pointer transition-all border text-sm font-medium ${isSelected ? 'bg-[#1A1A1A] text-[#FFDBC2] border-[#1A1A1A]' : 'bg-white/30 border-[#1A1A1A]/5 text-[#1A1A1A] hover:bg-white/50'}`}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        className="hidden"
                                                                        checked={isSelected}
                                                                        onChange={(e) => {
                                                                            const current = Array.isArray(formData[q.key]) ? formData[q.key] : [];
                                                                            handleChange(q.key, e.target.checked
                                                                                ? [...current, opt]
                                                                                : current.filter(x => x !== opt));
                                                                        }}
                                                                    />
                                                                    {opt}
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <input
                                                        type={q.type === 'number' ? 'number' : 'text'}
                                                        className="w-full h-12 px-4 rounded-xl bg-white/40 border border-[#1A1A1A]/5 hover:bg-white/60 focus:bg-white transition-all outline-none text-[#1A1A1A] font-medium"
                                                        value={formData[q.key] || ''}
                                                        onChange={e => handleChange(q.key, e.target.value)}
                                                        placeholder="Type answer..."
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleNextPage}
                                        disabled={saving}
                                        className="w-full py-4 mt-8 bg-[#1A1A1A] text-[#FFDBC2] text-lg font-medium rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                                    >
                                        {currentPage === totalPages - 1 ? (saving ? 'Saving...' : 'Complete') : 'Next'}
                                        <ArrowRight className="w-5 h-5 opacity-80" />
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        {/* DARK FOOTER STRIP (From Ref) */}
                        <div className="bg-[#1A1A1A] p-5 flex items-center gap-4 border-t border-white/5 relative overflow-hidden">
                            {/* Skeleton lines effect */}
                            <div className="w-10 h-10 rounded-lg bg-[#FFDBC2]/10 flex items-center justify-center shrink-0">
                                <MonitorPlay className="w-5 h-5 text-[#FFDBC2]" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="h-2 w-3/4 bg-[#FFDBC2]/10 rounded-full"></div>
                                <div className="h-2 w-1/2 bg-[#FFDBC2]/10 rounded-full"></div>
                            </div>

                            {/* Decorative blur */}
                            <div className="absolute top-1/2 right-10 w-20 h-20 bg-[#FFDBC2] rounded-full blur-[40px] opacity-10 pointer-events-none"></div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProfileCompletionModal;
