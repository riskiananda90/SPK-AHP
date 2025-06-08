
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calculator, BarChart3, TrendingUp, FolderOpen, Clock, Users, Zap, Target, Award, Scale, Layers, Grid3X3, TreePine, Workflow } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';

const Dashboard = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { projects } = useProjects();

  // Get recent projects from the last 7 days
  const recentProjects = projects
    .filter(project => {
      const projectDate = new Date(project.updated_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return projectDate >= weekAgo;
    })
    .slice(0, 3)
    .map(project => ({
      id: project.id,
      title: project.title,
      method: project.method,
      lastModified: new Date(project.updated_at).toLocaleDateString('id-ID'),
      status: project.status
    }));

  const stats = [
    {
      title: 'Total Project',
      value: projects.length.toString(),
      icon: FolderOpen,
      change: '+12%',
      positive: true,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Project Selesai',
      value: projects.filter(p => p.status === 'completed').length.toString(),
      icon: Award,
      change: '+8%',
      positive: true,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Project Progress',
      value: projects.filter(p => p.status === 'in-progress').length.toString(),
      icon: Target,
      change: '+2%',
      positive: true,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const methods = [
    {
      id: 'ahp',
      icon: Calculator,
      title: 'Metode AHP',
      description: 'Analytic Hierarchy Process untuk pengambilan keputusan multi-kriteria yang akurat dan terstruktur',
      available: true,
      color: 'from-blue-500 to-cyan-500',
      projectCount: projects.length
    },
    {
      id: 'topsis',
      icon: BarChart3,
      title: 'Metode TOPSIS',
      description: 'Technique for Order Preference by Similarity to Ideal Solution untuk ranking alternatif',
      available: false,
      color: 'from-green-500 to-emerald-500',
      projectCount: 0
    },
    {
      id: 'saw',
      icon: Scale,
      title: 'Metode SAW',
      description: 'Simple Additive Weighting untuk penjumlahan berbobot dari rating kinerja',
      available: false,
      color: 'from-purple-500 to-pink-500',
      projectCount: 0
    },
    {
      id: 'electre',
      icon: Layers,
      title: 'Metode ELECTRE',
      description: 'ELimination Et Choix Traduisant la REalité untuk eliminasi dan pemilihan alternatif',
      available: false,
      color: 'from-orange-500 to-red-500',
      projectCount: 0
    },
    {
      id: 'promethee',
      icon: Grid3X3,
      title: 'Metode PROMETHEE',
      description: 'Preference Ranking Organization METHod for Enrichment Evaluations',
      available: false,
      color: 'from-indigo-500 to-purple-500',
      projectCount: 0
    },
    {
      id: 'wp',
      icon: TreePine,
      title: 'Metode WP',
      description: 'Weighted Product untuk perkalian untuk menghubungkan rating atribut',
      available: false,
      color: 'from-teal-500 to-green-500',
      projectCount: 0
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Analisis Cepat',
      description: 'Dapatkan hasil analisis dalam hitungan menit'
    },
    {
      icon: Target,
      title: 'Hasil Akurat',
      description: 'Algoritma yang terpercaya dan teruji'
    },
    {
      icon: BarChart3,
      title: 'Visualisasi Jelas',
      description: 'Grafik dan chart yang mudah dipahami'
    }
  ];

  const handleMethodClick = (method: any) => {
    if (method.available) {
      navigate('/create-project/ahp');
    }
  };

  const handleCreateProject = () => {
    navigate('/create-project/ahp');
  };

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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Multi-Criteria Decision Support System
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Platform pengambilan keputusan dengan berbagai metode ilmiah yang membantu Anda membuat keputusan yang tepat dan terstruktur.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 hover:shadow-xl transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-5`} />
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                      <p className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} dari bulan lalu
                      </p>
                    </div>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Methods Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Metode Pengambilan Keputusan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {methods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.id}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  whileHover={{ y: method.available ? -8 : -2, scale: method.available ? 1.02 : 1.01 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 border-0 bg-gradient-to-br from-white via-slate-50 to-slate-100 relative overflow-hidden ${
                      method.available 
                        ? 'hover:shadow-2xl' 
                        : 'opacity-75 cursor-not-allowed hover:shadow-lg'
                    }`}
                    onClick={() => handleMethodClick(method)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${method.color} ${method.available ? 'opacity-10' : 'opacity-5'}`} />
                    <CardHeader className="text-center pb-4 relative">
                      <motion.div 
                        className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${method.color} flex items-center justify-center mb-6 shadow-xl`}
                        animate={{ 
                          scale: hoveredCard === index ? 1.1 : 1,
                          rotate: hoveredCard === index && method.available ? 5 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl text-slate-800 mb-2 flex items-center justify-center gap-2">
                        {method.title}
                        {!method.available && (
                          <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-normal">
                            Coming Soon
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-slate-600 text-sm">
                        {method.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 relative">
                      <div className="text-center mb-6">
                        <span className={`text-sm px-3 py-1 rounded-full ${
                          method.available 
                            ? 'text-slate-500 bg-blue-100' 
                            : 'text-orange-600 bg-orange-100'
                        }`}>
                          {method.available 
                            ? `${method.projectCount} project aktif` 
                            : 'Segera hadir'
                          }
                        </span>
                      </div>
                      <Button 
                        className={`w-full font-semibold py-3 text-base shadow-lg transition-all duration-300 ${
                          method.available
                            ? `bg-gradient-to-r ${method.color} hover:shadow-xl text-white`
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                        }`}
                        size="lg"
                        disabled={!method.available}
                      >
                        {method.available ? (
                          <>
                            <Plus className="w-5 h-5 mr-2" />
                            Buat Project {method.title.split(' ')[1]}
                          </>
                        ) : (
                          <>
                            <Workflow className="w-5 h-5 mr-2" />
                            Segera Hadir
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Keunggulan Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Project Terbaru</h2>
            <Button variant="outline" onClick={() => navigate('/projects')} className="hover:bg-blue-50">
              Lihat Semua
            </Button>
          </div>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0">
              {recentProjects.length === 0 ? (
                <div className="p-8 text-center">
                  <FolderOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Belum ada project terbaru</h3>
                  <p className="text-gray-500 mb-4">Buat project AHP pertama Anda untuk mulai analisis</p>
                  <Button onClick={handleCreateProject} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Project Baru
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {recentProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="p-6 hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 mb-1">
                            {project.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                              {project.method}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {project.lastModified}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {getStatusText(project.status)}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="hover:bg-blue-100"
                            onClick={() => navigate(`/project/${project.id}`)}
                          >
                            Buka
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
