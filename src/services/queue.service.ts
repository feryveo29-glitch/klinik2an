import { supabase } from '../lib/supabase';

export interface QueueNumber {
  id: string;
  queue_date: string;
  queue_type: 'A' | 'B';
  queue_number: number;
  full_queue_code: string;
  patient_id?: string | null;
  status: 'waiting' | 'called' | 'completed' | 'cancelled';
  created_at: string;
  called_at?: string | null;
  completed_at?: string | null;
}

export class QueueService {
  static async getNextQueueNumber(queueType: 'A' | 'B'): Promise<string> {
    const { data, error } = await supabase.rpc('get_next_queue_number', {
      p_queue_type: queueType,
    });

    if (error) {
      console.error('Error getting next queue number:', error);
      throw new Error('Gagal mendapatkan nomor antrian');
    }

    return data;
  }

  static async createQueueNumber(
    queueType: 'A' | 'B',
    patientId?: string
  ): Promise<QueueNumber> {
    const queueCode = await this.getNextQueueNumber(queueType);
    const queueNumber = parseInt(queueCode.substring(1));

    const { data, error } = await supabase
      .from('queue_numbers')
      .insert({
        queue_type: queueType,
        queue_number: queueNumber,
        full_queue_code: queueCode,
        patient_id: patientId || null,
        status: 'waiting',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating queue number:', error);
      throw new Error('Gagal membuat nomor antrian');
    }

    return data;
  }

  static async getTodayQueues(queueType?: 'A' | 'B'): Promise<QueueNumber[]> {
    let query = supabase
      .from('queue_numbers')
      .select('*')
      .eq('queue_date', new Date().toISOString().split('T')[0])
      .order('queue_number', { ascending: true });

    if (queueType) {
      query = query.eq('queue_type', queueType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching queues:', error);
      return [];
    }

    return data || [];
  }

  static async updateQueueStatus(
    queueId: string,
    status: 'waiting' | 'called' | 'completed' | 'cancelled'
  ): Promise<void> {
    const updateData: any = { status };

    if (status === 'called') {
      updateData.called_at = new Date().toISOString();
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('queue_numbers')
      .update(updateData)
      .eq('id', queueId);

    if (error) {
      console.error('Error updating queue status:', error);
      throw new Error('Gagal mengubah status antrian');
    }
  }

  static getQueueStats(queues: QueueNumber[]) {
    return {
      total: queues.length,
      waiting: queues.filter((q) => q.status === 'waiting').length,
      called: queues.filter((q) => q.status === 'called').length,
      completed: queues.filter((q) => q.status === 'completed').length,
    };
  }
}
