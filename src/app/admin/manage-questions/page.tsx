'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { examService } from '@/services/examService';
import { Exam, Question } from '@/types/exam';
import Link from 'next/link';

export default function ManageQuestionsPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [selectedExamId, setSelectedExamId] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        questionText: '',
        options: ['', '', '', ''] as [string, string, string, string],
        correctAnswer: 0,
        marks: 1,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadExams();
    }, []);

    useEffect(() => {
        if (selectedExamId) {
            loadQuestions();
        }
    }, [selectedExamId]);

    const loadExams = async () => {
        try {
            const data = await examService.getAllExams();
            setExams(data);
        } catch (err) {
            console.error('Failed to load exams:', err);
        }
    };

    const loadQuestions = async () => {
        if (!selectedExamId) return;
        try {
            setLoading(true);
            const data = await examService.getExamQuestions(selectedExamId);
            setQuestions(data);
        } catch (err) {
            console.error('Failed to load questions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...(formData.options as string[])];
        newOptions[index] = value;
        setFormData((prev) => ({
            ...prev,
            options: newOptions as [string, string, string, string],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedExamId) {
            setError('Please select an exam');
            return;
        }
        if (!formData.questionText.trim()) {
            setError('Question text is required');
            return;
        }
        if (formData.options.some((opt) => !opt.trim())) {
            setError('All options are required');
            return;
        }

        // Validate marks total
        const currentExam = exams.find((e) => e._id === selectedExamId);
        if (currentExam && totalMarksFromQuestions + formData.marks > currentExam.totalMarks) {
            setError(`Cannot add question. Total marks (${totalMarksFromQuestions + formData.marks}) exceeds exam total (${currentExam.totalMarks})`);
            return;
        }

        setSubmitting(true);

        try {
            await examService.createQuestion({
                examId: selectedExamId,
                questionText: formData.questionText,
                options: formData.options as [string, string, string, string],
                correctAnswer: formData.correctAnswer,
                marks: formData.marks,
            });

            setSuccess('Question added successfully!');
            setFormData({
                questionText: '',
                options: ['', '', '', ''],
                correctAnswer: 0,
                marks: 1,
            });
            await loadQuestions();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add question');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await examService.deleteQuestion(questionId);
                await loadQuestions();
            } catch (err) {
                console.error('Failed to delete question:', err);
                alert('Failed to delete question');
            }
        }
    };

    // Calculate marks totals
    const selectedExam = exams.find((e) => e._id === selectedExamId);
    const totalMarksFromQuestions = questions.reduce((sum, q) => sum + (q.marks || 0), 0);
    const marksMatch = selectedExam ? totalMarksFromQuestions === selectedExam.totalMarks : false;
    const marksMismatch = selectedExam && totalMarksFromQuestions !== selectedExam.totalMarks;
    const remainingMarks = selectedExam ? selectedExam.totalMarks - totalMarksFromQuestions : 0;

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-primary via-secondary to-cyan-500 text-white py-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/admin" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                            ← Back to Admin Panel
                        </Link>
                        <h1 className="text-5xl font-bold mb-2">❓ Manage Questions</h1>
                        <p className="text-xl opacity-90">Add questions to exams with marks and correct answers</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Form Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-white rounded-xl shadow-xl border border-gray-100 p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    ➕ Add Question
                                </h2>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/20 border border-red-400/50 text-red-100 rounded-lg text-sm flex items-center gap-2 mb-4">
                                        <span>⚠️</span>
                                        <span>{error}</span>
                                    </div>
                                )}
                                {success && (
                                    <div className="mb-4 p-3 bg-green-500/20 border border-green-400/50 text-green-100 rounded-lg text-sm flex items-center gap-2 mb-4">
                                        <span>✅</span>
                                        <span>{success}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-900 font-bold text-sm mb-1">📋 Select Exam *</label>
                                        <select
                                            value={selectedExamId}
                                            onChange={(e) => setSelectedExamId(e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 bg-white text-sm"
                                        >
                                            <option value="">Choose exam...</option>
                                            {exams.map((exam) => (
                                                <option key={exam._id} value={exam._id}>
                                                    {exam.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-900 font-bold text-sm mb-1">❓ Question *</label>
                                        <textarea
                                            value={formData.questionText}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, questionText: e.target.value }))}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 resize-none text-sm"
                                            rows={3}
                                            placeholder="Enter question..."
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        {[0, 1, 2, 3].map((idx) => (
                                            <div key={idx}>
                                                <label className="block text-gray-900 font-bold text-xs mb-1">Option {idx + 1} *</label>
                                                <input
                                                    type="text"
                                                    value={formData.options[idx]}
                                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-sm"
                                                    placeholder={`Option ${idx + 1}`}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-gray-900 font-bold text-sm mb-1">✅ Correct Answer *</label>
                                        <select
                                            value={formData.correctAnswer}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, correctAnswer: parseInt(e.target.value) }))}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 bg-white text-sm"
                                        >
                                            {[0, 1, 2, 3].map((idx) => (
                                                <option key={idx} value={idx}>
                                                    Option {idx + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-900 font-bold text-sm mb-1">📊 Marks *</label>
                                        <input
                                            type="number"
                                            value={formData.marks}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, marks: parseInt(e.target.value) || 1 }))}
                                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-sm"
                                            min="1"
                                            max={selectedExam ? Math.max(1, selectedExam.totalMarks - totalMarksFromQuestions + formData.marks) : 999}
                                            required
                                        />
                                        {selectedExam && (
                                            <p className="text-xs text-gray-600 mt-1">
                                                📈 {Math.max(0, remainingMarks)} marks available
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting || !selectedExamId}
                                        className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Adding...
                                            </span>
                                        ) : (
                                            '➕ Add Question'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Marks Validation Alert */}
                            {selectedExam && (
                                <div className={`mb-8 p-6 rounded-xl border-2 ${marksMatch
                                        ? 'bg-green-50 border-green-300'
                                        : 'bg-yellow-50 border-yellow-300'
                                    }`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className={`font-bold mb-2 flex items-center gap-2 text-lg ${marksMatch ? 'text-green-900' : 'text-yellow-900'
                                                }`}>
                                                {marksMatch ? '✅ Marks Perfect' : '⚠️ Marks Mismatch'}
                                            </h3>
                                            <div className="space-y-1 text-sm">
                                                <p className={marksMatch ? 'text-green-800' : 'text-yellow-800'}>
                                                    📊 <strong>Exam Total:</strong> {selectedExam.totalMarks} marks
                                                </p>
                                                <p className={marksMatch ? 'text-green-800' : 'text-yellow-800'}>
                                                    ❓ <strong>Questions Total:</strong> {totalMarksFromQuestions} marks
                                                </p>
                                                <p className={marksMatch ? 'text-green-800' : `text-yellow-800 ${remainingMarks > 0 ? 'font-bold' : ''}`}>
                                                    📈 <strong>Remaining:</strong> {remainingMarks} marks
                                                </p>
                                            </div>
                                        </div>
                                        {marksMismatch && (
                                            <span className="px-4 py-2 bg-yellow-600 text-white rounded-full font-bold text-sm">
                                                Cannot Publish
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Questions List */}
                            {selectedExamId ? (
                                loading ? (
                                    <div className="text-center py-16">
                                        <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-gray-600">Loading questions...</p>
                                    </div>
                                ) : questions.length > 0 ? (
                                    <div className="space-y-6">
                                        {questions.map((question, idx) => (
                                            <div key={question._id} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h3 className="font-bold text-lg text-gray-900">
                                                        #{idx + 1} {question.questionText}
                                                    </h3>
                                                    <div className="flex gap-2">
                                                        <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold text-sm">
                                                            {question.marks} mark{question.marks > 1 ? 's' : ''}
                                                        </span>
                                                        <button
                                                            onClick={() => handleDeleteQuestion(question._id)}
                                                            className="px-3 py-1 bg-red-500 text-white rounded-full font-bold text-sm hover:bg-red-600 transition-colors"
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    {question.options.map((option, optIdx) => (
                                                        <div
                                                            key={optIdx}
                                                            className={`p-3 rounded-lg text-sm font-semibold flex items-center gap-2 ${optIdx === question.correctAnswer
                                                                    ? 'bg-green-100 text-green-800 border-2 border-green-400'
                                                                    : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                                                                }`}
                                                        >
                                                            <span className="font-bold">{String.fromCharCode(65 + optIdx)})</span>
                                                            <span>{option}</span>
                                                            {optIdx === question.correctAnswer && (
                                                                <span className="ml-auto">✅ Correct</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                        <div className="text-5xl mb-4">❓</div>
                                        <p className="text-gray-600 font-semibold">No questions yet for this exam</p>
                                        <p className="text-gray-500 text-sm mt-2">Add your first question using the form on the left</p>
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                    <div className="text-5xl mb-4">📋</div>
                                    <p className="text-gray-600 font-semibold">Select an exam to get started</p>
                                    <p className="text-gray-500 text-sm mt-2">Choose an exam from the dropdown to manage its questions</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
