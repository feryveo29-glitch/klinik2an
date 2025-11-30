import React, { useEffect, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Megaphone, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { informationService, type Information } from '../services/information.service';
import { settingsService } from '../services/settings.service';
import { useToast } from '../components/ui/toast';
import { Settings } from 'lucide-react';

export const InformationManagementPage: React.FC = () => {
    const [infos, setInfos] = useState<Information[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newPesan, setNewPesan] = useState('');
    const [newTipe, setNewTipe] = useState<'info' | 'warning' | 'success'>('info');
    const [speed, setSpeed] = useState('45s');
    const { showToast } = useToast();

    const fetchData = async () => {
        try {
            const [data, speedSetting] = await Promise.all([
                informationService.getAllInformation(),
                settingsService.getSetting('running_text_speed', '45s')
            ]);
            setInfos(data);
            setSpeed(speedSetting);
        } catch (error) {
            console.error('Error fetching data:', error);
            showToast('Gagal mengambil data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveSpeed = async () => {
        try {
            await settingsService.updateSetting('running_text_speed', speed);
            showToast('Kecepatan berhasil disimpan', 'success');
        } catch (error) {
            showToast('Gagal menyimpan kecepatan', 'error');
        }
    };

    const handleAdd = async () => {
        if (!newPesan.trim()) return;
        try {
            await informationService.createInformation(newPesan, newTipe);
            setNewPesan('');
            setIsAdding(false);
            fetchData();
            showToast('Informasi berhasil ditambahkan', 'success');
        } catch (error) {
            showToast('Gagal menambahkan informasi', 'error');
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            await informationService.updateInformation(id, { aktif: !currentStatus });
            fetchData();
        } catch (error) {
            showToast('Gagal mengupdate status', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus informasi ini?')) return;
        try {
            await informationService.deleteInformation(id);
            fetchData();
            showToast('Informasi berhasil dihapus', 'success');
        } catch (error) {
            showToast('Gagal menghapus informasi', 'error');
        }
    };

    return (
        <PageWrapper>
            <div className="space-y-6">
                {/* Configuration Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-6 h-6" />
                            Konfigurasi Running Text
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end gap-4 max-w-md">
                            <div className="space-y-2 flex-1">
                                <Label>Kecepatan Scroll</Label>
                                <Select value={speed} onValueChange={setSpeed}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="60s">Lambat (60s)</SelectItem>
                                        <SelectItem value="45s">Sedang (45s)</SelectItem>
                                        <SelectItem value="30s">Cepat (30s)</SelectItem>
                                        <SelectItem value="15s">Sangat Cepat (15s)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleSaveSpeed}>
                                <Save className="w-4 h-4 mr-2" /> Simpan Pengaturan
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Information List Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Megaphone className="w-6 h-6" />
                                Daftar Informasi
                            </CardTitle>
                            <p className="text-sm text-slate-500 mt-1">
                                Kelola pesan pengumuman yang muncul di footer aplikasi
                            </p>
                        </div>
                        <Button onClick={() => setIsAdding(!isAdding)}>
                            {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            {isAdding ? 'Batal' : 'Tambah Informasi'}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {isAdding && (
                            <div className="mb-6 p-4 bg-slate-50 rounded-lg border space-y-4">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label>Isi Pesan</Label>
                                        <Input
                                            value={newPesan}
                                            onChange={(e) => setNewPesan(e.target.value)}
                                            placeholder="Contoh: Rapat bulanan hari Jumat..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tipe Pesan</Label>
                                        <Select value={newTipe} onValueChange={(v: any) => setNewTipe(v)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="info">Info (Biru)</SelectItem>
                                                <SelectItem value="warning">Peringatan (Kuning)</SelectItem>
                                                <SelectItem value="success">Sukses/Penting (Hijau)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button onClick={handleAdd} disabled={!newPesan.trim()}>
                                        <Save className="w-4 h-4 mr-2" /> Simpan
                                    </Button>
                                </div>
                            </div>
                        )}

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pesan</TableHead>
                                    <TableHead className="w-[100px]">Tipe</TableHead>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead className="w-[100px] text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8">Loading...</TableCell>
                                    </TableRow>
                                ) : infos.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                            Belum ada informasi. Silakan tambah baru.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    infos.map((info) => (
                                        <TableRow key={info.id}>
                                            <TableCell className="font-medium">{info.pesan}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                        ${info.tipe === 'info' ? 'bg-blue-100 text-blue-700' :
                                                        info.tipe === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-green-100 text-green-700'}`}>
                                                    {info.tipe}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={info.aktif}
                                                    onCheckedChange={() => handleToggleActive(info.id, info.aktif)}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(info.id)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </PageWrapper>
    );
};
