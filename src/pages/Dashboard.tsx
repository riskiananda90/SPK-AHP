import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calculator, BarChart3, TrendingUp, FolderOpen, Clock, Users } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const methods = [
    {
      id: 'ahp',
      title: 'AHP Method',
      description: 'Analytic Hierarchy Process untuk pengambilan keputusan multi-kriteria',
      icon: Calculator,
      gradient: 'from-blue-500 to-cyan-500',
      projects: 12,
      color: 'blue'
    },
    {
      id: 'saw',
      title: 'SAW Method',
      description: 'Simple Additive Weighting dengan normalisasi yang akurat',
      icon: BarChart3,
      gradient: 'from-purple-500 to-pink-500',
      projects: 8,
      color: 'purple'
    },
    {
      id: 'topsis',
      title: 'TOPSIS Method',
      description: 'Technique for Order Preference by Similarity to Ideal Solution',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-500',
      projects: 5,
      color: 'orange'
    }
  ];

  const recentProjects = [
    {
      id: 1,
      title: 'Pemilihan Smartphone Terbaik',
      method: 'AHP',
      lastModified: '2 jam yang lalu',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Evaluasi Karyawan Terbaik',
      method: 'SAW',
      lastModified: '1 hari yang lalu',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Pemilihan Supplier',
      method: 'TOPSIS',
      lastModified: '3 hari yang lalu',
      status: 'completed'
    }
  ];

  const stats = [
    {
      title: 'Total Project',
      value: '25',
      icon: FolderOpen,
      change: '+12%',
      positive: true
    },
    {
      title: 'Project Selesai',
      value: '18',
      icon: Clock,
      change: '+8%',
      positive: true
    },
    {
      title: 'Kolaborator',
      value: '6',
      icon: Users,
      change: '+2',
      positive: true
    }
  ];

  const handleQuickCreate = (methodId: string) => {
    // Direct create project with selected method
    navigate(`/create-project/${methodId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 text-lg">
            Selamat datang kembali! Kelola project dan analisis Anda dengan mudah.
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
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                      <p className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} dari bulan lalu
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-slate-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Mulai Project Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {methods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={method.id}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
                    <CardHeader className="text-center pb-4">
                      <motion.div 
                        className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-r ${method.gradient} flex items-center justify-center mb-4`}
                        animate={{ 
                          scale: hoveredCard === index ? 1.1 : 1,
                          rotate: hoveredCard === index ? 5 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl text-slate-800">{method.title}</CardTitle>
                      <CardDescription className="text-slate-600">
                        {method.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-center mb-4">
                        <span className="text-sm text-slate-500">
                          {method.projects} project aktif
                        </span>
                      </div>
                      <Button 
                        onClick={() => handleQuickCreate(method.id)}
                        className={`w-full bg-gradient-to-r ${method.gradient} hover:shadow-lg transition-all duration-300`}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Buat Project
                      </Button>
                    </CardContent>
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
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Project Terbaru</h2>
            <Button variant="outline" onClick={() => navigate('/projects')}>
              Lihat Semua
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-200">
                {recentProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-6 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800 mb-1">
                          {project.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            {project.method}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {project.lastModified}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'completed' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {project.status === 'completed' ? 'Selesai' : 'Progress'}
                        </span>
                        <Button variant="ghost" size="sm">
                          Buka
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
