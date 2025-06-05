
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  method: string;
  status: string;
  criteria: any;
  alternatives: any;
  pairwise_comparisons: any;
  results: any;
  progress: number | null;
  created_at: string;
  updated_at: string;
}

export const useProject = (projectId?: string) => {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId && user) {
      fetchProject();
    } else {
      setProject(null);
      setLoading(false);
    }
  }, [projectId, user]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setProject(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
  };
};
