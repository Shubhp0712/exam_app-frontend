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
            <div className="max-w-2xl mx-auto px-6 py-8">
                <Link href="/admin" className="text-primary hover:underline mb-8 inline-block">
                    ← Back to Admin Panel
                </Link>

                <div className="card shadow-lg">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Exam</h1>

                    {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}
                    {success && <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="label">Exam Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., Java Fundamentals"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Subject *</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g., Programming"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="label">Duration (minutes) *</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="input-field"
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Total Marks *</label>
                                <input
                                    type="number"
                                    name="totalMarks"
                                    value={formData.totalMarks}
                                    onChange={handleChange}
                                    className="input-field"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Passing Marks *</label>
                            <input
                                type="number"
                                name="passingMarks"
                                value={formData.passingMarks}
                                onChange={handleChange}
                                className="input-field"
                                min="0"
                                max={formData.totalMarks - 1}
                                required
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex-1 font-semibold py-3"
                            >
                                {loading ? 'Creating...' : 'Create Exam'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="btn-secondary flex-1 font-semibold py-3"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    );
}
