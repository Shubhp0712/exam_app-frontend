'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { examService } from '@/services/examService';
import Link from 'next/link';

export default function CreateExamPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        duration: 60,
        totalMarks: 100,
        passingMarks: 40,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'title' || name === 'subject'
                ? value
                : (value === '' ? 0 : parseInt(value, 10)),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }
        if (!formData.subject.trim()) {
            setError('Subject is required');
            return;
        }
        if (formData.duration <= 0) {
            setError('Duration must be greater than 0');
            return;
        }
        if (formData.totalMarks <= 0) {
            setError('Total marks must be greater than 0');
            return;
        }
        if (formData.passingMarks >= formData.totalMarks) {
            setError('Passing marks must be less than total marks');
            return;
        }

        setLoading(true);

        try {
            const newExam = await examService.createExam(formData);
            setSuccess('Exam created successfully! Redirecting...');
            setTimeout(() => {
                router.push(`/admin`);
            }, 1500);
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to create exam';
            setError(errorMsg);
            console.error('Error creating exam:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-primary via-secondary to-cyan-500 text-white py-12 px-6">
                    <div className="max-w-4xl mx-auto">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                            ← Back to Admin Panel
                        </Link>
                        <h1 className="text-5xl font-bold mb-2">✍️ Create New Exam</h1>
                        <p className="text-xl opacity-90">Set up a new examination with all required details</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 md:p-12">
                        {error && (
                            <div className="mb-8 p-4 bg-red-500/20 border border-red-400/50 text-red-100 rounded-lg text-sm flex items-center gap-2 animate-bounce">
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="mb-8 p-4 bg-green-500/20 border border-green-400/50 text-green-100 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                                <span>✅</span>
                                <span>{success}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Exam Title & Subject */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    📋 Basic Information
                                </h2>

                                <div>
                                    <label className="block text-gray-900 font-bold text-sm mb-2">📚 Exam Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                                        placeholder="e.g., Java Fundamentals"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-900 font-bold text-sm mb-2">🎓 Subject *</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                                        placeholder="e.g., Programming"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t-2 border-gray-200"></div>

                            {/* Exam Settings */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    ⚙️ Exam Settings
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-gray-900 font-bold text-sm mb-2">⏱️ Duration (minutes) *</label>
                                        <input
                                            type="number"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-900 font-bold text-sm mb-2">📊 Total Marks *</label>
                                        <input
                                            type="number"
                                            name="totalMarks"
                                            value={formData.totalMarks}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-900 font-bold text-sm mb-2">✅ Passing Marks *</label>
                                        <input
                                            type="number"
                                            name="passingMarks"
                                            value={formData.passingMarks}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                                            min="0"
                                            max={formData.totalMarks - 1}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Summary Card */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                                    <h3 className="font-bold text-blue-900 mb-3">📝 Summary</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-blue-700">Duration</p>
                                            <p className="font-bold text-blue-900">{formData.duration} min</p>
                                        </div>
                                        <div>
                                            <p className="text-blue-700">Total Marks</p>
                                            <p className="font-bold text-blue-900">{formData.totalMarks}</p>
                                        </div>
                                        <div>
                                            <p className="text-blue-700">Pass Marks</p>
                                            <p className="font-bold text-blue-900">{formData.passingMarks}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t-2 border-gray-200"></div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            🚀 Create Exam
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="flex-1 py-3 border-2 border-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    ❌ Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
