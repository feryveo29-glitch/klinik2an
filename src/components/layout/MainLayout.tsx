import React from 'react';
import { Sidebar } from './Sidebar';
import type { User } from '../../types/auth.types';

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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={user} onLogout={onLogout} />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
};
