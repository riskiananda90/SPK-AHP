
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password dan konfirmasi password tidak cocok",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Registrasi Berhasil",
        description: "Akun Anda telah dibuat. Silakan login untuk melanjutkan.",
      });
      navigate('/login');
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex rounded-2xl shadow-2xl bg-white overflow-hidden">
        {/* Left Side - Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-cyan-600 to-blue-600 items-center justify-center p-12"
        >
          <div className="text-center text-white">
            <div className="w-32 h-32 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Calculator className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Bergabung dengan DSS Tools
            </h2>
            <p className="text-xl text-purple-100 leading-relaxed">
              Mulai membuat keputusan yang lebih baik dengan analisis data yang komprehensif
            </p>
          </div>
        </motion.div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">DSS Tools</span>
            </div>

            <Card className="border-0 shadow-none">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-3xl font-bold text-slate-800 mb-2">
                  Buat Akun Baru
                </CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Daftar untuk mulai menggunakan DSS Tools
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-slate-700 font-medium">
                      Nama Lengkap
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="nama@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-slate-700 font-medium">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Pilih username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Buat password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-700 font-medium">
                      Konfirmasi Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Ulangi password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? "Sedang mendaftar..." : "Daftar Sekarang"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <span className="text-slate-600">Sudah punya akun? </span>
                  <Link 
                    to="/login" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Masuk sekarang
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
