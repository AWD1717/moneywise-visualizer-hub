
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatRupiah } from "@/utils/currency";

interface AccountDetailModalProps {
  account: any;
}

export const AccountDetailModal = ({ account }: AccountDetailModalProps) => {
  const [open, setOpen] = useState(false);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["account-transactions", account.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cashflows")
        .select(`
          *,
          categories (name),
          types (name)
        `)
        .eq("account_id", account.accounts?.id)
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: open,
  });

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "income":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "expense":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "transfer":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Lihat Detail
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Transaksi - {account.accounts?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Nama Akun</p>
                <p className="font-medium">{account.accounts?.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tipe</p>
                <p className="font-medium">{account.accounts?.type}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Saldo</p>
                <p className={`font-bold ${account.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatRupiah(account.balance)}
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-medium">Riwayat Transaksi</h3>
              {transactions && transactions.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="border border-border rounded-lg p-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString('id-ID')}
                            </span>
                            <Badge className={getTypeColor(transaction.types?.name || "")}>
                              {transaction.types?.name}
                            </Badge>
                          </div>
                          <p className="font-medium text-sm">{transaction.description || 'No description'}</p>
                          <p className="text-xs text-muted-foreground">{transaction.categories?.name}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            (transaction.credit || 0) > 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {(transaction.credit || 0) > 0 ? '+' : '-'}
                            {formatRupiah(Math.abs(transaction.credit || transaction.debit || 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Tidak ada transaksi untuk akun ini
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
