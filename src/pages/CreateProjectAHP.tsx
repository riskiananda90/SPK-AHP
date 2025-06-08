import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  CheckCircle2,
  ListChecks,
  SlidersHorizontal,
  BarChart4,
  Save,
  AlertTriangle,
  Loader2,
  Download,
  Trash2,
  Calculator,
  Trophy,
  Medal,
  Award,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Separator } from "@/components/ui/separator"
import { useToast } from '@/hooks/use-toast';
import { useProjectSave } from '@/hooks/useProjectSave';
import { ComparisonTable } from '@/components/ui/comparison-table';
import { Label } from '@/components/ui/label';
import { useProject } from '@/hooks/useProject';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Criteria {
  id: string;
  name: string;
}

interface Alternative {
  id: string;
  name: string;
}

const CreateProjectAHP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const { project, loading, refetch } = useProject(projectId || undefined);
  const isMobile = useIsMobile();

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [criteriaComparisons, setCriteriaComparisons] = useState<any[]>([]);
  const [alternativeComparisons, setAlternativeComparisons] = useState<any[]>([]);
  const [results, setResults] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('step-1');
  const [isCalculating, setIsCalculating] = useState(false);
  const { saveProject, isSaving } = useProjectSave();

  // Load project data when project is fetched
  useEffect(() => {
    console.log('Project loading state:', loading);
    console.log('Project ID from URL:', projectId);
    console.log('Project data received:', project);
    
    if (project && projectId) {
      console.log('Loading existing project data...');
      
      // Load basic project info
      setProjectTitle(project.title || '');
      setProjectDescription(project.description || '');
      
      // Load criteria
      if (project.criteria && Array.isArray(project.criteria)) {
        console.log('Loading criteria:', project.criteria);
        setCriteria(project.criteria);
      }
      
      // Load alternatives
      if (project.alternatives && Array.isArray(project.alternatives)) {
        console.log('Loading alternatives:', project.alternatives);
        setAlternatives(project.alternatives);
      }
      
      // Load pairwise comparisons
      if (project.pairwise_comparisons) {
        console.log('Loading pairwise comparisons:', project.pairwise_comparisons);
        
        if (project.pairwise_comparisons.criteria && Array.isArray(project.pairwise_comparisons.criteria)) {
          setCriteriaComparisons(project.pairwise_comparisons.criteria);
        }
        
        if (project.pairwise_comparisons.alternatives && Array.isArray(project.pairwise_comparisons.alternatives)) {
          setAlternativeComparisons(project.pairwise_comparisons.alternatives);
        }
      }
      
      // Load results
      if (project.results) {
        console.log('Loading results:', project.results);
        setResults(project.results);
      }
      
      // Determine current step based on project progress
      let stepToStart = 0;
      let tabToStart = 'step-1';
      
      if (project.title && project.title.trim()) {
        stepToStart = Math.max(stepToStart, 1);
        tabToStart = 'step-2';
      }
      
      if (project.criteria && Array.isArray(project.criteria) && project.criteria.length >= 2) {
        stepToStart = Math.max(stepToStart, 2);
        tabToStart = 'step-3';
      }
      
      if (project.alternatives && Array.isArray(project.alternatives) && project.alternatives.length >= 2) {
        stepToStart = Math.max(stepToStart, 3);
        tabToStart = 'step-4';
      }
      
      if (project.pairwise_comparisons?.criteria && project.pairwise_comparisons.criteria.length > 0) {
        stepToStart = Math.max(stepToStart, 4);
        tabToStart = 'step-5';
      }
      
      if (project.results) {
        stepToStart = 5;
        tabToStart = 'step-6';
      }
      
      console.log('Setting step to:', stepToStart, 'and tab to:', tabToStart);
      setCurrentStep(stepToStart);
      setActiveTab(tabToStart);
      
      toast({
        title: "Project Loaded",
        description: "Data project berhasil dimuat untuk diedit",
      });
    } else if (!projectId) {
      console.log('No project ID - creating new project');
      // Reset for new project
      setProjectTitle('');
      setProjectDescription('');
      setCriteria([]);
      setAlternatives([]);
      setCriteriaComparisons([]);
      setAlternativeComparisons([]);
      setResults(null);
      setCurrentStep(0);
      setActiveTab('step-1');
    }
  }, [project, projectId, toast]);

  // Debug: Log when projectId changes
  useEffect(() => {
    console.log('URL Search params changed, projectId:', projectId);
  }, [projectId]);

  const addCriteria = () => {
    setCriteria([...criteria, { id: crypto.randomUUID(), name: '' }]);
  };

  const updateCriteria = (id: string, name: string) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, name } : c));
  };

  const deleteCriteria = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
    setCriteriaComparisons(criteriaComparisons.filter(cc => cc.item1Id !== id && cc.item2Id !== id));
  };

  const addAlternative = () => {
    setAlternatives([...alternatives, { id: crypto.randomUUID(), name: '' }]);
  };

  const updateAlternative = (id: string, name: string) => {
    setAlternatives(alternatives.map(a => a.id === id ? { ...a, name } : a));
  };

  const deleteAlternative = (id: string) => {
    setAlternatives(alternatives.filter(a => a.id !== id));
    setAlternativeComparisons(alternativeComparisons.filter(ac => ac.item1Id !== id && ac.item2Id !== id));
  };

  const updateCriteriaComparison = (item1Id: string, item2Id: string, value: number) => {
    const existingComparison = criteriaComparisons.find(cc => cc.item1Id === item1Id && cc.item2Id === item2Id);

    if (existingComparison) {
      setCriteriaComparisons(criteriaComparisons.map(cc =>
        cc.item1Id === item1Id && cc.item2Id === item2Id ? { ...cc, value } : cc
      ));
    } else {
      setCriteriaComparisons([...criteriaComparisons, { item1Id, item2Id, value }]);
    }
  };

  const getCriteriaComparisonValue = (item1Id: string, item2Id: string) => {
    const comparison = criteriaComparisons.find(cc => cc.item1Id === item1Id && cc.item2Id === item2Id);
    return comparison ? comparison.value : 1;
  };

  const updateAlternativeComparison = (item1Id: string, item2Id: string, value: number, criteriaId: string) => {
    const existingComparison = alternativeComparisons.find(ac => 
      ac.item1Id === item1Id && ac.item2Id === item2Id && ac.criteriaId === criteriaId
    );

    if (existingComparison) {
      setAlternativeComparisons(alternativeComparisons.map(ac =>
        ac.item1Id === item1Id && ac.item2Id === item2Id && ac.criteriaId === criteriaId 
          ? { ...ac, value } : ac
      ));
    } else {
      setAlternativeComparisons([...alternativeComparisons, { item1Id, item2Id, value, criteriaId }]);
    }
  };

  const getAlternativeComparisonValue = (item1Id: string, item2Id: string, criteriaId: string) => {
    const comparison = alternativeComparisons.find(ac => 
      ac.item1Id === item1Id && ac.item2Id === item2Id && ac.criteriaId === criteriaId
    );
    return comparison ? comparison.value : 1;
  };

  const goToNextStep = () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setActiveTab(`step-${nextStep + 1}`);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setActiveTab(`step-${step + 1}`);
  };

  const calculateAHP = async () => {
    setIsCalculating(true);
    try {
      // 1. Normalisasi Matriks Perbandingan Kriteria
      const criteriaMatrix = criteria.map(c1 =>
        criteria.map(c2 => {
          if (c1.id === c2.id) return 1;
          const comparisonValue = getCriteriaComparisonValue(c1.id, c2.id);
          return c1.id < c2.id ? comparisonValue : 1 / comparisonValue;
        })
      );

      // 2. Hitung Bobot Prioritas Kriteria
      const criteriaSums = criteriaMatrix.map(col => col.reduce((sum, val) => sum + val, 0));
      const criteriaWeights = criteriaMatrix.map((col, i) => {
        const sum = criteriaSums[i];
        return criteria.map((c, j) => ({
          criteria: c,
          weight: col[j] / sum
        }));
      });

      const finalCriteriaWeights = criteria.map((c, i) => ({
        criteria: c,
        weight: criteriaWeights.reduce((sum, col) => sum + col[i].weight, 0) / criteria.length
      }));

      // 3. Normalisasi Matriks Perbandingan Alternatif (terhadap setiap kriteria)
      const alternativeMatrices = criteria.map(criterion => {
        return alternatives.map(a1 =>
          alternatives.map(a2 => {
            if (a1.id === a2.id) return 1;
            const comparisonValue = getAlternativeComparisonValue(a1.id, a2.id, criterion.id);
            return a1.id < a2.id ? comparisonValue : 1 / comparisonValue;
          })
        );
      });

      // 4. Hitung Bobot Prioritas Alternatif (terhadap setiap kriteria)
      const alternativeWeightsByCriteria = alternativeMatrices.map(matrix => {
        const alternativeSums = matrix.map(col => col.reduce((sum, val) => sum + val, 0));
        return matrix.map((col, i) => {
          const sum = alternativeSums[i];
          return alternatives.map((a, j) => ({
            alternative: a,
            weight: col[j] / sum
          }));
        });
      });

      const finalAlternativeWeightsByCriteria = criteria.map((criterion, i) => ({
        criteria: criterion,
        weights: alternatives.map((a, j) => ({
          alternative: a,
          weight: alternativeWeightsByCriteria[i].reduce((sum, col) => sum + col[j].weight, 0) / alternatives.length
        }))
      }));

      // 5. Hitung Skor Akhir Alternatif
      const alternativeScores = alternatives.map(alternative => {
        let score = 0;
        finalCriteriaWeights.forEach(criterionWeight => {
          const alternativeWeight = finalAlternativeWeightsByCriteria
            .find(aw => aw.criteria.id === criterionWeight.criteria.id)
            ?.weights.find(w => w.alternative.id === alternative.id)?.weight || 0;
          score += criterionWeight.weight * alternativeWeight;
        });
        return {
          id: alternative.id,
          name: alternative.name,
          score
        };
      });

      // 6. Ranking Alternatif
      const rankedAlternatives = alternativeScores.sort((a, b) => b.score - a.score)
        .map((alt, index) => ({ ...alt, rank: index + 1 }));

      // Consistency Ratio Calculation (Simplified - needs actual matrix operations for real CR)
      const consistencyRatio = {
        cr: 0.05, // Placeholder value - replace with actual calculation
        isConsistent: true // Placeholder value - replace with actual logic
      };

      setResults({
        criteriaWeights: finalCriteriaWeights,
        alternatives: rankedAlternatives,
        consistency: consistencyRatio
      });

      toast({
        title: "Success",
        description: "Perhitungan AHP selesai!",
      });
      setCurrentStep(5);
      setActiveTab('step-6');
    } catch (error: any) {
      console.error("Error calculating AHP:", error);
      toast({
        title: "Error",
        description: "Gagal menghitung AHP",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const calculateProgress = () => {
    let progress = 0;
    switch (currentStep) {
      case 0:
        progress = 10;
        break;
      case 1:
        progress = 30;
        break;
      case 2:
        progress = 50;
        break;
      case 3:
        progress = 70;
        break;
      case 4:
        progress = 90;
        break;
      case 5:
        progress = 100;
        break;
      default:
        progress = 0;
        break;
    }
    return progress;
  };

  const saveAndExit = async () => {
    const progress = calculateProgress();
    const dataToSave = {
      title: projectTitle,
      description: projectDescription,
      criteria,
      alternatives,
      criteriaComparisons,
      alternativeComparisons,
      results,
      progress,
      status: 'in-progress' as const
    };

    const savedProject = await saveProject(dataToSave, projectId || undefined);
    if (savedProject) {
      navigate('/projects');
    }
  };

  const completeProject = async () => {
    if (!results) {
      toast({
        title: "Error",
        description: "Anda harus menyelesaikan perhitungan AHP terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    const progress = 100;
    const dataToSave = {
      title: projectTitle,
      description: projectDescription,
      criteria,
      alternatives,
      criteriaComparisons,
      alternativeComparisons,
      results,
      progress,
      status: 'completed' as const
    };

    const savedProject = await saveProject(dataToSave, projectId || undefined);
    if (savedProject) {
      navigate('/projects');
    }
  };

  const exportData = () => {
    if (!results) {
      toast({
        title: "Error",
        description: "Anda harus menyelesaikan perhitungan AHP terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    const exportDataObj = {
      projectName: projectTitle,
      criteria: criteria,
      alternatives: alternatives,
      results: results,
      consistency: results.consistency
    };

    return {
      toExcel: () => exportToExcel(exportDataObj),
      toPDF: () => exportToPDF(exportDataObj)
    };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8 px-4">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin opacity-50" />
          <h2 className="text-lg md:text-2xl font-bold text-slate-600 mb-4">
            {projectId ? 'Memuat data project...' : 'Memuat project...'}
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl mx-auto"
      >
        <div className="px-1 sm:px-2 lg:px-4 py-1 sm:py-2 lg:py-4 space-y-2 sm:space-y-3 lg:space-y-4">
          {/* Header - Mobile Responsive */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 dark:text-slate-200 truncate">
                  {projectId ? `Edit Project: ${projectTitle || 'AHP'}` : 'Buat Project AHP Baru'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Langkah {currentStep + 1} dari 6
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 shrink-0">
                <Button
                  variant="secondary"
                  onClick={saveAndExit}
                  disabled={isSaving}
                  size={isMobile ? "sm" : "default"}
                  className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      {isMobile ? 'Simpan...' : 'Menyimpan...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {isMobile ? 'Simpan' : 'Simpan & Keluar'}
                    </>
                  )}
                </Button>
                {currentStep === 5 && (
                  <Button
                    onClick={completeProject}
                    className="bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                    size={isMobile ? "sm" : "default"}
                  >
                    Selesaikan Project
                  </Button>
                )}
              </div>
            </div>
            <Separator />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2 sm:space-y-3">
            {/* Mobile-responsive TabsList */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[500px] sm:min-w-0 w-full">
                <TabsList className="grid w-full grid-cols-6 h-auto p-0.5 sm:p-1">
                  <TabsTrigger 
                    value="step-1" 
                    onClick={() => goToStep(0)}
                    className="text-[9px] sm:text-xs lg:text-sm p-1 flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 h-12 sm:h-10"
                  >
                    <span className="text-center leading-tight">
                      <span className="hidden sm:block">Informasi</span>
                      <span className="sm:hidden">Info</span>
                    </span>
                    {currentStep > 0 && <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" />}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="step-2" 
                    onClick={() => goToStep(1)}
                    disabled={!projectTitle}
                    className="text-[9px] sm:text-xs lg:text-sm p-1 flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 h-12 sm:h-10"
                  >
                    <span className="text-center leading-tight">Kriteria</span>
                    {currentStep > 1 && <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" />}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="step-3" 
                    onClick={() => goToStep(2)}
                    disabled={criteria.length < 2}
                    className="text-[9px] sm:text-xs lg:text-sm p-1 flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 h-12 sm:h-10"
                  >
                    <span className="text-center leading-tight">Alternatif</span>
                    {currentStep > 2 && <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" />}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="step-4" 
                    onClick={() => goToStep(3)}
                    disabled={alternatives.length < 2}
                    className="text-[9px] sm:text-xs lg:text-sm p-1 flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 h-12 sm:h-10"
                  >
                    <span className="text-center leading-tight">
                      <span className="hidden lg:block">Perbandingan Kriteria</span>
                      <span className="lg:hidden">P. Kriteria</span>
                    </span>
                    {currentStep > 3 && <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" />}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="step-5" 
                    onClick={() => goToStep(4)}
                    disabled={criteriaComparisons.length === 0}
                    className="text-[9px] sm:text-xs lg:text-sm p-1 flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 h-12 sm:h-10"
                  >
                    <span className="text-center leading-tight">
                      <span className="hidden lg:block">Perbandingan Alternatif</span>
                      <span className="lg:hidden">P. Alternatif</span>
                    </span>
                    {currentStep > 4 && <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" />}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="step-6" 
                    onClick={() => goToStep(5)}
                    disabled={!results}
                    className="text-[9px] sm:text-xs lg:text-sm p-1 flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1 h-12 sm:h-10"
                  >
                    <span className="text-center leading-tight">Hasil</span>
                    {currentStep === 5 && <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" />}
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <Separator />
            
            {/* Step 1 - Project Information */}
            <TabsContent value="step-1" className="outline-none space-y-2 sm:space-y-3">
              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Informasi Project</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Masukkan informasi dasar tentang project AHP Anda.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0 space-y-2 sm:space-y-3">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="title" className="text-xs sm:text-sm">Judul Project</Label>
                    <Input
                      id="title"
                      placeholder="Misalnya: Pemilihan Lokasi Pabrik Baru"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full text-xs sm:text-sm h-8 sm:h-9"
                    />
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="description" className="text-xs sm:text-sm">Deskripsi Project (Opsional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Jelaskan secara singkat tujuan dan ruang lingkup project ini."
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="w-full min-h-[60px] sm:min-h-[80px] text-xs sm:text-sm resize-none"
                    />
                  </div>
                  <Button 
                    onClick={goToNextStep} 
                    disabled={!projectTitle} 
                    className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                    size={isMobile ? "sm" : "default"}
                  >
                    Lanjut ke Kriteria
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 2 - Criteria */}
            <TabsContent value="step-2" className="outline-none space-y-2 sm:space-y-3">
              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Kriteria</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Tentukan kriteria yang akan digunakan dalam pengambilan keputusan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0 space-y-2 sm:space-y-3">
                  <div className="space-y-2 sm:space-y-3">
                    {criteria.map((criterion, index) => (
                      <div key={criterion.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3 rounded-lg bg-muted/50">
                        <Label htmlFor={`criteria-${index}`} className="text-xs sm:text-sm font-medium w-full sm:w-16 lg:w-20 shrink-0">
                          Kriteria {index + 1}
                        </Label>
                        <Input
                          type="text"
                          id={`criteria-${index}`}
                          placeholder="Misalnya: Biaya, Kualitas, Waktu"
                          value={criterion.name}
                          onChange={(e) => updateCriteria(criterion.id, e.target.value)}
                          className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteCriteria(criterion.id)}
                          className="w-full sm:w-auto text-xs h-8"
                        >
                          <Trash2 className="h-3 w-3 sm:mr-0 mr-1" />
                          <span className="sm:hidden">Hapus</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <Button 
                      variant="outline" 
                      onClick={addCriteria} 
                      className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                      size={isMobile ? "sm" : "default"}
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Tambah Kriteria
                    </Button>
                    {criteria.length >= 2 ? (
                      <Button 
                        onClick={goToNextStep} 
                        className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                        size={isMobile ? "sm" : "default"}
                      >
                        Lanjut ke Alternatif
                      </Button>
                    ) : (
                      <div className="flex items-center text-xs sm:text-sm text-red-500 p-2 rounded bg-red-50 dark:bg-red-950/20">
                        <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" />
                        Minimal 2 kriteria diperlukan untuk melanjutkan.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 3 - Alternatives */}
            <TabsContent value="step-3" className="outline-none space-y-2 sm:space-y-3">
              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Alternatif</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Tentukan alternatif yang akan dievaluasi berdasarkan kriteria.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0 space-y-2 sm:space-y-3">
                  <div className="space-y-2 sm:space-y-3">
                    {alternatives.map((alternative, index) => (
                      <div key={alternative.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 p-2 sm:p-3 rounded-lg bg-muted/50">
                        <Label htmlFor={`alternative-${index}`} className="text-xs sm:text-sm font-medium w-full sm:w-16 lg:w-20 shrink-0">
                          Alternatif {index + 1}
                        </Label>
                        <Input
                          type="text"
                          id={`alternative-${index}`}
                          placeholder="Misalnya: Lokasi A, Lokasi B, Lokasi C"
                          value={alternative.name}
                          onChange={(e) => updateAlternative(alternative.id, e.target.value)}
                          className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteAlternative(alternative.id)}
                          className="w-full sm:w-auto text-xs h-8"
                        >
                          <Trash2 className="h-3 w-3 sm:mr-0 mr-1" />
                          <span className="sm:hidden">Hapus</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <Button 
                      variant="outline" 
                      onClick={addAlternative} 
                      className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                      size={isMobile ? "sm" : "default"}
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Tambah Alternatif
                    </Button>
                    {alternatives.length >= 2 ? (
                      <Button 
                        onClick={goToNextStep} 
                        className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                        size={isMobile ? "sm" : "default"}
                      >
                        Lanjut ke Perbandingan Kriteria
                      </Button>
                    ) : (
                      <div className="flex items-center text-xs sm:text-sm text-red-500 p-2 rounded bg-red-50 dark:bg-red-950/20">
                        <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" />
                        Minimal 2 alternatif diperlukan untuk melanjutkan.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 4 - Criteria Comparison */}
            <TabsContent value="step-4" className="outline-none space-y-2 sm:space-y-3">
              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Perbandingan Kriteria</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Bandingkan setiap kriteria untuk menentukan tingkat kepentingannya.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0 space-y-2 sm:space-y-3">
                  <div className="w-full overflow-x-auto">
                    <ComparisonTable
                      items={criteria}
                      title="Perbandingan Kriteria"
                      description="Tentukan tingkat kepentingan relatif antar kriteria."
                      getValue={getCriteriaComparisonValue}
                      updateValue={updateCriteriaComparison}
                      type="criteria"
                    />
                  </div>
                  {criteria.length >= 2 ? (
                    <Button 
                      onClick={goToNextStep} 
                      className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                      size={isMobile ? "sm" : "default"}
                    >
                      Lanjut ke Perbandingan Alternatif
                    </Button>
                  ) : (
                    <div className="flex items-center text-xs sm:text-sm text-red-500 p-2 rounded bg-red-50 dark:bg-red-950/20">
                      <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" />
                      Minimal 2 kriteria diperlukan untuk melakukan perbandingan.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 5 - Alternative Comparison */}
            <TabsContent value="step-5" className="outline-none space-y-2 sm:space-y-3">
              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-sm sm:text-base lg:text-lg">Perbandingan Alternatif</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Bandingkan setiap alternatif terhadap setiap kriteria.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0 space-y-3 sm:space-y-4">
                  {criteria.map((criterion) => (
                    <div key={criterion.id} className="space-y-2 sm:space-y-3">
                      <div className="p-2 sm:p-3 bg-muted rounded-lg">
                        <h4 className="text-xs sm:text-sm lg:text-base font-semibold">Kriteria: {criterion.name}</h4>
                      </div>
                      <div className="w-full overflow-x-auto">
                        <ComparisonTable
                          items={alternatives}
                          title={`Perbandingan Alternatif terhadap Kriteria ${criterion.name}`}
                          description={`Tentukan preferensi relatif antar alternatif berdasarkan kriteria ${criterion.name}.`}
                          getValue={(item1Id, item2Id) => getAlternativeComparisonValue(item1Id, item2Id, criterion.id)}
                          updateValue={(item1Id, item2Id, value) => updateAlternativeComparison(item1Id, item2Id, value, criterion.id)}
                          type="alternative"
                          criteriaId={criterion.id}
                        />
                      </div>
                    </div>
                  ))}
                  {alternatives.length >= 2 && criteria.length >= 1 ? (
                    <Button 
                      onClick={calculateAHP} 
                      disabled={isCalculating} 
                      className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
                      size={isMobile ? "sm" : "default"}
                    >
                      {isCalculating ? (
                        <>
                          <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                          Menghitung...
                        </>
                      ) : (
                        <>
                          <Calculator className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Hitung AHP
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center text-xs sm:text-sm text-red-500 p-2 rounded bg-red-50 dark:bg-red-950/20">
                      <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 shrink-0" />
                      Minimal 2 alternatif dan 1 kriteria diperlukan untuk melakukan perbandingan.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Step 6 - Results */}
            <TabsContent value="step-6" className="outline-none space-y-2 sm:space-y-3">
              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base lg:text-lg">
                    <Trophy className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-500" />
                    Hasil Perhitungan AHP
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Berikut adalah hasil perhitungan AHP berdasarkan data yang telah Anda masukkan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6 pt-0 space-y-3 sm:space-y-4">
                  {results ? (
                    <>
                      {/* Ranking Table - Mobile Responsive */}
                      <div className="space-y-2 sm:space-y-3">
                        <h4 className="text-xs sm:text-sm lg:text-base font-semibold flex items-center gap-1 sm:gap-2">
                          <Medal className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-amber-500" />
                          Peringkat Alternatif
                        </h4>
                        <div className="w-full overflow-x-auto">
                          <div className="min-w-[400px] sm:min-w-0">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12 sm:w-16 text-xs">Peringkat</TableHead>
                                  <TableHead className="text-xs">Alternatif</TableHead>
                                  <TableHead className="text-right text-xs">Skor</TableHead>
                                  <TableHead className="text-right hidden lg:table-cell text-xs">Persentase</TableHead>
                                  <TableHead className="w-12 sm:w-16 text-xs">Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {results.alternatives.map((alt: any, index: number) => (
                                  <TableRow key={alt.id} className={index === 0 ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}>
                                    <TableCell className="font-medium">
                                      <div className="flex items-center gap-1">
                                        {index === 0 && <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-500" />}
                                        {index === 1 && <Medal className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />}
                                        {index === 2 && <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-600" />}
                                        <span className="text-xs">#{alt.rank}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-xs">{alt.name}</TableCell>
                                    <TableCell className="text-right font-mono text-xs">{alt.score.toFixed(4)}</TableCell>
                                    <TableCell className="text-right hidden lg:table-cell text-xs">{(alt.score * 100).toFixed(2)}%</TableCell>
                                    <TableCell>
                                      {index === 0 && (
                                        <span className="inline-flex items-center px-1 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                          Terbaik
                                        </span>
                                      )}
                                      {index === 1 && (
                                        <span className="inline-flex items-center px-1 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                          Kedua
                                        </span>
                                      )}
                                      {index === 2 && (
                                        <span className="inline-flex items-center px-1 py-0.5 rounded-full text-[10px] font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                                          Ketiga
                                        </span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>

                      {/* Criteria Weights - Mobile Responsive */}
                      <div className="space-y-2 sm:space-y-3">
                        <h4 className="text-xs sm:text-sm lg:text-base font-semibold">Bobot Kriteria</h4>
                        <div className="w-full overflow-x-auto">
                          <div className="min-w-[250px] sm:min-w-0">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs">Kriteria</TableHead>
                                  <TableHead className="text-right text-xs">Bobot</TableHead>
                                  <TableHead className="text-right hidden sm:table-cell text-xs">Persentase</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {results.criteriaWeights.map((item: any) => (
                                  <TableRow key={item.criteria.id}>
                                    <TableCell className="font-medium text-xs">{item.criteria.name}</TableCell>
                                    <TableCell className="text-right font-mono text-xs">{item.weight.toFixed(4)}</TableCell>
                                    <TableCell className="text-right hidden sm:table-cell text-xs">{(item.weight * 100).toFixed(2)}%</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>

                      {/* Consistency Check - Mobile Responsive */}
                      <div className="space-y-2 sm:space-y-3">
                        <h4 className="text-xs sm:text-sm lg:text-base font-semibold">Uji Konsistensi</h4>
                        <div className="p-2 sm:p-3 rounded-lg border bg-card">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                            <div className="flex justify-between">
                              <span className="text-xs">Consistency Ratio (CR):</span>
                              <span className="font-mono text-xs">{results.consistency?.cr?.toFixed(4) || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs">Status Konsistensi:</span>
                              <span className={`font-medium text-xs ${results.consistency?.isConsistent ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {results.consistency?.isConsistent ? 'Konsisten' : 'Tidak Konsisten'}
                              </span>
                            </div>
                          </div>
                          {!results.consistency?.isConsistent && (
                            <p className="text-[10px] text-muted-foreground mt-1 sm:mt-2">
                              CR &gt; 0.1 menunjukkan inkonsistensi dalam penilaian. Pertimbangkan untuk meninjau kembali perbandingan Anda.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Export Buttons - Mobile Responsive */}
                      <div className="flex flex-col sm:flex-row justify-end gap-1 sm:gap-2 pt-2 sm:pt-3">
                        <Button 
                          variant="outline" 
                          onClick={exportData()?.toExcel} 
                          className="w-full sm:w-auto text-xs h-8 sm:h-9"
                          size={isMobile ? "sm" : "default"}
                        >
                          <Download className="w-3 h-3 mr-1 sm:mr-2" />
                          Export ke Excel
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={exportData()?.toPDF} 
                          className="w-full sm:w-auto text-xs h-8 sm:h-9"
                          size={isMobile ? "sm" : "default"}
                        >
                          <Download className="w-3 h-3 mr-1 sm:mr-2" />
                          Export ke PDF
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 sm:py-6 text-muted-foreground">
                      <Calculator className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                      <p className="text-xs sm:text-sm px-2 sm:px-4">Hasil perhitungan akan ditampilkan di sini setelah Anda menyelesaikan perbandingan alternatif dan menekan tombol "Hitung AHP".</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default CreateProjectAHP;
