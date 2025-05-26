
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, ArrowRight, ArrowLeft, CheckCircle, Target, BarChart3, Award } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const NewProject = () => {
  const navigate = useNavigate();

  const ahpSteps = [
    {
      step: 1,
      title: "Definisi Masalah",
      description: "Tentukan tujuan keputusan dan kriteria utama",
      icon: Target,
      color: "blue"
    },
    {
      step: 2, 
      title: "Struktur Hierarki",
      description: "Susun hierarki dari tujuan, kriteria, dan alternatif",
      icon: BarChart3,
      color: "purple"
    },
    {
      step: 3,
      title: "Pairwise Comparison",
      description: "Bandingkan setiap pasang kriteria menggunakan skala 1-9",
      icon: Calculator,
      color: "green"
    },
    {
      step: 4,
      title: "Consistency Check",
      description: "Periksa konsistensi matriks perbandingan (CR < 0.1)",
      icon: CheckCircle,
      color: "orange"
    },
    {
      step: 5,
      title: "Final Ranking",
      description: "Dapatkan ranking final berdasarkan bobot dan nilai",
      icon: Award,
      color: "red"
    }
  ];

  const ahpFeatures = [
    "Matriks perbandingan berpasangan yang interaktif",
    "Perhitungan eigen vector dan eigen value",
    "Consistency Ratio (CR) otomatis",
    "Visualisasi hierarki keputusan",
    "Export hasil ke PDF dan Excel",
    "Analisis sensitivitas",
    "Grafik dan chart hasil"
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            Analytic Hierarchy Process (AHP)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Metode pengambilan keputusan multi-kriteria yang paling powerful dan terpercaya
          </p>
        </motion.div>

        {/* AHP Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Method Description */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Tentang Metode AHP</CardTitle>
                  <CardDescription>Dikembangkan oleh Thomas L. Saaty</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                AHP adalah metode pengambilan keputusan yang menggunakan perbandingan berpasangan 
                untuk menentukan prioritas dan bobot dari berbagai kriteria dan alternatif.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300">Fitur Unggulan:</h4>
                <ul className="space-y-1">
                  {ahpFeatures.map((feature, idx) => (
                    <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* AHP Steps */}
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl">Langkah-langkah AHP</CardTitle>
              <CardDescription>Proses sistematis untuk keputusan yang akurat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ahpSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.step} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full bg-${step.color}-100 dark:bg-${step.color}-900/30 flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 text-${step.color}-600 dark:text-${step.color}-400`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-700 dark:text-slate-300">
                          {step.step}. {step.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
            Keunggulan Metode AHP
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300">Akurat</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Hasil keputusan yang terukur dan dapat dipertanggungjawabkan
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300">Fleksibel</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Dapat diterapkan pada berbagai jenis masalah keputusan
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300">Konsisten</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Memiliki mekanisme pengecekan konsistensi built-in
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-between pt-4"
        >
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Dashboard
          </Button>
          
          <Button 
            onClick={() => navigate('/create-project/ahp')}
            className="flex items-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 text-lg"
            size="lg"
          >
            Mulai Project AHP
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Quick Start Guide */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
            🚀 Quick Start Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Persiapan:</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Tentukan tujuan keputusan yang jelas</li>
                <li>• Identifikasi kriteria penilaian (3-7 kriteria optimal)</li>
                <li>• Siapkan daftar alternatif yang akan dibandingkan</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Tips:</h4>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Libatkan expert dalam memberikan penilaian</li>
                <li>• Pastikan Consistency Ratio &lt; 0.1</li>
                <li>• Review hasil dengan stakeholder</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default NewProject;
