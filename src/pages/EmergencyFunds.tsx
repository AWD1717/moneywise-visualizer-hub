
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-medium text-red-500">Error loading emergency fund data</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!emergencyFund) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Emergency Fund</h2>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Setup Emergency Fund
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Setup Emergency Fund</DialogTitle>
              </DialogHeader>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  updateEmergencyFund.mutate({
                    accumulated_funds: parseFloat(formData.accumulated_funds) || 0,
                    custom_target: parseFloat(formData.custom_target) || 0,
                    monthly_expenses: parseFloat(formData.monthly_expenses) || 0,
                    job_stability: formData.job_stability,
                    dependents: parseInt(formData.dependents) || 0,
                    recommended_range: formData.recommended_range
                  });
                  setIsModalOpen(false);
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="monthly_expenses">Monthly Expenses ($)</Label>
                  <Input
                    id="monthly_expenses"
                    type="number"
                    value={formData.monthly_expenses}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthly_expenses: e.target.value }))}
                    placeholder="5000"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="job_stability">Job Stability</Label>
                  <Select value={formData.job_stability} onValueChange={(value) => setFormData(prev => ({ ...prev, job_stability: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job stability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="unstable">Unstable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dependents">Number of Dependents</Label>
                  <Input
                    id="dependents"
                    type="number"
                    value={formData.dependents}
                    onChange={(e) => setFormData(prev => ({ ...prev, dependents: e.target.value }))}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="recommended_range">Recommended Range</Label>
                  <Select value={formData.recommended_range} onValueChange={(value) => setFormData(prev => ({ ...prev, recommended_range: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recommended range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="6-9 months">6-9 months</SelectItem>
                      <SelectItem value="9-12 months">9-12 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="custom_target">Target Amount ($)</Label>
                  <Input
                    id="custom_target"
                    type="number"
                    value={formData.custom_target}
                    onChange={(e) => setFormData(prev => ({ ...prev, custom_target: e.target.value }))}
                    placeholder="30000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="accumulated_funds">Current Accumulated Funds ($)</Label>
                  <Input
                    id="accumulated_funds"
                    type="number"
                    value={formData.accumulated_funds}
                    onChange={(e) => setFormData(prev => ({ ...prev, accumulated_funds: e.target.value }))}
                    placeholder="10000"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={updateEmergencyFund.isPending} className="flex-1">
                    {updateEmergencyFund.isPending ? "Setting up..." : "Setup Emergency Fund"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Emergency Fund Setup</h3>
            <p className="text-muted-foreground text-center mb-6">
              Set up your emergency fund to track your financial safety net and get personalized recommendations.
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Setup Emergency Fund
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
        <h2 className="text-3xl font-bold tracking-tight">Emergency Fund</h2>
        <Button className="bg-primary hover:bg-primary/90">
          <TrendingUp className="w-4 h-4 mr-2" />
          Add Funds
        </Button>
      </div>

      {/* Emergency Fund Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Emergency Fund Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Amount</span>
              <span className="text-2xl font-bold text-primary">${(accumulated_funds || 0).toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Target Amount</span>
              <span className="text-lg font-semibold">${(custom_target || 0).toLocaleString()}</span>
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
                <span className="text-sm text-muted-foreground">Still Need</span>
                <span className={`font-semibold ${(funding_deficit || 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ${(funding_deficit || 0) > 0 ? (funding_deficit || 0).toLocaleString() : '0'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Fund Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Job Stability</p>
                <Badge className={getStabilityColor(job_stability || "")}>
                  {job_stability}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dependents</p>
                <p className="text-lg font-semibold">{dependents}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Monthly Expenses</p>
              <p className="text-lg font-semibold">${(monthly_expenses || 0).toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Recommended Range</p>
              <p className="text-lg font-semibold">{recommended_range}</p>
            </div>
            
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">Current Coverage</p>
              <p className="text-2xl font-bold text-primary">
                {monthsCovered.toFixed(1)} months
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completionPercentage < 100 && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-500 mb-1">Action Required</h4>
                    <p className="text-sm text-muted-foreground">
                      You need ${(funding_deficit || 0).toLocaleString()} more to reach your emergency fund target. 
                      Consider setting up automatic transfers of ${Math.round((funding_deficit || 0) / 12).toLocaleString()} 
                      per month to reach your goal within a year.
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
                    <h4 className="font-semibold text-green-500 mb-1">Congratulations!</h4>
                    <p className="text-sm text-muted-foreground">
                      You've reached your emergency fund target. Consider reviewing your target annually 
                      or when your expenses change significantly.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-3 bg-accent/50 rounded-lg">
                <h5 className="font-medium mb-1">High-Yield Savings</h5>
                <p className="text-xs text-muted-foreground">
                  Keep your emergency fund in a high-yield savings account for easy access and growth.
                </p>
              </div>
              
              <div className="p-3 bg-accent/50 rounded-lg">
                <h5 className="font-medium mb-1">Separate Account</h5>
                <p className="text-xs text-muted-foreground">
                  Keep emergency funds separate from daily spending to avoid temptation.
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
