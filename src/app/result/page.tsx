'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { resultService } from '@/services/resultService';
import { Result } from '@/types/result';
import Link from 'next/link';

export default function ResultPage() {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadResults();
    }, []);

    const loadResults = async () => {
        try {
            setLoading(true);
            let data: Result[];

            if (isAdmin()) {
                data = await resultService.getAllResults();
            } else {
                data = await resultService.getStudentResults();
            }

            setResults(data);
        } catch (err: any) {
            console.error('Failed to load results:', err);
            setError('Failed to load results');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex justify-center items-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 text-lg">Loading results...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-primary via-secondary to-cyan-500 text-white py-12 px-6">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-5xl font-bold mb-2">📊 {isAdmin() ? 'All Results' : 'Your Results'}</h1>
                        <p className="text-xl opacity-90">View your exam performance and analytics</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    {error && (
                        <div className="mb-8 p-4 bg-red-500/20 border border-red-400/50 text-red-100 rounded-xl text-sm flex items-center gap-2 animate-bounce">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {results.length > 0 ? (
                        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-primary">
                                        <th className="text-left px-6 py-4 font-bold text-gray-900">📚 Exam</th>
                                        <th className="text-center px-6 py-4 font-bold text-gray-900">📊 Marks</th>
                                        <th className="text-center px-6 py-4 font-bold text-gray-900">📈 Percentage</th>
                                        <th className="text-center px-6 py-4 font-bold text-gray-900">✅ Status</th>
                                        <th className="text-center px-6 py-4 font-bold text-gray-900">⏱️ Time</th>
                                        <th className="text-center px-6 py-4 font-bold text-gray-900">📅 Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((result, idx) => (
                                        <tr
                                            key={result._id}
                                            className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                        >
                                            <td className="px-6 py-4 font-semibold text-gray-900">Exam</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-bold">
                                                    {result.marksObtained}/{result.totalMarks}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-gray-900">
                                                {result.percentage.toFixed(2)}%
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${result.status === 'pass'
                                                        ? 'bg-green-100 text-green-800 flex items-center gap-1'
                                                        : 'bg-red-100 text-red-800 flex items-center gap-1'
                                                    }`}>
                                                    {result.status === 'pass' ? '✅ Passed' : '❌ Failed'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-700 font-medium">
                                                {(result.timeTaken / 60).toFixed(1)} mins
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-700">
                                                {new Date(result.submittedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Summary Stats */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Exams', value: results.length, icon: '📋' },
                                    { label: 'Passed', value: results.filter(r => r.status === 'pass').length, icon: '✅' },
                                    { label: 'Failed', value: results.filter(r => r.status === 'fail').length, icon: '❌' },
                                    { label: 'Avg Score', value: (results.reduce((s, r) => s + r.percentage, 0) / results.length).toFixed(1) + '%', icon: '📊' },
                                ].map((stat, idx) => (
                                    <div key={idx} className="text-center">
                                        <p className="text-sm text-gray-600 mb-1">{stat.icon}</p>
                                        <p className="font-bold text-gray-900">{stat.label}</p>
                                        <p className="text-lg font-bold text-primary">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-gray-600 text-xl font-semibold mb-2">No Results Yet</p>
                            <p className="text-gray-500 mb-8">You haven't completed any exams yet</p>
                            <Link href="/exam" className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                                🚀 Take an Exam Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
