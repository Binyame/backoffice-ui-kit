import type { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';
import './globals.css';

export const metadata: Metadata = {
  title: 'BackOffice - Admin Dashboard',
  description: 'Portfolio-grade BackOffice UI Kit demo application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main
            style={{
              marginLeft: '240px',
              flex: 1,
              padding: '2rem',
              maxWidth: '100%',
            }}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
