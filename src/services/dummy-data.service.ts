export class DummyDataService {
  private static firstNames = [
    'Ahmad', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fitri', 'Gunawan', 'Hani',
    'Indra', 'Joko', 'Kartika', 'Lestari', 'Made', 'Nurul', 'Oka', 'Putri',
    'Rani', 'Sari', 'Taufik', 'Utami', 'Vera', 'Wawan', 'Yanti', 'Zainal'
  ];

  private static lastNames = [
    'Santoso', 'Wijaya', 'Kurniawan', 'Pratama', 'Saputra', 'Kusuma',
    'Prasetyo', 'Mahendra', 'Wibowo', 'Hermawan', 'Setiawan', 'Hidayat',
    'Putra', 'Permana', 'Hakim', 'Rahman', 'Siregar', 'Sitorus'
  ];

  private static cities = [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar',
    'Palembang', 'Tangerang', 'Depok', 'Bekasi', 'Denpasar', 'Malang',
    'Yogyakarta', 'Bogor', 'Balikpapan', 'Pontianak', 'Manado', 'Batam'
  ];

  private static streets = [
    'Jl. Sudirman', 'Jl. Thamrin', 'Jl. Gatot Subroto', 'Jl. Diponegoro',
    'Jl. Ahmad Yani', 'Jl. Pemuda', 'Jl. Merdeka', 'Jl. Pahlawan',
    'Jl. Kartini', 'Jl. Gajah Mada', 'Jl. Hayam Wuruk', 'Jl. Veteran'
  ];

  private static keluhanUtama = [
    'Demam tinggi sejak 3 hari yang lalu',
    'Batuk dan pilek sudah 1 minggu',
    'Sakit kepala hebat disertai pusing',
    'Nyeri perut bagian kanan bawah',
    'Mual dan muntah sejak pagi',
    'Diare berulang 5x sehari',
    'Sesak napas saat beraktivitas',
    'Nyeri dada seperti tertindih',
    'Bengkak di kedua kaki',
    'Gatal-gatal di seluruh badan',
    'Luka di kaki tidak sembuh-sembuh',
    'Pusing berputar (vertigo)',
    'Mata kabur sejak 2 hari',
    'Telinga berdenging terus menerus',
    'Sakit gigi berlubang',
    'Nyeri sendi lutut kanan',
    'Batuk berdahak berwarna hijau',
    'Susah tidur (insomnia)',
    'Kencing terasa sakit dan panas',
    'Haid tidak teratur'
  ];

  private static riwayatPenyakit = [
    'Tidak ada riwayat penyakit sebelumnya',
    'Riwayat hipertensi sejak 5 tahun lalu',
    'Diabetes Mellitus tipe 2 dalam pengobatan',
    'Asma bronkial sejak kecil',
    'Gastritis kronik',
    'Riwayat stroke 2 tahun lalu',
    'Penyakit jantung koroner',
    'Gagal ginjal kronik stadium 3',
    'Hepatitis B kronik',
    'Tuberkulosis paru sudah sembuh',
    'Hipertiroid dalam terapi',
    'Kolesterol tinggi',
    'Asam urat tinggi',
    'Osteoarthritis lutut bilateral',
    'Migrain kronik'
  ];

  private static alergi = [
    'Tidak ada alergi',
    'Alergi obat penisilin',
    'Alergi seafood',
    'Alergi debu',
    'Alergi dingin',
    'Alergi makanan laut',
    'Alergi obat golongan sulfa',
    'Alergi udang dan kepiting',
    'Alergi kacang-kacangan',
    'Alergi obat NSAID'
  ];

  private static diagnosis = [
    'Demam Tifoid (Typhoid Fever)',
    'ISPA (Infeksi Saluran Pernapasan Atas)',
    'Gastritis Akut',
    'Hipertensi Grade 2',
    'Diabetes Mellitus tipe 2 terkontrol',
    'Vertigo Perifer',
    'Migrain dengan Aura',
    'Dispepsia Fungsional',
    'Faringitis Akut',
    'Bronkitis Akut',
    'Dermatitis Kontak',
    'Konjungtivitis Bakterial',
    'Otitis Media Akut',
    'Dengue Fever (Demam Berdarah)',
    'Infeksi Saluran Kemih (ISK)',
    'Pneumonia Community Acquired',
    'Diare Akut dengan Dehidrasi Ringan',
    'Artritis Gout Akut',
    'Tension Type Headache',
    'Low Back Pain (Nyeri Punggung Bawah)'
  ];

  private static terapiObat = [
    'Paracetamol 500mg tab 3x1',
    'Amoxicillin 500mg cap 3x1',
    'Omeprazole 20mg cap 2x1 sebelum makan',
    'Metformin 500mg tab 2x1 sesudah makan',
    'Amlodipine 5mg tab 1x1 pagi',
    'Betahistine 6mg tab 3x1',
    'Cetirizine 10mg tab 1x1 malam',
    'Ibuprofen 400mg tab 3x1 sesudah makan',
    'Ceftriaxone inj 1gr/12jam IV',
    'Ranitidine 150mg tab 2x1',
    'Salbutamol inhaler 2 puff 3x/hari',
    'Ciprofloxacin 500mg tab 2x1',
    'Dexamethasone 0.5mg tab 3x1',
    'Vitamin B complex tab 1x1',
    'Antasida syr 3x1 CI',
    'Oralit 1 sachet dilarutkan dalam 200ml air'
  ];

  private static edukasi = [
    'Istirahat cukup dan minum air putih minimal 2 liter/hari',
    'Hindari makanan pedas, asam, dan berlemak',
    'Kontrol gula darah secara rutin',
    'Olahraga teratur minimal 30 menit/hari',
    'Diet rendah garam dan lemak',
    'Hindari stress berlebihan',
    'Minum obat teratur sesuai anjuran',
    'Kompres hangat pada area nyeri',
    'Hindari alergen yang sudah diketahui',
    'Jaga kebersihan diri dan lingkungan',
    'Konsumsi makanan bergizi seimbang',
    'Hindari merokok dan alkohol',
    'Gunakan masker saat keluar rumah',
    'Cuci tangan dengan sabun secara teratur'
  ];

  static generateRandomName(): string {
    const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
    return `${firstName} ${lastName}`;
  }

  static generateRandomNIK(): string {
    let nik = '';
    for (let i = 0; i < 16; i++) {
      nik += Math.floor(Math.random() * 10);
    }
    return nik;
  }

  static generateRandomPhone(): string {
    const prefix = '08';
    let phone = prefix;
    for (let i = 0; i < 10; i++) {
      phone += Math.floor(Math.random() * 10);
    }
    return phone;
  }

  static generateRandomDate(startYear: number = 1950, endYear: number = 2010): string {
    const start = new Date(startYear, 0, 1);
    const end = new Date(endYear, 11, 31);
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  }

  static generateRandomAddress(): string {
    const street = this.streets[Math.floor(Math.random() * this.streets.length)];
    const number = Math.floor(Math.random() * 200) + 1;
    const city = this.cities[Math.floor(Math.random() * this.cities.length)];
    const postalCode = Math.floor(Math.random() * 90000) + 10000;
    return `${street} No. ${number}, ${city} ${postalCode}`;
  }

  static generateRandomEmail(name: string): string {
    const cleanName = name.toLowerCase().replace(/\s+/g, '.');
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'email.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${cleanName}@${domain}`;
  }

  static generateRandomBPJS(): string {
    let bpjs = '0001';
    for (let i = 0; i < 9; i++) {
      bpjs += Math.floor(Math.random() * 10);
    }
    return bpjs;
  }

  static generatePatientData() {
    const nama = this.generateRandomName();
    const namaAyah = this.generateRandomName();
    const namaIbu = this.generateRandomName().replace(/\b\w+$/, 'Binti ' + this.lastNames[Math.floor(Math.random() * this.lastNames.length)]);
    const jenisKelamin = Math.random() > 0.5 ? 'Laki-laki' : 'Perempuan';
    const isBPJS = Math.random() > 0.5;

    return {
      nik: this.generateRandomNIK(),
      nama_lengkap: nama,
      tempat_lahir: this.cities[Math.floor(Math.random() * this.cities.length)],
      tgl_lahir: this.generateRandomDate(1950, 2010),
      jenis_kelamin: jenisKelamin,
      agama: ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha'][Math.floor(Math.random() * 5)],
      golongan_darah: ['A', 'B', 'AB', 'O'][Math.floor(Math.random() * 4)],
      pekerjaan: ['Pegawai Swasta', 'PNS', 'Wiraswasta', 'Petani', 'Buruh', 'IRT', 'Mahasiswa'][Math.floor(Math.random() * 7)],
      pendidikan: ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2'][Math.floor(Math.random() * 6)],
      status_kawin: ['Belum Menikah', 'Menikah', 'Cerai Hidup', 'Cerai Mati'][Math.floor(Math.random() * 4)],
      alamat: this.generateRandomAddress(),
      no_hp: this.generateRandomPhone(),
      email: this.generateRandomEmail(nama),
      nama_ayah: namaAyah,
      nama_ibu: namaIbu,
      no_bpjs: isBPJS ? this.generateRandomBPJS() : '',
    };
  }

  static generateSOAPSubjektif() {
    const keluhan = this.keluhanUtama[Math.floor(Math.random() * this.keluhanUtama.length)];
    const riwayat = this.riwayatPenyakit[Math.floor(Math.random() * this.riwayatPenyakit.length)];
    const alergiData = this.alergi[Math.floor(Math.random() * this.alergi.length)];

    const duration = ['2 hari', '3 hari', '1 minggu', '2 minggu', '1 bulan'][Math.floor(Math.random() * 5)];
    const severity = ['ringan', 'sedang', 'berat'][Math.floor(Math.random() * 3)];

    return {
      keluhan_utama: keluhan,
      riwayat_penyakit_sekarang: `Pasien mengeluh ${keluhan.toLowerCase()}. Keluhan dirasakan sejak ${duration} yang lalu dengan intensitas ${severity}. Keluhan memberat saat beraktivitas dan sedikit berkurang saat istirahat. Pasien sudah mencoba minum obat warung namun belum ada perbaikan.`,
      riwayat_penyakit_dahulu: riwayat,
      riwayat_pengobatan: riwayat.includes('Tidak ada') ? 'Tidak ada pengobatan rutin' : 'Rutin kontrol dan minum obat sesuai anjuran dokter',
      riwayat_alergi: alergiData,
      riwayat_keluarga: Math.random() > 0.5 ? 'Ayah memiliki riwayat hipertensi dan diabetes' : 'Tidak ada riwayat penyakit keluarga yang signifikan',
    };
  }

  static generateSOAPObjektif() {
    const suhuNormal = 36.5 + Math.random() * 0.8;
    const suhuTinggi = 37.5 + Math.random() * 2;
    const isFever = Math.random() > 0.6;

    const sistol = 100 + Math.floor(Math.random() * 50);
    const diastol = 60 + Math.floor(Math.random() * 40);
    const nadi = 60 + Math.floor(Math.random() * 40);
    const napas = 16 + Math.floor(Math.random() * 10);

    return {
      keadaan_umum: ['Baik', 'Sedang', 'Lemah'][Math.floor(Math.random() * 3)],
      kesadaran: 'Compos Mentis',
      tekanan_darah: `${sistol}/${diastol} mmHg`,
      nadi: `${nadi} x/menit`,
      suhu: isFever ? `${suhuTinggi.toFixed(1)}°C` : `${suhuNormal.toFixed(1)}°C`,
      pernapasan: `${napas} x/menit`,
      berat_badan: `${50 + Math.floor(Math.random() * 40)} kg`,
      tinggi_badan: `${150 + Math.floor(Math.random() * 30)} cm`,
      pemeriksaan_fisik_umum: 'Kepala: Normocephal, Mata: Konjungtiva tidak anemis, sklera tidak ikterik. Leher: Tidak ada pembesaran KGB. Thorax: Simetris, retraksi (-). Jantung: BJ I-II regular, murmur (-). Paru: Vesikuler (+/+), ronkhi (-/-), wheezing (-/-). Abdomen: Supel, BU (+) normal, nyeri tekan (-). Ekstremitas: Akral hangat, edema (-/-)',
    };
  }

  static generateDiagnosis() {
    const primary = this.diagnosis[Math.floor(Math.random() * this.diagnosis.length)];
    const hasSecondary = Math.random() > 0.7;
    let secondary = '';

    if (hasSecondary) {
      const secondaryOptions = this.diagnosis.filter(d => d !== primary);
      secondary = secondaryOptions[Math.floor(Math.random() * secondaryOptions.length)];
    }

    return {
      diagnosis_utama: primary,
      diagnosis_banding: hasSecondary ? secondary : '',
      kode_icd10: `A${Math.floor(Math.random() * 90) + 10}.${Math.floor(Math.random() * 10)}`,
    };
  }

  static generatePlanTerapi() {
    const numObat = 2 + Math.floor(Math.random() * 4);
    const obatList = [];
    const usedObat = new Set<string>();

    while (obatList.length < numObat) {
      const obat = this.terapiObat[Math.floor(Math.random() * this.terapiObat.length)];
      if (!usedObat.has(obat)) {
        obatList.push(obat);
        usedObat.add(obat);
      }
    }

    const numEdukasi = 2 + Math.floor(Math.random() * 3);
    const edukasiList = [];
    const usedEdukasi = new Set<string>();

    while (edukasiList.length < numEdukasi) {
      const edu = this.edukasi[Math.floor(Math.random() * this.edukasi.length)];
      if (!usedEdukasi.has(edu)) {
        edukasiList.push(edu);
        usedEdukasi.add(edu);
      }
    }

    return {
      terapi_farmakologi: obatList.join('\n'),
      terapi_non_farmakologi: edukasiList.join('\n'),
      tindakan_medis: Math.random() > 0.7 ? 'Pemberian infus RL 20 tpm\nNebulizer dengan combivent' : 'Tidak ada tindakan khusus',
      rencana_tindak_lanjut: ['Kontrol 3 hari lagi', 'Kontrol 1 minggu lagi', 'Kontrol 2 minggu lagi', 'Kontrol jika keluhan tidak membaik'][Math.floor(Math.random() * 4)],
      edukasi_pasien: edukasiList.join('. ') + '.',
      prognosis: ['Baik (Bonam)', 'Cukup (Dubia ad Bonam)', 'Kurang Baik (Dubia ad Malam)'][Math.floor(Math.random() * 3)],
    };
  }
}
