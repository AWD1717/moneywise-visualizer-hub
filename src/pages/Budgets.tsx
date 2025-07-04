
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, CheckCircle } from "lucide-react";

// Mock data - replace with Supabase data
const mockBudgets = [
  {
    id: "1",
    category: "Food & Dining",
    expectedAmount: 1500,
    allocatedAmount: 1500,
    actualSpent: 1200,
    month: "January",
    year: 2024,
  },
  {
    id: "2",
    category: "Transportation",
    expectedAmount: 800,
    allocatedAmount: 800,
    actualSpent: 950,
    month: "January",
    year: 2024,
  },
  {
    id: "3",
    category: "Entertainment",
    expectedAmount: 400,
    allocatedAmount: 400,
    actualSpent: 280,
    month: "January",
    year: 2024,
  },
  {
    id: "4",
    category: "Shopping",
    expectedAmount: 600,
    allocatedAmount: 600,
    actualSpent: 750,
    month: "January",
    year: 2024,
  },
];

const Budgets = () => {
  const getBudgetStatus = (allocated: number, actual: number) => {
    const percentage = (actual / allocated) * 100;
    if (percentage <= 80) return { status: "under", color: "text-green-500", icon: CheckCircle };
    if (percentage <= 100) return { status: "near", color: "text-yellow-500", icon: AlertCircle };
    return { status: "over", color: "text-red-500", icon: AlertCircle };
  };

  const totalAllocated = mockBudgets.reduce((sum, budget) => sum + budget.allocatedAmount, 0);
  const totalSpent = mockBudgets.reduce((sum, budget) => sum + budget.actualSpent, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {/* Budget Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Allocated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalAllocated.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalAllocated - totalSpent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${Math.abs(totalAllocated - totalSpent).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>January 2024 Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockBudgets.map((budget) => {
              const { status, color, icon: StatusIcon } = getBudgetStatus(budget.allocatedAmount, budget.actualSpent);
              const percentage = Math.min((budget.actualSpent / budget.allocatedAmount) * 100, 100);
              
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{budget.category}</h3>
                      <StatusIcon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        ${budget.actualSpent.toLocaleString()} / ${budget.allocatedAmount.toLocaleString()}
                      </div>
                      <div className={`text-xs ${color}`}>
                        {((budget.actualSpent / budget.allocatedAmount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={percentage} 
                    className="h-2"
                  />
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Remaining: ${(budget.allocatedAmount - budget.actualSpent).toLocaleString()}</span>
                    <Badge variant={status === "over" ? "destructive" : status === "near" ? "secondary" : "default"}>
                      {status === "over" ? "Over Budget" : status === "near" ? "Near Limit" : "On Track"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Budgets;
