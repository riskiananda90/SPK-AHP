
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, PieChart, Activity, Calendar, Users, FolderOpen, Clock } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Analytics = () => {
  const analyticsData = {
    overview: {
      totalProjects: 25,
      completedProjects: 18,
      activeUsers: 12,
      avgCompletionTime: 5.2
    },
    methodUsage: [
      { method: 'AHP', count: 12, percentage: 48 },
      { method: 'SAW', count: 8, percentage: 32 },
      { method: 'TOPSIS', count: 5, percentage: 20 }
    ],
    recentActivities: [
      { id: 1, action: 'Project "Pemilihan Smartphone" selesai', user: 'John Doe', time: '2 jam lalu' },
      { id: 2, action: 'Metode AHP digunakan dalam project baru', user: 'Jane Smith', time: '4 jam lalu' },
      { id: 3, action: 'Project "Evaluasi Karyawan" dimulai', user: 'Bob Wilson', time: '1 hari lalu' },
      { id: 4, action: 'Analisis TOPSIS completed', user: 'Alice Brown', time: '2 hari lalu' },
      { id: 5, action: 'New team member added', user: 'Charlie Davis', time: '3 hari lalu' }
    ],
    monthlyStats: [
      { month: 'Jan', projects: 3, completed: 2 },
      { month: 'Feb', projects: 5, completed: 4 },
      { month: 'Mar', projects: 7, completed: 6 },
      { month: 'Apr', projects: 4, completed: 3 },
      { month: 'May', projects: 6, completed: 3 }
    ]
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
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Analytics</h1>
          <p className="text-slate-600">Analisis dan insights dari aktivitas DSS Anda</p>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Project</p>
                  <p className="text-3xl font-bold text-slate-800">{analyticsData.overview.totalProjects}</p>
                  <p className="text-sm text-green-600">+12% dari bulan lalu</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Project Selesai</p>
                  <p className="text-3xl font-bold text-slate-800">{analyticsData.overview.completedProjects}</p>
                  <p className="text-sm text-green-600">+8% dari bulan lalu</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">User Aktif</p>
                  <p className="text-3xl font-bold text-slate-800">{analyticsData.overview.activeUsers}</p>
                  <p className="text-sm text-green-600">+3 user baru</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Avg. Completion</p>
                  <p className="text-3xl font-bold text-slate-800">{analyticsData.overview.avgCompletionTime} hari</p>
                  <p className="text-sm text-orange-600">-0.8 hari</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Method Usage */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Penggunaan Metode
                </CardTitle>
                <CardDescription>Distribusi metode yang digunakan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.methodUsage.map((method, index) => (
                  <div key={method.method} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{method.method}</Badge>
                        <span className="text-sm text-slate-600">{method.count} project</span>
                      </div>
                      <span className="text-sm font-medium">{method.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-green-500' : 'bg-purple-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${method.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Aktivitas Terbaru
                </CardTitle>
                <CardDescription>Timeline aktivitas sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-slate-500">{activity.user}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{activity.time}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Monthly Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Statistik Bulanan
              </CardTitle>
              <CardDescription>Trend project dalam 5 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analyticsData.monthlyStats.map((stat, index) => (
                  <div key={stat.month} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">{stat.month} 2024</span>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span>{stat.projects} dibuat</span>
                        <span>{stat.completed} selesai</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <motion.div 
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.projects / 7) * 100}%` }}
                          transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                        />
                      </div>
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <motion.div 
                          className="bg-green-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.completed / 7) * 100}%` }}
                          transition={{ duration: 1, delay: 1 + index * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-center space-x-6 pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Project Dibuat</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-600">Project Selesai</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
