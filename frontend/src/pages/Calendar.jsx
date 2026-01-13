import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    FileText,
    Users,
    BookOpen
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [assignments, setAssignments] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [view, setView] = useState('month'); // month, week, day

    useEffect(() => {
        fetchClassrooms();
        fetchAssignments();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const response = await api.get('classrooms/');
            setClassrooms(response.data);
        } catch (error) {
            toast.error('Failed to load classrooms');
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await api.get('assignments/');
            setAssignments(response.data);
        } catch (error) {
            toast.error('Failed to load assignments');
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevMonthLastDay - i),
                isCurrentMonth: false
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            });
        }

        // Next month days
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false
            });
        }

        return days;
    };

    const getAssignmentsForDate = (date) => {
        return assignments.filter(assignment => {
            const dueDate = new Date(assignment.due_date);
            return dueDate.toDateString() === date.toDateString();
        });
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date) => {
        return date.toDateString() === selectedDate.toDateString();
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const days = getDaysInMonth(currentDate);
    const selectedDateAssignments = getAssignmentsForDate(selectedDate);

    return (
        <div className="flex bg-surface-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-outfit">Calendar</h1>
                            <p className="text-gray-500 mt-1 text-sm sm:text-base">Track your assignments and deadlines</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setView('month')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'month'
                                        ? 'bg-google-blue text-white'
                                        : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                                    }`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setView('day')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'day'
                                        ? 'bg-google-blue text-white'
                                        : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                                    }`}
                            >
                                Day
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Calendar Grid */}
                        <div className="lg:col-span-2">
                            <div className="google-card p-6">
                                {/* Month Navigation */}
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                    </h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={previousMonth}
                                            className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setCurrentDate(new Date());
                                                setSelectedDate(new Date());
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-google-blue hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            Today
                                        </button>
                                        <button
                                            onClick={nextMonth}
                                            className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Week Days Header */}
                                <div className="grid grid-cols-7 gap-2 mb-2">
                                    {weekDays.map((day) => (
                                        <div
                                            key={day}
                                            className="text-center text-sm font-semibold text-gray-500 py-2"
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Days */}
                                <div className="grid grid-cols-7 gap-2">
                                    {days.map((day, index) => {
                                        const dayAssignments = getAssignmentsForDate(day.date);
                                        const hasAssignments = dayAssignments.length > 0;

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedDate(day.date)}
                                                className={`
                          relative aspect-square p-2 rounded-lg transition-all
                          ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                          ${isToday(day.date) ? 'bg-google-blue/10 border-2 border-google-blue' : 'border border-surface-200'}
                          ${isSelected(day.date) ? 'ring-2 ring-google-blue shadow-md' : 'hover:bg-surface-50'}
                        `}
                                            >
                                                <span className={`text-sm font-medium ${isToday(day.date) ? 'text-google-blue font-bold' : ''}`}>
                                                    {day.date.getDate()}
                                                </span>
                                                {hasAssignments && (
                                                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                                                        {dayAssignments.slice(0, 3).map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className="w-1 h-1 rounded-full bg-google-blue"
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Selected Day Details */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Date Info */}
                            <div className="google-card p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-google-blue/10 rounded-xl flex items-center justify-center">
                                        <CalendarIcon className="text-google-blue" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">
                                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedDate.toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <p className="text-xs text-blue-600 font-bold">Due Today</p>
                                        <p className="text-2xl font-bold text-blue-700">{selectedDateAssignments.length}</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                        <p className="text-xs text-green-600 font-bold">Classes</p>
                                        <p className="text-2xl font-bold text-green-700">{classrooms.length}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Assignments for Selected Date */}
                            <div className="google-card p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FileText size={20} className="text-google-blue" />
                                    Assignments Due
                                </h3>

                                {selectedDateAssignments.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedDateAssignments.map((assignment) => {
                                            const classroom = classrooms.find(c => c.id === assignment.classroom);
                                            return (
                                                <div
                                                    key={assignment.id}
                                                    onClick={() => navigate(`/classroom/${assignment.classroom}/assignment/${assignment.id}`)}
                                                    className="p-4 bg-surface-50 rounded-lg border border-surface-200 hover:border-google-blue hover:shadow-md transition-all cursor-pointer group"
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h4 className="font-semibold text-sm text-gray-900 group-hover:text-google-blue transition-colors">
                                                            {assignment.title}
                                                        </h4>
                                                        <span className="text-xs font-bold text-google-blue bg-blue-50 px-2 py-1 rounded-full">
                                                            {assignment.points} pts
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <BookOpen size={12} />
                                                        <span>{classroom?.name || 'Unknown Class'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                        <Clock size={12} />
                                                        <span>{new Date(assignment.due_date).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CalendarIcon className="mx-auto text-gray-300 mb-2" size={32} />
                                        <p className="text-sm text-gray-500 italic">No assignments due on this day</p>
                                    </div>
                                )}
                            </div>

                            {/* My Classes */}
                            <div className="google-card p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Users size={20} className="text-google-blue" />
                                    My Classes
                                </h3>
                                <div className="space-y-2">
                                    {classrooms.slice(0, 5).map((classroom) => (
                                        <div
                                            key={classroom.id}
                                            onClick={() => navigate(`/classroom/${classroom.id}`)}
                                            className="p-3 bg-surface-50 rounded-lg hover:bg-surface-100 transition-colors cursor-pointer flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 bg-google-blue rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                {classroom.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{classroom.name}</p>
                                                <p className="text-xs text-gray-500">{classroom.section}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Calendar;
