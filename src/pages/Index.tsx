
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BarChart3, Calculator, TrendingUp, Users, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Calculator,
      title: "AHP Method",
      description: "Analytic Hierarchy Process untuk pengambilan keputusan multi-kriteria",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "SAW Method", 
      description: "Simple Additive Weighting dengan normalisasi yang akurat",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "TOPSIS Method",
      description: "Technique for Order Preference by Similarity to Ideal Solution",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Multi-User Support",
      description: "Kolaborasi tim dengan project sharing"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Data terenkripsi dengan backup otomatis"
    },
    {
      icon: Zap,
      title: "Real-time Analysis",
      description: "Hasil kalkulasi instant dengan visualisasi interaktif"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">DSS Tools</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-slate-600 hover:text-slate-800"
              >
                Masuk
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Daftar Gratis
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-slate-800 mb-6"
            >
              Decision Support System
              <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                Tools Platform
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Platform terdepan untuk pengambilan keputusan berbasis data dengan implementasi metode AHP, SAW, dan TOPSIS. 
              Buat keputusan yang lebih baik dengan analisis yang komprehensif.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Mulai Gratis Sekarang
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 text-lg"
              >
                Lihat Demo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Metode Analisis Terdepan
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Implementasi tiga metode pengambilan keputusan terbaik dalam satu platform terintegrasi
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                      <motion.div 
                        className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}
                        animate={{ 
                          scale: hoveredFeature === index ? 1.1 : 1,
                          rotate: hoveredFeature === index ? 5 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl text-slate-800">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-slate-600 text-center leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Mengapa Memilih DSS Tools?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Platform yang dirancang khusus untuk memudahkan analisis dan pengambilan keputusan
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Siap Membuat Keputusan yang Lebih Baik?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Bergabung dengan ribuan profesional yang sudah menggunakan DSS Tools untuk analisis mereka
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Mulai Sekarang - Gratis
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">DSS Tools</span>
          </div>
          <p className="text-slate-400">
            © 2024 DSS Tools. Platform Decision Support System terdepan di Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
