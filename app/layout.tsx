import type { Metadata } from 'next';
import { Syne, DM_Sans, DM_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'SupportSnap — AI Support Chatbot in 60 Seconds',
  description:
    'Convert any website into an AI-powered support chatbot in 60 seconds using RAG. No code required.',
  openGraph: {
    title: 'SupportSnap',
    description: 'AI Support Chatbot Generator',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
