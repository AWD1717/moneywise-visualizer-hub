
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditInvestmentModalProps {
  investment: any;
}

export const EditInvestmentModal = ({ investment }: EditInvestmentModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: investment.name || "",
    symbol: investment.symbol || "",
    type: investment.type || "",
    sector: investment.sector || "",
    platform: investment.platform || "",
    buy_price: investment.buy_price || 0,
    current_price: investment.current_price || 0,
    quantity: investment.quantity || 0,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const editMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from("investments")
        .update(data)
        .eq("id", investment.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["investments"] });
      toast({
        title: "Berhasil",
        description: "Investasi berhasil diperbarui",
      });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal memperbarui investasi",
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
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Investasi</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="type">Tipe</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="sector">Sektor</Label>
            <Input
              id="sector"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Input
              id="platform"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="buy_price">Harga Beli</Label>
            <Input
              id="buy_price"
              type="number"
              value={formData.buy_price}
              onChange={(e) => setFormData({ ...formData, buy_price: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="current_price">Harga Sekarang</Label>
            <Input
              id="current_price"
              type="number"
              value={formData.current_price}
              onChange={(e) => setFormData({ ...formData, current_price: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="quantity">Kuantitas</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
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
