import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home,
    Calendar,
    Settings,
    LogOut,
    User,
    BookOpen,
    Cpu,
    FileCheck,
    Sparkles
} from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: Home, label: 'Classes', path: '/dashboard' },
        { icon: Calendar, label: 'Calendar', path: '/calendar' },
        { icon: Cpu, label: 'AI Intelligence', path: '/ai-hub' },
        { icon: FileCheck, label: 'Error Correction', path: '/error-correction' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: BookOpen, label: user?.role === 'faculty' ? 'Teaching' : 'Enrolled', path: '/dashboard' },
    ];

    return (
        <div className="w-64 min-h-screen sidebar-glass flex flex-col fixed left-0 top-0 z-10 transition-all border-r border-surface-200">
            <div className="p-6">
                <div className="flex items-center gap-3 group px-2 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-indigo-100 overflow-hidden ring-4 ring-indigo-50/50">
                        <img src={logo} className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500" alt="Logo" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">NEURAL</span>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.22em] mt-1">ACADEMY</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => navigate(item.path)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 group"
                    >
                        <item.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        <span className="font-semibold text-sm">{item.label}</span>
                    </button>
                ))}

                <div className="pt-6 mt-6 border-t border-slate-100">
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                        {user?.role === 'faculty' ? 'Management' : 'Tools'}
                    </p>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all duration-200">
                        <Settings className="w-5 h-5 text-slate-400" />
                        <span className="font-semibold text-sm">Settings</span>
                    </button>
                </div>
            </nav>

            <div className="px-4 py-6 border-t border-slate-100">
                <div className="flex items-center gap-3 px-4 py-4 mb-4 glass-card border-none">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-indigo-600 shadow-sm">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold truncate text-slate-800">{user?.username || 'User'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user?.role || 'Guest'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-semibold text-sm">Log out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
