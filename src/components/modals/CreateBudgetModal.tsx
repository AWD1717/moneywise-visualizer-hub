
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export const CreateBudgetModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data;
    },
  });

  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    month: "",
    category_id: "",
    expected_amount: "",
    allocated_amount: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("budgets")
        .insert({
          year: parseInt(formData.year),
          month: formData.month,
          category_id: formData.category_id || null,
          expected_amount: parseFloat(formData.expected_amount),
          allocated_amount: parseFloat(formData.allocated_amount),
        });

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Budget berhasil dibuat",
      });

      setFormData({
        year: new Date().getFullYear().toString(),
        month: "",
        category_id: "",
        expected_amount: "",
        allocated_amount: "",
      });

      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat budget",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buat Budget Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="year">Tahun</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
              min="2020"
              max="2030"
              required
            />
          </div>

          <div>
            <Label htmlFor="month">Bulan</Label>
            <Select value={formData.month} onValueChange={(value) => setFormData(prev => ({ ...prev, month: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih bulan" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Kategori</Label>
            <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expected_amount">Expected Amount (Rp)</Label>
            <Input
              id="expected_amount"
              type="number"
              step="1000"
              value={formData.expected_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, expected_amount: e.target.value }))}
              placeholder="0"
              required
            />
          </div>

          <div>
            <Label htmlFor="allocated_amount">Allocated Amount (Rp)</Label>
            <Input
              id="allocated_amount"
              type="number"
              step="1000"
              value={formData.allocated_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, allocated_amount: e.target.value }))}
              placeholder="0"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Membuat..." : "Buat Budget"}
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
