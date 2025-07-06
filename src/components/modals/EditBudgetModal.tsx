
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditBudgetModalProps {
  budget: any;
}

export const EditBudgetModal = ({ budget }: EditBudgetModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    expected_amount: budget.expected_amount,
    allocated_amount: budget.allocated_amount || 0,
    month: budget.month,
    year: budget.year,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("budgets")
        .update(data)
        .eq("id", budget.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast({
        title: "Berhasil",
        description: "Budget berhasil diperbarui",
      });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal memperbarui budget",
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
          <DialogTitle>Edit Budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="expected_amount">Expected Amount</Label>
            <Input
              id="expected_amount"
              type="number"
              value={formData.expected_amount}
              onChange={(e) => setFormData({ ...formData, expected_amount: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="allocated_amount">Allocated Amount</Label>
            <Input
              id="allocated_amount"
              type="number"
              value={formData.allocated_amount}
              onChange={(e) => setFormData({ ...formData, allocated_amount: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="month">Bulan</Label>
            <Input
              id="month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="year">Tahun</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              required
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
