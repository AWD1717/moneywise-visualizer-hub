
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, User, Bell, Shield, Database, Webhook } from "lucide-react";
import { WebhookSettingsModal } from "@/components/modals/WebhookSettingsModal";

const Settings = () => {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div className="flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8" />
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Pengaturan</h2>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {/* Profile Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" />
              Profil Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-medium">Informasi Akun</h3>
                <p className="text-sm text-muted-foreground">Kelola informasi profil dan preferensi akun Anda</p>
              </div>
              <Button variant="outline">Edit Profil</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5" />
              Notifikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-medium">Pengaturan Pemberitahuan</h3>
                <p className="text-sm text-muted-foreground">Atur kapan dan bagaimana Anda ingin menerima notifikasi</p>
              </div>
              <Button variant="outline">Kelola Notifikasi</Button>
            </div>
          </CardContent>
        </Card>

        {/* SuperChat Webhook Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Webhook className="w-5 h-5" />
              SuperChat Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-medium">Webhook Configuration</h3>
                <p className="text-sm text-muted-foreground">Konfigurasi webhook untuk integrasi SuperChat dengan sistem eksternal</p>
                <Badge variant="secondary" className="mt-2">SuperChat</Badge>
              </div>
              <WebhookSettingsModal />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5" />
              Keamanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-medium">Password & Security</h3>
                <p className="text-sm text-muted-foreground">Kelola password dan pengaturan keamanan akun</p>
              </div>
              <Button variant="outline">Ubah Password</Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="w-5 h-5" />
              Manajemen Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-medium">Export Data</h3>
                  <p className="text-sm text-muted-foreground">Download data keuangan Anda dalam format CSV atau Excel</p>
                </div>
                <Button variant="outline">Export Data</Button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                <div>
                  <h3 className="font-medium">Backup & Restore</h3>
                  <p className="text-sm text-muted-foreground">Buat backup data atau restore dari backup sebelumnya</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Backup</Button>
                  <Button variant="outline">Restore</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-card border-border border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-red-600">
              <Shield className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-medium text-red-600">Hapus Akun</h3>
                <p className="text-sm text-muted-foreground">Tindakan ini akan menghapus akun dan semua data secara permanen</p>
              </div>
              <Button variant="destructive">Hapus Akun</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
