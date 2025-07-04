
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, AlertTriangle, Calendar, TrendingDown } from "lucide-react";
import { useDebts } from "@/hooks/useDebts";
import { AddDebtModal } from "@/components/modals/AddDebtModal";
import { formatRupiah } from "@/utils/currency";

const Debts = () => {
  const { data: debts, isLoading } = useDebts();

  if (isLoading) {
    return <div>Loading debts...</div>;
  }

  const totalDebt = debts?.reduce((sum, debt) => sum + (debt.balance || 0), 0) || 0;
  const totalMinimumPayment = debts?.reduce((sum, debt) => sum + (debt.minimum_payment || 0), 0) || 0;

  const getStrategyColor = (strategy: string) => {
    switch (strategy?.toLowerCase()) {
      case 'avalanche':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'snowball':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'minimum':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
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
        <h2 className="text-3xl font-bold tracking-tight">Hutang</h2>
        <AddDebtModal />
      </div>

      {/* Debt Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hutang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatRupiah(totalDebt)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pembayaran Minimum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{formatRupiah(totalMinimumPayment)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jumlah Hutang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{debts?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Debt List */}
      <div className="grid gap-4">
        {debts?.map((debt) => {
          const daysUntilDue = debt.due_date ? getDaysUntilDue(debt.due_date) : null;
          const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
          const isDueSoon = daysUntilDue !== null && daysUntilDue <= 7 && daysUntilDue >= 0;

          return (
            <Card key={debt.id} className="bg-card border-border hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{debt.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {debt.strategy && (
                          <Badge className={getStrategyColor(debt.strategy)}>
                            {debt.strategy}
                          </Badge>
                        )}
                        {isOverdue && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Terlambat
                          </Badge>
                        )}
                        {isDueSoon && !isOverdue && (
                          <Badge variant="secondary">
                            <Calendar className="w-3 h-3 mr-1" />
                            Jatuh Tempo Segera
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-500">{formatRupiah(debt.balance || 0)}</p>
                    <p className="text-sm text-muted-foreground">Saldo Hutang</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Bunga</p>
                      <p className="font-medium">{debt.interest_rate}% per tahun</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pembayaran Minimum</p>
                      <p className="font-medium">{formatRupiah(debt.minimum_payment || 0)}</p>
                    </div>
                  </div>

                  {debt.due_date && (
                    <div>
                      <p className="text-sm text-muted-foreground">Jatuh Tempo</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-medium">
                          {new Date(debt.due_date).toLocaleDateString('id-ID')}
                        </p>
                        {daysUntilDue !== null && (
                          <span className={`text-sm ${
                            isOverdue ? 'text-red-500' : isDueSoon ? 'text-orange-500' : 'text-muted-foreground'
                          }`}>
                            ({daysUntilDue > 0 ? `${daysUntilDue} hari lagi` : 
                              daysUntilDue === 0 ? 'Hari ini' : 
                              `${Math.abs(daysUntilDue)} hari terlambat`})
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {debt.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Catatan</p>
                      <p className="text-sm">{debt.notes}</p>
                    </div>
                  )}

                  {/* Progress Bar - This could show payment progress if you track payments */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress Pembayaran</span>
                      <span className="text-muted-foreground">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Bayar Sekarang
                    </Button>
                    <Button variant="outline" size="sm">
                      Detail
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {debts?.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="text-center py-12">
            <TrendingDown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tidak ada hutang</h3>
            <p className="text-muted-foreground mb-6">
              Anda belum memiliki catatan hutang. Tambahkan hutang untuk melacak pembayaran.
            </p>
            <AddDebtModal />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Debts;
