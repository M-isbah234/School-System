import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AppLayout from "@/components/AppLayout";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Student & Parent Portal',
  description: 'A complete full-stack portal for a Pakistani school ecosystem',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
