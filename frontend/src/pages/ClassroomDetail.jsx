import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import AIAssistant from '../components/AIAssistant';
import NotificationCenter from '../components/NotificationCenter';
import { useAuth } from '../context/AuthContext';
import {
    Plus,
    Send,
    FileText,
    Users,
    BarChart,
    Info,
    Calendar,
    MoreVertical,
    Trash2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ClassroomDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [classroom, setClassroom] = useState(null);
    const [activeTab, setActiveTab] = useState('stream');
    const [streamData, setStreamData] = useState({ announcements: [], assignments: [] });
    const [peopleData, setPeopleData] = useState({ faculty: null, students: [] });
    const [gradesData, setGradesData] = useState({ assignments: [], gradebook: [] });
    const [analyticsData, setAnalyticsData] = useState([]);
    const [announcement, setAnnouncement] = useState('');
    const [showCreateAssignment, setShowCreateAssignment] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', due_date: '', points: 100, formatting_instructions: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchClassroom();
        if (activeTab === 'stream' || activeTab === 'classwork') fetchStream();
        if (activeTab === 'people') fetchPeople();
        if (activeTab === 'grades') fetchGrades();
        if (activeTab === 'analytics') fetchAnalytics();
    }, [id, activeTab]);

    const fetchClassroom = async () => {
        try {
            const response = await api.get(`classrooms/${id}/`);
            setClassroom(response.data);
        } catch (error) {
            toast.error('Failed to load classroom');
        }
    };

    const fetchStream = async () => {
        try {
            const response = await api.get(`classrooms/${id}/stream/`);
            setStreamData(response.data);
        } catch (error) {
            toast.error('Failed to load stream');
        }
    };

    const fetchPeople = async () => {
        try {
            const response = await api.get(`classrooms/${id}/people/`);
            setPeopleData(response.data);
        } catch (error) {
            toast.error('Failed to load people');
        }
    };

    const fetchGrades = async () => {
        try {
            const response = await api.get(`classrooms/${id}/grades/`);
            setGradesData(response.data);
        } catch (error) {
            toast.error('Failed to load grades');
        }
    };

    const fetchAnalytics = async () => {
        try {
            const response = await api.get(`classrooms/${id}/analytics/`);
            setAnalyticsData(response.data);
        } catch (error) {
            toast.error('Failed to load analytics');
        }
    };

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        try {
            await api.post('announcements/', { classroom: id, content: announcement });
            setAnnouncement('');
            fetchStream();
            toast.success('Announcement posted');
        } catch (error) {
            toast.error('Failed to post');
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            await api.post('assignments/', { ...newAssignment, classroom: id });
            setShowCreateAssignment(false);
            fetchStream();
            toast.success('Assignment created');
        } catch (error) {
            toast.error('Failed to create assignment');
        }
    };

    const handleDeleteAssignment = async (assignmentId, e) => {
        e.stopPropagation(); // Prevent navigation when clicking delete
        if (!window.confirm('Delete this assignment? This will also delete all submissions.')) {
            return;
        }

        try {
            await api.delete(`assignments/${assignmentId}/`);
            toast.success('Assignment deleted');
            fetchStream();
        } catch (error) {
            toast.error('Failed to delete assignment');
        }
    };

    if (!classroom) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-jakarta">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-2xl border-4 border-indigo-600 border-t-transparent animate-spin shadow-lg"></div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Classroom...</p>
            </div>
        </div>
    );

    return (
        <div className="flex bg-slate-50/50 min-h-screen font-jakarta">
            <Sidebar />
            <main className="flex-1 ml-64 p-0 flex flex-col h-screen overflow-hidden">
                <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
                        <div className="flex gap-10">
                            {['stream', 'classwork', 'people', 'grades', ...(user?.role === 'faculty' ? ['analytics'] : [])].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-5 px-1 font-bold text-sm capitalize transition-all relative group ${activeTab === tab
                                        ? 'text-indigo-600'
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-6">
                            <NotificationCenter />
                            <div className="h-6 w-px bg-slate-100"></div>
                            <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                <Info size={22} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="max-w-7xl mx-auto p-10 lg:p-14">
                        {activeTab === 'stream' && (
                            <div className="space-y-10 animate-fade-in">
                                <div className="h-72 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[2.5rem] p-12 flex flex-col justify-end relative shadow-2xl shadow-indigo-100 overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/5 rounded-full blur-3xl"></div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                                                {classroom.section || 'General Section'}
                                            </div>
                                            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                                                {classroom.subject_code || 'CS-101'}
                                            </div>
                                        </div>
                                        <h1 className="text-5xl font-black text-white tracking-tighter mb-2">{classroom.name}</h1>
                                        <div className="flex items-center gap-4 mt-6">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-indigo-600 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-white">ST</div>
                                                ))}
                                                <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center text-[10px] font-black">+24</div>
                                            </div>
                                            <p className="text-indigo-100 font-bold text-sm">Active Learners</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-8 right-8 bg-black/20 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 text-white shadow-2xl">
                                        <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-0.5">Vortex Access Key</p>
                                        <p className="font-mono text-xl font-black tracking-[0.3em]">{classroom.class_code}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-12 gap-10">
                                    <div className="col-span-3 space-y-6">
                                        <div className="glass-card p-8 border-none bg-white/80 shadow-xl">
                                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                                <Calendar size={14} /> Critical Tasks
                                            </h4>
                                            {streamData.assignments.length > 0 ? (
                                                <div className="space-y-6">
                                                    {streamData.assignments.slice(0, 3).map((a) => (
                                                        <div key={a.id} className="group cursor-pointer">
                                                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Due {new Date(a.due_date).toLocaleDateString()}</p>
                                                            <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">{a.title}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs font-bold text-slate-400 italic">No trajectory updates</p>
                                            )}
                                            <button className="w-full mt-8 py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm">View Archive</button>
                                        </div>
                                    </div>

                                    <div className="col-span-9 space-y-8">
                                        {/* Announcement Input */}
                                        <div className="glass-card p-6 border-none bg-white shadow-xl flex gap-6 items-center">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 flex items-center justify-center font-black text-indigo-600 border border-indigo-100 shadow-inner">
                                                {user?.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <form onSubmit={handlePostAnnouncement} className="flex-1 flex gap-4">
                                                <input
                                                    className="flex-1 bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:outline-none font-medium transition-all"
                                                    placeholder="Share an insight with your collective..."
                                                    value={announcement}
                                                    onChange={(e) => setAnnouncement(e.target.value)}
                                                />
                                                <button type="submit" className="p-4 bg-indigo-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-indigo-200 transition-all active:scale-95 shadow-lg shadow-indigo-100">
                                                    <Send size={24} />
                                                </button>
                                            </form>
                                        </div>

                                        {/* Feed */}
                                        <div className="space-y-6">
                                            {streamData.announcements.map((ann) => (
                                                <div key={`ann-${ann.id}`} className="glass-card p-8 border-none bg-white/90 shadow-lg hover:shadow-xl transition-all group animate-fade-up">
                                                    <div className="flex gap-6">
                                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-200 shadow-sm group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all duration-500">
                                                            {ann.author_name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div>
                                                                    <p className="font-extrabold text-slate-800 flex items-center gap-2">
                                                                        {ann.author_name}
                                                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-widest font-black">Admin</span>
                                                                    </p>
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(ann.created_at).toLocaleString()}</p>
                                                                </div>
                                                                <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                                                                    <MoreVertical size={20} />
                                                                </button>
                                                            </div>
                                                            <div className="prose prose-slate max-w-none">
                                                                <p className="text-slate-600 font-medium leading-relaxed">{ann.content}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {streamData.assignments.map((asgn) => (
                                                <div
                                                    key={`asgn-${asgn.id}`}
                                                    onClick={() => navigate(`/classroom/${id}/assignment/${asgn.id}`)}
                                                    className="glass-card p-8 border-none bg-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden animate-fade-up"
                                                >
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                                    
                                                    <div className="flex gap-6 relative z-10">
                                                        <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-100 group-hover:rotate-6 transition-transform">
                                                            <FileText size={28} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-bold text-slate-800 leading-snug">
                                                                        <span className="text-indigo-600 font-black">{asgn.faculty_name}</span> has deployed a new challenge: 
                                                                        <span className="block text-2xl font-black tracking-tight text-slate-900 mt-1">{asgn.title}</span>
                                                                    </p>
                                                                    <div className="flex items-center gap-4 mt-4">
                                                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                                            <Calendar size={12} /> {new Date(asgn.created_at).toLocaleDateString()}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                                                                             {asgn.points} Quantum Points
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col items-end gap-2">
                                                                    <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                                                                        <MoreVertical size={20} />
                                                                    </button>
                                                                    <div className="text-[10px] font-black text-rose-500 px-3 py-1.5 bg-rose-50 rounded-lg uppercase tracking-[0.2em] shadow-sm border border-rose-100">
                                                                        Deadline Approaching
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'classwork' && (
                            <div className="space-y-10 animate-fade-in">
                                {user?.role === 'faculty' && (
                                    <div className="flex justify-between items-center bg-indigo-900 rounded-[2rem] p-10 shadow-2xl text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                        <div className="relative z-10">
                                            <h2 className="text-3xl font-black tracking-tight mb-2">Workspace Orchestrator</h2>
                                            <p className="text-indigo-200 font-bold text-sm">Deploy new intellectual challenges to your collective.</p>
                                        </div>
                                        <button
                                            onClick={() => setShowCreateAssignment(true)}
                                            className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-2xl hover:bg-slate-50 transition-all active:scale-95 group relative z-10"
                                        >
                                            <Plus size={20} className="inline mr-2" /> New Assignment
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {streamData.assignments.map((asgn) => (
                                        <div
                                            key={asgn.id}
                                            className="glass-card p-6 border-none bg-white shadow-xl hover:shadow-2xl transition-all group flex items-center justify-between"
                                        >
                                            <div
                                                className="flex items-center gap-6 flex-1 cursor-pointer"
                                                onClick={() => navigate(`/classroom/${id}/assignment/${asgn.id}`)}
                                            >
                                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner border border-indigo-100">
                                                    <FileText size={28} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{asgn.title}</h3>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Manifested on {new Date(asgn.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Termination Date</p>
                                                    <p className="text-sm font-black text-rose-500">{new Date(asgn.due_date).toLocaleDateString()}</p>
                                                </div>
                                                {user?.role === 'faculty' && (
                                                    <button
                                                        onClick={(e) => handleDeleteAssignment(asgn.id, e)}
                                                        className="p-4 hover:bg-rose-50 rounded-2xl text-rose-400 hover:text-rose-600 transition-all active:scale-95"
                                                        title="Terminate assignment"
                                                    >
                                                        <Trash2 size={22} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'people' && (
                            <div className="max-w-4xl mx-auto space-y-16 animate-fade-in py-10">
                                <section>
                                    <div className="flex items-center gap-6 mb-12 border-b-4 border-indigo-600 pb-6">
                                        <h2 className="text-5xl font-black text-indigo-600 tracking-tighter">Architects</h2>
                                        <div className="h-2 flex-1 bg-indigo-50 rounded-full"></div>
                                    </div>
                                    <div className="flex items-center gap-6 px-10 group cursor-default">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-100 group-hover:rotate-12 transition-transform">
                                            {peopleData.faculty?.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="text-2xl font-black text-slate-800 block">{peopleData.faculty?.username}</span>
                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Neural Architect</span>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex justify-between items-center border-b-4 border-slate-800 pb-6 mb-12">
                                        <h2 className="text-5xl font-black text-slate-800 tracking-tighter">Collective</h2>
                                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-50 rounded-full border border-slate-100">{peopleData.students.length} Learners</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {peopleData.students.map((student) => (
                                            <div key={student.id} className="flex items-center gap-5 px-8 py-6 glass-card border-none bg-white hover:shadow-2xl group transition-all cursor-default">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all">
                                                    {student.username?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-lg text-slate-800 block group-hover:text-indigo-600 transition-colors">{student.username}</span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Participant</span>
                                                </div>
                                            </div>
                                        ))}
                                        {peopleData.students.length === 0 && (
                                            <div className="col-span-full text-center py-24 glass-card border-none bg-slate-50">
                                                <Users size={64} className="mx-auto text-slate-200 mb-6" />
                                                <p className="text-xl font-bold text-slate-400 italic">No learners have joined this lattice yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'grades' && (
                            <div className="animate-fade-in py-10">
                                <div className="glass-card border-none shadow-2xl bg-white overflow-hidden rounded-[2.5rem]">
                                    <div className="p-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                                        <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                                            <BarChart className="text-indigo-400" /> Performance Matrix
                                        </h3>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Quantum Ledger v2.1</div>
                                    </div>
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/50">
                                                    <th className="text-left p-8 border-b border-slate-100 sticky left-0 bg-white/95 backdrop-blur-md z-10 w-80 min-w-[320px] text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Learner Identity</th>
                                                    {gradesData.assignments.map((asgn) => (
                                                        <th key={asgn.id} className="p-8 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center min-w-[200px]">
                                                            <div className="truncate font-black text-slate-800 mb-1" title={asgn.title}>{asgn.title}</div>
                                                            <div className="opacity-60">Max Potential: {asgn.points}</div>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {gradesData.gradebook.map((record) => (
                                                    <tr key={record.student_id} className="hover:bg-indigo-50/30 transition-colors">
                                                        <td className="p-8 border-b border-slate-50 sticky left-0 bg-white z-10">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-200">
                                                                    {record.student_name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="font-bold text-slate-800">{record.student_name}</span>
                                                            </div>
                                                        </td>
                                                        {record.grades.map((g, idx) => (
                                                            <td key={idx} className="p-8 border-b border-slate-50 text-center">
                                                                {g.grade !== null ? (
                                                                    <div className="flex flex-col items-center gap-1">
                                                                        <span className="text-2xl font-black text-indigo-600">{g.grade}</span>
                                                                        <div className="w-12 h-1 bg-indigo-100 rounded-full overflow-hidden">
                                                                             <div className="h-full bg-indigo-600 rounded-full" style={{ width: '85%' }}></div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg ${g.status === 'missing' ? 'bg-rose-50 text-rose-500 border border-rose-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                                                        {g.status}
                                                                    </span>
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {gradesData.gradebook.length === 0 && (
                                        <div className="text-center py-32 bg-slate-50/50">
                                            <BarChart size={64} className="mx-auto text-slate-200 mb-6" />
                                            <p className="text-xl font-bold text-slate-400 italic">No telemetry data recorded.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'analytics' && (
                            <div className="space-y-12 animate-fade-in py-10">
                                <div className="flex items-center gap-6 mb-4">
                                    <h2 className="text-5xl font-black text-slate-800 tracking-tighter">Telemetrics</h2>
                                    <div className="h-2 flex-1 bg-slate-100 rounded-full"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {analyticsData.map((stat) => (
                                        <div key={stat.assignment_id} className="glass-card border-none p-10 bg-white shadow-2xl hover:shadow-indigo-100 transition-all animate-fade-up">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                                                    <BarChart size={24} />
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stat.title}</h3>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6 mb-8">
                                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Efficiency Rating</p>
                                                    <p className="text-4xl font-black text-indigo-600 tracking-tighter">{stat.average_grade}</p>
                                                </div>
                                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Adoption Rate</p>
                                                    <p className="text-4xl font-black text-emerald-500 tracking-tighter">{stat.submission_rate}%</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                                                    <span>Saturation Level</span>
                                                    <span>{stat.submission_rate}%</span>
                                                </div>
                                                <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-1">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${stat.submission_rate}%` }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-lg shadow-indigo-100"
                                                    ></motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {analyticsData.length === 0 && (
                                    <div className="text-center py-32 glass-card border-none bg-slate-50">
                                        <BarChart size={64} className="mx-auto text-slate-200 mb-6" />
                                        <p className="text-xl font-bold text-slate-400 italic">No telemetry available to visualize.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Create Assignment Modal */}
                {showCreateAssignment && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-fade-in">
                        <div className="bg-white rounded-[3rem] p-12 max-w-2xl w-full shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] animate-scale-in relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2 relative z-10 tracking-tight">Deploy Logic Node</h2>
                            <p className="text-slate-500 mb-10 font-bold text-sm relative z-10">Configure the parameters for the new intellectual challenge.</p>
                            
                            <form onSubmit={handleCreateAssignment} className="space-y-8 relative z-10">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Objective Title</label>
                                        <input
                                            type="text"
                                            className="premium-input px-6 py-4"
                                            placeholder="Ex: Advanced Quantum Mechanics"
                                            value={newAssignment.title}
                                            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mission Description</label>
                                        <textarea
                                            className="premium-input px-6 py-4 h-32 resize-none"
                                            placeholder="Detailed instructions for the collective..."
                                            value={newAssignment.description}
                                            onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Neural Formatting Keys</label>
                                        <textarea
                                            className="premium-input px-6 py-4 h-20 resize-none text-sm font-medium"
                                            placeholder="Structural constraints for AI verification..."
                                            value={newAssignment.formatting_instructions}
                                            onChange={(e) => setNewAssignment({ ...newAssignment, formatting_instructions: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Potential Points</label>
                                            <input
                                                type="number"
                                                className="premium-input px-6 py-4"
                                                value={newAssignment.points}
                                                onChange={(e) => setNewAssignment({ ...newAssignment, points: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Termination Matrix (Due Date)</label>
                                            <input
                                                type="datetime-local"
                                                className="premium-input px-6 py-4"
                                                value={newAssignment.due_date}
                                                onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <button type="button" onClick={() => setShowCreateAssignment(false)} className="px-8 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all flex-1">Abort</button>
                                    <button type="submit" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-2xl hover:shadow-indigo-200 transition-all flex-1 shadow-xl shadow-indigo-100">Initialize Deployment</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <AIAssistant classroomId={id} />
        </div>
    );
};

export default ClassroomDetail;
