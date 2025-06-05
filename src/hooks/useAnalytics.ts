
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsData {
  overview: {
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
    activeUsers: number;
  };
  methodUsage: Array<{
    method: string;
    count: number;
    percentage: number;
  }>;
  recentActivities: Array<{
    id: string;
    action: string;
    user: string;
    time: string;
    project_title?: string;
  }>;
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
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
      
      // Fetch user analytics
      const { data: userAnalytics, error: userAnalyticsError } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (userAnalyticsError && userAnalyticsError.code !== 'PGRST116') {
        throw userAnalyticsError;
      }

      // Fetch projects for method usage analysis
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('method, status, created_at, title, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (projectsError) {
        throw projectsError;
      }

      // Calculate method usage
      const methodCounts = projects?.reduce((acc, project) => {
        acc[project.method] = (acc[project.method] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const totalProjects = projects?.length || 0;
      const methodUsage = Object.entries(methodCounts).map(([method, count]) => ({
        method,
        count,
        percentage: totalProjects > 0 ? Math.round((count / totalProjects) * 100) : 0
      }));

      // Generate recent activities from projects
      const recentActivities = projects?.slice(0, 5).map((project, index) => {
        const timeDiff = Math.floor((new Date().getTime() - new Date(project.updated_at).getTime()) / (1000 * 60 * 60));
        let timeText = '';
        
        if (timeDiff < 1) {
          timeText = 'Baru saja';
        } else if (timeDiff < 24) {
          timeText = `${timeDiff} jam lalu`;
        } else {
          const daysDiff = Math.floor(timeDiff / 24);
          timeText = `${daysDiff} hari lalu`;
        }

        let action = '';
        if (project.status === 'completed') {
          action = `Project "${project.title}" selesai`;
        } else if (project.status === 'in-progress') {
          action = `Project "${project.title}" sedang dikerjakan`;
        } else {
          action = `Project "${project.title}" dibuat`;
        }

        return {
          id: `activity-${index}`,
          action,
          user: user.user_metadata?.full_name || user.email || 'User',
          time: timeText,
          project_title: project.title
        };
      }) || [];

      // Count active users (for now, just show 1 if user exists)
      const activeUsers = 1;

      const analyticsData: AnalyticsData = {
        overview: {
          totalProjects: userAnalytics?.total_projects || totalProjects,
          completedProjects: userAnalytics?.completed_projects || projects?.filter(p => p.status === 'completed').length || 0,
          inProgressProjects: userAnalytics?.in_progress_projects || projects?.filter(p => p.status === 'in-progress').length || 0,
          activeUsers
        },
        methodUsage,
        recentActivities
      };

      setAnalytics(analyticsData);
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
