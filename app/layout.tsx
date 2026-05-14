// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'XAU/USD NY Session Analyzer',
  description: 'Professional Gold trading analysis tool — New York Session 07:00–12:00 ET',
  keywords: ['XAUUSD', 'Gold', 'Forex', 'NY Session', 'Trading', 'Technical Analysis'],
  openGraph: {
    title: 'XAU/USD NY Session Analyzer',
    description: 'Real-time Gold analysis for the New York trading session',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
