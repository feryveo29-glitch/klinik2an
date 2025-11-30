import React from 'react';
import { Sidebar } from './Sidebar';
import type { User } from '../../types/auth.types';

import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  user,
  onLogout,
  children,
}) => {
  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <Header user={user} onLogout={onLogout} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
