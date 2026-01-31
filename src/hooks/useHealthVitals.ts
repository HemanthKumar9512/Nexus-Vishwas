import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface HealthVital {
  id: string;
  user_id: string;
  heart_rate: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  spo2: number | null;
  temperature: number | null;
  steps: number;
  sleep_hours: number | null;
  stress_level: number | null;
  glucose_level: number | null;
  respiratory_rate: number | null;
  hrv: number | null;
  recorded_at: string;
  source: string;
  device_id: string | null;
}

export interface VitalsInput {
  heart_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  spo2?: number;
  temperature?: number;
  steps?: number;
  sleep_hours?: number;
  stress_level?: number;
  glucose_level?: number;
  respiratory_rate?: number;
  hrv?: number;
  source?: string;
  device_id?: string;
}

export function useHealthVitals() {
  const { user } = useAuth();
  const [vitals, setVitals] = useState<HealthVital[]>([]);
  const [latestVitals, setLatestVitals] = useState<HealthVital | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchVitals();
    } else {
      setVitals([]);
      setLatestVitals(null);
      setLoading(false);
    }
  }, [user]);

  const fetchVitals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('health_vitals')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setVitals(data || []);
      setLatestVitals(data?.[0] || null);
    } catch (error) {
      console.error('Error fetching vitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const addVitals = async (input: VitalsInput) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('health_vitals')
        .insert({
          user_id: user.id,
          ...input,
        });

      if (error) throw error;

      await fetchVitals();
      toast.success('Health vitals recorded');
      return { error: null };
    } catch (error) {
      toast.error('Failed to record vitals');
      return { error: error as Error };
    }
  };

  return { vitals, latestVitals, loading, addVitals, refetch: fetchVitals };
}
