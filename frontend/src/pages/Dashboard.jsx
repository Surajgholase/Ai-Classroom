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
        <div className="flex bg-surface-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 lg:mb-10">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-outfit">My Classes</h1>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your educational spaces</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                            <NotificationCenter />
                            <div className="hidden sm:block h-8 w-px bg-surface-200 mx-1 sm:mx-2"></div>
                            {user?.role === 'student' ? (
                                <button
                                    onClick={() => setShowJoinModal(true)}
                                    className="google-button google-button-primary whitespace-nowrap"
                                >
                                    <UserPlus size={20} /> Join Class
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="google-button google-button-primary whitespace-nowrap"
                                >
                                    <Plus size={20} /> Create Class
                                </button>
                            )}
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {classrooms.map((cls) => (
                            <div
                                key={cls.id}
                                onClick={() => navigate(`/classroom/${cls.id}`)}
                                className="google-card group cursor-pointer h-72 flex flex-col"
                            >
                                <div className="h-24 bg-google-blue p-5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="text-white" size={20} />
                                    </div>
                                    <h3 className="text-white font-semibold text-xl truncate pr-6">{cls.name}</h3>
                                    <p className="text-white/80 text-sm">{cls.section}</p>
                                </div>
                                <div className="flex-1 p-5 relative">
                                    <div className="absolute -top-8 right-6 w-16 h-16 rounded-full bg-white border border-surface-200 shadow-md flex items-center justify-center font-bold text-2xl text-google-blue">
                                        {cls.faculty_name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-900">{cls.faculty_name}</p>
                                    </div>
                                </div>
                                <div className="p-3 border-t border-surface-100 flex justify-between items-center gap-2">
                                    <div className="w-8 h-8 rounded-full hover:bg-surface-100 flex items-center justify-center text-gray-500">
                                        <BookOpen size={18} />
                                    </div>
                                    {user?.role === 'faculty' && (
                                        <button
                                            onClick={(e) => handleDeleteClassroom(cls.id, e)}
                                            className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500 hover:text-red-700 transition-colors"
                                            title="Delete classroom"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Join Modal */}
                {showJoinModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
                            <h2 className="text-xl font-bold mb-4">Join Class</h2>
                            <form onSubmit={handleJoinClass}>
                                <input
                                    type="text"
                                    placeholder="Class code"
                                    className="google-input mb-4"
                                    value={classCode}
                                    onChange={(e) => setClassCode(e.target.value)}
                                    required
                                />
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setShowJoinModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                                    <button type="submit" className="google-button google-button-primary">Join</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
                            <h2 className="text-xl font-bold mb-4">Create Class</h2>
                            <form onSubmit={handleCreateClass} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Class name"
                                    className="google-input"
                                    value={newClass.name}
                                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Section"
                                    className="google-input"
                                    value={newClass.section}
                                    onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Subject Code"
                                    className="google-input"
                                    value={newClass.subject_code}
                                    onChange={(e) => setNewClass({ ...newClass, subject_code: e.target.value })}
                                    required
                                />
                                <div className="flex justify-end gap-3 mt-4">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                                    <button type="submit" className="google-button google-button-primary">Create</button>
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
