
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";

// Mock data - replace with Supabase data
const mockInvestments = [
  {
    id: "1",
    platform: "E*TRADE",
    type: "Stock",
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    quantity: 50,
    buyPrice: 150.25,
    currentPrice: 182.50,
    currency: "USD",
  },
  {
    id: "2",
    platform: "Vanguard",
    type: "ETF",
    symbol: "VTI",
    name: "Vanguard Total Stock Market ETF",
    sector: "Diversified",
    quantity: 100,
    buyPrice: 220.80,
    currentPrice: 235.60,
    currency: "USD",
  },
  {
    id: "3",
    platform: "Fidelity",
    type: "Mutual Fund",
    symbol: "FXNAX",
    name: "Fidelity U.S. Bond Index Fund",
    sector: "Fixed Income",
    quantity: 200,
    buyPrice: 11.25,
    currentPrice: 10.95,
    currency: "USD",
  },
];

const Investments = () => {
  const calculateGainLoss = (quantity: number, buyPrice: number, currentPrice: number) => {
    const totalBuy = quantity * buyPrice;
    const totalCurrent = quantity * currentPrice;
    const gainLoss = totalCurrent - totalBuy;
    const percentage = (gainLoss / totalBuy) * 100;
    
    return {
      amount: gainLoss,
      percentage,
      isGain: gainLoss >= 0
    };
  };

  const totalValue = mockInvestments.reduce((sum, inv) => sum + (inv.quantity * inv.currentPrice), 0);
  const totalCost = mockInvestments.reduce((sum, inv) => sum + (inv.quantity * inv.buyPrice), 0);
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercentage = (totalGainLoss / totalCost) * 100;

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
                {mockInvestments.map((investment) => {
                  const gainLoss = calculateGainLoss(investment.quantity, investment.buyPrice, investment.currentPrice);
                  const marketValue = investment.quantity * investment.currentPrice;
                  
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
                      <td className="py-3 px-4 text-right text-sm">${investment.buyPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-sm font-medium">${investment.currentPrice.toFixed(2)}</td>
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
