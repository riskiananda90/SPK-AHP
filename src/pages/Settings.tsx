
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Settings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    projects: true,
    updates: false
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    autoSave: true,
    defaultMethod: 'AHP',
    language: 'id'
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
          <p className="text-slate-600">Kelola pengaturan akun dan preferensi aplikasi</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <a href="#account" className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Akun</span>
                  </a>
                  <a href="#notifications" className="flex items-center space-x-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span>Notifikasi</span>
                  </a>
                  <a href="#security" className="flex items-center space-x-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <Shield className="w-5 h-5" />
                    <span>Keamanan</span>
                  </a>
                  <a href="#preferences" className="flex items-center space-x-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <Palette className="w-5 h-5" />
                    <span>Preferensi</span>
                  </a>
                  <a href="#data" className="flex items-center space-x-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <Database className="w-5 h-5" />
                    <span>Data</span>
                  </a>
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              id="account"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Pengaturan Akun
                  </CardTitle>
                  <CardDescription>Kelola informasi akun dasar Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nama Depan</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nama Belakang</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="johndoe" />
                  </div>
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              id="notifications"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Pengaturan Notifikasi
                  </CardTitle>
                  <CardDescription>Atur bagaimana Anda ingin menerima notifikasi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Notifikasi Email</Label>
                      <p className="text-sm text-slate-500">Terima notifikasi via email</p>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Notifikasi Push</Label>
                      <p className="text-sm text-slate-500">Notifikasi langsung di browser</p>
                    </div>
                    <Switch 
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="project-notifications">Update Project</Label>
                      <p className="text-sm text-slate-500">Notifikasi perubahan project</p>
                    </div>
                    <Switch 
                      id="project-notifications"
                      checked={notifications.projects}
                      onCheckedChange={(checked) => setNotifications({...notifications, projects: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="system-updates">Update Sistem</Label>
                      <p className="text-sm text-slate-500">Notifikasi update aplikasi</p>
                    </div>
                    <Switch 
                      id="system-updates"
                      checked={notifications.updates}
                      onCheckedChange={(checked) => setNotifications({...notifications, updates: checked})}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              id="security"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Keamanan
                  </CardTitle>
                  <CardDescription>Kelola keamanan akun Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Password Saat Ini</Label>
                    <div className="relative">
                      <Input 
                        id="current-password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password saat ini"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Password Baru</Label>
                    <Input id="new-password" type="password" placeholder="Masukkan password baru" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                    <Input id="confirm-password" type="password" placeholder="Konfirmasi password baru" />
                  </div>
                  <Button>Ubah Password</Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              id="preferences"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Preferensi
                  </CardTitle>
                  <CardDescription>Sesuaikan pengalaman aplikasi Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode">Mode Gelap</Label>
                      <p className="text-sm text-slate-500">Aktifkan tema gelap</p>
                    </div>
                    <Switch 
                      id="dark-mode"
                      checked={preferences.darkMode}
                      onCheckedChange={(checked) => setPreferences({...preferences, darkMode: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-save">Auto Save</Label>
                      <p className="text-sm text-slate-500">Simpan otomatis perubahan</p>
                    </div>
                    <Switch 
                      id="auto-save"
                      checked={preferences.autoSave}
                      onCheckedChange={(checked) => setPreferences({...preferences, autoSave: checked})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-method">Metode Default</Label>
                    <select 
                      id="default-method"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={preferences.defaultMethod}
                      onChange={(e) => setPreferences({...preferences, defaultMethod: e.target.value})}
                    >
                      <option value="AHP">AHP (Analytic Hierarchy Process)</option>
                      <option value="SAW">SAW (Simple Additive Weighting)</option>
                      <option value="TOPSIS">TOPSIS</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Data Management */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              id="data"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Manajemen Data
                  </CardTitle>
                  <CardDescription>Kelola data dan backup Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Export Data</p>
                      <p className="text-sm text-slate-500">Download semua data project Anda</p>
                    </div>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <p className="font-medium text-red-700">Hapus Akun</p>
                      <p className="text-sm text-red-600">Hapus permanen akun dan semua data</p>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Hapus
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
