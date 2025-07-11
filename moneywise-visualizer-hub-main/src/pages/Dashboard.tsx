
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AIRecommendation } from "@/components/AIRecommendation";
import { formatRupiah } from "@/utils/currency";

// Mock data - replace with real Supabase data
const mockCashflowData = [
  { month: "Jan", income: 5000000, expense: 3500000 },
  { month: "Feb", income: 5200000, expense: 3800000 },
  { month: "Mar", income: 4800000, expense: 3200000 },
  { month: "Apr", income: 5500000, expense: 4100000 },
  { month: "May", income: 5300000, expense: 3900000 },
  { month: "Jun", income: 5700000, expense: 4200000 },
];

const mockExpenseCategories = [
  { name: "Makanan & Minum", value: 1200000, color: "#3B82F6" },
  { name: "Transportasi", value: 800000, color: "#10B981" },
  { name: "Belanja", value: 600000, color: "#F59E0B" },
  { name: "Hiburan", value: 400000, color: "#EF4444" },
  { name: "Tagihan & Utilitas", value: 500000, color: "#8B5CF6" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="text-sm text-muted-foreground">
          Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Saldo</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatRupiah(45231890)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+20.1%</span> dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Investasi</CardTitle>
            <PiggyBank className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{formatRupiah(12234000)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12.5%</span> keuntungan portofolio
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hutang</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatRupiah(8432000)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">-5.2%</span> dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kekayaan Bersih</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatRupiah(49033890)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+15.3%</span> dari bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and AI Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Tren Arus Kas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockCashflowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                    formatter={(value: number) => [formatRupiah(value), value === mockCashflowData[0]?.income ? 'Pemasukan' : 'Pengeluaran']}
                  />
                  <Line type="monotone" dataKey="income" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Kategori Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockExpenseCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockExpenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                    formatter={(value: number) => [formatRupiah(value), "Jumlah"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {mockExpenseCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                      <span className="text-muted-foreground">{category.name}</span>
                    </div>
                    <span className="font-medium">{formatRupiah(category.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <AIRecommendation />
      </div>
    </div>
  );
};

export default Dashboard;
