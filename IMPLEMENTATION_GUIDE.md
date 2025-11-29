# RME Business Logic Implementation Guide

## Overview
This guide explains the implementation of business logic for the Medical Record System (RME) using **React + TypeScript + Supabase**.

## Architecture

### 1. Type Definitions (`src/types/database.types.ts`)
Complete TypeScript interfaces matching all database tables:
- `User` - User authentication and roles
- `IdentitasPasien` - Patient identity
- `KunjunganResume` - Patient visits
- `SoapSubjektif`, `SoapObjektif`, `SoapAsesmenDiagnosis`, `SoapPlan` - SOAP documentation
- `Diagnosis`, `TindakanMedis`, `TerapiObat` - Clinical details
- `KunjunganWithRelations` - Complete visit data with relationships

### 2. Supabase Client (`src/lib/supabase.ts`)
Configured Supabase client using environment variables.

### 3. Services Layer

#### `KunjunganService` (`src/services/kunjungan.service.ts`)
Core service handling all kunjungan operations with:

**Auto-Stamping Logic:**
- Automatically captures current user ID using `getCurrentUserId()`
- Stamps `metadata_user_buat` on all create operations
- Applies to: kunjungan, subjektif, objektif, asesmen, plan

**Role-Based Visibility (Blind Review):**
- `applyVisibilityRules()` checks current user's role
- **Mahasiswa**: sees "Anonymous" for `uploader_name`
- **Dosen/Admin**: sees actual `full_name` of uploader
- Applied automatically on all read operations

**Key Methods:**
```typescript
// Create with auto-stamping
await KunjunganService.create(kunjunganData);
await KunjunganService.createSubjektif(subjektifData);
await KunjunganService.createObjektif(objektifData);
await KunjunganService.createAsesmen(asesmenData);
await KunjunganService.createPlan(planData);

// Read with visibility rules
await KunjunganService.getById(id_kunjungan);
await KunjunganService.getAll();
await KunjunganService.getByPasienId(id_pasien);

// Get uploader name (respects role)
KunjunganService.getUploaderName(kunjungan);
```

#### `AuthService` (`src/services/auth.service.ts`)
Authentication service for user management:
```typescript
await AuthService.signIn(username, password);
await AuthService.signOut();
await AuthService.getCurrentUser();
await AuthService.getUserRole();
```

### 4. Custom Hooks (`src/hooks/useKunjungan.ts`)
React hooks for easy component integration:

```typescript
// Single kunjungan
const { kunjungan, loading, error } = useKunjungan(id_kunjungan);

// All kunjungan
const { kunjunganList, loading, error, refetch } = useKunjunganList();

// Patient-specific kunjungan
const { kunjunganList, loading, error } = usePatientKunjungan(id_pasien);
```

## Usage Examples

### Example 1: Create New Kunjungan (with Auto-Stamping)
```typescript
import { KunjunganService } from './services/kunjungan.service';

// User must be authenticated - their ID is auto-stamped
const newKunjungan = await KunjunganService.create({
  id_pasien: 'uuid-pasien',
  tgl_kunjungan: new Date().toISOString(),
  jenis_kunjungan: 'Rawat Jalan',
  jenis_pasien: 'BPJS',
  unit_pelayanan: 'Poli Umum',
  tenaga_medis_pj: 'dr. John Doe'
});
// metadata_user_buat is automatically set to current user's ID
```

### Example 2: Display Kunjungan with Blind Review
```typescript
import { useKunjunganList } from './hooks/useKunjungan';
import { KunjunganService } from './services/kunjungan.service';

function KunjunganList() {
  const { kunjunganList, loading } = useKunjunganList();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {kunjunganList.map(kunjungan => (
        <div key={kunjungan.id_kunjungan}>
          <h3>{kunjungan.pasien?.nama_lengkap}</h3>
          <p>Unit: {kunjungan.unit_pelayanan}</p>
          {/* Shows "Anonymous" for mahasiswa, real name for dosen/admin */}
          <p>Uploaded by: {KunjunganService.getUploaderName(kunjungan)}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Complete SOAP Entry
```typescript
// 1. Create visit
const kunjungan = await KunjunganService.create({...});

// 2. Add Subjective data
await KunjunganService.createSubjektif({
  id_kunjungan: kunjungan.id_kunjungan,
  keluhan_utama: 'Demam 3 hari',
  rps: 'Demam naik turun...',
  riwayat_alergi: 'Tidak ada'
});

// 3. Add Objective data
await KunjunganService.createObjektif({
  id_kunjungan: kunjungan.id_kunjungan,
  keadaan_umum: 'Baik',
  tv_td: '120/80',
  tv_nadi: 80,
  tv_suhu: 38.5
});

// 4. Add Assessment
const asesmen = await KunjunganService.createAsesmen({
  id_kunjungan: kunjungan.id_kunjungan,
  catatan_klinis: 'Febris ec. infeksi'
});

// 5. Add Plan
await KunjunganService.createPlan({
  id_kunjungan: kunjungan.id_kunjungan,
  rencana_umum: 'Terapi simptomatis',
  rencana_kontrol: 'Kontrol 3 hari'
});

// All records automatically stamped with current user's ID
```

## Key Features

### ✅ Automatic User Tracking
- Every create operation automatically captures the current user's ID
- No manual intervention needed
- Consistent audit trail across all tables

### ✅ Role-Based Visibility (Blind Review)
- **Mahasiswa Role**: Cannot see who uploaded the data ("Anonymous")
- **Dosen/Admin Role**: Can see the full name of the uploader
- Implemented at the service layer for consistency
- Automatically applied to all read operations

### ✅ Type Safety
- Full TypeScript support with strict typing
- Compile-time error checking
- IntelliSense support in IDEs

### ✅ Relationship Loading
- Automatic eager loading of related data
- Single query fetches kunjungan with pasien, SOAP data, uploader info
- Optimized for performance

## Security Considerations

1. **Row Level Security (RLS)** is enabled on all tables in the database
2. **Authentication required** for all operations
3. **Metadata tracking** ensures complete audit trail
4. **Role-based access** enforced at both database and application layers

## Next Steps

To integrate this into your application:

1. Ensure users are authenticated via `AuthService`
2. Use the provided hooks in your React components
3. All data operations will automatically:
   - Track the user who created/modified records
   - Apply visibility rules based on user role
   - Maintain referential integrity through foreign keys
