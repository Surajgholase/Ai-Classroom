import { useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import {
    FileCheck, Upload, Download, AlertCircle, CheckCircle,
    Sparkles, FileText, X, Loader, TrendingUp, AlertTriangle,
    BookOpen, Zap, Eye, ArrowRight, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ErrorCorrection = () => {
    const { user } = useAuth();
    const [uploadedFile, setUploadedFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            const validTypes = ['.pdf', '.docx', '.doc', '.txt'];
            const fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

            if (!validTypes.includes(fileExt)) {
                setError('Please upload a PDF, DOCX, DOC, or TXT file');
                return;
            }

            setUploadedFile(file);
            setError(null);
            setResults(null);
        }
    };

    const handleAnalyze = async () => {
        if (!uploadedFile) return;

        setAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);

            console.log('Analyzing file:', uploadedFile.name);
            const response = await api.post('detect-errors/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Analysis response:', response.data);
            setResults(response.data);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.response?.data?.error || 'Failed to analyze file. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleDownload = async () => {
        if (!uploadedFile) {
            setError('No file uploaded');
            return;
        }

        setDownloading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);

            console.log('Downloading corrected file for:', uploadedFile.name);

            const response = await api.post('download-corrected/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob'
            });

            console.log('Download response received, size:', response.data.size);

            // Create download link
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const originalName = uploadedFile.name.substring(0, uploadedFile.name.lastIndexOf('.'));
            const extension = results?.file_extension || 'txt';
            const filename = `${originalName}_corrected.${extension}`;

            console.log('Downloading as:', filename);
            link.setAttribute('download', filename);

            document.body.appendChild(link);
            link.click();
            link.remove();

            // Clean up the URL
            window.URL.revokeObjectURL(url);

            console.log('Download completed successfully');
        } catch (err) {
            console.error('Download error:', err);
            console.error('Error response:', err.response);
            setError(err.response?.data?.error || err.message || 'Failed to download corrected file. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const handleReset = () => {
        setUploadedFile(null);
        setResults(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getErrorColor = (count) => {
        if (count === 0) return 'text-green-600';
        if (count < 5) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getErrorBgColor = (count) => {
        if (count === 0) return 'bg-green-50 border-green-200';
        if (count < 5) return 'bg-yellow-50 border-yellow-200';
        return 'bg-red-50 border-red-200';
    };

    return (
        <div className="flex bg-slate-50/50 min-h-screen font-jakarta">
            <Sidebar />
            <main className="flex-1 ml-64 p-10 lg:p-14">
                {/* Header */}
                <div className="mb-14 animate-fade-in">
                    <div className="flex items-center gap-6 mb-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-indigo-100 ring-4 ring-white">
                            <FileCheck className="text-white" size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight flex items-center gap-4">
                                Neural Correction
                                <span className="text-[10px] bg-white text-indigo-600 px-3 py-1 rounded-full uppercase tracking-[0.2em] font-black border border-indigo-100 shadow-sm">
                                    ADVANCED AI
                                </span>
                            </h1>
                            <p className="text-lg font-medium text-slate-500 mt-1">
                                High-precision semantic and grammatical error resolution
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Panel - Upload */}
                    <div className="lg:col-span-4">
                        <div className="glass-card p-10 border-none shadow-2xl bg-white/80 backdrop-blur-xl sticky top-10">
                            <h2 className="text-xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
                                <Upload size={24} className="text-indigo-600" />
                                Source Document
                            </h2>

                            {!uploadedFile ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group relative overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-sm">
                                            <FileText className="text-indigo-600 group-hover:text-white transition-colors" size={40} />
                                        </div>
                                        <p className="text-lg font-bold text-slate-700 mb-2">
                                            Drop your file here
                                        </p>
                                        <p className="text-sm font-medium text-slate-400">
                                            PDF, DOCX, or MarkDown
                                        </p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.docx,.doc,.txt"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 shadow-inner">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-100">
                                                    <FileText className="text-white" size={24} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm text-slate-800 truncate">
                                                        {uploadedFile.name}
                                                    </p>
                                                    <p className="text-xs font-bold text-indigo-400 mt-1 uppercase tracking-widest">
                                                        {(uploadedFile.size / 1024).toFixed(1)} KB • Ready
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleReset}
                                                className="p-3 hover:bg-rose-50 rounded-2xl text-rose-400 hover:text-rose-600 transition-all active:scale-95"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {!results ? (
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={analyzing}
                                            className="btn-primary w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-3 text-lg"
                                        >
                                            {analyzing ? (
                                                <>
                                                    <RefreshCw className="animate-spin" size={24} />
                                                    Neural Scanning...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles size={24} />
                                                    Start Analysis
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleDownload}
                                            disabled={downloading}
                                            className="w-full bg-emerald-500 text-white py-5 rounded-[1.5rem] font-bold hover:shadow-2xl hover:shadow-emerald-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg shadow-xl shadow-emerald-100 active:scale-95"
                                        >
                                            {downloading ? (
                                                <>
                                                    <Loader className="animate-spin" size={24} />
                                                    Finalizing...
                                                </>
                                            ) : (
                                                <>
                                                    <Download size={24} />
                                                    Download Output
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 bg-rose-50 border border-rose-100 rounded-[1.5rem] p-5 flex items-start gap-4 shadow-sm"
                                >
                                    <AlertCircle className="text-rose-600 flex-shrink-0" size={24} />
                                    <p className="text-sm font-bold text-rose-700">{error}</p>
                                </motion.div>
                            )}

                            {/* Features List */}
                            <div className="mt-10 pt-10 border-t border-slate-100">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                                    Cognitive Checks
                                </h3>
                                <div className="space-y-5">
                                    {[
                                        { icon: BookOpen, text: 'Semantic Accuracy', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                        { icon: Zap, text: 'Phonetic Resolution', color: 'text-amber-500', bg: 'bg-amber-50' },
                                        { icon: Eye, text: 'Syntactic Formatting', color: 'text-violet-600', bg: 'bg-violet-50' },
                                        { icon: TrendingUp, text: 'Lexical Density', color: 'text-emerald-600', bg: 'bg-emerald-50' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 group cursor-default">
                                            <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} transition-all duration-300 group-hover:scale-110 shadow-sm border border-white`}>
                                                <item.icon size={20} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Results */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {analyzing ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="glass-card border-none shadow-2xl p-20 text-center flex flex-col items-center justify-center min-h-[600px] bg-white/90"
                                >
                                    <div className="relative">
                                        <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 animate-spin-slow shadow-2xl shadow-indigo-200 ring-8 ring-indigo-50">
                                            <Sparkles className="text-white" size={56} />
                                        </div>
                                        <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white animate-pulse"></div>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">
                                        Processing Knowledge Graph
                                    </h3>
                                    <p className="text-lg font-medium text-slate-400 max-w-sm">
                                        Our neural engine is cross-referencing semantic patterns...
                                    </p>
                                </motion.div>
                            ) : results ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-10"
                                >
                                    {/* Error Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        {[
                                            { label: 'Spelling', count: results.error_summary.spelling_count, icon: BookOpen, color: 'indigo' },
                                            { label: 'Grammar', count: results.error_summary.grammar_count, icon: Zap, color: 'amber' },
                                            { label: 'Form', count: results.error_summary.formatting_count, icon: Eye, color: 'violet' },
                                            { label: 'Density', count: results.error_summary.clarity_count, icon: TrendingUp, color: 'emerald' }
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                className="glass-card border-none p-6 shadow-xl bg-white flex flex-col items-center justify-center hover:-translate-y-1 transition-all"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                                                    <item.icon className={`text-${item.color}-500`} size={24} />
                                                </div>
                                                <span className="text-3xl font-black text-slate-800 mb-1">
                                                    {item.count}
                                                </span>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                                    {item.label}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total Summary */}
                                    <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 rounded-[2.5rem] shadow-2xl p-10 text-white relative overflow-hidden group">
                                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl transition-all duration-1000 group-hover:scale-150"></div>
                                        
                                        <div className="flex items-center justify-between relative z-10">
                                            <div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
                                                    <p className="text-indigo-200 text-xs font-black uppercase tracking-[0.3em]">
                                                        Neural Final Report
                                                    </p>
                                                </div>
                                                <p className="text-6xl font-black tracking-tighter">
                                                    {results.error_summary.total_errors}
                                                </p>
                                                <p className="text-xl font-bold text-indigo-200 mt-2">
                                                    Anomalies Resolved
                                                </p>
                                            </div>
                                            <div className="w-28 h-28 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl">
                                                {results.error_summary.total_errors === 0 ? (
                                                    <CheckCircle size={56} className="text-emerald-400" />
                                                ) : (
                                                    <Sparkles size={56} className="text-indigo-300" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                                            <p className="text-lg font-medium text-white/90">
                                                {results.error_summary.total_errors === 0
                                                    ? '🎉 Cognitive excellence achieved. No anomalies detected.'
                                                    : '✨ Synthesis complete. Semantic integrity has been restored.'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Detailed Errors */}
                                    {results.error_summary.total_errors > 0 && (
                                        <div className="glass-card border-none shadow-2xl p-10 bg-white/90 space-y-12">
                                            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-4">
                                                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                                                Anomaly Breakdown
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                {/* Spelling Errors */}
                                                {results.errors.spelling.length > 0 && (
                                                    <div className="space-y-4">
                                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                            Phonetic & Orthographic
                                                        </h4>
                                                        <div className="space-y-3">
                                                            {results.errors.spelling.map((error, i) => (
                                                                <div key={i} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all duration-300">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="font-mono text-sm text-rose-400 bg-rose-50 px-2 py-1 rounded-lg line-through font-bold">
                                                                            {error.word}
                                                                        </span>
                                                                        <ArrowRight className="text-slate-300" size={16} />
                                                                        <span className="font-mono text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg font-black">
                                                                            {error.correction}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Grammar Errors */}
                                                {results.errors.grammar.length > 0 && (
                                                    <div className="space-y-4">
                                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                                            Syntactic Structures
                                                        </h4>
                                                        <div className="space-y-3">
                                                            {results.errors.grammar.map((error, i) => (
                                                                <div key={i} className="bg-amber-50/30 border border-amber-100 rounded-2xl p-5 group hover:bg-white hover:shadow-lg transition-all duration-300">
                                                                    <p className="text-[10px] font-black text-amber-600 mb-1 uppercase tracking-widest">
                                                                        {error.issue?.replace(/_/g, ' ')}
                                                                    </p>
                                                                    <p className="text-sm font-bold text-slate-700">
                                                                        {error.suggestion}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Preview Comparison */}
                                    <div className="glass-card border-none shadow-2xl p-10 bg-white/95">
                                        <h3 className="text-2xl font-black text-slate-800 mb-8">Neural Visualization</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] px-2">Original Metadata</h4>
                                                <div className="bg-slate-900 rounded-[1.5rem] p-6 text-sm text-slate-400 font-mono h-80 overflow-y-auto custom-scrollbar border border-slate-800 shadow-2xl">
                                                    <div className="opacity-50 pointer-events-none mb-4">// Source Input</div>
                                                    {results.original_preview}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] px-2">Synthesized Output</h4>
                                                <div className="bg-slate-900 rounded-[1.5rem] p-6 text-sm text-emerald-400 font-mono h-80 overflow-y-auto custom-scrollbar border border-slate-700 shadow-2xl">
                                                    <div className="opacity-50 pointer-events-none mb-4">// AI Resolution</div>
                                                    {results.corrected_preview}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="glass-card border-none shadow-2xl p-20 text-center flex flex-col items-center justify-center min-h-[600px] bg-white/60"
                                >
                                    <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-slate-100 shadow-inner">
                                        <FileCheck className="text-slate-300" size={64} />
                                    </div>
                                    <h3 className="text-4xl font-black text-slate-800 mb-6 tracking-tight">
                                        Neural Interface Ready
                                    </h3>
                                    <p className="text-xl font-medium text-slate-400 max-w-md mx-auto leading-relaxed">
                                        Initialize the correction cycle by providing a source document for semantic parsing.
                                    </p>
                                    <div className="flex gap-4 mt-12">
                                        <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">GPT-4o Optimized</div>
                                        <div className="px-4 py-2 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-widest">MarkDown v2</div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ErrorCorrection;
