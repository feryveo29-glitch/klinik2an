import React, { useEffect, useState } from 'react';
import { RegistrationService, type RegistrationWithPatient } from '../../services/registration.service';
import { informationService, type Information } from '../../services/information.service';
import { settingsService } from '../../services/settings.service';

export const Footer: React.FC = () => {
    const [waitingPatients, setWaitingPatients] = useState<RegistrationWithPatient[]>([]);
    const [announcements, setAnnouncements] = useState<Information[]>([]);
    const [speed, setSpeed] = useState('45s');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [registrations, infos, speedSetting] = await Promise.all([
                    RegistrationService.getTodayRegistrations(),
                    informationService.getActiveInformation(),
                    settingsService.getSetting('running_text_speed', '45s')
                ]);

                // Filter pasien yang belum selesai
                const activePatients = registrations.filter(reg => reg.status_registrasi !== 'Selesai' && reg.status_registrasi !== 'Batal');
                setWaitingPatients(activePatients);
                setAnnouncements(infos);
                setSpeed(speedSetting);
            } catch (error) {
                console.error('Failed to fetch footer data:', error);
            }
        };

        fetchData();

        // Refresh data setiap 30 detik
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="bg-white border-t py-2 px-0 text-sm text-slate-600 shadow-sm z-10 overflow-hidden">
            <div className="flex items-center h-8">
                <div className="bg-blue-600 text-white px-4 h-full flex items-center font-bold text-xs shrink-0 z-20">
                    INFO TERKINI
                </div>
                <div className="flex-1 overflow-hidden relative flex items-center bg-slate-50 h-full">
                    <div
                        className="animate-marquee whitespace-nowrap flex items-center gap-12 px-4"
                        style={{ animationDuration: speed }}
                    >
                        {/* Patient Queue */}
                        {waitingPatients.length > 0 ? (
                            waitingPatients.map((reg) => (
                                <span key={reg.id_registrasi} className="flex items-center gap-2">
                                    🔔 <span className="font-medium">Antrian {reg.no_antrian}:</span> {reg.pasien.nama_lengkap} ({reg.poli_tujuan}) - {reg.status_registrasi}
                                </span>
                            ))
                        ) : (
                            <span className="flex items-center gap-2">
                                🔔 <span className="font-medium">Info:</span> Belum ada antrian pasien saat ini.
                            </span>
                        )}

                        {/* Dynamic Announcements */}
                        {announcements.map((info) => (
                            <span key={info.id} className={`flex items - center gap - 2 ${info.tipe === 'warning' ? 'text-yellow-700' :
                                info.tipe === 'success' ? 'text-green-700' : 'text-blue-700'
                                } `}>
                                {info.tipe === 'warning' ? '⚠️' : info.tipe === 'success' ? '💡' : 'ℹ️'}
                                <span className="font-medium">{info.tipe === 'warning' ? 'Perhatian:' : info.tipe === 'success' ? 'Info:' : 'Info:'}</span> {info.pesan}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="bg-white px-4 h-full flex items-center border-l text-xs text-slate-400 shrink-0 z-20">
                    &copy; {new Date().getFullYear()} Klinik2an
                </div>
            </div>
        </footer>
    );
};
