
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, PiggyBank, Building } from "lucide-react";

// Mock data - replace with Supabase data
const mockAccounts = [
  {
    id: "1",
    name: "Main Checking",
    type: "Checking",
    balance: 12500,
    currency: "USD",
  },
  {
    id: "2",
    name: "Emergency Savings",
    type: "Savings",
    balance: 25000,
    currency: "USD",
  },
  {
    id: "3",
    name: "Investment Portfolio",
    type: "Investment",
    balance: 48500,
    currency: "USD",
  },
  {
    id: "4",
    name: "Credit Card",
    type: "Credit",
    balance: -2300,
    currency: "USD",
  },
];

const Accounts = () => {
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

  const totalAssets = mockAccounts
    .filter(account => account.balance > 0)
    .reduce((sum, account) => sum + account.balance, 0);

  const totalLiabilities = mockAccounts
    .filter(account => account.balance < 0)
    .reduce((sum, account) => sum + Math.abs(account.balance), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Account Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">${totalAssets.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">${totalLiabilities.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Worth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${(totalAssets - totalLiabilities).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts List */}
      <div className="grid gap-4 md:grid-cols-2">
        {mockAccounts.map((account) => {
          const AccountIcon = getAccountIcon(account.type);
          
          return (
            <Card key={account.id} className="bg-card border-border hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <AccountIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                      <Badge className={getAccountTypeColor(account.type)}>
                        {account.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                    <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-primary' : 'text-red-500'}`}>
                      {account.balance >= 0 ? '+' : '-'}${Math.abs(account.balance).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{account.currency}</p>
                    <Button variant="outline" size="sm">
                      View Details
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
