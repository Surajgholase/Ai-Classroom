import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import NotificationCenter from '../components/NotificationCenter';
import AIAssistant from '../components/AIAssistant';
import { Plus, UserPlus, MoreVertical, BookOpen, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const [classrooms, setClassrooms] = useState([]);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [classCode, setClassCode] = useState('');
    const [newClass, setNewClass] = useState({ name: '', section: '', subject_code: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const response = await api.get('classrooms/');
            setClassrooms(response.data);
        } catch (error) {
            toast.error('Failed to load classrooms');
        }
    };

    const handleJoinClass = async (e) => {
        e.preventDefault();
        try {
            await api.post('classrooms/join/', { code: classCode });
            toast.success('Joined classroom!');
            setShowJoinModal(false);
            fetchClassrooms();
        } catch (error) {
            toast.error('Invalid class code');
        }
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        try {
            await api.post('classrooms/', newClass);
            toast.success('Classroom created!');
            setShowCreateModal(false);
            fetchClassrooms();
        } catch (error) {
            toast.error('Failed to create classroom');
        }
    };

    const handleDeleteClassroom = async (classroomId, e) => {
        e.stopPropagation(); // Prevent navigation when clicking delete
        if (!window.confirm('Delete this classroom? This will also delete all assignments and submissions.')) {
            return;
        }

        try {
            await api.delete(`classrooms/${classroomId}/`);
            toast.success('Classroom deleted');
            fetchClassrooms();
        } catch (error) {
            toast.error('Failed to delete classroom');
        }
    };

    return (
        <div className="flex bg-slate-50/50 min-h-screen font-jakarta">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 lg:p-12">
                <div className="max-w-7xl mx-auto">
                    <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-12 animate-fade-in">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">My Classrooms</h1>
                            <p className="text-slate-500 mt-2 font-medium">Manage and explore your learning environments</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <NotificationCenter />
                            <div className="h-10 w-px bg-slate-200 mx-2"></div>
                            {user?.role === 'student' ? (
                                <button
                                    onClick={() => setShowJoinModal(true)}
                                    className="btn-primary"
                                >
                                    <UserPlus size={20} /> Join Class
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="btn-primary"
                                >
                                    <Plus size={20} /> Create Class
                                </button>
                            )}
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {classrooms.map((cls, index) => (
                            <div
                                key={cls.id}
                                onClick={() => navigate(`/classroom/${cls.id}`)}
                                className="glass-card group cursor-pointer flex flex-col h-80 animate-fade-up overflow-hidden"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="h-32 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 p-6 relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white border border-white/30 hover:bg-white/30 transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                    <h3 className="text-white font-bold text-xl truncate pr-8 mb-1">{cls.name}</h3>
                                    <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/20">
                                        {cls.section || 'General'}
                                    </span>
                                </div>
                                
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div className="relative">
                                        <div className="absolute -top-12 right-0 w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-indigo-100 flex items-center justify-center font-bold text-xl text-indigo-600 z-10">
                                            {cls.faculty_name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-sm font-bold text-slate-800">{cls.faculty_name}</p>
                                            <p className="text-xs font-medium text-slate-400 mt-0.5">Faculty Lead</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                                                    ST
                                                </div>
                                            ))}
                                            <div className="w-7 h-7 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-400">
                                                +12
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {user?.role === 'faculty' && (
                                                <button
                                                    onClick={(e) => handleDeleteClassroom(cls.id, e)}
                                                    className="p-2 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modals with Premium Styling */}
                {showJoinModal && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-fade-in">
                        <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] animate-scale-in">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Join Class</h2>
                            <p className="text-slate-500 mb-8 font-medium">Enter the classroom code provided by your faculty.</p>
                            <form onSubmit={handleJoinClass}>
                                <div className="space-y-6 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Class Code</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: ABC-123"
                                            className="premium-input text-center text-lg font-bold tracking-widest uppercase"
                                            value={classCode}
                                            onChange={(e) => setClassCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setShowJoinModal(false)} className="btn-secondary flex-1">Nevermind</button>
                                    <button type="submit" className="btn-primary flex-1">Join</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showCreateModal && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-fade-in">
                        <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] animate-scale-in">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Create New Class</h2>
                            <p className="text-slate-500 mb-8 font-medium">Set up your new workspace for students to join.</p>
                            <form onSubmit={handleCreateClass} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Classroom Name</label>
                                        <input
                                            type="text"
                                            className="premium-input"
                                            placeholder="Ex: Computer Science 101"
                                            value={newClass.name}
                                            onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Section</label>
                                            <input
                                                type="text"
                                                className="premium-input"
                                                placeholder="Ex: Group A"
                                                value={newClass.section}
                                                onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Subject Code</label>
                                            <input
                                                type="text"
                                                className="premium-input"
                                                placeholder="CS101"
                                                value={newClass.subject_code}
                                                onChange={(e) => setNewClass({ ...newClass, subject_code: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">Cancel</button>
                                    <button type="submit" className="btn-primary flex-1">Create Class</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <AIAssistant />
        </div>
    );
};

export default Dashboard;
