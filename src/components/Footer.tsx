'use client';

import { usePathname } from 'next/navigation';

export const Footer: React.FC = () => {
    const pathname = usePathname();

    // Don't show footer on auth pages
    if (['/login', '/signup'].includes(pathname)) {
        return null;
    }

    return (
        <footer className="bg-gray-800 text-white py-8 mt-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">ExamHub</h3>
                        <p className="text-gray-400">A comprehensive online examination platform built with Next.js and TypeScript.</p>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <a href="/dashboard" className="hover:text-white transition-colors">
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="/result" className="hover:text-white transition-colors">
                                    Results
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <a href="mailto:support@examhub.com" className="hover:text-white transition-colors">
                                    Email Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-white transition-colors">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>&copy; 2026 ExamHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
