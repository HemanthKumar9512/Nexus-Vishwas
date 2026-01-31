import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Appointment {
  id: string;
  user_id: string;
  doctor_name: string;
  doctor_specialty: string | null;
  hospital_name: string | null;
  appointment_date: string;
  appointment_time: string;
  appointment_type: 'in-person' | 'video' | 'phone';
  status: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';
  notes: string | null;
  created_at: string;
}

export interface AppointmentInput {
  doctor_name: string;
  doctor_specialty?: string;
  hospital_name?: string;
  appointment_date: string;
  appointment_time: string;
  appointment_type: 'in-person' | 'video' | 'phone';
  notes?: string;
}

export function useAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    } else {
      setAppointments([]);
      setLoading(false);
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments((data || []) as Appointment[]);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async (input: AppointmentInput) => {
    if (!user) {
      toast.error('Please sign in to book appointments');
      return { error: new Error('Not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          ...input,
        });

      if (error) throw error;

      await fetchAppointments();
      toast.success('Appointment booked successfully');
      return { error: null };
    } catch (error) {
      toast.error('Failed to book appointment');
      return { error: error as Error };
    }
  };

  const updateAppointment = async (appointmentId: string, updates: Partial<AppointmentInput & { status: string }>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', appointmentId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchAppointments();
      toast.success('Appointment updated');
      return { error: null };
    } catch (error) {
      toast.error('Failed to update appointment');
      return { error: error as Error };
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    return updateAppointment(appointmentId, { status: 'cancelled' });
  };

  const deleteAppointment = async (appointmentId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchAppointments();
      toast.success('Appointment deleted');
      return { error: null };
    } catch (error) {
      toast.error('Failed to delete appointment');
      return { error: error as Error };
    }
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  return {
    appointments,
    upcomingAppointments,
    completedAppointments,
    loading,
    bookAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    refetch: fetchAppointments,
  };
}
