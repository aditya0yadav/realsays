import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { auth, googleProvider } from '../../config/firebase';
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import api from '../../services/api';
import panel3 from '../../assets/panel3.png';
import logo from '../../assets/logo.png';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleGoogleSignup = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            // Verify with backend
            const response = await api.post('/auth/firebase', { idToken });

            if (response.data.success) {
                // Google signup success
                localStorage.setItem('accessToken', idToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                window.location.href = '/onboarding';
            }
        } catch (error) {
            console.error("Google Auth Error:", error);
            setError("Google signup failed. Please try again.");
        }
    };

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // 1. Create user in Firebase
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // 2. Update profile with name
            await updateProfile(userCredential.user, { displayName: name });

            const idToken = await userCredential.user.getIdToken();

            // 3. Sync with our Backend
            const response = await api.post('/auth/firebase', { idToken });
            if (response.data.success) {
                localStorage.setItem('accessToken', idToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                window.location.href = '/onboarding';
            }
        } catch (error) {
            console.error("Signup Error:", error);
            setError("Signup failed. That email may already be in use.");
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side: Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link to="/" className="inline-block mb-8">
                            <img src={logo} alt="RealSays" className="h-10 w-auto" />
                        </Link>
                        <h1 className="text-3xl font-bold text-[#0F1E3A] tracking-tight">Create Account</h1>
                        <p className="text-gray-500 mt-2">Join our global community and start earning.</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleSignup}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-2xl font-semibold text-[#0F1E3A] hover:bg-gray-50 transition-all active:scale-[0.98]"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                            Join with Google
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-100" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 text-gray-400 font-medium tracking-widest">Or register with email</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleEmailSignup} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#5B6CFF] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5B6CFF]/20 focus:bg-white transition-all"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
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
                                    placeholder="Create Password"
                                    className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5B6CFF]/20 focus:bg-white transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-[#5B6CFF] focus:ring-[#5B6CFF]/20" required />
                            <span className="text-sm text-gray-500 leading-relaxed">
                                I agree to the <Link to="/terms-of-service" className="text-[#5B6CFF] font-semibold hover:underline">Terms of Service</Link> and <Link to="/privacy-policy" className="text-[#5B6CFF] font-semibold hover:underline">Privacy Policy</Link>.
                            </span>
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
                            Create Account <ShieldCheck className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="text-center text-gray-600 font-medium">
                        Already have an account? {' '}
                        <Link to="/login" className="text-[#5B6CFF] font-bold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>

            {/* Right Side: Visual Banner (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0F1E3A] relative overflow-hidden items-center justify-center p-20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#5B6CFF]/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#4FD1E8]/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 text-center w-full min-h-[400px] flex flex-col justify-center items-center">
                    {/* Simplified Floating Brand Elements */}
                    <div className="absolute top-[15%] right-[10%] w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-2xl flex items-center justify-center p-5 animate-float-slow opacity-90">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg" alt="Amazon" className="w-full h-auto drop-shadow-md" />
                    </div>

                    <div className="absolute bottom-[10%] left-[10%] w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-2xl flex items-center justify-center p-5 animate-float opacity-90" style={{ animationDelay: '1.5s' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Netflix-new-icon.png" alt="Netflix" className="w-full h-auto drop-shadow-md" />
                    </div>

                    <div className="relative z-10 max-w-md">
                        <h2 className="text-5xl font-bold text-white mb-6 tracking-tight font-display leading-[1.1]">
                            Your Opinion <br />
                            <span className="text-brand-cyan">Actually Matters</span>
                        </h2>
                        <p className="text-blue-100/60 text-xl max-w-sm mx-auto leading-relaxed font-medium">
                            Join the global elite contributing to the world's leading brands.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
