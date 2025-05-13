
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social File Share (App Router - TS)',
  description: 'Share files with type-specific display, built with Next.js and TypeScript',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}