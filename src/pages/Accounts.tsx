
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, PiggyBank, Building } from "lucide-react";
import { useLiquidAssets } from "@/hooks/useLiquidAssets";
import { AddAccountModal } from "@/components/modals/AddAccountModal";

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp');
};

const Accounts = () => {
  const { data: accounts, isLoading } = useLiquidAssets();

  const getAccountIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "checking":
      case "savings":
        return PiggyBank;
      case "credit":
        return CreditCard;
      case "investment":
        return Building;
      default:
        return CreditCard;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "checking":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "savings":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "investment":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "credit":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalAssets = accounts?.filter(account => account.balance > 0)
    .reduce((sum, account) => sum + account.balance, 0) || 0;

  const totalLiabilities = accounts?.filter(account => account.balance < 0)
    .reduce((sum, account) => sum + Math.abs(account.balance), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Akun</h2>
        <AddAccountModal />
      </div>

      {/* Account Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Aset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatRupiah(totalAssets)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Kewajiban</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatRupiah(totalLiabilities)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Kekayaan Bersih</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatRupiah(totalAssets - totalLiabilities)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts List */}
      <div className="grid gap-4 md:grid-cols-2">
        {accounts?.map((account) => {
          const AccountIcon = getAccountIcon(account.accounts?.type || "");
          
          return (
            <Card key={account.id} className="bg-card border-border hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <AccountIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{account.accounts?.name}</CardTitle>
                      <Badge className={getAccountTypeColor(account.accounts?.type || "")}>
                        {account.accounts?.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Saldo Saat Ini</p>
                    <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-primary' : 'text-red-500'}`}>
                      {account.balance >= 0 ? '+' : '-'}{formatRupiah(Math.abs(account.balance))}
                    </p>
                  </div>
                  <div className="text-right">
                    <Button variant="outline" size="sm">
                      Lihat Detail
                    </Button>
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

export default Accounts;
