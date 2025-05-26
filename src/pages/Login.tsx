
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Login Berhasil",
        description: "Selamat datang kembali di DSS Tools!",
      });
      navigate('/dashboard');
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
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
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
                  Selamat Datang Kembali
                </CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Masuk ke akun Anda untuk melanjutkan analisis
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Label htmlFor="password" className="text-slate-700 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="rememberMe"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                        }
                      />
                      <Label htmlFor="rememberMe" className="text-slate-600 cursor-pointer">
                        Ingat saya
                      </Label>
                    </div>
                    <Link 
                      to="/forgot-password" 
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Lupa password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? "Sedang masuk..." : "Masuk"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <span className="text-slate-600">Belum punya akun? </span>
                  <Link 
                    to="/register" 
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Daftar sekarang
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Side - Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-cyan-600 to-purple-600 items-center justify-center p-12"
        >
          <div className="text-center text-white">
            <div className="w-32 h-32 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Calculator className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Decision Support System
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Platform terdepan untuk analisis pengambilan keputusan dengan metode AHP, SAW, dan TOPSIS
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
