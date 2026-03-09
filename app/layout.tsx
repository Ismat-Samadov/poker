import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PokerNeon — Texas Hold\'em',
  description: 'A neon-styled Texas Hold\'em poker game with AI opponents. Built with Next.js, TypeScript, and Tailwind CSS.',
  keywords: ['poker', 'texas holdem', 'card game', 'browser game', 'next.js'],
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#060d1a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
