import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { ArrowRight, BookOpen, Sparkles, User, GraduationCap } from 'lucide-react';
import logo from '../assets/logo.png';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        role: 'student'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const { confirm_password, ...submitData } = formData;
            await api.post('users/', submitData);
            toast.success('Account created! Please sign in.');
            navigate('/login');
        } catch (error) {
            toast.error('Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 bg-[#F9FAFB] overflow-hidden">
            {/* Background Blobs */}
            <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-200/30 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-5xl w-full flex bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden animate-fade-up">
                {/* Left side: Branding & Pattern */}
                <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-16 flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '32px 32px' }}></div>
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-2xl shadow-indigo-200/50 ring-8 ring-white/10 overflow-hidden group">
                                <img src={logo} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" alt="Logo" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-black text-white tracking-tight leading-none uppercase">NEURAL</h1>
                                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.38em] mt-1">REGISTRATION PROTOCOL</p>
                            </div>
                        </div>
                        
                        <h1 className="text-5xl font-extrabold text-white leading-[1.1] mb-6">
                            Join the <br />
                            <span className="text-indigo-200">Future of Learning.</span>
                        </h1>
                        <p className="text-indigo-100/80 text-lg max-w-sm leading-relaxed">
                            Create your account and unlock a personalized, AI-driven educational journey today.
                        </p>
                    </div>

                    <div className="relative z-10 flex gap-4">
                        <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
                            Interactive
                        </div>
                        <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
                            Engaging
                        </div>
                    </div>
                </div>

                {/* Right side: Form */}
                <div className="flex-1 p-10 lg:p-14 flex flex-col justify-center bg-white/80 overflow-y-auto max-h-[90vh] custom-scrollbar">
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
                        <p className="text-slate-500 font-medium text-sm">Sign up to get started with AI Classroom</p>
                    </div>

                    <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8 w-fit mx-auto lg:mx-0">
                        <button className="px-8 py-2.5 rounded-xl text-sm font-bold bg-white text-indigo-600 shadow-sm border border-slate-200/50">Signup</button>
                        <Link to="/login" className="px-8 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-slate-600 transition-all">Login</Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                                <input type="text" className="premium-input" placeholder="johndoe" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                                <input type="email" className="premium-input" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <input type="password" className="premium-input" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                                <input type="password" className="premium-input" placeholder="••••••••" value={formData.confirm_password} onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">I am a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'student' })}
                                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all font-bold ${formData.role === 'student' ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                                >
                                    <User size={20} /> Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'faculty' })}
                                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all font-bold ${formData.role === 'faculty' ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                                >
                                    <GraduationCap size={20} /> Faculty
                                </button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-4 text-lg"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={20} className="ml-1" />
                            </button>
                            <p className="text-xs text-slate-500 text-center mt-6">
                                By joining, you agree with our <span className="text-indigo-600 cursor-pointer font-bold hover:underline">Terms & Conditions</span>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
