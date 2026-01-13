import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home,
    Calendar,
    Settings,
    LogOut,
    Plus,
    ChevronDown,
    User,
    BookOpen,
    Brain,
    FileCheck
} from 'lucide-react';

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
        { icon: Brain, label: 'AI Intelligence', path: '/ai-hub' },
        { icon: FileCheck, label: 'Error Correction', path: '/error-correction' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: BookOpen, label: user?.role === 'faculty' ? 'Teaching' : 'Enrolled', path: '/dashboard' },
    ];

    return (
        <div className="w-64 min-h-screen sidebar-glass flex flex-col fixed left-0 top-0 z-10 transition-all border-r border-surface-200">
            <div className="px-5 py-4 flex items-center gap-3 border-b border-surface-200">
                <div className="w-8 h-8 bg-google-blue rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-xl text-gray-800">AI Classroom</span>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => navigate(item.path)}
                        className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-gray-600 hover:bg-surface-100 transition-colors"
                    >
                        <item.icon className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}

                <div className="pt-4 mt-4 border-t border-surface-200">
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        {user?.role === 'faculty' ? 'Management' : 'Tools'}
                    </p>
                    <button className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-gray-600 hover:bg-surface-100 transition-colors">
                        <Settings className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">Settings</span>
                    </button>
                </div>
            </nav>

            <div className="px-3 py-4 border-t border-surface-200">
                <div className="flex items-center gap-3 px-3 py-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-google-blue/10 border border-google-blue/20 flex items-center justify-center font-bold text-google-blue">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate text-gray-800">{user?.username}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Log out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
