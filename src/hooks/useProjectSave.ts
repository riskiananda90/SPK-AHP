
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SaveProjectData {
  title: string;
  description?: string;
  criteria: any[];
  alternatives: any[];
  criteriaComparisons: any[];
  alternativeComparisons: any[];
  results?: any;
  progress: number;
  status: 'draft' | 'in-progress' | 'completed';
}

export const useProjectSave = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const saveProject = async (projectData: SaveProjectData, projectId?: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Anda harus login terlebih dahulu",
        variant: "destructive"
      });
      return null;
    }

    try {
      setIsSaving(true);
      
      const dataToSave = {
        title: projectData.title,
        description: projectData.description || null,
        method: 'AHP',
        criteria: projectData.criteria,
        alternatives: projectData.alternatives,
        pairwise_comparisons: {
          criteria: projectData.criteriaComparisons,
          alternatives: projectData.alternativeComparisons
        },
        results: projectData.results || null,
        progress: projectData.progress,
        status: projectData.status,
        updated_at: new Date().toISOString()
      };

      let result;
      
      if (projectId) {
        // Update existing project
        const { data, error } = await supabase
          .from('projects')
          .update(dataToSave)
          .eq('id', projectId)
          .eq('user_id', user.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert({
            ...dataToSave,
            user_id: user.id
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      toast({
        title: "Berhasil",
        description: `Project ${projectId ? 'diperbarui' : 'disimpan'} dengan sukses`,
      });

      return result;
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan project",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveProject,
    isSaving
  };
};
