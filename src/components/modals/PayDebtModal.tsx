
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatRupiah } from "@/utils/currency";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PayDebtModalProps {
  debt: any;
}

export const PayDebtModal = ({ debt }: PayDebtModalProps) => {
  const [open, setOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(debt.minimum_payment || 0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const payMutation = useMutation({
    mutationFn: async (amount: number) => {
      const newBalance = (debt.balance || 0) - amount;
      const { error } = await supabase
        .from("debts")
        .update({ balance: newBalance })
        .eq("id", debt.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      toast({
        title: "Berhasil",
        description: "Pembayaran hutang berhasil dicatat",
      });
      setOpen(false);
      setPaymentAmount(debt.minimum_payment || 0);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal mencatat pembayaran",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount > 0 && paymentAmount <= (debt.balance || 0)) {
      payMutation.mutate(paymentAmount);
    } else {
      toast({
        title: "Error",
        description: "Jumlah pembayaran tidak valid",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          Bayar Sekarang
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bayar Hutang - {debt.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Saldo Hutang:</span>
              <span className="font-medium text-red-500">{formatRupiah(debt.balance || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pembayaran Minimum:</span>
              <span className="font-medium">{formatRupiah(debt.minimum_payment || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bunga:</span>
              <span className="font-medium">{debt.interest_rate}% per tahun</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="payment">Jumlah Pembayaran</Label>
              <Input
                id="payment"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                max={debt.balance || 0}
                min={0}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maksimal: {formatRupiah(debt.balance || 0)}
              </p>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={payMutation.isPending} className="flex-1">
                {payMutation.isPending ? "Memproses..." : "Bayar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
