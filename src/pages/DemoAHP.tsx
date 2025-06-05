
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  ArrowLeft, 
  Lock, 
  User, 
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDemoAHP } from '@/hooks/useDemoAHP';

const DemoAHP = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    loading, 
    error, 
    checkDemoUsage, 
    incrementDemoUsage, 
    createDemoProject 
  } = useDemoAHP();

  const [canUseDemo, setCanUseDemo] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [checkingUsage, setCheckingUsage] = useState(true);
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    project_name: '',
    problem_statement: '',
    criteria: [''],
    alternatives: ['']
  });

  useEffect(() => {
    checkUsageLimit();
  }, []);

  const checkUsageLimit = async () => {
    setCheckingUsage(true);
    const { canUseDemo, usageCount } = await checkDemoUsage();
    setCanUseDemo(canUseDemo);
    setUsageCount(usageCount);
    setCheckingUsage(false);

    if (!canUseDemo && usageCount >= 2) {
      toast({
        title: "Batas Demo Tercapai",
        description: "Anda sudah mencoba demo ini. Silakan daftar untuk menggunakan fitur lengkap.",
        variant: "destructive"
      });
    }
  };

  const handleCreateProject = async () => {
    if (!projectData.project_name.trim()) {
      toast({
        title: "Error",
        description: "Nama project harus diisi",
        variant: "destructive"
      });
      return;
    }

    const validCriteria = projectData.criteria.filter(c => c.trim() !== '');
    const validAlternatives = projectData.alternatives.filter(a => a.trim() !== '');

    if (validCriteria.length < 2) {
      toast({
        title: "Error", 
        description: "Minimal 2 kriteria diperlukan",
        variant: "destructive"
      });
      return;
    }

    if (validAlternatives.length < 2) {
      toast({
        title: "Error",
        description: "Minimal 2 alternatif diperlukan", 
        variant: "destructive"
      });
      return;
    }

    const project = await createDemoProject({
      project_name: projectData.project_name,
      problem_statement: projectData.problem_statement,
      criteria: validCriteria,
      alternatives: validAlternatives
    });

    if (project) {
      await incrementDemoUsage();
      toast({
        title: "Demo Project Berhasil Dibuat",
        description: "Project demo AHP telah dibuat. Ini adalah percobaan terakhir Anda.",
      });
      setStep(3);
    } else {
      toast({
        title: "Error",
        description: error || "Gagal membuat project demo",
        variant: "destructive"
      });
    }
  };

  const addCriterion = () => {
    if (projectData.criteria.length < 5) {
      setProjectData(prev => ({
        ...prev,
        criteria: [...prev.criteria, '']
      }));
    }
  };

  const removeCriterion = (index: number) => {
    if (projectData.criteria.length > 1) {
      setProjectData(prev => ({
        ...prev,
        criteria: prev.criteria.filter((_, i) => i !== index)
      }));
    }
  };

  const addAlternative = () => {
    if (projectData.alternatives.length < 5) {
      setProjectData(prev => ({
        ...prev,
        alternatives: [...prev.alternatives, '']
      }));
    }
  };

  const removeAlternative = (index: number) => {
    if (projectData.alternatives.length > 1) {
      setProjectData(prev => ({
        ...prev,
        alternatives: prev.alternatives.filter((_, i) => i !== index)
      }));
    }
  };

  const updateCriterion = (index: number, value: string) => {
    setProjectData(prev => ({
      ...prev,
      criteria: prev.criteria.map((item, i) => i === index ? value : item)
    }));
  };

  const updateAlternative = (index: number, value: string) => {
    setProjectData(prev => ({
      ...prev,
      alternatives: prev.alternatives.map((item, i) => i === index ? value : item)
    }));
  };

  if (checkingUsage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Memeriksa batas penggunaan demo...</p>
        </div>
      </div>
    );
  }

  if (!canUseDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-slate-800">
                Batas Demo Tercapai
              </CardTitle>
              <CardDescription>
                Anda sudah menggunakan demo ini {usageCount} kali. Untuk menggunakan fitur lengkap, silakan buat akun gratis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => navigate('/register')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <User className="w-4 h-4 mr-2" />
                Daftar Gratis Sekarang
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Sudah Punya Akun? Login
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center space-x-2">
                <Calculator className="w-8 h-8 text-blue-600" />
                <span>Demo AHP</span>
              </h1>
              <p className="text-slate-600">Coba fitur AHP secara gratis (sekali percobaan)</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
              <Clock className="w-4 h-4 mr-1" />
              Percobaan {usageCount}/1
            </Badge>
          </div>
        </motion.div>

        {/* Warning Alert */}
        {usageCount === 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-yellow-800 font-medium">
                      Ini adalah demo terbatas - Anda hanya dapat mencoba sekali
                    </p>
                    <p className="text-yellow-700 text-sm">
                      Untuk penggunaan unlimited dan fitur lengkap, silakan daftar akun gratis.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Setup Project Demo</CardTitle>
                <CardDescription>
                  Buat project AHP demo untuk mencoba fitur analisis keputusan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Nama Project</Label>
                  <Input
                    id="projectName"
                    placeholder="Contoh: Pemilihan Laptop Terbaik"
                    value={projectData.project_name}
                    onChange={(e) => setProjectData(prev => ({
                      ...prev,
                      project_name: e.target.value
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problemStatement">Deskripsi Masalah (Opsional)</Label>
                  <Textarea
                    id="problemStatement"
                    placeholder="Jelaskan masalah yang ingin diselesaikan dengan AHP..."
                    value={projectData.problem_statement}
                    onChange={(e) => setProjectData(prev => ({
                      ...prev,
                      problem_statement: e.target.value
                    }))}
                  />
                </div>

                <Button 
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  disabled={!projectData.project_name.trim()}
                >
                  Lanjutkan ke Kriteria & Alternatif
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Kriteria */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Kriteria</span>
                    <Badge variant="secondary">{projectData.criteria.filter(c => c.trim()).length}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Masukkan kriteria untuk evaluasi (min. 2, max. 5)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projectData.criteria.map((criterion, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder={`Kriteria ${index + 1}`}
                        value={criterion}
                        onChange={(e) => updateCriterion(index, e.target.value)}
                      />
                      {projectData.criteria.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCriterion(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {projectData.criteria.length < 5 && (
                    <Button
                      variant="outline"
                      onClick={addCriterion}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Kriteria
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Alternatif */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Alternatif</span>
                    <Badge variant="secondary">{projectData.alternatives.filter(a => a.trim()).length}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Masukkan alternatif pilihan (min. 2, max. 5)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projectData.alternatives.map((alternative, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder={`Alternatif ${index + 1}`}
                        value={alternative}
                        onChange={(e) => updateAlternative(index, e.target.value)}
                      />
                      {projectData.alternatives.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeAlternative(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {projectData.alternatives.length < 5 && (
                    <Button
                      variant="outline"
                      onClick={addAlternative}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Alternatif
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Kembali
              </Button>
              <Button 
                onClick={handleCreateProject}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {loading ? "Membuat..." : "Buat Project Demo"}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-slate-800">
                  Demo Berhasil Dibuat!
                </CardTitle>
                <CardDescription>
                  Project demo AHP Anda telah dibuat. Ini adalah percobaan terakhir yang tersedia.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-slate-800 mb-2">Project: {projectData.project_name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Kriteria:</p>
                      <ul className="list-disc list-inside text-slate-700">
                        {projectData.criteria.filter(c => c.trim()).map((criterion, index) => (
                          <li key={index}>{criterion}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-slate-600">Alternatif:</p>
                      <ul className="list-disc list-inside text-slate-700">
                        {projectData.alternatives.filter(a => a.trim()).map((alternative, index) => (
                          <li key={index}>{alternative}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/register')}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Daftar untuk Fitur Lengkap
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/login')}
                    className="w-full"
                  >
                    Login ke Akun Existing
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Kembali ke Beranda
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DemoAHP;
