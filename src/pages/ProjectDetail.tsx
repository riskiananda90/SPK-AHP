
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Play, 
  Edit3, 
  Clock, 
  Users, 
  Calculator,
  FolderOpen,
  BarChart3,
  CheckCircle2,
  Circle
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);

  // Mock data - ini akan diganti dengan data dari Supabase nanti
  const mockProjects = [
    {
      id: 1,
      title: 'Pemilihan Smartphone Terbaik',
      description: 'Project untuk menentukan smartphone terbaik berdasarkan kriteria harga, performa, kamera, dan daya tahan baterai.',
      method: 'AHP',
      status: 'completed',
      lastModified: '2 jam yang lalu',
      alternatives: ['iPhone 15', 'Samsung Galaxy S24', 'Google Pixel 8', 'OnePlus 12', 'Xiaomi 14'],
      criteria: ['Harga', 'Performa', 'Kamera', 'Baterai'],
      collaborators: 2,
      progress: 100,
      createdAt: '15 Januari 2024',
      results: {
        winner: 'iPhone 15',
        scores: [
          { name: 'iPhone 15', score: 0.35 },
          { name: 'Samsung Galaxy S24', score: 0.28 },
          { name: 'Google Pixel 8', score: 0.18 },
          { name: 'OnePlus 12', score: 0.12 },
          { name: 'Xiaomi 14', score: 0.07 }
        ]
      }
    },
    {
      id: 2,
      title: 'Evaluasi Karyawan Terbaik',
      description: 'Mengevaluasi dan menentukan karyawan terbaik berdasarkan kinerja, kedisiplinan, kerja sama tim, dan inovasi.',
      method: 'AHP',
      status: 'in-progress',
      lastModified: '1 hari yang lalu',
      alternatives: ['Ahmad Rizki', 'Sari Dewi', 'Budi Santoso', 'Maya Putri', 'Andi Wijaya', 'Lina Sari', 'Dedi Kurnia', 'Rina Wati'],
      criteria: ['Kinerja', 'Kedisiplinan', 'Kerja Sama', 'Inovasi', 'Leadership', 'Komunikasi'],
      collaborators: 3,
      progress: 75,
      createdAt: '10 Januari 2024'
    },
    {
      id: 3,
      title: 'Pemilihan Supplier',
      description: 'Pemilihan supplier terbaik untuk kebutuhan bahan baku perusahaan berdasarkan kualitas, harga, dan ketepatan waktu.',
      method: 'AHP',
      status: 'completed',
      lastModified: '3 hari yang lalu',
      alternatives: ['PT Maju Jaya', 'CV Berkah', 'PT Sentosa', 'UD Makmur', 'PT Sejahtera', 'CV Sukses'],
      criteria: ['Kualitas', 'Harga', 'Ketepatan Waktu', 'Pelayanan', 'Lokasi'],
      collaborators: 1,
      progress: 100,
      createdAt: '5 Januari 2024',
      results: {
        winner: 'PT Maju Jaya',
        scores: [
          { name: 'PT Maju Jaya', score: 0.32 },
          { name: 'CV Berkah', score: 0.26 },
          { name: 'PT Sentosa', score: 0.19 },
          { name: 'UD Makmur', score: 0.13 },
          { name: 'PT Sejahtera', score: 0.06 },
          { name: 'CV Sukses', score: 0.04 }
        ]
      }
    },
    {
      id: 4,
      title: 'Analisis Investasi Properti',
      description: 'Analisis untuk menentukan properti investasi terbaik di Jakarta berdasarkan lokasi, harga, potensi ROI, dan fasilitas.',
      method: 'AHP',
      status: 'draft',
      lastModified: '1 minggu yang lalu',
      alternatives: ['Apartemen Central Park', 'Rumah PIK', 'Ruko Kelapa Gading'],
      criteria: ['Lokasi', 'Harga', 'ROI Potential', 'Fasilitas', 'Akses Transportasi', 'Keamanan', 'Potensi Nilai'],
      collaborators: 4,
      progress: 25,
      createdAt: '20 Desember 2023'
    },
    {
      id: 5,
      title: 'Seleksi Universitas Terbaik',
      description: 'Pemilihan universitas terbaik untuk melanjutkan studi S2 berdasarkan akreditasi, biaya, lokasi, dan fasilitas.',
      method: 'AHP',
      status: 'in-progress',
      lastModified: '5 hari yang lalu',
      alternatives: ['UI', 'ITB', 'UGM', 'ITS', 'Unpad', 'Undip', 'Unair', 'Unhas', 'USU', 'Unand'],
      criteria: ['Akreditasi', 'Biaya Kuliah', 'Lokasi', 'Fasilitas', 'Kualitas Dosen', 'Alumni Network', 'Penelitian', 'Beasiswa'],
      collaborators: 2,
      progress: 60,
      createdAt: '28 Desember 2023'
    }
  ];

  useEffect(() => {
    const foundProject = mockProjects.find(p => p.id === parseInt(id || '0'));
    setProject(foundProject);
  }, [id]);

  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-600 mb-4">Project Tidak Ditemukan</h2>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Projects
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300';
      case 'draft': return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300';
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

  const handleContinueProject = () => {
    navigate(`/create-project/ahp?projectId=${project.id}`);
  };

  const steps = [
    { name: 'Setup Project', completed: project.progress >= 25 },
    { name: 'Input Kriteria & Alternatif', completed: project.progress >= 50 },
    { name: 'Perbandingan Berpasangan', completed: project.progress >= 75 },
    { name: 'Hasil & Analisis', completed: project.progress >= 100 }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/projects')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
              {project.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {project.description}
            </p>
          </div>
          <Badge className={getStatusColor(project.status)}>
            {getStatusText(project.status)}
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <span>Overview Project</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{project.method}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Metode</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{project.alternatives.length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Alternatif</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{project.criteria.length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Kriteria</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{project.collaborators}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Kolaborator</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Progress</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Progress Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Langkah-langkah AHP</CardTitle>
                <CardDescription>
                  Ikuti langkah-langkah sistematis untuk menyelesaikan analisis AHP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {step.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-400" />
                      )}
                      <span className={`${step.completed ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500'}`}>
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Results (jika sudah selesai) */}
            {project.status === 'completed' && project.results && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <span>Hasil Analisis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-sm text-green-600 dark:text-green-400 mb-1">Alternatif Terbaik</div>
                      <div className="text-xl font-bold text-green-800 dark:text-green-200">
                        {project.results.winner}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="font-medium text-slate-800 dark:text-slate-200">Ranking Alternatif:</div>
                      {project.results.scores.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                          <span className="font-medium">#{index + 1} {item.name}</span>
                          <span className="text-blue-600 font-semibold">
                            {(item.score * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <Button 
                  onClick={handleContinueProject}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  size="lg"
                >
                  {project.status === 'completed' ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Lihat Detail Hasil
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Lanjutkan Project
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/create-project/ahp?projectId=${project.id}&mode=edit`)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Project
                </Button>
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Info Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">Dibuat: {project.createdAt}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">Update: {project.lastModified}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">{project.collaborators} kolaborator</span>
                </div>
              </CardContent>
            </Card>

            {/* Kriteria */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kriteria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.criteria.map((criteria: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{criteria}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alternatif */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alternatif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.alternatives.slice(0, 5).map((alt: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{alt}</span>
                    </div>
                  ))}
                  {project.alternatives.length > 5 && (
                    <div className="text-xs text-slate-500 mt-2">
                      +{project.alternatives.length - 5} alternatif lainnya
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetail;
