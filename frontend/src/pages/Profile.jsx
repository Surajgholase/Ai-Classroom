import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import NotificationCenter from '../components/NotificationCenter';
import { User, Mail, Shield, Camera, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        role: '',
        first_name: '',
        last_name: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('users/me/');
            setProfile(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load profile');
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await api.patch('users/me/', profile);
            setProfile(response.data);
            // Also update auth context user if needed
            setUser({ ...user, username: response.data.username });
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 font-jakarta">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl border-4 border-indigo-600 border-t-transparent animate-spin shadow-lg"></div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Identity...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-slate-50/50 min-h-screen font-jakarta">
            <Sidebar />
            <main className="flex-1 ml-64 p-10 lg:p-14 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-12">
                    <header className="animate-fade-in flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-10">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight flex items-center gap-4">
                                Neural Profile
                                <span className="text-[10px] bg-white text-indigo-600 px-3 py-1 rounded-full uppercase tracking-[0.2em] font-black border border-indigo-100 shadow-sm">
                                    VERIFIED
                                </span>
                            </h1>
                            <p className="text-lg font-medium text-slate-500 mt-1">Configure your workspace identity and neural parameters</p>
                        </div>
                        <NotificationCenter />
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Profile Card */}
                        <div className="lg:col-span-4 space-y-8 animate-slide-up">
                            <div className="glass-card p-10 flex flex-col items-center text-center border-none bg-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-600 to-violet-700 opacity-10"></div>
                                
                                <div className="relative z-10 mb-8">
                                    <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 border-8 border-white shadow-2xl flex items-center justify-center text-6xl font-black text-white overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        {profile.avatar ? (
                                            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            profile.username?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <button className="absolute bottom-2 right-2 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all transform active:scale-90">
                                        <Camera size={20} />
                                    </button>
                                </div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{profile.username}</h2>
                                <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] px-4 py-2 bg-indigo-50 rounded-xl mt-4 border border-indigo-100/50">
                                    {profile.role || 'Neural Participant'}
                                </p>
                            </div>

                            <div className="glass-card p-8 space-y-6 border-none bg-white/80 shadow-xl">
                                <div className="flex items-center gap-4 text-slate-600 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                                        <Shield size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Status</p>
                                        <span className="text-sm font-bold text-slate-700">Fully Optimized</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600 group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                                        <Mail size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Relay Address</p>
                                        <span className="text-sm font-bold text-slate-700 truncate block">{profile.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings Form */}
                        <div className="lg:col-span-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <div className="glass-card p-10 border-none bg-white shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-30"></div>
                                <h3 className="text-xl font-black text-slate-800 mb-10 pb-4 border-b-2 border-slate-50 flex items-center gap-3 relative z-10">
                                    <User size={24} className="text-indigo-600" /> Identity Matrix
                                </h3>
                                <form onSubmit={handleUpdate} className="space-y-8 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Universal Alias</label>
                                            <input
                                                type="text"
                                                className="premium-input px-6 py-4"
                                                value={profile.username || ''}
                                                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Email</label>
                                            <input
                                                type="email"
                                                className="premium-input px-6 py-4"
                                                value={profile.email || ''}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Origin Name</label>
                                            <input
                                                type="text"
                                                className="premium-input px-6 py-4"
                                                value={profile.first_name || ''}
                                                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lineage Name</label>
                                            <input
                                                type="text"
                                                className="premium-input px-6 py-4"
                                                value={profile.last_name || ''}
                                                onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="btn-primary px-10 py-4 flex items-center justify-center gap-3 text-sm"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Syncing Data...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={20} />
                                                    Commit Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="glass-card p-10 mt-10 border-none bg-rose-50/20 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-4 h-full bg-rose-500/10 group-hover:bg-rose-500/20 transition-all"></div>
                                <h3 className="text-xl font-black text-rose-600 mb-2 flex items-center gap-3">
                                    <Shield size={24} /> Neural Security
                                </h3>
                                <p className="text-sm font-medium text-slate-500 mb-8 max-w-md">Modifying your access credentials will terminate all active neural links and require re-authentication.</p>
                                <button className="px-8 py-4 bg-white border-2 border-rose-100 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all active:scale-95 shadow-sm">
                                    Reset Password Matrix
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
