
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Activity, FolderOpen, Clock, TrendingUp, Users, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

const Analytics = () => {
  const { analytics, loading, error } = useAnalytics();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-foreground mb-2">Analytics</h1>
            <p className="text-slate-600 dark:text-muted-foreground">Analisis dan insights dari aktivitas DSS Anda</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-foreground mb-2">Analytics</h1>
            <p className="text-slate-600 dark:text-muted-foreground">Analisis dan insights dari aktivitas DSS Anda</p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span>Error loading analytics: {error}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-foreground mb-2">Analytics</h1>
            <p className="text-slate-600 dark:text-muted-foreground">Analisis dan insights dari aktivitas DSS Anda</p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <p className="text-slate-600 dark:text-muted-foreground">Tidak ada data analytics tersedia</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-slate-800 dark:text-foreground mb-2">Analytics</h1>
          <p className="text-slate-600 dark:text-muted-foreground">Analisis dan insights dari aktivitas DSS Anda</p>
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
                  <p className="text-sm text-slate-600 dark:text-muted-foreground mb-1">Total Project</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-foreground">{analytics.overview.totalProjects}</p>
                  <p className="text-sm text-green-600">Project yang dibuat</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-muted-foreground mb-1">Project Selesai</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-foreground">{analytics.overview.completedProjects}</p>
                  <p className="text-sm text-green-600">Project yang completed</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-muted-foreground mb-1">Project Progress</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-foreground">{analytics.overview.inProgressProjects}</p>
                  <p className="text-sm text-orange-600">Sedang dikerjakan</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-muted-foreground mb-1">User Aktif</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-foreground">{analytics.overview.activeUsers}</p>
                  <p className="text-sm text-purple-600">Anda sedang aktif</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-300" />
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
                <CardDescription>Distribusi metode yang digunakan dalam project Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.methodUsage.length > 0 ? (
                  analytics.methodUsage.map((method, index) => (
                    <div key={method.method} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{method.method}</Badge>
                          <span className="text-sm text-slate-600 dark:text-muted-foreground">{method.count} project</span>
                        </div>
                        <span className="text-sm font-medium">{method.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
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
                  ))
                ) : (
                  <p className="text-sm text-slate-600 dark:text-muted-foreground">Belum ada project yang dibuat</p>
                )}
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
                <CardDescription>Timeline aktivitas project terbaru</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.recentActivities.length > 0 ? (
                    analytics.recentActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                        className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-foreground">{activity.action}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-slate-500 dark:text-muted-foreground">{activity.user}</span>
                            <span className="text-xs text-slate-400 dark:text-muted-foreground">•</span>
                            <span className="text-xs text-slate-500 dark:text-muted-foreground">{activity.time}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-muted-foreground">Belum ada aktivitas</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
