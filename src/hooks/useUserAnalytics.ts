
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserAnalytics {
  id: string;
  user_id: string;
  total_projects: number;
  completed_projects: number;
  in_progress_projects: number;
  favorite_method: string | null;
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
    } else {
      setAnalytics(null);
      setLoading(false);
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setAnalytics(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics,
  };
};
