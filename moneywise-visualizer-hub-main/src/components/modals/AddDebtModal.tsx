
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

export const AddDebtModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    interest_rate: "",
    minimum_payment: "",
    due_date: "",
    strategy: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("debts")
        .insert({
          name: formData.name,
          balance: parseFloat(formData.balance),
          interest_rate: parseFloat(formData.interest_rate),
          minimum_payment: parseFloat(formData.minimum_payment),
          due_date: formData.due_date || null,
          strategy: formData.strategy,
          notes: formData.notes
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Debt added successfully",
      });

      setFormData({
        name: "",
        balance: "",
        interest_rate: "",
        minimum_payment: "",
        due_date: "",
        strategy: "",
        notes: ""
      });

      queryClient.invalidateQueries({ queryKey: ["debts"] });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add debt",
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
          Add Debt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Debt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Debt Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Credit Card, Loan, etc."
              required
            />
          </div>

          <div>
            <Label htmlFor="balance">Balance</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              value={formData.balance}
              onChange={(e) => setFormData(prev => ({ ...prev, balance: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="interest_rate">Interest Rate (%)</Label>
            <Input
              id="interest_rate"
              type="number"
              step="0.01"
              value={formData.interest_rate}
              onChange={(e) => setFormData(prev => ({ ...prev, interest_rate: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="minimum_payment">Minimum Payment</Label>
            <Input
              id="minimum_payment"
              type="number"
              step="0.01"
              value={formData.minimum_payment}
              onChange={(e) => setFormData(prev => ({ ...prev, minimum_payment: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="strategy">Strategy</Label>
            <Select value={formData.strategy} onValueChange={(value) => setFormData(prev => ({ ...prev, strategy: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avalanche">Avalanche</SelectItem>
                <SelectItem value="snowball">Snowball</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Debt"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
