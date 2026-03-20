
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Drfarm - Modern Farming Assistant',
  description: 'AI-powered plant analysis, location-based farming alerts, and marketplace for farmers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background min-h-screen" suppressHydrationWarning>
        <main className="w-full pb-20 md:pb-24">
          {children}
        </main>
        <Navbar />
        <Toaster />
      </body>
    </html>
  );
}
