
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle } from "lucide-react";
import { CreateBudgetModal } from "@/components/modals/CreateBudgetModal";
import { EditBudgetModal } from "@/components/modals/EditBudgetModal";
import { DeleteBudgetModal } from "@/components/modals/DeleteBudgetModal";
import { useBudgets } from "@/hooks/useBudgets";

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp');
};

const Budgets = () => {
  const { data: budgets = [], isLoading } = useBudgets();

  const getBudgetStatus = (allocated: number, actual: number) => {
    const percentage = (actual / allocated) * 100;
    if (percentage <= 80) return { status: "under", color: "text-green-500", icon: CheckCircle };
    if (percentage <= 100) return { status: "near", color: "text-yellow-500", icon: AlertCircle };
    return { status: "over", color: "text-red-500", icon: AlertCircle };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalAllocated = budgets.reduce((sum, budget) => sum + (budget.allocated_amount || 0), 0);
  const totalExpected = budgets.reduce((sum, budget) => sum + budget.expected_amount, 0);

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Budget</h2>
        <CreateBudgetModal />
      </div>

      {/* Budget Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-primary">{formatRupiah(totalExpected)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Allocated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatRupiah(totalAllocated)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xl sm:text-2xl font-bold ${totalExpected - totalAllocated >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatRupiah(Math.abs(totalExpected - totalAllocated))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Budget List</CardTitle>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Belum ada budget yang dibuat.</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {budgets.map((budget) => {
                const { status, color, icon: StatusIcon } = getBudgetStatus(budget.allocated_amount || 0, budget.expected_amount);
                const percentage = Math.min(((budget.allocated_amount || 0) / budget.expected_amount) * 100, 100);
                
                return (
                  <div key={budget.id} className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="font-medium text-base">{budget.categories?.name || 'Kategori tidak diketahui'}</h3>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-4 h-4 ${color}`} />
                          <Badge variant="outline" className="text-xs">
                            {budget.month} {budget.year}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {formatRupiah(budget.allocated_amount || 0)} / {formatRupiah(budget.expected_amount)}
                          </div>
                          <div className={`text-xs ${color}`}>
                            {(((budget.allocated_amount || 0) / budget.expected_amount) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <EditBudgetModal budget={budget} />
                          <DeleteBudgetModal budget={budget} />
                        </div>
                      </div>
                    </div>
                    
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                      <span>Remaining: {formatRupiah(budget.expected_amount - (budget.allocated_amount || 0))}</span>
                      <Badge variant={status === "over" ? "destructive" : status === "near" ? "secondary" : "default"} className="w-fit">
                        {status === "over" ? "Over Budget" : status === "near" ? "Near Limit" : "On Track"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Budgets;
