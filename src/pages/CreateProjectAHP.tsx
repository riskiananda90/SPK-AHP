import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Trash2, Calculator, Save, Download, ArrowRight, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';

interface Criteria {
  id: string;
  name: string;
}

interface Alternative {
  id: string;
  name: string;
}

interface PairwiseComparison {
  criteria1: string;
  criteria2: string;
  value: number;
}

interface AlternativeComparison {
  criteriaId: string;
  alternative1: string;
  alternative2: string;
  value: number;
}

const CreateProjectAHP = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [criteriaComparisons, setCriteriaComparisons] = useState<PairwiseComparison[]>([]);
  const [alternativeComparisons, setAlternativeComparisons] = useState<AlternativeComparison[]>([]);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('project');
  const [newCriteriaName, setNewCriteriaName] = useState('');
  const [newAlternativeName, setNewAlternativeName] = useState('');

  const satyScale = [
    { value: 1, label: "Sama penting", description: "Kedua elemen sama pentingnya" },
    { value: 3, label: "Sedikit lebih penting", description: "Satu elemen sedikit lebih penting dari yang lain" },
    { value: 5, label: "Lebih penting", description: "Satu elemen jelas lebih penting dari yang lain" },
    { value: 7, label: "Sangat penting", description: "Satu elemen sangat jelas lebih penting" },
    { value: 9, label: "Mutlak lebih penting", description: "Satu elemen mutlak lebih penting dari yang lain" }
  ];

  const addCriteria = () => {
    if (!newCriteriaName.trim()) return;
    
    const newCriteria = {
      id: Date.now().toString(),
      name: newCriteriaName.trim()
    };
    setCriteria([...criteria, newCriteria]);
    setNewCriteriaName('');
  };

  const removeCriteria = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
    setCriteriaComparisons(criteriaComparisons.filter(comp => 
      comp.criteria1 !== id && comp.criteria2 !== id
    ));
    setAlternativeComparisons(alternativeComparisons.filter(comp => comp.criteriaId !== id));
  };

  const addAlternative = () => {
    if (!newAlternativeName.trim()) return;
    
    const newAlternative = {
      id: Date.now().toString(),
      name: newAlternativeName.trim()
    };
    setAlternatives([...alternatives, newAlternative]);
    setNewAlternativeName('');
  };

  const removeAlternative = (id: string) => {
    setAlternatives(alternatives.filter(a => a.id !== id));
    setAlternativeComparisons(alternativeComparisons.filter(comp => 
      comp.alternative1 !== id && comp.alternative2 !== id
    ));
  };

  const updateCriteriaComparison = (criteria1: string, criteria2: string, value: number) => {
    const existingIndex = criteriaComparisons.findIndex(
      comp => (comp.criteria1 === criteria1 && comp.criteria2 === criteria2) ||
              (comp.criteria1 === criteria2 && comp.criteria2 === criteria1)
    );

    if (existingIndex >= 0) {
      const updated = [...criteriaComparisons];
      updated[existingIndex] = { criteria1, criteria2, value };
      setCriteriaComparisons(updated);
    } else {
      setCriteriaComparisons([...criteriaComparisons, { criteria1, criteria2, value }]);
    }
  };

  const updateAlternativeComparison = (criteriaId: string, alternative1: string, alternative2: string, value: number) => {
    const existingIndex = alternativeComparisons.findIndex(
      comp => comp.criteriaId === criteriaId &&
              ((comp.alternative1 === alternative1 && comp.alternative2 === alternative2) ||
               (comp.alternative1 === alternative2 && comp.alternative2 === alternative1))
    );

    if (existingIndex >= 0) {
      const updated = [...alternativeComparisons];
      updated[existingIndex] = { criteriaId, alternative1, alternative2, value };
      setAlternativeComparisons(updated);
    } else {
      setAlternativeComparisons([...alternativeComparisons, { criteriaId, alternative1, alternative2, value }]);
    }
  };

  const getComparisonValue = (criteria1: string, criteria2: string) => {
    const comparison = criteriaComparisons.find(
      comp => (comp.criteria1 === criteria1 && comp.criteria2 === criteria2) ||
              (comp.criteria1 === criteria2 && comp.criteria2 === criteria1)
    );
    
    if (!comparison) return 1;
    
    if (comparison.criteria1 === criteria1) {
      return comparison.value;
    } else {
      return 1 / comparison.value;
    }
  };

  const getAlternativeComparisonValue = (criteriaId: string, alternative1: string, alternative2: string) => {
    const comparison = alternativeComparisons.find(
      comp => comp.criteriaId === criteriaId &&
              ((comp.alternative1 === alternative1 && comp.alternative2 === alternative2) ||
               (comp.alternative1 === alternative2 && comp.alternative2 === alternative1))
    );
    
    if (!comparison) return 1;
    
    if (comparison.alternative1 === alternative1) {
      return comparison.value;
    } else {
      return 1 / comparison.value;
    }
  };

  const calculateAHP = () => {
    if (criteria.length < 2 || alternatives.length < 2) return;

    // Calculate criteria weights
    const n = criteria.length;
    const matrix = Array(n).fill(0).map(() => Array(n).fill(0));
    
    // Fill criteria comparison matrix
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          matrix[i][j] = getComparisonValue(criteria[i].id, criteria[j].id);
        }
      }
    }

    // Calculate column sums
    const columnSums = Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        columnSums[j] += matrix[i][j];
      }
    }

    // Normalize matrix
    const normalizedMatrix = Array(n).fill(0).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        normalizedMatrix[i][j] = matrix[i][j] / columnSums[j];
      }
    }

    // Calculate criteria weights (row averages)
    const criteriaWeights = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += normalizedMatrix[i][j];
      }
      criteriaWeights[i] = sum / n;
    }

    // Calculate consistency
    const weightedSum = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        weightedSum[i] += matrix[i][j] * criteriaWeights[j];
      }
    }

    const consistencyVector = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      consistencyVector[i] = weightedSum[i] / criteriaWeights[i];
    }

    const lambdaMax = consistencyVector.reduce((sum, val) => sum + val, 0) / n;
    const ci = (lambdaMax - n) / (n - 1);
    const ri = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49][n] || 1.49;
    const cr = ci / ri;

    // Calculate alternative scores for each criteria
    const alternativeScores = criteria.map(criterion => {
      const altMatrix = Array(alternatives.length).fill(0).map(() => Array(alternatives.length).fill(0));
      
      // Fill alternative comparison matrix for this criteria
      for (let i = 0; i < alternatives.length; i++) {
        for (let j = 0; j < alternatives.length; j++) {
          if (i === j) {
            altMatrix[i][j] = 1;
          } else {
            altMatrix[i][j] = getAlternativeComparisonValue(criterion.id, alternatives[i].id, alternatives[j].id);
          }
        }
      }

      // Calculate column sums for alternatives
      const altColumnSums = Array(alternatives.length).fill(0);
      for (let j = 0; j < alternatives.length; j++) {
        for (let i = 0; i < alternatives.length; i++) {
          altColumnSums[j] += altMatrix[i][j];
        }
      }

      // Normalize alternative matrix
      const altNormalizedMatrix = Array(alternatives.length).fill(0).map(() => Array(alternatives.length).fill(0));
      for (let i = 0; i < alternatives.length; i++) {
        for (let j = 0; j < alternatives.length; j++) {
          altNormalizedMatrix[i][j] = altMatrix[i][j] / altColumnSums[j];
        }
      }

      // Calculate alternative weights for this criteria
      const altWeights = Array(alternatives.length).fill(0);
      for (let i = 0; i < alternatives.length; i++) {
        let sum = 0;
        for (let j = 0; j < alternatives.length; j++) {
          sum += altNormalizedMatrix[i][j];
        }
        altWeights[i] = sum / alternatives.length;
      }

      return altWeights;
    });

    // Calculate final scores
    const finalScores = Array(alternatives.length).fill(0);
    for (let i = 0; i < alternatives.length; i++) {
      for (let j = 0; j < criteria.length; j++) {
        finalScores[i] += alternativeScores[j][i] * criteriaWeights[j];
      }
    }

    // Create results with ranking
    const rankedAlternatives = alternatives.map((alt, index) => ({
      ...alt,
      score: finalScores[index],
      rank: 0
    })).sort((a, b) => b.score - a.score);

    // Assign ranks
    rankedAlternatives.forEach((alt, index) => {
      alt.rank = index + 1;
    });

    setResults({
      criteriaWeights: criteriaWeights.map((weight, index) => ({
        criteria: criteria[index],
        weight
      })),
      alternatives: rankedAlternatives,
      consistency: {
        lambdaMax,
        ci,
        cr,
        isConsistent: cr < 0.1
      },
      matrix: normalizedMatrix
    });

    setActiveTab('results');
  };

  // Check if user can proceed to next tab
  const canProceedToStructure = projectName.trim() !== '';
  const canProceedToComparison = canProceedToStructure && criteria.length >= 2 && alternatives.length >= 2;
  const totalCriteriaComparisons = (criteria.length * (criteria.length - 1)) / 2;
  const totalAlternativeComparisons = criteria.length * (alternatives.length * (alternatives.length - 1)) / 2;
  const completedCriteriaComparisons = criteriaComparisons.length;
  const completedAlternativeComparisons = alternativeComparisons.length;
  const canCalculate = completedCriteriaComparisons === totalCriteriaComparisons && 
                     completedAlternativeComparisons === totalAlternativeComparisons;

  // Handle tab change with validation
  const handleTabChange = (newTab: string) => {
    switch (newTab) {
      case 'structure':
        if (!canProceedToStructure) {
          alert('Harap isi nama project terlebih dahulu!');
          return;
        }
        break;
      case 'comparison':
        if (!canProceedToComparison) {
          alert('Harap lengkapi struktur (minimal 2 kriteria dan 2 alternatif) terlebih dahulu!');
          return;
        }
        break;
      case 'results':
        if (!results) {
          alert('Harap selesaikan semua perbandingan dan hitung AHP terlebih dahulu!');
          return;
        }
        break;
    }
    setActiveTab(newTab);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/new-project')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Project AHP</h1>
              <p className="text-slate-600 dark:text-slate-400">Analytic Hierarchy Process</p>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
            <Save className="w-4 h-4 mr-2" />
            Simpan Project
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="project" className="relative">
              1. Setup
              {canProceedToStructure && (
                <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="structure" 
              disabled={!canProceedToStructure}
              className="relative disabled:opacity-50"
            >
              2. Struktur
              {canProceedToComparison && (
                <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="comparison" 
              disabled={!canProceedToComparison}
              className="relative disabled:opacity-50"
            >
              3. Perbandingan
              {canCalculate && (
                <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              disabled={!results}
              className="relative disabled:opacity-50"
            >
              4. Hasil
              {results && (
                <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
              )}
            </TabsTrigger>
          </TabsList>

          {/* Project Setup Tab */}
          <TabsContent value="project">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Definisi Masalah
                </CardTitle>
                <CardDescription>
                  Tentukan tujuan keputusan dan nama project AHP Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Nama Project</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Contoh: Pemilihan Smartphone Terbaik"
                  />
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Tips Mendefinisikan Masalah:</h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                    <li>• Pastikan tujuan keputusan jelas dan spesifik</li>
                    <li>• Identifikasi stakeholder yang terlibat</li>
                    <li>• Tentukan batas waktu pengambilan keputusan</li>
                  </ul>
                </div>
                <Button 
                  onClick={() => handleTabChange('structure')} 
                  disabled={!canProceedToStructure}
                  className="w-full"
                >
                  {canProceedToStructure ? 'Lanjut ke Struktur Hierarki' : 'Isi Nama Project Terlebih Dahulu'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Structure Tab */}
          <TabsContent value="structure">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kriteria Penilaian</CardTitle>
                  <CardDescription>Tambahkan kriteria yang akan digunakan untuk menilai alternatif (minimal 2)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {criteria.map((criterion, index) => (
                        <div key={criterion.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">K{index + 1}</Badge>
                            <span className="font-medium">{criterion.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCriteria(criterion.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Input
                        value={newCriteriaName}
                        onChange={(e) => setNewCriteriaName(e.target.value)}
                        placeholder="Nama kriteria baru"
                        onKeyPress={(e) => e.key === 'Enter' && addCriteria()}
                      />
                      <Button onClick={addCriteria} disabled={!newCriteriaName.trim()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alternatif Pilihan</CardTitle>
                  <CardDescription>Tambahkan alternatif yang akan dibandingkan (minimal 2)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {alternatives.map((alternative, index) => (
                        <div key={alternative.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">A{index + 1}</Badge>
                            <span className="font-medium">{alternative.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAlternative(alternative.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Input
                        value={newAlternativeName}
                        onChange={(e) => setNewAlternativeName(e.target.value)}
                        placeholder="Nama alternatif baru"
                        onKeyPress={(e) => e.key === 'Enter' && addAlternative()}
                      />
                      <Button onClick={addAlternative} disabled={!newAlternativeName.trim()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('project')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
                <Button 
                  onClick={() => handleTabChange('comparison')} 
                  disabled={!canProceedToComparison}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {canProceedToComparison ? 'Lanjut ke Perbandingan' : `Minimal 2 Kriteria & 2 Alternatif`}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison">
            <div className="space-y-6">
              {/* Saaty Scale Reference */}
              <Card>
                <CardHeader>
                  <CardTitle>Skala Saaty (1-9)</CardTitle>
                  <CardDescription>Panduan untuk memberikan nilai perbandingan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {satyScale.map((scale) => (
                      <div key={scale.value} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline">{scale.value}</Badge>
                          <span className="font-medium text-sm">{scale.label}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{scale.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Progress Indicator */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Perbandingan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Perbandingan Kriteria</span>
                        <span className="text-sm text-gray-600">{completedCriteriaComparisons}/{totalCriteriaComparisons}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(completedCriteriaComparisons / totalCriteriaComparisons) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Perbandingan Alternatif</span>
                        <span className="text-sm text-gray-600">{completedAlternativeComparisons}/{totalAlternativeComparisons}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(completedAlternativeComparisons / totalAlternativeComparisons) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Criteria Comparisons */}
              <Card>
                <CardHeader>
                  <CardTitle>Perbandingan Berpasangan Kriteria</CardTitle>
                  <CardDescription>Bandingkan setiap pasang kriteria menggunakan skala 1-9</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {criteria.map((criterion1, i) => 
                      criteria.slice(i + 1).map((criterion2, j) => (
                        <div key={`${criterion1.id}-${criterion2.id}`} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">K{i + 1}</Badge>
                              <span className="font-medium">{criterion1.name}</span>
                              <span className="text-gray-500">vs</span>
                              <Badge variant="secondary">K{i + j + 2}</Badge>
                              <span className="font-medium">{criterion2.name}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-5 gap-2">
                            {satyScale.map((scale) => (
                              <Button
                                key={scale.value}
                                variant={getComparisonValue(criterion1.id, criterion2.id) === scale.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => updateCriteriaComparison(criterion1.id, criterion2.id, scale.value)}
                                className="text-xs"
                              >
                                {scale.value}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Comparisons */}
              {criteria.map((criterion, criterionIndex) => (
                <Card key={criterion.id}>
                  <CardHeader>
                    <CardTitle>Perbandingan Alternatif untuk {criterion.name}</CardTitle>
                    <CardDescription>Bandingkan alternatif berdasarkan kriteria {criterion.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alternatives.map((alternative1, i) => 
                        alternatives.slice(i + 1).map((alternative2, j) => (
                          <div key={`${alternative1.id}-${alternative2.id}`} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">A{i + 1}</Badge>
                                <span className="font-medium">{alternative1.name}</span>
                                <span className="text-gray-500">vs</span>
                                <Badge variant="secondary">A{i + j + 2}</Badge>
                                <span className="font-medium">{alternative2.name}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                              {satyScale.map((scale) => (
                                <Button
                                  key={scale.value}
                                  variant={getAlternativeComparisonValue(criterion.id, alternative1.id, alternative2.id) === scale.value ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => updateAlternativeComparison(criterion.id, alternative1.id, alternative2.id, scale.value)}
                                  className="text-xs"
                                >
                                  {scale.value}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {canCalculate && (
                <div className="fixed bottom-6 right-6 z-50">
                  <Button 
                    onClick={calculateAHP}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg"
                    size="lg"
                  >
                    <Calculator className="w-6 h-6 mr-2" />
                    Hitung AHP
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            {results && (
              <div className="space-y-6">
                {/* Consistency Check */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {results.consistency.isConsistent ? (
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                      )}
                      Uji Konsistensi
                    </CardTitle>
                    <CardDescription>
                      Hasil analisis konsistensi matriks perbandingan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                          {results.consistency.lambdaMax.toFixed(4)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">λ max</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                          {results.consistency.ci.toFixed(4)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">CI</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className={`text-2xl font-bold ${results.consistency.isConsistent ? 'text-green-600' : 'text-red-600'}`}>
                          {results.consistency.cr.toFixed(4)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">CR</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className={`text-lg font-bold ${results.consistency.isConsistent ? 'text-green-600' : 'text-red-600'}`}>
                          {results.consistency.isConsistent ? 'Konsisten' : 'Tidak Konsisten'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                      </div>
                    </div>
                    {!results.consistency.isConsistent && (
                      <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-800 dark:text-red-200 text-sm">
                          <strong>Peringatan:</strong> Matriks perbandingan tidak konsisten (CR ≥ 0.1). 
                          Pertimbangkan untuk merevisi penilaian perbandingan Anda.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Criteria Weights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Bobot Kriteria</CardTitle>
                    <CardDescription>Prioritas relatif setiap kriteria</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.criteriaWeights.map((item: any, index: number) => (
                        <div key={item.criteria.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Badge variant="secondary">K{index + 1}</Badge>
                            <span className="font-medium">{item.criteria.name}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${item.weight * 100}%` }}
                              />
                            </div>
                            <span className="font-bold text-blue-600 min-w-[60px] text-right">
                              {(item.weight * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Final Ranking */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ranking Alternatif</CardTitle>
                    <CardDescription>Hasil akhir perankingan dengan metode AHP</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.alternatives.map((alt: any) => (
                        <div key={alt.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              alt.rank === 1 ? 'bg-yellow-500' : 
                              alt.rank === 2 ? 'bg-gray-400' : 
                              alt.rank === 3 ? 'bg-orange-600' : 'bg-blue-500'
                            }`}>
                              {alt.rank}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{alt.name}</h3>
                              <p className="text-sm text-gray-600">Skor: {alt.score.toFixed(4)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{(alt.score * 100).toFixed(1)}%</div>
                            <div className="text-xs text-gray-500">Tingkat Preferensi</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex space-x-4">
                      <Button variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Export Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CreateProjectAHP;
