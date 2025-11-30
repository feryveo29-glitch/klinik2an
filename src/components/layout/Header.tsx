import React, { useEffect, useState } from 'react';
import { FileText, LogOut } from 'lucide-react';
import type { User } from '../../types/auth.types';
import { facilityService } from '../../services/facility.service';
import { Button } from '../ui/button';

interface HeaderProps {
    user: User;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    const [fasyankesName, setFasyankesName] = useState('RME System');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchProfil = async () => {
            const { data } = await facilityService.getProfil();
            if (data?.nama_fasyankes) {
                setFasyankesName(data.nama_fasyankes);
            }
        };

        fetchProfil();

        // Listen event update
        window.addEventListener('facility-updated', fetchProfil);
        return () => window.removeEventListener('facility-updated', fetchProfil);
    }, []);

    const formatDateTime = (date: Date) => {
        return date.toLocaleString('id-ID', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).replace(/\./g, ':');
    };

    return (
        <header className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm z-20">
            {/* Left: Logo & Fasyankes Name */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-900 leading-none">{fasyankesName}</h1>
                    <p className="text-xs text-slate-500">Medical Records</p>
                </div>
            </div>

            {/* Right: Date, User Profile & Logout */}
            <div className="flex items-center justify-end gap-4">
                <div className="flex items-center gap-4">
                    {/* Date Time */}
                    <div className="text-sm font-medium text-slate-500">
                        {formatDateTime(currentTime)}
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-medium text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="h-8 w-px bg-slate-200 mx-1"></div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                    onClick={onLogout}
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </Button>
            </div>
        </header>
    );
};
