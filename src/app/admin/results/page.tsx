'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { examService } from '@/services/examService';
import { resultService } from '@/services/resultService';
import { Exam } from '@/types/exam';
import Link from 'next/link';

interface ExamResult {
    _id: string;
    studentId: {
        _id: string;
        fullName: string;
        email: string;
    };
    examId: string;
    totalMarksObtained: number;
    totalMarks: number;
    percentage: number;
    isPassed: boolean;
    submittedAt: string;
}

interface Statistics {
    totalStudents: number;
    passedStudents: number;
    failedStudents: number;
    averageMarks: number;
    highestMarks: number;
    lowestMarks: number;
    passPercentage: number;
}

export default function AdminResultsPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [selectedExam, setSelectedExam] = useState<string>('');
    const [results, setResults] = useState<ExamResult[]>([]);
    const [stats, setStats] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [resultsLoading, setResultsLoading] = useState(false);
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = async () => {
        try {
            const examsData = await examService.getAllExams();
            setExams(examsData);
            if (examsData.length > 0) {
                setSelectedExam(examsData[0]._id);
                await loadExamResults(examsData[0]._id);
            }
        } catch (error) {
            console.error('Failed to load exams:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadExamResults = async (examId: string) => {
        if (!examId) return;
        setResultsLoading(true);
        try {
            const [examResults, examStats] = await Promise.all([
                resultService.getExamResults(examId),
                resultService.getExamStats(examId),
            ]);
            setResults(examResults);
            setStats(examStats);
        } catch (error) {
            console.error('Failed to load results:', error);
            setResults([]);
            setStats(null);
        } finally {
            setResultsLoading(false);
        }
    };

    const handleExamChange = (examId: string) => {
        setSelectedExam(examId);
        loadExamResults(examId);
    };

    const selectedExamData = exams.find((e) => e._id === selectedExam);

    return (
        <ProtectedRoute requiredRole="admin">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-10">
                    <Link href="/admin" className="text-primary hover:underline inline-block mb-4">
                        ← Back to Admin Panel
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-800">Student Results</h1>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-600">Loading exams...</p>
                        </div>
                    </div>
                ) : exams.length === 0 ? (
                    <div className="text-center py-16 card">
                        <p className="text-gray-600 text-lg mb-4">No exams found.</p>
                        <Link href="/admin/create-exam" className="btn-primary bg-primary text-white hover:bg-primary/90 inline-block">
                            Create First Exam
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Exam Selector */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Exam:</label>
                            <select
                                value={selectedExam}
                                onChange={(e) => handleExamChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {exams.map((exam) => (
                                    <option key={exam._id} value={exam._id}>
                                        {exam.title} - {exam.subject}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {resultsLoading ? (
                            <div className="flex justify-center items-center min-h-[400px]">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-600">Loading results...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Exam Details */}
                                {selectedExamData && (
                                    <div className="card mb-8 border-l-4 border-primary">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold">Title</p>
                                                <p className="text-lg font-bold text-gray-800">{selectedExamData.title}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold">Subject</p>
                                                <p className="text-lg font-bold text-gray-800">{selectedExamData.subject}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold">Total Marks</p>
                                                <p className="text-lg font-bold text-gray-800">{selectedExamData.totalMarks}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-semibold">Passing Marks</p>
                                                <p className="text-lg font-bold text-gray-800">{selectedExamData.passingMarks}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Statistics */}
                                {stats && (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                            <p className="text-sm font-semibold mb-2 opacity-90">Total Submissions</p>
                                            <p className="text-3xl font-bold">{stats.totalStudents}</p>
                                        </div>
                                        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                                            <p className="text-sm font-semibold mb-2 opacity-90">Passed</p>
                                            <p className="text-3xl font-bold">{stats.passedStudents}</p>
                                            <p className="text-sm mt-2 opacity-90">{Math.round(stats.passPercentage)}%</p>
                                        </div>
                                        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
                                            <p className="text-sm font-semibold mb-2 opacity-90">Failed</p>
                                            <p className="text-3xl font-bold">{stats.failedStudents}</p>
                                        </div>
                                        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                                            <p className="text-sm font-semibold mb-2 opacity-90">Average Marks</p>
                                            <p className="text-3xl font-bold">{Math.round(stats.averageMarks)}/{selectedExamData?.totalMarks}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Results Table */}
                                {results.length > 0 ? (
                                    <div className="card overflow-x-auto">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Results</h2>
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Student Name</th>
                                                    <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Marks</th>
                                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Percentage</th>
                                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Status</th>
                                                    <th className="px-6 py-3 text-center font-semibold text-gray-700">Submitted</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.map((result, idx) => (
                                                    <tr key={result._id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200 hover:bg-blue-50 transition`}>
                                                        <td className="px-6 py-4 text-gray-800 font-semibold">
                                                            {result.studentId?.fullName || 'Unknown Student'}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600">
                                                            {result.studentId?.email || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-gray-800 font-bold">{result.totalMarksObtained}/{result.totalMarks}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex items-center justify-center">
                                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                                    {Math.round(result.percentage)}%
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${result.isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                {result.isPassed ? '✓ Passed' : '✗ Failed'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-gray-600 text-xs">
                                                            {result.submittedAt ? (
                                                                <>
                                                                    {new Date(result.submittedAt).toLocaleDateString()}{' '}
                                                                    {new Date(result.submittedAt).toLocaleTimeString()}
                                                                </>
                                                            ) : (
                                                                'N/A'
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-16 card">
                                        <p className="text-gray-600 text-lg">No results yet for this exam.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </ProtectedRoute>
    );
}
