
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/utils/currency";
import { Calendar, Percent, DollarSign, AlertTriangle } from "lucide-react";

interface DebtDetailModalProps {
  debt: any;
}

export const DebtDetailModal = ({ debt }: DebtDetailModalProps) => {
  const [open, setOpen] = useState(false);

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = debt.due_date ? getDaysUntilDue(debt.due_date) : null;
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
  const isDueSoon = daysUntilDue !== null && daysUntilDue <= 7 && daysUntilDue >= 0;

  const monthlyInterest = ((debt.balance || 0) * (debt.interest_rate || 0) / 100) / 12;
  const payoffMonths = debt.minimum_payment > 0 ? Math.ceil((debt.balance || 0) / (debt.minimum_payment || 1)) : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Detail
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-red-500" />
            Detail Hutang - {debt.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex gap-2">
            {debt.strategy && (
              <Badge variant="outline">{debt.strategy}</Badge>
            )}
            {isOverdue && (
              <Badge variant="destructive">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Terlambat
              </Badge>
            )}
            {isDueSoon && !isOverdue && (
              <Badge variant="secondary">
                <Calendar className="w-3 h-3 mr-1" />
                Jatuh Tempo Segera
              </Badge>
            )}
          </div>

          {/* Balance Info */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Saldo Hutang</p>
              <p className="text-3xl font-bold text-red-500">
                {formatRupiah(debt.balance || 0)}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Percent className="w-4 h-4" />
                  Bunga per Tahun
                </div>
                <p className="font-medium">{debt.interest_rate}%</p>
              </div>
              
              <div>
                <p className="text-muted-foreground text-sm mb-1">Bunga per Bulan</p>
                <p className="font-medium text-orange-500">{formatRupiah(monthlyInterest)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Pembayaran Minimum</p>
                <p className="font-medium">{formatRupiah(debt.minimum_payment || 0)}</p>
              </div>
              
              <div>
                <p className="text-muted-foreground text-sm mb-1">Estimasi Lunas</p>
                <p className="font-medium">{payoffMonths} bulan</p>
              </div>
            </div>
          </div>

          {/* Due Date */}
          {debt.due_date && (
            <div className="border border-border p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Jatuh Tempo</p>
                  <p className="font-medium">
                    {new Date(debt.due_date).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="text-right">
                  {daysUntilDue !== null && (
                    <span className={`text-sm font-medium ${
                      isOverdue ? 'text-red-500' : isDueSoon ? 'text-orange-500' : 'text-muted-foreground'
                    }`}>
                      {daysUntilDue > 0 ? `${daysUntilDue} hari lagi` : 
                       daysUntilDue === 0 ? 'Hari ini' : 
                       `${Math.abs(daysUntilDue)} hari terlambat`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {debt.notes && (
            <div>
              <p className="text-muted-foreground text-sm mb-2">Catatan</p>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm">{debt.notes}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
