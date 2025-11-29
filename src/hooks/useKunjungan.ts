import { useState, useEffect } from 'react';
import { KunjunganService } from '../services/kunjungan.service';
import type { KunjunganWithRelations } from '../types/database.types';

export function useKunjungan(id_kunjungan: string) {
  const [kunjungan, setKunjungan] = useState<KunjunganWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchKunjungan() {
      try {
        setLoading(true);
        const data = await KunjunganService.getById(id_kunjungan);
        setKunjungan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch kunjungan');
      } finally {
        setLoading(false);
      }
    }

    fetchKunjungan();
  }, [id_kunjungan]);

  return { kunjungan, loading, error };
}

export function useKunjunganList() {
  const [kunjunganList, setKunjunganList] = useState<KunjunganWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKunjunganList = async () => {
    try {
      setLoading(true);
      const data = await KunjunganService.getAll();
      setKunjunganList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch kunjungan list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKunjunganList();
  }, []);

  return { kunjunganList, loading, error, refetch: fetchKunjunganList };
}

export function usePatientKunjungan(id_pasien: string) {
  const [kunjunganList, setKunjunganList] = useState<KunjunganWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPatientKunjungan() {
      try {
        setLoading(true);
        const data = await KunjunganService.getByPasienId(id_pasien);
        setKunjunganList(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch patient kunjungan');
      } finally {
        setLoading(false);
      }
    }

    fetchPatientKunjungan();
  }, [id_pasien]);

  return { kunjunganList, loading, error };
}
