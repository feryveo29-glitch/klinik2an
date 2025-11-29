export interface User {
  id: string;
  username: string;
  password: string;
  full_name: string;
  role: 'admin' | 'dosen' | 'mahasiswa';
  created_at: string;
  updated_at: string;
}

export interface IdentitasPasien {
  id_pasien: string;
  nik: string;
  no_rm: string;
  nama_lengkap: string;
  tgl_lahir: string;
  jenis_kelamin: string;
  pekerjaan?: string;
  pendidikan?: string;
  alamat?: string;
  status_kawin?: string;
  no_hp?: string;
  created_at: string;
  updated_at: string;
  metadata_user_buat?: string;
  metadata_user_ubah?: string;
}

export interface KunjunganResume {
  id_kunjungan: string;
  id_pasien: string;
  tgl_kunjungan: string;
  jenis_kunjungan: string;
  jenis_pasien: string;
  unit_pelayanan: string;
  tenaga_medis_pj: string;
  created_at: string;
  updated_at: string;
  metadata_user_buat?: string;
}

export interface SoapSubjektif {
  id_subjektif: string;
  id_kunjungan: string;
  keluhan_utama: string;
  rps?: string;
  rpd?: string;
  riwayat_obat?: string;
  riwayat_alergi?: string;
  sumber_info?: string;
  created_at: string;
  updated_at: string;
  metadata_user_buat?: string;
}

export interface SoapObjektif {
  id_objektif: string;
  id_kunjungan: string;
  keadaan_umum?: string;
  tv_td?: string;
  tv_nadi?: number;
  tv_rr?: number;
  tv_suhu?: number;
  bb?: number;
  tb?: number;
  fisik_naratif?: string;
  created_at: string;
  updated_at: string;
  metadata_user_buat?: string;
}

export interface PemeriksaanPenunjang {
  id_pemeriksaan: string;
  id_kunjungan: string;
  jenis: string;
  nama_pemeriksaan: string;
  hasil?: string;
  satuan?: string;
  id_file_lampiran?: string;
  created_at: string;
  updated_at: string;
  metadata_user_buat?: string;
}

export interface SoapAsesmenDiagnosis {
  id_asesmen: string;
  id_kunjungan: string;
  catatan_klinis?: string;
  created_at: string;
  updated_at: string;
  metadata_user_buat?: string;
}

export interface Diagnosis {
  id_diagnosis: string;
  id_asesmen: string;
  jenis_diagnosis: string;
  kode_icd10: string;
  nama_diagnosis: string;
  created_at: string;
  updated_at: string;
  metadata_user_buat?: string;
}

export interface SoapPlan {
  id_plan: string;
  id_kunjungan: string;
  rencana_umum?: string;
  rencana_kontrol?: string;
  created_at: string;
  updated_at: string;
  metadata_user_buat?: string;
}

export interface TindakanMedis {
  id_tindakan: string;
  id_plan: string;
  kode_tindakan?: string;
  nama_tindakan: string;
  pelaksana?: string;
  created_at: string;
  updated_at: string;
  metadata_user_buat?: string;
}

export interface TerapiObat {
  id_terapi: string;
  id_plan: string;
  nama_obat: string;
  dosis: string;
  frekuensi: string;
  rute: string;
  durasi?: string;
  created_at: string;
  updated_at: string;
  metadata_user_buat?: string;
}

export interface KunjunganWithRelations extends KunjunganResume {
  pasien?: IdentitasPasien;
  subjektif?: SoapSubjektif;
  objektif?: SoapObjektif;
  pemeriksaan_penunjang?: PemeriksaanPenunjang[];
  asesmen?: SoapAsesmenDiagnosis;
  diagnoses?: Diagnosis[];
  plan?: SoapPlan;
  tindakan_medis?: TindakanMedis[];
  terapi_obat?: TerapiObat[];
  uploader?: User;
  uploader_name?: string;
}
