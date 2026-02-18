import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import personaService from '../../services/persona.service';

const CRITICAL_ATTRIBUTES = ['city', 'state', 'job_title', 'income', 'children'];

const ProfileCompletionModal = ({ onClose }) => {
    const [missingFields, setMissingFields] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

                    // Identify which critical fields are missing or empty
                    const missing = CRITICAL_ATTRIBUTES.filter(key => {
                        const val = profileData[key];
                        return val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);
                    });

                    if (missing.length > 0) {
                        setMissingFields(missing);
                        // Filter questions to only show missing ones
                        const missingQs = qs.data.filter(q => missing.includes(q.key));
                        setQuestions(missingQs);
                    } else {
                        onClose && onClose(); // Nothing missing, close immediately
                    }
                }
            } catch (error) {
                console.error('Error checking profile:', error);
            } finally {
                setLoading(false);
            }
        };

        checkProfile();
    }, []);

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await personaService.updateProfile(formData);
            if (onClose) onClose();
        } catch (error) {
            console.error('Failed to save profile:', error);
            alert('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null; // Don't show anything while checking
    if (missingFields.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 bg-blue-50 border-b border-blue-100 flex justify-between items-start">
                    <div className="flex gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Complete Your Profile</h2>
                            <p className="text-sm text-slate-600 mt-1">
                                Please answer these few questions to unlock more surveys.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    {questions.map(q => (
                        <div key={q.key} className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">
                                {q.title}
                            </label>
                            {q.type === 'single-select' || q.key === 'state' ? (
                                <select
                                    className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={formData[q.key] || ''}
                                    onChange={e => handleChange(q.key, e.target.value)}
                                >
                                    <option value="">Select...</option>
                                    {q.options && q.options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : q.type === 'multi-select' ? (
                                <div className="border border-slate-200 rounded-lg p-2 max-h-40 overflow-y-auto space-y-1">
                                    {q.options && q.options.map(opt => (
                                        <label key={opt} className="flex items-center gap-2 p-1 hover:bg-slate-50 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                                checked={Array.isArray(formData[q.key]) ? formData[q.key].includes(opt) : false}
                                                onChange={(e) => {
                                                    const current = Array.isArray(formData[q.key]) ? formData[q.key] : [];
                                                    let newVal;
                                                    if (e.target.checked) {
                                                        newVal = [...current, opt];
                                                    } else {
                                                        newVal = current.filter(x => x !== opt);
                                                    }
                                                    handleChange(q.key, newVal);
                                                }}
                                            />
                                            <span className="text-sm text-slate-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <input
                                    type={q.type === 'number' ? 'number' : 'text'}
                                    className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    value={formData[q.key] || ''}
                                    onChange={e => handleChange(q.key, e.target.value)}
                                    placeholder="Your answer..."
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Remind Later
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save & Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileCompletionModal;
