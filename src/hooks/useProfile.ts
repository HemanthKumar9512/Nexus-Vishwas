import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  age: number | null;
  gender: string | null;
  blood_group: string | null;
  preferred_modality: 'modern' | 'ayurvedic' | 'siddha' | 'integrated';
  health_score: number;
  subscription: string;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
      
      await fetchProfile();
      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error) {
      toast.error('Failed to update profile');
      return { error: error as Error };
    }
  };

  return { profile, loading, updateProfile, refetch: fetchProfile };
}
