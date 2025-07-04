
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useInvestments } from "@/hooks/useInvestments";
import { AddInvestmentModal } from "@/components/modals/AddInvestmentModal";
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Investasi</h2>
        <AddInvestmentModal />
      </div>

      {/* Investment Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Nilai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatRupiah(totalInvestmentValue)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Modal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(totalCost)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Keuntungan/Kerugian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{formatRupiah(totalGainLoss)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Persentase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold flex items-center gap-2 ${gainLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {gainLossPercentage >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              {gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment List */}
      <div className="grid gap-4 md:grid-cols-2">
        {investments?.map((investment) => {
          const currentValue = (investment.current_price || 0) * (investment.quantity || 0);
          const costValue = (investment.buy_price || 0) * (investment.quantity || 0);
          const gainLoss = currentValue - costValue;
          const gainLossPercent = costValue > 0 ? ((gainLoss / costValue) * 100) : 0;

          return (
            <Card key={investment.id} className="bg-card border-border hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{investment.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{investment.symbol}</Badge>
                      <Badge variant="secondary">{investment.type}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Sektor</p>
                    <p className="font-medium">{investment.sector}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Kuantitas</p>
                      <p className="font-medium">{investment.quantity?.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Platform</p>
                      <p className="font-medium">{investment.platform}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Harga Beli</p>
                      <p className="font-medium">{formatRupiah(investment.buy_price || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Harga Sekarang</p>
                      <p className="font-medium">{formatRupiah(investment.current_price || 0)}</p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Nilai Sekarang</p>
                        <p className="text-lg font-bold">{formatRupiah(currentValue)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {gainLoss >= 0 ? '+' : ''}{formatRupiah(gainLoss)}
                        </p>
                        <p className={`text-sm ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {gainLoss >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
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
