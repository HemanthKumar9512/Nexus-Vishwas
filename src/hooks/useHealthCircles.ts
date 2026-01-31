import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface HealthCircle {
  id: string;
  name: string;
  description: string | null;
  category: 'diabetes' | 'cardiac' | 'weight' | 'mental' | 'pregnancy' | 'wellness';
  member_count: number;
  created_at: string;
  isJoined?: boolean;
}

export function useHealthCircles() {
  const { user } = useAuth();
  const [circles, setCircles] = useState<HealthCircle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCircles();
  }, [user]);

  const fetchCircles = async () => {
    try {
      // Fetch all circles
      const { data: circlesData, error: circlesError } = await supabase
        .from('health_circles')
        .select('*')
        .order('member_count', { ascending: false });

      if (circlesError) throw circlesError;

      // If user is logged in, fetch their memberships
      let memberships: string[] = [];
      if (user) {
        const { data: membershipData, error: membershipError } = await supabase
          .from('circle_memberships')
          .select('circle_id')
          .eq('user_id', user.id);

        if (!membershipError && membershipData) {
          memberships = membershipData.map(m => m.circle_id);
        }
      }

      // Combine circles with membership status
      const circlesWithStatus = (circlesData || []).map(circle => ({
        ...circle,
        category: circle.category as HealthCircle['category'],
        isJoined: memberships.includes(circle.id),
      })) as HealthCircle[];

      setCircles(circlesWithStatus);
    } catch (error) {
      console.error('Error fetching circles:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinCircle = async (circleId: string) => {
    if (!user) {
      toast.error('Please sign in to join circles');
      return { error: new Error('Not authenticated') };
    }

    try {
      const { error } = await supabase
        .from('circle_memberships')
        .insert({
          user_id: user.id,
          circle_id: circleId,
        });

      if (error) throw error;

      await fetchCircles();
      toast.success('Joined circle successfully');
      return { error: null };
    } catch (error) {
      toast.error('Failed to join circle');
      return { error: error as Error };
    }
  };

  const leaveCircle = async (circleId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('circle_memberships')
        .delete()
        .eq('user_id', user.id)
        .eq('circle_id', circleId);

      if (error) throw error;

      await fetchCircles();
      toast.success('Left circle');
      return { error: null };
    } catch (error) {
      toast.error('Failed to leave circle');
      return { error: error as Error };
    }
  };

  const toggleMembership = async (circleId: string) => {
    const circle = circles.find(c => c.id === circleId);
    if (circle?.isJoined) {
      return leaveCircle(circleId);
    } else {
      return joinCircle(circleId);
    }
  };

  return {
    circles,
    loading,
    joinCircle,
    leaveCircle,
    toggleMembership,
    refetch: fetchCircles,
  };
}
