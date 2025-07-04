import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, TrendingUp, AlertCircle, CheckCircle, Plus } from "lucide-react";
import { useEmergencyFunds } from "@/hooks/useEmergencyFunds";
import { useUpdateEmergencyFund } from "@/hooks/useEmergencyFundMutations";

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp');
};

const EmergencyFunds = () => {
  const { data: emergencyFund, isLoading, error } = useEmergencyFunds();
  const updateEmergencyFund = useUpdateEmergencyFund();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    accumulated_funds: "",
    custom_target: "",
    monthly_expenses: "",
    job_stability: "",
    dependents: "",
    recommended_range: ""
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-4 text-muted-foreground">Memuat data dana darurat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-red-500">Error memuat data dana darurat</p>
          <p className="text-sm text-muted-foreground">Silakan coba lagi nanti</p>
        </div>
      </div>
    );
  }

  if (!emergencyFund) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dana Darurat</h2>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Setup Dana Darurat
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Setup Dana Darurat</DialogTitle>
              </DialogHeader>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = parseFloat(formData.custom_target) || 0;
                  const accumulated = parseFloat(formData.accumulated_funds) || 0;
                  const deficit = Math.max(0, target - accumulated);
                  
                  updateEmergencyFund.mutate({
                    accumulated_funds: accumulated,
                    custom_target: target,
                    monthly_expenses: parseFloat(formData.monthly_expenses) || 0,
                    job_stability: formData.job_stability,
                    dependents: parseInt(formData.dependents) || 0,
                    recommended_range: formData.recommended_range,
                    funding_deficit: deficit
                  });
                  setIsModalOpen(false);
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="monthly_expenses">Pengeluaran Bulanan (Rp)</Label>
                  <Input
                    id="monthly_expenses"
                    type="number"
                    step="1000"
                    value={formData.monthly_expenses}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthly_expenses: e.target.value }))}
                    placeholder="5000000"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="job_stability">Stabilitas Pekerjaan</Label>
                  <Select value={formData.job_stability} onValueChange={(value) => setFormData(prev => ({ ...prev, job_stability: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih stabilitas pekerjaan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stable">Stabil</SelectItem>
                      <SelectItem value="moderate">Sedang</SelectItem>
                      <SelectItem value="unstable">Tidak Stabil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dependents">Jumlah Tanggungan</Label>
                  <Input
                    id="dependents"
                    type="number"
                    value={formData.dependents}
                    onChange={(e) => setFormData(prev => ({ ...prev, dependents: e.target.value }))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="recommended_range">Rentang Rekomendasi</Label>
                  <Select value={formData.recommended_range} onValueChange={(value) => setFormData(prev => ({ ...prev, recommended_range: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih rentang rekomendasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-6 bulan">3-6 bulan</SelectItem>
                      <SelectItem value="6-9 bulan">6-9 bulan</SelectItem>
                      <SelectItem value="9-12 bulan">9-12 bulan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="custom_target">Target Amount (Rp)</Label>
                  <Input
                    id="custom_target"
                    type="number"
                    step="1000"
                    value={formData.custom_target}
                    onChange={(e) => setFormData(prev => ({ ...prev, custom_target: e.target.value }))}
                    placeholder="30000000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="accumulated_funds">Dana Terkumpul Saat Ini (Rp)</Label>
                  <Input
                    id="accumulated_funds"
                    type="number"
                    step="1000"
                    value={formData.accumulated_funds}
                    onChange={(e) => setFormData(prev => ({ ...prev, accumulated_funds: e.target.value }))}
                    placeholder="10000000"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={updateEmergencyFund.isPending} className="flex-1">
                    {updateEmergencyFund.isPending ? "Setting up..." : "Setup Dana Darurat"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Belum ada data dana darurat</h3>
            <p className="text-muted-foreground text-center mb-6">
              Setup dana darurat Anda untuk melacak jaring pengaman finansial dan mendapatkan rekomendasi yang dipersonalisasi.
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Setup Dana Darurat
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { 
    job_stability, 
    dependents, 
    monthly_expenses, 
    recommended_range, 
    custom_target, 
    accumulated_funds, 
    funding_deficit 
  } = emergencyFund;

  const completionPercentage = (custom_target || 0) > 0 ? ((accumulated_funds || 0) / (custom_target || 1)) * 100 : 0;
  const monthsCovered = (monthly_expenses || 0) > 0 ? (accumulated_funds || 0) / (monthly_expenses || 1) : 0;
  
  const getStabilityColor = (stability: string) => {
    switch (stability?.toLowerCase()) {
      case "stable":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "moderate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "unstable":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getProgressColor = () => {
    if (completionPercentage >= 100) return "text-green-500";
    if (completionPercentage >= 75) return "text-blue-500";
    if (completionPercentage >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusIcon = () => {
    if (completionPercentage >= 100) return CheckCircle;
    if (completionPercentage >= 75) return TrendingUp;
    return AlertCircle;
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dana Darurat</h2>
        <Button className="bg-primary hover:bg-primary/90">
          <TrendingUp className="w-4 h-4 mr-2" />
          Tambah Dana
        </Button>
      </div>

      {/* Emergency Fund Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Status Dana Darurat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Jumlah Saat Ini</span>
              <span className="text-2xl font-bold text-primary">{formatRupiah(accumulated_funds || 0)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Target Amount</span>
              <span className="text-lg font-semibold">{formatRupiah(custom_target || 0)}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progress</span>
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-4 h-4 ${getProgressColor()}`} />
                  <span className={`font-semibold ${getProgressColor()}`}>
                    {completionPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Progress value={Math.min(completionPercentage, 100)} className="h-3" />
            </div>
            
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Masih Perlu</span>
                <span className={`font-semibold ${(funding_deficit || 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {formatRupiah((funding_deficit || 0) > 0 ? (funding_deficit || 0) : 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Analisis Dana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Stabilitas Pekerjaan</p>
                <Badge className={getStabilityColor(job_stability || "")}>
                  {job_stability === 'stable' ? 'Stabil' : job_stability === 'moderate' ? 'Sedang' : 'Tidak Stabil'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tanggungan</p>
                <p className="text-lg font-semibold">{dependents}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Pengeluaran Bulanan</p>
              <p className="text-lg font-semibold">{formatRupiah(monthly_expenses || 0)}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Rentang Rekomendasi</p>
              <p className="text-lg font-semibold">{recommended_range}</p>
            </div>
            
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">Cakupan Saat Ini</p>
              <p className="text-2xl font-bold text-primary">
                {monthsCovered.toFixed(1)} bulan
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Rekomendasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completionPercentage < 100 && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-500 mb-1">Tindakan Diperlukan</h4>
                    <p className="text-sm text-muted-foreground">
                      Anda memerlukan {formatRupiah(funding_deficit || 0)} lagi untuk mencapai target dana darurat. 
                      Pertimbangkan untuk mengatur transfer otomatis sebesar {formatRupiah(Math.round((funding_deficit || 0) / 12))} 
                      per bulan untuk mencapai target dalam setahun.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {completionPercentage >= 100 && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-500 mb-1">Selamat!</h4>
                    <p className="text-sm text-muted-foreground">
                      Anda telah mencapai target dana darurat. Pertimbangkan untuk meninjau target Anda secara tahunan 
                      atau ketika pengeluaran Anda berubah secara signifikan.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-3 bg-accent/50 rounded-lg">
                <h5 className="font-medium mb-1">Tabungan Berbunga Tinggi</h5>
                <p className="text-xs text-muted-foreground">
                  Simpan dana darurat di rekening tabungan berbunga tinggi untuk akses mudah dan pertumbuhan.
                </p>
              </div>
              
              <div className="p-3 bg-accent/50 rounded-lg">
                <h5 className="font-medium mb-1">Rekening Terpisah</h5>
                <p className="text-xs text-muted-foreground">
                  Pisahkan dana darurat dari pengeluaran harian untuk menghindari godaan.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyFunds;
