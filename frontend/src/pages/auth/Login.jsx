import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { auth, googleProvider } from '../../config/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import api from '../../services/api';
import logo from '../../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            // Verify with backend
            const response = await api.post('/auth/firebase', { idToken });

            if (response.data.success) {
                // Login success
                const { user, accessToken, refreshToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error("Google Auth Error:", error);
            setError("Google login failed. Please try again.");
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // 1. Sign in with Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            // 2. Sync with our Backend
            const response = await api.post('/auth/firebase', { idToken });
            if (response.data.success) {
                const { user, accessToken, refreshToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error("Login Error:", error);
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side: Visual Banner (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden items-center justify-center p-16">
                {/* Subtle geometric background pattern */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '48px 48px'
                    }} />
                </div>

                {/* Accent gradient elements - more restrained */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/15 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl" />

                {/* Thin accent line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />

                <div className="relative z-10 max-w-xl">
                    {/* Floating brand cards with asymmetric layout */}
                    <div className="absolute -top-8 -left-12 group">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg"
                                alt="Amazon"
                                className="w-11 h-11"
                            />
                        </div>
                        <div className="absolute -right-2 -top-2 w-6 h-6 bg-cyan-400 rounded-full opacity-60 blur-sm" />
                    </div>

                    <div className="absolute -bottom-6 -right-8 group">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Netflix-new-icon.png"
                                alt="Netflix"
                                className="w-11 h-11"
                            />
                        </div>
                        <div className="absolute -left-2 -bottom-2 w-6 h-6 bg-blue-400 rounded-full opacity-60 blur-sm" />
                    </div>

                    {/* Additional brand elements for depth */}
                    <div className="absolute top-24 -right-16 w-16 h-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center opacity-40">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg" />
                    </div>

                    <div className="absolute -top-16 right-20 w-14 h-14 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center opacity-30">
                        <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg" />
                    </div>

                    {/* Main content */}
                    <div className="space-y-8">
                        {/* Small label above heading */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                            <span className="text-cyan-300 text-sm font-medium tracking-wide">TRUSTED BY MILLIONS</span>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-5xl font-bold text-white leading-[1.15] tracking-tight">
                                Turn Your Voice
                                <br />
                                Into{' '}
                                <span className="inline-block relative">
                                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                                        Rewards
                                    </span>
                                    <span className="absolute bottom-1 left-0 w-full h-3 bg-cyan-400/20 blur-sm -z-10" />
                                </span>
                            </h2>

                            <p className="text-slate-300 text-lg leading-relaxed max-w-md">
                                Join millions of global contributors and start monetizing your insights today.
                            </p>
                        </div>

                        {/* Subtle stats or social proof */}
                        <div className="flex items-center gap-8 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-slate-800" />
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-slate-800" />
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 border-2 border-slate-800" />
                                </div>
                                <span className="text-slate-400 text-sm font-medium">2M+ contributors</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-slate-400 text-sm font-medium">4.9 rating</span>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .group:hover > div:first-child {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="inline-block mb-8">
                            <img src={logo} alt="RealSays" className="h-10 w-auto" />
                        </Link>
                        <h1 className="text-3xl font-bold text-[#0F1E3A] tracking-tight">Welcome Back</h1>
                        <p className="text-gray-500 mt-2">Enter your credentials to access your account.</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-2xl font-semibold text-[#0F1E3A] hover:bg-gray-50 transition-all active:scale-[0.98]"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                            Continue with Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-100" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 text-gray-400 font-medium tracking-widest">Or login with email</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#5B6CFF] transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5B6CFF]/20 focus:bg-white transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#5B6CFF] transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5B6CFF]/20 focus:bg-white transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#5B6CFF] focus:ring-[#5B6CFF]/20" />
                                <span className="text-sm text-gray-600 font-medium">Remember me</span>
                            </label>
                            <Link to="#" className="text-sm font-semibold text-[#5B6CFF] hover:text-[#4FD1E8]">Forgot Password?</Link>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-[#5B6CFF] to-[#4FD1E8] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            Log In <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="text-center text-gray-600 font-medium">
                        Don't have an account? {' '}
                        <Link to="/signup" className="text-[#5B6CFF] font-bold hover:underline">Sign up for free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
