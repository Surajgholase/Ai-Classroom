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
        <div className="flex bg-surface-50 min-h-screen font-outfit">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <FileCheck className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                AI Error Correction
                                <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                                    Beta
                                </span>
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Automatically detect and fix errors in your documents
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel - Upload */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-lg border border-surface-200 p-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Upload size={20} className="text-purple-600" />
                                Upload Document
                            </h2>

                            {!uploadedFile ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-surface-300 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all group"
                                >
                                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                                        <FileText className="text-purple-600" size={32} />
                                    </div>
                                    <p className="font-semibold text-gray-700 mb-2">
                                        Click to upload file
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PDF, DOCX, DOC, or TXT
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.docx,.doc,.txt"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <FileText className="text-white" size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm text-gray-900 truncate">
                                                        {uploadedFile.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {(uploadedFile.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleReset}
                                                className="p-2 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleAnalyze}
                                        disabled={analyzing}
                                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {analyzing ? (
                                            <>
                                                <Loader className="animate-spin" size={20} />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={20} />
                                                Analyze Document
                                            </>
                                        )}
                                    </button>

                                    {results && (
                                        <button
                                            onClick={handleDownload}
                                            disabled={downloading}
                                            className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {downloading ? (
                                                <>
                                                    <Loader className="animate-spin" size={20} />
                                                    Downloading...
                                                </>
                                            ) : (
                                                <>
                                                    <Download size={20} />
                                                    Download Corrected File
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
                                    className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3"
                                >
                                    <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                                    <p className="text-sm text-red-700">{error}</p>
                                </motion.div>
                            )}

                            {/* Features List */}
                            <div className="mt-8 pt-8 border-t border-surface-200">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                                    What We Check
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { icon: BookOpen, text: 'Spelling Errors', color: 'text-blue-600' },
                                        { icon: Zap, text: 'Grammar Issues', color: 'text-yellow-600' },
                                        { icon: Eye, text: 'Formatting Problems', color: 'text-purple-600' },
                                        { icon: TrendingUp, text: 'Clarity & Readability', color: 'text-green-600' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center ${item.color}`}>
                                                <item.icon size={16} />
                                            </div>
                                            <span className="text-sm text-gray-700">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Results */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {analyzing ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white rounded-3xl shadow-lg border border-surface-200 p-12 text-center"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                                        <Sparkles className="text-white" size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Analyzing Your Document
                                    </h3>
                                    <p className="text-gray-500">
                                        Our AI is detecting and correcting errors...
                                    </p>
                                </motion.div>
                            ) : results ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Error Summary Cards */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            {
                                                label: 'Spelling',
                                                count: results.error_summary.spelling_count,
                                                icon: BookOpen,
                                                color: 'blue'
                                            },
                                            {
                                                label: 'Grammar',
                                                count: results.error_summary.grammar_count,
                                                icon: Zap,
                                                color: 'yellow'
                                            },
                                            {
                                                label: 'Formatting',
                                                count: results.error_summary.formatting_count,
                                                icon: Eye,
                                                color: 'purple'
                                            },
                                            {
                                                label: 'Clarity',
                                                count: results.error_summary.clarity_count,
                                                icon: TrendingUp,
                                                color: 'green'
                                            }
                                        ].map((item, i) => (
                                            <div
                                                key={i}
                                                className={`bg-white rounded-2xl shadow-lg border p-6 ${getErrorBgColor(item.count)}`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <item.icon className={getErrorColor(item.count)} size={24} />
                                                    <span className={`text-3xl font-bold ${getErrorColor(item.count)}`}>
                                                        {item.count}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {item.label} {item.count === 1 ? 'Error' : 'Errors'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total Summary */}
                                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-lg p-8 text-white">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-purple-100 text-sm font-semibold mb-2">
                                                    Total Errors Found
                                                </p>
                                                <p className="text-5xl font-bold">
                                                    {results.error_summary.total_errors}
                                                </p>
                                            </div>
                                            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                                                {results.error_summary.total_errors === 0 ? (
                                                    <CheckCircle size={40} />
                                                ) : (
                                                    <AlertTriangle size={40} />
                                                )}
                                            </div>
                                        </div>
                                        <p className="mt-4 text-purple-100 text-sm">
                                            {results.error_summary.total_errors === 0
                                                ? '🎉 Perfect! No errors detected in your document.'
                                                : '✨ AI has generated a corrected version for you.'
                                            }
                                        </p>
                                    </div>

                                    {/* Detailed Errors */}
                                    {results.error_summary.total_errors > 0 && (
                                        <div className="bg-white rounded-3xl shadow-lg border border-surface-200 p-8">
                                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                <AlertCircle className="text-purple-600" size={24} />
                                                Error Details
                                            </h3>

                                            <div className="space-y-6">
                                                {/* Spelling Errors */}
                                                {results.errors.spelling.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                            <BookOpen className="text-blue-600" size={18} />
                                                            Spelling Errors
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {results.errors.spelling.map((error, i) => (
                                                                <div key={i} className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
                                                                    <div>
                                                                        <span className="font-mono text-sm text-red-600 line-through">
                                                                            {error.word}
                                                                        </span>
                                                                        <ArrowRight className="inline mx-2 text-gray-400" size={14} />
                                                                        <span className="font-mono text-sm text-green-600 font-semibold">
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
                                                    <div>
                                                        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                            <Zap className="text-yellow-600" size={18} />
                                                            Grammar Issues
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {results.errors.grammar.map((error, i) => (
                                                                <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                                                                    <p className="text-sm font-semibold text-gray-700 mb-1">
                                                                        {error.issue?.replace(/_/g, ' ').toUpperCase()}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600">
                                                                        {error.suggestion}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Formatting Errors */}
                                                {results.errors.formatting.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                            <Eye className="text-purple-600" size={18} />
                                                            Formatting Issues
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {results.errors.formatting.map((error, i) => (
                                                                <div key={i} className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                                                                    <p className="text-sm text-gray-700">
                                                                        {error.suggestion}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Clarity Issues */}
                                                {results.errors.clarity.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                            <TrendingUp className="text-green-600" size={18} />
                                                            Clarity Suggestions
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {results.errors.clarity.map((error, i) => (
                                                                <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-3">
                                                                    <p className="text-sm text-gray-700">
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
                                    <div className="bg-white rounded-3xl shadow-lg border border-surface-200 p-8">
                                        <h3 className="text-xl font-bold text-gray-900 mb-6">
                                            Preview Comparison
                                        </h3>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                                                    Original
                                                </h4>
                                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-gray-700 font-mono max-h-64 overflow-y-auto thin-scrollbar">
                                                    {results.original_preview}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                                                    Corrected
                                                </h4>
                                                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-gray-700 font-mono max-h-64 overflow-y-auto thin-scrollbar">
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
                                    className="bg-white rounded-3xl shadow-lg border border-surface-200 p-16 text-center"
                                >
                                    <div className="w-24 h-24 bg-surface-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <FileCheck className="text-gray-400" size={48} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        Upload a Document to Begin
                                    </h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        Our AI will analyze your document for spelling, grammar, formatting,
                                        and clarity issues, then generate a corrected version for you to download.
                                    </p>
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
