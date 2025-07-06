
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useInvestments } from "@/hooks/useInvestments";
import { AddInvestmentModal } from "@/components/modals/AddInvestmentModal";
import { EditInvestmentModal } from "@/components/modals/EditInvestmentModal";
import { DeleteInvestmentModal } from "@/components/modals/DeleteInvestmentModal";
import { formatRupiah } from "@/utils/currency";

const Investments = () => {
  const { data: investments, isLoading } = useInvestments();

  if (isLoading) {
    return <div>Loading investments...</div>;
  }

  const totalInvestmentValue = investments?.reduce((sum, investment) => {
    const currentValue = (investment.current_price || 0) * (investment.quantity || 0);
    return sum + currentValue;
  }, 0) || 0;

  const totalCost = investments?.reduce((sum, investment) => {
    const costValue = (investment.buy_price || 0) * (investment.quantity || 0);
    return sum + costValue;
  }, 0) || 0;

  const totalGainLoss = totalInvestmentValue - totalCost;
  const gainLossPercentage = totalCost > 0 ? ((totalGainLoss / totalCost) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Investasi</h2>
        <AddInvestmentModal />
      </div>

      {/* Investment Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Nilai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-primary">{formatRupiah(totalInvestmentValue)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Modal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{formatRupiah(totalCost)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Keuntungan/Kerugian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-lg sm:text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{formatRupiah(totalGainLoss)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Persentase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-lg sm:text-2xl font-bold flex items-center gap-2 ${gainLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {gainLossPercentage >= 0 ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />}
              {gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment List */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {investments?.map((investment) => {
          const currentValue = (investment.current_price || 0) * (investment.quantity || 0);
          const costValue = (investment.buy_price || 0) * (investment.quantity || 0);
          const gainLoss = currentValue - costValue;
          const gainLossPercent = costValue > 0 ? ((gainLoss / costValue) * 100) : 0;

          return (
            <Card key={investment.id} className="bg-card border-border hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-base sm:text-lg">{investment.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{investment.symbol}</Badge>
                      <Badge variant="secondary" className="text-xs">{investment.type}</Badge>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">Sektor</p>
                    <p className="font-medium text-sm">{investment.sector}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Kuantitas</p>
                      <p className="font-medium text-sm">{investment.quantity?.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Platform</p>
                      <p className="font-medium text-sm">{investment.platform}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Harga Beli</p>
                      <p className="font-medium text-sm">{formatRupiah(investment.buy_price || 0)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Harga Sekarang</p>
                      <p className="font-medium text-sm">{formatRupiah(investment.current_price || 0)}</p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Nilai Sekarang</p>
                        <p className="text-base sm:text-lg font-bold">{formatRupiah(currentValue)}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className={`text-base sm:text-lg font-bold ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {gainLoss >= 0 ? '+' : ''}{formatRupiah(gainLoss)}
                        </p>
                        <p className={`text-xs ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {gainLoss >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <EditInvestmentModal investment={investment} />
                    <DeleteInvestmentModal investment={investment} />
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

export default Investments;
