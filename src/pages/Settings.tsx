
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Database, Bell, Shield, Download } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <Badge variant="outline" className="text-primary border-primary/20">
          <Database className="w-3 h-3 mr-1" />
          Supabase Connected
        </Badge>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </Label>
                <Input id="firstName" placeholder="John" className="bg-background border-border" />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </Label>
                <Input id="lastName" placeholder="Doe" className="bg-background border-border" />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" className="bg-background border-border" />
            </div>
            <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Budget Alerts</Label>
                <p className="text-xs text-muted-foreground">Get notified when you're close to budget limits</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Bill Reminders</Label>
                <p className="text-xs text-muted-foreground">Receive reminders for upcoming bills</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Investment Updates</Label>
                <p className="text-xs text-muted-foreground">Get notified about significant portfolio changes</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Monthly Reports</Label>
                <p className="text-xs text-muted-foreground">Receive monthly financial summary reports</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-sm font-medium">
                Current Password
              </Label>
              <Input id="currentPassword" type="password" className="bg-background border-border" />
            </div>
            <div>
              <Label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </Label>
              <Input id="newPassword" type="password" className="bg-background border-border" />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </Label>
              <Input id="confirmPassword" type="password" className="bg-background border-border" />
            </div>
            <Button variant="outline">Change Password</Button>
            
            <Separator className="my-4" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline" size="sm">Enable 2FA</Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Database Connection</Label>
                <p className="text-xs text-muted-foreground">Connected to Supabase database</p>
              </div>
              <Badge variant="outline" className="text-green-500 border-green-500/20">
                Connected
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto Backup</Label>
                <p className="text-xs text-muted-foreground">Automatically backup your data weekly</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Export Data</Label>
                <p className="text-xs text-muted-foreground">Download your financial data</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-red-500">Delete Account</Label>
                <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
