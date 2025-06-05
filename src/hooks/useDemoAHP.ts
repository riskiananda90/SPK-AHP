
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DemoProject {
  id: string;
  ip_address: string;
  project_name: string;
  problem_statement: string | null;
  criteria: any[];
  alternatives: any[];
  criteria_matrix: any;
  alternative_matrices: any;
  results: any;
  created_at: string;
  expires_at: string;
}

interface DemoUsage {
  id: string;
  ip_address: string;
  user_agent: string | null;
  demo_count: number;
  last_used_at: string;
  created_at: string;
}

export const useDemoAHP = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Failed to get IP:', error);
      return 'unknown';
    }
  };

  const checkDemoUsage = async (): Promise<{ canUseDemo: boolean; usageCount: number }> => {
    try {
      setLoading(true);
      const ip = await getUserIP();
      const userAgent = navigator.userAgent;

      const { data, error } = await supabase
        .from('demo_usage')
        .select('*')
        .eq('ip_address', ip)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        // First time user
        const { error: insertError } = await supabase
          .from('demo_usage')
          .insert({
            ip_address: ip,
            user_agent: userAgent,
            demo_count: 1
          });

        if (insertError) throw insertError;
        return { canUseDemo: true, usageCount: 1 };
      } else {
        // Existing user
        return { canUseDemo: data.demo_count < 2, usageCount: data.demo_count };
      }
    } catch (error: any) {
      setError(error.message);
      return { canUseDemo: false, usageCount: 0 };
    } finally {
      setLoading(false);
    }
  };

  const incrementDemoUsage = async () => {
    try {
      const ip = await getUserIP();
      
      const { error } = await supabase
        .from('demo_usage')
        .update({ 
          demo_count: 2,
          last_used_at: new Date().toISOString()
        })
        .eq('ip_address', ip);

      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
    }
  };

  const createDemoProject = async (projectData: {
    project_name: string;
    problem_statement?: string;
    criteria?: any[];
    alternatives?: any[];
  }): Promise<DemoProject | null> => {
    try {
      setLoading(true);
      const ip = await getUserIP();

      const { data, error } = await supabase
        .from('demo_projects')
        .insert({
          ip_address: ip,
          project_name: projectData.project_name,
          problem_statement: projectData.problem_statement || null,
          criteria: projectData.criteria || [],
          alternatives: projectData.alternatives || []
        })
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion to ensure compatibility
      return {
        ...data,
        criteria: Array.isArray(data.criteria) ? data.criteria : [],
        alternatives: Array.isArray(data.alternatives) ? data.alternatives : []
      } as DemoProject;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDemoProject = async (projectId: string, updates: Partial<DemoProject>): Promise<DemoProject | null> => {
    try {
      setLoading(true);
      const ip = await getUserIP();

      const { data, error } = await supabase
        .from('demo_projects')
        .update(updates)
        .eq('id', projectId)
        .eq('ip_address', ip)
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion to ensure compatibility
      return {
        ...data,
        criteria: Array.isArray(data.criteria) ? data.criteria : [],
        alternatives: Array.isArray(data.alternatives) ? data.alternatives : []
      } as DemoProject;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getDemoProject = async (projectId: string): Promise<DemoProject | null> => {
    try {
      setLoading(true);
      const ip = await getUserIP();

      const { data, error } = await supabase
        .from('demo_projects')
        .select('*')
        .eq('id', projectId)
        .eq('ip_address', ip)
        .single();

      if (error) throw error;
      
      // Type assertion to ensure compatibility
      return {
        ...data,
        criteria: Array.isArray(data.criteria) ? data.criteria : [],
        alternatives: Array.isArray(data.alternatives) ? data.alternatives : []
      } as DemoProject;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    checkDemoUsage,
    incrementDemoUsage,
    createDemoProject,
    updateDemoProject,
    getDemoProject
  };
};
