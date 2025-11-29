import React, { useState } from 'react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/simple-tabs';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';

export const CreateMedicalRecord: React.FC = () => {
  const [activeTab, setActiveTab] = useState('identitas');

  const [formData, setFormData] = useState({
    nik: '',
    no_rm: '',
    nama_lengkap: '',
    tgl_lahir: '',
    jenis_kelamin: '',
    pekerjaan: '',
    pendidikan: '',
    alamat: '',
    status_kawin: '',
    no_hp: '',
    tgl_kunjungan: '',
    jenis_kunjungan: '',
    jenis_pasien: '',
    unit_pelayanan: '',
    tenaga_medis_pj: '',
    keluhan_utama: '',
    rps: '',
    rpd: '',
    riwayat_obat: '',
    riwayat_alergi: '',
    td_sistol: '',
    td_diastol: '',
    nadi: '',
    respiratory_rate: '',
    suhu: '',
    tinggi_badan: '',
    berat_badan: '',
    pemeriksaan_fisik: '',
    hasil_penunjang_file: '',
    catatan_klinis: '',
    icd10_code: '',
    diagnosis_name: '',
    rencana_terapi: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <PageWrapper>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Buat Rekam Medis Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="identitas">Identitas & Kunjungan</TabsTrigger>
                <TabsTrigger value="subjektif">SOAP Subjektif</TabsTrigger>
                <TabsTrigger value="objektif">SOAP Objektif</TabsTrigger>
                <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                <TabsTrigger value="plan">Plan & Terapi</TabsTrigger>
              </TabsList>

              {/* TAB 1: IDENTITAS PASIEN & KUNJUNGAN */}
              <TabsContent value="identitas" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold border-b pb-2">Data Identitas Pasien</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nik">NIK *</Label>
                      <Input
                        id="nik"
                        type="text"
                        placeholder="Nomor Induk Kependudukan"
                        value={formData.nik}
                        onChange={(e) => handleInputChange('nik', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="no_rm">No. Rekam Medis *</Label>
                      <Input
                        id="no_rm"
                        type="text"
                        placeholder="Nomor Rekam Medis"
                        value={formData.no_rm}
                        onChange={(e) => handleInputChange('no_rm', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
                      <Input
                        id="nama_lengkap"
                        type="text"
                        placeholder="Nama Lengkap Pasien"
                        value={formData.nama_lengkap}
                        onChange={(e) => handleInputChange('nama_lengkap', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tgl_lahir">Tanggal Lahir *</Label>
                      <Input
                        id="tgl_lahir"
                        type="date"
                        value={formData.tgl_lahir}
                        onChange={(e) => handleInputChange('tgl_lahir', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
                      <Select
                        value={formData.jenis_kelamin}
                        onValueChange={(value) => handleInputChange('jenis_kelamin', value)}
                      >
                        <SelectTrigger id="jenis_kelamin">
                          <SelectValue placeholder="Pilih Jenis Kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                          <SelectItem value="Perempuan">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="no_hp">No. HP</Label>
                      <Input
                        id="no_hp"
                        type="tel"
                        placeholder="Nomor Telepon"
                        value={formData.no_hp}
                        onChange={(e) => handleInputChange('no_hp', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pekerjaan">Pekerjaan</Label>
                      <Input
                        id="pekerjaan"
                        type="text"
                        placeholder="Pekerjaan"
                        value={formData.pekerjaan}
                        onChange={(e) => handleInputChange('pekerjaan', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pendidikan">Pendidikan</Label>
                      <Input
                        id="pendidikan"
                        type="text"
                        placeholder="Pendidikan Terakhir"
                        value={formData.pendidikan}
                        onChange={(e) => handleInputChange('pendidikan', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status_kawin">Status Perkawinan</Label>
                      <Select
                        value={formData.status_kawin}
                        onValueChange={(value) => handleInputChange('status_kawin', value)}
                      >
                        <SelectTrigger id="status_kawin">
                          <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Belum Kawin">Belum Kawin</SelectItem>
                          <SelectItem value="Kawin">Kawin</SelectItem>
                          <SelectItem value="Cerai Hidup">Cerai Hidup</SelectItem>
                          <SelectItem value="Cerai Mati">Cerai Mati</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="alamat">Alamat Lengkap</Label>
                      <Input
                        id="alamat"
                        type="text"
                        placeholder="Alamat Lengkap"
                        value={formData.alamat}
                        onChange={(e) => handleInputChange('alamat', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-xl font-semibold border-b pb-2">Data Kunjungan</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tgl_kunjungan">Tanggal Kunjungan *</Label>
                      <Input
                        id="tgl_kunjungan"
                        type="datetime-local"
                        value={formData.tgl_kunjungan}
                        onChange={(e) => handleInputChange('tgl_kunjungan', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jenis_kunjungan">Jenis Kunjungan *</Label>
                      <Select
                        value={formData.jenis_kunjungan}
                        onValueChange={(value) => handleInputChange('jenis_kunjungan', value)}
                      >
                        <SelectTrigger id="jenis_kunjungan">
                          <SelectValue placeholder="Pilih Jenis Kunjungan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rawat Jalan">Rawat Jalan</SelectItem>
                          <SelectItem value="Rawat Inap">Rawat Inap</SelectItem>
                          <SelectItem value="IGD">IGD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jenis_pasien">Jenis Pasien *</Label>
                      <Select
                        value={formData.jenis_pasien}
                        onValueChange={(value) => handleInputChange('jenis_pasien', value)}
                      >
                        <SelectTrigger id="jenis_pasien">
                          <SelectValue placeholder="Pilih Jenis Pasien" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Umum">Umum</SelectItem>
                          <SelectItem value="BPJS">BPJS</SelectItem>
                          <SelectItem value="Asuransi">Asuransi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit_pelayanan">Unit Pelayanan *</Label>
                      <Input
                        id="unit_pelayanan"
                        type="text"
                        placeholder="Contoh: Poli Umum, Poli Gigi"
                        value={formData.unit_pelayanan}
                        onChange={(e) => handleInputChange('unit_pelayanan', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="tenaga_medis_pj">Tenaga Medis Penanggung Jawab *</Label>
                      <Input
                        id="tenaga_medis_pj"
                        type="text"
                        placeholder="Nama Dokter/Tenaga Medis"
                        value={formData.tenaga_medis_pj}
                        onChange={(e) => handleInputChange('tenaga_medis_pj', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="button" onClick={() => setActiveTab('subjektif')}>
                    Lanjut ke SOAP Subjektif
                  </Button>
                </div>
              </TabsContent>

              {/* TAB 2: SOAP SUBJEKTIF (ANAMNESIS) */}
              <TabsContent value="subjektif" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold border-b pb-2">SOAP Subjektif - Anamnesis</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="keluhan_utama">Keluhan Utama *</Label>
                      <textarea
                        id="keluhan_utama"
                        className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tuliskan keluhan utama pasien"
                        value={formData.keluhan_utama}
                        onChange={(e) => handleInputChange('keluhan_utama', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rps">Riwayat Penyakit Sekarang (RPS)</Label>
                      <textarea
                        id="rps"
                        className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Riwayat perkembangan penyakit saat ini"
                        value={formData.rps}
                        onChange={(e) => handleInputChange('rps', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rpd">Riwayat Penyakit Dahulu (RPD)</Label>
                      <textarea
                        id="rpd"
                        className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Riwayat penyakit yang pernah diderita"
                        value={formData.rpd}
                        onChange={(e) => handleInputChange('rpd', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="riwayat_obat">Riwayat Obat</Label>
                      <textarea
                        id="riwayat_obat"
                        className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Obat-obatan yang sedang atau pernah dikonsumsi"
                        value={formData.riwayat_obat}
                        onChange={(e) => handleInputChange('riwayat_obat', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="riwayat_alergi">Riwayat Alergi</Label>
                      <textarea
                        id="riwayat_alergi"
                        className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Alergi obat, makanan, atau lainnya"
                        value={formData.riwayat_alergi}
                        onChange={(e) => handleInputChange('riwayat_alergi', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('identitas')}>
                    Kembali
                  </Button>
                  <Button type="button" onClick={() => setActiveTab('objektif')}>
                    Lanjut ke SOAP Objektif
                  </Button>
                </div>
              </TabsContent>

              {/* TAB 3: SOAP OBJEKTIF (PEMERIKSAAN) */}
              <TabsContent value="objektif" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold border-b pb-2">SOAP Objektif - Pemeriksaan Fisik</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tanda-tanda Vital</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="td_sistol" className="text-xs">TD Sistol (mmHg)</Label>
                          <Input
                            id="td_sistol"
                            type="number"
                            placeholder="120"
                            value={formData.td_sistol}
                            onChange={(e) => handleInputChange('td_sistol', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="td_diastol" className="text-xs">TD Diastol (mmHg)</Label>
                          <Input
                            id="td_diastol"
                            type="number"
                            placeholder="80"
                            value={formData.td_diastol}
                            onChange={(e) => handleInputChange('td_diastol', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="nadi" className="text-xs">Nadi (x/menit)</Label>
                          <Input
                            id="nadi"
                            type="number"
                            placeholder="80"
                            value={formData.nadi}
                            onChange={(e) => handleInputChange('nadi', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="respiratory_rate" className="text-xs">RR (x/menit)</Label>
                          <Input
                            id="respiratory_rate"
                            type="number"
                            placeholder="20"
                            value={formData.respiratory_rate}
                            onChange={(e) => handleInputChange('respiratory_rate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Suhu & Antropometri</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="suhu" className="text-xs">Suhu (°C)</Label>
                          <Input
                            id="suhu"
                            type="number"
                            step="0.1"
                            placeholder="36.5"
                            value={formData.suhu}
                            onChange={(e) => handleInputChange('suhu', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="tinggi_badan" className="text-xs">Tinggi Badan (cm)</Label>
                          <Input
                            id="tinggi_badan"
                            type="number"
                            placeholder="170"
                            value={formData.tinggi_badan}
                            onChange={(e) => handleInputChange('tinggi_badan', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="berat_badan" className="text-xs">Berat Badan (kg)</Label>
                          <Input
                            id="berat_badan"
                            type="number"
                            step="0.1"
                            placeholder="65"
                            value={formData.berat_badan}
                            onChange={(e) => handleInputChange('berat_badan', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pemeriksaan_fisik">Pemeriksaan Fisik Naratif</Label>
                      <textarea
                        id="pemeriksaan_fisik"
                        className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Hasil pemeriksaan fisik lengkap"
                        value={formData.pemeriksaan_fisik}
                        onChange={(e) => handleInputChange('pemeriksaan_fisik', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hasil_penunjang_file">Upload Hasil Penunjang (Lab/Radiologi)</Label>
                      <Input
                        id="hasil_penunjang_file"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleInputChange('hasil_penunjang_file', e.target.files?.[0]?.name || '')}
                      />
                      <p className="text-xs text-slate-500">Format: JPG, PNG, PDF (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('subjektif')}>
                    Kembali
                  </Button>
                  <Button type="button" onClick={() => setActiveTab('diagnosis')}>
                    Lanjut ke Diagnosis
                  </Button>
                </div>
              </TabsContent>

              {/* TAB 4: DIAGNOSIS (ASESMEN) */}
              <TabsContent value="diagnosis" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold border-b pb-2">Diagnosis & Asesmen</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="catatan_klinis">Catatan Klinis / Asesmen</Label>
                      <textarea
                        id="catatan_klinis"
                        className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Kesimpulan klinis dari pemeriksaan"
                        value={formData.catatan_klinis}
                        onChange={(e) => handleInputChange('catatan_klinis', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Kode Diagnosis ICD-10</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="icd10_code" className="text-xs">Kode ICD-10 *</Label>
                          <Input
                            id="icd10_code"
                            type="text"
                            placeholder="Contoh: A09"
                            value={formData.icd10_code}
                            onChange={(e) => handleInputChange('icd10_code', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="diagnosis_name" className="text-xs">Nama Diagnosis *</Label>
                          <Input
                            id="diagnosis_name"
                            type="text"
                            placeholder="Contoh: Diare akut"
                            value={formData.diagnosis_name}
                            onChange={(e) => handleInputChange('diagnosis_name', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">Gunakan kode ICD-10 yang sesuai dengan diagnosis</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('objektif')}>
                    Kembali
                  </Button>
                  <Button type="button" onClick={() => setActiveTab('plan')}>
                    Lanjut ke Plan & Terapi
                  </Button>
                </div>
              </TabsContent>

              {/* TAB 5: PLAN & TERAPI */}
              <TabsContent value="plan" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold border-b pb-2">Plan & Terapi</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rencana_terapi">Rencana Terapi & Tindakan *</Label>
                      <textarea
                        id="rencana_terapi"
                        className="flex min-h-[150px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Tuliskan rencana terapi, obat yang diberikan, dan tindakan yang akan dilakukan"
                        value={formData.rencana_terapi}
                        onChange={(e) => handleInputChange('rencana_terapi', e.target.value)}
                        required
                      />
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <p className="text-sm text-slate-600">
                        <strong>Catatan:</strong> Pastikan semua data telah diisi dengan benar sebelum menyimpan rekam medis.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('diagnosis')}>
                    Kembali
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Simpan Rekam Medis
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </PageWrapper>
  );
};
