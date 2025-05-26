
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  FolderOpen, 
  Clock, 
  Users, 
  MoreHorizontal,
  Calculator,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'Pemilihan Smartphone Terbaik',
      method: 'AHP',
      status: 'completed',
      lastModified: '2 jam yang lalu',
      alternatives: 5,
      criteria: 4,
      collaborators: 2,
      progress: 100
    },
    {
      id: 2,
      title: 'Evaluasi Karyawan Terbaik',
      method: 'AHP',
      status: 'in-progress',
      lastModified: '1 hari yang lalu',
      alternatives: 8,
      criteria: 6,
      collaborators: 3,
      progress: 75
    },
    {
      id: 3,
      title: 'Pemilihan Supplier',
      method: 'AHP',
      status: 'completed',
      lastModified: '3 hari yang lalu',
      alternatives: 6,
      criteria: 5,
      collaborators: 1,
      progress: 100
    },
    {
      id: 4,
      title: 'Analisis Investasi Properti',
      method: 'AHP',
      status: 'draft',
      lastModified: '1 minggu yang lalu',
      alternatives: 3,
      criteria: 7,
      collaborators: 4,
      progress: 25
    },
    {
      id: 5,
      title: 'Seleksi Universitas Terbaik',
      method: 'AHP',
      status: 'in-progress',
      lastModified: '5 hari yang lalu',
      alternatives: 10,
      criteria: 8,
      collaborators: 2,
      progress: 60
    }
  ];

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

  const handleProjectClick = (projectId: number) => {
    // Navigate to project detail/edit page
    navigate(`/project/${projectId}`);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Projects AHP</h1>
            <p className="text-slate-600 dark:text-slate-400">Kelola semua project AHP Anda</p>
          </div>
          <Button 
            onClick={() => navigate('/new-project')}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              Semua
            </Button>
            <Button
              variant={filterStatus === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('completed')}
              size="sm"
            >
              Selesai
            </Button>
            <Button
              variant={filterStatus === 'in-progress' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('in-progress')}
              size="sm"
            >
              Progress
            </Button>
            <Button
              variant={filterStatus === 'draft' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('draft')}
              size="sm"
            >
              Draft
            </Button>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Card 
                className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleProjectClick(project.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-lg flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2">
                          {project.method}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleProjectClick(project.id); }}>
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/project/${project.id}/edit`); }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {project.lastModified}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center">
                      <FolderOpen className="w-4 h-4 mr-1" />
                      {project.alternatives} alternatif
                    </div>
                    <div className="flex items-center">
                      <Calculator className="w-4 h-4 mr-1" />
                      {project.criteria} kriteria
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusText(project.status)}
                    </Badge>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Users className="w-4 h-4 mr-1" />
                      {project.collaborators}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FolderOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Tidak ada project ditemukan
            </h3>
            <p className="text-slate-500 dark:text-slate-500 mb-4">
              {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan membuat project baru'}
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate('/new-project')}>
                <Plus className="w-4 h-4 mr-2" />
                Buat Project Baru
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Projects;
