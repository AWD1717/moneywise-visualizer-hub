
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useNetWorth } from "@/hooks/useNetWorth";
import { MobileCardView } from "@/components/MobileCardView";
import { formatRupiah } from "@/utils/currency";

const NetWorth = () => {
  const { data: netWorthHistory, isLoading } = useNetWorth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
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
      month: new Date(record.calculated_at).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Kekayaan Bersih</h2>
        <div className="text-sm text-muted-foreground">
          Terakhir dihitung: {new Date(currentNetWorth.calculated_at).toLocaleDateString('id-ID')}
        </div>
      </div>

      {/* Net Worth Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kekayaan Bersih Saat Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatRupiah(currentNetWorth.net_worth)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Aset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatRupiah(currentNetWorth.total_assets)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Kewajiban</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatRupiah(currentNetWorth.total_liabilities)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Perubahan Bulanan</CardTitle>
            {isPositiveChange ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
              {isPositiveChange ? '+' : ''}{formatRupiah(monthlyChange)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className={isPositiveChange ? 'text-green-500' : 'text-red-500'}>
                {isPositiveChange ? '+' : ''}{monthlyChangePercentage.toFixed(2)}%
              </span> dari bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Net Worth Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Tren Kekayaan Bersih</CardTitle>
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
                  formatRupiah(value),
                  name === 'net_worth' ? 'Kekayaan Bersih' :
                  name === 'total_assets' ? 'Total Aset' :
                  name === 'total_liabilities' ? 'Total Kewajiban' : name
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
          <CardTitle>Data Historis</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile View */}
          <MobileCardView data={netWorthHistory} type="networth" />

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tanggal</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Aset</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total Kewajiban</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Kekayaan Bersih</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Perubahan</th>
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
                        {new Date(record.calculated_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-medium text-green-500">
                        {formatRupiah(record.total_assets)}
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-medium text-red-500">
                        {formatRupiah(record.total_liabilities)}
                      </td>
                      <td className="py-3 px-4 text-right text-sm font-bold text-primary">
                        {formatRupiah(record.net_worth)}
                      </td>
                      <td className="py-3 px-4 text-right text-sm">
                        {previousRecord ? (
                          <div className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
                            <div className="font-medium">
                              {change >= 0 ? '+' : ''}{formatRupiah(change)}
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
