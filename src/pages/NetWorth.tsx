
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

// Mock data - replace with Supabase data
const mockNetWorthHistory = [
  {
    id: "1",
    calculatedAt: "2023-07-01",
    totalAssets: 45000,
    totalLiabilities: 12000,
    netWorth: 33000,
  },
  {
    id: "2",
    calculatedAt: "2023-08-01",
    totalAssets: 47500,
    totalLiabilities: 11500,
    netWorth: 36000,
  },
  {
    id: "3",
    calculatedAt: "2023-09-01",
    totalAssets: 46800,
    totalLiabilities: 11000,
    netWorth: 35800,
  },
  {
    id: "4",
    calculatedAt: "2023-10-01",
    totalAssets: 48200,
    totalLiabilities: 10500,
    netWorth: 37700,
  },
  {
    id: "5",
    calculatedAt: "2023-11-01",
    totalAssets: 50100,
    totalLiabilities: 10000,
    netWorth: 40100,
  },
  {
    id: "6",
    calculatedAt: "2023-12-01",
    totalAssets: 52300,
    totalLiabilities: 9500,
    netWorth: 42800,
  },
  {
    id: "7",
    calculatedAt: "2024-01-01",
    totalAssets: 54500,
    totalLiabilities: 9000,
    netWorth: 45500,
  },
];

const NetWorth = () => {
  const currentNetWorth = mockNetWorthHistory[mockNetWorthHistory.length - 1];
  const previousNetWorth = mockNetWorthHistory[mockNetWorthHistory.length - 2];
  
  const monthlyChange = currentNetWorth.netWorth - previousNetWorth.netWorth;
  const monthlyChangePercentage = (monthlyChange / previousNetWorth.netWorth) * 100;
  const isPositiveChange = monthlyChange >= 0;

  // Calculate year-over-year change
  const yearAgoNetWorth = mockNetWorthHistory.find(
    record => new Date(record.calculatedAt).getFullYear() === new Date(currentNetWorth.calculatedAt).getFullYear() - 1
  );
  
  const yearlyChange = yearAgoNetWorth ? currentNetWorth.netWorth - yearAgoNetWorth.netWorth : 0;
  const yearlyChangePercentage = yearAgoNetWorth ? (yearlyChange / yearAgoNetWorth.netWorth) * 100 : 0;

  const chartData = mockNetWorthHistory.map(record => ({
    ...record,
    month: new Date(record.calculatedAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Net Worth</h2>
        <div className="text-sm text-muted-foreground">
          Last calculated: {new Date(currentNetWorth.calculatedAt).toLocaleDateString()}
        </div>
      </div>

      {/* Net Worth Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${currentNetWorth.netWorth.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">${currentNetWorth.totalAssets.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">${currentNetWorth.totalLiabilities.toLocaleString()}</div>
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
                  name === 'netWorth' ? 'Net Worth' :
                  name === 'totalAssets' ? 'Total Assets' :
                  name === 'totalLiabilities' ? 'Total Liabilities' : name
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="netWorth" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="totalAssets" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="totalLiabilities" 
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
                {mockNetWorthHistory
                  .slice()
                  .reverse()
                  .map((record, index) => {
                    const previousRecord = mockNetWorthHistory[mockNetWorthHistory.length - index - 2];
                    const change = previousRecord ? record.netWorth - previousRecord.netWorth : 0;
                    const changePercentage = previousRecord ? (change / previousRecord.netWorth) * 100 : 0;
                    
                    return (
                      <tr key={record.id} className="border-b border-border/50 hover:bg-accent/50">
                        <td className="py-3 px-4 text-sm">
                          {new Date(record.calculatedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-medium text-green-500">
                          ${record.totalAssets.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-medium text-red-500">
                          ${record.totalLiabilities.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-bold text-primary">
                          ${record.netWorth.toLocaleString()}
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
