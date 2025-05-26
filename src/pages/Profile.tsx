
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Mail, User, Phone, MapPin, Calendar, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { analytics, loading: analyticsLoading } = useUserAnalytics();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      const { error } = await updateProfile(formData);
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (profileLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Profile</h1>
          <p className="text-slate-600 dark:text-slate-400">Kelola informasi profil dan pengaturan akun Anda</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-2xl">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <CardTitle className="dark:text-slate-200">{profile?.full_name || 'User'}</CardTitle>
                <CardDescription className="dark:text-slate-400">DSS Analyst</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                    <Mail className="w-4 h-4" />
                    <span>{profile?.email || user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                    <Phone className="w-4 h-4" />
                    <span>{profile?.phone || 'Belum diisi'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>{profile?.location || 'Belum diisi'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Bergabung {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : ''}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="dark:text-slate-200">Informasi Personal</CardTitle>
                    <CardDescription className="dark:text-slate-400">Kelola informasi profil Anda</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="dark:text-slate-300">Nama Lengkap</Label>
                    <Input
                      id="fullName"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      disabled={!isEditing}
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-slate-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      disabled={!isEditing}
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="dark:text-slate-300">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="dark:text-slate-300">Lokasi</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      disabled={!isEditing}
                      className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="dark:text-slate-300">Bio</Label>
                  <textarea
                    id="bio"
                    className="w-full min-h-[100px] px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed dark:bg-slate-700 dark:text-slate-200"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="dark:text-slate-200">Statistik Aktivitas</CardTitle>
              <CardDescription className="dark:text-slate-400">Ringkasan aktivitas Anda di platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {analyticsLoading ? '...' : (analytics?.total_projects || 0)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Project</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {analyticsLoading ? '...' : (analytics?.completed_projects || 0)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Project Selesai</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {analyticsLoading ? '...' : (analytics?.in_progress_projects || 0)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Dalam Progress</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {analyticsLoading ? '...' : (analytics?.total_projects || 0)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Analisis</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
