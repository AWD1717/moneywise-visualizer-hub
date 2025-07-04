
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useInvestments } from "@/hooks/useInvestments";

const Investments = () => {
  const { data: investments, isLoading } = useInvestments();

  if (isLoading) {
    return <div>Loading investments...</div>;
  }

  const calculateGainLoss = (quantity: number, buyPrice: number, currentPrice: number) => {
    const totalBuy = quantity * buyPrice;
    const totalCurrent = quantity * currentPrice;
    const gainLoss = totalCurrent - totalBuy;
    const percentage = totalBuy > 0 ? (gainLoss / totalBuy) * 100 : 0;
    
    return {
      amount: gainLoss,
      percentage,
      isGain: gainLoss >= 0
    };
  };

  const totalValue = investments?.reduce((sum, inv) => sum + ((inv.quantity || 0) * (inv.current_price || 0)), 0) || 0;
  const totalCost = investments?.reduce((sum, inv) => sum + ((inv.quantity || 0) * (inv.buy_price || 0)), 0) || 0;
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Investments</h2>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Investment
        </Button>
      </div>

      {/* Investment Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Gain/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold flex items-center gap-1 ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalGainLoss >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              ${Math.abs(totalGainLoss).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Return</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercentage.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investments List */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Portfolio Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Symbol</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Quantity</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Buy Price</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Current Price</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Market Value</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Gain/Loss</th>
                </tr>
              </thead>
              <tbody>
                {investments?.map((investment) => {
                  const gainLoss = calculateGainLoss(investment.quantity || 0, investment.buy_price || 0, investment.current_price || 0);
                  const marketValue = (investment.quantity || 0) * (investment.current_price || 0);
                  
                  return (
                    <tr key={investment.id} className="border-b border-border/50 hover:bg-accent/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{investment.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            {investment.platform}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-sm">{investment.name}</div>
                          <div className="text-xs text-muted-foreground">{investment.sector}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{investment.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-sm">{investment.quantity}</td>
                      <td className="py-3 px-4 text-right text-sm">${(investment.buy_price || 0).toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-sm font-medium">${(investment.current_price || 0).toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-sm font-medium">${marketValue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <div className={`text-sm font-medium ${gainLoss.isGain ? 'text-green-500' : 'text-red-500'}`}>
                          {gainLoss.isGain ? '+' : ''}${gainLoss.amount.toFixed(2)}
                        </div>
                        <div className={`text-xs ${gainLoss.isGain ? 'text-green-500' : 'text-red-500'}`}>
                          {gainLoss.isGain ? '+' : ''}{gainLoss.percentage.toFixed(2)}%
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Investments;
