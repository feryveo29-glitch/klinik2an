import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  LayoutDashboard,
  Users,

  UserPlus,

  GraduationCap,
  PlusCircle,
  Upload,
  ClipboardList,
  Stethoscope,
  Printer,
  Building,
  Megaphone,
} from 'lucide-react';
import type { User } from '../../types/auth.types';



interface SidebarProps {
  user: User;

}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();


  const isActive = (path: string) => location.pathname === path;

  const menuItems = {
    mahasiswa: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: ClipboardList, label: 'Registrasi Kunjungan', path: '/registration' },
      { icon: Stethoscope, label: 'Pemeriksaan', path: '/examination' },
      { icon: Printer, label: 'Cetak Resume', path: '/print-medical-record' },
    ],
    dosen: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: ClipboardList, label: 'Registrasi Kunjungan', path: '/registration' },
      { icon: PlusCircle, label: 'Pendaftaran Pasien', path: '/patient-registration' },
      { icon: Stethoscope, label: 'Pemeriksaan Pasien', path: '/patient-examination' },
      { icon: Users, label: 'Data Pasien', path: '/patients' },
      { icon: GraduationCap, label: 'Data Mahasiswa', path: '/students' },
      { icon: Printer, label: 'Cetak Resume Medis', path: '/print-medical-record' },
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
      { icon: Printer, label: 'Cetak Resume Medis', path: '/print-medical-record' },
      { icon: Building, label: 'Manajemen Fasilitas', path: '/facility-management' },
      { icon: Megaphone, label: 'Info Running Text', path: '/information-management' },
    ],
  };

  const currentMenu = menuItems[user.role] || [];

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">


      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {currentMenu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Button
                key={item.path}
                variant={active ? 'default' : 'ghost'}
                className={`w-full justify-start gap-3 ${active
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


    </div>
  );
};
