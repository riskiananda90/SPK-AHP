
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserAnalytics {
  id: string;
  user_id: string;
  total_projects: number;
  completed_projects: number;
  in_progress_projects: number;
  last_active: string;
  created_at: string;
  updated_at: string;
}

export const useUserAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No analytics record exists, create one
          const { data: newData, error: insertError } = await supabase
            .from('user_analytics')
            .insert({
              user_id: user.id,
              total_projects: 0,
              completed_projects: 0,
              in_progress_projects: 0
            })
            .select()
            .single();

          if (insertError) throw insertError;
          setAnalytics(newData);
        } else {
          throw error;
        }
      } else {
        setAnalytics(data);
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = () => {
    fetchAnalytics();
  };

  return {
    analytics,
    loading,
    error,
    refreshAnalytics
  };
};
