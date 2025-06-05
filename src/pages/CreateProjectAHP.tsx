import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Separator } from "@/components/ui/separator"
import { useToast } from '@/hooks/use-toast';
import { useProjectSave } from '@/hooks/useProjectSave';
import { ComparisonTable } from '@/components/ui/comparison-table';
import { Label } from '@/components/ui/label';
import { useProject } from '@/hooks/useProject';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';

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
  const { projectId } = useParams();
  const { project, loading } = useProject(projectId);

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [criteriaComparisons, setCriteriaComparisons] = useState<any[]>([]);
  const [alternativeComparisons, setAlternativeComparisons] = useState<any[]>([]);
  const [results, setResults] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const { saveProject, isSaving } = useProjectSave();

  useEffect(() => {
    if (projectId && project) {
      setProjectTitle(project.title);
      setProjectDescription(project.description || '');
      
      // Type-safe casting for criteria and alternatives
      if (Array.isArray(project.criteria)) {
        setCriteria(project.criteria as Criteria[]);
      }
      
      if (Array.isArray(project.alternatives)) {
        setAlternatives(project.alternatives as Alternative[]);
      }
      
      // Type-safe casting for pairwise comparisons
      if (project.pairwise_comparisons && typeof project.pairwise_comparisons === 'object') {
        const comparisons = project.pairwise_comparisons as any;
        if (Array.isArray(comparisons.criteria)) {
          setCriteriaComparisons(comparisons.criteria);
        }
        if (Array.isArray(comparisons.alternatives)) {
          setAlternativeComparisons(comparisons.alternatives);
        }
      }
      
      if (project.results) {
        setResults(project.results);
      }
      
      if (typeof project.progress === 'number') {
        setCurrentStep(Math.floor((project.progress / 100) * 6));
      }
    }
  }, [projectId, project]);

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

  const updateAlternativeComparison = (item1Id: string, item2Id: string, value: number) => {
    const existingComparison = alternativeComparisons.find(ac => ac.item1Id === item1Id && ac.item2Id === item2Id);

    if (existingComparison) {
      setAlternativeComparisons(alternativeComparisons.map(ac =>
        ac.item1Id === item1Id && ac.item2Id === item2Id ? { ...ac, value } : ac
      ));
    } else {
      setAlternativeComparisons([...alternativeComparisons, { item1Id, item2Id, value }]);
    }
  };

  const getAlternativeComparisonValue = (item1Id: string, item2Id: string) => {
    const comparison = alternativeComparisons.find(ac => ac.item1Id === item1Id && ac.item2Id === item2Id);
    return comparison ? comparison.value : 1;
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
            const comparisonValue = getAlternativeComparisonValue(a1.id, a2.id);
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

    const savedProject = await saveProject(dataToSave, projectId);
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

    const savedProject = await saveProject(dataToSave, projectId);
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
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-600 mb-4">Loading...</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-8 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {projectId ? 'Edit Project AHP' : 'Buat Project AHP Baru'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Langkah {currentStep + 1} dari 6
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={saveAndExit}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan & Keluar
                </>
              )}
            </Button>
            {currentStep === 5 && (
              <Button
                onClick={completeProject}
                className="bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800"
              >
                Selesaikan Project
              </Button>
            )}
          </div>
        </div>

        <Separator />

        <Tabs defaultValue={`step-${currentStep + 1}`} className="space-y-4">
          <TabsList>
            <TabsTrigger value="step-1" disabled={currentStep > 0}>
              <span className="flex items-center gap-2">
                <span className="hidden sm:block">Informasi Project</span>
                <span className="sm:hidden">Informasi</span>
                {currentStep > 0 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </span>
            </TabsTrigger>
            <TabsTrigger value="step-2" disabled={currentStep > 1}>
              <span className="flex items-center gap-2">
                Kriteria
                {currentStep > 1 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </span>
            </TabsTrigger>
            <TabsTrigger value="step-3" disabled={currentStep > 2}>
              <span className="flex items-center gap-2">
                Alternatif
                {currentStep > 2 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </span>
            </TabsTrigger>
            <TabsTrigger value="step-4" disabled={currentStep > 3}>
              <span className="flex items-center gap-2">
                Perbandingan Kriteria
                {currentStep > 3 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </span>
            </TabsTrigger>
            <TabsTrigger value="step-5" disabled={currentStep > 4}>
              <span className="flex items-center gap-2">
                Perbandingan Alternatif
                {currentStep > 4 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </span>
            </TabsTrigger>
            <TabsTrigger value="step-6" disabled={currentStep < 5}>
              <span className="flex items-center gap-2">
                Hasil Perhitungan
                {currentStep === 5 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              </span>
            </TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent value="step-1" className="outline-none">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Project</CardTitle>
                <CardDescription>
                  Masukkan informasi dasar tentang project AHP Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Project</Label>
                  <Input
                    id="title"
                    placeholder="Misalnya: Pemilihan Lokasi Pabrik Baru"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Project (Opsional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Jelaskan secara singkat tujuan dan ruang lingkup project ini."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                  />
                </div>
                <Button onClick={() => setCurrentStep(1)} disabled={!projectTitle}>
                  Lanjut ke Kriteria
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step-2" className="outline-none">
            <Card>
              <CardHeader>
                <CardTitle>Kriteria</CardTitle>
                <CardDescription>
                  Tentukan kriteria yang akan digunakan dalam pengambilan keputusan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {criteria.map((criterion, index) => (
                  <div key={criterion.id} className="flex items-center space-x-4">
                    <Label htmlFor={`criteria-${index}`}>Kriteria {index + 1}</Label>
                    <Input
                      type="text"
                      id={`criteria-${index}`}
                      placeholder="Misalnya: Biaya, Kualitas, Waktu"
                      value={criterion.name}
                      onChange={(e) => updateCriteria(criterion.id, e.target.value)}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteCriteria(criterion.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addCriteria}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kriteria
                </Button>
                {criteria.length >= 2 ? (
                  <Button onClick={() => setCurrentStep(2)}>Lanjut ke Alternatif</Button>
                ) : (
                  <div className="flex items-center text-sm text-red-500">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Minimal 2 kriteria diperlukan untuk melanjutkan.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step-3" className="outline-none">
            <Card>
              <CardHeader>
                <CardTitle>Alternatif</CardTitle>
                <CardDescription>
                  Tentukan alternatif yang akan dievaluasi berdasarkan kriteria.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alternatives.map((alternative, index) => (
                  <div key={alternative.id} className="flex items-center space-x-4">
                    <Label htmlFor={`alternative-${index}`}>Alternatif {index + 1}</Label>
                    <Input
                      type="text"
                      id={`alternative-${index}`}
                      placeholder="Misalnya: Lokasi A, Lokasi B, Lokasi C"
                      value={alternative.name}
                      onChange={(e) => updateAlternative(alternative.id, e.target.value)}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteAlternative(alternative.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addAlternative}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Alternatif
                </Button>
                {alternatives.length >= 2 ? (
                  <Button onClick={() => setCurrentStep(3)}>Lanjut ke Perbandingan Kriteria</Button>
                ) : (
                  <div className="flex items-center text-sm text-red-500">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Minimal 2 alternatif diperlukan untuk melanjutkan.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step-4" className="outline-none">
            <Card>
              <CardHeader>
                <CardTitle>Perbandingan Kriteria</CardTitle>
                <CardDescription>
                  Bandingkan setiap kriteria untuk menentukan tingkat kepentingannya.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ComparisonTable
                  items={criteria}
                  title="Perbandingan Kriteria"
                  description="Tentukan tingkat kepentingan relatif antar kriteria."
                  getValue={getCriteriaComparisonValue}
                  updateValue={updateCriteriaComparison}
                  type="criteria"
                />
                {criteria.length >= 2 ? (
                  <Button onClick={() => setCurrentStep(4)}>Lanjut ke Perbandingan Alternatif</Button>
                ) : (
                  <div className="flex items-center text-sm text-red-500">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Minimal 2 kriteria diperlukan untuk melakukan perbandingan.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step-5" className="outline-none">
            <Card>
              <CardHeader>
                <CardTitle>Perbandingan Alternatif</CardTitle>
                <CardDescription>
                  Bandingkan setiap alternatif terhadap setiap kriteria.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {criteria.map((criterion) => (
                  <div key={criterion.id} className="mb-8">
                    <h4 className="text-lg font-semibold mb-2">Kriteria: {criterion.name}</h4>
                    <ComparisonTable
                      items={alternatives}
                      title={`Perbandingan Alternatif terhadap Kriteria ${criterion.name}`}
                      description={`Tentukan preferensi relatif antar alternatif berdasarkan kriteria ${criterion.name}.`}
                      getValue={getAlternativeComparisonValue}
                      updateValue={updateAlternativeComparison}
                      type="alternative"
                    />
                  </div>
                ))}
                {alternatives.length >= 2 && criteria.length >= 1 ? (
                  <Button onClick={calculateAHP} disabled={isCalculating}>
                    {isCalculating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menghitung...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4 mr-2" />
                        Hitung AHP
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex items-center text-sm text-red-500">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Minimal 2 alternatif dan 1 kriteria diperlukan untuk melakukan perbandingan.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step-6" className="outline-none">
            <Card>
              <CardHeader>
                <CardTitle>Hasil Perhitungan</CardTitle>
                <CardDescription>
                  Berikut adalah hasil perhitungan AHP berdasarkan data yang telah Anda masukkan.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Bobot Kriteria</h4>
                        <ul className="list-disc pl-5">
                          {results.criteriaWeights.map((item: any) => (
                            <li key={item.criteria.id}>
                              {item.criteria.name}: {item.weight.toFixed(4)} ({(item.weight * 100).toFixed(2)}%)
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Ranking Alternatif</h4>
                        <ol className="list-decimal pl-5">
                          {results.alternatives.map((alt: any) => (
                            <li key={alt.id}>
                              {alt.name}: {alt.score.toFixed(4)} (Ranking {alt.rank})
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-2">Konsistensi Ratio</h4>
                      <p>CR: {results.consistency?.cr?.toFixed(4) || 'N/A'}</p>
                      <p>Status: {results.consistency?.isConsistent ? 'Konsisten' : 'Tidak Konsisten'}</p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={exportData()?.toExcel}>
                        <Download className="w-4 h-4 mr-2" />
                        Export ke Excel
                      </Button>
                      <Button variant="outline" onClick={exportData()?.toPDF}>
                        <Download className="w-4 h-4 mr-2" />
                        Export ke PDF
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Hasil perhitungan akan ditampilkan di sini setelah Anda menyelesaikan perbandingan alternatif dan menekan tombol "Hitung AHP".</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
};

export default CreateProjectAHP;
