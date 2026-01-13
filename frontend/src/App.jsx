import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ClassroomDetail from './pages/ClassroomDetail';
import AssignmentDetail from './pages/AssignmentDetail';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import AIAssistantHub from './pages/AIAssistantHub';
import ErrorCorrection from './pages/ErrorCorrection';
import { Toaster } from 'react-hot-toast';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-google-blue border-t-transparent animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Preparing your classroom...</p>
                </div>
            </div>
        );
    }
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
                <div className="min-h-screen bg-surface-50">
                    <Toaster position="top-right" />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/calendar"
                            element={
                                <PrivateRoute>
                                    <Calendar />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/ai-hub"
                            element={
                                <PrivateRoute>
                                    <AIAssistantHub />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/enrolled"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/classroom/:id"
                            element={
                                <PrivateRoute>
                                    <ClassroomDetail />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/classroom/:classId/assignment/:assignId"
                            element={
                                <PrivateRoute>
                                    <AssignmentDetail />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/error-correction"
                            element={
                                <PrivateRoute>
                                    <ErrorCorrection />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
