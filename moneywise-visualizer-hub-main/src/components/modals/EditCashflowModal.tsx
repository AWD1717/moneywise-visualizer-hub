
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditCashflowModalProps {
  cashflow: any;
}

export const EditCashflowModal = ({ cashflow }: EditCashflowModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: cashflow.date,
    description: cashflow.description || "",
    credit: cashflow.credit || 0,
    debit: cashflow.debit || 0,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("cashflows")
        .update(data)
        .eq("id", cashflow.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashflows"] });
      toast({
        title: "Berhasil",
        description: "Cashflow berhasil diperbarui",
      });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal memperbarui cashflow",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Cashflow</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Masukkan deskripsi..."
            />
          </div>
          <div>
            <Label htmlFor="credit">Kredit</Label>
            <Input
              id="credit"
              type="number"
              value={formData.credit}
              onChange={(e) => setFormData({ ...formData, credit: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="debit">Debit</Label>
            <Input
              id="debit"
              type="number"
              value={formData.debit}
              onChange={(e) => setFormData({ ...formData, debit: Number(e.target.value) })}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={editMutation.isPending} className="flex-1">
              {editMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
