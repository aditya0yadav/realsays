import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { auth, googleProvider } from '../../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import api from '../../api/axios';
import panel3 from '../../assets/panel3.png';
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
            const response = await api.post('/auth/google', { idToken });

            if (response.data.success) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                window.location.href = '/';
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
            const response = await api.post('/auth/login', { email, password });

            if (response.data.success) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                window.location.href = '/';
            }
        } catch (error) {
            console.error("Login Error:", error);
            setError(error.response?.data?.message || "Invalid email or password.");
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side: Visual Banner (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0F1E3A] relative overflow-hidden items-center justify-center p-20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#5B6CFF]/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#4FD1E8]/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 text-center">
                    <div className="mb-12 relative">
                        <div className="absolute inset-0 bg-[#5B6CFF]/20 blur-[60px] rounded-full animate-pulse-slow" />
                        <img src={panel3} alt="Community Impact" className="w-[80%] mx-auto relative z-10 drop-shadow-2xl animate-orbital-float" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Turn Your Voice Into Rewards</h2>
                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                        Join millions of global contributors and start monetizing your insights with RealSays.
                    </p>
                </div>
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
