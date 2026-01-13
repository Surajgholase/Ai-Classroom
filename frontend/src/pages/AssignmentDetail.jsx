import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import AIAssistant from '../components/AIAssistant';
import NotificationCenter from '../components/NotificationCenter';
import { useAuth } from '../context/AuthContext';
import {
    FileText,
    Upload,
    CheckCircle,
    AlertCircle,
    Volume2,
    ShieldCheck,
    Search,
    MessageSquare,
    Users,
    Sparkles,
    BookOpen,
    Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AssignmentDetail = () => {
    const { classId, assignId } = useParams();
    const { user } = useAuth();
    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [allSubmissions, setAllSubmissions] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [grading, setGrading] = useState({ id: null, grade: '', feedback: '' });

    useEffect(() => {
        fetchAssignment();
        if (user?.role === 'student') {
            fetchMySubmission();
        } else {
            fetchAllSubmissions();
        }
    }, [assignId]);

    const fetchAssignment = async () => {
        try {
            const response = await api.get(`assignments/${assignId}/`);
            setAssignment(response.data);
        } catch (error) {
            toast.error('Failed to load assignment');
        }
    };

    const fetchMySubmission = async () => {
        try {
            const response = await api.get(`submissions/?assignment=${assignId}`);
            if (response.data.length > 0) {
                setSubmission(response.data[0]);
            }
        } catch (error) { }
    };

    const fetchAllSubmissions = async () => {
        try {
            const response = await api.get(`submissions/?assignment=${assignId}`);
            setAllSubmissions(response.data);
        } catch (error) { }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('assignment', assignId);

        try {
            await api.post('submissions/', formData);
            toast.success('Work submitted!');
            fetchMySubmission();
        } catch (error) {
            toast.error('Submission failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGrade = async (subId) => {
        try {
            await api.patch(`submissions/${subId}/`, {
                grade: grading.grade,
                feedback_text: grading.feedback,
                status: 'graded'
            });
            toast.success('Graded successfully');
            setGrading({ id: null, grade: '', feedback: '' });
            fetchAllSubmissions();
        } catch (error) {
            toast.error('Failed to grade');
        }
    };

    const speak = (text) => {
        if (!text) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    if (!assignment) return <div>Loading...</div>;

    const phases = [
        { name: 'Assigned', status: 'complete', icon: BookOpen },
        { name: 'Submitted', status: submission ? 'complete' : 'pending', icon: Upload },
        { name: 'Analyzed', status: submission?.ai_report ? 'complete' : 'pending', icon: Sparkles },
        { name: 'Graded', status: submission?.status === 'graded' ? 'complete' : 'pending', icon: CheckCircle },
    ];

    return (
        <div className="flex bg-surface-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold font-outfit text-gray-900">{assignment.title}</h1>
                        <p className="text-xs text-gray-500">Assignment Overview & Submissions</p>
                    </div>
                    <NotificationCenter />
                </header>
                <div className="mb-8 bg-white border border-surface-200 rounded-2xl p-6 shadow-sm overflow-hidden relative">
                    <div className="flex justify-between items-center relative z-10">
                        {phases.map((phase, i) => (
                            <div key={phase.name} className="flex flex-col items-center flex-1 relative">
                                {i < phases.length - 1 && (
                                    <div className={`absolute top-5 left-1/2 w-full h-[2px] ${phase.status === 'complete' && phases[i + 1].status === 'complete' ? 'bg-google-blue' : 'bg-surface-200'}`}></div>
                                )}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 scale-in-center ${phase.status === 'complete' ? 'bg-google-blue text-white shadow-lg shadow-google-blue/20' : 'bg-surface-100 text-gray-400'}`}>
                                    <phase.icon size={18} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase mt-2 tracking-wider ${phase.status === 'complete' ? 'text-google-blue' : 'text-gray-400'}`}>{phase.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-4 border-b border-surface-200 pb-6 mb-6">
                            <div className="w-12 h-12 bg-google-blue rounded-full flex items-center justify-center text-white">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                    <span className="font-semibold text-google-blue">{assignment.faculty_name}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>{assignment.points} points</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>Due {new Date(assignment.due_date).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">{assignment.description}</p>

                            {assignment.formatting_instructions && (
                                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                    <h4 className="text-sm font-bold text-yellow-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                                        <AlertCircle size={16} /> Formatting Requirements
                                    </h4>
                                    <p className="text-sm text-yellow-900 whitespace-pre-wrap">{assignment.formatting_instructions}</p>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-surface-200 pt-8 mt-12">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <MessageSquare size={20} className="text-gray-400" />
                                Comments & Announcements
                            </h3>
                            <p className="text-gray-500 italic">No class comments yet.</p>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        {user?.role === 'student' ? (
                            <div className="google-card p-6 sticky top-24 shadow-hover">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold">Your work</h3>
                                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${submission?.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {submission ? submission.status : 'Assigned'}
                                    </span>
                                </div>

                                {!submission ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="border-2 border-dashed border-surface-300 rounded-xl p-8 flex flex-col items-center justify-center hover:border-google-blue transition-colors group cursor-pointer relative">
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => setFile(e.target.files[0])}
                                            />
                                            <Upload className="text-gray-400 group-hover:text-google-blue mb-2" size={32} />
                                            <p className="text-sm text-gray-500 text-center">
                                                {file ? file.name : 'Click or drag files to upload'}
                                            </p>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!file || loading}
                                            className="w-full google-button google-button-primary"
                                        >
                                            {loading ? 'Submitting...' : 'Hand in'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg border border-surface-200">
                                            <FileText className="text-google-blue" size={20} />
                                            <span className="text-sm font-medium truncate flex-1">{submission.file.split('/').pop()}</span>
                                            <CheckCircle className="text-green-500" size={18} />
                                        </div>

                                        {submission.ai_report && (
                                            <div className="space-y-4 animate-in fade-in duration-500">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Analysis Report</h4>
                                                    <button
                                                        onClick={() => speak(`Submission Analysis. ${submission.ai_report.feedback_summary}. Spelling errors: ${submission.ai_report.spelling_errors.length}. Similarity: ${submission.ai_report.similarity_score} percent.`)}
                                                        className="p-1.5 hover:bg-surface-100 rounded-full text-google-blue flex items-center gap-1 text-xs font-bold"
                                                        title="Listen to full report"
                                                    >
                                                        <Volume2 size={16} />  Listen to Report
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                                                        <p className="text-xs text-red-500 font-bold">Spelling Errors</p>
                                                        <p className="text-xl font-bold text-red-700">{submission.ai_report.spelling_errors.length}</p>

                                                        {submission.ai_report.detailed_spelling_errors?.length > 0 && (
                                                            <details className="mt-2 group">
                                                                <summary className="text-xs text-red-600 font-bold cursor-pointer hover:underline list-none flex items-center gap-1">
                                                                    <span className="group-open:rotate-90 transition-transform">▶</span>
                                                                    View Error Locations
                                                                </summary>
                                                                <div className="mt-2 max-h-60 overflow-y-auto space-y-2">
                                                                    {submission.ai_report.detailed_spelling_errors.map((err, i) => (
                                                                        <div key={i} className="p-2 bg-white rounded border-l-2 border-red-400 text-xs">
                                                                            <p className="font-bold text-red-700">
                                                                                Line {err.line}: "{err.word}"
                                                                            </p>
                                                                            <p className="text-gray-600 italic mt-1">
                                                                                {err.context}
                                                                            </p>
                                                                            {err.suggestion && (
                                                                                <p className="text-green-600 mt-1">
                                                                                    → Suggestion: <span className="font-semibold">{err.suggestion}</span>
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </details>
                                                        )}
                                                    </div>
                                                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                                        <p className="text-xs text-purple-500 font-bold">Similarity Score</p>
                                                        <p className="text-xl font-bold text-purple-700">{submission.ai_report.similarity_score}%</p>
                                                    </div>
                                                </div>

                                                {submission.ai_report.formatting_analysis?.score !== undefined && (
                                                    <div className={`p-4 rounded-lg border ${submission.ai_report.formatting_analysis.compliant ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <p className={`text-xs font-bold ${submission.ai_report.formatting_analysis.compliant ? 'text-green-600' : 'text-orange-600'}`}>
                                                                Formatting Compliance
                                                            </p>
                                                            <span className="text-lg font-bold">{submission.ai_report.formatting_analysis.score}%</span>
                                                        </div>
                                                        {!submission.ai_report.formatting_analysis.compliant && submission.ai_report.formatting_analysis.issues?.length > 0 && (
                                                            <ul className="text-xs space-y-1 list-disc pl-4 text-orange-800">
                                                                {submission.ai_report.formatting_analysis.issues.map((issue, i) => (
                                                                    <li key={i}>{issue}</li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <p className="text-xs text-blue-500 font-bold">Readability</p>
                                                        <span className="text-[10px] bg-blue-200 text-blue-700 px-1.5 rounded-full font-bold">
                                                            {submission.ai_report.readability_score > 60 ? 'Easy' : 'Complex'}
                                                        </span>
                                                    </div>
                                                    <p className="text-lg font-bold text-blue-700">{submission.ai_report.readability_score}</p>
                                                </div>

                                                {submission.ai_report.grammar_errors.length > 0 && (
                                                    <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                                                        <p className="text-xs text-red-600 font-bold flex items-center gap-1 mb-2">
                                                            <Zap size={14} /> Grammar Insights
                                                        </p>
                                                        <ul className="text-xs text-red-800 space-y-2 list-disc pl-4">
                                                            {submission.ai_report.grammar_errors.slice(0, 3).map((e, i) => (
                                                                <li key={i}>{e}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {submission.ai_report.clarity_suggestions.length > 0 && (
                                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <p className="text-xs text-orange-600 font-bold flex items-center gap-1">
                                                                <AlertCircle size={14} /> Clarity Suggestions
                                                            </p>
                                                            <button
                                                                onClick={() => speak(submission.ai_report.clarity_suggestions.join('. '))}
                                                                className="p-1 hover:bg-orange-200 rounded text-orange-600"
                                                            >
                                                                <Volume2 size={16} />
                                                            </button>
                                                        </div>
                                                        <ul className="text-xs text-orange-800 space-y-2 list-disc pl-4">
                                                            {submission.ai_report.clarity_suggestions.slice(0, 2).map((s, i) => (
                                                                <li key={i}>{s}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {submission.ai_report.similarity_score > 20 && (
                                                    <div className="p-4 bg-red-50 rounded-lg border border-red-100 flex items-start gap-3">
                                                        <ShieldCheck className="text-red-500 mt-1" size={18} />
                                                        <div>
                                                            <p className="text-sm font-bold text-red-800">Potential Plagiarism</p>
                                                            <p className="text-xs text-red-700">{submission.ai_report.matched_text}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {submission.status === 'graded' && (
                                            <div className="border-t border-surface-200 pt-6 mt-6">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-bold text-gray-900">Graded</h4>
                                                    <span className="text-2xl font-bold text-google-blue">{submission.grade}/{assignment.points}</span>
                                                </div>
                                                <div className="p-4 bg-blue-50 rounded-xl relative group">
                                                    <button
                                                        onClick={() => speak(submission.feedback_text)}
                                                        className="absolute top-2 right-2 p-1.5 hover:bg-blue-100 rounded-full text-google-blue flex items-center gap-1 text-xs"
                                                    >
                                                        <Volume2 size={14} /> Listen
                                                    </button>
                                                    <p className="text-sm text-blue-800 font-medium italic">"{submission.feedback_text}"</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                                }
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Users size={24} className="text-google-blue" />
                                    Student Submissions
                                </h3>
                                <div className="space-y-4">
                                    {allSubmissions.map((sub) => (
                                        <div key={sub.id} className="google-card p-4 transition-all">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-surface-200 flex items-center justify-center font-bold text-xs uppercase">
                                                        {sub.student_name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{sub.student_name}</p>
                                                        <p className="text-xs text-gray-500">{new Date(sub.submitted_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const url = sub.file.startsWith('http') ? sub.file : `http://127.0.0.1:8000${sub.file}`;
                                                        window.open(url);
                                                    }}
                                                    className="text-google-blue hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Search size={18} />
                                                </button>
                                            </div>

                                            <div className="flex gap-2 mb-4">
                                                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                                                    Errors: {sub.ai_report?.spelling_errors.length}
                                                </span>
                                                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                                                    Similarity: {sub.ai_report?.similarity_score}%
                                                </span>
                                                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                                                    Score: {sub.ai_report?.readability_score}
                                                </span>
                                                {sub.ai_report?.formatting_analysis?.score !== undefined && (
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${sub.ai_report.formatting_analysis.compliant ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        Format: {sub.ai_report.formatting_analysis.score}%
                                                    </span>
                                                )}
                                            </div>

                                            {sub.ai_report?.formatting_analysis?.issues?.length > 0 && (
                                                <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 mb-4">
                                                    <p className="text-[10px] text-orange-600 font-bold uppercase mb-1">Formatting Issues</p>
                                                    <ul className="text-xs text-orange-800 list-disc pl-4">
                                                        {sub.ai_report.formatting_analysis.issues.slice(0, 3).map((issue, idx) => (
                                                            <li key={idx}>{issue}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {sub.ai_report?.feedback_summary && (
                                                <div className="p-3 bg-surface-50 rounded-lg border border-surface-200 mb-4">
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Analysis Verdict</p>
                                                    <p className="text-xs text-gray-700 italic">"{sub.ai_report.feedback_summary}"</p>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 mb-4">
                                                <Sparkles size={14} className="text-google-blue" />
                                                <span className="text-xs font-bold text-google-blue">Suggested Grade: {sub.ai_report?.suggested_grade}/{assignment.points}</span>
                                                <button
                                                    onClick={() => setGrading({ ...grading, id: sub.id, grade: sub.ai_report?.suggested_grade, feedback: sub.ai_report?.feedback_summary })}
                                                    className="text-[10px] bg-google-blue/10 text-google-blue px-2 py-0.5 rounded-full hover:bg-google-blue/20"
                                                >
                                                    Apply
                                                </button>
                                            </div>

                                            {grading.id === sub.id ? (
                                                <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                                                    <input
                                                        type="number"
                                                        placeholder="Grade"
                                                        className="google-input text-sm"
                                                        value={grading.grade || ''}
                                                        onChange={(e) => setGrading({ ...grading, grade: e.target.value })}
                                                    />
                                                    <textarea
                                                        placeholder="Feedback"
                                                        className="google-input text-sm h-20"
                                                        value={grading.feedback || ''}
                                                        onChange={(e) => setGrading({ ...grading, feedback: e.target.value })}
                                                    />
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setGrading({ id: null, grade: '', feedback: '' })} className="flex-1 text-sm text-gray-500">Cancel</button>
                                                        <button onClick={() => handleGrade(sub.id)} className="flex-1 google-button google-button-primary py-1 text-sm">Save</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    {sub.status === 'graded' ? (
                                                        <span className="font-bold text-green-600">{sub.grade}/{assignment.points}</span>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">Not graded</span>
                                                    )}
                                                    <button
                                                        onClick={() => setGrading({ id: sub.id, grade: sub.grade || '', feedback: sub.feedback_text || '' })}
                                                        className="google-button google-button-outline py-1 px-4 text-sm"
                                                    >
                                                        Grade
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {allSubmissions.length === 0 && (
                                        <div className="text-center py-10 bg-surface-50 rounded-2xl border-2 border-dashed border-surface-200">
                                            <Users className="mx-auto text-gray-300 mb-2" size={32} />
                                            <p className="text-sm text-gray-500 italic">Waiting for submissions...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <AIAssistant classroomId={classId} />
        </div>
    );
};

export default AssignmentDetail;
