import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  LayoutDashboard,
  Users,
  FileText,
  UserPlus,
  LogOut,
  GraduationCap,
  PlusCircle,
  Upload,
  ClipboardList,
  Stethoscope,
} from 'lucide-react';
import type { User } from '../../types/auth.types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = {
    mahasiswa: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: ClipboardList, label: 'Registrasi Kunjungan', path: '/registration' },
      { icon: PlusCircle, label: 'Pendaftaran Pasien', path: '/patient-registration' },
      { icon: Stethoscope, label: 'Pemeriksaan Pasien', path: '/patient-examination' },
      { icon: FileText, label: 'Riwayat Input', path: '/medical-records' },
    ],
    dosen: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: ClipboardList, label: 'Registrasi Kunjungan', path: '/registration' },
      { icon: PlusCircle, label: 'Pendaftaran Pasien', path: '/patient-registration' },
      { icon: Stethoscope, label: 'Pemeriksaan Pasien', path: '/patient-examination' },
      { icon: Users, label: 'Data Pasien', path: '/patients' },
      { icon: GraduationCap, label: 'Data Mahasiswa', path: '/students' },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: ClipboardList, label: 'Registrasi Kunjungan', path: '/registration' },
      { icon: PlusCircle, label: 'Pendaftaran Pasien', path: '/patient-registration' },
      { icon: Stethoscope, label: 'Pemeriksaan Pasien', path: '/patient-examination' },
      { icon: Users, label: 'Data Pasien', path: '/patients' },
      { icon: GraduationCap, label: 'Data Mahasiswa', path: '/students' },
      { icon: UserPlus, label: 'Manajemen User', path: '/users' },
      { icon: Upload, label: 'Upload Mahasiswa', path: '/upload-mahasiswa' },
    ],
  };

  const currentMenu = menuItems[user.role] || [];

  return (
    <div className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">RME System</h1>
            <p className="text-xs text-slate-500">Medical Records</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {currentMenu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Button
                key={item.path}
                variant={active ? 'default' : 'ghost'}
                className={`w-full justify-start gap-3 ${
                  active
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                onClick={() => navigate(item.path)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};
