import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { Sparkles, Send, User, Cpu, Zap, Trash2, Layout, MessageSquare, History, Star, ArrowRight, Upload, FileText, X, BookOpen, List, HelpCircle, Lightbulb, Target, CheckCircle, TrendingUp } from 'lucide-react';
import logo from '../assets/logo.png';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

// Simple markdown parser for AI responses
const parseMarkdown = (text) => {
    if (!text) return '';

    let html = text
        // Bold text: **text** -> <strong>text</strong>
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Bullet points: * item or • item -> <li>item</li>
        .replace(/^[•\*\-]\s+(.+)$/gm, '<li>$1</li>')
        // Numbered lists: 1. item -> <li>item</li>
        .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br/>');

    // Wrap in paragraph
    html = '<p>' + html + '</p>';

    // Wrap consecutive <li> in <ul>
    html = html.replace(/(<li>.*?<\/li>)/gs, (match) => {
        return '<ul class="markdown-list">' + match + '</ul>';
    });

    return html;
};

const AIAssistantHub = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([
        {
            id: 1,
            role: 'assistant',
            text: `Welcome to the AI Intelligence Hub, ${user?.username}! I'm your advanced classroom companion. How can I assist your academic journey today?`,
            time: new Date()
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ classrooms: 0, assignments: 0, pending: 0 });
    const [uploadedFile, setUploadedFile] = useState(null);
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('classrooms/');
            const classrooms = response.data;
            let totalAssignments = 0;
            // This is a simplified stat calculation
            setStats({
                classrooms: classrooms.length,
                assignments: 12, // Mock for now
                pending: 3
            });
        } catch (error) { }
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    const handleSend = async (e, textOverride = null) => {
        if (e) e.preventDefault();
        const textToSend = textOverride || message;
        if (!textToSend.trim()) return;

        const userMsg = {
            id: Date.now(),
            role: 'user',
            text: uploadedFile ? `📄 ${uploadedFile.name}: ${textToSend}` : textToSend,
            time: new Date()
        };

        if (!textOverride) setMessage('');
        setChat(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            // If file is uploaded, use file analysis endpoint
            if (uploadedFile) {
                const formData = new FormData();
                formData.append('file', uploadedFile);
                formData.append('question', textToSend);

                const response = await api.post('analyze-file/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const aiMsg = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    text: response.data.answer,
                    time: new Date()
                };
                setChat(prev => [...prev, aiMsg]);
            } else {
                // Regular chat without file
                const response = await api.post('classrooms/global_chat/', { message: textToSend });
                const aiMsg = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    text: response.data.response,
                    time: new Date()
                };
                setChat(prev => [...prev, aiMsg]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            console.error('Error response:', error.response);
            setChat(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                text: error.response?.data?.error || error.response?.data?.detail || error.message || "I encountered an error. Please try again.",
                time: new Date(),
                isError: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestions = [
        { title: "Summarize Progress", desc: "Get a high-level overview of your classes", icon: Layout },
        { title: "Upcoming Deadlines", desc: "Check what's due soon", icon: Zap },
        { title: "Improve My Work", desc: "Tips based on your latest analysis", icon: Cpu },
    ];

    const fileQuestions = [
        { q: "Explain this file in simple and easy words for learning", icon: BookOpen },
        { q: "Summarize this file in points for quick study or revision", icon: List },
        { q: "What concepts or topics should I learn from this file?", icon: Cpu },
        { q: "Generate important questions and answers from this file", icon: HelpCircle },
        { q: "Explain difficult or technical parts of this file in an easy way", icon: Lightbulb },
        { q: "What is the main objective of this file?", icon: Target },
        { q: "What are the key points or important sections in this file?", icon: Star },
        { q: "Does this file follow proper academic format and structure?", icon: CheckCircle },
        { q: "How can I improve this file to get better marks?", icon: TrendingUp },
        { q: "What questions can a teacher ask from this file during evaluation or viva?", icon: MessageSquare }
    ];

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleFileQuestion = async (question) => {
        if (!uploadedFile) return;

        const userMsg = {
            id: Date.now(),
            role: 'user',
            text: `📄 ${uploadedFile.name}: ${question}`,
            time: new Date()
        };

        setChat(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);
            formData.append('question', question);

            const response = await api.post('analyze-file/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const aiMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                text: response.data.answer,
                time: new Date()
            };
            setChat(prev => [...prev, aiMsg]);
        } catch (error) {
            setChat(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                text: error.response?.data?.error || "Failed to analyze file. Please try again.",
                time: new Date(),
                isError: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-slate-50/50 min-h-screen font-jakarta">
            <Sidebar />
            <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 ring-8 ring-white/10 overflow-hidden group">
                            <img src={logo} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" alt="Logo" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
                                AI Intelligence Hub
                                <span className="text-[10px] bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest font-bold border border-indigo-200">Neural v2</span>
                            </h1>
                            <p className="text-sm font-medium text-slate-500">Processing real-time academic insights</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-8 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Classes</p>
                                <p className="text-xl font-bold text-slate-800">{stats.classrooms}</p>
                            </div>
                            <div className="w-px h-10 bg-slate-100"></div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Tasks</p>
                                <p className="text-xl font-bold text-indigo-600">{stats.pending}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-white/30 backdrop-blur-sm relative">
                        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                            {chat.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={clsx(
                                        "flex w-full gap-5",
                                        msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    )}
                                >
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                                        msg.role === 'user' 
                                            ? 'bg-slate-100 text-slate-600' 
                                            : 'bg-white border border-slate-100 ring-4 ring-indigo-50/50 overflow-hidden'
                                    }`}>
                                        {msg.role === 'user' ? <User size={20} /> : <img src={logo} className="w-full h-full object-cover" alt="AI" />}
                                    </div>
                                    <div className={clsx(
                                        "max-w-[75%] p-6 rounded-[2rem] text-[15px] leading-relaxed relative group transition-all duration-300",
                                        msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-none shadow-2xl shadow-indigo-200'
                                            : msg.isError
                                                ? 'bg-rose-50 text-rose-700 border border-rose-100 rounded-tl-none'
                                                : 'glass-card text-slate-800 border-none rounded-tl-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/90'
                                    )}>
                                        {msg.role === 'assistant' && !msg.isError ? (
                                            <div
                                                className="markdown-content"
                                                dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.text) }}
                                            />
                                        ) : (
                                            <div className="font-medium">{msg.text}</div>
                                        )}
                                        <div className={clsx(
                                            "text-[10px] mt-3 font-bold uppercase tracking-widest opacity-60",
                                            msg.role === 'user' ? 'text-indigo-100/80 text-right' : 'text-slate-400'
                                        )}>
                                            {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-100 overflow-hidden ring-4 ring-indigo-50/50">
                                        <img src={logo} className="w-full h-full object-cover" alt="AI" />
                                    </div>
                                    <div className="glass-card p-6 rounded-[2rem] border-none flex gap-3 items-center bg-white/80">
                                        <div className="flex gap-1.5">
                                            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                                            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                                            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                                        </div>
                                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest ml-3">Neural Processing...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-10 bg-white border-t border-slate-100">
                            {uploadedFile && (
                                <div className="max-w-4xl mx-auto mb-6 p-5 bg-indigo-50/50 border border-indigo-100 rounded-3xl flex items-center justify-between animate-fade-in shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                                            <img src={logo} className="w-full h-full object-cover" alt="AI" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800">{uploadedFile.name}</p>
                                            <p className="text-xs font-medium text-slate-500 mt-0.5">Ready for AI Analysis • {(uploadedFile.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setUploadedFile(null)}
                                        className="p-3 hover:bg-rose-50 rounded-2xl text-rose-500 transition-all active:scale-95"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSend} className="relative group max-w-4xl mx-auto">
                                <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-violet-700 rounded-[2.5rem] opacity-20 blur-xl group-focus-within:opacity-40 transition-all duration-500"></div>
                                <div className="relative flex items-center bg-slate-50/80 backdrop-blur-md border border-slate-200 rounded-[2rem] focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all shadow-xl shadow-slate-200/50 overflow-hidden">
                                    <div className="pl-8 text-slate-400">
                                        <MessageSquare size={24} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={uploadedFile ? "Ask anything about this document..." : "Consult your Neural Assistant..."}
                                        className="w-full bg-transparent border-none px-6 py-8 text-lg font-medium focus:ring-0 focus:outline-none placeholder:text-slate-400"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        disabled={loading}
                                    />
                                    <div className="pr-6 flex gap-3">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.docx,.doc,.txt"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-5 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:text-indigo-600 hover:border-indigo-200 hover:shadow-lg transition-all active:scale-95"
                                            title="Upload Knowledge Source"
                                        >
                                            <Upload size={24} />
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!message.trim() || loading}
                                            className="p-5 bg-indigo-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-indigo-300 transition-all disabled:opacity-20 active:scale-95 flex items-center justify-center shadow-lg shadow-indigo-100"
                                        >
                                            <Send size={24} />
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <div className="h-px w-12 bg-slate-100"></div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Advanced Neural Core Engine v4.0</p>
                                <div className="h-px w-12 bg-slate-100"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Suggestions & Tools */}
                    <div className="w-[420px] bg-slate-50/80 backdrop-blur-xl border-l border-slate-200 p-10 space-y-10 overflow-y-auto custom-scrollbar">
                        <div>
                            <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_indigo]"></div>
                                {uploadedFile ? 'Cognitive File Analysis' : 'Neural Shortcuts'}
                            </h3>
                            <div className="space-y-5">
                                {uploadedFile ? (
                                    fileQuestions.map((fq, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleFileQuestion(fq.q)}
                                            disabled={loading}
                                            className="w-full text-left p-5 glass-card border-none hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all group active:scale-95 disabled:opacity-50 bg-white/70"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 flex-shrink-0 mt-0.5 shadow-sm">
                                                    <fq.icon size={20} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700 leading-relaxed pr-2">{fq.q}</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    suggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(null, s.title)}
                                            className="w-full text-left p-6 glass-card border-none hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all group active:scale-95 bg-white/70"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                                    <s.icon size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-sm text-slate-800">{s.title}</h4>
                                                    <p className="text-xs font-medium text-slate-400 mt-1">{s.desc}</p>
                                                </div>
                                                <ArrowRight size={18} className="text-slate-300 group-hover:text-indigo-600 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                                Performance Insights
                            </h3>
                            <div className="glass-card border-none p-8 bg-gradient-to-br from-white to-slate-50/50 shadow-xl">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse group-hover:scale-150 transition-transform"></div>
                                        <p className="text-xs font-bold text-slate-700">Vocabulary score +12% this week</p>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse group-hover:scale-150 transition-transform"></div>
                                        <p className="text-xs font-bold text-slate-700">Predictive similarity patterns found</p>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse group-hover:scale-150 transition-transform"></div>
                                        <p className="text-xs font-bold text-slate-700">Advanced readability achieved</p>
                                    </div>
                                </div>
                                <button className="w-full mt-8 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm">Execute Full Audit</button>
                            </div>
                        </div>

                        <div className="p-8 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-indigo-200">
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000 delay-100"></div>
                            
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-2xl relative overflow-hidden ring-8 ring-white/10 mb-6">
                                    <img src={logo} className="w-full h-full object-cover" alt="AI" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 tracking-tight">AI Writing Tutor</h3>
                                <p className="text-xs text-indigo-100/60 leading-relaxed mb-8">Refine your academic voice with contextual guidance and real-time corrections.</p>
                                <button className="w-full bg-white text-indigo-900 px-8 py-3.5 rounded-2xl text-sm font-bold hover:shadow-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-xl">Open Neural Editor</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AIAssistantHub;
