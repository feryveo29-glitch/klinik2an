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

  // --- SCENARIO BASED GENERATION ---

  private static medicalCases = [
    {
      name: 'ISPA (Infeksi Saluran Pernapasan Akut)',
      keluhan: 'Batuk, pilek, dan demam',
      rps: 'Pasien mengeluh batuk berdahak dan pilek sejak 3 hari yang lalu. Disertai demam naik turun dan sakit tenggorokan saat menelan.',
      rpd: 'Tidak ada riwayat penyakit paru sebelumnya.',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 37.5, suhu_max: 38.5,
        sistol_min: 110, sistol_max: 130,
        diastol_min: 70, diastol_max: 90,
        nadi_min: 80, nadi_max: 100,
        rr_min: 20, rr_max: 24,
        fisik: 'Faring hiperemis (+), Tonsil T1-T1, Ronkhi (-/-), Wheezing (-/-)'
      },
      diagnosis: { code: 'J06.9', name: 'Acute upper respiratory infection, unspecified' },
      terapi: [
        'Paracetamol 500mg 3x1 (k/p demam)',
        'Ambroxol 30mg 3x1',
        'Vitamin C 1x1',
        'Istirahat cukup',
        'Perbanyak minum air hangat'
      ]
    },
    {
      name: 'Hipertensi Primer',
      keluhan: 'Sakit kepala dan tengkuk terasa berat',
      rps: 'Sakit kepala dirasakan sejak tadi pagi, terasa berdenyut di bagian belakang kepala. Pasien mengaku sering makan makanan asin akhir-akhir ini.',
      rpd: 'Riwayat hipertensi sejak 2 tahun lalu, jarang kontrol.',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 36.0, suhu_max: 37.0,
        sistol_min: 150, sistol_max: 180,
        diastol_min: 90, diastol_max: 110,
        nadi_min: 80, nadi_max: 100,
        rr_min: 18, rr_max: 22,
        fisik: 'Jantung: BJ I-II reguler, murmur (-), gallop (-). Paru dalam batas normal.'
      },
      diagnosis: { code: 'I10', name: 'Essential (primary) hypertension' },
      terapi: [
        'Amlodipine 10mg 1x1 (malam)',
        'Diet rendah garam',
        'Kontrol tensi rutin',
        'Olahraga ringan'
      ]
    },
    {
      name: 'Dyspepsia / Gastritis',
      keluhan: 'Nyeri ulu hati dan mual',
      rps: 'Nyeri ulu hati dirasakan perih dan panas, disertai mual dan kembung. Keluhan memberat jika telat makan.',
      rpd: 'Riwayat sakit maag (+)',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 36.5, suhu_max: 37.2,
        sistol_min: 110, sistol_max: 130,
        diastol_min: 70, diastol_max: 80,
        nadi_min: 70, nadi_max: 90,
        rr_min: 18, rr_max: 20,
        fisik: 'Abdomen: Supel, Nyeri tekan epigastrium (+), BU (+) normal'
      },
      diagnosis: { code: 'K30', name: 'Functional dyspepsia' },
      terapi: [
        'Omeprazole 20mg 2x1 (sebelum makan)',
        'Antasida sirup 3x1 Cth (sebelum makan)',
        'Makan sedikit tapi sering',
        'Hindari makanan pedas dan asam'
      ]
    },
    {
      name: 'Dermatitis Kontak',
      keluhan: 'Gatal-gatal kemerahan di tangan',
      rps: 'Gatal dirasakan setelah mencuci baju menggunakan deterjen merk baru. Timbul bercak kemerahan yang terasa panas.',
      rpd: 'Riwayat alergi deterjen (+)',
      alergi: 'Deterjen / Sabun keras',
      objektif: {
        suhu_min: 36.0, suhu_max: 37.0,
        sistol_min: 110, sistol_max: 120,
        diastol_min: 70, diastol_max: 80,
        nadi_min: 70, nadi_max: 80,
        rr_min: 16, rr_max: 20,
        fisik: 'Status Lokalis Manus D/S: Makula eritema (+), papul (+), ekskoriasi (+)'
      },
      diagnosis: { code: 'L23.9', name: 'Allergic contact dermatitis, unspecified cause' },
      terapi: [
        'Cetirizine 10mg 1x1 (malam)',
        'Hydrocortisone cream 2.5% 2x1 oles tipis',
        'Hindari kontak dengan deterjen penyebab'
      ]
    },
    {
      name: 'Myalgia (Nyeri Otot)',
      keluhan: 'Badan pegal linu',
      rps: 'Pasien merasa pegal di seluruh badan terutama punggung dan kaki setelah kerja bakti kemarin. Tidak ada demam.',
      rpd: 'Dislipidemia',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 36.0, suhu_max: 37.0,
        sistol_min: 120, sistol_max: 140,
        diastol_min: 80, diastol_max: 90,
        nadi_min: 70, nadi_max: 90,
        rr_min: 18, rr_max: 20,
        fisik: 'Ekstremitas: Nyeri tekan otot paravertebral (+), ROM terbatas karena nyeri'
      },
      diagnosis: { code: 'M79.1', name: 'Myalgia' },
      terapi: [
        'Ibuprofen 400mg 3x1 (sesudah makan)',
        'Vitamin B Complex 1x1',
        'Kompres hangat',
        'Istirahat cukup'
      ]
    },
    {
      name: 'Diabetes Mellitus Tipe 2',
      keluhan: 'Sering haus, sering kencing, dan berat badan turun',
      rps: 'Pasien mengeluh sering merasa haus dan lapar, serta sering buang air kecil terutama malam hari. Berat badan turun 5kg dalam 2 bulan terakhir padahal nafsu makan biasa.',
      rpd: 'Ibu pasien menderita DM',
      riwayat_obat: 'Belum ada',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 36.5, suhu_max: 37.0,
        sistol_min: 120, sistol_max: 130,
        diastol_min: 80, diastol_max: 90,
        nadi_min: 80, nadi_max: 90,
        rr_min: 18, rr_max: 20,
        fisik: 'BB: 65kg (turun), TB: 165cm. GDS: 280 mg/dL. Ekstremitas: tidak ada luka.'
      },
      diagnosis: { code: 'E11.9', name: 'Type 2 diabetes mellitus without complications' },
      terapi: [
        'Metformin 500mg 2x1 (sesudah makan)',
        'Edukasi diet DM (3J: Jadwal, Jumlah, Jenis)',
        'Olahraga teratur',
        'Cek gula darah rutin'
      ]
    },
    {
      name: 'Gout Arthritis (Asam Urat)',
      keluhan: 'Nyeri hebat dan bengkak di jempol kaki kanan',
      rps: 'Nyeri dirasakan mendadak sejak bangun tidur pagi ini. Jempol kaki kanan bengkak, merah, dan panas. Sulit berjalan. Kemarin malam makan sate kambing.',
      rpd: 'Pernah nyeri serupa setahun lalu',
      riwayat_obat: 'Minum jamu pegal linu',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 37.0, suhu_max: 37.8,
        sistol_min: 130, sistol_max: 140,
        diastol_min: 80, diastol_max: 90,
        nadi_min: 88, nadi_max: 96,
        rr_min: 20, rr_max: 22,
        fisik: 'Regio MTP-1 Dextra: Edema (+), Eritema (+), Kalor (+), Nyeri Tekan (+), ROM terbatas.'
      },
      diagnosis: { code: 'M10.9', name: 'Gout, unspecified' },
      terapi: [
        'Na Diclofenac 50mg 2x1 (sesudah makan)',
        'Allopurinol 100mg 1x1 (malam)',
        'Kompres dingin',
        'Diet rendah purin (hindari jeroan, kacang-kacangan)'
      ]
    },
    {
      name: 'Demam Tifoid',
      keluhan: 'Demam naik turun terutama sore/malam hari',
      rps: 'Demam sudah 5 hari, makin sore makin tinggi. Disertai mual, muntah, dan lidah terasa pahit. BAB cair 2x sehari.',
      rpd: 'Tidak ada',
      riwayat_obat: 'Paracetamol (beli sendiri)',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 38.0, suhu_max: 39.5,
        sistol_min: 100, sistol_max: 110,
        diastol_min: 60, diastol_max: 70,
        nadi_min: 90, nadi_max: 100,
        rr_min: 20, rr_max: 22,
        fisik: 'Lidah kotor (coated tongue) dengan tepi hiperemis. Nyeri tekan epigastrium (+). Widal Test: Salmonella Typhi O 1/320.'
      },
      diagnosis: { code: 'A01.0', name: 'Typhoid fever' },
      terapi: [
        'Ciprofloxacin 500mg 2x1',
        'Paracetamol 500mg 3x1 (k/p demam)',
        'Antasida syr 3x1 Cth',
        'Diet lunak rendah serat',
        'Bed rest total'
      ]
    },
    {
      name: 'Gastroenteritis Akut (Diare)',
      keluhan: 'BAB cair >5 kali sehari',
      rps: 'BAB cair ampas sedikit, tidak ada darah/lendir. Disertai mual dan lemas. Pasien mengaku makan sambal pedas kemarin.',
      rpd: 'Gastritis',
      riwayat_obat: 'Diapet',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 36.5, suhu_max: 37.5,
        sistol_min: 100, sistol_max: 110,
        diastol_min: 60, diastol_max: 70,
        nadi_min: 90, nadi_max: 100,
        rr_min: 20, rr_max: 24,
        fisik: 'Mata agak cekung, turgor kulit kembali lambat, bising usus meningkat.'
      },
      diagnosis: { code: 'A09', name: 'Infectious gastroenteritis and colitis, unspecified' },
      terapi: [
        'Oralit sachet (tiap kali BAB)',
        'Zinc 20mg 1x1',
        'Attapulgite 2 tab (tiap BAB cair)',
        'Loperamide (jika perlu)',
        'Makan makanan lunak'
      ]
    },
    {
      name: 'Tension Type Headache',
      keluhan: 'Sakit kepala seperti diikat kencang',
      rps: 'Sakit kepala dirasakan di seluruh kepala, terasa berat dan kencang seperti memakai helm sempit. Terasa kaku di leher belakang. Stres pekerjaan (+).',
      rpd: 'Tidak ada',
      riwayat_obat: 'Bodrex',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 36.5, suhu_max: 37.0,
        sistol_min: 120, sistol_max: 130,
        diastol_min: 80, diastol_max: 85,
        nadi_min: 80, nadi_max: 88,
        rr_min: 18, rr_max: 20,
        fisik: 'Nyeri tekan otot pericranial (+), kaku kuduk (-).'
      },
      diagnosis: { code: 'G44.2', name: 'Tension-type headache' },
      terapi: [
        'Ibuprofen 400mg 3x1 (sesudah makan)',
        'Muscle relaxant (Eperisone) 50mg 2x1',
        'Edukasi manajemen stres',
        'Istirahat cukup'
      ]
    },
    {
      name: 'Asma Bronkial Eksaserbasi Ringan',
      keluhan: 'Sesak napas dan bunyi ngik-ngik',
      rps: 'Sesak napas dirasakan sejak semalam karena udara dingin. Terdengar bunyi mengi saat bernapas. Batuk sesekali.',
      rpd: 'Riwayat asma sejak kecil',
      riwayat_obat: 'Salbutamol inhaler (habis)',
      alergi: 'Debu, Dingin',
      objektif: {
        suhu_min: 36.5, suhu_max: 37.2,
        sistol_min: 110, sistol_max: 130,
        diastol_min: 70, diastol_max: 80,
        nadi_min: 90, nadi_max: 110,
        rr_min: 24, rr_max: 28,
        fisik: 'Paru: Vesikuler (+/+), Wheezing (+/+) ekspiratoir, Ronkhi (-/-).'
      },
      diagnosis: { code: 'J45.901', name: 'Unspecified asthma with (acute) exacerbation' },
      terapi: [
        'Nebulisasi Ventolin 1 resp',
        'Salbutamol 2mg 3x1',
        'Dexamethasone 0.5mg 3x1',
        'Hindari pencetus (dingin/debu)'
      ]
    },
    {
      name: 'Vertigo Perifer (BPPV)',
      keluhan: 'Pusing berputar saat bangun tidur',
      rps: 'Pusing dirasakan berputar hebat (seperti naik komidi putar) terutama saat miring ke kanan atau bangun dari tidur. Mual (+), muntah (-).',
      rpd: 'Dislipidemia',
      riwayat_obat: 'Belum ada',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 36.0, suhu_max: 37.0,
        sistol_min: 120, sistol_max: 140,
        diastol_min: 80, diastol_max: 90,
        nadi_min: 80, nadi_max: 90,
        rr_min: 18, rr_max: 20,
        fisik: 'Nistagmus (+), Romberg Test (+), Dix-Hallpike maneuver (+).'
      },
      diagnosis: { code: 'H81.1', name: 'Benign paroxysmal vertigo' },
      terapi: [
        'Betahistine Mesylate 6mg 3x1',
        'Dimenhydrinate 50mg (k/p mual)',
        'Edukasi manuver Epley',
        'Istirahat dengan bantal tinggi'
      ]
    },
    {
      name: 'Anemia Defisiensi Besi',
      keluhan: 'Lemas, pusing, dan mudah lelah',
      rps: 'Pasien merasa cepat lelah saat aktivitas ringan. Sering pusing berkunang-kunang. Wajah terlihat pucat.',
      rpd: 'Haid sering memanjang (menorrhagia)',
      riwayat_obat: 'Sangobion (jarang diminum)',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 36.0, suhu_max: 37.0,
        sistol_min: 100, sistol_max: 110,
        diastol_min: 60, diastol_max: 70,
        nadi_min: 80, nadi_max: 100,
        rr_min: 18, rr_max: 22,
        fisik: 'Konjungtiva anemis (+/+), Akral hangat, CRT < 2 detik. Hb: 9.2 g/dL.'
      },
      diagnosis: { code: 'D50.9', name: 'Iron deficiency anemia, unspecified' },
      terapi: [
        'Tablet Tambah Darah (Fe) 1x1',
        'Asam Folat 1x1',
        'Makan makanan tinggi zat besi (bayam, hati, daging merah)',
        'Cek darah ulang 1 bulan lagi'
      ]
    },
    {
      name: 'Scabies (Kudis)',
      keluhan: 'Gatal hebat terutama malam hari di sela jari',
      rps: 'Gatal dirasakan di sela-sela jari tangan, pergelangan tangan, dan perut. Gatal memberat saat malam hari. Anggota keluarga lain juga gatal.',
      rpd: 'Tidak ada',
      riwayat_obat: 'Bedak Salicyl',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 36.0, suhu_max: 37.0,
        sistol_min: 110, sistol_max: 120,
        diastol_min: 70, diastol_max: 80,
        nadi_min: 70, nadi_max: 90,
        rr_min: 18, rr_max: 20,
        fisik: 'Regio interdigitalis manus: Papul eritema (+), ekskoriasi (+), kanalikuli (+).'
      },
      diagnosis: { code: 'B86', name: 'Scabies' },
      terapi: [
        'Permethrin 5% cream (oles seluruh badan, diamkan 8-10 jam, bilas)',
        'Cetirizine 10mg 1x1 (malam)',
        'Cuci semua baju/sprei dengan air panas',
        'Obati seluruh anggota keluarga serumah'
      ]
    },
    {
      name: 'Varicella (Cacar Air)',
      keluhan: 'Demam dan muncul bintik berair di seluruh badan',
      rps: 'Demam sejak 2 hari lalu, kemudian muncul bintik merah yang berubah menjadi lenting berisi air. Terasa gatal. Mulai dari dada menyebar ke wajah dan punggung.',
      rpd: 'Belum pernah cacar',
      riwayat_obat: 'Paracetamol',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 37.8, suhu_max: 38.5,
        sistol_min: 100, sistol_max: 120,
        diastol_min: 60, diastol_max: 80,
        nadi_min: 80, nadi_max: 100,
        rr_min: 20, rr_max: 24,
        fisik: 'Status Dermatologis: Vesikel dengan dasar eritema (dew drop on rose petal) polimorfik tersebar generalisata.'
      },
      diagnosis: { code: 'B01.9', name: 'Varicella without complication' },
      terapi: [
        'Acyclovir 800mg 5x1 selama 7 hari',
        'Paracetamol 500mg 3x1 (k/p demam)',
        'Bedak Salicyl (untuk gatal)',
        'Isolasi mandiri sampai semua lesi mengering'
      ]
    },
    {
      name: 'Konjungtivitis Bakterial',
      keluhan: 'Mata merah dan banyak kotoran mata',
      rps: 'Mata kanan merah sejak bangun tidur, terasa mengganjal, dan banyak kotoran mata (belekan) berwarna kekuningan lengket. Penglihatan tidak kabur.',
      rpd: 'Tidak ada',
      riwayat_obat: 'Tetes mata Insto',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 36.5, suhu_max: 37.0,
        sistol_min: 110, sistol_max: 130,
        diastol_min: 70, diastol_max: 80,
        nadi_min: 70, nadi_max: 90,
        rr_min: 18, rr_max: 20,
        fisik: 'Oculi Dextra: Konjungtiva bulbi hiperemis (+), sekret mukopurulen (+), kornea jernih.'
      },
      diagnosis: { code: 'H10.9', name: 'Unspecified conjunctivitis' },
      terapi: [
        'Chloramphenicol ED 1 tetes/2 jam OD',
        'Kompres hangat',
        'Jangan mengucek mata',
        'Cuci tangan sebelum dan sesudah menyentuh mata'
      ]
    },
    {
      name: 'Otitis Media Akut (OMA)',
      keluhan: 'Nyeri telinga kanan dan demam',
      rps: 'Nyeri telinga kanan dirasakan berdenyut sejak 2 hari lalu. Sebelumnya batuk pilek. Pendengaran agak berkurang.',
      rpd: 'ISPA berulang',
      riwayat_obat: 'Paracetamol',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 37.5, suhu_max: 38.5,
        sistol_min: 110, sistol_max: 120,
        diastol_min: 70, diastol_max: 80,
        nadi_min: 80, nadi_max: 100,
        rr_min: 20, rr_max: 24,
        fisik: 'Otoskopi AD: Membran timpani hiperemis, bulging (+), refleks cahaya menurun.'
      },
      diagnosis: { code: 'H66.9', name: 'Otitis media, unspecified' },
      terapi: [
        'Amoxicillin 500mg 3x1',
        'Paracetamol 500mg 3x1 (k/p nyeri/demam)',
        'Pseudoephedrine 30mg 3x1 (dekongestan)',
        'Jangan mengorek telinga'
      ]
    },
    {
      name: 'Hemoroid Interna (Wasir)',
      keluhan: 'BAB berdarah segar menetes',
      rps: 'BAB keluar darah segar menetes di akhir buang air besar. Tidak ada nyeri. Kadang ada benjolan keluar tapi bisa masuk sendiri.',
      rpd: 'Konstipasi kronis',
      riwayat_obat: 'Tidak ada',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 36.5, suhu_max: 37.0,
        sistol_min: 120, sistol_max: 130,
        diastol_min: 80, diastol_max: 90,
        nadi_min: 70, nadi_max: 90,
        rr_min: 18, rr_max: 20,
        fisik: 'Rectal Touche: Tonus sfingter ani kuat, mukosa licin, ampula tidak kolaps, sarung tangan lendir darah (+).'
      },
      diagnosis: { code: 'I84.2', name: 'Internal hemorrhoids without complication' },
      terapi: [
        'Ardium/Diosmin 500mg 2x1',
        'Laxadine syr 1x1 Cth (malam)',
        'Perbanyak makan serat dan minum air',
        'Jangan mengejan terlalu kuat'
      ]
    },
    {
      name: 'Tinea Corporis (Kurap)',
      keluhan: 'Bercak merah gatal melingkar di punggung',
      rps: 'Muncul bercak merah gatal di punggung, bentuk bulat, tepi lebih aktif (merah), tengah menyembuh. Gatal bertambah saat berkeringat.',
      rpd: 'Tidak ada',
      riwayat_obat: 'Kalpanax cair',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 36.5, suhu_max: 37.0,
        sistol_min: 110, sistol_max: 120,
        diastol_min: 70, diastol_max: 80,
        nadi_min: 70, nadi_max: 90,
        rr_min: 18, rr_max: 20,
        fisik: 'Regio Dorsum: Plak eritema berbatas tegas, tepi aktif (central healing), skuama halus (+).'
      },
      diagnosis: { code: 'B35.4', name: 'Tinea corporis' },
      terapi: [
        'Ketoconazole 200mg 1x1 (sesudah makan)',
        'Ketoconazole cream 2% 2x1 oles',
        'Jaga kebersihan badan',
        'Ganti baju jika berkeringat'
      ]
    },
    {
      name: 'Low Back Pain (LBP) / Ischialgia',
      keluhan: 'Nyeri pinggang menjalar ke kaki',
      rps: 'Nyeri pinggang bawah dirasakan sejak mengangkat galon air kemarin. Nyeri terasa menjalar sampai ke paha belakang kanan. Kesemutan (+).',
      rpd: 'Sering pegal pinggang',
      riwayat_obat: 'Neo Rheumacyl',
      alergi: 'Tidak ada',
      objektif: {
        suhu_min: 36.5, suhu_max: 37.0,
        sistol_min: 120, sistol_max: 140,
        diastol_min: 80, diastol_max: 90,
        nadi_min: 70, nadi_max: 90,
        rr_min: 18, rr_max: 20,
        fisik: 'Lasegue Test (+/ -), Patrick (-/-), Contra-Patrick (-/-). Nyeri tekan lumbal (+).'
      },
      diagnosis: { code: 'M54.5', name: 'Low back pain' },
      terapi: [
        'Na Diclofenac 50mg 2x1',
        'Diazepam 2mg 1x1 (malam)',
        'Vitamin B1, B6, B12 1x1',
        'Hindari mengangkat beban berat',
        'Fisioterapi'
      ]
    }
  ];

  static generateCoherentMedicalRecord() {
    // Pilih satu skenario acak
    const scenario = this.medicalCases[Math.floor(Math.random() * this.medicalCases.length)];

    // Randomize vital signs within range
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randFloat = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(1);

    const sistol = rand(scenario.objektif.sistol_min, scenario.objektif.sistol_max);
    const diastol = rand(scenario.objektif.diastol_min, scenario.objektif.diastol_max);
    const nadi = rand(scenario.objektif.nadi_min, scenario.objektif.nadi_max);
    const rr = rand(scenario.objektif.rr_min, scenario.objektif.rr_max);
    const suhu = randFloat(scenario.objektif.suhu_min, scenario.objektif.suhu_max);
    const bb = rand(45, 80);
    const tb = rand(150, 175);

    return {
      keluhan_utama: scenario.keluhan,
      anamnesis: {
        rps: scenario.rps,
        rpd: scenario.rpd,
        riwayat_obat: (scenario as any).riwayat_obat || 'Tidak ada riwayat pengobatan signifikan.',
        alergi: scenario.alergi
      },
      pemeriksaan_fisik: {
        td_sistol: sistol,
        td_diastol: diastol,
        nadi: nadi,
        suhu: parseFloat(suhu),
        rr: rr,
        bb: bb,
        tb: tb,
        catatan: scenario.objektif.fisik
      },
      diagnosis: {
        kode_icd10: scenario.diagnosis.code,
        nama_diagnosis: scenario.diagnosis.name
      },
      terapi: scenario.terapi.join('\n')
    };
  }

  // Keep legacy methods for backward compatibility if needed, or remove them.
  // For now, I'll keep generatePatientData as it is independent of medical scenario.

}

