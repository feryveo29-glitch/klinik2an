import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Upload, Download, CheckCircle2, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { UserService, type BulkUploadMahasiswaData } from '../services/user.service';

export const UploadMahasiswaPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    inserted: number;
    failed: number;
    errors: Array<{ nim: string; error: string }>;
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setUploadResult(null);
      } else {
        alert('Hanya file CSV yang diperbolehkan');
      }
    }
  };

  const parseCSV = (text: string): BulkUploadMahasiswaData[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const data: BulkUploadMahasiswaData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));

      if (values.length >= 3) {
        data.push({
          nim: values[0],
          full_name: values[1],
          password: values[2],
        });
      }
    }

    return data;
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Pilih file terlebih dahulu');
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const text = await selectedFile.text();
      const data = parseCSV(text);

      if (data.length === 0) {
        alert('File CSV kosong atau format tidak sesuai');
        setUploading(false);
        return;
      }

      const result = await UserService.bulkUploadMahasiswa(data);
      setUploadResult(result);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Terjadi kesalahan saat mengupload file');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'NIM,Nama Lengkap,Password\n12345678,Ahmad Maulana,password123\n87654321,Siti Nurhaliza,password456';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_mahasiswa.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Upload Data Mahasiswa</h1>
          <p className="text-slate-600 mt-1">
            Upload data mahasiswa secara massal menggunakan file CSV
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Format File CSV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm font-medium text-slate-900 mb-2">
                  Struktur File:
                </p>
                <code className="text-xs bg-white p-2 rounded block">
                  NIM,Nama Lengkap,Password<br />
                  12345678,Ahmad Maulana,password123<br />
                  87654321,Siti Nurhaliza,password456
                </code>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900">Ketentuan:</p>
                <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                  <li>Baris pertama adalah header (NIM, Nama Lengkap, Password)</li>
                  <li>NIM harus unik dan tidak boleh kosong</li>
                  <li>Nama lengkap tidak boleh kosong</li>
                  <li>Password minimal 6 karakter</li>
                  <li>Pisahkan setiap kolom dengan koma (,)</li>
                  <li>NIM akan digunakan sebagai username</li>
                </ul>
              </div>

              <Button onClick={downloadTemplate} variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Download Template CSV
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-slate-400 mb-3" />
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Klik untuk pilih file
                  </p>
                  <p className="text-xs text-slate-500">
                    File CSV (maksimal 10 MB)
                  </p>
                </label>
              </div>

              {selectedFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-blue-600">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Mengupload...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload & Simpan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {uploadResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {uploadResult.success ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">Upload Berhasil</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-600">Upload Gagal</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-600 mb-1">Berhasil</p>
                  <p className="text-2xl font-bold text-green-700">
                    {uploadResult.inserted}
                  </p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600 mb-1">Gagal</p>
                  <p className="text-2xl font-bold text-red-700">
                    {uploadResult.failed}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {uploadResult.inserted + uploadResult.failed}
                  </p>
                </div>
              </div>

              {uploadResult.errors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Detail Error ({uploadResult.errors.length}):
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {uploadResult.errors.map((error, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm border-b border-slate-200 pb-2 last:border-0"
                        >
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-slate-900">
                              NIM: {error.nim}
                            </p>
                            <p className="text-slate-600">{error.error}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {uploadResult.success && uploadResult.failed === 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <p className="text-green-900 font-medium">
                    Semua data berhasil diupload!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    {uploadResult.inserted} mahasiswa berhasil ditambahkan ke sistem
                  </p>
                </div>
              )}

              <Button
                onClick={() => {
                  setUploadResult(null);
                  setSelectedFile(null);
                }}
                variant="outline"
                className="w-full"
              >
                Upload File Lain
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageWrapper>
  );
};
