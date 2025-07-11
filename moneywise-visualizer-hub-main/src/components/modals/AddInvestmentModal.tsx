
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

export const AddInvestmentModal = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    type: "",
    platform: "",
    sector: "",
    quantity: "",
    buy_price: "",
    current_price: "",
    currency: "USD"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("investments")
        .insert({
          symbol: formData.symbol,
          name: formData.name,
          type: formData.type,
          platform: formData.platform,
          sector: formData.sector,
          quantity: parseFloat(formData.quantity),
          buy_price: parseFloat(formData.buy_price),
          current_price: parseFloat(formData.current_price),
          currency: formData.currency
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investment added successfully",
      });

      setFormData({
        symbol: "",
        name: "",
        type: "",
        platform: "",
        sector: "",
        quantity: "",
        buy_price: "",
        current_price: "",
        currency: "USD"
      });

      queryClient.invalidateQueries({ queryKey: ["investments"] });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add investment",
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
          Add Investment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Investment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={formData.symbol}
              onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
              placeholder="AAPL, GOOGL, etc."
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Apple Inc., Google, etc."
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Stock">Stock</SelectItem>
                <SelectItem value="Bond">Bond</SelectItem>
                <SelectItem value="ETF">ETF</SelectItem>
                <SelectItem value="Mutual Fund">Mutual Fund</SelectItem>
                <SelectItem value="Crypto">Cryptocurrency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="platform">Platform</Label>
            <Input
              id="platform"
              value={formData.platform}
              onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
              placeholder="Broker platform"
            />
          </div>

          <div>
            <Label htmlFor="sector">Sector</Label>
            <Input
              id="sector"
              value={formData.sector}
              onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
              placeholder="Technology, Healthcare, etc."
            />
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="0.01"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="buy_price">Buy Price</Label>
            <Input
              id="buy_price"
              type="number"
              step="0.01"
              value={formData.buy_price}
              onChange={(e) => setFormData(prev => ({ ...prev, buy_price: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="current_price">Current Price</Label>
            <Input
              id="current_price"
              type="number"
              step="0.01"
              value={formData.current_price}
              onChange={(e) => setFormData(prev => ({ ...prev, current_price: e.target.value }))}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Investment"}
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
