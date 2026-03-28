import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
    title: 'ExamHub - Online Examination System',
    description: 'A comprehensive online examination platform',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <Navbar />
                    <main className="min-h-screen">{children}</main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
