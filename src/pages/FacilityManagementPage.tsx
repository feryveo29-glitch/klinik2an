import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Building, Save, Loader2 } from 'lucide-react';
import { facilityService } from '../services/facility.service';
import type { ProfilFasyankes } from '../types/database.types';
import type { User } from '../types/auth.types';

export const FacilityManagementPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<ProfilFasyankes>>({
        nama_fasyankes: '',
        kode_fasyankes: '',
        alamat: '',
        kota: '',
        provinsi: '',
        kode_pos: '',
        telepon: '',
        email: '',
        website: '',
        kepala_fasyankes: '',
        no_izin: '',
        logo_url: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            fetchProfil();
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchProfil = async () => {
        try {
            const { data, error } = await facilityService.getProfil();
            if (error) throw error;
            if (data) {
                setFormData(data);
            }
        } catch (error) {
            console.error('Error fetching profil:', error);
            alert('Gagal memuat data profil fasyankes');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await facilityService.updateProfil(formData);
            if (error) throw error;

            // Dispatch event agar komponen lain (seperti Sidebar) bisa update
            window.dispatchEvent(new Event('facility-updated'));

            alert('Data profil fasyankes berhasil disimpan!');
        } catch (error) {
            console.error('Error saving profil:', error);
            alert('Gagal menyimpan data profil fasyankes');
        } finally {
            setSaving(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <MainLayout user={user} onLogout={logout}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Manajemen Fasilitas</h1>
                        <p className="text-slate-600">Kelola identitas dan informasi Fasilitas Pelayanan Kesehatan</p>
                    </div>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
                            <Building className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-slate-900">Identitas Fasyankes</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Informasi Dasar */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Nama Fasyankes <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        name="nama_fasyankes"
                                        value={formData.nama_fasyankes || ''}
                                        onChange={handleChange}
                                        required
                                        placeholder="Contoh: Klinik Pratama Sehat"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Kode Fasyankes
                                    </label>
                                    <Input
                                        name="kode_fasyankes"
                                        value={formData.kode_fasyankes || ''}
                                        onChange={handleChange}
                                        placeholder="Kode unik fasyankes"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Nomor Izin Operasional
                                    </label>
                                    <Input
                                        name="no_izin"
                                        value={formData.no_izin || ''}
                                        onChange={handleChange}
                                        placeholder="Nomor izin operasional"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Kepala / Penanggung Jawab
                                    </label>
                                    <Input
                                        name="kepala_fasyankes"
                                        value={formData.kepala_fasyankes || ''}
                                        onChange={handleChange}
                                        placeholder="Nama Kepala Fasyankes"
                                    />
                                </div>
                            </div>

                            {/* Kontak & Alamat */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        placeholder="email@klinik.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Telepon
                                    </label>
                                    <Input
                                        name="telepon"
                                        value={formData.telepon || ''}
                                        onChange={handleChange}
                                        placeholder="021-xxxxxxx"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Website
                                    </label>
                                    <Input
                                        name="website"
                                        value={formData.website || ''}
                                        onChange={handleChange}
                                        placeholder="www.klinik.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Alamat Lengkap */}
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                            <h3 className="text-md font-medium text-slate-900">Alamat Lengkap</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Alamat Jalan
                                    </label>
                                    <textarea
                                        name="alamat"
                                        value={formData.alamat || ''}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Jalan, No, RT/RW"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Kota / Kabupaten
                                    </label>
                                    <Input
                                        name="kota"
                                        value={formData.kota || ''}
                                        onChange={handleChange}
                                        placeholder="Nama Kota"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Provinsi
                                    </label>
                                    <Input
                                        name="provinsi"
                                        value={formData.provinsi || ''}
                                        onChange={handleChange}
                                        placeholder="Nama Provinsi"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Kode Pos
                                    </label>
                                    <Input
                                        name="kode_pos"
                                        value={formData.kode_pos || ''}
                                        onChange={handleChange}
                                        placeholder="Kode Pos"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-slate-200">
                            <Button type="submit" disabled={saving} className="gap-2">
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Simpan Perubahan
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </MainLayout>
    );
};
