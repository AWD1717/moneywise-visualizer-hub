
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useNetWorth } from "@/hooks/useNetWorth";

const NetWorth = () => {
  const { data: netWorthHistory, isLoading } = useNetWorth();

  if (isLoading) {
    return <div>Loading net worth data...</div>;
  }

  if (!netWorthHistory || netWorthHistory.length === 0) {
    return <div>No net worth data available</div>;
  }

  const currentNetWorth = netWorthHistory[0];
  const previousNetWorth = netWorthHistory[1];
  
  const monthlyChange = previousNetWorth ? currentNetWorth.net_worth - previousNetWorth.net_worth : 0;
  const monthlyChangePercentage = previousNetWorth && previousNetWorth.net_worth > 0 ? (monthlyChange / previousNetWorth.net_worth) * 100 : 0;
  const isPositiveChange = monthlyChange >= 0;

  const chartData = netWorthHistory
    .slice()
    .reverse()
    .map(record => ({
      ...record,
      month: new Date(record.calculated_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Net Worth</h2>
        <div className="text-sm text-muted-foreground">
          Last calculated: {new Date(currentNetWorth.calculated_at).toLocaleDateString()}
        </div>
      </div>

      {/* Net Worth Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${currentNetWorth.net_worth.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">${currentNetWorth.total_assets.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">${currentNetWorth.total_liabilities.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Change</CardTitle>
            {isPositiveChange ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
              {isPositiveChange ? '+' : ''}${monthlyChange.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={isPositiveChange ? 'text-green-500' : 'text-red-500'}>
                {isPositiveChange ? '+' : ''}{monthlyChangePercentage.toFixed(2)}%
              </span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Net Worth Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Net Worth Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px"
                }}
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString()}`,
                  name === 'net_worth' ? 'Net Worth' :
                  name === 'total_assets' ? 'Total Assets' :
                  name === 'total_liabilities' ? 'Total Liabilities' : name
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="net_worth" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="total_assets" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="total_liabilities" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Net Worth History Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Historical Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Assets</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Liabilities</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Net Worth</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Change</th>
                </tr>
              </thead>
              <tbody>
                {netWorthHistory.map((record, index) => {
                  const previousRecord = netWorthHistory[index + 1];
                  const change = previousRecord ? record.net_worth - previousRecord.net_worth : 0;
                  const changePercentage = previousRecord && previousRecord.net_worth > 0 ? (change / previousRecord.net_worth) * 100 : 0;
                  
                  return (
                    <tr key={record.id} className="border-b border-border/50 hover:bg-accent/50">
                      <td className="py-3 px-4 text-sm">
                        {new Date(record.calculated_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-medium text-green-500">
                        ${record.total_assets.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-medium text-red-500">
                        ${record.total_liabilities.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-bold text-primary">
                        ${record.net_worth.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-sm">
                        {previousRecord ? (
                          <div className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
                            <div className="font-medium">
                              {change >= 0 ? '+' : ''}${change.toLocaleString()}
                            </div>
                            <div className="text-xs">
                              {change >= 0 ? '+' : ''}{changePercentage.toFixed(2)}%
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
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

export default NetWorth;
