
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, TrendingDown } from "lucide-react";
import { useDebts } from "@/hooks/useDebts";
import { AddDebtModal } from "@/components/modals/AddDebtModal";
import { PayDebtModal } from "@/components/modals/PayDebtModal";
import { DebtDetailModal } from "@/components/modals/DebtDetailModal";
import { formatRupiah } from "@/utils/currency";

const Debts = () => {
  const { data: debts, isLoading } = useDebts();

  if (isLoading) {
    return <div>Loading debts...</div>;
  }

  const totalDebt = debts?.reduce((sum, debt) => sum + (debt.balance || 0), 0) || 0;
  const totalMinimumPayment = debts?.reduce((sum, debt) => sum + (debt.minimum_payment || 0), 0) || 0;

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Hutang</h2>
        <AddDebtModal />
      </div>

      {/* Debt Summary */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hutang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-500">{formatRupiah(totalDebt)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pembayaran Minimum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-orange-500">{formatRupiah(totalMinimumPayment)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jumlah Hutang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-primary">{debts?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Debt List - Minimalist Design */}
      <div className="grid gap-4 grid-cols-1">
        {debts?.map((debt) => {
          const daysUntilDue = debt.due_date ? getDaysUntilDue(debt.due_date) : null;
          const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
          const isDueSoon = daysUntilDue !== null && daysUntilDue <= 7 && daysUntilDue >= 0;

          return (
            <Card key={debt.id} className="bg-card border-border">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Section - Basic Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <h3 className="font-semibold text-base sm:text-lg truncate">{debt.name}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          {isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Terlambat
                            </Badge>
                          )}
                          {isDueSoon && !isOverdue && (
                            <Badge variant="secondary" className="text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              Jatuh Tempo Segera
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium text-red-500">{formatRupiah(debt.balance || 0)}</span>
                          <p>Saldo</p>
                        </div>
                        <div>
                          <span className="font-medium">{debt.interest_rate}%</span>
                          <p>Bunga</p>
                        </div>
                        <div>
                          <span className="font-medium">{formatRupiah(debt.minimum_payment || 0)}</span>
                          <p>Min. Bayar</p>
                        </div>
                        <div>
                          <span className="font-medium">
                            {debt.due_date ? new Date(debt.due_date).toLocaleDateString('id-ID') : '-'}
                          </span>
                          <p>Jatuh Tempo</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <PayDebtModal debt={debt} />
                    <DebtDetailModal debt={debt} />
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
