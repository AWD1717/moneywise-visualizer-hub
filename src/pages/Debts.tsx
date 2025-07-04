
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle, Calendar } from "lucide-react";
import { useDebts } from "@/hooks/useDebts";

const Debts = () => {
  const { data: debts, isLoading } = useDebts();

  if (isLoading) {
    return <div>Loading debts...</div>;
  }

  const totalDebt = debts?.reduce((sum, debt) => sum + (debt.balance || 0), 0) || 0;
  const totalMinimumPayments = debts?.reduce((sum, debt) => sum + (debt.minimum_payment || 0), 0) || 0;
  const averageInterestRate = debts && debts.length > 0 
    ? debts.reduce((sum, debt) => sum + (debt.interest_rate || 0), 0) / debts.length 
    : 0;

  const getStrategyColor = (strategy: string) => {
    switch (strategy?.toLowerCase()) {
      case "avalanche":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "snowball":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "standard":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Debts</h2>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Debt
        </Button>
      </div>

      {/* Debt Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Debt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">${totalDebt.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Minimums</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMinimumPayments.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Interest Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{averageInterestRate.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Debts List */}
      <div className="space-y-4">
        {debts
          ?.sort((a, b) => (b.interest_rate || 0) - (a.interest_rate || 0))
          .map((debt) => {
            const daysUntilDue = debt.due_date ? getDaysUntilDue(debt.due_date) : 0;
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;
            
            return (
              <Card key={debt.id} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{debt.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStrategyColor(debt.strategy || "")}>
                            {debt.strategy}
                          </Badge>
                          {debt.due_date && (
                            <Badge variant={isOverdue ? "destructive" : isDueSoon ? "secondary" : "outline"}>
                              <Calendar className="w-3 h-3 mr-1" />
                              {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : 
                               isDueSoon ? `Due in ${daysUntilDue} days` : 
                               `Due ${new Date(debt.due_date).toLocaleDateString()}`}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-500">${(debt.balance || 0).toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{debt.interest_rate}% APR</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Minimum Payment</p>
                        <p className="text-lg font-semibold">${(debt.minimum_payment || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Interest</p>
                        <p className="text-lg font-semibold text-red-500">
                          ${(((debt.balance || 0) * (debt.interest_rate || 0) / 100) / 12).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {debt.notes && (
                      <div className="p-3 bg-accent/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">{debt.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Make Payment
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit Strategy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default Debts;
