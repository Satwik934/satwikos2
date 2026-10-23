import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'SatwikOS — Satwik934', description: 'An interactive developer universe, built by Satwik934.', openGraph: { title: 'SatwikOS', description: 'Explore the code universe of Satwik934.' } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
