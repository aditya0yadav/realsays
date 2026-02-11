import React, { useState, useEffect } from 'react';
import personaService from '../../../services/persona.service';
import { User, Calendar, Heart, Globe, MapPin } from 'lucide-react';

const ProfileForm = () => {
    const [profile, setProfile] = useState({});
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [questionsRes, profileRes] = await Promise.all([
                    personaService.getQuestions(),
                    personaService.getProfile()
                ]);

                if (questionsRes.success) {
                    setQuestions(questionsRes.data);
                }

                if (profileRes.success) {
                    const profileData = {};
                    profileRes.data.forEach(attr => {
                        profileData[attr.definition.key] = attr.value;
                    });
                    setProfile(profileData);
                }
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (key, value) => {
        setProfile(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await personaService.updateProfile(profile);
            if (response.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const demographicKeys = ['age', 'gender', 'zip_code', 'country', 'marital_status'];
    const demographicQuestions = questions.filter(q => demographicKeys.includes(q.key));

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <User className="w-6 h-6 text-blue-500" />
                    Personal Information
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {demographicQuestions.map(q => (
                        <div key={q.key} className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 block">
                                {q.title}
                            </label>
                            {q.options ? (
                                <select
                                    value={profile[q.key] || ''}
                                    onChange={(e) => handleChange(q.key, e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                >
                                    <option value="">Select option...</option>
                                    {q.options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={q.type === 'number' ? 'number' : 'text'}
                                    value={profile[q.key] || ''}
                                    onChange={(e) => handleChange(q.key, e.target.value)}
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder={`Enter your ${q.key.replace('_', ' ')}`}
                                />
                            )}
                        </div>
                    ))}

                    <div className="md:col-span-2 pt-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>

                        {message.text && (
                            <p className={`mt-4 text-sm font-medium ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {message.text}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
