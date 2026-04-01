import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ArrowRight, BookOpen, Sparkles, Zap } from 'lucide-react';
import logo from '../assets/logo.png';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(credentials.username, credentials.password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#F9FAFB] overflow-hidden">
            {/* Background Blobs */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-200/30 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-5xl w-full flex bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden animate-fade-up">
                {/* Left side: Branding & Pattern */}
                <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-16 flex-col justify-between overflow-hidden">
                    {/* Abstract Pattern Overlay */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }}></div>
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-2xl shadow-indigo-200/50 ring-8 ring-white/10 overflow-hidden group">
                                <img src={logo} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" alt="Logo" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-black text-white tracking-tight leading-none uppercase">NEURAL</h1>
                                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.34em] mt-1">ACADEMY OS v1.0</p>
                            </div>
                        </div>
                        
                        <h1 className="text-5xl font-extrabold text-white leading-[1.1] mb-6">
                            Next-gen AI <br />
                            <span className="text-indigo-200">Education Hub.</span>
                        </h1>
                        <p className="text-indigo-100/80 text-lg max-w-sm leading-relaxed">
                            Experience a smarter way to learn and teach with our advanced AI-powered classroom management.
                        </p>
                    </div>

                    <div className="relative z-10 flex gap-4">
                        <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
                            Intelligent
                        </div>
                        <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
                            Seamless
                        </div>
                    </div>
                </div>

                {/* Right side: Form */}
                <div className="flex-1 p-10 lg:p-20 flex flex-col justify-center bg-white/80">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                        <p className="text-slate-500 font-medium">Please enter your details to sign in</p>
                    </div>

                    <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-10 w-fit mx-auto lg:mx-0">
                        <Link to="/register" className="px-8 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-600 transition-all">Signup</Link>
                        <button className="px-8 py-2.5 rounded-xl text-sm font-bold bg-white text-indigo-600 shadow-sm border border-slate-200/50">Login</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                            <input
                                type="text"
                                className="premium-input"
                                placeholder="Enter your username"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot Password?</button>
                            </div>
                            <input
                                type="password"
                                className="premium-input"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                required
                            />
                        </div>

                        <div className="pt-4 flex flex-col gap-8">
                            <p className="text-xs text-slate-500 text-center lg:text-left">
                                By logging in, you agree with our <span className="text-indigo-600 cursor-pointer font-bold hover:underline">Terms & Conditions</span>
                            </p>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-4 text-lg"
                            >
                                {loading ? 'Processing...' : 'Sign In'} <ArrowRight size={20} className="ml-1" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
