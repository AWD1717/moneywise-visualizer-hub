
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

export const WebhookSettingsModal = () => {
  const [open, setOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(localStorage.getItem("webhook_url") || "");
  const { toast } = useToast();

  const handleSave = () => {
    localStorage.setItem("webhook_url", webhookUrl);
    toast({
      title: "Berhasil",
      description: "Pengaturan webhook berhasil disimpan",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Webhook Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pengaturan Webhook SuperChat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="webhook_url">Webhook URL</Label>
            <Input
              id="webhook_url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-webhook-url.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Masukkan URL webhook untuk integrasi SuperChat
            </p>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} className="flex-1">
              Simpan
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
