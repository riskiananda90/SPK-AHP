
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, FileText, BarChart3, Calendar, User, Trophy, Target } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useProject } from '@/hooks/useProject';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, loading, error } = useProject(id);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-600 mb-4">Loading...</h2>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Project tidak ditemukan</h2>
          <Button onClick={() => navigate('/projects')}>
            Kembali ke Projects
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'in-progress': return 'bg-yellow-100 text-yellow-600';
      case 'draft': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai';
      case 'in-progress': return 'Progress';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };

  const handleExportExcel = () => {
    const exportData = {
      projectName: project.title,
      criteria: project.criteria || [],
      alternatives: project.alternatives || [],
      results: project.results,
      consistency: project.results?.consistency
    };
    exportToExcel(exportData);
  };

  const handleExportPDF = () => {
    const exportData = {
      projectName: project.title,
      criteria: project.criteria || [],
      alternatives: project.alternatives || [],
      results: project.results,
      consistency: project.results?.consistency
    };
    exportToPDF(exportData);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/projects')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{project.title}</h1>
              <p className="text-slate-600">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(project.status)}>
              {getStatusText(project.status)}
            </Badge>
            {project.status === 'completed' && (
              <div className="flex space-x-2">
                <Button onClick={handleExportExcel} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <Button onClick={handleExportPDF} variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Metode</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{project.method}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Dibuat</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{new Date(project.created_at).toLocaleDateString('id-ID')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">{project.progress || 0}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Criteria and Alternatives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Kriteria</CardTitle>
              <CardDescription>Kriteria yang digunakan dalam analisis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.isArray(project.criteria) && project.criteria.map((criteria: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span>{criteria.name || criteria}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alternatif</CardTitle>
              <CardDescription>Pilihan yang akan dievaluasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.isArray(project.alternatives) && project.alternatives.map((alternative: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <span>{alternative.name || alternative}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results in a readable format */}
        {project.results && (
          <div className="space-y-6">
            {/* Consistency Ratio */}
            {project.results.consistency && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Uji Konsistensi</span>
                  </CardTitle>
                  <CardDescription>Hasil uji konsistensi perhitungan AHP</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Consistency Ratio (CR)</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {project.results.consistency.cr?.toFixed(4) || 'N/A'}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Status Konsistensi</p>
                      <p className={`text-lg font-semibold ${project.results.consistency.isConsistent ? 'text-green-600' : 'text-red-600'}`}>
                        {project.results.consistency.isConsistent ? 'Konsisten' : 'Tidak Konsisten'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Criteria Weights */}
            {project.results.criteriaWeights && (
              <Card>
                <CardHeader>
                  <CardTitle>Bobot Kriteria</CardTitle>
                  <CardDescription>Bobot prioritas untuk setiap kriteria</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Kriteria</TableHead>
                        <TableHead>Bobot</TableHead>
                        <TableHead>Persentase</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project.results.criteriaWeights.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.criteria?.name || `Kriteria ${index + 1}`}</TableCell>
                          <TableCell>{item.weight?.toFixed(4) || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{((item.weight || 0) * 100).toFixed(2)}%</span>
                              <div className="w-20 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="h-2 bg-blue-500 rounded-full" 
                                  style={{ width: `${(item.weight || 0) * 100}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Final Ranking */}
            {project.results.alternatives && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5" />
                    <span>Ranking Alternatif</span>
                  </CardTitle>
                  <CardDescription>Hasil akhir ranking berdasarkan metode AHP</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ranking</TableHead>
                        <TableHead>Alternatif</TableHead>
                        <TableHead>Skor</TableHead>
                        <TableHead>Persentase</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {project.results.alternatives.map((alt: any, index: number) => (
                        <TableRow key={index} className={index === 0 ? 'bg-green-50' : ''}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                              <span className="font-bold">{alt.rank || index + 1}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{alt.name}</TableCell>
                          <TableCell>{alt.score?.toFixed(4) || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{((alt.score || 0) * 100).toFixed(2)}%</span>
                              <div className="w-20 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className={`h-2 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-blue-500'}`}
                                  style={{ width: `${(alt.score || 0) * 100}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
