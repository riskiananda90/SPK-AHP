
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Users, CheckCircle, Target, BarChart3, TrendingUp, ArrowRight, BookOpen, Lightbulb, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Documentation = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: 1,
      title: "Definisi Masalah",
      description: "Tentukan tujuan keputusan dan kriteria yang akan digunakan untuk evaluasi",
      icon: Target,
      details: [
        "Identifikasi masalah yang akan diselesaikan",
        "Tentukan tujuan utama pengambilan keputusan",
        "Kumpulkan semua alternatif yang tersedia"
      ]
    },
    {
      step: 2,
      title: "Struktur Hierarki",
      description: "Susun struktur hierarki dari tujuan, kriteria, dan alternatif",
      icon: BarChart3,
      details: [
        "Level 1: Tujuan utama (Goal)",
        "Level 2: Kriteria dan sub-kriteria",
        "Level 3: Alternatif pilihan"
      ]
    },
    {
      step: 3,
      title: "Pairwise Comparison",
      description: "Bandingkan setiap pasangan kriteria dan alternatif menggunakan skala 1-9",
      icon: Users,
      details: [
        "Bandingkan kepentingan antar kriteria",
        "Gunakan skala Saaty (1-9)",
        "Isi matriks perbandingan berpasangan"
      ]
    },
    {
      step: 4,
      title: "Perhitungan Bobot",
      description: "Hitung bobot prioritas dari setiap kriteria dan alternatif",
      icon: Calculator,
      details: [
        "Normalisasi matriks perbandingan",
        "Hitung eigen vector",
        "Tentukan bobot prioritas"
      ]
    },
    {
      step: 5,
      title: "Uji Konsistensi",
      description: "Periksa konsistensi penilaian dengan menghitung Consistency Ratio (CR)",
      icon: CheckCircle,
      details: [
        "Hitung Consistency Index (CI)",
        "Tentukan Random Index (RI)",
        "CR = CI/RI harus < 0.1"
      ]
    },
    {
      step: 6,
      title: "Keputusan Final",
      description: "Dapatkan ranking alternatif berdasarkan nilai prioritas global",
      icon: TrendingUp,
      details: [
        "Kalikan bobot kriteria dengan bobot alternatif",
        "Jumlahkan nilai untuk setiap alternatif",
        "Ranking berdasarkan nilai tertinggi"
      ]
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Interface Intuitif",
      description: "Antarmuka yang mudah digunakan dengan panduan langkah demi langkah"
    },
    {
      icon: Calculator,
      title: "Perhitungan Otomatis",
      description: "Sistem otomatis menghitung bobot, konsistensi, dan ranking"
    },
    {
      icon: BarChart3,
      title: "Visualisasi Data",
      description: "Grafik dan chart untuk memudahkan interpretasi hasil"
    },
    {
      icon: CheckCircle,
      title: "Validasi Konsistensi",
      description: "Uji konsistensi otomatis untuk memastikan keandalan hasil"
    }
  ];

  const scaleGuide = [
    { value: 1, meaning: "Sama penting", description: "Kedua elemen memiliki kepentingan yang sama" },
    { value: 3, meaning: "Sedikit lebih penting", description: "Elemen pertama sedikit lebih penting dari yang kedua" },
    { value: 5, meaning: "Lebih penting", description: "Elemen pertama lebih penting dari yang kedua" },
    { value: 7, meaning: "Sangat lebih penting", description: "Elemen pertama sangat lebih penting dari yang kedua" },
    { value: 9, meaning: "Mutlak lebih penting", description: "Elemen pertama mutlak lebih penting dari yang kedua" },
  ];

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
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Dokumentasi AHP Tools
            </h1>
          </div>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Panduan lengkap menggunakan Analytic Hierarchy Process (AHP) untuk pengambilan keputusan yang akurat dan terstruktur
          </p>
        </motion.div>

        {/* Apa itu AHP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                <span>Apa itu Analytic Hierarchy Process (AHP)?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                <strong>Analytic Hierarchy Process (AHP)</strong> adalah metode pengambilan keputusan multi-kriteria yang dikembangkan oleh Thomas L. Saaty pada tahun 1970-an. 
                AHP membantu dalam mengorganisir dan menganalisis keputusan kompleks dengan cara:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Keunggulan AHP</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Struktur hierarki yang jelas</li>
                    <li>• Perbandingan berpasangan sistematis</li>
                    <li>• Uji konsistensi built-in</li>
                    <li>• Hasil yang dapat dipertanggungjawabkan</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Aplikasi AHP</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Pemilihan supplier</li>
                    <li>• Evaluasi karyawan</li>
                    <li>• Pemilihan investasi</li>
                    <li>• Perencanaan strategis</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Langkah-langkah AHP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Langkah-langkah Metode AHP</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="flex items-center space-x-2">
                            <Icon className="w-5 h-5 text-blue-600" />
                            <span>{step.title}</span>
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {step.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm text-slate-600">
                            <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Skala Perbandingan Saaty */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Skala Perbandingan Saaty</CardTitle>
              <CardDescription>
                Skala 1-9 yang digunakan dalam perbandingan berpasangan untuk menentukan tingkat kepentingan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-blue-200 p-3 text-left font-semibold text-blue-800">Nilai</th>
                      <th className="border border-blue-200 p-3 text-left font-semibold text-blue-800">Tingkat Kepentingan</th>
                      <th className="border border-blue-200 p-3 text-left font-semibold text-blue-800">Penjelasan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scaleGuide.map((scale, index) => (
                      <tr key={scale.value} className={index % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                        <td className="border border-slate-200 p-3 font-semibold text-blue-600">{scale.value}</td>
                        <td className="border border-slate-200 p-3 font-medium">{scale.meaning}</td>
                        <td className="border border-slate-200 p-3 text-slate-600">{scale.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Catatan:</strong> Nilai 2, 4, 6, 8 dapat digunakan sebagai nilai antara jika diperlukan penilaian yang lebih detail.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fitur AHP Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Fitur AHP Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
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

        {/* Cara Menggunakan Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Cara Menggunakan AHP Tools</CardTitle>
              <CardDescription>
                Panduan langkah demi langkah menggunakan aplikasi AHP Tools ini
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                  <h4 className="font-semibold mb-2">Buat Project</h4>
                  <p className="text-sm text-slate-600">
                    Klik "Buat Project AHP" di dashboard, berikan nama dan deskripsi project Anda
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <h4 className="font-semibold mb-2">Input Data</h4>
                  <p className="text-sm text-slate-600">
                    Masukkan kriteria dan alternatif, kemudian lakukan perbandingan berpasangan
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                  <h4 className="font-semibold mb-2">Lihat Hasil</h4>
                  <p className="text-sm text-slate-600">
                    Sistem akan menghitung otomatis dan menampilkan ranking alternatif terbaik
                  </p>
                </div>
              </div>
              <div className="text-center pt-6">
                <Button 
                  onClick={() => navigate('/create-project/ahp')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                  size="lg"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Mulai Buat Project AHP
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Documentation;
