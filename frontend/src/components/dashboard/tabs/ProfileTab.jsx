import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, MapPin, Globe, Camera, Save, Loader2, UploadCloud } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import userService from '../../../services/user.service';
import { toast } from 'react-hot-toast';

const ProfileTab = () => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        city: '',
        zip_code: '',
        bio: '',
        timezone: '',
        country: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.panelist?.first_name || '',
                last_name: user.panelist?.last_name || '',
                email: user.email || '',
                username: user.username || '',
                phone: user.panelist?.phone || '',
                city: user.panelist?.city || '',
                country: user.panelist?.country || '',
                zip_code: user.panelist?.zip_code || '',
                bio: user.panelist?.bio || '',
                timezone: user.panelist?.timezone || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await userService.updateProfile(formData);
            await refreshUser();
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            await userService.updateAvatar(file);
            await refreshUser();
            toast.success("Avatar updated");
        } catch (error) {
            console.error('Failed to upload avatar:', error);
            toast.error("Failed to upload avatar");
        } finally {
            setUploading(false);
        }
    };

    const getAvatarUrl = () => {
        if (!user?.avatar_url) return null;
        if (user.avatar_url.startsWith('/uploads')) {
            const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
            return `${baseUrl}${user.avatar_url}`;
        }
        return user.avatar_url;
    };

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10 font-sans text-slate-800">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Account/Setting</h1>
                    <h2 className="text-lg font-semibold text-slate-700">Setting Details</h2>
                    <p className="text-sm text-slate-500">Update your photo and personal details here.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                        onClick={() => refreshUser()} // Reset changes logic could be here
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 rounded-lg bg-[#5B6CFF] text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Personal Information Form */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Personal information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* First Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="Enter first name"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B6CFF]/20 focus:border-[#5B6CFF] transition-all"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Enter last name"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B6CFF]/20 focus:border-[#5B6CFF] transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* City */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">City</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5B6CFF]/20 focus:border-[#5B6CFF] transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Country Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Country Name</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5B6CFF]/20 focus:border-[#5B6CFF] transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Zip code */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Zip code</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    name="zip_code"
                                    value={formData.zip_code}
                                    onChange={handleChange}
                                    placeholder="Enter zip code"
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5B6CFF]/20 focus:border-[#5B6CFF] transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2 mb-6">
                        <label className="text-sm font-medium text-slate-600">Bio <span className="text-slate-400 font-normal">(Write a short introduction)</span></label>
                        <div className="relative">
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B6CFF]/20 focus:border-[#5B6CFF] transition-all resize-none"
                                placeholder="Lorem ipsum..."
                            />
                            <div className="absolute right-4 bottom-4 text-slate-400">
                                <span className="cursor-pointer hover:text-slate-600">B</span> <span className="ml-1 cursor-pointer hover:text-slate-600">/</span> <span className="ml-1 cursor-pointer hover:text-slate-600">U</span>
                            </div>
                        </div>
                    </div>

                    {/* Timezone */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600">Timezone</label>
                        <select
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B6CFF]/20 focus:border-[#5B6CFF] transition-all appearance-none"
                        >
                            <option value="">Select Timezone</option>
                            <option value="PST">Pacific Standard Time</option>
                            <option value="EST">Eastern Standard Time</option>
                            <option value="UTC">UTC</option>
                            <option value="IST">Indian Standard Time</option>
                        </select>
                    </div>

                </div>

                {/* Right Column: Photo & Integrations */}
                <div className="space-y-8">
                    {/* Your Photo Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Your Photo</h3>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden ring-2 ring-white shadow-md">
                                {getAvatarUrl() ? (
                                    <img src={getAvatarUrl()} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#5B6CFF] text-white font-bold text-lg">
                                        {user?.email?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Edit your photo</h4>
                                <div className="flex gap-2 text-xs">
                                    <button onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-slate-600">Update</button>
                                    <span className="text-slate-300">•</span>
                                    <button className="text-slate-400 hover:text-red-500">Delete</button>
                                </div>
                            </div>
                        </div>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-[#5B6CFF]/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors group relative overflow-hidden"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />

                            {uploading ? (
                                <Loader2 className="w-8 h-8 text-[#5B6CFF] animate-spin mb-3" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-[#5B6CFF]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-5 h-5 text-[#5B6CFF]" />
                                </div>
                            )}

                            <p className="text-sm font-medium text-[#5B6CFF] mb-1">Click to upload <span className="text-slate-500 font-normal">or drag and drop</span></p>
                            <p className="text-xs text-slate-400">SVG, PNG, JPG or GIF</p>
                            <p className="text-xs text-slate-400">(max, 800x400px)</p>
                        </div>
                    </div>

                    {/* Google Integration Card */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Google Icon Mock */}
                                <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-slate-200">
                                    <span className="font-bold text-lg"><span className="text-blue-500">G</span><span className="text-red-500">o</span><span className="text-yellow-500">o</span><span className="text-blue-500">g</span><span className="text-green-500">l</span><span className="text-red-500">e</span></span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 leading-tight">Use Google to sign in to your<br />account. <a href="#" className="text-[#5B6CFF]">Click here to learn more.</a></p>
                                </div>
                            </div>

                            {user?.google_id ? (
                                <span className="px-3 py-1 rounded bg-[#5B6CFF]/10 text-[#5B6CFF] text-xs font-bold">Connected</span>
                            ) : (
                                <button className="px-3 py-1 rounded bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200">Connect</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
